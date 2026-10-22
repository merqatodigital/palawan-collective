import { APP_BRAND_COLOR } from "./brand";

// The agency picks its primary color in Settings -> Identity. The stylesheet
// derives the whole accent family from --brand, so applying a color is a
// matter of setting that one variable on <html> (plus --brand-rgb, which CSS
// cannot derive from a hex).
//
// The root element is where it has to land: the accent tokens are declared on
// :root, and a custom property declared there is resolved against that same
// element's --brand. Setting --brand further down the tree would leave the
// tokens at :root untouched.
export function applyBrandColor(color?: string | null) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const hex = color || APP_BRAND_COLOR;
  const rgb = hexToRgb(hex);
  if (!rgb) return;
  root.style.setProperty("--brand", hex);
  root.style.setProperty("--brand-rgb", rgb);
}

// "#b30001" -> "179, 0, 1", the triplet form rgba() needs. Returns null for
// anything that is not a six-digit hex, so a malformed value leaves the
// stylesheet defaults in place instead of breaking the accent family.
export function hexToRgb(hex: string): string | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const value = parseInt(match[1], 16);
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}
