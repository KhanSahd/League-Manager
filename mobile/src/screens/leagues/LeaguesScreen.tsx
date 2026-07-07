import { View } from 'react-native';
import React from 'react';
import { THEME } from '@/lib/theme';
import { theme } from '@/ui/theme';
import { Button } from '@/ui/Button';
import { Text } from '@/ui/text';
import { useNavigation } from '@react-navigation/native';

const LeaguesScreen = () => {
	const navigation = useNavigation();
	return (
		<View style={{ backgroundColor: THEME.light.background, flex: 1, padding: 20, gap: 12 }}>
			<Text>Welcome Sahd Khan</Text>

			<View style={{ padding: theme.spacing.md }}>
				<Text
					style={{
						fontSize: theme.textSize.lg,
						color: theme.colors.text,
						fontWeight: '500',
						marginBottom: theme.spacing.sm,
					}}
				>
					Leagues
				</Text>

				<View
					style={{
						flexDirection: 'column',
						gap: '15',
					}}
				>
					<Button
						onPress={() => {
							navigation.navigate('Join Leagues');
						}}
					>
						<Text>Join Leagues</Text>
					</Button>

					<Button onPress={() => navigation.navigate('MyLeagues')}>
						<Text>View My Leagues</Text>
					</Button>
				</View>
			</View>
		</View>
	);
};

export default LeaguesScreen;
