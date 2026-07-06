import { View, Pressable, FlatList, TextInput, Modal } from 'react-native';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Text } from '../ui/text';
import { theme } from '../ui/theme';
import { EmptyState } from '../ui/EmptyState';
import SportIcon from '../ui/SportIcon';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import {
	clearSelectedLeague,
	createNewLeague,
	doDeleteLeague,
	setSelectedLeague,
	updateLeagueInfo,
} from '../redux/slices/leaguesSlice';
import { RootState } from '../redux/store';
import { League, RootStackParamList, Sport } from '../../types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { StackNavigationProp } from '@react-navigation/stack';
import { THEME } from '@/lib/theme';
import { Label } from '@/ui/label';
import Sports from '@/ui/Sports';

export default function MyLeagues() {
	// const router = useRouter();
	type navigationProp = StackNavigationProp<RootStackParamList>;
	const nav = useNavigation<navigationProp>();

	const leagues = useAppSelector((state: RootState) => state.leagues.leagues);
	const selectedLeague = useAppSelector((state: RootState) => state.leagues.selectedLeague);
	const [createName, setCreateName] = useState('');
	const [createSport, setCreateSport] = useState<Sport | null>(null);
	const [updateName, setUpdateName] = useState('');
	const [updateSport, setUpdateSport] = useState<Sport | null>(null);
	const [creating, setCreating] = useState(false);
	const dispatch = useAppDispatch();
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [confirmText, setConfirmText] = useState('');

	async function submit() {
		if (!createName || !createSport) return;
		setCreating(true);
		console.log(createName, createSport);
		await dispatch(createNewLeague({ name: createName, sport: createSport }));
		clearValues();
		setCreating(false);
	}

	async function updateLeague() {
		if (!updateName || !updateSport) return;
		const id = selectedLeague?.id;
		if (!id) return;
		console.log(updateName, updateSport);
		await dispatch(updateLeagueInfo({ id, name: updateName, sport: updateSport }));
	}

	function setValuesFromLeague(league: League) {
		setUpdateName(league.name);
		setUpdateSport(league.sport);
	}

	function clearValues() {
		setUpdateName('');
		setUpdateSport(null);
		setCreateName('');
		setCreateSport(null);
		dispatch(clearSelectedLeague());
	}

	function deleteLeague() {
		if (selectedLeague?.id) {
			dispatch(doDeleteLeague(selectedLeague?.id));
		}
		clearValues();
	}

	return (
		<View
			style={{
				flex: 1,
				paddingHorizontal: theme.spacing.lg,
				paddingBottom: theme.spacing.lg,
				gap: theme.spacing.md,
				backgroundColor: THEME.light.background,
			}}
		>
			{/* Create League Button */}
			<View className="items-end pt-5">
				<Button className="w-1/3" onPress={() => setShowCreateModal(true)}>
					<Text numberOfLines={1} adjustsFontSizeToFit={true}>
						Create League
					</Text>
				</Button>
			</View>
			{useAppSelector((state: RootState) => state.leagues.loading) ? null : leagues?.length ===
			  0 ? (
				<EmptyState message="You are not part of any leagues yet." />
			) : (
				<FlatList
					data={leagues}
					keyExtractor={(l) => l.id}
					contentContainerStyle={{ gap: theme.spacing.sm }}
					renderItem={({ item }) => (
						<Pressable
							style={{ paddingVertical: 6 }}
							onPress={() => {
								nav.navigate('Teams', { leagueId: item.id });
							}}
						>
							<Card>
								<CardContent>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'space-between',
										}}
									>
										{/* LEFT SIDE OF THE CARD. */}
										<View style={{ flexDirection: 'column', gap: theme.spacing.xs, flex: 1 }}>
											{/* TOP ROW OF THE LEFT HALF OF THE CARD. CONTAINS THE SPORT ICON AND LEAGUE NAME */}
											<View
												style={{
													flexDirection: 'row',
													alignItems: 'center',
													gap: theme.spacing.sm,
												}}
											>
												<SportIcon sport={item.sport} />
												<Text
													style={{
														fontSize: theme.textSize.md,
														color: theme.colors.text,
														fontWeight: '500',
													}}
												>
													{item.name}
												</Text>
											</View>
											{/* BOTTOM ROW OF THE LEFT HALF OF THE CARD. CONTAINS THE SPORT AND ROLE */}
											<Text
												style={{
													fontSize: theme.textSize.sm,
													color: theme.colors.muted,
													marginTop: theme.spacing.xs,
												}}
											>
												{item.sport?.name} · {item.role}
											</Text>
										</View>
										{/* RIGHT SIDE OF THE CARD. HAS THE EDIT ICON */}
										{(item.role === 'OWNER' || item.role === 'ADMIN') && (
											<Entypo
												name="dots-three-vertical"
												size={16}
												color={theme.colors.text}
												onPress={() => (
													dispatch(setSelectedLeague(item)),
													setValuesFromLeague(item)
												)}
											/>
										)}
									</View>
								</CardContent>
							</Card>
						</Pressable>
					)}
				/>
			)}

			<Modal visible={showCreateModal} animationType="slide" transparent={true}>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'rgba(0,0,0,0.5)',
					}}
				>
					<Card>
						<CardHeader>
							<CardTitle>Create League</CardTitle>
						</CardHeader>
						{/* <Text
						style={{
							fontSize: theme.textSize.md,
							color: theme.colors.text,
							fontWeight: '500',
							marginBottom: theme.spacing.sm,
						}}
					>
						Create League
					</Text> */}
						<CardContent>
							<View className="gap-5">
								<Label htmlFor="leagueName">League Name</Label>
								<Input
									id="leagueName"
									placeholder="League name"
									value={createName}
									onChangeText={setCreateName}
								/>
								<Label htmlFor="sport">Sport</Label>
								<Sports onDataChange={setCreateSport} currentSport={null} />
							</View>
						</CardContent>
						<CardFooter className="flex-col gap-2">
							<Button onPress={submit} className="w-full">
								<Text>{creating ? 'Creating...' : 'Create'}</Text>
							</Button>
							<Button
								variant={'secondary'}
								className="w-full"
								onPress={() => setShowCreateModal(false)}
							>
								<Text>Cancel</Text>
							</Button>
						</CardFooter>
					</Card>
				</View>
			</Modal>

			<Modal visible={selectedLeague !== null} animationType="slide" transparent={true}>
				{showDeleteConfirmation ? (
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: 'rgba(0,0,0,0.5)',
						}}
					>
						<Card>
							<View
								style={{
									width: '90%',
									backgroundColor: theme.colors.bg,
									padding: theme.spacing.lg,
									borderRadius: 8,
									gap: theme.spacing.md,
								}}
							>
								<CardHeader>
									<Text className="text-lg font-bold text-center">
										Are you sure you want to delete this league?
									</Text>
								</CardHeader>
								<CardDescription>
									<View className="flex-col items-center justify-center w-full">
										<Text className="text-sm text-muted-foreground">
											This action cannot be undone.
										</Text>
										<Text className="text-sm text-muted-foreground">Type "DELETE" to confirm:</Text>
									</View>
								</CardDescription>
								<CardContent>
									<Input
										onChangeText={setConfirmText}
										value={confirmText}
										placeholder="Type DELETE to confirm"
									/>
								</CardContent>
								<CardFooter>
									<View className="flex-col justify-center w-full gap-2">
										<Button
											variant={'destructive'}
											onPress={async () => {
												if (selectedLeague && confirmText === 'DELETE') {
													await deleteLeague();
													setShowDeleteConfirmation(false);
													clearValues();
												}
											}}
										>
											<Text numberOfLines={1} adjustsFontSizeToFit={true}>
												Delete League
											</Text>
										</Button>
										<Button
											variant={'secondary'}
											onPress={() => {
												setShowDeleteConfirmation(false);
												setConfirmText('');
											}}
										>
											<Text>Cancel</Text>
										</Button>
									</View>
								</CardFooter>
							</View>
						</Card>
					</View>
				) : (
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: 'rgba(0,0,0,0.5)',
						}}
					>
						<View
							style={{
								width: '90%',
								backgroundColor: theme.colors.bg,
								padding: theme.spacing.lg,
								borderRadius: 8,
								gap: theme.spacing.md,
							}}
						>
							<Text
								style={{
									fontSize: theme.textSize.md,
									color: theme.colors.text,
									fontWeight: '500',
									marginBottom: theme.spacing.sm,
								}}
							>
								Edit League
							</Text>
							<Input placeholder="League name" value={updateName} onChangeText={setUpdateName} />
							<Sports onDataChange={setUpdateSport} currentSport={updateSport} />
							<Button
								onPress={async () => {
									if (selectedLeague) {
										if (updateSport) {
											await updateLeague();
											clearValues();
										}
									}
								}}
							>
								<Text>Update League</Text>
							</Button>
							<Button variant={'secondary'} onPress={() => clearValues()}>
								<Text>Cancel</Text>
							</Button>
							<Button variant={'destructive'} onPress={() => setShowDeleteConfirmation(true)}>
								<Text>Delete League</Text>
							</Button>
						</View>
					</View>
				)}
			</Modal>
		</View>
	);
}
