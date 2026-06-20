import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://10.0.0.152:8080/api";

async function getToken() {
  return SecureStore.getItemAsync("token");
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> 
{
  const token = await getToken();

  const res = await fetch(`${BASE_URL}${path}`, 
  {
    ...options,
    headers: 
    {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) 
  {
    const text = await res.text();

    try 
    {
      const json = JSON.parse(text);
      throw new Error(json.message || `HTTP ${res.status}`);
    } 
    catch 
    {
      throw new Error(text || `HTTP ${res.status}`);
    }
  }

  if (res.status === 204) 
  {
    return undefined as T;
  }

  const text = await res.text();

  if (!text) 
  {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export { BASE_URL };