export default (state = [], action) => {

    switch(action.type){
        case 'UPDATE_SNAPSHOT':
            return action.payload;
            break;
    }

    return state;
}