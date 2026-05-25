import { useState, useEffect } from "react";
import CopyButton from "@components/tool/CopyButton";

interface RGB {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
  a: number;
}

interface HSV {
  h: number;
  s: number;
  v: number;
  a: number;
}

export default function ColorConverter() {
  const [inputColor, setInputColor] = useState("#3b82f6");
  const [rgb, setRgb] = useState<RGB>({ r: 59, g: 130, b: 246, a: 1 });
  const [error, setError] = useState<string | null>(null);

  // Parse color input
  useEffect(() => {
    try {
      const parsed = parseColor(inputColor);
      if (parsed) {
        setRgb(parsed);
        setError(null);
      } else {
        setError("Invalid color format");
      }
    } catch (err) {
      setError("Invalid color format");
    }
  }, [inputColor]);

  const parseColor = (input: string): RGB | null => {
    input = input.trim();

    // Try parsing as HEX
    if (input.startsWith("#")) {
      const hex = input.slice(1);
      if (hex.length === 3) {
        // #RGB -> #RRGGBB
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        return { r, g, b, a: 1 };
      } else if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return { r, g, b, a: 1 };
      } else if (hex.length === 8) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const a = parseInt(hex.slice(6, 8), 16) / 255;
        return { r, g, b, a };
      }
    }

    // Try parsing as RGB/RGBA
    const rgbMatch = input.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/,
    );
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3]),
        a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1,
      };
    }

    // Try parsing as HSL/HSLA
    const hslMatch = input.match(
      /hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([0-9.]+))?\)/,
    );
    if (hslMatch) {
      const h = parseInt(hslMatch[1]);
      const s = parseInt(hslMatch[2]) / 100;
      const l = parseInt(hslMatch[3]) / 100;
      const a = hslMatch[4] ? parseFloat(hslMatch[4]) : 1;
      return hslToRgb({ h, s, l, a });
    }

    return null;
  };

  const rgbToHex = (rgb: RGB): string => {
    const toHex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
    const hex = `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
    return rgb.a < 1 ? hex + toHex(rgb.a * 255) : hex;
  };

  const rgbToHsl = (rgb: RGB): HSL => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100, a: rgb.a };
  };

  const hslToRgb = (hsl: HSL): RGB => {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
      a: hsl.a,
    };
  };

  const rgbToHsv = (rgb: RGB): HSV => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;

    if (max !== min) {
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return { h: h * 360, s: s * 100, v: v * 100, a: rgb.a };
  };

  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const hex = rgbToHex(rgb);

  const formats = [
    { label: "HEX", value: hex },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    {
      label: "RGBA",
      value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a.toFixed(2)})`,
    },
    {
      label: "HSL",
      value: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`,
    },
    {
      label: "HSLA",
      value: `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${hsl.a.toFixed(2)})`,
    },
    {
      label: "HSV",
      value: `hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%)`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Color Input */}
      <div className="space-y-2">
        <label
          htmlFor="color-input"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Color Input (HEX, RGB, HSL)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="color-input"
            value={inputColor}
            onChange={(e) => setInputColor(e.target.value)}
            placeholder="#3b82f6 or rgb(59, 130, 246) or hsl(217, 91%, 60%)"
            className="flex-1 px-4 py-2 font-mono text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <label htmlFor="color-picker" className="sr-only">
            Pick color visually
          </label>
          <input
            id="color-picker"
            type="color"
            value={hex.slice(0, 7)}
            onChange={(e) => setInputColor(e.target.value)}
            className="w-16 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Color Preview */}
      {!error && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview
          </h3>
          <div
            className="w-full h-32 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-lg"
            style={{
              backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`,
            }}
          />
        </div>
      )}

      {/* Color Formats */}
      {!error && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            All Formats
          </h3>
          <div className="space-y-2">
            {formats.map((format) => (
              <div
                key={format.label}
                className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-16">
                    {format.label}
                  </span>
                  <code className="flex-1 font-mono text-sm text-gray-900 dark:text-gray-100 break-all">
                    {format.value}
                  </code>
                </div>
                <CopyButton
                  text={format.value}
                  label="Copy"
                  className="flex-shrink-0 text-sm py-1 px-3"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RGB Sliders */}
      {!error && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Adjust RGB Values
          </h3>

          {(["r", "g", "b"] as const).map((channel) => (
            <div key={channel} className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-medium text-gray-700 dark:text-gray-300 uppercase">
                  {channel}
                </label>
                <span className="text-gray-600 dark:text-gray-400">
                  {rgb[channel]}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb[channel]}
                onChange={(e) => {
                  const newRgb = {
                    ...rgb,
                    [channel]: parseInt(e.target.value),
                  };
                  setRgb(newRgb);
                  setInputColor(rgbToHex(newRgb));
                }}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          ))}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="font-medium text-gray-700 dark:text-gray-300">
                Alpha (Opacity)
              </label>
              <span className="text-gray-600 dark:text-gray-400">
                {rgb.a.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={rgb.a}
              onChange={(e) => {
                const newRgb = { ...rgb, a: parseFloat(e.target.value) };
                setRgb(newRgb);
                setInputColor(rgbToHex(newRgb));
              }}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { ColorConverter };
