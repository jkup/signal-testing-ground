import {
  createSignal,
  createMemo,
  createEffect,
  batch,
  createRoot,
} from "solid-js";
import type {
  FrameworkImplementation,
  ReactiveSignal,
  ReactiveComputed,
} from "../src/types/framework.js";

// Wrapper to adapt Solid's API to our generic interface
class SolidSignalWrapper<T> implements ReactiveSignal<T> {
  constructor(private _getter: () => T, private _setter: (value: T) => void) {}

  get(): T {
    return this._getter();
  }

  set(value: T): void {
    this._setter(value);
  }

  peek(): T {
    // Solid doesn't have a built-in peek, but we can call the getter
    return this._getter();
  }
}

class SolidComputedWrapper<T> implements ReactiveComputed<T> {
  constructor(private _memo: () => T) {}

  get(): T {
    return this._memo();
  }

  peek(): T {
    return this._memo();
  }
}

let rootDispose: (() => void) | null = null;
let isInRoot = false;

// Helper to ensure we're in a root context
function ensureRoot<T>(fn: () => T): T {
  if (isInRoot) {
    return fn();
  }

  let result: T;
  createRoot(() => {
    isInRoot = true;
    try {
      result = fn();
    } finally {
      isInRoot = false;
    }
  });
  return result!;
}

export const solidFramework: FrameworkImplementation = {
  name: "SolidJS",

  setup: () => {
    // Create a shared root context for all SolidJS operations
    rootDispose = createRoot((dispose) => {
      isInRoot = true;
      return () => {
        isInRoot = false;
        dispose();
      };
    });
  },

  teardown: () => {
    if (rootDispose) {
      rootDispose();
      rootDispose = null;
    }
    isInRoot = false;
  },

  signal: <T>(value: T) => {
    return ensureRoot(() => {
      const [getter, setter] = createSignal(value);
      return new SolidSignalWrapper(
        getter as () => T,
        setter as (value: T) => void
      );
    });
  },

  computed: <T>(fn: () => T) => {
    return ensureRoot(() => {
      const memo = createMemo(fn);
      return new SolidComputedWrapper(memo as () => T);
    });
  },

  effect: (fn: () => void | (() => void)) => {
    let dispose: (() => void) | undefined;

    ensureRoot(() => {
      createEffect(() => {
        const result = fn();
        if (typeof result === "function") {
          dispose = result;
        }
      });
    });

    return () => {
      if (dispose) {
        dispose();
      }
    };
  },

  batch: (fn: () => void) => {
    batch(fn);
  },
};
