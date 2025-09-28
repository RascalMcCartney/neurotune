#!/usr/bin/env ts-node

import { fileURLToPath } from "url";
import * as path from "path";

// Recreate CommonJS globals
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as fs from "fs";
import { spawnSync } from "child_process";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const VENV_DIR = path.join(PROJECT_ROOT, ".venv");
const CACHE_FILE = path.join(PROJECT_ROOT, ".requirements.hash");

function removeDir(dirPath: string) {
  if (fs.existsSync(dirPath)) {
    console.log(`🗑️ Removing ${dirPath}...`);
    if (process.platform === "win32") {
      spawnSync("cmd", ["/c", "rmdir", "/s", "/q", dirPath], { stdio: "inherit" });
    } else {
      spawnSync("rm", ["-rf", dirPath], { stdio: "inherit" });
    }
    console.log(`✅ Removed ${dirPath}`);
  }
}

(function main() {
  try {
    removeDir(VENV_DIR);

    if (fs.existsSync(CACHE_FILE)) {
      console.log(`🗑️ Removing ${CACHE_FILE}...`);
      fs.unlinkSync(CACHE_FILE);
      console.log("✅ Cache file removed.");
    }

    console.log("🎉 Clean complete. You now have a fresh environment.");
  } catch (err) {
    console.error("❌ Failed to clean environment:", (err as Error).message);
    process.exit(1);
  }
})();
