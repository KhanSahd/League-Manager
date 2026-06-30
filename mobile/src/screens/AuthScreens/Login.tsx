import { useState } from "react";
import { View, Text } from "react-native";
import { api } from "../../api/client";
import { theme } from "../../ui/theme";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { loginSuccess, setToken } from "../../redux/slices/AuthSlice";
import { AuthResponse, User } from "../../../types";
import { useNavigation } from "@react-navigation/native";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null); 
    const dispatch = useDispatch();
    const navigation = useNavigation();

    async function submit()
    {
        setError(null);
        try
        {
            const res = await api<AuthResponse>("/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            });
          dispatch(setToken(res.token))
          await SecureStore.setItemAsync("token", res.token);
          
          const user = await api<User>("/me")
          dispatch(loginSuccess({user: user}));
        }
        catch (e: any) {
          setError(e.message);
        }
    }

  return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing.lg,
          gap: theme.spacing.md,
        }}
      >
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
        <Button onPress={submit} label="Login" />
        <Button
          onPress={() => navigation.navigate("Register")}
          label="Don't have an account? Register"
          variant="secondary"
        />
        <Button
          onPress={() => navigation.navigate("Forgot-Password")}
          label="Forgot password?"
          variant="text"
        />
        </View> 
  );
}
