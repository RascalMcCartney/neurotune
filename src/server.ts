import express from "express";
import { spawn } from "child_process";

const app = express();

// Example endpoint that calls your Python analysis
app.get("/api/analyze", (req, res) => {
  const py = spawn("python", ["python/analyze.py", "input.wav"]);
  let output = "";

  py.stdout.on("data", (data) => (output += data.toString()));
  py.on("close", () => res.json({ result: output.trim() }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});