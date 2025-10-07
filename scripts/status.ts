#!/usr/bin/env ts-node

// At the top of your script
import { fileURLToPath } from "url";
import * as path from "path";

// Recreate CommonJS globals
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { spawnSync } from "child_process";
import * as fs from "fs";
import * as crypto from "crypto";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const VENV_DIR = path.join(PROJECT_ROOT, ".venv");
const REQUIREMENTS = path.join(PROJECT_ROOT, "src/requirements.txt");
const CACHE_FILE = path.join(PROJECT_ROOT, ".requirements.hash");

function getVenvPython(): string {
  return process.platform === "win32"
    ? path.join(VENV_DIR, "Scripts", "python.exe")
    : path.join(VENV_DIR, "bin", "python");
}

function hashRequirements(): string {
  if (!fs.existsSync(REQUIREMENTS)) return "";
  const content = fs.readFileSync(REQUIREMENTS, "utf-8");
  return crypto.createHash("sha256").update(content).digest("hex");
}

(function main() {
  console.log("🔍 Environment Status Check\n");

  const venvPython = getVenvPython();

  if (fs.existsSync(venvPython)) {
    console.log(`✅ Virtual environment found at: ${venvPython}`);

    const version = spawnSync(venvPython, ["--version"], { encoding: "utf-8" });
    console.log(`   Python version: ${version.stdout || version.stderr}`.trim());

    if (fs.existsSync(REQUIREMENTS)) {
      const currentHash = hashRequirements();
      let cachedHash = "";
      if (fs.existsSync(CACHE_FILE)) {
        cachedHash = fs.readFileSync(CACHE_FILE, "utf-8").trim();
      }

      if (currentHash === cachedHash) {
        console.log("✅ Requirements are up to date with cache.");
      } else {
        console.log("⚠️ Requirements may be outdated — run `npm run bootstrap`.");
      }
    } else {
      console.log("⚠️ No requirements.txt found.");
    }
  } else {
    console.log("❌ Virtual environment not found. Run `npm run bootstrap` to create it.");
  }

  console.log("\nStatus check complete.");
})();
