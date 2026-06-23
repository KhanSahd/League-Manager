import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "./theme";
import Entypo from '@expo/vector-icons/Entypo';

export function Header({ title }: { title: string }) {
  const router = useRouter();
  const canGoBack = router.canGoBack();

  /**
   * Checks if the current page is the home page.
   * Useful for rendering the hamburger on the homescreen since
   * technically on the homescreen we cannot go back and therefore the 
   * menu icon would not be displayed.
   * @returns boolean indicating true or false if on home screen or not.
   */
  function isHome() : boolean
  {
    return title.toLowerCase() == "home"
  }

  return (
    <View
      style={{
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.card,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        {canGoBack ? (
          <Pressable
            onPress={() => router.back()}
            style={{ paddingRight: theme.spacing.md }}
          >
            <Text
              style={{
                color: theme.colors.primary,
                fontSize: theme.textSize.md,
              }}
            >
              ←
            </Text>
          </Pressable>
        ) : (
            // <View style={{ width: 24 }} />
            <></>
        )}

        <Text
          style={{
            fontSize: theme.textSize.lg,
            color: theme.colors.text,
            fontWeight: "600",
          }}
        >
          {title}
        </Text>
      </View>
      {(canGoBack || isHome()) &&
        <Pressable>
          <Entypo name="menu" size={24} color={theme.colors.text} />
        </Pressable>}
    </View>
  );
}
