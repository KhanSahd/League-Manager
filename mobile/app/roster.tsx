import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { addPlayer, getPlayers, Player } from "../src/api/teams";
import { Button } from "../src/ui/Button";
import { Input } from "../src/ui/Input";
import { Card } from "../src/ui/Card";
import { emptyTextStyle, theme } from "../src/ui/theme";
import { EmptyState } from "../src/ui/EmptyState";

export default function Roster() {
  const { teamId, teamName } = useLocalSearchParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState("");
  const [fetching, setFetching] = useState(true);
  const [creating, setCreating] = useState(false);

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
              <Text
                style={{
                  fontSize: theme.textSize.md,
                  color: theme.colors.text,
                  fontWeight: "500",
                }}
              >
                {item.name}
              </Text>
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
