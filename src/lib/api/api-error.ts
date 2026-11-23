export type ApiErrorCode =
  "HTTP_ERROR" | "NETWORK_ERROR" | "INVALID_RESPONSE" | "TIMEOUT";
const messages: Record<ApiErrorCode, string> = {
  HTTP_ERROR: "The request could not be completed.",
  NETWORK_ERROR: "Unable to connect. Please try again.",
  INVALID_RESPONSE: "The service returned an unexpected response.",
  TIMEOUT: "The request took too long. Please try again.",
};
export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    public readonly status?: number,
  ) {
    super(messages[code]);
    this.name = "ApiError";
  }
}
