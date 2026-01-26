import { View, Text, FlatList, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { addPlayer, getPlayers, Player, removePlayer } from "../src/api/teams";
import { Button } from "../src/ui/Button";
import { Input } from "../src/ui/Input";
import { Card } from "../src/ui/Card";
import { emptyTextStyle, theme } from "../src/ui/theme";
import { EmptyState } from "../src/ui/EmptyState";
import Entypo from "@expo/vector-icons/Entypo";
import { League } from "../src/api/league";

export default function Roster() {
  const { teamId, teamName, role } = useLocalSearchParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState("");
  const [fetching, setFetching] = useState(true);
  const [creating, setCreating] = useState(false);
  const canDelete = role != "MEMBER";

  async function load() {
    setFetching(true);
    setPlayers(await getPlayers(teamId as string));
    setFetching(false);
  }

  async function submit() {
    if (!name) return;
    setCreating(true);
    await addPlayer(teamId as string, name);
    setName("");
    await load();
    setCreating(false);
  }

  async function deletePlayer(playerId: string) {
    if (!playerId) return;
    try {
      await removePlayer(teamId as string, playerId as string);
    }
    catch (error) {
      Alert.alert("Failed to remove player: " + error);
    }
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
        gap: theme.spacing.md,
      }}
    >
      {/* Screen title */}
      <Text
        style={{
          fontSize: theme.textSize.xl,
          color: theme.colors.text,
          fontWeight: "600",
        }}
      >
        {teamName}
      </Text>
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
                {canDelete &&
                  <Entypo name="trash" size={24} color="black"
                    onPress={() => deletePlayer(item.id)}
                  />
                }
              </View>
            </Card>
          )}
        />
          
      )}

      {/* Add player (secondary action) */}
      {fetching == false && (
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
      )}
    </View>
  );
}
