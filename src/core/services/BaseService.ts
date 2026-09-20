import type { AxiosResponse } from "axios";
import type { HttpClient } from "../http/HttpClient";
import type { ApiParams } from "../../contracts/api";

/**
 * Base class for all application services.
 * Services that extend BaseService never import Axios directly.
 */
export class BaseService {
  constructor(protected readonly http: HttpClient) {}

  protected get<T>(
    url: string,
    params?: ApiParams,
  ): Promise<AxiosResponse<T>> {
    return this.http.instance().get<T>(url, { params });
  }

  protected post<T>(
    url: string,
    data?: unknown,
    params?: ApiParams,
  ): Promise<AxiosResponse<T>> {
    return this.http.instance().post<T>(url, data, { params });
  }

  protected put<T>(
    url: string,
    data?: unknown,
    params?: ApiParams,
  ): Promise<AxiosResponse<T>> {
    return this.http.instance().put<T>(url, data, { params });
  }

  protected patch<T>(
    url: string,
    data?: unknown,
    params?: ApiParams,
  ): Promise<AxiosResponse<T>> {
    return this.http.instance().patch<T>(url, data, { params });
  }

  protected delete<T>(
    url: string,
    params?: ApiParams,
  ): Promise<AxiosResponse<T>> {
    return this.http.instance().delete<T>(url, { params });
  }
}
