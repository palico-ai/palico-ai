import chroma from 'chroma-js';

export default function hexToRgb (color: string): string {
  return chroma(color).rgb().join(', ');
}
