export const theme = {
	colors: {
		bg: '#ffffff', // slate-900
		card: '#AFCBFF', // gray-900
		text: '#000000', // gray-200
		text2: '#ffffff', // gray-200
		muted: '#3c3c3c', // gray-400
		primary: '#1100f9', // sky-400
		secondary: '#BC209A', // amber-400
		danger: '#F87171',
		border: '#1F2937',
		error: '#EF4444',
		font: 'RobotoMono-VariableFont_wght',
	},
	spacing: {
		xs: 6,
		sm: 10,
		md: 16,
		lg: 24,
	},
	radius: {
		sm: 6,
		md: 10,
	},
	textSize: {
		sm: 14,
		md: 16,
		lg: 20,
		xl: 24,
		emptyState: 48,
	},
};

export const emptyTextStyle = {
	color: theme.colors.muted,
	textAlign: 'center' as const,
	marginVertical: theme.spacing.lg,
};
