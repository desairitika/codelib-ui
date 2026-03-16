# Quick Reference Guide - New Features

## Using the Validators

```jsx
import { validators, validateForm } from "@utils/validators";

// Single field validation
const emailValidation = validators.email(userEmail);
if (!emailValidation.isValid) {
  console.log(emailValidation.message);
}

// Full form validation
const formValidation = validateForm(formData, {
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
});

if (!formValidation.isValid) {
  setErrors(formValidation.errors); // { email: "Invalid email format", ... }
}
```

## Using the Safe Code Executor

```jsx
import { 
  executeJavaScript, 
  executeTypeScript, 
  formatOutput 
} from "@utils/codeExecutor";

// Execute JavaScript
const result = executeJavaScript("console.log('Hello World')");
const output = formatOutput(result); // "Hello World"

// Execute TypeScript
const tsResult = executeTypeScript("const x: number = 5; console.log(x);");
const tsOutput = formatOutput(tsResult); // "5"

// Check for errors
if (!result.success) {
  console.error(result.error);
}
```

## Using the Notification System

```jsx
import { useNotification } from "@context/NotificationContext";

function MyComponent() {
  const { notify } = useNotification();

  const handleSuccess = () => {
    notify.success("Operation completed successfully!");
  };

  const handleError = () => {
    notify.error("An error occurred!", 5000); // 5 second duration
  };

  const handleWarning = () => {
    notify.warning("Please pay attention");
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
      <button onClick={handleWarning}>Warning</button>
    </div>
  );
}
```

## Using Error Boundary

```jsx
// Wrap components that might throw errors
import ErrorBoundary from "@components/common/error-boundary/ErrorBoundary";

<ErrorBoundary>
  <MyProblematicComponent />
</ErrorBoundary>
```

## Using User Management Page

```jsx
// Automatically routed to /user-management for admin users
// Access from Header component when user.role === "admin"
```

## PropTypes Best Practices

```jsx
import PropTypes from "prop-types";

MyComponent.propTypes = {
  // Primitive types
  name: PropTypes.string,
  age: PropTypes.number,
  isActive: PropTypes.bool,
  
  // Objects and Arrays
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  tags: PropTypes.arrayOf(PropTypes.string),
  
  // Functions
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  
  // Required fields
  id: PropTypes.string.isRequired,
  
  // One of several values
  status: PropTypes.oneOf(['pending', 'completed', 'failed']),
};
```

## Form Validation Example (Login)

```jsx
const [validationErrors, setValidationErrors] = useState({});

const validateInputs = () => {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!validators.email(email).isValid) {
    errors.email = validators.email(email).message;
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  }

  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};

return (
  <input
    type="email"
    className={`form-control ${validationErrors.email ? "is-invalid" : ""}`}
    value={email}
    onChange={(e) => {
      setEmail(e.target.value);
      // Clear error on change
      if (validationErrors.email) {
        setValidationErrors(prev => ({ ...prev, email: "" }));
      }
    }}
  />
);
```

## Useful Validator Patterns

```jsx
// Email validation
const emailValidation = validators.email("user@example.com");

// Password validation - requires:
// - 8+ characters
// - Uppercase and lowercase letters
// - At least one number
const passwordValidation = validators.password("MyPass123");

// Username validation - allows:
// - 3-20 characters
// - Letters, numbers, underscores, hyphens
const usernameValidation = validators.username("john_doe");

// Custom validation
const customValidation = (value) => {
  return {
    isValid: value.length > 10,
    message: "Must be longer than 10 characters"
  };
};
```

## Accessibility Features

```jsx
// Notifications with proper ARIA
<div role="alert" aria-live="polite">
  {notification.message}
</div>

// Buttons with labels
<button aria-label="Close notification">✖</button>

// Form inputs with labels
<label htmlFor="username">Username</label>
<input id="username" type="text" />

// Error messages linked to inputs
<input aria-describedby="email-error" />
<span id="email-error" className="invalid-feedback">
  {validationErrors.email}
</span>
```

---

For more details, refer to the main IMPROVEMENTS.md file or the individual component files.
