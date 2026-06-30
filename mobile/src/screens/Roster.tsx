import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { addPlayer, getPlayers, Player, removePlayer } from "../api/teams";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { emptyTextStyle, theme } from "../ui/theme";
import { EmptyState } from "../ui/EmptyState";
import Entypo from "@expo/vector-icons/Entypo";
import { League } from "../api/league";
import { confirm } from "../ui/Helper";

export default function Roster() {
  // const { teamId, teamName, role } = useLocalSearchParams();
  // const canDelete = role != "MEMBER";
  const canDelete = true;
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState("");
  const [fetching, setFetching] = useState(true);
  const [creating, setCreating] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);


  async function load() {
    setFetching(true);
    // setPlayers(await getPlayers(teamId as string));
    setFetching(false);
  }

  async function submit() {
    if (!name) return;
    setCreating(true);
    // await addPlayer(teamId as string, name);
    setName("");
    await load();
    setCreating(false);
  }

  async function deletePlayer(playerId: string) {
    if (!playerId) return;
    try {
      // await removePlayer(teamId as string, playerId as string);
    }
    catch (error) {
      Alert.alert("Failed to remove player: " + error);
    }
  }

  /**
   * Add a player ID to the selected IDs list.
   * @param playerId the ID of the player to add.
   */
  function addToSelectedIds(playerId: string) {
    setSelectedIds(ids => [...ids, playerId]);
  }

  /**
   * Remove a player ID from the selected IDs list.
   * @param playerId the ID of the player to remove.
   */
  function removeFromSelectedIds(playerId: string) {
    setSelectedIds(ids => ids.filter(id => id !== playerId));
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
        gap: theme.spacing.md,
      }}
    >
      {/* Screen title */}
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Text
          style={{
            fontSize: theme.textSize.xl,
            color: theme.colors.text,
            fontWeight: "600",
          }}
        >
          {/* {teamName} */}
        </Text>
        { canDelete && <Entypo name="edit" size={24} color={theme.colors.text}
          onPress={() => setInEditMode(!inEditMode)}
        /> }
      </View>
      {fetching ? null : players.length === 0 ? (
        <EmptyState message="No players added yet." />
      ) : (
        <FlatList
          data={players}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ gap: theme.spacing.sm }}
          renderItem={({ item }) => (
            <Card>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                // backgroundColor: theme.colors.muted,
                // padding: theme.spacing.md,
                // borderRadius: theme.radius.sm,
              }}>
                {inEditMode && canDelete && (
                  <TouchableOpacity style={{
                    borderRadius: "100%",
                    backgroundColor: selectedIds.includes(item.id) ? "green" : "transparent",
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    padding: 10,
                  }}
                  onPress={() => {
                    if (selectedIds.includes(item.id)) {
                      removeFromSelectedIds(item.id);
                    } else {
                      addToSelectedIds(item.id);
                    }
                  }}
                  >
                  </TouchableOpacity>  
                )}
                <Text
                  style={{
                    fontSize: theme.textSize.md,
                    color: theme.colors.text,
                    fontWeight: "500",
                    flex: 1,
                    textAlign: "center"
                  }}
                >
                  {item.name}
                </Text>
              </View>
            </Card>
          )}
        />
          
      )}

      {/* Add player (secondary action) */}
      {!fetching && !inEditMode ? (
        <Card>
          <Text
            style={{
              fontSize: theme.textSize.md,
              color: theme.colors.text,
              fontWeight: "500",
              marginBottom: theme.spacing.sm,
            }}
          >
            Add Player
          </Text>

          <Input
            placeholder="Player name"
            value={name}
            onChangeText={setName}
          />

          <View style={{ height: theme.spacing.md }} />

          <Button label="Add Player" onPress={submit} />
        </Card>
      ) : (
        inEditMode && canDelete && (
          <Button
            label={`Remove Selected Players (${selectedIds.length})`}
            variant="danger"
            onPress={async () => {
              const shouldDelete = await confirm(
                `Are you sure you want to remove ${selectedIds.length} player(s)?`
              );
              if (!shouldDelete) return;

              for (const playerId of selectedIds) {
                await deletePlayer(playerId);
              }

              setSelectedIds([]);
              setInEditMode(false);
              await load();
            }}
          />
        )
      )}
    </View>
  );
}
