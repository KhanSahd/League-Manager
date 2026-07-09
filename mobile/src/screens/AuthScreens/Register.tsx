import { View } from 'react-native';
import React, { useState } from 'react';
import { api } from '../../api/client';
import { theme } from '../../ui/theme';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { useNavigation } from '@react-navigation/native';
import { AuthResponse } from '../../../types';
import * as SecureStore from 'expo-secure-store';
import { loginSuccess, setToken } from '../../redux/slices/AuthSlice';
import { useAppDispatch } from '../../redux/hooks';
import { Text } from '@/ui/text';
import { Card, CardContent, CardFooter, CardHeader } from '@/ui/Card';
import { Label } from '@/ui/label';

type User = { id: string; firstName: string; lastName: string; email: string };

const Register = () => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmedPassword, setConfirmedPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const navigation = useNavigation();
	const dispatch = useAppDispatch();

	async function submit() {
		setError(null);
		try {
			const res = await api<AuthResponse>('/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ firstName, lastName, email, password }),
			});
			await SecureStore.setItemAsync('token', res.token);
			dispatch(setToken(res.token));
			const user = await api<User>('/me');
			dispatch(loginSuccess({ user: user }));
			//   router.replace("/home");
		} catch (e: any) {
			setError(e.message);
		}
	}

	return (
		<View
			style={{
				flex: 1,
				paddingHorizontal: theme.spacing.lg,
				paddingBottom: theme.spacing.lg,
				paddingTop: theme.spacing.lg,
				gap: theme.spacing.md,
			}}
		>
			<Card>
				<CardHeader>
					<Text className="text-2xl font-bold">{error ? error : 'Enter your details'}</Text>
				</CardHeader>

				{/* First and Last name row */}
				<CardContent className="flex-row justify-center gap-5">
					<View className="w-1/2">
						<Label htmlFor="first-name" className="text-sm font-medium text-muted-foreground">
							First Name
						</Label>
						<Input
							id="first-name"
							placeholder="First Name"
							autoCapitalize="none"
							value={firstName}
							onChangeText={setFirstName}
						/>
					</View>
					<View className="w-1/2">
						<Label htmlFor="last-name" className="text-sm font-medium text-muted-foreground">
							Last Name
						</Label>
						<Input
							id="last-name"
							placeholder="Last Name"
							autoCapitalize="none"
							value={lastName}
							onChangeText={setLastName}
						/>
					</View>
				</CardContent>
				<CardContent className="flex-col gap-3 w-full p-3">
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

					<Label htmlFor="confirm-password" className="text-sm font-medium text-muted-foreground">
						Confirm Password
					</Label>
					<Input
						id="confirm-password"
						placeholder="Confirm Password"
						secureTextEntry
						value={confirmedPassword}
						onChangeText={setConfirmedPassword}
					/>
				</CardContent>
				<CardFooter className="flex-col gap-3 w-full">
					<Button onPress={submit} className="w-full">
						<Text>Register</Text>
					</Button>
					<Button
						onPress={() => navigation.navigate('Login')}
						variant="secondary"
						className="w-full"
					>
						<Text>Already have an account? Login</Text>
					</Button>
				</CardFooter>
			</Card>
		</View>
	);
};

export default Register;
