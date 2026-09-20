import type { AxiosError, AxiosInstance } from "axios";
import type { HttpHandlers } from "../../../contracts/http";
import type { ApiErrorResponse } from "../../../contracts/api";
import { HttpError } from "../HttpError";

export function registerResponseInterceptor(
  client: AxiosInstance,
  handlers?: HttpHandlers,
): void {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
      const httpError = HttpError.fromAxiosError(error);

      if (httpError.status === 401) {
        handlers?.onUnauthorized?.();
      }

      return Promise.reject(httpError);
    },
  );
}
