# Round 27 改善案 — 外部レビュー検証結果

## 検証方法
communityプリセット（User, Post, Comment, Group, Event / Supabase / Stripe / Netlify）
で実際に生成し、全16指摘を再現検証。

---

## 検証結果: 真のバグ 7件 / 非該当 9件

### ✅ 確認済バグ（修正対象）

| # | 元P | 問題 | 根本原因 | 影響範囲 |
|---|-----|------|---------|---------|
| **B1** | P0-3 | Enterprise価格不一致（spec ¥2,980 vs tech-plan ¥9,800） | p1-sdd.js L128 vs L253 で別々にハードコード | 全Stripeプロジェクト |
| **B2** | P1-9 | API SDK の FK列サンプル値が全て `userId` | docs.js L105: `fkFields.map(c=>c.col+': userId')` | 全プロジェクト |
| **B3** | P0-4 | FK参照先エンティティ未定義（Event→FK(Venue)だがVenueテーブルなし） | ENTITY_COLUMNS内のFK定義が、ユーザー入力エンティティと不整合 | Event/Booking等FK連鎖あるエンティティ |
| **B4** | P0-1 | Constitution成功指標が `（未定義）` | L36: `a.success\|\|(G?'（未定義）':...)` — success入力項目なし | 全プロジェクト |
| **B5** | P0-6 | "No raw SQL" がマイグレーション/RLS DDLと矛盾 | p4-airules.js の Forbidden ルールが過度に広い | 全BaaSプロジェクト |
| **B6** | P1-11 | Stripe APIパス不一致（spec: `supabase/functions/...` vs tech-plan: `/api/...`） | 異なるジェネレータが別パスを出力 | 全Stripe+BaaSプロジェクト |
| **B7** | P1-12 | DevContainer ports不一致（devcontainer.json: 54321等 vs compose: 3000のみ） | p2-devcontainer.js でBaaS用ポートがcomposeに未反映 | 全Supabaseプロジェクト |

### ❌ 非該当（既修正 or 仕様通り）

| # | 元P | 指摘 | 非該当理由 |
|---|-----|------|-----------|
| P0-2 | ドメインがEC寄り | communityプリセットは User/Post/Comment/Group/Event で適切。レビュアーが見た出力はカスタム入力の問題 |
| P0-5 | RLS SELECT のみ | R25で修正済。全テーブルCRUDポリシー生成確認（18ポリシー） |
| P1-7 | 画面URL `/-----` | R25で修正済。`/`, `/dashboard`, `/[id]`, `/settings`, `/admin` 正常出力 |
| P1-8 | 詳細ページ対象不明 | R25で受入条件付き機能詳細を追加済（FEATURE_DETAILS） |
| P1-10 | ログアウトトークン無効化 | Supabase仕様上正確（refresh token revocation）。改善は可能だが非バグ |
| P2-13 | Admin role定義不足 | R25でRBAC自動生成済（role table + RLS + /admin/チェック） |
| P2-14 | SLO測定対象不明 | コンテンツ品質改善だが生成物として過剰。P2据え置き |
| P2-15 | Sprint 4モバイル矛盾 | mobile=noneの場合Sprint 4はスキップされるべき。要確認だが軽微 |
| P2-16 | CSP/Rate limit実装位置 | デプロイ先別の詳細指定は改善可能。P2据え置き |

---

## 修正計画

### FIX-1: Enterprise価格統一 (B1)
```
場所: src/generators/p1-sdd.js
修正: specification.md の ¥2,980 → ¥9,800 に統一
      （または定数 STRIPE_PRICES を common.js に定義し両方参照）
工数: 5分
```

### FIX-2: API SDK FK列のセマンティックサンプル値 (B2)
```
場所: src/generators/docs.js L105
現状: fkFields.map(c => c.col + ': userId')  // 全FK列に userId
修正: fkFields.map(c => c.col + ': ' + semanticId(c))
      semanticId: post_id → 'postId', venue_id → 'venueId', category_id → 'categoryId'
工数: 15分
```

### FIX-3: FK依存エンティティ自動検出 (B3)
```
場所: src/generators/common.js (getEntityColumns / inferER)
現状: Event定義にFK(Venue)があるが、Venueが入力エンティティに含まれなければ
      テーブル定義なしでFK参照だけが残る
修正案:
  A) FK参照先が未定義なら、そのFK列を除外（venue_idを省略）
  B) FK参照先を自動追加（Venueテーブルも生成）
  → A案が安全（ユーザーが明示しないエンティティを勝手に追加しない）
工数: 30分
```

### FIX-4: Constitution成功指標のドメイン推論 (B4)
```
場所: src/generators/p1-sdd.js L36
現状: a.success || '（未定義）'
修正: purposeキーワードからKPIを推論
  コミュニティ → MAU, 投稿率, リテンション率
  EC → GMV, 購入CVR, LTV
  SaaS → MRR, チャーン率, NPS
  LMS → コース完了率, 学習時間, 受講者数
  ダッシュボード → DAU, レポート生成数
工数: 20分
```

### FIX-5: "No raw SQL" ルール明確化 (B5)
```
場所: src/generators/p4-airules.js
現状: '- No raw SQL (use ${orm} methods)'
修正: '- No raw SQL in application code (use ${orm} methods)'
     + '- OK: DDL/RLS/migration SQL in supabase/migrations/'
工数: 5分
```

### FIX-6: Stripe APIパス統一 (B6)
```
場所: src/generators/p1-sdd.js (specification.md)
現状: 'Endpoint: supabase/functions/stripe-webhook'
修正: '/api/webhook/stripe' に統一（tech-plan側に合わせる）
      Next.js: /api/webhook/stripe (API Route)
      Supabase: supabase/functions/stripe-webhook → パス表記を /api/ 形式に
工数: 10分
```

### FIX-7: DevContainer ports整合 (B7)
```
場所: src/generators/p2-devcontainer.js
現状: devcontainer.json の forwardPorts に 54321-54323 があるが
      docker-compose.yml は 3000 のみ
修正: BaaS=Supabase なら compose にも supabase ポートを追加
      または compose で supabase サービスを別定義
工数: 15分
```

---

## 新規テスト

### T1: Stripe価格一貫性テスト
- specification.md と technical-plan.md のEnterprise価格が一致すること

### T2: API FK サンプル値テスト
- `post_id: userId` が出力に含まれないこと
- FK列のサンプル値がカラム名と意味的に一致すること

### T3: FK依存整合性テスト
- 出力されたFK参照先が全て定義済みエンティティであること
- または未定義FK参照の列が除外されていること

### T4: Constitution KPI存在テスト
- 成功指標が `（未定義）` でないこと
- purpose に応じた適切なKPIが含まれること

### T5: "No raw SQL" 例外明記テスト
- Forbidden ルールに "application code" 限定が含まれること
- マイグレーション/RLS は OK と明記されていること

### T6: API パス一貫性テスト
- Stripe Webhook パスが specification.md と technical-plan.md で一致すること

### T7: DevContainer ポート一貫性テスト
- devcontainer.json の forwardPorts と compose の ports が整合すること

---

## 優先順序（推奨実施順）

1. **B1 + B6**: 価格統一 + パス統一（即事故系、5+10分）
2. **B2**: API FKサンプル値（コピペ事故系、15分）
3. **B3**: FK依存検出（データモデル破綻系、30分）
4. **B4**: KPI推論（品質系、20分）
5. **B5**: No raw SQL明確化（ルール系、5分）
6. **B7**: DevContainer ports（環境系、15分）

合計工数見積: ~100分
