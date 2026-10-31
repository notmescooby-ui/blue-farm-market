import { describe, expect, it } from "vitest";
import {
  deletionRequestSchema,
  isDuplicateRequestError,
  isMissingTableError,
  normalizePhone,
  parseIdentifier,
  STATUS_LABELS,
} from "@/lib/deletion/verification";

describe("parseIdentifier", () => {
  it("accepts and normalizes email addresses", () => {
    expect(parseIdentifier("Farmer@Example.COM ")).toEqual({
      kind: "email",
      value: "farmer@example.com",
    });
  });

  it("rejects malformed emails", () => {
    expect(parseIdentifier("not-an-email")).toBeNull();
    expect(parseIdentifier("a@b")).toBeNull();
  });

  it("normalizes 10-digit Indian numbers to +91 E.164", () => {
    expect(parseIdentifier("98765 43210")).toEqual({ kind: "phone", value: "+919876543210" });
  });

  it("accepts numbers that already carry a country code", () => {
    expect(parseIdentifier("+919876543210")).toEqual({ kind: "phone", value: "+919876543210" });
    expect(parseIdentifier("919876543210")).toEqual({ kind: "phone", value: "+919876543210" });
  });

  it("rejects numbers too short to be valid", () => {
    expect(parseIdentifier("12345")).toBeNull();
  });

  it("rejects empty input", () => {
    expect(parseIdentifier("   ")).toBeNull();
  });
});

describe("normalizePhone", () => {
  it("strips separators and applies the Indian default country code", () => {
    expect(normalizePhone("+91 98765-43210")).toBe("+919876543210");
    expect(normalizePhone("98765 43210")).toBe("+919876543210");
    expect(normalizePhone("919876543210")).toBe("+919876543210");
  });

  it("returns null for anything that is not a plausible phone number", () => {
    expect(normalizePhone("bluefarm")).toBeNull();
    expect(normalizePhone("123")).toBeNull();
    expect(normalizePhone("+91123")).toBeNull();
  });
});

describe("deletionRequestSchema", () => {
  it("accepts a complete, confirmed request", () => {
    const result = deletionRequestSchema.safeParse({
      identifier: "fisher@example.com",
      accountType: "buyer",
      reason: "",
      confirmed: true,
    });
    expect(result.success).toBe(true);
  });

  it("requires the permanent-deletion confirmation checkbox", () => {
    const result = deletionRequestSchema.safeParse({
      identifier: "fisher@example.com",
      accountType: "farmer",
      reason: "",
      confirmed: false,
    });
    expect(result.success).toBe(false);
  });

  it("only allows farmer or buyer account types", () => {
    const result = deletionRequestSchema.safeParse({
      identifier: "fisher@example.com",
      accountType: "admin",
      reason: "",
      confirmed: true,
    });
    expect(result.success).toBe(false);
  });

  it("caps the optional reason at 500 characters", () => {
    const result = deletionRequestSchema.safeParse({
      identifier: "fisher@example.com",
      accountType: "farmer",
      reason: "x".repeat(501),
      confirmed: true,
    });
    expect(result.success).toBe(false);
  });
});

describe("safe database error classification", () => {
  it("recognizes a missing requests table as a setup problem", () => {
    expect(isMissingTableError("PGRST205")).toBe(true);
    expect(isMissingTableError("42P01")).toBe(true);
    expect(isMissingTableError("23505")).toBe(false);
  });

  it("recognizes a duplicate active request", () => {
    expect(isDuplicateRequestError("23505")).toBe(true);
    expect(isDuplicateRequestError("409")).toBe(true);
    expect(isDuplicateRequestError("PGRST205")).toBe(false);
  });
});

describe("status labels", () => {
  it("covers every processing status the database can store", () => {
    for (const status of ["received", "processing", "completed", "cancelled", "rejected"]) {
      expect(STATUS_LABELS[status]).toBeTruthy();
    }
  });
});
