import { View, FlatList, Pressable, Modal } from 'react-native';
import { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { theme } from '../ui/theme';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Text } from '../ui/text';
import { EmptyState } from '../ui/EmptyState';
import Entypo from '@expo/vector-icons/Entypo';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
	createTeamForLeague,
	fetchTeamsForLeague,
	removeTeamFromLeague,
} from '../redux/slices/TeamsSlice';
import {
	activateSeasonById,
	createSeasonForLeague,
	fetchSeasonsForLeague,
} from '../redux/slices/SeasonsSlice';
import { LeaguesStackParamList } from '../../types';
import { RootState } from '../redux/store';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export default function Teams() {
	type navigationProp = StackNavigationProp<LeaguesStackParamList>;
	type routeProp = RouteProp<LeaguesStackParamList, 'Teams'>;

	const dispatch = useAppDispatch();
	const navigation = useNavigation<navigationProp>();
	const route = useRoute<routeProp>();
	const { leagueId } = route.params;

	const teams = useAppSelector((state: RootState) => state.teams.teams);
	const league = useAppSelector((state) => state.leagues.leagues?.find((l) => l.id === leagueId));
	const seasons = useAppSelector((state: RootState) => state.seasons.seasons);
	const activeSeason = useAppSelector((state: RootState) => state.seasons.activeSeason);
	const [name, setName] = useState('');
	const [creating, setCreating] = useState(false);
	const [showSeasonModal, setShowSeasonModal] = useState(false);
	const [newSeasonName, setNewSeasonName] = useState('');
	const [creatingSeason, setCreatingSeason] = useState(false);
	const role = league?.role;
	const canDelete = role !== 'MEMBER';
	const canManageSeasons = role === 'OWNER' || role === 'ADMIN';
	const loading = useAppSelector((state: RootState) => state.teams.loading);

	async function load() {
		await dispatch(fetchTeamsForLeague({ leagueId: leagueId }));
		await dispatch(fetchSeasonsForLeague({ leagueId: leagueId }));
	}

	async function submit() {
		if (!name) return;
		setCreating(true);
		await dispatch(createTeamForLeague({ leagueId: leagueId, name: name }));
		setName('');
		await load();
		setCreating(false);
	}

	async function removeTeam(teamId: string) {
		if (!teamId) return;
		await dispatch(removeTeamFromLeague({ leagueId: leagueId, teamId: teamId }));
		await load();
	}

	async function switchToSeason(seasonId: string) {
		await dispatch(activateSeasonById({ seasonId }));
		setShowSeasonModal(false);
		await load();
	}

	async function submitNewSeason() {
		if (!newSeasonName) return;
		setCreatingSeason(true);
		await dispatch(createSeasonForLeague({ leagueId, name: newSeasonName, activate: true }));
		setNewSeasonName('');
		setCreatingSeason(false);
		setShowSeasonModal(false);
		await load();
	}

	useEffect(() => {
		load();
	}, []);

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
			<Text
				style={{
					fontSize: theme.textSize.xl,
					color: theme.colors.text,
					fontWeight: '600',
				}}
			>
				{league?.name || 'unknown'}
			</Text>

			<Pressable
				disabled={!canManageSeasons}
				onPress={() => setShowSeasonModal(true)}
				style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}
			>
				<Text style={{ color: theme.colors.primary, fontWeight: '500' }}>
					{activeSeason?.name ?? 'Loading season...'}
				</Text>
				{canManageSeasons && <Entypo name="chevron-down" size={16} color={theme.colors.primary} />}
			</Pressable>

			{loading ? null : teams?.length === 0 ? (
				<EmptyState message="No teams in this league. Create a team below." />
			) : (
				<FlatList
					data={teams}
					keyExtractor={(t) => t.id}
					contentContainerStyle={{ gap: theme.spacing.sm }}
					renderItem={({ item }) => (
						<Pressable
							onPress={() =>
								navigation.navigate('Roster', { teamId: item.id, teamName: item.name })
							}
						>
							<Card>
								<View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
									<Text
										style={{
											fontSize: theme.textSize.md,
											color: theme.colors.text,
											fontWeight: '500',
											flex: 1,
										}}
									>
										{item.name}
									</Text>
									{canDelete && (
										<Entypo
											name="trash"
											size={24}
											color={theme.colors.text}
											onPress={() => removeTeam(item.id)}
										/>
									)}
								</View>
							</Card>
						</Pressable>
					)}
				/>
			)}

			{!loading && (
				<View style={{ flex: 1, justifyContent: 'flex-end' }}>
					<Text
						style={{
							fontSize: theme.textSize.md,
							color: theme.colors.text,
							fontWeight: '500',
							marginBottom: theme.spacing.sm,
						}}
					>
						Create Team
					</Text>
					<Input placeholder="Team name" value={name} onChangeText={setName} />

					<View style={{ height: theme.spacing.md }} />

					<Button onPress={submit} disabled={creating}>
						<Text>{creating ? 'Creating...' : 'Create Team'}</Text>
					</Button>
				</View>
			)}

			<Modal visible={showSeasonModal} animationType="slide" transparent onRequestClose={() => setShowSeasonModal(false)}>
				<View
					style={{
						flex: 1,
						justifyContent: 'flex-end',
						backgroundColor: 'rgba(0,0,0,0.4)',
					}}
				>
					<View
						style={{
							backgroundColor: theme.colors.bg,
							padding: theme.spacing.lg,
							borderTopLeftRadius: theme.radius.md,
							borderTopRightRadius: theme.radius.md,
							gap: theme.spacing.sm,
						}}
					>
						<Text style={{ fontSize: theme.textSize.lg, fontWeight: '600', color: theme.colors.text }}>
							Seasons
						</Text>

						{seasons?.map((season) => (
							<Pressable key={season.id} onPress={() => switchToSeason(season.id)}>
								<Card>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
										<Text style={{ color: theme.colors.text }}>{season.name}</Text>
										{season.active && <Text style={{ color: theme.colors.primary }}>Active</Text>}
									</View>
								</Card>
							</Pressable>
						))}

						<View style={{ height: theme.spacing.sm }} />
						<Input
							placeholder="New season name"
							value={newSeasonName}
							onChangeText={setNewSeasonName}
						/>
						<View style={{ height: theme.spacing.sm }} />
						<Button onPress={submitNewSeason} disabled={creatingSeason || !newSeasonName}>
							<Text>{creatingSeason ? 'Starting...' : 'Start New Season'}</Text>
						</Button>
						<Button variant="ghost" onPress={() => setShowSeasonModal(false)}>
							<Text>Close</Text>
						</Button>
					</View>
				</View>
			</Modal>
		</View>
	);
}
