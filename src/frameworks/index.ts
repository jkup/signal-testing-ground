import type { FrameworkImplementation } from "../types/framework.js";
import { preactFramework } from "../../frameworks/preact.js";
import { vueFramework } from "../../frameworks/vue.js";
import { solidFramework } from "../../frameworks/solid.js";
import { alienSignalsFramework } from "../../frameworks/alien-signals.js";
import { signaliumFramework } from "../../frameworks/signalium.js";
import { signiaFramework } from "../../frameworks/signia.js";
import { angularFramework } from "../../frameworks/angular.js";
import { tc39SignalsFramework } from "../../frameworks/tc39-signals.js";

// Registry of all available frameworks
export const frameworks: FrameworkImplementation[] = [
  preactFramework,
  vueFramework,
  solidFramework,
  alienSignalsFramework,
  signaliumFramework,
  signiaFramework,
  angularFramework,
  tc39SignalsFramework,
];

// Helper to get a framework by name
export function getFramework(
  name: string
): FrameworkImplementation | undefined {
  return frameworks.find((fw) => fw.name.toLowerCase() === name.toLowerCase());
}

// Helper to get all framework names
export function getFrameworkNames(): string[] {
  return frameworks.map((fw) => fw.name);
}
