import { Pressable, Text } from "react-native";
import { theme } from "./theme";

export function Button({
  label,
  onPress,
  variant = "primary",
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "text" | "danger";
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor:
          variant === "primary"
            ? theme.colors.primary
            : variant === "secondary"
            ? theme.colors.secondary
            : variant === "text"
            ? "transparent"
            : theme.colors.danger,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        alignItems: "center",
      }}
    >
      <Text style={{ color: variant === "text" ? theme.colors.text : "#000", fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
}
