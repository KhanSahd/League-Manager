import { View, Text } from "react-native";
import { theme } from "../ui/theme";
import { Button } from "../ui/Button";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../redux/slices/AuthSlice";
import * as SecureStore from "expo-secure-store";
import { useAppDispatch } from "../redux/hooks";
import { RootStackParamList } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";

export default function Home() {
  // const { user, signOut } = useAuth();
  
  type navigationProp = StackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<navigationProp>();
  const dispatch = useAppDispatch();

  async function doLogOut()
  {
    await SecureStore.deleteItemAsync("token");
    dispatch(logout())
  }

  return (
    <View style={{ backgroundColor: theme.colors.bg, flex: 1, padding: 20, gap: 12 }}>
      <Text
        style={{
          fontSize: theme.textSize.md,
          color: theme.colors.text,
          fontWeight: "500",
        }}
      >
        {/* Welcome {user?.firstName + " " + user?.lastName} */}
        Welcome Sahd Khan
      </Text>

      <View
        style={{padding: theme.spacing.md}}
      >
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
            onPress={() => {
              navigation.navigate("Join Leagues")
            }}
          />

          <Button
            label="View My Leagues"
            onPress={() => navigation.navigate( "MyLeagues" )}
          />
        </View>
      </View>

      <View style={{ marginTop: "auto" }}>
        <Button
          label="Logout"
          onPress={() => doLogOut()}
          variant="danger"
        />
      </View>
    </View>
  );
}
