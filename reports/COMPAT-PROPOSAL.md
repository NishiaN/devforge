# DevForge v9 — 相性検証システム設計提案

## 調査日: 2026-02-09
## 調査範囲: 9入力項目 × 全選択肢の相互関係

---

## 🔍 現状分析

### 現在の状態
- **バリデーション: ゼロ** — 矛盾した組み合わせでもそのまま生成される
- Explorer（Pillar⑤）が7スタックの定量スコアリングは行うが、ユーザー回答の整合性チェックはない
- 26プリセットは「正解の組み合わせ」を内蔵しているが、自由入力時に参照されない

### 問題の具体例（現状で起こりうる矛盾）
| ユーザー選択 | 問題 | 深刻度 |
|-------------|------|--------|
| Frontend: `React + Next.js` + Backend: `Firebase` + DB: `MongoDB` | FirebaseはFirestore専用。MongoDBとの併用は不自然 | 🔴 高 |
| Mobile: `Expo (RN)` + Frontend: `Vue 3 + Nuxt` | ExpoはReact Native専用。Vueとは互換性ゼロ | 🔴 高 |
| Backend: `Python + FastAPI` + ORM: `Prisma` | PrismaはNode.js専用。Pythonでは動かない | 🔴 高 |
| Deploy: `Vercel` + Backend: `Java + Spring Boot` | VercelはNode.js/Python前提。JVMはサポート外 | 🟡 中 |
| AI Auto: `フル自律開発` + Skill: `Beginner` | 初心者がフル自律はリスク大 | 🟡 中 |
| Backend: `なし（静的サイト）` + Payment: `Stripe決済` | サーバーレスでStripeのwebhookは要工夫 | 🟡 中 |
| Deploy: `Firebase Hosting` + DB: `PostgreSQL` | Firebase HostingならFirestoreが自然 | 🔵 低 |
| Frontend: `Astro` + Mobile: `Expo (RN)` | 静的サイトフレームワークとモバイルの組み合わせは不自然 | 🟡 中 |

---

## 📐 相性マトリクス（9軸 × 36交差点）

### 交差点マップ（チェックすべきペア一覧）

```
              FE   BE   DB   ORM  Deploy Mobile AI_Auto Payment Skill
Frontend  ─    ─   ✅   ─    ─    ✅    ✅     ─       ─       ─
Backend   ─    ─    ─   ✅   ✅   ✅    ─      ─       ✅      ─
Database  ─    ─    ─    ─   ─    ─     ─      ─       ─       ─
ORM       ─    ─    ─    ─   ─    ─     ─      ─       ─       ─
Deploy    ─    ─    ─    ─    ─   ─     ─      ─       ─       ─
Mobile    ─    ─    ─    ─    ─    ─    ─      ─       ─       ─
AI_Auto   ─    ─    ─    ─    ─    ─     ─     ─       ✅      ─
Payment   ─    ─    ─    ─    ─    ─     ─      ─      ─       ─
Skill     ─    ─    ─    ─    ─    ─     ─      ─       ─      ─
```

### 実用的に意味のある交差点: 8ペア

| # | ペア | ルール数 | 主なチェック内容 |
|---|------|---------|----------------|
| 1 | **FE ↔ Mobile** | 4 | Expo→React必須、Flutter→FE自由、Vue+Expo=NG |
| 2 | **BE ↔ DB** | 6 | Firebase→Firestore、Supabase→PostgreSQL、静的→DB不要 |
| 3 | **BE ↔ ORM** | 5 | Python→SQLAlchemy推奨、Node.js→Prisma/Drizzle、BaaS→ORM不要 |
| 4 | **BE ↔ Deploy** | 7 | Vercel→Node.js/Python、Firebase Hosting→Firebase、Java→AWS/Docker |
| 5 | **FE ↔ Deploy** | 4 | Next.js→Vercel最適、Astro→Netlify推奨、Angular→AWS/自前 |
| 6 | **AI Auto ↔ Skill** | 3 | Beginner+Full Autonomous=NG、Orchestrator→Pro必須 |
| 7 | **BE ↔ Payment** | 3 | 静的+Stripe webhook=注意、Saleor→Python必須 |
| 8 | **FE ↔ BE** | 3 | Next.js+None=静的Export必要（注意喚起）、React SPA+NestJS=一般的 |

**合計: 35ルール**

---

## 📋 全35ルール詳細

### 1. Frontend ↔ Mobile（4ルール）

