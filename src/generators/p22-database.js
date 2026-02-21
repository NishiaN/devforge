// P22: Database Intelligence
// Generates: docs/87_database_design_principles.md, 88_query_optimization_guide.md,
//            89_migration_strategy.md, 90_backup_disaster_recovery.md

// ============================================================================
// DATA CONSTANTS
// ============================================================================

var DB_INDEX_RULES=[
  {id:'pk',ja:'主キー (UUID v7 推奨)',en:'Primary Key (UUID v7 recommended)',
   ja_why:'時系列ソート可能・衝突なし・分散対応',en_why:'Time-sortable, collision-free, distributed-safe'},
  {id:'fk_idx',ja:'外部キーには必ずインデックスを作成',en:'Always index foreign keys',
   ja_why:'JOIN パフォーマンスの最大の要因',en_why:'Most critical factor for JOIN performance'},
  {id:'composite',ja:'複合インデックスはカーディナリティ順に並べる',en:'Order composite index by cardinality',
   ja_why:'高カーディナリティ列を先頭に (例: user_id + created_at)',en_why:'High-cardinality column first (e.g., user_id + created_at)'},
  {id:'partial',ja:'部分インデックスで絞り込み',en:'Use partial indexes for filtered queries',
   ja_why:'deleted_at IS NULL など条件付きの場合に有効',en_why:'Effective for conditions like deleted_at IS NULL'},
  {id:'covering',ja:'カバリングインデックスでヒープフェッチを回避',en:'Use covering indexes to avoid heap fetch',
   ja_why:'INCLUDE 句で SELECT 列を追加',en_why:'Add SELECT columns with INCLUDE clause'},
];

var DB_NAMING_CONVENTIONS=[
  {obj:'Table',ja:'スネークケース複数形',en:'snake_case plural',ex:'users, blog_posts, order_items'},
  {obj:'Column',ja:'スネークケース単数形',en:'snake_case singular',ex:'created_at, user_id, is_active'},
  {obj:'PK',ja:'id (UUID)',en:'id (UUID)',ex:'id UUID PRIMARY KEY DEFAULT gen_random_uuid()'},
  {obj:'FK',ja:'参照テーブル名_id',en:'referenced_table_id',ex:'user_id, product_id'},
  {obj:'Index',ja:'idx_テーブル名_列名',en:'idx_table_col',ex:'idx_users_email, idx_posts_user_id'},
  {obj:'Timestamp',ja:'created_at, updated_at, deleted_at',en:'created_at, updated_at, deleted_at',ex:'TIMESTAMPTZ NOT NULL DEFAULT NOW()'},
];

var MIGRATION_PATTERNS=[
  {id:'expand_contract',ja:'エクスパンド・コントラクトパターン',en:'Expand-Contract Pattern',
   step1_ja:'Expand: 新列追加 (NULL許容)',step1_en:'Expand: Add column (nullable)',
   step2_ja:'Migrate: アプリを新列対応に更新しつつ両列に書込',step2_en:'Migrate: Update app to write to both columns',
   step3_ja:'Backfill: 既存データを新列に移行',step3_en:'Backfill: Migrate existing data to new column',
   step4_ja:'Contract: 旧列を削除',step4_en:'Contract: Drop old column',
   ja_when:'列名変更・型変更・NULL制約追加時',en_when:'Column rename, type change, or adding NOT NULL constraint'},
  {id:'blue_green_db',ja:'Blue-Greenデータベースマイグレーション',en:'Blue-Green DB Migration',
   step1_ja:'Greenへスキーマをコピー・移行スクリプト実行',step1_en:'Copy schema to Green, run migration scripts',
   step2_ja:'レプリケーションでBlue→Green同期',step2_en:'Replicate Blue→Green',
   step3_ja:'トラフィックをGreenに切替',step3_en:'Switch traffic to Green',
   step4_ja:'数時間後Blueを廃止',step4_en:'Retire Blue after several hours',
   ja_when:'大規模データ変換・破壊的変更',en_when:'Large data transforms or destructive changes'},
];

var BACKUP_STRATEGIES=[
  {id:'continuous',ja:'継続的バックアップ (WAL/PITR)',en:'Continuous Backup (WAL/PITR)',
   rto:'分単位',rto_en:'Minutes',rpo:'数秒',rpo_en:'Seconds',
   ja_desc:'Write-Ahead Logging で任意時点への復元が可能',en_desc:'WAL enables restore to any point in time',
   tools:'pg_basebackup + WAL-E/WAL-G | Neon branching | Supabase PITR'},
  {id:'daily',ja:'日次フルバックアップ',en:'Daily Full Backup',
   rto:'1-4時間',rto_en:'1-4 hours',rpo:'最大24時間',rpo_en:'Up to 24h',
   ja_desc:'スナップショットまたはpg_dumpで毎日取得',en_desc:'Daily snapshot or pg_dump',
   tools:'pg_dump | Neon restore | Supabase scheduled'},
  {id:'logical',ja:'論理バックアップ (マイグレーション前)',en:'Logical Backup (pre-migration)',
   rto:'可変',rto_en:'Variable',rpo:'取得時点',rpo_en:'At capture time',
   ja_desc:'スキーマ変更前の安全ネット',en_desc:'Safety net before schema changes',
   tools:'pg_dump --format=custom | mysqldump'},
];

// ============================================================================
// GENERATOR FUNCTIONS
// ============================================================================

function genPillar22_DatabaseIntelligence(a,pn){
  var G=S.genLang==='ja';
  gen87(a,pn,G);
  gen88(a,pn,G);
  gen89(a,pn,G);
  gen90(a,pn,G);
}

