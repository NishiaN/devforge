/* ═══ Pillar 9: Design System & Sequence Diagrams ═══ */

// Domain-specific color tokens
const _dc=(p,s,ac,cta,sj,se)=>({p,s,ac,cta,sj,se});
const DOMAIN_COLORS={
  education:_dc('#4F46E5','#10B981','#F59E0B','#4F46E5','温かみ・信頼・集中','Warm, trustworthy, focus'),
  ec:_dc('#EF4444','#F97316','#FCD34D','#EF4444','緊急感・行動促進・CTA強調','Urgency, action-driven, CTA emphasis'),
  fintech:_dc('#1E3A5F','#0EA5E9','#10B981','#0EA5E9','信頼性・プロフェッショナル・安定感','Trust, professional, stability'),
  health:_dc('#059669','#3B82F6','#E0F2FE','#3B82F6','清潔・信頼・安心感','Clean, trustworthy, reassuring'),
  saas:_dc('#7C3AED','#0EA5E9','#F97316','#7C3AED','革新性・信頼性・エネルギー','Innovative, trustworthy, energetic'),
  booking:_dc('#0EA5E9','#10B981','#F59E0B','#0EA5E9','開放感・信頼・緊急感','Open, trustworthy, urgency'),
  marketplace:_dc('#F97316','#3B82F6','#10B981','#F97316','活気・信頼・安全','Vibrant, trustworthy, safe'),
  community:_dc('#8B5CF6','#EC4899','#F59E0B','#8B5CF6','繋がり・楽しさ・創造性','Connection, fun, creativity'),
  content:_dc('#1E293B','#3B82F6','#F59E0B','#3B82F6','可読性・集中・専門性','Readability, focus, expertise'),
  iot:_dc('#06B6D4','#10B981','#F59E0B','#06B6D4','テクノロジー・清潔・データ','Technology, clean, data'),
  realestate:_dc('#1F2937','#D97706','#10B981','#D97706','高級感・信頼・安定','Premium, trustworthy, stable'),
  legal:_dc('#1F2937','#4B5563','#1E40AF','#1E40AF','権威・厳格・信頼','Authority, rigor, trust'),
  hr:_dc('#7C3AED','#3B82F6','#10B981','#7C3AED','人間性・成長・調和','Humane, growth, harmony'),
  portfolio:_dc('#1E293B','#0EA5E9','#F59E0B','#0EA5E9','シンプル・洗練・個性','Simple, refined, personality'),
  analytics:_dc('#1E293B','#6366F1','#0EA5E9','#6366F1','データ・分析・洞察','Data-driven, analytical, insightful'),
  gamify:_dc('#8B5CF6','#F59E0B','#EF4444','#8B5CF6','エキサイティング・競争・達成感','Exciting, competitive, achievement'),
  collab:_dc('#0EA5E9','#10B981','#6366F1','#0EA5E9','協働・信頼・生産性','Collaborative, trustworthy, productive'),
  creator:_dc('#EC4899','#8B5CF6','#F59E0B','#EC4899','個性・表現・情熱','Individual, expressive, passionate'),
  newsletter:_dc('#1E293B','#0EA5E9','#F59E0B','#0EA5E9','情報・信頼・権威','Informative, trustworthy, authoritative'),
  travel:_dc('#0EA5E9','#10B981','#F97316','#0EA5E9','自由・冒険・ワクワク感','Free, adventurous, exciting'),
  government:_dc('#1E3A5F','#4B5563','#1D4ED8','#1D4ED8','信頼性・公正・権威','Trustworthy, fair, authoritative'),
  manufacturing:_dc('#374151','#D97706','#6B7280','#D97706','堅牢性・効率・精密','Robust, efficient, precise'),
  logistics:_dc('#F97316','#1E293B','#0EA5E9','#F97316','速さ・確実性・効率','Fast, reliable, efficient'),
  agriculture:_dc('#16A34A','#92400E','#F59E0B','#16A34A','自然・成長・豊かさ','Natural, growth, abundance'),
  energy:_dc('#EAB308','#0F172A','#22C55E','#EAB308','活力・持続可能性・革新','Energetic, sustainable, innovative'),
  automation:_dc('#6366F1','#0EA5E9','#10B981','#6366F1','効率・革新・精密','Efficient, innovative, precise'),
  ai:_dc('#1E40AF','#7C3AED','#06B6D4','#7C3AED','知性・革新・無限の可能性','Intelligent, innovative, limitless'),
  devtool:_dc('#1F2937','#0EA5E9','#10B981','#0EA5E9','シンプル・効率・技術的精度','Simple, efficient, technical precision'),
  media:_dc('#111827','#EF4444','#F59E0B','#EF4444','情熱・エンタメ・インパクト','Passionate, entertainment, impact'),
  insurance:_dc('#1E3A5F','#059669','#0EA5E9','#059669','安心・信頼・保護','Security, trustworthy, protection'),
  event:_dc('#EC4899','#F97316','#EAB308','#EC4899','祝祭感・興奮・共同体','Festive, exciting, community'),
  _default:_dc('#0EA5E9','#6366F1','#F59E0B','#0EA5E9','汎用・バランス・信頼','General, balanced, trustworthy')
};

