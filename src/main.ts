import * as monaco from "monaco-editor";

interface TestResult {
  framework: string;
  success: boolean;
  duration: number;
  error?: Error;
  output: string;
}

const defaultCode = `// Simple signal test
console.log('Hello from signals playground!');

// Test basic functionality
const count = signal(0);
const doubled = computed(() => count.get() * 2);

effect(() => {
  console.log('Count:', count.get(), 'Doubled:', doubled.get());
});

count.set(1);
count.set(2);`;

class SignalsPlayground {
  private editor: monaco.editor.IStandaloneCodeEditor;

  constructor() {
    this.initializeEditor();
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
      value: defaultCode,
      language: "typescript",
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
    });

    // Add TypeScript definitions for signal functions
    const signalDefs = `
      declare function signal<T>(value: T): {
        get(): T;
        set(value: T): void;
        peek?(): T;
      };
      
      declare function computed<T>(fn: () => T): {
        get(): T;
        peek?(): T;
      };
      
      declare function effect(fn: () => void | (() => void)): () => void;
      
      declare function batch(fn: () => void): void;
    `;
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      signalDefs,
      "ts:signals.d.ts"
    );
  }

  private initializeEventListeners() {
    const runButton = document.getElementById("runButton")!;
    runButton.addEventListener("click", () => this.showTestMessage());

    // Keyboard shortcut: Ctrl/Cmd + Enter to run
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        this.showTestMessage();
      }
    });
  }

  private showTestMessage() {
    const resultsContainer = document.getElementById("resultsContainer")!;
    const code = this.editor.getValue();

    resultsContainer.innerHTML = `
      <div class="result-item success">
        <div class="result-header">
          <span class="result-framework">✅ Monaco Editor Test</span>
          <span class="result-timing">0.0ms</span>
        </div>
        <div class="result-output">
Monaco editor is working!
Code length: ${code.length} characters

To complete the setup, we need to:
1. Import framework implementations
2. Add proper signal/computed/effect functions
3. Wire up the testing system

For now, you can edit code in the Monaco editor and it will persist.
        </div>
      </div>
    `;
  }
}

// Initialize the playground when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SignalsPlayground();
});
