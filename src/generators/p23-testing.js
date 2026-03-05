// P23: Testing Intelligence
// Generates: docs/91_testing_strategy.md, 92_coverage_design.md,
//            93_e2e_test_architecture.md, 94_performance_testing.md

// ============================================================================
// DATA CONSTANTS
// ============================================================================

var TEST_PYRAMID=[
  {layer:'Unit',ja:'ユニットテスト',ratio:'70%',ja_goal:'関数・クラス単位の論理検証',en_goal:'Verify logic at function/class level',ja_tool:'Jest / Vitest / pytest / JUnit',en_tool:'Jest / Vitest / pytest / JUnit'},
  {layer:'Integration',ja:'統合テスト',ratio:'20%',ja_goal:'API・DB・外部サービス連携の検証',en_goal:'Verify API, DB, external service integration',ja_tool:'Supertest / pytest / RestAssured',en_tool:'Supertest / pytest / RestAssured'},
  {layer:'E2E',ja:'E2Eテスト',ratio:'10%',ja_goal:'ユーザーフロー全体の動作確認',en_goal:'Verify full user flows end-to-end',ja_tool:'Playwright / Cypress',en_tool:'Playwright / Cypress'},
];

var COVERAGE_TOOLS={
  node:{tool:'Istanbul (nyc) / V8 Coverage',config:'jest.config.js: coverageProvider',ja_cmd:'jest --coverage',en_cmd:'jest --coverage'},
  python:{tool:'pytest-cov + coverage.py',config:'pytest.ini: addopts = --cov',ja_cmd:'pytest --cov=app --cov-report=xml',en_cmd:'pytest --cov=app --cov-report=xml'},
  java:{tool:'JaCoCo',config:'build.gradle: jacocoTestReport',ja_cmd:'./gradlew test jacocoTestReport',en_cmd:'./gradlew test jacocoTestReport'},
};

var COVERAGE_TARGETS=[
  {layer:'Unit',ja:'ビジネスロジック層',en:'Business logic layer',target:'≥ 80%',ja_note:'ユーティリティ・ヘルパーも含む',en_note:'Include utilities and helpers'},
  {layer:'Integration',ja:'APIエンドポイント',en:'API endpoints',target:'≥ 60%',ja_note:'ハッピーパス + 主要エラーケース',en_note:'Happy path + major error cases'},
  {layer:'E2E',ja:'クリティカルパス',en:'Critical paths',target:'主要フロー100%',en_target:'Key flows 100%',ja_note:'ログイン・決済・コアCRUD',en_note:'Login, payment, core CRUD'},
];

var E2E_PATTERNS=[
  {id:'pom',ja:'Page Object Model (POM)',en:'Page Object Model (POM)',
   ja_desc:'ページのUI操作をクラスに集約し、テストの保守性を高める',
   en_desc:'Encapsulate page UI interactions in classes for maintainability'},
  {id:'fixtures',ja:'フィクスチャ管理',en:'Fixture Management',
   ja_desc:'テストデータをfixturesフォルダに集約。テスト間の独立性を保つ',
   en_desc:'Centralize test data in fixtures folder. Maintain test isolation'},
  {id:'selectors',ja:'セレクター戦略',en:'Selector Strategy',
   ja_desc:'data-testid属性を使用。CSSクラスや文言に依存しない',
   en_desc:'Use data-testid attributes. Avoid CSS class or text dependencies'},
];

var WEB_VITALS=[
  {metric:'LCP',name:'Largest Contentful Paint',good:'≤ 2.5s',needs:'≤ 4.0s',poor:'> 4.0s',
   ja_tip:'画像の最適化・サーバーレスポンス改善・CDN活用',en_tip:'Optimize images, server response time, use CDN'},
  {metric:'INP',name:'Interaction to Next Paint',good:'≤ 200ms',needs:'≤ 500ms',poor:'> 500ms',
   ja_tip:'JavaScriptの実行時間削減・長いタスクを分割',en_tip:'Reduce JS execution time, split long tasks'},
  {metric:'CLS',name:'Cumulative Layout Shift',good:'≤ 0.1',needs:'≤ 0.25',poor:'> 0.25',
   ja_tip:'画像・広告にwidth/height指定。動的コンテンツの領域確保',en_tip:'Specify width/height for images/ads. Reserve space for dynamic content'},
];

