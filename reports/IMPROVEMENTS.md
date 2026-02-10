# DevForge v9 改善提案書

> 作成日: 2026-02-09  
> 対象: DevForge v9.0 (Round 24完了時点)  
> 現状: 247テスト / 410KB / 60ファイル生成 / 10ドメイン対応

---

## 現状サマリ

| 指標 | 値 | 評価 |
|------|-----|------|
| ソースコード | 2,513行 / 15モジュール | 良好（管理可能） |
| 生成ファイル | 60ファイル / ~32KB / ~9,400トークン | 良好 |
| テスト | 247件（7スイート） | 良好 |
| compat-rules | 32ルール | 良好 |
| 生成後監査 | 10チェック (C1-C10) | 良好 |
| ドメイン認識 | 10種 | 良好 |
| FE認識 | Vite SPA / Next.js / 汎用React | **CAP-002で対応済** |
| BE認識 | BaaS(Supabase/Firebase) / BFF / Split / Traditional | **CAP-001で対応済** |
| プリセット | 4種（SaaS/EC/Community/Portfolio） | 拡張余地あり |

### 解決済みの技術的負債
- CAP-001: 生成文書間の意味的整合（P0×5件 全解決）
- CAP-002: FE/Deploy/BaaS文脈認識（15指摘 全解決）

---

## 改善案一覧

### Tier A: 生成品質向上（ユーザー体験に直結）

#### A1. 決済機能設計の自動生成 [P1-8 残件]
**問題**: payment=Stripe 選択時、「Stripeが技術スタックに載る」だけで設計が空。
**改善**: payment選択時に以下を自動生成:

| 生成先 | 追加内容 |
|--------|----------|
| .spec/specification.md | プラン表(Free/Pro/Enterprise)、課金周期、無料期間 |
| .spec/technical-plan.md | Webhook設計(invoice.paid等)、stripe_customer_id/subscription_id列 |
| docs/05_api_design.md | /api/webhook/stripe エンドポイント or Supabase Edge Function |
| .spec/tasks.md | Sprint 1にStripe統合タスク追加 |
| .env.example | STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET |
| package.json | stripe ^17 依存追加 |

**工数**: 中（1セッション） **影響**: docs.js + common.js + p1-sdd.js + p2-devcontainer.js

---

#### A2. 管理者ロール/RBAC設計 [P1-9 残件]
**問題**: target に「管理者」が含まれても、権限設計が生成されない。
**改善**: target検出 → 以下を自動注入:

- technical-plan.md: `profiles` テーブルに `role` 列 + RLS例
- specification.md: ロール定義表（user/admin/super_admin）
- docs/08_security.md: RBAC方針セクション
- ER図: profiles テーブル自動追加

**工数**: 小

---

#### A3. CI/CD テンプレートファイル生成 [P2-15 残件]
**問題**: 方針はあるが `.github/workflows/ci.yml` が生成されない。
**改善**: deploy先別のGitHub Actionsワークフローを生成:

- Vercel: `vercel-deploy.yml`（preview + production）
- Netlify: `netlify-deploy.yml`
- Railway: `docker-build.yml`
- 共通: `ci.yml`（lint → test → build）

**工数**: 中

---

#### A4. リリースチェックリストのデプロイ先拡充
**問題**: dChecks に Vercel/AWS/Railway しかない。Netlify/Fly.io/Cloudflare 未対応。
**改善**: Netlify/Fly.io/Cloudflare Pages/GCP/Azure の deploy チェックリスト追加。

**工数**: 極小

---

### Tier B: 構造改善（保守性・拡張性）

#### B1. docs.js の分割
**問題**: docs.js が190行で23ドキュメントを1関数で生成。テンプレート追加が困難。
**改善**: 
```
docs.js → docs/index.js (エントリ)
         docs/api-design.js
         docs/er-diagram.js
         docs/screen-design.js
         docs/playbook.js
         docs/checklist.js
```
各ファイルが `(a, pn, ctx) => content` の純粋関数に。ctx に arch/auth/orm/domain 等を渡す。

**工数**: 中 **リスク**: 低（リファクタリングのみ）

---

#### B2. テンプレートのデータ駆動化
**問題**: HTML文字列が .js ファイル内にインラインで埋め込まれており、非エンジニアが編集しづらい。
**改善**: テンプレートを Markdown + mustache 風プレースホルダで外部ファイル化:
```
/templates/
  constitution.md.tmpl
  specification.md.tmpl
  technical-plan.md.tmpl
  ...
```
ジェネレータは `ctx` オブジェクトを構築し、テンプレートエンジンで置換するのみに。

**工数**: 大 **メリット**: テンプレート編集が容易に、カスタムテンプレート対応の基盤

---

#### B3. 生成後監査のルール外部化
**問題**: postGenerationAudit の C1-C10 が common.js にハードコード。追加時にコード修正必要。
**改善**: 監査ルールを compat-rules.js と同様の宣言型配列に:
```javascript
const AUDIT_RULES = [
  { id:'c-auth-sot', files:['.spec/constitution.md','.spec/specification.md'], check:(files,a)=>... },
  { id:'c-env-prefix', files:['.env.example'], check:(files,a)=>... },
];
```

**工数**: 小

---

### Tier C: 機能拡張（新ケイパビリティ）

#### C1. プリセットの拡充（教育/医療/SaaS Admin/IoT）
**現状**: 4プリセット（SaaS/EC/Community/Portfolio）
**改善**: 需要の高いプリセット追加:

