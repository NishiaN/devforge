# DevForge v9 — Round 27 Report
## 外部レビュー対応: 7バグ修正

### 修正一覧

| # | 問題 | Before | After |
|---|------|--------|-------|
| **B1** | Enterprise価格不一致 | spec ¥2,980 vs tech-plan ¥9,800 | 全ドキュメント ¥9,800 統一 |
| **B2** | API FK列サンプル値が全て`userId` | `post_id: userId`, `venue_id: userId` | `post_id: postId`, `owner_id: ownerId` |
| **B3** | FK参照先エンティティ未定義 | Event→FK(Venue) だがVenueテーブルなし | 未定義FK列を自動除外 |
| **B4** | Constitution成功指標が空 | `（未定義）` | ドメイン推論KPI（8ドメイン対応） |
| **B5** | "No raw SQL"が過度に広い | `No raw SQL` | `No raw SQL in application code` + migration例外明記 |
| **B6** | Stripe APIパス不一致 | spec: `supabase/functions/...` vs tp: `/api/...` | `/api/webhook/stripe` 統一 |
| **B7** | DevContainer ports不整合 | compose: 3000のみ | Supabase: +54321/54322/54323 |

### B4 ドメイン別KPI推論（8ドメイン）

| ドメイン | 推論KPI |
|---------|--------|
| education | コース完了率, MAL, NPS |
| ec | GMV, 購入CVR, カート離脱率 |
| community | MAU, 投稿率, 7日リテンション |
| saas | MRR, チャーン率, NPS |
| content | PV, 滞在時間, リピート率 |
| analytics | DAU, レポート生成数, データ更新頻度 |
| booking | 予約完了率, 件数, キャンセル率 |
| marketplace | 取引件数, 出品者定着率, CVR |

### B3 FK依存フィルタリング

`getEntityColumns(entity, G, knownEntities)` — 第3引数にユーザー定義エンティティリストを渡すことで、未定義エンティティへのFK参照を自動除外。

例: `data_entities: 'User, Post, Comment, Group, Event'`
- Event定義にFK(Venue)があるが、Venueは入力に含まれない → `venue_id`列を除外
- FK(User), FK(Post)は入力に含まれる → 保持

### メトリクス

| 指標 | R26 | R27 | 変化 |
|------|-----|-----|------|
| ビルド | 478KB | **481KB** | +3KB |
| テスト (npm test) | 91 | **108** | +17 |
| 内部アサーション | 248 | **248** | ±0 |
| 修正ファイル | — | **6** | — |

### 修正ファイル
- `src/generators/p1-sdd.js`: B1(価格統一), B4(KPI推論), B6(APIパス統一)
- `src/generators/docs.js`: B2(FK semantic values), B3(knownEntities)
- `src/generators/common.js`: B3(getEntityColumns FK filter)
- `src/generators/p4-airules.js`: B3(knownEntities), B5(No raw SQL clarification)
- `src/generators/p2-devcontainer.js`: B7(compose ports)
- `test/r27-regression.test.js`: 7グループ × 17テスト

### テスト構成 (108テスト)
- gen-coherence: 248アサーション (1テスト)
- snapshot: 28テスト (4シナリオ)
- r27-regression: 17テスト (7バグ修正)
- build + others: 62テスト
