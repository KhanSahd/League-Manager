import { View, Text, Pressable, FlatList, TextInput, Modal } from "react-native";
import { useEffect, useState } from "react";
import { createLeague, getMyLeagues, League, updateLeague } from "../api/league";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { theme } from "../ui/theme";
import { EmptyState } from "../ui/EmptyState";
import SportIcon from "../ui/SportIcon";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";

export default function MyLeagues() {

  // const router = useRouter();
  const nav = useNavigation();

  const [leagues, setLeagues] = useState<League[]>([]);
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [fetching, setFetching] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);

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
    clearValues();
    await load();
    setCreating(false);
  }

  async function updateLeagueInfo(leagueId: string, name: string, sport: string) {
    if (!leagueId || !name || !sport) return;
    await updateLeague(leagueId, name, sport);
    await load();
  }

  function setValuesFromLeague(league: League) {
    setName(league.name);
    setSport(league.sport);
  }

  function clearValues() {
    setName("");
    setSport("");
    setSelectedLeague(null);
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
        backgroundColor: theme.colors.bg
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
                // router.push({
                //   pathname: "/teams",
                //   params: { leagueId: item.id, leagueName: item.name, role: item.role }
                // })
                nav.navigate("Teams", {
                    leagueId: item.id,
                    leagueName: item.name,
                    role: item.role
                } )
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
                    <Entypo name="edit" size={24} color={theme.colors.text} onPress={() => (
                      setSelectedLeague(item), setValuesFromLeague(item)
                    )} />
                  )}
                </View>
              </Card>
            </Pressable>
          )}
        />
      )}

      {fetching == false && (
        <View>
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
        </View>
      )}

      <Modal visible={selectedLeague !== null} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: '90%', backgroundColor: theme.colors.bg, padding: theme.spacing.lg, borderRadius: 8 }}>
            <Text style={{ fontSize: theme.textSize.md, color: theme.colors.text, fontWeight: "500", marginBottom: theme.spacing.sm }}>
              Edit League
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
            <Button
              label="Update League"
              onPress={async () => {
                if (selectedLeague) {
                  await updateLeagueInfo(selectedLeague.id, name, sport);
                  clearValues();
                }
              }}
            />
            <View style={{ height: theme.spacing.md }} />
            <Button
              label="Cancel"
              onPress={() => clearValues()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
