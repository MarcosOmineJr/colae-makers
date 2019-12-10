import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    ScrollView,
    Modal
} from 'react-native';
import {
    Textarea,
    Button,
    Icon
} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import { NavigationEvents } from 'react-navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { connect } from 'react-redux';
import ColaeAPI from '../api';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/storage';

const { ColUI } = ColaeAPI;

const { width, height } = Dimensions.get('screen');

const GridWidth = (colSpan)=>((width*0.1027)*colSpan)+((width*0.055)*(colSpan-1));

//================================================================================================

class ProcessDraft extends React.Component {

    constructor(props){
        super(props);
        this._isDraftCreated = this._isDraftCreated.bind(this);
    }

    componentDidMount(){
        this._isDraftCreated();
    }

    _isDraftCreated(){
        if(this.props.tempDraft == null){
            this.props.navigation.navigate('CreateTempDraft');
        } else {
            this.props.navigation.navigate('DraftProgress', { mode: 'temp' });
        }
    }

    render(){
        return (
            <View style={ProcessDraftStyles.container}>
                <ActivityIndicator size='large' color={this.props.ColUITheme.main} />
            </View>
        );
    }
}

const ProcessDraftStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

//================================================================================================

class DraftProgress extends React.Component {
    constructor(props){
        super(props);
        this.state = {

            //Estado dos dados que serão carregados no step:
            stepsData: [
                {routename: 'EventType', fields: ['photos','categories','keywords'], description: 'Informações Básicas', done: true},
                {routename: 'EventDescription', fields: ['description'], description: 'Descrição do Evento', done: true},
                {routename: 'EventDate', fields: ['dates', 'location'], description: 'Local, data e horário', done: false},
                {routename: 'EventServices', fields:['producers'], description: 'Organizadores e Serviços', done: false},
                {routename: 'EventTickets', fields:['tickets'], description: 'Ingressos', done: false}
            ],
            draft: {},
            loading: true,
            done: [],
            eventRef: '',
            processing: false
        }

        this._publish = this._publish.bind(this);
        this._saveAsDraft = this._saveAsDraft.bind(this);
        this._renderSteps = this._renderSteps.bind(this);
        this._fetchFirebase = this._fetchFirebase.bind(this);
    }

    async _publish(){
        let s = this.state;
        const { user } = this.props;

        let youShallNotPass = false;

        //checa se todos os campos obrigatórios estão preenchidos:
        s.done.forEach(v=>{
            if(!v){
                youShallNotPass = true;
            }
        })

        if(youShallNotPass){
            Alert.alert('Esperaê!', 'Você deve preencher todos os campos acima para poder publicar o evento!');
        } else {
            s.processing = false;
            this.setState(s);

            //pega a referência documento do rascunho:
            let draft = firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(s.eventRef);
            let draftResponse = await draft.get(); //pega o conteúdo do documento
            let parsedDraftResponse = draftResponse.data(); //dá um parse no conteúdo do documento

            //Se tem coisas nele prossegue:
            if(parsedDraftResponse){
                //Cria um novo documento em events com id aleatório:
                let publishedEvent = firebase.firestore().collection('events').doc();

                //Coloca as informações do rascunho nesse novo documento:
                await firebase.firestore().collection('events').doc(publishedEvent.id).set({...parsedDraftResponse, published: true, publishedAt: firebase.firestore.FieldValue.serverTimestamp() });
                
                //coloca o evento no participatedin do criador do evento:
                let owner = firebase.firestore().collection('users').doc(user.firebaseRef);
                await owner.update({ participatedin: firebase.firestore.FieldValue.arrayUnion(publishedEvent.id) });

                //Para cada usuário em producers:
                parsedDraftResponse.producers.forEach(async (producer)=>{
                    //Vê em que collection esse usuário está (entre 'users' e 'services'):
                    let userRef = firebase.firestore().collection('services').doc(producer);
                    let user = await userRef.get();
                    if(!user.exists){
                        userRef = firebase.firestore().collection('users').doc(producer);
                    }

                    //Coloca no campo participatedin do usuário o evento criado na coleção 'events':
                    await userRef.update({ participatedin: firebase.firestore.FieldValue.arrayUnion(publishedEvent.id) });
                })
                //tem que apagar o outro agora:
                await draft.delete()

                s.processing = false;
                this.setState(s);
                this.props.navigation.navigate('Active');
            }
        }
    }

    async _fetchFirebase(){

        let s = this.state;
        const { user, tempDraft } = this.props;

        let response;

        s.done = [];

        if(this.props.navigation.getParam('draftId', 'NO-ID') == 'NO-ID'){
            console.log('entrou por tempDraft');
            //Se ele vier para essa tela sem um param draftID, ele conecta com o firestore pelo tempDraft;
            let event = firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(tempDraft.firestoreReferenceId)
            response = await event.get();
            response = response.data();
            console.log('resposta: ', response);

            if(response){
                if(response.photos){
                    if(response.photos[0] && response.categories && response.keywords){
                        s.done.push(true);
                    } else {
                        s.done.push(false);
                    }
                } else {
                    s.done.push(false);
                }
                if(response.description){
                    s.done.push(true);
                } else {
                    s.done.push(false);
                }
                if(response.location && response.dates){
                    s.done.push(true);
                } else {
                    s.done.push(false);
                }
                if(response.producers){
                    s.done.push(true);
                } else {
                    s.done.push(false);
                }
                if(response.tickets){
                    s.done.push(true);
                } else {
                    s.done.push(false);
                }
            }

            s.eventRef = tempDraft.firestoreReferenceId;
        } else {
            
            console.log('entrou por tempDraft');
            let event = firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(this.props.navigation.state.params.draftId);
            response = await event.get();
            response = response.data();
            console.log('resposta: ', response);

            if (response) {
                if(response.photos){
                    if(response.photos[0] && response.categories && response.keywords){
                        s.done.push(true);
                    } else {
                        s.done.push(false);
                    }
                } else {
                    s.done.push(false);
                }
                if(response.description){
                    s.done.push(true);
                } else {
                    s.done.push(false);
                }
                if(response.location && response.dates){
                    s.done.push(true);
                } else {
                    s.done.push(false);
                }
                if(response.producers){
                    s.done.push(true);
                } else {
                    s.done.push(false);
                }
                if(response.tickets){
                    s.done.push(true);
                } else {
                    s.done.push(false);
                }
            }

            s.eventRef = this.props.navigation.state.params.draftId;
        }

        s.loading = false;

        this.setState(s);
    }

    componentDidMount(){
        this._fetchFirebase();
    }

    _saveAsDraft(){

        //pega o ref do usuário:
        const { firebaseRef } = this.props.user;

        //Verifica se firestorereferenceId está definido e se estiver tira ele, depois, invariavelmente do if guarda tempDraft no banco;

        if(this.props.tempDraft != undefined){
            delete this.props.tempDraft.firestoreReferenceId;
        }
        firebase.firestore().collection('users').doc(firebaseRef).collection('events').doc(this.state.eventRef).set({...this.props.tempDraft}, { merge: true });
        this.props.navigation.navigate('Drafts');
    }

