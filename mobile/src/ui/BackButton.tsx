import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "./theme";

export function BackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.back()}
      style={{
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          color: theme.colors.primary,
          fontSize: theme.textSize.md,
        }}
      >
        ← {label}
      </Text>
    </Pressable>
  );
}
