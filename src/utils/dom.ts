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