/* Domain-specific test strategies */
var DOMAIN_TEST_EXTRA={
  fintech:{
    cov_ja:['決済フロー (Payment Flow) → ≥95% カバレッジ必須','トランザクション分離 (Serializable) の境界値テスト','AML/KYCルールのユニットテスト完全カバー','認証2段階フローの全パスカバー'],
    cov_en:['Payment flow coverage ≥ 95% required','Transaction isolation (Serializable) boundary tests','Full unit coverage for AML/KYC rules','Full coverage for 2FA auth flow'],
    e2e_ja:['支払い完了フロー (Stripe/card → success/failure)','認証2FA フロー (TOTP/SMS)','取引履歴ページネーションのE2E','不正検知アラートのUI確認'],
    e2e_en:['Payment checkout flow (success/failure)','2FA authentication flow (TOTP/SMS)','Transaction history pagination E2E','Fraud alert UI validation'],
    perf_ja:['同時決済 100並列 → エラー率 < 0.1% 目標','タイムアウト設定: 決済API 5s / 認証API 2s','DB ロックタイムアウト境界値テスト'],
    perf_en:['100 concurrent payments → error rate < 0.1%','Timeout: payment API 5s / auth API 2s','DB lock timeout boundary test']},
  health:{
    cov_ja:['患者記録CRUD → 100% カバレッジ','同意管理フロー (Consent) の境界値テスト','PHIアクセスログ記録の完全テスト','HIPAA監査トレイル生成の検証'],
    cov_en:['Patient record CRUD → 100% coverage','Consent management flow boundary tests','PHI access log recording full test','HIPAA audit trail generation validation'],
    e2e_ja:['患者記録作成→参照→更新→論理削除フロー','診断書・処方箋PDFダウンロードE2E','権限別アクセス制御 (医師/看護師/患者) の検証'],
    e2e_en:['Patient record create→read→update→soft-delete flow','Medical report PDF download E2E','Role-based access control (doctor/nurse/patient) validation'],
    perf_ja:['EMRクエリ P95 ≤ 500ms (1000レコード)','同時200セッション接続テスト','バックアップ/リストア時間計測'],
    perf_en:['EMR query P95 ≤ 500ms (1000 records)','Concurrent 200 session load test','Backup/restore time measurement']},
  ec:{
    cov_ja:['カート操作→在庫管理連携 → ≥90% カバレッジ','在庫0時の注文防止ロジック (オーバーセル防止) の完全テスト','決済Webhookハンドラのユニットテスト'],
    cov_en:['Cart→inventory integration coverage ≥ 90%','Oversell prevention logic full unit coverage','Payment webhook handler unit tests'],
    e2e_ja:['カート追加→決済→注文確認メールフロー','在庫切れ商品の購入不可確認','クーポン適用→割引額計算→決済フロー'],
    e2e_en:['Add to cart→checkout→order confirmation email flow','Out-of-stock purchase prevention check','Coupon apply→discount calc→checkout flow'],
    perf_ja:['フラッシュセール模擬: 10K同時リクエスト → 在庫競合テスト','商品一覧ページ: P95 ≤ 1s (1000商品)'],
    perf_en:['Flash sale simulation: 10K concurrent requests → inventory contention','Product listing page: P95 ≤ 1s (1000 items)']},
  ai:{
    cov_ja:['LLMレスポンスパーサー → ≥85% カバレッジ','プロンプトインジェクション防御ロジックの完全テスト','RAGパイプラインのユニットテスト (モック使用)'],
    cov_en:['LLM response parser coverage ≥ 85%','Prompt injection defense logic full coverage','RAG pipeline unit tests (with mocks)'],
    e2e_ja:['チャット送信→ストリーミングレスポンスのE2E','API タイムアウト処理 (30s超過) の確認','会話履歴の永続化と復元フロー'],
    e2e_en:['Chat send→streaming response E2E','API timeout handling (>30s) validation','Conversation history persistence and restore flow'],
    perf_ja:['LLM API レイテンシ P95 ≤ 5s (ストリーミング除く)','同時チャット 50セッション→エラー率 < 1%'],
    perf_en:['LLM API latency P95 ≤ 5s (excl. streaming)','50 concurrent chat sessions → error rate < 1%']},
  education:{
    cov_ja:['コース完了フロー → ≥90% カバレッジ','受講者進捗計算ロジックの完全テスト','クイズ/テスト採点エンジンのユニットテスト','LMS API認証・権限チェックのテスト'],
    cov_en:['Course completion flow coverage ≥ 90%','Learner progress calculation logic full coverage','Quiz/test scoring engine unit tests','LMS API auth and permission check tests'],
    e2e_ja:['コース受講開始→進捗更新→修了証発行フロー','クイズ回答→採点→成績記録フロー','受講者ダッシュボード表示・フィルタのE2E','期限切れコースのアクセス制限確認'],
    e2e_en:['Course enroll→progress→certificate issuance flow','Quiz answer→score→grade recording flow','Learner dashboard display and filter E2E','Expired course access restriction check'],
    perf_ja:['同時1000受講者→動画ストリーミング安定性テスト','クイズ一斉開始 (500並列) → P95 ≤ 2s'],
    perf_en:['1000 concurrent learners → video streaming stability','Mass quiz start (500 parallel) → P95 ≤ 2s']},
  saas:{
    cov_ja:['テナント分離ロジック → 100% カバレッジ','プラン変更・ダウングレードの課金計算テスト','APIクォータ計量・超過検知ロジックのテスト','マルチテナントRLS境界値テスト'],
    cov_en:['Tenant isolation logic → 100% coverage','Plan upgrade/downgrade billing calculation tests','API quota metering and overage detection tests','Multi-tenant RLS boundary tests'],
    e2e_ja:['テナント作成→メンバー招待→権限確認フロー','プラン変更→請求更新→機能制限切替のE2E','APIキー発行→クォータ管理→超過アラートフロー','テナントAのデータがテナントBから見えないことの確認'],
    e2e_en:['Tenant create→member invite→permission check flow','Plan change→billing update→feature limit switch E2E','API key issue→quota management→overage alert flow','Verify tenant A data not visible from tenant B'],
    perf_ja:['10テナント同時APIリクエスト → テナント間干渉なし確認','クォータ集計クエリ P95 ≤ 200ms (1万テナント規模)'],
    perf_en:['10 tenants concurrent API requests → no cross-tenant interference','Quota aggregation query P95 ≤ 200ms (10K tenant scale)']},
  booking:{
    cov_ja:['予約競合検出ロジック (ダブルブッキング防止) → 100%','キャンセル・返金計算ロジックの完全テスト','カレンダー同期・空室計算アルゴリズムのテスト'],
    cov_en:['Booking conflict detection (double booking prevention) → 100%','Cancellation and refund calculation logic full coverage','Calendar sync and availability calculation tests'],
    e2e_ja:['空室検索→予約確定→確認メール送信フロー','同時予約競合 (2ユーザー同一枠) → 一方のみ成功確認','キャンセル→返金ポリシー適用→払戻処理フロー','カレンダー連携 (Google/iCal) 同期確認'],
    e2e_en:['Availability search→booking confirm→email notification flow','Concurrent booking conflict (2 users, same slot) → only one succeeds','Cancel→refund policy apply→refund processing flow','Calendar sync (Google/iCal) verification'],
    perf_ja:['フラッシュセール予約: 500並列→先着処理のデータ整合性確認','空室検索クエリ P95 ≤ 500ms (6ヶ月先まで)'],
    perf_en:['Flash sale booking: 500 parallel → first-come data integrity check','Availability query P95 ≤ 500ms (6 months ahead)']},
  logistics:{
    cov_ja:['配送ステータス状態遷移ロジック → 100%','ルート最適化アルゴリズムのユニットテスト','在庫引当・引落処理の境界値テスト'],
    cov_en:['Delivery status state transition logic → 100%','Route optimization algorithm unit tests','Inventory allocation and deduction boundary tests'],
    e2e_ja:['注文受付→ピッキング→発送→配達完了フロー','配送遅延アラート発報→顧客通知E2E','ドライバーアプリ: 配達確認→署名取得→完了フロー','返品受付→在庫戻し→払戻処理フロー'],
    e2e_en:['Order receive→picking→shipment→delivery complete flow','Delivery delay alert→customer notification E2E','Driver app: delivery confirm→signature→complete flow','Return receive→stock restore→refund flow'],
    perf_ja:['日次バッチ配送ルート最適化: 1000件/分 処理能力テスト','リアルタイム位置更新: 500台同時→P95 ≤ 300ms'],
    perf_en:['Daily batch route optimization: 1000 orders/min throughput','Real-time location update: 500 vehicles concurrent → P95 ≤ 300ms']},
  manufacturing:{
    cov_ja:['生産計画→実績差異計算ロジック → 100%','品質検査合否判定アルゴリズムのテスト','OEE計算 (稼働率×性能率×品質率) の検証'],
    cov_en:['Production plan vs actual deviation logic → 100%','Quality inspection pass/fail algorithm tests','OEE calculation (availability×performance×quality) validation'],
    e2e_ja:['作業指示発行→生産実績登録→OEE算出フロー','不良品検出→ロット隔離→是正処置フロー','設備故障アラート→保全作業票発行→復旧確認'],
    e2e_en:['Work order issue→production actuals→OEE calculation flow','Defect detect→lot quarantine→corrective action flow','Equipment failure alert→maintenance order→recovery confirm'],
    perf_ja:['センサーデータ収集: 10000点/秒の取込みテスト','OEEダッシュボード更新 P95 ≤ 1s (1000設備)'],
    perf_en:['Sensor data ingestion: 10000 points/sec throughput test','OEE dashboard update P95 ≤ 1s (1000 machines)']},
  hr:{
    cov_ja:['勤怠打刻バリデーション (二重打刻防止) → 100%','給与計算ロジック (残業/深夜/休日割増) の完全テスト','有給残日数計算・繰越ロジックのテスト'],
    cov_en:['Attendance punch validation (double punch prevention) → 100%','Payroll calculation (overtime/late-night/holiday premium) full coverage','Paid leave balance and carryover logic tests'],
    e2e_ja:['出勤打刻→勤務時間集計→勤怠確認申請フロー','給与計算実行→明細生成→承認ワークフロー','有給申請→残日数チェック→上長承認→カレンダー反映'],
    e2e_en:['Clock-in→work hours aggregation→attendance confirm flow','Payroll run→payslip generation→approval workflow','Leave request→balance check→manager approve→calendar update'],
    perf_ja:['月次給与一括計算: 1000名/30秒以内','勤怠集計レポート P95 ≤ 2s (年次データ)'],
    perf_en:['Monthly batch payroll: 1000 employees within 30 seconds','Attendance aggregation report P95 ≤ 2s (annual data)']},
  realestate:{
    cov_ja:['物件検索フィルタロジック → ≥90%','仲介手数料計算 (上限規定込み) の完全テスト','契約書生成テンプレートエンジンのテスト'],
    cov_en:['Property search filter logic ≥ 90%','Brokerage commission calculation (cap rules) full coverage','Contract document generation template engine tests'],
    e2e_ja:['物件検索→詳細閲覧→内覧予約フロー','申込→審査→契約書生成→電子署名フロー','仲介手数料見積→契約成立→請求書発行フロー'],
    e2e_en:['Property search→detail view→showing reservation flow','Application→screening→contract generation→e-signature flow','Commission estimate→deal close→invoice generation flow'],
    perf_ja:['物件検索クエリ P95 ≤ 500ms (100万件)','地図ビュー: 同時500ユーザー→タイル取得 P95 ≤ 1s'],
    perf_en:['Property search query P95 ≤ 500ms (1M listings)','Map view: 500 concurrent users → tile fetch P95 ≤ 1s']},
  insurance:{
    cov_ja:['リスクスコアリングアルゴリズム → 100%','保険金請求バリデーション (二重請求防止) の完全テスト','引受判断ロジック (ルールエンジン) のユニットテスト'],
    cov_en:['Risk scoring algorithm → 100%','Insurance claim validation (duplicate claim prevention) full coverage','Underwriting decision logic (rule engine) unit tests'],
    e2e_ja:['見積入力→リスク算出→申込→引受判断フロー','事故報告→請求審査→支払承認→振込処理フロー','保険料改定→既契約への適用→通知送信フロー'],
    e2e_en:['Quote input→risk calculation→application→underwriting flow','Incident report→claim review→payment approval→transfer flow','Premium revision→apply to existing contracts→notification flow'],
    perf_ja:['リスクスコアリング P95 ≤ 300ms (複合条件100項目)','請求一括審査バッチ: 1000件/時間'],
    perf_en:['Risk scoring P95 ≤ 300ms (100 composite conditions)','Batch claim review: 1000 claims/hour']},
  government:{
    cov_ja:['申請ステータス遷移ロジック → 100%','個人情報マスキング/匿名化処理の完全テスト','WCAG 2.1 AAアクセシビリティ自動検査 (axe-core)'],
    cov_en:['Application status transition logic → 100%','PII masking/anonymization logic full coverage','WCAG 2.1 AA accessibility automated check (axe-core)'],
    e2e_ja:['市民申請→受付確認→審査→決定通知フロー','電子署名・本人確認フローのE2E','書類アップロード→ウイルスチェック→保存フロー'],
    e2e_en:['Citizen application→receipt→review→decision notification flow','Electronic signature and identity verification E2E','Document upload→virus check→storage flow'],
    perf_ja:['確定申告ピーク: 10K同時接続→P95 ≤ 3s','証明書発行バッチ: 5000件/時間処理能力'],
    perf_en:['Tax season peak: 10K concurrent → P95 ≤ 3s','Certificate issuance batch: 5000/hour throughput']},
  legal:{
    cov_ja:['文書バージョン単調増加バリデーション → 100%','電子署名検証ロジックの完全テスト','アクセス権限暗黙拒否ロジックのユニットテスト'],
    cov_en:['Document version monotonic increase validation → 100%','E-signature verification logic full coverage','Access permission implicit deny logic unit tests'],
    e2e_ja:['契約書作成→条項編集→署名依頼→締結フロー','文書共有権限管理→閲覧ログ記録のE2E','期限切れ契約のアクセス無効化確認'],
    e2e_en:['Contract create→clause edit→signature request→execution flow','Document sharing permissions→access log recording E2E','Expired contract access invalidation check'],
    perf_ja:['契約書全文検索 P95 ≤ 1s (10万件)','電子署名検証 P95 ≤ 500ms (RSA-2048)'],
    perf_en:['Contract full-text search P95 ≤ 1s (100K docs)','E-signature verification P95 ≤ 500ms (RSA-2048)']},
  iot:{
    cov_ja:['センサーデータバリデーション (範囲チェック) → 100%','デバイス認証フローの完全テスト','エッジ→クラウド同期ロジックのユニットテスト'],
    cov_en:['Sensor data validation (range check) → 100%','Device authentication flow full coverage','Edge-to-cloud sync logic unit tests'],
    e2e_ja:['デバイス登録→ファームウェア更新→ステータス確認フロー','アラート閾値超過→通知→自動復旧フロー','オフライン時のデータバッファリング→再接続時同期確認'],
    e2e_en:['Device register→firmware update→status check flow','Alert threshold exceed→notification→auto-recovery flow','Offline data buffering→sync on reconnect verification'],
    perf_ja:['センサーデータ取込 P95 ≤ 100ms (10K デバイス同時)','アラート処理: 100件/秒→P95 ≤ 500ms'],
    perf_en:['Sensor data ingestion P95 ≤ 100ms (10K devices concurrent)','Alert processing: 100/sec → P95 ≤ 500ms']},
  energy:{
    cov_ja:['電力バランス計算ロジック → 100%','安全閾値バリデーション (緊急停止連動) の完全テスト','排出量レポート計算のユニットテスト'],
    cov_en:['Power balance calculation logic → 100%','Safety threshold validation (emergency stop) full coverage','Emissions report calculation unit tests'],
    e2e_ja:['電力需要予測→供給計画→グリッド制御フロー','再生可能エネルギー超過→蓄電→放電サイクルE2E','障害検知→自動遮断→復旧通知フロー'],
    e2e_en:['Power demand forecast→supply plan→grid control flow','Renewable surplus→storage→discharge cycle E2E','Fault detection→auto shutdown→recovery notification flow'],
    perf_ja:['グリッド状態更新 P95 ≤ 50ms (リアルタイム制御)','年次エネルギーレポート生成: ≤ 30秒'],
    perf_en:['Grid state update P95 ≤ 50ms (real-time control)','Annual energy report generation: ≤ 30 seconds']},
  travel:{
    cov_ja:['旅行代金計算ロジック (税込/シーズン変動) → 100%','二重予約防止ロジックの完全テスト','キャンセルポリシー適用計算のユニットテスト'],
    cov_en:['Travel price calculation (tax/seasonal) → 100%','Double booking prevention logic full coverage','Cancellation policy application calculation unit tests'],
    e2e_ja:['フライト+ホテル検索→選択→決済→確認書発行フロー','同時予約競合 (2ユーザー同一座席) → 一方のみ成功確認','旅程変更→差額計算→再決済→更新通知フロー'],
    e2e_en:['Flight+hotel search→select→payment→voucher issue flow','Concurrent booking conflict (2 users same seat) → only one succeeds','Itinerary change→price diff→repayment→update notification flow'],
    perf_ja:['フライト検索 P95 ≤ 1s (全路線)','ピーク予約期: 1K同時ユーザー→エラー率 < 0.5%'],
    perf_en:['Flight search P95 ≤ 1s (all routes)','Peak booking: 1K concurrent users → error rate < 0.5%']},
  agriculture:{
    cov_ja:['収穫量バリデーション (非負整数) → 100%','農薬使用量上限チェックロジックの完全テスト','作付けスケジュール競合検出のユニットテスト'],
    cov_en:['Harvest quantity validation (non-negative) → 100%','Pesticide usage limit check logic full coverage','Crop schedule conflict detection unit tests'],
    e2e_ja:['圃場登録→作付計画→センサー監視→収穫記録フロー','農薬散布→使用量記録→法定上限アラートE2E','収穫量レポート生成→農業共済申請連携フロー'],
    e2e_en:['Field register→crop plan→sensor monitor→harvest record flow','Pesticide application→usage log→legal limit alert E2E','Harvest report generation→agriculture mutual aid linkage flow'],
    perf_ja:['センサーデータ収集: 500センサー同時→P95 ≤ 200ms','年次農業報告書生成: ≤ 60秒'],
    perf_en:['Sensor data collection: 500 sensors concurrent → P95 ≤ 200ms','Annual farm report generation: ≤ 60 seconds']},
  media:{
    cov_ja:['コンテンツ権限チェックロジック → 100%','視聴ログ記録の完全テスト','サブスクリプション有効期限バリデーションのユニットテスト'],
    cov_en:['Content permission check logic → 100%','View log recording full coverage','Subscription expiry validation unit tests'],
    e2e_ja:['コンテンツ登録→著作権チェック→公開承認→配信フロー','サブスク登録→決済→コンテンツアクセス解放フロー','コンテンツ検索→推薦→視聴→進捗保存フロー'],
    e2e_en:['Content register→copyright check→publication approval→delivery flow','Subscribe→payment→content access unlock flow','Content search→recommend→view→progress save flow'],
    perf_ja:['動画ストリーミング: 500同時視聴→バッファリングなし確認','コンテンツ検索 P95 ≤ 500ms (100万コンテンツ)'],
    perf_en:['Video streaming: 500 concurrent views → no buffering','Content search P95 ≤ 500ms (1M content items)']},
};

