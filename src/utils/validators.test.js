import { describe, it, expect } from "vitest";
import { validators, validateForm } from "../utils/validators";

describe("validators", () => {
  describe("email validator", () => {
    it("should validate correct email format", () => {
      const result = validators.email("user@example.com");
      expect(result.isValid).toBe(true);
    });

    it("should reject email without @", () => {
      const result = validators.email("userexample.com");
      expect(result.isValid).toBe(false);
      expect(result.message).toBeTruthy();
    });

    it("should reject email without domain", () => {
      const result = validators.email("user@");
      expect(result.isValid).toBe(false);
    });

    it("should accept various valid email formats", () => {
      const validEmails = [
        "test@domain.co.uk",
        "user+tag@example.org",
        "name.surname@company.io",
      ];

      validEmails.forEach((email) => {
        const result = validators.email(email);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe("password validator", () => {
    it("should validate strong password", () => {
      const result = validators.password("MyPassword123");
      expect(result.isValid).toBe(true);
    });

    it("should reject password without uppercase", () => {
      const result = validators.password("mypassword123");
      expect(result.isValid).toBe(false);
    });

    it("should reject password without lowercase", () => {
      const result = validators.password("MYPASSWORD123");
      expect(result.isValid).toBe(false);
    });

    it("should reject password without numbers", () => {
      const result = validators.password("MyPassword");
      expect(result.isValid).toBe(false);
    });

    it("should reject password shorter than 8 characters", () => {
      const result = validators.password("MyPass1");
      expect(result.isValid).toBe(false);
    });
  });

  describe("username validator", () => {
    it("should validate valid username", () => {
      const result = validators.username("john_doe");
      expect(result.isValid).toBe(true);
    });

    it("should accept usernames with numbers", () => {
      const result = validators.username("user123");
      expect(result.isValid).toBe(true);
    });

    it("should reject username with spaces", () => {
      const result = validators.username("john doe");
      expect(result.isValid).toBe(false);
    });

    it("should reject username shorter than 3 characters", () => {
      const result = validators.username("ab");
      expect(result.isValid).toBe(false);
    });

    it("should reject username longer than 20 characters", () => {
      const longUsername = "a".repeat(21);
      const result = validators.username(longUsername);
      expect(result.isValid).toBe(false);
    });
  });

  describe("validateForm function", () => {
    it("should validate entire form successfully", () => {
      const formData = {
        email: "user@example.com",
        password: "MyPassword123",
        username: "john_doe",
      };

      const rules = {
        email: {
          required: true,
          label: "Email",
          validator: validators.email,
        },
        password: {
          required: true,
          label: "Password",
          validator: validators.password,
        },
        username: {
          required: true,
          label: "Username",
          validator: validators.username,
        },
      };

      const result = validateForm(formData, rules);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it("should collect multiple validation errors", () => {
      const formData = {
        email: "invalid-email",
        password: "weak",
        username: "ab",
      };

      const rules = {
        email: {
          required: true,
          label: "Email",
          validator: validators.email,
        },
        password: {
          required: true,
          label: "Password",
          validator: validators.password,
        },
        username: {
          required: true,
          label: "Username",
          validator: validators.username,
        },
      };

      const result = validateForm(formData, rules);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeTruthy();
      expect(result.errors.password).toBeTruthy();
      expect(result.errors.username).toBeTruthy();
    });

    it("should handle required field validation", () => {
      const formData = {
        email: "",
        password: "MyPassword123",
      };

      const rules = {
        email: {
          required: true,
          label: "Email",
          validator: validators.email,
        },
        password: {
          required: true,
          label: "Password",
          validator: validators.password,
        },
      };

      const result = validateForm(formData, rules);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toContain("required");
    });
  });
});
