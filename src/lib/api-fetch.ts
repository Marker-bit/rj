export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: unknown,
  ) {
    super(message);
  }
}

export async function apiFetch<T = void>(
  input: RequestInfo | URL,
  init?: RequestInit & { type?: "json" | "text" },
): Promise<T> {
  const response = await fetch(input, init);
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");

  if (!isJson && init?.type === "json") {
    throw new ApiError("Expected JSON response", response.status, undefined);
  }

  const body =
    response.status === 204
      ? undefined
      : init?.type === "json"
        ? await response.json()
        : await response.text();

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, body);
  }

  return body as T;
}
