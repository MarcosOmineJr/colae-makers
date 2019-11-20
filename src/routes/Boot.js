import { createSwitchNavigator } from 'react-navigation';

//Imports:
import Authenticated from './Authenticated';
import Unauthenticated from './Unauthenticated';
import { AuthCheckScreen } from '../screens';

const Boot = createSwitchNavigator({
    AuthCheck:{
        screen: AuthCheckScreen
    },
    Unauthenticated,
    Authenticated
},{
    initialRouteName:'AuthCheck'
});

export default Boot;