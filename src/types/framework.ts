/**
 * Generic interface for reactive frameworks
 * Inspired by https://github.com/milomg/js-reactivity-benchmark
 */

// Base signal interface
export interface SignalLike<T> {
  get(): T;
  set(value: T): void;
  peek?(): T;
}

// Base computed interface
export interface ComputedLike<T> {
  get(): T;
  peek?(): T;
}

// Framework implementation interface
export interface FrameworkImplementation {
  name: string;
  signal: <T>(value: T) => SignalLike<T>;
  computed: <T>(fn: () => T) => ComputedLike<T>;
  effect: (fn: () => void | (() => void)) => () => void;
  batch?: (fn: () => void) => void;
  setup?: () => void | Promise<void>;
  teardown?: () => void | Promise<void>;
}
