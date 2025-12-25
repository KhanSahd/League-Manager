import { Pressable, Text } from "react-native";
import { theme } from "./theme";

export function Button({
  label,
  onPress,
  variant = "primary",
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "danger";
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor:
          variant === "primary"
            ? theme.colors.primary
            : theme.colors.danger,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#000", fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
}
