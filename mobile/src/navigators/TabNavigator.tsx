import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from '../screens/Home'
import { Header } from '../ui/Header';
import Entypo from '@expo/vector-icons/Entypo';
import { theme } from '../ui/theme';
import HomeNavigator from './HomeNavigator';

const TabNavigator = () => {

    const Tabs = createBottomTabNavigator();

    return (
        <Tabs.Navigator screenOptions={{
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.text,
            tabBarStyle: {
                backgroundColor: theme.colors.bg,
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
            },
            headerShown: false
        }}>
            {/* <Tabs.Screen
                name='home'
                options={{
                    header: () => <Header title='Home' />,
                    tabBarIcon: ({color}) => <Entypo name="home" size={24} color={color} />,
                }}
                component={Home}
            /> */}
            <Tabs.Screen
                name='Home'
                component={HomeNavigator}
                options={{
                    tabBarIcon: ({color}) => <Entypo name="home" size={24} color={color}  />
                }}
            />
        </Tabs.Navigator>
    )
}

export default TabNavigator