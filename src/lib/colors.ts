import chroma from "chroma-js";

export const colors = [
  "#FF7F7F",
  "#FFFF7F",
  "#7FFF7F",
  "#7FFFFF",
  "#7F7FFF",
  "#FF7FFF",
];

export const colorsBalanced = [
  "#FF6B6B", // red
  "#E8B400", // yellow (darkened — pure light yellow disappears on white)
  "#4CAF6D", // green
  "#3DBFBF", // cyan
  "#6B7FFF", // blue
  "#E36BD9", // magenta
];

export const colorsSofter = [
  "#FF8A8A", // red
  "#E0C04D", // yellow
  "#7BD99A", // green
  "#6FD6D6", // cyan
  "#8C99FF", // blue
  "#EE93E2", // magenta
];

export const buttonColors = colorsBalanced.map((color) => ({
  bgColor: color,
  borderColor: chroma.mix(color, "#1a1a2e", 0.3).hex(),
}));

export const placeholderTextColor = "#606060";
