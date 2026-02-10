# DevForge v9 — Cursor / Claude Code + GitHub 同期ガイド

---

## 前提準備（初回のみ）

### 1. 必要なツールをインストール

```bash
# Git（まだなければ）
# https://git-scm.com/downloads からインストール

# Node.js v18+（まだなければ）
# https://nodejs.org からインストール

# Cursor（まだなければ）
# https://cursor.com からインストール

# Claude Code（まだなければ）
npm install -g @anthropic-ai/claude-code
```

### 2. Git 初期設定（まだなら）

```bash
git config --global user.name "あなたの名前"
git config --global user.email "あなた@example.com"
```

### 3. GitHub 認証設定（まだなら）

```bash
# 方法A: GitHub CLI（推奨）
brew install gh        # macOS
gh auth login          # ブラウザで認証

# 方法B: SSH キー
ssh-keygen -t ed25519
# → GitHub Settings > SSH Keys に公開鍵を追加
```

---

## Step 1: GitHub リポジトリ作成 & 初回 Push

### 1-1. ZIPを展開してセットアップ

```bash
# ダウンロードフォルダで
cd ~/Downloads
unzip devforge-v9.zip -d devforge-v9
cd devforge-v9

# 依存パッケージインストール
npm install

# 動作確認
npm test         # → 127 tests passing
node build.js    # → devforge-v9.html (484KB)
```

### 1-2. GitHub にリポジトリ作成

```bash
# GitHub CLI の場合（一番簡単）
gh repo create devforge-v9 --private --source=. --remote=origin

# または手動で:
# 1. https://github.com/new を開く
# 2. Repository name: devforge-v9
# 3. Private を選択
# 4. README は追加しない
# 5. Create repository
```

### 1-3. 初回コミット & Push

```bash
git init
git add .
git commit -m "DevForge v9.0 R28: 39 modules, 127 tests, 484KB"
git branch -M main

# GitHub CLI で作成した場合は origin は設定済み
# 手動の場合:
git remote add origin https://github.com/<ユーザー名>/devforge-v9.git

git push -u origin main
```

**✅ これで GitHub に全ファイルが保存されました**

---

## Step 2: Cursor で開発 + GitHub 同期

### 2-1. Cursor でプロジェクトを開く

```bash
cursor ~/Downloads/devforge-v9/
```

または Cursor アプリから: File → Open Folder → devforge-v9 を選択

### 2-2. Cursor が自動読み込みするファイル

Cursor は以下を自動認識します（設定不要）:

```
.cursorrules          ← プロジェクトルール（ルートに配置済み）
.cursor/rules         ← 追加ルール（配置済み）
```

これにより Cursor の AI は以下を理解した状態になります:
- src/ のみ編集、devforge-v9.html は直接編集しない
- ${} を単一引用符内で使わない
- Generator 関数で const G = S.genLang==='ja' を定義
- npm test && node build.js で確認

### 2-3. Cursor でバイブコーディング

**Cmd+L（Chat）** または **Cmd+K（Inline Edit）** で AI に指示:

```
docs/AI_CODING_PROMPTS.md を読んでください。
その後、A1-1 のプロンプトに従って不動産ポータルプリセットを追加してください。
```

または直接:

```
src/data/presets.js に「不動産ポータル」プリセットを追加して。
既存の ec プリセットの構造を参考に。
完了後 npm test で確認して。
```

### 2-4. Cursor から GitHub に同期

**方法A: Cursor の GUI（簡単）**

1. 左サイドバーの「Source Control」アイコン（分岐マーク）をクリック
2. 変更ファイルが一覧表示される
3. 「+」で Stage（または「Stage All Changes」）
4. メッセージ欄に `feat: 不動産ポータルプリセット追加` と入力
5. ✓ ボタンでコミット
6. 「Sync Changes」（または ↑ Push）をクリック

**方法B: Cursor 内蔵ターミナル**

Cursor 内で Ctrl+` でターミナルを開いて:

```bash
git add .
git commit -m "feat: 不動産ポータルプリセット追加"
git push
```

---

## Step 3: Claude Code で開発 + GitHub 同期

### 3-1. Claude Code でプロジェクトを開く

```bash
cd ~/Downloads/devforge-v9
claude
```

Claude Code は `CLAUDE.md` を自動読み込みします。

### 3-2. Claude Code でバイブコーディング

Claude Code のプロンプトで:

```
docs/AI_CODING_PROMPTS.md を読んで、
A2-1 のプロンプトに従って Vehicle エンティティを追加して。
npm test で確認もして。
```

Claude Code はファイルの読み書き・コマンド実行を自律的に行います。

### 3-3. Claude Code から GitHub に同期

Claude Code 内で直接指示:

```
変更を git commit して push して。
コミットメッセージは "feat: Vehicle エンティティ追加" で。
```

または Claude Code を終了後、手動で:

```bash
git add .
git commit -m "feat: Vehicle エンティティ追加"
git push
```

---

## Step 4: 別のマシンで作業を再開する

### 4-1. GitHub からクローン

```bash
git clone https://github.com/<ユーザー名>/devforge-v9.git
cd devforge-v9
npm install
npm test        # 動作確認
```

### 4-2. Cursor または Claude Code で開く

```bash
cursor .        # Cursor で開く
# または
claude          # Claude Code で開く
```

### 4-3. 最新版を取得（他のマシンで変更した場合）

```bash
git pull        # GitHub から最新を取得
npm install     # パッケージに変更があれば
npm test        # 確認
```

---

## 日常の開発フロー（まとめ）

```
┌─────────────────────────────────────────┐
│  1. git pull               最新取得     │
│  2. cursor . / claude      ツール起動   │
│  3. AIに指示（プロンプト集参照）         │
│  4. npm test && node build.js  確認     │
│  5. git add . && git commit  コミット   │
│  6. git push               GitHub同期   │
└─────────────────────────────────────────┘
```

### ブランチ運用（推奨）

```bash
# 新機能を始める前に
git checkout -b feature/新機能名

# 作業 → コミット → プッシュ
git push -u origin feature/新機能名

# GitHub で Pull Request 作成 → レビュー → main にマージ

# main に戻る
git checkout main
git pull
```

---

## トラブルシューティング

### テストが失敗する
```bash
npm test 2>&1 | grep "not ok"   # 失敗テストを確認
# Cursor/Claude Code に「このテスト失敗を修正して」と指示
```

### ビルドサイズが 500KB を超える
```bash
node build.js   # サイズ表示を確認
# 不要なデータを削減するか、圧縮を検討
```

### コンフリクトが発生した
```bash
git pull                  # コンフリクト発生
# Cursor の Source Control でコンフリクトファイルを確認
# Accept Current / Accept Incoming / Accept Both を選択
git add .
git commit -m "merge: resolve conflicts"
git push
```

### Cursor が .cursorrules を読まない
- ファイルがプロジェクトルートにあることを確認
- Cursor を再起動（Cmd+Shift+P → Reload Window）

### Claude Code が CLAUDE.md を読まない
- プロジェクトルートで `claude` を実行していることを確認
- `cat CLAUDE.md` でファイルが存在することを確認
