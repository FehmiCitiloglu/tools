import { useState, useEffect } from "react";
import CopyButton from "@components/tool/CopyButton";

type TimestampUnit = "seconds" | "milliseconds";

export default function TimestampConverter() {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [inputTimestamp, setInputTimestamp] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [timestampUnit, setTimestampUnit] = useState<TimestampUnit>("seconds");
  const [parsedDate, setParsedDate] = useState<Date | null>(null);
  const [timestampError, setTimestampError] = useState<string | null>(null);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Parse timestamp input
  useEffect(() => {
    if (!inputTimestamp.trim()) {
      setParsedDate(null);
      setTimestampError(null);
      return;
    }

    try {
      const num = parseInt(inputTimestamp);
      if (isNaN(num)) {
        throw new Error("Invalid number");
      }

      const ms = timestampUnit === "seconds" ? num * 1000 : num;
      const date = new Date(ms);

      if (isNaN(date.getTime())) {
        throw new Error("Invalid timestamp");
      }

      setParsedDate(date);
      setTimestampError(null);
    } catch (err) {
      setParsedDate(null);
      setTimestampError("Invalid timestamp");
    }
  }, [inputTimestamp, timestampUnit]);

  // Parse date input
  useEffect(() => {
    if (!inputDate.trim()) {
      return;
    }

    try {
      const date = new Date(inputDate);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      setParsedDate(date);
    } catch (err) {
      // Ignore date parsing errors
    }
  }, [inputDate]);

  const formatDate = (date: Date): string => {
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  };

  const handleUseNow = () => {
    setInputTimestamp(
      timestampUnit === "seconds"
        ? Math.floor(Date.now() / 1000).toString()
        : Date.now().toString(),
    );
  };

  const handleClear = () => {
    setInputTimestamp("");
    setInputDate("");
    setParsedDate(null);
    setTimestampError(null);
  };

  return (
    <div className="space-y-8">
      {/* Current Time Display */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Current Time
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Unix Seconds
              </span>
              <CopyButton
                text={Math.floor(currentTime / 1000).toString()}
                label="Copy"
                className="text-sm py-1 px-3"
              />
            </div>
            <code className="block p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-mono text-sm">
              {Math.floor(currentTime / 1000)}
            </code>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Unix Milliseconds
              </span>
              <CopyButton
                text={currentTime.toString()}
                label="Copy"
                className="text-sm py-1 px-3"
              />
            </div>
            <code className="block p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-mono text-sm">
              {currentTime}
            </code>
          </div>
          <div className="space-y-2 md:col-span-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ISO 8601 (UTC)
              </span>
              <CopyButton
                text={new Date(currentTime).toISOString()}
                label="Copy"
                className="text-sm py-1 px-3"
              />
            </div>
            <code className="block p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-mono text-sm break-all">
              {new Date(currentTime).toISOString()}
            </code>
          </div>
        </div>
      </div>

      {/* Timestamp to Date */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Timestamp → Date
        </h3>

        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={inputTimestamp}
              onChange={(e) => setInputTimestamp(e.target.value)}
              placeholder="Enter Unix timestamp..."
              className="w-full px-4 py-2 font-mono bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleUseNow}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Now
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTimestampUnit("seconds")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timestampUnit === "seconds"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Seconds (10 digits)
          </button>
          <button
            onClick={() => setTimestampUnit("milliseconds")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timestampUnit === "milliseconds"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Milliseconds (13 digits)
          </button>
        </div>

        {timestampError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {timestampError}
          </div>
        )}

        {parsedDate && !timestampError && inputTimestamp && (
          <div className="space-y-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Local Time
              </span>
              <p className="text-lg text-gray-900 dark:text-white">
                {formatDate(parsedDate)}
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                UTC
              </span>
              <p className="text-lg text-gray-900 dark:text-white">
                {parsedDate.toUTCString()}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ISO 8601
                </span>
                <CopyButton
                  text={parsedDate.toISOString()}
                  label="Copy"
                  className="text-sm py-1 px-3"
                />
              </div>
              <code className="block p-2 bg-white dark:bg-gray-800 rounded text-sm font-mono">
                {parsedDate.toISOString()}
              </code>
            </div>
          </div>
        )}
      </div>

      {/* Date to Timestamp */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Date → Timestamp
        </h3>

        <label htmlFor="date-input" className="sr-only">
          Select date and time
        </label>
        <input
          id="date-input"
          type="datetime-local"
          value={inputDate}
          onChange={(e) => setInputDate(e.target.value)}
          className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {parsedDate && inputDate && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Unix Seconds
                </span>
                <CopyButton
                  text={Math.floor(parsedDate.getTime() / 1000).toString()}
                  label="Copy"
                  className="text-sm py-1 px-3"
                />
              </div>
              <code className="block p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-mono text-sm">
                {Math.floor(parsedDate.getTime() / 1000)}
              </code>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Unix Milliseconds
                </span>
                <CopyButton
                  text={parsedDate.getTime().toString()}
                  label="Copy"
                  className="text-sm py-1 px-3"
                />
              </div>
              <code className="block p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-mono text-sm">
                {parsedDate.getTime()}
              </code>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleClear}
        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        Clear All
      </button>
    </div>
  );
}
