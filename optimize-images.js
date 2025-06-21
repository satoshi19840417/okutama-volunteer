// 必要なライブラリを読み込みます
const Jimp = require("jimp");
const glob = require("glob");
const fs = require("fs");
const path = require("path");

// 変換する画像を探すパターン
const IMAGE_PATH_PATTERN = "images/**/*.{jpg,png,jpeg}";

// メインの処理
async function optimizeImages() {
  console.log("画像の最適化を開始します...");

  let files;
  try {
    files = glob.sync(IMAGE_PATH_PATTERN);
  } catch (err) {
    console.error("画像ファイルの検索中にエラーが発生しました:", err);
    return;
  }

  if (!files || files.length === 0) {
    console.log(
      "対象の画像が見つかりませんでした。パスが正しいか確認してください: " +
        IMAGE_PATH_PATTERN,
    );
    return;
  }

  console.log(`${files.length}個の画像が見つかりました。`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const file of files) {
    try {
      if (!fs.existsSync(file)) {
        console.warn(`ファイルが存在しません: ${file}`);
        failCount++;
        continue;
      }

      // 日本語ファイル名対応
      const outputWebpPath = path.join(
        path.dirname(file),
        path.parse(file).name + ".webp",
      );

      if (fs.existsSync(outputWebpPath)) {
        console.log(`スキップ: ${outputWebpPath} は既に存在します。`);
        skipCount++;
        continue;
      }

      let image;
      try {
        image = await Jimp.read(file);
      } catch (err) {
        console.error(
          `Jimp.read失敗: ${file}\nエラー内容: ${err.message}\nスタック: ${err.stack}`,
        );
        failCount++;
        continue;
      }

      try {
        await image.quality(80).writeAsync(outputWebpPath);
        console.log(`変換成功: ${file} -> ${outputWebpPath}`);
        successCount++;
      } catch (err) {
        console.error(
          `WebP保存失敗: ${file}\nエラー内容: ${err.message}\nスタック: ${err.stack}`,
        );
        failCount++;
      }
    } catch (err) {
      console.error(
        `予期しないエラー: ${file}\nエラー内容: ${err.message}\nスタック: ${err.stack}`,
      );
      failCount++;
    }
  }

  console.log("画像の最適化が完了しました。");
  console.log(
    `成功: ${successCount}件, スキップ: ${skipCount}件, 失敗: ${failCount}件`,
  );
}

optimizeImages().catch((err) => {
  console.error("致命的なエラーが発生しました:", err);
  process.exit(1);
});
