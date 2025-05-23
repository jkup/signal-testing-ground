import * as monaco from "monaco-editor";
import { defaultExample } from "./examples";

// Configure Monaco Editor environment to handle worker requests
(self as any).MonacoEnvironment = {
  getWorker(_: string, label: string) {
    // For any worker requests, return a simple worker that does nothing
    // This prevents the worker loading errors while keeping the editor functional
    const workerBlob = new Blob(
      ['// Monaco Editor Worker\nself.addEventListener("message", () => {});'],
      {
        type: "application/javascript",
      }
    );
    return new Worker(URL.createObjectURL(workerBlob));
  },
};

// Import all framework implementations
import { preactFramework } from "./frameworks/preact";
import { vueFramework } from "./frameworks/vue";
import { solidFramework } from "./frameworks/solid";
import { alienSignalsFramework } from "./frameworks/alien-signals";
import { signaliumFramework } from "./frameworks/signalium";
import { signiaFramework } from "./frameworks/signia";
import { angularFramework } from "./frameworks/angular";
import { tc39SignalsFramework } from "./frameworks/tc39-signals";

import type { FrameworkImplementation } from "./types/framework";

interface TestResult {
  framework: string;
  success: boolean;
  duration: number;
  error?: Error;
  output: string;
}

class SignalsPlayground {
  private editor: monaco.editor.IStandaloneCodeEditor;
  private frameworks: FrameworkImplementation[] = [
    preactFramework,
    vueFramework,
    solidFramework,
    alienSignalsFramework,
    signaliumFramework,
    signiaFramework,
    angularFramework,
    tc39SignalsFramework,
  ];

  constructor() {
    this.initializeEditor();
    this.initializeFrameworkList();
    this.initializeEventListeners();
  }

