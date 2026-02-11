/* ── Pillar ③ MCP (Phase B: Context-Aware) ── */
function genPillar3_MCP(a,pn){
  const G=S.genLang==='ja';
  const tools=(a.ai_tools||'Cursor').split(', ');
  const auth=resolveAuth(a);
  const arch=resolveArch(a);
  const archLabel=G?{baas:'BaaS統合型',bff:'BFF(API Routes)',split:'FE/BE分離',traditional:'従来型'}[arch.pattern]:{baas:'BaaS Integration',bff:'BFF (API Routes)',split:'FE/BE Split',traditional:'Traditional'}[arch.pattern];
  const er=inferER(a);
  const domain=detectDomain(a.purpose)||'general';
  const be=a.backend||'Node.js + Express';
  const fe=a.frontend||'React + Next.js';

  // Enhanced Project Context with auth details, domain context, dev methods
  S.files['.mcp/project-context.md']=`# ${pn} — MCP Project Context

## Project Overview
- **Name**: ${pn}
- **Purpose**: ${a.purpose||'N/A'}
- **Domain**: ${domain}
- **Stack**: ${fe} + ${be} + ${a.database||'PostgreSQL'}
- **Architecture**: ${archLabel}
- **Deploy**: ${a.deploy||'Vercel'}${arch.pattern==='split'?' (FE) + Railway/Render (BE)':''}
${!isNone(a.mobile)?'- **Mobile**: '+a.mobile+'\n':''}${!isNone(a.payment)?'- **Payment**: '+a.payment+'\n':''}
## Authentication Details
- **Auth SoT**: ${auth.sot}
- **Token Type**: ${auth.tokenType}
- **Verification**: ${auth.tokenVerify}
- **Social Providers**: ${auth.social.join(', ')||'None'}

## Key Entities
${a.data_entities||'users, items'}
${er.relationships.length?'\n## Relationships\n'+er.relationships.join('\n'):''}

## Dev Methods
${a.dev_methods||'TDD, BDD'}

## AI Tools
${tools.join(', ')}

## Domain Context
${G?'このプロジェクトは':'This project is in the'} **${domain}** ${G?'ドメインです。以下の点に注意してください:':'domain. Focus on:'}
${_domainFocus(domain,G)}

## Generated File Structure
- \`.spec/\` — ${G?'仕様書5種':'5 spec docs'}
- \`.devcontainer/\` — ${G?'開発環境4種':'4 dev env files'}
- \`.mcp/\` — ${G?'MCP設定':'MCP config'}
- \`docs/\` — ${G?'31ドキュメント':'31 docs'}
- AI rules — CLAUDE.md, AI_BRIEF.md, .cursorrules, AGENTS.md, skills/
- CI/CD — .github/workflows/ci.yml
`;

  // Backend-specific MCP server selection
  const mcpServers={
    filesystem:{command:'npx',args:['-y','@modelcontextprotocol/server-filesystem','/workspace']},
    context7:{command:'npx',args:['-y','@anthropic/mcp-context7']},
    playwright:{command:'npx',args:['-y','@anthropic/mcp-playwright']},
  };

  // Add backend-specific servers
  if(be.includes('Supabase')){
    mcpServers.supabase={command:'npx',args:['-y','@modelcontextprotocol/server-supabase']};
  }
  if(be.includes('Firebase')){
    mcpServers.firebase={command:'npx',args:['-y','firebase-mcp-server']};
  }
  if(be.includes('Express')&&(a.database||'').includes('PostgreSQL')){
    mcpServers.postgres={command:'npx',args:['-y','@modelcontextprotocol/server-postgres']};
  }
  if(be.includes('Express')&&(a.database||'').includes('MongoDB')){
    mcpServers.mongodb={command:'npx',args:['-y','mongodb-mcp-server']};
  }
  if((a.dev_methods||'').includes('Docker')){
    mcpServers.docker={command:'docker',args:['run','-i','--rm','mcp/docker']};
  }

  // Domain-specific tool recommendations
  const domainTools=_domainTools(domain,G);

  S.files['.mcp/tools-manifest.json']=JSON.stringify({
    schema:'1.0',
    project:pn,
    mcpServers:mcpServers,
    recommendations:{
      core:G?['context7 — 最新ドキュメント参照','playwright — E2Eテスト自動化','filesystem — ファイル操作']:['context7 — Latest docs reference','playwright — E2E test automation','filesystem — File operations'],
      backend:be.includes('Supabase')?[G?'supabase — DB操作・認証・ストレージ':'supabase — DB ops, auth, storage']:be.includes('Firebase')?[G?'firebase — Firestore・Auth・Functions':'firebase — Firestore, Auth, Functions']:be.includes('PostgreSQL')?[G?'postgres — SQL実行・マイグレーション':'postgres — SQL execution, migrations']:[],
      domain:domainTools
    },
    categories:{
      dev:['filesystem','context7',be.includes('Supabase')?'supabase':be.includes('Firebase')?'firebase':be.includes('PostgreSQL')?'postgres':null].filter(Boolean),
      test:['playwright'],
      deploy:[(a.dev_methods||'').includes('Docker')?'docker':null].filter(Boolean)
    }
  },null,2);

  S.files['mcp-config.json']=JSON.stringify({
    mcpServers:mcpServers,
    environment:{
      SUPABASE_URL:be.includes('Supabase')?'${SUPABASE_URL}':'',
      SUPABASE_ANON_KEY:be.includes('Supabase')?'${SUPABASE_ANON_KEY}':'',
      FIREBASE_PROJECT_ID:be.includes('Firebase')?'${FIREBASE_PROJECT_ID}':'',
      DATABASE_URL:(a.database||'').includes('PostgreSQL')?'${DATABASE_URL}':'',
      MONGODB_URI:(a.database||'').includes('MongoDB')?'${MONGODB_URI}':''
    }
  },null,2);

  // New: .mcp/README.md with installation & usage guide
  S.files['.mcp/README.md']=`# MCP Configuration for ${pn}

## Overview
This directory contains **Model Context Protocol (MCP)** configuration for ${pn}.

MCP enables AI coding assistants (Claude Code, Cursor, Windsurf, etc.) to access project-specific context, databases, and tools.

## Installed MCP Servers
${Object.keys(mcpServers).map(k=>'- **'+k+'**: '+(G?_mcpDesc(k,'ja'):_mcpDesc(k,'en'))).join('\n')}

## Installation

### 1. Prerequisites
- Node.js 18+ (for npx servers)
${(a.dev_methods||'').includes('Docker')?'- Docker (for docker MCP server)\n':''}
### 2. Configure AI Tool
${G?'AI ツールの設定ファイルに `mcp-config.json` を追加してください:':'Add `mcp-config.json` to your AI tool config:'}

**Claude Code:**
\`\`\`bash
cp mcp-config.json ~/.config/claude/mcp-config.json
\`\`\`

**Cursor:**
\`\`\`bash
# Cursor settings → MCP → Import mcp-config.json
\`\`\`

### 3. Set Environment Variables
\`\`\`bash
${be.includes('Supabase')?'export SUPABASE_URL="https://xxx.supabase.co"\nexport SUPABASE_ANON_KEY="eyJ..."\n':''}${be.includes('Firebase')?'export FIREBASE_PROJECT_ID="your-project-id"\n':''}\${(a.database||'').includes('PostgreSQL')?'export DATABASE_URL="postgresql://..."\n':''}${(a.database||'').includes('MongoDB')?'export MONGODB_URI="mongodb://..."\n':''}
\`\`\`

## Usage Examples

${be.includes('Supabase')?`### Supabase MCP
\`\`\`
${G?'「Userテーブルの全レコードを取得して」':'Get all records from User table'}
${G?'「新しいPostを作成して」':'Create a new Post'}
${G?'「認証ユーザーのプロフィールを表示して」':'Show authenticated user profile'}
\`\`\`
`:''}${be.includes('Firebase')?`### Firebase MCP
\`\`\`
${G?'「usersコレクションを取得して」':'Fetch users collection'}
${G?'「Firebase Authで新規ユーザー作成」':'Create new user with Firebase Auth'}
\`\`\`
`:''}
### Context7 MCP
\`\`\`
${G?'「Next.jsの最新ドキュメントを参照して」':'Reference latest Next.js docs'}
${G?'「Reactの公式ガイドを検索して」':'Search React official guide'}
\`\`\`

### Playwright MCP
\`\`\`
${G?'「ログインフローのE2Eテストを書いて」':'Write E2E test for login flow'}
${G?'「商品購入のテストシナリオを実行して」':'Run test scenario for product purchase'}
\`\`\`

## Troubleshooting

### MCP Server Not Found
\`\`\`bash
# Verify npx can access servers
npx -y @modelcontextprotocol/server-filesystem --version
\`\`\`

### Permission Denied
\`\`\`bash
# Check file permissions
chmod +x /workspace
\`\`\`

### Connection Errors
${G?'- 環境変数が正しく設定されているか確認してください\n- ネットワーク接続を確認してください':'- Verify environment variables are set correctly\n- Check network connectivity'}

## Resources
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Available MCP Servers](https://github.com/modelcontextprotocol/servers)
`;
}