// ============================================================================
// HELPERS
// ============================================================================

function _testFE(a){
  var fe=a.frontend||'';
  if(/Next/i.test(fe)) return 'nextjs';
  if(/Vite|CRA/i.test(fe)) return 'react';
  if(/Vue|Nuxt/i.test(fe)) return 'vue';
  if(/Svelte|SvelteKit/i.test(fe)) return 'svelte';
  if(/Astro/i.test(fe)) return 'astro';
  return 'react';
}

function _testBE(a){
  var be=a.backend||'';
  if(/Python|FastAPI|Django/i.test(be)) return 'python';
  if(/Spring|Java/i.test(be)) return 'java';
  if(/Supabase|Firebase|Convex/i.test(be)) return 'baas';
  return 'node';
}

function _unitFramework(feType, beType, G){
  if(beType==='python') return G?'pytest + pytest-asyncio (非同期対応)':'pytest + pytest-asyncio (async support)';
  if(beType==='java') return G?'JUnit 5 + Mockito + AssertJ':'JUnit 5 + Mockito + AssertJ';
  if(feType==='vue'||feType==='svelte') return 'Vitest + @testing-library';
  return 'Jest + @testing-library/react';
}

// ============================================================================
// GENERATOR
// ============================================================================

function genPillar23_TestingIntelligence(a,pn){
  var G=S.genLang==='ja';
  var feType=_testFE(a);
  var beType=_testBE(a);
  gen91(a,pn,G,feType,beType);
  gen92(a,pn,G,feType,beType);
  gen93(a,pn,G,feType,beType);
  gen94(a,pn,G,feType,beType);
}

