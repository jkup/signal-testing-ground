/**
 * Generic interface for reactive frameworks
 * Inspired by https://github.com/milomg/js-reactivity-benchmark
 */

export interface ReactiveFramework {
  name: string;
  signal: <T>(value: T) => ReactiveSignal<T>;
  computed: <T>(fn: () => T) => ReactiveComputed<T>;
  effect: (fn: () => void | (() => void)) => () => void;
  batch?: (fn: () => void) => void;
}

export interface ReactiveSignal<T> {
  get(): T;
  set(value: T): void;
  peek?(): T; // Optional: get value without tracking
}

export interface ReactiveComputed<T> {
  get(): T;
  peek?(): T; // Optional: get value without tracking
}

export interface ReactiveEffect {
  dispose(): void;
}

// Utility type for framework implementations
export type FrameworkImplementation = {
  name: string;
  setup?: () => void | Promise<void>;
  teardown?: () => void | Promise<void>;
} & ReactiveFramework;
