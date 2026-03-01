/* ═══ ENTITY_COLUMNS EXTENSION ═══
 * Top-80 missing entity column definitions (frequency-ranked).
 * + ext12 entities (presets-ext12.js business SaaS categories).
 * Extends the ENTITY_COLUMNS object defined in generators/common.js.
 * Load order: after generators/common.js, before generator pillar files.
 */

// ── ext12: presets-ext12.js new entity columns ────────────────────────────────

ENTITY_COLUMNS['MeetingRoom']=[
  'owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID',
  'room_name:VARCHAR(255):NOT NULL:ルーム名:Room name',
  'description:TEXT::説明:Description',
  'max_participants:INT:DEFAULT 100:最大参加者数:Max participants',
  'is_recurring:BOOLEAN:DEFAULT false:定期開催:Recurring',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status'
];

ENTITY_COLUMNS['MeetingSession']=[
  'room_id:UUID:FK(MeetingRoom) NOT NULL:ルームID:Room ID',
  'host_id:UUID:FK(User) NOT NULL:ホストID:Host ID',
  'title:VARCHAR(255):NOT NULL:タイトル:Title',
  'scheduled_at:TIMESTAMP:NOT NULL:予定日時:Scheduled at',
  'started_at:TIMESTAMP::開始日時:Started at',
  'ended_at:TIMESTAMP::終了日時:Ended at',
  'status:VARCHAR(20):DEFAULT \'scheduled\':ステータス:Status',
  'participant_count:INT:DEFAULT 0:参加者数:Participant count'
];

ENTITY_COLUMNS['MeetingParticipant']=[
  'session_id:UUID:FK(MeetingSession) NOT NULL:セッションID:Session ID',
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'role:VARCHAR(20):DEFAULT \'attendee\':ロール:Role',
  'joined_at:TIMESTAMP::参加日時:Joined at',
  'left_at:TIMESTAMP::退出日時:Left at',
  'is_muted:BOOLEAN:DEFAULT false:ミュート:Muted'
];

ENTITY_COLUMNS['MeetingRecording']=[
  'session_id:UUID:FK(MeetingSession) NOT NULL:セッションID:Session ID',
  'storage_url:TEXT:NOT NULL:保存URL:Storage URL',
  'duration_sec:INT::録画時間(秒):Duration (sec)',
  'file_size_mb:DECIMAL(10,2)::ファイルサイズ(MB):File size (MB)',
  'status:VARCHAR(20):DEFAULT \'processing\':ステータス:Status',
  'expires_at:TIMESTAMP::有効期限:Expires at'
];

ENTITY_COLUMNS['AccountingEntry']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'entry_date:DATE:NOT NULL:仕訳日:Entry date',
  'debit_account:VARCHAR(100):NOT NULL:借方勘定:Debit account',
  'credit_account:VARCHAR(100):NOT NULL:貸方勘定:Credit account',
  'amount:DECIMAL(12,2):NOT NULL:金額:Amount',
  'description:TEXT::摘要:Description',
  'fiscal_year:INT:NOT NULL:会計年度:Fiscal year'
];

ENTITY_COLUMNS['AccountingInvoice']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'client_name:VARCHAR(255):NOT NULL:取引先名:Client name',
  'invoice_number:VARCHAR(100):UNIQUE NOT NULL:請求番号:Invoice number',
  'issue_date:DATE:NOT NULL:発行日:Issue date',
  'due_date:DATE:NOT NULL:支払期限:Due date',
  'amount:DECIMAL(12,2):NOT NULL:請求金額:Amount',
  'tax_amount:DECIMAL(12,2):DEFAULT 0:消費税額:Tax amount',
  'status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status',
  'paid_at:TIMESTAMP::支払日時:Paid at'
];

ENTITY_COLUMNS['ExpenseReport']=[
  'user_id:UUID:FK(User) NOT NULL:申請者ID:User ID',
  'title:VARCHAR(255):NOT NULL:タイトル:Title',
  'total_amount:DECIMAL(12,2):NOT NULL:合計金額:Total amount',
  'status:VARCHAR(20):DEFAULT \'pending\':ステータス:Status',
  'submitted_at:TIMESTAMP::提出日時:Submitted at',
  'approved_at:TIMESTAMP::承認日時:Approved at',
  'approver_id:UUID:FK(User):承認者ID:Approver ID',
  'notes:TEXT::備考:Notes'
];

ENTITY_COLUMNS['SigningDocument']=[
  'owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID',
  'title:VARCHAR(255):NOT NULL:文書名:Document title',
  'file_url:TEXT:NOT NULL:ファイルURL:File URL',
  'document_type:VARCHAR(50)::文書種別:Document type',
  'status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status',
  'expires_at:TIMESTAMP::有効期限:Expires at',
  'completed_at:TIMESTAMP::完了日時:Completed at'
];

ENTITY_COLUMNS['SignatureRequest']=[
  'document_id:UUID:FK(SigningDocument) NOT NULL:文書ID:Document ID',
  'requester_id:UUID:FK(User) NOT NULL:依頼者ID:Requester ID',
  'message:TEXT::メッセージ:Message',
  'order_index:INT:DEFAULT 0:署名順:Order index',
  'status:VARCHAR(20):DEFAULT \'pending\':ステータス:Status',
  'due_date:DATE::期限:Due date'
];

ENTITY_COLUMNS['SignerRecord']=[
  'request_id:UUID:FK(SignatureRequest) NOT NULL:依頼ID:Request ID',
  'signer_email:VARCHAR(255):NOT NULL:署名者メール:Signer email',
  'signer_name:VARCHAR(255)::署名者名:Signer name',
  'signed_at:TIMESTAMP::署名日時:Signed at',
  'ip_address:VARCHAR(45)::IPアドレス:IP address',
  'signature_hash:TEXT::署名ハッシュ:Signature hash',
  'status:VARCHAR(20):DEFAULT \'pending\':ステータス:Status'
];

ENTITY_COLUMNS['SocialAccount']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'platform:VARCHAR(50):NOT NULL:プラットフォーム:Platform',
  'account_name:VARCHAR(255):NOT NULL:アカウント名:Account name',
  'access_token:TEXT::アクセストークン:Access token',
  'follower_count:INT:DEFAULT 0:フォロワー数:Follower count',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status',
  'last_synced_at:TIMESTAMP::最終同期日時:Last synced at'
];

ENTITY_COLUMNS['ScheduledPost']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'account_id:UUID:FK(SocialAccount) NOT NULL:アカウントID:Account ID',
  'content:TEXT:NOT NULL:コンテンツ:Content',
  'media_urls:JSONB::メディアURL:Media URLs',
  'scheduled_at:TIMESTAMP:NOT NULL:予定日時:Scheduled at',
  'published_at:TIMESTAMP::公開日時:Published at',
  'status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status'
];

ENTITY_COLUMNS['PostAnalytic']=[
  'post_id:UUID:FK(ScheduledPost) NOT NULL:投稿ID:Post ID',
  'impressions:INT:DEFAULT 0:インプレッション:Impressions',
  'engagements:INT:DEFAULT 0:エンゲージメント:Engagements',
  'clicks:INT:DEFAULT 0:クリック数:Clicks',
  'likes:INT:DEFAULT 0:いいね数:Likes',
  'shares:INT:DEFAULT 0:シェア数:Shares',
  'recorded_at:TIMESTAMP:DEFAULT NOW:記録日時:Recorded at'
];

ENTITY_COLUMNS['ServiceMenu']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'service_name:VARCHAR(255):NOT NULL:サービス名:Service name',
  'description:TEXT::説明:Description',
  'duration_min:INT:NOT NULL:所要時間(分):Duration (min)',
  'price:DECIMAL(10,2):DEFAULT 0:料金:Price',
  'is_active:BOOLEAN:DEFAULT true:有効:Active',
  'max_bookings_per_slot:INT:DEFAULT 1:スロットあたり最大予約:Max per slot'
];

ENTITY_COLUMNS['AppointmentSlot']=[
  'service_id:UUID:FK(ServiceMenu) NOT NULL:サービスID:Service ID',
  'day_of_week:INT:NOT NULL:曜日(0-6):Day of week',
  'start_time:TIME:NOT NULL:開始時刻:Start time',
  'end_time:TIME:NOT NULL:終了時刻:End time',
  'is_available:BOOLEAN:DEFAULT true:利用可能:Available',
  'override_date:DATE::特別日:Override date'
];

ENTITY_COLUMNS['ServiceBooking']=[
  'slot_id:UUID:FK(AppointmentSlot) NOT NULL:スロットID:Slot ID',
  'customer_id:UUID:FK(User) NOT NULL:顧客ID:Customer ID',
  'booking_date:DATE:NOT NULL:予約日:Booking date',
  'starts_at:TIMESTAMP:NOT NULL:開始日時:Starts at',
  'status:VARCHAR(20):DEFAULT \'pending\':ステータス:Status',
  'notes:TEXT::メモ:Notes',
  'cancelled_at:TIMESTAMP::キャンセル日時:Cancelled at'
];

ENTITY_COLUMNS['TimesheetEntry']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'project_id:UUID:FK(TimesheetProject) NOT NULL:プロジェクトID:Project ID',
  'work_date:DATE:NOT NULL:作業日:Work date',
  'hours:DECIMAL(5,2):NOT NULL:工数(時間):Hours',
  'description:TEXT::作業内容:Description',
  'is_billable:BOOLEAN:DEFAULT true:請求対象:Billable',
  'approved_at:TIMESTAMP::承認日時:Approved at'
];

ENTITY_COLUMNS['TimesheetProject']=[
  'client_name:VARCHAR(255):NOT NULL:クライアント名:Client name',
  'project_name:VARCHAR(255):NOT NULL:プロジェクト名:Project name',
  'billing_rate:DECIMAL(10,2):DEFAULT 0:請求レート:Billing rate',
  'budget_hours:DECIMAL(8,2)::予算工数(時間):Budget hours',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status',
  'start_date:DATE::開始日:Start date',
  'end_date:DATE::終了日:End date'
];

ENTITY_COLUMNS['InventoryItem']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'item_name:VARCHAR(255):NOT NULL:品目名:Item name',
  'sku:VARCHAR(100):UNIQUE:SKU:SKU',
  'category:VARCHAR(100)::カテゴリ:Category',
  'unit:VARCHAR(50):DEFAULT \'個\':単位:Unit',
  'cost_price:DECIMAL(10,2):DEFAULT 0:仕入単価:Cost price',
  'selling_price:DECIMAL(10,2):DEFAULT 0:販売単価:Selling price',
  'reorder_point:INT:DEFAULT 5:発注点:Reorder point'
];

ENTITY_COLUMNS['StockLevel']=[
  'item_id:UUID:FK(InventoryItem) NOT NULL:品目ID:Item ID',
  'location:VARCHAR(100):DEFAULT \'default\':保管場所:Location',
  'quantity:INT:DEFAULT 0:在庫数:Quantity',
  'reserved:INT:DEFAULT 0:引当数:Reserved',
  'updated_at:TIMESTAMP:DEFAULT NOW:更新日時:Updated at'
];

ENTITY_COLUMNS['PurchaseOrder']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'supplier_name:VARCHAR(255):NOT NULL:仕入先名:Supplier name',
  'order_number:VARCHAR(100):UNIQUE:注文番号:Order number',
  'order_date:DATE:NOT NULL:注文日:Order date',
  'expected_date:DATE::入荷予定日:Expected date',
  'total_amount:DECIMAL(12,2):DEFAULT 0:合計金額:Total amount',
  'status:VARCHAR(20):DEFAULT \'pending\':ステータス:Status'
];

ENTITY_COLUMNS['ApiGatewayKey']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'label:VARCHAR(100):NOT NULL:ラベル:Label',
  'key_prefix:VARCHAR(20):NOT NULL:キー接頭辞:Key prefix',
  'key_hash:TEXT:NOT NULL:キーハッシュ:Key hash',
  'permissions:JSONB::権限スコープ:Permission scopes',
  'rate_limit:INT:DEFAULT 1000:レートリミット(req/hr):Rate limit',
  'expires_at:TIMESTAMP::有効期限:Expires at',
  'last_used_at:TIMESTAMP::最終使用日時:Last used at',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status'
];

ENTITY_COLUMNS['ApiRoute']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'path:VARCHAR(500):NOT NULL:パス:Path',
  'method:VARCHAR(10):NOT NULL:HTTPメソッド:HTTP method',
  'target_url:TEXT:NOT NULL:転送先URL:Target URL',
  'description:TEXT::説明:Description',
  'is_active:BOOLEAN:DEFAULT true:有効:Active',
  'timeout_ms:INT:DEFAULT 30000:タイムアウト(ms):Timeout (ms)'
];

