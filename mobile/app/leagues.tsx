import { View, Text, Pressable, FlatList, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { createLeague, getMyLeagues, League } from "../src/api/league";
import { useRouter } from "expo-router";
import { Card } from "../src/ui/Card";
import { Input } from "../src/ui/Input";
import { Button } from "../src/ui/Button";
import { theme } from "../src/ui/theme";
import { EmptyState } from "../src/ui/EmptyState";
import SportIcon from "../src/ui/SportIcon";
import Entypo from "@expo/vector-icons/Entypo";

export default function Leagues() {

  const router = useRouter();

  const [leagues, setLeagues] = useState<League[]>([]);
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [fetching, setFetching] = useState(true);
  const [creating, setCreating] = useState(false);

  async function load() {
    setFetching(true);
    const data = await getMyLeagues();
    setLeagues(data);
    setFetching(false);
  }

  async function submit() {
    if (!name || !sport) return;
    setCreating(true);
    await createLeague(name, sport);
    setName("");
    setSport("");
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
      {fetching ? null : leagues.length === 0 ? (
        <EmptyState message="You are not part of any leagues yet." />
      ) : (
        <FlatList
          data={leagues}
          keyExtractor={(l) => l.id}
          contentContainerStyle={{ gap: theme.spacing.sm }}
          renderItem={({ item }) => (
            <Pressable style={{ paddingVertical: 6 }}
              onPress={() => {
                router.push({
                  pathname: "/teams",
                  params: { leagueId: item.id, leagueName: item.name, role: item.role }
                })
              }}
            >
              <Card>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  {/* LEFT SIDE OF THE CARD. */}
                  <View style={{ flexDirection: "column", gap: theme.spacing.xs, flex: 1 }}>
                    {/* TOP ROW OF THE LEFT HALF OF THE CARD. CONTAINS THE SPORT ICON AND LEAGUE NAME */}
                    <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
                      <SportIcon sport={item.sport} />
                      <Text
                        style={{
                          fontSize: theme.textSize.md,
                          color: theme.colors.text,
                          fontWeight: "500",
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
                  { (item.role === "OWNER" || item.role === "ADMIN") && (
                    <Entypo name="edit" size={24} color={theme.colors.text} />
                  )}
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
            Create League
          </Text>

          <Input
            placeholder="League name"
            value={name}
            onChangeText={setName}
          />

          <Input
            placeholder="Sport"
            value={sport}
            onChangeText={setSport}
          />

          <View style={{ height: theme.spacing.md }} />

          <Button label={creating ? "Creating..." : "Create"} onPress={submit} />
        </Card>
        
      )}
    </View>
  );
}
