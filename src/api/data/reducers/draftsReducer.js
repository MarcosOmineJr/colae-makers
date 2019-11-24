export default (state = [], action) => {

    switch(action.type){
        case 'UPDATE_DRAFTS_SNAPSHOT':
            return action.payload;
            break;
    }

    return state;
}