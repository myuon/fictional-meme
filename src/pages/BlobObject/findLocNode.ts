const getElementByLine = (element: HTMLElement, nth: number) => {
  let counter = 1;

  for (let i = 0; i < element.childNodes.length; i++) {
    const current = element.childNodes.item(i);
    if (counter == nth) {
      return current;
    }

    if (current.textContent?.includes("\n")) {
      counter++;
    }
  }
};

const getElementByColumn = (element: Node, column: number) => {
  let counter = 0;
  let current = element;

  while (counter < column) {
    const length = current?.textContent?.length;
    if (length) {
      counter += length;
    }

    if (current.nextSibling) {
      current = current.nextSibling;
    } else {
      return undefined;
    }
  }

  // It should be column === counter, but sometimes this is not the case. Why?
  return current.nextSibling;
};

export const findLocNode = (
  element: HTMLElement,
  loc: { line: number; column: number }
) => {
  if (!element) {
    return undefined;
  }

  const lineElement = getElementByLine(element, loc.line);
  if (!lineElement) {
    return undefined;
  }

  const node = getElementByColumn(lineElement, loc.column);
  if (!node) {
    return undefined;
  }

  return node as HTMLElement;
};
