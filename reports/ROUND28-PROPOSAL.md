# Round 28 改善案

## 検証方法
LMS(Supabase/Stripe), EC(Express/Railway), Blog(Vite/Netlify) の3シナリオで
全62ファイルを生成し、出力品質を精査。

---

## 検出した改善点: 4件

### G1: REST API が全エンティティに盲目的5メソッドCRUD (P0)

**現状**: 非BaaS(Express等)の REST API は全エンティティに同一 GET/GET:id/POST/PUT/DELETE を生成。

```
user    : GET=2 POST=1 PUT=1 DELETE=1
product : GET=2 POST=1 PUT=1 DELETE=1   ← OK
payment : GET=2 POST=1 PUT=1 DELETE=1   ← DELETE Payment? PUT Payment?
cart    : GET=2 POST=1 PUT=1 DELETE=1   ← GET /cart/:id は不自然
```

**問題**:
- `DELETE /api/v1/payment` — 決済記録を削除するAPIは危険
- `PUT /api/v1/user` — ユーザー更新は PATCH が一般的
- 全エンティティが同じ5メソッドで、ドメイン意味論がゼロ

**修正案**: エンティティ別の許可メソッドマップを定義

```js
const ENTITY_METHODS = {
  // 読取専用系: 決済/ログ/監査
  Payment:  ['GET','GET/:id','POST'],         // 作成のみ、変更・削除不可
  Invoice:  ['GET','GET/:id'],                // 参照のみ
  Log:      ['GET','GET/:id'],
  // ユーザー系: PATCH推奨
  User:     ['GET','GET/:id','POST','PATCH'], // PUTではなくPATCH
  // カート系: ユーザー紐づき
  Cart:     ['GET','POST','PATCH','DELETE'],  // GET=自分のカート、:idは不要
  // 標準CRUD
  _default: ['GET','GET/:id','POST','PUT','DELETE'],
};
```

工数: 30分

---

### G2: docs/23_tasks.md の受入条件が全Issue同一 (P1)

**現状**: 全Issue が以下の3行で統一。ドメイン固有性ゼロ。

```
- [ ] 実装完了
- [ ] テスト通過
- [ ] コードレビュー完了
```

**問題**: AI にこのファイルを渡しても「何をもって完了か」が不明。
specification.md の受入条件（FEATURE_DETAILS から生成済み）と連動していない。

**修正案**: docs/23_tasks.md の各Issue AC を FEATURE_DETAILS の criteria から引用。

```
## Issue #3: 商品管理の実装
- **Acceptance Criteria**:
  - [ ] 商品作成(タイトル/説明/画像/価格/SKU)
  - [ ] 商品一覧(検索/フィルタ/ページネーション)
  - [ ] 下書き↔公開のステータス管理
  - [ ] 在庫0で自動非公開
```

工数: 20分

---

### G3: scope_out が空の時「（未定義）」と表示 (P1)

**現状**: ユーザーが scope_out を入力しなかった場合:

```
## 7. スコープ外
（未定義）
```

**問題**: 「（未定義）」はドキュメントとして不完全。
scope_out は任意項目なので、未入力なら省略するかドメイン推論すべき。

**修正案**: 未入力時はドメイン推論でデフォルトスコープ外を生成。

```js
const DEFAULT_SCOPE_OUT = {
  education: 'ネイティブアプリ, 動画配信インフラ, 決済以外の金融機能',
  ec:        'ネイティブアプリ, 実店舗POS連携, 会計ソフト連携',
  community: 'ネイティブアプリ, 動画配信, リアルタイムビデオ通話',
  saas:      'ネイティブアプリ, オンプレミスデプロイ, ホワイトラベル',
  _default:  'ネイティブアプリ, モバイルアプリ',
};
```

工数: 10分

---

### G4: verification.md がスケルトンのまま (P2)

**現状**: 4項目のセキュリティチェック + テスト戦略表のみ (~150トークン)。

```
## 4. セキュリティチェック
- [ ] OWASP Top 10対策確認
- [ ] 依存パッケージ脆弱性スキャン
- [ ] 認証・認可テスト
- [ ] データバリデーション確認
```

**問題**: 機能別の検証項目がゼロ。LMS でもEC でも同じ4行。

**修正案**: specification.md の受入条件から検証チェックリストを自動生成。

```
## 5. 機能別検証チェックリスト

### ユーザー認証
- [ ] メール+パスワードでの新規登録 → 302リダイレクト
- [ ] ソーシャルログイン(Google OAuth) → トークン発行
- [ ] パスワードリセットメール送信 → メール到達確認
- [ ] セッション管理・自動トークンリフレッシュ

### コース管理
- [ ] コース作成(タイトル/説明/サムネイル/価格) → 201
- [ ] 検索/フィルタ/ページネーション → 正確な件数
...
```

工数: 25分

---

## 優先順序

| # | 改善 | 深刻度 | 工数 | 効果 |
|---|------|--------|------|------|
| **G1** | REST API メソッド制御 | P0 | 30分 | DELETE Payment 等の危険API除去 |
| **G2** | tasks.md AC連動 | P1 | 20分 | AI Coding時のIssue品質向上 |
| **G3** | scope_out 推論 | P1 | 10分 | ドキュメント完全性 |
| **G4** | verification.md 拡充 | P2 | 25分 | テスト計画の実用性 |

合計工数見積: ~85分
