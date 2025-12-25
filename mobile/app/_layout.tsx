import { Slot, useSegments } from "expo-router";
import { AuthProvider } from "../src/auth/AuthContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../src/ui/theme";
import { Header } from "../src/ui/Header";
import { View } from "react-native";


export default function RootLayout() {
  const segments = useSegments();
  const titleMap: Record<string, string> = {
    home: "Home",
    leagues: "My Leagues",
    teams: "Teams",
    roster: "Roster",
    login: "Login",
  };

  const current = segments[segments.length - 1];
  const title = titleMap[current] ?? "";

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.colors.bg,
        }}
        edges={["top", "left", "right"]}
      >
        <AuthProvider>
          {title ? <Header title={title} /> : null}
          <View
              style={{
                flex: 1,
                paddingTop: theme.spacing.md,
              }}
          >
            <Slot />
          </View>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
