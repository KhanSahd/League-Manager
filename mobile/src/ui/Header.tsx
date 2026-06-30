import { View, Text, Pressable } from "react-native";
import { theme } from "./theme";
import { useNavigation } from "@react-navigation/native";
import Entypo from '@expo/vector-icons/Entypo';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export function Header({ title }: { title: string }) {

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

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
        paddingTop: insets.top,
        backgroundColor: theme.colors.bg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      }}
      >
        <View
          style={{
            height: 56,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: theme.spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            {navigation.canGoBack() ? (
              <Pressable
                onPress={() => navigation.goBack()} // fix me
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
                fontFamily: theme.colors.font,
                fontWeight: "600",
              }}
            >
              {title}
            </Text>
          </View>
          {(navigation.canGoBack() || isHome()) &&
            <Pressable>
              <Entypo name="menu" size={24} color={theme.colors.text} />
            </Pressable>}
        </View>
      </View>
  );
}
