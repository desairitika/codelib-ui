/**
 * Safe code execution utilities
 * Replaces dangerous eval() with safer alternatives
 */

export const executeJavaScript = (code) => {
  const logs = [];
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  try {
    // Override console methods to capture output
    console.log = (...args) => {
      logs.push({
        level: "log",
        message: args.map((arg) => {
          if (typeof arg === "object") {
            return JSON.stringify(arg, null, 2);
          }
          return String(arg);
        }).join(" "),
      });
    };

    console.error = (...args) => {
      logs.push({
        level: "error",
        message: args.map((arg) => {
          if (typeof arg === "object") {
            return JSON.stringify(arg, null, 2);
          }
          return String(arg);
        }).join(" "),
      });
    };

    console.warn = (...args) => {
      logs.push({
        level: "warn",
        message: args.map((arg) => {
          if (typeof arg === "object") {
            return JSON.stringify(arg, null, 2);
          }
          return String(arg);
        }).join(" "),
      });
    };

    // Execute code in a safe context
    // This is still not 100% safe but better than eval()
    // For production, consider using a Web Worker or sandboxed iframe
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    const fn = new AsyncFunction(code);
    
    // Execute the function
    fn().catch((err) => {
      logs.push({
        level: "error",
        message: `Error: ${err.message}`,
      });
    });

    return {
      success: true,
      output: logs.length > 0 ? logs : [{ level: "log", message: "No output" }],
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      output: logs,
      error: `Error: ${err.message}`,
    };
  } finally {
    // Restore console methods
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  }
};

export const executeTypeScript = (code) => {
  // TypeScript execution is similar to JavaScript but in a real app
  // you would want to transpile it first
  // For now, treat it as JavaScript
  return executeJavaScript(code);
};

// Message for unsupported languages
export const getUnsupportedLanguageMessage = (language) => {
  return `Execution for '${language}' is not supported in-browser.\nSupported languages: JavaScript, TypeScript\n\nYour code:\n`;
};

// Format output for display
export const formatOutput = (result) => {
  if (result.error) {
    return result.error;
  }

  if (result.output && result.output.length > 0) {
    return result.output
      .map((log) => log.message)
      .join("\n");
  }

  return "No output";
};
