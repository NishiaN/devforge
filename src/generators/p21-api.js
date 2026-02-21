// P21: API Intelligence
// Generates: docs/83_api_design_principles.md, 84_openapi_specification.md,
//            85_api_security_checklist.md, 86_api_testing_strategy.md

// ============================================================================
// DATA CONSTANTS
// ============================================================================

var API_REST_PRINCIPLES=[
  {id:'resource_naming',ja:'リソース命名',en:'Resource Naming',
   ja_desc:'名詞・複数形・小文字ケバブケースを使用',en_desc:'Use nouns, plural, lowercase kebab-case',
   ja_ex:'GET /users, GET /user-profiles',en_ex:'GET /users, GET /user-profiles'},
  {id:'http_methods',ja:'HTTPメソッド',en:'HTTP Methods',
   ja_desc:'GET(読取)・POST(作成)・PUT(完全更新)・PATCH(部分更新)・DELETE(削除)',en_desc:'GET(read), POST(create), PUT(full-update), PATCH(partial-update), DELETE(delete)',
   ja_ex:'PATCH /users/123 (部分更新)',en_ex:'PATCH /users/123 (partial update)'},
  {id:'status_codes',ja:'HTTPステータスコード',en:'HTTP Status Codes',
   ja_desc:'200 OK・201 Created・204 No Content・400 Bad Request・401 Unauthorized・403 Forbidden・404 Not Found・409 Conflict・422 Unprocessable・429 Too Many Requests・500 Internal Server Error',
   en_desc:'200 OK・201 Created・204 No Content・400 Bad Request・401 Unauthorized・403 Forbidden・404 Not Found・409 Conflict・422 Unprocessable・429 Too Many Requests・500 Internal Server Error',
   ja_ex:'POST /sessions → 201, DELETE /items/99 (not found) → 404',
   en_ex:'POST /sessions → 201, DELETE /items/99 (not found) → 404'},
  {id:'versioning',ja:'バージョニング',en:'Versioning',
   ja_desc:'URLパス (/v1/) または Acceptヘッダー (application/vnd.api+json;version=1)',en_desc:'URL path (/v1/) or Accept header (application/vnd.api+json;version=1)',
   ja_ex:'GET /v1/users, GET /v2/users',en_ex:'GET /v1/users, GET /v2/users'},
  {id:'pagination',ja:'ページネーション',en:'Pagination',
   ja_desc:'カーソルベース (大規模データ推奨) またはオフセットベース',en_desc:'Cursor-based (recommended for large datasets) or offset-based',
   ja_ex:'GET /users?cursor=xxx&limit=20',en_ex:'GET /users?cursor=xxx&limit=20'},
  {id:'error_format',ja:'エラーレスポンス形式',en:'Error Response Format',
   ja_desc:'RFC 7807 (Problem Details) 準拠: type・title・status・detail・instance',en_desc:'RFC 7807 (Problem Details): type, title, status, detail, instance',
   ja_ex:'{"type":"/errors/not-found","title":"Not Found","status":404}',
   en_ex:'{"type":"/errors/not-found","title":"Not Found","status":404}'},
];

var API_SECURITY_ITEMS=[
  {id:'authn',lv:'critical',
   ja:'認証: JWTトークン検証 (署名・有効期限・claims)',en:'Authentication: JWT token validation (signature, expiry, claims)',
   ja_fix:'jose ライブラリで jwtVerify(); audience + issuer クレーム必須',en_fix:'Use jose jwtVerify(); require audience + issuer claims'},
  {id:'authz',lv:'critical',
   ja:'認可: エンドポイントごとにロール/スコープ検証',en:'Authorization: Verify role/scope per endpoint',
   ja_fix:'ミドルウェア/ガード でリソースオーナーシップを検証',en_fix:'Middleware/guard to verify resource ownership'},
  {id:'input_val',lv:'critical',
   ja:'入力検証: 全リクエストボディ・クエリパラメータをスキーマ検証',en:'Input validation: Schema-validate all request bodies & query params',
   ja_fix:'Zod / Yup / Pydantic でバリデーション',en_fix:'Use Zod / Yup / Pydantic for validation'},
  {id:'sql_inj',lv:'critical',
   ja:'SQLインジェクション: パラメータ化クエリ・ORMのみ使用',en:'SQL Injection: Use parameterized queries and ORM only',
   ja_fix:'生のSQL文字列連結を絶対に使用しない',en_fix:'Never concatenate raw SQL strings'},
  {id:'rate_limit',lv:'high',
   ja:'レートリミット: エンドポイント別・ユーザー別の制限',en:'Rate Limiting: Per-endpoint and per-user limits',
   ja_fix:'express-rate-limit / slowapi (Python) / nginx limit_req_zone',en_fix:'express-rate-limit / slowapi (Python) / nginx limit_req_zone'},
  {id:'cors',lv:'high',
   ja:'CORS: 許可オリジンを厳密に制限',en:'CORS: Restrict allowed origins strictly',
   ja_fix:'ワイルドカード (*) 禁止; ALLOWED_ORIGINS 環境変数で管理',en_fix:'No wildcard (*); manage via ALLOWED_ORIGINS env var'},
  {id:'https',lv:'high',
   ja:'HTTPS強制: HTTP→HTTPSリダイレクト・HSTS設定',en:'HTTPS enforcement: HTTP→HTTPS redirect + HSTS',
   ja_fix:'Strict-Transport-Security: max-age=31536000; includeSubDomains',en_fix:'Strict-Transport-Security: max-age=31536000; includeSubDomains'},
  {id:'secrets',lv:'high',
   ja:'シークレット管理: 環境変数・シークレットマネージャー使用',en:'Secret management: Use env vars and secret manager',
   ja_fix:'コードにシークレットをハードコードしない; .env は .gitignore に追加',en_fix:'Never hardcode secrets; add .env to .gitignore'},
  {id:'logging',lv:'medium',
   ja:'APIアクセスログ: 認証失敗・異常リクエストを記録',en:'API access logging: Record auth failures and anomalous requests',
   ja_fix:'構造化ログ (JSON) + 機密情報はログに含めない',en_fix:'Structured logs (JSON) + never log sensitive data'},
  {id:'idempotency',lv:'medium',
   ja:'冪等性: POST操作に Idempotency-Key ヘッダー対応',en:'Idempotency: Support Idempotency-Key header for POST ops',
   ja_fix:'決済・注文等の重要操作でキーを保存して重複実行を防ぐ',en_fix:'Store key for critical ops (payment, order) to prevent duplicate execution'},
];

