import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import MonacoEditor from "@monaco-editor/react";
import { executeJavaScript, executeTypeScript, getUnsupportedLanguageMessage, formatOutput } from "../../../utils/codeExecutor";
import styles from "./Playground.module.scss";

const DEFAULT_CODE = {
  JAVASCRIPT: "// Write your JavaScript code here",
  PYTHON: "# Write your Python code here",
  C: "// Write your C code here",
  CPP: "// Write your C++ code here",
  JAVA: "// Write your Java code here",
  GO: "// Write your Go code here",
  TYPESCRIPT: "// Write your TypeScript code here",
  RUBY: "# Write your Ruby code here",
  KOTLIN: "// Write your Kotlin code here",
  SWIFT: "// Write your Swift code here",
};

const Playground = () => {
  const [language, setLanguage] = useState("javascript");
  const [codeMap, setCodeMap] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [showConsole, setShowConsole] = useState(false);
  const [editorFlex, setEditorFlex] = useState(1);
  const [isResizing, setIsResizing] = useState(false);

  const containerRef = useRef(null);

  const code = codeMap[language] || "";

  const handleEditorChange = (value) => {
    setCodeMap((prev) => ({
      ...prev,
      [language]: value,
    }));
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setOutput("");
    setShowConsole(false);
    setEditorFlex(1);
  };

  const runCode = useCallback(() => {
    const codeToRun = codeMap[language] || "";
    let result;

    if (language.toLowerCase() === "javascript") {
      result = executeJavaScript(codeToRun);
    } else if (language.toLowerCase() === "typescript") {
      result = executeTypeScript(codeToRun);
    } else {
      setOutput(
        getUnsupportedLanguageMessage(language) + codeToRun
      );
      setShowConsole(true);
      setEditorFlex(0.6);
      return;
    }

    setOutput(formatOutput(result));
    setShowConsole(true);
    setEditorFlex(0.6);
  }, [codeMap, language]);

  const startResize = () => setIsResizing(true);
  const stopResize = () => setIsResizing(false);

  const onResize = (e) => {
    if (!isResizing || !containerRef.current) return;

    const containerHeight = containerRef.current.getBoundingClientRect().height;
    const offsetTop = containerRef.current.getBoundingClientRect().top;
    const relativeY = e.clientY - offsetTop;
    const newFlex = relativeY / containerHeight;

    if (newFlex > 0.2 && newFlex < 0.8) {
      setEditorFlex(newFlex);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => stopResize();
    const handleMouseMove = (e) => onResize(e);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const closeConsole = () => {
    setShowConsole(false);
    setEditorFlex(1);
  };

  return (
    <div ref={containerRef} className={styles.playgroundContainer}>
      {/* Toolbar */}
      <div className={styles.playgroundToolbar}>
        <select value={language} onChange={handleLanguageChange} className={styles.playgroundSelect}>
          <option value="JAVASCRIPT">JavaScript</option>
          <option value="PYTHON">Python</option>
          <option value="C">C</option>
          <option value="CPP">C++</option>
          <option value="JAVA">Java</option>
          <option value="GO">Go</option>
          <option value="TYPESCRIPT">TypeScript</option>
          <option value="RUBY">Ruby</option>
          <option value="KOTLIN">Kotlin</option>
          <option value="SWIFT">Swift</option>
        </select>
        <button onClick={runCode} className={styles.playgroundRunButton}>
          Run ▶
        </button>
      </div>

      {/* Editor + Output Container */}
      <div className={styles.playgroundMain}>
        {/* Code Editor */}
        <div style={{ flex: editorFlex, minHeight: "100px", height: "100%" }}>
          <MonacoEditor
            key={language.toLowerCase()}
            language={language.toLowerCase()}
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{ automaticLayout: true, fontSize: 14 }}
          />
        </div>

        {/* Resizer */}
        {showConsole && <div onMouseDown={startResize} className={styles.playgroundResizer} />}

        {/* Output Block */}
        {showConsole && (
          <div style={{ flex: 1 - editorFlex }} className={styles.playgroundOutput}>
            <button onClick={closeConsole} className={styles.playgroundCloseButton}>
              ✖
            </button>
            <strong>Output:</strong>
            <pre className={styles.playgroundOutput}>{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

Playground.propTypes = {};

export default Playground;