    _renderSteps(step, index, length){


        const { done, eventRef } = this.state;
        const { ColUITheme } = this.props;

        if(index == 0){
            return (
                <TouchableOpacity key={index} style={draftProgressStyles.stepContainer} onPress={()=>this.props.navigation.navigate(step.routename, { eventRef: eventRef })}>
                    <View style={draftProgressStyles.stepIndicatorContainer}>
                        <View style={draftProgressStyles.topConnectorContainer} />
                        <View style={[draftProgressStyles.circleContainer, {justifyContent: 'flex-end'}]}>
                            <View style={[draftProgressStyles.bar, {height: '50%'}, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                            <View style={[draftProgressStyles.circle, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                        <View style={draftProgressStyles.bottomConnectorContainer}>
                            <View style={[draftProgressStyles.connector, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                    </View>
                    <View style={draftProgressStyles.stepNameContainer}>
                        <Text style={[draftProgressStyles.stepName, done[index] ? { fontWeight: 'bold', color: ColUITheme.main } : { fontWeight: 'normal', color: ColUITheme.gray.light } ]}>{step.description}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if(index == (length-1)){
            return (
                <TouchableOpacity key={index} style={draftProgressStyles.stepContainer} onPress={()=>this.props.navigation.navigate(step.routename, { eventRef: eventRef })}>
                    <View style={draftProgressStyles.stepIndicatorContainer}>
                        <View style={draftProgressStyles.topConnectorContainer} >
                            <View style={[draftProgressStyles.connector, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                        <View style={[draftProgressStyles.circleContainer, {justifyContent: 'flex-start'}]}>
                            <View style={[draftProgressStyles.bar, {height: '50%'}, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                            <View style={[draftProgressStyles.circle, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                        <View style={draftProgressStyles.bottomConnectorContainer} />
                    </View>
                    <View style={draftProgressStyles.stepNameContainer}>
                    <Text style={[draftProgressStyles.stepName, done[index] ? { fontWeight: 'bold', color: ColUITheme.main } : { fontWeight: 'normal', color: ColUITheme.gray.light } ]}>{step.description}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity key={index} style={draftProgressStyles.stepContainer} onPress={()=>this.props.navigation.navigate(step.routename, { eventRef: eventRef })}>
                    <View style={draftProgressStyles.stepIndicatorContainer}>
                        <View style={draftProgressStyles.topConnectorContainer} >
                            <View style={[draftProgressStyles.connector, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                        <View style={draftProgressStyles.circleContainer}>
                            <View style={[draftProgressStyles.bar, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                            <View style={[draftProgressStyles.circle, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                        <View style={draftProgressStyles.bottomConnectorContainer} >
                            <View style={[draftProgressStyles.connector, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                    </View>
                    <View style={draftProgressStyles.stepNameContainer}>
                    <Text style={[draftProgressStyles.stepName, done[index] ? { fontWeight: 'bold', color: ColUITheme.main } : { fontWeight: 'normal', color: ColUITheme.gray.light } ]}>{step.description}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
    }

    render(){

        const { loading, stepsData, processing } = this.state;
        const { ColUITheme } = this.props;

        if(loading){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size='large' color={ColUITheme.main} />
                </View>
            )
        }
        return (
            <View style={draftProgressStyles.container}>
                <NavigationEvents onDidFocus={()=>{ let s = this.state; s.loading = true; this.setState(s); this._fetchFirebase();}} />
                <Modal animationType='fade' visible={processing} transparent={true}>
                    <View style={draftProgressStyles.modalContainer}>
                        <View style={[draftProgressStyles.modal, { backgroundColor: ColUITheme.background }]}>
                            <ActivityIndicator size='large' color={ColUITheme.main} />
                            <Text style={[draftProgressStyles.modalText, { color: ColUITheme.main }]}>Processando...</Text>
                        </View>
                    </View>
                </Modal>
                <View style={draftProgressStyles.textContainer}>
                    <Text style={[draftProgressStyles.text, { color: this.props.ColUITheme.main }]}>Preencha os dados para criar o evento</Text>
                </View>
                {stepsData.map((step, index)=>this._renderSteps(step, index, stepsData.length))}
                <View style={draftProgressStyles.buttonsContainer}>
                    <ColUI.Button blue label='salvar rascunho' onPress={()=>this._saveAsDraft()} />
                    <ColUI.Button label='publicar' onPress={()=>this._publish()} />
                </View>
            </View>
        );
    }
}

const draftProgressStyles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center'
    },
    textContainer:{
        height: 50,
        width,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    text:{
        fontSize: 18
    },
    buttonsContainer:{
        height: height*0.1,
        width,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    stepContainer:{
        flex: 1,
        flexDirection:'row'
    },
    stepIndicatorContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topConnectorContainer:{
        flex:2,
        alignItems: 'center'
    },
    connector:{
        backgroundColor: '#ccc',
        height: '100%',
        width: 3
    },
    bar:{
        backgroundColor: '#ccc',
        height: '100%',
        width: 3
    },
    circleContainer:{
        width: '100%',
        height: 20,
        alignItems: 'center',
    },
    circle:{
        position: 'absolute',
        backgroundColor: '#ccc',
        height: 15,
        width: 15,
        borderRadius: 7.5
    },
    bottomConnectorContainer:{
        flex:2,
        alignItems: 'center'
    },
    stepNameContainer:{
        flex: 3,
        justifyContent: 'center',
        paddingRight: 20
    },
    stepName:{
        fontSize: 18
    },
    modalContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modal:{
        height: height*0.3,
        width: width*0.8,
        elevation: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: 50
    },
    modalText:{
        fontSize: 30,
        marginTop: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

//===============================================================================================

class EventNameInput extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            disabled: true,
            name: ''
        }
        this._handleNameInput = this._handleNameInput.bind(this);
        this._confirm = this._confirm.bind(this);
    }

    _handleNameInput(name){
        let s = this.state;
        if(name != ''){
            s.disabled = false;
        } else {
            s.disabled = true;
        }
        s.name = name;
        this.setState(s);
    }

    async _confirm(){

        //Pegando a referência do usuário para o registro no Firebase:
        const { firebaseRef } = this.props.user;

        //Cria um draft no Firestore, pega o id gerado dele e o nome e coloca em tempDraft, depois redireciona para 'OpenDraft', que é o fluxo normal de rascunhos:
        let eventRef = firebase.firestore().collection('users').doc(firebaseRef).collection('events').doc(); //Cria novo documento no firestore
        eventRef.set({name: this.state.name, owner: firebaseRef, createdAt: firebase.firestore.FieldValue.serverTimestamp()}); //seta o nome dentro do documento

        //Seta o tempDraft == AVISO == setTempDraft() aparentemente é assíncrono
        await this.props.setTempDraft({name: this.state.name, firestoreReferenceId: eventRef.id, createdAt: firebase.firestore.FieldValue.serverTimestamp()});
        this.props.navigation.navigate('OpenDraft'); // == AVISO == retirar toda a lógica de {mode}
    }

    render(){
        return (
            <View style={EventNameInputStyles.container}>
                <View style={EventNameInputStyles.textsContainer}>
                    <Text style={EventNameInputStyles.title}>Escreva abaixo o nome do evento</Text>
                    <Text style={EventNameInputStyles.disclaimer}>Não se preocupe, você pode mudar isso depois</Text>
                </View>
                <View style={EventNameInputStyles.inputAndButtonContainer}>
                    <ColUI.TextInput label='Nome do evento' onChangeText={(name)=>this._handleNameInput(name)} />
                    <ColUI.Button disabled={this.state.disabled} label='confirmar' onPress={()=>this._confirm()} />
                </View>
            </View>
        );
    }
}

const EventNameInputStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    textsContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    title:{
        fontSize: 20
    },
    disclaimer:{
        fontSize: 16,
        color: '#888'
    },
    inputAndButtonContainer:{
        flex: 2,
        alignItems: 'center',
        justifyContent: 'space-around'
    }
})

//=========================================================================================

class EventType extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            data: {
                images: [],
                categories: [],
                keywords: ''
            },
            processing: false,
            loading: true
        }
        this._handlePhotoInput = this._handlePhotoInput.bind(this);
        this._handleCategoryInput = this._handleCategoryInput.bind(this);
        this._handleKeywordsInput = this._handleKeywordsInput.bind(this);
        this._fetchFirebase = this._fetchFirebase.bind(this);
        this._goBackToSteps = this._goBackToSteps.bind(this);
        this._proceedInSteps = this._proceedInSteps.bind(this);
        this._uploadToFirebaseAndGoBack = this._uploadToFirebaseAndGoBack.bind(this);
        this._uploadToFirebaseAndProceed = this._uploadToFirebaseAndProceed.bind(this);

        this.imagesURL = [];
    }

    componentDidMount(){
        this._fetchFirebase();
    }

    async _fetchFirebase(){

        let s = this.state;
        const { user } = this.props;
        const { eventRef } = this.props.navigation.state.params;

        let response = await firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(eventRef).get();
        response = response.data();
        if(response.photos){
            s.data.images = response.photos;
        }
        if(response.categories){
            s.data.categories = response.categories;
        }
        if(response.keywords){
            s.data.keywords = response.keywords;
        }
        s.loading = false;

        this.setState(s);
    }

    async _goBackToSteps(){
        let s = this.state;
        const { images } = s.data;
        const { eventRef } = this.props.navigation.state.params;

        s.processing = true;
        this.setState(s);

        let imagesURL = [];

        //Salva as imagens no Cloud Storage:
        images.forEach((image, key)=>{
            if(typeof image == 'string'){
                imagesURL.push(image);
                this._uploadToFirebaseAndGoBack(imagesURL);
            } else {
                firebase.storage().ref(`events/${eventRef}/image_${key.toString()}`).putFile(image.path).on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot=>{
                    if(snapshot.state === firebase.storage.TaskState.SUCCESS){
                        firebase.storage().ref(`events/${eventRef}/image_${key.toString()}`).getDownloadURL()
                            .then(url=>{
                                imagesURL.push(url);
                                this._uploadToFirebaseAndGoBack(imagesURL);
                            })
                    }
                },error=>{
                    console.log('Erro ao fazer o upload de imagens: ', error.message);
                })
            }
        })
    }

    async _proceedInSteps(){
        let s = this.state;
        const { images, categories, keywords } = s.data;
        const { eventRef } = this.props.navigation.state.params;
        const { user } = this.props;

        s.processing = true;
        this.setState(s);

        let imagesURL = [];


        //Salva as imagens no Cloud Storage:
        if(images[0]){
            images.forEach((image, key)=>{
                if(typeof image == 'string'){
                    imagesURL.push(image);
                    this._uploadToFirebaseAndProceed(imagesURL);
                } else {
                    firebase.storage().ref(`events/${eventRef}/image_${key.toString()}`).putFile(image.path).on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot=>{
                        if(snapshot.state === firebase.storage.TaskState.SUCCESS){
                            firebase.storage().ref(`events/${eventRef}/image_${key.toString()}`).getDownloadURL()
                                .then(url=>{
                                    //checa se a url já existe no array, porque por algum motivo o cloud storage
                                    //está emitindo 2 eventos por imagem...
                                    if(!imagesURL.includes(url)){
                                        imagesURL.push(url);
                                    }
                                    this._uploadToFirebaseAndProceed(imagesURL);
                                })
                        }
                    },error=>{
                        console.log('Erro ao fazer o upload de imagens: ', error.message);
                    })
                }
            })
        } else {
            await firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(eventRef).set({ categories: categories, keywords: keywords, photos: [] },{merge: true});
            s.processing = false;
            this.setState(s);
            this.props.navigation.navigate('EventDescription', { eventRef: this.props.navigation.state.params.eventRef })
        }
    }

    async _uploadToFirebaseAndGoBack(readyURLs){

        let s = this.state;

        const { user } = this.props;
        const { eventRef } = this.props.navigation.state.params;
        const { images, categories, keywords } = s.data;

        if(readyURLs.length == images.length){
            //alert('fez upload de todas as imagens');
            await firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(eventRef).set({ categories: categories, keywords: keywords, photos: readyURLs },{merge: true});
            s.processing = false;
            this.setState(s);
            this.props.navigation.navigate('DraftProgress', { draftId: this.props.navigation.state.params.eventRef })
        }
    }

    async _uploadToFirebaseAndProceed(readyURLs){

        let s = this.state;

        const { user } = this.props;
        const { eventRef } = this.props.navigation.state.params;
        const { images, categories, keywords } = s.data;

        if(readyURLs.length == images.length){
            //alert('fez upload de todas as imagens');
            await firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(eventRef).set({ categories: categories, keywords: keywords, photos: readyURLs },{merge: true});
            s.processing = false;
            this.setState(s);
            this.props.navigation.navigate('EventDescription', { eventRef: this.props.navigation.state.params.eventRef })
        }
    }

    async _handlePhotoInput(mode = 'put', key = 0){

        let s = this.state;
        const { images } = s.data;
        
        switch(mode){
            case 'put':
                try{
                    let image = await ImagePicker.openPicker({ cropping: false })
                    images.push(image);
                }catch(error){
                    console.log('Erro ao tentar pegar imagem:', error);
                }
                break;
            case 'delete':
                images.splice(key, 1);
                break;
    }

        this.setState(s);
    }

    _handleCategoryInput(input){
        let s = this.state;
        const { categories } = s.data;

        //converte o categories em uma string com vírgulas (ex.: Balada,Show,Outros):
        //Obs.: Se categories for array vazio, vai dar uma string vazia ('');
        let categoriesAsString = categories.toString();

        //Vê se o input já existe nessa string:
        let finder = categoriesAsString.search(input);

        if(finder == -1){
            //Se o input não existir ele reconverte a string para array e dá um push com o input:
            //Obs.: Se ele vier como string vazia (que veio de array vazio), vai dar array com string vazia (['']):
            //Obs2.: Portanto, o resultado final depois do push ficaria (['', 'valor_do_input'])
            let categoriesAsArray = categoriesAsString.split(',');
            categoriesAsArray.push(input);

            //Tratamento para caso o array seja ['', 'valor_do_input'], simplesmente remove o primeiro valor do array:
            if(categoriesAsArray[0] == ''){
                categoriesAsArray.shift();
            }

            //Define o state como esse novo array de categorias:
            s.data.categories = categoriesAsArray;
        } else {
            //Se o input existir ele substitui na string para nada (''):
            let removed = categoriesAsString.replace(input, '');

            //Tratamento 1: caso o input removido esteja no meio ('input1,input_para_remover,input2')
            //O resultado vai acabar sendo 'input1,,input2'
            //então é só substituir ',,' por ',' que normaliza:
            let normalised = removed.replace(',,',',');

            //Transforma de novo para array:
            let normalisedAsArray = normalised.split(',');

            //Tratamento 2: Se o input removido for o último ('input1,input2,input_para_remover'),
            //A string acaba ficando 'input1,input2,' e o array ['input1', 'input2', '']
            //Então é só ver se o último valor é '' e nesse caso apagá-lo:
            if(normalisedAsArray[normalisedAsArray.length-1] == ''){
                normalisedAsArray.pop();
            }

            //Tratamento 3: Se o input removido for o primeiro ('input_para_remover,input2,input3'),
            //A string acaba ficando ',input1,input2' e o array ['','input1', 'input2']
            //Então é só ver se o primeiro valor é '' e nesse caso apagá-lo:
            if(normalisedAsArray[0] == ''){
                normalisedAsArray.shift();
            }

            //Define o state como o novo array de categorias:
            s.data.categories = normalisedAsArray;
        }

        this.setState(s);
    }

    _handleKeywordsInput(input){
        let s = this.state;

        let keywords = input.split(',');
        s.data.keywords = keywords;

        this.setState(s);
    }

    render(){

        const { ColUITheme } = this.props;
        const { data, processing, loading } = this.state;
        const { categories, keywords } = data;

        if(loading){
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size='large' color={ColUITheme.main} />
                </View>
            );
        }
        return (
            <ScrollView contentContainerStyle={EventTypeStyles.container}>
                <Modal animationType='fade' visible={processing} transparent={true}>
                    <View style={EventTypeStyles.modalContainer}>
                        <View style={[EventTypeStyles.modal, { backgroundColor: ColUITheme.background }]}>
                            <ActivityIndicator size='large' color={ColUITheme.main} />
                            <Text style={[EventTypeStyles.modalText, { color: ColUITheme.main }]}>Salvando...</Text>
                        </View>
                    </View>
                </Modal>
                <View style={EventTypeStyles.contentContainer}>
                    <Text style={[EventTypeStyles.sectionTitle, { color: ColUITheme.gray.light }, { marginTop:0 }]}>Adicionar Fotos</Text>
                    {data.images[0] == undefined && <ColUI.PhotoInput onPress={()=>this._handlePhotoInput('put')} />}
                    {data.images[0] != undefined &&
                        <View style={EventTypeStyles.imagesContainer}>
                            {
                                data.images.map((image, key)=>{
                                    let imageURI = typeof image == 'string'? {uri: image } : {uri: image.path};
                                    return <ColUI.PhotoInput key={key.toString()} onPress={()=>this._handlePhotoInput('delete', key)} source={imageURI} style={{marginRight: 10, marginBottom: 10}} />
                                })
                            }
                            <ColUI.PhotoInput onPress={()=>this._handlePhotoInput('put')} style={{marginRight: 10, marginBottom: 10}} />
                        </View>
                    }

                    <Text style={[EventTypeStyles.sectionTitle, { color: ColUITheme.gray.light }]}>Categoria de Evento</Text>

                    <View style={EventTypeStyles.categoryContainer}>
                        <View style={EventTypeStyles.tagRow}>
                            <ColUI.Tag active={ categories.includes('Show') } contentContainerStyle={EventTypeStyles.tag} label='Show' onPress={()=>this._handleCategoryInput('Show')} />
                            <ColUI.Tag active={ categories.includes('Palestra') } contentContainerStyle={EventTypeStyles.tag} label='Palestra' onPress={()=>this._handleCategoryInput('Palestra')} />
                            <ColUI.Tag active={ categories.includes('Balada') } contentContainerStyle={EventTypeStyles.tag} label='Balada' onPress={()=>this._handleCategoryInput('Balada')} />
                            <ColUI.Tag active={ categories.includes('Negócios') } contentContainerStyle={EventTypeStyles.tag} label='Negócios' onPress={()=>this._handleCategoryInput('Negócios')} />
                        </View>
                        <View style={EventTypeStyles.tagRow}>
                            <ColUI.Tag active={ categories.includes('Gastronomia') } contentContainerStyle={EventTypeStyles.tag} label='Gastronomia' onPress={()=>this._handleCategoryInput('Gastronomia')} />
                            <ColUI.Tag active={ categories.includes('Espetáculo') } contentContainerStyle={EventTypeStyles.tag} label='Espetáculo' onPress={()=>this._handleCategoryInput('Espetáculo')} />
                            <ColUI.Tag active={ categories.includes('Esportivo') } contentContainerStyle={EventTypeStyles.tag} label='Esportivo' onPress={()=>this._handleCategoryInput('Esportivo')} />
                        </View>
                        <View style={EventTypeStyles.tagRow}>
                            <ColUI.Tag active={ categories.includes('Religioso') } contentContainerStyle={EventTypeStyles.tag} label='Religioso' onPress={()=>this._handleCategoryInput('Religioso')} />
                            <ColUI.Tag active={ categories.includes('Curso/Workshop') } contentContainerStyle={EventTypeStyles.tag} label='Curso/Workshop' onPress={()=>this._handleCategoryInput('Curso/Workshop')} />
                            <ColUI.Tag active={ categories.includes('Arte e Cultura') } contentContainerStyle={EventTypeStyles.tag} label='Arte e Cultura' onPress={()=>this._handleCategoryInput('Arte e Cultura')} />
                        </View>
                        <View style={EventTypeStyles.tagRow}>
                            <ColUI.Tag active={ categories.includes('Tecnologia') } contentContainerStyle={EventTypeStyles.tag} label='Tecnologia' onPress={()=>this._handleCategoryInput('Tecnologia')} />
                            <ColUI.Tag active={ categories.includes('Outros') } contentContainerStyle={EventTypeStyles.tag} label='Outros' onPress={()=>this._handleCategoryInput('Outros')} />
                        </View>
                    </View>

                    <Text style={[EventTypeStyles.sectionTitle, { color: ColUITheme.gray.light }]}>Palavras - chave</Text>
                    <Textarea
                    rowSpan={5}
                    bordered
                    style={EventTypeStyles.textArea}
                    placeholder='Digite as palavras chave, elas devem ser separadas por vírgula (Ex.: Rock, Anos 60, Música, etc...)'
                    value={keywords.toString()}
                    onChangeText={(t)=>this._handleKeywordsInput(t)}
                    />
                </View>
                
                <View style={EventTypeStyles.buttonsContainer}>
                    <ColUI.Button blue label='salvar rascunho' onPress={()=>this._goBackToSteps()} />
                    <ColUI.Button label='próximo' onPress={()=>this._proceedInSteps()} />
                </View>
            </ScrollView>
        );
    }
}

const EventTypeStyles = StyleSheet.create({
    container:{
        padding: 20,
        alignItems: 'center'
    },
    contentContainer:{
        width: '100%',
        alignItems: 'flex-start'
    },
    imagesContainer:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap'
    },
    sectionTitle:{
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20
    },
    categoryContainer:{

    },
    buttonsContainer:{
        position: 'absolute',
        bottom: 0,
        height: height*0.1,
        width,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    tag:{
        marginRight: 10
    },
    tagRow: {
        flexDirection: 'row',
        marginTop: 10
    },
    textArea:{
        width: GridWidth(6),
        borderRadius: 10,
        borderColor: '#999999',
        marginBottom: height*0.13
    },
    modalContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modal:{
        height: height*0.3,
        width: width*0.8,
        elevation: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: 50
    },
    modalText:{
        fontSize: 30,
        marginTop: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

//==========================================================================================

class EventDescription extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            description: '',
            processing: false,
            loading: true
        }
        this._handleInput = this._handleInput.bind(this);
        this._goBackToSteps = this._goBackToSteps.bind(this);
        this._proceedInSteps = this._proceedInSteps.bind(this);
        this._fetchFirebase = this._fetchFirebase.bind(this);
    }

    _handleInput(d){
        let s = this.state;
        s.description = d;
        this.setState(s);
    }

    componentDidMount(){
        this._fetchFirebase();
    }

    async _fetchFirebase(){

        let s = this.state;
        const { user } = this.props;
        const { eventRef } = this.props.navigation.state.params;

        let response = await firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(eventRef).get();
        response = response.data();

        if(response.description){
            s.description = response.description;
        }
        s.loading = false;

        this.setState(s);
    }

    async _goBackToSteps(){
        let s = this.state;
        const { user } = this.props;
        const { eventRef } = this.props.navigation.state.params;

        s.processing = true;
        this.setState(s);
        let event = firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(eventRef);
        await event.set({ description: s.description },{ merge: true });
        s.processing = false;
        this.setState(s);
        this.props.navigation.navigate('DraftProgress', { draftId: this.props.navigation.state.params.eventRef })
    }

    async _proceedInSteps(){
        let s = this.state;
        const { user } = this.props;
        const { eventRef } = this.props.navigation.state.params;

        s.processing = true;
        this.setState(s);
        let event = firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(eventRef);
        await event.set({ description: s.description },{ merge: true });
        s.processing = false;
        this.setState(s);
        this.props.navigation.navigate('EventDate', { eventRef: this.props.navigation.state.params.eventRef })
    }

    render(){

        const { description, processing, loading } = this.state;
        const { ColUITheme } = this.props;

        if(loading){
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size='large' color={ColUITheme.main} />
                </View>
            );
        }
        return (
            <View style={EventDescriptionStyles.container}>
                <Modal animationType='fade' visible={processing} transparent={true}>
                    <View style={EventDescriptionStyles.modalContainer}>
                        <View style={[EventDescriptionStyles.modal, { backgroundColor: ColUITheme.background }]}>
                            <ActivityIndicator size='large' color={ColUITheme.main} />
                            <Text style={[EventDescriptionStyles.modalText, { color: ColUITheme.main }]}>Salvando...</Text>
                        </View>
                    </View>
                </Modal>
                <View style={EventDescriptionStyles.textContainer}>
                    <Text style={[EventDescriptionStyles.text, { color: ColUITheme.gray.light }]}>Adicione uma descrição para o seu evento</Text>
                </View>
                <View style={EventDescriptionStyles.textAreaContainer}>
                    <Textarea
                    rowSpan={10}
                    bordered 
                    placeholder='Descrição'
                    style={[EventDescriptionStyles.textArea, { borderColor: ColUITheme.gray.light }]}
                    value={description}
                    onChangeText={(d)=>this._handleInput(d)}
                    />
                </View>
                <View style={EventDescriptionStyles.buttonsContainer}>
                    <ColUI.Button blue label='salvar rascunho' onPress={this._goBackToSteps} />
                    <ColUI.Button label='próximo' onPress={this._proceedInSteps} />
                </View>
            </View>
        );
    }
}

const EventDescriptionStyles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textContainer:{
        height: 50,
        width,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    text:{
        fontSize: 18,
        fontWeight: 'bold'
    },
    textAreaContainer:{
        flex: 4,
        alignItems: 'center',
        paddingTop: 30
    },
    textArea:{
        width: GridWidth(6),
        borderRadius: 5
    },
    buttonsContainer:{
        flex: 1,
        width,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    modalContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modal:{
        height: height*0.3,
        width: width*0.8,
        elevation: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: 50
    },
    modalText:{
        fontSize: 30,
        marginTop: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

//==========================================================================================

class EventDate extends React.Component {

    constructor(props){
        super(props);

        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        this.state = {
            data:{
                dates:{
                    from: new Date(),
                    to: new Date()
                },
                location: ''
            },
            show: {
                dates: {
                    from: false,
                    to: false
                },
                time: {
                    from: false,
                    to: false
                }
            },
            mode: 'datetime',
            processing: false,
            loading: true
        }

        this._openPicker = this._openPicker.bind(this);
        this._setDate = this._setDate.bind(this);
        this._handleLocalInput = this._handleLocalInput.bind(this);
        this._fetchFirebase = this._fetchFirebase.bind(this);
        this._goBackToSteps = this._goBackToSteps.bind(this);
        this._proceedInSteps = this._proceedInSteps.bind(this);
    }

    componentDidMount(){
        this._fetchFirebase();
    }

    async _fetchFirebase(){

        let s = this.state;
        const { user } = this.props;
        const { eventRef } = this.props.navigation.state.params;

        let event = firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(eventRef);
        let response = await event.get();
        response = response.data();

        if(response.location){
            s.data.location = response.location;
        }
        if(response.dates){
            if(response.dates.from){
                s.data.dates.from = new Date(response.dates.from);
            }
            if(response.dates.to){
                s.data.dates.to = new Date(response.dates.to);
            }
        }
        s.loading = false;

        this.setState(s);
    }

    _handleLocalInput(input){
        let s = this.state;
        s.data.location = input;
        this.setState(s);
    }

    _openPicker(mode, field){
        let s = this.state;
        s.show[mode][field] = true;
        if(mode == 'dates'){
            s.mode = 'date';
        } else {
            s.mode = 'time';
        }
        this.setState(s);
    }

    _setDate(event, input, mode, field){
        let s = this.state;
        if(input){
            switch(mode){
                case 'dates':
                    if(field == 'to'){
                        if(input.getTime() < s.data.dates.from.getTime()){
                            alert('Você não pode colocar uma data de final de evento anterior à data de início');
                        } else {
                            s.data[mode][field].setFullYear(input.getFullYear(), input.getMonth(), input.getDate());
                        }
                    } else {
                        s.data[mode][field].setFullYear(input.getFullYear(), input.getMonth(), input.getDate());
                    }
                    break;
                case 'time':
                    if(field == 'to'){
                        input.setFullYear(s.data.dates.to.getFullYear(), s.data.dates.to.getMonth(), s.data.dates.to.getDate());
                        if(input.getTime() < s.data.dates.from.getTime()){
                            alert('Você não pode colocar um horário de encerramento anterior ao horário de início');
                        } else {
                            s.data.dates[field].setHours(input.getHours());
                            s.data.dates[field].setMinutes(input.getMinutes());
                        }
                    } else {
                        s.data.dates[field].setHours(input.getHours());
                        s.data.dates[field].setMinutes(input.getMinutes());
                    }
                    break;
            }
        }
        s.show[mode][field] = false;
        this.setState(s);
    }
    
    async _goBackToSteps(){
        let s = this.state;
        const { user } = this.props;
        const { eventRef } = this.props.navigation.state.params;

        s.processing = true;
        this.setState(s);

        let event = firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(eventRef);
        await event.set({ location: s.data.location, dates: { from: s.data.dates.from.getTime(), to: s.data.dates.to.getTime() } },{merge: true});
        s.processing = false;
        this.setState(s);
        this.props.navigation.navigate('DraftProgress', { draftId: this.props.navigation.state.params.eventRef })
    }

    async _proceedInSteps(){
        let s = this.state;
        const { user } = this.props;
        const { eventRef } = this.props.navigation.state.params;

        s.processing = true;
        this.setState(s);

        let event = firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(eventRef);
        await event.set({ location: s.data.location, dates: { from: s.data.dates.from.getTime(), to: s.data.dates.to.getTime() } },{merge: true});
        s.processing = false;
        this.setState(s);
        this.props.navigation.navigate('EventServices', { eventRef: this.props.navigation.state.params.eventRef })
    }

    render(){

        const { ColUITheme } = this.props;
        const { show, mode, processing, data, loading } = this.state;

        if(loading){
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size='large' color={ColUITheme.main} />
                </View>
            );
        }
        return (
            <View style={EventDateStyles.container}>
                <Modal animationType='fade' visible={processing} transparent={true}>
                    <View style={EventDateStyles.modalContainer}>
                        <View style={[EventDateStyles.modal, { backgroundColor: ColUITheme.background }]}>
                            <ActivityIndicator size='large' color={ColUITheme.main} />
                            <Text style={[EventDateStyles.modalText, { color: ColUITheme.main }]}>Salvando...</Text>
                        </View>
                    </View>
                </Modal>
                <Text style={[EventDateStyles.text, { color: ColUITheme.gray.light }]}>Adicione o Local, a data e horário</Text>
                <ColUI.TextInput value={data.location} style={EventDateStyles.localInput} label='Local do Evento' onChangeText={t=>this._handleLocalInput(t)} />
                <View style={EventDateStyles.dateAndHourContainer}>
                    <View style={EventDateStyles.dateContainer}>
                        <Text style={[EventDateStyles.text, { color: ColUITheme.gray.light }]}>Data</Text>
                        <View style={EventDateStyles.inputsContainer}>
                            <ColUI.DatePicker date={data.dates.from} onPress={()=>this._openPicker('dates','from')} />
                            {show.dates.from && <DateTimePicker mode={mode} value={data.dates.from} onChange={(event, date)=>this._setDate(event, date,'dates','from')} />}
                            <Text style={EventDateStyles.text}>à</Text>
                            <ColUI.DatePicker date={data.dates.to} onPress={()=>this._openPicker('dates','to')} />
                            {show.dates.to && <DateTimePicker mode={mode} value={data.dates.to} onChange={(event, date)=>this._setDate(event, date,'dates','to')} />}
                        </View>
                    </View>
                    <View style={EventDateStyles.hourContainer}>
                        <Text style={[EventDateStyles.text, { color: ColUITheme.gray.light }]}>Horário</Text>
                        <View style={EventDateStyles.inputsContainer}>
                            <ColUI.TimePicker time={data.dates.from} onPress={()=>this._openPicker('time','from')} />
                            {show.time.from && <DateTimePicker mode={mode} value={data.dates.from} onChange={(event, date)=>this._setDate(event, date,'time','from')} />}
                            <Text style={EventDateStyles.text}>às</Text>
                            <ColUI.TimePicker time={data.dates.to} onPress={()=>this._openPicker('time','to')} />
                            {show.time.to && <DateTimePicker mode={mode} value={data.dates.to} onChange={(event, date)=>this._setDate(event, date,'time','to')} />}
                        </View>
                    </View>
                </View>
                <View style={EventDateStyles.buttonsContainer}>
                    <ColUI.Button blue label='salvar rascunho' onPress={this._goBackToSteps} />
                    <ColUI.Button label='próximo' onPress={this._proceedInSteps} />
                </View>
            </View>
        );
    }
}

const EventDateStyles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        padding: 20
    },
    text:{
        fontSize: 18,
        fontWeight: 'bold'
    },
    localInput:{
        marginTop: 20
    },
    dateAndHourContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width,
        paddingHorizontal: 20,
        marginTop: 40
    },
    dateContainer:{
        flex: 1.35,
        alignItems: 'center'
    },
    hourContainer:{
        flex: 1,
        alignItems: 'center'
    },
    inputsContainer:{
        flexDirection: 'row',
        paddingHorizontal: 20,
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 20
    },
    buttonsContainer:{
        position: 'absolute',
        bottom: 0,
        height: height*0.1,
        width,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    modalContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modal:{
        height: height*0.3,
        width: width*0.8,
        elevation: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: 50
    },
    modalText:{
        fontSize: 30,
        marginTop: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

//==========================================================================================

class EventSchedule extends React.Component {
    render(){
        return (
            <View style={EventScheduleStyles.container}>
                <Text style={EventScheduleStyles.test}>Programação do Evento</Text>
            </View>
        );
    }
}

const EventScheduleStyles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    test:{
        fontSize: 20
    }
});

//==========================================================================================

class EventTickets extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            processing: false,
            day: new Date(),
            loading: true
        }

        this._fetchFirebase = this._fetchFirebase.bind(this);
        this._goBackToSteps = this._goBackToSteps.bind(this);
    }

    componentDidMount(){
        this._fetchFirebase();
    }

    async _fetchFirebase(){

        let s = this.state;
        const { user } = this.props;
        const { eventRef } = this.props.navigation.state.params;

        let response = await firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(eventRef).get();
        response = response.data();
        
        if(response.dates){
            s.day = new Date(response.dates.from);
            s.loading = false
        } else {
            Alert.alert('Esperaê!','Para definir o valor dos ingressos você deve primeiro definir os dias em que seu evento acontecerá');
            this.props.navigation.navigate('EventDate', { eventRef: eventRef });
        }

        this.setState(s);
    }

    async _goBackToSteps(){
        let s = this.state;
        s.processing = true;
        this.setState(s);

        /* Futuros processamentos do Firebase */

        s.processing = false;
        this.setState(s);
        this.props.navigation.navigate('DraftProgress', { draftId: this.props.navigation.state.params.eventRef });
    }

    render(){

        const { ColUITheme } = this.props;
        const { processing, day, loading } = this.state;

        if(loading){
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size='large' color={ColUITheme.main} />
                </View>
            );
        }
        return (
            <View style={EventTicketsStyles.container}>
                <Modal animationType='fade' visible={processing} transparent={true}>
                    <View style={EventTicketsStyles.modalContainer}>
                        <View style={[EventTicketsStyles.modal, { backgroundColor: ColUITheme.background }]}>
                            <ActivityIndicator size='large' color={ColUITheme.main} />
                            <Text style={[EventTicketsStyles.modalText, { color: ColUITheme.main }]}>Salvando...</Text>
                        </View>
                    </View>
                </Modal>
                <Text style={[EventTicketsStyles.title, { color: ColUITheme.gray.light }]}>Ingressos</Text>
                <View style={[EventTicketsStyles.dayContainer, { backgroundColor: ColUITheme.main }]}>
                    <Text style={EventTicketsStyles.dayText}>{
                    (day.getDate().toString().length > 1 ? day.getDate() :  '0'+day.getDate().toString())
                    +'/'+
                    ((day.getMonth()+1).toString().length > 1 ? (day.getMonth()+1) : '0'+(day.getMonth+1).toString())
                    +'/'+
                    day.getFullYear()
                    }</Text>
                </View>
                <View style={EventTicketsStyles.ticketsContainer}>
                    <TouchableOpacity onPress={()=>Alert.alert('Esperaê!','Na versão Closed Alpha ainda só é possível fazer eventos gratuitos')}>
                        <ColUI.SecondaryCard addButton={false} contentContainerStyle={EventTicketsStyles.ticketCard} >
                        <View style={EventTicketsStyles.ticketType}>
                            <View style={EventTicketsStyles.fullValue}>
                                <Text style={EventTicketsStyles.ticketTypeLabel} >Inteira</Text>
                                <Text style={EventTicketsStyles.ticketTypeValue} >Valor: R$ 00,00</Text>
                            </View>
                            <View style={EventTicketsStyles.halfValue}>
                                <Text style={EventTicketsStyles.ticketTypeLabel} >Meia</Text>
                                <Text style={EventTicketsStyles.ticketTypeValue} >Valor: R$ 00,00</Text>
                            </View>
                        </View>
                        </ColUI.SecondaryCard>
                    </TouchableOpacity>
                    <ColUI.SecondaryCard onPress={()=>Alert.alert('Esperaê!','Na versão Closed Alpha ainda só é possível fazer eventos gratuitos')} />
                </View>
                <View style={EventDateStyles.buttonsContainer}>
                    <ColUI.Button blue label='salvar rascunho' onPress={this._goBackToSteps} />
                </View>
            </View>
        );
    }
}

const EventTicketsStyles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 20,
        alignItems: 'flex-start'
    },
    title:{
        fontSize: 18,
        fontWeight: 'bold'
    },
    dayContainer:{
        marginVertical: 20,
        padding: 5,
        paddingHorizontal: 10
    },
    dayText:{
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    ticketsContainer:{
        flexDirection: 'row'
    },
    ticketCard:{
        marginRight: 20
    },
    ticketType:{
        marginRight: 30
    },
    ticketTypeLabel:{
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 5
    },
    ticketTypeValue:{
        fontSize: 14,
        color: 'white'
    },
    fullValue:{
        marginBottom: 10
    },
    buttonsContainer:{
        position: 'absolute',
        bottom: 0,
        height: height*0.1,
        width,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    modalContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modal:{
        height: height*0.3,
        width: width*0.8,
        elevation: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: 50
    },
    modalText:{
        fontSize: 30,
        marginTop: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

//==========================================================================================

class EventProducts extends React.Component {
    render(){
        return (
            <View style={EventProductsStyles.container}>
                <Text style={EventProductsStyles.test}>Produtos do Evento</Text>
            </View>
        );
    }
}

const EventProductsStyles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    test:{
        fontSize: 20
    }
});

//==========================================================================================

class EventServices extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selected: [],
            processing: false,
            loading: true,
            ready: false
        }

        this._checkForParams = this._checkForParams.bind(this);
        this._fetchFirebase = this._fetchFirebase.bind(this);
        this._goBackToSteps = this._goBackToSteps.bind(this);
        this._proceedInSteps = this._proceedInSteps.bind(this);
        this._handleDeselection = this._handleDeselection.bind(this);
    }

    componentDidMount(){
        this._fetchFirebase();
        setTimeout(()=>{
            let s = this.state;
            s.ready = true;
            this.setState(s);
        }, 1000);
    }

    async _fetchFirebase(){
        let s = this.state;
        const { user } = this.props;
        const { eventRef } = this.props.navigation.state.params;

        let event = firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(eventRef);
        let response = await event.get();
        response = response.data();
        if(response.producers){
            s.selected = response.producers;
        }
        s.loading = false;

        this.setState(s);
    }

    _checkForParams(){
        let s = this.state;
        if(this.props.navigation.state.params.selected){
            s.selected = this.props.navigation.state.params.selected;
        }
        this.setState(s);
    }

    _handleDeselection(userRef){

        let s = this.state;

        let { selected } = this.state;

        let selAsString = selected.toString();
        selAsString = selAsString.replace(userRef, '');

        //Tratamento remoção no meio:
        selAsString = selAsString.replace(',,',',');

        //Reconvertendo para array:
        let selAsArray = selAsString.split(',');

        //Tratamento remoção no início:
        if(selAsArray[0] == ''){
            selAsArray.shift();
        }

        //Tratamento remoção no final:
        if(selAsArray[selAsArray.length-1] == ''){
            selAsArray.pop();
        }

        s.selected = selAsArray;
        this.setState(s);
    }

    async _goBackToSteps(){
        let s = this.state;
        s.processing = true;
        this.setState(s);
        const { user } = this.props;
        const { eventRef } = this.props.navigation.state.params;

        let event = firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(eventRef);
        await event.set({ producers: s.selected, tickets:[{fullprice:0, halfprice:0}] },{merge:true});
        s.processing = false;
        this.setState(s);
        this.props.navigation.navigate('DraftProgress', { draftId: this.props.navigation.state.params.eventRef })
    }

    async _proceedInSteps(){
        let s = this.state;
        s.processing = true;
        this.setState(s);
        const { user } = this.props;
        const { eventRef } = this.props.navigation.state.params;

        let event = firebase.firestore().collection('users').doc(user.firebaseRef).collection('events').doc(eventRef);
        await event.set({ producers: s.selected, tickets:[{fullprice:0, halfprice:0}] },{merge:true});
        s.processing = false;
        this.setState(s);
        this.props.navigation.navigate('EventTickets', { eventRef: this.props.navigation.state.params.eventRef })
    }

    render(){

        const { ColUITheme, navigation } = this.props;
        const { selected, processing, loading, ready } = this.state;

        if(loading){
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size='large' color={ColUITheme.main} />
                </View>
            );
        }
        return (
            <View style={EventServicesStyles.container}>
                <NavigationEvents onDidFocus={this._checkForParams} />
                <Modal animationType='fade' visible={processing} transparent={true}>
                    <View style={EventServicesStyles.modalContainer}>
                        <View style={[EventServicesStyles.modal, { backgroundColor: ColUITheme.background }]}>
                            <ActivityIndicator size='large' color={ColUITheme.main} />
                            <Text style={[EventServicesStyles.modalText, { color: ColUITheme.main }]}>Salvando...</Text>
                        </View>
                    </View>
                </Modal>
                <View style={EventServicesStyles.organizadoresWrapper}>
                    <ScrollView contentContainerStyle={EventServicesStyles.organzizadoresScrollView}>
                        <Text style={[EventServicesStyles.title, { color: ColUITheme.gray.light }]}>Organizadores</Text>
                        <Button iconLeft transparent onPress={()=>navigation.navigate('AddContacts', { eventRef: this.props.navigation.state.params.eventRef, selected: this.state.selected })}>
                            <Icon type='MaterialIcons' name='add' style={[EventServicesStyles.icon, { color: ColUITheme.main }]} />
                            <Text style={{ color: ColUITheme.main }}>ADICIONAR ORGANIZADOR</Text>
                        </Button>
                        {selected && !ready && false &&
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <ActivityIndicator size='large' color={ColUITheme.main} />
                            </View>
                        }
                        {selected && ready &&
                            selected.map((user, key)=>(
                                <ColUI.AnotherCardOhMyGod key={key.toString()} firebaseRef={user} contentContainerStyle={EventServicesStyles.card} onRemove={()=>this._handleDeselection(user)} />
                            ))
                        }
                    </ScrollView>
                </View>
                <View style={EventServicesStyles.prestadoresWrapper}>
                    <ScrollView contentContainerStyle={EventServicesStyles.prestadoresScrollView}>
                        <Text style={[EventServicesStyles.title, { color: ColUITheme.gray.light }]}>Prestadores de Serviços</Text>
                        <Button iconLeft transparent onPress={()=>navigation.navigate('AddContacts', { eventRef: this.props.navigation.state.params.eventRef, selected: this.state.selected })}>
                            <Icon type='MaterialIcons' name='add' style={[EventServicesStyles.icon, { color: ColUITheme.main }]} />
                            <Text style={{ color: ColUITheme.main }}>ADICIONAR PRESTADOR DE SERVIÇO</Text>
                        </Button>
                        {false && selected &&
                            selected.map((user, key)=>(
                                <ColUI.AnotherCardOhMyGod key={key.toString()} firebaseRef={user} contentContainerStyle={EventServicesStyles.card} onRemove={()=>this._handleDeselection(user)} />
                            ))
                        }
                    </ScrollView>
                </View>
                <View style={EventServicesStyles.buttonsContainer}>
                    <ColUI.Button blue label='salvar rascunho' onPress={this._goBackToSteps} />
                    <ColUI.Button label='próximo' onPress={this._proceedInSteps} />
                </View>
            </View>
        );
    }
}

const EventServicesStyles = StyleSheet.create({
    container:{
        flex: 1
    },
    organizadoresWrapper: {
        flex: 1
    },
    prestadoresWrapper: {
        flex: 1
    },
    organzizadoresScrollView:{
        padding: 20,
        alignItems: 'flex-start'
    },
    prestadoresScrollView:{
        padding: 20,
        alignItems: 'flex-start'
    },
    icon:{
        fontSize: 18,
        marginRight: 5
    },
    addBtn:{
        fontSize: 16
    },
    title:{
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonsContainer:{
        position: 'absolute',
        bottom: 0,
        height: height*0.1,
        width,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    modalContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modal:{
        height: height*0.3,
        width: width*0.8,
        elevation: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: 50
    },
    modalText:{
        fontSize: 30,
        marginTop: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    card:{
        marginBottom: 10
    }
});

//==========================================================================================

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme,
    tempDraft: state.draftsReducer.temp,
    user: state.userReducer
});

const mapDispatchToProps = (dispatch)=>({
    setTempDraft: (temp)=> dispatch({ type: 'UPDATE_TEMP_DRAFT', payload: temp })
});

const ProcessDraftScreen = connect(mapStateToProps)(ProcessDraft);
const EventNameInputScreen = connect(mapStateToProps, mapDispatchToProps)(EventNameInput);
const DraftProgressScreen = connect(mapStateToProps, mapDispatchToProps)(DraftProgress);
const EventTypeScreen = connect(mapStateToProps)(EventType);
const EventDescriptionScreen = connect(mapStateToProps, mapDispatchToProps)(EventDescription);
const EventDateScreen = connect(mapStateToProps)(EventDate);
const EventScheduleScreen = connect(mapStateToProps)(EventSchedule);
const EventTicketsScreen = connect(mapStateToProps)(EventTickets);
const EventProductsScreen = connect(mapStateToProps)(EventProducts);
const EventServicesScreen = connect(mapStateToProps)(EventServices);

export default {
    ProcessDraftScreen,
    EventNameInputScreen,
    DraftProgressScreen,
    EventTypeScreen,
    EventDescriptionScreen,
    EventDateScreen,
    EventScheduleScreen,
    EventTicketsScreen,
    EventProductsScreen,
    EventServicesScreen
};