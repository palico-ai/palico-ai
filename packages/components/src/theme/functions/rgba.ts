import hexToRgb from './hexToRgb';

export default function rgba (color: string, opacity: string | number): string {
  return `rgba(${hexToRgb(color)}, ${opacity})`;
}
