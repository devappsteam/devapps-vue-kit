import { describe, it, expect } from "vitest";
import { Form } from "../../src/core/forms/Form";
import { HttpError } from "../../src/core/http/HttpError";

describe("Form", () => {
  it("initializes with data and no errors", () => {
    const form = new Form({ name: "John" });
    expect(form.data.name).toBe("John");
    expect(form.hasErrors).toBe(false);
  });

  it("handles successful submit", async () => {
    const form = new Form({ name: "John" });
    await form.submit(async (data) => {
      expect(data.name).toBe("John");
    });
    expect(form.success).toBe(true);
    expect(form.processing).toBe(false);
  });

  it("handles 422 errors", async () => {
    const form = new Form({ name: "John" });
    
    await form.submit(async () => {
      throw new HttpError("Validation failed", 422, { name: ["Name is invalid"] });
    });

    expect(form.success).toBe(false);
    expect(form.hasErrors).toBe(true);
    expect(form.errors.name).toBe("Name is invalid");
  });

  it("resets to initial state", () => {
    const form = new Form({ name: "John" });
    form.data.name = "Jane";
    form.errors.name = "Error";
    form.success = true;

    form.reset();

    expect(form.data.name).toBe("John");
    expect(form.hasErrors).toBe(false);
    expect(form.success).toBe(false);
  });
});
