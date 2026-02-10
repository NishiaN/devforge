# DevForge v9 — Round 28 Report
## 出力品質改善: 4件

### 改善一覧

| # | 改善 | Before | After |
|---|------|--------|-------|
| **G1** | REST APIメソッド制御 | 全エンティティ盲目5メソッドCRUD | エンティティ別メソッド制限 |
| **G2** | tasks.md AC連動 | 全Issue同一3行AC | FEATURE_DETAILSからドメイン固有AC |
| **G3** | scope_out推論 | 未入力→「（未定義）」 | 8ドメイン別デフォルト生成 |
| **G4** | verification.md拡充 | 共通4行セキュリティチェックのみ | §5 機能別検証チェックリスト追加 |

---

### G1: REST APIメソッド制御 (ENTITY_METHODS)

18エンティティに個別制限を定義:

| カテゴリ | エンティティ | 許可メソッド | 理由 |
|---------|------------|------------|------|
| 不変記録 | Payment, Transaction, Invoice, Certificate | GET, GET/:id, POST | 作成後変更・削除不可 |
| 監査ログ | Log, Activity, Execution, Handoff | GET, GET/:id | 参照のみ |
| ユーザー | User | GET, GET/:id, POST, PATCH | PATCH推奨(部分更新) |
| カート | Cart | GET, POST, PATCH, DELETE | GET/:idは不要(認証コンテキスト) |
| サブスク | Enrollment, Subscription | GET, GET/:id, POST, PATCH | キャンセル=PATCH(soft) |
| デフォルト | Product, Order, etc. | GET, GET/:id, POST, PUT, DELETE | フルCRUD |

**EC検証結果**:
```
user    : PUT=false PATCH=true  DELETE=false  ← 安全
product : PUT=true  PATCH=false DELETE=true   ← フルCRUD
payment : PUT=false PATCH=false DELETE=false  ← 不変
cart    : PUT=false PATCH=true  DELETE=true   ← カート操作
```

### G2: docs/23_tasks.md AC連動

**Before (全Issue共通)**:
```
- [ ] 実装完了
- [ ] テスト通過
- [ ] コードレビュー完了
```

**After (ユーザー認証Issue例)**:
```
- [ ] メール+パスワードでの新規登録・ログイン
- [ ] ソーシャルログイン({auth}プロバイダ)
- [ ] パスワードリセットフロー(メール送信→再設定)
- [ ] セッション管理・自動トークンリフレッシュ
```

FEATURE_DETAILSに一致しないfeature(setup/infra/test/release)は従来のgeneric ACを維持。

### G3: scope_out ドメイン推論 (8ドメイン)

| ドメイン | 推論スコープ外 |
|---------|-------------|
| education | ネイティブアプリ, 動画配信インフラ, 決済以外の金融機能 |
| ec | ネイティブアプリ, 実店舗POS連携, 会計ソフト連携, 物流管理 |
| community | ネイティブアプリ, 動画配信, リアルタイムビデオ通話, メール配信 |
| saas | ネイティブアプリ, オンプレミスデプロイ, ホワイトラベル対応 |
| content | ネイティブアプリ, 動画配信, コメント通知メール |
| analytics | ネイティブアプリ, ETLパイプライン構築, データウェアハウス |
| booking | ネイティブアプリ, 決済代行, カレンダー同期(外部API) |
| marketplace | ネイティブアプリ, 物流管理, エスクロー決済 |

ユーザー明示入力がある場合はそちらを優先。

### G4: verification.md §5 機能別検証チェックリスト

**Before**: セキュリティ4行のみ (~4チェック)
**After**: 各feature × FEATURE_DETAILS criteria (~15+チェック)

例(LMS):
```
## 5. 機能別検証チェックリスト

### ユーザー認証
- [ ] メール+パスワードでの新規登録・ログイン
- [ ] ソーシャルログイン(Supabase Authプロバイダ)
- [ ] パスワードリセットフロー
- [ ] セッション管理・自動トークンリフレッシュ

### コース管理
- [ ] コース作成(タイトル/説明/サムネイル/価格)
- [ ] 検索/フィルタ/ページネーション
- [ ] 下書き↔公開のステータス管理
- [ ] カテゴリ/タグによる分類
```

---

### メトリクス

| 指標 | R27 | R28 | 変化 |
|------|-----|-----|------|
| ビルド | 481KB | **484KB** | +3KB |
| テスト (npm test) | 108 | **127** | +19 |
| 内部アサーション | 248 | **248** | ±0 |
| ENTITY_METHODS | — | **18** | ✅ NEW |
| scope_outドメイン | — | **8** | ✅ NEW |

### 修正ファイル
- `src/generators/common.js`: G1(ENTITY_METHODS定義 + getEntityMethods関数)
- `src/generators/docs.js`: G1(REST APIメソッド制御), G2(tasks AC連動)
- `src/generators/p1-sdd.js`: G3(scope_out推論), G4(verification §5)
- `test/r28-regression.test.js`: 4グループ × 19テスト

### テスト構成 (127テスト)
- gen-coherence: 248アサーション (1テスト)
- snapshot: 28テスト (4シナリオ)
- r27-regression: 17テスト (7バグ修正)
- r28-regression: 19テスト (4品質改善)
- build + others: 62テスト
