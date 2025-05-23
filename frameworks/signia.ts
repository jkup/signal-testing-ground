import { atom, computed, react } from "signia";
import type {
  FrameworkImplementation,
  ReactiveSignal,
  ReactiveComputed,
} from "../src/types/framework.js";

// Wrapper to adapt signia atom to our generic interface
class SigniaAtomWrapper<T> implements ReactiveSignal<T> {
  constructor(private _atom: any) {}

  get(): T {
    return this._atom.value;
  }

  set(value: T): void {
    this._atom.set(value);
  }

  peek(): T {
    // Signia atoms have a __unsafe__getWithoutCapture method for peeking
    return this._atom.__unsafe__getWithoutCapture?.() ?? this._atom.value;
  }
}

class SigniaComputedWrapper<T> implements ReactiveComputed<T> {
  constructor(private _computed: any) {}

  get(): T {
    return this._computed.value;
  }

  peek(): T {
    // For computed values, use __unsafe__getWithoutCapture if available
    return (
      this._computed.__unsafe__getWithoutCapture?.() ?? this._computed.value
    );
  }
}

export const signiaFramework: FrameworkImplementation = {
  name: "Signia",

  signal: <T>(value: T) => {
    const signiaAtom = atom(`signal-${Date.now()}`, value);
    return new SigniaAtomWrapper<T>(signiaAtom);
  },

  computed: <T>(fn: () => T) => {
    const signiaComputed = computed(`computed-${Date.now()}`, fn);
    return new SigniaComputedWrapper<T>(signiaComputed);
  },

  effect: (fn: () => void | (() => void)) => {
    // react returns a dispose function, which matches our interface perfectly
    const dispose = react(`effect-${Date.now()}`, fn);
    return dispose;
  },
};
