/**
 * Testing Ground for JavaScript Signals
 *
 * Write your signal code here using signal(), computed(), and effect()
 * This code will be run with each available framework automatically.
 */

import { signal, computed, effect, batch } from "./global.js";

export async function runTests() {
  console.log("🚀 Running signals test...");
  let times = 0;

  const src = signal(0);
  const c1 = computed(() => {
    times++;
    return src.get();
  });
  c1.get();
  console.log(`times is ${times}`);
  src.set(1);
  src.set(0);
  c1.get();
  console.log(`times is now ${times}`);

  console.log("\n✅ Test completed!");
}
