import { View } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../ui/theme';
import { Text } from '../../ui/text';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { redeemInvite } from '../../api/invites';
import { fetchMyLeagues } from '../../redux/slices/leaguesSlice';
import { useAppDispatch } from '../../redux/hooks';
import { LeaguesStackParamList } from '../../../types';

export default function JoinLeague() {
	type navigationProp = StackNavigationProp<LeaguesStackParamList>;
	const navigation = useNavigation<navigationProp>();
	const dispatch = useAppDispatch();

	const [code, setCode] = useState('');
	const [joining, setJoining] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function submit() {
		if (!code) return;
		setJoining(true);
		setError(null);
		try {
			await redeemInvite(code.trim());
			await dispatch(fetchMyLeagues());
			navigation.navigate('MyLeagues');
		} catch (e: any) {
			setError(e.message ?? 'Failed to join league');
		} finally {
			setJoining(false);
		}
	}

	return (
		<View
			style={{
				flex: 1,
				padding: theme.spacing.lg,
				gap: theme.spacing.md,
				backgroundColor: theme.colors.bg,
			}}
		>
			<Card>
				<Text
					style={{
						fontSize: theme.textSize.lg,
						color: theme.colors.text,
						fontWeight: '600',
						marginBottom: theme.spacing.sm,
					}}
				>
					Join a League
				</Text>
				<Text style={{ color: theme.colors.muted, marginBottom: theme.spacing.md }}>
					Ask your league owner for an invite code and enter it below.
				</Text>

				{error && (
					<Text style={{ color: theme.colors.error, marginBottom: theme.spacing.sm }}>
						{error}
					</Text>
				)}

				<Input
					placeholder="Invite code"
					value={code}
					onChangeText={(text) => setCode(text.toUpperCase())}
					autoCapitalize="characters"
					autoCorrect={false}
				/>

				<View style={{ height: theme.spacing.md }} />

				<Button onPress={submit} disabled={joining || !code}>
					<Text>{joining ? 'Joining...' : 'Join League'}</Text>
				</Button>
			</Card>
		</View>
	);
}
