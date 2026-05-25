import { useState, useEffect } from "react";
import CopyButton from "@components/tool/CopyButton";

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedUppercase = localStorage.getItem("uuid-uppercase");
    const savedHyphens = localStorage.getItem("uuid-hyphens");
    if (savedUppercase) setUppercase(savedUppercase === "true");
    if (savedHyphens) setHyphens(savedHyphens === "true");
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("uuid-uppercase", uppercase.toString());
    localStorage.setItem("uuid-hyphens", hyphens.toString());
  }, [uppercase, hyphens]);

  const generateUuid = (): string => {
    let uuid = crypto.randomUUID();

    if (!hyphens) {
      uuid = uuid.replace(/-/g, "");
    }

    if (uppercase) {
      uuid = uuid.toUpperCase();
    }

    return uuid;
  };

  const handleGenerate = () => {
    const newUuids = Array.from({ length: Math.min(count, 100) }, () =>
      generateUuid(),
    );
    setUuids(newUuids);
  };

  const handleCopyAll = async () => {
    const allUuids = uuids.join("\n");
    try {
      await navigator.clipboard.writeText(allUuids);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Generate one UUID on mount
  useEffect(() => {
    handleGenerate();
  }, []);

  // Regenerate when format options change
  useEffect(() => {
    if (uuids.length > 0) {
      handleGenerate();
    }
  }, [uppercase, hyphens]);

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Count */}
        <div className="space-y-2">
          <label
            htmlFor="uuid-count"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Number of UUIDs (1-100)
          </label>
          <input
            id="uuid-count"
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) =>
              setCount(
                Math.max(1, Math.min(100, parseInt(e.target.value) || 1)),
              )
            }
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Format Options */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Format Options
          </label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Uppercase
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hyphens}
                onChange={(e) => setHyphens(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Include Hyphens
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
      >
        Generate {count > 1 ? `${count} UUIDs` : "UUID"}
      </button>

      {/* Generated UUIDs */}
      {uuids.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated UUIDs ({uuids.length})
            </h3>
            {uuids.length > 1 && (
              <button
                onClick={handleCopyAll}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Copy All
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            {uuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
              >
                <code className="flex-1 font-mono text-sm text-gray-900 dark:text-gray-100 break-all">
                  {uuid}
                </code>
                <CopyButton
                  text={uuid}
                  label="Copy"
                  className="flex-shrink-0 text-sm py-1 px-3"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
        <p className="font-medium mb-2">💡 About UUID v4:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Randomly generated using cryptographically secure RNG</li>
          <li>122 random bits + 6 fixed bits for version and variant</li>
          <li>
            Collision probability: ~1 in 2.71 quintillion for 1 billion UUIDs
          </li>
          <li>Standard format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</li>
        </ul>
      </div>
    </div>
  );
}
