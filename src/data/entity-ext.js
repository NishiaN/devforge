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

// ── ext15 entities (presets-ext15.js: senior/food/biotech/logistics/privacy/energy/ecology/nutrition/invoice/manual) ──

ENTITY_COLUMNS['PhoneGuide']=[
  'user_id:UUID:FK(User):ユーザーID:User ID',
  'title:VARCHAR(255):NOT NULL:ガイドタイトル:Guide title',
  'category_id:UUID:FK(HelpCategory) NOT NULL:カテゴリID:Category ID',
  'content:TEXT:NOT NULL:ガイド内容:Guide content',
  'difficulty:VARCHAR(20):DEFAULT \'beginner\':難易度:Difficulty',
  'view_count:INT:DEFAULT 0:閲覧数:View count'
];

ENTITY_COLUMNS['TutorialStep']=[
  'guide_id:UUID:FK(PhoneGuide) NOT NULL:ガイドID:Guide ID',
  'step_number:INT:NOT NULL:ステップ番号:Step number',
  'step_title:VARCHAR(255):NOT NULL:ステップタイトル:Step title',
  'instruction:TEXT:NOT NULL:操作説明:Instruction',
  'image_url:VARCHAR(512)::スクリーンショットURL:Screenshot URL',
  'tip:TEXT::コツ・注意点:Tips & notes'
];

ENTITY_COLUMNS['HelpCategory']=[
  'name:VARCHAR(100):NOT NULL:カテゴリ名:Category name',
  'name_en:VARCHAR(100)::英語カテゴリ名:English category name',
  'icon:VARCHAR(10)::アイコン:Icon',
  'sort_order:INT:DEFAULT 0:表示順:Sort order',
  'parent_id:UUID:FK(HelpCategory):親カテゴリID:Parent category ID'
];

ENTITY_COLUMNS['SupportSession']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'question:TEXT:NOT NULL:質問内容:Question',
  'status:VARCHAR(20):DEFAULT \'open\':ステータス:Status',
  'response:TEXT::回答内容:Response',
  'resolved_at:TIMESTAMP::解決日時:Resolved at'
];

ENTITY_COLUMNS['RestaurantRecord']=[
  'name:VARCHAR(255):NOT NULL:レストラン名:Restaurant name',
  'genre:VARCHAR(100)::ジャンル:Genre',
  'area:VARCHAR(100)::エリア:Area',
  'price_range:VARCHAR(50)::価格帯:Price range',
  'latitude:DECIMAL(9,6)::緯度:Latitude',
  'longitude:DECIMAL(9,6)::経度:Longitude',
  'avg_rating:DECIMAL(3,2):DEFAULT 0:平均評価:Average rating'
];

ENTITY_COLUMNS['RestaurantReview']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'restaurant_id:UUID:FK(RestaurantRecord) NOT NULL:レストランID:Restaurant ID',
  'rating:DECIMAL(2,1):NOT NULL:評価:Rating',
  'comment:TEXT::コメント:Comment',
  'visit_date:DATE::訪問日:Visit date',
  'photo_urls:JSONB::写真URL一覧:Photo URLs'
];

ENTITY_COLUMNS['MenuCategory']=[
  'restaurant_id:UUID:FK(RestaurantRecord) NOT NULL:レストランID:Restaurant ID',
  'category_name:VARCHAR(100):NOT NULL:カテゴリ名:Category name',
  'sort_order:INT:DEFAULT 0:表示順:Sort order'
];

ENTITY_COLUMNS['Bookmark']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'restaurant_id:UUID:FK(RestaurantRecord) NOT NULL:レストランID:Restaurant ID',
  'note:VARCHAR(500)::メモ:Note',
  'collection_name:VARCHAR(100):DEFAULT \'お気に入り\':コレクション名:Collection name',
  'created_at:TIMESTAMP:DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['MicrobiomeSample']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'sample_date:DATE:NOT NULL:採取日:Sample date',
  'kit_id:VARCHAR(100):UNIQUE NOT NULL:キットID:Kit ID',
  'sequencing_method:VARCHAR(50)::シーケンシング手法:Sequencing method',
  'status:VARCHAR(20):DEFAULT \'pending\':処理状態:Processing status',
  'raw_data_url:VARCHAR(512)::生データURL:Raw data URL'
];

ENTITY_COLUMNS['TaxonomyReport']=[
  'sample_id:UUID:FK(MicrobiomeSample) NOT NULL:サンプルID:Sample ID',
  'diversity_shannon:DECIMAL(6,4)::Shannon多様性指数:Shannon diversity index',
  'diversity_simpson:DECIMAL(6,4)::Simpson多様性指数:Simpson diversity index',
  'dominant_phylum:VARCHAR(100)::優勢門:Dominant phylum',
  'report_data:JSONB::分類詳細データ:Taxonomy detail data',
  'generated_at:TIMESTAMP:DEFAULT NOW():生成日時:Generated at'
];

ENTITY_COLUMNS['DietCorrelation']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'food_group:VARCHAR(100):NOT NULL:食品グループ:Food group',
  'correlation_score:DECIMAL(4,3)::相関スコア:Correlation score',
  'effect_type:VARCHAR(50)::効果タイプ:Effect type',
  'confidence:DECIMAL(4,3)::信頼度:Confidence level',
  'analysis_period:VARCHAR(50)::分析期間:Analysis period'
];

ENTITY_COLUMNS['HealthInsight']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'insight_type:VARCHAR(50):NOT NULL:インサイト種別:Insight type',
  'title:VARCHAR(255):NOT NULL:インサイトタイトル:Insight title',
  'body:TEXT:NOT NULL:インサイト内容:Insight body',
  'priority:VARCHAR(20):DEFAULT \'info\':重要度:Priority',
  'generated_at:TIMESTAMP:DEFAULT NOW():生成日時:Generated at'
];

ENTITY_COLUMNS['DeliveryOrder']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'order_number:VARCHAR(100):UNIQUE NOT NULL:注文番号:Order number',
  'pickup_address:TEXT:NOT NULL:集荷住所:Pickup address',
  'delivery_address:TEXT:NOT NULL:配達先住所:Delivery address',
  'status:VARCHAR(30):DEFAULT \'pending\':配送状態:Delivery status',
  'scheduled_at:TIMESTAMP::配送予定日時:Scheduled delivery time',
  'weight_kg:DECIMAL(6,2)::重量(kg):Weight (kg)'
];

ENTITY_COLUMNS['RouteStop']=[
  'route_id:UUID:NOT NULL:ルートID:Route ID',
  'order_id:UUID:FK(DeliveryOrder) NOT NULL:注文ID:Order ID',
  'stop_sequence:INT:NOT NULL:停車順:Stop sequence',
  'latitude:DECIMAL(9,6):NOT NULL:緯度:Latitude',
  'longitude:DECIMAL(9,6):NOT NULL:経度:Longitude',
  'estimated_arrival:TIMESTAMP::到着予定:Estimated arrival',
  'completed_at:TIMESTAMP::完了日時:Completed at'
];

ENTITY_COLUMNS['VehicleFleet']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'vehicle_code:VARCHAR(50):UNIQUE NOT NULL:車両コード:Vehicle code',
  'license_plate:VARCHAR(20):NOT NULL:ナンバープレート:License plate',
  'vehicle_type:VARCHAR(50):NOT NULL:車両種別:Vehicle type',
  'capacity_kg:DECIMAL(8,2)::積載容量(kg):Load capacity (kg)',
  'driver_id:UUID:FK(User):担当ドライバーID:Driver ID',
  'status:VARCHAR(20):DEFAULT \'available\':稼働状態:Status'
];

ENTITY_COLUMNS['RouteOptResult']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'vehicle_id:UUID:FK(VehicleFleet) NOT NULL:車両ID:Vehicle ID',
  'route_date:DATE:NOT NULL:配送日:Delivery date',
  'total_distance_km:DECIMAL(8,2)::総距離(km):Total distance (km)',
  'estimated_duration_min:INT::推定所要時間(分):Estimated duration (min)',
  'stop_count:INT::停車数:Stop count',
  'optimization_score:DECIMAL(5,2)::最適化スコア:Optimization score'
];

ENTITY_COLUMNS['DataSubjectReq']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'request_type:VARCHAR(50):NOT NULL:リクエスト種別:Request type',
  'subject_name:VARCHAR(255):NOT NULL:データ主体名:Data subject name',
  'subject_email:VARCHAR(255):NOT NULL:データ主体メール:Data subject email',
  'status:VARCHAR(30):DEFAULT \'received\':対応状態:Status',
  'due_date:DATE::期限:Due date',
  'completed_at:TIMESTAMP::完了日時:Completed at'
];

ENTITY_COLUMNS['PrivacyConsent']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'consent_type:VARCHAR(100):NOT NULL:同意種別:Consent type',
  'version:VARCHAR(20):NOT NULL:バージョン:Version',
  'granted:BOOLEAN:NOT NULL:同意可否:Granted',
  'granted_at:TIMESTAMP:DEFAULT NOW():同意日時:Granted at',
  'ip_address:VARCHAR(45)::IPアドレス:IP address'
];

ENTITY_COLUMNS['DataInventory']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'data_category:VARCHAR(100):NOT NULL:データカテゴリ:Data category',
  'data_type:VARCHAR(100):NOT NULL:データ種別:Data type',
  'storage_location:VARCHAR(255)::保存場所:Storage location',
  'retention_period:VARCHAR(50)::保持期間:Retention period',
  'third_party_shared:BOOLEAN:DEFAULT false:第三者提供:Third-party shared',
  'legal_basis:VARCHAR(100)::処理根拠:Legal basis'
];

ENTITY_COLUMNS['PrivacyReport']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'report_type:VARCHAR(50):NOT NULL:レポート種別:Report type',
  'period_start:DATE:NOT NULL:期間開始:Period start',
  'period_end:DATE:NOT NULL:期間終了:Period end',
  'dsr_count:INT:DEFAULT 0:DSR件数:DSR count',
  'report_data:JSONB::レポートデータ:Report data',
  'generated_at:TIMESTAMP:DEFAULT NOW():生成日時:Generated at'
];

ENTITY_COLUMNS['BuildingModel']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'building_name:VARCHAR(255):NOT NULL:建物名:Building name',
  'building_type:VARCHAR(50):NOT NULL:建物用途:Building type',
  'floor_area_m2:DECIMAL(10,2):NOT NULL:延床面積(m2):Total floor area (m2)',
  'floors:INT:DEFAULT 1:階数:Number of floors',
  'climate_zone:VARCHAR(50)::気候区分:Climate zone',
  'construction_year:INT::建設年:Construction year'
];

ENTITY_COLUMNS['EnergyScenario']=[
  'model_id:UUID:FK(BuildingModel) NOT NULL:建物モデルID:Building model ID',
  'scenario_name:VARCHAR(255):NOT NULL:シナリオ名:Scenario name',
  'insulation_level:VARCHAR(50)::断熱性能:Insulation level',
  'hvac_type:VARCHAR(100)::空調方式:HVAC type',
  'renewable_energy:VARCHAR(100)::再エネ設備:Renewable energy',
  'lighting_type:VARCHAR(50)::照明種別:Lighting type'
];

ENTITY_COLUMNS['SimResult']=[
  'scenario_id:UUID:FK(EnergyScenario) NOT NULL:シナリオID:Scenario ID',
  'annual_energy_kwh:DECIMAL(12,2)::年間エネルギー消費(kWh):Annual energy (kWh)',
  'co2_emission_kg:DECIMAL(12,2)::CO2排出量(kg):CO2 emission (kg)',
  'energy_cost_jpy:DECIMAL(12,2)::エネルギーコスト(円):Energy cost (JPY)',
  'bpi_score:DECIMAL(6,2)::BPI値:BPI score',
  'zeb_achieved:BOOLEAN:DEFAULT false:ZEB達成:ZEB achieved'
];

ENTITY_COLUMNS['EnergyReport']=[
  'model_id:UUID:FK(BuildingModel) NOT NULL:建物モデルID:Building model ID',
  'report_name:VARCHAR(255):NOT NULL:レポート名:Report name',
  'best_scenario_id:UUID:FK(EnergyScenario):最良シナリオID:Best scenario ID',
  'savings_potential_pct:DECIMAL(5,2)::省エネ余地(%):Savings potential (%)',
  'report_url:VARCHAR(512)::レポートURL:Report URL',
  'generated_at:TIMESTAMP:DEFAULT NOW():生成日時:Generated at'
];

ENTITY_COLUMNS['SpeciesObservation']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'plot_id:UUID:FK(MonitoringPlot) NOT NULL:プロットID:Plot ID',
  'species_name:VARCHAR(255):NOT NULL:種名:Species name',
  'species_name_en:VARCHAR(255)::英語種名:Species name (English)',
  'count:INT:NOT NULL:個体数:Count',
  'observed_at:TIMESTAMP:DEFAULT NOW():観察日時:Observed at',
  'photo_url:VARCHAR(512)::写真URL:Photo URL',
  'notes:TEXT::備考:Notes'
];

ENTITY_COLUMNS['MonitoringPlot']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'plot_name:VARCHAR(255):NOT NULL:プロット名:Plot name',
  'latitude:DECIMAL(9,6):NOT NULL:緯度:Latitude',
  'longitude:DECIMAL(9,6):NOT NULL:経度:Longitude',
  'area_m2:DECIMAL(10,2)::面積(m2):Area (m2)',
  'habitat_type:VARCHAR(100)::生息地タイプ:Habitat type',
  'established_date:DATE::設置日:Established date'
];

ENTITY_COLUMNS['BiodiversityIndex']=[
  'plot_id:UUID:FK(MonitoringPlot) NOT NULL:プロットID:Plot ID',
  'survey_date:DATE:NOT NULL:調査日:Survey date',
  'shannon_index:DECIMAL(6,4)::Shannon多様性指数:Shannon index',
  'simpson_index:DECIMAL(6,4)::Simpson多様性指数:Simpson index',
  'species_richness:INT::種豊富度:Species richness',
  'evenness:DECIMAL(6,4)::均等度:Evenness',
  'trend:VARCHAR(20)::トレンド:Trend'
];

ENTITY_COLUMNS['EcologicalAlert']=[
  'plot_id:UUID:FK(MonitoringPlot) NOT NULL:プロットID:Plot ID',
  'alert_type:VARCHAR(50):NOT NULL:アラート種別:Alert type',
  'severity:VARCHAR(20):DEFAULT \'info\':重大度:Severity',
  'message:TEXT:NOT NULL:メッセージ:Message',
  'triggered_at:TIMESTAMP:DEFAULT NOW():発生日時:Triggered at',
  'resolved_at:TIMESTAMP::解決日時:Resolved at'
];

ENTITY_COLUMNS['MealRecord']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'meal_type:VARCHAR(20):NOT NULL:食事種別:Meal type',
  'recorded_at:TIMESTAMP:DEFAULT NOW():記録日時:Recorded at',
  'total_calories:DECIMAL(8,2)::合計カロリー:Total calories',
  'total_protein_g:DECIMAL(8,2)::タンパク質(g):Protein (g)',
  'total_fat_g:DECIMAL(8,2)::脂質(g):Fat (g)',
  'total_carb_g:DECIMAL(8,2)::炭水化物(g):Carbohydrate (g)',
  'note:TEXT::メモ:Note'
];

ENTITY_COLUMNS['NutrientData']=[
  'food_name:VARCHAR(255):NOT NULL:食品名:Food name',
  'food_name_en:VARCHAR(255)::英語食品名:Food name (English)',
  'per_100g_calories:DECIMAL(8,2)::100g当たりカロリー:Calories per 100g',
  'per_100g_protein:DECIMAL(8,2)::100g当たりタンパク質(g):Protein per 100g (g)',
  'per_100g_fat:DECIMAL(8,2)::100g当たり脂質(g):Fat per 100g (g)',
  'per_100g_carb:DECIMAL(8,2)::100g当たり炭水化物(g):Carbohydrate per 100g (g)',
  'category:VARCHAR(100)::カテゴリ:Category'
];

ENTITY_COLUMNS['DietGoal']=[
  'user_id:UUID:FK(User) UNIQUE NOT NULL:ユーザーID:User ID',
  'target_calories:DECIMAL(8,2):NOT NULL:目標カロリー:Target calories',
  'target_protein_g:DECIMAL(8,2)::目標タンパク質(g):Target protein (g)',
  'target_fat_g:DECIMAL(8,2)::目標脂質(g):Target fat (g)',
  'target_carb_g:DECIMAL(8,2)::目標炭水化物(g):Target carbohydrate (g)',
  'goal_type:VARCHAR(50):DEFAULT \'balance\':目標タイプ:Goal type',
  'updated_at:TIMESTAMP:DEFAULT NOW():更新日時:Updated at'
];

ENTITY_COLUMNS['NutritionWklyReport']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'week_start:DATE:NOT NULL:週開始日:Week start',
  'avg_calories:DECIMAL(8,2)::平均カロリー:Average calories',
  'avg_protein_g:DECIMAL(8,2)::平均タンパク質(g):Average protein (g)',
  'goal_achievement_pct:DECIMAL(5,2)::目標達成率(%):Goal achievement (%)',
  'insights:JSONB::AIインサイト:AI insights'
];

ENTITY_COLUMNS['InvoiceRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'invoice_number:VARCHAR(100):UNIQUE NOT NULL:請求書番号:Invoice number',
  'vendor_id:UUID:FK(VendorAccount) NOT NULL:ベンダーID:Vendor ID',
  'amount:DECIMAL(15,2):NOT NULL:金額:Amount',
  'currency:CHAR(3):DEFAULT \'JPY\':通貨:Currency',
  'issue_date:DATE:NOT NULL:発行日:Issue date',
  'due_date:DATE:NOT NULL:支払期限:Due date',
  'status:VARCHAR(30):DEFAULT \'pending\':状態:Status',
  'ocr_data:JSONB::OCR解析データ:OCR data'
];

ENTITY_COLUMNS['ExpenseEntry']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'user_id:UUID:FK(User) NOT NULL:申請者ID:Applicant ID',
  'category:VARCHAR(100):NOT NULL:経費カテゴリ:Expense category',
  'amount:DECIMAL(15,2):NOT NULL:金額:Amount',
  'currency:CHAR(3):DEFAULT \'JPY\':通貨:Currency',
  'expense_date:DATE:NOT NULL:発生日:Expense date',
  'description:TEXT::説明:Description',
  'status:VARCHAR(30):DEFAULT \'draft\':承認状態:Approval status',
  'receipt_url:VARCHAR(512)::領収書URL:Receipt URL'
];

ENTITY_COLUMNS['VendorAccount']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'vendor_name:VARCHAR(255):NOT NULL:ベンダー名:Vendor name',
  'vendor_code:VARCHAR(50):UNIQUE NOT NULL:ベンダーコード:Vendor code',
  'contact_email:VARCHAR(255)::担当メール:Contact email',
  'payment_terms:VARCHAR(100)::支払条件:Payment terms',
  'bank_account:VARCHAR(255)::振込先口座:Bank account',
  'status:VARCHAR(20):DEFAULT \'active\':状態:Status'
];

ENTITY_COLUMNS['PaymentRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'invoice_id:UUID:FK(InvoiceRecord) NOT NULL:請求書ID:Invoice ID',
  'amount:DECIMAL(15,2):NOT NULL:支払金額:Payment amount',
  'payment_date:DATE:NOT NULL:支払日:Payment date',
  'payment_method:VARCHAR(50):NOT NULL:支払方法:Payment method',
  'transaction_id:VARCHAR(255)::取引ID:Transaction ID',
  'status:VARCHAR(30):DEFAULT \'completed\':状態:Status'
];

ENTITY_COLUMNS['ManualDocument']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'title:VARCHAR(255):NOT NULL:マニュアルタイトル:Manual title',
  'process_id:UUID:FK(WorkProcess) NOT NULL:プロセスID:Process ID',
  'version:VARCHAR(20):DEFAULT \'1.0\':バージョン:Version',
  'status:VARCHAR(30):DEFAULT \'draft\':状態:Status',
  'content:TEXT::マニュアル内容:Manual content',
  'published_at:TIMESTAMP::公開日時:Published at'
];

ENTITY_COLUMNS['WorkProcess']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'process_name:VARCHAR(255):NOT NULL:プロセス名:Process name',
  'department:VARCHAR(100)::部署:Department',
  'description:TEXT::プロセス説明:Process description',
  'category:VARCHAR(100)::カテゴリ:Category',
  'sort_order:INT:DEFAULT 0:表示順:Sort order'
];

ENTITY_COLUMNS['ProcedureStep']=[
  'process_id:UUID:FK(WorkProcess) NOT NULL:プロセスID:Process ID',
  'step_number:INT:NOT NULL:ステップ番号:Step number',
  'step_title:VARCHAR(255):NOT NULL:ステップタイトル:Step title',
  'description:TEXT:NOT NULL:手順説明:Procedure description',
  'caution:TEXT::注意事項:Caution',
  'estimated_min:INT::所要時間(分):Estimated time (min)',
  'media_url:VARCHAR(512)::画像・動画URL:Media URL'
];

ENTITY_COLUMNS['KnowledgeBase']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'title:VARCHAR(255):NOT NULL:タイトル:Title',
  'content:TEXT:NOT NULL:本文:Content',
  'category:VARCHAR(100)::カテゴリ:Category',
  'tags:JSONB::タグ:Tags',
  'view_count:INT:DEFAULT 0:閲覧数:View count',
  'helpful_count:INT:DEFAULT 0:役に立った数:Helpful count',
  'updated_at:TIMESTAMP:DEFAULT NOW():更新日時:Updated at'
];

/* ── ext16: sign_language_tool ── */
ENTITY_COLUMNS['SignVideoLesson']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'title:VARCHAR(255):NOT NULL:レッスンタイトル:Lesson title',
  'sign_category:VARCHAR(100):NOT NULL:手話カテゴリ:Sign category',
  'video_url:VARCHAR(512):NOT NULL:動画URL:Video URL',
  'difficulty:VARCHAR(30):DEFAULT \'beginner\':難易度:Difficulty',
  'duration_sec:INT::再生時間(秒):Duration (sec)',
  'sort_order:INT:DEFAULT 0:表示順:Sort order'
];
ENTITY_COLUMNS['GestureModel']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'model_name:VARCHAR(255):NOT NULL:モデル名:Model name',
  'sign_label:VARCHAR(100):NOT NULL:手話ラベル:Sign label',
  'keypoints:JSONB:NOT NULL:キーポイントデータ:Keypoints data',
  'accuracy:DECIMAL(5,2)::精度(%):Accuracy (%)',
  'version:VARCHAR(20):DEFAULT \'1.0\':バージョン:Version'
];
ENTITY_COLUMNS['UserSignProgress']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'lesson_id:UUID:FK(SignVideoLesson) NOT NULL:レッスンID:Lesson ID',
  'status:VARCHAR(30):DEFAULT \'not_started\':進捗状態:Progress status',
  'score:DECIMAL(5,2)::スコア:Score',
  'completed_at:TIMESTAMP::完了日時:Completed at',
  'attempts:INT:DEFAULT 0:試行回数:Attempt count'
];
ENTITY_COLUMNS['SignQuiz']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'lesson_id:UUID:FK(SignVideoLesson):レッスンID:Lesson ID',
  'question:TEXT:NOT NULL:問題文:Question',
  'answer_key:VARCHAR(255):NOT NULL:正解:Answer key',
  'quiz_type:VARCHAR(30):DEFAULT \'gesture\':クイズ種別:Quiz type',
  'sort_order:INT:DEFAULT 0:表示順:Sort order'
];

/* ── ext16: travel_review_gen ── */
ENTITY_COLUMNS['TripItinerary']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'title:VARCHAR(255):NOT NULL:旅程タイトル:Itinerary title',
  'destination:VARCHAR(255):NOT NULL:目的地:Destination',
  'start_date:DATE:NOT NULL:出発日:Start date',
  'end_date:DATE:NOT NULL:帰着日:End date',
  'budget:DECIMAL(12,2)::予算:Budget',
  'status:VARCHAR(30):DEFAULT \'draft\':状態:Status'
];
ENTITY_COLUMNS['TravelReview']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'attraction_id:UUID:FK(Attraction) NOT NULL:スポットID:Attraction ID',
  'rating:SMALLINT:NOT NULL CHECK(rating BETWEEN 1 AND 5):評価:Rating',
  'title:VARCHAR(255)::レビュータイトル:Review title',
  'body:TEXT:NOT NULL:本文:Body',
  'visited_date:DATE::訪問日:Visited date',
  'helpful_count:INT:DEFAULT 0:役立った数:Helpful count'
];
ENTITY_COLUMNS['Attraction']=[
  'name:VARCHAR(255):NOT NULL:スポット名:Attraction name',
  'country:VARCHAR(100):NOT NULL:国:Country',
  'region:VARCHAR(100)::地域:Region',
  'category:VARCHAR(100)::カテゴリ:Category',
  'description:TEXT::説明:Description',
  'avg_rating:DECIMAL(3,2)::平均評価:Average rating',
  'review_count:INT:DEFAULT 0:レビュー数:Review count'
];
ENTITY_COLUMNS['TravelRecommendation']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'attraction_id:UUID:FK(Attraction) NOT NULL:スポットID:Attraction ID',
  'score:DECIMAL(5,4):NOT NULL:推薦スコア:Recommendation score',
  'reason_ja:TEXT::推薦理由(日本語):Reason (JA)',
  'reason_en:TEXT::推薦理由(英語):Reason (EN)',
  'generated_at:TIMESTAMP:DEFAULT NOW():生成日時:Generated at'
];

