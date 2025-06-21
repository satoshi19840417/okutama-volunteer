const Critters = require("critters");
const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "dist");
const assetsDir = path.resolve(distDir, "assets");

(async () => {
  const files = fs.readdirSync(distDir).filter((f) => f.endsWith(".html"));
  for (const file of files) {
    const filePath = path.join(distDir, file);
    const html = fs.readFileSync(filePath, "utf-8");
    const critters = new Critters({
      path: assetsDir,
      publicPath: "/assets/",
      logLevel: "info",
    });
    const inlined = await critters.process(html);
    fs.writeFileSync(filePath, inlined, "utf-8");
    console.log(`Critters: Inlined critical CSS for ${file}`);
  }
})();