| # | 条件 | レベル | メッセージ（JA） | メッセージ（EN） |
|---|------|-------|----------------|----------------|
| 1-1 | Mobile=`Expo` && FE≠React系 | 🔴 ERROR | ExpoはReact Native専用です。フロントをReact系に変更してください | Expo requires React. Change frontend to React |
| 1-2 | Mobile=`Flutter` && FE=React系 | ℹ️ INFO | FlutterはReactとコード共有できません。UIは別途Dart実装になります | Flutter doesn't share code with React. UI requires separate Dart implementation |
| 1-3 | Mobile=`Swift/Kotlin` && FE=any | ℹ️ INFO | ネイティブ開発はWeb FEと完全独立。開発工数が2倍以上になります | Native dev is fully separate from Web FE. Expect 2x+ development effort |
| 1-4 | Mobile=`Expo` && FE=`Astro` | 🔴 ERROR | AstroはSSG専用。Expo併用にはReact + Next.jsが推奨です | Astro is SSG-only. Use React + Next.js for Expo integration |

### 2. Backend ↔ Database（6ルール）

| # | 条件 | レベル | メッセージ |
|---|------|-------|----------|
| 2-1 | BE=`Firebase` && DB≠`Firestore` | 🟡 WARN | Firebase利用時はFirestoreが最適です |
| 2-2 | BE=`Supabase` && DB≠`Supabase/PostgreSQL` | 🟡 WARN | Supabase利用時はSupabase (PostgreSQL)が統合されています |
| 2-3 | BE=`None(静的)` && DB≠null | 🟡 WARN | 静的サイトではDBは通常不要です |
| 2-4 | BE=`Python系` && DB=`Firestore` | 🟡 WARN | PythonとFirestoreの相性は中程度。PostgreSQLが推奨です |
| 2-5 | BE=`Go + Gin` && DB=`Firestore` | 🟡 WARN | GoとFirestoreはSDK成熟度が低いです |
| 2-6 | BE=`Java + Spring Boot` && DB=`MongoDB` | ℹ️ INFO | Spring Data MongoDBで利用可能ですが、JPAの方が一般的です |

### 3. Backend ↔ ORM（5ルール）

| # | 条件 | レベル | メッセージ |
|---|------|-------|----------|
| 3-1 | BE=`Python系` && ORM=`Prisma/Drizzle/TypeORM` | 🔴 ERROR | PrismaはNode.js専用です。SQLAlchemyを選択してください |
| 3-2 | BE=`Java/Go` && ORM=`Prisma` | 🔴 ERROR | PrismaはNode.js/TypeScript専用です |
| 3-3 | BE=`Firebase/Supabase` && ORM≠`None/BaaS` | 🟡 WARN | BaaS利用時はORM不要です。「なし / BaaS使用」を推奨 |
| 3-4 | BE=`Node.js系` && ORM=`SQLAlchemy` | 🔴 ERROR | SQLAlchemyはPython専用です。Prisma/Drizzleを選択してください |
| 3-5 | BE=`NestJS` && ORM=`Drizzle` | ℹ️ INFO | NestJSにはTypeORMが公式統合されています |

### 4. Backend ↔ Deploy（7ルール）

| # | 条件 | レベル | メッセージ |
|---|------|-------|----------|
| 4-1 | BE=`Java/Go` && Deploy=`Vercel` | 🔴 ERROR | VercelはNode.js/Python前提です。Railway/AWS/Dockerが必要です |
| 4-2 | BE=`Firebase` && Deploy≠`Firebase Hosting` | 🟡 WARN | Firebase利用時はFirebase Hostingが最適です |
| 4-3 | BE=`Supabase` && Deploy=`Firebase Hosting` | 🟡 WARN | SupabaseにはVercelまたはSupabase Hostingが推奨です |
| 4-4 | BE=`NestJS` && Deploy=`Vercel` | 🟡 WARN | NestJSのサーバーレスデプロイは制限があります。Railwayが推奨 |
| 4-5 | BE=`None(静的)` && Deploy=`Railway` | ℹ️ INFO | 静的サイトにRailwayはオーバースペック。Vercel/Netlifyが最適 |
| 4-6 | BE=`Python + Django` && Deploy=`Vercel` | 🟡 WARN | DjangoのVercelデプロイは制限あり。Railway/Fly.ioが推奨 |
| 4-7 | BE=`Hono` && Deploy≠`Cloudflare` | ℹ️ INFO | HonoはCloudflare Workers向けに最適化されています |

### 5. Frontend ↔ Deploy（4ルール）

