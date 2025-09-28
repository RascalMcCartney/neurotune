import { runPythonModule } from "../scripts/pythonWrapper";

runPythonModule({
  module: "audio_analyzer",
  filePath: "../temp/audio/1758961239205_29f7ac1b-3eb5-499c-a137-f37bfd90144f.mp3",
  isInstrumental: true,
})
  .then((output) => console.log("🎵 Analysis result:", output))
  .catch((err) => console.error("🚨 Error running Python module:", err));