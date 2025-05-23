# Signal Testing Ground

A testing ground for JavaScript Signal libraries where you can write reactive code once and test it across multiple signal implementations.

## 🎯 Features

- **Framework Agnostic**: Write your signal code once using generic `signal()`, `computed()`, and `effect()` functions
- **Multiple Frameworks**: Automatically test your code with Preact Signals, Vue Reactivity, SolidJS, and more
- **Comparative Analysis**: See how different frameworks handle the same reactive patterns
- **Easy to Extend**: Add new signal libraries by implementing a simple adapter interface

## 🚀 Quick Start

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Write your signal code** in `src/index.ts`:

   ```typescript
   import { signal, computed, effect } from "./global.js";

   export async function runTests() {
     const count = signal(0);
     const doubled = computed(() => count.get() * 2);

     effect(() => {
       console.log(`Count: ${count.get()}, Doubled: ${doubled.get()}`);
     });

     count.set(1);
     count.set(2);
   }
   ```

3. **Run tests across all frameworks**:

   ```bash
   npm run run
   ```

4. **See the results** for each framework implementation!

## 📖 Usage

### Available APIs

- `signal<T>(value: T)`: Create a reactive signal
- `computed<T>(fn: () => T)`: Create a computed value
- `effect(fn: () => void | (() => void))`: Create a side effect
- `batch(fn: () => void)`: Batch multiple updates (if supported)

### Signal Interface

All signals implement a consistent interface:

```typescript
interface ReactiveSignal<T> {
  get(): T; // Get the current value
  set(value: T): void; // Set a new value
  peek?(): T; // Get value without tracking (if supported)
}

interface ReactiveComputed<T> {
  get(): T; // Get the computed value
  peek?(): T; // Get value without tracking (if supported)
}
```

## 🔧 Adding New Frameworks

To add a new signal library:

1. **Create an adapter** in `frameworks/your-framework.ts`:

```typescript
import type { FrameworkImplementation } from "../src/types/framework.js";

export const yourFramework: FrameworkImplementation = {
  name: "Your Framework",

  signal: <T>(value: T) => {
    // Wrap your framework's signal API
  },

  computed: <T>(fn: () => T) => {
    // Wrap your framework's computed API
  },

  effect: (fn: () => void | (() => void)) => {
    // Wrap your framework's effect API
  },

  batch: (fn: () => void) => {
    // Optional: wrap batching API
  },
};
```

2. **Register it** in `src/frameworks/index.ts`:

```typescript
import { yourFramework } from "../../frameworks/your-framework.js";

export const frameworks = [
  // ... existing frameworks
  yourFramework,
];
```

## 📦 Included Frameworks

- **Preact Signals** (`@preact/signals-core`) - Lightweight, fast signals with excellent standalone support
- **Vue Reactivity** (`@vue/reactivity`) - Vue 3's reactive system, works well standalone but doesn't support batching
- **SolidJS** (`solid-js`) - Fine-grained reactive framework (⚠️ **Note**: Effects and some reactive features may not work as expected outside of a SolidJS component context.)
- **Alien Signals** (`alien-signals`) - Ultra-lightweight push-pull based algorithm by StackBlitz
- **Signalium** (`signalium`) - Advanced object-oriented API with first-class async support
- **Signia** (`signia`) - Clock-based lazy reactivity system designed to scale, by tldraw
- **Angular Signals** (`@angular/core`) - Angular's official signals implementation
- **TC39 Signals** (`signal-polyfill`) - Official polyfill for the proposed JavaScript signals standard

## 📝 License

MIT
