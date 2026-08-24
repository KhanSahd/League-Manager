import { View, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Text } from '../ui/text';
import { theme } from '../ui/theme';
import { EmptyState } from '../ui/EmptyState';
import Entypo from '@expo/vector-icons/Entypo';
import { confirm } from '../ui/Helper';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
	addPlayerToTeam,
	fetchPlayersForTeam,
	removePlayerFromTeam,
} from '../redux/slices/PlayersSlice';
import { RootState } from '../redux/store';
import { LeaguesStackParamList } from '../../types';
import { RouteProp, useRoute } from '@react-navigation/native';

export default function Roster() {
	type routeProp = RouteProp<LeaguesStackParamList, 'Roster'>;
	const route = useRoute<routeProp>();
	const { teamId } = route.params;

	const dispatch = useAppDispatch();
	const players = useAppSelector((state: RootState) => state.players.players);
	const loading = useAppSelector((state: RootState) => state.players.loading);
	const canDelete = true;

	const [name, setName] = useState('');
	const [creating, setCreating] = useState(false);
	const [inEditMode, setInEditMode] = useState(false);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	async function load() {
		await dispatch(fetchPlayersForTeam({ teamId }));
	}

	async function submit() {
		if (!name) return;
		setCreating(true);
		await dispatch(addPlayerToTeam({ teamId, name }));
		setName('');
		setCreating(false);
	}

	function addToSelectedIds(playerId: string) {
		setSelectedIds((ids) => [...ids, playerId]);
	}

	function removeFromSelectedIds(playerId: string) {
		setSelectedIds((ids) => ids.filter((id) => id !== playerId));
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
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'flex-end',
					alignItems: 'center',
				}}
			>
				{canDelete && (
					<Entypo
						name="edit"
						size={24}
						color={theme.colors.text}
						onPress={() => setInEditMode(!inEditMode)}
					/>
				)}
			</View>

			{loading ? null : players?.length === 0 || !players ? (
				<EmptyState message="No players added yet." />
			) : (
				<FlatList
					data={players}
					keyExtractor={(p) => p.id}
					contentContainerStyle={{ gap: theme.spacing.sm }}
					renderItem={({ item }) => (
						<Card>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									gap: theme.spacing.sm,
								}}
							>
								{inEditMode && canDelete && (
									<TouchableOpacity
										style={{
											borderRadius: 100,
											backgroundColor: selectedIds.includes(item.id)
												? theme.colors.primary
												: 'transparent',
											borderWidth: 1,
											borderColor: theme.colors.border,
											width: 22,
											height: 22,
										}}
										onPress={() => {
											if (selectedIds.includes(item.id)) {
												removeFromSelectedIds(item.id);
											} else {
												addToSelectedIds(item.id);
											}
										}}
									/>
								)}
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
							</View>
						</Card>
					)}
				/>
			)}

			{!inEditMode ? (
				<Card>
					<Text
						style={{
							fontSize: theme.textSize.md,
							color: theme.colors.text,
							fontWeight: '500',
							marginBottom: theme.spacing.sm,
						}}
					>
						Add Player
					</Text>

					<Input placeholder="Player name" value={name} onChangeText={setName} />

					<View style={{ height: theme.spacing.md }} />

					<Button onPress={submit} disabled={creating}>
						<Text>{creating ? 'Adding...' : 'Add Player'}</Text>
					</Button>
				</Card>
			) : (
				canDelete && (
					<Button
						variant="destructive"
						onPress={async () => {
							const shouldDelete = await confirm(
								`Are you sure you want to remove ${selectedIds.length} player(s)?`
							);
							if (!shouldDelete) return;

							for (const playerId of selectedIds) {
								await dispatch(removePlayerFromTeam({ teamId, playerId }));
							}

							setSelectedIds([]);
							setInEditMode(false);
						}}
					>
						<Text>Remove Selected Players ({selectedIds.length})</Text>
					</Button>
				)
			)}
		</View>
	);
}
