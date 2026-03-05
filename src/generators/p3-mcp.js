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
  gen132(a,pn);
}

function gen132(a,pn){
  const G=S.genLang==='ja';
  const lv132=S.skillLv!=null?S.skillLv:(S.skill==='beginner'?1:S.skill==='pro'?5:3);
  const isBeg132=lv132<=1;
  const isPro132=lv132>=5;
  const scale132=a.scale||'medium';
  let doc='# '+(G?'MCPインテグレーションガイド':'MCP Integration Guide')+'\n';
  doc+='> '+pn+' | '+(G?'Model Context Protocol 完全ガイド':'Complete Guide to Model Context Protocol')+'\n\n';

  if(isBeg132){
    doc+='## '+(G?'§0 MCPとは？（入門）':'§0 What is MCP? (Introduction)')+'\n\n';
    doc+=(G?'**MCP (Model Context Protocol)** は AI アシスタント (Claude / Cursor など) が外部ツールやデータに安全にアクセスするための標準プロトコルです。':'**MCP (Model Context Protocol)** is a standard protocol that lets AI assistants (Claude, Cursor, etc.) safely access external tools and data.')+'\n\n';
    doc+='### '+(G?'最初の3ステップ':'First 3 Steps')+'\n\n';
    doc+='1. **'+(G?'設定ファイルを確認':'Check config')+`**: \`mcp-config.json\` ${G?'がルートディレクトリにあることを確認':'exists in the root directory'}\n`;
    doc+='2. **'+(G?'AIツールに接続':'Connect AI tool')+`**: ${G?'Claude Code / Cursor の設定で `mcp-config.json` を読み込む':'Load `mcp-config.json` in Claude Code / Cursor settings'}\n`;
    doc+='3. **'+(G?'ツールを試す':'Try a tool')+`**: ${G?'「プロジェクトのファイル一覧を表示して」とAIに依頼':'Ask AI: "Show me the file list for this project"'}\n\n`;
  }

  doc+='## §1 '+(G?'MCPアーキテクチャ概要':'MCP Architecture Overview')+'\n\n';
  doc+=(G?'Model Context Protocol (MCP) は AI エージェントとツール/データソースを安全に接続するオープンプロトコルです。':'Model Context Protocol (MCP) is an open protocol that safely connects AI agents with tools and data sources.')+'\n\n';
  doc+='```\n'+(G?'AIクライアント':'AI Client')+'  ←──MCP──→  MCPサーバー  ←──→  データソース\n(Claude/Cursor)          (stdio/SSE)           (DB/API/FS)\n```\n\n';
  doc+='### '+(G?'トランスポート方式':'Transport Types')+'\n';
  doc+='| '+(G?'方式':'Type')+' | '+(G?'用途':'Use Case')+' | '+(G?'特徴':'Characteristics')+'|\n';
  doc+='|---|---|---|\n';
  doc+='| **stdio** | '+(G?'ローカルプロセス':'Local process')+' | '+(G?'低遅延・シンプル':'Low latency, simple')+' |\n';
  doc+='| **SSE** | '+(G?'リモートサーバー':'Remote server')+' | '+(G?'HTTP経由・スケーラブル':'Over HTTP, scalable')+' |\n';
  doc+='| **Streamable HTTP** | '+(G?'クラウドデプロイ':'Cloud deploy')+' | '+(G?'ステートレス・MCP v2':'Stateless, MCP v2')+' |\n\n';

  doc+='### '+(G?'メッセージフロー':'Message Flow')+'\n```\n';
  doc+='1. initialize    → '+(G?'ケーパビリティ交換':'Capability exchange')+'\n';
  doc+='2. tools/list    → '+(G?'利用可能ツール一覧取得':'Get available tools')+'\n';
  doc+='3. tools/call    → '+(G?'ツール実行':'Execute tool')+'\n';
  doc+='4. resources/read→ '+(G?'リソース読み取り':'Read resource')+'\n```\n\n';

  doc+='### '+(G?'MCPシーケンス図':'MCP Sequence Diagram')+'\n\n';
  doc+='```mermaid\nsequenceDiagram\n  participant L as LLM\n  participant C as MCP Client\n  participant S as MCP Server\n  participant D as Data Source\n  L->>C: tools/call (tool_name, args)\n  C->>S: JSON-RPC request\n  S->>D: Query / Execute\n  D-->>S: Result\n  S-->>C: JSON-RPC response\n  C-->>L: Tool result\n```\n\n';

  doc+='## §2 '+(G?'カスタムMCPサーバー開発':'Custom MCP Server Development')+'\n\n';
  doc+='```typescript\n// '+pn+' MCP Server\nimport { Server } from "@modelcontextprotocol/sdk/server/index.js";\nimport { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";\n\nconst server = new Server(\n  { name: "'+pn.toLowerCase().replace(/\s+/g,'-')+'-mcp", version: "1.0.0" },\n  { capabilities: { tools: {}, resources: {} } }\n);\n\nserver.setRequestHandler("tools/call", async (req) => {\n  const { name, arguments: args } = req.params;\n  switch (name) {\n    case "get_project_context":\n      return { content: [{ type: "text", text: JSON.stringify(projectContext) }] };\n    default:\n      throw new Error(`Unknown tool: ${name}`);\n  }\n});\n\nconst transport = new StdioServerTransport();\nawait server.connect(transport);\n```\n\n';

  doc+='## §3 '+(G?'MCPセキュリティモデル':'MCP Security Model')+'\n\n';
  doc+='### '+(G?'ツール承認フロー':'Tool Approval Flow')+'\n';
  doc+=(G?'- **ユーザー確認**: 破壊的操作 (DELETE/WRITE) は必ず確認ダイアログ表示\n- **スコープ制限**: ツールごとに最小権限を定義\n- **サンドボックス**: ファイルシステムアクセスはワークスペースに限定\n- **監査ログ**: 全ツール呼び出しをログ記録':'- **User confirmation**: Destructive operations (DELETE/WRITE) always show confirmation dialog\n- **Scope restriction**: Define minimum permissions per tool\n- **Sandbox**: File system access limited to workspace directory\n- **Audit log**: Log all tool invocations')+'\n\n';
  doc+='### '+(G?'権限境界マトリクス':'Permission Boundary Matrix')+'\n';
  doc+='| '+(G?'操作':'Operation')+' | '+(G?'リスク':'Risk')+' | '+(G?'要確認':'Confirm Required')+'|\n';
  doc+='|---|---|---|\n';
  doc+='| '+(G?'ファイル読み取り':'File read')+' | Low | No |\n';
  doc+='| '+(G?'ファイル書き込み':'File write')+' | Medium | Yes |\n';
  doc+='| DB '+(G?'読み取り':'read')+' | Low | No |\n';
  doc+='| DB '+(G?'更新・削除':'update/delete')+' | High | Yes |\n';
  doc+='| '+(G?'外部API呼び出し':'External API call')+' | Medium | Yes |\n\n';

  doc+='## §4 '+(G?'MCPデバッグ・テスト':'MCP Debug & Testing')+'\n\n';
  doc+='```bash\n# '+(G?'MCP Inspector でサーバーをテスト':'Test server with MCP Inspector')+'\nnpx @modelcontextprotocol/inspector\n\n# '+(G?'stdio接続テスト':'stdio connection test')+'\necho \'{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{}}}\' | node mcp-server.js\n\n# '+(G?'ログ監視 (Claude Code)':'Log monitoring (Claude Code)')+'\ntail -f ~/.config/claude/logs/mcp*.log\n```\n\n';
  doc+='### '+(G?'よくあるトラブル':'Common Troubleshooting')+'\n';
  doc+=(G?'| 症状 | 原因 | 解決策 |\n|---|---|---|\n| サーバー起動しない | Node.jsバージョン不一致 | Node.js 18+ 確認 |\n| tools/list が空 | ハンドラ未登録 | setRequestHandler確認 |\n| 接続タイムアウト | stdio バッファリング | process.stdout.setBlocking(true) |\n| 権限エラー | ファイルパス制限 | allowedPaths設定確認 |':'| Symptom | Cause | Solution |\n|---|---|---|\n| Server does not start | Node.js version mismatch | Verify Node.js 18+ |\n| tools/list is empty | Handler not registered | Check setRequestHandler |\n| Connection timeout | stdio buffering | process.stdout.setBlocking(true) |\n| Permission error | File path restriction | Check allowedPaths config |')+'\n\n';

  doc+='## §5 MCP + CI/CD '+(G?'統合':'Integration')+'\n\n';
  doc+='```yaml\n# .github/workflows/mcp-test.yml\nname: MCP Server Tests\non: [push, pull_request]\njobs:\n  mcp-test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: "20" }\n      - run: npm ci\n      - name: '+(G?'MCPサーバー起動テスト':'Test MCP server startup')+'\n        run: timeout 5 node mcp-server.js <<< \'{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{}}}\' || true\n      - name: '+(G?'ツール一覧テスト':'Test tools list')+'\n        run: node test/mcp-integration.test.js\n```\n\n';
  doc+='### '+(G?'MCPサーバー統合テスト例':'MCP Server Integration Test Example')+'\n```typescript\nimport { Client } from "@modelcontextprotocol/sdk/client/index.js";\nimport { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";\n\nconst transport = new StdioClientTransport({\n  command: "node", args: ["mcp-server.js"]\n});\nconst client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });\nawait client.connect(transport);\nconst tools = await client.listTools();\nconsole.assert(tools.tools.length > 0, "Should have at least one tool");\nawait client.close();\n```\n\n';
  if(scale132!=='solo'){
    doc+='## §6 '+(G?'マルチエージェントMCPオーケストレーション':'Multi-Agent MCP Orchestration')+'\n\n';
    doc+=(G?'チーム規模のプロジェクトでは、複数のAIエージェントが同一MCPサーバーを共有・協調します。':'In team-scale projects, multiple AI agents share and collaborate through the same MCP server.')+'\n\n';
    doc+='```mermaid\nflowchart TD\n  O[Orchestrator Agent] --> A1[Agent: Planner]\n  O --> A2[Agent: Coder]\n  O --> A3[Agent: Reviewer]\n  A1 --> MCP[MCP Server]\n  A2 --> MCP\n  A3 --> MCP\n  MCP --> DB[(Database)]\n  MCP --> FS[File System]\n  MCP --> API[External API]\n```\n\n';
    doc+='### '+(G?'オーケストレーション設計パターン':'Orchestration Design Patterns')+'\n\n';
    doc+='| '+(G?'パターン':'Pattern')+' | '+(G?'用途':'Use Case')+' | '+(G?'実装':'Implementation')+'|\n';
    doc+='|---|---|---|\n';
    doc+='| Sequential | '+(G?'依存タスク':'Dependent tasks')+' | plan.md → code → review |\n';
    doc+='| Parallel | '+(G?'独立タスク':'Independent tasks')+' | FE + BE 同時開発 |\n';
    doc+='| Hierarchical | '+(G?'複雑なプロジェクト':'Complex projects')+' | '+(G?'オーケストレーター → サブエージェント':'Orchestrator → Sub-agents')+'|\n\n';
  }

  if(isPro132){
    doc+='## §7 '+(G?'OAuth 2.1スコープとMCPセキュリティ境界':'OAuth 2.1 Scopes & MCP Security Boundaries')+'\n\n';
    doc+=(G?'プロダクション環境では、MCPサーバーへのアクセスをOAuth 2.1スコープで細粒度制御します。':'In production, control MCP server access at fine granularity using OAuth 2.1 scopes.')+'\n\n';
    doc+='```typescript\n// MCP OAuth 2.1 scope definitions\nconst MCP_SCOPES = {\n  "mcp:read":    "Read-only access to resources",\n  "mcp:write":   "Create and update resources",\n  "mcp:delete":  "Delete resources (requires approval)",\n  "mcp:admin":   "Full administrative access",\n  "mcp:tools":   "Execute registered tools",\n  "mcp:audit":   "Read audit logs"\n};\n\n// Scope validation middleware\nfunction validateMCPScope(required: string) {\n  return (req: Request) => {\n    const token = req.headers.authorization?.split(" ")[1];\n    const payload = jwt.verify(token, process.env.JWT_SECRET!);\n    if (!payload.scopes?.includes(required)) {\n      throw new Error(`Missing scope: ${required}`);\n    }\n  };\n}\n```\n\n';
    doc+='### '+(G?'最小権限の原則 (MCP適用例)':'Principle of Least Privilege (MCP Application)')+'\n\n';
    doc+='| '+(G?'エージェントタイプ':'Agent Type')+' | '+(G?'付与スコープ':'Granted Scopes')+'|\n';
    doc+='|---|---|\n';
    doc+='| Planner | mcp:read |\n';
    doc+='| Coder | mcp:read, mcp:write, mcp:tools |\n';
    doc+='| Reviewer | mcp:read, mcp:audit |\n';
    doc+='| Orchestrator | mcp:read, mcp:write, mcp:tools, mcp:audit |\n\n';
  }

  doc+='---\n'+(G?'*DevForge v9 生成 | MCPインテグレーションガイド*':'*Generated by DevForge v9 | MCP Integration Guide*');
  S.files['docs/132_mcp_integration_guide.md']=doc;
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
    tool:G?'- APIキー管理\n- 使用量モニタリング\n- レート制限':'- API key management\n- Usage monitoring\n- Rate limiting',
    event:G?'- チケット重複防止\n- キャパシティ管理\n- キャンセル・返金処理':'- Duplicate ticket prevention\n- Capacity management\n- Cancellation & refund handling',
    creator:G?'- サブスク管理\n- コンテンツアクセス制御\n- クリエイターペイアウト':'- Subscription management\n- Content access control\n- Creator payouts',
    newsletter:G?'- 配信レート制限\n- バウンス・スパム管理\n- 開封率・クリック追跡':'- Delivery rate limiting\n- Bounce & spam management\n- Open/click tracking',
    gamify:G?'- ポイント不正防止\n- リアルタイムランキング更新\n- バッジアンロック検証':'- Point fraud prevention\n- Real-time leaderboard updates\n- Badge unlock validation',
    collab:G?'- OT/CRDT競合解決\n- バージョン管理\n- 権限管理':'- OT/CRDT conflict resolution\n- Version management\n- Permission management',
    devtool:G?'- APIキー発行・失効\n- Webhookシグネチャ検証\n- 使用量課金':'- API key issuance & revocation\n- Webhook signature verification\n- Usage-based billing',
    travel:G?'- 在庫・空き室管理\n- 複数通貨対応\n- キャンセルポリシー':'- Inventory & availability management\n- Multi-currency support\n- Cancellation policies',
    insurance:G?'- 保険証券管理\n- クレーム処理ワークフロー\n- コンプライアンス準拠':'- Policy management\n- Claims processing workflow\n- Regulatory compliance',
    media:G?'- CDN最適化\n- コンテンツ保護(DRM)\n- ストリーミング品質':'- CDN optimization\n- Content protection (DRM)\n- Streaming quality',
    government:G?'- セキュリティ審査・認定\n- 電子申請フォーム\n- 住民データ保護':'- Security certification\n- Electronic application forms\n- Citizen data protection',
    manufacturing:G?'- MES連携\n- 品質管理・検査記録\n- サプライチェーン可視化':'- MES integration\n- Quality control & inspection logs\n- Supply chain visibility',
    logistics:G?'- リアルタイム追跡\n- ルート最適化\n- 配送ステータス管理':'- Real-time tracking\n- Route optimization\n- Delivery status management',
    agriculture:G?'- センサーデータ収集\n- 収穫予測\n- 農薬・肥料記録':'- Sensor data collection\n- Harvest forecasting\n- Pesticide & fertilizer records',
    energy:G?'- リアルタイム電力モニタリング\n- ピーク需要管理\n- スマートグリッド連携':'- Real-time power monitoring\n- Peak demand management\n- Smart grid integration',
    automation:G?'- ワークフロー実行保証\n- エラー・リトライ管理\n- ステータス追跡':'- Workflow execution guarantee\n- Error & retry management\n- Status tracking',
    ai:G?'- プロンプトインジェクション対策\n- トークンコスト管理\n- 出力モデレーション':'- Prompt injection prevention\n- Token cost management\n- Output moderation'
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
    newsletter:G?['postgres — 配信統計分析']:['postgres — Send analytics'],
    community:G?['playwright — モデレーション・通報フローテスト']:['playwright — Moderation & reporting flow tests'],
    booking:G?['postgres — 予約競合・重複テスト']:['postgres — Booking conflict & duplicate tests'],
    marketplace:G?['stripe — 二者間決済テスト']:['stripe — Two-sided payment tests'],
    realestate:G?['postgres — 契約・更新スケジュールクエリ']:['postgres — Contract & renewal schedule queries'],
    legal:G?['playwright — 電子署名・承認フローテスト']:['playwright — E-signature & approval flow tests'],
    hr:G?['postgres — 採用フロー・評価スコアクエリ']:['postgres — Hiring flow & evaluation score queries'],
    content:G?['playwright — 全文検索・アクセス権テスト']:['playwright — Full-text search & access control tests'],
    analytics:G?['postgres — KPI集計・ダッシュボードクエリ']:['postgres — KPI aggregation & dashboard queries'],
    travel:G?['postgres — 空き室・在庫競合テスト']:['postgres — Availability & inventory conflict tests'],
    insurance:G?['postgres — 保険証券・クレーム処理クエリ']:['postgres — Policy & claims processing queries'],
    media:G?['playwright — ストリーミング・コンテンツアクセステスト']:['playwright — Streaming & content access tests'],
    government:G?['playwright — 電子申請フォームE2Eテスト']:['playwright — Electronic application form E2E tests'],
    manufacturing:G?['postgres — 生産記録・品質管理クエリ']:['postgres — Production records & quality management queries'],
    logistics:G?['postgres — 配送追跡・ルート最適化クエリ']:['postgres — Delivery tracking & route optimization queries'],
    agriculture:G?['docker — センサーデータシミュレーション']:['docker — Sensor data simulation'],
    energy:G?['postgres — 電力データ集計・ピーク需要クエリ']:['postgres — Power data aggregation & peak demand queries'],
    portfolio:G?['playwright — ポートフォリオ・問い合わせフォームE2Eテスト']:['playwright — Portfolio & contact form E2E tests'],
    tool:G?['playwright — ツール機能・APIキーE2Eテスト']:['playwright — Tool features & API key E2E tests']
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
