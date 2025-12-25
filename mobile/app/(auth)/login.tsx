import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/auth/AuthContext";
import { theme } from "../../src/ui/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { signIn } = useAuth();
  const router = useRouter();

  async function submit() {
    setError(null);
    try {
      const res = await fetch("http://10.0.0.54:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid login");

      const data = await res.json();
      await signIn(data.token);
      router.replace("/home");
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <View
      style={{
              flex: 1,
              padding: theme.spacing.lg,
              backgroundColor: theme.colors.bg,
              gap: theme.spacing.md,
            }}
    >
      <Text
        style={{
          fontSize: theme.textSize.xl,
          color: theme.colors.text,
        }}
      >
        Login
      </Text>
      {error &&
        <Text
          style={{
            fontSize: theme.textSize.xl,
            color: theme.colors.error,
          }}
        >
          {error}
        </Text>}

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable onPress={submit}>
        <Text>Login</Text>
      </Pressable>
    </View>
  );
}