// Detect ORM info (reuse resolveORM if available, else inline)
function _dbORM(a){
  if(typeof resolveORM==='function') return resolveORM(a);
  var orm=a.orm||''; var be=a.backend||'';
  var isPy=/Python|Django|FastAPI/i.test(be);
  if(/Supabase|Firebase|Convex/i.test(be)) return {name:be,dir:'supabase',isBaaS:true,isPython:false};
  if(orm.includes('Drizzle'))    return {name:'Drizzle ORM',dir:'drizzle',isBaaS:false,isPython:false};
  if(orm.includes('TypeORM'))    return {name:'TypeORM',dir:'typeorm',isBaaS:false,isPython:false};
  if(orm.includes('SQLAlchemy')) return {name:'SQLAlchemy',dir:'alembic',isBaaS:false,isPython:true};
  if(orm.includes('Kysely'))     return {name:'Kysely',dir:'kysely',isBaaS:false,isPython:false};
  if(isPy) return {name:'SQLAlchemy',dir:'alembic',isBaaS:false,isPython:true};
  return {name:'Prisma ORM',dir:'prisma',isBaaS:false,isPython:false};
}

function _dbType(a){
  var db=a.database||'';
  if(/MongoDB|Mongo/i.test(db)) return 'mongodb';
  if(/MySQL|MariaDB/i.test(db)) return 'mysql';
  if(/SQLite/i.test(db))        return 'sqlite';
  return 'postgresql'; // default
}