ENTITY_COLUMNS['VaultEntry']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'title:VARCHAR(255):NOT NULL:タイトル:Title',
  'vault_type:VARCHAR(50):DEFAULT \'password\':種別:Type',
  'encrypted_data:TEXT:NOT NULL:暗号化データ:Encrypted data',
  'folder:VARCHAR(100)::フォルダ:Folder',
  'favorite:BOOLEAN:DEFAULT false:お気に入り:Favorite',
  'last_accessed_at:TIMESTAMP::最終アクセス日時:Last accessed at'
];

ENTITY_COLUMNS['VaultCredential']=[
  'entry_id:UUID:FK(VaultEntry) NOT NULL:エントリID:Entry ID',
  'username:TEXT::ユーザー名:Username',
  'url:TEXT::URL:URL',
  'totp_secret:TEXT::TOTPシークレット:TOTP secret',
  'notes:TEXT::メモ:Notes'
];

ENTITY_COLUMNS['FeedbackSurvey']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'title:VARCHAR(255):NOT NULL:タイトル:Title',
  'survey_type:VARCHAR(50):DEFAULT \'nps\':サーベイ種別:Survey type',
  'questions:JSONB:NOT NULL:質問リスト:Questions',
  'is_active:BOOLEAN:DEFAULT true:配信中:Active',
  'starts_at:TIMESTAMP::開始日時:Starts at',
  'ends_at:TIMESTAMP::終了日時:Ends at'
];

ENTITY_COLUMNS['SurveyAnswer']=[
  'survey_id:UUID:FK(FeedbackSurvey) NOT NULL:サーベイID:Survey ID',
  'respondent_email:VARCHAR(255)::回答者メール:Respondent email',
  'answers:JSONB:NOT NULL:回答データ:Answers',
  'nps_score:INT::NPSスコア:NPS score',
  'submitted_at:TIMESTAMP:DEFAULT NOW:回答日時:Submitted at',
  'segment:VARCHAR(100)::セグメント:Segment'
];

ENTITY_COLUMNS['FormDefinition']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'title:VARCHAR(255):NOT NULL:フォーム名:Form title',
  'description:TEXT::説明:Description',
  'is_published:BOOLEAN:DEFAULT false:公開中:Published',
  'submit_redirect_url:TEXT::送信後リダイレクト:Submit redirect URL',
  'max_responses:INT::最大回答数:Max responses',
  'closed_at:TIMESTAMP::締切日時:Closed at'
];

ENTITY_COLUMNS['FormField']=[
  'form_id:UUID:FK(FormDefinition) NOT NULL:フォームID:Form ID',
  'field_type:VARCHAR(50):NOT NULL:フィールド種別:Field type',
  'label:VARCHAR(255):NOT NULL:ラベル:Label',
  'placeholder:VARCHAR(255)::プレースホルダー:Placeholder',
  'is_required:BOOLEAN:DEFAULT false:必須:Required',
  'options:JSONB::選択肢:Options',
  'order_index:INT:DEFAULT 0:表示順:Order index',
  'conditions:JSONB::表示条件:Display conditions'
];

ENTITY_COLUMNS['FormSubmission']=[
  'form_id:UUID:FK(FormDefinition) NOT NULL:フォームID:Form ID',
  'respondent_email:VARCHAR(255)::回答者メール:Respondent email',
  'answers:JSONB:NOT NULL:回答データ:Answers',
  'submitted_at:TIMESTAMP:DEFAULT NOW:回答日時:Submitted at',
  'ip_address:VARCHAR(45)::IPアドレス:IP address'
];

ENTITY_COLUMNS['ItAsset']=[
  'user_id:UUID:FK(User) NOT NULL:登録者ID:Registered by',
  'asset_tag:VARCHAR(100):UNIQUE NOT NULL:資産タグ:Asset tag',
  'asset_name:VARCHAR(255):NOT NULL:資産名:Asset name',
  'asset_type:VARCHAR(50):NOT NULL:種別:Asset type',
  'serial_number:VARCHAR(255):UNIQUE:シリアル番号:Serial number',
  'purchase_date:DATE::購入日:Purchase date',
  'purchase_price:DECIMAL(12,2)::購入価格:Purchase price',
  'warranty_expires_at:DATE::保証期限:Warranty expires',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status'
];

ENTITY_COLUMNS['AssetAssignment']=[
  'asset_id:UUID:FK(ItAsset) NOT NULL:資産ID:Asset ID',
  'assigned_to:UUID:FK(User) NOT NULL:割り当て先ID:Assigned to',
  'assigned_at:TIMESTAMP:DEFAULT NOW:割り当て日時:Assigned at',
  'returned_at:TIMESTAMP::返却日時:Returned at',
  'notes:TEXT::メモ:Notes'
];

ENTITY_COLUMNS['SoftwareLicense']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'product_name:VARCHAR(255):NOT NULL:製品名:Product name',
  'license_key:TEXT::ライセンスキー:License key',
  'seat_count:INT:DEFAULT 1:ライセンス数:Seat count',
  'used_seats:INT:DEFAULT 0:使用中:Used seats',
  'vendor:VARCHAR(255)::ベンダー:Vendor',
  'expires_at:DATE::有効期限:Expires at',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status'
];

ENTITY_COLUMNS['BillingClient']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'client_name:VARCHAR(255):NOT NULL:クライアント名:Client name',
  'email:VARCHAR(255)::メール:Email',
  'address:TEXT::住所:Address',
  'currency:VARCHAR(3):DEFAULT \'JPY\':通貨:Currency',
  'payment_terms_days:INT:DEFAULT 30:支払期限(日):Payment terms (days)',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status'
];

ENTITY_COLUMNS['BillingProject']=[
  'client_id:UUID:FK(BillingClient) NOT NULL:クライアントID:Client ID',
  'project_name:VARCHAR(255):NOT NULL:プロジェクト名:Project name',
  'description:TEXT::説明:Description',
  'start_date:DATE::開始日:Start date',
  'end_date:DATE::終了日:End date',
  'budget:DECIMAL(12,2)::予算:Budget',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status'
];

ENTITY_COLUMNS['BillingRate']=[
  'project_id:UUID:FK(BillingProject) NOT NULL:プロジェクトID:Project ID',
  'rate_name:VARCHAR(100):NOT NULL:レート名:Rate name',
  'hourly_rate:DECIMAL(10,2):NOT NULL:時間レート:Hourly rate',
  'currency:VARCHAR(3):DEFAULT \'JPY\':通貨:Currency',
  'effective_from:DATE:NOT NULL:適用開始日:Effective from'
];

ENTITY_COLUMNS['ProjectInvoice']=[
  'project_id:UUID:FK(BillingProject) NOT NULL:プロジェクトID:Project ID',
  'client_id:UUID:FK(BillingClient) NOT NULL:クライアントID:Client ID',
  'invoice_number:VARCHAR(100):UNIQUE NOT NULL:請求番号:Invoice number',
  'period_start:DATE:NOT NULL:請求期間開始:Period start',
  'period_end:DATE:NOT NULL:請求期間終了:Period end',
  'subtotal:DECIMAL(12,2):NOT NULL:小計:Subtotal',
  'tax:DECIMAL(12,2):DEFAULT 0:税額:Tax',
  'total:DECIMAL(12,2):NOT NULL:合計:Total',
  'status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status',
  'due_date:DATE:NOT NULL:支払期限:Due date',
  'paid_at:TIMESTAMP::支払日時:Paid at'
];

ENTITY_COLUMNS['BuilderProject']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'project_name:VARCHAR(255):NOT NULL:プロジェクト名:Project name',
  'subdomain:VARCHAR(100):UNIQUE:サブドメイン:Subdomain',
  'is_published:BOOLEAN:DEFAULT false:公開中:Published',
  'published_at:TIMESTAMP::公開日時:Published at',
  'theme_config:JSONB::テーマ設定:Theme config',
  'status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status'
];

ENTITY_COLUMNS['BuilderPage']=[
  'project_id:UUID:FK(BuilderProject) NOT NULL:プロジェクトID:Project ID',
  'slug:VARCHAR(255):NOT NULL:スラグ:Slug',
  'title:VARCHAR(255):NOT NULL:タイトル:Title',
  'meta_description:TEXT::メタ説明:Meta description',
  'is_homepage:BOOLEAN:DEFAULT false:ホームページ:Is homepage',
  'order_index:INT:DEFAULT 0:表示順:Order index'
];

ENTITY_COLUMNS['BuilderBlock']=[
  'page_id:UUID:FK(BuilderPage) NOT NULL:ページID:Page ID',
  'block_type:VARCHAR(50):NOT NULL:ブロック種別:Block type',
  'content:JSONB:NOT NULL:コンテンツ:Content',
  'style:JSONB::スタイル設定:Style config',
  'order_index:INT:DEFAULT 0:表示順:Order index',
  'is_hidden:BOOLEAN:DEFAULT false:非表示:Hidden'
];

// ── Count ≥ 2 (38 entities) ─────────────────────────────────────────────────

ENTITY_COLUMNS['SustainabilityScore']=[
  'entity_id:UUID:NOT NULL:エンティティID:Entity ID',
  'entity_type:VARCHAR(50):NOT NULL:種別:Entity type',
  'score:DECIMAL(5,2):NOT NULL:スコア:Score',
  'category:VARCHAR(50):NOT NULL:カテゴリ:Category',
  'period:VARCHAR(7):NOT NULL:対象期間(YYYY-MM):Period',
  'calculated_at:TIMESTAMP:DEFAULT NOW:計算日時:Calculated at',
  'methodology:VARCHAR(100)::算定方法:Methodology'
];

ENTITY_COLUMNS['Chapter']=[
  'series_id:UUID:NOT NULL:シリーズID:Series ID',
  'chapter_number:INT:NOT NULL:章番号:Chapter number',
  'title:VARCHAR(255)::タイトル:Title',
  'content:TEXT::内容:Content',
  'word_count:INT:DEFAULT 0:文字数:Word count',
  'is_published:BOOLEAN:DEFAULT false:公開:Published',
  'published_at:TIMESTAMP::公開日時:Published at'
];

ENTITY_COLUMNS['PriceHistory']=[
  'product_id:UUID:NOT NULL:製品ID:Product ID',
  'price:DECIMAL(10,2):NOT NULL:価格:Price',
  'currency:VARCHAR(3):DEFAULT \'JPY\':通貨:Currency',
  'changed_at:TIMESTAMP:DEFAULT NOW:変更日時:Changed at',
  'changed_by:UUID:FK(User)::変更者ID:Changed by',
  'reason:VARCHAR(255)::変更理由:Reason'
];

ENTITY_COLUMNS['TransactionLog']=[
  'transaction_id:VARCHAR(255):NOT NULL:取引ID:Transaction ID',
  'action:VARCHAR(100):NOT NULL:操作:Action',
  'actor_id:UUID:FK(User)::操作者ID:Actor ID',
  'details:JSONB::詳細:Details',
  'ip_address:VARCHAR(45)::IPアドレス:IP address',
  'logged_at:TIMESTAMP:DEFAULT NOW:記録日時:Logged at'
];

ENTITY_COLUMNS['GenerationJob']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'job_type:VARCHAR(50):NOT NULL:ジョブ種別:Job type',
  'prompt:TEXT:NOT NULL:プロンプト:Prompt',
  'status:VARCHAR(20):DEFAULT \'queued\':ステータス:Status',
  'result_url:TEXT::結果URL:Result URL',
  'tokens_used:INT::使用トークン:Tokens used',
  'error:TEXT::エラー:Error',
  'queued_at:TIMESTAMP:DEFAULT NOW:キュー日時:Queued at',
  'started_at:TIMESTAMP::開始日時:Started at',
  'completed_at:TIMESTAMP::完了日時:Completed at'
];

ENTITY_COLUMNS['Poll']=[
  'user_id:UUID:FK(User) NOT NULL:作成者ID:Creator ID',
  'question:TEXT:NOT NULL:質問:Question',
  'options:JSONB:NOT NULL:選択肢:Options',
  'ends_at:TIMESTAMP::終了日時:Ends at',
  'is_anonymous:BOOLEAN:DEFAULT false:匿名:Anonymous',
  'multiple_choice:BOOLEAN:DEFAULT false:複数選択:Multiple choice',
  'is_active:BOOLEAN:DEFAULT true:有効:Active',
  'total_votes:INT:DEFAULT 0:総投票数:Total votes'
];