| # | 条件 | レベル | メッセージ |
|---|------|-------|----------|
| 5-1 | FE=`Next.js系` && Deploy=`Netlify` | ℹ️ INFO | Next.jsはVercelが最適。Netlifyでも動作しますがSSR/ISRに制限あり |
| 5-2 | FE=`Astro` && Deploy=`Vercel` | ℹ️ INFO | AstroはNetlify/Cloudflare Pagesで最速。Vercelでも動作します |
| 5-3 | FE=`Angular` && Deploy=`Vercel` | 🟡 WARN | AngularのVercel対応は限定的。Firebase HostingまたはAWSが推奨 |
| 5-4 | FE=`Nuxt` && Deploy=`Firebase Hosting` | ℹ️ INFO | Nuxt 3はVercel/Netlifyが最適デプロイ先です |

### 6. AI Auto ↔ Skill Level（3ルール）

| # | 条件 | レベル | メッセージ |
|---|------|-------|----------|
| 6-1 | AI=`Full Autonomous` && Skill=`Beginner` | 🔴 ERROR | フル自律開発には上級レベルが必要です |
| 6-2 | AI=`Orchestrator` && Skill≠`Pro` | 🟡 WARN | オーケストレーターはCI/CD統合の経験が必要です |
| 6-3 | AI=`Multi-Agent` && Skill=`Beginner` | 🟡 WARN | マルチAgent協調は中級以上の経験が推奨です |

### 7. Backend ↔ Payment（3ルール）

| # | 条件 | レベル | メッセージ |
|---|------|-------|----------|
| 7-1 | BE=`None(静的)` && Payment含む`Stripe` | 🟡 WARN | Stripe webhookにはサーバーが必要。Supabase Edge Functionsで対応可能 |
| 7-2 | Payment含む`Saleor` && BE≠`Python系` | 🟡 WARN | SaleorはPython/Django製です。Python系バックエンドが必要です |
| 7-3 | Payment含む`Shopify Hydrogen` && FE≠`React系` | 🟡 WARN | Shopify HydrogenはReact(Remix)ベースです |

### 8. Frontend ↔ Backend（3ルール）

| # | 条件 | レベル | メッセージ |
|---|------|-------|----------|
| 8-1 | FE=`Next.js` && BE=`None(静的)` | ℹ️ INFO | Next.jsを静的エクスポートで使用する場合、API Routeは利用不可です |
| 8-2 | FE=`Astro` && BE=`NestJS` | ℹ️ INFO | AstroのSSG + NestJS APIは分離デプロイが必要です |
| 8-3 | FE=`React (Vite SPA)` && BE=`Firebase` | ℹ️ INFO | CSR + BaaSは相性良好。SPAに最適な構成です |

---

## 🎨 表示デザイン提案

### 表示タイミング: 2箇所

#### A. リアルタイム表示（回答時）
各質問の回答確定後、既回答との相性をチェックし即座にフィードバック。
回答エリアの下に通知バーとして表示。

```
┌──────────────────────────────────────┐
│ Q: デプロイ先                         │
│ [Vercel] ← 選択                      │
│                                      │
│ ⚠️ NestJSのサーバーレスデプロイは     │
│    制限があります。Railway推奨        │
│                  [変更する] [続行]    │
└──────────────────────────────────────┘
```

#### B. サマリー表示（ダッシュボード / プレビュー画面）
全回答の相性を一括チェックし、ダッシュボードに「相性レポート」セクション追加。

```
┌──────────────────────────────────────┐
│ 🔍 スタック相性チェック               │
│ ┌──────────────────────────────────┐ │
│ │ ✅ 問題なし: 6 / 8 ペア          │ │
│ │ ⚠️  注意:  1                     │ │
│ │ ❌ 要修正:  1                     │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ❌ Backend ↔ ORM                     │
│    Python + FastAPI に Prisma は     │
│    使えません → SQLAlchemy推奨       │
│                         [修正する]   │
│                                      │
│ ⚠️ Backend ↔ Deploy                  │
│    NestJS + Vercel は制限あり        │
│    → Railway推奨                     │
│                         [修正する]   │
│                                      │
│ ✅ FE↔Mobile ✅ BE↔DB ✅ FE↔Deploy  │
│ ✅ AI↔Skill ✅ BE↔Pay ✅ FE↔BE      │
└──────────────────────────────────────┘
```

---

## 🏗 実装設計

### データ構造

