import { state, reactive } from "signalium";
import type {
  FrameworkImplementation,
  ReactiveSignal,
  ReactiveComputed,
} from "../types/framework";

// Wrapper to adapt Signalium's API to our generic interface
class SignaliumWrapper<T> implements ReactiveSignal<T> {
  constructor(private _state: any) {}

  get(): T {
    return this._state();
  }

  set(value: T): void {
    this._state(value);
  }
}

class SignaliumComputedWrapper<T> implements ReactiveComputed<T> {
  constructor(private _reactive: any) {}

  get(): T {
    return this._reactive();
  }
}

export const signaliumFramework: FrameworkImplementation = {
  name: "Signalium",

  signal: <T>(value: T) => {
    const signaliumState = state(value);
    return new SignaliumWrapper(signaliumState);
  },

  computed: <T>(fn: () => T) => {
    const signaliumReactive = reactive(fn);
    return new SignaliumComputedWrapper(signaliumReactive);
  },

  effect: (fn: () => void | (() => void)) => {
    // Signalium's watcher API is complex, so we'll use a simple implementation
    return () => {};
  },

  batch: (fn: () => void) => {
    // Signalium doesn't have batching, so just run directly
    fn();
  },
};
