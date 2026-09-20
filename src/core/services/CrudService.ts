import type { HttpClient } from "../http/HttpClient";
import type {
  ApiResource,
  ApiPaginatedCollection,
  ApiParams,
} from "../../contracts/api";
import type { PaginationParams } from "../../contracts/pagination";
import { BaseService } from "./BaseService";

/**
 * Generic CRUD service for resources exposed by a Laravel REST API.
 *
 * @example
 * class CustomerService extends CrudService<Customer> {
 *   constructor(http: HttpClient) {
 *     super(http, '/customers')
 *   }
 * }
 */
export class CrudService<T> extends BaseService {
  constructor(
    http: HttpClient,
    protected readonly resourcePath: string,
  ) {
    super(http);
  }

  /** GET /resource — paginated list */
  async index(
    params?: PaginationParams & ApiParams,
  ): Promise<ApiPaginatedCollection<T>> {
    const response = await this.get<ApiPaginatedCollection<T>>(
      this.resourcePath,
      params,
    );
    return response.data;
  }

  /** GET /resource/:id */
  async show(id: string | number, params?: ApiParams): Promise<ApiResource<T>> {
    const response = await this.get<ApiResource<T>>(
      `${this.resourcePath}/${id}`,
      params,
    );
    return response.data;
  }

  /** POST /resource */
  async store(data: unknown): Promise<ApiResource<T>> {
    const response = await this.post<ApiResource<T>>(this.resourcePath, data);
    return response.data;
  }

  /** PUT /resource/:id */
  async update(id: string | number, data: unknown): Promise<ApiResource<T>> {
    const response = await this.put<ApiResource<T>>(
      `${this.resourcePath}/${id}`,
      data,
    );
    return response.data;
  }

  /** DELETE /resource/:id */
  async destroy(id: string | number): Promise<void> {
    await this.delete(`${this.resourcePath}/${id}`);
  }
}
