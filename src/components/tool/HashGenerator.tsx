import { useState, useEffect } from "react";
import CopyButton from "@components/tool/CopyButton";

type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

interface HashResult {
  algorithm: HashAlgorithm;
  hash: string;
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<HashAlgorithm>("SHA-256");
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("hash-input");
    const savedAlg = localStorage.getItem("hash-algorithm") as HashAlgorithm;
    if (saved) setInput(saved);
    if (savedAlg) setSelectedAlgorithm(savedAlg);
  }, []);

  // Save to localStorage on input change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("hash-input", input);
      localStorage.setItem("hash-algorithm", selectedAlgorithm);
    }, 500);
    return () => clearTimeout(timer);
  }, [input, selectedAlgorithm]);

  // Generate hashes whenever input changes
  useEffect(() => {
    if (!input) {
      setHashes([]);
      return;
    }

    const generateHashes = async () => {
      setLoading(true);
      const algorithms: HashAlgorithm[] = [
        "SHA-1",
        "SHA-256",
        "SHA-384",
        "SHA-512",
      ];
      const results: HashResult[] = [];

      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);

        for (const algorithm of algorithms) {
          const hashBuffer = await crypto.subtle.digest(algorithm, data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

          results.push({
            algorithm,
            hash: hashHex,
          });
        }

        setHashes(results);
      } catch (err) {
        console.error("Hash generation error:", err);
      } finally {
        setLoading(false);
      }
    };

    generateHashes();
  }, [input]);

  const handleClear = () => {
    setInput("");
    setHashes([]);
  };

  const handleExample = () => {
    setInput("The quick brown fox jumps over the lazy dog");
  };

  const getHashLength = (algorithm: HashAlgorithm): number => {
    switch (algorithm) {
      case "SHA-1":
        return 40;
      case "SHA-256":
        return 64;
      case "SHA-384":
        return 96;
      case "SHA-512":
        return 128;
    }
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="hash-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Text to Hash
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
          id="hash-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to generate hashes..."
          className="w-full h-32 p-4 font-mono text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          spellCheck={false}
        />
        {input && (
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Input length: {input.length} characters ({new Blob([input]).size}{" "}
            bytes)
          </p>
        )}
      </div>

      {/* Algorithm Selector */}
      <div className="flex flex-wrap gap-2 items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Quick Select:
        </label>
        {(["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as HashAlgorithm[]).map(
          (algo) => (
            <button
              key={algo}
              onClick={() => setSelectedAlgorithm(algo)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedAlgorithm === algo
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {algo}
            </button>
          ),
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Hash Results */}
      {!loading && hashes.length > 0 && (
        <div className="space-y-4">
          {hashes.map((result) => (
            <div
              key={result.algorithm}
              className={`space-y-2 p-4 rounded-lg border-2 transition-colors ${
                selectedAlgorithm === result.algorithm
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {result.algorithm}
                  </h3>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {getHashLength(result.algorithm)} characters
                  </span>
                  {result.algorithm === "SHA-1" && (
                    <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded">
                      Legacy
                    </span>
                  )}
                  {result.algorithm === "SHA-256" && (
                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded">
                      Recommended
                    </span>
                  )}
                </div>
                <CopyButton text={result.hash} label="Copy" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                <code className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
                  {result.hash}
                </code>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      {hashes.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
          <p className="font-medium mb-1">💡 Hash Properties:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Deterministic: Same input always produces the same hash</li>
            <li>One-way: Cannot be reversed to get original input</li>
            <li>
              Collision-resistant: Nearly impossible to find two inputs with
              same hash
            </li>
            <li>
              Avalanche effect: Small change in input = completely different
              hash
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
