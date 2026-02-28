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
