const initialState = {
    name: 'Marcos',
    lastname: 'Omine Jr',
    username: '@marcosominejr',
    profileimage: 'https://icon-library.net/images/default-user-icon/default-user-icon-4.jpg',
    from:{
        city: 'São Paulo',
        state: 'SP'
    },
    email: 'marcosomine@gmail.com',
    firebaseRef: ''
};

export default (state = initialState, action) => {

    switch(action.type){
        case 'SET_NAME':
            return {...state, name: action.payload.name};
            break;
        case 'SET_EMAIL':
            return {...state, name: action.payload.email};
            break;
        case 'SET_USER_INFO':
            return action.payload;
            break;
    }

    return state;
}