ENTITY_COLUMNS['Character']=[
  'name:VARCHAR(255):NOT NULL:キャラクター名:Character name',
  'description:TEXT::説明:Description',
  'class:VARCHAR(100)::クラス:Class',
  'level:INT:DEFAULT 1:レベル:Level',
  'stats:JSONB::ステータス:Stats',
  'appearance:JSONB::外見:Appearance',
  'created_by:UUID:FK(User) NOT NULL:作成者ID:Created by',
  'is_public:BOOLEAN:DEFAULT false:公開:Public'
];

ENTITY_COLUMNS['PlayerProfile']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'display_name:VARCHAR(100):NOT NULL:表示名:Display name',
  'level:INT:DEFAULT 1:レベル:Level',
  'xp:INT:DEFAULT 0:経験値:XP',
  'rating:INT:DEFAULT 1000:レーティング:Rating',
  'total_playtime_min:INT:DEFAULT 0:総プレイ時間(分):Total playtime',
  'favorite_genre:VARCHAR(100)::好みジャンル:Favorite genre'
];

ENTITY_COLUMNS['VoiceProfile']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'profile_name:VARCHAR(255):NOT NULL:プロフィール名:Profile name',
  'voice_id:VARCHAR(100):NOT NULL:音声ID:Voice ID',
  'language:VARCHAR(10):DEFAULT \'ja\':言語:Language',
  'style:VARCHAR(50)::スタイル:Style',
  'sample_url:TEXT::サンプルURL:Sample URL',
  'is_active:BOOLEAN:DEFAULT true:有効:Active',
  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at'
];

ENTITY_COLUMNS['AdCampaign']=[
  'name:VARCHAR(255):NOT NULL:キャンペーン名:Campaign name',
  'owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID',
  'platform:VARCHAR(50):NOT NULL:プラットフォーム:Platform',
  'budget:DECIMAL(10,2):NOT NULL:予算:Budget',
  'spent:DECIMAL(10,2):DEFAULT 0:消費額:Spent',
  'target_audience:JSONB::ターゲット:Target audience',
  'creative_config:JSONB::クリエイティブ設定:Creative config',
  'start_date:DATE:NOT NULL:開始日:Start date',
  'end_date:DATE:NOT NULL:終了日:End date',
  'status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status'
];

ENTITY_COLUMNS['Track']=[
  'title:VARCHAR(255):NOT NULL:タイトル:Title',
  'artist:VARCHAR(255)::アーティスト:Artist',
  'duration_sec:INT::長さ(秒):Duration (sec)',
  'audio_url:TEXT::音声URL:Audio URL',
  'genre:VARCHAR(100)::ジャンル:Genre',
  'created_by:UUID:FK(User) NOT NULL:作成者ID:Created by',
  'is_public:BOOLEAN:DEFAULT false:公開:Public',
  'play_count:INT:DEFAULT 0:再生数:Play count'
];

ENTITY_COLUMNS['DesignProject']=[
  'owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID',
  'name:VARCHAR(255):NOT NULL:プロジェクト名:Project name',
  'project_type:VARCHAR(50):NOT NULL:種別:Project type',
  'description:TEXT::説明:Description',
  'assets:JSONB::アセット:Assets',
  'deadline:DATE::期限:Deadline',
  'status:VARCHAR(20):DEFAULT \'in_progress\':ステータス:Status',
  'is_public:BOOLEAN:DEFAULT false:公開:Public'
];

ENTITY_COLUMNS['TherapySession']=[
  'client_id:UUID:FK(User) NOT NULL:クライアントID:Client ID',
  'therapist_id:UUID:FK(User) NOT NULL:セラピストID:Therapist ID',
  'session_date:DATE:NOT NULL:セッション日:Session date',
  'duration_min:INT:DEFAULT 50:時間(分):Duration (min)',
  'session_type:VARCHAR(50):DEFAULT \'individual\':セッション種別:Session type',
  'notes:TEXT::メモ:Notes',
  'mood_score:INT::気分スコア(1-10):Mood score',
  'homework:TEXT::宿題:Homework',
  'status:VARCHAR(20):DEFAULT \'scheduled\':ステータス:Status'
];

ENTITY_COLUMNS['EngagementScore']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'score:DECIMAL(5,2):NOT NULL:スコア:Score',
  'metric_type:VARCHAR(50):NOT NULL:指標種別:Metric type',
  'period:VARCHAR(20):DEFAULT \'weekly\':期間:Period',
  'breakdown:JSONB::内訳:Breakdown',
  'calculated_at:TIMESTAMP:DEFAULT NOW:計算日時:Calculated at'
];

ENTITY_COLUMNS['BurnoutRisk']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'risk_level:VARCHAR(20):NOT NULL:リスクレベル:Risk level',
  'score:DECIMAL(5,2):NOT NULL:スコア:Score',
  'factors:JSONB::要因:Risk factors',
  'workload_score:DECIMAL(5,2)::業務負荷スコア:Workload score',
  'assessed_at:TIMESTAMP:DEFAULT NOW:評価日時:Assessed at',
  'recommendations:JSONB::推奨事項:Recommendations'
];

ENTITY_COLUMNS['TrendSignal']=[
  'signal_name:VARCHAR(255):NOT NULL:シグナル名:Signal name',
  'category:VARCHAR(100):NOT NULL:カテゴリ:Category',
  'strength:VARCHAR(20):NOT NULL:強度:Strength',
  'description:TEXT::説明:Description',
  'source_url:TEXT::ソースURL:Source URL',
  'tags:JSONB::タグ:Tags',
  'detected_at:TIMESTAMP:DEFAULT NOW:検知日時:Detected at',
  'is_active:BOOLEAN:DEFAULT true:有効:Active'
];

ENTITY_COLUMNS['PriceAlert']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'product_id:VARCHAR(255):NOT NULL:商品ID:Product ID',
  'target_price:DECIMAL(10,2):NOT NULL:目標価格:Target price',
  'current_price:DECIMAL(10,2)::現在価格:Current price',
  'condition:VARCHAR(20):DEFAULT \'below\':条件:Condition',
  'is_active:BOOLEAN:DEFAULT true:有効:Active',
  'triggered_at:TIMESTAMP::発火日時:Triggered at',
  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at'
];

ENTITY_COLUMNS['HealthCheck']=[
  'service_name:VARCHAR(255):NOT NULL:サービス名:Service name',
  'endpoint:VARCHAR(500)::エンドポイント:Endpoint',
  'status:VARCHAR(20):NOT NULL:状態:Status',
  'http_status:INT::HTTPステータス:HTTP status',
  'response_time_ms:INT::応答時間(ms):Response time (ms)',
  'details:JSONB::詳細:Details',
  'checked_at:TIMESTAMP:DEFAULT NOW:チェック日時:Checked at'
];

ENTITY_COLUMNS['BehaviorLog']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'event_type:VARCHAR(100):NOT NULL:イベント種別:Event type',
  'page:VARCHAR(255)::ページ:Page',
  'element:VARCHAR(255)::要素:Element',
  'properties:JSONB::プロパティ:Properties',
  'session_id:VARCHAR(100)::セッションID:Session ID',
  'logged_at:TIMESTAMP:DEFAULT NOW:記録日時:Logged at'
];

ENTITY_COLUMNS['AnalysisReport']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'title:VARCHAR(255):NOT NULL:タイトル:Title',
  'report_type:VARCHAR(50):NOT NULL:レポート種別:Report type',
  'data:JSONB::データ:Data',
  'summary:TEXT::サマリー:Summary',
  'charts:JSONB::チャート:Charts',
  'generated_at:TIMESTAMP:DEFAULT NOW:生成日時:Generated at',
  'is_public:BOOLEAN:DEFAULT false:公開:Public'
];

ENTITY_COLUMNS['MaintenanceSchedule']=[
  'equipment_id:VARCHAR(255):NOT NULL:設備ID:Equipment ID',
  'equipment_type:VARCHAR(100)::設備種別:Equipment type',
  'maintenance_type:VARCHAR(100):NOT NULL:メンテナンス種別:Maintenance type',
  'scheduled_date:DATE:NOT NULL:予定日:Scheduled date',
  'frequency:VARCHAR(50):NOT NULL:頻度:Frequency',
  'assigned_to:UUID:FK(User)::担当者ID:Assigned to',
  'estimated_duration_min:INT::推定所要時間(分):Estimated duration',
  'is_completed:BOOLEAN:DEFAULT false:完了:Completed',
  'completed_at:TIMESTAMP::完了日時:Completed at'
];

ENTITY_COLUMNS['InspectionReport']=[
  'inspector_id:UUID:FK(User) NOT NULL:検査員ID:Inspector ID',
  'target_id:VARCHAR(255):NOT NULL:対象ID:Target ID',
  'target_type:VARCHAR(100):NOT NULL:対象種別:Target type',
  'result:VARCHAR(30):NOT NULL:結果:Result',
  'score:DECIMAL(5,2)::スコア:Score',
  'findings:TEXT::所見:Findings',
  'photos:JSONB::写真URL:Photos',
  'inspected_at:TIMESTAMP:DEFAULT NOW:検査日時:Inspected at',
  'next_due:DATE::次回予定:Next due'
];

ENTITY_COLUMNS['PatientRecord']=[
  'patient_id:UUID:FK(Patient) NOT NULL:患者ID:Patient ID',
  'record_type:VARCHAR(50):NOT NULL:記録種別:Record type',
  'content:JSONB:NOT NULL:内容:Content',
  'attachments:JSONB::添付ファイル:Attachments',
  'recorded_by:UUID:FK(User) NOT NULL:記録者ID:Recorded by',
  'is_confidential:BOOLEAN:DEFAULT true:機密:Confidential',
  'recorded_at:TIMESTAMP:DEFAULT NOW:記録日時:Recorded at'
];

ENTITY_COLUMNS['LearningSession']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'content_id:UUID::コンテンツID:Content ID',
  'content_type:VARCHAR(50)::コンテンツ種別:Content type',
  'started_at:TIMESTAMP:NOT NULL:開始日時:Started at',
  'ended_at:TIMESTAMP::終了日時:Ended at',
  'duration_min:INT::学習時間(分):Duration (min)',
  'progress_pct:INT:DEFAULT 0:進捗(%):Progress (%)',
  'completed:BOOLEAN:DEFAULT false:完了:Completed',
  'score:INT::スコア:Score'
];

ENTITY_COLUMNS['MemoryStore']=[
  'agent_id:VARCHAR(255):NOT NULL:エージェントID:Agent ID',
  'user_id:UUID:FK(User)::ユーザーID:User ID',
  'memory_type:VARCHAR(50):NOT NULL:メモリ種別:Memory type',
  'content:TEXT:NOT NULL:内容:Content',
  'embedding:JSONB::埋め込みベクトル:Embedding',
  'tags:JSONB::タグ:Tags',
  'importance:DECIMAL(5,2):DEFAULT 0.5:重要度:Importance',
  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at',
  'expires_at:TIMESTAMP::有効期限:Expires at',
  'last_accessed_at:TIMESTAMP::最終参照日時:Last accessed at'
];

ENTITY_COLUMNS['AnalysisJob']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'job_type:VARCHAR(50):NOT NULL:ジョブ種別:Job type',
  'input:JSONB:NOT NULL:入力:Input',
  'status:VARCHAR(20):DEFAULT \'queued\':ステータス:Status',
  'result:JSONB::結果:Result',
  'error:TEXT::エラー:Error',
  'priority:INT:DEFAULT 0:優先度:Priority',
  'queued_at:TIMESTAMP:DEFAULT NOW:キュー日時:Queued at',
  'started_at:TIMESTAMP::開始日時:Started at',
  'completed_at:TIMESTAMP::完了日時:Completed at'
];

ENTITY_COLUMNS['Child']=[
  'name:VARCHAR(255):NOT NULL:氏名:Name',
  'date_of_birth:DATE:NOT NULL:生年月日:Date of birth',
  'guardian_id:UUID:FK(User) NOT NULL:保護者ID:Guardian ID',
  'gender:VARCHAR(20)::性別:Gender',
  'allergies:TEXT::アレルギー:Allergies',
  'medical_notes:TEXT::医療メモ:Medical notes',
  'notes:TEXT::メモ:Notes',
  'is_active:BOOLEAN:DEFAULT true:在籍:Active'
];

ENTITY_COLUMNS['SupportService']=[
  'service_name:VARCHAR(255):NOT NULL:サービス名:Service name',
  'service_type:VARCHAR(100):NOT NULL:サービス種別:Service type',
  'description:TEXT::説明:Description',
  'provider_id:UUID:FK(User) NOT NULL:提供者ID:Provider ID',
  'capacity:INT::定員:Capacity',
  'cost:DECIMAL(10,2):DEFAULT 0:費用:Cost',
  'is_active:BOOLEAN:DEFAULT true:有効:Active'
];

