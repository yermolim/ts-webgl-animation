export function getRandomUuid(): string {
  return crypto.getRandomValues(new Uint32Array(4)).join("-");
}

export function hexToRgbaString(hex: string, opacity: number): string {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, hex.length / 3), 16);
  const g = parseInt(hex.substring(hex.length / 3, 2 * hex.length / 3), 16);
  const b = parseInt(hex.substring(2 * hex.length / 3, 3 * hex.length / 3), 16);
  return "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
}
