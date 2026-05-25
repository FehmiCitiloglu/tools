import { useState, useEffect } from "react";
import CopyButton from "@components/tool/CopyButton";

interface DecodedJWT {
  header: Record<string, any>;
  payload: Record<string, any>;
  signature: string;
  raw: {
    header: string;
    payload: string;
    signature: string;
  };
}

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("jwt-input");
    if (saved) setInput(saved);
  }, []);

  // Save to localStorage on input change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input) {
        localStorage.setItem("jwt-input", input);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [input]);

  // Decode JWT whenever input changes
  useEffect(() => {
    if (!input.trim()) {
      setDecoded(null);
      setError(null);
      return;
    }

    try {
      // Remove common prefixes
      let token = input.trim();
      if (token.toLowerCase().startsWith("bearer ")) {
        token = token.substring(7);
      }

      // Split JWT into parts
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error(
          "Invalid JWT format. Expected 3 parts separated by dots.",
        );
      }

      const [headerB64, payloadB64, signatureB64] = parts;

      // Decode header and payload
      const header = JSON.parse(
        atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")),
      );
      const payload = JSON.parse(
        atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")),
      );

      setDecoded({
        header,
        payload,
        signature: signatureB64,
        raw: {
          header: headerB64,
          payload: payloadB64,
          signature: signatureB64,
        },
      });
      setError(null);
    } catch (err) {
      setDecoded(null);
      setError(err instanceof Error ? err.message : "Invalid JWT token");
    }
  }, [input]);

  const handleClear = () => {
    setInput("");
    setDecoded(null);
    setError(null);
    localStorage.removeItem("jwt-input");
  };

  const handleExample = () => {
    // Example JWT (not a valid signature, just for demonstration)
    const exampleToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    setInput(exampleToken);
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="jwt-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            JWT Token
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleExample}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Load Example
            </button>
            <button
              onClick={handleClear}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
        <textarea
          id="jwt-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JWT token here... (Bearer prefix will be removed automatically)"
          className="w-full h-32 p-4 font-mono text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          spellCheck={false}
        />
      </div>

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

      {/* Decoded JWT */}
      {decoded && (
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Header
              </h3>
              <CopyButton
                text={JSON.stringify(decoded.header, null, 2)}
                label="Copy"
              />
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <pre className="text-sm font-mono text-gray-900 dark:text-gray-100 overflow-x-auto">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Algorithm:{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                {decoded.header.alg}
              </code>
              , Type:{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                {decoded.header.typ}
              </code>
            </p>
          </div>

          {/* Payload */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payload (Claims)
              </h3>
              <CopyButton
                text={JSON.stringify(decoded.payload, null, 2)}
                label="Copy"
              />
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <pre className="text-sm font-mono text-gray-900 dark:text-gray-100 overflow-x-auto">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>
            {/* Show decoded timestamps if present */}
            {(decoded.payload.iat ||
              decoded.payload.exp ||
              decoded.payload.nbf) && (
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                {decoded.payload.iat && (
                  <p>
                    Issued At (iat):{" "}
                    <span className="font-semibold">
                      {formatTimestamp(decoded.payload.iat)}
                    </span>
                  </p>
                )}
                {decoded.payload.exp && (
                  <p>
                    Expires (exp):{" "}
                    <span className="font-semibold">
                      {formatTimestamp(decoded.payload.exp)}
                    </span>
                  </p>
                )}
                {decoded.payload.nbf && (
                  <p>
                    Not Before (nbf):{" "}
                    <span className="font-semibold">
                      {formatTimestamp(decoded.payload.nbf)}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Signature */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Signature
              </h3>
              <CopyButton text={decoded.signature} label="Copy" />
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <pre className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
                {decoded.signature}
              </pre>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              ⚠️ Signature verification requires the secret key and is not
              performed by this tool.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