ENTITY_COLUMNS['BudgetPlan']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'plan_name:VARCHAR(255):NOT NULL:プラン名:Plan name',
  'period_start:DATE:NOT NULL:開始日:Period start',
  'period_end:DATE:NOT NULL:終了日:Period end',
  'total_budget:DECIMAL(10,2):NOT NULL:総予算:Total budget',
  'currency:VARCHAR(3):DEFAULT \'JPY\':通貨:Currency',
  'categories:JSONB::カテゴリ別予算:Budget categories',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status'
];

ENTITY_COLUMNS['SequencingResult']=[
  'sample_id:UUID:FK(GenomeSample) NOT NULL:サンプルID:Sample ID',
  'result_type:VARCHAR(50):NOT NULL:結果種別:Result type',
  'data_url:TEXT::データURL:Data URL',
  'quality_score:DECIMAL(5,2)::品質スコア:Quality score',
  'coverage_depth:DECIMAL(8,2)::カバレッジ深度:Coverage depth',
  'variants_count:INT::変異数:Variants count',
  'pipeline_version:VARCHAR(30)::パイプラインバージョン:Pipeline version',
  'completed_at:TIMESTAMP:DEFAULT NOW:完了日時:Completed at'
];

ENTITY_COLUMNS['MicrobiomeReport']=[
  'sample_id:UUID:FK(MicrobiomeSample) NOT NULL:サンプルID:Sample ID',
  'diversity_score:DECIMAL(5,2)::多様性スコア:Diversity score',
  'dominant_genera:JSONB::優占菌属:Dominant genera',
  'health_indicators:JSONB::健康指標:Health indicators',
  'risk_flags:JSONB::リスクフラグ:Risk flags',
  'recommendations:TEXT::推奨事項:Recommendations',
  'generated_at:TIMESTAMP:DEFAULT NOW:生成日時:Generated at'
];

ENTITY_COLUMNS['ShiftSchedule']=[
  'staff_id:UUID:FK(User) NOT NULL:スタッフID:Staff ID',
  'shift_date:DATE:NOT NULL:勤務日:Shift date',
  'start_time:TIME:NOT NULL:開始時刻:Start time',
  'end_time:TIME:NOT NULL:終了時刻:End time',
  'role:VARCHAR(50)::役割:Role',
  'location:VARCHAR(255)::勤務場所:Location',
  'is_confirmed:BOOLEAN:DEFAULT false:確定:Confirmed',
  'notes:TEXT::メモ:Notes'
];

ENTITY_COLUMNS['DataFlowMap']=[
  'name:VARCHAR(255):NOT NULL:名前:Name',
  'owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID',
  'description:TEXT::説明:Description',
  'nodes:JSONB:NOT NULL:ノード:Nodes',
  'edges:JSONB:NOT NULL:エッジ:Edges',
  'version:INT:DEFAULT 1:バージョン:Version',
  'is_active:BOOLEAN:DEFAULT true:有効:Active'
];

ENTITY_COLUMNS['RenovationProject']=[
  'owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID',
  'property_id:UUID:FK(Property)::物件ID:Property ID',
  'project_name:VARCHAR(255):NOT NULL:プロジェクト名:Project name',
  'budget:DECIMAL(12,2):NOT NULL:予算:Budget',
  'actual_cost:DECIMAL(12,2):DEFAULT 0:実績費用:Actual cost',
  'start_date:DATE:NOT NULL:開始日:Start date',
  'end_date:DATE:NOT NULL:終了日:End date',
  'contractor_id:UUID:FK(Contractor)::業者ID:Contractor ID',
  'status:VARCHAR(20):DEFAULT \'planning\':ステータス:Status',
  'photos:JSONB::写真:Photos'
];

ENTITY_COLUMNS['AdoptionApplicant']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'name:VARCHAR(255):NOT NULL:申込者名:Applicant name',
  'address:TEXT:NOT NULL:住所:Address',
  'household_members:INT:DEFAULT 1:世帯人数:Household members',
  'housing_type:VARCHAR(50)::住居種別:Housing type',
  'has_pets:BOOLEAN:DEFAULT false:ペット有:Has pets',
  'yard:BOOLEAN:DEFAULT false:庭有:Has yard',
  'experience:TEXT::飼育経験:Experience',
  'notes:TEXT::メモ:Notes',
  'applied_at:TIMESTAMP:DEFAULT NOW:申込日時:Applied at'
];

ENTITY_COLUMNS['AdoptionMatch']=[
  'applicant_id:UUID:FK(AdoptionApplicant) NOT NULL:申込者ID:Applicant ID',
  'animal_id:UUID:NOT NULL:動物ID:Animal ID',
  'match_score:DECIMAL(5,2)::マッチスコア:Match score',
  'status:VARCHAR(20):DEFAULT \'pending\':ステータス:Status',
  'reviewer_id:UUID:FK(User)::審査者ID:Reviewer ID',
  'matched_at:TIMESTAMP:DEFAULT NOW:マッチ日時:Matched at',
  'finalized_at:TIMESTAMP::確定日時:Finalized at',
  'notes:TEXT::メモ:Notes'
];

ENTITY_COLUMNS['FraudSignal']=[
  'transaction_id:VARCHAR(255)::取引ID:Transaction ID',
  'signal_type:VARCHAR(50):NOT NULL:シグナル種別:Signal type',
  'confidence:DECIMAL(5,4):NOT NULL:信頼度:Confidence',
  'value:TEXT::値:Value',
  'description:TEXT::説明:Description',
  'is_suppressed:BOOLEAN:DEFAULT false:抑制済み:Suppressed',
  'triggered_at:TIMESTAMP:DEFAULT NOW:発生日時:Triggered at'
];

ENTITY_COLUMNS['QualityScore']=[
  'entity_type:VARCHAR(50):NOT NULL:エンティティ種別:Entity type',
  'entity_id:UUID:NOT NULL:エンティティID:Entity ID',
  'score:DECIMAL(5,2):NOT NULL:スコア:Score',
  'max_score:DECIMAL(5,2):DEFAULT 100:最高スコア:Max score',
  'dimension:VARCHAR(50):NOT NULL:評価次元:Dimension',
  'notes:TEXT::メモ:Notes',
  'scored_by:UUID:FK(User)::評価者ID:Scored by',
  'scored_at:TIMESTAMP:DEFAULT NOW:評価日時:Scored at'
];

// ── Count = 1, high-value entities (42 more) ─────────────────────────────────

ENTITY_COLUMNS['NPC']=[
  'game_id:UUID:NOT NULL:ゲームID:Game ID',
  'name:VARCHAR(255):NOT NULL:NPC名:NPC name',
  'npc_type:VARCHAR(50):NOT NULL:NPC種別:NPC type',
  'stats:JSONB::ステータス:Stats',
  'dialog_tree_id:UUID:FK(DialogTree)::ダイアログIDツリー:Dialog tree ID',
  'location:VARCHAR(255)::場所:Location',
  'is_active:BOOLEAN:DEFAULT true:有効:Active'
];

ENTITY_COLUMNS['DialogTree']=[
  'name:VARCHAR(255):NOT NULL:名前:Name',
  'owner_type:VARCHAR(50)::オーナー種別:Owner type',
  'owner_id:UUID::オーナーID:Owner ID',
  'root_node_id:VARCHAR(100)::ルートノードID:Root node ID',
  'nodes:JSONB:NOT NULL:ノード:Nodes',
  'localization:JSONB::多言語対応:Localization',
  'version:INT:DEFAULT 1:バージョン:Version'
];

ENTITY_COLUMNS['QuestState']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'quest_id:VARCHAR(100):NOT NULL:クエストID:Quest ID',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status',
  'progress:JSONB::進捗:Progress',
  'started_at:TIMESTAMP:DEFAULT NOW:開始日時:Started at',
  'completed_at:TIMESTAMP::完了日時:Completed at'
];

ENTITY_COLUMNS['GameSession']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'game_mode:VARCHAR(50):NOT NULL:ゲームモード:Game mode',
  'started_at:TIMESTAMP:DEFAULT NOW:開始日時:Started at',
  'ended_at:TIMESTAMP::終了日時:Ended at',
  'score:INT:DEFAULT 0:スコア:Score',
  'result:VARCHAR(20)::結果:Result',
  'events:JSONB::イベント:Events',
  'metadata:JSONB::メタデータ:Metadata'
];

ENTITY_COLUMNS['GenerationRule']=[
  'name:VARCHAR(255):NOT NULL:ルール名:Rule name',
  'rule_type:VARCHAR(50):NOT NULL:ルール種別:Rule type',
  'conditions:JSONB:NOT NULL:条件:Conditions',
  'template:TEXT:NOT NULL:テンプレート:Template',
  'weight:DECIMAL(5,2):DEFAULT 1.0:重み:Weight',
  'is_active:BOOLEAN:DEFAULT true:有効:Active',
  'created_by:UUID:FK(User) NOT NULL:作成者ID:Created by'
];

ENTITY_COLUMNS['GeneratedContent']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'content_type:VARCHAR(50):NOT NULL:コンテンツ種別:Content type',
  'prompt:TEXT:NOT NULL:プロンプト:Prompt',
  'output:TEXT:NOT NULL:出力:Output',
  'model:VARCHAR(100)::使用モデル:Model',
  'tokens_used:INT::使用トークン:Tokens used',
  'rating:INT::評価(1-5):Rating',
  'is_saved:BOOLEAN:DEFAULT false:保存済:Saved',
  'generated_at:TIMESTAMP:DEFAULT NOW:生成日時:Generated at'
];

ENTITY_COLUMNS['GameAsset']=[
  'name:VARCHAR(255):NOT NULL:アセット名:Asset name',
  'asset_type:VARCHAR(50):NOT NULL:種別:Asset type',
  'file_url:TEXT:NOT NULL:ファイルURL:File URL',
  'file_size_kb:INT::ファイルサイズ(KB):File size (KB)',
  'tags:JSONB::タグ:Tags',
  'game_id:UUID::ゲームID:Game ID',
  'uploaded_by:UUID:FK(User) NOT NULL:アップロード者ID:Uploaded by',
  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at'
];

ENTITY_COLUMNS['Player']=[
  'user_id:UUID:FK(User)::ユーザーID:User ID',
  'display_name:VARCHAR(100):NOT NULL:表示名:Display name',
  'team_id:UUID::チームID:Team ID',
  'position:VARCHAR(100)::ポジション:Position',
  'jersey_number:INT::背番号:Jersey number',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status',
  'joined_at:TIMESTAMP:DEFAULT NOW:加入日時:Joined at'
];

ENTITY_COLUMNS['Match']=[
  'home_team_id:UUID:NOT NULL:ホームチームID:Home team ID',
  'away_team_id:UUID:NOT NULL:アウェイチームID:Away team ID',
  'scheduled_at:TIMESTAMP:NOT NULL:開始予定日時:Scheduled at',
  'venue:VARCHAR(255)::会場:Venue',
  'home_score:INT::ホームスコア:Home score',
  'away_score:INT::アウェイスコア:Away score',
  'status:VARCHAR(20):DEFAULT \'scheduled\':ステータス:Status',
  'season:VARCHAR(30)::シーズン:Season'
];

ENTITY_COLUMNS['MatchEvent']=[
  'match_id:UUID:FK(Match) NOT NULL:試合ID:Match ID',
  'event_type:VARCHAR(50):NOT NULL:イベント種別:Event type',
  'player_id:UUID::選手ID:Player ID',
  'minute:INT::時間(分):Minute',
  'description:TEXT::説明:Description',
  'occurred_at:TIMESTAMP:DEFAULT NOW:発生日時:Occurred at'
];

ENTITY_COLUMNS['TeamStat']=[
  'team_id:UUID:NOT NULL:チームID:Team ID',
  'season:VARCHAR(30):NOT NULL:シーズン:Season',
  'wins:INT:DEFAULT 0:勝利数:Wins',
  'losses:INT:DEFAULT 0:敗北数:Losses',
  'draws:INT:DEFAULT 0:引き分け:Draws',
  'goals_for:INT:DEFAULT 0:得点:Goals for',
  'goals_against:INT:DEFAULT 0:失点:Goals against',
  'points:INT:DEFAULT 0:勝ち点:Points',
  'rank:INT::順位:Rank'
];

