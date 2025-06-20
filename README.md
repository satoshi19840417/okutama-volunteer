# okutama-volunteer
奥多摩ボランティア活動管理サイト

## 画像変換ツール

このプロジェクトには、画像をWebP形式に変換するツールが含まれています。

### 使用方法

1. **画像を配置**
   - `images`フォルダに変換したい画像（JPG、PNG）を配置してください

2. **変換実行**
   ```bash
   npm run convert-webp
   ```
   または
   ```bash
   node convert-to-webp.js
   ```

3. **結果確認**
   - 変換されたWebP画像は`webp`フォルダに保存されます
   - 元の画像はそのまま残ります

### 対応形式
- 入力: JPG、JPEG、PNG
- 出力: WebP（品質80%）

### フォルダ構造
```
okutama-volunteer/
├── images/          # 変換元画像
├── webp/           # 変換後画像
├── convert-to-webp.js
└── package.json
```

CI/CD 動作確認テスト
