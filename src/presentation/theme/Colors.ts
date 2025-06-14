// HSL to HEX helper (Not for production, just for conversion)
// const hslToHex = (h, s, l) => {
//   l /= 100;
//   const a = s * Math.min(l, 1 - l) / 100;
//   const f = n => {
//     const k = (n + h / 30) % 12;
//     const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
//     return Math.round(255 * color).toString(16).padStart(2, '0');
//   };
//   return `#${f(0)}${f(8)}${f(4)}`;
// };

type ColorScheme = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
};

export const themes = {
  gece: {
    background: "#1e1e20",
    foreground: "#fcfcfc",
    card: "#2d2d30",
    cardForeground: "#fcfcfc",
    popover: "#2d2d30",
    popoverForeground: "#fcfcfc",
    primary: "#8b5cf6",
    primaryForeground: "#ffffff",
    secondary: "#3f3f42",
    secondaryForeground: "#fcfcfc",
    muted: "#3f3f42",
    mutedForeground: "#a2a2a6",
    accent: "#3f3f42",
    accentForeground: "#fcfcfc",
    destructive: "#ef4444",
    destructiveForeground: "#fcfcfc",
    border: "#3f3f42",
    input: "#3f3f42",
    ring: "#8b5cf6",
  },
  white: {
    background: "#ffffff",
    foreground: "#09090b",
    card: "#ffffff",
    cardForeground: "#09090b",
    popover: "#ffffff",
    popoverForeground: "#09090b",
    primary: "#1c1f48",
    primaryForeground: "#f8f9fa",
    secondary: "#f2f2f5",
    secondaryForeground: "#1c1f48",
    muted: "#f2f2f5",
    mutedForeground: "#70707b",
    accent: "#f2f2f5",
    accentForeground: "#1c1f48",
    destructive: "#d94748",
    destructiveForeground: "#f8f9fa",
    border: "#e3e3e8",
    input: "#e3e3e8",
    ring: "#1c1f48",
  },
  love: {
    background: "#fef4f7",
    foreground: "#8c2d52",
    card: "#fdeaf0",
    cardForeground: "#8c2d52",
    popover: "#fdeaf0",
    popoverForeground: "#8c2d52",
    primary: "#f44383",
    primaryForeground: "#ffffff",
    secondary: "#fcdbe8",
    secondaryForeground: "#a63b65",
    muted: "#fbe6ed",
    mutedForeground: "#c05680",
    accent: "#f8a0bf",
    accentForeground: "#782345",
    destructive: "#e64c4d",
    destructiveForeground: "#ffffff",
    border: "#faccdf",
    input: "#faccdf",
    ring: "#f44383",
  },
  dogasever: {
    background: "#f7fbf7",
    foreground: "#1e3d1e",
    card: "#f2f9f2",
    cardForeground: "#1e3d1e",
    popover: "#f2f9f2",
    popoverForeground: "#1e3d1e",
    primary: "#4d994d",
    primaryForeground: "#ffffff",
    secondary: "#e6f2e6",
    secondaryForeground: "#264d26",
    muted: "#e9f4e9",
    mutedForeground: "#4d7a4d",
    accent: "#d3e8d3",
    accentForeground: "#396339",
    destructive: "#e66363",
    destructiveForeground: "#ffffff",
    border: "#d3e0d3",
    input: "#d3e0d3",
    ring: "#4d994d",
  },
  gokyuzu: {
    background: "#f6f9fc",
    foreground: "#192b41",
    card: "#f1f5f9",
    cardForeground: "#192b41",
    popover: "#f1f5f9",
    popoverForeground: "#192b41",
    primary: "#3b82f6",
    primaryForeground: "#ffffff",
    secondary: "#e6eef9",
    secondaryForeground: "#295499",
    muted: "#e9f0fa",
    mutedForeground: "#4d76b8",
    accent: "#d3e1f4",
    accentForeground: "#3366cc",
    destructive: "#e66363",
    destructiveForeground: "#ffffff",
    border: "#d3dce8",
    input: "#d3dce8",
    ring: "#3b82f6",
  },
  lavanta: {
    background: "#f9f8fc",
    foreground: "#3d1941",
    card: "#f5f1f9",
    cardForeground: "#3d1941",
    popover: "#f5f1f9",
    popoverForeground: "#3d1941",
    primary: "#8b5cf6",
    primaryForeground: "#ffffff",
    secondary: "#eee6f9",
    secondaryForeground: "#6a2999",
    muted: "#f1e9fa",
    mutedForeground: "#994db8",
    accent: "#e3d3f4",
    accentForeground: "#7e33cc",
    destructive: "#e66363",
    destructiveForeground: "#ffffff",
    border: "#e8d3e8",
    input: "#e8d3e8",
    ring: "#8b5cf6",
  },
  gunbatimi: {
    background: "#fcf9f8",
    foreground: "#413d19",
    card: "#f9f5f1",
    cardForeground: "#413d19",
    popover: "#f9f5f1",
    popoverForeground: "#413d19",
    primary: "#f68b5c",
    primaryForeground: "#ffffff",
    secondary: "#f9eee6",
    secondaryForeground: "#996a29",
    muted: "#faefe9",
    mutedForeground: "#b8994d",
    accent: "#f4e3d3",
    accentForeground: "#cc7e33",
    destructive: "#e66363",
    destructiveForeground: "#ffffff",
    border: "#e8e8d3",
    input: "#e8e8d3",
    ring: "#f68b5c",
  },
};

export type ThemeName = keyof typeof themes;

export type Theme = (typeof themes)[ThemeName];

// For the old theme system to not break immediately
export const colors = themes.gece;
