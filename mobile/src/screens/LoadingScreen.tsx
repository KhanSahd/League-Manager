import { ActivityIndicator, Text, View } from 'react-native';
import { theme } from '../ui/theme';

export function LoadingScreen() {
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.colors.bg,
				alignItems: 'center',
				justifyContent: 'center',
				padding: 24,
			}}
		>
			<View
				style={{
					width: 88,
					height: 88,
					borderRadius: 24,
					backgroundColor: theme.colors.card,
					alignItems: 'center',
					justifyContent: 'center',
					marginBottom: 24,
					shadowColor: '#000',
					shadowOpacity: 0.12,
					shadowRadius: 12,
					shadowOffset: { width: 0, height: 6 },
					elevation: 4,
				}}
			>
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</View>

			<Text
				style={{
					color: theme.colors.text,
					fontSize: 22,
					fontWeight: '700',
					marginBottom: 8,
				}}
			>
				LockTalk
			</Text>

			<Text
				style={{
					color: theme.colors.muted,
					fontSize: 15,
					textAlign: 'center',
				}}
			>
				Getting everything ready...
			</Text>
		</View>
	);
}
