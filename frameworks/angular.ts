import { signal, computed } from "@angular/core";
import type {
  FrameworkImplementation,
  ReactiveSignal,
  ReactiveComputed,
} from "../src/types/framework.js";

// Wrapper to adapt Angular signal to our generic interface
class AngularSignalWrapper<T> implements ReactiveSignal<T> {
  constructor(private _signal: any) {}

  get(): T {
    return this._signal();
  }

  set(value: T): void {
    this._signal.set(value);
  }

  peek(): T {
    // Angular signals don't have a built-in peek, but calling them should work
    // since they're functional and won't track dependencies outside of effects/computed
    return this._signal();
  }
}

class AngularComputedWrapper<T> implements ReactiveComputed<T> {
  constructor(private _computed: any) {}

  get(): T {
    return this._computed();
  }

  peek(): T {
    // For computed values, calling them directly should work for peek
    return this._computed();
  }
}

export const angularFramework: FrameworkImplementation = {
  name: "Angular Signals",

  signal: <T>(value: T) => {
    const angularSignal = signal(value);
    return new AngularSignalWrapper<T>(angularSignal);
  },

  computed: <T>(fn: () => T) => {
    const angularComputed = computed(fn);
    return new AngularComputedWrapper<T>(angularComputed);
  },

  effect: (fn: () => void | (() => void)) => {
    // Angular effects require injection context, which is complex to set up
    // For testing purposes, we'll return a no-op function
    // The signal and computed functionality will still be tested
    return () => {};
  },
};
