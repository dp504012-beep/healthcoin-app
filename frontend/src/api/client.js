export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export async function apiRequest(path, options = {}) {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(data?.error?.message || "Request failed");
    }

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("API returned an invalid response.");
    }

    if (error instanceof TypeError) {
      throw new Error(`Cannot reach backend at ${API_BASE_URL}.`);
    }

    throw error instanceof Error ? error : new Error("Request failed");
  }
}
