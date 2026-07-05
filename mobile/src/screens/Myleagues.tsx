import { View, Pressable, FlatList, TextInput, Modal } from 'react-native';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
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
	setSelectedLeague,
	updateLeagueInfo,
} from '../redux/slices/leaguesSlice';
import { RootState } from '../redux/store';
import { League, RootStackParamList } from '../../types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { StackNavigationProp } from '@react-navigation/stack';
import { THEME } from '@/lib/theme';
import { Label } from '@/ui/label';

export default function MyLeagues() {
	// const router = useRouter();
	type navigationProp = StackNavigationProp<RootStackParamList>;
	const nav = useNavigation<navigationProp>();

	const leagues = useAppSelector((state: RootState) => state.leagues.leagues);
	const selectedLeague = useAppSelector((state: RootState) => state.leagues.selectedLeague);
	const [createName, setCreateName] = useState('');
	const [createSport, setCreateSport] = useState('');
	const [updateName, setUpdateName] = useState('');
	const [updateSport, setUpdateSport] = useState('');
	const [creating, setCreating] = useState(false);
	const dispatch = useAppDispatch();

	async function submit() {
		if (!createName || !createSport) return;
		setCreating(true);
		await dispatch(createNewLeague({ name: createName, sport: createSport }));
		clearValues();
		setCreating(false);
	}

	async function updateLeague(name: string, sport: string) {
		if (!name || !sport) return;
		const id = selectedLeague?.id;
		if (!id) return;
		await dispatch(updateLeagueInfo({ id, name, sport }));
	}

	function setValuesFromLeague(league: League) {
		setUpdateName(league.name);
		setUpdateSport(league.sport);
	}

	function clearValues() {
		setUpdateName('');
		setUpdateSport('');
		dispatch(clearSelectedLeague());
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
												{item.sport} · {item.role}
											</Text>
										</View>
										{/* RIGHT SIDE OF THE CARD. HAS THE  */}
										{(item.role === 'OWNER' || item.role === 'ADMIN') && (
											<Entypo
												name="edit"
												size={24}
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

			{useAppSelector((state: RootState) => !state.leagues.loading) && (
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
							<Input
								id="sport"
								placeholder="Sport"
								value={createSport}
								onChangeText={setCreateSport}
							/>
						</View>
					</CardContent>
					<CardFooter className="flex-col gap-2">
						<Button variant={'default'} onPress={submit} className="w-full">
							<Text>{creating ? 'Creating...' : 'Create'}</Text>
						</Button>
					</CardFooter>
				</Card>
			)}

			<Modal visible={selectedLeague !== null} animationType="slide" transparent={true}>
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
						<Input placeholder="Sport" value={updateSport} onChangeText={setUpdateSport} />
						<View style={{ height: theme.spacing.md }} />
						<Button
							onPress={async () => {
								if (selectedLeague) {
									await updateLeague(updateName, updateSport);
									clearValues();
								}
							}}
						>
							<Text>Update League</Text>
						</Button>
						<View style={{ height: theme.spacing.md }} />
						<Button variant={'secondary'} onPress={() => clearValues()}>
							<Text>Cancel</Text>
						</Button>
					</View>
				</View>
			</Modal>
		</View>
	);
}
