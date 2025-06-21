import { defineConfig } from "vite";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        activities: path.resolve(__dirname, "activities.html"),
        mv: path.resolve(__dirname, "mv.html"),
      },
      output: {
        manualChunks: {
          vendor: ["vite"],
        },
      },
    },
    // アセットの最適化
    assetsInlineLimit: 4096,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // サーバー設定
  server: {
    port: 3000,
    open: true,
  },
  // プレビュー設定
  preview: {
    port: 4173,
    open: true,
  },
  // Viteのビルド後にCrittersを実行する
  async closeBundle() {
    try {
      // Crittersを使ってdist内のHTMLにcritical CSSをインライン化
      const Critters = (await import("critters")).default;
      const distDir = path.resolve(__dirname, "dist");
      
      if (!fs.existsSync(distDir)) {
        console.warn("Dist directory not found, skipping Critters processing");
        return;
      }
      
      const files = fs.readdirSync(distDir).filter((f) => f.endsWith(".html"));
      
      for (const file of files) {
        try {
          const filePath = path.join(distDir, file);
          const html = fs.readFileSync(filePath, "utf-8");
          const critters = new Critters({
            path: distDir,
            publicPath: "",
            logLevel: "info",
            reduceInlineStyles: true,
            mergeStylesheets: true,
          });
          const inlined = await critters.process(html);
          fs.writeFileSync(filePath, inlined, "utf-8");
          console.log(`Critters: Inlined critical CSS for ${file}`);
        } catch (error) {
          console.warn(`Error processing ${file} with Critters:`, error);
        }
      }
    } catch (error) {
      console.warn("Error in closeBundle hook:", error);
    }
  },
});