  private initializeEditor() {
    // Configure Monaco Editor
    monaco.editor.defineTheme("signals-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A9955" },
        { token: "keyword", foreground: "569CD6" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
      ],
      colors: {
        "editor.background": "#1e1e2e",
        "editor.foreground": "#e2e8f0",
        "editorLineNumber.foreground": "#6b7280",
        "editor.selectionBackground": "#374151",
        "editor.lineHighlightBackground": "#374151",
      },
    });

    const editorContainer = document.getElementById("editorContainer")!;

    this.editor = monaco.editor.create(editorContainer, {
      value: defaultExample,
      language: "javascript",
      theme: "signals-theme",
      fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace",
      fontSize: 14,
      lineHeight: 1.5,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: "on",
      lineNumbers: "on",
      folding: true,
      bracketPairColorization: { enabled: true },
      links: false,
      hover: {
        enabled: false,
      },
      quickSuggestions: false,
      parameterHints: {
        enabled: false,
      },
      suggest: {
        showWords: false,
        showSnippets: false,
      },
    });

    // Note: Users can write JavaScript code with signal/computed/effect functions
    // Syntax highlighting will work without worker issues
  }

  private initializeFrameworkList() {
    const frameworkGrid = document.getElementById("frameworkGrid")!;

    this.frameworks.forEach((framework, index) => {
      const item = document.createElement("div");
      item.className = "framework-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "framework-" + index;
      checkbox.className = "framework-checkbox";
      checkbox.checked = true; // All frameworks selected by default

      const label = document.createElement("label");
      label.htmlFor = "framework-" + index;
      label.className = "framework-name";
      label.textContent = framework.name;

      item.appendChild(checkbox);
      item.appendChild(label);
      frameworkGrid.appendChild(item);

      // Make the entire item clickable
      item.addEventListener("click", (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
      });
    });
  }

  private initializeEventListeners() {
    const runButton = document.getElementById("runButton")!;
    runButton.addEventListener("click", () => this.runTests());

    // Keyboard shortcut: Ctrl/Cmd + Enter to run
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        this.runTests();
      }
    });
  }

  private getSelectedFrameworks(): FrameworkImplementation[] {
    const selected: FrameworkImplementation[] = [];

    this.frameworks.forEach((framework, index) => {
      const checkbox = document.getElementById(
        "framework-" + index
      ) as HTMLInputElement;
      if (checkbox.checked) {
        selected.push(framework);
      }
    });

    return selected;
  }

  private async runTests() {
    const selectedFrameworks = this.getSelectedFrameworks();

    if (selectedFrameworks.length === 0) {
      this.showError("Please select at least one framework to test.");
      return;
    }

    const code = this.editor.getValue();
    const runButton = document.getElementById(
      "runButton"
    )! as HTMLButtonElement;
    const resultsContainer = document.getElementById("resultsContainer")!;

    // Show loading state
    runButton.disabled = true;
    runButton.textContent = "Running...";

    const loadingHTML = `
      <div class="loading">
        <div class="spinner"></div>
        Running tests across ${selectedFrameworks.length} frameworks...
      </div>
    `;
    resultsContainer.innerHTML = loadingHTML;

    const results: TestResult[] = [];

    for (const framework of selectedFrameworks) {
      try {
        const result = await this.runTestWithFramework(framework, code);
        results.push(result);
      } catch (error) {
        results.push({
          framework: framework.name,
          success: false,
          duration: 0,
          error: error instanceof Error ? error : new Error(String(error)),
          output: "",
        });
      }
    }

    this.displayResults(results);

    // Reset button state
    runButton.disabled = false;
    runButton.textContent = "Run Tests";
  }

  private async runTestWithFramework(
    framework: FrameworkImplementation,
    code: string
  ): Promise<TestResult> {
    const startTime = performance.now();
    let output = "";
    let success = true;
    let error: Error | undefined;

    // Capture console output
    const logs: string[] = [];
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
    };

    const mockConsole = {
      log: (...args: any[]) => {
        const message = args
          .map((arg) =>
            typeof arg === "string" ? arg : JSON.stringify(arg, null, 2)
          )
          .join(" ");
        logs.push(message);
      },
      error: (...args: any[]) => {
        const message = args
          .map((arg) =>
            typeof arg === "string" ? arg : JSON.stringify(arg, null, 2)
          )
          .join(" ");
        logs.push("ERROR: " + message);
      },
      warn: (...args: any[]) => {
        const message = args
          .map((arg) =>
            typeof arg === "string" ? arg : JSON.stringify(arg, null, 2)
          )
          .join(" ");
        logs.push("WARN: " + message);
      },
    };

    try {
      // Setup framework
      if (framework.setup) {
        await framework.setup();
      }

      // Create signal functions using the current framework
      const signal = framework.signal;
      const computed = framework.computed;
      const effect = framework.effect;
      const batch = framework.batch || ((fn: () => void) => fn());

      // Replace console temporarily
      Object.assign(console, mockConsole);

      // Execute the user code in an isolated scope
      const wrappedCode = `
        (function() {
          ${code}
        })();
      `;

      // Use Function constructor to execute code with our signal implementations
      const testFunction = new Function(
        "signal",
        "computed",
        "effect",
        "batch",
        "console",
        wrappedCode
      );
      testFunction(signal, computed, effect, batch, console);
    } catch (err) {
      success = false;
      error = err instanceof Error ? err : new Error(String(err));
    } finally {
      // Restore console
      Object.assign(console, originalConsole);

      // Cleanup framework
      if (framework.teardown) {
        try {
          await framework.teardown();
        } catch (teardownErr) {
          console.warn(
            "Teardown error for " + framework.name + ":",
            teardownErr
          );
        }
      }
    }

    const duration = performance.now() - startTime;
    output = logs.join("\n");

    return {
      framework: framework.name,
      success,
      duration,
      error,
      output,
    };
  }

  private displayResults(results: TestResult[]) {
    const resultsContainer = document.getElementById("resultsContainer")!;

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; color: #94a3b8; padding: 2rem;">
          No results to display
        </div>
      `;
      return;
    }

    const successful = results.filter((r) => r.success);
    const avgTime = (
      results.reduce((sum, r) => sum + r.duration, 0) / results.length
    ).toFixed(1);

    let html = "";

    // Add summary
    html += `
      <div style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(30, 30, 46, 0.3); border-radius: 8px; border: 1px solid rgba(226, 232, 240, 0.1);">
        <div style="font-size: 0.875rem; color: #e2e8f0; margin-bottom: 0.25rem;">
          <strong>Summary:</strong> ${successful.length}/${results.length} frameworks passed
        </div>
        <div style="font-size: 0.75rem; color: #94a3b8;">
          Average execution time: ${avgTime}ms
        </div>
      </div>
    `;

    // Add individual results
    results.forEach((result) => {
      const statusClass = result.success ? "success" : "error";
      const statusIcon = result.success ? "✅" : "❌";

      html += `
        <div class="result-item ${statusClass}">
          <div class="result-header">
            <span class="result-framework">${statusIcon} ${
        result.framework
      }</span>
            <span class="result-timing">${result.duration.toFixed(1)}ms</span>
          </div>
          <div class="result-output ${result.success ? "" : "result-error"}">
${result.success ? result.output : result.error?.message || "Unknown error"}
          </div>
        </div>
      `;
    });

    resultsContainer.innerHTML = html;
  }

  private showError(message: string) {
    const resultsContainer = document.getElementById("resultsContainer")!;
    resultsContainer.innerHTML = `
      <div class="result-item error">
        <div class="result-output result-error">
          ${message}
        </div>
      </div>
    `;
  }
}

// Initialize the playground when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SignalsPlayground();
});