// doc 87: Database Design Principles
function gen87(a,pn,G){
  var orm=_dbORM(a);
  var dbType=_dbType(a);
  var isMongo=dbType==='mongodb';
  var isBaaS=orm.isBaaS;
  var isPy=orm.isPython;

  var doc='';
  doc+='# '+(G?'データベース設計原則':'Database Design Principles')+'\n\n';
  doc+=(G
    ?'> **プロジェクト**: '+pn+' | **ORM**: '+orm.name+' | **DB**: '+(a.database||'PostgreSQL')+'\n\n'
    :'> **Project**: '+pn+' | **ORM**: '+orm.name+' | **DB**: '+(a.database||'PostgreSQL')+'\n\n'
  );

  // Schema Design
  doc+='## '+(G?'スキーマ設計原則':'Schema Design Principles')+'\n\n';

  if(isMongo){
    doc+='### MongoDB ドキュメント設計\n\n';
    doc+='| '+(G?'原則':'Principle')+' | '+(G?'内容':'Description')+' | '+(G?'例':'Example')+' |\n';
    doc+='|------|---------|------|\n';
    doc+='| Embed vs Reference | '+(G?'頻繁に一緒に読む → 埋め込み; 独立更新 → 参照':'Frequently read together → embed; updated independently → reference')+' | '+(G?'コメントを投稿に埋め込む':'Embed comments in post')+' |\n';
    doc+='| Document Size | '+(G?'16MB上限; 成長するArrayは別Collectionへ':'16MB limit; growing arrays → separate collection')+' | '+(G?'ログは別コレクション':'Logs in separate collection')+' |\n';
    doc+='| Indexing | '+(G?'クエリパターンに合わせて設計':'Design indexes to match query patterns')+' | `{userId: 1, createdAt: -1}` |\n';
    doc+='\n';
  } else {
    doc+='### '+(G?'正規化方針':'Normalization Policy')+'\n\n';
    doc+='| '+(G?'ルール':'Rule')+' | '+(G?'内容':'Description')+' | '+(G?'例外':'Exception')+' |\n';
    doc+='|------|---------|------|\n';
    doc+='| 3NF原則 | '+(G?'原則として第三正規形まで正規化':'Normalize to 3NF by default')+' | '+(G?'集計テーブルは意図的に非正規化':'Intentional denormalization for aggregation tables')+' |\n';
    doc+='| Soft Delete | '+(G?'deleted_at TIMESTAMPTZ で論理削除':'Soft delete with deleted_at TIMESTAMPTZ')+' | '+(G?'監査ログは物理削除しない':'Audit logs never hard-deleted')+' |\n';
    doc+='| Timestamps | '+(G?'全テーブルに created_at・updated_at を追加':'Add created_at, updated_at to all tables')+' | - |\n';
    doc+='| UUID | '+(G?'主キーはUUID v7 (時系列ソート可能)':'Use UUID v7 for PKs (time-sortable)')+' | '+(G?'外部連携は auto-increment でも可':'Auto-increment OK for external integrations')+' |\n';
    doc+='\n';

    // Naming conventions
    doc+='### '+(G?'命名規約':'Naming Conventions')+'\n\n';
    doc+='| '+(G?'対象':'Object')+' | '+(G?'規約':'Convention')+' | '+(G?'例':'Example')+' |\n';
    doc+='|------|---------|------|\n';
    DB_NAMING_CONVENTIONS.forEach(function(c){
      doc+='| '+c.obj+' | '+(G?c.ja:c.en)+' | `'+c.ex+'` |\n';
    });
    doc+='\n';

    // Index rules
    doc+='### '+(G?'インデックス設計':'Index Design')+'\n\n';
    doc+='| # | '+(G?'ルール':'Rule')+' | '+(G?'理由':'Why')+' |\n';
    doc+='|---|------|------|\n';
    DB_INDEX_RULES.forEach(function(r,i){
      doc+='| '+(i+1)+' | '+(G?r.ja:r.en)+' | '+(G?r.ja_why:r.en_why)+' |\n';
    });
    doc+='\n';
  }

  // ORM schema examples
  doc+='## '+(G?'ORM スキーマ例 ('+orm.name+')':'ORM Schema Example ('+orm.name+')')+'\n\n';

  if(orm.name==='Prisma ORM'){
    doc+='```prisma\n// schema.prisma\nmodel User {\n  id        String    @id @default(cuid())\n  email     String    @unique\n  name      String?\n  createdAt DateTime  @default(now()) @map("created_at")\n  updatedAt DateTime  @updatedAt      @map("updated_at")\n  deletedAt DateTime?                 @map("deleted_at")\n\n  posts     Post[]\n\n  @@map("users")\n  @@index([createdAt])\n}\n\nmodel Post {\n  id        String    @id @default(cuid())\n  title     String\n  userId    String    @map("user_id")\n  createdAt DateTime  @default(now()) @map("created_at")\n  updatedAt DateTime  @updatedAt      @map("updated_at")\n  deletedAt DateTime?                 @map("deleted_at")\n\n  user      User      @relation(fields: [userId], references: [id])\n\n  @@map("posts")\n  @@index([userId])\n  @@index([userId, createdAt])\n}\n```\n\n';
  } else if(orm.name==='Drizzle ORM'){
    doc+='```typescript\n// db/schema.ts\nimport { pgTable, text, timestamp, uuid, index } from \'drizzle-orm/pg-core\';\n\nexport const users = pgTable(\'users\', {\n  id:        uuid(\'id\').primaryKey().defaultRandom(),\n  email:     text(\'email\').notNull().unique(),\n  name:      text(\'name\'),\n  createdAt: timestamp(\'created_at\').defaultNow().notNull(),\n  updatedAt: timestamp(\'updated_at\').defaultNow().notNull(),\n  deletedAt: timestamp(\'deleted_at\'),\n}, (t) => ({\n  emailIdx: index(\'idx_users_email\').on(t.email),\n}));\n\nexport const posts = pgTable(\'posts\', {\n  id:        uuid(\'id\').primaryKey().defaultRandom(),\n  title:     text(\'title\').notNull(),\n  userId:    uuid(\'user_id\').notNull().references(() => users.id),\n  createdAt: timestamp(\'created_at\').defaultNow().notNull(),\n  updatedAt: timestamp(\'updated_at\').defaultNow().notNull(),\n  deletedAt: timestamp(\'deleted_at\'),\n}, (t) => ({\n  userIdx:        index(\'idx_posts_user_id\').on(t.userId),\n  userCreatedIdx: index(\'idx_posts_user_created\').on(t.userId, t.createdAt),\n}));\n```\n\n';
  } else if(orm.name==='SQLAlchemy'||isPy){
    doc+='```python\n# app/models/base.py\nfrom sqlalchemy import Column, DateTime, String\nfrom sqlalchemy.dialects.postgresql import UUID\nfrom sqlalchemy.ext.declarative import declared_attr\nfrom sqlalchemy.orm import DeclarativeBase\nfrom datetime import datetime\nimport uuid\n\nclass Base(DeclarativeBase):\n    pass\n\nclass TimestampMixin:\n    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now(), nullable=False)\n    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)\n    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)\n\n# app/models/user.py\nfrom sqlalchemy import String, Index\nfrom sqlalchemy.dialects.postgresql import UUID\nfrom sqlalchemy.orm import Mapped, mapped_column, relationship\n\nclass User(Base, TimestampMixin):\n    __tablename__ = "users"\n\n    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)\n    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)\n    name: Mapped[str | None] = mapped_column(String(255))\n\n    posts: Mapped[list["Post"]] = relationship(back_populates="user")\n\n    __table_args__ = (\n        Index("idx_users_email", "email"),\n    )\n```\n\n';
  } else if(orm.name==='TypeORM'){
    doc+='```typescript\n// entities/user.entity.ts\nimport { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Index, OneToMany } from \'typeorm\';\n\n@Entity(\'users\')\n@Index([\'email\'])\nexport class User {\n  @PrimaryGeneratedColumn(\'uuid\')\n  id: string;\n\n  @Column({ unique: true })\n  email: string;\n\n  @Column({ nullable: true })\n  name: string;\n\n  @CreateDateColumn({ name: \'created_at\' })\n  createdAt: Date;\n\n  @UpdateDateColumn({ name: \'updated_at\' })\n  updatedAt: Date;\n\n  @DeleteDateColumn({ name: \'deleted_at\' })\n  deletedAt: Date;\n\n  @OneToMany(() => Post, (post) => post.user)\n  posts: Post[];\n}\n```\n\n';
  } else if(orm.name==='Kysely'){
    doc+='```typescript\n// db/schema.ts — Kysely type definitions\nexport interface Database {\n  users: UserTable;\n  posts: PostTable;\n}\n\nexport interface UserTable {\n  id: Generated<string>;\n  email: string;\n  name: string | null;\n  created_at: Generated<Date>;\n  updated_at: Date;\n  deleted_at: Date | null;\n}\n\nexport interface PostTable {\n  id: Generated<string>;\n  title: string;\n  user_id: string;\n  created_at: Generated<Date>;\n  updated_at: Date;\n  deleted_at: Date | null;\n}\n```\n\n```sql\n-- migrations/001_create_users.sql\nCREATE TABLE users (\n  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email      TEXT NOT NULL UNIQUE,\n  name       TEXT,\n  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n  deleted_at TIMESTAMPTZ\n);\nCREATE INDEX idx_users_email ON users(email);\n```\n\n';
  } else if(isBaaS){
    doc+='```sql\n-- Supabase SQL Editor: schema setup\nCREATE TABLE public.users (\n  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,\n  email      TEXT UNIQUE NOT NULL,\n  name       TEXT,\n  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,\n  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,\n  deleted_at TIMESTAMPTZ,\n  PRIMARY KEY (id)\n);\n\n-- Row Level Security\nALTER TABLE public.users ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY "Users can view own profile" ON public.users\n  FOR SELECT USING (auth.uid() = id);\n\nCREATE POLICY "Users can update own profile" ON public.users\n  FOR UPDATE USING (auth.uid() = id);\n```\n\n';
  }

  // Soft delete pattern
  if(!isMongo&&!isBaaS){
    doc+='## '+(G?'ソフトデリートパターン':'Soft Delete Pattern')+'\n\n';
    doc+='```sql\n-- '+(G?'削除せずにフラグを立てる':'Flag as deleted without removing')+'\nUPDATE users SET deleted_at = NOW() WHERE id = $1;\n\n-- '+(G?'アクティブレコードのみ取得 (デフォルトスコープ)':'Fetch only active records (default scope)')+'\nSELECT * FROM users WHERE deleted_at IS NULL;\n\n-- '+(G?'部分インデックスで高速化':'Speed up with partial index')+'\nCREATE INDEX idx_users_active ON users(id) WHERE deleted_at IS NULL;\n```\n\n';
    if(isPy){
      doc+='```python\n# SQLAlchemy: filter active records by default\nclass BaseRepository:\n    def active_query(self, db: AsyncSession, model):\n        return db.query(model).filter(model.deleted_at.is_(None))\n```\n\n';
    } else if(orm.name==='Prisma ORM'){
      doc+='```typescript\n// Prisma middleware: auto-filter deleted records\nprisma.$use(async (params, next) => {\n  if (params.action === \'findMany\') {\n    params.args = params.args || {};\n    params.args.where = { ...params.args.where, deletedAt: null };\n  }\n  return next(params);\n});\n```\n\n';
    }
  }

  doc+='---\n*'+(G?'DevForge v9 自動生成':'Generated by DevForge v9')+'*\n';
  S.files['docs/87_database_design_principles.md']=doc;
}