var API_TEST_TYPES=[
  {id:'unit',ja:'ユニットテスト',en:'Unit Tests',
   ja_desc:'個別のルートハンドラ・サービス関数を単独テスト',en_desc:'Test individual route handlers and service functions in isolation',
   tools:'vitest / jest (Node) | pytest (Python)',
   ja_when:'全ビジネスロジック関数',en_when:'All business logic functions',coverage:'80%+'},
  {id:'integration',ja:'統合テスト',en:'Integration Tests',
   ja_desc:'実際のDBに接続してエンドポイントをテスト',en_desc:'Test endpoints against real DB connection',
   tools:'supertest (Express) | httpx + TestClient (FastAPI) | jest',
   ja_when:'全CRUDエンドポイント',en_when:'All CRUD endpoints',coverage:'70%+'},
  {id:'contract',ja:'コントラクトテスト',en:'Contract Tests',
   ja_desc:'OpenAPI仕様とレスポンスの整合性を自動検証',en_desc:'Auto-verify response conformance to OpenAPI spec',
   tools:'dredd | schemathesis (Python) | openapi-backend',
   ja_when:'外部クライアントが存在する場合',en_when:'When external clients exist',coverage:'全エンドポイント/All endpoints'},
  {id:'e2e',ja:'E2Eテスト',en:'E2E Tests',
   ja_desc:'フロントエンドからAPIまでの完全なユーザーフローをテスト',en_desc:'Test complete user flows from frontend through API',
   tools:'playwright | cypress',
   ja_when:'主要ユーザーフロー',en_when:'Critical user flows',coverage:'主要フロー/Critical flows'},
  {id:'load',ja:'負荷テスト',en:'Load Tests',
   ja_desc:'想定トラフィック×10倍でのスループット・レイテンシ確認',en_desc:'Verify throughput & latency under 10x expected traffic',
   tools:'k6 | Artillery | Locust (Python)',
   ja_when:'本番リリース前',en_when:'Before production release',coverage:'全主要エンドポイント/All major endpoints'},
];

// ============================================================================
// GENERATOR FUNCTIONS
// ============================================================================

function genPillar21_APIIntelligence(a,pn){
  const G=S.genLang==='ja';
  gen83(a,pn,G);
  gen84(a,pn,G);
  gen85(a,pn,G);
  gen86(a,pn,G);
}

