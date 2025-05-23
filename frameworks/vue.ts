import { ref, computed, effect, stop } from "@vue/reactivity";
import type {
  FrameworkImplementation,
  ReactiveSignal,
  ReactiveComputed,
} from "../src/types/framework.js";

// Wrapper to adapt Vue's API to our generic interface
class VueSignalWrapper<T> implements ReactiveSignal<T> {
  constructor(private _ref: ReturnType<typeof ref<T>>) {}

  get(): T {
    return this._ref.value;
  }

  set(value: T): void {
    this._ref.value = value;
  }

  peek(): T {
    // Vue doesn't have a built-in peek, but we can access value directly
    return this._ref.value;
  }
}

class VueComputedWrapper<T> implements ReactiveComputed<T> {
  constructor(private _computed: ReturnType<typeof computed<T>>) {}

  get(): T {
    return this._computed.value;
  }

  peek(): T {
    return this._computed.value;
  }
}

export const vueFramework: FrameworkImplementation = {
  name: "Vue Reactivity",

  signal: <T>(value: T) => {
    const vueRef = ref(value);
    return new VueSignalWrapper(vueRef);
  },

  computed: <T>(fn: () => T) => {
    const vueComputed = computed(fn);
    return new VueComputedWrapper(vueComputed);
  },

  effect: (fn: () => void | (() => void)) => {
    const reactiveEffect = effect(fn);
    return () => stop(reactiveEffect);
  },
};
