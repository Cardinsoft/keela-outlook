type ToStringHandler = {
  [P in string | { toString(): string } as string]: (item: P) => string;
}[string];

type ToStringRule = [boolean, ToStringHandler];

/**
 * @summary override-safe default stringifier
 * @param item item to stringify
 */
export const safeToString = (item: unknown) => {
  const rules: ToStringRule[] = [
    [typeof item === "string", (item: string) => item],
    [
      typeof item === "object" && !!item && "toString" in item,
      (item: { toString(): string }) => item.toString(),
    ],
  ];

  const [, handler] = rules.find(([condition]) => !!condition) || [];

  return handler?.(item as string) || Object.prototype.toString.call(item);
};