// doc 83: API Design Principles
function gen83(a,pn,G){
  const be=a.backend||'';
  const fe=a.frontend||'';
  const isGraphQL=/GraphQL/i.test(be)||/GraphQL/i.test(fe);
  const isGRPC=/gRPC/i.test(be);
  const isPython=/Python|Django|FastAPI/i.test(be);
  const isBaaS=/Supabase|Firebase|Convex/i.test(be);

  var doc='';
  doc+='# '+(G?'APIデザイン原則':'API Design Principles')+'\n\n';
  doc+=(G
    ?'> **プロジェクト**: '+pn+' | **バックエンド**: '+be+' | **生成日**: '+new Date().toISOString().slice(0,10)+'\n\n'
    :'> **Project**: '+pn+' | **Backend**: '+be+' | **Generated**: '+new Date().toISOString().slice(0,10)+'\n\n'
  );

  // API Style
  if(isBaaS){
    doc+='## '+(G?'APIスタイル: BaaS クライアント SDK':'API Style: BaaS Client SDK')+'\n\n';
    doc+=(G
      ?'このプロジェクトは **'+be+'** を使用します。\n独自REST APIではなくBaaSクライアントSDKを介してデータ操作を行います。\n\n'
      :'This project uses **'+be+'**.\nData operations are performed via the BaaS client SDK rather than custom REST endpoints.\n\n'
    );
    doc+='```typescript\n';
    if(/Supabase/i.test(be)){
      doc+='// Supabase client — Row Level Security (RLS) enforced server-side\n';
      doc+='const { data, error } = await supabase\n';
      doc+='  .from(\'users\')\n';
      doc+='  .select(\'*\')\n';
      doc+='  .eq(\'id\', userId);\n';
    } else if(/Firebase/i.test(be)){
      doc+='// Firestore — Security Rules enforced server-side\n';
      doc+='const snap = await db.collection(\'users\').doc(userId).get();\n';
      doc+='const data = snap.data();\n';
    } else {
      doc+='// Convex client\n';
      doc+='const result = await convex.query(api.users.getUser, { userId });\n';
    }
    doc+='```\n\n';
    doc+='> '+(G?'カスタムAPIが必要な場合は Edge Functions / Cloud Functions を使用してください。':'Use Edge Functions / Cloud Functions for custom API logic.')+'\n\n';
  } else if(isGraphQL){
    doc+='## '+(G?'APIスタイル: GraphQL':'API Style: GraphQL')+'\n\n';
    doc+=(G
      ?'このプロジェクトは **GraphQL** を採用します。\n\n'
      :'This project adopts **GraphQL**.\n\n'
    );
    doc+='### '+(G?'GraphQL設計原則':'GraphQL Design Principles')+'\n\n';
    doc+='| '+(G?'原則':'Principle')+' | '+(G?'内容':'Description')+' | '+(G?'理由':'Why')+' |\n';
    doc+='|-------|---------|------|\n';
    doc+='| Schema First | '+(G?'スキーマ定義から実装':'Schema-first approach')+'  | '+(G?'FE/BE並行開発':'Parallel FE/BE dev')+' |\n';
    doc+='| Cursor Pagination | '+(G?'カーソルベースのページング':'Cursor-based pagination')+' | '+(G?'大規模データ対応':'Handles large datasets')+' |\n';
    doc+='| DataLoader | '+(G?'N+1クエリ防止':'Prevent N+1 queries')+' | '+(G?'パフォーマンス':'Performance')+' |\n';
    doc+='| Persisted Queries | '+(G?'クエリのホワイトリスト化':'Query whitelisting')+' | '+(G?'セキュリティ':'Security')+' |\n';
    doc+='| Depth Limit | '+(G?'クエリ深度を最大5に制限':'Limit query depth to 5')+' | '+(G?'DoS対策':'DoS prevention')+' |\n';
    doc+='\n';
    doc+='```graphql\n# Schema example\ntype Query {\n  user(id: ID!): User\n  users(first: Int, after: String): UserConnection!\n}\n\ntype UserConnection {\n  edges: [UserEdge!]!\n  pageInfo: PageInfo!\n}\n```\n\n';
  } else if(isGRPC){
    doc+='## '+(G?'APIスタイル: gRPC':'API Style: gRPC')+'\n\n';
    doc+='```protobuf\n// Proto definition example\nsyntax = "proto3";\n\nservice UserService {\n  rpc GetUser (GetUserRequest) returns (User);\n  rpc ListUsers (ListUsersRequest) returns (stream User);\n}\n\nmessage GetUserRequest {\n  string id = 1;\n}\n```\n\n';
  } else {
    // REST
    doc+='## '+(G?'APIスタイル: RESTful':'API Style: RESTful')+'\n\n';
    doc+=(G
      ?'このプロジェクトは **RESTful API** を採用します。以下の原則に従ってください。\n\n'
      :'This project adopts **RESTful API**. Follow the principles below.\n\n'
    );
    doc+='### '+(G?'基本原則':'Core Principles')+'\n\n';
    doc+='| # | '+(G?'原則':'Principle')+' | '+(G?'説明':'Description')+' | '+(G?'例':'Example')+' |\n';
    doc+='|---|-------|---------|------|\n';
    API_REST_PRINCIPLES.forEach(function(p,i){
      doc+='| '+(i+1)+' | **'+(G?p.ja:p.en)+'** | '+(G?p.ja_desc:p.en_desc)+' | `'+(G?p.ja_ex:p.en_ex)+'` |\n';
    });
    doc+='\n';

    // Pagination pattern
    doc+='### '+(G?'ページネーションレスポンス':'Pagination Response')+'\n\n';
    doc+='```json\n{\n  "data": [...],\n  "pagination": {\n    "cursor": "eyJpZCI6MTAwfQ==",\n    "hasNextPage": true,\n    "total": 1500\n  }\n}\n```\n\n';

    // Error format
    doc+='### '+(G?'エラーレスポンス (RFC 7807)':'Error Response (RFC 7807)')+'\n\n';
    doc+='```json\n{\n  "type": "https://'+pn.toLowerCase().replace(/\s+/g,'-')+'.example.com/errors/not-found",\n  "title": "'+(G?'リソースが見つかりません':'Not Found')+'",\n  "status": 404,\n  "detail": "'+(G?'指定されたユーザーが存在しません':'The specified user does not exist')+'",\n  "instance": "/users/123"\n}\n```\n\n';
  }

  // URL Conventions
  if(!isBaaS&&!isGRPC){
    doc+='## '+(G?'URL設計規約':'URL Design Conventions')+'\n\n';
    doc+='```\n';
    doc+=(G?'# リソースコレクション\n':'# Resource collections\n');
    doc+='GET    /api/v1/users           '+(G?'# 一覧取得':'# List')+'\n';
    doc+='POST   /api/v1/users           '+(G?'# 新規作成':'# Create')+'\n';
    doc+='GET    /api/v1/users/:id       '+(G?'# 個別取得':'# Get by ID')+'\n';
    doc+='PATCH  /api/v1/users/:id       '+(G?'# 部分更新':'# Partial update')+'\n';
    doc+='DELETE /api/v1/users/:id       '+(G?'# 削除 (ソフト)':'# Delete (soft)')+'\n';
    doc+='\n';
    doc+=(G?'# ネストしたリソース\n':'# Nested resources\n');
    doc+='GET    /api/v1/users/:id/posts '+(G?'# 特定ユーザーの投稿':'# Posts for a user')+'\n';
    doc+='\n';
    doc+=(G?'# アクション (動詞が必要な場合)\n':'# Actions (when verb is needed)\n');
    doc+='POST   /api/v1/users/:id/activate\n';
    doc+='POST   /api/v1/sessions        '+(G?'# ログイン':'# Login')+'\n';
    doc+='DELETE /api/v1/sessions/current '+(G?'# ログアウト':'# Logout')+'\n';
    doc+='```\n\n';
  }

  // Backend-specific notes
  if(isPython){
    doc+='## '+(G?'FastAPI 実装パターン':'FastAPI Implementation Patterns')+'\n\n';
    doc+='```python\n';
    doc+='from fastapi import APIRouter, Depends, HTTPException, status\n';
    doc+='from app.schemas import UserCreate, UserResponse, PaginatedResponse\n';
    doc+='from app.dependencies import get_current_user, get_db\n\n';
    doc+='router = APIRouter(prefix="/v1/users", tags=["users"])\n\n';
    doc+='@router.get("/", response_model=PaginatedResponse[UserResponse])\n';
    doc+='async def list_users(\n';
    doc+='    cursor: str | None = None,\n';
    doc+='    limit: int = 20,\n';
    doc+='    db: AsyncSession = Depends(get_db),\n';
    doc+='    _: User = Depends(get_current_user),  # auth guard\n';
    doc+=') -> PaginatedResponse[UserResponse]:\n';
    doc+='    ...\n\n';
    doc+='@router.get("/{user_id}", response_model=UserResponse)\n';
    doc+='async def get_user(user_id: UUID, db: AsyncSession = Depends(get_db)) -> UserResponse:\n';
    doc+='    user = await db.get(User, user_id)\n';
    doc+='    if not user or user.deleted_at:\n';
    doc+='        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)\n';
    doc+='    return user\n';
    doc+='```\n\n';
  } else if(/Express|NestJS|Node/i.test(be)){
    doc+='## '+(G?''+(be.includes('Nest')?'NestJS':'Express')+' 実装パターン':''+( be.includes('Nest')?'NestJS':'Express')+' Implementation Patterns')+'\n\n';
    if(/NestJS/i.test(be)){
      doc+='```typescript\n// NestJS controller pattern\n@Controller(\'v1/users\')\nexport class UsersController {\n  constructor(private readonly usersService: UsersService) {}\n\n  @Get()\n  @UseGuards(JwtAuthGuard)\n  findAll(@Query() query: PaginateDto): Promise<PaginatedResult<UserDto>> {\n    return this.usersService.findAll(query);\n  }\n\n  @Get(\':id\')\n  @UseGuards(JwtAuthGuard)\n  findOne(@Param(\'id\', ParseUUIDPipe) id: string): Promise<UserDto> {\n    return this.usersService.findOneOrThrow(id);\n  }\n}\n```\n\n';
    } else {
      doc+='```typescript\n// Express router pattern\nimport { Router } from \'express\';\nimport { requireAuth } from \'../middleware/auth\';\nimport { validate } from \'../middleware/validate\';\n\nconst router = Router();\n\nrouter.get(\'/v1/users\', requireAuth, async (req, res, next) => {\n  try {\n    const users = await userService.findAll(req.query);\n    res.json(users);\n  } catch (err) { next(err); }\n});\n```\n\n';
    }
  }

  doc+='## '+(G?'APIバージョニング戦略':'API Versioning Strategy')+'\n\n';
  doc+='| '+(G?'手法':'Method')+' | '+(G?'例':'Example')+' | '+(G?'採用':'Adopted')+' | '+(G?'理由':'Reason')+' |\n';
  doc+='|-------|------|------|------|\n';
  doc+='| URL Path | `/v1/users` | ✅ | '+(G?'明確・キャッシュ対応':'Clear, cache-friendly')+' |\n';
  doc+='| Header | `Accept: application/vnd.api+json;v=1` | - | '+(G?'URLがクリーン':'Cleaner URL')+' |\n';
  doc+='| Query | `/users?version=1` | ❌ | '+(G?'避けること':'Avoid')+' |\n';
  doc+='\n';
  doc+=(G
    ?'**廃止ポリシー**: v1 廃止前に最低6ヶ月の移行期間を設ける。`Deprecation` ヘッダーで通知。\n\n'
    :'**Deprecation Policy**: Provide minimum 6-month migration period before deprecating v1. Notify via `Deprecation` header.\n\n'
  );

  doc+='---\n*'+(G?'DevForge v9 自動生成':'Generated by DevForge v9')+'*\n';
  S.files['docs/83_api_design_principles.md']=doc;
}

