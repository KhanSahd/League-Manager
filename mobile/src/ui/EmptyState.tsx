import { Text } from 'react-native';
import { theme } from './theme';

export function EmptyState({ message }: { message: string }) {
	return (
		<Text
			style={{
				color: theme.colors.text,
				textAlign: 'center',
				marginVertical: theme.spacing.lg,
				fontSize: theme.textSize.lg,
			}}
		>
			{message}
		</Text>
	);
}
