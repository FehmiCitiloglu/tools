import { useState, useEffect } from "react";
import CopyButton from "@components/tool/CopyButton";

type IndentOption = 2 | 4 | "tab" | "compact";

interface ValidationResult {
  isValid: boolean;
  error?: string;
  formatted?: string;
}

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<IndentOption>(2);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("json-formatter-input");
    if (saved) {
      setInput(saved);
    }
  }, []);

  // Save to localStorage on input change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input) {
        localStorage.setItem("json-formatter-input", input);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [input]);

  // Format JSON whenever input or indent changes
  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setValidationResult(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      let formatted: string;

      if (indent === "compact") {
        formatted = JSON.stringify(parsed);
      } else if (indent === "tab") {
        formatted = JSON.stringify(parsed, null, "\t");
      } else {
        formatted = JSON.stringify(parsed, null, indent);
      }

      setOutput(formatted);
      setValidationResult({ isValid: true, formatted });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid JSON";
      setOutput("");
      setValidationResult({ isValid: false, error: errorMessage });
    }
  }, [input, indent]);

  const handleClear = () => {
    setInput("");
    setOutput("");
    setValidationResult(null);
    localStorage.removeItem("json-formatter-input");
  };

  const handleExample = () => {
    const example = JSON.stringify({
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "New York",
        country: "USA",
      },
      hobbies: ["reading", "coding", "traveling"],
    });
    setInput(example);
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="flex flex-wrap gap-4 items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Indentation:
        </label>
        <div className="flex gap-2">
          {[2, 4, "tab", "compact"].map((option) => (
            <button
              key={option}
              onClick={() => setIndent(option as IndentOption)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                indent === option
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {option === "tab"
                ? "Tab"
                : option === "compact"
                  ? "Compact"
                  : `${option} spaces`}
            </button>
          ))}
        </div>
        <button
          onClick={handleExample}
          className="ml-auto px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Load Example
        </button>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="json-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Input JSON
          </label>
          <button
            onClick={handleClear}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Clear
          </button>
        </div>
        <textarea
          id="json-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste your JSON here... e.g. {"name": "value"}'
          className="w-full h-64 p-4 font-mono text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          spellCheck={false}
        />
      </div>

      {/* Validation Result */}
      {validationResult && (
        <div
          className={`p-4 rounded-lg ${
            validationResult.isValid
              ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
              : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
          }`}
        >
          {validationResult.isValid ? (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Valid JSON</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Invalid JSON</span>
              </div>
              <p className="text-sm ml-7">{validationResult.error}</p>
            </div>
          )}
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="json-output"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Formatted JSON
            </label>
            <CopyButton text={output} label="Copy" />
          </div>
          <pre className="w-full p-4 font-mono text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg overflow-x-auto">
            <code className="text-gray-900 dark:text-gray-100">{output}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
