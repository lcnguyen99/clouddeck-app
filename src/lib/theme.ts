export const theme = {
  ink: '#0F172A',
  inkSoft: '#475569',
  inkFaint: '#94A3B8',
  bg: '#F4F6FB',
  card: '#FFFFFF',
  border: '#E2E8F0',
  brand: '#232F3E',
  accent: '#FF9900',
  radius: 16,
} as const;

/** Mix a hex color toward white. amount 0..1 */
export function tint(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
