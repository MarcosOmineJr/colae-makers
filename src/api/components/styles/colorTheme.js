import AsyncStorage from '@react-native-community/async-storage';

export const light = {
    background: '#FFFFFF',
    main: '#EA1F5A',
    accent: '#6500FF'
};

const dark = {
    background: '#1C2938',
    main: '#EA1F5A',
    accent: '#6500FF'
};

const theme = async ()=>{
    let asyncTheme = await AsyncStorage.getItem('@color-theme');
    let t;
    switch(asyncTheme){
        case 'dark':
            t = dark;
            break;
        case 'light':
            t = light;
            break;
        default:
            t = light;
    }
    return t;
};

export default theme;