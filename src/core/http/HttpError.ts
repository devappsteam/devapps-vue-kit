import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../contracts/api";

export class HttpError extends Error {
  readonly status: number | null;
  readonly errors: Record<string, string[]> | undefined;
  readonly response: unknown;

  constructor(
    message: string,
    status: number | null,
    errors?: Record<string, string[]>,
    response?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.errors = errors;
    this.response = response;
  }

  static fromAxiosError(error: AxiosError<ApiErrorResponse>): HttpError {
    const status = error.response?.status ?? null;
    const data = error.response?.data;

    const message =
      (typeof data === "object" && data && "message" in data
        ? data.message
        : undefined) ?? error.message ?? "Unexpected HTTP error.";

    const errors =
      typeof data === "object" && data && "errors" in data
        ? data.errors
        : undefined;

    return new HttpError(message, status, errors, error.response);
  }
}
