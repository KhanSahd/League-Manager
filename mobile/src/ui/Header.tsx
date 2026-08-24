import { View, Pressable } from 'react-native';
import { theme } from './theme';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '@/lib/theme';
import { Text } from './text';

export function Header({ title }: { title: string }) {
	const insets = useSafeAreaInsets();
	const navigation = useNavigation();

	return (
		<View
			style={{
				paddingTop: insets.top,
				backgroundColor: THEME.light.background,
				borderBottomWidth: 1,
				borderBottomColor: THEME.light.border,
			}}
		>
			<View
				style={{
					height: 56,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingHorizontal: theme.spacing.md,
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					{navigation.canGoBack() ? (
						<Pressable
							onPress={() => navigation.goBack()} // fix me
							style={{ paddingRight: theme.spacing.md }}
						>
							<Text
								style={{
									color: theme.colors.primary,
									fontSize: theme.textSize.md,
								}}
							>
								←
							</Text>
						</Pressable>
					) : (
						// <View style={{ width: 24 }} />
						<></>
					)}

					<Text>{title}</Text>
				</View>
			</View>
		</View>
	);
}
