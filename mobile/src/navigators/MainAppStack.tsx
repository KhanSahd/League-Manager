import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Entypo from '@expo/vector-icons/Entypo';
import { theme } from '../ui/theme';
import { useEffect } from 'react';
import { fetchMyLeagues } from '../redux/slices/leaguesSlice';
import { useAppDispatch } from '../redux/hooks';
import { getSports } from '@/redux/slices/SportsSlice';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Leagues from './Leagues';
import CustomDrawerContent from './CustomDrawer/CustomDrawerContent';

const MainAppStack = () => {
	const Tabs = createBottomTabNavigator();
	const Drawer = createDrawerNavigator();
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchMyLeagues());
		dispatch(getSports());
	}, [dispatch]);

	return (
		// <Tabs.Navigator
		// 	screenOptions={{
		// 		tabBarActiveTintColor: THEME.light.primary,
		// 		tabBarInactiveTintColor: THEME.light.secondary,
		// 		tabBarStyle: {
		// 			backgroundColor: THEME.light.background,
		// 			borderTopWidth: 1,
		// 			borderTopColor: THEME.light.border,
		// 		},
		// 		headerShown: false,
		// 	}}
		// >
		// 	<Tabs.Screen
		// 		name="Home"
		// 		component={HomeNavigator}
		// 		options={{
		// 			tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} />,
		// 		}}
		// 	/>
		// </Tabs.Navigator>
		<Drawer.Navigator
			backBehavior="history"
			screenOptions={{
				drawerActiveTintColor: theme.colors.primary,
				drawerInactiveTintColor: theme.colors.text,
				drawerPosition: 'right',
				drawerType: 'front',
			}}
			drawerContent={(props) => <CustomDrawerContent {...props} />}
		>
			<Drawer.Screen
				name="HomeScreen"
				component={Home}
				options={{
					headerTitle: 'Home',
					drawerLabel: 'Home',
					drawerIcon: ({ color }) => <Entypo name="home" size={24} color={color} />,
				}}
				// options={{ header: () => <Header title="Home" /> }}
			/>
			<Drawer.Screen
				name="LeaguesScreen"
				component={Leagues}
				options={{
					headerTitle: 'League',
					drawerLabel: 'Leagues',
					drawerIcon: ({ color }) => <Entypo name="plus" size={24} color={color} />,
					headerShown: false,
				}}
				// options={{ header: () => <Header title="Join a League" /> }}
			/>
			{/* <Drawer.Screen
				name="MyLeagues"
				component={MyLeagues}
				// options={{ header: () => <Header title="My Leagues" /> }}
			/>
			<Drawer.Screen
				name="Teams"
				component={Teams}
				// options={{ header: () => <Header title="Teams" /> }}
			/> */}
		</Drawer.Navigator>
	);
};

export default MainAppStack;
