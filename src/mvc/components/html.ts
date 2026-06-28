export const html = (
  strings: TemplateStringsArray,
  ...values: Array<string | number | null | undefined>
): string =>
  strings.reduce((result, string, index) => {
    const value = values[index];

    return `${result}${string}${value ?? ''}`;
  }, '');
