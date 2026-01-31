import { View, Text, FlatList, Pressable, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createTeam, deleteTeam, getTeams, Team } from "../src/api/teams";
import { Card } from "../src/ui/Card";
import { emptyTextStyle, theme } from "../src/ui/theme";
import { Input } from "../src/ui/Input";
import { Button } from "../src/ui/Button";
import { EmptyState } from "../src/ui/EmptyState";
import Entypo from "@expo/vector-icons/Entypo";

export default function Teams() {
  const { leagueId, leagueName, role } = useLocalSearchParams();
  const router = useRouter();

  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState("");
  const [fetching, setFetching] = useState(true);
  const [creating, setCreating] = useState(false);
  const canDelete = role != "MEMBER";

  async function load() {
    setFetching(true);
    const data = await getTeams(leagueId as string);
    setTeams(data);
    setFetching(false);
  }

  async function submit() {
    if (!name) return;
    setCreating(true);
    await createTeam(leagueId as string, name);
    setName("");
    await load();
    setCreating(false);
  }

  async function removeTeam(teamId: string) {
    if (!teamId) return;
    await deleteTeam(teamId as string);
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
      <Text
        style={{
          fontSize: theme.textSize.xl,
          color: theme.colors.text,
          fontWeight: "600",
        }}
      >
        {leagueName}
      </Text>

      {fetching ? null : teams.length === 0 ? (
        <EmptyState message="No teams in this league. Create a team below." />
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ gap: theme.spacing.sm }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/roster",
                  params: { teamId: item.id, teamName: item.name, role: role },
                })
              }
            >
              <Card>
                <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
                  <Text
                    style={{
                      fontSize: theme.textSize.md,
                      color: theme.colors.text,
                      fontWeight: "500",
                      flex: 1,
                    }}
                  >
                    {item.name}
                  </Text>
                  {canDelete &&
                    <Entypo name="trash" size={24} color={theme.colors.text}
                      onPress={() => removeTeam(item.id)}
                    />
                  }
                </View>
              </Card>
            </Pressable>
          )}
        />
      )}
      
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
              Create Team
            </Text> 
          <Input placeholder="Team name" value={name} onChangeText={setName} />

          <View style={{ height: theme.spacing.md }} />

          <Button label={creating ? "Creating..." : "Create Team"} onPress={submit} />
        </Card>
      )}
    </View>
  );
}
