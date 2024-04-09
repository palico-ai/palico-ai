export default function linearGradient (color: string, colorState: string, angle = 195): string {
  return `linear-gradient(${angle}deg, ${color}, ${colorState})`;
}
