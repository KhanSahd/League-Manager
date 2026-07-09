import { useState } from 'react';
import { View } from 'react-native';
import { api } from '../../api/client';
import { theme } from '../../ui/theme';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import * as SecureStore from 'expo-secure-store';
import { loginSuccess, setToken } from '../../redux/slices/AuthSlice';
import { AuthResponse, RootStackParamList, User } from '../../../types';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../redux/hooks';
import { StackNavigationProp } from '@react-navigation/stack';
import { THEME } from '@/lib/theme';
import { Card, CardContent, CardFooter, CardHeader } from '@/ui/Card';
import { Label } from '@/ui/label';
import { Text } from '@/ui/text';

export default function Login() {
	type navigationProp = StackNavigationProp<RootStackParamList>;

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const dispatch = useAppDispatch();
	const navigation = useNavigation<navigationProp>();

	async function submit() {
		setError(null);
		try {
			const res = await api<AuthResponse>('/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});
			dispatch(setToken(res.token));
			await SecureStore.setItemAsync('token', res.token);

			const user = await api<User>('/me');
			dispatch(loginSuccess({ user: user }));
		} catch (e: any) {
			setError(e.message);
		}
	}

	return (
		<View
			style={{
				flex: 1,
				paddingHorizontal: theme.spacing.lg,
				paddingTop: theme.spacing.lg,
				paddingBottom: theme.spacing.lg,
				gap: theme.spacing.md,
			}}
		>
			<Card>
				<CardHeader>
					{error ? (
						<Text
							style={{
								fontSize: theme.textSize.xl,
								color: theme.colors.error,
							}}
						>
							{error}
						</Text>
					) : (
						<Text className="text-2xl font-bold">Welcome back</Text>
					)}
				</CardHeader>

				<CardContent className="gap-4">
					<Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
						Email
					</Label>
					<Input
						id="email"
						placeholder="Email"
						autoCapitalize="none"
						value={email}
						onChangeText={setEmail}
					/>

					<Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
						Password
					</Label>
					<Input
						id="password"
						placeholder="Password"
						secureTextEntry
						value={password}
						onChangeText={setPassword}
					/>
				</CardContent>
				<CardFooter className="flex-col justify-content gap-4 flex-wrap">
					<Button onPress={submit} className="w-full">
						<Text>Login</Text>
					</Button>
					<Button
						onPress={() => navigation.navigate('Register')}
						variant={'secondary'}
						className="w-full"
					>
						<Text>Don't have an account? Register</Text>
					</Button>
					<Button
						onPress={() => navigation.navigate('Forgot-Password')}
						variant={'ghost'}
						className="w-full"
					>
						<Text>Forgot password?</Text>
					</Button>
				</CardFooter>
			</Card>
			<Text className="text-center text-muted-foreground">Your League. Your Team. Your Chat</Text>
		</View>
	);
}