/* ── ext16: synbio_design ── */
ENTITY_COLUMNS['GeneticPart']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'part_name:VARCHAR(255):NOT NULL:パーツ名:Part name',
  'part_type:VARCHAR(100):NOT NULL:パーツ種別:Part type',
  'sequence:TEXT:NOT NULL:塩基配列:Nucleotide sequence',
  'description:TEXT::説明:Description',
  'source:VARCHAR(255)::出典:Source',
  'tags:JSONB::タグ:Tags'
];
ENTITY_COLUMNS['SynBioDesign']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'design_name:VARCHAR(255):NOT NULL:設計名:Design name',
  'description:TEXT::説明:Description',
  'parts:JSONB:NOT NULL:パーツ構成:Parts composition',
  'version:VARCHAR(20):DEFAULT \'1.0\':バージョン:Version',
  'status:VARCHAR(30):DEFAULT \'draft\':状態:Status',
  'created_by:UUID:FK(User):作成者:Created by'
];
ENTITY_COLUMNS['BioCircuit']=[
  'design_id:UUID:FK(SynBioDesign) NOT NULL:設計ID:Design ID',
  'circuit_name:VARCHAR(255):NOT NULL:回路名:Circuit name',
  'topology:JSONB:NOT NULL:回路トポロジー:Circuit topology',
  'inputs:JSONB::入力シグナル:Input signals',
  'outputs:JSONB::出力シグナル:Output signals',
  'notes:TEXT::ノート:Notes'
];
ENTITY_COLUMNS['ExpressionResult']=[
  'design_id:UUID:FK(SynBioDesign) NOT NULL:設計ID:Design ID',
  'simulation_date:TIMESTAMP:DEFAULT NOW():シミュレーション日時:Simulation date',
  'expression_level:DECIMAL(10,4)::発現レベル:Expression level',
  'unit:VARCHAR(50)::単位:Unit',
  'conditions:JSONB::実験条件:Experimental conditions',
  'result_data:JSONB::結果データ:Result data'
];

/* ── ext16: dashcam_analyzer ── */
ENTITY_COLUMNS['DashcamFootage']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'vehicle_id:VARCHAR(100):NOT NULL:車両ID:Vehicle ID',
  'driver_id:UUID:FK(User)::ドライバーID:Driver ID',
  'recorded_at:TIMESTAMP:NOT NULL:録画日時:Recorded at',
  'duration_sec:INT:NOT NULL:録画時間(秒):Duration (sec)',
  'storage_url:VARCHAR(512):NOT NULL:ストレージURL:Storage URL',
  'analysis_status:VARCHAR(30):DEFAULT \'pending\':解析状態:Analysis status'
];
ENTITY_COLUMNS['DrivingEvent']=[
  'footage_id:UUID:FK(DashcamFootage) NOT NULL:映像ID:Footage ID',
  'event_type:VARCHAR(100):NOT NULL:イベント種別:Event type',
  'severity:VARCHAR(30):NOT NULL:重大度:Severity',
  'timestamp_sec:INT:NOT NULL:発生時刻(秒):Timestamp (sec)',
  'confidence:DECIMAL(5,2)::信頼度(%):Confidence (%)',
  'description:TEXT::説明:Description'
];
ENTITY_COLUMNS['AccidentReport']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'footage_id:UUID:FK(DashcamFootage) NOT NULL:映像ID:Footage ID',
  'accident_date:TIMESTAMP:NOT NULL:事故日時:Accident date',
  'severity:VARCHAR(30):NOT NULL:重大度:Severity',
  'description:TEXT:NOT NULL:事故説明:Accident description',
  'ai_judgment:TEXT::AI判定:AI judgment',
  'status:VARCHAR(30):DEFAULT \'open\':状態:Status'
];
ENTITY_COLUMNS['DrivingScore']=[
  'driver_id:UUID:FK(User) NOT NULL:ドライバーID:Driver ID',
  'period_start:DATE:NOT NULL:集計開始日:Period start',
  'period_end:DATE:NOT NULL:集計終了日:Period end',
  'overall_score:DECIMAL(5,2):NOT NULL:総合スコア:Overall score',
  'safety_score:DECIMAL(5,2)::安全スコア:Safety score',
  'event_count:INT:DEFAULT 0:イベント件数:Event count',
  'rank:INT::ランキング:Rank'
];

/* ── ext16: incident_forensics ── */
ENTITY_COLUMNS['SecurityIncident']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'title:VARCHAR(255):NOT NULL:インシデントタイトル:Incident title',
  'severity:VARCHAR(30):NOT NULL:重大度:Severity',
  'status:VARCHAR(30):DEFAULT \'open\':状態:Status',
  'detected_at:TIMESTAMP:NOT NULL:検知日時:Detected at',
  'resolved_at:TIMESTAMP::解決日時:Resolved at',
  'assigned_to:UUID:FK(User)::担当者ID:Assigned to'
];
ENTITY_COLUMNS['ForensicEvidence']=[
  'incident_id:UUID:FK(SecurityIncident) NOT NULL:インシデントID:Incident ID',
  'evidence_type:VARCHAR(100):NOT NULL:証拠種別:Evidence type',
  'file_name:VARCHAR(255):NOT NULL:ファイル名:File name',
  'storage_url:VARCHAR(512):NOT NULL:ストレージURL:Storage URL',
  'hash_sha256:VARCHAR(64):NOT NULL:SHA256ハッシュ:SHA256 hash',
  'collected_at:TIMESTAMP:DEFAULT NOW():収集日時:Collected at',
  'notes:TEXT::メモ:Notes'
];
ENTITY_COLUMNS['ThreatIndicator']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'ioc_type:VARCHAR(100):NOT NULL:IOC種別:IOC type',
  'value:TEXT:NOT NULL:IOC値:IOC value',
  'confidence:VARCHAR(30):NOT NULL:信頼度:Confidence',
  'tlp:VARCHAR(20):DEFAULT \'amber\':TLPレベル:TLP level',
  'source:VARCHAR(255)::情報源:Source',
  'expires_at:TIMESTAMP::有効期限:Expires at'
];
ENTITY_COLUMNS['InvestigationReport']=[
  'incident_id:UUID:FK(SecurityIncident) NOT NULL:インシデントID:Incident ID',
  'title:VARCHAR(255):NOT NULL:レポートタイトル:Report title',
  'summary:TEXT:NOT NULL:概要:Summary',
  'timeline:JSONB::タイムライン:Timeline',
  'root_cause:TEXT::根本原因:Root cause',
  'recommendations:TEXT::対策推薦:Recommendations',
  'status:VARCHAR(30):DEFAULT \'draft\':状態:Status'
];

/* ── ext16: cultural_3d_archive ── */
ENTITY_COLUMNS['CulturalAsset']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(255):NOT NULL:文化財名:Asset name',
  'asset_type:VARCHAR(100):NOT NULL:種別:Asset type',
  'period:VARCHAR(100)::時代:Period',
  'location:VARCHAR(255)::所在地:Location',
  'description:TEXT::説明:Description',
  'metadata:JSONB::メタデータ:Metadata'
];
ENTITY_COLUMNS['ScanModel3D']=[
  'asset_id:UUID:FK(CulturalAsset) NOT NULL:文化財ID:Asset ID',
  'model_name:VARCHAR(255):NOT NULL:モデル名:Model name',
  'file_url:VARCHAR(512):NOT NULL:ファイルURL:File URL',
  'file_format:VARCHAR(50):NOT NULL:ファイル形式:File format',
  'polygon_count:INT::ポリゴン数:Polygon count',
  'scan_date:DATE::スキャン日:Scan date',
  'resolution_mm:DECIMAL(6,3)::解像度(mm):Resolution (mm)'
];
ENTITY_COLUMNS['AnnotationLayer']=[
  'model_id:UUID:FK(ScanModel3D) NOT NULL:モデルID:Model ID',
  'label:VARCHAR(255):NOT NULL:ラベル:Label',
  'annotation_type:VARCHAR(100):NOT NULL:アノテーション種別:Annotation type',
  'coordinates:JSONB:NOT NULL:座標データ:Coordinates',
  'description:TEXT::説明:Description',
  'created_by:UUID:FK(User):作成者:Created by'
];
ENTITY_COLUMNS['DigitalExhibit']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'title:VARCHAR(255):NOT NULL:展示タイトル:Exhibit title',
  'description:TEXT::展示説明:Description',
  'assets:JSONB:NOT NULL:展示文化財リスト:Asset list',
  'is_public:BOOLEAN:DEFAULT false:公開フラグ:Public flag',
  'published_at:TIMESTAMP::公開日時:Published at'
];

/* ── ext16: lab_notebook ── */
ENTITY_COLUMNS['ExperimentRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'title:VARCHAR(255):NOT NULL:実験タイトル:Experiment title',
  'hypothesis:TEXT::仮説:Hypothesis',
  'protocol_id:UUID:FK(LabProtocol)::プロトコルID:Protocol ID',
  'status:VARCHAR(30):DEFAULT \'in_progress\':状態:Status',
  'started_at:TIMESTAMP:NOT NULL:開始日時:Started at',
  'completed_at:TIMESTAMP::完了日時:Completed at',
  'created_by:UUID:FK(User):作成者:Created by'
];
ENTITY_COLUMNS['LabProtocol']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'title:VARCHAR(255):NOT NULL:プロトコルタイトル:Protocol title',
  'category:VARCHAR(100)::カテゴリ:Category',
  'steps:JSONB:NOT NULL:手順ステップ:Protocol steps',
  'reagents:JSONB::試薬リスト:Reagents list',
  'version:VARCHAR(20):DEFAULT \'1.0\':バージョン:Version',
  'is_approved:BOOLEAN:DEFAULT false:承認済みフラグ:Approved flag'
];
ENTITY_COLUMNS['ResearchObservation']=[
  'experiment_id:UUID:FK(ExperimentRecord) NOT NULL:実験ID:Experiment ID',
  'observed_at:TIMESTAMP:NOT NULL:観測日時:Observed at',
  'observer_id:UUID:FK(User):観測者ID:Observer ID',
  'description:TEXT:NOT NULL:観測内容:Observation description',
  'images:JSONB::観測画像:Observation images',
  'notes:TEXT::メモ:Notes'
];
ENTITY_COLUMNS['DataMeasurement']=[
  'experiment_id:UUID:FK(ExperimentRecord) NOT NULL:実験ID:Experiment ID',
  'parameter_name:VARCHAR(255):NOT NULL:パラメータ名:Parameter name',
  'value:DECIMAL(20,6):NOT NULL:測定値:Measured value',
  'unit:VARCHAR(50):NOT NULL:単位:Unit',
  'measured_at:TIMESTAMP:NOT NULL:測定日時:Measured at',
  'instrument:VARCHAR(255)::使用機器:Instrument'
];

/* ── ext16: pronunciation_ai ── */
ENTITY_COLUMNS['PronunciationLesson']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'title:VARCHAR(255):NOT NULL:レッスンタイトル:Lesson title',
  'language:VARCHAR(50):NOT NULL:対象言語:Target language',
  'target_text:TEXT:NOT NULL:練習テキスト:Target text',
  'phonemes:JSONB::フォネームリスト:Phoneme list',
  'difficulty:VARCHAR(30):DEFAULT \'beginner\':難易度:Difficulty',
  'sort_order:INT:DEFAULT 0:表示順:Sort order'
];
ENTITY_COLUMNS['SpeechRecord']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'lesson_id:UUID:FK(PronunciationLesson) NOT NULL:レッスンID:Lesson ID',
  'audio_url:VARCHAR(512):NOT NULL:音声URL:Audio URL',
  'duration_ms:INT:NOT NULL:録音時間(ms):Duration (ms)',
  'recorded_at:TIMESTAMP:DEFAULT NOW():録音日時:Recorded at',
  'analysis_status:VARCHAR(30):DEFAULT \'pending\':解析状態:Analysis status'
];
ENTITY_COLUMNS['PhonemeScore']=[
  'speech_id:UUID:FK(SpeechRecord) NOT NULL:音声ID:Speech record ID',
  'phoneme:VARCHAR(20):NOT NULL:フォネーム:Phoneme',
  'score:DECIMAL(5,2):NOT NULL:スコア:Score',
  'accuracy_pct:DECIMAL(5,2)::正確率(%):Accuracy (%)',
  'feedback:TEXT::フィードバック:Feedback'
];
ENTITY_COLUMNS['AccentFeedback']=[
  'speech_id:UUID:FK(SpeechRecord) NOT NULL:音声ID:Speech record ID',
  'accent_type:VARCHAR(100)::アクセント種別:Accent type',
  'rhythm_score:DECIMAL(5,2)::リズムスコア:Rhythm score',
  'intonation_score:DECIMAL(5,2)::イントネーションスコア:Intonation score',
  'overall_score:DECIMAL(5,2):NOT NULL:総合スコア:Overall score',
  'suggestions:TEXT::改善提案:Suggestions'
];

/* ── ext16: hr_evaluation_dashboard ── */
ENTITY_COLUMNS['EmployeeProfile']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'department:VARCHAR(100):NOT NULL:部署:Department',
  'position:VARCHAR(100):NOT NULL:役職:Position',
  'hire_date:DATE:NOT NULL:入社日:Hire date',
  'grade:VARCHAR(30)::等級:Grade',
  'manager_id:UUID:FK(User)::上長ID:Manager ID'
];
ENTITY_COLUMNS['EvalCycle']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'cycle_name:VARCHAR(255):NOT NULL:評価サイクル名:Cycle name',
  'period_start:DATE:NOT NULL:期間開始:Period start',
  'period_end:DATE:NOT NULL:期間終了:Period end',
  'status:VARCHAR(30):DEFAULT \'active\':状態:Status',
  'description:TEXT::説明:Description'
];
ENTITY_COLUMNS['PerformanceGoal']=[
  'employee_id:UUID:FK(EmployeeProfile) NOT NULL:従業員ID:Employee ID',
  'cycle_id:UUID:FK(EvalCycle) NOT NULL:サイクルID:Cycle ID',
  'goal_type:VARCHAR(50):NOT NULL:目標種別:Goal type',
  'title:VARCHAR(255):NOT NULL:目標タイトル:Goal title',
  'description:TEXT::説明:Description',
  'weight:DECIMAL(5,2)::ウェイト(%):Weight (%)',
  'achievement_pct:DECIMAL(5,2)::達成率(%):Achievement (%)'
];
ENTITY_COLUMNS['EvalFeedback']=[
  'employee_id:UUID:FK(EmployeeProfile) NOT NULL:評価対象ID:Evaluatee ID',
  'evaluator_id:UUID:FK(User) NOT NULL:評価者ID:Evaluator ID',
  'cycle_id:UUID:FK(EvalCycle) NOT NULL:サイクルID:Cycle ID',
  'feedback_type:VARCHAR(50):NOT NULL:フィードバック種別:Feedback type',
  'content:TEXT:NOT NULL:フィードバック内容:Feedback content',
  'overall_rating:SMALLINT::総合評価:Overall rating',
  'submitted_at:TIMESTAMP:DEFAULT NOW():提出日時:Submitted at'
];

/* ── ext16: livestock_optimizer ── */
ENTITY_COLUMNS['LivestockRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'animal_id:VARCHAR(100):NOT NULL UNIQUE:個体識別番号:Animal ID',
  'species:VARCHAR(50):NOT NULL:畜種:Species',
  'breed:VARCHAR(100)::品種:Breed',
  'birth_date:DATE::生年月日:Birth date',
  'sex:VARCHAR(10)::性別:Sex',
  'mother_id:UUID:FK(LivestockRecord)::母親ID:Mother ID'
];
ENTITY_COLUMNS['FeedSchedule']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'animal_id:UUID:FK(LivestockRecord) NOT NULL:個体ID:Animal ID',
  'feed_type:VARCHAR(100):NOT NULL:飼料種別:Feed type',
  'quantity_kg:DECIMAL(8,3):NOT NULL:給与量(kg):Quantity (kg)',
  'feeding_time:TIME:NOT NULL:給与時刻:Feeding time',
  'cost_per_kg:DECIMAL(8,2)::単価(円/kg):Cost per kg',
  'notes:TEXT::メモ:Notes'
];
ENTITY_COLUMNS['HealthMonitor']=[
  'animal_id:UUID:FK(LivestockRecord) NOT NULL:個体ID:Animal ID',
  'measured_at:TIMESTAMP:NOT NULL:測定日時:Measured at',
  'temperature:DECIMAL(4,1)::体温(℃):Temperature (℃)',
  'weight_kg:DECIMAL(8,2)::体重(kg):Weight (kg)',
  'health_status:VARCHAR(30):DEFAULT \'normal\':健康状態:Health status',
  'notes:TEXT::メモ:Notes',
  'vet_id:UUID:FK(User)::獣医師ID:Vet ID'
];
ENTITY_COLUMNS['ProductionYield']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'animal_id:UUID:FK(LivestockRecord) NOT NULL:個体ID:Animal ID',
  'yield_type:VARCHAR(50):NOT NULL:生産物種別:Yield type',
  'quantity:DECIMAL(10,3):NOT NULL:生産量:Quantity',
  'unit:VARCHAR(30):NOT NULL:単位:Unit',
  'measured_date:DATE:NOT NULL:測定日:Measured date',
  'forecast_qty:DECIMAL(10,3)::予測量:Forecast quantity'
];

