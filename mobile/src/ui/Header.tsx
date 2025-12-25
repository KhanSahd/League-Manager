import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "./theme";

export function Header({ title }: { title: string }) {
  const router = useRouter();
  const canGoBack = router.canGoBack();

  return (
    <View
      style={{
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.card,
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
        <View style={{ width: 24 }} />
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
  );
}