// Helper: Domain-specific focus points
function _domainFocus(domain,G){
  const focuses={
    education:G?'- 学習進捗の正確な管理\n- WCAG準拠のアクセシビリティ\n- データ保護(FERPA/GDPR)':'- Accurate learning progress tracking\n- WCAG accessibility compliance\n- Data protection (FERPA/GDPR)',
    ec:G?'- 在庫同期・競合制御\n- 決済フローの完全性\n- スパイクトラフィック対策':'- Inventory sync & concurrency control\n- Payment flow integrity\n- Spike traffic handling',
    marketplace:G?'- 二者間決済・エスクロー\n- レビュー・評価システム\n- メッセージング機能':'- Two-sided payments & escrow\n- Review & rating system\n- Messaging feature',
    community:G?'- 投稿フィルタリング\n- 通報・モデレーション\n- スパム対策':'- Content filtering\n- Reporting & moderation\n- Spam prevention',
    booking:G?'- 同時予約競合\n- キャンセル・変更処理\n- タイムゾーン処理':'- Concurrent booking conflicts\n- Cancellation/modification handling\n- Timezone handling',
    saas:G?'- マルチテナント分離(RLS)\n- プラン別機能制限\n- サブスク管理':'- Multi-tenant isolation (RLS)\n- Plan-based feature restrictions\n- Subscription management',
    fintech:G?'- トランザクション完全性(ACID)\n- 二重処理防止\n- PCI DSS準拠':'- Transaction integrity (ACID)\n- Double-processing prevention\n- PCI DSS compliance',
    iot:G?'- デバイス認証・認可\n- オフライン動作\n- ファームウェア更新':'- Device authentication & authorization\n- Offline operation\n- Firmware updates',
    realestate:G?'- 契約・更新管理\n- 修繕リクエスト追跡\n- 収支レポート':'- Contract & renewal management\n- Repair request tracking\n- Financial reports',
    legal:G?'- 電子署名連携\n- バージョン管理\n- 承認ワークフロー':'- E-signature integration\n- Version control\n- Approval workflow',
    hr:G?'- 応募者トラッキング\n- 面接スケジュール\n- 評価・スコアカード':'- Applicant tracking\n- Interview scheduling\n- Evaluation scorecards',
    health:G?'- HIPAA準拠\n- カルテ管理\n- 予約・処方箋':'- HIPAA compliance\n- Medical records management\n- Appointments & prescriptions',
    content:G?'- 全文検索\n- バージョン履歴\n- アクセス権限':'- Full-text search\n- Version history\n- Access control',
    analytics:G?'- KPI集計\n- グラフ表示\n- リアルタイム更新':'- KPI aggregation\n- Chart display\n- Real-time updates',
    portfolio:G?'- SEO最適化\n- レスポンシブデザイン\n- お問い合わせフォーム':'- SEO optimization\n- Responsive design\n- Contact form',
    tool:G?'- APIキー管理\n- 使用量モニタリング\n- レート制限':'- API key management\n- Usage monitoring\n- Rate limiting'
  };
  return focuses[domain]||'';
}

