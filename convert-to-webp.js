const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// 設定
const INPUT_DIR = "./images";
const OUTPUT_DIR = "./webp";
const SUPPORTED_FORMATS = [".jpg", ".jpeg", ".png"];

// 出力ディレクトリが存在しない場合は作成
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`出力ディレクトリを作成しました: ${OUTPUT_DIR}`);
}

// 画像ファイルを取得
function getImageFiles(dir) {
  const files = fs.readdirSync(dir);
  return files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return SUPPORTED_FORMATS.includes(ext);
  });
}

// 画像をWebPに変換
async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 80 }) // WebP品質を80に設定
      .toFile(outputPath);

    console.log(
      `✅ 変換完了: ${path.basename(inputPath)} → ${path.basename(outputPath)}`,
    );
    return true;
  } catch (error) {
    console.error(
      `❌ 変換エラー: ${path.basename(inputPath)} - ${error.message}`,
    );
    return false;
  }
}

// メイン処理
async function main() {
  console.log("🚀 画像のWebP変換を開始します...\n");

  // 入力ディレクトリの存在確認
  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`❌ 入力ディレクトリが見つかりません: ${INPUT_DIR}`);
    console.log(
      "📁 imagesフォルダを作成して、変換したい画像を配置してください。",
    );
    return;
  }

  // 画像ファイルを取得
  const imageFiles = getImageFiles(INPUT_DIR);

  if (imageFiles.length === 0) {
    console.log(`📁 ${INPUT_DIR}フォルダに変換可能な画像が見つかりません。`);
    console.log(`📋 対応形式: ${SUPPORTED_FORMATS.join(", ")}`);
    return;
  }

  console.log(`📁 変換対象ファイル数: ${imageFiles.length}個\n`);

  let successCount = 0;
  let errorCount = 0;

  // 各画像を変換
  for (const file of imageFiles) {
    const inputPath = path.join(INPUT_DIR, file);
    const fileName = path.parse(file).name;
    const outputPath = path.join(OUTPUT_DIR, `${fileName}.webp`);

    const success = await convertToWebP(inputPath, outputPath);

    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  // 結果表示
  console.log("\n📊 変換結果:");
  console.log(`✅ 成功: ${successCount}個`);
  console.log(`❌ 失敗: ${errorCount}個`);
  console.log(`📁 出力先: ${OUTPUT_DIR}`);

  if (successCount > 0) {
    console.log("\n🎉 変換が完了しました！");
  }
}

// スクリプト実行
main().catch((error) => {
  console.error("❌ 予期しないエラーが発生しました:", error);
  process.exit(1);
});
