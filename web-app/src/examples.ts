export const examples = {
  "Getting Started": `/**
 * 🚀 Welcome to the Signals Testing Playground!
 * 
 * You have access to these reactive primitives:
 * • signal(value) - Create reactive state
 * • computed(() => {}) - Derived state that updates automatically  
 * • effect(() => {}) - Side effects that run when dependencies change
 * • batch(() => {}) - Group multiple updates together
 * 
 * Try editing this code and click "Run Tests" to see how different 
 * signal frameworks handle the same reactive logic!
 */

// Create a reactive signal with an initial value
const count = signal(0);

// Computed values automatically update when their dependencies change
const doubled = computed(() => {
  console.log('Computing doubled value...');
  return count.get() * 2;
});

const message = computed(() => {
  const current = count.get();
  return current === 0 ? 'Click to start!' : \`Count is \${current}\`;
});

// Effects run automatically when their dependencies change
effect(() => {
  const current = count.get();
  const doubledValue = doubled.get();
  const msg = message.get();
  
  console.log(\`📊 \${msg} (doubled: \${doubledValue})\`);
});

console.log('=== Initial state ===');

console.log('\\n=== Updating count ===');
count.set(1);
count.set(2);
count.set(3);

console.log('\\n=== Batch updates (should only log once) ===');
batch(() => {
  count.set(10);
  console.log('Changed to 10 inside batch');
});

console.log('\\n✨ Try editing this code to experiment with signals!');`,

  "Todo App": `// Interactive Todo App demonstrating all signal features
let nextId = 1;

// State: List of todos and filter
const todos = signal([
  { id: nextId++, text: 'Learn signals', done: false },
  { id: nextId++, text: 'Build awesome apps', done: false }
]);
const filter = signal('all'); // 'all', 'active', 'completed'

// Computed: Filtered todos based on current filter
const filteredTodos = computed(() => {
  const allTodos = todos.get();
  const currentFilter = filter.get();
  
  switch (currentFilter) {
    case 'active': return allTodos.filter(t => !t.done);
    case 'completed': return allTodos.filter(t => t.done);
    default: return allTodos;
  }
});

// Computed: Statistics
const stats = computed(() => {
  const allTodos = todos.get();
  const total = allTodos.length;
  const completed = allTodos.filter(t => t.done).length;
  const active = total - completed;
  
  return { total, completed, active };
});

// Effect: Log changes
effect(() => {
  const filtered = filteredTodos.get();
  const currentStats = stats.get();
  console.log(\`Showing \${filtered.length} todos (\${filter.get()} filter)\`);
  console.log(\`Stats: \${currentStats.active} active, \${currentStats.completed} completed\`);
});

// Add a new todo
function addTodo(text) {
  const current = todos.get();
  todos.set([...current, { id: nextId++, text, done: false }]);
}

// Toggle todo completion
function toggleTodo(id) {
  const current = todos.get();
  todos.set(
    current.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    )
  );
}

// Test the app
console.log('=== Initial State ===');

batch(() => {
  addTodo('Test batching');
  addTodo('Another task');
  console.log('Added 2 todos in batch');
});

console.log('\\n=== Toggle some todos ===');
toggleTodo(1);
toggleTodo(3);

console.log('\\n=== Change filter ===');
filter.set('completed');
filter.set('active');
filter.set('all');`,

  "Counter with History": `// Counter with undo/redo using signals
const count = signal(0);
const history = signal([0]);
const historyIndex = signal(0);

// Computed: Can undo/redo
const canUndo = computed(() => historyIndex.get() > 0);
const canRedo = computed(() => historyIndex.get() < history.get().length - 1);

// Computed: Current value from history
const currentValue = computed(() => {
  const hist = history.get();
  const index = historyIndex.get();
  return hist[index];
});

// Effect: Sync count with history
effect(() => {
  count.set(currentValue.get());
});

// Effect: Log state changes
effect(() => {
  const value = currentValue.get();
  const undo = canUndo.get();
  const redo = canRedo.get();
  console.log(\`Count: \${value} (undo: \${undo}, redo: \${redo})\`);
});

function increment() {
  const newValue = count.get() + 1;
  addToHistory(newValue);
}

function decrement() {
  const newValue = count.get() - 1;
  addToHistory(newValue);
}

function addToHistory(value) {
  const hist = history.get();
  const index = historyIndex.get();
  
  // Remove future history if we're not at the end
  const newHistory = hist.slice(0, index + 1);
  newHistory.push(value);
  
  batch(() => {
    history.set(newHistory);
    historyIndex.set(newHistory.length - 1);
  });
}

function undo() {
  if (canUndo.get()) {
    historyIndex.set(historyIndex.get() - 1);
  }
}

function redo() {
  if (canRedo.get()) {
    historyIndex.set(historyIndex.get() + 1);
  }
}

console.log('=== Initial state ===');

console.log('\\n=== Increment twice ===');
increment();
increment();

console.log('\\n=== Undo once ===');
undo();

console.log('\\n=== Decrement ===');
decrement();

console.log('\\n=== Redo ===');
redo();`,

  "Reactive Data Pipeline": `// Reactive data transformation pipeline
const input = signal('hello world');

// Stage 1: Transform text
const normalized = computed(() => {
  const text = input.get();
  return text.toLowerCase().trim();
});

// Stage 2: Split into words
const words = computed(() => {
  const text = normalized.get();
  return text.split(/\\s+/).filter(w => w.length > 0);
});

// Stage 3: Statistics
const wordStats = computed(() => {
  const wordList = words.get();
  const counts = {};
  
  wordList.forEach(word => {
    counts[word] = (counts[word] || 0) + 1;
  });
  
  return {
    total: wordList.length,
    unique: Object.keys(counts).length,
    counts,
    longest: wordList.reduce((a, b) => a.length > b.length ? a : b, '')
  };
});

// Stage 4: Report
const report = computed(() => {
  const stats = wordStats.get();
  return \`Words: \${stats.total}, Unique: \${stats.unique}, Longest: "\${stats.longest}"\`;
});

// Effect: Log pipeline results
effect(() => {
  const originalInput = input.get();
  const processedWords = words.get();
  const summary = report.get();
  
  console.log(\`Input: "\${originalInput}"\`);
  console.log(\`Words: [\${processedWords.join(', ')}]\`);
  console.log(\`Summary: \${summary}\`);
  console.log('---');
});

console.log('=== Initial processing ===');

console.log('\\n=== Change input ===');
input.set('  The Quick BROWN fox jumps over the lazy DOG  ');

console.log('\\n=== Another change ===');
input.set('React Vue Angular Svelte SolidJS signals signals everywhere!');

console.log('\\n=== Batch multiple changes ===');
batch(() => {
  input.set('Testing batch');
  console.log('Changed input in batch - effects should run once');
});`,

  "Performance Test": `// Performance comparison test
console.log('🚀 Performance Test - Deep Reactivity Chain');

// Create a chain of 100 computed values
const source = signal(1);
let current = source;

console.log('Creating chain of 100 computed values...');
for (let i = 0; i < 100; i++) {
  const prev = current;
  current = computed(() => prev.get() + 1);
}

const final = current;

// Add some effects
effect(() => {
  const value = final.get();
  if (value <= 105) {
    console.log(\`Final value: \${value}\`);
  }
});

let updateCount = 0;
effect(() => {
  final.get(); // Subscribe to final value
  updateCount++;
  if (updateCount <= 5) {
    console.log(\`Update #\${updateCount}\`);
  }
});

console.log('\\n=== Testing updates ===');

// Test performance with multiple updates
for (let i = 2; i <= 5; i++) {
  source.set(i);
}

console.log(\`\\nCompleted \${updateCount} reactive updates through 100-level deep chain\`);`,

  "Build Your Own": `/**
 * 🎨 Build Your Own Signal Example!
 * 
 * Available APIs:
 * • signal(initialValue) - Creates reactive state
 * • computed(() => expression) - Derived state  
 * • effect(() => { sideEffects }) - Runs when dependencies change
 * • batch(() => { updates }) - Groups multiple updates
 * 
 * Ideas to try:
 * • Shopping cart with items and total
 * • Form validation with multiple fields
 * • Real-time clock or timer
 * • Data fetching simulation
 * • Game state management
 * 
 * This code runs in 7 different signal frameworks simultaneously!
 */

// Your code here! Start with something simple:

const name = signal('World');
const greeting = computed(() => \`Hello, \${name.get()}!\`);

effect(() => {
  console.log(greeting.get());
});

// Try changing the name:
name.set('Signals');
name.set('Reactive Programming');

// Or build something more complex...
console.log('\\n✨ Edit this code to build your own reactive example!');`,
};

export const defaultExample = examples["Getting Started"];