// doc 88: Query Optimization Guide
function gen88(a,pn,G){
  var orm=_dbORM(a);
  var dbType=_dbType(a);
  var isMongo=dbType==='mongodb';
  var isPy=orm.isPython;
  var isBaaS=orm.isBaaS;

  var doc='';
  doc+='# '+(G?'クエリ最適化ガイド':'Query Optimization Guide')+'\n\n';
  doc+=(G
    ?'> **プロジェクト**: '+pn+' | **ORM**: '+orm.name+'\n\n'
    :'> **Project**: '+pn+' | **ORM**: '+orm.name+'\n\n'
  );

  // N+1 problem
  doc+='## '+(G?'N+1問題の検出と対策':'N+1 Problem: Detection and Prevention')+'\n\n';
  doc+=(G
    ?'N+1問題はAPIパフォーマンス劣化の最大原因です。1件のリスト取得クエリ後にN件の個別クエリが発生します。\n\n'
    :'The N+1 problem is the #1 cause of API performance degradation: 1 list query followed by N individual queries.\n\n'
  );

  if(isPy||orm.name==='SQLAlchemy'){
    doc+='### '+(G?'SQLAlchemy: joinedload / selectinload':'SQLAlchemy: joinedload / selectinload')+'\n\n';
    doc+='```python\n# ❌ N+1 問題\nposts = await db.execute(select(Post))\nfor post in posts:  # N クエリ発生\n    print(post.user.name)  # user を個別取得\n\n# ✅ selectinload で解決\nstmt = select(Post).options(selectinload(Post.user))\nposts = (await db.execute(stmt)).scalars().all()\n\n# ✅ joinedload (JOIN が最適な場合)\nstmt = select(Post).options(joinedload(Post.user))\n```\n\n';
  } else if(orm.name==='Prisma ORM'){
    doc+='### '+(G?'Prisma: include / select':'Prisma: include / select')+'\n\n';
    doc+='```typescript\n// ❌ N+1 問題\nconst posts = await prisma.post.findMany();\nfor (const post of posts) {\n  const user = await prisma.user.findUnique({ where: { id: post.userId } }); // N クエリ\n}\n\n// ✅ include でリレーションを一括取得\nconst posts = await prisma.post.findMany({\n  include: { user: true },  // LEFT JOIN に変換\n  where: { deletedAt: null },\n  orderBy: { createdAt: \'desc\' },\n  take: 20,\n});\n\n// ✅ select で必要フィールドのみ取得 (パフォーマンス向上)\nconst posts = await prisma.post.findMany({\n  select: { id: true, title: true, user: { select: { name: true } } },\n});\n```\n\n';
  } else if(orm.name==='Drizzle ORM'){
    doc+='### '+(G?'Drizzle ORM: with / leftJoin':'Drizzle ORM: with / leftJoin')+'\n\n';
    doc+='```typescript\n// ✅ Drizzle: リレーション一括取得\nconst result = await db.query.posts.findMany({\n  with: { user: true },\n  where: isNull(posts.deletedAt),\n  orderBy: [desc(posts.createdAt)],\n  limit: 20,\n});\n\n// ✅ 明示的 JOIN\nconst result = await db\n  .select({ post: posts, userName: users.name })\n  .from(posts)\n  .leftJoin(users, eq(posts.userId, users.id))\n  .where(isNull(posts.deletedAt))\n  .limit(20);\n```\n\n';
  } else {
    doc+='### '+(G?'クエリ最適化 ('+orm.name+')':'Query Optimization ('+orm.name+')')+'\n\n';
    doc+='```sql\n-- ✅ JOIN で N+1 を回避\nSELECT p.*, u.name AS user_name\nFROM posts p\nLEFT JOIN users u ON p.user_id = u.id\nWHERE p.deleted_at IS NULL\nORDER BY p.created_at DESC\nLIMIT 20;\n```\n\n';
  }

  // EXPLAIN ANALYZE
  if(!isBaaS){
    doc+='## '+(G?'EXPLAIN ANALYZE の活用':'Using EXPLAIN ANALYZE')+'\n\n';
    doc+='```sql\n-- '+(G?'クエリ実行計画の確認':'Check query execution plan')+'\nEXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)\nSELECT * FROM posts WHERE user_id = \'uuid-here\' AND deleted_at IS NULL;\n\n/*\n'+(G?'注目するキーワード:':'Key terms to look for:')+'\n  Seq Scan    → '+(G?'テーブルフルスキャン (インデックス追加を検討)':'Full table scan (consider adding index)')+'\n  Index Scan  → '+(G?'インデックス使用 (良好)':'Using index (good)')+'\n  Hash Join   → '+(G?'JOIN で効率的なハッシュ結合':'Efficient hash join for JOINs')+'\n  cost=X..Y   → X='+(G?'最初の行コスト':'first row cost')+', Y='+(G?'全行コスト':'all rows cost')+'\n  actual time → '+(G?'実際の実行時間 (ms)':'Actual execution time (ms)')+'\n*/\n```\n\n';

    doc+='## '+(G?'スロークエリの特定':'Identifying Slow Queries')+'\n\n';
    doc+='```sql\n-- '+(G?'PostgreSQL: 遅いクエリTOP10を確認':'PostgreSQL: View top 10 slowest queries')+'\nSELECT\n  query,\n  calls,\n  round(total_exec_time::numeric, 2) AS total_ms,\n  round(mean_exec_time::numeric, 2)  AS avg_ms,\n  round(stddev_exec_time::numeric, 2) AS stddev_ms\nFROM pg_stat_statements\nORDER BY mean_exec_time DESC\nLIMIT 10;\n\n-- '+(G?'pg_stat_statements が未有効の場合:':'If pg_stat_statements is not enabled:')+'\n-- shared_preload_libraries = \'pg_stat_statements\' (postgresql.conf)\n```\n\n';
  }

  // Connection pooling
  doc+='## '+(G?'コネクションプーリング':'Connection Pooling')+'\n\n';
  doc+='| '+(G?'設定':'Setting')+' | '+(G?'推奨値':'Recommended')+' | '+(G?'理由':'Reason')+' |\n';
  doc+='|------|---------|------|\n';
  if(isPy){
    doc+='| pool_size | 10-20 | '+(G?'並行リクエスト数に合わせる':'Match concurrent request count')+' |\n';
    doc+='| max_overflow | 5-10 | '+(G?'バースト時の余裕':'Burst headroom')+' |\n';
    doc+='| pool_pre_ping | True | '+(G?'失効接続の自動検出':'Auto-detect stale connections')+' |\n';
    doc+='| pool_recycle | 3600 | '+(G?'接続を1時間でリサイクル':'Recycle connections every hour')+' |\n\n';
    doc+='```python\n# SQLAlchemy: connection pool config\nengine = create_async_engine(\n    DATABASE_URL,\n    pool_size=10,\n    max_overflow=5,\n    pool_pre_ping=True,\n    pool_recycle=3600,\n    echo=False,  # '+(G?'本番ではFalse':'False in production')+'\n)\n```\n\n';
  } else {
    doc+='| Pool Size | 10-25 | '+(G?'サーバーCPUコア数の2-3倍':'2-3× server CPU cores')+' |\n';
    doc+='| Connection Limit | DB側で管理 | PostgreSQL: `max_connections=100` |\n';
    doc+='| Idle Timeout | 10秒/10s | '+(G?'アイドル接続を解放':'Release idle connections')+' |\n\n';
    if(orm.name==='Prisma ORM'){
      doc+='```typescript\n// Prisma: datasource url with pool params\n// DATABASE_URL="postgresql://...?connection_limit=10&pool_timeout=20"\n\n// '+(G?'Prisma Accelerate (サーバーレス推奨)':'Prisma Accelerate (recommended for serverless)')+'\n// https://console.prisma.io/\n```\n\n';
    } else {
      doc+='> '+(G?'サーバーレス環境 (Vercel/Cloudflare) では PgBouncer / Prisma Accelerate / Supabase Pooler を使用してください。':'For serverless environments (Vercel/Cloudflare), use PgBouncer / Prisma Accelerate / Supabase Pooler.')+'\n\n';
    }
  }

  // Performance checklist
  doc+='## '+(G?'クエリパフォーマンスチェックリスト':'Query Performance Checklist')+'\n\n';
  doc+='- [ ] '+(G?'N+1クエリをすべて解消 (JOIN/include/joinedload)':'All N+1 queries resolved (JOIN/include/joinedload)')+'\n';
  doc+='- [ ] '+(G?'外部キーにインデックスが存在する':'Foreign keys have indexes')+'\n';
  doc+='- [ ] '+(G?'頻繁に使うWHERE条件にインデックスを作成':'Indexes on frequently used WHERE conditions')+'\n';
  doc+='- [ ] '+(G?'不要な列をSELECTしていない (SELECT * を避ける)':'No unnecessary columns selected (avoid SELECT *)')+'\n';
  doc+='- [ ] '+(G?'ページネーションにカーソルを使用 (オフセットは大規模不可)':'Cursor-based pagination (offset fails at scale)')+'\n';
  doc+='- [ ] '+(G?'EXPLAIN ANALYZE でスロークエリを確認済み':'Verified slow queries with EXPLAIN ANALYZE')+'\n';
  doc+='- [ ] '+(G?'本番データに近いボリュームでテスト済み':'Tested with production-scale data volume')+'\n\n';

  doc+='---\n*'+(G?'DevForge v9 自動生成':'Generated by DevForge v9')+'*\n';
  S.files['docs/88_query_optimization_guide.md']=doc;
}