ENTITY_COLUMNS['DraftPick']=[
  'team_id:UUID:NOT NULL:チームID:Team ID',
  'season:VARCHAR(30):NOT NULL:シーズン:Season',
  'round:INT:NOT NULL:ラウンド:Round',
  'pick_number:INT:NOT NULL:指名番号:Pick number',
  'player_id:UUID:FK(Player)::指名選手ID:Player ID',
  'player_name:VARCHAR(255)::指名選手名:Player name',
  'picked_at:TIMESTAMP:DEFAULT NOW:指名日時:Picked at'
];

ENTITY_COLUMNS['TestAgent']=[
  'name:VARCHAR(255):NOT NULL:エージェント名:Agent name',
  'agent_type:VARCHAR(50):NOT NULL:エージェント種別:Agent type',
  'model:VARCHAR(100):NOT NULL:使用モデル:Model',
  'system_prompt:TEXT::システムプロンプト:System prompt',
  'test_suite_id:UUID::テストスイートID:Test suite ID',
  'config:JSONB::設定:Config',
  'is_active:BOOLEAN:DEFAULT true:有効:Active'
];

ENTITY_COLUMNS['TestRun']=[
  'agent_id:UUID:FK(TestAgent) NOT NULL:エージェントID:Agent ID',
  'test_case_id:UUID::テストケースID:Test case ID',
  'status:VARCHAR(20):DEFAULT \'running\':ステータス:Status',
  'input:TEXT:NOT NULL:入力:Input',
  'expected_output:TEXT::期待出力:Expected output',
  'actual_output:TEXT::実際出力:Actual output',
  'score:DECIMAL(5,2)::スコア:Score',
  'passed:BOOLEAN::合否:Passed',
  'started_at:TIMESTAMP:DEFAULT NOW:開始日時:Started at',
  'completed_at:TIMESTAMP::完了日時:Completed at'
];

ENTITY_COLUMNS['BugReport']=[
  'reporter_id:UUID:FK(User) NOT NULL:報告者ID:Reporter ID',
  'title:VARCHAR(255):NOT NULL:タイトル:Title',
  'description:TEXT:NOT NULL:説明:Description',
  'severity:VARCHAR(20):DEFAULT \'medium\':重要度:Severity',
  'status:VARCHAR(20):DEFAULT \'open\':ステータス:Status',
  'steps_to_reproduce:TEXT::再現手順:Steps to reproduce',
  'environment:VARCHAR(255)::環境:Environment',
  'assignee_id:UUID:FK(User)::担当者ID:Assignee ID',
  'resolved_at:TIMESTAMP::解決日時:Resolved at',
  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at'
];

ENTITY_COLUMNS['VideoProject']=[
  'owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID',
  'title:VARCHAR(255):NOT NULL:タイトル:Title',
  'description:TEXT::説明:Description',
  'project_type:VARCHAR(50):NOT NULL:種別:Project type',
  'duration_sec:INT::長さ(秒):Duration (sec)',
  'thumbnail_url:TEXT::サムネイルURL:Thumbnail URL',
  'status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status',
  'published_at:TIMESTAMP::公開日時:Published at'
];

ENTITY_COLUMNS['VideoAsset']=[
  'project_id:UUID:FK(VideoProject) NOT NULL:プロジェクトID:Project ID',
  'asset_name:VARCHAR(255):NOT NULL:アセット名:Asset name',
  'asset_type:VARCHAR(50):NOT NULL:種別:Asset type',
  'file_url:TEXT:NOT NULL:ファイルURL:File URL',
  'file_size_mb:DECIMAL(8,2)::ファイルサイズ(MB):File size (MB)',
  'duration_sec:INT::長さ(秒):Duration (sec)',
  'resolution:VARCHAR(20)::解像度:Resolution',
  'uploaded_at:TIMESTAMP:DEFAULT NOW:アップロード日時:Uploaded at'
];

ENTITY_COLUMNS['PublishTarget']=[
  'name:VARCHAR(255):NOT NULL:ターゲット名:Target name',
  'platform:VARCHAR(50):NOT NULL:プラットフォーム:Platform',
  'owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID',
  'config:JSONB:NOT NULL:設定:Config',
  'is_active:BOOLEAN:DEFAULT true:有効:Active',
  'last_published_at:TIMESTAMP::最終公開日時:Last published at'
];

ENTITY_COLUMNS['RawFootage']=[
  'project_id:UUID:FK(VideoProject) NOT NULL:プロジェクトID:Project ID',
  'file_name:VARCHAR(255):NOT NULL:ファイル名:File name',
  'file_url:TEXT:NOT NULL:ファイルURL:File URL',
  'file_size_mb:DECIMAL(8,2):NOT NULL:ファイルサイズ(MB):File size (MB)',
  'duration_sec:INT::長さ(秒):Duration (sec)',
  'recorded_at:TIMESTAMP::録画日時:Recorded at',
  'tags:JSONB::タグ:Tags',
  'uploaded_at:TIMESTAMP:DEFAULT NOW:アップロード日時:Uploaded at'
];

ENTITY_COLUMNS['EditProject']=[
  'owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID',
  'title:VARCHAR(255):NOT NULL:タイトル:Title',
  'source_type:VARCHAR(50)::ソース種別:Source type',
  'timeline:JSONB::タイムライン:Timeline',
  'effects_config:JSONB::エフェクト設定:Effects config',
  'output_format:VARCHAR(20)::出力フォーマット:Output format',
  'status:VARCHAR(20):DEFAULT \'in_progress\':ステータス:Status',
  'export_url:TEXT::エクスポートURL:Export URL'
];

ENTITY_COLUMNS['Seed']=[
  'name:VARCHAR(255):NOT NULL:シード名:Seed name',
  'seed_type:VARCHAR(50):NOT NULL:種別:Seed type',
  'value:BIGINT:NOT NULL:シード値:Seed value',
  'description:TEXT::説明:Description',
  'environment:VARCHAR(30):DEFAULT \'development\':環境:Environment',
  'created_by:UUID:FK(User) NOT NULL:作成者ID:Created by',
  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at'
];

ENTITY_COLUMNS['BalanceMetric']=[
  'entity_type:VARCHAR(50):NOT NULL:エンティティ種別:Entity type',
  'entity_id:VARCHAR(255):NOT NULL:エンティティID:Entity ID',
  'metric_name:VARCHAR(100):NOT NULL:指標名:Metric name',
  'value:DECIMAL(15,4):NOT NULL:値:Value',
  'target:DECIMAL(15,4)::目標値:Target',
  'deviation_pct:DECIMAL(8,2)::偏差(%):Deviation (%)',
  'recorded_at:TIMESTAMP:DEFAULT NOW:記録日時:Recorded at'
];

ENTITY_COLUMNS['ModelVersion']=[
  'model_name:VARCHAR(255):NOT NULL:モデル名:Model name',
  'version:VARCHAR(30):NOT NULL:バージョン:Version',
  'owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID',
  'framework:VARCHAR(50)::フレームワーク:Framework',
  'accuracy:DECIMAL(5,4)::精度:Accuracy',
  'artifact_url:TEXT::アーティファクトURL:Artifact URL',
  'is_production:BOOLEAN:DEFAULT false:本番環境:Is production',
  'deployed_at:TIMESTAMP::デプロイ日時:Deployed at',
  'trained_at:TIMESTAMP:DEFAULT NOW:学習日時:Trained at'
];

ENTITY_COLUMNS['DataLabel']=[
  'dataset_id:UUID:NOT NULL:データセットID:Dataset ID',
  'item_id:VARCHAR(255):NOT NULL:アイテムID:Item ID',
  'label:VARCHAR(255):NOT NULL:ラベル:Label',
  'confidence:DECIMAL(5,4):DEFAULT 1.0:信頼度:Confidence',
  'labeler_id:UUID:FK(User)::ラベラーID:Labeler ID',
  'is_verified:BOOLEAN:DEFAULT false:検証済:Verified',
  'labeled_at:TIMESTAMP:DEFAULT NOW:ラベル付け日時:Labeled at'
];

ENTITY_COLUMNS['TrainingDataset']=[
  'name:VARCHAR(255):NOT NULL:データセット名:Dataset name',
  'description:TEXT::説明:Description',
  'owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID',
  'data_type:VARCHAR(50):NOT NULL:データ種別:Data type',
  'item_count:INT:DEFAULT 0:アイテム数:Item count',
  'size_mb:DECIMAL(10,2)::サイズ(MB):Size (MB)',
  'labels:JSONB::ラベル一覧:Labels',
  'is_public:BOOLEAN:DEFAULT false:公開:Public',
  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at'
];

ENTITY_COLUMNS['CampaignLead']=[
  'campaign_id:UUID:FK(Campaign) NOT NULL:キャンペーンID:Campaign ID',
  'email:VARCHAR(255):NOT NULL:メール:Email',
  'name:VARCHAR(255)::氏名:Name',
  'phone:VARCHAR(50)::電話番号:Phone',
  'source:VARCHAR(100)::獲得元:Source',
  'score:INT:DEFAULT 0:スコア:Score',
  'status:VARCHAR(30):DEFAULT \'new\':ステータス:Status',
  'captured_at:TIMESTAMP:DEFAULT NOW:獲得日時:Captured at',
  'last_contacted_at:TIMESTAMP::最終連絡日時:Last contacted at'
];

ENTITY_COLUMNS['Annotation']=[
  'document_id:UUID:NOT NULL:ドキュメントID:Document ID',
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'annotation_type:VARCHAR(50):NOT NULL:注釈種別:Annotation type',
  'content:TEXT:NOT NULL:内容:Content',
  'position:JSONB::位置:Position',
  'color:VARCHAR(7)::カラー:Color',
  'is_public:BOOLEAN:DEFAULT false:公開:Public',
  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at'
];

ENTITY_COLUMNS['PushNotification']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'title:VARCHAR(255):NOT NULL:タイトル:Title',
  'body:TEXT:NOT NULL:本文:Body',
  'notification_type:VARCHAR(50):NOT NULL:通知種別:Type',
  'data:JSONB::データ:Data',
  'sent_at:TIMESTAMP:DEFAULT NOW:送信日時:Sent at',
  'read_at:TIMESTAMP::既読日時:Read at',
  'is_read:BOOLEAN:DEFAULT false:既読:Read'
];

ENTITY_COLUMNS['ContentDraft']=[
  'author_id:UUID:FK(User) NOT NULL:著者ID:Author ID',
  'title:VARCHAR(255):NOT NULL:タイトル:Title',
  'body:TEXT::本文:Body',
  'content_type:VARCHAR(50):DEFAULT \'article\':コンテンツ種別:Content type',
  'status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status',
  'scheduled_at:TIMESTAMP::公開予定日時:Scheduled at',
  'metadata:JSONB::メタデータ:Metadata',
  'version:INT:DEFAULT 1:バージョン:Version'
];

ENTITY_COLUMNS['FeedItem']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'item_type:VARCHAR(50):NOT NULL:アイテム種別:Item type',
  'source_id:UUID:NOT NULL:ソースID:Source ID',
  'source_type:VARCHAR(50):NOT NULL:ソース種別:Source type',
  'content:JSONB::コンテンツ:Content',
  'is_seen:BOOLEAN:DEFAULT false:閲覧済:Seen',
  'score:DECIMAL(8,4):DEFAULT 0:スコア:Score',
  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at'
];

ENTITY_COLUMNS['ReferralCode']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'code:VARCHAR(50):UNIQUE NOT NULL:紹介コード:Referral code',
  'uses:INT:DEFAULT 0:使用回数:Uses',
  'max_uses:INT:DEFAULT -1:最大使用回数(-1=無制限):Max uses',
  'reward_type:VARCHAR(50)::報酬種別:Reward type',
  'reward_value:DECIMAL(10,2)::報酬額:Reward value',
  'expires_at:TIMESTAMP::有効期限:Expires at',
  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at'
];

ENTITY_COLUMNS['Testimonial']=[
  'author_id:UUID:FK(User)::著者ID:Author ID',
  'author_name:VARCHAR(255):NOT NULL:著者名:Author name',
  'company:VARCHAR(255)::会社名:Company',
  'content:TEXT:NOT NULL:内容:Content',
  'rating:INT::評価(1-5):Rating',
  'is_approved:BOOLEAN:DEFAULT false:承認済:Approved',
  'is_featured:BOOLEAN:DEFAULT false:注目:Featured',
  'published_at:TIMESTAMP::公開日時:Published at'
];

