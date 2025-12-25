import { View } from "react-native";
import { theme } from "./theme";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.card,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
      }}
    >
      {children}
    </View>
  );
}