// ── ext17 entities: Standard Presets ──
ENTITY_COLUMNS['Pet']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID',
  'name:VARCHAR(100):NOT NULL:ペット名:Pet name',
  'species:VARCHAR(50):NOT NULL:種類:Species',
  'breed:VARCHAR(100)::品種:Breed',
  'birth_date:DATE::生年月日:Birth date',
  'weight_kg:DECIMAL(5,2)::体重:Weight (kg)'
];
ENTITY_COLUMNS['HealthRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'pet_id:UUID:FK(Pet) NOT NULL:ペットID:Pet ID',
  'record_type:VARCHAR(50):NOT NULL:記録種別:Record type',
  'description:TEXT:NOT NULL:内容:Description',
  'recorded_at:TIMESTAMP:NOT NULL:記録日時:Recorded at',
  'vet_id:UUID:FK(VetAppointment)::担当医ID:Vet ID'
];
ENTITY_COLUMNS['VaccinationSchedule']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'pet_id:UUID:FK(Pet) NOT NULL:ペットID:Pet ID',
  'vaccine_name:VARCHAR(100):NOT NULL:ワクチン名:Vaccine name',
  'scheduled_date:DATE:NOT NULL:予定日:Scheduled date',
  'administered_date:DATE::接種日:Administered date',
  'status:VARCHAR(20):NOT NULL DEFAULT \'pending\':ステータス:Status'
];
ENTITY_COLUMNS['VetAppointment']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'pet_id:UUID:FK(Pet) NOT NULL:ペットID:Pet ID',
  'clinic_name:VARCHAR(200):NOT NULL:クリニック名:Clinic name',
  'appointment_at:TIMESTAMP:NOT NULL:予約日時:Appointment date',
  'reason:TEXT::受診理由:Reason',
  'status:VARCHAR(20):NOT NULL DEFAULT \'scheduled\':ステータス:Status'
];
ENTITY_COLUMNS['LanguageProfile']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'native_lang:VARCHAR(50):NOT NULL:母国語:Native language',
  'learning_lang:VARCHAR(50):NOT NULL:学習言語:Learning language',
  'level:VARCHAR(30):NOT NULL:レベル:Level',
  'timezone:VARCHAR(50)::タイムゾーン:Timezone'
];
ENTITY_COLUMNS['ExchangeSession']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'user_a_id:UUID:FK(User) NOT NULL:ユーザーAのID:User A ID',
  'user_b_id:UUID:FK(User) NOT NULL:ユーザーBのID:User B ID',
  'scheduled_at:TIMESTAMP:NOT NULL:予定日時:Scheduled at',
  'duration_min:INTEGER:NOT NULL DEFAULT 30:時間(分):Duration (min)',
  'status:VARCHAR(20):NOT NULL DEFAULT \'pending\':ステータス:Status'
];
ENTITY_COLUMNS['ConversationRoom']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'session_id:UUID:FK(ExchangeSession) NOT NULL:セッションID:Session ID',
  'room_url:VARCHAR(500)::ルームURL:Room URL',
  'language_focus:VARCHAR(50):NOT NULL:フォーカス言語:Language focus',
  'notes:TEXT::メモ:Notes'
];
ENTITY_COLUMNS['LearningGoal']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'goal_text:TEXT:NOT NULL:目標内容:Goal text',
  'target_date:DATE::目標達成日:Target date',
  'achieved:BOOLEAN:NOT NULL DEFAULT false:達成済み:Achieved'
];
ENTITY_COLUMNS['Warehouse']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(200):NOT NULL:倉庫名:Warehouse name',
  'location:VARCHAR(300)::所在地:Location',
  'capacity:INTEGER::収容量:Capacity',
  'manager_id:UUID:FK(User)::管理者ID:Manager ID'
];
ENTITY_COLUMNS['InventoryItem']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'warehouse_id:UUID:FK(Warehouse) NOT NULL:倉庫ID:Warehouse ID',
  'sku:VARCHAR(100):NOT NULL UNIQUE:SKU:SKU',
  'name:VARCHAR(200):NOT NULL:品名:Item name',
  'quantity:INTEGER:NOT NULL DEFAULT 0:在庫数:Quantity',
  'reorder_point:INTEGER:NOT NULL DEFAULT 10:発注点:Reorder point',
  'shelf_location:VARCHAR(50)::棚番:Shelf location'
];
ENTITY_COLUMNS['ShipmentOrder']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'order_type:VARCHAR(20):NOT NULL:種別(入荷/出荷):Order type (in/out)',
  'status:VARCHAR(30):NOT NULL DEFAULT \'pending\':ステータス:Status',
  'scheduled_date:DATE:NOT NULL:予定日:Scheduled date',
  'completed_at:TIMESTAMP::完了日時:Completed at',
  'notes:TEXT::備考:Notes'
];
ENTITY_COLUMNS['StockMovement']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'item_id:UUID:FK(InventoryItem) NOT NULL:アイテムID:Item ID',
  'movement_type:VARCHAR(30):NOT NULL:移動種別:Movement type',
  'quantity:INTEGER:NOT NULL:数量:Quantity',
  'from_location:VARCHAR(50)::移動元:From location',
  'to_location:VARCHAR(50)::移動先:To location',
  'moved_at:TIMESTAMP:NOT NULL:移動日時:Moved at'
];
ENTITY_COLUMNS['SubscriptionPlan']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(100):NOT NULL:プラン名:Plan name',
  'price_monthly:INTEGER:NOT NULL:月額:Monthly price',
  'description:TEXT::説明:Description',
  'is_active:BOOLEAN:NOT NULL DEFAULT true:有効:Is active'
];
ENTITY_COLUMNS['BoxCuration']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'plan_id:UUID:FK(SubscriptionPlan) NOT NULL:プランID:Plan ID',
  'month:VARCHAR(7):NOT NULL:対象月(YYYY-MM):Month (YYYY-MM)',
  'theme:VARCHAR(200):NOT NULL:テーマ:Theme',
  'items_json:JSONB::アイテムリスト:Items list'
];
ENTITY_COLUMNS['ShipmentTracker']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'box_id:UUID:FK(BoxCuration) NOT NULL:BOX ID:Box ID',
  'tracking_number:VARCHAR(100)::追跡番号:Tracking number',
  'shipped_at:TIMESTAMP::発送日時:Shipped at',
  'delivered_at:TIMESTAMP::配送完了日時:Delivered at',
  'status:VARCHAR(30):NOT NULL DEFAULT \'pending\':ステータス:Status'
];
ENTITY_COLUMNS['ProductReview']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'box_id:UUID:FK(BoxCuration) NOT NULL:BOX ID:Box ID',
  'rating:INTEGER:NOT NULL CHECK(rating BETWEEN 1 AND 5):評価:Rating',
  'comment:TEXT::コメント:Comment',
  'reviewed_at:TIMESTAMP:NOT NULL:レビュー日時:Reviewed at'
];
ENTITY_COLUMNS['CoworkingSpace']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(200):NOT NULL:スペース名:Space name',
  'desk_count:INTEGER:NOT NULL:デスク数:Desk count',
  'hourly_rate:INTEGER:NOT NULL:時間料金:Hourly rate',
  'address:VARCHAR(300)::住所:Address',
  'amenities_json:JSONB::設備リスト:Amenities list'
];
ENTITY_COLUMNS['DeskReservation']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'space_id:UUID:FK(CoworkingSpace) NOT NULL:スペースID:Space ID',
  'desk_number:INTEGER::デスク番号:Desk number',
  'start_at:TIMESTAMP:NOT NULL:開始日時:Start at',
  'end_at:TIMESTAMP:NOT NULL:終了日時:End at',
  'status:VARCHAR(20):NOT NULL DEFAULT \'confirmed\':ステータス:Status'
];
ENTITY_COLUMNS['MembershipPlan']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(100):NOT NULL:プラン名:Plan name',
  'monthly_fee:INTEGER:NOT NULL:月額:Monthly fee',
  'hours_per_month:INTEGER:NOT NULL:月間利用時間:Hours per month',
  'benefits_json:JSONB::特典:Benefits'
];
ENTITY_COLUMNS['AccessLog']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'space_id:UUID:FK(CoworkingSpace) NOT NULL:スペースID:Space ID',
  'entered_at:TIMESTAMP:NOT NULL:入館日時:Entered at',
  'exited_at:TIMESTAMP::退館日時:Exited at',
  'access_method:VARCHAR(30)::入館方法:Access method'
];
ENTITY_COLUMNS['Track']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'artist_id:UUID:FK(User) NOT NULL:アーティストID:Artist ID',
  'title:VARCHAR(200):NOT NULL:楽曲タイトル:Track title',
  'duration_sec:INTEGER:NOT NULL:再生時間(秒):Duration (sec)',
  'file_url:VARCHAR(500):NOT NULL:ファイルURL:File URL',
  'genre:VARCHAR(50)::ジャンル:Genre',
  'album_id:UUID:FK(Album)::アルバムID:Album ID'
];
ENTITY_COLUMNS['Playlist']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'name:VARCHAR(200):NOT NULL:プレイリスト名:Playlist name',
  'is_public:BOOLEAN:NOT NULL DEFAULT false:公開設定:Is public',
  'tracks_json:JSONB::トラックリスト:Track list'
];
ENTITY_COLUMNS['Album']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'artist_id:UUID:FK(User) NOT NULL:アーティストID:Artist ID',
  'title:VARCHAR(200):NOT NULL:アルバム名:Album title',
  'release_date:DATE::リリース日:Release date',
  'cover_url:VARCHAR(500)::カバー画像URL:Cover image URL'
];
ENTITY_COLUMNS['StreamingHistory']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'track_id:UUID:FK(Track) NOT NULL:トラックID:Track ID',
  'played_at:TIMESTAMP:NOT NULL:再生日時:Played at',
  'duration_played:INTEGER:NOT NULL:再生時間(秒):Duration played (sec)'
];
ENTITY_COLUMNS['CarbonProject']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(200):NOT NULL:プロジェクト名:Project name',
  'project_type:VARCHAR(50):NOT NULL:種別:Project type',
  'country:VARCHAR(100):NOT NULL:国:Country',
  'total_credits:DECIMAL(12,3):NOT NULL:総クレジット量:Total credits',
  'price_per_credit:DECIMAL(10,2):NOT NULL:単価:Price per credit'
];
ENTITY_COLUMNS['OffsetCredit']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'user_id:UUID:FK(User) NOT NULL:購入者ID:Purchaser ID',
  'project_id:UUID:FK(CarbonProject) NOT NULL:プロジェクトID:Project ID',
  'quantity:DECIMAL(10,3):NOT NULL:購入量:Quantity',
  'purchased_at:TIMESTAMP:NOT NULL:購入日時:Purchased at',
  'status:VARCHAR(20):NOT NULL DEFAULT \'active\':ステータス:Status'
];
ENTITY_COLUMNS['EmissionReport']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'report_year:INTEGER:NOT NULL:対象年:Report year',
  'scope1_tco2:DECIMAL(12,3):NOT NULL:Scope1排出量:Scope 1 tCO2',
  'scope2_tco2:DECIMAL(12,3):NOT NULL:Scope2排出量:Scope 2 tCO2',
  'scope3_tco2:DECIMAL(12,3)::Scope3排出量:Scope 3 tCO2'
];
ENTITY_COLUMNS['RetirementCert']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'credit_id:UUID:FK(OffsetCredit) NOT NULL:クレジットID:Credit ID',
  'retired_at:TIMESTAMP:NOT NULL:償却日時:Retired at',
  'cert_number:VARCHAR(100):NOT NULL UNIQUE:証書番号:Certificate number',
  'pdf_url:VARCHAR(500)::証書PDF URL:Certificate PDF URL'
];
ENTITY_COLUMNS['Contract']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'title:VARCHAR(300):NOT NULL:契約名:Contract title',
  'contract_type:VARCHAR(50):NOT NULL:種別:Contract type',
  'status:VARCHAR(30):NOT NULL DEFAULT \'draft\':ステータス:Status',
  'start_date:DATE::開始日:Start date',
  'end_date:DATE::終了日:End date',
  'counterparty_name:VARCHAR(200)::相手方名:Counterparty name'
];
ENTITY_COLUMNS['ContractTemplate']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(200):NOT NULL:テンプレート名:Template name',
  'contract_type:VARCHAR(50):NOT NULL:種別:Contract type',
  'content:TEXT:NOT NULL:内容:Content',
  'is_active:BOOLEAN:NOT NULL DEFAULT true:有効:Is active'
];
ENTITY_COLUMNS['SignatureRequest']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'contract_id:UUID:FK(Contract) NOT NULL:契約ID:Contract ID',
  'signer_email:VARCHAR(255):NOT NULL:署名者メール:Signer email',
  'status:VARCHAR(30):NOT NULL DEFAULT \'pending\':ステータス:Status',
  'signed_at:TIMESTAMP::署名日時:Signed at',
  'token:VARCHAR(200):NOT NULL:署名トークン:Signature token'
];
ENTITY_COLUMNS['AuditTrail']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'user_id:UUID:FK(User) NOT NULL:操作者ID:Operator ID',
  'resource_type:VARCHAR(50):NOT NULL:リソース種別:Resource type',
  'resource_id:UUID:NOT NULL:リソースID:Resource ID',
  'action:VARCHAR(50):NOT NULL:操作:Action',
  'changes_json:JSONB::変更内容:Changes',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['RenovationProject']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID',
  'property_address:VARCHAR(300):NOT NULL:物件住所:Property address',
  'project_name:VARCHAR(200):NOT NULL:プロジェクト名:Project name',
  'budget:INTEGER:NOT NULL:予算:Budget',
  'start_date:DATE::開始予定日:Start date',
  'status:VARCHAR(30):NOT NULL DEFAULT \'planning\':ステータス:Status'
];
ENTITY_COLUMNS['ContractorBid']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'project_id:UUID:FK(RenovationProject) NOT NULL:プロジェクトID:Project ID',
  'contractor_name:VARCHAR(200):NOT NULL:業者名:Contractor name',
  'bid_amount:INTEGER:NOT NULL:見積金額:Bid amount',
  'submitted_at:TIMESTAMP:NOT NULL:提出日時:Submitted at',
  'status:VARCHAR(20):NOT NULL DEFAULT \'pending\':ステータス:Status'
];
ENTITY_COLUMNS['MaterialList']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'project_id:UUID:FK(RenovationProject) NOT NULL:プロジェクトID:Project ID',
  'item_name:VARCHAR(200):NOT NULL:資材名:Material name',
  'quantity:DECIMAL(10,2):NOT NULL:数量:Quantity',
  'unit:VARCHAR(30):NOT NULL:単位:Unit',
  'unit_cost:INTEGER::単価:Unit cost',
  'supplier:VARCHAR(200)::仕入先:Supplier'
];
ENTITY_COLUMNS['ProgressPhoto']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'project_id:UUID:FK(RenovationProject) NOT NULL:プロジェクトID:Project ID',
  'photo_url:VARCHAR(500):NOT NULL:写真URL:Photo URL',
  'taken_at:TIMESTAMP:NOT NULL:撮影日時:Taken at',
  'phase:VARCHAR(50):NOT NULL:工程フェーズ:Phase',
  'notes:TEXT::メモ:Notes'
];
ENTITY_COLUMNS['League']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(200):NOT NULL:リーグ名:League name',
  'sport_type:VARCHAR(50):NOT NULL:スポーツ種目:Sport type',
  'season:VARCHAR(50):NOT NULL:シーズン:Season',
  'admin_id:UUID:FK(User) NOT NULL:管理者ID:Admin ID',
  'status:VARCHAR(20):NOT NULL DEFAULT \'active\':ステータス:Status'
];
ENTITY_COLUMNS['Team']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'league_id:UUID:FK(League) NOT NULL:リーグID:League ID',
  'name:VARCHAR(200):NOT NULL:チーム名:Team name',
  'manager_id:UUID:FK(User) NOT NULL:マネージャーID:Manager ID',
  'wins:INTEGER:NOT NULL DEFAULT 0:勝数:Wins',
  'losses:INTEGER:NOT NULL DEFAULT 0:負数:Losses'
];
ENTITY_COLUMNS['MatchSchedule']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'league_id:UUID:FK(League) NOT NULL:リーグID:League ID',
  'home_team_id:UUID:FK(Team) NOT NULL:ホームチームID:Home team ID',
  'away_team_id:UUID:FK(Team) NOT NULL:アウェイチームID:Away team ID',
  'scheduled_at:TIMESTAMP:NOT NULL:試合日時:Match date',
  'venue:VARCHAR(200)::会場:Venue',
  'home_score:INTEGER::ホームスコア:Home score',
  'away_score:INTEGER::アウェイスコア:Away score',
  'status:VARCHAR(20):NOT NULL DEFAULT \'scheduled\':ステータス:Status'
];
ENTITY_COLUMNS['PlayerStat']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'player_id:UUID:FK(User) NOT NULL:選手ID:Player ID',
  'team_id:UUID:FK(Team) NOT NULL:チームID:Team ID',
  'match_id:UUID:FK(MatchSchedule):NOT NULL:試合ID:Match ID',
  'goals:INTEGER:NOT NULL DEFAULT 0:得点:Goals',
  'assists:INTEGER:NOT NULL DEFAULT 0:アシスト:Assists',
  'play_time_min:INTEGER:NOT NULL DEFAULT 0:出場時間(分):Play time (min)'
];

// ── ext17 entities: Field Presets ──
ENTITY_COLUMNS['RobotModel']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(200):NOT NULL:モデル名:Model name',
  'dof:INTEGER:NOT NULL:自由度:Degrees of freedom',
  'spec_json:JSONB::仕様:Specifications',
  'urdf_url:VARCHAR(500)::URDFファイルURL:URDF file URL'
];
ENTITY_COLUMNS['SimEnvironment']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(200):NOT NULL:環境名:Environment name',
  'physics_engine:VARCHAR(50):NOT NULL:物理エンジン:Physics engine',
  'config_json:JSONB::設定:Configuration',
  'created_by:UUID:FK(User) NOT NULL:作成者ID:Created by'
];
ENTITY_COLUMNS['SimResult']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'robot_id:UUID:FK(RobotModel) NOT NULL:ロボットID:Robot ID',
  'env_id:UUID:FK(SimEnvironment) NOT NULL:環境ID:Environment ID',
  'duration_sec:DECIMAL(10,3):NOT NULL:シミュレーション時間:Simulation duration (sec)',
  'success:BOOLEAN:NOT NULL:成功フラグ:Success',
  'metrics_json:JSONB::評価指標:Metrics',
  'run_at:TIMESTAMP:NOT NULL:実行日時:Run at'
];
ENTITY_COLUMNS['CollisionData']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'sim_result_id:UUID:FK(SimResult) NOT NULL:シミュレーション結果ID:Sim result ID',
  'collision_count:INTEGER:NOT NULL:衝突回数:Collision count',
  'max_force:DECIMAL(10,3)::最大衝突力:Max collision force',
  'collision_points_json:JSONB::衝突点データ:Collision points data'
];
ENTITY_COLUMNS['MaterialRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(200):NOT NULL:材料名:Material name',
  'category:VARCHAR(50):NOT NULL:カテゴリ:Category',
  'chemical_formula:VARCHAR(100)::化学式:Chemical formula',
  'source_ref:TEXT::出典:Source reference',
  'created_by:UUID:FK(User) NOT NULL:作成者ID:Created by'
];
ENTITY_COLUMNS['PropertyData']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'material_id:UUID:FK(MaterialRecord) NOT NULL:材料ID:Material ID',
  'property_name:VARCHAR(100):NOT NULL:特性名:Property name',
  'value:DECIMAL(18,6):NOT NULL:値:Value',
  'unit:VARCHAR(50):NOT NULL:単位:Unit',
  'temperature_k:DECIMAL(10,2)::測定温度(K):Temperature (K)'
];
ENTITY_COLUMNS['CrystalStructure']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'material_id:UUID:FK(MaterialRecord) NOT NULL:材料ID:Material ID',
  'lattice_type:VARCHAR(50):NOT NULL:格子型:Lattice type',
  'lattice_params_json:JSONB::格子定数:Lattice parameters',
  'space_group:VARCHAR(50)::空間群:Space group',
  'cif_url:VARCHAR(500)::CIFファイルURL:CIF file URL'
];
ENTITY_COLUMNS['MaterialTest']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'material_id:UUID:FK(MaterialRecord) NOT NULL:材料ID:Material ID',
  'test_type:VARCHAR(100):NOT NULL:試験種別:Test type',
  'result_json:JSONB:NOT NULL:試験結果:Test results',
  'tested_at:TIMESTAMP:NOT NULL:試験日時:Tested at',
  'tester_id:UUID:FK(User) NOT NULL:試験者ID:Tester ID'
];
ENTITY_COLUMNS['FieldSensor']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'farm_id:UUID:FK(User) NOT NULL:農場ID:Farm ID',
  'sensor_type:VARCHAR(50):NOT NULL:センサー種別:Sensor type',
  'location_json:JSONB::位置情報:Location',
  'install_date:DATE:NOT NULL:設置日:Install date',
  'status:VARCHAR(20):NOT NULL DEFAULT \'active\':ステータス:Status'
];
ENTITY_COLUMNS['SoilData']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'sensor_id:UUID:FK(FieldSensor) NOT NULL:センサーID:Sensor ID',
  'measured_at:TIMESTAMP:NOT NULL:測定日時:Measured at',
  'moisture_pct:DECIMAL(5,2)::水分率(%):Moisture (%)',
  'ph:DECIMAL(4,2)::pH:pH',
  'nitrogen_mgkg:DECIMAL(8,3)::窒素(mg/kg):Nitrogen (mg/kg)',
  'temperature_c:DECIMAL(5,2)::地温(℃):Soil temp (°C)'
];
ENTITY_COLUMNS['CropPrediction']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'field_id:UUID:FK(User) NOT NULL:圃場ID:Field ID',
  'crop_type:VARCHAR(100):NOT NULL:作物種別:Crop type',
  'predicted_yield_kg:DECIMAL(10,2):NOT NULL:予測収量(kg):Predicted yield (kg)',
  'confidence:DECIMAL(5,2):NOT NULL:信頼度:Confidence',
  'predicted_harvest:DATE:NOT NULL:予測収穫日:Predicted harvest date',
  'model_version:VARCHAR(50):NOT NULL:モデルバージョン:Model version'
];
ENTITY_COLUMNS['DroneImage']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'field_id:UUID:FK(User) NOT NULL:圃場ID:Field ID',
  'image_url:VARCHAR(500):NOT NULL:画像URL:Image URL',
  'captured_at:TIMESTAMP:NOT NULL:撮影日時:Captured at',
  'ndvi_score:DECIMAL(5,3)::NDVIスコア:NDVI score',
  'analysis_json:JSONB::解析結果:Analysis results'
];
ENTITY_COLUMNS['RehabSession']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_id:UUID:FK(User) NOT NULL:患者ID:Patient ID',
  'therapist_id:UUID:FK(User) NOT NULL:セラピストID:Therapist ID',
  'session_date:DATE:NOT NULL:セッション日:Session date',
  'duration_min:INTEGER:NOT NULL:時間(分):Duration (min)',
  'status:VARCHAR(20):NOT NULL DEFAULT \'completed\':ステータス:Status'
];
ENTITY_COLUMNS['ExercisePlan']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_id:UUID:FK(User) NOT NULL:患者ID:Patient ID',
  'exercise_name:VARCHAR(200):NOT NULL:運動名:Exercise name',
  'sets:INTEGER:NOT NULL:セット数:Sets',
  'reps:INTEGER:NOT NULL:回数:Reps',
  'frequency_per_week:INTEGER:NOT NULL:週頻度:Frequency per week'
];
ENTITY_COLUMNS['ProgressMeasurement']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_id:UUID:FK(User) NOT NULL:患者ID:Patient ID',
  'session_id:UUID:FK(RehabSession) NOT NULL:セッションID:Session ID',
  'metric_name:VARCHAR(100):NOT NULL:測定項目:Metric name',
  'value:DECIMAL(10,3):NOT NULL:値:Value',
  'unit:VARCHAR(50):NOT NULL:単位:Unit',
  'measured_at:TIMESTAMP:NOT NULL:測定日時:Measured at'
];
ENTITY_COLUMNS['TherapistNote']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'session_id:UUID:FK(RehabSession) NOT NULL:セッションID:Session ID',
  'therapist_id:UUID:FK(User) NOT NULL:セラピストID:Therapist ID',
  'note_text:TEXT:NOT NULL:メモ内容:Note text',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['SafetyReport']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'reporter_id:UUID:FK(User) NOT NULL:報告者ID:Reporter ID',
  'report_type:VARCHAR(50):NOT NULL:種別:Report type',
  'location_json:JSONB:NOT NULL:位置情報:Location',
  'description:TEXT:NOT NULL:内容:Description',
  'severity:VARCHAR(20):NOT NULL:深刻度:Severity',
  'status:VARCHAR(20):NOT NULL DEFAULT \'open\':ステータス:Status'
];
ENTITY_COLUMNS['IncidentAlert']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'report_id:UUID:FK(SafetyReport) NOT NULL:報告ID:Report ID',
  'alert_type:VARCHAR(50):NOT NULL:アラート種別:Alert type',
  'sent_at:TIMESTAMP:NOT NULL:送信日時:Sent at',
  'recipients_json:JSONB:NOT NULL:送信先:Recipients',
  'status:VARCHAR(20):NOT NULL DEFAULT \'sent\':ステータス:Status'
];
ENTITY_COLUMNS['PatrolRoute']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(200):NOT NULL:ルート名:Route name',
  'waypoints_json:JSONB:NOT NULL:経由地:Waypoints',
  'estimated_min:INTEGER:NOT NULL:推定時間(分):Estimated time (min)',
  'assigned_to:UUID:FK(User)::担当者ID:Assigned to'
];
ENTITY_COLUMNS['CommunityPost']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'author_id:UUID:FK(User) NOT NULL:投稿者ID:Author ID',
  'content:TEXT:NOT NULL:内容:Content',
  'post_type:VARCHAR(30):NOT NULL DEFAULT \'info\':投稿種別:Post type',
  'published_at:TIMESTAMP:NOT NULL DEFAULT NOW():公開日時:Published at',
  'is_pinned:BOOLEAN:NOT NULL DEFAULT false:ピン留め:Is pinned'
];
ENTITY_COLUMNS['SpeciesRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'scientific_name:VARCHAR(200):NOT NULL UNIQUE:学名:Scientific name',
  'common_name_ja:VARCHAR(200)::和名:Common name (JA)',
  'common_name_en:VARCHAR(200)::英名:Common name (EN)',
  'kingdom:VARCHAR(50):NOT NULL:界:Kingdom',
  'conservation_status:VARCHAR(50)::保全状況:Conservation status'
];
ENTITY_COLUMNS['HabitatData']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'species_id:UUID:FK(SpeciesRecord) NOT NULL:種ID:Species ID',
  'region_name:VARCHAR(200):NOT NULL:地域名:Region name',
  'location_json:JSONB:NOT NULL:位置情報:Location',
  'area_ha:DECIMAL(12,2)::面積(ha):Area (ha)',
  'quality_score:INTEGER::生息地品質スコア:Habitat quality score'
];
ENTITY_COLUMNS['ObservationLog']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'species_id:UUID:FK(SpeciesRecord) NOT NULL:種ID:Species ID',
  'observer_id:UUID:FK(User) NOT NULL:観察者ID:Observer ID',
  'observed_at:TIMESTAMP:NOT NULL:観察日時:Observed at',
  'location_json:JSONB:NOT NULL:位置情報:Location',
  'count:INTEGER:NOT NULL DEFAULT 1:確認数:Count',
  'photo_url:VARCHAR(500)::写真URL:Photo URL'
];
ENTITY_COLUMNS['ThreatAssessment']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'species_id:UUID:FK(SpeciesRecord) NOT NULL:種ID:Species ID',
  'threat_type:VARCHAR(100):NOT NULL:脅威種別:Threat type',
  'severity:VARCHAR(20):NOT NULL:深刻度:Severity',
  'mitigation_plan:TEXT::緩和策:Mitigation plan',
  'assessed_at:DATE:NOT NULL:評価日:Assessed at'
];
ENTITY_COLUMNS['BuildingSystem']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'building_name:VARCHAR(200):NOT NULL:建物名:Building name',
  'system_type:VARCHAR(50):NOT NULL:設備種別:System type',
  'floor:VARCHAR(20)::階:Floor',
  'manufacturer:VARCHAR(100)::製造者:Manufacturer',
  'install_year:INTEGER::設置年:Installation year',
  'status:VARCHAR(20):NOT NULL DEFAULT \'active\':ステータス:Status'
];
ENTITY_COLUMNS['SensorNode']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'system_id:UUID:FK(BuildingSystem) NOT NULL:設備ID:System ID',
  'sensor_type:VARCHAR(50):NOT NULL:センサー種別:Sensor type',
  'location_json:JSONB::位置情報:Location',
  'last_value:DECIMAL(12,4)::最新値:Latest value',
  'last_updated_at:TIMESTAMP::最終更新日時:Last updated at',
  'threshold_json:JSONB::閾値設定:Threshold settings'
];
ENTITY_COLUMNS['EnergyConsumption']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'system_id:UUID:FK(BuildingSystem) NOT NULL:設備ID:System ID',
  'measured_at:TIMESTAMP:NOT NULL:計測日時:Measured at',
  'kwh:DECIMAL(12,3):NOT NULL:消費電力(kWh):kWh',
  'cost_jpy:INTEGER::コスト(円):Cost (JPY)',
  'carbon_kg:DECIMAL(10,3)::CO2排出量(kg):Carbon (kg)'
];
ENTITY_COLUMNS['MaintenanceTicket']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'system_id:UUID:FK(BuildingSystem) NOT NULL:設備ID:System ID',
  'title:VARCHAR(300):NOT NULL:タイトル:Title',
  'priority:VARCHAR(20):NOT NULL DEFAULT \'medium\':優先度:Priority',
  'status:VARCHAR(20):NOT NULL DEFAULT \'open\':ステータス:Status',
  'reported_by:UUID:FK(User) NOT NULL:報告者ID:Reported by',
  'due_date:DATE::対応期限:Due date'
];
ENTITY_COLUMNS['ElderlyProfile']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'full_name:VARCHAR(100):NOT NULL:氏名:Full name',
  'birth_date:DATE:NOT NULL:生年月日:Birth date',
  'care_level:VARCHAR(30)::介護度:Care level',
  'medical_notes:TEXT::医療情報:Medical notes',
  'emergency_contact_json:JSONB::緊急連絡先:Emergency contact',
  'caregiver_id:UUID:FK(User) NOT NULL:担当介護士ID:Primary caregiver ID'
];
ENTITY_COLUMNS['CareSchedule']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'elderly_id:UUID:FK(ElderlyProfile) NOT NULL:高齢者ID:Elderly ID',
  'care_type:VARCHAR(50):NOT NULL:ケア種別:Care type',
  'scheduled_at:TIMESTAMP:NOT NULL:予定日時:Scheduled at',
  'duration_min:INTEGER:NOT NULL DEFAULT 30:時間(分):Duration (min)',
  'caregiver_id:UUID:FK(User)::担当者ID:Caregiver ID',
  'status:VARCHAR(20):NOT NULL DEFAULT \'pending\':ステータス:Status'
];
ENTITY_COLUMNS['HealthObservation']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'elderly_id:UUID:FK(ElderlyProfile) NOT NULL:高齢者ID:Elderly ID',
  'observer_id:UUID:FK(User) NOT NULL:観察者ID:Observer ID',
  'observed_at:TIMESTAMP:NOT NULL DEFAULT NOW():観察日時:Observed at',
  'vital_json:JSONB::バイタル情報:Vital data',
  'notes:TEXT::観察メモ:Observation notes',
  'alert_level:VARCHAR(20):NOT NULL DEFAULT \'normal\':アラートレベル:Alert level'
];
ENTITY_COLUMNS['EmergencyAlert']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'elderly_id:UUID:FK(ElderlyProfile) NOT NULL:高齢者ID:Elderly ID',
  'alert_type:VARCHAR(50):NOT NULL:アラート種別:Alert type',
  'triggered_at:TIMESTAMP:NOT NULL DEFAULT NOW():発生日時:Triggered at',
  'resolved_at:TIMESTAMP::解決日時:Resolved at',
  'status:VARCHAR(20):NOT NULL DEFAULT \'active\':ステータス:Status',
  'notified_json:JSONB::通知先:Notified contacts'
];
ENTITY_COLUMNS['TaxCase']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'client_id:UUID:FK(User) NOT NULL:クライアントID:Client ID',
  'case_year:INTEGER:NOT NULL:対象年:Tax year',
  'case_type:VARCHAR(50):NOT NULL:種別:Case type',
  'status:VARCHAR(20):NOT NULL DEFAULT \'open\':ステータス:Status',
  'total_income:BIGINT::総収入:Total income',
  'total_tax:BIGINT::総税額:Total tax'
];
ENTITY_COLUMNS['DeductionItem']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'case_id:UUID:FK(TaxCase) NOT NULL:ケースID:Case ID',
  'deduction_type:VARCHAR(100):NOT NULL:控除種別:Deduction type',
  'amount:BIGINT:NOT NULL:金額:Amount',
  'document_url:VARCHAR(500)::証明書類URL:Document URL',
  'verified:BOOLEAN:NOT NULL DEFAULT false:確認済み:Verified'
];
ENTITY_COLUMNS['TaxCalcResult']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'case_id:UUID:FK(TaxCase) NOT NULL:ケースID:Case ID',
  'calc_version:INTEGER:NOT NULL DEFAULT 1:計算バージョン:Calc version',
  'taxable_income:BIGINT:NOT NULL:課税所得:Taxable income',
  'tax_amount:BIGINT:NOT NULL:税額:Tax amount',
  'calc_detail_json:JSONB::計算詳細:Calculation detail',
  'calculated_at:TIMESTAMP:NOT NULL DEFAULT NOW():計算日時:Calculated at'
];
ENTITY_COLUMNS['FilingRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'case_id:UUID:FK(TaxCase) NOT NULL:ケースID:Case ID',
  'filing_type:VARCHAR(50):NOT NULL:申告種別:Filing type',
  'filed_at:TIMESTAMP:NOT NULL:申告日時:Filed at',
  'receipt_number:VARCHAR(100)::受付番号:Receipt number',
  'status:VARCHAR(20):NOT NULL DEFAULT \'filed\':ステータス:Status'
];
ENTITY_COLUMNS['LabExperiment']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'title:VARCHAR(300):NOT NULL:実験タイトル:Experiment title',
  'subject:VARCHAR(100):NOT NULL:科目:Subject',
  'instructor_id:UUID:FK(User) NOT NULL:担当教員ID:Instructor ID',
  'start_date:DATE:NOT NULL:開始日:Start date',
  'end_date:DATE::終了日:End date',
  'safety_level:VARCHAR(20):NOT NULL DEFAULT \'low\':安全レベル:Safety level'
];
ENTITY_COLUMNS['StudentProject']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'student_id:UUID:FK(User) NOT NULL:学生ID:Student ID',
  'experiment_id:UUID:FK(LabExperiment) NOT NULL:実験ID:Experiment ID',
  'title:VARCHAR(300):NOT NULL:プロジェクトタイトル:Project title',
  'hypothesis:TEXT::仮説:Hypothesis',
  'result:TEXT::結果:Result',
  'grade:VARCHAR(10)::評価:Grade',
  'submitted_at:TIMESTAMP::提出日時:Submitted at'
];
ENTITY_COLUMNS['EquipmentReservation']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'student_id:UUID:FK(User) NOT NULL:学生ID:Student ID',
  'equipment_name:VARCHAR(200):NOT NULL:機器名:Equipment name',
  'experiment_id:UUID:FK(LabExperiment) NOT NULL:実験ID:Experiment ID',
  'reserved_at:TIMESTAMP:NOT NULL:予約日時:Reserved at',
  'duration_hour:DECIMAL(4,1):NOT NULL:利用時間:Duration (hours)',
  'status:VARCHAR(20):NOT NULL DEFAULT \'reserved\':ステータス:Status'
];
ENTITY_COLUMNS['LabSafetyLog']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'experiment_id:UUID:FK(LabExperiment) NOT NULL:実験ID:Experiment ID',
  'logged_by:UUID:FK(User) NOT NULL:記録者ID:Logged by',
  'log_type:VARCHAR(50):NOT NULL:記録種別:Log type',
  'description:TEXT:NOT NULL:内容:Description',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

