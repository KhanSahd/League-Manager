import { TextInput } from "react-native";
import { theme } from "./theme";

export function Input(props: any) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={theme.colors.muted}
      style={{
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        color: theme.colors.text,
      }}
    />
  );
}
