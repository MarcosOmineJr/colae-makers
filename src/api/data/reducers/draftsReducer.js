const initialState = {
    temp: null,
    remote: []
}

export default (state = initialState, action) => {

    switch(action.type){
        case 'UPDATE_DRAFTS_SNAPSHOT':
            return { ...state, remote: action.payload };
            break;
        case 'UPDATE_TEMP_DRAFT':
            return { ...state, temp: action.payload }
    }

    return state;
}