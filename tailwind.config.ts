import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        space: ["Space Grotesk", "system-ui", "sans-serif"],
        dm:    ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        "sl-bg":       "var(--sl-bg)",
        "sl-card":     "var(--sl-card)",
        "sl-border":   "var(--sl-border)",
        "sl-primary":  "var(--sl-primary)",
        "sl-accent":   "var(--sl-accent)",
        "sl-text":     "var(--sl-text)",
        "sl-muted":    "var(--sl-text-muted)",
        "sl-success":  "var(--sl-success)",
        "sl-warning":  "var(--sl-warning)",
        "sl-danger":   "var(--sl-danger)",
      },
    },
  },
  plugins: [],
};

export default config;
