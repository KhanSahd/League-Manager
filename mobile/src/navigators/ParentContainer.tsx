import { Text } from 'react-native';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootState } from '../redux/store';
import { bootstrapAuth } from '../redux/slices/AuthSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import MainAppStack from './MainAppStack';
import AuthStack from './AuthStack';
import { LoadingScreen } from '../screens/LoadingScreen';
import { PortalHost } from '@rn-primitives/portal';

const ParentContainer = () => {
	const dispatch = useAppDispatch();
	const { user, ready } = useAppSelector((state: RootState) => state.auth);

	useEffect(() => {
		dispatch(bootstrapAuth());
	}, []);

	if (!ready) {
		return <LoadingScreen />;
	}

	return (
		<NavigationContainer>
			{user ? <MainAppStack /> : <AuthStack />}
			<PortalHost />
		</NavigationContainer>
	);
};

export default ParentContainer;