ENTITY_COLUMNS['GeoFence']=[
  'name:VARCHAR(255):NOT NULL:ジオフェンス名:Geo-fence name',
  'center_lat:DECIMAL(10,7):NOT NULL:中心緯度:Center lat',
  'center_lng:DECIMAL(10,7):NOT NULL:中心経度:Center lng',
  'radius_m:INT:NOT NULL:半径(m):Radius (m)',
  'event_types:JSONB::イベント種別:Event types',
  'is_active:BOOLEAN:DEFAULT true:有効:Active',
  'created_by:UUID:FK(User) NOT NULL:作成者ID:Created by'
];

// ── ext13: presets-ext13.js new entity columns ────────────────────────────────

ENTITY_COLUMNS['StatDataset']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'name:VARCHAR(255):NOT NULL:データセット名:Dataset name',
  'description:TEXT::説明:Description',
  'row_count:INT:DEFAULT 0:行数:Row count',
  'column_names:JSONB::列名リスト:Column names',
  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at'
];

ENTITY_COLUMNS['StatAnalysis']=[
  'dataset_id:UUID:FK(StatDataset) NOT NULL:データセットID:Dataset ID',
  'analysis_type:VARCHAR(50):NOT NULL:解析種別:Analysis type',
  'parameters:JSONB::パラメータ:Parameters',
  'result_summary:JSONB::結果サマリー:Result summary',
  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at'
];

ENTITY_COLUMNS['StatHypothesis']=[
  'dataset_id:UUID:FK(StatDataset) NOT NULL:データセットID:Dataset ID',
  'test_type:VARCHAR(50):NOT NULL:検定種別:Test type',
  'null_hypothesis:TEXT:NOT NULL:帰無仮説:Null hypothesis',
  'alpha:DECIMAL(4,3):DEFAULT 0.05:有意水準:Significance level',
  'p_value:DECIMAL(10,6)::p値:p-value',
  'rejected:BOOLEAN::棄却:Rejected'
];

ENTITY_COLUMNS['StatResult']=[
  'analysis_id:UUID:FK(StatAnalysis) NOT NULL:解析ID:Analysis ID',
  'result_type:VARCHAR(50):NOT NULL:結果種別:Result type',
  'result_data:JSONB:NOT NULL:結果データ:Result data',
  'chart_config:JSONB::チャート設定:Chart config',
  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at'
];

ENTITY_COLUMNS['FlashDeck']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'title:VARCHAR(255):NOT NULL:デッキ名:Deck title',
  'description:TEXT::説明:Description',
  'card_count:INT:DEFAULT 0:カード数:Card count',
  'language:VARCHAR(10):DEFAULT \'ja\':言語:Language',
  'is_public:BOOLEAN:DEFAULT false:公開:Public'
];

ENTITY_COLUMNS['FlashCard']=[
  'deck_id:UUID:FK(FlashDeck) NOT NULL:デッキID:Deck ID',
  'front:TEXT:NOT NULL:表面:Front',
  'back:TEXT:NOT NULL:裏面:Back',
  'hint:TEXT::ヒント:Hint',
  'tags:JSONB::タグ:Tags',
  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at'
];

ENTITY_COLUMNS['FlashReviewSession']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'deck_id:UUID:FK(FlashDeck) NOT NULL:デッキID:Deck ID',
  'cards_reviewed:INT:DEFAULT 0:復習カード数:Cards reviewed',
  'correct_count:INT:DEFAULT 0:正解数:Correct count',
  'duration_sec:INT::学習時間(秒):Duration (sec)',
  'completed_at:TIMESTAMP::完了日時:Completed at'
];

ENTITY_COLUMNS['FlashProgress']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'card_id:UUID:FK(FlashCard) NOT NULL:カードID:Card ID',
  'ease_factor:DECIMAL(4,2):DEFAULT 2.5:難易度係数(SM-2):Ease factor (SM-2)',
  'interval_days:INT:DEFAULT 1:次回間隔(日):Interval (days)',
  'repetitions:INT:DEFAULT 0:繰り返し回数:Repetitions',
  'next_review_at:TIMESTAMP::次回復習日時:Next review at'
];

ENTITY_COLUMNS['PomodoroTask']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'title:VARCHAR(255):NOT NULL:タスク名:Task title',
  'estimated_pomodoros:INT:DEFAULT 1:見積ポモドーロ数:Estimated pomodoros',
  'completed_pomodoros:INT:DEFAULT 0:完了ポモドーロ数:Completed pomodoros',
  'priority:INT:DEFAULT 2:優先度(1-3):Priority',
  'status:VARCHAR(20):DEFAULT \'pending\':ステータス:Status'
];

ENTITY_COLUMNS['PomodoroSession']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'task_id:UUID:FK(PomodoroTask):タスクID:Task ID',
  'type:VARCHAR(10):DEFAULT \'work\':種別(work/break):Type',
  'duration_min:INT:DEFAULT 25:時間(分):Duration (min)',
  'started_at:TIMESTAMP:NOT NULL:開始日時:Started at',
  'ended_at:TIMESTAMP::終了日時:Ended at',
  'completed:BOOLEAN:DEFAULT false:完了:Completed'
];

ENTITY_COLUMNS['PomodoroStat']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'date:DATE:NOT NULL:日付:Date',
  'total_pomodoros:INT:DEFAULT 0:合計ポモドーロ:Total pomodoros',
  'total_focus_min:INT:DEFAULT 0:合計集中時間(分):Total focus (min)',
  'tasks_completed:INT:DEFAULT 0:完了タスク数:Tasks completed'
];

ENTITY_COLUMNS['PomodoroSetting']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'work_duration_min:INT:DEFAULT 25:作業時間(分):Work duration (min)',
  'short_break_min:INT:DEFAULT 5:短休憩(分):Short break (min)',
  'long_break_min:INT:DEFAULT 15:長休憩(分):Long break (min)',
  'long_break_interval:INT:DEFAULT 4:長休憩間隔:Long break interval',
  'sound_enabled:BOOLEAN:DEFAULT true:サウンド有効:Sound enabled'
];

ENTITY_COLUMNS['TaxIncome']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'fiscal_year:INT:NOT NULL:年度:Fiscal year',
  'income_type:VARCHAR(50):NOT NULL:所得種別:Income type',
  'gross_amount:DECIMAL(12,2):NOT NULL:収入金額:Gross amount',
  'expense_amount:DECIMAL(12,2):DEFAULT 0:経費・控除額:Expense amount',
  'net_amount:DECIMAL(12,2):NOT NULL:所得金額:Net income'
];

ENTITY_COLUMNS['TaxDeduction']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'fiscal_year:INT:NOT NULL:年度:Fiscal year',
  'deduction_type:VARCHAR(100):NOT NULL:控除種別:Deduction type',
  'amount:DECIMAL(12,2):NOT NULL:控除額:Amount',
  'description:TEXT::摘要:Description'
];

ENTITY_COLUMNS['TaxReturn']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'fiscal_year:INT:NOT NULL:年度:Fiscal year',
  'total_income:DECIMAL(12,2):NOT NULL:総所得:Total income',
  'total_deductions:DECIMAL(12,2):NOT NULL:総控除額:Total deductions',
  'taxable_income:DECIMAL(12,2):NOT NULL:課税所得:Taxable income',
  'status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status'
];

ENTITY_COLUMNS['TaxCalculation']=[
  'return_id:UUID:FK(TaxReturn) NOT NULL:申告ID:Return ID',
  'income_tax:DECIMAL(12,2):NOT NULL:所得税:Income tax',
  'resident_tax:DECIMAL(12,2):NOT NULL:住民税:Resident tax',
  'social_insurance:DECIMAL(12,2):DEFAULT 0:社会保険料:Social insurance',
  'total_tax:DECIMAL(12,2):NOT NULL:税負担合計:Total tax',
  'calculated_at:TIMESTAMP:DEFAULT NOW:計算日時:Calculated at'
];

ENTITY_COLUMNS['MinutesMeeting']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'title:VARCHAR(255):NOT NULL:会議名:Meeting title',
  'meeting_date:DATE:NOT NULL:開催日:Meeting date',
  'duration_min:INT::時間(分):Duration (min)',
  'location:VARCHAR(255)::場所:Location',
  'status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status'
];

ENTITY_COLUMNS['MinutesAttendee']=[
  'meeting_id:UUID:FK(MinutesMeeting) NOT NULL:会議ID:Meeting ID',
  'name:VARCHAR(255):NOT NULL:氏名:Name',
  'department:VARCHAR(255)::部門:Department',
  'role:VARCHAR(50)::役割:Role',
  'attended:BOOLEAN:DEFAULT true:出席:Attended'
];

ENTITY_COLUMNS['MinutesActionItem']=[
  'meeting_id:UUID:FK(MinutesMeeting) NOT NULL:会議ID:Meeting ID',
  'content:TEXT:NOT NULL:アクション内容:Action content',
  'assignee:VARCHAR(255)::担当者:Assignee',
  'due_date:DATE::期日:Due date',
  'status:VARCHAR(20):DEFAULT \'open\':ステータス:Status'
];

ENTITY_COLUMNS['MinutesSummary']=[
  'meeting_id:UUID:FK(MinutesMeeting) NOT NULL:会議ID:Meeting ID',
  'agenda_items:JSONB::議題リスト:Agenda items',
  'decisions:TEXT::決定事項:Decisions',
  'notes:TEXT::議事録全文:Full minutes',
  'ai_generated:BOOLEAN:DEFAULT false:AI生成:AI generated',
  'generated_at:TIMESTAMP::生成日時:Generated at'
];

ENTITY_COLUMNS['HazardArea']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'area_name:VARCHAR(255):NOT NULL:地区名:Area name',
  'prefecture:VARCHAR(50):NOT NULL:都道府県:Prefecture',
  'city:VARCHAR(100):NOT NULL:市区町村:City',
  'flood_risk:VARCHAR(20):DEFAULT \'low\':洪水リスク:Flood risk',
  'landslide_risk:VARCHAR(20):DEFAULT \'low\':土砂リスク:Landslide risk',
  'earthquake_risk:VARCHAR(20):DEFAULT \'low\':地震リスク:Earthquake risk'
];

ENTITY_COLUMNS['HazardMarker']=[
  'area_id:UUID:FK(HazardArea) NOT NULL:地区ID:Area ID',
  'marker_type:VARCHAR(50):NOT NULL:マーカー種別:Marker type',
  'lat:DECIMAL(10,7):NOT NULL:緯度:Latitude',
  'lng:DECIMAL(10,7):NOT NULL:経度:Longitude',
  'label:VARCHAR(255)::ラベル:Label',
  'description:TEXT::説明:Description'
];

ENTITY_COLUMNS['HazardEvacRoute']=[
  'area_id:UUID:FK(HazardArea) NOT NULL:地区ID:Area ID',
  'route_name:VARCHAR(255):NOT NULL:経路名:Route name',
  'start_point:JSONB:NOT NULL:出発地点:Start point',
  'end_point:JSONB:NOT NULL:避難所:Shelter',
  'waypoints:JSONB::中継地点:Waypoints',
  'distance_m:INT::距離(m):Distance (m)'
];

ENTITY_COLUMNS['HazardAlert']=[
  'area_id:UUID:FK(HazardArea) NOT NULL:地区ID:Area ID',
  'alert_type:VARCHAR(50):NOT NULL:アラート種別:Alert type',
  'severity:VARCHAR(20):DEFAULT \'info\':深刻度:Severity',
  'message:TEXT:NOT NULL:メッセージ:Message',
  'issued_at:TIMESTAMP:DEFAULT NOW:発出日時:Issued at',
  'expires_at:TIMESTAMP::有効期限:Expires at'
];

ENTITY_COLUMNS['PaletteProject']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'name:VARCHAR(255):NOT NULL:パレット名:Palette name',
  'description:TEXT::説明:Description',
  'base_color:VARCHAR(7)::ベースカラー(HEX):Base color (HEX)',
  'swatch_count:INT:DEFAULT 0:スウォッチ数:Swatch count',
  'is_public:BOOLEAN:DEFAULT false:公開:Public'
];

ENTITY_COLUMNS['PaletteSwatch']=[
  'palette_id:UUID:FK(PaletteProject) NOT NULL:パレットID:Palette ID',
  'name:VARCHAR(100)::色名:Color name',
  'hex:VARCHAR(7):NOT NULL:HEXコード:HEX code',
  'rgb:JSONB::RGBオブジェクト:RGB object',
  'hsl:JSONB::HSLオブジェクト:HSL object',
  'role:VARCHAR(50)::役割(primary/accent):Role'
];

