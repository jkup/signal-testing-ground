import { signal, computed } from "@angular/core";
import type {
  FrameworkImplementation,
  ReactiveSignal,
  ReactiveComputed,
} from "../types/framework";

// Wrapper to adapt Angular signal to our generic interface
class AngularSignalWrapper<T> implements ReactiveSignal<T> {
  constructor(private _signal: any) {}

  get(): T {
    return this._signal();
  }

  set(value: T): void {
    this._signal.set(value);
  }
}

class AngularComputedWrapper<T> implements ReactiveComputed<T> {
  constructor(private _computed: any) {}

  get(): T {
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

  batch: (fn: () => void) => {
    // Angular doesn't have batching, so just run directly
    fn();
  },
};
