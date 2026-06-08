import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://10.0.0.70:8080/api";

async function getToken() {
  return SecureStore.getItemAsync("token");
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.json();
    throw new Error(text.message || `HTTP ${res.status}`);
  }

  // Handle empty responses (e.g. 204 No Content)
  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export { BASE_URL };