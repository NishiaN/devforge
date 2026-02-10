# DevForge v9 — AI Coding プロンプト集
> Cursor / Claude Code / Windsurf / Cline / Antigravity 対応

---

# Part A: DevForge 本体の機能追加・改善

DevForge v9 のソースコード (`src/`) を編集して機能を拡張するためのプロンプト集。
各プロンプトをAIエディタのチャットにそのまま貼り付けて使えます。

---

## A1. 新プリセット追加

### A1-1. 基本プリセット追加
```
src/data/presets.js に「不動産ポータル」プリセットを追加してください。

既存の ec プリセットの構造を参考に:
- key: 'realestate'
- purpose: '不動産ポータルサイト'
- target: '購入検討者, 不動産会社, 仲介業者'
- data_entities: 'User, Property, Category, Inquiry, Favorite, Agent'
- mvp_features: 'ユーザー認証, 物件管理, 物件検索・フィルタ, お問い合わせ, お気に入り'
- screens: 'ランディング, 物件一覧, 物件詳細, お問い合わせ, ダッシュボード, 管理画面'
- frontend: 'React + Next.js'
- backend: 'Supabase'
- payment: 'なし'

完了後 npm test で全テストパス確認してください。
```

### A1-2. プリセット + エンティティカラム同時追加
```
「医療予約システム」プリセットを追加してください。

1. src/data/presets.js に key='clinic' で追加
   - data_entities: 'User, Doctor, Department, Appointment, MedicalRecord, TimeSlot'
   - mvp_features: 'ユーザー認証, 医師管理, 予約管理, 診療記録, タイムスロット管理'

2. src/generators/common.js の ENTITY_COLUMNS に以下を追加:
   - Doctor: specialty, license_number, department_id(FK Department), bio, avatar_url
   - Department: description, floor, phone
   - Appointment: user_id(FK User), doctor_id(FK Doctor), starts_at, ends_at, status, notes
   - MedicalRecord: user_id(FK User), doctor_id(FK Doctor), diagnosis, prescription, visit_date
   - TimeSlot: doctor_id(FK Doctor), day_of_week, start_time, end_time, is_available

3. ENTITY_METHODS に追加:
   - MedicalRecord: ['GET','GET/:id','POST'] (作成後変更不可)
   - TimeSlot: ['GET','POST','PATCH/:id','DELETE/:id']
   - Appointment: ['GET','GET/:id','POST','PATCH/:id'] (キャンセル=PATCH)

4. npm test で全テスト通過確認
```

---

## A2. 新エンティティカラム追加

### A2-1. 単体追加
```
src/generators/common.js の ENTITY_COLUMNS に Vehicle エンティティを追加してください。

カラム定義（既存の Product エンティティの書式に従う）:
Vehicle:[
  'owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID',
  'make:VARCHAR(100):NOT NULL:メーカー:Make',
  'model:VARCHAR(100):NOT NULL:車種:Model',
  'year:INT:NOT NULL:年式:Year',
  'mileage:INT::走行距離:Mileage',
  'price:DECIMAL(10,2):NOT NULL:価格:Price',
  'status:VARCHAR(20):DEFAULT \'available\':状態:Status',
  'image_url:TEXT::画像URL:Image URL'
]

ENTITY_METHODS にも追加（フルCRUD）。
npm test で確認。
```

---

## A3. FEATURE_DETAILS 拡充

### A3-1. 新機能の受入条件追加
```
src/generators/common.js の FEATURE_DETAILS に以下の機能パターンを追加してください。

'地図|Map|位置情報|Location|GPS': {
  criteria_ja: [
    '地図表示（Google Maps / Mapbox連携）',
    'ピン表示・クラスタリング対応',
    '現在地取得（Geolocation API）',
    '住所⇔座標の相互変換（ジオコーディング）',
    '範囲検索（半径○km以内）'
  ],
  criteria_en: [
    'Map display (Google Maps / Mapbox integration)',
    'Pin display with clustering',
    'Current location (Geolocation API)',
    'Address ↔ coordinates geocoding',
    'Range search (within X km radius)'
  ]
}

'通知|Notification|Push|アラート': {
  criteria_ja: [
    'アプリ内通知（未読バッジ・既読管理）',
    'メール通知（SendGrid / Resend連携）',
    'Push通知（Web Push API / FCM）',
    '通知設定（カテゴリ別ON/OFF）',
    '通知一覧（ページネーション対応）'
  ],
  criteria_en: [
    'In-app notifications (unread badge, read management)',
    'Email notifications (SendGrid / Resend)',
    'Push notifications (Web Push API / FCM)',
    'Notification preferences (per-category ON/OFF)',
    'Notification list (paginated)'
  ]
}

追加後 npm test で全テスト通過確認。
特に docs/23_tasks.md と verification.md にこれらの受入条件が反映されることを確認。
```

