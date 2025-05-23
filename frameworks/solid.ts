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

export const solidFramework: FrameworkImplementation = {
  name: "SolidJS",

  setup: () => {
    // Create a root context for SolidJS to work properly
    rootDispose = createRoot(() => {
      return () => {}; // Return a cleanup function
    });
  },

  teardown: () => {
    if (rootDispose) {
      rootDispose();
      rootDispose = null;
    }
  },

  signal: <T>(value: T) => {
    let getter: () => T;
    let setter: (value: T) => void;

    createRoot(() => {
      const [g, s] = createSignal(value);
      getter = g as () => T;
      setter = s as (value: T) => void;
    });

    return new SolidSignalWrapper(getter!, setter!);
  },

  computed: <T>(fn: () => T) => {
    let memo: () => T;

    createRoot(() => {
      memo = createMemo(fn) as () => T;
    });

    return new SolidComputedWrapper(memo!);
  },

  effect: (fn: () => void | (() => void)) => {
    let dispose: (() => void) | undefined;

    createRoot(() => {
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
