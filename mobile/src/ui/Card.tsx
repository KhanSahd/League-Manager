import { View } from "react-native";
import { theme } from "./theme";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px"
      }}
    >
      {children}
    </View>
  );
}