---

## A4. 互換性ルール追加

### A4-1. 新ルール追加
```
src/data/compat-rules.js に以下の互換性ルールを追加してください。

1. Supabase + Drizzle ORM の場合 → 警告「Supabase は Prisma との親和性が高いです。Drizzle を使う場合は型定義の手動管理が必要です」
2. Firebase + Stripe の場合 → 情報「Firebase Functions (Gen2) で Stripe Webhook を処理してください」
3. React + Vite + Vercel の場合 → 情報「Vite ビルドは vercel.json の設定が必要です」

既存ルールの書式に従い、test/compat.test.js にテストも追加してください。
npm test で全テスト通過確認。
```

---

## A5. 生成ドキュメント品質改善

### A5-1. テストケースマトリクス改善
```
src/generators/docs.js の docs/07_test_cases.md 生成を改善してください。

現状: 全featureに対して汎用的なテスト行を生成
改善: FEATURE_DETAILS の criteria から具体的なテストケースを自動生成

例（ユーザー認証の場合）:
| テスト名 | 種別 | 期待結果 |
|---------|------|---------|
| メール+パスワード新規登録 | 正常系 | 201, ユーザー作成、メール確認送信 |
| 重複メール登録 | 異常系 | 409, エラーメッセージ表示 |
| Google OAuth ログイン | 正常系 | 302, セッション作成 |
| パスワードリセット | 正常系 | メール送信、リセットリンク有効 |

getFeatureDetail() を活用して、criteria_ja の各項目を
正常系テストケースに変換するロジックを追加してください。

test/r29-regression.test.js に回帰テスト追加。
npm test で確認。
```

### A5-2. ER図にカーディナリティ追加
```
src/generators/docs.js の docs/04_er_diagram.md を改善してください。

現状: エンティティ間の線のみ
改善: FK定義からカーディナリティ（1:N, N:1, 1:1）を自動推論して Mermaid erDiagram に反映

例:
  User ||--o{ Post : "writes"
  User ||--o{ Comment : "posts"
  Post ||--o{ Comment : "has"

FK カラムが NOT NULL なら ||--o{（1:N 必須）
FK カラムが NULLABLE なら |o--o{（0:N 任意）
UNIQUE FK なら ||--||（1:1）

ENTITY_COLUMNS の constraint を解析して自動判定してください。
npm test で確認。
```

---

## A6. 新 Pillar / ジェネレータ追加

### A6-1. Pillar 8: Supabase マイグレーション生成
```
src/generators/ に p8-migrations.js を新規作成してください。

機能: ENTITY_COLUMNS から Supabase マイグレーション SQL を自動生成

生成ファイル:
- supabase/migrations/001_create_tables.sql
  - CREATE TABLE 文（ENTITY_COLUMNS のカラム定義から）
  - FK 制約
  - インデックス（FK カラムに自動）
  - created_at / updated_at デフォルト値

- supabase/migrations/002_rls_policies.sql
  - 全テーブルに RLS 有効化
  - auth.uid() = user_id の基本ポリシー
  - Admin ロールは全権限

条件: backend が Supabase の場合のみ生成。

1. p8-migrations.js を作成
2. src/generators/index.js に登録
3. build.js の modules に追加
4. テスト追加
5. npm test && node build.js で確認
```

---

## A7. UI 改善

### A7-1. ダークモード改善
```
src/styles/all.css のダークモードカラーパレットを改善してください。

現状の問題:
- コードブロック背景が暗すぎて読みにくい
- ボーダー色のコントラストが低い

改善:
- --code-bg を #1e293b（Slate-800）に変更
- --border を #475569（Slate-600）に変更
- --text-secondary を #94a3b8（Slate-400）に変更
- コードブロック内のテキストは #e2e8f0（Slate-200）

CSS カスタムプロパティのみ変更。既存のクラス名は変えない。
両テーマでブラウザ確認してから npm test。
```

---

## A8. テスト強化

### A8-1. 英語出力の回帰テスト追加
```
test/snapshot.test.js の Snapshot D (English Output) に以下のアサーションを追加してください:

1. constitution.md に "Out of Scope" セクションが存在
2. constitution.md の KPI セクションに "（未定義）" が含まれない
3. technical-plan.md の ER テーブルカラムが英語表記
4. docs/23_tasks.md の AC が英語（"Implementation done" または feature-specific criteria）
5. verification.md に "Feature Verification Checklist" セクション存在

npm test で確認。
```

