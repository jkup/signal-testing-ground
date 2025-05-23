import { signal, computed, effect } from "alien-signals";
import type {
  FrameworkImplementation,
  ReactiveSignal,
  ReactiveComputed,
} from "../src/types/framework.js";

// Wrapper to adapt alien-signals API to our generic interface
class AlienSignalWrapper<T> implements ReactiveSignal<T> {
  constructor(private _signal: ReturnType<typeof signal<T>>) {}

  get(): T {
    return this._signal();
  }

  set(value: T): void {
    this._signal(value);
  }

  peek(): T {
    // alien-signals doesn't have a built-in peek, but since it's a function-based API,
    // we can just call it directly as it won't track dependencies outside of effects/computed
    return this._signal();
  }
}

class AlienComputedWrapper<T> implements ReactiveComputed<T> {
  constructor(private _computed: ReturnType<typeof computed<T>>) {}

  get(): T {
    return this._computed();
  }

  peek(): T {
    // For computed values, calling them directly should be fine for peek
    return this._computed();
  }
}

export const alienSignalsFramework: FrameworkImplementation = {
  name: "Alien Signals",

  signal: <T>(value: T) => {
    const alienSignal = signal(value);
    return new AlienSignalWrapper(alienSignal);
  },

  computed: <T>(fn: () => T) => {
    const alienComputed = computed(fn);
    return new AlienComputedWrapper(alienComputed);
  },

  effect: (fn: () => void | (() => void)) => {
    const dispose = effect(fn);
    return dispose;
  },
};
