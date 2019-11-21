//Themes:

const light = {
    background: '#FFFFFF',
    main: '#EA1F5A',
    accent: '#6500FF'
};

const dark = {
    background: '#1C2938',
    main: '#EA1F5A',
    accent: '#6500FF'
};

const initialState = {
    ColUITheme: light
};

export default (state = initialState, action)=>{

    switch(action){
        case 'DARK_MODE':
            return {...state, ColUITheme: dark }
            break;
        case 'LIGHT_MODE':
            return {...state, ColUITheme: light }
            break;
    }

    return state;
}