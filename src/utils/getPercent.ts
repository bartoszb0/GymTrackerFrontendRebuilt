export default function getPercent(a: number, b: number): number {
  if (b === 0) return 0;
  return Math.round((a / b) * 100);
}
