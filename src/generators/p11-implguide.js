/* ═══ Pillar 11: Implementation Intelligence ═══ */

function genPillar11_ImplIntelligence(a,pn){
  const G=S.genLang==='ja';
  const domain=detectDomain(a.purpose)||'_default';
  const appType=detectAppType(a);
  const aiLevel=a.ai_auto||'none';
  const frontend=a.frontend||'React + Vite';
  const backend=a.backend||'Supabase';
  const db=a.database||'PostgreSQL';

  // ── docs/39_implementation_playbook.md ──
  const pattern=DOMAIN_IMPL_PATTERN[domain]||DOMAIN_IMPL_PATTERN._default;
  const appTypePattern=APP_TYPE_MAP[appType]||APP_TYPE_MAP.spa;
  const entities=(a.data_entities||'User').split(',').map(e=>e.trim());

  let doc39='';
  doc39+='# '+(G?'実装プレイブック':'Implementation Playbook')+'\n\n';
  doc39+=(G?'**プロジェクト**：':'**Project**: ')+pn+'\n';
  doc39+=(G?'**業種**：':'**Domain**: ')+(G?'検知結果 - ':'Detected - ')+domain+'\n';
  doc39+=(G?'**アプリタイプ**：':'**App Type**: ')+appType+'\n';
  doc39+=(G?'**生成日**：':'**Generated**: ')+new Date().toISOString().split('T')[0]+'\n\n';
  doc39+='---\n\n';

  // 1. Domain-Specific Implementation Patterns
  doc39+='## '+(G?'1. 業種別実装パターン':'1. Domain-Specific Implementation Patterns')+'\n\n';
  doc39+='### '+(G?'推奨実装手法':'Recommended Practices')+'\n';
  (G?pattern.impl_ja:pattern.impl_en).forEach((p,i)=>{
    doc39+=(i+1)+'. '+p+'\n';
  });
  doc39+='\n### '+(G?'ガードレール（防止すべき典型バグ）':'Guard Rails (Typical Bugs to Prevent)')+'\n';
  (G?pattern.guard_ja:pattern.guard_en).forEach((g,i)=>{
    doc39+='- ❌ '+g+'\n';
  });
  doc39+='\n### '+(G?'擬似コードテンプレート':'Pseudo-code Template')+'\n';
  doc39+='```javascript\n';
  doc39+=pattern.pseudo+'\n';
  doc39+='```\n\n';

  // 2. Stack-Specific Guidance
  doc39+='## '+(G?'2. スタック固有ガイダンス':'2. Stack-Specific Guidance')+'\n\n';
  doc39+='### '+(G?'フロントエンド：':'Frontend: ')+frontend+'\n';
  if(frontend.includes('Next')){
    doc39+=(G?'- App Routerを使用（Pages Routerは非推奨）\n':'- Use App Router (Pages Router deprecated)\n');
    doc39+=(G?'- サーバーコンポーネントを優先、クライアントコンポーネントは必要最小限\n':'- Prefer Server Components, minimize Client Components\n');
    doc39+=(G?'- データフェッチはasync/await直接記述\n':'- Data fetching with async/await directly\n');
  }else if(frontend.includes('Vite')||frontend.includes('SPA')){
    doc39+=(G?'- 状態管理はZustand推奨（Reduxは大規模のみ）\n':'- State management with Zustand (Redux for large-scale only)\n');
    doc39+=(G?'- コード分割はReact.lazy+Suspense\n':'- Code splitting with React.lazy + Suspense\n');
    doc39+=(G?'- ビルド最適化はVite plugin-react-swc\n':'- Build optimization with Vite plugin-react-swc\n');
  }else if(frontend.includes('Vue')){
    doc39+=(G?'- Composition API優先\n':'- Prefer Composition API\n');
    doc39+=(G?'- 状態管理はPinia\n':'- State management with Pinia\n');
    doc39+=(G?'- TypeScript strict mode推奨\n':'- Recommend TypeScript strict mode\n');
  }
  doc39+='\n### '+(G?'バックエンド：':'Backend: ')+backend+'\n';
  if(backend.includes('Supabase')){
    doc39+=(G?'- Row Level Security (RLS)を全テーブルに設定\n':'- Set Row Level Security (RLS) on all tables\n');
    doc39+=(G?'- Supabase Edgeは軽量処理のみ（重い処理は別途API）\n':'- Supabase Edge for lightweight tasks only (heavy tasks in separate API)\n');
    doc39+=(G?'- Realtime subscriptionsは必要最小限（コスト注意）\n':'- Minimize Realtime subscriptions (cost consideration)\n');
  }else if(backend.includes('Firebase')){
    doc39+=(G?'- Firestore Security Rulesを厳格に設定\n':'- Strictly configure Firestore Security Rules\n');
    doc39+=(G?'- Cloud Functionsは第2世代推奨\n':'- Recommend Cloud Functions Gen 2\n');
    doc39+=(G?'- コスト最適化：読み取り回数削減、複合クエリ活用\n':'- Cost optimization: reduce reads, use composite queries\n');
  }else if(backend.includes('Node')){
    doc39+=(G?'- Express middlewareでバリデーション統一\n':'- Unified validation with Express middleware\n');
    doc39+=(G?'- エラーハンドリングは集約ハンドラ\n':'- Centralized error handler\n');
    doc39+=(G?'- 環境変数は.envで管理、dotenv-safe推奨\n':'- Manage env vars with .env, recommend dotenv-safe\n');
  }
  doc39+='\n### '+(G?'データベース：':'Database: ')+db+'\n';
  if(db.includes('PostgreSQL')){
    doc39+=(G?'- マイグレーションツールはPrisma/Drizzle\n':'- Migration tool: Prisma/Drizzle\n');
    doc39+=(G?'- インデックスは外部キー・検索条件カラムに必須\n':'- Indexes required on FKs and search columns\n');
    doc39+=(G?'- トランザクション分離レベルはREAD COMMITTED（デフォルト）\n':'- Transaction isolation: READ COMMITTED (default)\n');
  }else if(db.includes('MongoDB')){
    doc39+=(G?'- スキーマ検証はMongooseで定義\n':'- Schema validation with Mongoose\n');
    doc39+=(G?'- インデックスはクエリパフォーマンス分析後に作成\n':'- Create indexes after query performance analysis\n');
    doc39+=(G?'- 大規模データはシャーディング検討\n':'- Consider sharding for large-scale data\n');
  }
  doc39+='\n';

  // 3. App Type Best Practices
  doc39+='## '+(G?'3. アプリタイプ別ベストプラクティス':'3. App Type Best Practices')+'\n\n';
  doc39+='### '+(G?'推奨パターン':'Recommended Patterns')+' ('+appType+')\n';
  (G?appTypePattern.patterns_ja:appTypePattern.patterns_en).forEach(p=>{
    doc39+='- ✅ '+p+'\n';
  });
  doc39+='\n### '+(G?'アンチパターン（避けるべき）':'Anti-patterns (Avoid)')+'\n';
  (G?appTypePattern.antipatterns_ja:appTypePattern.antipatterns_en).forEach(ap=>{
    doc39+='- ⚠️ '+ap+'\n';
  });
  doc39+='\n';

  // 4. Entity-Specific Pseudo-code
  doc39+='## '+(G?'4. エンティティ別擬似コード':'4. Entity-Specific Pseudo-code')+'\n\n';
  entities.slice(0,3).forEach(ent=>{
    const cols=getEntityColumns(ent,G,entities);
    if(!cols||cols.length===0){
      doc39+='### '+ent+'\n';
      doc39+=(G?'※ 未定義エンティティ。ENTITY_COLUMNSに追加してください。\n\n':'※ Undefined entity. Add to ENTITY_COLUMNS.\n\n');
      return;
    }
    const methods=getEntityMethods(ent)||['GET','POST','PUT','DELETE'];
    doc39+='### '+ent+'\n';
    doc39+='```javascript\n';
    if(methods.includes('POST')){
      doc39+='// CREATE\n';
      doc39+='async function create'+ent+'(data) {\n';
      doc39+='  validateInput(data); // '+(G?'入力検証':'Input validation')+'\n';
      doc39+='  const result = await db.insert("'+pluralize(ent)+'", data);\n';
      doc39+='  logAudit("CREATE_'+ent.toUpperCase()+'", result.id); // '+(G?'監査ログ':'Audit log')+'\n';
      doc39+='  return result;\n';
      doc39+='}\n\n';
    }
    if(methods.includes('GET')){
      doc39+='// READ\n';
      doc39+='async function get'+ent+'(id) {\n';
      doc39+='  const result = await db.query("SELECT * FROM '+pluralize(ent)+' WHERE id = ?", [id]);\n';
      doc39+='  if (!result) throw new NotFoundError();\n';
      doc39+='  return result;\n';
      doc39+='}\n\n';
    }
    if(methods.includes('PUT')){
      doc39+='// UPDATE\n';
      doc39+='async function update'+ent+'(id, data) {\n';
      doc39+='  validateInput(data);\n';
      doc39+='  await db.transaction(async () => {\n';
      doc39+='    const current = await db.query("SELECT * FROM '+pluralize(ent)+' WHERE id = ? FOR UPDATE", [id]);\n';
      doc39+='    await db.execute("UPDATE '+pluralize(ent)+' SET ... WHERE id = ?", [..., id]);\n';
      doc39+='    logAudit("UPDATE_'+ent.toUpperCase()+'", id);\n';
      doc39+='  });\n';
      doc39+='}\n\n';
    }
    if(methods.includes('DELETE')){
      doc39+='// DELETE (Soft delete recommended)\n';
      doc39+='async function delete'+ent+'(id) {\n';
      doc39+='  await db.execute("UPDATE '+pluralize(ent)+' SET deleted_at = NOW() WHERE id = ?", [id]);\n';
      doc39+='  logAudit("DELETE_'+ent.toUpperCase()+'", id);\n';
      doc39+='}\n';
    }
    doc39+='```\n\n';
  });

  // 5. Cross-Cutting Concerns Checklist
  doc39+='## '+(G?'5. 横断的関心事チェックリスト':'5. Cross-Cutting Concerns Checklist')+'\n\n';
  Object.entries(CROSS_CUTTING_IMPL).forEach(([key,val])=>{
    const title={auth:G?'認証・認可':'Auth',error:G?'エラーハンドリング':'Error Handling',cache:G?'キャッシュ':'Cache',i18n:G?'国際化':'i18n',audit:G?'監査ログ':'Audit Log',upload:G?'ファイルアップロード':'File Upload',rate:G?'レート制限':'Rate Limiting',validation:G?'入力検証':'Validation'}[key]||key;
    doc39+='### '+title+'\n';
    (G?val.ja:val.en).forEach(item=>{
      doc39+='- [ ] '+item+'\n';
    });
    doc39+='\n';
  });

  doc39+='---\n';
  doc39+=(G?'*このプレイブックはDevForge v9が自動生成しました。プロジェクト固有の要件に応じて調整してください。*\n':'*This playbook was auto-generated by DevForge v9. Adjust according to project-specific requirements.*\n');

  S.files['docs/39_implementation_playbook.md']=doc39;

  // ── docs/40_ai_dev_runbook.md ──
  let doc40='';
  doc40+='# '+(G?'AI開発運用手順書':'AI Development Runbook')+'\n\n';
  doc40+=(G?'**プロジェクト**：':'**Project**: ')+pn+'\n';
  doc40+=(G?'**AIレベル**：':'**AI Level**: ')+aiLevel+'\n';
  doc40+=(G?'**生成日**：':'**Generated**: ')+new Date().toISOString().split('T')[0]+'\n\n';
  doc40+='---\n\n';

  // 1. AI Operation Workflow
  doc40+='## '+(G?'1. AI運用ワークフロー':'1. AI Operation Workflow')+'\n\n';
  if(aiLevel==='none'||aiLevel==='なし'){
    doc40+=(G?'※ AIレベルが「なし」のため、基本的なフローのみ記載します。\n\n':'※ AI level is "none", only basic flow described.\n\n');
    doc40+='### '+(G?'基本フロー':'Basic Flow')+'\n';
    doc40+='1. '+(G?'仕様書レビュー（手動）':'Manual spec review')+'\n';
    doc40+='2. '+(G?'実装（コード記述）':'Implementation (coding)')+'\n';
    doc40+='3. '+(G?'テスト実行':'Run tests')+'\n';
    doc40+='4. '+(G?'デプロイ':'Deploy')+'\n';
  }else{
    doc40+='### '+(G?'Write → Select → Compress → Isolate サイクル':'Write → Select → Compress → Isolate Cycle')+'\n\n';
    doc40+='#### Phase 1: Write (仕様生成)\n';
    doc40+=(G?'- AI Brief (`AI_BRIEF.md`) を読み込み\n':'- Load AI Brief (`AI_BRIEF.md`)\n');
    doc40+=(G?'- SDD仕様書 (`.spec/constitution.md`) を確認\n':'- Review SDD specs (`.spec/constitution.md`)\n');
    doc40+=(G?'- 実装プレイブック (`docs/39_implementation_playbook.md`) で業種別パターン確認\n':'- Check domain patterns in Implementation Playbook (`docs/39_implementation_playbook.md`)\n');
    doc40+=(G?'- タスク分解：`docs/30_goal_decomposition.md` 参照\n':'- Task decomposition: refer to `docs/30_goal_decomposition.md`\n');
    doc40+='\n#### Phase 2: Select (ファイル選択)\n';
    doc40+=(G?'- **タスク別ファイル選択マトリクス**を使用（下記参照）\n':'- Use **Task-Specific File Selection Matrix** (see below)\n');
    doc40+=(G?'- トークン見積もり：1ファイル = 平均500-2000トークン\n':'- Token estimate: 1 file = avg 500-2000 tokens\n');
    doc40+=(G?'- 優先度：仕様書 > エンティティ定義 > 実装ガイド > テストケース\n':'- Priority: Specs > Entity definitions > Impl guide > Test cases\n');
    doc40+='\n#### Phase 3: Compress (コンテキスト圧縮)\n';
    doc40+=(G?'- コンテキスト使用量80%超過時に発動\n':'- Activate when context usage exceeds 80%\n');
    doc40+=(G?'- 圧縮対象：過去の会話履歴、参照済みファイルの要約化\n':'- Compress: past conversation history, summarize referenced files\n');
    doc40+=(G?'- 保持対象：現在のタスク、直近のエラーログ\n':'- Preserve: current task, recent error logs\n');
    doc40+='\n#### Phase 4: Isolate (サブエージェント分離)\n';
    doc40+=(G?'- 独立タスクは専用エージェントに委譲\n':'- Delegate independent tasks to specialized agents\n');
    doc40+=(G?'- ハンドオフ時はサマリーのみ共有（詳細は不要）\n':'- Share only summary on handoff (details unnecessary)\n');
    doc40+=(G?'- エージェント間引継ぎ：YAMLフォーマット（`AGENTS.md`参照）\n':'- Inter-agent handoff: YAML format (see `AGENTS.md`)\n');
    doc40+='\n';
  }

  // 2. File Selection Matrix
  doc40+='## '+(G?'2. タスク別ファイル選択マトリクス':'2. Task-Specific File Selection Matrix')+'\n\n';
  doc40+='| '+(G?'タスクタイプ':'Task Type')+' | '+(G?'必読ファイル':'Must-Read Files')+' | '+(G?'推奨ファイル':'Recommended Files')+' |\n';
  doc40+='|---|---|---|\n';
  doc40+='| '+(G?'新機能実装':'New Feature')+' | `.spec/constitution.md`, `docs/02_ER.md`, `docs/39_implementation_playbook.md` | `docs/26_design_system.md`, `docs/04_screen.md` |\n';
  doc40+='| '+(G?'バグ修正':'Bug Fix')+' | `docs/25_error_logs.md`, `docs/37_bug_prevention.md`, `docs/05_test_cases.md` | `docs/34_incident_response.md`, `docs/33_test_matrix.md` |\n';
  doc40+='| '+(G?'テスト追加':'Add Tests')+' | `docs/05_test_cases.md`, `docs/36_test_strategy.md`, `docs/33_test_matrix.md` | `.spec/verification.md`, `docs/28_qa_strategy.md` |\n';
  doc40+='| '+(G?'リファクタリング':'Refactoring')+' | `docs/01_architecture.md`, `docs/39_implementation_playbook.md` | `docs/26_design_system.md`, `CLAUDE.md` |\n';
  doc40+='| '+(G?'ドキュメント更新':'Doc Update')+' | `.spec/specification.md`, `docs/24_progress.md` | `docs/31_industry_playbook.md`, `AI_BRIEF.md` |\n';
  doc40+='| '+(G?'API実装':'API Impl')+' | `docs/03_API.md`, `docs/02_ER.md`, `docs/06_security.md` | `docs/39_implementation_playbook.md`, `docs/28_qa_strategy.md` |\n';
  doc40+='\n';

  // 3. Error Recovery Protocol
  doc40+='## '+(G?'3. エラー復旧プロトコル':'3. Error Recovery Protocol')+'\n\n';
  doc40+='### '+(G?'業種別典型エラーと対処法':'Domain-Specific Typical Errors & Solutions')+'\n\n';
  const domainErrors={
    education:{ja:'進捗率100%超過 → イベントソーシングの集計ロジック確認',en:'Progress >100% → Check event sourcing aggregation logic'},
    ec:{ja:'在庫マイナス → 楽観的ロックのversion列チェック漏れ',en:'Negative stock → Missing optimistic lock version check'},
    fintech:{ja:'残高不一致 → トランザクション境界の見直し',en:'Balance mismatch → Review transaction boundaries'},
    health:{ja:'同意なしアクセス → hasConsent()の条件分岐追加',en:'Unauthorized access → Add hasConsent() condition'},
    marketplace:{ja:'手数料計算エラー → サーバーサイド検証の強化',en:'Fee calculation error → Strengthen server-side validation'},
    _default:{ja:'データ不整合 → トランザクション漏れ確認',en:'Data inconsistency → Check missing transactions'}
  };
  const errMsg=domainErrors[domain]||domainErrors._default;
  doc40+='**'+domain+'**: '+(G?errMsg.ja:errMsg.en)+'\n\n';

  doc40+='### '+(G?'一般的エラー対処フロー':'General Error Handling Flow')+'\n';
  doc40+='1. '+(G?'`docs/25_error_logs.md` にエラー記録':'Record error in `docs/25_error_logs.md`')+'\n';
  doc40+='2. '+(G?'`docs/37_bug_prevention.md` のチェックリスト確認':'Check checklist in `docs/37_bug_prevention.md`')+'\n';
  doc40+='3. '+(G?'該当ファイルの修正':'Fix relevant files')+'\n';
  doc40+='4. '+(G?'テスト追加（再発防止）':'Add tests (prevent recurrence)')+'\n';
  doc40+='5. '+(G?'`docs/24_progress.md` に対応記録':'Record response in `docs/24_progress.md`')+'\n';
  doc40+='\n';

  // 4. Context Management Strategy
  doc40+='## '+(G?'4. コンテキスト管理戦略':'4. Context Management Strategy')+'\n\n';
  doc40+='### '+(G?'トークン予算配分':'Token Budget Allocation')+'\n';
  doc40+='- '+(G?'タスク指示・会話：40%':'Task instructions & conversation: 40%')+'\n';
  doc40+='- '+(G?'仕様書・設計：30%':'Specs & design: 30%')+'\n';
  doc40+='- '+(G?'実装ガイド・進捗：20%':'Impl guide & progress: 20%')+'\n';
  doc40+='- '+(G?'バッファ（エラーログなど）：10%':'Buffer (error logs, etc.): 10%')+'\n';
  doc40+='\n### '+(G?'圧縮タイミング':'Compression Timing')+'\n';
  doc40+='- '+(G?'コンテキスト使用量 < 50%：圧縮不要':'Context usage < 50%: No compression needed')+'\n';
  doc40+='- '+(G?'50% ~ 80%：過去の会話履歴を要約':'50% ~ 80%: Summarize past conversation')+'\n';
  doc40+='- '+(G?'80% ~ 95%：参照ファイルを要約、古いエラーログ削除':'80% ~ 95%: Summarize files, delete old error logs')+'\n';
  doc40+='- '+(G?'95%超：サブエージェント分離またはタスク分割':'> 95%: Isolate sub-agent or split task')+'\n';
  doc40+='\n';

  // 5. Agent Handoff Protocol
  if(aiLevel==='multi'||aiLevel==='full'||aiLevel==='orch'){
    doc40+='## '+(G?'5. エージェント間ハンドオフ手順':'5. Agent Handoff Protocol')+'\n\n';
    doc40+=(G?'詳細は `AGENTS.md` の「Agent Specialization Matrix」参照。\n\n':'See `AGENTS.md` "Agent Specialization Matrix" for details.\n\n');
    doc40+='### '+(G?'ハンドオフYAMLフォーマット':'Handoff YAML Format')+'\n';
    doc40+='```yaml\n';
    doc40+='from_agent: planning\n';
    doc40+='to_agent: implementation\n';
    doc40+='task: Implement User authentication flow\n';
    doc40+='context:\n';
    doc40+='  entities: [User, Session]\n';
    doc40+='  auth_method: Supabase Auth\n';
    doc40+='  files_to_read:\n';
    doc40+'    - .spec/constitution.md\n';
    doc40+'    - docs/02_ER.md\n';
    doc40+'    - docs/39_implementation_playbook.md\n';
    doc40+='status: pending\n';
    doc40+='```\n\n';
  }

  doc40+='---\n';
  doc40+=(G?'*この運用手順書はDevForge v9が自動生成しました。AIレベルに応じて適宜カスタマイズしてください。*\n':'*This runbook was auto-generated by DevForge v9. Customize according to AI level.*\n');

  S.files['docs/40_ai_dev_runbook.md']=doc40;

  // ── skills/impl-patterns.md (conditional) ──
  if(aiLevel!=='none'&&aiLevel!=='なし'){
    let skillDoc='';
    skillDoc+='# '+(G?'実装パターンスキルカタログ':'Implementation Patterns Skill Catalog')+'\n\n';
    skillDoc+=(G?'> Manus Skills形式の実装スキル定義\n\n':'> Implementation skills in Manus Skills format\n\n');
    skillDoc+='**'+(G?'業種':'Domain')+'**: '+domain+'\n';
    skillDoc+='**'+(G?'スタック':'Stack')+'**: '+frontend+' + '+backend+'\n\n';
    skillDoc+='---\n\n';

    // Thinking Axis for Domain
    skillDoc+='## '+(G?'思考軸（Thinking Axis）':'Thinking Axis')+'\n\n';
    const thinkingAxis={
      education:{ja:['学習進捗の可視化','コンテンツの段階的解放','修了判定の厳格性'],en:['Visualize learning progress','Gradual content unlocking','Strict completion criteria']},
      ec:{ja:['在庫の正確性','決済の冪等性','カート放棄防止'],en:['Inventory accuracy','Payment idempotency','Cart abandonment prevention']},
      fintech:{ja:['トランザクション整合性','監査ログの完全性','コンプライアンス準拠'],en:['Transaction consistency','Audit log completeness','Compliance adherence']},
      health:{ja:['患者データ保護','同意管理','アクセス監査'],en:['Patient data protection','Consent management','Access auditing']},
      _default:{ja:['データ整合性','セキュリティ','ユーザー体験'],en:['Data integrity','Security','User experience']}
    };
    const axis=(thinkingAxis[domain]||thinkingAxis._default);
    (G?axis.ja:axis.en).forEach((a,i)=>{
      skillDoc+=(i+1)+'. '+a+'\n';
    });
    skillDoc+='\n';

    // 4-Layer Skills
    skillDoc+='## '+(G?'4層スキル構造':'4-Layer Skill Structure')+'\n\n';
    const layers=[
      {id:'planning',name_ja:'企画層',name_en:'Planning',skills_ja:['要件定義','技術選定'],skills_en:['Requirement definition','Tech stack selection']},
      {id:'design',name_ja:'設計層',name_en:'Design',skills_ja:['ER設計','API設計'],skills_en:['ER design','API design']},
      {id:'production',name_ja:'制作層',name_en:'Production',skills_ja:['実装','テスト'],skills_en:['Implementation','Testing']},
      {id:'operations',name_ja:'運用層',name_en:'Operations',skills_ja:['モニタリング','インシデント対応'],skills_en:['Monitoring','Incident response']}
    ];
    layers.forEach(layer=>{
      skillDoc+='### '+(G?layer.name_ja:layer.name_en)+'\n';
      (G?layer.skills_ja:layer.skills_en).forEach(sk=>{
        skillDoc+='- '+sk+'\n';
      });
      skillDoc+='\n';
    });

    // Detailed Skill: Domain-Specific Implementation
    skillDoc+='## '+(G?'詳細スキル：業種別実装':'Detailed Skill: Domain Implementation')+'\n\n';
    skillDoc+='### '+(G?'スキル名':'Skill Name')+'\n';
    skillDoc+='**'+domain+' Implementation Pattern**\n\n';
    skillDoc+='### Input\n';
    skillDoc+='- '+(G?'エンティティ定義 (`docs/02_ER.md`)':'Entity definitions (`docs/02_ER.md`)')+'\n';
    skillDoc+='- '+(G?'機能要件 (`.spec/constitution.md`)':'Feature requirements (`.spec/constitution.md`)')+'\n';
    skillDoc+='- '+(G?'実装プレイブック (`docs/39_implementation_playbook.md`)':'Implementation playbook (`docs/39_implementation_playbook.md`)')+'\n';
    skillDoc+='\n### Process\n';
    skillDoc+='1. '+(G?'業種別パターンを確認':'Review domain-specific patterns')+'\n';
    skillDoc+='2. '+(G?'擬似コードをプロジェクトエンティティに適用':'Apply pseudo-code to project entities')+'\n';
    skillDoc+='3. '+(G?'ガードレール（典型バグ）を考慮した実装':'Implement considering guard rails (typical bugs)')+'\n';
    skillDoc+='4. '+(G?'横断的関心事チェックリストで検証':'Validate with cross-cutting concerns checklist')+'\n';
    skillDoc+='\n### Output\n';
    skillDoc+='- '+(G?'実装コード（CRUD + ビジネスロジック）':'Implementation code (CRUD + business logic)')+'\n';
    skillDoc+='- '+(G?'テストケース（ガードレール検証含む）':'Test cases (including guard rail validation)')+'\n';
    skillDoc+='\n### '+(G?'判断基準':'Judgment Criteria')+'\n';
    skillDoc+='- '+(G?'全てのガードレールに対応するテストが存在するか':'Tests exist for all guard rails?')+'\n';
    skillDoc+='- '+(G?'横断的関心事チェックリストが全てチェック済みか':'All cross-cutting concerns checked?')+'\n';
    skillDoc+='- '+(G?'業種固有の制約（コンプライアンス等）を満たしているか':'Domain-specific constraints (compliance, etc.) satisfied?')+'\n';
    skillDoc+='\n### '+(G?'次のスキル':'Next Skill')+'\n';
    skillDoc+='- '+(G?'テスト実行 → バグ修正 → デプロイ準備':'Run tests → Fix bugs → Prepare deploy')+'\n';
    skillDoc+='\n';

    skillDoc+='---\n';
    skillDoc+=(G?'*このスキルカタログはDevForge v9が自動生成しました。*\n':'*This skill catalog was auto-generated by DevForge v9.*\n');

    S.files['skills/impl-patterns.md']=skillDoc;
  }
}
