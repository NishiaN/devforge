# v9.24 体感性能+モバイルバッチ — 設計・実装計画

**日付**: 2026-07-06 | **前提**: v9.23 (`edf253c`) | **方針**: 全ユーザーが毎回触れる操作の体感を磨く

v9.22 監査 Phase D の先送り分 (性能/小画面) を完結させる。launcher.js圧縮は残617KBで逼迫していないため、ユーザー価値直結のこちらを優先。

## Phase 一覧

| # | 項目 | 対象 | 内容 |
|---|------|------|------|
| P1 | Mermaid描画キャッシュ | preview.js | 同一コードのMermaid図はSVGキャッシュから復元し再レンダリングをスキップ |
| P2 | ファイルクリック時の再描画削減 | preview.js / sidebar.js | previewFile()経路の全再構築 (renderSidebarFiles等) を差分更新化 |
| P3 | save() 呼び出し監査 | ui/*.js | 閲覧系・高頻度操作の save() を saveDebounced() に置換 (回答・生成系は即時維持) |
| P4 | 小画面UX | all.css / help.js | qbar に max-height+スクロール (480px); ヘルプポップアップを実測高さでクランプ |
| P5 | 検証+文書 | test/ | 既存テスト全パス / build / compat; CLAUDE.md/MEMORY更新 |

## 制約・検証基準
- 挙動不変 (描画結果は同一、速度のみ改善) — スナップショット影響ゼロ想定
- データ安全性: 回答・生成・編集系の save() は即時のまま
- 7429 tests 全パス / <6500KB / 0 WARN

## 先送り継続 (v9.25候補)
- launcher.js ja/en 圧縮 (393KB) — サイズ逼迫時に着手
- doc番号レジストリ / ダッシュボードinnerHTML全面差分化
