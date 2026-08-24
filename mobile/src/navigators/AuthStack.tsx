import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/AuthScreens/Login';
import Register from '../screens/AuthScreens/Register';
import ForgotPassword from '../screens/AuthScreens/ForgotPassword';
import { Header } from '../ui/Header';
import WelcomeScreen from '@/screens/AuthScreens/WelcomeScreen';
import { AuthStackParamList } from '../../types';

const AuthStack = () => {
	const Stack = createStackNavigator<AuthStackParamList>();
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Welcome"
				component={WelcomeScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Login"
				component={Login}
				options={{
					header: () => <Header title="Login" />,
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name="Register"
				component={Register}
				options={{
					header: () => <Header title="Register" />,
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name="Forgot-Password"
				component={ForgotPassword}
				options={{
					header: () => <Header title="Forgot Password" />,
					headerShown: true,
				}}
			/>
		</Stack.Navigator>
	);
};

export default AuthStack;
