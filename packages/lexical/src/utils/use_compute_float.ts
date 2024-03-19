import {
  ComputePositionConfig,
  computePosition,
} from "@floating-ui/dom";
import { ElementAbsoluteCoordinate } from "..";

export const computePositionAtSelection = async (
  selection: Selection,
  floating: HTMLElement,
  options: Partial<ComputePositionConfig> = {
    placement: "bottom-start",
  }
): Promise<ElementAbsoluteCoordinate | undefined> => {
  const domRange = selection?.rangeCount !== 0 && selection?.getRangeAt(0);
  if (!domRange) {
    return undefined;
  }
  try {
    const pos = await computePosition(domRange, floating, options);
    const x = pos.x < 0 ? 0 : pos.x;
    const y = pos.y < 0 ? 0 : pos.y + 4;
    return { x, y };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
