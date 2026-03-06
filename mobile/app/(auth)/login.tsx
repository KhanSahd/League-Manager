import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/auth/AuthContext";
import { theme } from "../../src/ui/theme";
import { Input } from "../../src/ui/Input";
import { Button } from "../../src/ui/Button";
import { BASE_URL } from "../../src/api/client";
import { api } from "../../src/api/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { signIn } = useAuth();
  const router = useRouter();

  async function submit() {
    setError(null);
    try {
      const res = await api<{ token: string }>("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      await signIn(res.token);
      router.replace("/home");
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
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

      <Input
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* <Pressable onPress={submit}>
        <Text>Login</Text>
      </Pressable> */}
      <Button onPress={submit} label="Login" />
      <Button
        onPress={() => router.push("/register")}
        label="Don't have an account? Register"
        variant="secondary"
      />
      <Button
        onPress={() => router.push("/forgot-password")}
        label="Forgot password?"
        variant="text"
      />
    </View> 
  );
}