// Helper: Domain-specific MCP tool recommendations
function _domainTools(domain,G){
  const tools={
    education:G?['context7 — 教育系APIドキュメント参照']:['context7 — Education API docs'],
    ec:G?['playwright — 購入フローE2Eテスト']:['playwright — Purchase flow E2E tests'],
    saas:G?['postgres/supabase — RLS設定・マルチテナント']:['postgres/supabase — RLS config, multi-tenant'],
    fintech:G?['postgres — トランザクションテスト']:['postgres — Transaction testing'],
    iot:G?['docker — デバイスシミュレーション']:['docker — Device simulation'],
    health:G?['playwright — HIPAA準拠テスト']:['playwright — HIPAA compliance tests'],
    ai:G?['context7 — AI APIドキュメント']:['context7 — AI API docs'],
    automation:G?['playwright — ワークフロー自動テスト']:['playwright — Workflow automation tests'],
    event:G?['postgres — イベント集計']:['postgres — Event aggregation'],
    gamify:G?['postgres — ポイント・ランキング計算']:['postgres — Point & ranking calculation'],
    collab:G?['docker — リアルタイム同期テスト']:['docker — Real-time sync tests'],
    devtool:G?['postgres — Webhook配信ログ']:['postgres — Webhook delivery logs'],
    creator:G?['stripe — サブスク決済テスト']:['stripe — Subscription payment tests'],
    newsletter:G?['postgres — 配信統計分析']:['postgres — Send analytics']
  };
  return tools[domain]||[];
}

// Helper: MCP server descriptions
function _mcpDesc(name,lang){
  const descs={
    filesystem:{ja:'ファイル読み書き・検索',en:'File read/write & search'},
    context7:{ja:'最新ドキュメント参照',en:'Latest docs reference'},
    playwright:{ja:'E2Eテスト自動化',en:'E2E test automation'},
    supabase:{ja:'Supabase DB操作・認証',en:'Supabase DB ops & auth'},
    firebase:{ja:'Firebase Firestore・Auth',en:'Firebase Firestore & Auth'},
    postgres:{ja:'PostgreSQL SQL実行',en:'PostgreSQL SQL execution'},
    mongodb:{ja:'MongoDB クエリ実行',en:'MongoDB query execution'},
    docker:{ja:'Dockerコンテナ操作',en:'Docker container operations'}
  };
  return (descs[name]||{})[lang]||name;
}
