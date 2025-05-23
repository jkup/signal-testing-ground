import type {
  ReactiveFramework,
  ReactiveSignal,
  ReactiveComputed,
} from "./types/framework.js";

let currentFramework: ReactiveFramework | null = null;

/**
 * Set the current framework to use for signal operations
 */
export function setFramework(framework: ReactiveFramework): void {
  currentFramework = framework;
}

/**
 * Get the current framework
 */
export function getCurrentFramework(): ReactiveFramework | null {
  return currentFramework;
}

/**
 * Create a reactive signal
 */
export function signal<T>(value: T): ReactiveSignal<T> {
  if (!currentFramework) {
    throw new Error("No framework set. Call setFramework() first.");
  }
  return currentFramework.signal(value);
}

/**
 * Create a computed value
 */
export function computed<T>(fn: () => T): ReactiveComputed<T> {
  if (!currentFramework) {
    throw new Error("No framework set. Call setFramework() first.");
  }
  return currentFramework.computed(fn);
}

/**
 * Create an effect
 */
export function effect(fn: () => void | (() => void)): () => void {
  if (!currentFramework) {
    throw new Error("No framework set. Call setFramework() first.");
  }
  return currentFramework.effect(fn);
}

/**
 * Batch multiple updates (if supported by the framework)
 */
export function batch(fn: () => void): void {
  if (!currentFramework) {
    throw new Error("No framework set. Call setFramework() first.");
  }
  if (currentFramework.batch) {
    currentFramework.batch(fn);
  } else {
    fn();
  }
}
