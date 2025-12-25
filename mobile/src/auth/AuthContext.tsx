import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { api } from "../api/client";

type User = { id: string; email: string };

type AuthContextType = {
  token: string | null;
  user: User | null;
  ready: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync("token");
      if (stored) {
        setToken(stored);
        try {
          const me = await api<User>("/me");
          setUser(me);
        } catch {
          await SecureStore.deleteItemAsync("token");
          setToken(null);
        }
      }
      setReady(true);
    })();
  }, []);

  async function signIn(t: string) {
    await SecureStore.setItemAsync("token", t);
    setToken(t);
    const me = await api<User>("/me");
    setUser(me);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, ready, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