---

# Part B: DevForge 生成物を使った実プロジェクト構築

DevForge で生成した 62ファイルを AI エディタに読み込ませて、
実際のプロジェクトをバイブコーディングする際のプロンプト集。

---

## B0. プロジェクト初期化（最初に必ず実行）

### B0-1. AI にプロジェクト仕様を読み込ませる
```
このプロジェクトの仕様書を読み込んでください。

以下のファイルを順番に読んで、プロジェクト全体像を把握してください:
1. CLAUDE.md（プロジェクト概要・ルール）
2. .spec/constitution.md（プロジェクト憲法）
3. .spec/specification.md（機能仕様）
4. .spec/technical-plan.md（技術計画・ER図）
5. docs/05_api_design.md（API設計）

読み終わったら、プロジェクトの概要を3行で要約してください。
```

### B0-2. 開発環境セットアップ
```
.devcontainer/ の設定に基づいてプロジェクトの初期セットアップを行ってください。

1. package.json を作成（dependencies は .spec/technical-plan.md の技術スタック参照）
2. tsconfig.json を TypeScript strict モードで作成
3. .env.example を .env.example ファイルの内容で作成
4. .devcontainer/post-create.sh の手順を実行

CLAUDE.md のルールに必ず従ってください。
```

---

## B1. データモデル・DB

### B1-1. Prisma スキーマ生成
```
.spec/technical-plan.md の ER図 と docs/04_er_diagram.md を参照して
prisma/schema.prisma を生成してください。

要件:
- 全エンティティに id (UUID), created_at, updated_at を含める
- FK はリレーションとして定義（@relation）
- インデックスは FK カラムに自動追加（@@index）
- enum は status カラムに使用
- .spec/technical-plan.md の RLS コメントも // コメントで残す

生成後 npx prisma validate で検証してください。
```

### B1-2. Supabase マイグレーション生成
```
.spec/technical-plan.md の ER図を参照して
supabase/migrations/20240101000000_init.sql を生成してください。

要件:
- CREATE TABLE 文（全エンティティ）
- id UUID PRIMARY KEY DEFAULT gen_random_uuid()
- created_at / updated_at TIMESTAMP WITH TIME ZONE
- FK 制約（REFERENCES, ON DELETE CASCADE）
- RLS 有効化（ALTER TABLE ... ENABLE ROW LEVEL SECURITY）
- 基本 RLS ポリシー:
  - SELECT: auth.uid() = user_id（本人のみ閲覧）
  - INSERT: auth.uid() = user_id
  - admin ロールは全権限

constitution.md のセキュリティ方針に準拠してください。
```

---

## B2. 認証

### B2-1. Supabase Auth 実装
```
.spec/specification.md の「ユーザー認証」受入条件を実装してください。

docs/22_prompt_playbook.md の Phase 2 認証セクションの指示に従い:

1. src/lib/supabase.ts — Supabase クライアント初期化
2. src/app/(auth)/login/page.tsx — ログイン画面
   - メール + パスワード
   - Google OAuth ボタン
3. src/app/(auth)/register/page.tsx — 新規登録画面
4. src/app/(auth)/reset-password/page.tsx — パスワードリセット
5. src/middleware.ts — 認証ミドルウェア（未認証→/login リダイレクト）
6. src/hooks/useAuth.ts — 認証状態管理フック

docs/07_test_cases.md の認証テストケースに対応する
Vitest テストも作成してください。
```

### B2-2. NextAuth (Auth.js v5) 実装
```
.spec/specification.md の「ユーザー認証」受入条件を NextAuth v5 で実装してください。

1. src/auth.ts — NextAuth 設定
   - providers: Google, Credentials
   - adapter: PrismaAdapter
   - session: jwt strategy
2. src/app/api/auth/[...nextauth]/route.ts — API ルート
3. src/middleware.ts — 保護ルート設定
4. src/components/auth/LoginForm.tsx — ログインフォーム
5. src/components/auth/RegisterForm.tsx — 登録フォーム

docs/08_security.md のセキュリティ要件に準拠してください。
Vitest でユニットテスト作成。
```

---

## B3. 機能実装（CRUD）