// ── ext18: presets-ext18.js new entity columns ────────────────────────────────

// esports_platform
ENTITY_COLUMNS['EsportsTournament']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(255):NOT NULL:トーナメント名:Tournament name',
  'game_title:VARCHAR(100):NOT NULL:ゲームタイトル:Game title',
  'format:VARCHAR(50):DEFAULT \'single_elimination\':フォーマット:Format',
  'prize_pool:DECIMAL(12,2):DEFAULT 0:賞金総額:Prize pool',
  'max_teams:INT:NOT NULL:最大チーム数:Max teams',
  'start_date:TIMESTAMP:NOT NULL:開始日時:Start date',
  'status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['EsportsTeam']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(200):NOT NULL:チーム名:Team name',
  'logo_url:TEXT::ロゴURL:Logo URL',
  'captain_id:UUID:FK(User) NOT NULL:キャプテンID:Captain ID',
  'region:VARCHAR(50)::地域:Region',
  'rank_score:INT:DEFAULT 0:ランクスコア:Rank score',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['EsportsMatch']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'tournament_id:UUID:FK(EsportsTournament) NOT NULL:トーナメントID:Tournament ID',
  'team_a_id:UUID:FK(EsportsTeam) NOT NULL:チームAのID:Team A ID',
  'team_b_id:UUID:FK(EsportsTeam) NOT NULL:チームBのID:Team B ID',
  'round:INT:NOT NULL:ラウンド:Round',
  'score_a:INT:DEFAULT 0:チームAスコア:Team A score',
  'score_b:INT:DEFAULT 0:チームBスコア:Team B score',
  'winner_id:UUID:FK(EsportsTeam)::勝者ID:Winner ID',
  'played_at:TIMESTAMP::試合日時:Played at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['EsportsPlayerStat']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'match_id:UUID:FK(EsportsMatch) NOT NULL:試合ID:Match ID',
  'player_id:UUID:FK(User) NOT NULL:選手ID:Player ID',
  'kills:INT:DEFAULT 0:キル数:Kills',
  'deaths:INT:DEFAULT 0:デス数:Deaths',
  'assists:INT:DEFAULT 0:アシスト数:Assists',
  'damage_dealt:INT:DEFAULT 0:与ダメージ:Damage dealt',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['EsportsBracket']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'tournament_id:UUID:FK(EsportsTournament) NOT NULL:トーナメントID:Tournament ID',
  'round:INT:NOT NULL:ラウンド:Round',
  'position:INT:NOT NULL:ポジション:Position',
  'team_id:UUID:FK(EsportsTeam)::チームID:Team ID',
  'is_bye:BOOLEAN:DEFAULT false:シード:Bye',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

// ai_agent_saas
ENTITY_COLUMNS['AgentDefinition']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(255):NOT NULL:エージェント名:Agent name',
  'description:TEXT::説明:Description',
  'llm_provider:VARCHAR(50):DEFAULT \'openai\':LLMプロバイダー:LLM provider',
  'system_prompt:TEXT::システムプロンプト:System prompt',
  'is_active:BOOLEAN:DEFAULT true:有効:Active',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AgentTool']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'agent_id:UUID:FK(AgentDefinition) NOT NULL:エージェントID:Agent ID',
  'tool_name:VARCHAR(100):NOT NULL:ツール名:Tool name',
  'tool_type:VARCHAR(50):NOT NULL:ツール種別:Tool type',
  'config:JSONB::設定:Config',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AgentExecution']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'agent_id:UUID:FK(AgentDefinition) NOT NULL:エージェントID:Agent ID',
  'input:TEXT:NOT NULL:入力:Input',
  'output:TEXT::出力:Output',
  'tokens_used:INT:DEFAULT 0:トークン数:Tokens used',
  'duration_ms:INT::実行時間(ms):Duration (ms)',
  'status:VARCHAR(20):DEFAULT \'running\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AgentVersion']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'agent_id:UUID:FK(AgentDefinition) NOT NULL:エージェントID:Agent ID',
  'version_num:INT:NOT NULL:バージョン番号:Version number',
  'config_snapshot:JSONB:NOT NULL:設定スナップショット:Config snapshot',
  'deployed_at:TIMESTAMP::デプロイ日時:Deployed at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AgentUsageLog']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'agent_id:UUID:FK(AgentDefinition) NOT NULL:エージェントID:Agent ID',
  'usage_date:DATE:NOT NULL:利用日:Usage date',
  'call_count:INT:DEFAULT 0:呼び出し回数:Call count',
  'total_tokens:INT:DEFAULT 0:総トークン数:Total tokens',
  'cost_usd:DECIMAL(10,6):DEFAULT 0:コスト(USD):Cost (USD)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

// oss_marketplace
ENTITY_COLUMNS['OssProject']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(255):NOT NULL:プロジェクト名:Project name',
  'description:TEXT::説明:Description',
  'repo_url:VARCHAR(500):NOT NULL:リポジトリURL:Repository URL',
  'language:VARCHAR(50)::主要言語:Primary language',
  'monthly_goal_usd:DECIMAL(10,2):DEFAULT 0:月次目標金額(USD):Monthly goal (USD)',
  'is_verified:BOOLEAN:DEFAULT false:認証済み:Verified',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['Sponsorship']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'project_id:UUID:FK(OssProject) NOT NULL:プロジェクトID:Project ID',
  'sponsor_id:UUID:FK(User) NOT NULL:スポンサーID:Sponsor ID',
  'amount_usd:DECIMAL(10,2):NOT NULL:金額(USD):Amount (USD)',
  'frequency:VARCHAR(20):DEFAULT \'monthly\':頻度:Frequency',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['BountyIssue']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'project_id:UUID:FK(OssProject) NOT NULL:プロジェクトID:Project ID',
  'issue_url:VARCHAR(500):NOT NULL:Issue URL:Issue URL',
  'title:VARCHAR(500):NOT NULL:タイトル:Title',
  'bounty_usd:DECIMAL(10,2):NOT NULL:バウンティ金額(USD):Bounty (USD)',
  'status:VARCHAR(20):DEFAULT \'open\':ステータス:Status',
  'claimed_by:UUID:FK(User)::クレーム者ID:Claimed by',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ContributorProfile']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'github_username:VARCHAR(100):NOT NULL:GitHubユーザー名:GitHub username',
  'bio:TEXT::自己紹介:Bio',
  'skills:JSONB::スキル:Skills',
  'total_earned_usd:DECIMAL(12,2):DEFAULT 0:総獲得金額(USD):Total earned (USD)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['PayoutRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'recipient_id:UUID:FK(User) NOT NULL:受取者ID:Recipient ID',
  'amount_usd:DECIMAL(10,2):NOT NULL:支払額(USD):Payout amount (USD)',
  'payout_method:VARCHAR(50):NOT NULL:支払方法:Payout method',
  'status:VARCHAR(20):DEFAULT \'pending\':ステータス:Status',
  'processed_at:TIMESTAMP::処理日時:Processed at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

// digital_twin_saas
ENTITY_COLUMNS['TwinAsset']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'asset_name:VARCHAR(255):NOT NULL:資産名:Asset name',
  'asset_type:VARCHAR(100):NOT NULL:資産種別:Asset type',
  'physical_id:VARCHAR(200)::物理ID:Physical ID',
  'model_config:JSONB::モデル設定:Model config',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['SensorStream']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'asset_id:UUID:FK(TwinAsset) NOT NULL:資産ID:Asset ID',
  'sensor_type:VARCHAR(100):NOT NULL:センサー種別:Sensor type',
  'value:DECIMAL(20,6):NOT NULL:値:Value',
  'unit:VARCHAR(50):NOT NULL:単位:Unit',
  'recorded_at:TIMESTAMP:NOT NULL:記録日時:Recorded at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['TwinSimulation']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'asset_id:UUID:FK(TwinAsset) NOT NULL:資産ID:Asset ID',
  'scenario:VARCHAR(255):NOT NULL:シナリオ:Scenario',
  'parameters:JSONB::パラメータ:Parameters',
  'result_summary:JSONB::結果サマリー:Result summary',
  'status:VARCHAR(20):DEFAULT \'running\':ステータス:Status',
  'completed_at:TIMESTAMP::完了日時:Completed at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AnomalyEvent']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'asset_id:UUID:FK(TwinAsset) NOT NULL:資産ID:Asset ID',
  'anomaly_type:VARCHAR(100):NOT NULL:異常種別:Anomaly type',
  'severity:VARCHAR(20):DEFAULT \'warning\':重大度:Severity',
  'description:TEXT:NOT NULL:説明:Description',
  'resolved_at:TIMESTAMP::解消日時:Resolved at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['MaintenancePlan']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'asset_id:UUID:FK(TwinAsset) NOT NULL:資産ID:Asset ID',
  'plan_type:VARCHAR(50):NOT NULL:計画種別:Plan type',
  'scheduled_at:TIMESTAMP:NOT NULL:予定日時:Scheduled at',
  'estimated_hours:DECIMAL(5,1)::推定作業時間:Estimated hours',
  'status:VARCHAR(20):DEFAULT \'planned\':ステータス:Status',
  'completed_at:TIMESTAMP::完了日時:Completed at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

// climate_credit_saas
ENTITY_COLUMNS['ClimateCredit']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'project_name:VARCHAR(255):NOT NULL:プロジェクト名:Project name',
  'credit_type:VARCHAR(100):NOT NULL:クレジット種別:Credit type',
  'volume_tco2:DECIMAL(12,2):NOT NULL:数量(tCO2):Volume (tCO2)',
  'vintage_year:INT:NOT NULL:ビンテージ年:Vintage year',
  'status:VARCHAR(20):DEFAULT \'available\':ステータス:Status',
  'registry_id:VARCHAR(200)::登録機関ID:Registry ID',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['EmissionRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'scope:VARCHAR(10):NOT NULL:スコープ:Scope',
  'category:VARCHAR(100):NOT NULL:カテゴリ:Category',
  'amount_tco2:DECIMAL(12,4):NOT NULL:排出量(tCO2):Emission amount (tCO2)',
  'measurement_date:DATE:NOT NULL:計測日:Measurement date',
  'data_source:VARCHAR(200)::データソース:Data source',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CreditTrade']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'credit_id:UUID:FK(ClimateCredit) NOT NULL:クレジットID:Credit ID',
  'buyer_id:UUID:FK(User) NOT NULL:購入者ID:Buyer ID',
  'seller_id:UUID:FK(User) NOT NULL:販売者ID:Seller ID',
  'quantity_tco2:DECIMAL(12,2):NOT NULL:取引量(tCO2):Trade quantity (tCO2)',
  'price_per_tco2:DECIMAL(10,2):NOT NULL:単価(tCO2):Price per tCO2',
  'trade_date:TIMESTAMP:NOT NULL:取引日時:Trade date',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['VerificationReport']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'credit_id:UUID:FK(ClimateCredit) NOT NULL:クレジットID:Credit ID',
  'verifier_org:VARCHAR(255):NOT NULL:検証機関:Verifier organization',
  'verification_date:DATE:NOT NULL:検証日:Verification date',
  'report_url:TEXT::レポートURL:Report URL',
  'status:VARCHAR(20):DEFAULT \'pending\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['EsgPortfolio']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'period_year:INT:NOT NULL:対象年:Period year',
  'total_emission_tco2:DECIMAL(12,2):DEFAULT 0:総排出量(tCO2):Total emission (tCO2)',
  'total_offset_tco2:DECIMAL(12,2):DEFAULT 0:総オフセット量(tCO2):Total offset (tCO2)',
  'net_emission_tco2:DECIMAL(12,2)::純排出量(tCO2):Net emission (tCO2)',
  'esg_score:DECIMAL(5,2)::ESGスコア:ESG score',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

// elder_care_saas
ENTITY_COLUMNS['ElderResident']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'full_name:VARCHAR(200):NOT NULL:氏名:Full name',
  'birth_date:DATE:NOT NULL:生年月日:Birth date',
  'room_number:VARCHAR(20)::部屋番号:Room number',
  'care_level:INT:DEFAULT 1:要介護度:Care level',
  'emergency_contact:VARCHAR(500)::緊急連絡先:Emergency contact',
  'medical_notes:TEXT::医療情報メモ:Medical notes',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CareScheduleEntry']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'resident_id:UUID:FK(ElderResident) NOT NULL:入居者ID:Resident ID',
  'care_type:VARCHAR(100):NOT NULL:ケア種別:Care type',
  'scheduled_time:TIME:NOT NULL:予定時刻:Scheduled time',
  'assigned_staff_id:UUID:FK(User)::担当スタッフID:Assigned staff ID',
  'frequency:VARCHAR(50):DEFAULT \'daily\':頻度:Frequency',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['MedicationRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'resident_id:UUID:FK(ElderResident) NOT NULL:入居者ID:Resident ID',
  'medication_name:VARCHAR(200):NOT NULL:薬品名:Medication name',
  'dosage:VARCHAR(100):NOT NULL:用量:Dosage',
  'administered_at:TIMESTAMP:NOT NULL:投薬日時:Administered at',
  'staff_id:UUID:FK(User) NOT NULL:担当スタッフID:Staff ID',
  'is_skipped:BOOLEAN:DEFAULT false:スキップ:Skipped',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['VitalMeasurement']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'resident_id:UUID:FK(ElderResident) NOT NULL:入居者ID:Resident ID',
  'measured_at:TIMESTAMP:NOT NULL:計測日時:Measured at',
  'blood_pressure_sys:INT::最高血圧:Systolic BP',
  'blood_pressure_dia:INT::最低血圧:Diastolic BP',
  'pulse:INT::脈拍:Pulse',
  'body_temp:DECIMAL(4,1)::体温:Body temperature',
  'spo2:INT::血中酸素飽和度:SpO2',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['FamilyMessage']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'resident_id:UUID:FK(ElderResident) NOT NULL:入居者ID:Resident ID',
  'sender_id:UUID:FK(User) NOT NULL:送信者ID:Sender ID',
  'message_body:TEXT:NOT NULL:メッセージ本文:Message body',
  'is_read:BOOLEAN:DEFAULT false:既読:Read',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

// creator_monetize
ENTITY_COLUMNS['CreatorProfile']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'display_name:VARCHAR(200):NOT NULL:表示名:Display name',
  'bio:TEXT::自己紹介:Bio',
  'avatar_url:TEXT::アバターURL:Avatar URL',
  'category:VARCHAR(100)::カテゴリ:Category',
  'total_revenue_jpy:DECIMAL(14,2):DEFAULT 0:総収益(JPY):Total revenue (JPY)',
  'subscriber_count:INT:DEFAULT 0:購読者数:Subscriber count',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['MembershipTier']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'creator_id:UUID:FK(CreatorProfile) NOT NULL:クリエイターID:Creator ID',
  'tier_name:VARCHAR(100):NOT NULL:プラン名:Tier name',
  'price_jpy:INT:NOT NULL:月額(JPY):Monthly price (JPY)',
  'benefits:JSONB::特典:Benefits',
  'member_count:INT:DEFAULT 0:会員数:Member count',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['DigitalProduct']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'creator_id:UUID:FK(CreatorProfile) NOT NULL:クリエイターID:Creator ID',
  'title:VARCHAR(300):NOT NULL:タイトル:Title',
  'product_type:VARCHAR(50):NOT NULL:商品種別:Product type',
  'price_jpy:INT:NOT NULL:価格(JPY):Price (JPY)',
  'download_url:TEXT::ダウンロードURL:Download URL',
  'sales_count:INT:DEFAULT 0:販売数:Sales count',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['TipTransaction']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'creator_id:UUID:FK(CreatorProfile) NOT NULL:クリエイターID:Creator ID',
  'tipper_id:UUID:FK(User) NOT NULL:投げ銭者ID:Tipper ID',
  'amount_jpy:INT:NOT NULL:金額(JPY):Amount (JPY)',
  'message:VARCHAR(500)::メッセージ:Message',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CoachingSession']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'creator_id:UUID:FK(CreatorProfile) NOT NULL:クリエイターID:Creator ID',
  'client_id:UUID:FK(User) NOT NULL:クライアントID:Client ID',
  'scheduled_at:TIMESTAMP:NOT NULL:予定日時:Scheduled at',
  'duration_min:INT:DEFAULT 60:時間(分):Duration (min)',
  'price_jpy:INT:NOT NULL:料金(JPY):Price (JPY)',
  'status:VARCHAR(20):DEFAULT \'scheduled\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

// devtools_saas
ENTITY_COLUMNS['DevProject']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'name:VARCHAR(255):NOT NULL:プロジェクト名:Project name',
  'repo_url:VARCHAR(500):NOT NULL:リポジトリURL:Repository URL',
  'git_provider:VARCHAR(50):DEFAULT \'github\':Gitプロバイダー:Git provider',
  'language:VARCHAR(50)::主要言語:Primary language',
  'is_active:BOOLEAN:DEFAULT true:有効:Active',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CodeReview']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'project_id:UUID:FK(DevProject) NOT NULL:プロジェクトID:Project ID',
  'pr_number:INT:NOT NULL:PR番号:PR number',
  'pr_url:VARCHAR(500):NOT NULL:PR URL:PR URL',
  'review_summary:TEXT::レビューサマリー:Review summary',
  'issue_count:INT:DEFAULT 0:指摘数:Issue count',
  'severity:VARCHAR(20):DEFAULT \'medium\':重要度:Severity',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AutoTestSuite']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'project_id:UUID:FK(DevProject) NOT NULL:プロジェクトID:Project ID',
  'suite_name:VARCHAR(255):NOT NULL:スイート名:Suite name',
  'test_count:INT:DEFAULT 0:テスト数:Test count',
  'pass_rate:DECIMAL(5,2):DEFAULT 0:合格率(%):Pass rate (%)',
  'generated_by:VARCHAR(50):DEFAULT \'ai\':生成元:Generated by',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['DocGeneration']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'project_id:UUID:FK(DevProject) NOT NULL:プロジェクトID:Project ID',
  'doc_type:VARCHAR(100):NOT NULL:ドキュメント種別:Doc type',
  'content:TEXT:NOT NULL:内容:Content',
  'status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['DevMetricReport']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'project_id:UUID:FK(DevProject) NOT NULL:プロジェクトID:Project ID',
  'period_start:DATE:NOT NULL:期間開始:Period start',
  'period_end:DATE:NOT NULL:期間終了:Period end',
  'commits:INT:DEFAULT 0:コミット数:Commits',
  'prs_merged:INT:DEFAULT 0:マージPR数:PRs merged',
  'bugs_fixed:INT:DEFAULT 0:修正バグ数:Bugs fixed',
  'coverage_pct:DECIMAL(5,2):DEFAULT 0:カバレッジ(%):Coverage (%)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

// compliance_auto
ENTITY_COLUMNS['ComplianceFramework']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'framework_name:VARCHAR(100):NOT NULL:フレームワーク名:Framework name',
  'version:VARCHAR(20)::バージョン:Version',
  'total_controls:INT:DEFAULT 0:総コントロール数:Total controls',
  'is_active:BOOLEAN:DEFAULT true:有効:Active',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ControlCheck']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'framework_id:UUID:FK(ComplianceFramework) NOT NULL:フレームワークID:Framework ID',
  'control_id:VARCHAR(50):NOT NULL:コントロールID:Control ID',
  'control_name:VARCHAR(300):NOT NULL:コントロール名:Control name',
  'status:VARCHAR(20):DEFAULT \'not_started\':ステータス:Status',
  'last_checked_at:TIMESTAMP::最終チェック日時:Last checked at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['EvidenceItem']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'control_id:UUID:FK(ControlCheck) NOT NULL:コントロールID:Control ID',
  'evidence_type:VARCHAR(100):NOT NULL:証跡種別:Evidence type',
  'file_url:TEXT::ファイルURL:File URL',
  'description:TEXT:NOT NULL:説明:Description',
  'collected_at:TIMESTAMP:NOT NULL:収集日時:Collected at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['RiskAssessment']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'risk_name:VARCHAR(300):NOT NULL:リスク名:Risk name',
  'category:VARCHAR(100):NOT NULL:カテゴリ:Category',
  'likelihood:INT:DEFAULT 3:発生可能性(1-5):Likelihood (1-5)',
  'impact:INT:DEFAULT 3:影響度(1-5):Impact (1-5)',
  'risk_score:INT::リスクスコア:Risk score',
  'mitigation:TEXT::軽減策:Mitigation',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AuditReportDoc']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'framework_id:UUID:FK(ComplianceFramework) NOT NULL:フレームワークID:Framework ID',
  'report_date:DATE:NOT NULL:レポート日:Report date',
  'overall_score:DECIMAL(5,2)::総合スコア:Overall score',
  'pass_count:INT:DEFAULT 0:合格数:Pass count',
  'fail_count:INT:DEFAULT 0:不合格数:Fail count',
  'report_url:TEXT::レポートURL:Report URL',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

// smart_city_platform
ENTITY_COLUMNS['CityInfraNode']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'node_name:VARCHAR(255):NOT NULL:ノード名:Node name',
  'node_type:VARCHAR(100):NOT NULL:ノード種別:Node type',
  'latitude:DECIMAL(10,7)::緯度:Latitude',
  'longitude:DECIMAL(10,7)::経度:Longitude',
  'status:VARCHAR(20):DEFAULT \'active\':ステータス:Status',
  'installed_at:TIMESTAMP::設置日時:Installed at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['TrafficFlowData']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'node_id:UUID:FK(CityInfraNode) NOT NULL:ノードID:Node ID',
  'vehicle_count:INT:DEFAULT 0:車両数:Vehicle count',
  'avg_speed_kmh:DECIMAL(5,1)::平均速度(km/h):Avg speed (km/h)',
  'congestion_level:INT:DEFAULT 0:渋滞レベル(0-5):Congestion level (0-5)',
  'recorded_at:TIMESTAMP:NOT NULL:記録日時:Recorded at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['EnergyGridData']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'node_id:UUID:FK(CityInfraNode) NOT NULL:ノードID:Node ID',
  'consumption_kwh:DECIMAL(12,4):NOT NULL:消費電力(kWh):Consumption (kWh)',
  'generation_kwh:DECIMAL(12,4):DEFAULT 0:発電量(kWh):Generation (kWh)',
  'renewable_pct:DECIMAL(5,2):DEFAULT 0:再生可能エネルギー率(%):Renewable (%)',
  'recorded_at:TIMESTAMP:NOT NULL:記録日時:Recorded at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CitizenServiceRequest']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'citizen_id:UUID:FK(User) NOT NULL:市民ID:Citizen ID',
  'service_type:VARCHAR(100):NOT NULL:サービス種別:Service type',
  'description:TEXT:NOT NULL:内容:Description',
  'status:VARCHAR(20):DEFAULT \'submitted\':ステータス:Status',
  'assigned_dept:VARCHAR(100)::担当部署:Assigned dept',
  'resolved_at:TIMESTAMP::解決日時:Resolved at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CitySimulationRun']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'simulation_type:VARCHAR(100):NOT NULL:シミュレーション種別:Simulation type',
  'scenario_name:VARCHAR(255):NOT NULL:シナリオ名:Scenario name',
  'parameters:JSONB:NOT NULL:パラメータ:Parameters',
  'result_summary:JSONB::結果サマリー:Result summary',
  'status:VARCHAR(20):DEFAULT \'running\':ステータス:Status',
  'completed_at:TIMESTAMP::完了日時:Completed at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

