import { spawn } from "child_process";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Auto-detect project root ---
// Walk up until we find a `.venv` folder or stop at filesystem root
function findProjectRoot(startDir: string): string {
  let dir = startDir;
  while (dir !== path.parse(dir).root) {
    if (existsSync(path.join(dir, ".venv"))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  // fallback: assume repo root is one level up from scripts/
  return path.resolve(__dirname, "..");
}

const projectRoot = findProjectRoot(__dirname);
console.log(`📂 Project root detected: ${projectRoot}`);

type PythonArgs = {
  module: string;
  filePath: string;
  isInstrumental: boolean;
  cwd?: string;
};

function resolvePythonPath(): string {
  const venvDir = path.join(projectRoot, ".venv", "bin");
  const candidates = ["python", "python3"];

  for (const name of candidates) {
    const candidate = path.join(venvDir, name);
    if (existsSync(candidate)) {
      console.log(`✅ Using Python from virtual environment: ${candidate}`);
      return candidate;
    }
  }

  console.warn("⚠️ No Python binary found in .venv. Falling back to system python3.");
  return "python3";
}

export function runPythonModule({
  module,
  filePath,
  isInstrumental,
  cwd = "src/core",
}: PythonArgs): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonPath = resolvePythonPath();
    const args = ["-m", module, filePath, String(isInstrumental)];

    console.log(`🚀 Running Python script: ${pythonPath} ${args.join(" ")}`);
    console.log(`📁 Working directory: ${cwd}`);

    const subprocess = spawn(pythonPath, args, {
      stdio: ["pipe", "pipe", "pipe"],
      cwd: path.resolve(projectRoot, cwd),
    });

    let stdout = "";
    let stderr = "";

    subprocess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    subprocess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    subprocess.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Python process completed successfully.");
        resolve(stdout.trim());
      } else {
        console.error(`❌ Python process exited with code ${code}`);
        console.error(`🔍 stderr: ${stderr.trim()}`);
        reject(new Error(`Python process failed: ${stderr.trim()}`));
      }
    });

    subprocess.on("error", (err) => {
      console.error("🔥 Failed to spawn Python process:", err.message);
      reject(err);
    });
  });
}