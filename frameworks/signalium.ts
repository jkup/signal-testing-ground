import { state, reactive, watcher } from "signalium";
import type {
  FrameworkImplementation,
  ReactiveSignal,
  ReactiveComputed,
} from "../src/types/framework.js";

// Wrapper to adapt signalium state to our generic interface
class SignaliumStateWrapper<T> implements ReactiveSignal<T> {
  constructor(private _state: any) {}

  get(): T {
    return this._state.get();
  }

  set(value: T): void {
    this._state.set(value);
  }

  peek(): T {
    // Signalium state objects have .get() method, use it for peek as well
    return this._state.get();
  }
}

class SignaliumReactiveWrapper<T> implements ReactiveComputed<T> {
  constructor(private _reactive: any) {}

  get(): T {
    return this._reactive();
  }

  peek(): T {
    // For reactive values, calling them directly should work for peek
    return this._reactive();
  }
}

export const signaliumFramework: FrameworkImplementation = {
  name: "Signalium",

  signal: <T>(value: T) => {
    const signaliumState = state(value);
    return new SignaliumStateWrapper<T>(signaliumState);
  },

  computed: <T>(fn: () => T) => {
    const signaliumReactive = reactive(fn);
    return new SignaliumReactiveWrapper<T>(signaliumReactive);
  },

  effect: (fn: () => void | (() => void)) => {
    // watcher creates an effect and returns its signal - we need to return a dispose function
    const watcherSignal = watcher(fn);
    // Return a dispose function - for now, return a no-op since we need to investigate the dispose pattern
    return () => {};
  },
};
