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

### Writing Signal Code

Your code in `src/index.ts` should export a `runTests()` function that uses the generic signal APIs:

```typescript
import { signal, computed, effect, batch } from "./global.js";

export async function runTests() {
  // Create reactive signals
  const count = signal(0);
  const name = signal("World");

  // Create computed values
  const doubled = computed(() => count.get() * 2);
  const greeting = computed(() => `Hello, ${name.get()}!`);

  // Create effects
  const cleanup = effect(() => {
    console.log(`${greeting.get()} Count is ${doubled.get()}`);
  });

  // Update signals
  count.set(5);
  name.set("Signals");

  // Batch updates (if supported)
  batch(() => {
    count.set(10);
    name.set("Reactive World");
  });

  // Cleanup
  cleanup();
}
```

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

## 🧪 Testing Patterns

The testing ground includes examples of common reactive patterns:

### Basic Reactivity

```typescript
const count = signal(0);
const doubled = computed(() => count.get() * 2);
```

### Diamond Dependencies

```typescript
const source = signal(1);
const left = computed(() => source.get() * 2);
const right = computed(() => source.get() + 1);
const result = computed(() => left.get() + right.get());
```

### Conditional Dependencies

```typescript
const useX = signal(true);
const x = signal(10);
const y = signal(20);
const conditional = computed(() => (useX.get() ? x.get() : y.get()));
```

### Effects and Cleanup

```typescript
const count = signal(0);
const cleanup = effect(() => {
  console.log(`Count: ${count.get()}`);
  return () => console.log("Effect cleaned up");
});
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
- **SolidJS** (`solid-js`) - Fine-grained reactive framework (⚠️ **Note**: SolidJS is designed for component-based usage and has limitations when used standalone. Effects and some reactive features may not work as expected outside of a SolidJS component context.)

## 🏗️ Project Structure

```
signal-testing-ground/
├── src/
│   ├── index.ts              # Your signal code goes here
│   ├── global.ts             # Generic signal APIs
│   ├── types/framework.ts    # Framework interface types
│   └── frameworks/index.ts   # Framework registry
├── frameworks/
│   ├── preact.ts            # Preact Signals adapter
│   ├── vue.ts               # Vue Reactivity adapter
│   └── solid.ts             # SolidJS adapter
├── scripts/
│   └── run-all.ts           # Test runner script
└── package.json
```

## 🤝 Contributing

Feel free to:

- Add new signal frameworks
- Improve existing adapters
- Add more testing patterns
- Report issues with framework compatibility

## 📝 License

MIT

## 🙏 Inspiration

This project is inspired by the excellent work on:

- [js-reactivity-benchmark](https://github.com/milomg/js-reactivity-benchmark) by @milomg
- The [TC39 Signals Proposal](https://github.com/proposal-signals/signal-polyfill)
- Various signal implementations in the JavaScript ecosystem
