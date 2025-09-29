import fs from "fs";
import path from "path";

export default {
  plugins: [
    {
      name: "write-port",
      configureServer(server) {
        server.httpServer?.once("listening", () => {
          const address = server.httpServer.address();
          if (typeof address === "object" && address?.port) {
            const out = path.resolve(".vite-port.json");
            fs.writeFileSync(out, JSON.stringify({ port: address.port }));
            console.log("✨ Wrote Vite port to", out);
          }
        });
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
};
