export const tokens = {
  color: {
    primary: {
      "500": "#6366F1",
      "600": "#4F46E5",
      "700": "#4338CA",
    },
    mint: {
      "600": "#059669",
      "700": "#047857",
    },
    orange: {
      "600": "#EA580C",
      "700": "#C2410C",
    },
    neutral: {
      "50": "#F9FAFB",
      "300": "#D1D5DB",
      "700": "#374151",
      "900": "#111827",
    },
    semantic: {
      "success-700": "#047857",
      "success-50": "rgba(4, 120, 87, 0.12)",
      "info-700": "#1D4ED8",
      "warning-700": "#B45309",
      "warning-600": "#D97706",
      "danger-700": "#B91C1C",
      "danger-600": "#DC2626",
    },
    gradient: {
      hero: "linear-gradient(135deg, #4F46E5 0%, #2563EB 45%, #059669 100%)",
    },
    focus: {
      ring: "0 0 0 3px rgba(79, 70, 229, 0.35)",
    },
  },
  typography: {
    fontFamily: {
      heading:
        '"Manrope", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
      body: '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
      mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontSize: {
      h1: "clamp(2rem, 1.2rem + 3vw, 3rem)",
      h2: "clamp(1.5rem, 1rem + 2vw, 2.25rem)",
      h3: "clamp(1.125rem, 0.95rem + 0.6vw, 1.5rem)",
      body: "clamp(1rem, 0.95rem + 0.3vw, 1.125rem)",
      small: "0.875rem",
      mono: "0.875rem",
    },
    lineHeight: {
      display: "1.15",
      heading: "1.25",
      body: "1.6",
    },
    fontWeight: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    letterSpacing: {
      tight: "-0.01em",
      normal: "0em",
      wide: "0.04em",
    },
  },
  spacing: {
    "1": "clamp(0.25rem, 0.18rem + 0.3vw, 0.5rem)",
    "2": "clamp(0.5rem, 0.35rem + 0.6vw, 1rem)",
    "3": "clamp(0.75rem, 0.6rem + 0.6vw, 1.25rem)",
    "4": "clamp(1rem, 0.7rem + 1vw, 1.5rem)",
    "5": "clamp(1.5rem, 1.1rem + 1.5vw, 2rem)",
    "6": "clamp(2rem, 1.6rem + 2vw, 3rem)",
    "7": "clamp(3rem, 2.4rem + 3vw, 4rem)",
    "8": "clamp(4rem, 3.2rem + 4vw, 6rem)",
    "9": "clamp(6rem, 4.8rem + 6vw, 9rem)",
  },
  radii: {
    sm: "6px",
    md: "12px",
    lg: "20px",
    pill: "999px",
  },
  elevation: {
    xs: "0 1px 2px rgba(2, 6, 23, 0.06)",
    sm: "0 1px 2px rgba(2, 6, 23, 0.06), 0 2px 6px rgba(2, 6, 23, 0.06)",
    md: "0 12px 24px -12px rgba(2, 6, 23, 0.18)",
    lg: "0 20px 40px -20px rgba(2, 6, 23, 0.22)",
  },
  breakpoint: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1440px",
  },
  motion: {
    duration: {
      fast: "150ms",
      base: "250ms",
      slow: "400ms",
    },
    easing: {
      standard: "cubic-bezier(0.2, 0.0, 0.38, 0.9)",
      emphasized: "cubic-bezier(0.2, 0.0, 0, 1)",
    },
  },
  zIndex: {
    base: "0",
    dropdown: "1000",
    overlay: "1300",
    modal: "1500",
    toast: "1800",
  },
} as const;

export type Tokens = typeof tokens;
