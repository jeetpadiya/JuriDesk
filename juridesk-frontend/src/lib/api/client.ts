const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "")

export type ApiErrorBody = {
  success?: boolean
  message?: string
  [key: string]: unknown
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: ApiErrorBody,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: BodyInit | Record<string, unknown>
  headers?: HeadersInit
  token?: string
}

function resolveUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path

  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  if (API_BASE_URL.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    return `${API_BASE_URL}${normalizedPath.slice(4)}`
  }

  return `${API_BASE_URL}${normalizedPath}`
}

function isBodyInit(body: RequestOptions["body"]): body is BodyInit {
  return (
    typeof body === "string" ||
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body)
  )
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined

  const contentType = response.headers.get("content-type") ?? ""
  return contentType.includes("application/json") ? response.json() : response.text()
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, token, ...init } = options
  const requestHeaders = new Headers(headers)
  let requestBody: BodyInit | undefined

  if (body !== undefined) {
    if (isBodyInit(body)) {
      requestBody = body
    } else {
      requestHeaders.set("Content-Type", "application/json")
      requestBody = JSON.stringify(body)
    }
  }

  if (token) requestHeaders.set("Authorization", `Bearer ${token}`)
  if (!requestHeaders.has("Accept")) requestHeaders.set("Accept", "application/json")

  const response = await fetch(resolveUrl(path), {
    ...init,
    body: requestBody,
    credentials: "include",
    headers: requestHeaders,
  })
  const data = await parseResponse(response)

  if (!response.ok) {
    const errorData = typeof data === "object" && data !== null ? (data as ApiErrorBody) : undefined
    throw new ApiError(errorData?.message ?? `Request failed with status ${response.status}.`, response.status, errorData)
  }

  return data as T
}

export const apiClient = {
  request,
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: RequestOptions["body"], options?: RequestOptions) => request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: RequestOptions["body"], options?: RequestOptions) => request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: RequestOptions["body"], options?: RequestOptions) => request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
}
