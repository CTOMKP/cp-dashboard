export function unwrapApiData<T = unknown>(res: unknown): T {
  return ((res as { data?: unknown })?.data ?? res) as T;
}

export function unwrapApiEnvelope<T = unknown>(res: unknown): T {
  let current: unknown = res;
  const maxDepth = 6;
  for (let i = 0; i < maxDepth; i += 1) {
    if (!current || typeof current !== "object") break;
    const next = (current as { data?: unknown }).data;
    if (next === undefined) break;
    current = next;
  }
  return current as T;
}

export function unwrapApiJsonBody<T = unknown>(raw: unknown): T {
  return unwrapApiEnvelope(unwrapApiData(raw)) as T;
}

export function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}
