import { defineConfig } from "vite";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    // 他のビルド設定があればここに追加
  },
  // Viteのビルド後にCrittersを実行する
  async closeBundle() {
    // Crittersを使ってdist内のHTMLにcritical CSSをインライン化
    const Critters = (await import("critters")).default;
    const distDir = path.resolve(__dirname, "dist");
    const files = fs.readdirSync(distDir).filter((f) => f.endsWith(".html"));
    for (const file of files) {
      const filePath = path.join(distDir, file);
      const html = fs.readFileSync(filePath, "utf-8");
      const critters = new Critters({
        path: distDir,
        publicPath: "",
        logLevel: "info",
      });
      const inlined = await critters.process(html);
      fs.writeFileSync(filePath, inlined, "utf-8");
      console.log(`Critters: Inlined critical CSS for ${file}`);
    }
  },
});
