import { describe, it, expect } from "vitest";
import { HttpError } from "../../src/core/http/HttpError";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../src/contracts/api";

describe("HttpError", () => {
  it("extracts message and errors from AxiosError", () => {
    const axiosError: Partial<AxiosError<ApiErrorResponse>> = {
      message: "Request failed",
      response: {
        status: 422,
        data: {
          message: "Validation failed",
          errors: { field: ["Error 1"] },
        },
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as any,
      },
    };

    const error = HttpError.fromAxiosError(axiosError as AxiosError<ApiErrorResponse>);

    expect(error.status).toBe(422);
    expect(error.message).toBe("Validation failed");
    expect(error.errors).toEqual({ field: ["Error 1"] });
  });
});
