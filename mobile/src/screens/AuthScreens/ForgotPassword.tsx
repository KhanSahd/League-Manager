import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { api } from '../../api/client';
import { theme } from '../../ui/theme';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { StackActions, useNavigation } from '@react-navigation/native';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);

    const navigation = useNavigation();

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
            navigation.dispatch(
                StackActions.replace("Login")
            );
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
            paddingTop: theme.spacing.lg,
            gap: theme.spacing.md,
            }}
        >   
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