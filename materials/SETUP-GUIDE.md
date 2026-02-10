# GitHub セットアップ手順

## 1. ZIPを展開
```bash
unzip devforge-v9.zip -d devforge-v9
cd devforge-v9
```

## 2. npm install
```bash
npm install
```

## 3. 動作確認
```bash
npm test            # 127テスト全パス確認
node build.js       # devforge-v9.html 生成
open devforge-v9.html  # ブラウザで確認
```

## 4. Git初期化 & GitHub push
```bash
git init
git add .
git commit -m "DevForge v9.0 — R28: 39 modules, 127 tests, 484KB"

# GitHub でリポジトリ作成後:
git remote add origin https://github.com/<username>/devforge-v9.git
git branch -M main
git push -u origin main
```

## 5. AI Codingツールで開く

### VS Code
```bash
code devforge-v9/
```
→ `.vscode/settings.json` と `extensions.json` が自動適用

### Cursor
```bash
cursor devforge-v9/
```
→ `.cursorrules` と `.cursor/rules` が自動読み込み

### Claude Code
```bash
cd devforge-v9
claude
```
→ `CLAUDE.md` が自動読み込み

### Windsurf
→ `.windsurfrules` が自動読み込み

### Cline (VS Code拡張)
→ `.clinerules` が自動読み込み

### Antigravity / Devin
→ `AGENTS.md` を参照

---

## AI Coding プロンプト例

### 新プリセット追加
```
src/data/presets.jsに「不動産ポータル」プリセットを追加してください。
参考: 既存のecプリセットの構造に従って、entities, features, screensを定義。
完了後 npm test で回帰テスト確認。
```

### 新エンティティカラム追加
```
src/generators/common.jsのENTITY_COLUMNSに「Property」エンティティを追加。
カラム: title, description, price, location, bedrooms, bathrooms, area_sqm, status, owner_id(FK User)
ENTITY_METHODSにも追加(フルCRUD)。
```

### 生成品質改善
```
docs/07_test_cases.md のテストケースマトリクスを、
FEATURE_DETAILSの受入条件から自動生成するように改善。
test/にregressionテストを追加。npm test全パス確認。
```