```javascript
// compatibility-rules.js (新規モジュール)
const COMPAT_RULES = [
  // レベル: 'error' | 'warn' | 'info'
  {
    id: 'fe-mobile-expo',
    pair: ['frontend', 'mobile'],
    test: (a) => a.mobile?.includes('Expo') && !a.frontend?.includes('React'),
    level: 'error',
    ja: 'ExpoはReact Native専用です。フロントをReact系に変更してください',
    en: 'Expo requires React. Change frontend to React',
    fix: { field: 'frontend', suggest: 'React + Next.js' }
  },
  // ... 35 rules
];

function checkCompat(answers) {
  return COMPAT_RULES
    .filter(r => r.test(answers))
    .map(r => ({
      id: r.id,
      pair: r.pair,
      level: r.level,
      msg: S.lang === 'ja' ? r.ja : r.en,
      fix: r.fix
    }));
}
```

### フック箇所

1. **wizard.js `saveAnswer()`** — 回答保存後に `checkCompat()` を呼び出し
2. **dashboard.js `showDashboard()`** — ダッシュボードにサマリーセクション追加
3. **generators/index.js `doGenerate()`** — 生成前に ERROR レベルがあれば警告

### ファイル影響

| ファイル | 変更内容 | 行数見積 |
|---------|---------|---------|
| **新規** `data/compat-rules.js` | 35ルール定義 + checkCompat関数 | ~120行 |
| `ui/wizard.js` | saveAnswer後にリアルタイムチェック追加 | ~15行 |
| `ui/dashboard.js` | 相性レポートセクション追加 | ~30行 |
| `generators/index.js` | 生成前ゲート（ERRORブロック） | ~10行 |
| `styles/all.css` | 通知バー・レポートカードCSS | ~25行 |
| `build.js` | 新モジュール追加 | 1行 |
| `test/build.test.js` | compat関数テスト | ~10行 |
| **合計** | | **~210行** |

### ビルドサイズ影響
- compat-rules.js: ~120行 → minify後 ~3KB
- CSS追加: ~25行 → ~0.5KB
- **合計: +3.5KB（288KB → 291KB）**

---

## ⚖️ メリット・デメリット

### メリット
1. **初心者保護**: Beginner が致命的な組み合わせを選んでも事前に警告
2. **プロ向け情報**: INFO レベルで「ベストプラクティスとの差異」を通知
3. **教育的価値**: なぜその組み合わせが問題かの説明を含む
4. **生成品質向上**: 矛盾した入力で生成される無意味なファイルを防止
5. **World-First 強化**: 相性検証付きスタックジェネレーターは前例なし

### デメリット・リスク
1. **偽陽性**: 上級者が意図的に選んだ非標準構成を「エラー」扱いする可能性
   → 対策: ERROR は本当に動かない組み合わせ（5件）のみ。WARN/INFO は無視可能
2. **メンテナンスコスト**: 技術進化でルールが古くなる
   → 対策: ルールをデータ駆動で分離。更新は data/ 内のみ
3. **ビルドサイズ増**: +3.5KB
   → 許容範囲（全体の1.2%増）

---

## 📊 優先度分類

### Phase 1（必須・高インパクト）— 5ルール
ERROR レベルのみ。動作しない組み合わせをブロック。
- 1-1: Expo + 非React → ERROR
- 1-4: Astro + Expo → ERROR
- 3-1: Python BE + Prisma → ERROR
- 3-2: Java/Go BE + Prisma → ERROR
- 3-4: Node.js BE + SQLAlchemy → ERROR

### Phase 2（推奨・中インパクト）— 15ルール
WARN レベル。動くが非推奨な組み合わせ。
- BE↔DB: 6ルール（Firebase/Firestore不一致等）
- BE↔Deploy: 6ルール（Vercel+Java等）
- AI↔Skill: 3ルール（初心者+自律等）

### Phase 3（情報・低インパクト）— 15ルール
INFO レベル。知っておくと有益な情報。
- FE↔Deploy: 4ルール
- FE↔BE: 3ルール
- 各種 INFO 通知

---

## ✅ 実装推奨

**Phase 1+2 を一括実装**（20ルール）を推奨。理由:
1. ERROR だけでは価値が限定的（5件しかない）
2. WARN が最も教育的価値が高い
3. 20ルールでも ~80行のデータで済む
4. INFO は Phase 3 として後日追加可能

### 実行計画
1. `data/compat-rules.js` に20ルール定義
2. `ui/dashboard.js` にサマリーレポート追加
3. `ui/wizard.js` にリアルタイム通知追加
4. `generators/index.js` に生成前ゲート追加
5. CSS追加 + ビルド登録 + テスト