| プリセット | ドメイン | エンティティ例 |
|-----------|----------|--------------|
| 教育LMS | education | User, Course, Lesson, Progress, Certificate, Quiz |
| 医療/予約 | booking | User, Patient, Doctor, Appointment, MedicalRecord |
| SaaS Admin | saas | User, Workspace, Member, Plan, Invoice, AuditLog |
| IoT Dashboard | analytics | User, Device, Sensor, Reading, Alert, Dashboard |
| マーケットプレイス | marketplace | User, Listing, Bid, Transaction, Review, Message |

**工数**: 小（presets.js に追加のみ）

---

#### C2. 差分再生成（部分更新）
**問題**: 回答を1つ変えると全60ファイル再生成。
**改善**: 変更された回答キーに依存するファイルのみ再生成:
```javascript
const DEPENDENCY_MAP = {
  frontend: ['.env.example', '.gitignore', 'docs/19_performance.md', ...],
  backend: ['.spec/*', '.devcontainer/*', 'docs/05_api_design.md', ...],
  auth: ['.spec/constitution.md', '.spec/technical-plan.md', ...],
};
```

**工数**: 中 **メリット**: UX向上（即時プレビュー）

---

#### C3. カスタムテンプレート対応
**問題**: 企業ごとにドキュメントフォーマットが異なる（社内テンプレートに合わせたい）。
**改善**: JSONインポートで独自テンプレートを追加:
```json
{
  "templates": {
    ".spec/constitution.md": "# {{projectName}}\n## 当社フォーマット\n..."
  }
}
```
既存テンプレートをオーバーライド可能に。

**工数**: 大

---

#### C4. AI連携出力の最適化
**問題**: 「AIにこのまま渡して使える」のが売りだが、60ファイル/9,400トークンの全量コピーは非効率。
**改善**:
- **コンテキスト圧縮モード**: 必須5文書(.spec/)のみのコンパクトMarkdown出力
- **フェーズ別出力**: Sprint 0用/Sprint 1用など、今必要な情報だけ抽出
- **AI Provider別最適化**: Claude用（XML構造）、ChatGPT用（プレーン）、Cursor用（.cursorrules重点）

**工数**: 中

---

#### C5. スタック変更シミュレーション
**問題**: 「SupabaseをFirebaseに変えたらどうなる？」を確認する手段がない。
**改善**: diff表示モード — 回答を仮変更し、現在の生成結果との差分をハイライト表示。

**工数**: 大

---

### Tier D: 品質保証強化

#### D1. E2Eスナップショットテスト
**問題**: 現テストは「この文字列を含む/含まない」の点検のみ。テンプレートの微修正で予期しない副作用が起きうる。
**改善**: 主要プリセット×主要スタック組み合わせ（~8パターン）の生成結果をスナップショット保存し、差分を検出:
```
test/snapshots/
  saas-next-supabase-vercel.json
  ec-vite-express-railway.json
  edu-next-firebase-netlify.json
  ...
```

**工数**: 中 **メリット**: リグレッション防止

---

#### D2. 外部AIレビュー自動化
**問題**: 外部AIにレビューを依頼するのが手動。
**改善**: 生成結果を自己レビューするプロンプトテンプレートを同梱:
```markdown
## DevForge Self-Review Prompt
以下の仕様書群を「テックリード兼SDDアーキテクト」視点でレビューしてください。
特に以下の観点で矛盾・不足・改善点を指摘してください:
1. スコープ定義 vs 機能仕様の整合
2. フロントエンド選定 vs 各種設定ファイルの整合
...
```

**工数**: 極小

---

#### D3. compat-rulesのカバレッジ可視化
**問題**: 32ルールがどの入力組み合わせをカバーしているか不明。
**改善**: ルールマトリクス表示 — 全質問キーのペアに対してルール有無を可視化。「ここにルールがない」が一目でわかるUI。

**工数**: 小

---

## 推奨実装順序

| 優先度 | 項目 | 工数 | 理由 |
|--------|------|------|------|
| 🔴 1 | A1 決済設計 | 中 | 外部レビューP1残件。Stripe使用率高い |
| 🔴 2 | A2 RBAC設計 | 小 | 外部レビューP1残件。管理画面は頻出 |
| 🟡 3 | C1 プリセット拡充 | 小 | 新規ユーザーの初期体験向上 |
| 🟡 4 | A3 CI/CDテンプレート | 中 | 生成物の実用性向上 |
| 🟡 5 | A4 デプロイチェック拡充 | 極小 | 即完了可能 |
| 🟢 6 | D2 自己レビュー同梱 | 極小 | 品質保証の仕組み化 |
| 🟢 7 | B3 監査ルール外部化 | 小 | 保守性向上 |
| 🟢 8 | D1 スナップショットテスト | 中 | リグレッション防止 |
| 🔵 9 | B1 docs.js分割 | 中 | 次の大規模拡張の前提 |
| 🔵 10 | C4 AI連携最適化 | 中 | 差別化要素 |
| ⚪ 11 | C2 差分再生成 | 中 | UX改善 |
| ⚪ 12 | B2 テンプレート外部化 | 大 | 長期的保守性 |
| ⚪ 13 | C3 カスタムテンプレート | 大 | エンタープライズ対応 |
| ⚪ 14 | C5 スタック変更diff | 大 | パワーユーザー機能 |

---

## 投資対効果マトリクス

```
        高い効果
          │
    A1 ●  │  ● C4
    A2 ●  │
    C1 ●  │  ● B1
    A4 ●  │  ● D1
    D2 ●  │
──────────┼──────────
    A3 ●  │  ● C2
    B3 ●  │  ● B2
          │  ● C3
          │  ● C5
          │
        低い効果
   小さい工数    大きい工数
```

左上象限（高効果・小工数）の A1/A2/C1/A4/D2 を最優先で実施すれば、
最小の労力で外部レビュー指摘の完全解消 + ユーザー体験向上が実現できます。
