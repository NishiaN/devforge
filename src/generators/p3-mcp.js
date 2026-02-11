/* ── Pillar ③ MCP (Phase B: Context-Aware) ── */
function genPillar3_MCP(a,pn){
  const G=S.genLang==='ja';
  const tools=(a.ai_tools||'Cursor').split(', ');
  const auth=resolveAuth(a);
  const arch=resolveArch(a);
  const archLabel=G?{baas:'BaaS統合型',bff:'BFF(API Routes)',split:'FE/BE分離',traditional:'従来型'}[arch.pattern]:{baas:'BaaS Integration',bff:'BFF (API Routes)',split:'FE/BE Split',traditional:'Traditional'}[arch.pattern];
  const er=inferER(a);

  S.files['.mcp/project-context.md']=`# ${pn} — MCP Project Context
## Project Overview
- Name: ${pn}
- Purpose: ${a.purpose||'N/A'}
- Stack: ${a.frontend||'React'} + ${a.backend||'Node.js'} + ${a.database||'PostgreSQL'}
- Architecture: ${archLabel}
- Auth SoT: ${auth.sot}
- Deploy: ${a.deploy||'Vercel'}${arch.pattern==='split'?' (FE) + Railway/Render (BE)':''}
${!isNone(a.mobile)?`- Mobile: ${a.mobile}\n`:''}${!isNone(a.payment)?`- Payment: ${a.payment}\n`:''}
## Key Entities
${a.data_entities||'users, items'}
${er.relationships.length?'\n## Relationships\n'+er.relationships.join('\n'):''}
## Dev Methods
${a.dev_methods||'TDD, BDD'}

## AI Tools
${tools.join(', ')}
`;

  // MCP servers adapt to stack
  const mcpServers={
    filesystem:{command:'npx',args:['-y','@anthropic/mcp-filesystem','/workspace']},
    context7:{command:'npx',args:['-y','@anthropic/mcp-context7']},
    playwright:{command:'npx',args:['-y','@anthropic/mcp-playwright']},
  };
  if(a.backend&&a.backend.includes('Supabase')){
    mcpServers.supabase={command:'npx',args:['-y','@anthropic/mcp-supabase']};
  }

  S.files['.mcp/tools-manifest.json']=JSON.stringify({
    schema:'1.0',project:pn,
    mcpServers:mcpServers,
    recommendations:G?['context7 — 最新ドキュメント参照','playwright — E2Eテスト自動化','filesystem — ファイル操作']:['context7 — Latest docs reference','playwright — E2E test automation','filesystem — File operations']
  },null,2);

  S.files['mcp-config.json']=JSON.stringify({
    mcpServers:{
      filesystem:{command:'npx',args:['-y','@anthropic/mcp-filesystem','.']},
      context7:{command:'npx',args:['-y','@anthropic/mcp-context7']},
    }
  },null,2);
}