// Field preset entities (ext18)
ENTITY_COLUMNS['FpsMatchData']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'player_id:UUID:FK(User) NOT NULL:選手ID:Player ID',
  'game_title:VARCHAR(100):NOT NULL:ゲームタイトル:Game title',
  'match_duration_sec:INT:NOT NULL:試合時間(秒):Match duration (sec)',
  'map_name:VARCHAR(100)::マップ名:Map name',
  'result:VARCHAR(20):NOT NULL:結果:Result',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['PlayerAimStat']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'match_id:UUID:FK(FpsMatchData) NOT NULL:試合ID:Match ID',
  'accuracy_pct:DECIMAL(5,2)::精度(%):Accuracy (%)',
  'headshot_pct:DECIMAL(5,2)::ヘッドショット率(%):Headshot (%)',
  'avg_reaction_ms:INT::平均反応時間(ms):Avg reaction (ms)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['MapHeatmap']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'match_id:UUID:FK(FpsMatchData) NOT NULL:試合ID:Match ID',
  'map_name:VARCHAR(100):NOT NULL:マップ名:Map name',
  'heatmap_data:JSONB:NOT NULL:ヒートマップデータ:Heatmap data',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['TacticalReplay']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'match_id:UUID:FK(FpsMatchData) NOT NULL:試合ID:Match ID',
  'replay_url:TEXT::リプレイURL:Replay URL',
  'ai_annotation:TEXT::AIアノテーション:AI annotation',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CoachingInsight']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'player_id:UUID:FK(User) NOT NULL:選手ID:Player ID',
  'insight_type:VARCHAR(100):NOT NULL:インサイト種別:Insight type',
  'content:TEXT:NOT NULL:内容:Content',
  'priority:VARCHAR(20):DEFAULT \'medium\':優先度:Priority',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['DevRepo']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'repo_name:VARCHAR(255):NOT NULL:リポジトリ名:Repo name',
  'repo_url:VARCHAR(500):NOT NULL:URL:URL',
  'default_branch:VARCHAR(100):DEFAULT \'main\':デフォルトブランチ:Default branch',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AiCodeReview']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'repo_id:UUID:FK(DevRepo) NOT NULL:リポジトリID:Repo ID',
  'pr_number:INT:NOT NULL:PR番号:PR number',
  'ai_summary:TEXT::AIサマリー:AI summary',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AutoTestCase']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'repo_id:UUID:FK(DevRepo) NOT NULL:リポジトリID:Repo ID',
  'test_name:VARCHAR(300):NOT NULL:テスト名:Test name',
  'test_code:TEXT:NOT NULL:テストコード:Test code',
  'ai_generated:BOOLEAN:DEFAULT true:AI生成:AI generated',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['TechDebtItem']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'repo_id:UUID:FK(DevRepo) NOT NULL:リポジトリID:Repo ID',
  'debt_type:VARCHAR(100):NOT NULL:負債種別:Debt type',
  'description:TEXT:NOT NULL:説明:Description',
  'severity:VARCHAR(20):DEFAULT \'medium\':重大度:Severity',
  'estimated_hours:DECIMAL(5,1)::推定工数:Estimated hours',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AiDocDraft']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'repo_id:UUID:FK(DevRepo) NOT NULL:リポジトリID:Repo ID',
  'doc_type:VARCHAR(100):NOT NULL:ドキュメント種別:Doc type',
  'content:TEXT:NOT NULL:内容:Content',
  'status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ClimateStation']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'station_name:VARCHAR(255):NOT NULL:ステーション名:Station name',
  'latitude:DECIMAL(10,7):NOT NULL:緯度:Latitude',
  'longitude:DECIMAL(10,7):NOT NULL:経度:Longitude',
  'elevation_m:DECIMAL(8,2)::標高(m):Elevation (m)',
  'is_active:BOOLEAN:DEFAULT true:有効:Active',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AtmosphericReading']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'station_id:UUID:FK(ClimateStation) NOT NULL:ステーションID:Station ID',
  'co2_ppm:DECIMAL(8,2)::CO2濃度(ppm):CO2 (ppm)',
  'temperature_c:DECIMAL(5,2)::気温(℃):Temperature (℃)',
  'humidity_pct:DECIMAL(5,2)::湿度(%):Humidity (%)',
  'recorded_at:TIMESTAMP:NOT NULL:記録日時:Recorded at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ExtremWeatherAlert']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'alert_type:VARCHAR(100):NOT NULL:アラート種別:Alert type',
  'severity:VARCHAR(20):DEFAULT \'moderate\':重大度:Severity',
  'region:VARCHAR(200):NOT NULL:地域:Region',
  'description:TEXT:NOT NULL:説明:Description',
  'issued_at:TIMESTAMP:NOT NULL:発報日時:Issued at',
  'expires_at:TIMESTAMP::失効日時:Expires at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ClimateModelRun']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'model_name:VARCHAR(200):NOT NULL:モデル名:Model name',
  'scenario:VARCHAR(100):NOT NULL:シナリオ:Scenario',
  'forecast_years:INT:NOT NULL:予測年数:Forecast years',
  'parameters:JSONB::パラメータ:Parameters',
  'status:VARCHAR(20):DEFAULT \'running\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['Co2TrendReport']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'report_date:DATE:NOT NULL:レポート日:Report date',
  'period:VARCHAR(50):NOT NULL:期間:Period',
  'avg_co2_ppm:DECIMAL(8,2)::平均CO2(ppm):Avg CO2 (ppm)',
  'trend_direction:VARCHAR(20)::トレンド方向:Trend direction',
  'summary:TEXT::サマリー:Summary',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['HomeElderProfile']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'full_name:VARCHAR(200):NOT NULL:氏名:Full name',
  'birth_date:DATE:NOT NULL:生年月日:Birth date',
  'address:TEXT:NOT NULL:住所:Address',
  'care_level:INT:DEFAULT 1:要介護度:Care level',
  'emergency_contact:VARCHAR(500)::緊急連絡先:Emergency contact',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ActivityPattern']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'elder_id:UUID:FK(HomeElderProfile) NOT NULL:入居者ID:Elder ID',
  'pattern_date:DATE:NOT NULL:パターン日:Pattern date',
  'activity_type:VARCHAR(100):NOT NULL:活動種別:Activity type',
  'duration_min:INT::時間(分):Duration (min)',
  'anomaly_flag:BOOLEAN:DEFAULT false:異常フラグ:Anomaly flag',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['FallDetectionEvent']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'elder_id:UUID:FK(HomeElderProfile) NOT NULL:入居者ID:Elder ID',
  'detected_at:TIMESTAMP:NOT NULL:検知日時:Detected at',
  'location:VARCHAR(200)::場所:Location',
  'severity:VARCHAR(20):DEFAULT \'medium\':重大度:Severity',
  'notified_at:TIMESTAMP::通知日時:Notified at',
  'resolved_at:TIMESTAMP::解消日時:Resolved at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CognitiveAssessment']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'elder_id:UUID:FK(HomeElderProfile) NOT NULL:入居者ID:Elder ID',
  'assessment_date:DATE:NOT NULL:評価日:Assessment date',
  'mmse_score:INT::MMSE得点:MMSE score',
  'ai_analysis:TEXT::AI分析:AI analysis',
  'assessor_id:UUID:FK(User)::評価者ID:Assessor ID',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CareTeamNote']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'elder_id:UUID:FK(HomeElderProfile) NOT NULL:入居者ID:Elder ID',
  'author_id:UUID:FK(User) NOT NULL:記録者ID:Author ID',
  'note_body:TEXT:NOT NULL:ノート内容:Note body',
  'note_type:VARCHAR(50):DEFAULT \'observation\':種別:Note type',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CreatorChannel']=[
  'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID',
  'channel_name:VARCHAR(200):NOT NULL:チャンネル名:Channel name',
  'platform:VARCHAR(50):NOT NULL:プラットフォーム:Platform',
  'subscriber_count:INT:DEFAULT 0:購読者数:Subscriber count',
  'total_views:BIGINT:DEFAULT 0:総視聴回数:Total views',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ContentPost']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'channel_id:UUID:FK(CreatorChannel) NOT NULL:チャンネルID:Channel ID',
  'title:VARCHAR(500):NOT NULL:タイトル:Title',
  'content_type:VARCHAR(50):NOT NULL:コンテンツ種別:Content type',
  'views:BIGINT:DEFAULT 0:視聴数:Views',
  'likes:INT:DEFAULT 0:いいね数:Likes',
  'revenue_jpy:DECIMAL(12,2):DEFAULT 0:収益(JPY):Revenue (JPY)',
  'published_at:TIMESTAMP::公開日時:Published at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AudienceInsight']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'channel_id:UUID:FK(CreatorChannel) NOT NULL:チャンネルID:Channel ID',
  'segment_name:VARCHAR(100):NOT NULL:セグメント名:Segment name',
  'age_range:VARCHAR(20)::年代:Age range',
  'gender:VARCHAR(20)::性別:Gender',
  'region:VARCHAR(100)::地域:Region',
  'audience_pct:DECIMAL(5,2)::割合(%):Audience (%)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['RevenueProjection']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'channel_id:UUID:FK(CreatorChannel) NOT NULL:チャンネルID:Channel ID',
  'projection_month:DATE:NOT NULL:予測月:Projection month',
  'projected_jpy:DECIMAL(12,2):NOT NULL:予測収益(JPY):Projected revenue (JPY)',
  'actual_jpy:DECIMAL(12,2)::実績収益(JPY):Actual revenue (JPY)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CollabOpportunity']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'proposer_id:UUID:FK(User) NOT NULL:提案者ID:Proposer ID',
  'target_creator_id:UUID:FK(CreatorProfile) NOT NULL:対象クリエイターID:Target creator ID',
  'collab_type:VARCHAR(100):NOT NULL:コラボ種別:Collab type',
  'description:TEXT:NOT NULL:説明:Description',
  'status:VARCHAR(20):DEFAULT \'open\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['KycRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'customer_id:UUID:FK(User) NOT NULL:顧客ID:Customer ID',
  'id_type:VARCHAR(50):NOT NULL:身分証種別:ID type',
  'verification_status:VARCHAR(20):DEFAULT \'pending\':確認ステータス:Verification status',
  'verified_at:TIMESTAMP::確認日時:Verified at',
  'risk_level:VARCHAR(20):DEFAULT \'low\':リスクレベル:Risk level',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AmlAlert']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'customer_id:UUID:FK(User) NOT NULL:顧客ID:Customer ID',
  'alert_type:VARCHAR(100):NOT NULL:アラート種別:Alert type',
  'amount:DECIMAL(15,2):NOT NULL:金額:Amount',
  'risk_score:DECIMAL(5,2):NOT NULL:リスクスコア:Risk score',
  'status:VARCHAR(20):DEFAULT \'open\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['TransactionMonitor']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'customer_id:UUID:FK(User) NOT NULL:顧客ID:Customer ID',
  'transaction_ref:VARCHAR(100):NOT NULL:取引参照番号:Transaction ref',
  'amount:DECIMAL(15,2):NOT NULL:金額:Amount',
  'currency:VARCHAR(10):DEFAULT \'JPY\':通貨:Currency',
  'risk_flag:BOOLEAN:DEFAULT false:リスクフラグ:Risk flag',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['RegulatoryReport']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'report_type:VARCHAR(100):NOT NULL:レポート種別:Report type',
  'reporting_period:VARCHAR(50):NOT NULL:報告期間:Reporting period',
  'content:TEXT:NOT NULL:内容:Content',
  'submitted_at:TIMESTAMP::提出日時:Submitted at',
  'status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ComplianceRiskScore']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'customer_id:UUID:FK(User) NOT NULL:顧客ID:Customer ID',
  'score:DECIMAL(5,2):NOT NULL:スコア:Score',
  'score_date:DATE:NOT NULL:スコア算出日:Score date',
  'factors:JSONB::スコア要因:Score factors',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['TrafficSensorNode']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'sensor_name:VARCHAR(255):NOT NULL:センサー名:Sensor name',
  'sensor_type:VARCHAR(100):NOT NULL:センサー種別:Sensor type',
  'latitude:DECIMAL(10,7):NOT NULL:緯度:Latitude',
  'longitude:DECIMAL(10,7):NOT NULL:経度:Longitude',
  'is_active:BOOLEAN:DEFAULT true:有効:Active',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['SignalControlData']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'node_id:UUID:FK(TrafficSensorNode) NOT NULL:ノードID:Node ID',
  'green_duration_sec:INT:DEFAULT 30:青信号時間(秒):Green duration (sec)',
  'red_duration_sec:INT:DEFAULT 30:赤信号時間(秒):Red duration (sec)',
  'ai_optimized:BOOLEAN:DEFAULT false:AI最適化:AI optimized',
  'updated_at:TIMESTAMP:NOT NULL:更新日時:Updated at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['PublicTransitFeed']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'transit_type:VARCHAR(50):NOT NULL:交通機関種別:Transit type',
  'line_name:VARCHAR(200):NOT NULL:路線名:Line name',
  'current_delay_min:INT:DEFAULT 0:現在遅延(分):Current delay (min)',
  'recorded_at:TIMESTAMP:NOT NULL:記録日時:Recorded at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CongestionPrediction']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'node_id:UUID:FK(TrafficSensorNode) NOT NULL:ノードID:Node ID',
  'predicted_at:TIMESTAMP:NOT NULL:予測対象日時:Predicted at',
  'congestion_level:INT:NOT NULL:渋滞レベル予測(0-5):Predicted congestion (0-5)',
  'confidence_pct:DECIMAL(5,2)::信頼度(%):Confidence (%)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['UrbanRouteOpt']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'origin_lat:DECIMAL(10,7):NOT NULL:出発緯度:Origin lat',
  'origin_lng:DECIMAL(10,7):NOT NULL:出発経度:Origin lng',
  'dest_lat:DECIMAL(10,7):NOT NULL:目的緯度:Dest lat',
  'dest_lng:DECIMAL(10,7):NOT NULL:目的経度:Dest lng',
  'recommended_route:JSONB::推奨ルート:Recommended route',
  'estimated_time_min:INT::推定時間(分):Estimated time (min)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ScientificTwin']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'twin_name:VARCHAR(255):NOT NULL:ツイン名:Twin name',
  'science_domain:VARCHAR(100):NOT NULL:科学領域:Science domain',
  'model_type:VARCHAR(100):NOT NULL:モデル種別:Model type',
  'parameters_schema:JSONB::パラメータスキーマ:Parameters schema',
  'is_validated:BOOLEAN:DEFAULT false:検証済み:Validated',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['SimulationRun']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'twin_id:UUID:FK(ScientificTwin) NOT NULL:ツインID:Twin ID',
  'run_name:VARCHAR(255):NOT NULL:実行名:Run name',
  'input_parameters:JSONB:NOT NULL:入力パラメータ:Input parameters',
  'output_data:JSONB::出力データ:Output data',
  'status:VARCHAR(20):DEFAULT \'running\':ステータス:Status',
  'completed_at:TIMESTAMP::完了日時:Completed at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['PhysicsModel']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'model_name:VARCHAR(255):NOT NULL:モデル名:Model name',
  'equation_type:VARCHAR(100):NOT NULL:方程式種別:Equation type',
  'parameters:JSONB:NOT NULL:パラメータ:Parameters',
  'validation_accuracy:DECIMAL(5,2)::検証精度:Validation accuracy',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['OptimizationResult']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'twin_id:UUID:FK(ScientificTwin) NOT NULL:ツインID:Twin ID',
  'objective:VARCHAR(200):NOT NULL:最適化目標:Objective',
  'optimal_params:JSONB::最適パラメータ:Optimal parameters',
  'improvement_pct:DECIMAL(5,2)::改善率(%):Improvement (%)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AnomalyFinding']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'twin_id:UUID:FK(ScientificTwin) NOT NULL:ツインID:Twin ID',
  'finding_type:VARCHAR(100):NOT NULL:知見種別:Finding type',
  'description:TEXT:NOT NULL:説明:Description',
  'confidence_pct:DECIMAL(5,2)::信頼度(%):Confidence (%)',
  'is_confirmed:BOOLEAN:DEFAULT false:確認済み:Confirmed',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ElderPatient']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'full_name:VARCHAR(200):NOT NULL:氏名:Full name',
  'birth_date:DATE:NOT NULL:生年月日:Birth date',
  'medical_record_id:VARCHAR(100)::電子カルテID:Medical record ID',
  'physician_id:UUID:FK(User)::主治医ID:Physician ID',
  'care_plan:TEXT::ケアプラン:Care plan',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['RemoteVitalReading']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_id:UUID:FK(ElderPatient) NOT NULL:患者ID:Patient ID',
  'device_type:VARCHAR(100):NOT NULL:デバイス種別:Device type',
  'heart_rate:INT::心拍数:Heart rate',
  'blood_pressure_sys:INT::最高血圧:Systolic BP',
  'blood_pressure_dia:INT::最低血圧:Diastolic BP',
  'spo2:INT::血中酸素飽和度:SpO2',
  'recorded_at:TIMESTAMP:NOT NULL:記録日時:Recorded at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['MedComplianceLog']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_id:UUID:FK(ElderPatient) NOT NULL:患者ID:Patient ID',
  'medication_name:VARCHAR(200):NOT NULL:薬品名:Medication name',
  'scheduled_time:TIMESTAMP:NOT NULL:服薬予定日時:Scheduled time',
  'taken_at:TIMESTAMP::服薬日時:Taken at',
  'is_compliant:BOOLEAN:DEFAULT false:服薬遵守:Compliant',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['PhysicianAlert']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_id:UUID:FK(ElderPatient) NOT NULL:患者ID:Patient ID',
  'physician_id:UUID:FK(User) NOT NULL:主治医ID:Physician ID',
  'alert_type:VARCHAR(100):NOT NULL:アラート種別:Alert type',
  'message:TEXT:NOT NULL:メッセージ:Message',
  'is_read:BOOLEAN:DEFAULT false:既読:Read',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['TelehealthSession']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_id:UUID:FK(ElderPatient) NOT NULL:患者ID:Patient ID',
  'physician_id:UUID:FK(User) NOT NULL:主治医ID:Physician ID',
  'scheduled_at:TIMESTAMP:NOT NULL:予定日時:Scheduled at',
  'duration_min:INT:DEFAULT 30:時間(分):Duration (min)',
  'session_notes:TEXT::セッションメモ:Session notes',
  'status:VARCHAR(20):DEFAULT \'scheduled\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CoachingLearner']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'full_name:VARCHAR(200):NOT NULL:氏名:Full name',
  'learning_goal:TEXT::学習目標:Learning goal',
  'current_level:VARCHAR(50):DEFAULT \'beginner\':現在レベル:Current level',
  'preferred_pace:VARCHAR(50):DEFAULT \'normal\':希望ペース:Preferred pace',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AdaptiveSession']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'learner_id:UUID:FK(CoachingLearner) NOT NULL:学習者ID:Learner ID',
  'session_type:VARCHAR(100):NOT NULL:セッション種別:Session type',
  'ai_prompt_used:TEXT::使用AIプロンプト:AI prompt used',
  'duration_min:INT:DEFAULT 30:時間(分):Duration (min)',
  'comprehension_score:DECIMAL(5,2)::理解度スコア:Comprehension score',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['WeaknessProfile']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'learner_id:UUID:FK(CoachingLearner) NOT NULL:学習者ID:Learner ID',
  'topic_area:VARCHAR(200):NOT NULL:トピックエリア:Topic area',
  'weakness_level:INT:DEFAULT 3:弱点レベル(1-5):Weakness level (1-5)',
  'last_assessed_at:TIMESTAMP::最終評価日時:Last assessed at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CoachingExercise']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'learner_id:UUID:FK(CoachingLearner) NOT NULL:学習者ID:Learner ID',
  'topic_area:VARCHAR(200):NOT NULL:トピックエリア:Topic area',
  'exercise_content:TEXT:NOT NULL:演習内容:Exercise content',
  'difficulty:VARCHAR(20):DEFAULT \'medium\':難易度:Difficulty',
  'ai_generated:BOOLEAN:DEFAULT true:AI生成:AI generated',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['LearnerFeedback']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'learner_id:UUID:FK(CoachingLearner) NOT NULL:学習者ID:Learner ID',
  'session_id:UUID:FK(AdaptiveSession)::セッションID:Session ID',
  'feedback_body:TEXT:NOT NULL:フィードバック内容:Feedback body',
  'rating:INT::評価(1-5):Rating (1-5)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

// ── ext19: presets-ext19.js new entity columns ────────────────────────────────

