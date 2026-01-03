import "server-only";

export interface RetryDecision {
  shouldRetry: boolean;
  delayMs: number;
}

export class ListmonkRetryPolicy {
  decide({
    attempt,
    maxAttempts,
    status,
    retryAfterSeconds,
    minDelayMs,
    maxDelayMs,
  }: {
    attempt: number;
    maxAttempts: number;
    status: number;
    retryAfterSeconds?: number | null;
    minDelayMs: number;
    maxDelayMs: number;
  }): RetryDecision {
    if (attempt >= maxAttempts) {
      return { shouldRetry: false, delayMs: 0 };
    }

    const shouldRetryStatus =
      status === 408 || status === 429 || (status >= 500 && status <= 599);
    if (!shouldRetryStatus) {
      return { shouldRetry: false, delayMs: 0 };
    }

    if (status === 429 && retryAfterSeconds && retryAfterSeconds > 0) {
      return {
        shouldRetry: true,
        delayMs: this.capDelay(retryAfterSeconds * 1000, minDelayMs, maxDelayMs),
      };
    }

    const exponential = minDelayMs * 2 ** attempt;
    const jitter = this.randomBetween(0, minDelayMs);
    return {
      shouldRetry: true,
      delayMs: this.capDelay(exponential + jitter, minDelayMs, maxDelayMs),
    };
  }

  private capDelay(value: number, minDelayMs: number, maxDelayMs: number): number {
    const safeMin = Number.isFinite(minDelayMs) ? Math.max(0, minDelayMs) : 0;
    const safeMax = Number.isFinite(maxDelayMs)
      ? Math.max(safeMin, maxDelayMs)
      : safeMin;
    const safeValue = Number.isFinite(value) ? value : safeMin;
    return Math.min(Math.max(safeValue, safeMin), safeMax);
  }

  private randomBetween(min: number, max: number): number {
    const safeMin = Number.isFinite(min) ? min : 0;
    const safeMax = Number.isFinite(max) ? max : safeMin;
    return safeMin + Math.random() * (safeMax - safeMin);
  }
}

