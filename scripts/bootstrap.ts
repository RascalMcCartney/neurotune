#!/usr/bin/env ts-node

import { fileURLToPath } from "url";
import * as path from "path";

// Recreate CommonJS globals
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { spawnSync } from "child_process";
import * as fs from "fs";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const VENV_DIR = path.join(PROJECT_ROOT, ".venv");
const REQUIREMENTS = path.join(PROJECT_ROOT, "src/requirements.txt");

function detectSystemPython(): string {
  const candidates = process.platform === "win32"
    ? ["python", "python3", "py"]
    : ["python3", "python"];

  for (const cmd of candidates) {
    const result = spawnSync(cmd, ["--version"], { encoding: "utf-8" });
    if (result.status === 0) {
      console.log(`✅ Found system Python: ${cmd} (${result.stdout || result.stderr})`);
      return cmd;
    }
  }
  throw new Error("❌ Python not found. Please install Python 3.x and ensure it is in PATH.");
}

function getVenvPython(): string {
  return process.platform === "win32"
    ? path.join(VENV_DIR, "Scripts", "python.exe")
    : path.join(VENV_DIR, "bin", "python");
}

function ensureVenv(): string {
  const venvPython = getVenvPython();
  if (!fs.existsSync(venvPython)) {
    console.log("📦 Creating virtual environment...");
    const systemPython = detectSystemPython();
    const result = spawnSync(systemPython, ["-m", "venv", VENV_DIR], { stdio: "inherit" });
    if (result.status !== 0) {
      throw new Error("❌ Failed to create virtual environment.");
    }
    console.log("✅ Virtual environment created.");
  } else {
    console.log("✅ Virtual environment already exists.");
  }
  return venvPython;
}

function installRequirements(pythonBin: string): void {
  if (!fs.existsSync(REQUIREMENTS)) {
    console.warn("⚠️ requirements.txt not found, skipping dependency installation.");
    return;
  }
  console.log("📦 Installing Python dependencies...");
  const result = spawnSync(pythonBin, ["-m", "pip", "install", "-r", REQUIREMENTS], {
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error("❌ Failed to install Python dependencies.");
  }
  console.log("✅ Python dependencies installed.");
}

(function main() {
  try {
    const venvPython = ensureVenv();
    installRequirements(venvPython);
    console.log("🎉 Bootstrap complete. You’re ready to run analyzeMix!");
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
})();
