import { View, Text, FlatList, Pressable, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
// import { createTeam, deleteTeam, getTeams } from "../api/teams";
import { Card } from '../ui/Card';
import { emptyTextStyle, theme } from '../ui/theme';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import Entypo from '@expo/vector-icons/Entypo';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
	createTeamForLeague,
	fetchTeamsForLeague,
	removeTeamFromLeague,
} from '../redux/slices/TeamsSlice';
import { Team } from '../../types';
import { RootState } from '../redux/store';
import { useRoute } from '@react-navigation/native';

export default function Teams() {
	// const { leagueId, leagueName, role } = useLocalSearchParams();
	// const router = useRouter();
	const dispatch = useAppDispatch();
	const route = useRoute();
	const { leagueId } = route.params as { leagueId: string };

	const teams = useAppSelector((state: RootState) => state.teams.teams);
	const league = useAppSelector((state) => state.leagues.leagues?.find((l) => l.id === leagueId));
	const [name, setName] = useState('');
	const [creating, setCreating] = useState(false);
	// const canDelete = role != "MEMBER";
	const canDelete = true;

	async function load() {
		await dispatch(fetchTeamsForLeague({ leagueId: leagueId }));
	}

	async function submit() {
		if (!name) return;
		setCreating(true);
		// await createTeam(leagueId as string, name);
		await dispatch(createTeamForLeague({ leagueId: leagueId, name: name }));
		setName('');
		await load();
		setCreating(false);
	}

	async function removeTeam(teamId: string) {
		if (!teamId) return;
		// await deleteTeam(teamId as string);
		await dispatch(removeTeamFromLeague({ leagueId: leagueId, teamId: teamId }));
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
				{/* {leagueName} */}
				{league?.name || 'unknown'}
			</Text>

			{useAppSelector((state) => state.teams.loading) == true ? null : teams?.length === 0 ? (
				<EmptyState message="No teams in this league. Create a team below." />
			) : (
				<FlatList
					data={teams}
					keyExtractor={(t) => t.id}
					contentContainerStyle={{ gap: theme.spacing.sm }}
					renderItem={({ item }) => (
						<Pressable
							onPress={
								() =>
									// router.push({
									//   pathname: "/roster",
									//   params: { teamId: item.id, teamName: item.name, role: role },
									// })
									null // fix me
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

			{useAppSelector((state) => state.teams.loading) == false && (
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

					<Button label={creating ? 'Creating...' : 'Create Team'} onPress={submit} />
				</View>
			)}
		</View>
	);
}
