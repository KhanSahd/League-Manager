import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import * as SecureStore from 'expo-secure-store';
import { useAppDispatch } from '../../redux/hooks';
import { logout } from '@/redux/slices/AuthSlice';
import { Image, View } from 'react-native';
import { MotiView } from 'moti';

const CustomDrawerContent = (props: any) => {
	const dispatch = useAppDispatch();

	async function doLogOut() {
		await SecureStore.deleteItemAsync('token');
		dispatch(logout());
	}

	return (
		<DrawerContentScrollView {...props}>
			<DrawerItem
				label={() => (
					<MotiView
						className="w-full h-32 flex items-center justify-center"
						from={{ opacity: 0.9, scale: 0.98, rotate: '-6deg', translateY: -8 }}
						animate={{ opacity: 1, scale: 1.02, rotate: '6deg', translateY: 8 }}
						transition={{ type: 'timing', duration: 2000, loop: true, repeatReverse: true }}
					>
						<Image
							source={require('../../../assets/transparentLogo.png')}
							className="w-full h-full"
							resizeMode="contain"
						/>
					</MotiView>
				)}
				onPress={() => null}
			/>
			{/* Renders your default screen items */}
			<DrawerItemList {...props} />
			{/* Renders your custom non-screen item */}
			<DrawerItem label="Log Out" onPress={doLogOut} />
		</DrawerContentScrollView>
	);
};

export default CustomDrawerContent;
