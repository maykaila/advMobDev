export const themePalettes = (accentColor) => ({
  light: {
    background: "#FFFFFF",
    primary: "#0002FC", // your chosen accent for light
    card: "#F6F6F6",
    text: "#0002FC",
  },
  dark: {
    background: "#0B0C07",
    primary: "#35DE4E",
    card: "#1A1A1A",
    text: "#35DE4E",
  },
  custom: {
    background: "#0B0C07",
    primary: accentColor || "#35DE4E",
    card: "#1A1A1A",
    text: accentColor,
  },
});
