import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from '../screens/Home'
import { Header } from '../ui/Header';
import Entypo from '@expo/vector-icons/Entypo';
import { theme } from '../ui/theme';
import HomeNavigator from './HomeNavigator';
import { useEffect } from 'react';
import { fetchMyLeagues } from '../redux/slices/leaguesSlice';
import { useAppDispatch } from '../redux/hooks';
import { NavigationContainer } from '@react-navigation/native';

const MainAppStack = () => {

    const Tabs = createBottomTabNavigator();
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchMyLeagues())
    }, [dispatch])

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

export default MainAppStack