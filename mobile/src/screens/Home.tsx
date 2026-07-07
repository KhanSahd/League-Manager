import { View } from 'react-native';
import { Text } from '../ui/text';
import { theme } from '../ui/theme';
import { Button } from '../ui/Button';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../redux/slices/AuthSlice';
import * as SecureStore from 'expo-secure-store';
import { useAppDispatch } from '../redux/hooks';
import { RootStackParamList } from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { THEME } from '@/lib/theme';

export default function Home() {
	// const { user, signOut } = useAuth();

	type navigationProp = StackNavigationProp<RootStackParamList>;
	const navigation = useNavigation<navigationProp>();
	const dispatch = useAppDispatch();

	async function doLogOut() {
		await SecureStore.deleteItemAsync('token');
		dispatch(logout());
	}

	return (
		<View style={{ backgroundColor: THEME.light.background, flex: 1, padding: 20, gap: 12 }}>
			<Text>Home Page</Text>
		</View>
	);
}
