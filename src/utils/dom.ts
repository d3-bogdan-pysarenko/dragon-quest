export const getRequiredElement = <T extends Element>(
  root: ParentNode,
  selector: string,
  messagePrefix = 'Element not found'
): T => {
  const element = root.querySelector<T>(selector);

  if (!element) {
    throw new Error(`${messagePrefix}: ${selector}`);
  }

  return element;
};

export const getClosestElement = <T extends Element>(
  target: EventTarget | null,
  selector: string
): T | null => {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest<T>(selector);
};