ENTITY_COLUMNS['VibrationSensor']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'site_id:UUID:FK(SiteMonitor) NOT NULL:サイトID:Site ID',
  'sensor_name:VARCHAR(200):NOT NULL:センサー名:Sensor name',
  'location_desc:TEXT::設置場所:Installation location',
  'sensor_type:VARCHAR(50):DEFAULT \'accelerometer\':センサー種別:Sensor type',
  'sampling_rate_hz:INT:DEFAULT 1000:サンプリングレート(Hz):Sampling rate (Hz)',
  'is_active:BOOLEAN:DEFAULT true:稼働中:Active',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['NoiseReading']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'sensor_id:UUID:FK(VibrationSensor) NOT NULL:センサーID:Sensor ID',
  'measured_at:TIMESTAMP:NOT NULL:計測日時:Measured at',
  'db_value:DECIMAL(6,2):NOT NULL:騒音値(dB):Noise level (dB)',
  'peak_db:DECIMAL(6,2)::ピーク値(dB):Peak dB',
  'frequency_hz:DECIMAL(10,2)::周波数(Hz):Frequency (Hz)',
  'exceeds_limit:BOOLEAN:DEFAULT false:基準値超過:Exceeds limit',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['FreqSpectrum']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'sensor_id:UUID:FK(VibrationSensor) NOT NULL:センサーID:Sensor ID',
  'analyzed_at:TIMESTAMP:NOT NULL:解析日時:Analyzed at',
  'fft_data:JSONB:NOT NULL:FFTデータ:FFT data',
  'dominant_freq_hz:DECIMAL(10,2)::主要周波数(Hz):Dominant frequency (Hz)',
  'rms_value:DECIMAL(10,4)::RMS値:RMS value',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['SiteMonitor']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'site_name:VARCHAR(255):NOT NULL:サイト名:Site name',
  'address:TEXT::住所:Address',
  'site_type:VARCHAR(50):DEFAULT \'factory\':サイト種別:Site type',
  'regulatory_limit_db:DECIMAL(6,2)::規制値(dB):Regulatory limit (dB)',
  'is_active:BOOLEAN:DEFAULT true:稼働中:Active',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['VibAnalysisReport']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'site_id:UUID:FK(SiteMonitor) NOT NULL:サイトID:Site ID',
  'report_period_start:DATE:NOT NULL:計測期間開始:Report period start',
  'report_period_end:DATE:NOT NULL:計測期間終了:Report period end',
  'summary:TEXT::サマリー:Summary',
  'violation_count:INT:DEFAULT 0:超過回数:Violation count',
  'pdf_url:TEXT::PDFパス:PDF URL',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['SurveyPoint']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'project_id:UUID:NOT NULL:プロジェクトID:Project ID',
  'point_name:VARCHAR(100):NOT NULL:点名:Point name',
  'point_type:VARCHAR(50):DEFAULT \'bench_mark\':点種:Point type',
  'latitude:DECIMAL(13,9)::緯度:Latitude',
  'longitude:DECIMAL(13,9)::経度:Longitude',
  'elevation_m:DECIMAL(10,4)::標高(m):Elevation (m)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['SurveyObservation']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'point_id:UUID:FK(SurveyPoint) NOT NULL:点ID:Point ID',
  'observed_at:TIMESTAMP:NOT NULL:観測日時:Observed at',
  'instrument_type:VARCHAR(100)::使用機器:Instrument type',
  'raw_data:JSONB::生データ:Raw data',
  'accuracy_class:VARCHAR(20)::精度等級:Accuracy class',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CoordTransform']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'point_id:UUID:FK(SurveyPoint) NOT NULL:点ID:Point ID',
  'source_crs:VARCHAR(50):NOT NULL:元座標系:Source CRS',
  'target_crs:VARCHAR(50):NOT NULL:変換先座標系:Target CRS',
  'transformed_x:DECIMAL(13,4)::変換後X座標:Transformed X',
  'transformed_y:DECIMAL(13,4)::変換後Y座標:Transformed Y',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['BenchmarkMark']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'mark_id:VARCHAR(50):NOT NULL:基準点番号:Mark ID',
  'mark_name:VARCHAR(200)::基準点名:Mark name',
  'official_elevation_m:DECIMAL(10,4)::公式標高(m):Official elevation (m)',
  'coord_x:DECIMAL(13,4)::X座標:X coordinate',
  'coord_y:DECIMAL(13,4)::Y座標:Y coordinate',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['SurveyReport']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'project_id:UUID:NOT NULL:プロジェクトID:Project ID',
  'report_title:VARCHAR(255):NOT NULL:報告書タイトル:Report title',
  'report_type:VARCHAR(50):DEFAULT \'survey_output\':報告書種別:Report type',
  'generated_at:TIMESTAMP:DEFAULT NOW():生成日時:Generated at',
  'pdf_url:TEXT::PDFパス:PDF URL',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['StatDataset']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'dataset_name:VARCHAR(255):NOT NULL:データセット名:Dataset name',
  'description:TEXT::説明:Description',
  'row_count:INT::行数:Row count',
  'column_count:INT::列数:Column count',
  'file_url:TEXT::ファイルパス:File URL',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['StatHypothesis']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'dataset_id:UUID:FK(StatDataset) NOT NULL:データセットID:Dataset ID',
  'null_hypothesis:TEXT:NOT NULL:帰無仮説:Null hypothesis',
  'alt_hypothesis:TEXT:NOT NULL:対立仮説:Alternative hypothesis',
  'test_method:VARCHAR(100):NOT NULL:検定手法:Test method',
  'alpha_level:DECIMAL(4,3):DEFAULT 0.05:有意水準:Alpha level',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['StatResult']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'hypothesis_id:UUID:FK(StatHypothesis) NOT NULL:仮説ID:Hypothesis ID',
  'p_value:DECIMAL(10,8)::p値:p-value',
  'test_statistic:DECIMAL(10,4)::検定統計量:Test statistic',
  'confidence_interval:JSONB::信頼区間:Confidence interval',
  'rejected:BOOLEAN::棄却:Rejected',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['EffectSizeCalc']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'result_id:UUID:FK(StatResult) NOT NULL:結果ID:Result ID',
  'effect_type:VARCHAR(50):NOT NULL:効果量種別:Effect type',
  'effect_value:DECIMAL(10,4):NOT NULL:効果量値:Effect value',
  'interpretation:VARCHAR(50)::解釈(small/medium/large):Interpretation',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['StatAnalysisReport']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'dataset_id:UUID:FK(StatDataset) NOT NULL:データセットID:Dataset ID',
  'report_title:VARCHAR(255):NOT NULL:レポートタイトル:Report title',
  'summary:TEXT::サマリー:Summary',
  'pdf_url:TEXT::PDFパス:PDF URL',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['CelestialObject']=[
  'catalog_id:VARCHAR(50):NOT NULL:カタログID:Catalog ID',
  'object_name:VARCHAR(255):NOT NULL:天体名:Object name',
  'object_type:VARCHAR(50):NOT NULL:天体種別:Object type',
  'ra_hours:DECIMAL(10,6)::赤経(時):Right ascension (h)',
  'dec_degrees:DECIMAL(10,6)::赤緯(度):Declination (deg)',
  'magnitude:DECIMAL(5,2)::等級:Magnitude',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ObservationLog']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'object_id:UUID:FK(CelestialObject)::天体ID:Object ID',
  'session_id:UUID:FK(TelescopeSession)::セッションID:Session ID',
  'observed_at:TIMESTAMP:NOT NULL:観測日時:Observed at',
  'seeing:DECIMAL(3,1)::シーイング(1-5):Seeing (1-5)',
  'notes:TEXT::備考:Notes',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['StarChart']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'chart_name:VARCHAR(255)::星図名:Chart name',
  'observation_date:DATE:NOT NULL:観測日:Observation date',
  'location_lat:DECIMAL(9,6)::緯度:Latitude',
  'location_lng:DECIMAL(9,6)::経度:Longitude',
  'fov_degrees:DECIMAL(5,2)::視野角(度):Field of view (deg)',
  'chart_data:JSONB::星図データ:Chart data',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AstroImage']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'session_id:UUID:FK(TelescopeSession)::セッションID:Session ID',
  'object_id:UUID:FK(CelestialObject)::天体ID:Object ID',
  'image_url:TEXT:NOT NULL:画像パス:Image URL',
  'exposure_sec:DECIMAL(8,2)::露出時間(秒):Exposure time (s)',
  'filter_type:VARCHAR(50)::フィルター種別:Filter type',
  'stack_count:INT:DEFAULT 1:スタック枚数:Stack count',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['TelescopeSession']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'session_date:DATE:NOT NULL:観測日:Session date',
  'location_name:VARCHAR(200)::観測地名:Location name',
  'telescope_model:VARCHAR(200)::望遠鏡型番:Telescope model',
  'mount_type:VARCHAR(100)::架台種別:Mount type',
  'weather_cond:VARCHAR(100)::天候:Weather condition',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['DentalPatient']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_number:VARCHAR(50):NOT NULL UNIQUE:患者番号:Patient number',
  'full_name:VARCHAR(200):NOT NULL:氏名:Full name',
  'birth_date:DATE::生年月日:Birth date',
  'gender:VARCHAR(10)::性別:Gender',
  'phone:VARCHAR(20)::電話番号:Phone',
  'allergy_notes:TEXT::アレルギー:Allergy notes',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ToothRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_id:UUID:FK(DentalPatient) NOT NULL:患者ID:Patient ID',
  'tooth_number:VARCHAR(10):NOT NULL:歯番号:Tooth number',
  'condition:VARCHAR(100)::状態:Condition',
  'caries_grade:VARCHAR(20)::う蝕グレード:Caries grade',
  'recorded_at:TIMESTAMP:NOT NULL DEFAULT NOW():記録日時:Recorded at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['TreatmentPlan']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_id:UUID:FK(DentalPatient) NOT NULL:患者ID:Patient ID',
  'plan_title:VARCHAR(255):NOT NULL:治療計画タイトル:Plan title',
  'treatment_steps:JSONB::治療ステップ:Treatment steps',
  'estimated_cost:DECIMAL(10,0)::概算費用:Estimated cost',
  'status:VARCHAR(30):DEFAULT \'draft\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ProstheticDesign']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_id:UUID:FK(DentalPatient) NOT NULL:患者ID:Patient ID',
  'prosthetic_type:VARCHAR(100):NOT NULL:補綴種別:Prosthetic type',
  'tooth_number:VARCHAR(10)::対象歯番号:Target tooth',
  'material:VARCHAR(100)::材料:Material',
  'lab_order_id:VARCHAR(100)::技工所発注ID:Lab order ID',
  'status:VARCHAR(30):DEFAULT \'designing\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['DentalXray']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_id:UUID:FK(DentalPatient) NOT NULL:患者ID:Patient ID',
  'xray_type:VARCHAR(50):NOT NULL:X線種別:X-ray type',
  'image_url:TEXT:NOT NULL:画像パス:Image URL',
  'ai_findings:JSONB::AI診断所見:AI findings',
  'taken_at:TIMESTAMP:NOT NULL DEFAULT NOW():撮影日時:Taken at',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['PatentRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patent_number:VARCHAR(100)::特許番号:Patent number',
  'title:VARCHAR(500):NOT NULL:発明の名称:Patent title',
  'status:VARCHAR(50):DEFAULT \'pending\':ステータス:Status',
  'filing_date:DATE::出願日:Filing date',
  'grant_date:DATE::登録日:Grant date',
  'expiry_date:DATE::満了日:Expiry date',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['PriorArtResult']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patent_id:UUID:FK(PatentRecord) NOT NULL:特許ID:Patent ID',
  'search_query:TEXT:NOT NULL:検索クエリ:Search query',
  'found_patent_no:VARCHAR(100)::発見特許番号:Found patent number',
  'relevance_score:DECIMAL(4,2)::関連度スコア:Relevance score',
  'ai_summary:TEXT::AI要約:AI summary',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ClaimDraft']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patent_id:UUID:FK(PatentRecord) NOT NULL:特許ID:Patent ID',
  'claim_number:INT:NOT NULL:請求項番号:Claim number',
  'claim_text:TEXT:NOT NULL:請求項本文:Claim text',
  'claim_type:VARCHAR(30):DEFAULT \'independent\':請求項種別:Claim type',
  'ai_generated:BOOLEAN:DEFAULT false:AI生成:AI generated',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['PatentDeadline']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patent_id:UUID:FK(PatentRecord) NOT NULL:特許ID:Patent ID',
  'deadline_type:VARCHAR(100):NOT NULL:期限種別:Deadline type',
  'due_date:DATE:NOT NULL:期日:Due date',
  'is_completed:BOOLEAN:DEFAULT false:完了:Completed',
  'reminder_sent:BOOLEAN:DEFAULT false:リマインダー送信済:Reminder sent',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['LicenseAgreement']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patent_id:UUID:FK(PatentRecord) NOT NULL:特許ID:Patent ID',
  'licensee_name:VARCHAR(255):NOT NULL:ライセンシー名:Licensee name',
  'license_type:VARCHAR(50):NOT NULL:ライセンス種別:License type',
  'start_date:DATE:NOT NULL:開始日:Start date',
  'end_date:DATE::終了日:End date',
  'royalty_rate:DECIMAL(5,2)::ロイヤルティ率(%):Royalty rate (%)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['Interviewee']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'full_name:VARCHAR(200):NOT NULL:氏名:Full name',
  'birth_year:INT::生年:Birth year',
  'background:TEXT::経歴・背景:Background',
  'region:VARCHAR(200)::出身地域:Region',
  'consent_given:BOOLEAN:DEFAULT false:同意取得済:Consent given',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['OralRecordingSession']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'interviewee_id:UUID:FK(Interviewee) NOT NULL:インタビュイーID:Interviewee ID',
  'recorded_at:TIMESTAMP:NOT NULL:録音日時:Recorded at',
  'duration_sec:INT::収録時間(秒):Duration (sec)',
  'audio_url:TEXT::音声ファイルパス:Audio URL',
  'transcript_status:VARCHAR(30):DEFAULT \'pending\':文字起こし状態:Transcript status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['TranscriptSegment']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'session_id:UUID:FK(OralRecordingSession) NOT NULL:セッションID:Session ID',
  'speaker_label:VARCHAR(50)::話者ラベル:Speaker label',
  'start_time_sec:DECIMAL(10,2):NOT NULL:開始時間(秒):Start time (sec)',
  'end_time_sec:DECIMAL(10,2):NOT NULL:終了時間(秒):End time (sec)',
  'transcript_text:TEXT:NOT NULL:文字起こしテキスト:Transcript text',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['HistoryAnnotation']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'segment_id:UUID:FK(TranscriptSegment) NOT NULL:セグメントID:Segment ID',
  'annotation_type:VARCHAR(50):NOT NULL:注記種別:Annotation type',
  'annotation_text:TEXT:NOT NULL:注記テキスト:Annotation text',
  'historical_period:VARCHAR(100)::時代区分:Historical period',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['OralArchive']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'archive_title:VARCHAR(255):NOT NULL:アーカイブタイトル:Archive title',
  'theme_tags:JSONB::テーマタグ:Theme tags',
  'region:VARCHAR(200)::地域:Region',
  'period_from:INT::収録期間開始年:Period from',
  'period_to:INT::収録期間終了年:Period to',
  'is_public:BOOLEAN:DEFAULT false:公開設定:Is public',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['WritingProject']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'title:VARCHAR(500):NOT NULL:作品タイトル:Title',
  'genre:VARCHAR(100)::ジャンル:Genre',
  'target_word_count:INT::目標文字数:Target word count',
  'current_word_count:INT:DEFAULT 0:現在文字数:Current word count',
  'status:VARCHAR(30):DEFAULT \'drafting\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['StoryCharacter']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'project_id:UUID:FK(WritingProject) NOT NULL:プロジェクトID:Project ID',
  'name:VARCHAR(200):NOT NULL:キャラクター名:Character name',
  'role:VARCHAR(50)::役割:Role',
  'profile:TEXT::プロフィール:Profile',
  'traits:JSONB::性格特性:Traits',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['PlotPoint']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'project_id:UUID:FK(WritingProject) NOT NULL:プロジェクトID:Project ID',
  'sequence_no:INT:NOT NULL:シーケンス番号:Sequence number',
  'plot_title:VARCHAR(300):NOT NULL:プロットタイトル:Plot title',
  'description:TEXT::詳細:Description',
  'foreshadow_tags:JSONB::伏線タグ:Foreshadow tags',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['SceneDraft']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'project_id:UUID:FK(WritingProject) NOT NULL:プロジェクトID:Project ID',
  'scene_title:VARCHAR(300)::シーンタイトル:Scene title',
  'content:TEXT:NOT NULL:本文:Content',
  'word_count:INT:DEFAULT 0:文字数:Word count',
  'version:INT:DEFAULT 1:バージョン:Version',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['WritingFeedback']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'scene_id:UUID:FK(SceneDraft) NOT NULL:シーンID:Scene ID',
  'feedback_type:VARCHAR(50):NOT NULL:フィードバック種別:Feedback type',
  'feedback_body:TEXT:NOT NULL:フィードバック内容:Feedback body',
  'ai_generated:BOOLEAN:DEFAULT true:AI生成:AI generated',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['WasteRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'category_id:UUID:FK(WasteCategory) NOT NULL:カテゴリID:Category ID',
  'emission_date:DATE:NOT NULL:排出日:Emission date',
  'quantity_kg:DECIMAL(10,2):NOT NULL:排出量(kg):Quantity (kg)',
  'source_location:VARCHAR(200)::排出場所:Source location',
  'processor_name:VARCHAR(200)::処理業者名:Processor name',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['WasteCategory']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'category_name:VARCHAR(200):NOT NULL:廃棄物種別名:Category name',
  'waste_code:VARCHAR(50)::廃棄物コード:Waste code',
  'is_industrial:BOOLEAN:DEFAULT false:産業廃棄物:Industrial waste',
  'recyclable:BOOLEAN:DEFAULT false:リサイクル可:Recyclable',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['RecycleRoute']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'route_name:VARCHAR(255):NOT NULL:ルート名:Route name',
  'category_id:UUID:FK(WasteCategory)::対象カテゴリID:Target category ID',
  'collection_day:VARCHAR(20)::収集曜日:Collection day',
  'facility_name:VARCHAR(255)::処理施設名:Facility name',
  'distance_km:DECIMAL(8,2)::距離(km):Distance (km)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ManifestDocument']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'manifest_number:VARCHAR(100):NOT NULL UNIQUE:マニフェスト番号:Manifest number',
  'waste_record_id:UUID:FK(WasteRecord) NOT NULL:廃棄物記録ID:Waste record ID',
  'issued_date:DATE:NOT NULL:交付日:Issued date',
  'status:VARCHAR(30):DEFAULT \'issued\':ステータス:Status',
  'pdf_url:TEXT::PDFパス:PDF URL',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['WasteDisposalSite']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'site_name:VARCHAR(255):NOT NULL:処分場名:Site name',
  'address:TEXT::住所:Address',
  'disposal_type:VARCHAR(100)::処分種別:Disposal type',
  'capacity_ton:DECIMAL(12,2)::処理能力(t):Capacity (t)',
  'license_number:VARCHAR(100)::許可番号:License number',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['SafetyIncident']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'site_id:UUID:NOT NULL:現場ID:Site ID',
  'incident_type:VARCHAR(50):NOT NULL:事故種別:Incident type',
  'severity:VARCHAR(20):DEFAULT \'near_miss\':重大度:Severity',
  'occurred_at:TIMESTAMP:NOT NULL:発生日時:Occurred at',
  'description:TEXT:NOT NULL:状況説明:Description',
  'corrective_action:TEXT::是正措置:Corrective action',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['HazardCheck']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'site_id:UUID:NOT NULL:現場ID:Site ID',
  'check_date:DATE:NOT NULL:点検日:Check date',
  'hazard_type:VARCHAR(100):NOT NULL:危険種別:Hazard type',
  'risk_level:VARCHAR(20):NOT NULL:リスクレベル:Risk level',
  'detected_by:UUID:FK(User)::発見者ID:Detected by',
  'resolved:BOOLEAN:DEFAULT false:解消済:Resolved',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ProtectiveGear']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'gear_name:VARCHAR(200):NOT NULL:保護具名:Gear name',
  'gear_type:VARCHAR(100):NOT NULL:種別:Gear type',
  'assigned_to:UUID:FK(User)::担当者ID:Assigned to',
  'inspection_date:DATE::点検日:Inspection date',
  'status:VARCHAR(30):DEFAULT \'active\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['KyActivity']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'site_id:UUID:NOT NULL:現場ID:Site ID',
  'activity_date:DATE:NOT NULL:活動日:Activity date',
  'team_leader:UUID:FK(User)::班長ID:Team leader',
  'hazards_identified:JSONB::特定危険:Hazards identified',
  'countermeasures:JSONB::対策:Countermeasures',
  'participants_count:INT:DEFAULT 1:参加者数:Participants count',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ConstructionAlert']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'site_id:UUID:NOT NULL:現場ID:Site ID',
  'alert_type:VARCHAR(50):NOT NULL:アラート種別:Alert type',
  'severity:VARCHAR(20):DEFAULT \'warning\':重大度:Severity',
  'message:TEXT:NOT NULL:アラートメッセージ:Alert message',
  'triggered_at:TIMESTAMP:NOT NULL DEFAULT NOW():発生日時:Triggered at',
  'acknowledged:BOOLEAN:DEFAULT false:確認済:Acknowledged',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

// ── ext19 field preset entities ────────────────────────────────────────────────

ENTITY_COLUMNS['VibrEquipment']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'equipment_name:VARCHAR(255):NOT NULL:設備名:Equipment name',
  'equipment_type:VARCHAR(100)::設備種別:Equipment type',
  'location:TEXT::設置場所:Location',
  'criticality:VARCHAR(20):DEFAULT \'medium\':重要度:Criticality',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['VibrMeasurement']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'equipment_id:UUID:FK(VibrEquipment) NOT NULL:設備ID:Equipment ID',
  'measured_at:TIMESTAMP:NOT NULL:計測日時:Measured at',
  'velocity_mm_s:DECIMAL(8,4)::振動速度(mm/s):Velocity (mm/s)',
  'acceleration_g:DECIMAL(8,4)::加速度(g):Acceleration (g)',
  'temp_celsius:DECIMAL(5,2)::温度(℃):Temperature (°C)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['FreqAnalysis']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'measurement_id:UUID:FK(VibrMeasurement) NOT NULL:計測ID:Measurement ID',
  'dominant_freq_hz:DECIMAL(10,2)::主要周波数(Hz):Dominant freq (Hz)',
  'anomaly_flag:BOOLEAN:DEFAULT false:異常フラグ:Anomaly flag',
  'fft_peaks:JSONB::FFTピーク:FFT peaks',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['NoiseCompliance']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'equipment_id:UUID:FK(VibrEquipment) NOT NULL:設備ID:Equipment ID',
  'standard_name:VARCHAR(200):NOT NULL:規制基準名:Standard name',
  'limit_value:DECIMAL(8,4):NOT NULL:基準値:Limit value',
  'unit:VARCHAR(20):NOT NULL:単位:Unit',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['VibrationTrend']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'equipment_id:UUID:FK(VibrEquipment) NOT NULL:設備ID:Equipment ID',
  'trend_date:DATE:NOT NULL:傾向日:Trend date',
  'avg_velocity:DECIMAL(8,4)::平均振動速度:Avg velocity',
  'degradation_pct:DECIMAL(5,2)::劣化率(%):Degradation (%)',
  'maintenance_due:DATE::次回保全予定日:Maintenance due',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['ResearchStudy']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'study_title:VARCHAR(500):NOT NULL:研究タイトル:Study title',
  'research_question:TEXT::研究課題:Research question',
  'study_design:VARCHAR(100)::研究デザイン:Study design',
  'status:VARCHAR(30):DEFAULT \'planning\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['SampleData']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'study_id:UUID:FK(ResearchStudy) NOT NULL:研究ID:Study ID',
  'sample_name:VARCHAR(255):NOT NULL:サンプル名:Sample name',
  'n_size:INT::サンプルサイズ:Sample size',
  'data_json:JSONB::データJSON:Data JSON',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['StatMethod']=[
  'method_name:VARCHAR(200):NOT NULL:手法名:Method name',
  'category:VARCHAR(100):NOT NULL:カテゴリ:Category',
  'assumptions:JSONB::前提条件:Assumptions',
  'use_case:TEXT::適用場面:Use case',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['TestConclusion']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'study_id:UUID:FK(ResearchStudy) NOT NULL:研究ID:Study ID',
  'conclusion_text:TEXT:NOT NULL:結論テキスト:Conclusion text',
  'significance:BOOLEAN::有意差あり:Significant',
  'practical_implication:TEXT::実践的意義:Practical implication',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['StatVisualization']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'study_id:UUID:FK(ResearchStudy) NOT NULL:研究ID:Study ID',
  'chart_type:VARCHAR(50):NOT NULL:グラフ種別:Chart type',
  'chart_config:JSONB::グラフ設定:Chart config',
  'image_url:TEXT::画像パス:Image URL',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['PesticideRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'field_id:UUID:FK(FarmField) NOT NULL:圃場ID:Field ID',
  'pesticide_name:VARCHAR(300):NOT NULL:農薬名:Pesticide name',
  'applied_date:DATE:NOT NULL:散布日:Applied date',
  'dosage_ml:DECIMAL(10,2):NOT NULL:使用量(ml):Dosage (ml)',
  'dilution_rate:VARCHAR(50)::希釈倍率:Dilution rate',
  'target_pest:VARCHAR(200)::対象病害虫:Target pest',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['GapCheckItem']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'check_category:VARCHAR(100):NOT NULL:チェックカテゴリ:Check category',
  'item_description:TEXT:NOT NULL:チェック項目:Item description',
  'gap_standard:VARCHAR(100)::GAP規格:GAP standard',
  'is_required:BOOLEAN:DEFAULT true:必須:Required',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['FarmField']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'field_name:VARCHAR(200):NOT NULL:圃場名:Field name',
  'area_m2:DECIMAL(10,2)::面積(m²):Area (m²)',
  'crop_type:VARCHAR(100)::作物種別:Crop type',
  'location_desc:TEXT::所在地:Location',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['PesticideUsage']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'record_id:UUID:FK(PesticideRecord) NOT NULL:記録ID:Record ID',
  'preharvest_interval_days:INT::収穫前日数:Preharvest interval (days)',
  'residue_risk:VARCHAR(20):DEFAULT \'low\':残留リスク:Residue risk',
  'within_limit:BOOLEAN:DEFAULT true:基準内:Within limit',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['GapCertification']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'cert_type:VARCHAR(100):NOT NULL:認証種別:Certification type',
  'issuing_body:VARCHAR(200)::発行機関:Issuing body',
  'issue_date:DATE::発行日:Issue date',
  'expiry_date:DATE::有効期限:Expiry date',
  'status:VARCHAR(30):DEFAULT \'pending\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['DentalClinicPatient']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_code:VARCHAR(50):NOT NULL UNIQUE:患者コード:Patient code',
  'full_name:VARCHAR(200):NOT NULL:氏名:Full name',
  'birth_date:DATE::生年月日:Birth date',
  'phone:VARCHAR(20)::電話番号:Phone',
  'medical_history:JSONB::既往歴:Medical history',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['OralScan']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_id:UUID:FK(DentalClinicPatient) NOT NULL:患者ID:Patient ID',
  'scan_date:DATE:NOT NULL:スキャン日:Scan date',
  'scan_type:VARCHAR(50):NOT NULL:スキャン種別:Scan type',
  'file_url:TEXT:NOT NULL:ファイルパス:File URL',
  'ai_analysis:JSONB::AI解析結果:AI analysis',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['DentalDiagnosis']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_id:UUID:FK(DentalClinicPatient) NOT NULL:患者ID:Patient ID',
  'diagnosis_date:DATE:NOT NULL:診断日:Diagnosis date',
  'findings:JSONB:NOT NULL:所見:Findings',
  'ai_confidence:DECIMAL(4,2)::AI信頼度:AI confidence',
  'dentist_id:UUID:FK(User)::担当歯科医ID:Dentist ID',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['PerioRecord']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_id:UUID:FK(DentalClinicPatient) NOT NULL:患者ID:Patient ID',
  'recorded_at:DATE:NOT NULL:記録日:Recorded at',
  'pocket_depths:JSONB::ポケット深さデータ:Pocket depths',
  'bleeding_on_probe:BOOLEAN:DEFAULT false:BOP:Bleeding on probe',
  'perio_stage:VARCHAR(20)::歯周病ステージ:Perio stage',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ImplantPlan']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'patient_id:UUID:FK(DentalClinicPatient) NOT NULL:患者ID:Patient ID',
  'implant_site:VARCHAR(50):NOT NULL:埋入部位:Implant site',
  'fixture_brand:VARCHAR(100)::フィクスチャーブランド:Fixture brand',
  'surgery_date:DATE::手術予定日:Surgery date',
  'status:VARCHAR(30):DEFAULT \'planning\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['Invention']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'invention_title:VARCHAR(500):NOT NULL:発明名称:Invention title',
  'inventor_ids:JSONB::発明者ID一覧:Inventor IDs',
  'disclosure_date:DATE:NOT NULL:届出日:Disclosure date',
  'technical_field:VARCHAR(200)::技術分野:Technical field',
  'status:VARCHAR(30):DEFAULT \'disclosed\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['PatentApplication']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'invention_id:UUID:FK(Invention) NOT NULL:発明ID:Invention ID',
  'application_number:VARCHAR(100)::出願番号:Application number',
  'filing_date:DATE::出願日:Filing date',
  'country_code:VARCHAR(10):DEFAULT \'JP\':国コード:Country code',
  'status:VARCHAR(50):DEFAULT \'pending\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['IpPortfolio']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'portfolio_name:VARCHAR(255):NOT NULL:ポートフォリオ名:Portfolio name',
  'technology_domain:VARCHAR(200)::技術領域:Technology domain',
  'total_patents:INT:DEFAULT 0:特許件数:Total patents',
  'estimated_value:DECIMAL(15,0)::推定価値:Estimated value',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['PatentClaim']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'application_id:UUID:FK(PatentApplication) NOT NULL:出願ID:Application ID',
  'claim_number:INT:NOT NULL:請求項番号:Claim number',
  'claim_text:TEXT:NOT NULL:請求項テキスト:Claim text',
  'independent:BOOLEAN:DEFAULT true:独立請求項:Independent',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['RoyaltyTrack']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'license_id:UUID:FK(LicenseAgreement) NOT NULL:ライセンスID:License ID',
  'period_start:DATE:NOT NULL:期間開始:Period start',
  'period_end:DATE:NOT NULL:期間終了:Period end',
  'revenue_amount:DECIMAL(15,2):NOT NULL:ロイヤルティ収入:Revenue amount',
  'payment_status:VARCHAR(30):DEFAULT \'pending\':支払状況:Payment status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['OralNarrator']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'full_name:VARCHAR(200):NOT NULL:語り手氏名:Narrator name',
  'birth_year:INT::生年:Birth year',
  'occupation_history:TEXT::職歴:Occupation history',
  'region:VARCHAR(200)::出身地域:Region',
  'consent_status:VARCHAR(30):DEFAULT \'pending\':同意状況:Consent status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['VoiceArchive']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'narrator_id:UUID:FK(OralNarrator) NOT NULL:語り手ID:Narrator ID',
  'audio_url:TEXT:NOT NULL:音声パス:Audio URL',
  'duration_sec:INT::録音時間(秒):Duration (sec)',
  'recorded_date:DATE::録音日:Recorded date',
  'language:VARCHAR(50):DEFAULT \'ja\':言語:Language',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['TranscriptionJob']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'archive_id:UUID:FK(VoiceArchive) NOT NULL:アーカイブID:Archive ID',
  'status:VARCHAR(30):DEFAULT \'queued\':ステータス:Status',
  'model_used:VARCHAR(100)::使用モデル:Model used',
  'completed_at:TIMESTAMP::完了日時:Completed at',
  'transcript_text:TEXT::文字起こし全文:Full transcript',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ThemeTag']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'tag_name:VARCHAR(200):NOT NULL:テーマタグ名:Theme tag name',
  'category:VARCHAR(100)::カテゴリ:Category',
  'description:TEXT::説明:Description',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['HistoricalEra']=[
  'era_name:VARCHAR(200):NOT NULL:時代名:Era name',
  'era_name_en:VARCHAR(200)::時代名(英):Era name (EN)',
  'start_year:INT::開始年:Start year',
  'end_year:INT::終了年:End year',
  'region:VARCHAR(100):DEFAULT \'Japan\':地域:Region',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['CreativeStory']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'title:VARCHAR(500):NOT NULL:タイトル:Title',
  'genre:VARCHAR(100)::ジャンル:Genre',
  'logline:TEXT::ログライン:Logline',
  'target_length_words:INT::目標文字数:Target length (words)',
  'status:VARCHAR(30):DEFAULT \'drafting\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CharacterSheet']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'story_id:UUID:FK(CreativeStory) NOT NULL:ストーリーID:Story ID',
  'name:VARCHAR(200):NOT NULL:キャラクター名:Character name',
  'archetype:VARCHAR(100)::原型:Archetype',
  'backstory:TEXT::バックストーリー:Backstory',
  'motivation:TEXT::動機:Motivation',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['WorldBuilding']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'story_id:UUID:FK(CreativeStory) NOT NULL:ストーリーID:Story ID',
  'element_type:VARCHAR(50):NOT NULL:要素種別:Element type',
  'element_name:VARCHAR(300):NOT NULL:要素名:Element name',
  'description:TEXT:NOT NULL:説明:Description',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['OutlineNode']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'story_id:UUID:FK(CreativeStory) NOT NULL:ストーリーID:Story ID',
  'parent_id:UUID:FK(OutlineNode)::親ノードID:Parent node ID',
  'node_title:VARCHAR(300):NOT NULL:ノードタイトル:Node title',
  'node_type:VARCHAR(50):DEFAULT \'scene\':ノード種別:Node type',
  'sequence_no:INT:NOT NULL:順序番号:Sequence number',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['WritingSession']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'story_id:UUID:FK(CreativeStory) NOT NULL:ストーリーID:Story ID',
  'started_at:TIMESTAMP:NOT NULL:開始日時:Started at',
  'ended_at:TIMESTAMP::終了日時:Ended at',
  'words_written:INT:DEFAULT 0:執筆文字数:Words written',
  'mood:VARCHAR(50)::気分・状態:Mood',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['WasteStream']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'stream_name:VARCHAR(200):NOT NULL:廃棄物流名:Stream name',
  'origin_process:VARCHAR(200)::発生工程:Origin process',
  'waste_type:VARCHAR(100):NOT NULL:廃棄物種別:Waste type',
  'avg_monthly_kg:DECIMAL(10,2)::月平均発生量(kg):Avg monthly (kg)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['RecyclableMaterial']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'material_name:VARCHAR(200):NOT NULL:資源名:Material name',
  'material_code:VARCHAR(50)::資源コード:Material code',
  'recycle_method:VARCHAR(200)::リサイクル方法:Recycle method',
  'market_price_per_kg:DECIMAL(10,2)::市場単価(円/kg):Market price (¥/kg)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['DisposalEvent']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'stream_id:UUID:FK(WasteStream) NOT NULL:廃棄物流ID:Stream ID',
  'disposal_date:DATE:NOT NULL:処分日:Disposal date',
  'quantity_kg:DECIMAL(10,2):NOT NULL:処分量(kg):Quantity (kg)',
  'method:VARCHAR(100):NOT NULL:処分方法:Disposal method',
  'cost_jpy:DECIMAL(12,0)::処分費用(円):Cost (¥)',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['WasteAudit']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'audit_date:DATE:NOT NULL:監査日:Audit date',
  'auditor_name:VARCHAR(200)::監査者名:Auditor name',
  'findings:TEXT::指摘事項:Findings',
  'corrective_actions:TEXT::是正措置:Corrective actions',
  'status:VARCHAR(30):DEFAULT \'open\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['CircularMetric']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'metric_date:DATE:NOT NULL:計測日:Metric date',
  'recycle_rate_pct:DECIMAL(5,2)::リサイクル率(%):Recycle rate (%)',
  'landfill_rate_pct:DECIMAL(5,2)::埋立率(%):Landfill rate (%)',
  'co2_saved_kg:DECIMAL(12,2)::CO2削減量(kg):CO2 saved (kg)',
  'circular_score:DECIMAL(4,1)::循環スコア:Circular score',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['ConstructionSite']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'site_name:VARCHAR(255):NOT NULL:現場名:Site name',
  'address:TEXT::住所:Address',
  'project_type:VARCHAR(100)::工事種別:Project type',
  'start_date:DATE::着工日:Start date',
  'end_date:DATE::竣工予定日:End date',
  'manager_id:UUID:FK(User)::現場監督ID:Site manager',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['SafetyCheckLog']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'site_id:UUID:FK(ConstructionSite) NOT NULL:現場ID:Site ID',
  'checked_at:TIMESTAMP:NOT NULL:点検日時:Checked at',
  'checker_id:UUID:FK(User)::点検者ID:Checker ID',
  'ppe_compliance_pct:DECIMAL(5,2)::保護具着用率(%):PPE compliance (%)',
  'issues_found:INT:DEFAULT 0:指摘件数:Issues found',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['HazardReport']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'site_id:UUID:FK(ConstructionSite) NOT NULL:現場ID:Site ID',
  'reported_at:TIMESTAMP:NOT NULL:報告日時:Reported at',
  'reporter_id:UUID:FK(User)::報告者ID:Reporter ID',
  'hazard_type:VARCHAR(100):NOT NULL:危険種別:Hazard type',
  'description:TEXT:NOT NULL:状況説明:Description',
  'severity:VARCHAR(20):DEFAULT \'medium\':重大度:Severity',
  'resolved:BOOLEAN:DEFAULT false:解消済:Resolved',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['WorkerEquipment']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'site_id:UUID:FK(ConstructionSite) NOT NULL:現場ID:Site ID',
  'worker_id:UUID:FK(User)::作業者ID:Worker ID',
  'equipment_name:VARCHAR(200):NOT NULL:保護具名:Equipment name',
  'assigned_date:DATE::配布日:Assigned date',
  'last_inspected:DATE::最終点検日:Last inspected',
  'status:VARCHAR(30):DEFAULT \'active\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['IncidentLog']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'site_id:UUID:FK(ConstructionSite) NOT NULL:現場ID:Site ID',
  'incident_type:VARCHAR(50):NOT NULL:事故種別:Incident type',
  'occurred_at:TIMESTAMP:NOT NULL:発生日時:Occurred at',
  'description:TEXT:NOT NULL:状況説明:Description',
  'severity:VARCHAR(20):DEFAULT \'near_miss\':重大度:Severity',
  'corrective_action:TEXT::是正措置:Corrective action',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

ENTITY_COLUMNS['LabAnimal']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'animal_id:VARCHAR(100):NOT NULL UNIQUE:個体番号:Animal ID',
  'species:VARCHAR(100):NOT NULL:動物種:Species',
  'strain:VARCHAR(200)::系統:Strain',
  'sex:VARCHAR(10)::性別:Sex',
  'birth_date:DATE::誕生日:Birth date',
  'cage_id:UUID:FK(AnimalCage)::ケージID:Cage ID',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AnimalCage']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'cage_number:VARCHAR(50):NOT NULL:ケージ番号:Cage number',
  'room_location:VARCHAR(200)::飼育室:Room location',
  'cage_type:VARCHAR(100)::ケージ種別:Cage type',
  'capacity:INT:DEFAULT 5:収容可能数:Capacity',
  'current_count:INT:DEFAULT 0:現在頭数:Current count',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['ExperimentProtocol']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'protocol_title:VARCHAR(500):NOT NULL:プロトコルタイトル:Protocol title',
  'objective:TEXT:NOT NULL:目的:Objective',
  'species_required:VARCHAR(100)::必要動物種:Required species',
  'animal_count:INT::必要頭数:Animal count',
  'approved_at:TIMESTAMP::承認日時:Approved at',
  'status:VARCHAR(30):DEFAULT \'draft\':ステータス:Status',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['EthicsReview']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'protocol_id:UUID:FK(ExperimentProtocol) NOT NULL:プロトコルID:Protocol ID',
  'application_date:DATE:NOT NULL:申請日:Application date',
  'review_status:VARCHAR(30):DEFAULT \'submitted\':審査状況:Review status',
  'committee_decision:VARCHAR(30)::委員会決定:Committee decision',
  'decision_date:DATE::決定日:Decision date',
  'conditions:TEXT::条件・注記:Conditions',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];
ENTITY_COLUMNS['AnimalHealthLog']=[
  'tenant_id:UUID:FK(User) NOT NULL:テナントID:Tenant ID',
  'animal_id:UUID:FK(LabAnimal) NOT NULL:個体ID:Animal ID',
  'recorded_at:TIMESTAMP:NOT NULL:記録日時:Recorded at',
  'body_weight_g:DECIMAL(8,2)::体重(g):Body weight (g)',
  'health_status:VARCHAR(50):DEFAULT \'normal\':健康状態:Health status',
  'observations:TEXT::観察所見:Observations',
  'created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'
];

// ── ext20 ──
ENTITY_COLUMNS['PipeRoute']=['id:UUID:PK:ルートID:Route ID','project_id:UUID:FK:プロジェクトID:Project ID','route_name:VARCHAR(200):NOT NULL:経路名:Route name','pipe_type:VARCHAR(100)::配管種別:Pipe type','diameter_mm:INTEGER::口径(mm):Diameter (mm)','start_node:VARCHAR(200)::始点ノード:Start node','end_node:VARCHAR(200)::終点ノード:End node','length_m:DECIMAL(10,2)::延長(m):Length (m)','status:VARCHAR(50):DEFAULT \'draft\':ステータス:Status','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['WiringPath']=['id:UUID:PK:配線ID:Wiring ID','project_id:UUID:FK:プロジェクトID:Project ID','cable_type:VARCHAR(100):NOT NULL:ケーブル種別:Cable type','route_description:TEXT::経路説明:Route description','load_ampere:DECIMAL(8,2)::電流(A):Load ampere','conduit_size:VARCHAR(50)::電線管サイズ:Conduit size','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['NodePoint']=['id:UUID:PK:ノードID:Node ID','project_id:UUID:FK:プロジェクトID:Project ID','node_code:VARCHAR(50):NOT NULL:ノードコード:Node code','x_coord:DECIMAL(12,4)::X座標:X coordinate','y_coord:DECIMAL(12,4)::Y座標:Y coordinate','z_coord:DECIMAL(12,4)::Z座標:Z coordinate','node_type:VARCHAR(50)::ノード種別:Node type','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['InterferenceCheck']=['id:UUID:PK:干渉チェックID:Interference check ID','project_id:UUID:FK:プロジェクトID:Project ID','element_a:VARCHAR(200)::要素A:Element A','element_b:VARCHAR(200)::要素B:Element B','clearance_mm:DECIMAL(8,2)::クリアランス(mm):Clearance (mm)','result:VARCHAR(20):DEFAULT \'ok\':判定結果:Check result','resolved:BOOLEAN:DEFAULT FALSE:解消済:Resolved','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['MaterialBOM']=['id:UUID:PK:BOM ID:BOM ID','project_id:UUID:FK:プロジェクトID:Project ID','material_code:VARCHAR(100):NOT NULL:材料コード:Material code','material_name:VARCHAR(200):NOT NULL:材料名:Material name','quantity:DECIMAL(12,3)::数量:Quantity','unit:VARCHAR(20)::単位:Unit','unit_price:DECIMAL(12,2)::単価:Unit price','total_price:DECIMAL(14,2)::金額:Total price','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['MaterialSpec']=['id:UUID:PK:材料仕様ID:Material spec ID','spec_name:VARCHAR(200):NOT NULL:仕様名:Spec name','material_type:VARCHAR(100)::材料種別:Material type','standard:VARCHAR(100)::規格:Standard','tensile_mpa:DECIMAL(10,2)::引張強度(MPa):Tensile strength (MPa)','yield_mpa:DECIMAL(10,2)::降伏強度(MPa):Yield strength (MPa)','density:DECIMAL(8,4)::密度(g/cm³):Density','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['FatigueTestResult']=['id:UUID:PK:疲労試験ID:Fatigue test ID','material_spec_id:UUID:FK:材料仕様ID:Material spec ID','stress_amplitude_mpa:DECIMAL(10,2)::応力振幅(MPa):Stress amplitude (MPa)','cycles_to_failure:BIGINT::破断サイクル数:Cycles to failure','test_temp_c:DECIMAL(6,1)::試験温度(°C):Test temperature','r_ratio:DECIMAL(4,2)::応力比R:Stress ratio R','failure_mode:VARCHAR(100)::破損モード:Failure mode','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['SNcurveModel']=['id:UUID:PK:S-Nモデル ID:S-N model ID','material_spec_id:UUID:FK:材料仕様ID:Material spec ID','model_type:VARCHAR(100)::モデル種別:Model type','coefficient_a:DECIMAL(12,6)::係数A:Coefficient A','exponent_b:DECIMAL(10,6)::指数B:Exponent B','endurance_limit_mpa:DECIMAL(10,2)::疲労限度(MPa):Endurance limit','r_squared:DECIMAL(5,4)::決定係数R²:R-squared','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['FailureMode']=['id:UUID:PK:破損モードID:Failure mode ID','name:VARCHAR(200):NOT NULL:破損モード名:Failure mode name','description:TEXT::説明:Description','root_cause:TEXT::根本原因:Root cause','prevention:TEXT::防止策:Prevention','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['StrengthReport']=['id:UUID:PK:報告書ID:Report ID','project_id:UUID:FK:プロジェクトID:Project ID','title:VARCHAR(300):NOT NULL:タイトル:Title','safety_factor:DECIMAL(6,3)::安全係数:Safety factor','design_life_years:DECIMAL(8,2)::設計寿命(年):Design life (years)','conclusion:TEXT::結論:Conclusion','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['GeoBorehole']=['id:UUID:PK:ボーリングID:Borehole ID','project_id:UUID:FK:プロジェクトID:Project ID','borehole_no:VARCHAR(50):NOT NULL:ボーリング番号:Borehole number','easting:DECIMAL(12,4)::東座標:Easting','northing:DECIMAL(12,4)::北座標:Northing','ground_level:DECIMAL(8,3)::地盤高(m):Ground level (m)','total_depth_m:DECIMAL(8,2)::掘削深度(m):Total depth (m)','drill_date:DATE::調査日:Drill date','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['SoilLayer']=['id:UUID:PK:土層ID:Soil layer ID','borehole_id:UUID:FK:ボーリングID:Borehole ID','depth_from_m:DECIMAL(8,2):NOT NULL:深度上端(m):Depth from (m)','depth_to_m:DECIMAL(8,2):NOT NULL:深度下端(m):Depth to (m)','soil_class:VARCHAR(100)::土質区分:Soil classification','description:TEXT::土質記述:Description','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['SptResult']=['id:UUID:PK:SPT結果ID:SPT result ID','borehole_id:UUID:FK:ボーリングID:Borehole ID','depth_m:DECIMAL(8,2):NOT NULL:深度(m):Depth (m)','n_value:INTEGER::N値:N-value','blow1:INTEGER::第1打撃:1st blows','blow2:INTEGER::第2打撃:2nd blows','blow3:INTEGER::第3打撃:3rd blows','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['LiquefactionCalc']=['id:UUID:PK:液状化判定ID:Liquefaction assessment ID','borehole_id:UUID:FK:ボーリングID:Borehole ID','depth_m:DECIMAL(8,2):NOT NULL:深度(m):Depth (m)','fl_value:DECIMAL(6,4)::FL値:FL value','pg_value:DECIMAL(6,4)::PG値:PG value','judgment:VARCHAR(20)::判定:Judgment','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['GeotechReport']=['id:UUID:PK:報告書ID:Report ID','project_id:UUID:FK:プロジェクトID:Project ID','title:VARCHAR(300):NOT NULL:タイトル:Title','report_type:VARCHAR(100)::報告書種別:Report type','conclusion:TEXT::結論:Conclusion','pdf_url:TEXT::PDFパス:PDF URL','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['AquacultureTank']=['id:UUID:PK:水槽ID:Tank ID','farm_id:UUID:FK:養殖場ID:Farm ID','tank_code:VARCHAR(50):NOT NULL:水槽コード:Tank code','species:VARCHAR(100)::養殖魚種:Species','capacity_m3:DECIMAL(10,2)::容量(m³):Capacity (m³)','current_count:INTEGER::現在尾数:Current count','status:VARCHAR(50):DEFAULT \'active\':ステータス:Status','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['WaterQualityLog']=['id:UUID:PK:水質ログID:Water quality log ID','tank_id:UUID:FK:水槽ID:Tank ID','measured_at:TIMESTAMP:NOT NULL:計測日時:Measured at','temperature_c:DECIMAL(5,2)::水温(°C):Temperature (°C)','dissolved_oxygen:DECIMAL(5,2)::溶存酸素(mg/L):Dissolved oxygen','ph:DECIMAL(4,2)::pH:pH','salinity_ppt:DECIMAL(5,2)::塩分(‰):Salinity (‰)','ammonia_ppm:DECIMAL(6,3)::アンモニア(ppm):Ammonia (ppm)','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['AquaFeed']=['id:UUID:PK:給餌記録ID:Feed record ID','tank_id:UUID:FK:水槽ID:Tank ID','feed_time:TIMESTAMP:NOT NULL:給餌日時:Feed time','feed_type:VARCHAR(100)::餌料種別:Feed type','amount_kg:DECIMAL(8,3)::給餌量(kg):Feed amount (kg)','method:VARCHAR(100)::給餌方式:Feed method','ai_recommended:BOOLEAN:DEFAULT FALSE:AI推奨:AI recommended','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['HarvestBatch']=['id:UUID:PK:出荷バッチID:Harvest batch ID','tank_id:UUID:FK:水槽ID:Tank ID','harvest_date:DATE:NOT NULL:出荷日:Harvest date','quantity_kg:DECIMAL(10,2)::重量(kg):Quantity (kg)','avg_weight_g:DECIMAL(8,2)::平均体重(g):Avg weight (g)','market_grade:VARCHAR(50)::市場規格:Market grade','price_per_kg:DECIMAL(10,2)::単価(円/kg):Price per kg','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['AquaAlert']=['id:UUID:PK:アラートID:Alert ID','tank_id:UUID:FK:水槽ID:Tank ID','alert_type:VARCHAR(100):NOT NULL:アラート種別:Alert type','severity:VARCHAR(20):DEFAULT \'warn\':重大度:Severity','parameter:VARCHAR(100)::対象パラメータ:Parameter','value:DECIMAL(10,4)::計測値:Value','threshold:DECIMAL(10,4)::閾値:Threshold','resolved:BOOLEAN:DEFAULT FALSE:解消済:Resolved','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['ClinicalImage']=['id:UUID:PK:画像ID:Image ID','patient_study_id:UUID:FK:症例ID:Patient study ID','modality:VARCHAR(50):NOT NULL:モダリティ:Modality','body_part:VARCHAR(100)::撮影部位:Body part','file_path:TEXT:NOT NULL:ファイルパス:File path','dicom_uid:VARCHAR(200)::DICOM UID:DICOM UID','acquired_at:TIMESTAMP::撮影日時:Acquired at','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['ImagingStudy']=['id:UUID:PK:検査ID:Study ID','patient_id:UUID:FK:患者ID:Patient ID','study_date:DATE:NOT NULL:検査日:Study date','study_type:VARCHAR(100)::検査種別:Study type','clinical_indication:TEXT::臨床的適応:Clinical indication','status:VARCHAR(50):DEFAULT \'pending\':ステータス:Status','radiologist_id:UUID:FK:放射線科医ID:Radiologist ID','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['LesionAnnotation']=['id:UUID:PK:病変アノテーションID:Lesion annotation ID','image_id:UUID:FK:画像ID:Image ID','lesion_type:VARCHAR(100):NOT NULL:病変種別:Lesion type','location:VARCHAR(200)::部位:Location','size_mm:DECIMAL(8,2)::サイズ(mm):Size (mm)','ai_confidence:DECIMAL(5,4)::AI信頼スコア:AI confidence','reviewed:BOOLEAN:DEFAULT FALSE:レビュー済:Reviewed','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['RadiologistReport']=['id:UUID:PK:レポートID:Report ID','study_id:UUID:FK:検査ID:Study ID','findings:TEXT::所見:Findings','impression:TEXT::印象・診断:Impression','recommendations:TEXT::推奨:Recommendations','status:VARCHAR(50):DEFAULT \'draft\':ステータス:Status','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['ImagingCase']=['id:UUID:PK:症例ID:Case ID','patient_id:UUID:FK:患者ID:Patient ID','case_title:VARCHAR(300):NOT NULL:症例名:Case title','modality:VARCHAR(50)::モダリティ:Modality','diagnosis:TEXT::診断:Diagnosis','educational_value:BOOLEAN:DEFAULT FALSE:教育症例:Educational case','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['SpecialStudent']=['id:UUID:PK:生徒ID:Student ID','full_name:VARCHAR(200):NOT NULL:氏名:Full name','grade:VARCHAR(20)::学年:Grade','disability_type:VARCHAR(200)::障害種別:Disability type','support_category:VARCHAR(100)::支援区分:Support category','support_level:VARCHAR(50)::支援レベル:Support level','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['LearningIEP']=['id:UUID:PK:IEP ID:IEP ID','student_id:UUID:FK:生徒ID:Student ID','academic_year:VARCHAR(20):NOT NULL:年度:Academic year','long_term_goal:TEXT::長期目標:Long-term goal','short_term_goals:TEXT::短期目標:Short-term goals','support_contents:TEXT::支援内容:Support contents','review_date:DATE::見直し日:Review date','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['SupportActivity']=['id:UUID:PK:支援活動ID:Support activity ID','iep_id:UUID:FK:IEP ID:IEP ID','activity_date:DATE:NOT NULL:実施日:Activity date','activity_type:VARCHAR(100)::活動種別:Activity type','description:TEXT::内容:Description','outcome:TEXT::成果:Outcome','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['AccessDevice']=['id:UUID:PK:支援機器ID:Assistive device ID','name:VARCHAR(200):NOT NULL:機器名:Device name','device_type:VARCHAR(100)::機器種別:Device type','purpose:TEXT::使用目的:Purpose','assigned_to:UUID:FK:担当生徒ID:Assigned student ID','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['LearnerMilestone']=['id:UUID:PK:達成指標ID:Milestone ID','student_id:UUID:FK:生徒ID:Student ID','milestone_name:VARCHAR(300):NOT NULL:達成指標名:Milestone name','target_date:DATE::目標日:Target date','achieved:BOOLEAN:DEFAULT FALSE:達成済:Achieved','achieved_date:DATE::達成日:Achieved date','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['InteriorProject']=['id:UUID:PK:プロジェクトID:Project ID','client_name:VARCHAR(200):NOT NULL:クライアント名:Client name','room_type:VARCHAR(100)::部屋種別:Room type','area_sqm:DECIMAL(8,2)::面積(㎡):Area (sqm)','budget_jpy:INTEGER::予算(円):Budget (JPY)','style:VARCHAR(100)::インテリアスタイル:Interior style','status:VARCHAR(50):DEFAULT \'draft\':ステータス:Status','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['RoomPlan']=['id:UUID:PK:間取りID:Room plan ID','project_id:UUID:FK:プロジェクトID:Project ID','floor_plan_url:TEXT::間取り図URL:Floor plan URL','width_m:DECIMAL(6,2)::幅(m):Width (m)','length_m:DECIMAL(6,2)::奥行(m):Length (m)','ceiling_height_m:DECIMAL(5,2)::天井高(m):Ceiling height (m)','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['DecorItem']=['id:UUID:PK:インテリアアイテムID:Decor item ID','project_id:UUID:FK:プロジェクトID:Project ID','item_name:VARCHAR(200):NOT NULL:アイテム名:Item name','category:VARCHAR(100)::カテゴリ:Category','brand:VARCHAR(100)::ブランド:Brand','price_jpy:INTEGER::価格(円):Price (JPY)','selected:BOOLEAN:DEFAULT FALSE:採用済:Selected','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['DesignRevision']=['id:UUID:PK:リビジョンID:Revision ID','project_id:UUID:FK:プロジェクトID:Project ID','revision_no:INTEGER:NOT NULL:リビジョン番号:Revision number','changes:TEXT::変更内容:Changes','approved_by:VARCHAR(200)::承認者:Approved by','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['StyleMoodboard']=['id:UUID:PK:ムードボードID:Moodboard ID','project_id:UUID:FK:プロジェクトID:Project ID','title:VARCHAR(200):NOT NULL:タイトル:Title','style_tags:TEXT::スタイルタグ:Style tags','color_palette:TEXT::カラーパレット:Color palette','image_urls:TEXT::画像URL群:Image URLs','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['EstimateItem']=['id:UUID:PK:積算項目ID:Estimate item ID','project_id:UUID:FK:プロジェクトID:Project ID','item_name:VARCHAR(300):NOT NULL:工種名:Item name','category:VARCHAR(100)::工種区分:Category','quantity:DECIMAL(12,3)::数量:Quantity','unit:VARCHAR(30)::単位:Unit','unit_price:DECIMAL(12,2)::単価:Unit price','amount:DECIMAL(14,2)::金額:Amount','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['WorkPackage']=['id:UUID:PK:作業パッケージID:Work package ID','project_id:UUID:FK:プロジェクトID:Project ID','name:VARCHAR(300):NOT NULL:パッケージ名:Package name','scope:TEXT::範囲:Scope','planned_cost:DECIMAL(14,2)::計画費用:Planned cost','actual_cost:DECIMAL(14,2)::実績費用:Actual cost','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['MaterialUnit']=['id:UUID:PK:資材単価ID:Material unit ID','material_name:VARCHAR(300):NOT NULL:資材名:Material name','spec:VARCHAR(200)::規格:Specification','unit:VARCHAR(30):NOT NULL:単位:Unit','unit_price:DECIMAL(12,2):NOT NULL:単価:Unit price','price_date:DATE::単価基準日:Price date','source:VARCHAR(200)::出典:Source','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['QuoteDraft']=['id:UUID:PK:見積書ID:Quote draft ID','project_id:UUID:FK:プロジェクトID:Project ID','quote_no:VARCHAR(100):NOT NULL:見積番号:Quote number','total_amount:DECIMAL(16,2)::合計金額:Total amount','validity_date:DATE::有効期限:Validity date','status:VARCHAR(50):DEFAULT \'draft\':ステータス:Status','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['BidRecord']=['id:UUID:PK:入札記録ID:Bid record ID','project_id:UUID:FK:プロジェクトID:Project ID','bidder_name:VARCHAR(200):NOT NULL:入札者名:Bidder name','bid_amount:DECIMAL(16,2):NOT NULL:入札金額:Bid amount','submitted_at:TIMESTAMP::提出日時:Submitted at','rank:INTEGER::順位:Rank','selected:BOOLEAN:DEFAULT FALSE:落札:Selected','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['SportGameEvent']=['id:UUID:PK:試合ID:Game event ID','tournament_id:UUID:FK:大会ID:Tournament ID','sport_type:VARCHAR(100):NOT NULL:競技種別:Sport type','home_team:VARCHAR(200)::ホームチーム:Home team','away_team:VARCHAR(200)::アウェイチーム:Away team','event_date:TIMESTAMP:NOT NULL:試合日時:Event date','venue:VARCHAR(200)::会場:Venue','status:VARCHAR(50):DEFAULT \'scheduled\':ステータス:Status','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['RulingCall']=['id:UUID:PK:判定ID:Ruling call ID','game_event_id:UUID:FK:試合ID:Game event ID','minute:INTEGER::時間(分):Minute','ruling_type:VARCHAR(100):NOT NULL:判定種別:Ruling type','decision:VARCHAR(200):NOT NULL:決定:Decision','ai_suggestion:VARCHAR(200)::AI提案:AI suggestion','accepted:BOOLEAN:DEFAULT TRUE:採用済:Accepted','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['VideoReviewClip']=['id:UUID:PK:映像ID:Video clip ID','game_event_id:UUID:FK:試合ID:Game event ID','clip_url:TEXT:NOT NULL:クリップURL:Clip URL','start_sec:DECIMAL(8,2)::開始秒:Start second','end_sec:DECIMAL(8,2)::終了秒:End second','review_reason:TEXT::レビュー理由:Review reason','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['SportRule']=['id:UUID:PK:ルールID:Rule ID','sport_type:VARCHAR(100):NOT NULL:競技種別:Sport type','rule_code:VARCHAR(50):NOT NULL:ルールコード:Rule code','title:VARCHAR(300):NOT NULL:タイトル:Title','description:TEXT::説明:Description','effective_date:DATE::施行日:Effective date','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['RefFeedback']=['id:UUID:PK:フィードバックID:Feedback ID','game_event_id:UUID:FK:試合ID:Game event ID','referee_id:UUID:FK:審判ID:Referee ID','accuracy_score:INTEGER::正確性スコア:Accuracy score','feedback:TEXT::フィードバック内容:Feedback content','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['DrugAdverseEvent']=['id:UUID:PK:有害事象ID:Adverse event ID','drug_name:VARCHAR(300):NOT NULL:医薬品名:Drug name','event_type:VARCHAR(300):NOT NULL:事象名:Event type','onset_date:DATE::発現日:Onset date','severity:VARCHAR(50)::重篤度:Severity','outcome:VARCHAR(100)::転帰:Outcome','reported_by:VARCHAR(200)::報告者:Reported by','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['SafetySignal']=['id:UUID:PK:シグナルID:Safety signal ID','drug_name:VARCHAR(300):NOT NULL:医薬品名:Drug name','event_type:VARCHAR(300):NOT NULL:事象名:Event type','ror_value:DECIMAL(10,4)::ROR値:ROR value','prr_value:DECIMAL(10,4)::PRR値:PRR value','signal_status:VARCHAR(50):DEFAULT \'detected\':シグナル状態:Signal status','detected_at:TIMESTAMP:NOT NULL:検出日時:Detected at','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['VigilanceCase']=['id:UUID:PK:症例ID:Case ID','icsr_id:VARCHAR(100):NOT NULL:ICSR ID:ICSR ID','patient_age:INTEGER::患者年齢:Patient age','patient_sex:VARCHAR(10)::性別:Sex','country_code:VARCHAR(10)::国コード:Country code','seriousness:VARCHAR(50)::重篤性:Seriousness','medDra_pt:VARCHAR(300)::MedDRA PT:MedDRA PT','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['RegSubmission']=['id:UUID:PK:申請ID:Submission ID','submission_type:VARCHAR(100):NOT NULL:申請種別:Submission type','target_authority:VARCHAR(200)::提出先:Target authority','due_date:DATE::期限:Due date','submitted_at:TIMESTAMP::提出日時:Submitted at','status:VARCHAR(50):DEFAULT \'pending\':ステータス:Status','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['PharmacovigReport']=['id:UUID:PK:報告書ID:Report ID','report_type:VARCHAR(100):NOT NULL:報告書種別:Report type','period_start:DATE::対象期間開始:Period start','period_end:DATE::対象期間終了:Period end','total_cases:INTEGER::総症例数:Total cases','serious_cases:INTEGER::重篤症例数:Serious cases','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
// field preset entities
ENTITY_COLUMNS['PipeSystemModel']=['id:UUID:PK:モデルID:Model ID','project_id:UUID:FK:プロジェクトID:Project ID','model_name:VARCHAR(200):NOT NULL:モデル名:Model name','system_type:VARCHAR(100)::システム種別:System type','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['RouteSegment']=['id:UUID:PK:セグメントID:Segment ID','model_id:UUID:FK:モデルID:Model ID','segment_no:VARCHAR(50):NOT NULL:セグメント番号:Segment number','length_m:DECIMAL(10,2)::延長(m):Length (m)','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['InterferencePoint']=['id:UUID:PK:干渉点ID:Interference point ID','model_id:UUID:FK:モデルID:Model ID','location_desc:VARCHAR(300)::位置説明:Location description','resolved:BOOLEAN:DEFAULT FALSE:解消済:Resolved','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['DesignReview']=['id:UUID:PK:設計審査ID:Design review ID','project_id:UUID:FK:プロジェクトID:Project ID','review_date:DATE:NOT NULL:審査日:Review date','status:VARCHAR(50):DEFAULT \'pending\':ステータス:Status','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['MaterialRecord']=['id:UUID:PK:材料記録ID:Material record ID','spec_name:VARCHAR(200):NOT NULL:仕様名:Spec name','grade:VARCHAR(100)::グレード:Grade','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['FatigueDataPoint']=['id:UUID:PK:データポイントID:Data point ID','material_id:UUID:FK:材料ID:Material ID','stress_mpa:DECIMAL(10,2)::応力(MPa):Stress (MPa)','cycles:BIGINT::サイクル数:Cycles','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['FractureMechModel']=['id:UUID:PK:モデルID:Model ID','material_id:UUID:FK:材料ID:Material ID','kic_value:DECIMAL(10,4)::KIC値:KIC value','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['MaterialProperty']=['id:UUID:PK:物性ID:Property ID','material_id:UUID:FK:材料ID:Material ID','property_name:VARCHAR(200):NOT NULL:物性名:Property name','value:VARCHAR(200)::値:Value','unit:VARCHAR(50)::単位:Unit','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['TestCampaign']=['id:UUID:PK:試験キャンペーンID:Test campaign ID','name:VARCHAR(300):NOT NULL:試験名:Campaign name','start_date:DATE::開始日:Start date','status:VARCHAR(50):DEFAULT \'planned\':ステータス:Status','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['GeoProfile']=['id:UUID:PK:地質プロファイルID:Geo profile ID','project_id:UUID:FK:プロジェクトID:Project ID','name:VARCHAR(200):NOT NULL:プロファイル名:Profile name','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['SoilTestResult']=['id:UUID:PK:土質試験ID:Soil test result ID','borehole_id:UUID:FK:ボーリングID:Borehole ID','test_type:VARCHAR(100):NOT NULL:試験種別:Test type','depth_m:DECIMAL(8,2)::深度(m):Depth (m)','result_value:DECIMAL(12,4)::試験値:Result value','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['DrillCoreRecord']=['id:UUID:PK:コア記録ID:Core record ID','borehole_id:UUID:FK:ボーリングID:Borehole ID','depth_from_m:DECIMAL(8,2)::深度上端:Depth from','depth_to_m:DECIMAL(8,2)::深度下端:Depth to','rqd:DECIMAL(5,2)::RQD(%):RQD (%)','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['GroundwaterLevel']=['id:UUID:PK:地下水位ID:Groundwater level ID','borehole_id:UUID:FK:ボーリングID:Borehole ID','measured_at:DATE:NOT NULL:計測日:Measured at','level_m:DECIMAL(8,3)::地下水位(m):Water level (m)','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['GeoTechModel']=['id:UUID:PK:地盤モデルID:Geotech model ID','project_id:UUID:FK:プロジェクトID:Project ID','model_type:VARCHAR(100):NOT NULL:モデル種別:Model type','description:TEXT::説明:Description','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['AquaFarm']=['id:UUID:PK:養殖場ID:Aqua farm ID','name:VARCHAR(200):NOT NULL:養殖場名:Farm name','location:VARCHAR(300)::所在地:Location','farm_type:VARCHAR(100)::養殖方式:Farm type','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['SpeciesRecord']=['id:UUID:PK:魚種記録ID:Species record ID','farm_id:UUID:FK:養殖場ID:Farm ID','species_name:VARCHAR(200):NOT NULL:魚種名:Species name','scientific_name:VARCHAR(200)::学名:Scientific name','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['WaterParameter']=['id:UUID:PK:水質パラメータID:Water parameter ID','tank_id:UUID:FK:水槽ID:Tank ID','param_name:VARCHAR(100):NOT NULL:パラメータ名:Parameter name','threshold_min:DECIMAL(10,4)::下限閾値:Min threshold','threshold_max:DECIMAL(10,4)::上限閾値:Max threshold','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['FeedingEvent']=['id:UUID:PK:給餌イベントID:Feeding event ID','tank_id:UUID:FK:水槽ID:Tank ID','fed_at:TIMESTAMP:NOT NULL:給餌日時:Fed at','amount_kg:DECIMAL(8,3)::給餌量(kg):Amount (kg)','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['YieldRecord']=['id:UUID:PK:収量記録ID:Yield record ID','tank_id:UUID:FK:水槽ID:Tank ID','period_end:DATE:NOT NULL:集計日:Period end','yield_kg:DECIMAL(10,2)::収量(kg):Yield (kg)','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['PatientImaging']=['id:UUID:PK:患者画像ID:Patient imaging ID','patient_id:UUID:FK:患者ID:Patient ID','modality:VARCHAR(50):NOT NULL:モダリティ:Modality','acquired_at:TIMESTAMP::撮影日時:Acquired at','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['ScanSession']=['id:UUID:PK:スキャンセッションID:Scan session ID','patient_id:UUID:FK:患者ID:Patient ID','scan_type:VARCHAR(100):NOT NULL:スキャン種別:Scan type','scan_date:DATE:NOT NULL:スキャン日:Scan date','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['AiDiagnosis']=['id:UUID:PK:AI診断ID:AI diagnosis ID','study_id:UUID:FK:検査ID:Study ID','ai_model:VARCHAR(200)::AIモデル:AI model','diagnosis:TEXT::診断内容:Diagnosis','confidence:DECIMAL(5,4)::信頼スコア:Confidence','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['RadiologyReport']=['id:UUID:PK:放射線科レポートID:Radiology report ID','study_id:UUID:FK:検査ID:Study ID','findings:TEXT::所見:Findings','impression:TEXT::印象:Impression','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['FollowUpPlan']=['id:UUID:PK:フォローアップ計画ID:Follow-up plan ID','study_id:UUID:FK:検査ID:Study ID','recommendation:TEXT::推奨事項:Recommendation','next_scan_date:DATE::次回検査日:Next scan date','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['SpecialNeedsProfile']=['id:UUID:PK:特別支援プロファイルID:Special needs profile ID','student_id:UUID:FK:生徒ID:Student ID','diagnosis_code:VARCHAR(100)::診断コード:Diagnosis code','characteristics:TEXT::特性:Characteristics','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['SupportPlan']=['id:UUID:PK:支援計画ID:Support plan ID','student_id:UUID:FK:生徒ID:Student ID','plan_year:VARCHAR(20):NOT NULL:年度:Plan year','goals:TEXT::目標:Goals','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['AccessibilityTool']=['id:UUID:PK:支援ツールID:Accessibility tool ID','tool_name:VARCHAR(200):NOT NULL:ツール名:Tool name','tool_type:VARCHAR(100)::種別:Type','description:TEXT::説明:Description','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['InclusiveActivity']=['id:UUID:PK:インクルーシブ活動ID:Inclusive activity ID','iep_id:UUID:FK:IEP ID:IEP ID','activity_name:VARCHAR(300):NOT NULL:活動名:Activity name','activity_date:DATE:NOT NULL:実施日:Activity date','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['LearnerProgress']=['id:UUID:PK:学習進捗ID:Learner progress ID','student_id:UUID:FK:生徒ID:Student ID','evaluated_at:DATE:NOT NULL:評価日:Evaluated at','domain:VARCHAR(100)::領域:Domain','score:INTEGER::スコア:Score','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['InteriorDesignProject']=['id:UUID:PK:プロジェクトID:Project ID','client_name:VARCHAR(200):NOT NULL:クライアント名:Client name','project_type:VARCHAR(100)::プロジェクト種別:Project type','area_sqm:DECIMAL(8,2)::面積(㎡):Area (sqm)','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['SpaceLayout']=['id:UUID:PK:レイアウトID:Layout ID','project_id:UUID:FK:プロジェクトID:Project ID','layout_version:INTEGER::バージョン:Version','floor_plan_url:TEXT::間取り図URL:Floor plan URL','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['MaterialSwatch']=['id:UUID:PK:スウォッチID:Swatch ID','name:VARCHAR(200):NOT NULL:素材名:Material name','category:VARCHAR(100)::カテゴリ:Category','color:VARCHAR(100)::カラー:Color','texture_url:TEXT::テクスチャURL:Texture URL','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['ClientPresentation']=['id:UUID:PK:提案書ID:Presentation ID','project_id:UUID:FK:プロジェクトID:Project ID','title:VARCHAR(300):NOT NULL:タイトル:Title','pdf_url:TEXT::PDFパス:PDF URL','sent_at:TIMESTAMP::送付日時:Sent at','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['CostProject']=['id:UUID:PK:プロジェクトID:Project ID','project_name:VARCHAR(300):NOT NULL:工事名:Project name','client:VARCHAR(200)::発注者:Client','total_estimate:DECIMAL(16,2)::概算総額:Total estimate','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['QuantityItem']=['id:UUID:PK:数量項目ID:Quantity item ID','project_id:UUID:FK:プロジェクトID:Project ID','item_name:VARCHAR(300):NOT NULL:工種名:Item name','quantity:DECIMAL(12,3)::数量:Quantity','unit:VARCHAR(30)::単位:Unit','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['UnitPriceDB']=['id:UUID:PK:単価DB ID:Unit price DB ID','item_code:VARCHAR(100):NOT NULL:コード:Item code','item_name:VARCHAR(300):NOT NULL:工種名:Item name','unit_price:DECIMAL(12,2):NOT NULL:単価:Unit price','valid_from:DATE::有効開始日:Valid from','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['EstimateSheet']=['id:UUID:PK:積算書ID:Estimate sheet ID','project_id:UUID:FK:プロジェクトID:Project ID','total_amount:DECIMAL(16,2)::合計金額:Total amount','revision:INTEGER::改定回数:Revision','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['MatchSession']=['id:UUID:PK:試合セッションID:Match session ID','tournament_name:VARCHAR(200):NOT NULL:大会名:Tournament name','sport_type:VARCHAR(100):NOT NULL:競技種別:Sport type','match_date:TIMESTAMP:NOT NULL:試合日時:Match date','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['EventTimestamp']=['id:UUID:PK:イベントタイムスタンプID:Event timestamp ID','match_id:UUID:FK:試合ID:Match ID','event_type:VARCHAR(100):NOT NULL:イベント種別:Event type','occurred_at:TIMESTAMP:NOT NULL:発生日時:Occurred at','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['RulingLog']=['id:UUID:PK:判定ログID:Ruling log ID','match_id:UUID:FK:試合ID:Match ID','ruling_type:VARCHAR(100):NOT NULL:判定種別:Ruling type','decision:VARCHAR(200):NOT NULL:判定内容:Decision','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['VideoFlag']=['id:UUID:PK:映像フラグID:Video flag ID','match_id:UUID:FK:試合ID:Match ID','flagged_at:TIMESTAMP:NOT NULL:フラグ日時:Flagged at','reason:TEXT::理由:Reason','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['PerformanceMetric']=['id:UUID:PK:指標ID:Metric ID','match_id:UUID:FK:試合ID:Match ID','referee_id:UUID:FK:審判ID:Referee ID','accuracy_pct:DECIMAL(5,2)::正確性(%):Accuracy (%)','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['IcsrReport']=['id:UUID:PK:ICSR ID:ICSR ID','icsr_no:VARCHAR(100):NOT NULL:ICSR番号:ICSR number','drug_name:VARCHAR(300):NOT NULL:医薬品名:Drug name','event_type:VARCHAR(300):NOT NULL:事象名:Event type','seriousness:VARCHAR(50)::重篤性:Seriousness','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['MedDraCode']=['id:UUID:PK:MedDRAコードID:MedDRA code ID','pt_code:VARCHAR(20):NOT NULL:PTコード:PT code','pt_name:VARCHAR(300):NOT NULL:PT名:PT name','llt_name:VARCHAR(300)::LLT名:LLT name','soc_name:VARCHAR(300)::SOC名:SOC name','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['SafetySignalDb']=['id:UUID:PK:シグナルDB ID:Signal DB ID','drug_name:VARCHAR(300):NOT NULL:医薬品名:Drug name','event_pt:VARCHAR(300):NOT NULL:事象PT:Event PT','ror:DECIMAL(10,4)::ROR:ROR','signal_date:DATE:NOT NULL:シグナル検出日:Signal date','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['CausalityAssessment']=['id:UUID:PK:因果関係評価ID:Causality assessment ID','icsr_id:UUID:FK:ICSR ID:ICSR ID','method:VARCHAR(100)::評価方法:Method','score:VARCHAR(100)::スコア:Score','conclusion:VARCHAR(200)::結論:Conclusion','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['RegulatoryDossier']=['id:UUID:PK:申請書類ID:Regulatory dossier ID','submission_type:VARCHAR(100):NOT NULL:申請種別:Submission type','authority:VARCHAR(200)::提出先当局:Authority','due_date:DATE::期限:Due date','submitted:BOOLEAN:DEFAULT FALSE:提出済:Submitted','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['WelfareUser']=['id:UUID:PK:利用者ID:Welfare user ID','full_name:VARCHAR(200):NOT NULL:氏名:Full name','disability_level:VARCHAR(100)::障害支援区分:Disability support level','care_level:VARCHAR(50)::要介護度:Care level','address:TEXT::住所:Address','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['EquipmentAssessment']=['id:UUID:PK:アセスメントID:Assessment ID','user_id:UUID:FK:利用者ID:User ID','assessed_at:DATE:NOT NULL:評価日:Assessed at','adl_score:INTEGER::ADLスコア:ADL score','recommended_equipment:TEXT::推奨用具:Recommended equipment','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['HousingModPlan']=['id:UUID:PK:住宅改修計画ID:Housing mod plan ID','user_id:UUID:FK:利用者ID:User ID','modification_type:VARCHAR(200):NOT NULL:改修種別:Modification type','estimated_cost:INTEGER::概算費用:Estimated cost','subsidy_amount:INTEGER::給付額:Subsidy amount','status:VARCHAR(50):DEFAULT \'planning\':ステータス:Status','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['SupportRecord']=['id:UUID:PK:支援記録ID:Support record ID','user_id:UUID:FK:利用者ID:User ID','support_date:DATE:NOT NULL:支援日:Support date','support_type:VARCHAR(200)::支援種別:Support type','notes:TEXT::記録内容:Notes','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
ENTITY_COLUMNS['CareProvider']=['id:UUID:PK:介護事業所ID:Care provider ID','name:VARCHAR(300):NOT NULL:事業所名:Provider name','service_type:VARCHAR(200)::サービス種別:Service type','license_no:VARCHAR(100)::指定番号:License number','address:TEXT::住所:Address','created_at:TIMESTAMP:NOT NULL DEFAULT NOW():作成日時:Created at'];
