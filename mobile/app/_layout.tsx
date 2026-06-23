import { Slot, useSegments } from "expo-router";
import { AuthProvider } from "../src/auth/AuthContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../src/ui/theme";
import { Header } from "../src/ui/Header";
import { View } from "react-native";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";


export default function RootLayout() {
  const segments = useSegments();
  const titleMap: Record<string, string> = {
    home: "Home",
    myleagues: "My Leagues",
    teams: "Teams",
    roster: "Roster",
    login: "Login",
    findleagues: "Find a League"
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
        <Provider store={store}>
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
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
