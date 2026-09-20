import { HttpError } from "../http/HttpError";

type FormErrors<T extends object> = Partial<Record<keyof T, string>>;

type SubmitCallback<T extends object> = (data: T) => Promise<unknown>;

/**
 * Generic form abstraction with error handling compatible with Laravel 422 responses.
 *
 * @example
 * const form = new Form({ name: '', email: '' })
 * await form.submit(() => service.store(form.data))
 * if (form.errors.name) { ... }
 */
export class Form<T extends object> {
  data: T;
  errors: FormErrors<T> = {};
  processing = false;
  success = false;

  private readonly _initial: T;

  constructor(initialData: T) {
    this._initial = { ...initialData };
    this.data = { ...initialData };
  }

  async submit(callback: SubmitCallback<T>): Promise<void> {
    this.processing = true;
    this.success = false;
    this.clearErrors();

    try {
      await callback(this.data);
      this.success = true;
    } catch (error) {
      if (error instanceof HttpError && error.status === 422 && error.errors) {
        this.setErrors(error.errors as Record<keyof T, string[]>);
      } else {
        throw error;
      }
    } finally {
      this.processing = false;
    }
  }

  reset(): void {
    this.data = { ...this._initial };
    this.clearErrors();
    this.success = false;
    this.processing = false;
  }

  resetField(field: keyof T): void {
    (this.data as Record<keyof T, unknown>)[field] = (
      this._initial as Record<keyof T, unknown>
    )[field];
    this.clearError(field);
  }

  clearErrors(): void {
    this.errors = {};
  }

  clearError(field: keyof T): void {
    const updated = { ...this.errors };
    delete updated[field];
    this.errors = updated;
  }

  /**
   * Accepts Laravel-style error bags: `{ field: ['msg1', 'msg2'] }`.
   * Only the first message per field is stored.
   */
  setErrors(errors: Record<string, string[]>): void {
    const mapped: FormErrors<T> = {};

    for (const [field, messages] of Object.entries(errors)) {
      const key = field as keyof T;
      const first = messages[0];
      if (first !== undefined) {
        mapped[key] = first;
      }
    }

    this.errors = mapped;
  }

  /** True when the form has any validation error. */
  get hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }
}
