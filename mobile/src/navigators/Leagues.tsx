import { Pressable } from 'react-native';
import React from 'react';
import JoinLeague from '@/screens/leagues/JoinLeague';
import MyLeagues from '@/screens/leagues/Myleagues';
import Teams from '@/screens/Teams';
import Roster from '@/screens/Roster';
import LeaguesScreen from '@/screens/leagues/LeaguesScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerNavigationProp, DrawerToggleButton } from '@react-navigation/drawer';
import { DrawerParamList, LeaguesStackParamList } from '../../types';

const Leagues = () => {
	const stack = createStackNavigator<LeaguesStackParamList>();
	return (
		<stack.Navigator screenOptions={{ headerShown: true }}>
			<stack.Screen
				name="Leagues"
				component={LeaguesScreen}
				options={({ navigation }) => ({
					title: 'Leagues',
					headerRight: () => (
						<Pressable
							onPress={() =>
								navigation.getParent<DrawerNavigationProp<DrawerParamList>>()?.openDrawer()
							}
						>
							<DrawerToggleButton />
						</Pressable>
					),
				})}
			/>
			<stack.Screen
				name="Join Leagues"
				component={JoinLeague}
				options={{
					title: 'Join Leagues',
				}}
			/>
			<stack.Screen
				name="MyLeagues"
				component={MyLeagues}
				options={{
					title: 'My Leagues',
				}}
			/>
			<stack.Screen
				name="Teams"
				component={Teams}
				options={{
					title: 'Teams',
				}}
			/>
			<stack.Screen
				name="Roster"
				component={Roster}
				options={({ route }) => ({
					title: route.params.teamName ?? 'Roster',
				})}
			/>
		</stack.Navigator>
	);
};

export default Leagues;
