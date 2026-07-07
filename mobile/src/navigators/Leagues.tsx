import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Findleagues from '@/screens/leagues/Findleagues';
import MyLeagues from '@/screens/leagues/Myleagues';
import Teams from '@/screens/Teams';
import { Header } from '@/ui/Header';
import LeaguesScreen from '@/screens/leagues/LeaguesScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from '@/ui/theme';
import Entypo from '@expo/vector-icons/Entypo';
import { DrawerToggleButton } from '@react-navigation/drawer';

const Leagues = () => {
	const stack = createStackNavigator();
	return (
		<stack.Navigator screenOptions={{ headerShown: true }}>
			<stack.Screen
				name="Leagues"
				component={LeaguesScreen}
				options={({ navigation }) => ({
					title: 'Leagues',
					headerRight: () => (
						<Pressable onPress={() => navigation.getParent()?.openDrawer()}>
							<DrawerToggleButton />
						</Pressable>
					),
				})}
				// options={{ header: () => <Header title="Leagues" /> }}
			/>
			<stack.Screen
				name="Join Leagues"
				component={Findleagues}
				options={{
					title: 'Join Leagues',
				}}
				// options={{ header: () => <Header title="Join a League" /> }}
			/>
			<stack.Screen
				name="MyLeagues"
				component={MyLeagues}
				options={{
					title: 'My Leagues',
				}}
				// options={{ header: () => <Header title="My Leagues" /> }}
			/>
			<stack.Screen
				name="Teams"
				component={Teams}
				options={{
					title: 'Teams',
				}}
				// options={{ header: () => <Header title="Teams" /> }}
			/>
		</stack.Navigator>
	);
};

export default Leagues;
