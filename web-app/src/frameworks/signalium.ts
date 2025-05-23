import { state, reactive } from "signalium";
import type {
  FrameworkImplementation,
  ReactiveSignal,
  ReactiveComputed,
} from "../types/framework";

// Wrapper to adapt Signalium state to our generic interface
class SignaliumStateWrapper<T> implements ReactiveSignal<T> {
  constructor(private _state: any) {}

  get(): T {
    return this._state.get();
  }

  set(value: T): void {
    this._state.set(value);
  }
}

// Computed wrapper using Signalium's reactive
class SignaliumComputedWrapper<T> implements ReactiveComputed<T> {
  private _reactive: any;

  constructor(fn: () => T) {
    this._reactive = reactive(fn);
  }

  get(): T {
    return this._reactive();
  }
}

export const signaliumFramework: FrameworkImplementation = {
  name: "Signalium",

  signal: <T>(value: T) => {
    const signaliumState = state(value);
    return new SignaliumStateWrapper(signaliumState);
  },

  computed: <T>(fn: () => T) => {
    return new SignaliumComputedWrapper(fn);
  },

  effect: (fn: () => void | (() => void)) => {
    // Signalium's effect system is complex, keeping as no-op for now
    return () => {};
  },

  batch: (fn: () => void) => {
    // Signalium doesn't have batching, so just run directly
    fn();
  },
};
