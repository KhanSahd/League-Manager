import { Pressable, Text } from "react-native";
import { theme } from "./theme";

export function BackButton({ label = "Back" }: { label?: string }) {
  // const router = useRouter();

  return (
    <Pressable
      onPress={() => null} // fix me
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