// doc 89: Migration Strategy
function gen89(a,pn,G){
  var orm=_dbORM(a);
  var isPy=orm.isPython;
  var isBaaS=orm.isBaaS;

  var doc='';
  doc+='# '+(G?'マイグレーション戦略':'Migration Strategy')+'\n\n';
  doc+=(G
    ?'> **プロジェクト**: '+pn+' | **ORM**: '+orm.name+'\n\n'
    :'> **Project**: '+pn+' | **ORM**: '+orm.name+'\n\n'
  );

  // Core principles
  doc+='## '+(G?'ゼロダウンタイムマイグレーションの原則':'Zero-Downtime Migration Principles')+'\n\n';
  doc+='| '+(G?'原則':'Principle')+' | '+(G?'内容':'Description')+' |\n';
  doc+='|------|------|\n';
  doc+='| '+(G?'後方互換性':'Backward Compatibility')+' | '+(G?'アプリが旧スキーマと新スキーマ両方で動作する期間を設ける':'Ensure app works with both old and new schema during transition')+' |\n';
  doc+='| '+(G?'小さく分割':'Small Steps')+' | '+(G?'1マイグレーション = 1変更。複数変更を混在させない':'1 migration = 1 change. Never mix multiple changes')+' |\n';
  doc+='| '+(G?'ロールバック計画':'Rollback Plan')+' | '+(G?'全マイグレーションにダウンマイグレーションを実装':'Implement down-migration for every migration')+' |\n';
  doc+='| '+(G?'本番前のリハーサル':'Rehearsal')+' | '+(G?'ステージング環境で本番データを使ってリハーサル':'Rehearse with production-like data on staging')+' |\n';
  doc+='\n';

  // Expand-Contract pattern
  doc+='## '+(G?'エクスパンド・コントラクトパターン':'Expand-Contract Pattern')+'\n\n';
  doc+=(G
    ?'列名変更・型変更・NOT NULL制約追加など、破壊的変更に使用します。\n\n'
    :'Use for destructive changes: column rename, type change, adding NOT NULL constraint.\n\n'
  );
  MIGRATION_PATTERNS.forEach(function(p){
    doc+='### '+(G?p.ja:p.en)+'\n\n';
    doc+='```\n';
    doc+='Step 1: '+(G?p.step1_ja:p.step1_en)+'\n';
    doc+='Step 2: '+(G?p.step2_ja:p.step2_en)+'\n';
    doc+='Step 3: '+(G?p.step3_ja:p.step3_en)+'\n';
    doc+='Step 4: '+(G?p.step4_ja:p.step4_en)+'\n';
    doc+='```\n';
    doc+=(G?'*使用場面*: ':'*Use when*: ')+(G?p.ja_when:p.en_when)+'\n\n';
  });

  // ORM-specific migration workflow
  doc+='## '+(G?'マイグレーションワークフロー ('+orm.name+')':'Migration Workflow ('+orm.name+')')+'\n\n';

  if(isBaaS){
    doc+='```sql\n-- '+(G?'Supabase: SQL Editorまたはマイグレーションファイルで実行':'Supabase: Run via SQL Editor or migration files')+'\n-- '+(G?'リモートマイグレーションの管理':'Managing remote migrations')+'\n\n-- supabase db pull  '+(G?'# 現在のスキーマを取得':'# Fetch current schema')+'\n-- supabase db push  '+(G?'# ローカルマイグレーションを適用':'# Apply local migrations')+'\n\n-- supabase/migrations/20240101000000_create_users.sql\nCREATE TABLE public.users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email TEXT NOT NULL UNIQUE,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nALTER TABLE public.users ENABLE ROW LEVEL SECURITY;\n```\n\n';
    doc+='```bash\n# Supabase CLI workflow\nsupabase init\nsupabase start\nsupabase db diff --file new_migration  # '+(G?'スキーマ差分から自動生成':'Auto-generate from schema diff')+'\nsupabase db push                       # '+(G?'本番に適用':'Apply to production')+'\n```\n\n';
  } else if(isPy){
    doc+='```bash\n# Alembic workflow\nalembic revision --autogenerate -m "add_user_table"  # '+(G?'自動生成':'Auto-generate')+'\nalembic upgrade head                                  # '+(G?'最新に適用':'Apply to latest')+'\nalembic downgrade -1                                  # '+(G?'1ステップ戻す':'Rollback 1 step')+'\nalembic current                                       # '+(G?'現在のバージョン確認':'Check current version')+'\nalembic history                                       # '+(G?'履歴確認':'View history')+'\n```\n\n';
    doc+='```python\n# '+(G?'マイグレーションファイル例 (alembic/versions/)':'Migration file example (alembic/versions/)')+'\ndef upgrade() -> None:\n    op.create_table(\n        "posts",\n        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),\n        sa.Column("title", sa.String(500), nullable=False),\n        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),\n        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),\n        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),\n    )\n    op.create_index("idx_posts_user_id", "posts", ["user_id"])\n\ndef downgrade() -> None:\n    op.drop_index("idx_posts_user_id")\n    op.drop_table("posts")\n```\n\n';
  } else if(orm.name==='Prisma ORM'){
    doc+='```bash\n# Prisma migration workflow\nnpx prisma migrate dev --name add_user_table    # '+(G?'開発: マイグレーション作成+適用':'Dev: create + apply')+'\nnpx prisma migrate deploy                        # '+(G?'本番: マイグレーション適用':'Production: apply migrations')+'\nnpx prisma migrate reset                         # '+(G?'開発DB: リセット+再適用':'Dev DB: reset + reapply')+'\nnpx prisma migrate status                        # '+(G?'適用状況確認':'Check migration status')+'\nnpx prisma db seed                               # '+(G?'シードデータ投入':'Seed data')+'\n```\n\n';
    doc+='```typescript\n// package.json — migration as part of deploy\n{\n  "scripts": {\n    "db:migrate": "prisma migrate deploy",\n    "db:generate": "prisma generate",\n    "postinstall": "prisma generate"\n  }\n}\n```\n\n';
  } else if(orm.name==='Drizzle ORM'){
    doc+='```bash\n# Drizzle migration workflow\nnpx drizzle-kit generate:pg              # '+(G?'マイグレーションSQL生成':'Generate migration SQL')+'\nnpx drizzle-kit migrate:pg              # '+(G?'マイグレーション適用':'Apply migrations')+'\nnpx drizzle-kit push:pg                 # '+(G?'スキーマを直接プッシュ (開発用)':'Push schema directly (dev only)')+'\n```\n\n';
  }

  // CI/CD integration
  doc+='## '+(G?'CI/CDへの統合':'CI/CD Integration')+'\n\n';
  doc+='```yaml\n# .github/workflows/migrate.yml\njobs:\n  migrate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: '+(G?'マイグレーション実行':'Run migrations')+'\n        env:\n          DATABASE_URL: ${{ secrets.DATABASE_URL }}\n        run: |\n';
  if(isPy)        doc+='          alembic upgrade head\n';
  else if(isBaaS) doc+='          supabase db push --linked\n';
  else if(orm.name==='Prisma ORM') doc+='          npx prisma migrate deploy\n';
  else            doc+='          npx drizzle-kit migrate:pg\n';
  doc+='```\n\n';

  // Safety checklist
  doc+='## '+(G?'マイグレーション安全チェックリスト':'Migration Safety Checklist')+'\n\n';
  doc+='- [ ] '+(G?'マイグレーション前にDBバックアップを取得':'Take DB backup before migration')+'\n';
  doc+='- [ ] '+(G?'ステージング環境で事前検証済み':'Pre-validated on staging environment')+'\n';
  doc+='- [ ] '+(G?'ダウンマイグレーション (rollback) を実装済み':'Downgrade (rollback) implemented')+'\n';
  doc+='- [ ] '+(G?'大テーブル変更は低トラフィック時間帯に実行':'Large table changes scheduled during low-traffic window')+'\n';
  doc+='- [ ] '+(G?'NOT NULL追加はデフォルト値設定後に実行':'NOT NULL constraint added only after default value set')+'\n';
  doc+='- [ ] '+(G?'インデックス追加は CONCURRENTLY オプションを使用':'Use CONCURRENTLY option for index creation')+'\n';
  doc+='  ```sql\n  CREATE INDEX CONCURRENTLY idx_posts_user_id ON posts(user_id);\n  ```\n\n';

  doc+='---\n*'+(G?'DevForge v9 自動生成':'Generated by DevForge v9')+'*\n';
  S.files['docs/89_migration_strategy.md']=doc;
}

