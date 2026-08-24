import { View } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/Button';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useAppSelector } from '../redux/hooks';
import { DrawerParamList } from '../../types';
import { THEME } from '@/lib/theme';

export default function Home() {
	const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
	const user = useAppSelector((state) => state.auth.user);
	const leagues = useAppSelector((state) => state.leagues.leagues);

	return (
		<View style={{ backgroundColor: THEME.light.background, flex: 1, padding: 20, gap: 12 }}>
			<Text className="text-2xl font-bold">
				Welcome{user ? `, ${user.firstName}` : ''}
			</Text>
			<Text className="text-muted-foreground">
				{leagues?.length
					? `You're in ${leagues.length} league${leagues.length === 1 ? '' : 's'}.`
					: "You haven't joined a league yet."}
			</Text>
			<Button onPress={() => navigation.navigate('LeaguesScreen')} className="mt-4">
				<Text>View Leagues</Text>
			</Button>
		</View>
	);
}
