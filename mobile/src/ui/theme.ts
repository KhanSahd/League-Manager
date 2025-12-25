export const theme = {
  colors: {
    bg: "#0F172A",        // slate-900
    card: "#111827",      // gray-900
    text: "#E5E7EB",      // gray-200
    muted: "#9CA3AF",     // gray-400
    primary: "#38BDF8",   // sky-400
    danger: "#F87171",
    border: "#1F2937",
    error: "#EF4444",
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
  },
  radius: {
    sm: 6,
    md: 10,
  },
  textSize: {
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  },
  
};

export const emptyTextStyle = {
  color: theme.colors.muted,
  textAlign: "center" as const,
  marginVertical: theme.spacing.lg,
};