// doc 84: OpenAPI Specification
function gen84(a,pn,G){
  const be=a.backend||'';
  const entities=(a.entities||'User, Post').split(',').map(function(e){return e.trim();}).filter(Boolean);
  const hasAuth=!/なし|None|public/i.test(a.auth||'JWT');
  const isPython=/Python|Django|FastAPI/i.test(be);
  const isBaaS=/Supabase|Firebase|Convex/i.test(be);

  var doc='';
  doc+='# '+(G?'OpenAPI仕様書テンプレート':'OpenAPI Specification Template')+'\n\n';
  doc+=(G
    ?'> このファイルはOpenAPI 3.1仕様のテンプレートです。実装に合わせて拡張してください。\n\n'
    :'> This file is an OpenAPI 3.1 specification template. Extend it to match your implementation.\n\n'
  );

  if(isBaaS){
    doc+=(G
      ?'> **注意**: このプロジェクトは **'+be+'** を使用するためカスタムREST APIは最小限です。\n> Edge Functions/Cloud Functions で独自エンドポイントを追加した場合のみ、以下のテンプレートを使用してください。\n\n'
      :'> **Note**: This project uses **'+be+'**, so custom REST API is minimal.\n> Use the template below only for custom Edge Functions / Cloud Functions endpoints.\n\n'
    );
  }

  doc+='## '+(G?'openapi.yaml テンプレート':'openapi.yaml Template')+'\n\n';
  doc+='```yaml\nopenapi: "3.1.0"\ninfo:\n';
  doc+='  title: "'+pn+' API"\n';
  doc+='  version: "1.0.0"\n';
  doc+='  description: "'+( G?'自動生成OpenAPI仕様':'Auto-generated OpenAPI spec')+'"\n';
  doc+='  contact:\n    email: "dev@example.com"\n\n';
  doc+='servers:\n';
  doc+='  - url: "https://api.example.com/v1"\n    description: "'+(G?'本番':'Production')+'"\n';
  doc+='  - url: "http://localhost:'+(isPython?'8000':'3000')+'/v1"\n    description: "'+(G?'ローカル開発':'Local development')+'"\n\n';

  if(hasAuth){
    doc+='components:\n  securitySchemes:\n    BearerAuth:\n      type: http\n      scheme: bearer\n      bearerFormat: JWT\n\nsecurity:\n  - BearerAuth: []\n\n';
  }

  doc+='  schemas:\n';
  doc+='    PaginationMeta:\n      type: object\n      properties:\n        cursor:\n          type: string\n          nullable: true\n        hasNextPage:\n          type: boolean\n        total:\n          type: integer\n\n';
  doc+='    ErrorResponse:\n      type: object\n      required: [type, title, status]\n      properties:\n        type:\n          type: string\n          format: uri\n        title:\n          type: string\n        status:\n          type: integer\n        detail:\n          type: string\n        instance:\n          type: string\n\n';

  // Generate schemas for top 3 entities
  entities.slice(0,3).forEach(function(ent){
    const entLower=ent.toLowerCase();
    doc+='    '+ent+':\n      type: object\n      properties:\n        id:\n          type: string\n          format: uuid\n        created_at:\n          type: string\n          format: date-time\n        updated_at:\n          type: string\n          format: date-time\n      # TODO: '+(G?'エンティティ固有フィールドを追加':'Add entity-specific fields')+'\n\n';
    doc+='    '+ent+'Create:\n      type: object\n      required: []  # TODO: '+(G?'必須フィールドを指定':'Specify required fields')+'\n      # TODO: '+(G?'作成時フィールドを追加':'Add creation fields')+'\n\n';
  });

  doc+='paths:\n';
  // Generate paths for top 2 entities
  entities.slice(0,2).forEach(function(ent){
    const entLower=ent.toLowerCase()+'s';
    doc+='  /' +entLower+':\n';
    doc+='    get:\n      summary: "'+ent+' '+(G?'一覧':'List')+'"\n      tags: ["'+ent+'"]\n';
    if(hasAuth) doc+='      security:\n        - BearerAuth: []\n';
    doc+='      parameters:\n        - name: cursor\n          in: query\n          schema: {type: string}\n        - name: limit\n          in: query\n          schema: {type: integer, default: 20, maximum: 100}\n';
    doc+='      responses:\n        "200":\n          description: "'+(G?'成功':'Success')+'"\n          content:\n            application/json:\n              schema:\n                type: object\n                properties:\n                  data:\n                    type: array\n                    items:\n                      $ref: "#/components/schemas/'+ent+'"\n                  pagination:\n                    $ref: "#/components/schemas/PaginationMeta"\n        "401":\n          description: "'+(G?'認証エラー':'Unauthorized')+'"\n          content:\n            application/json:\n              schema:\n                $ref: "#/components/schemas/ErrorResponse"\n\n';
    doc+='    post:\n      summary: "'+ent+' '+(G?'作成':'Create')+'"\n      tags: ["'+ent+'"]\n';
    if(hasAuth) doc+='      security:\n        - BearerAuth: []\n';
    doc+='      requestBody:\n        required: true\n        content:\n          application/json:\n            schema:\n              $ref: "#/components/schemas/'+ent+'Create"\n';
    doc+='      responses:\n        "201":\n          description: "'+(G?'作成成功':'Created')+'"\n          content:\n            application/json:\n              schema:\n                $ref: "#/components/schemas/'+ent+'"\n        "422":\n          description: "'+(G?'バリデーションエラー':'Validation Error')+'"\n          content:\n            application/json:\n              schema:\n                $ref: "#/components/schemas/ErrorResponse"\n\n';
    doc+='  /'+entLower+'/{id}:\n';
    doc+='    parameters:\n      - name: id\n        in: path\n        required: true\n        schema: {type: string, format: uuid}\n';
    doc+='    get:\n      summary: "'+ent+' '+(G?'取得':'Get')+'"\n      tags: ["'+ent+'"]\n';
    doc+='      responses:\n        "200":\n          description: "'+(G?'成功':'Success')+'"\n          content:\n            application/json:\n              schema:\n                $ref: "#/components/schemas/'+ent+'"\n        "404":\n          description: "'+(G?'未検出':'Not Found')+'"\n          content:\n            application/json:\n              schema:\n                $ref: "#/components/schemas/ErrorResponse"\n\n';
    doc+='    patch:\n      summary: "'+ent+' '+(G?'更新':'Update')+'"\n      tags: ["'+ent+'"]\n';
    doc+='      requestBody:\n        content:\n          application/json:\n            schema: {}\n';
    doc+='      responses:\n        "200":\n          description: "'+(G?'成功':'Success')+'"\n        "404":\n          description: "'+(G?'未検出':'Not Found')+'"\n\n';
    doc+='    delete:\n      summary: "'+ent+' '+(G?'削除':'Delete')+'"\n      tags: ["'+ent+'"]\n';
    doc+='      responses:\n        "204":\n          description: "'+(G?'削除成功':'Deleted')+'"\n        "404":\n          description: "'+(G?'未検出':'Not Found')+'"\n```\n\n';
  });

  doc+='## '+(G?'ツールチェーン':'Toolchain')+'\n\n';
  doc+='| '+(G?'用途':'Purpose')+' | '+(G?'ツール':'Tool')+' | '+(G?'設定':'Config')+' |\n';
  doc+='|------|------|------|\n';
  doc+='| '+(G?'仕様バリデーション':'Spec validation')+' | `redocly lint openapi.yaml` | `.redocly.yaml` |\n';
  doc+='| '+(G?'UI':'UI')+' | `scalar` / `swagger-ui` | `GET /docs` |\n';
  doc+='| '+(G?'モックサーバー':'Mock server')+' | `prism mock openapi.yaml` | `port 4010` |\n';
  doc+='| '+(G?'コード生成 (TS)':'Code gen (TS)')+' | `openapi-typescript openapi.yaml` | `types/api.ts` |\n';
  if(isPython){
    doc+='| '+(G?'FastAPI自動生成':'FastAPI auto-gen')+' | FastAPI `/docs` (built-in) | `app.include_router(...)` |\n';
  }
  doc+='\n';
  doc+='---\n*'+(G?'DevForge v9 自動生成':'Generated by DevForge v9')+'*\n';
  S.files['docs/84_openapi_specification.md']=doc;
}

