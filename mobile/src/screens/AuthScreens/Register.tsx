import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { api } from '../../api/client'
import { theme } from '../../ui/theme'
import { Input } from '../../ui/Input'
import { Button } from '../../ui/Button'
import { useNavigation } from '@react-navigation/native'
import { AuthResponse } from '../../../types'
import * as SecureStore from "expo-secure-store";
import { useDispatch } from 'react-redux'
import { loginSuccess, setToken } from '../../redux/slices/AuthSlice'

type User = { id: string; firstName: string, lastName: string, email: string;  };

const Register = () => {
  const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    async function submit() {
        setError(null);
        try {
          const res = await api<AuthResponse>("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, email, password }),
          });
          await SecureStore.setItemAsync("token", res.token);
          dispatch(setToken(res.token))
          const user = await api<User>("/me")
          dispatch(loginSuccess({user: user}));
        //   router.replace("/home");
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
                paddingTop: theme.spacing.lg,
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

        {/* First and Last name row */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: theme.spacing.md }}>
          <Input placeholder='First Name' autoCapitalize='none' value={firstName} onChangeText={setFirstName} />
          <Input placeholder='Last Name' autoCapitalize='none' value={lastName} onChangeText={setLastName} />
        </View>

        <Input placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
        
        <Input placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

        <Input placeholder="Confirm Password" secureTextEntry value={confirmedPassword} onChangeText={setConfirmedPassword} />

        <Button onPress={submit} label="Register" />
        <Button
        onPress={() => navigation.navigate("Login")}
        label="Already have an account? Login"
        variant="secondary"
        />
    </View>
    )
}

export default Register