ENTITY_COLUMNS['PaletteRule']=[
  'palette_id:UUID:FK(PaletteProject) NOT NULL:パレットID:Palette ID',
  'rule_type:VARCHAR(50):NOT NULL:ルール種別:Rule type',
  'foreground_hex:VARCHAR(7):NOT NULL:前景色HEX:Foreground HEX',
  'background_hex:VARCHAR(7):NOT NULL:背景色HEX:Background HEX',
  'contrast_ratio:DECIMAL(5,2)::コントラスト比:Contrast ratio',
  'wcag_level:VARCHAR(10)::WCAGレベル:WCAG level'
];

ENTITY_COLUMNS['PaletteExport']=[
  'palette_id:UUID:FK(PaletteProject) NOT NULL:パレットID:Palette ID',
  'format:VARCHAR(20):NOT NULL:エクスポート形式:Export format',
  'content:TEXT:NOT NULL:エクスポート内容:Export content',
  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at'
];

ENTITY_COLUMNS['MindMapDoc']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'title:VARCHAR(255):NOT NULL:マインドマップ名:Mind map title',
  'description:TEXT::説明:Description',
  'node_count:INT:DEFAULT 1:ノード数:Node count',
  'template_id:VARCHAR(100)::テンプレートID:Template ID',
  'is_public:BOOLEAN:DEFAULT false:公開:Public'
];

ENTITY_COLUMNS['MindMapNode']=[
  'map_id:UUID:FK(MindMapDoc) NOT NULL:マップID:Map ID',
  'parent_id:UUID:FK(MindMapNode)::親ノードID:Parent node ID',
  'label:TEXT:NOT NULL:ラベル:Label',
  'color:VARCHAR(7)::色(HEX):Color (HEX)',
  'pos_x:DECIMAL(8,2)::X座標:X position',
  'pos_y:DECIMAL(8,2)::Y座標:Y position'
];

ENTITY_COLUMNS['MindMapEdge']=[
  'map_id:UUID:FK(MindMapDoc) NOT NULL:マップID:Map ID',
  'source_id:UUID:FK(MindMapNode) NOT NULL:始点ノードID:Source node ID',
  'target_id:UUID:FK(MindMapNode) NOT NULL:終点ノードID:Target node ID',
  'label:VARCHAR(255)::エッジラベル:Edge label',
  'style:VARCHAR(50):DEFAULT \'solid\':スタイル:Style'
];

ENTITY_COLUMNS['MindMapTag']=[
  'map_id:UUID:FK(MindMapDoc) NOT NULL:マップID:Map ID',
  'name:VARCHAR(100):NOT NULL:タグ名:Tag name',
  'color:VARCHAR(7)::色(HEX):Color (HEX)'
];

ENTITY_COLUMNS['FitPlan']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'name:VARCHAR(255):NOT NULL:プラン名:Plan name',
  'description:TEXT::説明:Description',
  'days_per_week:INT:DEFAULT 3:週当たり日数:Days per week',
  'goal:VARCHAR(255)::目標:Goal',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status'
];

ENTITY_COLUMNS['FitSession']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'plan_id:UUID:FK(FitPlan)::プランID:Plan ID',
  'session_date:DATE:NOT NULL:実施日:Session date',
  'duration_min:INT::時間(分):Duration (min)',
  'notes:TEXT::メモ:Notes',
  'calories_burned:INT::消費カロリー:Calories burned'
];

ENTITY_COLUMNS['FitSet']=[
  'session_id:UUID:FK(FitSession) NOT NULL:セッションID:Session ID',
  'exercise_name:VARCHAR(255):NOT NULL:種目名:Exercise name',
  'set_number:INT:NOT NULL:セット番号:Set number',
  'reps:INT::回数:Reps',
  'weight_kg:DECIMAL(6,2)::重量(kg):Weight (kg)',
  'duration_sec:INT::時間(秒):Duration (sec)'
];

ENTITY_COLUMNS['FitProgress']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'record_date:DATE:NOT NULL:記録日:Record date',
  'weight_kg:DECIMAL(5,2)::体重(kg):Weight (kg)',
  'body_fat_pct:DECIMAL(4,1)::体脂肪率(%):Body fat (%)',
  'muscle_mass_kg:DECIMAL(5,2)::筋肉量(kg):Muscle mass (kg)'
];

ENTITY_COLUMNS['FootprintActivity']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'category_id:UUID:FK(FootprintCategory) NOT NULL:カテゴリID:Category ID',
  'activity_date:DATE:NOT NULL:活動日:Activity date',
  'description:VARCHAR(255)::活動内容:Description',
  'quantity:DECIMAL(10,2):NOT NULL:量:Quantity',
  'unit:VARCHAR(50):NOT NULL:単位:Unit',
  'co2_kg:DECIMAL(10,4):NOT NULL:CO2排出量(kg):CO2 emission (kg)'
];

ENTITY_COLUMNS['FootprintCategory']=[
  'name:VARCHAR(100):NOT NULL:カテゴリ名:Category name',
  'name_en:VARCHAR(100):NOT NULL:カテゴリ名(英):Category name (EN)',
  'emission_factor:DECIMAL(10,6):NOT NULL:排出係数:Emission factor',
  'unit:VARCHAR(50):NOT NULL:単位:Unit',
  'icon:VARCHAR(10)::アイコン:Icon'
];

ENTITY_COLUMNS['FootprintGoal']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'target_year:INT:NOT NULL:目標年:Target year',
  'baseline_co2_kg:DECIMAL(10,2):NOT NULL:基準CO2(kg/年):Baseline CO2 (kg/yr)',
  'target_co2_kg:DECIMAL(10,2):NOT NULL:目標CO2(kg/年):Target CO2 (kg/yr)',
  'reduction_pct:DECIMAL(5,2)::削減率(%):Reduction (%)',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status'
];

ENTITY_COLUMNS['FootprintReport']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'report_period:VARCHAR(20):NOT NULL:集計期間:Report period',
  'start_date:DATE:NOT NULL:開始日:Start date',
  'end_date:DATE:NOT NULL:終了日:End date',
  'total_co2_kg:DECIMAL(10,2):NOT NULL:合計CO2(kg):Total CO2 (kg)',
  'by_category:JSONB::カテゴリ別集計:By category breakdown'
];

ENTITY_COLUMNS['OralInterview']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'title:VARCHAR(255):NOT NULL:インタビュー題名:Interview title',
  'interviewee:VARCHAR(255):NOT NULL:語り手:Interviewee',
  'interview_date:DATE::収録日:Interview date',
  'duration_sec:INT::収録時間(秒):Duration (sec)',
  'status:VARCHAR(20):DEFAULT \'raw\':ステータス:Status'
];

ENTITY_COLUMNS['OralTranscript']=[
  'interview_id:UUID:FK(OralInterview) NOT NULL:インタビューID:Interview ID',
  'language:VARCHAR(10):DEFAULT \'ja\':言語:Language',
  'content:TEXT:NOT NULL:文字起こし全文:Transcript content',
  'speaker_labels:JSONB::話者ラベル:Speaker labels',
  'ai_generated:BOOLEAN:DEFAULT false:AI生成:AI generated',
  'created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at'
];

ENTITY_COLUMNS['OralTheme']=[
  'interview_id:UUID:FK(OralInterview) NOT NULL:インタビューID:Interview ID',
  'theme_name:VARCHAR(255):NOT NULL:テーマ名:Theme name',
  'keywords:JSONB::キーワードリスト:Keywords',
  'excerpt:TEXT::引用テキスト:Excerpt',
  'ai_extracted:BOOLEAN:DEFAULT false:AI抽出:AI extracted'
];

ENTITY_COLUMNS['OralArchive']=[
  'interview_id:UUID:FK(OralInterview) NOT NULL:インタビューID:Interview ID',
  'archive_id:VARCHAR(100):UNIQUE NOT NULL:アーカイブID:Archive ID',
  'access_level:VARCHAR(20):DEFAULT \'private\':公開レベル:Access level',
  'metadata:JSONB::メタデータ:Metadata',
  'published_at:TIMESTAMP::公開日時:Published at',
  'citation:TEXT::引用情報:Citation'
];

// ── ext14: presets-ext14.js new entity columns ────────────────────────────────

ENTITY_COLUMNS['CircuitProject']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'project_name:VARCHAR(255):NOT NULL:プロジェクト名:Project name',
  'description:TEXT::説明:Description',
  'circuit_json:JSONB::回路データ:Circuit data',
  'status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status'
];

ENTITY_COLUMNS['CircuitComponent']=[
  'project_id:UUID:FK(CircuitProject) NOT NULL:プロジェクトID:Project ID',
  'component_type:VARCHAR(100):NOT NULL:コンポーネント種別:Component type',
  'label:VARCHAR(100)::ラベル:Label',
  'value:VARCHAR(100)::値:Value',
  'position_x:DECIMAL(10,2)::X座標:X position',
  'position_y:DECIMAL(10,2)::Y座標:Y position'
];

ENTITY_COLUMNS['CircuitNode']=[
  'project_id:UUID:FK(CircuitProject) NOT NULL:プロジェクトID:Project ID',
  'node_id:VARCHAR(50):NOT NULL:ノードID:Node ID',
  'node_name:VARCHAR(100)::ノード名:Node name',
  'voltage:DECIMAL(10,4)::電圧(V):Voltage (V)'
];

ENTITY_COLUMNS['SimWaveform']=[
  'project_id:UUID:FK(CircuitProject) NOT NULL:プロジェクトID:Project ID',
  'signal_name:VARCHAR(100):NOT NULL:信号名:Signal name',
  'time_data:JSONB:NOT NULL:時間データ:Time data',
  'value_data:JSONB:NOT NULL:値データ:Value data',
  'unit:VARCHAR(20)::単位:Unit'
];

ENTITY_COLUMNS['MolFile']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'file_name:VARCHAR(255):NOT NULL:ファイル名:File name',
  'format:VARCHAR(20):NOT NULL:フォーマット:Format',
  'mol_data:TEXT:NOT NULL:分子データ:Molecule data',
  'formula:VARCHAR(255)::化学式:Chemical formula',
  'molecular_weight:DECIMAL(10,4)::分子量:Molecular weight'
];

ENTITY_COLUMNS['MolAtom']=[
  'mol_id:UUID:FK(MolFile) NOT NULL:分子ファイルID:Molecule file ID',
  'atom_index:INT:NOT NULL:原子インデックス:Atom index',
  'element:VARCHAR(10):NOT NULL:元素記号:Element symbol',
  'pos_x:DECIMAL(10,4)::X座標:X position',
  'pos_y:DECIMAL(10,4)::Y座標:Y position',
  'charge:INT:DEFAULT 0:電荷:Charge'
];

ENTITY_COLUMNS['MolBond']=[
  'mol_id:UUID:FK(MolFile) NOT NULL:分子ファイルID:Molecule file ID',
  'atom1_idx:INT:NOT NULL:原子1インデックス:Atom 1 index',
  'atom2_idx:INT:NOT NULL:原子2インデックス:Atom 2 index',
  'bond_type:INT:NOT NULL:結合種別:Bond type',
  'stereo:INT:DEFAULT 0:立体化学:Stereo'
];

ENTITY_COLUMNS['MolVisualization']=[
  'mol_id:UUID:FK(MolFile) NOT NULL:分子ファイルID:Molecule file ID',
  'view_mode:VARCHAR(20):DEFAULT \'2D\':表示モード:View mode',
  'color_scheme:VARCHAR(50):DEFAULT \'cpk\':配色スキーム:Color scheme',
  'settings:JSONB::表示設定:Display settings'
];

ENTITY_COLUMNS['PlantCrop']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'plant_name:VARCHAR(255):NOT NULL:植物名:Plant name',
  'plant_name_en:VARCHAR(255)::植物名(英):Plant name (EN)',
  'category:VARCHAR(100)::カテゴリ:Category',
  'days_to_harvest:INT::収穫日数:Days to harvest',
  'care_tips:TEXT::育て方メモ:Care tips'
];

ENTITY_COLUMNS['GardenBed']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'bed_name:VARCHAR(255):NOT NULL:畑区画名:Garden bed name',
  'width_m:DECIMAL(5,2)::横幅(m):Width (m)',
  'length_m:DECIMAL(5,2)::奥行(m):Length (m)',
  'soil_type:VARCHAR(100)::土壌種別:Soil type',
  'current_crops:JSONB::栽培中作物:Current crops'
];

ENTITY_COLUMNS['GrowCalendar']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'crop_id:UUID:FK(PlantCrop) NOT NULL:作物ID:Crop ID',
  'bed_id:UUID:FK(GardenBed):区画ID:Garden bed ID',
  'sow_date:DATE::播種日:Sow date',
  'transplant_date:DATE::定植日:Transplant date',
  'expected_harvest:DATE::収穫予定日:Expected harvest date'
];

