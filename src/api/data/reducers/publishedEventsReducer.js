export default (state = [], action) => {

    switch(action.type){
        case 'UPDATE_PUBLISHED_SNAPSHOT':
            return action.payload;
            break;
    }

    return state;
}