// doc 91: Testing Strategy
function gen91(a,pn,G,feType,beType){
  var unitFw=_unitFramework(feType,beType,G);
  var isBaaS=beType==='baas';
  var isPy=beType==='python';
  var isJava=beType==='java';
  var lv91=S.skillLv||0; var isPro91=lv91>=5; var isBeg91=lv91<=1;

  var doc='';
  doc+='# '+(G?'テスト戦略':'Testing Strategy')+'\n\n';
  doc+=(G
    ?'> **プロジェクト**: '+pn+' | **フロントエンド**: '+(a.frontend||'N/A')+' | **バックエンド**: '+(a.backend||'N/A')+'\n\n'
    :'> **Project**: '+pn+' | **Frontend**: '+(a.frontend||'N/A')+' | **Backend**: '+(a.backend||'N/A')+'\n\n'
  );

  // Test pyramid
  doc+='## '+(G?'テストピラミッド':'Test Pyramid')+'\n\n';
  doc+='| '+(G?'層':'Layer')+' | '+(G?'割合':'Ratio')+' | '+(G?'目的':'Goal')+' | '+(G?'ツール':'Tools')+' |\n';
  doc+='|------|--------|------|------|\n';
  TEST_PYRAMID.forEach(function(t){
    doc+='| '+(G?t.ja:t.layer)+' | '+t.ratio+' | '+(G?t.ja_goal:t.en_goal)+' | '+(G?t.ja_tool:t.en_tool)+' |\n';
  });
  doc+='\n';

  // Framework selection
  doc+='## '+(G?'推奨テストフレームワーク':'Recommended Test Frameworks')+'\n\n';

  // Frontend
  doc+='### '+(G?'フロントエンド ('+feType.toUpperCase()+')':'Frontend ('+feType.toUpperCase()+')')+'\n\n';
  if(feType==='nextjs'){
    doc+='```bash\n# Install\nnpm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom\n\n# Or Vitest (faster, Vite-native)\nnpm install -D vitest @testing-library/react @testing-library/jest-dom jsdom\n```\n\n';
    doc+='```typescript\n// __tests__/components/Button.test.tsx\nimport { render, screen, fireEvent } from \'@testing-library/react\';\nimport Button from \'@/components/Button\';\n\ndescribe(\'Button\', () => {\n  it(\'renders with label\', () => {\n    render(<Button label="Click me" onClick={jest.fn()} />);\n    expect(screen.getByText(\'Click me\')).toBeInTheDocument();\n  });\n\n  it(\'calls onClick when clicked\', () => {\n    const handleClick = jest.fn();\n    render(<Button label="Click me" onClick={handleClick} />);\n    fireEvent.click(screen.getByText(\'Click me\'));\n    expect(handleClick).toHaveBeenCalledTimes(1);\n  });\n});\n```\n\n';
  } else if(feType==='vue'){
    doc+='```bash\nnpm install -D vitest @vue/test-utils @testing-library/vue jsdom\n```\n\n';
    doc+='```typescript\n// tests/unit/MyComponent.test.ts\nimport { mount } from \'@vue/test-utils\';\nimport MyComponent from \'@/components/MyComponent.vue\';\n\ndescribe(\'MyComponent\', () => {\n  it(\'renders slot content\', () => {\n    const wrapper = mount(MyComponent, {\n      slots: { default: \'Hello\' }\n    });\n    expect(wrapper.text()).toContain(\'Hello\');\n  });\n});\n```\n\n';
  } else {
    doc+='```bash\n# Vitest (Vite projects)\nnpm install -D vitest @testing-library/react @testing-library/jest-dom jsdom\n```\n\n';
    doc+='```typescript\n// src/__tests__/App.test.tsx\nimport { render, screen } from \'@testing-library/react\';\nimport { describe, it, expect } from \'vitest\';\nimport App from \'../App\';\n\ndescribe(\'App\', () => {\n  it(\'renders headline\', () => {\n    render(<App />);\n    expect(screen.getByRole(\'heading\')).toBeInTheDocument();\n  });\n});\n```\n\n';
  }

  // Backend
  doc+='### '+(G?'バックエンド':'Backend')+'\n\n';
  if(isPy){
    doc+='```bash\npip install pytest pytest-asyncio httpx pytest-cov\n```\n\n';
    doc+='```python\n# tests/test_api.py\nimport pytest\nfrom httpx import AsyncClient\nfrom app.main import app\n\n@pytest.mark.asyncio\nasync def test_health_check():\n    async with AsyncClient(app=app, base_url="http://test") as ac:\n        response = await ac.get("/health")\n    assert response.status_code == 200\n    assert response.json()["status"] == "ok"\n\n@pytest.mark.asyncio\nasync def test_create_user(db_session):\n    async with AsyncClient(app=app, base_url="http://test") as ac:\n        response = await ac.post("/users", json={"email": "test@example.com", "name": "Test"})\n    assert response.status_code == 201\n    assert response.json()["email"] == "test@example.com"\n```\n\n';
  } else if(isJava){
    doc+='```java\n// src/test/java/com/example/UserControllerTest.java\n@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)\n@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)\nclass UserControllerTest {\n    @Autowired\n    private TestRestTemplate restTemplate;\n\n    @Test\n    void shouldCreateUser() {\n        var request = new CreateUserRequest("test@example.com", "Test User");\n        var response = restTemplate.postForEntity("/api/users", request, UserDto.class);\n        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);\n        assertThat(response.getBody().email()).isEqualTo("test@example.com");\n    }\n}\n```\n\n';
  } else if(isBaaS){
    doc+=(G
      ?'BaaS構成ではサーバーレスロジックのユニットテストに集中します。\n\n'
      :'For BaaS architecture, focus unit tests on serverless logic and edge functions.\n\n'
    );
    doc+='```typescript\n// tests/functions/processOrder.test.ts\nimport { describe, it, expect, vi } from \'vitest\';\nimport { processOrder } from \'../functions/processOrder\';\n\ndescribe(\'processOrder\', () => {\n  it(\'validates required fields\', async () => {\n    await expect(processOrder({ userId: \'\', items: [] })).rejects.toThrow(\'userId is required\');\n  });\n\n  it(\'calculates total correctly\', async () => {\n    const result = await processOrder({ userId: \'u1\', items: [{ price: 100, qty: 2 }] });\n    expect(result.total).toBe(200);\n  });\n});\n```\n\n';
  } else {
    doc+='```bash\nnpm install -D jest @types/jest supertest @types/supertest ts-jest\n```\n\n';
    doc+='```typescript\n// tests/integration/users.test.ts\nimport request from \'supertest\';\nimport app from \'../../src/app\';\nimport { db } from \'../../src/db\';\n\nafterAll(async () => { await db.$disconnect(); });\n\ndescribe(\'POST /api/users\', () => {\n  it(\'creates a user and returns 201\', async () => {\n    const res = await request(app)\n      .post(\'/api/users\')\n      .send({ email: \'test@example.com\', name: \'Test\' });\n    expect(res.status).toBe(201);\n    expect(res.body.email).toBe(\'test@example.com\');\n  });\n\n  it(\'returns 400 for duplicate email\', async () => {\n    const res = await request(app)\n      .post(\'/api/users\')\n      .send({ email: \'existing@example.com\' });\n    expect(res.status).toBe(400);\n  });\n});\n```\n\n';
  }

  // TDD workflow
  doc+='## '+(G?'TDD ワークフロー (AI駆動)':'TDD Workflow (AI-Driven)')+'\n\n';
  doc+='```\n';
  doc+=(G
    ?'1. RED   — 失敗するテストを先に書く (Claude Code に仕様を渡す)\n2. GREEN — 最小限のコードでテストを通す\n3. REFACTOR — テストを維持しながらコードを改善\n4. COMMIT — CI が GREEN のときのみコミット\n'
    :'1. RED   — Write failing tests first (pass spec to Claude Code)\n2. GREEN — Write minimal code to pass tests\n3. REFACTOR — Improve code while keeping tests green\n4. COMMIT — Commit only when CI is GREEN\n'
  );
  doc+='```\n\n';

  // Beginner: テスト実行ベストプラクティス
  if(isBeg91){
    doc+='## '+(G?'🌱 テスト基本プラクティス (Beginner)':'🌱 Testing Basic Practices (Beginner)')+'\n\n';
    var begPractices=G
      ?['**AAAパターン**: Arrange (準備) → Act (実行) → Assert (検証) の順に書く','**テスト粒度**: 1テスト = 1つの振る舞いのみ検証する','**命名規則**: `it(\'should [動詞] when [条件]\')` 形式で意図を明示する','**独立性**: テスト間でデータを共有しない。各テストで独自のセットアップを行う','**外部依存はモック**: DB/API/ファイルシステムはモックやスタブで置き換える']
      :['**AAA Pattern**: Arrange (setup) → Act (execute) → Assert (verify) order','**Test Granularity**: 1 test = verify exactly 1 behavior','**Naming**: Use `it(\'should [verb] when [condition]\')` to state intent clearly','**Independence**: Never share data between tests. Each test sets up its own state','**Mock external deps**: Replace DB/API/filesystem with mocks or stubs'];
    begPractices.forEach(function(p){doc+='- '+p+'\n';});
    doc+='\n';
  }

  // Pro: Contract Testing + Chaos Engineering
  if(isPro91){
    doc+='## '+(G?'🔬 高度なテスト技法 (Pro)':'🔬 Advanced Testing Techniques (Pro)')+'\n\n';
    doc+='### '+(G?'コントラクトテスト (Pact)':'Contract Testing (Pact)')+'\n\n';
    doc+=(G
      ?'マイクロサービス間のAPIインタフェースを自動検証します。Consumer-Driven Contract Testingパターン。\n\n'
      :'Automatically verify API interfaces between microservices using Consumer-Driven Contract Testing.\n\n'
    );
    doc+='```typescript\n// consumer/src/tests/user-api.pact.test.ts\nimport { Pact } from \'@pact-foundation/pact\';\n\nconst provider = new Pact({ consumer: \'frontend\', provider: \'user-service\' });\n\nbefore(() => provider.setup());\nafter(() => provider.finalize());\n\nit(\'returns user by id\', async () => {\n  await provider.addInteraction({\n    state: \'user 123 exists\',\n    uponReceiving: \'GET /users/123\',\n    withRequest: { method: \'GET\', path: \'/users/123\' },\n    willRespondWith: {\n      status: 200,\n      body: { id: \'123\', email: like(\'test@example.com\') }\n    }\n  });\n  const result = await fetchUser(\'123\');\n  expect(result.id).toBe(\'123\');\n});\n```\n\n';
    doc+='### '+(G?'カオスエンジニアリング (Chaos Engineering)':'Chaos Engineering')+'\n\n';
    doc+=(G
      ?'意図的に障害を注入してシステムの回復性を検証します。\n\n'
      :'Deliberately inject failures to verify system resilience.\n\n'
    );
    doc+='| '+(G?'ツール':'Tool')+' | '+(G?'用途':'Use')+' | '+(G?'規模':'Scale')+'|\n';
    doc+='|---|---|---|\n';
    doc+='| LitmusChaos | '+(G?'Kubernetes向けカオス実験':'Kubernetes chaos experiments')+' | '+(G?'クラウドネイティブ':'Cloud-native')+'|\n';
    doc+='| Gremlin | '+(G?'マネージドカオスプラットフォーム':'Managed chaos platform')+' | '+(G?'エンタープライズ':'Enterprise')+'|\n';
    doc+='| Chaos Monkey | '+(G?'AWSインスタンス無作為停止':'Random AWS instance termination')+' | '+(G?'AWS環境':'AWS env')+'|\n\n';
    doc+='```yaml\n# LitmusChaos: Pod delete experiment\napiVersion: litmuschaos.io/v1alpha1\nkind: ChaosEngine\nmetadata:\n  name: pod-delete-test\nspec:\n  appinfo:\n    appns: production\n    applabel: \'app=user-service\'\n  experiments:\n    - name: pod-delete\n      spec:\n        components:\n          env:\n            - name: TOTAL_CHAOS_DURATION\n              value: \'60\'  # 60 seconds\n            - name: CHAOS_INTERVAL\n              value: \'10\'\n```\n\n';
  }

  // Domain-specific test focus (DOMAIN_QA_MAP)
  var domainQ=detectDomain(a.purpose||'');
  var dqa=typeof DOMAIN_QA_MAP!=='undefined'?(DOMAIN_QA_MAP[domainQ]||null):null;
  if(dqa){
    doc+='## '+(G?'ドメイン別テスト重点領域 ('+domainQ+')':'Domain-Specific Test Focus ('+domainQ+')')+'\n\n';
    doc+='### '+(G?'テスト優先マトリクス':'Test Priority Matrix')+'\n\n';
    var prioItems=dqa.priority.split('|');
    doc+='| '+(G?'品質特性':'Quality Attribute')+' | '+(G?'優先度':'Priority')+' |\n|------|------|\n';
    prioItems.forEach(function(p){
      var parts=p.split(':');
      if(parts.length===2) doc+='| '+parts[0]+' | '+parts[1]+' |\n';
    });
    doc+='\n';
    doc+='### '+(G?'重点テスト領域':'Key Test Areas')+'\n\n';
    var focuses=G?dqa.focus_ja:dqa.focus_en;
    focuses.forEach(function(f){doc+='- ✅ '+f+'\n';});
    doc+='\n';
    doc+='### '+(G?'既知バグパターン（回帰テスト必須）':'Known Bug Patterns (regression tests required)')+'\n\n';
    var bugs=G?dqa.bugs_ja:dqa.bugs_en;
    bugs.forEach(function(b){doc+='- ⚠️ '+b+'\n';});
    doc+='\n';
  }

  // Entity-specific test fixtures
  var _p91ents=(a.entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
  if(_p91ents.length){
    var _p91ent=_p91ents[0];
    var _p91cols=getEntityColumns(_p91ent,G,_p91ents);
    if(_p91cols.length){
      doc+='## '+(G?'エンティティ別テストフィクスチャ例 ('+_p91ent+')':'Entity Test Fixtures ('+_p91ent+')')+'\n\n';
      var _p91obj={};
      _p91cols.forEach(function(c){
        if(!c)return;
        var cn=c.col,ct=(c.type||'').toUpperCase();
        if(/^(id|created_at|updated_at|deleted_at)$/.test(cn))return;
        if(/UUID/.test(ct))_p91obj[cn]='"'+cn+'-uuid"';
        else if(/^INT|BIGINT|SMALLINT/.test(ct))_p91obj[cn]='1';
        else if(/DECIMAL|FLOAT|NUMERIC/.test(ct))_p91obj[cn]='9.99';
        else if(/BOOL/.test(ct))_p91obj[cn]='true';
        else if(/TIMESTAMP|DATE/.test(ct))_p91obj[cn]='"2024-01-01T00:00:00Z"';
        else if(/JSON/.test(ct))_p91obj[cn]='{}';
        else _p91obj[cn]='"'+cn.replace(/_/g,'-')+'"';
      });
      var _p91lines=Object.keys(_p91obj).map(function(k){return '  '+k+': '+_p91obj[k];});
      if(isPy){
        doc+='```python\n# tests/fixtures/'+_p91ent.toLowerCase()+'_fixture.py\nSAMPLE_DATA = {\n';
        _p91lines.forEach(function(l){doc+=l+',\n';});
        doc+='}\n```\n\n';
      } else {
        doc+='```typescript\n// tests/fixtures/'+_p91ent[0].toLowerCase()+_p91ent.slice(1)+'.fixture.ts\nimport type { '+_p91ent+' } from \'@/types\';\n\nexport const sample'+_p91ent+': Partial<'+_p91ent+'> = {\n';
        _p91lines.forEach(function(l){doc+=l+',\n';});
        doc+='};\n```\n\n';
      }
      var _p91reqCol=_p91cols.find(function(c){return c&&/NOT NULL/.test(c.constraint||'')&&!/DEFAULT/.test(c.constraint||'')&&!/^(id|created_at|updated_at|deleted_at)$/.test(c.col||'');});
      if(_p91reqCol){
        var _p91rf=_p91reqCol.col;
        doc+='```typescript\n// '+(G?'必須フィールドバリデーションテスト':'Required field validation')+'\nit(\'rejects missing '+_p91rf+'\', async () => {\n  const data = { ...sample'+_p91ent+' };\n  delete (data as any).'+_p91rf+';\n  await expect(service.create(data)).rejects.toThrow();\n});\n```\n\n';
      }
    }
  }

  S.files['docs/91_testing_strategy.md']=doc;
}

// doc 92: Coverage Design
function gen92(a,pn,G,feType,beType){
  var isPy=beType==='python';
  var isJava=beType==='java';
  var covTool=isPy?COVERAGE_TOOLS.python:isJava?COVERAGE_TOOLS.java:COVERAGE_TOOLS.node;

  var doc='';
  doc+='# '+(G?'カバレッジ設計':'Coverage Design')+'\n\n';
  doc+='> **'+(G?'カバレッジツール':'Coverage Tool')+'**: '+covTool.tool+'\n\n';

  // Targets
  doc+='## '+(G?'カバレッジ目標':'Coverage Targets')+'\n\n';
  doc+='| '+(G?'層':'Layer')+' | '+(G?'対象':'Target')+' | '+(G?'目標':'Goal')+' | '+(G?'備考':'Notes')+' |\n';
  doc+='|------|------|------|------|\n';
  COVERAGE_TARGETS.forEach(function(c){
    var tgt=G?(c.target+(c.en_target?'':'')):c.target;
    doc+='| '+(G?c.layer:c.layer)+' | '+(G?c.ja:c.en)+' | '+tgt+' | '+(G?c.ja_note:c.en_note)+' |\n';
  });
  doc+='\n';

  // Tool config
  doc+='## '+(G?'ツール設定 ('+covTool.tool+')':'Tool Configuration ('+covTool.tool+')')+'\n\n';

  if(isPy){
    doc+='```ini\n# pytest.ini\n[pytest]\naddopts = --cov=app --cov-report=term-missing --cov-report=xml --cov-fail-under=80\ntestpaths = tests\n```\n\n';
    doc+='```yaml\n# GitHub Actions\n- name: Run tests with coverage\n  run: pytest\n- name: Upload coverage to Codecov\n  uses: codecov/codecov-action@v4\n  with:\n    file: ./coverage.xml\n    fail_ci_if_error: true\n```\n\n';
  } else if(isJava){
    doc+='```kotlin\n// build.gradle.kts\ntasks.jacocoTestCoverageVerification {\n    violationRules {\n        rule {\n            limit {\n                minimum = "0.80".toBigDecimal()\n            }\n        }\n    }\n}\ntasks.check { dependsOn(tasks.jacocoTestCoverageVerification) }\n```\n\n';
  } else {
    doc+='```javascript\n// jest.config.js\nmodule.exports = {\n  coverageProvider: \'v8\',\n  collectCoverageFrom: [\'src/**/*.{ts,tsx}\', \'!src/**/*.d.ts\', \'!src/**/index.ts\'],\n  coverageThresholds: {\n    global: { branches: 70, functions: 80, lines: 80, statements: 80 }\n  },\n  coverageReporters: [\'text\', \'lcov\', \'html\'],\n};\n```\n\n';
    doc+='```yaml\n# .github/workflows/ci.yml\n- name: Test with coverage\n  run: '+covTool.en_cmd+'\n- name: Upload coverage\n  uses: codecov/codecov-action@v4\n  with:\n    fail_ci_if_error: true\n```\n\n';
  }

  // What NOT to test
  doc+='## '+(G?'テストしないもの (カバレッジ数値を上げるためだけに書かない)':'What NOT to Test (never write tests just to raise numbers)')+'\n\n';
  var notTest=G
    ?['単純なgetter/setter','サードパーティライブラリの内部動作','環境変数の設定値そのもの','型定義ファイル (.d.ts)','自動生成コード (prisma client等)']
    :['Simple getters/setters','Third-party library internals','Environment variable values themselves','Type definition files (.d.ts)','Auto-generated code (e.g., prisma client)'];
  notTest.forEach(function(n){doc+='- '+n+'\n';});
  doc+='\n';

  // Mutation testing hint
  doc+='## '+(G?'ミューテーションテスト (上級)':'Mutation Testing (Advanced)')+'\n\n';
  doc+=(G
    ?'カバレッジ80%を達成後、ミューテーションテストでテスト品質を検証します。\n\n'
    :'After reaching 80% coverage, use mutation testing to verify test quality.\n\n'
  );
  doc+='```bash\n'+(isPy?'# mutmut (Python)\npip install mutmut\nmutmut run\nmutmut results':'# Stryker (JavaScript/TypeScript)\nnpm install -D @stryker-mutator/core @stryker-mutator/jest-runner\nnpx stryker run')+'\n```\n\n';

  // Pro: Property-Based Testing
  var lv92=S.skillLv||0; var isPro92=lv92>=5;
  if(isPro92){
    doc+='## '+(G?'🔬 プロパティベーステスト (Pro)':'🔬 Property-Based Testing (Pro)')+'\n\n';
    doc+=(G
      ?'任意の入力データを自動生成してテストします。エッジケースを人間が思いつかない組み合わせで発見できます。\n\n'
      :'Automatically generate arbitrary input data for testing. Discover edge cases from combinations humans would never think of.\n\n'
    );
    doc+=(isPy
      ?'```python\n# Hypothesis (Python)\nfrom hypothesis import given, strategies as st\n\n@given(st.integers(min_value=0, max_value=1000), st.integers(min_value=1))\ndef test_divide_never_exceeds_input(numerator, denominator):\n    result = safe_divide(numerator, denominator)\n    assert result <= numerator\n\n@given(st.text(min_size=1, max_size=100))\ndef test_sanitize_always_safe(raw_input):\n    result = sanitize(raw_input)\n    assert \'<script>\' not in result\n    assert len(result) <= 100\n```\n\n'
      :'```typescript\n// fast-check (JavaScript/TypeScript)\nimport * as fc from \'fast-check\';\n\ntest(\'addition is commutative\', () => {\n  fc.assert(fc.property(\n    fc.integer(), fc.integer(),\n    (a, b) => add(a, b) === add(b, a)\n  ));\n});\n\ntest(\'pagination never returns more than limit\', () => {\n  fc.assert(fc.property(\n    fc.integer({ min: 0, max: 10000 }),  // offset\n    fc.integer({ min: 1, max: 100 }),    // limit\n    async (offset, limit) => {\n      const result = await paginate({ offset, limit });\n      return result.items.length <= limit;\n    }\n  ));\n});\n\n// Run: npx fast-check\n```\n\n'
    );
  }

  // Domain-specific coverage priorities
  var _d92=detectDomain(a.purpose||'');
  var _de92=_d92&&DOMAIN_TEST_EXTRA[_d92];
  if(_de92){
    doc+='## '+(G?'ドメイン固有カバレッジ優先 ('+_d92+')':'Domain Coverage Priorities ('+_d92+')')+'\n\n';
    (G?_de92.cov_ja:_de92.cov_en).forEach(function(c){doc+='- '+c+'\n';});
    doc+='\n';
  }

  S.files['docs/92_coverage_design.md']=doc;
}

// doc 93: E2E Test Architecture
function gen93(a,pn,G,feType,beType){
  var isMobile=/Expo|Flutter|React Native/i.test(a.mobile||'');
  var hasAuth=a.auth&&!(typeof isNone==='function'?isNone(a.auth):/なし|none/i.test(a.auth));

  var doc='';
  doc+='# '+(G?'E2Eテストアーキテクチャ':'E2E Test Architecture')+'\n\n';
  doc+='> '+(G?'推奨ツール: **Playwright** (クロスブラウザ・並列実行対応)':'Recommended: **Playwright** (cross-browser, parallel execution)')+'\n\n';

  // Tool comparison
  doc+='## '+(G?'ツール比較':'Tool Comparison')+'\n\n';
  doc+='| '+(G?'観点':'Aspect')+' | Playwright | Cypress |\n';
  doc+='|------|------------|--------|\n';
  doc+='| '+(G?'クロスブラウザ':'Cross-browser')+' | ✅ Chrome/Firefox/Safari | ⚠️ Chrome/Firefox |\n';
  doc+='| '+(G?'並列実行':'Parallel')+' | ✅ ネイティブサポート | 💰 有料プランのみ |\n';
  doc+='| '+(G?'モバイルエミュレーション':'Mobile emulation')+' | ✅ | ⚠️ 限定的 |\n';
  doc+='| '+(G?'セットアップ':'Setup')+' | '+(G?'やや複雑':'Slightly complex')+' | '+(G?'シンプル':'Simple')+' |\n';
  doc+='| '+(G?'推奨用途':'Best for')+' | '+(G?'本番環境E2E':'Production E2E')+' | '+(G?'開発中の素早いテスト':'Dev-time quick tests')+' |\n';
  doc+='\n';

  // Playwright setup
  doc+='## '+(G?'Playwright セットアップ':'Playwright Setup')+'\n\n';
  doc+='```bash\nnpm install -D @playwright/test\nnpx playwright install  # Install browsers\n```\n\n';
  doc+='```typescript\n// playwright.config.ts\nimport { defineConfig, devices } from \'@playwright/test\';\n\nexport default defineConfig({\n  testDir: \'./e2e\',\n  timeout: 30_000,\n  retries: process.env.CI ? 2 : 0,\n  workers: process.env.CI ? 2 : undefined,\n  reporter: [[\'html\'], [\'github\']],\n  use: {\n    baseURL: process.env.BASE_URL || \'http://localhost:3000\',\n    trace: \'on-first-retry\',\n    screenshot: \'only-on-failure\',\n  },\n  projects: [\n    { name: \'chromium\', use: { ...devices[\'Desktop Chrome\'] } },\n    { name: \'firefox\',  use: { ...devices[\'Desktop Firefox\'] } },\n    { name: \'mobile\',   use: { ...devices[\'iPhone 14\'] } },\n  ],\n});\n```\n\n';

  // Page Object Model
  doc+='## '+(G?'Page Object Model (POM)':'Page Object Model (POM)')+'\n\n';
  E2E_PATTERNS.forEach(function(p){
    doc+='### '+(G?p.ja:p.en)+'\n\n'+(G?p.ja_desc:p.en_desc)+'\n\n';
  });
  doc+='```typescript\n// e2e/pages/LoginPage.ts\nimport { Page, Locator } from \'@playwright/test\';\n\nexport class LoginPage {\n  readonly emailInput: Locator;\n  readonly passwordInput: Locator;\n  readonly submitButton: Locator;\n\n  constructor(private page: Page) {\n    this.emailInput    = page.getByTestId(\'email-input\');\n    this.passwordInput = page.getByTestId(\'password-input\');\n    this.submitButton  = page.getByTestId(\'login-submit\');\n  }\n\n  async goto() { await this.page.goto(\'/login\'); }\n\n  async login(email: string, password: string) {\n    await this.emailInput.fill(email);\n    await this.passwordInput.fill(password);\n    await this.submitButton.click();\n  }\n}\n```\n\n';

  // Auth handling
  if(hasAuth){
    doc+='## '+(G?'認証の扱い (storageState)':'Auth Handling (storageState)')+'\n\n';
    doc+='```typescript\n// e2e/setup/auth.setup.ts\nimport { test as setup } from \'@playwright/test\';\n\nsetup(\'authenticate\', async ({ page }) => {\n  await page.goto(\'/login\');\n  await page.getByTestId(\'email-input\').fill(process.env.TEST_USER_EMAIL!);\n  await page.getByTestId(\'password-input\').fill(process.env.TEST_USER_PASSWORD!);\n  await page.getByTestId(\'login-submit\').click();\n  await page.waitForURL(\'/dashboard\');\n  // Save auth state for reuse across tests\n  await page.context().storageState({ path: \'e2e/.auth/user.json\' });\n});\n```\n\n';
  }

  // Mobile
  if(isMobile){
    doc+='## '+(G?'モバイルE2Eテスト (Detox / Maestro)':'Mobile E2E Testing (Detox / Maestro)')+'\n\n';
    doc+=(G
      ?'Expo/React Nativeプロジェクトには**Maestro** (シンプル) または **Detox** (高精度) を推奨します。\n\n'
      :'For Expo/React Native projects, use **Maestro** (simple) or **Detox** (precise) for mobile E2E.\n\n'
    );
    doc+='```yaml\n# .maestro/login_flow.yaml\nappId: com.example.app\n---\n- launchApp\n- tapOn: "Email"\n- inputText: "test@example.com"\n- tapOn: "Password"\n- inputText: "password123"\n- tapOn: "Login"\n- assertVisible: "Welcome"\n```\n\n';
  }

  // Domain-specific E2E scenarios
  var _d93=detectDomain(a.purpose||'');
  var _de93=_d93&&DOMAIN_TEST_EXTRA[_d93];
  if(_de93){
    doc+='## '+(G?'ドメイン固有E2Eシナリオ ('+_d93+')':'Domain E2E Scenarios ('+_d93+')')+'\n\n';
    (G?_de93.e2e_ja:_de93.e2e_en).forEach(function(s){doc+='- [ ] '+s+'\n';});
    doc+='\n';
  }

  // CI
  doc+='## CI '+(G?'統合':'Integration')+'\n\n';
  doc+='```yaml\n# .github/workflows/e2e.yml\nname: E2E Tests\non: [push, pull_request]\njobs:\n  e2e:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: \'20\' }\n      - run: npm ci\n      - run: npx playwright install --with-deps chromium\n      - name: Run E2E\n        run: npx playwright test\n        env:\n          BASE_URL: http://localhost:3000\n          CI: true\n      - uses: actions/upload-artifact@v4\n        if: failure()\n        with:\n          name: playwright-report\n          path: playwright-report/\n```\n\n';

  S.files['docs/93_e2e_test_architecture.md']=doc;
}

// doc 94: Performance Testing
function gen94(a,pn,G,feType,beType){
  var isBaaS=beType==='baas';
  var isPy=beType==='python';
  var isNext=feType==='nextjs';

  var doc='';
  doc+='# '+(G?'パフォーマンステスト':'Performance Testing')+'\n\n';
  doc+='> **'+(G?'プロジェクト':'Project')+'**: '+pn+'\n\n';

  // Web Vitals
  doc+='## '+(G?'Core Web Vitals 目標値':'Core Web Vitals Targets')+'\n\n';
  doc+='| Metric | Good | '+(G?'改善が必要':'Needs Improvement')+' | Poor | '+(G?'改善のヒント':'Tips')+' |\n';
  doc+='|--------|------|-------|------|------|\n';
  WEB_VITALS.forEach(function(v){
    doc+='| **'+v.metric+'** ('+v.name+') | 🟢 '+v.good+' | 🟡 '+v.needs+' | 🔴 '+v.poor+' | '+(G?v.ja_tip:v.en_tip)+' |\n';
  });
  doc+='\n';

  // Lighthouse CI
  doc+='## Lighthouse CI\n\n';
  doc+='```bash\nnpm install -D @lhci/cli\n```\n\n';
  doc+='```yaml\n# lighthouserc.yml\nci:\n  collect:\n    url:\n      - \'http://localhost:3000\'\n      - \'http://localhost:3000/dashboard\'\n    numberOfRuns: 3\n  assert:\n    assertions:\n      categories:performance: [\'error\', {minScore: 0.85}]\n      categories:accessibility: [\'error\', {minScore: 0.90}]\n      categories:best-practices: [\'warn\', {minScore: 0.90}]\n      first-contentful-paint: [\'warn\', {maxNumericValue: 2000}]\n      largest-contentful-paint: [\'error\', {maxNumericValue: 2500}]\n      cumulative-layout-shift: [\'error\', {maxNumericValue: 0.1}]\n  upload:\n    target: temporary-public-storage\n```\n\n';
  doc+='```yaml\n# GitHub Actions integration\n- name: Lighthouse CI\n  run: |\n    npm run build\n    npm run start &\n    sleep 5\n    npx lhci autorun\n  env:\n    LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}\n```\n\n';

  // Backend load testing
  doc+='## '+(G?'バックエンド負荷テスト':'Backend Load Testing')+'\n\n';
  if(isPy){
    doc+='```python\n# locust/locustfile.py\nfrom locust import HttpUser, task, between\n\nclass APIUser(HttpUser):\n    wait_time = between(1, 3)\n\n    @task(3)\n    def get_users(self):\n        self.client.get("/api/users")\n\n    @task(1)\n    def create_user(self):\n        self.client.post("/api/users", json={\n            "email": f"user{self.user_id}@example.com",\n            "name": "Load Test User"\n        })\n\n# Run: locust -f locust/locustfile.py --host=http://localhost:8000\n# UI: http://localhost:8089\n```\n\n';
  } else {
    doc+='```javascript\n// k6/load-test.js\nimport http from \'k6/http\';\nimport { check, sleep } from \'k6\';\n\nexport const options = {\n  stages: [\n    { duration: \'30s\', target: 20 },   // Ramp up\n    { duration: \'1m\',  target: 50 },   // Sustain\n    { duration: \'30s\', target: 0 },    // Ramp down\n  ],\n  thresholds: {\n    http_req_duration: [\'p(95)<500\'],  // 95% requests < 500ms\n    http_req_failed:   [\'rate<0.01\'],  // Error rate < 1%\n  },\n};\n\nexport default function () {\n  const res = http.get(`${__ENV.BASE_URL}/api/users`);\n  check(res, {\n    \'status 200\': (r) => r.status === 200,\n    \'response time OK\': (r) => r.timings.duration < 500,\n  });\n  sleep(1);\n}\n// Run: k6 run --env BASE_URL=http://localhost:3000 k6/load-test.js\n```\n\n';
  }

  // Next.js specific
  if(isNext){
    doc+='## '+(G?'Next.js パフォーマンス最適化チェックリスト':'Next.js Performance Optimization Checklist')+'\n\n';
    var items=G
      ?['Image: `next/image` でWebP自動変換 + lazy load','Font: `next/font` でCLS防止','Bundle: `next build` → `next analyze` でバンドル分析','ISR/SSG: 動的ページをISR化してTTFB改善','React Server Components: Clientバンドルを最小化']
      :['Image: `next/image` for WebP auto-convert + lazy load','Font: `next/font` to prevent CLS','Bundle: `next build` → `next analyze` for bundle analysis','ISR/SSG: Convert dynamic pages to ISR for TTFB improvement','React Server Components: Minimize client bundle size'];
    items.forEach(function(it){doc+='- [ ] '+it+'\n';});
    doc+='\n';
  }

  // BaaS specific
  if(isBaaS){
    doc+='## '+(G?'BaaS パフォーマンス注意点':'BaaS Performance Notes')+'\n\n';
    doc+=(G
      ?'- **コールドスタート対策**: Edge Functionsを活用してレイテンシを最小化\n- **リアルタイム接続**: Supabase Realtime / Firestoreリスナーの購読解除を徹底\n- **クエリ最適化**: 必要なカラムのみ SELECT (`.select(\'id, name\')`) でデータ転送量削減\n'
      :'- **Cold start mitigation**: Use Edge Functions to minimize latency\n- **Realtime connections**: Always unsubscribe Supabase Realtime / Firestore listeners\n- **Query optimization**: SELECT only required columns (`.select(\'id, name\')`) to reduce data transfer\n'
    );
    doc+='\n';
  }

  // Performance budget
  doc+='## '+(G?'パフォーマンスバジェット':'Performance Budget')+'\n\n';
  doc+='| '+(G?'リソース':'Resource')+' | '+(G?'上限':'Budget')+' | '+(G?'計測方法':'Measure')+' |\n';
  doc+='|------|--------|--------|\n';
  doc+='| Total JS (gzip) | < 250KB | Webpack Bundle Analyzer |\n';
  doc+='| Total CSS (gzip) | < 50KB | PurgeCSS / Tailwind |\n';
  doc+='| '+(G?'初回レンダリング':'First render')+' (LCP) | < 2.5s | Lighthouse CI |\n';
  doc+='| '+(G?'APIレスポンス (p95)':'API response (p95)')+' | < 500ms | k6 / Locust |\n';
  doc+='| '+(G?'DBクエリ':'DB query')+' (p95) | < 100ms | pg_stat_statements |\n';
  doc+='\n';

  // Pro: Distributed load testing + SLA template
  var lv94=S.skillLv||0; var isPro94=lv94>=5;
  if(isPro94){
    doc+='## '+(G?'🔬 分散負荷テスト構成 (Pro)':'🔬 Distributed Load Testing (Pro)')+'\n\n';
    doc+='### '+(G?'k6 Cloud / 分散実行':'k6 Cloud / Distributed Execution')+'\n\n';
    doc+='```javascript\n// k6/distributed-test.js\nimport http from \'k6/http\';\nimport { check } from \'k6\';\n\nexport const options = {\n  scenarios: {\n    ramp_up: {\n      executor: \'ramping-arrival-rate\',\n      startRate: 10,\n      timeUnit: \'1s\',\n      preAllocatedVUs: 50,\n      maxVUs: 500,\n      stages: [\n        { target: 100, duration: \'2m\' },  // '+(G?'ランプアップ':'Ramp up')+'\n        { target: 500, duration: \'5m\' },  // '+(G?'ピーク負荷':'Peak load')+'\n        { target: 0,   duration: \'1m\' },  // '+(G?'ランプダウン':'Ramp down')+'\n      ],\n    },\n  },\n  thresholds: {\n    http_req_duration: [\'p(95)<500\', \'p(99)<1000\'],\n    http_req_failed:   [\'rate<0.005\'],  // 0.5% error rate\n  },\n};\n\n// '+(G?'k6 Cloud で実行 (複数リージョン)':'Run on k6 Cloud (multi-region)')+'\n// k6 cloud k6/distributed-test.js\n```\n\n';
    doc+='### '+(G?'Locust 分散モード (Python)':'Locust Distributed Mode (Python)')+'\n\n';
    doc+='```bash\n# Master node\nlocust -f locustfile.py --master --users 1000 --spawn-rate 50\n\n# Worker nodes (each machine)\nlocust -f locustfile.py --worker --master-host=<master-ip>\n```\n\n';
    doc+='### SLA '+(G?'定義テンプレート':'Definition Template')+'\n\n';
    doc+='```yaml\n# sla.yml\nsla:\n  availability:\n    target: 99.9%          # 8.7h/year downtime\n    measurement: monthly\n  performance:\n    api_p95: 500ms\n    api_p99: 1000ms\n    error_rate: "<0.5%"\n  capacity:\n    peak_rps: 500          # '+(G?'ピーク時リクエスト/秒':'Peak requests/second')+'\n    concurrent_users: 1000\n  incidents:\n    p1_response: 15min     # '+(G?'重大障害の初動':'Critical incident response time')+'\n    p2_response: 1h\n    postmortem: 48h\n```\n\n';
  }

  // Domain-specific load test scenarios
  var _d94=detectDomain(a.purpose||'');
  var _de94=_d94&&DOMAIN_TEST_EXTRA[_d94];
  if(_de94&&_de94.perf_ja){
    doc+='## '+(G?'ドメイン固有負荷テストシナリオ ('+_d94+')':'Domain Load Test Scenarios ('+_d94+')')+'\n\n';
    (G?_de94.perf_ja:_de94.perf_en).forEach(function(s){doc+='- '+s+'\n';});
    doc+='\n';
  }

  S.files['docs/94_performance_testing.md']=doc;
}
