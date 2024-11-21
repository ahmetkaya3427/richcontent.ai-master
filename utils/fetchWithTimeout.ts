type FetchOptions = RequestInit & {
  timeout?: number;
};

export async function fetchWithTimeout(resource: string, options: FetchOptions = {}): Promise<Response> {
  const { timeout = 8000, ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(id);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error("Fetch request timed out");
    } else {
      console.error("Fetch error:", error);
    }

    throw error;
  }
}
