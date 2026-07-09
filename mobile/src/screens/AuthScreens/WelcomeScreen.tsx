import { Image, View } from 'react-native';
import React from 'react';
import { THEME } from '@/lib/theme';
import { Text } from '@/ui/text';
import { Button } from '@/ui/Button';
import { useNavigation } from '@react-navigation/native';
import { MotiView } from 'moti';

const WelcomeScreen = () => {
	const navigate = useNavigation<any>();
	return (
		<View
			className="flex-1 items-center justify-content pt-16"
			style={{ backgroundColor: THEME.light.background }}
		>
			<MotiView
				className="w-full h-2/4 mt-5 items-center justify-content"
				from={{ opacity: 0.9, scale: 0.98, rotate: '-6deg', translateY: -8 }}
				animate={{ opacity: 1, scale: 1.02, rotate: '6deg', translateY: 8 }}
				transition={{ type: 'timing', duration: 3000, loop: true, repeatReverse: true }}
			>
				<Image
					source={require('../../../assets/transparentLogo.png')}
					className="w-full h-full mb-8"
					resizeMode="contain"
				/>
			</MotiView>

			<Button
				style={{ borderRadius: 25 }}
				className="w-4/5 mt-5 items-center justify-content"
				variant={'default'}
				onPress={() => navigate.navigate('Login')}
			>
				<Text>Login</Text>
			</Button>
			<Button
				style={{ borderRadius: 25 }}
				className="w-4/5 mt-5 items-center justify-content"
				onPress={() => navigate.navigate('Register')}
			>
				<Text>Register</Text>
			</Button>
		</View>
	);
};

export default WelcomeScreen;
