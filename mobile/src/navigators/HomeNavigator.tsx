import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import { Header } from '../ui/Header';
import Findleagues from '../screens/Findleagues';
import MyLeagues from '../screens/Myleagues';
import Teams from '../screens/Teams';

const HomeNavigator = () => {
    const navigation = useNavigation();
    const stack = createStackNavigator();

    return (
        <stack.Navigator>
            <stack.Screen
                name='HomeScreen'
                component={Home}
                options={{ header: () => <Header title='Home' />, }}
            />
            <stack.Screen
                name='Join Leagues'
                component={Findleagues}
                options={{ header: () => <Header title='Join a League' />}}
            />
            <stack.Screen
                name='MyLeagues'
                component={MyLeagues}
                options={{ header: () => <Header title='My Leagues' />}}
            />
            <stack.Screen
                name='Teams'
                component={Teams}
                options={{ header: () => <Header title='Teams' />}}
            />
        </stack.Navigator>
    )
}

export default HomeNavigator