Claude CodeとFigma MCPによるAI感のないWeb制作 このようなケースを他に調査して整理して取りまとめて。

以下は「**Claude Code × Figma MCP**で“AI感のない（＝量産っぽくない／テンプレ臭がしない）Web制作”」について、**同種の事例を追加で調査**して、**パターン別に整理したケース集**です。
 （※ここでの Figma MCP は、Figma公式の **Dev Mode MCP server** を中心に、周辺の OSS MCP サーバも含めます。）

------

## 0) “AI感が消える”本質（結論）

「AI感」は、だいたい **(1) デザインの根拠が曖昧**・**(2) 既存のデザインシステム無視**・**(3) 余計な創作** で出ます。
 逆に、Figma MCP は **Figmaのデータ（色・余白・Typography・コンポーネント・トークン等）をAIに“正確に渡す”**ので、**見た目のブレが激減→“人が作ったUI”に寄る**のが強みです。

------

## 1) 連携の型（Web制作で刺さるのはこの4つ）

### A. 「Figma＝ソースオブトゥルース」型（忠実再現でAI臭を消す）

- Next.js + Tailwind +（必要なら）shadcn/ui などを指定して、**FigmaのFrameを忠実に実装**させる流れ。
- 「AI感を消す＝忠実に再現」が主目的の解説も出ています。

### B. 「デザイントークン駆動」型（色・余白・文字を“揺らがせない”）

- Figma Variables / Code Syntax を整備し、CSS変数やTailwind側へ展開して一貫性を固定する。
- ここが決まると“AIっぽい適当な余白・色・角丸”が激減します。

### C. 「複数MCPで制作全体を閉じる」型（実装→テスト→PRまで）

- Figma MCP に加え、FileSystem/GitHub/Playwright等のMCPを併用して、**実装→動作確認→修正→差分管理**をエージェントで回す構成。

### D. 「プロトタイプ生成→Figmaで人間が整える→Claude Codeで実装」型

- v0等で叩き台 → Figmaで“人間の判断”で整える → Figma MCPで Claude Code に実装させる、というチェーンが「良い体験」として紹介されています。

------

## 2) 調査で見つかった “同じ狙い” の具体ケース集

### ケース1：Next.js + Tailwind + shadcn/ui で、Figmaを読み取ってUI実装（料金シミュレータ例）

- Figma MCPセットアップ込みでプロジェクト作成→Figma URLを読み取り→shadcn/ui導入して実装開始、という実践ログ。

### ケース2：デザインシステムをFigma MCP経由でAIに渡し、Next.js/Tailwindで実装精度を上げる

- 「Figma CommunityのDesign System」を前提に、Figma MCPで設計資産を渡してコーディング精度を上げる解説。

### ケース3：Figma MCPで “404ページ” など単ページを実装して精度検証（Web寄り）

- MCPでデザイン→コード生成を試し、Next.jsで404ページ実装まで検証した例。

### ケース4：静的Webサイト作成の自動化検証（Astro + TS + Tailwind）

- MCPを使った静的サイト生成の検証ログ。ツールはClaudeに限らずでも、**「Figma MCPをWeb制作に使う」構図そのもの**が参考になる。

### ケース5：Figma MCP活用の“データ作り”と“プロンプト”を20パターン検証

- Variables / Auto Layout / Layer names / Annotations が生成品質に与える影響を比較し、推奨構成をまとめた検証。
   → **AI感を消すには、Figma側の作り込みが効く**のが分かるタイプ。

### ケース6：Figma MCPが「Web開発フローを変える」系の組織ブログ

- “Dev Mode MCP Server でWeb開発がどう変わるか”という観点のまとめ（導入・特徴・使いどころ）。

（補足）Figma MCPは Claude Code 以外（VS Code / Cursor / Windsurf / Codexなど）でも使える前提で案内されています。

------

## 3) “AI感のないWeb”を再現するための共通成功要因（抽出）

### Figma側（AIに渡す設計資産の質）

- **Variables / Auto Layout / レイヤー命名 / 注釈**が効く（検証報告あり）
- **Design System（トークンとコンポーネント）を先に固める**と、出力がブレにくい

### Claude Code側（作り方の縛り）

- **「創作しない」指示**（忠実再現、勝手なUI変更禁止）
- **採用するUI基盤を指定**（例：shadcn/ui）→ 既存の“人間味のある部品”に寄せられる
- **複数MCP（GitHub/Playwright等）で“実装→検証”まで閉じる**と品質が上がる

------

## 4) Claude Code × Figma MCP の最短セットアップ（要点だけ）

- Figma公式ガイド：リモート/デスクトップの条件や、対応クライアントがまとまっています。
- Figma Dev Docs には Claude Code への追加コマンド例（`claude mcp add ...`）も載っています。
- Claude Code側は「Figma Plugin（公式マーケット）」で入れる手もあります。

------

## 5) 実務で使える「再現レシピ」テンプレ（AI臭を消す順）

1. **FigmaでDesign System（Variables/Components）整備**
2. **Figma MCP接続**（Claude Code）
3. **技術スタック固定**（例：Next.js + Tailwind + shadcn/ui）
4. **“忠実再現モード”の指示**（勝手に装飾しない、余白・サイズはFigma準拠）
5. **コンポーネント対応表**（FigmaのこのButton＝shadcn/uiのButton 等）
6. **実装→プレビュー→差分修正**（可能ならPlaywright等で確認）
7. **トークン反映の自動化**（Figma Variables → CSS変数/Tailwind）
8. **最後に“人間の編集”**（文章・余白の意図・情報設計。ここがAI臭を最終的に消す）

------

## 6) 注意点（AI×MCPは便利だが、地雷もある）

- MCP連携は便利な反面、**脆弱性や設定事故**の話題も出ています（特にサードパーティ実装）。
- Figma公式MCPサーバ自体のガイド・権限条件・レート制限も把握して運用するのが安全です。

------

必要なら次は、上のケースを踏まえて **「あなたの普段のWeb制作スタック（Next.js？Astro？WordPress？）向けに、AI臭を消すための“Claude Code用AGENTS.md（制作ルール）”」**をこちらで一発で作れます。
 （“AIは創作禁止／Figma準拠／トークン優先／アクセシビリティ必須／差分提示”みたいな縛りを全部込みで。）