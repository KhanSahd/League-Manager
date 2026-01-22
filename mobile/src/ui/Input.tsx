import { View, TextInput, Pressable } from "react-native";
import { theme } from "./theme";
import Entypo from "@expo/vector-icons/Entypo";
import { useState } from "react";

type InputProps = {
  secureTextEntry?: boolean;
  [key: string]: any;
};

export function Input({ secureTextEntry, ...props }: InputProps) {
  const [hidden, setHidden] = useState(secureTextEntry ?? false);

  return (
    <View
      style={{
        position: "relative",
        justifyContent: "center",
      }}
    >
      <TextInput
        {...props}
        secureTextEntry={hidden}
        placeholderTextColor={theme.colors.muted}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.md,
          paddingRight: secureTextEntry ? 44 : theme.spacing.md,
          borderRadius: theme.radius.md,
          color: theme.colors.text,
        }}
      />

      {secureTextEntry && (
        <Pressable
          onPress={() => setHidden(!hidden)}
          style={{
            position: "absolute",
            right: theme.spacing.md,
          }}
        >
          <Entypo
            name={hidden ? "eye-with-line" : "eye"}
            size={20}
            color={theme.colors.muted}
          />
        </Pressable>
      )}
    </View>
  );
}
