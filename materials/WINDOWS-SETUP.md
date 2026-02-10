# DevForge v9 — Windows 開発環境セットアップ & GitHub 同期ガイド
# Cursor + Claude Code（Cursor内ターミナル）ワークフロー

---

## 構成イメージ

```
┌─────────────────────────────────────────────┐
│  Cursor（メインIDE）                         │
│                                             │
│  ┌──────────────────┐  ┌────────────────┐  │
│  │  エディタ         │  │ ファイル       │  │
│  │  ソースコード閲覧  │  │ ツリー         │  │
│  │  差分確認         │  │                │  │
│  │  Git GUI操作      │  │                │  │
│  └──────────────────┘  └────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │  ターミナル（Ctrl+`）                 │   │
│  │  > claude                            │   │
│  │  Claude Code が起動                   │   │
│  │  → ファイル編集・テスト・Git操作を指示  │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  .cursorrules → Cursor AI (Ctrl+L) が参照   │
│  CLAUDE.md → Claude Code が参照              │
└─────────────────────────────────────────────┘
```

**Cursor の GUI** でファイル閲覧・差分確認・Git操作
**Cursor のターミナル内 Claude Code** でバイブコーディング

---

## 前提準備（初回のみ）

### 1. ツールインストール

| ツール | URL | 備考 |
|--------|-----|------|
| **Git for Windows** | https://git-scm.com/download/win | 「Add to PATH」にチェック |
| **Node.js v18+** | https://nodejs.org | LTS版、「Add to PATH」にチェック |
| **Cursor** | https://cursor.com | メインIDE |
| **GitHub CLI** | `winget install GitHub.cli` | または https://cli.github.com |

インストール後、PowerShell を**新規に開いて**確認:
```powershell
git --version        # git version 2.x.x
node --version       # v18.x.x 以上
npm --version        # 9.x.x 以上
gh --version         # gh version 2.x.x
```

### 2. Claude Code インストール

```powershell
npm install -g @anthropic-ai/claude-code
```

初回起動時に Anthropic API キーの認証が必要:
```powershell
claude
# → ブラウザが開く → Anthropic アカウントで認証
# → 認証完了後、Ctrl+C で一旦終了
```

### 3. Git 初期設定

```powershell
git config --global user.name "あなたの名前"
git config --global user.email "あなた@example.com"
git config --global core.autocrlf true    # Windows改行コード自動変換
```

### 4. GitHub 認証

```powershell
gh auth login
# → 「GitHub.com」を選択
# → 「HTTPS」を選択
# → 「Login with a web browser」を選択
# → ブラウザで認証 → 完了
```

---

## Step 1: プロジェクト展開 & GitHub Push

### 1-1. ZIPを展開

ダウンロードした `devforge-v9.zip` を右クリック →「すべて展開」

または PowerShell で:
```powershell
cd $HOME\Downloads
Expand-Archive devforge-v9.zip -DestinationPath devforge-v9
cd devforge-v9
```

### 1-2. セットアップ & 動作確認

```powershell
npm install
npm test            # → 127 tests passing
node build.js       # → devforge-v9.html (484KB)
```

### 1-3. GitHub リポジトリ作成 & Push（1コマンド）

```powershell
git init
git add .
git commit -m "DevForge v9.0 R28: 39 modules, 127 tests, 484KB"
git branch -M main
gh repo create devforge-v9 --private --source=. --remote=origin --push
```

**✅ GitHub 保存完了**

---

## Step 2: Cursor で開く

### 2-1. Cursor 起動

```powershell
cursor C:\Users\<ユーザー名>\Downloads\devforge-v9
```

または Cursor アプリ → File → Open Folder → `devforge-v9` を選択

### 2-2. 自動読み込みされるAI設定

Cursor が自動認識（設定不要）:
```
.cursorrules          ← Cursor AI (Ctrl+L / Ctrl+K) 用ルール
.cursor\rules         ← 追加ルール
```

Claude Code が自動認識（設定不要）:
```
CLAUDE.md             ← Claude Code 用ルール
```

両方のAIが「src/ のみ編集」「テスト必須」等のルールを理解済みの状態になります。

---

## Step 3: Cursor 内ターミナルで Claude Code を使う

### 3-1. ターミナルを開く

Cursor 内で **Ctrl+`**（バッククォート）を押す → ターミナルが下部に表示

### 3-2. Claude Code 起動

ターミナルで:
```powershell
claude
```

→ `CLAUDE.md` を自動読み込みし、プロジェクト構造を把握した状態で起動

### 3-3. バイブコーディング（Claude Code に指示）

#### 例1: プロンプト集を使う
```
docs/AI_CODING_PROMPTS.md を読んでください。
A1-1 のプロンプトに従って不動産ポータルプリセットを追加してください。
完了後 npm test で確認してください。
```

#### 例2: 新エンティティ追加
```
src/generators/common.js の ENTITY_COLUMNS に Vehicle エンティティを追加して。
カラム: owner_id(FK User), make, model, year, mileage, price, status, image_url
ENTITY_METHODS にもフルCRUD で追加。
npm test で確認。
```

#### 例3: バグ修正
```
npm test を実行して、失敗しているテストがあれば修正して。
```