### B3-1. 一般的な CRUD 機能
```
docs/23_tasks.md の Issue #[番号] を実装してください。

実装手順:
1. docs/05_api_design.md の該当エンティティ API 仕様を確認
2. .spec/technical-plan.md の ER 定義を確認
3. API 実装（レスポンス形式は api_design.md に従う）
4. UI 実装（docs/06_screen_design.md のコンポーネント構成に従う）
5. バリデーション（zod スキーマ）
6. テスト（docs/07_test_cases.md の該当テストケース）

docs/23_tasks.md の Acceptance Criteria を全てチェックできるようにしてください。
```

### B3-2. Supabase CRUD 実装
```
docs/05_api_design.md の [エンティティ名] データアクセスパターンを実装してください。

1. src/lib/api/[entity].ts — Supabase クエリ関数
   - list: supabase.from().select().range().order()
   - getById: supabase.from().select().eq('id', id).single()
   - create: supabase.from().insert()
   - update: supabase.from().update().eq('id', id)
   - delete: supabase.from().delete().eq('id', id)

2. src/app/(dashboard)/[entity]/page.tsx — 一覧画面
3. src/app/(dashboard)/[entity]/[id]/page.tsx — 詳細画面
4. src/components/[entity]/Form.tsx — 作成/編集フォーム

エラーハンドリングと楽観的更新も含めてください。
```

### B3-3. REST API CRUD 実装（Express）
```
docs/05_api_design.md の [エンティティ名] エンドポイントを実装してください。

注意: API 設計書に定義されているメソッドのみ実装してください。
（例: Payment は GET と POST のみ、DELETE/PUT は不可）

1. src/routes/[entity].ts — Express ルーター
   - API 設計書のステータスコードに従う
   - ページネーション: ?page=1&limit=20&sort=created_at&order=desc
   - レスポンス形式: { data: [...], meta: { total, page } }

2. src/controllers/[entity].ts — ビジネスロジック
3. src/validators/[entity].ts — zod バリデーション
4. src/tests/[entity].test.ts — Vitest テスト

docs/08_security.md の認証・認可要件に従ってください。
```

---

## B4. 画面実装

### B4-1. 画面フロー全体実装
```
docs/06_screen_design.md の画面遷移図と画面一覧を参照して、
全画面のルーティングとレイアウトを実装してください。

1. src/app/layout.tsx — ルートレイアウト（Header, Footer）
2. 各画面のpage.tsx を作成（URL は screen_design.md の URL 欄に従う）
3. 認証の要/不要は screen_design.md の「認証」欄に従う
4. 各画面には screen_design.md の「主要コンポーネント」を全て含める

Tailwind CSS + shadcn/ui でスタイリング。
モバイルレスポンシブ対応必須。
```

### B4-2. ダッシュボード画面
```
docs/06_screen_design.md のダッシュボード画面を実装してください。

コンポーネント:
- StatCard（数値表示カード × 4）
- RecentActivity（直近のアクティビティ一覧）
- Chart（recharts で折れ線グラフ）
- QuickActions（よく使う操作ボタン）

データは Supabase / API からリアルタイム取得。
ローディングスケルトン表示を含めてください。
```

---

## B5. Stripe 決済

### B5-1. サブスクリプション実装
```
.spec/specification.md の「サブスクリプション」受入条件と
.spec/technical-plan.md の料金プランを参照して、Stripe 連携を実装してください。

1. src/lib/stripe.ts — Stripe クライアント
2. /api/webhook/stripe (POST) — Webhook ハンドラ
   - checkout.session.completed → Subscription 作成
   - customer.subscription.updated → プラン変更反映
   - customer.subscription.deleted → キャンセル処理
   - invoice.payment_failed → 支払い失敗通知
3. /api/checkout (POST) — Checkout Session 作成
4. src/app/(dashboard)/billing/page.tsx — 請求管理画面
   - 現在のプラン表示
   - プラン変更ボタン
   - 請求履歴

docs/08_security.md の決済セキュリティ要件に準拠:
- Webhook 署名検証（STRIPE_WEBHOOK_SECRET）
- 冪等キー使用
- PCI DSS 準拠（Stripe Elements 使用）
```

---

## B6. テスト

### B6-1. ユニットテスト一括作成
```
docs/07_test_cases.md のテストケースマトリクスを参照して、
全テストケースの Vitest テストを作成してください。

テストファイル構成:
- src/__tests__/auth.test.ts — 認証テスト
- src/__tests__/[entity].test.ts — 各エンティティの CRUD テスト
- src/__tests__/api/[entity].test.ts — API テスト

各テストケースは:
- 正常系: 期待するステータスコードとレスポンス形式を検証
- 異常系: バリデーションエラー、認証エラー、404を検証
- 境界値: 空文字列、最大長、特殊文字

テストは独立して実行可能にしてください（テスト間の依存なし）。
```

