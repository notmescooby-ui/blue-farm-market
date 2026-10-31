import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  deletionRequestSchema,
  normalizePhone,
  parseIdentifier,
  OTP_SENT_MESSAGE,
  OTP_INVALID_MESSAGE,
  REQUEST_FAILED_MESSAGE,
  isDuplicateRequestError,
  isMissingTableError,
  STATUS_LABELS,
} from "@/lib/deletion/verification";
import { requestOtpCode, verifyOtpCode } from "@/lib/deletion/otp-flow";

describe("Account Deletion Complete Workflow Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("1. Farmer Deletion Request Validation", () => {
    it("validates valid farmer deletion request with email", () => {
      const input = {
        identifier: "farmer.ramesh@example.com",
        accountType: "farmer",
        reason: "Relocating farm operations to another state",
        confirmed: true,
      };
      const result = deletionRequestSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.accountType).toBe("farmer");
        expect(result.data.confirmed).toBe(true);
        expect(parseIdentifier(result.data.identifier)).toEqual({
          kind: "email",
          value: "farmer.ramesh@example.com",
        });
      }
    });

    it("validates valid farmer deletion request with 10-digit Indian phone", () => {
      const input = {
        identifier: "9876543210",
        accountType: "farmer",
        reason: "No longer aquaculture farming",
        confirmed: true,
      };
      const result = deletionRequestSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(parseIdentifier(result.data.identifier)).toEqual({
          kind: "phone",
          value: "+919876543210",
        });
      }
    });
  });

  describe("2. Buyer Deletion Request Validation", () => {
    it("validates valid buyer deletion request with email", () => {
      const input = {
        identifier: "buyer.sita@aquamarket.in",
        accountType: "buyer",
        reason: "Business closed",
        confirmed: true,
      };
      const result = deletionRequestSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.accountType).toBe("buyer");
        expect(result.data.confirmed).toBe(true);
      }
    });

    it("validates valid buyer deletion request with international +91 phone", () => {
      const input = {
        identifier: "+91 91234 56789",
        accountType: "buyer",
        reason: "",
        confirmed: true,
      };
      const result = deletionRequestSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(parseIdentifier(result.data.identifier)).toEqual({
          kind: "phone",
          value: "+919123456789",
        });
      }
    });
  });

  describe("3. Invalid Email and Phone Handling", () => {
    it("rejects invalid email formats", () => {
      expect(parseIdentifier("invalid-email")).toBeNull();
      expect(parseIdentifier("missingatsign.com")).toBeNull();
      expect(parseIdentifier("@domainonly.com")).toBeNull();
      expect(parseIdentifier("two@@at.com")).toBeNull();
      expect(parseIdentifier("spaces in@email.com")).toBeNull();
    });

    it("rejects invalid phone formats", () => {
      expect(parseIdentifier("1234")).toBeNull(); // Too short
      expect(parseIdentifier("abcdefghij")).toBeNull(); // Non-numeric
      expect(parseIdentifier("+000000000000000000000000000")).toBeNull(); // Too long
    });

    it("rejects request if permanent deletion confirmation checkbox is unchecked", () => {
      const input = {
        identifier: "farmer@bluefarm.in",
        accountType: "farmer",
        reason: "",
        confirmed: false,
      };
      const result = deletionRequestSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find((i) => i.path[0] === "confirmed");
        expect(error?.message).toContain("confirm");
      }
    });
  });

  describe("4. OTP Verification & Anti-Enumeration", () => {
    it("suppresses errors when requesting OTP to prevent account enumeration", async () => {
      const identifier = { kind: "email" as const, value: "nonexistent@example.com" };
      // requestOtpCode should not throw or leak existence
      await expect(requestOtpCode(identifier)).resolves.not.toThrow();
    });

    it("returns standard safe message for incorrect or expired OTP", async () => {
      const contact = { kind: "email" as const, value: "test@example.com" };
      const result = await verifyOtpCode(contact, "000000");
      expect(result).toBe(OTP_INVALID_MESSAGE);
    });

    it("ensures anti-enumeration message does not reveal account existence", () => {
      expect(OTP_SENT_MESSAGE).toContain("If a BlueFarm account exists");
      expect(OTP_SENT_MESSAGE).toContain("6-digit verification code");
    });
  });

  describe("5. Duplicate Deletion Requests & Rate Limiting", () => {
    it("recognizes postgres unique violation error 23505 as duplicate request", () => {
      expect(isDuplicateRequestError("23505")).toBe(true);
      expect(isDuplicateRequestError("409")).toBe(true);
    });

    it("distinguishes setup / missing table error PGRST205 and 42P01", () => {
      expect(isMissingTableError("PGRST205")).toBe(true);
      expect(isMissingTableError("42P01")).toBe(true);
      expect(isMissingTableError("23505")).toBe(false);
    });
  });

  describe("6. Backend Deletion Lifecycle & Retention Rules (Logic Simulation)", () => {
    interface SimulatedOrder {
      id: string;
      buyer_id: string;
      farmer_id: string;
      status: string;
      payment_status: string;
      amount_paise: number;
    }

    interface SimulatedProfile {
      id: string;
      role: "farmer" | "buyer";
      full_name: string;
      phone_number: string | null;
      email: string | null;
      address: string;
      aadhaar_verified: boolean;
    }

    function simulateProcessDeletion(
      userId: string,
      accountType: "farmer" | "buyer",
      orders: SimulatedOrder[],
      profile: SimulatedProfile,
    ) {
      // Step A: Check for active/pending obligations
      const activeOrders = orders.filter((o) => {
        const isUserParty = o.buyer_id === userId || o.farmer_id === userId;
        const isActiveStatus = [
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "out_for_delivery",
        ].includes(o.status);
        const isPendingPayment = ["initiated", "verification_pending"].includes(o.payment_status);
        return isUserParty && (isActiveStatus || isPendingPayment);
      });

      if (activeOrders.length > 0) {
        return {
          success: false,
          status: "rejected",
          reason: `Account has ${activeOrders.length} active or pending order(s).`,
          retainedRecords: null,
          profileAfter: { ...profile },
        };
      }

      // Step B: Eligible - Anonymize personal profile data
      const updatedProfile: SimulatedProfile = {
        ...profile,
        full_name: "Deleted User",
        phone_number: null,
        email: null,
        address: "Anonymized",
        aadhaar_verified: false,
      };

      // Step C: Historical completed orders are retained for legal & tax compliance
      const retainedOrders = orders.filter((o) => o.buyer_id === userId || o.farmer_id === userId);

      return {
        success: true,
        status: "completed",
        reason: null,
        retainedRecords: {
          retainedOrdersCount: retainedOrders.length,
          legalComplianceSummary:
            "Historical financial & transaction records retained for statutory tax compliance.",
        },
        profileAfter: updatedProfile,
      };
    }

    it("rejects deletion for Farmer with active or pending deliveries", () => {
      const farmerId = "farmer-uuid-1";
      const orders: SimulatedOrder[] = [
        {
          id: "order-101",
          buyer_id: "buyer-uuid-2",
          farmer_id: farmerId,
          status: "confirmed",
          payment_status: "paid",
          amount_paise: 50000,
        },
      ];
      const profile: SimulatedProfile = {
        id: farmerId,
        role: "farmer",
        full_name: "Ramesh Fisher",
        phone_number: "+919876543210",
        email: "ramesh@bluefarm.in",
        address: "Nellore, Andhra Pradesh",
        aadhaar_verified: true,
      };

      const result = simulateProcessDeletion(farmerId, "farmer", orders, profile);
      expect(result.success).toBe(false);
      expect(result.status).toBe("rejected");
      expect(result.reason).toContain("active or pending order(s)");
      // Personal data must NOT be touched when rejected
      expect(result.profileAfter.full_name).toBe("Ramesh Fisher");
      expect(result.profileAfter.phone_number).toBe("+919876543210");
    });

    it("rejects deletion for Buyer with in-transit or pending payment orders", () => {
      const buyerId = "buyer-uuid-2";
      const orders: SimulatedOrder[] = [
        {
          id: "order-102",
          buyer_id: buyerId,
          farmer_id: "farmer-uuid-99",
          status: "pending",
          payment_status: "cod_due",
          amount_paise: 25000,
        },
      ];
      const profile: SimulatedProfile = {
        id: buyerId,
        role: "buyer",
        full_name: "Sita Traders",
        phone_number: "+919123456789",
        email: "sita@market.in",
        address: "Chennai, Tamil Nadu",
        aadhaar_verified: false,
      };

      const result = simulateProcessDeletion(buyerId, "buyer", orders, profile);
      expect(result.success).toBe(false);
      expect(result.status).toBe("rejected");
      expect(result.profileAfter.full_name).toBe("Sita Traders");
    });

    it("successfully deletes Farmer with completed orders: anonymizes profile and retains orders", () => {
      const farmerId = "farmer-clean-1";
      const completedOrders: SimulatedOrder[] = [
        {
          id: "order-past-1",
          buyer_id: "buyer-99",
          farmer_id: farmerId,
          status: "delivered",
          payment_status: "paid",
          amount_paise: 120000,
        },
      ];
      const profile: SimulatedProfile = {
        id: farmerId,
        role: "farmer",
        full_name: "Suresh Aqua",
        phone_number: "+919845112233",
        email: "suresh@farm.com",
        address: "Kakinada, AP",
        aadhaar_verified: true,
      };

      const result = simulateProcessDeletion(farmerId, "farmer", completedOrders, profile);
      expect(result.success).toBe(true);
      expect(result.status).toBe("completed");

      // Verify personal profile was anonymized
      expect(result.profileAfter.full_name).toBe("Deleted User");
      expect(result.profileAfter.phone_number).toBeNull();
      expect(result.profileAfter.email).toBeNull();
      expect(result.profileAfter.address).toBe("Anonymized");
      expect(result.profileAfter.aadhaar_verified).toBe(false);

      // Verify financial order records were retained
      expect(result.retainedRecords?.retainedOrdersCount).toBe(1);
    });

    it("successfully deletes Buyer with completed orders: anonymizes profile and retains orders", () => {
      const buyerId = "buyer-clean-2";
      const completedOrders: SimulatedOrder[] = [
        {
          id: "order-past-2",
          buyer_id: buyerId,
          farmer_id: "farmer-1",
          status: "delivered",
          payment_status: "paid",
          amount_paise: 45000,
        },
      ];
      const profile: SimulatedProfile = {
        id: buyerId,
        role: "buyer",
        full_name: "Meena Seafood",
        phone_number: "+919811223344",
        email: "meena@buyer.org",
        address: "Kochi, Kerala",
        aadhaar_verified: false,
      };

      const result = simulateProcessDeletion(buyerId, "buyer", completedOrders, profile);
      expect(result.success).toBe(true);
      expect(result.status).toBe("completed");

      // Verify personal profile was anonymized
      expect(result.profileAfter.full_name).toBe("Deleted User");
      expect(result.profileAfter.phone_number).toBeNull();
      expect(result.profileAfter.email).toBeNull();
      expect(result.profileAfter.address).toBe("Anonymized");

      // Verify statutory order records retained
      expect(result.retainedRecords?.retainedOrdersCount).toBe(1);
    });

    it("is idempotent: re-running deletion on already completed request succeeds safely", () => {
      const farmerId = "farmer-clean-1";
      const profile: SimulatedProfile = {
        id: farmerId,
        role: "farmer",
        full_name: "Deleted User",
        phone_number: null,
        email: null,
        address: "Anonymized",
        aadhaar_verified: false,
      };

      // Second run with empty active orders
      const result = simulateProcessDeletion(farmerId, "farmer", [], profile);
      expect(result.success).toBe(true);
      expect(result.status).toBe("completed");
    });
  });

  describe("7. Status Labels & Support Contacts", () => {
    it("has user-friendly labels for all request statuses", () => {
      expect(STATUS_LABELS["received"]).toContain("Received");
      expect(STATUS_LABELS["processing"]).toContain("processed");
      expect(STATUS_LABELS["completed"]).toBe("Completed");
      expect(STATUS_LABELS["cancelled"]).toBe("Cancelled");
      expect(STATUS_LABELS["rejected"]).toBe("Not eligible");
    });
  });
});
