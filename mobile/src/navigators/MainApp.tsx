import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import TabNavigator from './TabNavigator'
import Login from '../screens/AuthScreens/Login'
import { Header } from '../ui/Header'
import { RootState } from '../redux/store'
import * as SecureStore from "expo-secure-store";
import { doneLoading, loginSuccess, logout, setToken } from '../redux/slices/AuthSlice'
import { api } from '../api/client'
import { User } from '../../types'
import Register from '../screens/AuthScreens/Register'
import ForgotPassword from '../screens/AuthScreens/ForgotPassword'

const MainApp = () => {
    const Stack = createStackNavigator();
    const isSignedIn = useSelector((state: any) => state.auth.token != null);
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
    async function restoreSession() {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        dispatch(doneLoading());
        return;
      }

      try {
        dispatch(setToken(token));

        const user = await api<User>("/me");

        dispatch(loginSuccess({ user }));
      } catch {
        await SecureStore.deleteItemAsync("token");
        dispatch(logout());
      }
    }

    restoreSession();
  }, []);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
    <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {user ? (
                <>
                    <Stack.Screen name="MainTabNavigator" component={TabNavigator} />
                </>
                ) : (
                <>
                    <Stack.Screen 
                        name="Login"
                        component={Login}
                        options={{
                            header: () => <Header title="Login" />,
                            headerShown: true
                    }}
                    />
                    <Stack.Screen
                        name="Register"
                        component={Register}
                        options={{
                            header: () => <Header title='Register' />,
                            headerShown: true
                        }}
                     />
                     <Stack.Screen
                        name="Forgot-Password"
                        component={ForgotPassword}
                        options={{
                            header: () => <Header title='Forgot Password' />,
                            headerShown: true
                        }}
                      />
                </>
                        
            )}
        </Stack.Navigator>
    </NavigationContainer>
    )
}

export default MainApp