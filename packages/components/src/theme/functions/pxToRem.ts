export default function pxToRem (value: number, baseNumber = 16): string {
  return `${value / baseNumber}rem`;
}
