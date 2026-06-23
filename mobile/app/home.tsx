import { View, Text, Pressable } from "react-native";
import { useAuth } from "../src/auth/AuthContext";
import { useRouter } from "expo-router";
import { theme } from "../src/ui/theme";
import { Card } from "../src/ui/Card";
import { Button } from "../src/ui/Button";

export default function Home() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text
        style={{
          fontSize: theme.textSize.md,
          color: theme.colors.muted,
          fontWeight: "500",
        }}
      >
        Welcome {user?.firstName + " " + user?.lastName}
      </Text>

      <Card>
        <Text
          style={{
            fontSize: theme.textSize.lg,
            color: theme.colors.text,
            fontWeight: "500",
            marginBottom: theme.spacing.sm,
          }}
        >
          Leagues
        </Text>

        <View style={{
          flexDirection: "column",
          gap: "15"
        }}>
          <Button
            label="Join Leagues"
            onPress={() => router.push("/findleagues")}
          />

          <Button
            label="View My Leagues"
            onPress={() => router.push("/myleagues")}
          />
        </View>
      </Card>

      <View style={{ marginTop: "auto" }}>
        <Button
          label="Logout"
          onPress={signOut}
          variant="danger"
        />
      </View>
    </View>
  );
}
