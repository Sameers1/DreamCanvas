import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { supabase } from "./supabase";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error('Not authenticated');
  }

  // Ensure we're using the correct API base URL
  const baseUrl = import.meta.env.PROD 
    ? '/.netlify/functions/api'  // Netlify Functions URL in production
    : 'http://localhost:3000';   // Local development server
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

  console.log('Making API request:', {
    method,
    url: fullUrl,
    data,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      "Authorization": `Bearer ${token}`
    }
  });

  const res = await fetch(fullUrl, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    mode: "cors"
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('API request failed:', {
      status: res.status,
      statusText: res.statusText,
      responseText: text
    });
    throw new Error(`${res.status}: ${text}`);
  }

  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token && unauthorizedBehavior === "returnNull") {
      return null;
    }

    if (!token) {
      throw new Error('Not authenticated');
    }

    const baseUrl = import.meta.env.PROD 
      ? '/.netlify/functions/api'  // Netlify Functions URL in production
      : 'http://localhost:3000';   // Local development server
    const url = (queryKey[0] as string).startsWith('http') 
      ? queryKey[0] as string 
      : `${baseUrl}${queryKey[0]}`;

    const res = await fetch(url, {
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Origin": "http://localhost:5173"
      },
      mode: "cors"
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
