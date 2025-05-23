import { Signal } from "signal-polyfill";
import type {
  FrameworkImplementation,
  ReactiveSignal,
  ReactiveComputed,
} from "../src/types/framework.js";

// Simple effect implementation based on TC39 polyfill documentation
let needsEnqueue = true;
const watcher = new Signal.subtle.Watcher(() => {
  if (needsEnqueue) {
    needsEnqueue = false;
    queueMicrotask(processPending);
  }
});

function processPending() {
  needsEnqueue = true;
  for (const s of watcher.getPending()) {
    s.get();
  }
  watcher.watch();
}

function createEffect(callback: () => void | (() => void)) {
  let cleanup: (() => void) | undefined;

  const computed = new Signal.Computed(() => {
    if (typeof cleanup === "function") {
      cleanup();
    }
    cleanup = callback() as (() => void) | undefined;
  });

  watcher.watch(computed);
  computed.get();

  return () => {
    watcher.unwatch(computed);
    if (typeof cleanup === "function") {
      cleanup();
    }
    cleanup = undefined;
  };
}

// Wrapper to adapt TC39 Signal.State to our generic interface
class TC39SignalWrapper<T> implements ReactiveSignal<T> {
  constructor(private _state: InstanceType<typeof Signal.State<T>>) {}

  get(): T {
    return this._state.get();
  }

  set(value: T): void {
    this._state.set(value);
  }

  peek(): T {
    // Use Signal.subtle.untrack for true non-tracking peek
    return Signal.subtle.untrack(() => this._state.get());
  }
}

class TC39ComputedWrapper<T> implements ReactiveComputed<T> {
  constructor(private _computed: InstanceType<typeof Signal.Computed<T>>) {}

  get(): T {
    return this._computed.get();
  }

  peek(): T {
    // Use Signal.subtle.untrack for true non-tracking peek
    return Signal.subtle.untrack(() => this._computed.get());
  }
}

export const tc39SignalsFramework: FrameworkImplementation = {
  name: "TC39 Signals",

  signal: <T>(value: T) => {
    const tc39Signal = new Signal.State(value);
    return new TC39SignalWrapper<T>(tc39Signal);
  },

  computed: <T>(fn: () => T) => {
    const tc39Computed = new Signal.Computed(fn);
    return new TC39ComputedWrapper<T>(tc39Computed);
  },

  effect: createEffect,
};
