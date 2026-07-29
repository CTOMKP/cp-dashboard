export type RetryAsyncOptions = {
  maxAttempts?: number;
  delayMs?: number;
  backoff?: boolean;
};

export async function retryAsync<T>(
  fn: () => Promise<T>,
  options: RetryAsyncOptions = {},
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3;
  const delayMs = options.delayMs ?? 400;
  const backoff = options.backoff ?? true;

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts - 1) break;
      const wait = backoff ? delayMs * (attempt + 1) : delayMs;
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Retry attempts exhausted");
}

export async function waitForPrivyAccessToken(
  getAccessToken: () => Promise<string | null>,
  maxAttempts = 40,
  delayMs = 50,
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const token = await getAccessToken();
    if (token) return token;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error("No Privy access token available after login");
}

export async function waitForBackendAuthToken(
  readToken: () => string | null,
  maxAttempts = 60,
  delayMs = 50,
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const token = readToken();
    if (token) return token;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error("Backend auth token not available");
}
