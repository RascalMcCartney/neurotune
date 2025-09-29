// scripts/py-runner.cjs
const { spawnSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const venvDir = path.join(__dirname, "..", ".venv");
const isWin = process.platform === "win32";

// --- Helper: find a working Python command ---
function findPython() {
  const candidates = isWin ? ["python", "py"] : ["python3", "python"];
  for (const cmd of candidates) {
    const check = spawnSync(cmd, ["--version"], { encoding: "utf-8" });
    if (check.status === 0) {
      console.log(`✅ Using ${cmd} (${check.stdout || check.stderr})`);
      return cmd;
    }
  }
  console.error("❌ Could not find Python. Please install Python 3 and add it to your PATH.");
  process.exit(1);
}

const pythonCmd = findPython();

// --- Paths to venv executables ---
const pythonExec = isWin
  ? path.join(venvDir, "Scripts", "python.exe")
  : path.join(venvDir, "bin", "python");

// --- Step 1: Ensure venv exists ---
if (!fs.existsSync(pythonExec)) {
  console.log("🐍 Creating Python virtual environment...");
  const create = spawnSync(pythonCmd, ["-m", "venv", venvDir], { stdio: "inherit" });
  if (create.error || create.status !== 0) {
    console.error("❌ Failed to create venv:", create.error || create.status);
    process.exit(1);
  }
}

// --- Step 2: Install/upgrade pip + requirements ---
console.log("📦 Installing Python dependencies...");
const upgradePip = spawnSync(pythonExec, ["-m", "pip", "install", "--upgrade", "pip"], { stdio: "inherit" });
if (upgradePip.error || upgradePip.status !== 0) {
  console.error("❌ Failed to upgrade pip:", upgradePip.error || upgradePip.status);
  process.exit(1);
}

const reqFile = path.join(__dirname, "..", "requirements.txt");
if (fs.existsSync(reqFile)) {
  const installReqs = spawnSync(pythonExec, ["-m", "pip", "install", "-r", reqFile], { stdio: "inherit" });
  if (installReqs.error || installReqs.status !== 0) {
    console.error("❌ Failed to install requirements:", installReqs.error || installReqs.status);
    process.exit(1);
  }
}

// --- Step 3: Handle arguments ---
const args = process.argv.slice(2);

// Special mode: just check env and exit
if (args.length === 1 && args[0] === "--check-env") {
  console.log("✅ Python environment is ready.");
  process.exit(0);
}

// Otherwise, run a Python script
if (args.length === 0) {
  console.error("Usage: node scripts/py-runner.cjs <python-script> [args...]");
  process.exit(1);
}

const scriptPath = path.join(__dirname, "..", args[0]);
const scriptArgs = args.slice(1);

console.log(`🚀 Running ${scriptPath} with args: ${scriptArgs.join(" ")}`);
const proc = spawn(pythonExec, [scriptPath, ...scriptArgs], { stdio: "inherit" });

proc.on("exit", code => process.exit(code));