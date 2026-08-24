import { View } from 'react-native';
import React from 'react';
import { theme } from '../../ui/theme';
import { EmptyState } from '../../ui/EmptyState';

export default function Findleagues() {
	return (
		<View
			style={{
				flex: 1,
				padding: theme.spacing.lg,
				backgroundColor: theme.colors.bg,
			}}
		>
			<EmptyState message="Joining a league by invite code is coming soon. Ask your league owner for an invite." />
		</View>
	);
}
