export const API_BASE_URL = "http://localhost:3000";

export async function apiRequest(path, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      console.log("API error:", data);
      throw new Error(data?.error?.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