ENTITY_COLUMNS['HarvestRecord']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'crop_id:UUID:FK(PlantCrop) NOT NULL:作物ID:Crop ID',
  'harvest_date:DATE:NOT NULL:収穫日:Harvest date',
  'quantity_kg:DECIMAL(6,2)::収穫量(kg):Harvest quantity (kg)',
  'quality_rating:INT::品質評価(1-5):Quality rating (1-5)',
  'notes:TEXT::メモ:Notes'
];

ENTITY_COLUMNS['MedPrescription']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'prescribed_date:DATE:NOT NULL:処方日:Prescribed date',
  'prescriber:VARCHAR(255)::処方医:Prescriber',
  'pharmacy:VARCHAR(255)::調剤薬局:Pharmacy',
  'notes:TEXT::備考:Notes',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status'
];

ENTITY_COLUMNS['MedDrug']=[
  'prescription_id:UUID:FK(MedPrescription) NOT NULL:処方ID:Prescription ID',
  'drug_name:VARCHAR(255):NOT NULL:薬品名:Drug name',
  'dosage:VARCHAR(100):NOT NULL:用量:Dosage',
  'frequency:VARCHAR(100):NOT NULL:服用頻度:Frequency',
  'duration_days:INT::服用日数:Duration (days)',
  'drug_code:VARCHAR(100)::薬品コード:Drug code'
];

ENTITY_COLUMNS['DoseSchedule']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'drug_id:UUID:FK(MedDrug) NOT NULL:薬品ID:Drug ID',
  'scheduled_time:TIME:NOT NULL:服用予定時刻:Scheduled time',
  'dose_timing:VARCHAR(50):NOT NULL:服用タイミング:Dose timing',
  'is_active:BOOLEAN:DEFAULT true:有効:Active'
];

ENTITY_COLUMNS['DrugInteraction']=[
  'drug1_name:VARCHAR(255):NOT NULL:薬品1名:Drug 1 name',
  'drug2_name:VARCHAR(255):NOT NULL:薬品2名:Drug 2 name',
  'severity:VARCHAR(20):NOT NULL:重篤度:Severity',
  'description:TEXT:NOT NULL:相互作用説明:Interaction description',
  'recommendation:TEXT::対処推奨:Recommendation'
];

ENTITY_COLUMNS['EtymWord']=[
  'user_id:UUID:FK(User):ユーザーID:User ID',
  'word:VARCHAR(255):NOT NULL:語彙:Word',
  'language:VARCHAR(50):NOT NULL:言語:Language',
  'definition:TEXT::定義:Definition',
  'first_recorded:VARCHAR(100)::初出記録:First recorded',
  'ipa:VARCHAR(255)::IPA発音記号:IPA pronunciation'
];

ENTITY_COLUMNS['WordOrigin']=[
  'word_id:UUID:FK(EtymWord) NOT NULL:語彙ID:Word ID',
  'source_language:VARCHAR(100):NOT NULL:起源言語:Source language',
  'source_word:VARCHAR(255):NOT NULL:起源語:Source word',
  'period:VARCHAR(100)::時代:Period',
  'route:TEXT::伝播経路:Transmission route'
];

ENTITY_COLUMNS['LangFamily']=[
  'family_name:VARCHAR(100):NOT NULL:語族名:Language family name',
  'family_name_en:VARCHAR(100):NOT NULL:語族名(英):Language family name (EN)',
  'branch:VARCHAR(100)::語派:Language branch',
  'geographic_origin:VARCHAR(255)::地理的起源:Geographic origin',
  'member_count:INT::使用言語数:Member language count'
];

ENTITY_COLUMNS['WordRelation']=[
  'word1_id:UUID:FK(EtymWord) NOT NULL:語彙1ID:Word 1 ID',
  'word2_id:UUID:FK(EtymWord) NOT NULL:語彙2ID:Word 2 ID',
  'relation_type:VARCHAR(50):NOT NULL:関係種別:Relation type',
  'description:TEXT::説明:Description'
];

ENTITY_COLUMNS['CodeExercise']=[
  'author_id:UUID:FK(User) NOT NULL:作成者ID:Author ID',
  'title:VARCHAR(255):NOT NULL:演習タイトル:Exercise title',
  'language:VARCHAR(50):NOT NULL:プログラミング言語:Programming language',
  'difficulty:VARCHAR(20):DEFAULT \'medium\':難易度:Difficulty',
  'description:TEXT:NOT NULL:問題文:Description',
  'test_cases:JSONB::テストケース:Test cases'
];

ENTITY_COLUMNS['CodeSubmission']=[
  'exercise_id:UUID:FK(CodeExercise) NOT NULL:演習ID:Exercise ID',
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'code:TEXT:NOT NULL:提出コード:Submitted code',
  'result:VARCHAR(20)::実行結果:Execution result',
  'score:INT::スコア:Score',
  'feedback:TEXT::フィードバック:Feedback'
];

ENTITY_COLUMNS['ReviewComment']=[
  'submission_id:UUID:FK(CodeSubmission) NOT NULL:提出ID:Submission ID',
  'reviewer_id:UUID:FK(User) NOT NULL:レビュアーID:Reviewer ID',
  'line_number:INT::行番号:Line number',
  'comment:TEXT:NOT NULL:コメント:Comment',
  'category:VARCHAR(50)::カテゴリ:Category',
  'ai_generated:BOOLEAN:DEFAULT false:AI生成:AI generated'
];

ENTITY_COLUMNS['LearningPath']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'path_name:VARCHAR(255):NOT NULL:パス名:Path name',
  'language:VARCHAR(50):NOT NULL:言語:Language',
  'exercises:JSONB::演習リスト:Exercise list',
  'current_step:INT:DEFAULT 0:現在ステップ:Current step',
  'completed_at:TIMESTAMP::完了日時:Completed at'
];

ENTITY_COLUMNS['FontProject']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'project_name:VARCHAR(255):NOT NULL:プロジェクト名:Project name',
  'description:TEXT::説明:Description',
  'units_per_em:INT:DEFAULT 1000:UPM:Units per em',
  'status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status'
];

ENTITY_COLUMNS['FontGlyph']=[
  'project_id:UUID:FK(FontProject) NOT NULL:プロジェクトID:Project ID',
  'unicode:INT:NOT NULL:Unicodeコード:Unicode code point',
  'glyph_name:VARCHAR(100)::グリフ名:Glyph name',
  'path_data:TEXT::パスデータ(SVG):Path data (SVG)',
  'advance_width:INT::字幅:Advance width',
  'bearing_x:INT::ベアリングX:Bearing X'
];

ENTITY_COLUMNS['FontFamily']=[
  'project_id:UUID:FK(FontProject) NOT NULL:プロジェクトID:Project ID',
  'weight:INT:NOT NULL:ウェイト:Weight',
  'style:VARCHAR(20):DEFAULT \'normal\':スタイル:Style',
  'glyph_count:INT:DEFAULT 0:グリフ数:Glyph count'
];

ENTITY_COLUMNS['FontExport']=[
  'project_id:UUID:FK(FontProject) NOT NULL:プロジェクトID:Project ID',
  'format:VARCHAR(20):NOT NULL:フォーマット:Format',
  'file_size_kb:INT::ファイルサイズ(KB):File size (KB)',
  'exported_at:TIMESTAMP:DEFAULT NOW:エクスポート日時:Exported at',
  'settings:JSONB::エクスポート設定:Export settings'
];

ENTITY_COLUMNS['DiaryEntry']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'entry_date:DATE:NOT NULL:記録日:Entry date',
  'content:TEXT:NOT NULL:本文:Content',
  'weather:VARCHAR(50)::天気:Weather',
  'mood_score:INT::気分スコア(1-10):Mood score (1-10)',
  'word_count:INT:DEFAULT 0:文字数:Word count'
];

ENTITY_COLUMNS['EmotionTag']=[
  'entry_id:UUID:FK(DiaryEntry) NOT NULL:日記ID:Diary entry ID',
  'emotion:VARCHAR(100):NOT NULL:感情:Emotion',
  'intensity:INT:DEFAULT 3:強度(1-5):Intensity (1-5)',
  'ai_detected:BOOLEAN:DEFAULT false:AI検出:AI detected'
];

ENTITY_COLUMNS['LifelogSummary']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'period:VARCHAR(20):NOT NULL:集計期間:Period',
  'start_date:DATE:NOT NULL:開始日:Start date',
  'end_date:DATE:NOT NULL:終了日:End date',
  'avg_mood:DECIMAL(4,2)::平均気分:Average mood',
  'top_emotions:JSONB::主要感情:Top emotions'
];

ENTITY_COLUMNS['InsightReport']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'generated_at:TIMESTAMP:DEFAULT NOW:生成日時:Generated at',
  'period:VARCHAR(50):NOT NULL:対象期間:Target period',
  'insights:JSONB:NOT NULL:インサイト:Insights',
  'recommendations:TEXT::推奨事項:Recommendations',
  'ai_model:VARCHAR(100)::使用AIモデル:AI model used'
];

ENTITY_COLUMNS['BudgetCategory']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'category_name:VARCHAR(100):NOT NULL:カテゴリ名:Category name',
  'category_type:VARCHAR(20):NOT NULL:種別(収入/支出):Type (income/expense)',
  'monthly_budget:DECIMAL(12,2)::月次予算:Monthly budget',
  'color:VARCHAR(20)::表示色:Color',
  'icon:VARCHAR(50)::アイコン:Icon'
];

ENTITY_COLUMNS['BudgetTransaction']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'category_id:UUID:FK(BudgetCategory) NOT NULL:カテゴリID:Category ID',
  'amount:DECIMAL(12,2):NOT NULL:金額:Amount',
  'transaction_date:DATE:NOT NULL:取引日:Transaction date',
  'description:VARCHAR(255)::説明:Description',
  'notes:TEXT::メモ:Notes'
];

ENTITY_COLUMNS['FinAsset']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'asset_name:VARCHAR(255):NOT NULL:資産名:Asset name',
  'asset_type:VARCHAR(50):NOT NULL:資産種別:Asset type',
  'current_value:DECIMAL(15,2):NOT NULL:現在価値:Current value',
  'acquisition_value:DECIMAL(15,2)::取得価額:Acquisition value',
  'last_updated:DATE::最終更新日:Last updated'
];

ENTITY_COLUMNS['SavingGoal']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'goal_name:VARCHAR(255):NOT NULL:目標名:Goal name',
  'target_amount:DECIMAL(15,2):NOT NULL:目標金額:Target amount',
  'current_amount:DECIMAL(15,2):DEFAULT 0:現在積立額:Current saved amount',
  'target_date:DATE::目標達成日:Target date',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status'
];

ENTITY_COLUMNS['ProdOrder']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'order_number:VARCHAR(100):UNIQUE NOT NULL:製造指示番号:Order number',
  'product_name:VARCHAR(255):NOT NULL:製品名:Product name',
  'quantity:INT:NOT NULL:数量:Quantity',
  'priority:VARCHAR(20):DEFAULT \'normal\':優先度:Priority',
  'due_date:DATE:NOT NULL:納期:Due date'
];

ENTITY_COLUMNS['FactoryMachine']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'machine_code:VARCHAR(100):UNIQUE NOT NULL:機械コード:Machine code',
  'machine_name:VARCHAR(255):NOT NULL:機械名:Machine name',
  'capacity_per_hour:DECIMAL(10,2)::時間能力:Capacity per hour',
  'setup_time_min:INT:DEFAULT 0:段取時間(分):Setup time (min)',
  'status:VARCHAR(20):DEFAULT \'available\':稼働状態:Status'
];

ENTITY_COLUMNS['ScheduleSlot']=[
  'machine_id:UUID:FK(FactoryMachine) NOT NULL:機械ID:Machine ID',
  'order_id:UUID:FK(ProdOrder) NOT NULL:製造指示ID:Order ID',
  'start_time:TIMESTAMP:NOT NULL:開始時刻:Start time',
  'end_time:TIMESTAMP:NOT NULL:終了時刻:End time',
  'status:VARCHAR(20):DEFAULT \'scheduled\':ステータス:Status'
];

ENTITY_COLUMNS['ProdPlan']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'plan_name:VARCHAR(255):NOT NULL:計画名:Plan name',
  'plan_date:DATE:NOT NULL:計画日:Plan date',
  'schedule_data:JSONB::スケジュールデータ:Schedule data',
  'kpi_data:JSONB::KPIデータ:KPI data',
  'ai_optimized:BOOLEAN:DEFAULT false:AI最適化済み:AI optimized'
];
