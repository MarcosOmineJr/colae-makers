//Themes:

const light = {
    background: '#FFFFFF',
    main: '#EA1F5A',
    accent: '#6500FF',
    purple: {
        light: '#832A80',
        dark: '#5C124C'
    },
    blue: {
        light: '#6500FF',
        dark: '#1F0555'
    },
    gray:{
        light: '#1C2938',
        dark: '#10171E'
    }
};

const dark = {
    background: '#1C2938',
    main: '#EA1F5A',
    accent: '#6500FF',
    purple: {
        light: '#832A80',
        dark: '#5C124C'
    },
    blue: {
        light: '#6500FF',
        dark: '#1F0555'
    },
    gray:{
        light: '#1C2938',
        dark: '#10171E'
    }
};

const initialState = {
    ColUITheme: light
};

export default (state = initialState, action)=>{

    switch(action.type){
        case 'DARK_MODE':
            return {...state, ColUITheme: dark }
            break;
        case 'LIGHT_MODE':
            return {...state, ColUITheme: light }
            break;
    }

    return state;
}