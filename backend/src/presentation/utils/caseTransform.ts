const toSnakeCase = (key: string) => key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const toSnakeCaseObject = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => toSnakeCaseObject(item));
  }

  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => !['id', 'createdAt', 'updatedAt'].includes(key))
        .map(([key, item]) => [toSnakeCase(key), toSnakeCaseObject(item)])
    );
  }

  return value;
};
