import { Redirect } from "expo-router";
import { useAuth } from "../src/auth/AuthContext";

export default function Index() {
  const { token, ready } = useAuth();
  if (!ready) return null;
  return token ? <Redirect href="/home" /> : <Redirect href="/(auth)/login" />;
}