// Domain-specific visual strategy (effects, layouts, textures)
const _dvs=(ej,ee,lj,le,tj,te)=>({ej,ee,lj,le,tj,te});
const DOMAIN_VISUAL={
  ec:_dvs('CTA振動,カウントダウン,在庫カウンタ','CTA pulse,countdown,stock counter','カード型グリッド,スティッキーカート','Card grid,sticky cart','商品画像ズーム,カルーセル,レビュースター','Product zoom,carousel,review stars'),
  education:_dvs('進捗バー,ステップインジケータ,コンフェティ','Progress bar,step indicator,confetti','サイドバー型,ダッシュボードレイアウト','Sidebar,dashboard layout','暖色グラデ,ラウンド角,親しみやすいイラスト','Warm gradients,rounded corners,friendly illustrations'),
  fintech:_dvs('数値アニメ,チャートトランジション,ステータスバッジ','Number animation,chart transition,status badge','固定ヘッダー,左ナビゲーション','Fixed header,left navigation','ダークUI,モノスペース数字,グラスモーフィズム','Dark UI,monospace numbers,glassmorphism'),
  health:_dvs('カレンダー,タイムラインUI,バイタルグラフ','Calendar,timeline UI,vital graphs','カード型,タブ切替,清潔な余白','Card-based,tab switching,clean whitespace','ソフトシャドウ,グリーン系アクセント,アイコン多用','Soft shadows,green accents,heavy icon use'),
  saas:_dvs('オンボーディングステッパー,ツールチップ,トースト','Onboarding stepper,tooltip,toast','フルスクリーンダッシュボード,コマンドパレット','Full dashboard,command palette','ニューモーフィズム,マイクロアニメ,パララックスHero','Neumorphism,micro-animations,parallax hero'),
  booking:_dvs('日付ピッカー,可用性マップ,リアルタイム更新','Date picker,availability map,realtime updates','スプリットレイアウト(検索+結果)','Split layout(search+results)','スクロール連動マップ,フェードイン,ホバーエフェクト','Scroll-linked map,fade-in,hover effects'),
  gamify:_dvs('コンフェティ,ポイントカウントアップ,バッジアンロック','Confetti,point count-up,badge unlock','ランキングボード,チャレンジカード','Leaderboard,challenge cards','グロー効果,パルスアニメ,ホログラムバッジ','Glow effects,pulse animations,hologram badges'),
  collab:_dvs('リアルタイムカーソル,プレゼンス表示,変更ハイライト','Realtime cursors,presence indicator,change highlights','分割エディタ,コメントスレッド','Split editor,comment threads','カラーアバター,スムーズ共同編集トランジション','Color avatars,smooth co-edit transitions'),
  creator:_dvs('コンテンツプレビュー,いいね!アニメ,フォロワーカウント','Content preview,like animation,follower count','全幅コンテンツ,プロフィールヒーロー','Full-width content,profile hero','ダークモード標準,グラデーションアクセント','Dark mode default,gradient accents'),
  travel:_dvs('全幅ヒーロー画像,マップ連動,日付カレンダー','Full-bleed hero image,map integration,date calendar','検索優先レイアウト,結果グリッド','Search-first layout,results grid','パノラマ写真,フェードイン,インタラクティブマップ','Panoramic photos,fade-in,interactive map'),
  analytics:_dvs('チャートアニメ,数値ロールアップ,フィルタ連動','Chart animations,number rollup,filter sync','ダッシュボードグリッド,ウィジェット型','Dashboard grid,widget-based','データビジュアライゼーション,インタラクティブグラフ','Data visualization,interactive graphs'),
  ai:_dvs('ストリーミングテキスト,思考インジケータ,AIバッジ','Streaming text,thinking indicator,AI badge','チャットインターフェース,コンテキストパネル','Chat interface,context panel','グラデーションアニメ,タイピング効果,パルスアバター','Gradient animations,typing effect,pulse avatar'),
  media:_dvs('全幅サムネイル,再生ボタンオーバーレイ,プログレスバー','Full-width thumbnail,play overlay,progress bar','コンテンツグリッド,オートプレイ','Content grid,autoplay','シネマティックビュー,暗め背景,コントラスト強調','Cinematic view,dark backgrounds,high contrast'),
  community:_dvs('アクティビティフィード,リアクション,スレッド返信','Activity feed,reactions,thread replies','インフィニットスクロール,サイドバーメンバー','Infinite scroll,sidebar members','カラフルアバター,エモジリアクション,ホバーカード','Colorful avatars,emoji reactions,hover cards'),
  marketplace:_dvs('価格バッジ,評価スター,在庫残数カウント','Price badge,rating stars,stock count','フィルターサイドバー,比較テーブル','Filter sidebar,comparison table','信頼バッジ,ホバー拡張,シャドウカード','Trust badges,hover expand,shadow cards'),
  content:_dvs('読書進捗バー,記事プレビュー,無限スクロール','Reading progress,article preview,infinite scroll','全幅記事,スティッキーTOC','Full-width article,sticky TOC','リーダーモード,セリフ体,快適行間','Reading mode,serif fonts,comfortable line-height'),
  portfolio:_dvs('ホバー表示,プロジェクトズーム,パララックス','Hover reveal,project zoom,parallax','メイソングリッド,全画面ギャラリー','Masonry grid,full-screen gallery','ミニマルダーク,モノクロアクセント,高品質タイポ','Minimal dark,monochrome accent,high typography'),
  tool:_dvs('即時フィードバック,ショートカットヒント,ステータスインジケータ','Instant feedback,shortcut hints,status indicator','コンパクトツールバー,スプリットペイン','Compact toolbar,split pane','フラットデザイン,キーボードフォーカスリング,高密度UI','Flat design,keyboard focus rings,utility density'),
  iot:_dvs('センサーゲージ,リアルタイムパルス,閾値アラート','Sensor gauge,realtime pulse,threshold alert','ダッシュボードグリッド,時系列チャート','Dashboard grid,time-series charts','ダークモニタリング,ステータスLED色,テクニカルフォント','Dark monitoring,status LED colors,technical font'),
  realestate:_dvs('VRツアーボタン,ギャラリースライドショー,マップピンホバー','VR tour button,gallery slideshow,map pin hover','写真グリッド,マップ分割ビュー','Photo grid,map split view','クリーン空白,大型写真,信頼シグナル','Clean whitespace,large photos,trust signals'),
  legal:_dvs('ドキュメントビューア,バージョン差分,署名パッド','Document viewer,version diff,signature pad','ドキュメント中心,サイドバーナビ','Document-centric,sidebar navigation','プロフェッショナルセリフ,ニュートラルトーン,構造化レイアウト','Professional serif,neutral tones,structured layout'),
  hr:_dvs('プロフィールカード,パイプラインカンバン,評価プログレス','Profile cards,pipeline kanban,evaluation progress','カンバンボード,応募者リスト','Kanban board,applicant list','コーポレートクリーン,ステータスカラーコード','Corporate clean,status color coding'),
  automation:_dvs('フロー図,実行ログ,ステータスインジケータ','Flow diagram,execution log,status indicators','ノードベースフロー,ログコンソール','Node-based flow,log console','テクニカルダーク,ステータスバッジ,プログレス表示','Technical dark,status badges,progress indicators'),
  event:_dvs('カウントダウンタイマー,座席マップ,チケット購入','Countdown timer,seat map,ticket purchase','イベントヒーロー,スケジュールグリッド','Event hero,schedule grid','フェスティブエネルギー,ボールドタイポ,CTA強調','Festive energy,bold typography,CTA emphasis'),
  devtool:_dvs('コード構文強調,APIレスポンス,コピーボタン','Code syntax highlight,API response,copy button','分割ドキュメント/プレイグラウンド','Split doc/playground','ダークモノスペース,構文カラー,ミニマルクローム','Dark monospace,syntax colors,minimal chrome'),
  newsletter:_dvs('メールプレビュー,開封率チャート,購読者グラフ','Email preview,open rate chart,subscriber growth','メールテンプレートエディタ,キャンペーンリスト','Email template editor,campaign list','クリーン編集,大型CTAボタン,コンテンツフォーカス','Clean editorial,large CTA buttons,content focus'),
  manufacturing:_dvs('生産プログレスバー,品質ゲージ,設備ステータス','Production progress bar,quality gauge,equipment status','KPIダッシュボード,タイムライン','KPI dashboard,timeline','インダストリアル精密,ステータスインジケータ,データ密度高','Industrial precise,status indicators,data-dense'),
  logistics:_dvs('ルートマップ,追跡タイムライン,ステータスバッジ','Route map,tracking timeline,status badges','マップ中心,パッケージステータス','Map-centric,package status','クリーン機能的,配送ステータス色','Clean functional,delivery status colors'),
  agriculture:_dvs('センサーチャート,天気ウィジェット,圃場マップ','Sensor chart,weather widget,field map','IoTダッシュボード,フィールドマップ','IoT dashboard,field map','ナチュラルアースカラー,健康インジケータ','Natural earth tones,health indicators'),
  energy:_dvs('電力ゲージ,発電チャート,消費ヒートマップ','Power gauge,generation chart,consumption heat map','エネルギーダッシュボード,時系列','Energy dashboard,time-series','サイエンティフィッククリーン,消費カラー,精度重視','Scientific clean,consumption colors,precision focus'),
  government:_dvs('多段階フォーム,進捗トラッカー,アクセシビリティインジケータ','Multi-step form,progress tracker,accessibility indicators','フォーム中心,ステップウィザード','Form-centric,step wizard','インスティテューショナルブルー,高コントラスト,A11y優先','Institutional blue,high contrast,A11y first'),
  insurance:_dvs('見積計算機,プラン比較,請求プログレス','Quote calculator,plan comparison,claim progress','比較テーブル,フォームウィザード','Comparison table,form wizard','プロフェッショナル信頼感,落ち着いたパレット','Professional trustworthy,subdued palette'),
  _default:_dvs('スクロール連動フェードイン,ホバーエフェクト','Scroll-linked fade-in,hover effects','レスポンシブグリッド,スティッキーヘッダー','Responsive grid,sticky header','パララックス,スムーズスクロール,マイクロアニメ','Parallax,smooth scroll,micro-animations')
};

