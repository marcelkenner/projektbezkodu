"use client";

import { useEffect } from "react";

class PerformanceMeasureSanitizer {
  private originalMeasure?: typeof performance.measure;

  enable(): void {
    if (
      typeof performance === "undefined" ||
      typeof performance.measure !== "function" ||
      this.originalMeasure
    ) {
      return;
    }

    this.originalMeasure = performance.measure.bind(performance);
    performance.measure = ((...rawArgs) =>
      this.safeMeasure(rawArgs)) as typeof performance.measure;
  }

  disable(): void {
    if (!this.originalMeasure || typeof performance === "undefined") {
      return;
    }
    performance.measure = this.originalMeasure;
    this.originalMeasure = undefined;
  }

  private safeMeasure(
    args: Parameters<typeof performance.measure>,
  ): PerformanceMeasure | undefined {
    if (!this.originalMeasure) {
      return undefined;
    }

    const normalizedArgs = this.normalizeArgs(args);

    try {
      return this.originalMeasure(...normalizedArgs);
    } catch (error) {
      if (
        error instanceof DOMException &&
        /negative time stamp/i.test(error.message)
      ) {
        return undefined;
      }
      throw error;
    }
  }

  private normalizeArgs(
    args: Parameters<typeof performance.measure>,
  ): Parameters<typeof performance.measure> {
    if (args.length < 2) {
      return args;
    }

    const candidate = args[1];
    if (typeof candidate !== "object" || candidate === null) {
      return args;
    }

    const { start, end, ...rest } = candidate as PerformanceMeasureOptions;
    if (typeof start === "number" && typeof end === "number" && end < start) {
      const normalizedOptions: PerformanceMeasureOptions = {
        ...rest,
        start,
        end: start,
      };
      return [args[0], normalizedOptions];
    }

    return args;
  }
}

export function PerformanceMeasureGuard() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return undefined;
    }

    const sanitizer = new PerformanceMeasureSanitizer();
    sanitizer.enable();
    return () => sanitizer.disable();
  }, []);

  return null;
}
