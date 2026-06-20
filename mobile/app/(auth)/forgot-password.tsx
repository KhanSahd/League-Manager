import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { theme } from '../../src/ui/theme'
import { Input } from '../../src/ui/Input'
import { Button } from '../../src/ui/Button';
import { api } from '../../src/api/client';
import { useRouter } from 'expo-router';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    async function handleResetPassword(){
        setError(null);
        console.log(email);
        try {
            const res = await api<{ message: string }>("/password-reset/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
            });
            console.log("API RESPONSE:", res);
            Alert.alert(res.message);
            router.replace("/login");
            return;
        } catch (e: any) {
            console.log("RESET ERROR:", e);
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
                textAlign: "center",
            }}
            >
              Forgot Password
            </Text>
            
            <Input
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />  

            <Button
                label="Reset Password"
                onPress={handleResetPassword}
                variant='primary'
            />
      </View>
  )
}