import { defineStore } from "pinia";
import { ref } from "vue";
import type { CrudService } from "../services/CrudService";
import type { ApiParams } from "../../contracts/api";
import type { PaginationParams } from "../../contracts/pagination";
import { Pagination } from "../pagination/Pagination";
import { HttpError } from "../http/HttpError";

/**
 * Factory that creates a fully-typed Pinia Composition-API store for CRUD operations.
 *
 * @example
 * export const useCustomerStore = defineCrudStore('customer', () => customerService)
 */
export function defineCrudStore<T extends { uuid: string }>(
  id: string,
  serviceFactory: () => CrudService<T>,
) {
  return defineStore(id, () => {
    const service = serviceFactory();

    const items = ref<T[]>([]) as import("vue").Ref<T[]>;
    const item = ref<T | null>(null) as import("vue").Ref<T | null>;
    const loading = ref(false);
    const saving = ref(false);
    const deleting = ref(false);
    const error = ref<string | null>(null);
    const pagination = ref<Pagination | null>(null);

    function setError(err: unknown): void {
      if (err instanceof HttpError) {
        error.value = err.message;
      } else if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "An unexpected error occurred.";
      }
    }

    async function fetchAll(
      params?: PaginationParams & ApiParams,
    ): Promise<void> {
      loading.value = true;
      error.value = null;

      try {
        const result = await service.index(params);
        items.value = result.data;
        pagination.value = new Pagination(result.meta, result.links);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        loading.value = false;
      }
    }

    async function fetchOne(id: string | number): Promise<void> {
      loading.value = true;
      error.value = null;

      try {
        const result = await service.show(id);
        item.value = result.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        loading.value = false;
      }
    }

    async function create(data: unknown): Promise<T> {
      saving.value = true;
      error.value = null;

      try {
        const result = await service.store(data);
        return result.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        saving.value = false;
      }
    }

    async function update(id: string | number, data: unknown): Promise<T> {
      saving.value = true;
      error.value = null;

      try {
        const result = await service.update(id, data);
        return result.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        saving.value = false;
      }
    }

    async function remove(id: string | number): Promise<void> {
      deleting.value = true;
      error.value = null;

      try {
        await service.destroy(id);
        items.value = items.value.filter((i) => i.uuid !== id);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        deleting.value = false;
      }
    }

    function $reset(): void {
      items.value = [];
      item.value = null;
      loading.value = false;
      saving.value = false;
      deleting.value = false;
      error.value = null;
      pagination.value = null;
    }

    return {
      items,
      item,
      loading,
      saving,
      deleting,
      error,
      pagination,
      fetchAll,
      fetchOne,
      create,
      update,
      remove,
      $reset,
    };
  });
}
