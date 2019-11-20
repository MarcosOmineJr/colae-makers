const initialState = {
    name: 'José Santos',
    username: '@josesantos',
    profile_image_url: 'https://icon-library.net/images/default-user-icon/default-user-icon-4.jpg',
    location: 'São Paulo - SP'
};

export default (state = initialState, action) => {

    switch(action.type){
        case 'SET_NAME':
            return {...state, name: action.payload.name};
            break;
        case 'SET_EMAIL':
            return {...state, name: action.payload.email};
            break;
    }

    return state;
}