// Domain-specific sequence flow templates
const _dsf=(nj,ne,steps)=>({nj,ne,steps});
const DOMAIN_SEQ_FLOWS={
  ec:_dsf('購入フロー','Purchase Flow',[['U','C','商品をカートに追加','Add to cart'],['C','API','Checkout API呼出','Call Checkout API'],['API','API','在庫確認+ロック','Check stock+lock'],['API','C','注文作成+在庫減算','Create order+deduct stock'],['C','U','注文完了画面','Show confirmation']]),
  education:_dsf('受講フロー','Enrollment Flow',[['U','C','コース選択','Select course'],['C','API','受講登録API','Enrollment API'],['API','C','Enrollment作成','Create enrollment'],['U','C','レッスン受講','Start lesson'],['C','API','進捗更新','Update progress'],['API','C','進捗保存+修了判定','Save+check completion']]),
  booking:_dsf('予約フロー','Booking Flow',[['U','C','空き枠検索','Search slots'],['C','API','空き確認','Check availability'],['U','C','予約情報入力','Enter booking info'],['C','API','予約確定+枠ロック','Confirm+lock slot'],['API','C','確認メール送信','Send confirmation']]),
  health:_dsf('診療予約','Appointment Flow',[['U','C','医師・日時選択','Select doctor+time'],['C','API','空き確認','Check availability'],['U','C','症状入力','Enter symptoms'],['C','API','予約確定','Confirm appointment'],['API','C','リマインド送信','Send reminder']]),
  fintech:_dsf('送金フロー','Transfer Flow',[['U','C','送金先・金額入力','Enter recipient+amount'],['C','API','残高確認+凍結','Check balance+hold'],['API','API','KYCチェック','KYC verification'],['API','C','送金実行','Execute transfer'],['API','C','通知送信','Send notification']]),
  saas:_dsf('オンボーディング','Onboarding Flow',[['U','C','サインアップ','Sign up'],['C','API','Workspace作成','Create workspace'],['C','U','初期設定ウィザード','Setup wizard'],['U','C','チーム招待','Invite team'],['C','API','メンバー追加+権限設定','Add members+set roles']]),
  gamify:_dsf('ポイント付与フロー','Point Award Flow',[['U','C','アクション実行','Perform action'],['C','API','ポイント付与API','Award points API'],['API','API','不正チェック','Fraud check'],['API','API','ポイント加算+履歴記録','Add points+log history'],['API','C','バッジ判定','Check badge unlock'],['C','U','ポイント/バッジ通知','Notify points/badge']]),
  collab:_dsf('共同編集フロー','Co-Edit Flow',[['U','C','ドキュメント編集','Edit document'],['C','WS','変更送信(OT/CRDT)','Send change (OT/CRDT)'],['WS','API','変更保存+バージョン記録','Save+version history'],['WS','C2','変更ブロードキャスト','Broadcast to others'],['C2','U2','リアルタイム反映','Realtime update']]),
  creator:_dsf('コンテンツ投稿フロー','Content Publish Flow',[['U','C','コンテンツ作成','Create content'],['C','API','メディアアップロード','Upload media'],['API','CDN','CDN配置','Place on CDN'],['U','C','公開設定+価格設定','Set publish+pricing'],['C','API','コンテンツ公開','Publish content'],['API','C','ファン通知送信','Notify followers']]),
  ai:_dsf('AI会話フロー','AI Chat Flow',[['U','C','プロンプト入力','Enter prompt'],['C','API','RAGコンテキスト取得','Fetch RAG context'],['API','LLM','プロンプト送信+ストリーム','Send prompt+stream'],['LLM','C','トークンストリーム','Token stream'],['C','U','レスポンス表示','Display response'],['API','API','会話履歴保存','Save conversation history']]),
  travel:_dsf('旅行予約フロー','Travel Booking Flow',[['U','C','目的地・日程検索','Search destination+dates'],['C','API','空き確認(OTA連携)','Check availability (OTA)'],['C','U','比較表示','Show comparison'],['U','C','予約選択','Select booking'],['C','API','決済+予約確定','Payment+confirm booking'],['API','C','バウチャー送信','Send voucher']]),
  marketplace:_dsf('商品取引フロー','Marketplace Deal Flow',[['U','C','商品検索','Search items'],['C','API','商品リスト取得','Fetch listings'],['U','C','購入/入札','Purchase/bid'],['C','API','エスクロー作成','Create escrow'],['API','C','出品者通知','Notify seller'],['API','U','取引完了+評価依頼','Complete+request review']]),
  insurance:_dsf('保険請求フロー','Insurance Claim Flow',[['U','C','事故・損害報告','Report incident'],['C','API','請求作成','Create claim'],['API','API','AI査定','AI assessment'],['API','C','審査員割当','Assign adjuster'],['API','U','審査結果通知','Notify decision'],['API','U','支払い振込','Process payment']]),
  iot:_dsf('センサーデータフロー','Sensor Data Flow',[['DEV','API','MQTT送信','Send MQTT data'],['API','API','データ検証+保存','Validate+store data'],['API','API','閾値チェック','Threshold check'],['API','C','アラート送信','Send alert'],['C','U','ダッシュボード更新','Update dashboard']]),
  event:_dsf('チケット購入フロー','Ticket Purchase Flow',[['U','C','イベント選択','Select event'],['C','API','座席在庫確認','Check seat availability'],['API','API','座席仮押さえ(15分)','Soft-lock seat (15min)'],['U','C','決済情報入力','Enter payment'],['C','API','チケット確定+QR発行','Confirm+issue QR'],['API','U','メールでQR送付','Send QR via email']]),
  automation:_dsf('ワークフロー実行フロー','Workflow Execution Flow',[['SRC','API','トリガー受信','Receive trigger'],['API','API','条件評価','Evaluate conditions'],['API','API','ステップ実行(各アクション)','Execute steps (each action)'],['API','API','エラーハンドリング+リトライ','Error handling+retry'],['API','SRC','完了通知送信','Send completion notification']]),
  community:_dsf('コミュニティ投稿フロー','Community Post Flow',[['U','C','投稿作成','Create post'],['C','API','コンテンツ送信','Submit content'],['API','API','モデレーション自動チェック','Auto moderation check'],['API','C','投稿公開','Publish post'],['API','DB','フォロワー通知','Notify followers'],['C','U','投稿表示','Display post']]),
  newsletter:_dsf('メール配信フロー','Newsletter Send Flow',[['U','C','メール下書き作成','Draft newsletter'],['C','API','受信者セグメント取得','Fetch subscriber segment'],['C','U','プレビュー確認','Preview email'],['U','C','送信スケジュール設定','Schedule send'],['C','API','一括送信実行(SES/SendGrid)','Bulk send (SES/SendGrid)'],['API','C','開封率・CTR取得','Fetch open rate+CTR']]),
  content:_dsf('コンテンツ公開フロー','Content Publish Flow',[['U','C','記事・コンテンツ作成','Create article/content'],['C','API','AIレビュー+SEO最適化','AI review+SEO optimize'],['C','U','編集者レビュー','Editor review'],['U','C','公開承認','Approve publish'],['C','API','CDN配信+SNS通知','Deliver via CDN+notify SNS'],['API','C','アナリティクス計測開始','Start analytics tracking']]),
  portfolio:_dsf('ポートフォリオ閲覧フロー','Portfolio View Flow',[['V','C','トップページ訪問','Visit landing page'],['C','API','プロジェクト一覧取得','Fetch project list'],['V','C','プロジェクト選択','Select project'],['C','API','プロジェクト詳細取得','Fetch project details'],['V','C','コンタクトフォーム送信','Send contact form'],['C','API','メール通知送信','Send email notification']]),
  tool:_dsf('ツール実行フロー','Tool Execution Flow',[['U','C','パラメータ入力','Enter parameters'],['C','API','入力検証','Validate input'],['C','API','処理実行','Execute processing'],['API','C','結果生成','Generate result'],['C','U','結果表示+ダウンロード','Display result+download']]),
  realestate:_dsf('物件探索フロー','Property Search Flow',[['U','C','条件検索','Search with criteria'],['C','API','物件リスト取得','Fetch property list'],['U','C','物件詳細閲覧','View property detail'],['U','C','内見予約','Schedule viewing'],['C','API','予約確定+担当者通知','Confirm+notify agent'],['C','U','契約書準備通知','Notify contract preparation']]),
  legal:_dsf('契約署名フロー','Contract Sign Flow',[['U','C','契約書アップロード','Upload contract'],['C','API','テンプレート適用+AI審査','Apply template+AI review'],['C','C2','署名依頼送信','Send sign request'],['C2','API','電子署名実行','Execute e-signature'],['API','API','タイムスタンプ付与','Add timestamp'],['API','U','署名済み契約書保存','Store signed contract']]),
  hr:_dsf('採用フロー','Hiring Flow',[['HR','C','求人票作成','Create job posting'],['C','API','求人サイト連携','Sync to job boards'],['AP','C','応募受付','Receive application'],['C','API','スクリーニングAI評価','AI screening score'],['HR','C','面接スケジュール確定','Schedule interview'],['C','AP','オファーレター送信','Send offer letter']]),
  devtool:_dsf('APIキー発行フロー','API Key Issue Flow',[['U','C','開発者登録','Register developer'],['C','API','アカウント作成+審査','Create account+verify'],['U','C','APIキー発行要求','Request API key'],['C','API','キー生成+スコープ設定','Generate key+set scopes'],['U','API','APIコール実行','Execute API call'],['API','C','使用量モニタリング','Monitor usage']]),
  manufacturing:_dsf('生産オーダーフロー','Production Order Flow',[['OP','C','生産計画作成','Create production plan'],['C','API','在庫・資材確認','Check inventory+materials'],['C','MES','製造指示発行','Issue work order'],['MES','C','進捗報告','Report progress'],['MES','API','品質検査記録','Record QC result'],['API','C','出荷指示','Issue shipping order']]),
  logistics:_dsf('配送追跡フロー','Shipment Tracking Flow',[['SND','C','出荷登録','Register shipment'],['C','API','キャリア割当','Assign carrier'],['API','API','追跡番号発行','Issue tracking number'],['CARR','API','ステータス更新','Update status'],['API','C','配送完了通知','Notify delivery'],['RCV','C','受取確認','Confirm receipt']]),
  agriculture:_dsf('作物モニタリングフロー','Crop Monitoring Flow',[['SEN','API','センサーデータ送信','Send sensor data'],['API','API','気象・土壌分析','Analyze weather+soil'],['API','API','生育状況判定','Assess crop status'],['API','C','アラート判定','Evaluate alerts'],['C','U','推奨アクション通知','Notify recommended action'],['U','DEV','灌漑・施肥指示','Issue irrigation/fertilize cmd']]),
  energy:_dsf('エネルギー管理フロー','Energy Management Flow',[['MTR','API','消費量データ収集','Collect consumption data'],['API','API','リアルタイム分析','Real-time analysis'],['API','API','ピーク予測','Predict peak load'],['API','API','最適化ロジック実行','Run optimization logic'],['API','C','制御指示送信','Send control command'],['API','U','レポート生成','Generate report']]),
  media:_dsf('コンテンツ配信フロー','Media Streaming Flow',[['U','C','コンテンツ選択','Select content'],['C','API','認証+視聴権確認','Auth+check entitlement'],['C','CDN','ストリームURL取得','Fetch stream URL'],['CDN','U','アダプティブ配信','Adaptive streaming'],['C','API','視聴ログ記録','Record watch log'],['API','API','レコメンド更新','Update recommendations']]),
  government:_dsf('行政申請フロー','Civic Application Flow',[['U','C','マイナンバー認証','MyNumber authentication'],['C','API','申請フォーム取得','Fetch application form'],['U','C','申請情報入力','Fill application'],['C','API','申請送信+受付番号発行','Submit+issue receipt no.'],['STAFF','API','審査・承認','Review+approve'],['API','U','結果通知(SMS/メール)','Notify result (SMS/email)']]),
  analytics:_dsf('ダッシュボード表示フロー','Dashboard Load Flow',[['U','C','ダッシュボード要求','Request dashboard'],['C','API','認証確認','Verify auth'],['API','DB','データクエリ実行','Execute data queries'],['DB','API','集計+キャッシュ','Aggregate+cache'],['API','C','可視化データ配信','Deliver visualization data'],['C','U','インタラクティブ表示','Render interactive charts']])
};