#### 例4: 生成物の品質確認
```
LMS プリセットで全ファイルを生成して、
specification.md と technical-plan.md の整合性をチェックして。
```

Claude Code がファイル編集・テスト実行・結果確認を自律的に行います。
**Cursor のエディタ側で変更がリアルタイムに反映**されるので、差分をすぐ確認できます。

### 3-4. Claude Code 終了

```
exit
```
または **Ctrl+C** で終了 → 通常のターミナルに戻る

---

## Step 4: Cursor の AI も併用する

Claude Code を終了した後、Cursor 自体の AI 機能も使えます:

### Ctrl+L（Chat）
```
このファイルの getEntityMethods 関数の動作を説明して
```

### Ctrl+K（Inline Edit）
コードを選択 → Ctrl+K →
```
このswitch文をオブジェクトマップに書き換えて
```

### 使い分け

| 作業 | 使うツール | 操作 |
|------|-----------|------|
| 複数ファイルにまたがる大きな変更 | **Claude Code**（ターミナル） | claude → 指示 |
| 1ファイル内の小さな修正 | **Cursor AI**（インライン） | Ctrl+K |
| コードの質問・理解 | **Cursor AI**（Chat） | Ctrl+L |
| テスト実行・ビルド確認 | **ターミナル** | npm test |
| Git コミット・Push | **Cursor GUI** or **ターミナル** | 下記参照 |

---

## Step 5: GitHub に同期（コミット & Push）

### 方法A: Cursor GUI（マウス操作）

1. **Ctrl+Shift+G** → Source Control パネルを開く
2. 変更ファイル一覧が表示される
3. 「+」ボタンで Stage All Changes
4. 上部のメッセージ欄に入力:
   ```
   feat: 不動産ポータルプリセット追加
   ```
5. **✓ ボタン**（または Ctrl+Enter）でコミット
6. 「Sync Changes」をクリック → Push 完了

### 方法B: ターミナル（Ctrl+`）

```powershell
git add .
git commit -m "feat: 不動産ポータルプリセット追加"
git push
```

### 方法C: Claude Code に任せる

Claude Code 起動中に:
```
変更内容を確認して、適切なコミットメッセージで git commit & push して。
```

---

## Step 6: 別のPCで作業再開 / 最新版取得

### クローン（新しいPCの場合）
```powershell
cd $HOME\Documents
git clone https://github.com/<ユーザー名>/devforge-v9.git
cd devforge-v9
npm install
npm test
cursor .
```

### Pull（同じPCで最新を取得）
```powershell
cd devforge-v9
git pull
npm install        # package.json 変更があれば
npm test
```

---

## 日常フロー早見表

```
┌─────────────────────────────────────────────┐
│  PowerShell                                 │
│  > cd devforge-v9                           │
│  > git pull                    ← ① 最新取得 │
│  > cursor .                    ← ② Cursor起動│
│                                             │
│  ┌── Cursor 内 ──────────────────────────┐  │
│  │                                       │  │
│  │  Ctrl+`  → ターミナル                  │  │
│  │  > claude                ← ③ CC起動   │  │
│  │  > (AIに指示)            ← ④ 開発     │  │
│  │  > exit                  ← ⑤ CC終了   │  │
│  │  > npm test              ← ⑥ テスト   │  │
│  │  > node build.js         ← ⑦ ビルド   │  │
│  │                                       │  │
│  │  Ctrl+Shift+G → Git GUI               │  │
│  │  Stage → Commit → Push   ← ⑧ 同期    │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## コミットメッセージ規約（推奨）

```
feat: 新機能追加           例: feat: 不動産プリセット追加
fix: バグ修正              例: fix: Payment DELETE API除去
docs: ドキュメント更新      例: docs: README 更新
test: テスト追加           例: test: R29回帰テスト追加
refactor: リファクタリング  例: refactor: getEntityColumns整理
```

---

## トラブルシューティング

### 「git は認識されていません」
→ Git for Windows 再インストール → PowerShell を閉じて開き直す

### 「node は認識されていません」
→ Node.js 再インストール → PowerShell を閉じて開き直す

### 「claude は認識されていません」
```powershell
npm install -g @anthropic-ai/claude-code
# PowerShell を閉じて開き直す
claude --version
```

### npm install でエラー
```powershell
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install
```

### git push で認証エラー
```powershell
gh auth login         # 再認証
gh auth status        # 確認
```

### Cursor が .cursorrules を認識しない
Ctrl+Shift+P →「Reload Window」で再読み込み

### Claude Code が CLAUDE.md を読まない
Cursor のターミナルで `pwd` を実行してプロジェクトルートにいるか確認:
```powershell
pwd          # C:\Users\...\devforge-v9 であること
claude       # ここで起動
```

### テストが失敗する
```powershell
npm test 2>&1 | Select-String "not ok"
# → 失敗テスト名をコピーして Claude Code に:
# 「このテストが失敗しています。修正してください: [テスト名]」
```

### コンフリクト発生
```powershell
git pull
# → CONFLICT と表示されたら
# → Cursor のエディタでコンフリクトファイルを開く
# → 「Accept Current」「Accept Incoming」「Accept Both」を選択
git add .
git commit -m "merge: resolve conflicts"
git push
```
