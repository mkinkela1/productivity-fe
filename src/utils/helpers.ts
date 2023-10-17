export function isNotNullOrUndefined<T>(
  value: T | null | undefined,
): value is T {
  return value !== null && value !== undefined;
}

export function isNullOrUndefined<T>(
  value: T | null | undefined,
): value is null | undefined {
  return value === null || value === undefined;
}

type TEmpty = "" | [];

export function isEmpty<T extends string | unknown[]>(
  value: T | null | undefined | TEmpty,
): value is TEmpty | null | undefined {
  return isNullOrUndefined(value) || value.length === 0;
}

export function isNotEmpty<T extends string | unknown[]>(
  value: T | null | undefined,
): value is T {
  return !isEmpty(value);
}
