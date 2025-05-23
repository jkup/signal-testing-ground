import { signal, computed, effect, batch } from "@preact/signals-core";
import type {
  FrameworkImplementation,
  ReactiveSignal,
  ReactiveComputed,
} from "../src/types/framework.js";

// Wrapper to adapt Preact's API to our generic interface
class PreactSignalWrapper<T> implements ReactiveSignal<T> {
  constructor(private _signal: ReturnType<typeof signal<T>>) {}

  get(): T {
    return this._signal.value;
  }

  set(value: T): void {
    this._signal.value = value;
  }

  peek(): T {
    return this._signal.peek();
  }
}

class PreactComputedWrapper<T> implements ReactiveComputed<T> {
  constructor(private _computed: ReturnType<typeof computed<T>>) {}

  get(): T {
    return this._computed.value;
  }

  peek(): T {
    return this._computed.peek();
  }
}

export const preactFramework: FrameworkImplementation = {
  name: "Preact Signals",

  signal: <T>(value: T) => {
    const preactSignal = signal(value);
    return new PreactSignalWrapper(preactSignal);
  },

  computed: <T>(fn: () => T) => {
    const preactComputed = computed(fn);
    return new PreactComputedWrapper(preactComputed);
  },

  effect: (fn: () => void | (() => void)) => {
    return effect(fn);
  },

  batch: (fn: () => void) => {
    batch(fn);
  },
};
