function getRandomUuid(): string {
  return crypto.getRandomValues(new Uint32Array(4)).join("-");
}

function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function getRandomInt(min: number, max: number): number {
  return Math.round(Math.random() * (max - min)) + min;
}

function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function hexToRgba(hex: string, opacity: number, denominator = 1): string {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, hex.length / 3), 16);
  const g = parseInt(hex.substring(hex.length / 3, 2 * hex.length / 3), 16);
  const b = parseInt(hex.substring(2 * hex.length / 3, 3 * hex.length / 3), 16);
  return "rgba(" + r + "," + g + "," + b + "," + opacity / denominator + ")";
}

function drawCircle(ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number, colorS: string | null, colorF: string | null): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  if (colorF !== null) {
    ctx.fillStyle = colorF;
    ctx.fill();
  }
  if (colorS !== null) {
    ctx.strokeStyle = colorS;
    ctx.stroke();
  }
}

function drawLine(ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number, width: number, color: string) {
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export { getRandomUuid, getDistance, getRandomInt, getRandomArbitrary, hexToRgba, drawCircle, drawLine };
