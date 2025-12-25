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
        Account
      </Text>
      
      {user &&
        <Text
        style={{
              fontSize: theme.textSize.sm,
              color: theme.colors.muted,
              marginTop: theme.spacing.xs,
            }}
      >
          {user.email}
        </Text>
      }

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

        <Button
          label="View My Leagues"
          onPress={() => router.push("/leagues")}
        />
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