// doc 85: API Security Checklist
function gen85(a,pn,G){
  const be=a.backend||'';
  const auth=a.auth||'';
  const hasPayment=/Stripe|決済|payment/i.test(a.payment||'');
  const isPython=/Python|Django|FastAPI/i.test(be);
  const isBaaS=/Supabase|Firebase|Convex/i.test(be);

  var doc='';
  doc+='# '+(G?'APIセキュリティチェックリスト':'API Security Checklist')+'\n\n';
  doc+=(G
    ?'> **プロジェクト**: '+pn+' | OWASP API Security Top 10 準拠\n\n'
    :'> **Project**: '+pn+' | OWASP API Security Top 10 compliant\n\n'
  );

  // Summary table
  const criticalCount=API_SECURITY_ITEMS.filter(function(i){return i.lv==='critical';}).length;
  const highCount=API_SECURITY_ITEMS.filter(function(i){return i.lv==='high';}).length;
  const medCount=API_SECURITY_ITEMS.filter(function(i){return i.lv==='medium';}).length;
  doc+='## '+(G?'チェック項目サマリー':'Checklist Summary')+'\n\n';
  doc+='| '+(G?'重要度':'Severity')+' | '+(G?'件数':'Count')+' | '+(G?'対応状況':'Status')+' |\n';
  doc+='|------|------|------|\n';
  doc+='| 🔴 CRITICAL | '+criticalCount+' | [ ] '+(G?'要対応':'Required')+' |\n';
  doc+='| 🟠 HIGH | '+highCount+' | [ ] '+(G?'推奨':'Recommended')+' |\n';
  doc+='| 🟡 MEDIUM | '+medCount+' | [ ] '+(G?'対応推奨':'Suggested')+' |\n';
  doc+='\n';

  // Full checklist
  doc+='## '+(G?'詳細チェックリスト':'Detailed Checklist')+'\n\n';

  var currentLv='';
  API_SECURITY_ITEMS.forEach(function(item){
    if(item.lv!==currentLv){
      currentLv=item.lv;
      if(item.lv==='critical') doc+='### 🔴 CRITICAL\n\n';
      else if(item.lv==='high') doc+='### 🟠 HIGH\n\n';
      else doc+='### 🟡 MEDIUM\n\n';
    }
    doc+='- [ ] **'+(G?item.ja:item.en)+'**\n';
    doc+='  - '+(G?'対応':'Fix')+': '+(G?item.ja_fix:item.en_fix)+'\n';
  });
  doc+='\n';

  // BaaS-specific
  if(isBaaS){
    doc+='### '+(G?'BaaS固有チェック ('+be+')':'BaaS-Specific Checks ('+be+')')+'\n\n';
    if(/Supabase/i.test(be)){
      doc+='- [ ] '+(G?'RLS (Row Level Security) が全テーブルで有効':'RLS (Row Level Security) enabled on all tables')+'\n';
      doc+='- [ ] '+(G?'公開テーブルが `anon` ロールで読み取り専用':'Public tables are read-only for `anon` role')+'\n';
      doc+='- [ ] '+(G?'Supabase API Key が環境変数で管理':'Supabase API Key managed via env vars')+'\n';
      doc+='- [ ] '+(G?'Service Role Key がサーバーサイドのみ使用':'Service Role Key used server-side only')+'\n';
    } else if(/Firebase/i.test(be)){
      doc+='- [ ] '+(G?'Firestore Security Rules が全コレクションで設定':'Firestore Security Rules configured for all collections')+'\n';
      doc+='- [ ] '+(G?'デフォルトルール (allow read, write: false) から変更':'Changed from default rules (allow read, write: false)')+'\n';
    }
    doc+='\n';
  }

  // Payment security
  if(hasPayment){
    doc+='### 💳 '+(G?'決済API固有チェック (Stripe)':'Payment API Checks (Stripe)')+'\n\n';
    doc+='- [ ] '+(G?'Webhook署名検証 (`stripe.webhooks.constructEvent`)':'Webhook signature verification (`stripe.webhooks.constructEvent`)')+'\n';
    doc+='- [ ] '+(G?'Stripe Secret Key が環境変数で管理 (コードに含めない)':'Stripe Secret Key via env var only (never in code)')+'\n';
    doc+='- [ ] '+(G?'Idempotency-Key をすべての決済APIコールに付与':'Idempotency-Key on all payment API calls')+'\n';
    doc+='- [ ] '+(G?'金額計算はサーバーサイドのみで実施':'Amount calculation done server-side only')+'\n\n';
  }

  // OWASP API Security Top 10
  doc+='## OWASP API Security Top 10 (2023)\n\n';
  doc+='| '+(G?'番号':'#')+' | '+(G?'リスク':'Risk')+' | '+(G?'対策':'Mitigation')+' |\n';
  doc+='|------|------|------|\n';
  const owaspItems=G?[
    ['API1:2023','オブジェクトレベル認可の不備','全エンドポイントでリソースオーナーシップを検証'],
    ['API2:2023','認証の不備','強力なJWT検証・リフレッシュトークンローテーション'],
    ['API3:2023','オブジェクトプロパティレベル認可の不備','レスポンスフィルタリングで内部フィールドを除外'],
    ['API4:2023','リソース消費の無制限','ページネーション上限・レートリミット設定'],
    ['API5:2023','機能レベル認可の不備','HTTPメソッドごとにロールチェック'],
    ['API6:2023','機密性の高いビジネスフローへの無制限アクセス','ボット対策・CAPTCHA・段階的スロットリング'],
    ['API7:2023','サーバーサイドリクエストフォージェリ','外部URL入力を検証・ホワイトリスト管理'],
    ['API8:2023','セキュリティの設定ミス','デフォルト認証情報変更・CORS厳格化'],
    ['API9:2023','インベントリ管理の不備','全エンドポイントをOpenAPIで文書化'],
    ['API10:2023','安全でない依存関係','npm audit / pip check を CI に統合']
  ]:[
    ['API1:2023','Broken Object Level Authorization','Verify resource ownership on every endpoint'],
    ['API2:2023','Broken Authentication','Strong JWT validation + refresh token rotation'],
    ['API3:2023','Broken Object Property Level Authorization','Filter response to exclude internal fields'],
    ['API4:2023','Unrestricted Resource Consumption','Pagination limits + rate limiting'],
    ['API5:2023','Broken Function Level Authorization','Role check per HTTP method'],
    ['API6:2023','Unrestricted Access to Sensitive Business Flows','Bot detection, CAPTCHA, progressive throttling'],
    ['API7:2023','Server Side Request Forgery','Validate + whitelist external URL inputs'],
    ['API8:2023','Security Misconfiguration','Change default creds, strict CORS'],
    ['API9:2023','Improper Inventory Management','Document all endpoints in OpenAPI'],
    ['API10:2023','Unsafe Consumption of APIs','Integrate npm audit / pip check in CI']
  ];
  owaspItems.forEach(function(item){
    doc+='| `'+item[0]+'` | '+item[1]+' | '+item[2]+' |\n';
  });
  doc+='\n';
  doc+='---\n*'+(G?'DevForge v9 自動生成':'Generated by DevForge v9')+'*\n';
  S.files['docs/85_api_security_checklist.md']=doc;
}

