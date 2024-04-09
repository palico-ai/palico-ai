import pxToRem from './pxToRem';
import rgba from './rgba';

export default function boxShadow (offset: [number, number], radius: [number, number], color: string, opacity: number, inset = ''): string {
  const [x, y] = offset;
  const [blur, spread] = radius;

  return `${inset} ${pxToRem(x)} ${pxToRem(y)} ${pxToRem(blur)} ${pxToRem(
    spread
  )} ${rgba(color, opacity)}`;
}
