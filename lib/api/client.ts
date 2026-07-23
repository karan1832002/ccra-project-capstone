import { ApiResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestOptions extends RequestInit {
  retryOnColdStart?: boolean;
}

async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { retryOnColdStart = true, ...fetchOptions } = options;

  const doFetch = async (): Promise<Response> => {
    return fetch(`${API_URL}${path}`, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    });
  };

  try {
    let response = await doFetch();

    // 502 = service scaling up from zero; wait and try once more
    if (response.status === 502 && retryOnColdStart) {
      await new Promise((r) => setTimeout(r, 4000));
      response = await doFetch();
    }

    if (response.status === 429) {
      return {
        success: false,
        error: { code: "RATE_LIMITED", message: "Too many requests. Please wait a moment and try again." },
      };
    }

    const result: ApiResponse<T> = await response.json();
    return result;
  } catch (err) {
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Could not reach the server. Check your connection." },
    };
  }
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};