// doc 86: API Testing Strategy
function gen86(a,pn,G){
  const be=a.backend||'';
  const isPython=/Python|Django|FastAPI/i.test(be);
  const isBaaS=/Supabase|Firebase|Convex/i.test(be);
  const hasLoad=(a.mvp_features||'').toLowerCase().includes('load')||(a.mvp_features||'').toLowerCase().includes('負荷');

  var doc='';
  doc+='# '+(G?'APIテスト戦略':'API Testing Strategy')+'\n\n';
  doc+=(G
    ?'> **プロジェクト**: '+pn+' | **バックエンド**: '+be+'\n\n'
    :'> **Project**: '+pn+' | **Backend**: '+be+'\n\n'
  );

  // Test pyramid
  doc+='## '+(G?'テストピラミッド':'Test Pyramid')+'\n\n';
  doc+='```\n';
  doc+='         ┌───────────┐\n';
  doc+='         │  E2E Tests │  '+(G?'~10% (主要フロー)':'~10% (critical flows)')+'\n';
  doc+='       ┌─┴───────────┴─┐\n';
  doc+='       │ Integration   │  '+(G?'~30% (全エンドポイント)':'~30% (all endpoints)')+'\n';
  doc+='     ┌─┴───────────────┴─┐\n';
  doc+='     │    Unit Tests      │  '+(G?'~60% (ビジネスロジック)':'~60% (business logic)')+'\n';
  doc+='     └───────────────────┘\n';
  doc+='```\n\n';

  // Test types table
  doc+='## '+(G?'テスト種別':'Test Types')+'\n\n';
  doc+='| '+(G?'種別':'Type')+' | '+(G?'説明':'Description')+' | '+(G?'ツール':'Tools')+' | '+(G?'対象':'Target')+' | '+(G?'カバレッジ目標':'Coverage')+' |\n';
  doc+='|------|---------|------|------|------|\n';
  API_TEST_TYPES.forEach(function(t){
    doc+='| **'+(G?t.ja:t.en)+'** | '+(G?t.ja_desc:t.en_desc)+' | `'+t.tools+'` | '+(G?t.ja_when:t.en_when)+' | '+t.coverage+' |\n';
  });
  doc+='\n';

  // Backend-specific test examples
  if(isPython){
    doc+='## '+(G?'FastAPI テストの実装例':'FastAPI Test Implementation')+'\n\n';
    doc+='### '+(G?'統合テスト (pytest + httpx)':'Integration Tests (pytest + httpx)')+'\n\n';
    doc+='```python\n';
    doc+='import pytest\nfrom httpx import AsyncClient\nfrom app.main import app\nfrom app.core.database import get_db\n\n';
    doc+='@pytest.fixture\nasync def client(async_db):\n    """Async test client with test DB."""\n    async with AsyncClient(app=app, base_url="http://test") as ac:\n        yield ac\n\n';
    doc+='class TestUsersEndpoint:\n    async def test_list_users_requires_auth(self, client):\n        resp = await client.get("/v1/users")\n        assert resp.status_code == 401\n\n';
    doc+='    async def test_create_user_returns_201(self, client, auth_headers):\n        resp = await client.post(\n            "/v1/users",\n            json={"email": "test@example.com", "name": "Test User"},\n            headers=auth_headers,\n        )\n        assert resp.status_code == 201\n        data = resp.json()\n        assert "id" in data\n        assert data["email"] == "test@example.com"\n\n';
    doc+='    async def test_get_nonexistent_user_returns_404(self, client, auth_headers):\n        resp = await client.get("/v1/users/nonexistent-id", headers=auth_headers)\n        assert resp.status_code == 404\n        assert resp.json()["status"] == 404\n';
    doc+='```\n\n';
    doc+='### '+(G?'Conftest (テストDB・認証ヘルパー)':'Conftest (test DB & auth helper)')+'\n\n';
    doc+='```python\n# conftest.py\nimport pytest\nfrom sqlalchemy.ext.asyncio import create_async_engine, AsyncSession\n\nTEST_DATABASE_URL = "postgresql+asyncpg://postgres:password@localhost:5432/test_db"\n\n@pytest.fixture(scope="session")\ndef event_loop():\n    import asyncio\n    loop = asyncio.new_event_loop()\n    yield loop\n    loop.close()\n\n@pytest.fixture\nasync def auth_headers(client):\n    resp = await client.post("/v1/sessions", json={"email": "admin@test.com", "password": "test123"})\n    token = resp.json()["token"]\n    return {"Authorization": f"Bearer {token}"}\n```\n\n';
  } else {
    doc+='## '+(G?'テスト実装例 (Jest + supertest)':'Test Implementation (Jest + supertest)')+'\n\n';
    doc+='### '+(G?'統合テスト':'Integration Tests')+'\n\n';
    doc+='```typescript\nimport request from \'supertest\';\nimport { app } from \'../src/app\';\nimport { db } from \'../src/db\';\n\nafterAll(async () => await db.$disconnect());\n\ndescribe(\'GET /v1/users\', () => {\n  it(\'returns 401 without auth\', async () => {\n    const res = await request(app).get(\'/v1/users\');\n    expect(res.status).toBe(401);\n  });\n\n  it(\'returns paginated list for authenticated user\', async () => {\n    const res = await request(app)\n      .get(\'/v1/users?limit=10\')\n      .set(\'Authorization\', \'Bearer \' + testToken);\n    expect(res.status).toBe(200);\n    expect(res.body.data).toBeInstanceOf(Array);\n    expect(res.body.pagination).toHaveProperty(\'hasNextPage\');\n  });\n});\n\ndescribe(\'POST /v1/users\', () => {\n  it(\'creates user and returns 201\', async () => {\n    const res = await request(app)\n      .post(\'/v1/users\')\n      .set(\'Authorization\', \'Bearer \' + testToken)\n      .send({ email: \'new@example.com\', name: \'New User\' });\n    expect(res.status).toBe(201);\n    expect(res.body).toHaveProperty(\'id\');\n  });\n\n  it(\'returns 422 for invalid data\', async () => {\n    const res = await request(app)\n      .post(\'/v1/users\')\n      .set(\'Authorization\', \'Bearer \' + testToken)\n      .send({ email: \'not-an-email\' });\n    expect(res.status).toBe(422);\n  });\n});\n```\n\n';
  }

  // Contract testing
  doc+='## '+(G?'コントラクトテスト (Schemathesis / Dredd)':'Contract Testing (Schemathesis / Dredd)')+'\n\n';
  if(isPython){
    doc+='```bash\n# Install\npip install schemathesis\n\n# Run against running server\nst run openapi.yaml --url http://localhost:8000 --checks all\n\n# Run in pytest\n# tests/test_api_contract.py\nimport schemathesis\nfrom app.main import app\n\nschema = schemathesis.from_asgi("/openapi.json", app=app)\n\n@schema.parametrize()\ndef test_api_conforms_to_spec(case):\n    response = case.call_asgi()\n    case.validate_response(response)\n```\n\n';
  } else {
    doc+='```bash\n# Install\nnpm install -g @stoplight/prism-cli\n\n# Mock server for FE development\nprism mock openapi.yaml --port 4010\n\n# Validate real API against spec\nprism proxy openapi.yaml http://localhost:3000\n\n# Dredd contract tests\ndredd openapi.yaml http://localhost:3000\n```\n\n';
  }

  // Load testing
  doc+='## '+(G?'負荷テスト':'Load Testing')+'\n\n';
  doc+='```javascript\n// k6 load test example\nimport http from \'k6/http\';\nimport { check, sleep } from \'k6\';\n\nexport const options = {\n  stages: [\n    { duration: \'1m\', target: 50 },   // '+(G?'ウォームアップ':'warmup')+'\n    { duration: \'3m\', target: 200 },  // '+(G?'通常負荷':'normal load')+'\n    { duration: \'1m\', target: 0 },    // '+(G?'クールダウン':'cooldown')+'\n  ],\n  thresholds: {\n    http_req_duration: [\'p(95)<500\'],  // '+(G?'95%ile 500ms以下':'95%ile under 500ms')+'\n    http_req_failed: [\'rate<0.01\'],    // '+(G?'エラー率1%未満':'error rate under 1%')+'\n  },\n};\n\nexport default function() {\n  const res = http.get(\'https://api.example.com/v1/users\', {\n    headers: { Authorization: \'Bearer \' + __ENV.API_TOKEN },\n  });\n  check(res, { \'status is 200\': (r) => r.status === 200 });\n  sleep(1);\n}\n```\n\n';

  // CI integration
  doc+='## '+(G?'CI統合':'CI Integration')+'\n\n';
  doc+='```yaml\n# .github/workflows/api-tests.yml\nname: API Tests\non: [push, pull_request]\njobs:\n  api-test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: '+(G?'依存関係インストール':'Install dependencies')+'\n        run: '+(isPython?'pip install -r requirements-test.txt':'npm ci')+'\n      - name: '+(G?'統合テスト実行':'Run integration tests')+'\n        run: '+(isPython?'pytest tests/ -v --cov=app --cov-report=xml':'jest --coverage --testPathPattern=integration')+'\n';
  if(!isBaaS){
    doc+='      - name: '+(G?'OpenAPIバリデーション':'OpenAPI validation')+'\n        run: '+(isPython?'schemathesis run openapi.yaml --url http://localhost:8000 --checks all':'npx redocly lint openapi.yaml')+'\n';
  }
  doc+='```\n\n';

  // Test data management
  doc+='## '+(G?'テストデータ管理':'Test Data Management')+'\n\n';
  doc+='| '+(G?'戦略':'Strategy')+' | '+(G?'ツール':'Tool')+' | '+(G?'用途':'Use Case')+' |\n';
  doc+='|------|------|------|\n';
  if(isPython){
    doc+='| Factory | `factory_boy` | '+(G?'ユニット/統合テスト':'Unit/Integration tests')+' |\n';
    doc+='| Fixtures | `pytest fixtures` | '+(G?'テストDB初期化':'Test DB initialization')+' |\n';
    doc+='| Seed | `alembic seed scripts` | '+(G?'開発環境データ':'Dev environment data')+' |\n';
  } else {
    doc+='| Factory | `@faker-js/faker` | '+(G?'ユニット/統合テスト':'Unit/Integration tests')+' |\n';
    doc+='| Seed | `prisma db seed` | '+(G?'開発環境データ':'Dev environment data')+' |\n';
    doc+='| Snapshot | `jest --updateSnapshot` | '+(G?'レスポンス変更検知':'Detect response changes')+' |\n';
  }
  doc+='\n';
  doc+='---\n*'+(G?'DevForge v9 自動生成':'Generated by DevForge v9')+'*\n';
  S.files['docs/86_api_testing_strategy.md']=doc;
}
