import { Text } from "react-native";
import { theme } from "./theme";

export function EmptyState({ message }: { message: string }) {
  return (
    <Text
      style={{
        color: theme.colors.muted,
        textAlign: "center",
        marginVertical: theme.spacing.lg,
      }}
    >
      {message}
    </Text>
  );
}
