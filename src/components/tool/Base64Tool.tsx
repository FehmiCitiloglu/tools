import { useState, useEffect } from "react";
import CopyButton from "@components/tool/CopyButton";

type Mode = "encode" | "decode";

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedInput = localStorage.getItem("base64-input");
    const savedMode = localStorage.getItem("base64-mode") as Mode;
    if (savedInput) setInput(savedInput);
    if (savedMode) setMode(savedMode);
  }, []);

  // Save to localStorage on input change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("base64-input", input);
      localStorage.setItem("base64-mode", mode);
    }, 500);
    return () => clearTimeout(timer);
  }, [input, mode]);

  // Process conversion whenever input or mode changes
  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      if (mode === "encode") {
        // Encode to Base64
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
        setError(null);
      } else {
        // Decode from Base64
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
        setError(null);
      }
    } catch (err) {
      setOutput("");
      setError(mode === "decode" ? "Invalid Base64 string" : "Encoding error");
    }
  }, [input, mode]);

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleSwap = () => {
    setInput(output);
    setMode(mode === "encode" ? "decode" : "encode");
  };

  const handleExampleEncode = () => {
    setMode("encode");
    setInput("Hello, World! 🌍");
  };

  const handleExampleDecode = () => {
    setMode("decode");
    setInput("SGVsbG8sIFdvcmxkISDwn4yN");
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("encode")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              mode === "encode"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              mode === "decode"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Decode
          </button>
        </div>
        <button
          onClick={
            mode === "encode" ? handleExampleEncode : handleExampleDecode
          }
          className="ml-auto px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Load Example
        </button>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="base64-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
          </label>
          <button
            onClick={handleClear}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Clear
          </button>
        </div>
        <textarea
          id="base64-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "encode"
              ? "Enter text to encode..."
              : "Enter Base64 string to decode..."
          }
          className="w-full h-48 p-4 font-mono text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          spellCheck={false}
        />
      </div>

      {/* Swap Button */}
      {output && !error && (
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            aria-label="Swap input and output"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
            Swap & Convert
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Output */}
      {output && !error && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="base64-output"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {mode === "encode" ? "Encoded Base64" : "Decoded Text"}
            </label>
            <CopyButton text={output} label="Copy" />
          </div>
          <textarea
            id="base64-output"
            value={output}
            readOnly
            className="w-full h-48 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-y"
          />
        </div>
      )}
    </div>
  );
}
