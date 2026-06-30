export type RootStackParamList = {
    Login: undefined
}

export type User = {
    id: string;
    firstName: string,
    lastName: string,
    email: string;
}

export type AuthResponse = {
    token: string;
};