// doc 90: Backup & Disaster Recovery
function gen90(a,pn,G){
  var orm=_dbORM(a);
  var dbType=_dbType(a);
  var deploy=a.deploy||'';
  var isBaaS=orm.isBaaS;
  var isNeon=/Neon/i.test(a.database||'');
  var isSupabase=/Supabase/i.test(a.backend||a.database||'');
  var isPlanetScale=/PlanetScale/i.test(a.database||'');

  var doc='';
  doc+='# '+(G?'バックアップ＆ディザスタリカバリ':'Backup & Disaster Recovery')+'\n\n';
  doc+=(G
    ?'> **プロジェクト**: '+pn+' | **DB**: '+(a.database||'PostgreSQL')+'\n\n'
    :'> **Project**: '+pn+' | **DB**: '+(a.database||'PostgreSQL')+'\n\n'
  );

  // RTO/RPO definitions
  doc+='## '+(G?'RTO / RPO 目標':'RTO / RPO Targets')+'\n\n';
  doc+='| '+(G?'指標':'Metric')+' | '+(G?'定義':'Definition')+' | '+(G?'目標値':'Target')+' |\n';
  doc+='|------|---------|------|\n';
  doc+='| RTO | '+(G?'復旧時間目標 (Recovery Time Objective)':'Recovery Time Objective')+' | '+(G?'< 1時間 (本番) / < 15分 (クリティカル)':'< 1h (production) / < 15min (critical)')+' |\n';
  doc+='| RPO | '+(G?'目標復旧時点 (Recovery Point Objective)':'Recovery Point Objective')+' | '+(G?'< 1時間 (標準) / < 5分 (PITR有効時)':'< 1h (standard) / < 5min (with PITR)')+' |\n';
  doc+='\n';

  // Backup strategies table
  doc+='## '+(G?'バックアップ戦略':'Backup Strategies')+'\n\n';
  doc+='| '+(G?'種別':'Type')+' | RTO | RPO | '+(G?'説明':'Description')+' | '+(G?'ツール':'Tools')+' |\n';
  doc+='|------|-----|-----|---------|------|\n';
  BACKUP_STRATEGIES.forEach(function(s){
    doc+='| **'+(G?s.ja:s.en)+'** | '+(G?s.rto:s.rto_en)+' | '+(G?s.rpo:s.rpo_en)+' | '+(G?s.ja_desc:s.en_desc)+' | `'+s.tools+'` |\n';
  });
  doc+='\n';

  // Platform-specific backup
  doc+='## '+(G?'プラットフォーム別バックアップ設定':'Platform-Specific Backup Configuration')+'\n\n';

  if(isNeon){
    doc+='### Neon (PostgreSQL)\n\n';
    doc+=(G
      ?'Neon はデフォルトで **継続的バックアップ** と **PITR** (7日間) を提供します。\n\n'
      :'Neon provides **continuous backup** and **PITR** (7 days) by default.\n\n'
    );
    doc+='```bash\n# Neon CLI: ブランチを使ったバックアップとリストア\nnpx neonctl branches create --name backup/$(date +%Y%m%d)  # '+(G?'スナップショット代わりのブランチ作成':'Create branch as snapshot')+'\nnpx neonctl branches list\nnpx neonctl restore <main> --timestamp "2024-01-15T10:00:00Z"  # '+(G?'特定時点に復元':'Restore to specific point')+'\n```\n\n';
  } else if(isSupabase||isBaaS){
    doc+='### Supabase\n\n';
    doc+=(G
      ?'Supabase は **プロジェクトバックアップ** を毎日自動実行します (Pro以上)。\n\n'
      :'Supabase automatically performs **project backups** daily (Pro plan and above).\n\n'
    );
    doc+='```bash\n# Supabase CLI: バックアップとリストア\nsupabase db dump -f backup.sql                # '+(G?'論理バックアップ':'Logical backup')+'\nsupabase db restore -f backup.sql             # '+(G?'リストア':'Restore')+'\n\n# Dashboard: Settings > Database > Backups\n# Pro: '+(G?'日次バックアップ + PITR 7日間':'Daily backup + PITR 7 days')+'\n```\n\n';
  } else {
    doc+='### '+(G?'セルフホスト PostgreSQL':'Self-hosted PostgreSQL')+'\n\n';
    doc+='```bash\n# '+(G?'論理バックアップ (pg_dump)':'Logical backup (pg_dump)')+'\npg_dump --format=custom --compress=9 \\\n  --file=backup_$(date +%Y%m%d_%H%M%S).dump \\\n  $DATABASE_URL\n\n# '+(G?'圧縮バックアップをS3に保存':'Store compressed backup to S3')+'\naws s3 cp backup_*.dump s3://your-bucket/db-backups/\n\n# '+(G?'WAL-G で継続的バックアップ':'Continuous backup with WAL-G')+'\n# https://github.com/wal-g/wal-g\nwal-g backup-push $PGDATA\nwal-g wal-push $WAL_FILE\n\n# '+(G?'リストア':'Restore')+'\npg_restore --dbname=mydb --format=custom backup.dump\n```\n\n';
  }

  // Backup automation
  doc+='## '+(G?'バックアップ自動化 (GitHub Actions)':'Backup Automation (GitHub Actions)')+'\n\n';
  doc+='```yaml\n# .github/workflows/db-backup.yml\nname: '+(G?'日次DBバックアップ':'Daily DB Backup')+'\non:\n  schedule:\n    - cron: \'0 2 * * *\'  # UTC 02:00 '+(G?'毎日':'daily')+'\n\njobs:\n  backup:\n    runs-on: ubuntu-latest\n    steps:\n      - name: '+(G?'バックアップ実行':'Create backup')+'\n        env:\n          DATABASE_URL: ${{ secrets.DATABASE_URL }}\n        run: |\n          pg_dump --format=custom --compress=9 \\\n            --file=db_backup_$(date +%Y%m%d).dump \\\n            $DATABASE_URL\n\n      - name: '+(G?'S3にアップロード':'Upload to S3')+'\n        run: |\n          aws s3 cp db_backup_*.dump \\\n            s3://${{ secrets.BACKUP_BUCKET }}/db-backups/\n        env:\n          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}\n          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}\n```\n\n';

  // DR runbook
  doc+='## '+(G?'ディザスタリカバリランブック':'Disaster Recovery Runbook')+'\n\n';
  doc+='### '+(G?'インシデント発生時の対応手順':'Incident Response Steps')+'\n\n';
  doc+='```\n'+(G?'1. 影響範囲を特定 (モニタリングダッシュボード確認)':'1. Identify scope (check monitoring dashboard)')+'\n';
  doc+='   → '+(G?'読取不能 / 書込不能 / 完全停止 のどれか':'Read failure / write failure / complete outage')+'\n\n';
  doc+='2. '+(G?'最後の正常バックアップを確認':'Identify last known-good backup')+'\n';
  doc+='   → pg_stat_replication / '+(G?'バックアップログを確認':'check backup logs')+'\n\n';
  doc+='3. '+(G?'アプリをメンテナンスモードに切替':'Switch app to maintenance mode')+'\n';
  doc+='   → '+(G?'503レスポンスを返すか静的メンテナンスページを表示':'Return 503 or show static maintenance page')+'\n\n';
  doc+='4. '+(G?'リストア実行':'Execute restore')+'\n';
  doc+=(isNeon
    ?'   → neonctl restore main --timestamp "YYYY-MM-DDTHH:MM:SSZ"\n'
    :(isSupabase||isBaaS)
    ?'   → Supabase Dashboard > Backups > Restore\n'
    :'   → pg_restore --dbname=mydb backup.dump\n'
  );
  doc+='5. '+(G?'アプリ接続確認 + スモークテスト':'Verify app connection + smoke tests')+'\n';
  doc+='6. '+(G?'メンテナンスモード解除':'Exit maintenance mode')+'\n';
  doc+='7. '+(G?'ポストモーテム実施 (24時間以内)':'Conduct postmortem (within 24h)')+'\n';
  doc+='```\n\n';

  // Monitoring
  doc+='## '+(G?'バックアップ監視アラート':'Backup Monitoring Alerts')+'\n\n';
  doc+='| '+(G?'アラート':'Alert')+' | '+(G?'条件':'Condition')+' | '+(G?'アクション':'Action')+' |\n';
  doc+='|------|---------|------|\n';
  doc+='| '+(G?'バックアップ未実行':'Backup missing')+' | '+(G?'24時間以上バックアップなし':'No backup for 24+ hours')+' | '+(G?'PagerDuty通知':'PagerDuty alert')+' |\n';
  doc+='| '+(G?'バックアップサイズ異常':'Backup size anomaly')+' | '+(G?'前回比±30%以上':'±30% vs previous')+' | '+(G?'SlackアラートとDBA確認':'Slack alert + DBA review')+' |\n';
  doc+='| '+(G?'リストア未テスト':'Restore untested')+' | '+(G?'30日以上リストアテストなし':'No restore test in 30 days')+' | '+(G?'月次リストア演習を実施':'Monthly restore drill')+' |\n';
  doc+='\n';

  // DR exercise schedule
  doc+='## '+(G?'DR演習スケジュール':'DR Exercise Schedule')+'\n\n';
  doc+='| '+(G?'演習':'Exercise')+' | '+(G?'頻度':'Frequency')+' | '+(G?'担当':'Owner')+' |\n';
  doc+='|------|---------|------|\n';
  doc+='| '+(G?'バックアップリストアテスト':'Backup restore test')+' | '+(G?'月次':'Monthly')+' | '+(G?'バックエンドエンジニア':'Backend Engineer')+' |\n';
  doc+='| '+(G?'フルDR演習':'Full DR drill')+' | '+(G?'四半期':'Quarterly')+' | '+(G?'全チーム':'All team')+' |\n';
  doc+='| '+(G?'バックアップ整合性チェック':'Backup integrity check')+' | '+(G?'週次':'Weekly')+' | '+(G?'自動スクリプト':'Automated script')+' |\n';
  doc+='\n';

  doc+='---\n*'+(G?'DevForge v9 自動生成':'Generated by DevForge v9')+'*\n';
  S.files['docs/90_backup_disaster_recovery.md']=doc;
}
