/**
 * Testing Ground for JavaScript Signals
 *
 * Write your signal code here using signal(), computed(), and effect()
 * This code will be run with each available framework automatically.
 */

import { signal, computed, effect, batch } from "./global.js";

export async function runTests() {
  console.log("🚀 Running signals test...");

  // Example 1: Basic counter
  console.log("\n📊 Basic Counter Example:");
  const counter = signal(0);
  const doubled = computed(() => counter.get() * 2);
  const isEven = computed(() => counter.get() % 2 === 0);

  let effectRuns = 0;
  const cleanup = effect(() => {
    effectRuns++;
    console.log(
      `  Counter: ${counter.get()}, Doubled: ${doubled.get()}, Even: ${isEven.get()}`
    );
  });

  counter.set(1);
  counter.set(2);
  counter.set(3);
  counter.set(4);

  console.log(`  Effect ran ${effectRuns} times`);
  cleanup();

  // Example 2: Diamond dependency problem
  console.log("\n💎 Diamond Dependency Example:");
  const source = signal(1);
  const left = computed(() => {
    console.log("  Computing left branch");
    return source.get() * 2;
  });
  const right = computed(() => {
    console.log("  Computing right branch");
    return source.get() + 1;
  });
  const result = computed(() => {
    console.log("  Computing result");
    return left.get() + right.get();
  });

  console.log(`  Initial result: ${result.get()}`);

  console.log("  Updating source to 2...");
  source.set(2);
  console.log(`  New result: ${result.get()}`);

  // Example 3: Conditional dependencies
  console.log("\n🔀 Conditional Dependencies Example:");
  const useX = signal(true);
  const x = signal(10);
  const y = signal(20);

  let conditionalComputeRuns = 0;
  const conditional = computed(() => {
    conditionalComputeRuns++;
    return useX.get() ? x.get() : y.get();
  });

  console.log(
    `  Initial: ${conditional.get()}, compute runs: ${conditionalComputeRuns}`
  );

  // This should NOT trigger a recompute since we're using x
  y.set(25);
  console.log(
    `  After y change: ${conditional.get()}, compute runs: ${conditionalComputeRuns}`
  );

  // This SHOULD trigger a recompute since we're using x
  x.set(15);
  console.log(
    `  After x change: ${conditional.get()}, compute runs: ${conditionalComputeRuns}`
  );

  // Switch to y, should recompute
  useX.set(false);
  console.log(
    `  After switching to y: ${conditional.get()}, compute runs: ${conditionalComputeRuns}`
  );

  // Now y changes should matter, x changes shouldn't
  y.set(30);
  console.log(
    `  After y change: ${conditional.get()}, compute runs: ${conditionalComputeRuns}`
  );
  x.set(100); // Should not recompute
  console.log(
    `  After x change: ${conditional.get()}, compute runs: ${conditionalComputeRuns}`
  );

  // Example 4: Batching (if supported)
  console.log("\n🔄 Batching Example:");
  const a = signal(1);
  const b = signal(2);
  const sum = computed(() => a.get() + b.get());

  let batchEffectRuns = 0;
  const batchCleanup = effect(() => {
    batchEffectRuns++;
    console.log(`  Sum: ${sum.get()}`);
  });

  console.log("  Individual updates:");
  a.set(5);
  b.set(10);
  console.log(`  Effect ran ${batchEffectRuns} times`);

  // Reset counter
  batchEffectRuns = 0;

  console.log("  Batched updates:");
  batch(() => {
    a.set(20);
    b.set(30);
  });
  console.log(
    `  Effect ran ${batchEffectRuns} times (should be 1 if batching works)`
  );

  batchCleanup();

  console.log("\n✅ Test completed!");
}
