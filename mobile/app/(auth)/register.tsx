import { View, Text, } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { theme } from '../../src/ui/theme'
import { Input } from '../../src/ui/Input'
import { Button } from '../../src/ui/Button'
import { api } from '../../src/api/client'
import { useAuth } from '../../src/auth/AuthContext'

const register = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const { signIn } = useAuth();

    async function submit() {
        setError(null);
        try {
          const res = await api<{ token: string }>("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, email, password }),
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
            Register
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
        onPress={() => router.push("/login")}
        label="Already have an account? Login"
        variant="secondary"
        />
    </View>
    )
}

export default register