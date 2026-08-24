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
import { DrawerParamList } from '../../types';

const MainAppStack = () => {
	const Drawer = createDrawerNavigator<DrawerParamList>();
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchMyLeagues());
		dispatch(getSports());
	}, [dispatch]);

	return (
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
			/>
		</Drawer.Navigator>
	);
};

export default MainAppStack;
