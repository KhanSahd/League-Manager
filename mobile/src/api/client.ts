import * as SecureStore from 'expo-secure-store';

const BASE_URL = `http://${process.env.EXPO_PUBLIC_IP_ADDY}:8080/api`;

async function getToken() {
	return SecureStore.getItemAsync('token');
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
	const token = await getToken();

	console.log(`Making request to ${BASE_URL}${path} with options: ${JSON.stringify(options)}`);
	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(options.headers || {}),
		},
	});

	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.message || `HTTP ${res.status}`);
	}

	const data = await res.json();

	return data as T;
}

export { BASE_URL };
