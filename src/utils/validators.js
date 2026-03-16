/**
 * Form validation utilities
 */

export const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(value),
      message: "Invalid email format",
    };
  },

  password: (value) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*]/.test(value);

    if (value.length < minLength) {
      return {
        isValid: false,
        message: `Password must be at least ${minLength} characters long`,
      };
    }

    if (!hasUpperCase || !hasLowerCase) {
      return {
        isValid: false,
        message: "Password must contain both uppercase and lowercase letters",
      };
    }

    if (!hasNumbers) {
      return {
        isValid: false,
        message: "Password must contain at least one number",
      };
    }
    
    // if (!hasSpecialChar) {
    //   return {
    //     isValid: false,
    //     message: "Password must contain at least one special character (!@#$%^&*)",
    //   };
    // }

    return {
      isValid: true,
      message: "Password is strong",
    };
  },

  username: (value) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return {
      isValid: usernameRegex.test(value),
      message: "Username must be 3-20 characters and contain only letters, numbers, underscores, or hyphens",
    };
  },

  name: (value) => {
    const isValid = value.trim().length > 0 && value.trim().length <= 50;
    return {
      isValid,
      message: isValid ? "" : "Name is required and must be less than 50 characters",
    };
  },

  url: (value) => {
    try {
      new URL(value);
      return {
        isValid: true,
        message: "",
      };
    } catch {
      return {
        isValid: false,
        message: "Invalid URL format",
      };
    }
  },

  phone: (value) => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return {
      isValid: phoneRegex.test(value),
      message: "Invalid phone number format",
    };
  },
};

export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const value = formData[field];
    const rule = rules[field];

    if (rule.required && (!value || value.trim() === "")) {
      errors[field] = `${rule.label || field} is required`;
      return;
    }

    if (value && rule.validator) {
      const validation = rule.validator(value);
      if (!validation.isValid) {
        errors[field] = validation.message;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
