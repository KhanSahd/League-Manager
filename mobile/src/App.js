import { NavigationContainer, StackRouter } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useSelector } from 'react-redux';
import { store } from './redux/store';
import TabNavigator from './navigators/TabNavigator';
import Login from './screens/AuthScreens/Login';
import MainApp from './navigators/MainApp';

export default function App() {
	const Stack = createStackNavigator();

	return (
		<Provider store={store}>
			<MainApp />
		</Provider>
	);
}
