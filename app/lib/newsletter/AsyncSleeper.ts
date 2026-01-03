import "server-only";

export class AsyncSleeper {
  sleep(ms: number): Promise<void> {
    const safeMs = Number.isFinite(ms) ? Math.max(0, ms) : 0;
    return new Promise((resolve) => setTimeout(resolve, safeMs));
  }
}

