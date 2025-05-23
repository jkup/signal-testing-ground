#!/usr/bin/env tsx

/**
 * Runner script that executes the user's signal code with each framework
 */

import { frameworks } from "../src/frameworks/index.js";
import { setFramework } from "../src/global.js";
import { runTests } from "../src/index.js";

interface TestResult {
  framework: string;
  success: boolean;
  duration: number;
  error?: Error;
  output?: string;
}

async function runTestWithFramework(framework: any): Promise<TestResult> {
  const startTime = Date.now();
  let output = "";
  let success = true;
  let error: Error | undefined;

  // Capture console output
  const originalLog = console.log;
  const originalError = console.error;
  const logs: string[] = [];

  console.log = (...args: any[]) => {
    const message = args
      .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
      .join(" ");
    logs.push(message);
    originalLog(...args);
  };

  console.error = (...args: any[]) => {
    const message = args
      .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
      .join(" ");
    logs.push(`ERROR: ${message}`);
    originalError(...args);
  };

  try {
    // Setup the framework
    if (framework.setup) {
      await framework.setup();
    }

    // Set the current framework
    setFramework(framework);

    // Run the user tests
    await runTests();
  } catch (err) {
    success = false;
    error = err instanceof Error ? err : new Error(String(err));
  } finally {
    // Cleanup
    if (framework.teardown) {
      try {
        await framework.teardown();
      } catch (teardownErr) {
        console.error(`Teardown error for ${framework.name}:`, teardownErr);
      }
    }

    // Restore console
    console.log = originalLog;
    console.error = originalError;
  }

  const duration = Date.now() - startTime;
  output = logs.join("\n");

  return {
    framework: framework.name,
    success,
    duration,
    error,
    output,
  };
}

async function main() {
  console.log(
    "🧪 Signal Testing Ground - Running tests with all frameworks...\n"
  );
  console.log(
    `Found ${frameworks.length} frameworks: ${frameworks
      .map((f) => f.name)
      .join(", ")}\n`
  );

  const results: TestResult[] = [];

  for (const framework of frameworks) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🔬 Testing with: ${framework.name}`);
    console.log(`${"=".repeat(60)}`);

    try {
      const result = await runTestWithFramework(framework);
      results.push(result);

      if (!result.success) {
        console.error(`\n❌ ${framework.name} failed:`, result.error?.message);
        if (result.error?.stack) {
          console.error(result.error.stack);
        }
      }
    } catch (err) {
      console.error(`\n💥 Fatal error testing ${framework.name}:`, err);
      results.push({
        framework: framework.name,
        success: false,
        duration: 0,
        error: err instanceof Error ? err : new Error(String(err)),
      });
    }
  }

  // Print summary
  console.log(`\n${"=".repeat(60)}`);
  console.log("📊 SUMMARY");
  console.log(`${"=".repeat(60)}`);

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`\n✅ Successful: ${successful.length}/${results.length}`);
  successful.forEach((result) => {
    console.log(`  - ${result.framework}: ${result.duration}ms`);
  });

  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}/${results.length}`);
    failed.forEach((result) => {
      console.log(
        `  - ${result.framework}: ${result.error?.message || "Unknown error"}`
      );
    });
  }

  console.log("\n🏁 All tests completed!");

  // Exit with error code if any tests failed
  if (failed.length > 0) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