function genPillar9_DesignSystem(a,pn){
  const G=S.genLang==='ja';
  const fe=a.frontend||'React + Next.js';
  const be=a.backend||'Node.js + Express';
  const auth=resolveAuth(a);
  const arch=resolveArch(a);
  const hasPay=a.payment&&!/なし|None|none/.test(a.payment);
  const entities=(a.data_entities||'').split(/[,、]\s*/).map(s=>s.trim()).filter(Boolean);
  const screens=(a.screens||'').split(/[,、]/).map(s=>s.trim()).filter(Boolean);

  // Domain detection for color and flow customization
  const domain=detectDomain(a.purpose)||'_default';
  const dc=DOMAIN_COLORS[domain]||DOMAIN_COLORS._default;

  // Framework-specific CSS approach
  const isTailwind=fe.includes('Next')||fe.includes('Vite')||fe.includes('React');
  const isVuetify=fe.includes('Vue');
  const isMaterial=fe.includes('Angular');

  // Design Tokens
  const colorSection=G?'## デザイントークン':'## Design Tokens';
  const colorPalette=G?'### カラーパレット':'### Color Palette';
  const typography=G?'### タイポグラフィ':'### Typography Scale';
  const spacing=G?'### スペーシング':'### Spacing Scale';
  const breakpoints=G?'### ブレークポイント':'### Breakpoints';
  const components=G?'## コンポーネントカタログ':'## Component Catalog';
  const darkMode=G?'## ダーク/ライトモード':'## Dark/Light Mode';
  const guidelines=G?'## AI実装ガイドライン':'## AI Implementation Guidelines';

  let designDoc='# '+(G?'デザインシステム':'Design System')+'\n\n';
  designDoc+=G?'**重要**: AIエージェントは、UI実装時に必ずこのデザインシステムを参照し、一貫性を保ってください。\n\n':'**IMPORTANT**: AI agents MUST reference this design system when implementing UI to maintain consistency.\n\n';

  // Color Palette
  designDoc+=colorSection+'\n\n'+colorPalette+'\n\n';
  if(isTailwind){
    designDoc+='```css\n/* Tailwind config (tailwind.config.js) */\ntheme: {\n  extend: {\n    colors: {\n      primary: \''+dc.p+'\',\n      secondary: \''+dc.s+'\',\n      accent: \''+dc.ac+'\',\n      cta: \''+dc.cta+'\',\n      success: \'#10b981\',\n      warning: \'#f59e0b\',\n      error: \'#ef4444\',\n      surface: {\n        light: \'#ffffff\',\n        dark: \'#1e293b\'\n      }\n    }\n  }\n}\n```\n';
  }else if(isVuetify){
    designDoc+='```js\n// Vuetify theme (vuetify.config.js)\ntheme: {\n  themes: {\n    light: {\n      primary: \''+dc.p+'\',\n      secondary: \''+dc.s+'\',\n      accent: \''+dc.ac+'\'\n    },\n    dark: {\n      primary: \''+dc.cta+'\',\n      secondary: \''+dc.s+'\',\n      accent: \''+dc.ac+'\'\n    }\n  }\n}\n```\n';
  }else{
    designDoc+='```css\n:root {\n  --color-primary: '+dc.p+';\n  --color-secondary: '+dc.s+';\n  --color-accent: '+dc.ac+';\n  --color-cta: '+dc.cta+';\n  --color-bg: #ffffff;\n  --color-surface: #f8fafc;\n  --color-text: #0f172a;\n  --color-success: #10b981;\n  --color-warning: #f59e0b;\n  --color-error: #ef4444;\n}\n[data-theme="dark"] {\n  --color-bg: #0f172a;\n  --color-surface: #1e293b;\n  --color-text: #f1f5f9;\n}\n```\n';
  }

  // Color Strategy
  designDoc+=(G?'#### カラー戦略\n\n':'#### Color Strategy\n\n');
  designDoc+=(G?dc.sj:dc.se)+'\n\n';

  // Typography
  designDoc+='\n'+typography+'\n\n| '+(G?'要素':'Element')+' | '+(G?'サイズ':'Size')+' | '+(G?'ウェイト':'Weight')+' | '+(G?'行間':'Line Height')+' |\n|------|------|--------|-------------|\n';
  designDoc+='| h1 | 36px/2.25rem | 700 | 1.2 |\n| h2 | 30px/1.875rem | 600 | 1.3 |\n| h3 | 24px/1.5rem | 600 | 1.4 |\n| body | 16px/1rem | 400 | 1.5 |\n| small | 14px/0.875rem | 400 | 1.4 |\n| xs | 12px/0.75rem | 400 | 1.3 |\n\n';

  // Spacing
  designDoc+=spacing+'\n\n| '+(G?'トークン':'Token')+' | '+(G?'値':'Value')+' | '+(G?'用途':'Usage')+' |\n|------|-------|-------|\n';
  designDoc+='| xs | 4px | '+(G?'アイコン間隔':'Icon gaps')+'|\n| sm | 8px | '+(G?'コンパクト間隔':'Compact spacing')+'|\n| md | 16px | '+(G?'標準間隔':'Standard spacing')+'|\n| lg | 24px | '+(G?'セクション間':'Section gaps')+'|\n| xl | 32px | '+(G?'カード間':'Card spacing')+'|\n| 2xl | 48px | '+(G?'大セクション間':'Large sections')+'|\n\n';

  // Breakpoints
  designDoc+=breakpoints+'\n\n```css\n/* Mobile: 0-640px */\n/* Tablet: 641-1024px */\n/* Desktop: 1025-1536px */\n/* Wide: 1537px+ */\n```\n\n';

  // Component Catalog
  designDoc+=components+'\n\n';
  if(screens.length>0){
    screens.forEach(scr=>{
      const comps=getScreenComponents(scr,G);
      if(comps){
        designDoc+='### '+(G?'画面：':'Screen: ')+scr+'\n';
        comps.forEach(c=>designDoc+='- '+c+'\n');
        designDoc+='\n';
      }
    });
  }

  // Major Component Specifications
  designDoc+=(G?'### 主要コンポーネント仕様\n\n':'### Core Component Specifications\n\n');
  designDoc+='| '+(G?'コンポーネント':'Component')+' | '+(G?'Props':'Props')+' | '+(G?'バリエーション':'Variants')+' |\n|-------------|-------|------------|\n';
  designDoc+='| Button | variant, size, disabled | primary, secondary, outline, ghost |\n';
  designDoc+='| Input | type, placeholder, error | text, email, password, number |\n';
  designDoc+='| Card | elevated, outlined | default, clickable, media |\n';
  designDoc+='| Modal | open, onClose | sm, md, lg, fullscreen |\n';
  designDoc+='| Table | data, columns, sortable | default, striped, compact |\n';
  designDoc+='| Badge | color, size | success, warning, error, info |\n\n';

  // Enterprise Component Specifications (conditional)
  var isEnterprise=/マルチテナント|Multi-tenant|RBAC|承認|approval|admin|multi.*tenant/i.test(
    (a.mvp_features||'')+(a.org_model||'')+(a.screens||''));
  if(isEnterprise){
    designDoc+=(G?'### エンタープライズコンポーネント仕様\n\n':'### Enterprise Component Specifications\n\n');
    designDoc+=(G?'| コンポーネント | 主要Props | バリエーション | A11y |\n|------------|---------|------------|------|\n':
                   '| Component | Key Props | Variants | A11y |\n|-----------|-----------|----------|------|\n');
    designDoc+='| StatusBadge | status, size, variant | pending/approved/rejected/active | role="status" aria-label |\n';
    designDoc+='| ApprovalBar | request, onApprove, onReject, currentUserRole | pending/approved/rejected | button aria-label, aria-disabled |\n';
    designDoc+='| DataTable | data, columns, sortable, filterable, paginated, bulkActions | basic/sortable/paginated | role="table", aria-sort |\n';
    designDoc+='| NotificationBell | count, items, onRead | unread/empty | aria-label="N unread", aria-live |\n';
    designDoc+='| OrgSwitcher | orgs, current, onChange | single/multi/create | combobox role, aria-expanded |\n';
    designDoc+='| OnboardingStepper | steps, current, onComplete | horizontal/vertical/progress | aria-current="step" |\n';
    designDoc+='| AuditTimeline | events, filter, maxItems | compact/detailed/filtered | role="feed", time datetime |\n';
    designDoc+='| InviteManager | invites, onCreate, onRevoke | list/form/bulk | AlertDialog confirm, aria-live |\n\n';
    designDoc+=(G?'> 詳細仕様は `docs/76_enterprise_components.md` を参照。\n\n':
                   '> See `docs/76_enterprise_components.md` for detailed specifications.\n\n');
  }

  // Framework Component Mapping
  designDoc+=(G?'### コンポーネント対応表\n\n':'### Component Framework Mapping\n\n');
  designDoc+='| '+(G?'コンポーネント':'Component')+' | Tailwind (shadcn/ui) | Vuetify | Angular Material |\n|-------------|----------------------|---------|------------------|\n';
  designDoc+='| Button | `<Button>` | `<v-btn>` | `<mat-button>` |\n';
  designDoc+='| Input | `<Input>` | `<v-text-field>` | `<mat-form-field>` + `<input matInput>` |\n';
  designDoc+='| Card | `<Card>` | `<v-card>` | `<mat-card>` |\n';
  designDoc+='| Modal/Dialog | `<Dialog>` | `<v-dialog>` | `<mat-dialog>` |\n';
  designDoc+='| Table | `<Table>` | `<v-data-table>` | `<mat-table>` |\n';
  designDoc+='| Select | `<Select>` | `<v-select>` | `<mat-select>` |\n';
  designDoc+='| Checkbox | `<Checkbox>` | `<v-checkbox>` | `<mat-checkbox>` |\n';
  designDoc+='| Tabs | `<Tabs>` | `<v-tabs>` | `<mat-tab-group>` |\n\n';

  if(isTailwind){
    designDoc+=(G?'**推奨**: shadcn/ui または Headless UI をベースに、デザイントークンを適用\n':'**Recommendation**: Use shadcn/ui or Headless UI as base, apply design tokens\n')+'\n';
  }else if(isVuetify){
    designDoc+=(G?'**推奨**: Vuetify の標準コンポーネントをカスタマイズ\n':'**Recommendation**: Customize Vuetify standard components\n')+'\n';
  }else if(isMaterial){
    designDoc+=(G?'**推奨**: Angular Material の標準コンポーネントを使用\n':'**Recommendation**: Use Angular Material standard components\n')+'\n';
  }

  // Motion & Transition
  designDoc+=(G?'## モーション & トランジション\n\n':'## Motion & Transitions\n\n');
  designDoc+='| '+(G?'トークン':'Token')+' | '+(G?'値':'Value')+' | '+(G?'用途':'Usage')+' |\n|---------|-------|-------|\n';
  designDoc+='| duration-fast | 150ms | '+(G?'ホバー、フォーカス':'Hover, focus')+'|\n';
  designDoc+='| duration-normal | 250ms | '+(G?'パネル開閉、トグル':'Panel, toggle')+'|\n';
  designDoc+='| duration-slow | 400ms | '+(G?'モーダル、ページ遷移':'Modal, page transition')+'|\n';
  designDoc+='| easing-default | cubic-bezier(0.4,0,0.2,1) | '+(G?'標準':'Default')+'|\n';
  designDoc+='| easing-in | cubic-bezier(0.4,0,1,1) | '+(G?'退出':'Exit')+'|\n';
  designDoc+='| easing-out | cubic-bezier(0,0,0.2,1) | '+(G?'進入':'Enter')+'|\n\n';

  // Visual Enhancement Dictionary
  designDoc+=(G?'## ビジュアルエンハンスメント辞書\n\n':'## Visual Enhancement Dictionary\n\n');
  designDoc+=(G?'AIエージェントに以下のキーワードを指示することで、「AI感」を排除した高品質な演出が実装可能です。\n\n':'Use these keywords when instructing AI agents to implement professional-quality effects that eliminate the "AI look".\n\n');
  designDoc+='| '+(G?'キーワード':'Keyword')+' | '+(G?'効果':'Effect')+' | CSS/JS |\n|---------|------|--------|\n';
  designDoc+='| '+(G?'パララックス':'Parallax')+' | '+(G?'奥行きと躍動感':'Depth and dynamism')+' | `transform: translateZ()`, Intersection Observer |\n';
  designDoc+='| '+(G?'ニューモーフィズム':'Neumorphism')+' | '+(G?'触覚的な高級感':'Tactile premium feel')+' | `box-shadow: inset ...`, same-hue bg |\n';
  designDoc+='| '+(G?'グラスモーフィズム':'Glassmorphism')+' | '+(G?'透明感と奥行き':'Transparency and depth')+' | `backdrop-filter: blur()`, `bg-opacity` |\n';
  designDoc+='| '+(G?'スクロール連動':'Scroll-linked')+' | '+(G?'没入型インタラクション':'Immersive interaction')+' | `IntersectionObserver`, `scroll-behavior` |\n';
  designDoc+='| '+(G?'マイクロアニメーション':'Micro-animation')+' | '+(G?'応答性と洗練':'Responsiveness and polish')+' | `transition: 150ms`, `@keyframes` |\n';
  designDoc+='| View Transitions | '+(G?'ページ遷移の余韻':'Smooth page transitions')+' | `document.startViewTransition()` |\n\n';

  // Domain-specific visual recommendations
  const dvs=DOMAIN_VISUAL[domain]||DOMAIN_VISUAL._default;
  designDoc+=(G?'### '+pn+' 推奨ビジュアル戦略\n\n':'### '+pn+' Recommended Visual Strategy\n\n');
  designDoc+='| '+(G?'カテゴリ':'Category')+' | '+(G?'推奨':'Recommendation')+' |\n|----------|------|\n';
  designDoc+='| '+(G?'演出効果':'Effects')+' | '+(G?dvs.ej:dvs.ee)+' |\n';
  designDoc+='| '+(G?'レイアウト':'Layout')+' | '+(G?dvs.lj:dvs.le)+' |\n';
  designDoc+='| '+(G?'テクスチャ・質感':'Texture')+' | '+(G?dvs.tj:dvs.te)+' |\n\n';

  // Design Token Export
  designDoc+=(G?'## デザイントークン エクスポート\n\n':'## Design Token Export\n\n');
  designDoc+=(G?'以下のJSON形式でトークンを管理することを推奨します：\n\n':'Recommended to manage tokens in JSON format:\n\n');
  designDoc+='```json\n{\n  "color": {\n    "primary": "'+dc.p+'",\n    "secondary": "'+dc.s+'",\n    "accent": "'+dc.ac+'",\n    "cta": "'+dc.cta+'",\n    "success": "#10b981",\n    "warning": "#f59e0b",\n    "error": "#ef4444"\n  },\n  "spacing": {\n    "xs": "4px",\n    "sm": "8px",\n    "md": "16px",\n    "lg": "24px",\n    "xl": "32px",\n    "2xl": "48px"\n  },\n  "radius": {\n    "sm": "4px",\n    "md": "8px",\n    "lg": "16px",\n    "full": "9999px"\n  },\n  "shadow": {\n    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",\n    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",\n    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)"\n  }\n}\n```\n\n';

  // Dark/Light Mode
  designDoc+=darkMode+'\n\n';
  if(isTailwind){
    designDoc+='```jsx\n// app/layout.tsx\nimport { ThemeProvider } from "next-themes"\n\nexport default function RootLayout({ children }) {\n  return (\n    <html suppressHydrationWarning>\n      <body>\n        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>\n          {children}\n        </ThemeProvider>\n      <\/body>\n    </html>\n  )\n}\n```\n\n'+(G?'使用例: `className="bg-white dark:bg-gray-900"`':'Usage: `className="bg-white dark:bg-gray-900"`')+'\n\n';
  }else{
    designDoc+='```js\n// Toggle theme\nfunction toggleTheme() {\n  document.documentElement.dataset.theme = \n    document.documentElement.dataset.theme === "dark" ? "light" : "dark";\n}\n```\n\n';
  }

  // AI Guidelines
  designDoc+=guidelines+'\n\n';
  designDoc+=(G?'### AI Design Protocol（AI感を排除するルール）\n\n':'### AI Design Protocol (Rules to Eliminate AI Look)\n\n');
  designDoc+=(G?'1. **トークン参照義務**: すべてのスタイル指定は、定義済みデザイントークン経由で行う。未定義の値を使用しない\n2. **未定義値の禁止**: トークンにない色・余白・サイズは使用禁止（例: `#123456`, `13px`, `font-size: 19px`）\n3. **装飾追加禁止**: 仕様にないシャドウ・グラデーション・アニメーションを追加しない\n4. **レイアウト改変禁止**: 指定されたグリッド構造・フレックスボックス配置を変更しない\n5. **コンポーネント対応表遵守**: フレームワーク標準コンポーネントを使用し、独自実装を避ける\n6. **一貫性検証**: 実装前にデザイントークンとの整合性をチェック\n7. **仕様外の最適化禁止**: 「より良く見せるため」の独自判断による変更は行わない\n\n':'1. **Token Reference Mandatory**: All style specifications must use predefined design tokens. No undefined values.\n2. **Undefined Values Prohibited**: Colors/spacing/sizes not in tokens are forbidden (e.g., `#123456`, `13px`, `font-size: 19px`)\n3. **Decoration Addition Prohibited**: Do not add shadows/gradients/animations not in spec\n4. **Layout Modification Prohibited**: Do not change specified grid structure/flexbox layouts\n5. **Component Mapping Compliance**: Use framework standard components, avoid custom implementations\n6. **Consistency Verification**: Check alignment with design tokens before implementation\n7. **No Unsolicited Optimization**: Do not make changes based on \"making it look better\" judgment\n\n');

  designDoc+=(G?'### 基本ルール\n\n':'### Basic Rules\n\n');
  designDoc+=(G?'1. **色**: 必ず定義済みトークンを使用。直接カラーコード（#000 等）を記述しない\n2. **スペーシング**: 4px グリッドに従う (xs/sm/md/lg/xl/2xl)\n3. **タイポグラフィ**: 定義されたスケールのみ使用\n4. **コンポーネント**: 推奨ライブラリから選択（独自実装は最小限）\n5. **ダークモード**: すべてのUI要素でLight/Dark対応を実装\n6. **レスポンシブ**: モバイルファースト設計（最小→最大）\n7. **アクセシビリティ**: ARIA属性、キーボードナビゲーション、コントラスト比 4.5:1 以上\n\n':'1. **Colors**: Always use predefined tokens. Never hardcode colors (#000)\n2. **Spacing**: Follow 4px grid (xs/sm/md/lg/xl/2xl)\n3. **Typography**: Use defined scale only\n4. **Components**: Choose from recommended library (minimize custom)\n5. **Dark Mode**: Implement Light/Dark support for all UI elements\n6. **Responsive**: Mobile-first design (min → max)\n7. **Accessibility**: ARIA attributes, keyboard navigation, contrast ratio ≥ 4.5:1\n\n');

  designDoc+=(G?'### 禁止アクション\n\n':'### Prohibited Actions\n\n');
  designDoc+=(G?'- ❌ トークンにない色を使う（例: `#1a2b3c`）\n- ❌ 独自の余白値（例: `margin: 13px`）\n- ❌ 仕様外のシャドウ追加（例: `box-shadow: 0 8px 16px ...`）\n- ❌ グラデーション追加（例: `background: linear-gradient(...)`）\n- ❌ フォントサイズの独自設定（例: `font-size: 17px`）\n- ❌ コンポーネントライブラリの独自改変\n- ❌ レイアウト構造の変更（例: Grid → Flexbox）\n\n':'- ❌ Using colors not in tokens (e.g., `#1a2b3c`)\n- ❌ Custom spacing values (e.g., `margin: 13px`)\n- ❌ Adding shadows not in spec (e.g., `box-shadow: 0 8px 16px ...`)\n- ❌ Adding gradients (e.g., `background: linear-gradient(...)`)\n- ❌ Custom font sizes (e.g., `font-size: 17px`)\n- ❌ Modifying component library defaults\n- ❌ Changing layout structure (e.g., Grid → Flexbox)\n\n');

  // Figma Design Fidelity Protocol
  designDoc+=(G?'### デザイン忠実度プロトコル（Figma MCP連携）\n\n':'### Design Fidelity Protocol (Figma MCP Integration)\n\n');
  designDoc+=(G?
    '**原則: Design as Single Source of Truth（SSOT）**\n\n'+
    'AIにUIを「ガチャ」させず、Figmaデザインを確定的に再現する。\n\n'+
    '#### ワークフロー\n\n'+
    '1. **Figma MCPサーバー有効化**: `Preferences → Enable local MCP server`\n'+
    '2. **Selection Link取得**: 対象要素を選択 → `Ctrl+L` でリンクコピー\n'+
    '3. **セクション単位実装**: 1セクション=1プロンプトで精度を保つ\n'+
    '4. **Live Preview検証**: VS Code Live Serverで即時確認\n'+
    '5. **反復改善（Vibe Coding）**: 60点→80点→100点の段階的品質向上\n\n'+
    '#### 画像永続化\n\n'+
    '- Figma MCPの画像リンクはアプリ終了で無効化される\n'+
    '- **対策A**: Figmaからエクスポート → ローカル `/images` に保存 → パス書換え\n'+
    '- **対策B**: Unsplash API で永続リンクに差替え\n\n'
    :
    '**Principle: Design as Single Source of Truth (SSOT)**\n\n'+
    'Eliminate "Design Gacha" — reproduce Figma designs deterministically.\n\n'+
    '#### Workflow\n\n'+
    '1. **Enable Figma MCP server**: `Preferences → Enable local MCP server`\n'+
    '2. **Get Selection Link**: Select target element → `Ctrl+L` to copy link\n'+
    '3. **Section-by-section implementation**: 1 section = 1 prompt for accuracy\n'+
    '4. **Live Preview verification**: VS Code Live Server for instant feedback\n'+
    '5. **Iterative refinement (Vibe Coding)**: 60→80→100 point quality improvement\n\n'+
    '#### Image Persistence\n\n'+
    '- Figma MCP image links invalidate when app closes\n'+
    '- **Option A**: Export from Figma → save to local `/images` → rewrite paths\n'+
    '- **Option B**: Replace with Unsplash API persistent links\n\n'
  );

  // Anti-AI Quality Checklist
  designDoc+=(G?'### Anti-AI品質チェックリスト\n\n':'### Anti-AI Quality Checklist\n\n');
  designDoc+=(G?
    '実装完了時に以下を確認し、「AI感」の残存を防止する：\n\n'+
    '- [ ] 全色がデザイントークン経由か（ハードコード `#xxx` がないか）\n'+
    '- [ ] 余白が4pxグリッドに従っているか（13px, 17px等の中途半端な値がないか）\n'+
    '- [ ] アニメーションのイージングが定義済みトークンを使用しているか\n'+
    '- [ ] レスポンシブがモバイルファーストで実装されているか\n'+
    '- [ ] ダークモード切替で全要素が適切に変化するか\n'+
    '- [ ] ホバー/フォーカス状態が全インタラクティブ要素に定義されているか\n'+
    '- [ ] コンポーネントライブラリの標準コンポーネントを使用しているか\n'+
    '- [ ] フォントサイズが定義済みスケールのみか\n'+
    '- [ ] Figmaデザインとのピクセル単位の差異がないか\n\n'
    :
    'Verify these items after implementation to prevent residual "AI look":\n\n'+
    '- [ ] All colors use design tokens (no hardcoded `#xxx`)\n'+
    '- [ ] Spacing follows 4px grid (no awkward values like 13px, 17px)\n'+
    '- [ ] Animation easing uses defined tokens\n'+
    '- [ ] Responsive is mobile-first\n'+
    '- [ ] Dark mode toggle works for all elements\n'+
    '- [ ] Hover/focus states defined for all interactive elements\n'+
    '- [ ] Using component library standard components\n'+
    '- [ ] Font sizes use defined scale only\n'+
    '- [ ] Pixel-perfect match with Figma design\n\n'
  );

  S.files['docs/26_design_system.md']=designDoc;

  // Sequence Diagrams
  let seqDoc='# '+(G?'シーケンス図':'Sequence Diagrams')+'\n\n';
  seqDoc+=G?'**重要**: AIエージェントは、複雑なフローを実装する前にこのシーケンス図を参照してください。\n\n':'**IMPORTANT**: AI agents MUST reference these sequence diagrams before implementing complex flows.\n\n';

  // Auth Flow
  seqDoc+=(G?'## 認証フロー':'## Authentication Flow')+'\n\n```mermaid\nsequenceDiagram\n  participant U as User\n  participant C as Client\n  participant ';
  if(auth.provider==='supabase'){
    seqDoc+='S as Supabase Auth\n  U->>C: '+(G?'ログイン要求':'Login request')+'\n  C->>S: signInWithPassword(email, password)\n  S-->>C: {access_token, refresh_token}\n  C->>C: '+(G?'トークン保存':'Store tokens')+'\n  C->>S: getUser() with access_token\n  S-->>C: User object\n  C-->>U: '+(G?'ダッシュボード表示':'Show dashboard')+'\n```\n\n';
  }else if(auth.provider==='firebase'){
    seqDoc+='F as Firebase Auth\n  U->>C: '+(G?'ログイン要求':'Login request')+'\n  C->>F: signInWithEmailAndPassword()\n  F-->>C: User + ID Token\n  C->>C: '+(G?'トークン保存':'Store token')+'\n  C-->>U: '+(G?'ダッシュボード表示':'Show dashboard')+'\n```\n\n';
  }else if(auth.provider==='authjs'){
    seqDoc+='A as Auth.js\n  U->>C: '+(G?'ログイン要求':'Login request')+'\n  C->>A: signIn("credentials")\n  A->>A: '+(G?'認証情報検証':'Verify credentials')+'\n  A-->>C: Session cookie\n  C-->>U: '+(G?'ダッシュボード表示':'Show dashboard')+'\n```\n\n';
  }else{
    seqDoc+='API as Backend API\n  U->>C: '+(G?'ログイン要求':'Login request')+'\n  C->>API: POST /api/auth/login\n  API->>API: '+(G?'認証情報検証':'Verify credentials')+'\n  API-->>C: {token, user}\n  C->>C: '+(G?'トークン保存':'Store token')+'\n  C-->>U: '+(G?'ダッシュボード表示':'Show dashboard')+'\n```\n\n';
  }

  // CRUD Flow
  if(entities.length>0){
    const firstEntity=entities[0];
    seqDoc+=(G?'## CRUD操作（':'## CRUD Operation (')+firstEntity+(G?'）':')')+'\n\n```mermaid\nsequenceDiagram\n  participant U as User\n  participant C as Client\n  participant ';
    if(arch.isBaaS){
      const baasName=be.includes('Supabase')?'Supabase':be.includes('Firebase')?'Firebase':'Convex';
      seqDoc+=baasName[0]+' as '+baasName+'\n  U->>C: '+(G?'作成ボタンクリック':'Click create button')+'\n  C->>'+baasName[0]+': insert({...data})\n  '+baasName[0]+'-->>C: '+(G?'作成成功':'Created successfully')+'\n  C-->>U: '+(G?'成功通知':'Show success')+'\n  U->>C: '+(G?'一覧表示要求':'Request list')+'\n  C->>'+baasName[0]+': select().eq(...)\n  '+baasName[0]+'-->>C: '+firstEntity+' list\n  C-->>U: '+(G?'一覧表示':'Display list')+'\n```\n\n';
    }else{
      seqDoc+='API as Backend API\n  U->>C: '+(G?'作成ボタンクリック':'Click create button')+'\n  C->>API: POST /api/'+pluralize(firstEntity)+'\n  API->>API: '+(G?'バリデーション':'Validate')+'\n  API->>API: '+(G?'DB保存':'Save to DB')+'\n  API-->>C: '+(G?'作成成功':'201 Created')+'\n  C-->>U: '+(G?'成功通知':'Show success')+'\n```\n\n';
    }

    // Related Entity Operation Flow
    if(entities.length>1){
      const ent1=entities[0];
      const ent2=entities[1];
      seqDoc+=(G?'## 関連エンティティ操作（':'## Related Entity Operation (')+ent1+' ↔ '+ent2+(G?'）':')')+'\n\n```mermaid\nsequenceDiagram\n  participant U as User\n  participant C as Client\n  participant API as Backend\n  U->>C: '+(G?ent1+'を選択':('Select '+ent1))+'\n  C->>API: GET /api/'+pluralize(ent1)+'/:id\n  API-->>C: '+ent1+' '+(G?'詳細':'details')+'\n  C->>API: GET /api/'+pluralize(ent1)+'/:id/'+pluralize(ent2)+'\n  API-->>C: '+(G?'関連する':'Related ')+ent2+' list\n  C-->>U: '+(G?'関連データ表示':'Display related data')+'\n  U->>C: '+(G?ent2+'を追加':('Add '+ent2))+'\n  C->>API: POST /api/'+pluralize(ent2)+'\n  API->>API: '+(G?ent1+'との関連付け':('Associate with '+ent1))+'\n  API-->>C: '+(G?'作成成功':'201 Created')+'\n  C-->>U: '+(G?'更新完了':'Updated')+'\n```\n\n';
    }
  }

  // Domain-specific Sequence Flow
  const dsf=DOMAIN_SEQ_FLOWS[domain];
  if(dsf){
    seqDoc+=(G?'## '+dsf.nj:'## '+dsf.ne)+'\n\n```mermaid\nsequenceDiagram\n  participant U as User\n  participant C as Client\n  participant API as Backend\n';
    dsf.steps.forEach(step=>{
      const [from,to,actJ,actE]=step;
      seqDoc+='  '+from+'->>'+to+': '+(G?actJ:actE)+'\n';
    });
    seqDoc+='```\n\n';
  }

  // Payment Flow (if Stripe)
  if(hasPay&&(a.payment||'').includes('Stripe')){
    seqDoc+=(G?'## 決済フロー（Stripe）':'## Payment Flow (Stripe)')+'\n\n```mermaid\nsequenceDiagram\n  participant U as User\n  participant C as Client\n  participant API as Backend\n  participant S as Stripe\n  participant W as Webhook\n  U->>C: '+(G?'プラン選択':'Select plan')+'\n  C->>API: POST /api/checkout\n  API->>S: stripe.checkout.sessions.create()\n  S-->>API: session_id\n  API-->>C: {session_id}\n  C->>S: '+(G?'Checkoutページへリダイレクト':'Redirect to Checkout')+'\n  U->>S: '+(G?'カード情報入力':'Enter card info')+'\n  S->>W: webhook: checkout.session.completed\n  W->>W: '+(G?'DB更新（サブスク作成）':'Update DB (create subscription)')+'\n  W-->>S: 200 OK\n  S-->>U: '+(G?'完了ページへリダイレクト':'Redirect to success page')+'\n```\n\n';
  }

  // Error Handling
  seqDoc+=(G?'## エラーハンドリング':'## Error Handling')+'\n\n```mermaid\nsequenceDiagram\n  participant C as Client\n  participant API as Backend\n  C->>API: '+(G?'リクエスト':'Request')+'\n  API-->>C: 400/401/403/500\n  C->>C: '+(G?'エラーメッセージ抽出':'Parse error message')+'\n  C->>C: '+(G?'トースト表示':'Show toast notification')+'\n  alt '+(G?'401 認証エラー':'401 Unauthorized')+'\n    C->>C: '+(G?'ログイン画面へリダイレクト':'Redirect to login')+'\n  else '+(G?'5xx サーバーエラー':'5xx Server Error')+'\n    C->>C: '+(G?'リトライボタン表示':'Show retry button')+'\n  end\n```\n\n';

  S.files['docs/27_sequence_diagrams.md']=seqDoc;
}