### B6-2. E2E テスト
```
docs/07_test_cases.md と docs/06_screen_design.md を参照して、
Playwright E2E テストを作成してください。

テストシナリオ:
1. 新規登録 → ログイン → ダッシュボード表示
2. [メイン機能] の CRUD 操作（作成 → 一覧確認 → 編集 → 削除）
3. 未認証でのアクセス → ログインページリダイレクト
4. レスポンシブ表示（モバイル幅でのナビゲーション）

e2e/ ディレクトリに配置。
playwright.config.ts も作成してください。
```

---

## B7. デプロイ・CI/CD

### B7-1. CI/CD パイプライン確認・調整
```
.github/workflows/ci.yml を確認して、プロジェクトの現状に合わせて調整してください。

確認項目:
1. Node.js バージョンが package.json の engines と一致
2. テストコマンドが正しい（npm test）
3. ビルドコマンドが正しい（npm run build）
4. 環境変数がシークレットから正しく設定される
5. デプロイステップが docs/09_release_checklist.md と一致

不足があれば追加してください。
```

### B7-2. リリースチェック
```
docs/09_release_checklist.md の全項目を確認してください。

各チェック項目について:
- 通過 → ✅ マーク
- 未対応 → 具体的な対応手順を提示
- 該当なし → スキップ理由を説明

特に以下は必ず確認:
- TypeScript 型エラー 0件
- 環境変数にシークレット未ハードコード
- Lighthouse 90+
- CORS / CSP 設定
```

---

## B8. 複合プロンプト（上級）

### B8-1. AI_BRIEF.md からプロジェクト全体を一気に構築
```
AI_BRIEF.md を読んでください。
このファイルにはプロジェクトの全体像が圧縮されています。

この情報を元に、以下を順番に実装してください:
1. プロジェクト初期化（package.json, tsconfig.json）
2. DB スキーマ（ER図に基づく）
3. 認証（Auth セクションに基づく）
4. 各機能の CRUD（FEATURES セクションに基づく）
5. 各画面（SCREENS セクションに基づく）

各ステップ完了後にテストを実行して、次に進んでください。
CLAUDE.md のルールに必ず従ってください。
```

### B8-2. Sprint 単位での開発
```
.spec/tasks.md を読んでください。

Sprint [番号] のタスクを全て実装してください。

各タスクについて:
1. docs/23_tasks.md の該当 Issue の Acceptance Criteria を確認
2. 関連する API 設計（docs/05_api_design.md）を参照
3. 実装
4. テスト作成・実行
5. 次のタスクへ

全タスク完了後、.spec/verification.md のチェックリストで自己検証してください。
```

### B8-3. 既存プロジェクトのドキュメント準拠チェック
```
現在のコードベースを以下のドキュメントと照合して、
乖離している箇所をリストアップしてください:

1. .spec/specification.md の受入条件 → 未実装の機能
2. docs/05_api_design.md → API レスポンス形式の不一致
3. docs/08_security.md → セキュリティ要件の未対応箇所
4. .spec/verification.md → テスト未作成の検証項目

各乖離について、修正に必要な工数（h）も見積もってください。
```

---

## Tips: プロンプトの効果を最大化するコツ

### 1. CLAUDE.md を必ず先に読ませる
```
まず CLAUDE.md を読んでください。その後で作業を開始してください。
```
→ これだけでプロジェクトルール違反が激減する

### 2. 仕様書ファイルを明示的に参照する
❌ `ユーザー認証を実装して`
✅ `.spec/specification.md の「ユーザー認証」受入条件を実装して`
→ AIが仕様書を読むので、要件漏れが減る

### 3. テストを含める
❌ `コース管理の CRUD を実装して`
✅ `コース管理の CRUD を実装して。docs/07_test_cases.md の該当テストケースも作成して`
→ テスト駆動で品質が上がる

### 4. 完了条件を明示する
❌ `Stripe 連携を実装して`
✅ `Stripe 連携を実装して。完了条件: docs/23_tasks.md の Issue #N の AC 全チェック`
→ AIが自己検証してくれる

### 5. ドキュメント間の参照を指示する
```
docs/05_api_design.md と docs/06_screen_design.md を両方参照して、
API レスポンスと画面表示の整合性を確認しながら実装してください。
```
→ フロントとバックの不整合を防げる
