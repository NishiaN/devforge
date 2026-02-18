/* ═══ PILLAR ⑫: SECURITY INTELLIGENCE ═══ */

// OWASP Top 10 2025 Check Database
const OWASP_2025=[
  {id:'A01',ja:'アクセス制御の不備',en:'Broken Access Control',
   checks_ja:[
     'RLS/Security Rules全テーブル有効化',
     'Server Actions内認証チェック必須',
     'IDOR防止(owner検証)',
     '最小権限原則の適用',
     'デフォルト拒否ポリシー'
   ],
   checks_en:[
     'Enable RLS/Security Rules for all tables',
     'Auth check required in all Server Actions',
     'IDOR prevention (owner verification)',
     'Apply principle of least privilege',
     'Default deny policy'
   ],
   stack:{
     supabase:['RLSポリシー全テーブル確認','service_roleキー隔離','anon keyのみクライアント公開'],
     firebase:['Firestore Rules全コレクション確認','Admin SDK使用最小化','カスタムクレーム活用'],
     express:['認可ミドルウェア全ルート適用','JWTスコープ検証','RBAC実装']
   }},
  {id:'A02',ja:'セキュリティ設定ミス',en:'Security Misconfiguration',
   checks_ja:[
     'BaaS管理画面でRLS有効化確認',
     'API制限設定(リファラ/IPホワイトリスト)',
     'Data API無効化推奨',
     'CORS設定の厳格化',
     'デフォルトクレデンシャル変更'
   ],
   checks_en:[
     'Verify RLS enabled in BaaS console',
     'API restrictions (referrer/IP whitelist)',
     'Disable Data API (recommended)',
     'Strict CORS configuration',
     'Change default credentials'
   ],
   stack:{
     supabase:['Database settings→RLS確認','API settings→制限設定','PostgREST API評価'],
     firebase:['Firebase Console→Rules確認','App Check有効化','API key制限設定'],
     vercel:['Environment Variables設定','Preview deployments保護','Edge Config活用']
   }},
  {id:'A03',ja:'ソフトウェアサプライチェーン',en:'Software Supply Chain',
   checks_ja:[
     'npm audit自動実行',
     'Gitleaksでシークレットスキャン',
     'SLSA Build Provenance生成',
     'Scorecard評価',
     'SBOMエクスポート'
   ],
   checks_en:[
     'Automate npm audit',
     'Gitleaks secret scanning',
     'Generate SLSA Build Provenance',
     'Scorecard evaluation',
     'Export SBOM'
   ],
   stack:{
     github:['Dependabot有効化','Secret scanning有効化','actions/attest-build-provenance使用'],
     npm:['package-lock.json必須','npm audit fix定期実行','--ignore-scripts使用'],
     docker:['ベースイメージ署名検証','Trivy脆弱性スキャン','multi-stage build']
   }},
  {id:'A04',ja:'サーバサイドリクエストフォージェリ',en:'Server-Side Request Forgery',
   checks_ja:[
     'Server Actions内URL検証',
     'Edge Functions外部リクエスト制限',
     'プライベートIP拒否',
     'URLホワイトリスト',
     'リダイレクト検証'
   ],
   checks_en:[
     'URL validation in Server Actions',
     'Restrict external requests in Edge Functions',
     'Deny private IPs',
     'URL whitelist',
     'Redirect validation'
   ],
   stack:{
     nextjs:['Server Actions入力検証','fetch制限実装','middleware活用'],
     cloudflare:['Workers制限設定','env.ALLOWED_HOSTS定義'],
     supabase:['Edge Functions制限','Deno.permissions確認']
   }},
  {id:'A05',ja:'安全でない設計',en:'Insecure Design',
   checks_ja:[
     '脅威モデリング実施',
     'Security by Design原則',
     'フェイルセーフ設計',
     'Defense in Depth',
     'セキュアデフォルト'
   ],
   checks_en:[
     'Conduct threat modeling',
     'Security by Design principles',
     'Fail-safe design',
     'Defense in Depth',
     'Secure defaults'
   ],
   stack:{
     design:['STRIDE分析実施','Trust Boundary定義','Attack Surface最小化'],
     arch:['認証/認可分離','暗号化デフォルト','監査ログ設計']
   }},
  {id:'A06',ja:'脆弱で古いコンポーネント',en:'Vulnerable and Outdated Components',
   checks_ja:[
     '依存関係自動更新',
     'EOLバージョン回避',
     'セキュリティパッチ適用',
     '未使用依存関係削除',
     'ロックファイル必須'
   ],
   checks_en:[
     'Automate dependency updates',
     'Avoid EOL versions',
     'Apply security patches',
     'Remove unused dependencies',
     'Require lockfile'
   ],
   stack:{
     renovate:['自動PR作成','vulnerabilityAlerts有効'],
     npm:['npm outdated定期確認','npx npm-check-updates'],
     docker:['ベースイメージ更新','distroless推奨']
   }},
  {id:'A07',ja:'識別と認証の失敗',en:'Identification and Authentication Failures',
   checks_ja:[
     'MFA必須化',
     'パスワード強度ポリシー',
     'セッション管理強化',
     'レートリミット実装',
     'クレデンシャルスタッフィング防御'
   ],
   checks_en:[
     'Enforce MFA',
     'Password strength policy',
     'Strengthen session management',
     'Implement rate limiting',
     'Defend against credential stuffing'
   ],
   stack:{
     supabase:['Auth policies設定','MFA有効化','Email confirmations強制'],
     firebase:['Firebase Auth MFA','reCAPTCHA統合','passwordPolicyOptions設定'],
     nextauth:['session strategy設定','maxAge適切化','secret強化']
   }},
  {id:'A08',ja:'ソフトウェアとデータの整合性の不備',en:'Software and Data Integrity Failures',
   checks_ja:[
     'CDN SRI設定',
     'コード署名検証',
     'CI/CDパイプライン保護',
     'auto-merge無効化',
     'Webhook署名検証'
   ],
   checks_en:[
     'Configure CDN SRI',
     'Verify code signatures',
     'Protect CI/CD pipeline',
     'Disable auto-merge',
     'Verify webhook signatures'
   ],
   stack:{
     cdn:['SRI hashesすべてのCDN','integrity属性必須'],
     github:['Branch protection有効','Signed commits推奨','CODEOWNERS設定'],
     webhook:['HMAC署名検証','タイムスタンプ検証','replay attack防御']
   }},
  {id:'A09',ja:'セキュリティログと監視の不備',en:'Security Logging and Monitoring Failures',
   checks_ja:[
     '全認証イベント記録',
     '異常検知アラート',
     'ログ改ざん防止',
     'インシデント対応手順',
     'ログ保持ポリシー'
   ],
   checks_en:[
     'Log all auth events',
     'Anomaly detection alerts',
     'Prevent log tampering',
     'Incident response procedures',
     'Log retention policy'
   ],
   stack:{
     supabase:['pgAudit有効化','Log drains設定','Webhooks活用'],
     datadog:['APM統合','Security Monitoring','Anomaly Detection'],
     sentry:['Error tracking','Performance monitoring','Session Replay']
   }},
  {id:'A10',ja:'サーバサイドリクエストフォージェリ',en:'Server-Side Request Forgery',
   checks_ja:[
     'DNS Rebinding防御',
     'メタデータAPI保護',
     'ネットワーク分離',
     'Egress制限',
     'タイムアウト設定'
   ],
   checks_en:[
     'Defend against DNS Rebinding',
     'Protect metadata APIs',
     'Network isolation',
     'Egress restrictions',
     'Timeout configuration'
   ],
   stack:{
     cloud:['VPC設定','Security Groups','Private subnets'],
     k8s:['Network Policies','Egress rules','Service mesh'],
     serverless:['VPC integration','Outbound allowlist']
   }}
];

// Compliance Requirements Database
const COMPLIANCE_DB={
  pci:{
    name:'PCI DSS 4.0.1',
    domains:['fintech','ec'],
    reqs_ja:[
      {id:'6.4.3',title:'決済ページスクリプトインベントリ',desc:'すべてのJavaScriptをリスト化し、正当性を検証',impl:'CSP report-uri + inventory管理'},
      {id:'11.6.1',title:'改ざん検知メカニズム',desc:'HTTPヘッダー/ペイロードの改ざん検知',impl:'Subresource Integrity (SRI) + CSP'},
      {id:'8.3.6',title:'パスワード複雑度',desc:'12文字以上、大小英数記号',impl:'Auth provider設定 + クライアント検証'},
      {id:'3.5.1',title:'カード情報非保存',desc:'PAN/CVV2保存禁止',impl:'Stripe Tokenization必須'},
      {id:'12.10.4',title:'インシデント対応計画',desc:'決済システム侵害時の手順',impl:'docs/34_incident_response.md参照'}
    ],
    reqs_en:[
      {id:'6.4.3',title:'Payment Page Script Inventory',desc:'List all JavaScript and verify legitimacy',impl:'CSP report-uri + inventory management'},
      {id:'11.6.1',title:'Tampering Detection Mechanism',desc:'Detect HTTP header/payload tampering',impl:'Subresource Integrity (SRI) + CSP'},
      {id:'8.3.6',title:'Password Complexity',desc:'12+ chars, upper/lower/digit/symbol',impl:'Auth provider settings + client validation'},
      {id:'3.5.1',title:'No Card Data Storage',desc:'Never store PAN/CVV2',impl:'Stripe Tokenization required'},
      {id:'12.10.4',title:'Incident Response Plan',desc:'Procedures for payment system breach',impl:'See docs/34_incident_response.md'}
    ]
  },
  hipaa:{
    name:'HIPAA',
    domains:['health'],
    reqs_ja:[
      {id:'§164.312(a)',title:'アクセス制御',desc:'PHI(Protected Health Information)へのアクセス制限',impl:'RLS + RBAC + MFA必須'},
      {id:'§164.312(c)',title:'整合性管理',desc:'PHI改ざん防止・検知',impl:'pgAudit + トリガー監査'},
      {id:'§164.312(e)',title:'暗号化',desc:'保管時・転送時暗号化',impl:'AES-256 + TLS 1.3'},
      {id:'§164.308(a)(1)',title:'BAA締結',desc:'Business Associate Agreement',impl:'Supabase Enterprise必須'},
      {id:'§164.528',title:'開示記録',desc:'PHIアクセスログ3年保管',impl:'CloudWatch Logs + S3 Glacier'}
    ],
    reqs_en:[
      {id:'§164.312(a)',title:'Access Control',desc:'Restrict access to PHI (Protected Health Information)',impl:'RLS + RBAC + MFA required'},
      {id:'§164.312(c)',title:'Integrity Controls',desc:'Prevent/detect PHI tampering',impl:'pgAudit + trigger audits'},
      {id:'§164.312(e)',title:'Encryption',desc:'At-rest and in-transit encryption',impl:'AES-256 + TLS 1.3'},
      {id:'§164.308(a)(1)',title:'BAA Execution',desc:'Business Associate Agreement',impl:'Supabase Enterprise required'},
      {id:'§164.528',title:'Disclosure Records',desc:'PHI access logs for 3 years',impl:'CloudWatch Logs + S3 Glacier'}
    ]
  },
  gdpr:{
    name:'GDPR',
    domains:['hr','community','content','saas','default'],
    reqs_ja:[
      {id:'Art.6',title:'処理の適法性',desc:'法的根拠(同意/契約/正当利益)の文書化',impl:'同意管理UI + Privacy Policy'},
      {id:'Art.15',title:'アクセス権',desc:'データ主体が自分のデータをダウンロード可能',impl:'Export機能実装'},
      {id:'Art.17',title:'忘れられる権利',desc:'削除リクエスト対応',impl:'Delete Account機能 + CASCADE設定'},
      {id:'Art.32',title:'セキュリティ対策',desc:'技術的・組織的対策',impl:'暗号化 + アクセス制御 + 監査ログ'},
      {id:'Art.33',title:'侵害通知',desc:'72時間以内に監督当局通知',impl:'Incident Response手順書'}
    ],
    reqs_en:[
      {id:'Art.6',title:'Lawfulness of Processing',desc:'Document legal basis (consent/contract/legitimate interest)',impl:'Consent management UI + Privacy Policy'},
      {id:'Art.15',title:'Right of Access',desc:'Data subjects can download their data',impl:'Implement Export feature'},
      {id:'Art.17',title:'Right to be Forgotten',desc:'Respond to deletion requests',impl:'Delete Account feature + CASCADE settings'},
      {id:'Art.32',title:'Security Measures',desc:'Technical and organizational measures',impl:'Encryption + Access control + Audit logs'},
      {id:'Art.33',title:'Breach Notification',desc:'Notify supervisory authority within 72 hours',impl:'Incident Response procedures'}
    ]
  },
  ismap:{
    name:'ISMAP (政府情報システムのためのセキュリティ評価制度)',
    domains:['government'],
    reqs_ja:[
      {id:'1441',title:'データローカリティ',desc:'日本国内データセンター必須',impl:'東京/大阪リージョン限定'},
      {id:'1442',title:'暗号化強度',desc:'CRYPTREC推奨暗号リスト準拠',impl:'AES-256/SHA-256/RSA-2048'},
      {id:'1443',title:'監査ログ保存',desc:'7年間保存',impl:'S3 Glacier Deep Archive'},
      {id:'1444',title:'クラウド事業者認証',desc:'ISMAP登録サービス利用推奨',impl:'AWS/Azure/GCP ISMAPサービス'},
      {id:'1445',title:'インシデント報告',desc:'重大事象は24時間以内報告',impl:'エスカレーション手順書'}
    ],
    reqs_en:[
      {id:'1441',title:'Data Locality',desc:'Japan data center required',impl:'Tokyo/Osaka regions only'},
      {id:'1442',title:'Encryption Strength',desc:'CRYPTREC recommended cipher list',impl:'AES-256/SHA-256/RSA-2048'},
      {id:'1443',title:'Audit Log Retention',desc:'7 years retention',impl:'S3 Glacier Deep Archive'},
      {id:'1444',title:'Cloud Provider Certification',desc:'Use ISMAP registered services',impl:'AWS/Azure/GCP ISMAP services'},
      {id:'1445',title:'Incident Reporting',desc:'Report critical incidents within 24 hours',impl:'Escalation procedures'}
    ]
  },
  soc2:{
    name:'SOC 2 Type II',
    domains:['saas'],
    reqs_ja:[
      {id:'CC6.1',title:'論理アクセス制御',desc:'ロールベースアクセス制御実装',impl:'RBAC + 最小権限原則'},
      {id:'CC6.6',title:'暗号化',desc:'保管時・転送時暗号化',impl:'TLS 1.3 + AES-256'},
      {id:'CC7.2',title:'変更管理',desc:'本番変更の承認プロセス',impl:'Pull Request + Approval workflow'},
      {id:'CC7.3',title:'セキュリティ監視',desc:'異常検知・アラート',impl:'CloudWatch/Datadog監視'},
      {id:'CC9.2',title:'ベンダー管理',desc:'サードパーティリスク評価',impl:'Vendor Security Assessment'}
    ],
    reqs_en:[
      {id:'CC6.1',title:'Logical Access Control',desc:'Implement role-based access control',impl:'RBAC + least privilege'},
      {id:'CC6.6',title:'Encryption',desc:'At-rest and in-transit encryption',impl:'TLS 1.3 + AES-256'},
      {id:'CC7.2',title:'Change Management',desc:'Approval process for production changes',impl:'Pull Request + Approval workflow'},
      {id:'CC7.3',title:'Security Monitoring',desc:'Anomaly detection and alerting',impl:'CloudWatch/Datadog monitoring'},
      {id:'CC9.2',title:'Vendor Management',desc:'Third-party risk assessment',impl:'Vendor Security Assessment'}
    ]
  },
  ferpa:{
    name:'FERPA (Family Educational Rights and Privacy Act)',
    domains:['education'],
    reqs_ja:[
      {id:'§99.31',title:'同意なし開示制限',desc:'教育記録の第三者提供制限',impl:'保護者同意フロー + 開示記録'},
      {id:'§99.32',title:'開示記録保管',desc:'開示履歴の記録・保管',impl:'Audit log + 5年保管'},
      {id:'§99.35',title:'アクセス権',desc:'学生・保護者が記録を閲覧可能',impl:'View Records機能'},
      {id:'§99.7',title:'セキュリティ対策',desc:'不正アクセス防止',impl:'認証 + 暗号化 + アクセス制御'}
    ],
    reqs_en:[
      {id:'§99.31',title:'Disclosure Restrictions',desc:'Limit third-party access to education records',impl:'Parental consent flow + disclosure records'},
      {id:'§99.32',title:'Disclosure Record Retention',desc:'Maintain disclosure history',impl:'Audit log + 5-year retention'},
      {id:'§99.35',title:'Right of Access',desc:'Students/parents can view records',impl:'View Records feature'},
      {id:'§99.7',title:'Security Measures',desc:'Prevent unauthorized access',impl:'Auth + encryption + access control'}
    ]
  },
  asvs:{
    name:'OWASP ASVS Level 2',
    domains:['default'],
    reqs_ja:[
      {id:'V1.4',title:'アクセス制御設計',desc:'デフォルト拒否原則',impl:'RLS/Security Rules + 認可チェック'},
      {id:'V2.1',title:'パスワードセキュリティ',desc:'10文字以上、pwned passwords回避',impl:'Auth provider設定'},
      {id:'V3.4',title:'セッション管理',desc:'セッション無効化・タイムアウト',impl:'JWT有効期限 + refresh token'},
      {id:'V5.2',title:'入力検証',desc:'ホワイトリスト検証',impl:'Zodスキーマ + サーバー検証'},
      {id:'V8.1',title:'データ保護',desc:'機密データ暗号化',impl:'列レベル暗号化 + TLS'}
    ],
    reqs_en:[
      {id:'V1.4',title:'Access Control Design',desc:'Default deny principle',impl:'RLS/Security Rules + authz checks'},
      {id:'V2.1',title:'Password Security',desc:'10+ chars, avoid pwned passwords',impl:'Auth provider settings'},
      {id:'V3.4',title:'Session Management',desc:'Session invalidation and timeout',impl:'JWT expiration + refresh token'},
      {id:'V5.2',title:'Input Validation',desc:'Whitelist validation',impl:'Zod schemas + server validation'},
      {id:'V8.1',title:'Data Protection',desc:'Encrypt sensitive data',impl:'Column-level encryption + TLS'}
    ]
  }
};

// STRIDE Threat Patterns
const STRIDE_PATTERNS={
  hasUserId:{S:'HIGH',T:'MED',R:'MED',I:'HIGH',D:'LOW',E:'HIGH'},
  isPayment:{S:'CRITICAL',T:'CRITICAL',R:'HIGH',I:'HIGH',D:'MED',E:'CRITICAL'},
  isPublic:{S:'LOW',T:'LOW',R:'LOW',I:'MED',D:'MED',E:'LOW'},
  hasFile:{S:'MED',T:'HIGH',I:'HIGH',D:'MED',E:'MED'},
  default:{S:'MED',T:'MED',R:'LOW',I:'MED',D:'LOW',E:'MED'}
};

// Helper: Checkbox
function _chk(ja,en){const G=S.genLang==='ja';return'- [ ] '+(G?ja:en)+'\n';}

// Helper: Security level label
function _lvl(lv){
  const m={CRITICAL:'🔴 Critical',HIGH:'🟠 High',MED:'🟡 Medium',LOW:'🟢 Low'};
  return m[lv]||lv;
}

// Helper: OWASP section
function _owaspSection(item,backend){
  const G=S.genLang==='ja';
  let out='### '+item.id+': '+(G?item.ja:item.en)+'\n\n';
  const checks=G?item.checks_ja:item.checks_en;
  checks.forEach(c=>out+=_chk(c,c));
  out+='\n';

  // Stack-specific checks
  if(item.stack){
    out+=(G?'**技術スタック別チェック:**\n\n':'**Stack-Specific Checks:**\n\n');
    const bk=backend||'express';
    const key=bk.toLowerCase().includes('supabase')?'supabase':
              bk.toLowerCase().includes('firebase')?'firebase':
              bk.toLowerCase().includes('github')?'github':
              bk.toLowerCase().includes('npm')?'npm':
              bk.toLowerCase().includes('vercel')?'vercel':'express';
    if(item.stack[key]){
      item.stack[key].forEach(s=>out+='- '+s+'\n');
    }
  }
  return out+'\n';
}

// Helper: Compliance section
function _compSection(comp,G){
  const reqs=G?comp.reqs_ja:comp.reqs_en;
  let out='## '+comp.name+'\n\n';
  out+=(G?'**適用対象ドメイン:** ':'**Applicable Domains:** ')+comp.domains.join(', ')+'\n\n';
  out+=(G?'### 必須要件チェックリスト\n\n':'### Required Compliance Checklist\n\n');

  reqs.forEach(r=>{
    out+='#### '+r.id+': '+r.title+'\n';
    out+='- **'+(G?'説明':'Description')+':** '+r.desc+'\n';
    out+='- **'+(G?'実装':'Implementation')+':** '+r.impl+'\n';
    out+=_chk(r.title,r.title);
    out+='\n';
  });
  return out;
}

// Main Generator
function genPillar12_SecurityIntelligence(a,pn){
  const G=S.genLang==='ja';
  const domain=detectDomain(a.purpose)||'default';
  const backend=a.backend||'Supabase';
  const frontend=a.frontend||'React + Next.js';
  const database=a.database||'PostgreSQL';
  const auth=resolveAuth(a);
  const entities=(a.data_entities||'').split(/[,、]/).map(e=>e.trim()).filter(e=>e);
  const features=(a.mvp_features||'').split(/[,、]/).map(f=>f.trim()).filter(f=>f);
  const hasPayment=a.payment&&a.payment!=='none';
  const hasAI=a.ai_auto&&a.ai_auto!=='none';

  // ═══ DOC 43: Security Intelligence Report ═══
  let doc43='';
  doc43+='# '+(G?'セキュリティインテリジェンスレポート':'Security Intelligence Report')+'\n\n';
  doc43+='> '+(G?'プロジェクト: ':'Project: ')+pn+'\n';
  doc43+='> '+(G?'生成日: ':'Generated: ')+new Date().toISOString().split('T')[0]+'\n\n';

  doc43+=(G?'## 📋 目次\n\n':'## 📋 Table of Contents\n\n');
  doc43+='1. [OWASP Top 10 (2025) Adaptive Audit](#owasp-top-10-2025-adaptive-audit)\n';
  doc43+='2. [Security Headers Configuration](#security-headers-configuration)\n';
  doc43+='3. [Shared Responsibility Model](#shared-responsibility-model)\n';
  doc43+='4. [Secrets Management](#secrets-management)\n';
  doc43+='5. [Authentication & Session Security](#authentication--session-security)\n\n';
  doc43+='---\n\n';

  // OWASP Section
  doc43+='## OWASP Top 10 (2025) Adaptive Audit\n\n';
  doc43+=(G?'このセクションではOWASP Top 10 2025の各項目について、プロジェクトの技術スタックに適応したチェックリストを提供します。\n\n':'This section provides stack-adaptive checklists for each OWASP Top 10 2025 category.\n\n');

  OWASP_2025.forEach(item=>{
    doc43+=_owaspSection(item,backend);
  });

  // Security Headers
  doc43+='---\n\n## Security Headers Configuration\n\n';
  doc43+=(G?'### Content Security Policy (CSP)\n\n':'### Content Security Policy (CSP)\n\n');

  if(frontend.includes('Next.js')){
    doc43+=(G?'**Next.js middleware実装例:**\n\n':'**Next.js middleware implementation:**\n\n');
    doc43+='```typescript\n';
    doc43+='// middleware.ts\n';
    doc43+='import { NextResponse } from \'next/server\';\n';
    doc43+='export function middleware(request: Request) {\n';
    doc43+='  const nonce = Buffer.from(crypto.randomUUID()).toString(\'base64\');\n';
    doc43+='  const cspHeader = `\n';
    doc43+='    default-src \'self\';\n';
    doc43+='    script-src \'self\' \'nonce-${nonce}\' \'strict-dynamic\';\n';
    doc43+='    style-src \'self\' \'nonce-${nonce}\';\n';
    doc43+='    img-src \'self\' blob: data:;\n';
    doc43+='    font-src \'self\';\n';
    doc43+='    object-src \'none\';\n';
    doc43+='    base-uri \'self\';\n';
    doc43+='    form-action \'self\';\n';
    doc43+='    frame-ancestors \'none\';\n';
    doc43+='    upgrade-insecure-requests;\n';
    doc43+='  `.replace(/\\s{2,}/g, \' \').trim();\n';
    doc43+='  const response = NextResponse.next();\n';
    doc43+='  response.headers.set(\'Content-Security-Policy\', cspHeader);\n';
    doc43+='  response.headers.set(\'X-Nonce\', nonce);\n';
    doc43+='  return response;\n';
    doc43+='}\n';
    doc43+='```\n\n';
  }else{
    doc43+=(G?'**Express helmet実装例:**\n\n':'**Express helmet implementation:**\n\n');
    doc43+='```javascript\n';
    doc43+='const helmet = require(\'helmet\');\n';
    doc43+='app.use(helmet.contentSecurityPolicy({\n';
    doc43+='  directives: {\n';
    doc43+='    defaultSrc: ["\'self\'"],\n';
    doc43+='    scriptSrc: ["\'self\'", "\'unsafe-inline\'"],\n';
    doc43+='    styleSrc: ["\'self\'", "\'unsafe-inline\'"],\n';
    doc43+='    imgSrc: ["\'self\'", "data:", "blob:"],\n';
    doc43+='    connectSrc: ["\'self\'"],\n';
    doc43+='    fontSrc: ["\'self\'"],\n';
    doc43+='    objectSrc: ["\'none\'"],\n';
    doc43+='    upgradeInsecureRequests: []\n';
    doc43+='  }\n';
    doc43+='}));\n';
    doc43+='```\n\n';
  }

  doc43+=(G?'### その他の必須ヘッダー\n\n':'### Other Essential Headers\n\n');
  doc43+='```http\n';
  doc43+='Strict-Transport-Security: max-age=63072000; includeSubDomains; preload\n';
  doc43+='X-Frame-Options: DENY\n';
  doc43+='X-Content-Type-Options: nosniff\n';
  doc43+='Referrer-Policy: strict-origin-when-cross-origin\n';
  doc43+='Permissions-Policy: geolocation=(), microphone=(), camera=()\n';
  doc43+='```\n\n';

  // Shared Responsibility Model
  doc43+='---\n\n## Shared Responsibility Model\n\n';

  const isBaaS=backend.includes('Supabase')||backend.includes('Firebase')||backend.includes('Convex');

  if(isBaaS){
    doc43+=(G?'### BaaSプロバイダ vs アプリケーション責任分界\n\n':'### BaaS Provider vs Application Responsibility\n\n');
    doc43+='| '+(G?'セキュリティ領域':'Security Domain')+' | '+(G?'プロバイダ担当':'Provider')+' | '+(G?'あなたが担当':'Your Responsibility')+' |\n';
    doc43+='|---|---|---|\n';
    doc43+='| '+(G?'物理インフラ':'Physical Infrastructure')+' | ✅ | |\n';
    doc43+='| '+(G?'ネットワーク':'Network Security')+' | ✅ | |\n';
    doc43+='| '+(G?'データベース暗号化':'Database Encryption')+' | ✅ | |\n';
    doc43+='| '+(G?'パッチ適用':'Patching')+' | ✅ | |\n';
    doc43+='| **'+(G?'RLS/Security Rules':'RLS/Security Rules')+'** | | ✅ |\n';
    doc43+='| **'+(G?'認証設定':'Auth Configuration')+'** | | ✅ |\n';
    doc43+='| **'+(G?'アプリケーションロジック':'Application Logic')+'** | | ✅ |\n';
    doc43+='| **'+(G?'入力検証':'Input Validation')+'** | | ✅ |\n';
    doc43+='| **'+(G?'APIキー管理':'API Key Management')+'** | | ✅ |\n';
    doc43+='| **'+(G?'監査ログ設定':'Audit Log Configuration')+'** | | ✅ |\n';
    doc43+='\n';
    doc43+=(G?'⚠️ **重要:** プロバイダがインフラを保護しても、RLS/Rulesやアプリロジックの脆弱性はあなたの責任です。\n\n':'⚠️ **Important:** Even if the provider secures infrastructure, RLS/Rules and app logic vulnerabilities are your responsibility.\n\n');
  }else{
    doc43+=(G?'### 自前サーバー — 完全責任モデル\n\n':'### Self-Hosted — Full Responsibility Model\n\n');
    doc43+=(G?'あなたがすべてのレイヤーを担当します:\n\n':'You are responsible for all layers:\n\n');
    doc43+='- '+(G?'サーバーOS・パッチ管理':'Server OS & patching')+'\n';
    doc43+='- '+(G?'ファイアウォール・ネットワーク設定':'Firewall & network configuration')+'\n';
    doc43+='- '+(G?'データベース暗号化設定':'Database encryption settings')+'\n';
    doc43+='- '+(G?'TLS証明書管理':'TLS certificate management')+'\n';
    doc43+='- '+(G?'アプリケーションセキュリティ':'Application security')+'\n';
    doc43+='- '+(G?'監視・ログ収集':'Monitoring & logging')+'\n\n';
  }

  // Secrets Management
  doc43+='---\n\n## Secrets Management\n\n';
  doc43+=(G?'### シークレット管理の3段階\n\n':'### 3-Tier Secrets Management\n\n');
  doc43+='1. **'+(G?'開発環境':'Development')+' (`.env.local`):** '+(G?'ローカルのみ、Gitignore必須':'Local only, must be in .gitignore')+'\n';
  doc43+='2. **'+(G?'CI/CD':'CI/CD')+' (GitHub Secrets):** '+(G?'OIDC推奨、パーソナルトークン非推奨':'Use OIDC, avoid PATs')+'\n';
  doc43+='3. **'+(G?'本番環境':'Production')+' (Secrets Manager):** AWS Secrets Manager / GCP Secret Manager / Azure Key Vault\n\n';

  doc43+=(G?'### クライアントバンドル漏洩チェック\n\n':'### Client Bundle Leakage Check\n\n');
  doc43+='```bash\n';
  doc43+='# Next.js build output inspection\n';
  doc43+='npm run build\n';
  doc43+='grep -r "sk_live" .next/static/  # Stripe secret key should NOT appear\n';
  doc43+='grep -r "SERVICE_ROLE" .next/static/  # Supabase service_role should NOT appear\n';
  doc43+='```\n\n';

  doc43+=_chk('環境変数がクライアントバンドルに含まれていないことを確認','Verify env vars not in client bundle')+'\n';
  doc43+=_chk('NEXT_PUBLIC_プレフィックスの使用を最小限に','Minimize NEXT_PUBLIC_ usage')+'\n';
  doc43+=_chk('Secrets Managerでローテーション戦略を設定','Set up rotation strategy in Secrets Manager')+'\n\n';

  // Authentication & Session Security
  doc43+='---\n\n## Authentication & Session Security\n\n';
  doc43+=(G?'### 認証方式: ':'### Auth Method: ')+auth.sot+'\n\n';

  if(auth.sot.includes('Supabase')){
    doc43+='#### Supabase Auth Configuration\n\n';
    doc43+=_chk('MFA有効化 (Dashboard → Auth → MFA)','Enable MFA (Dashboard → Auth → MFA)')+'\n';
    doc43+=_chk('Email confirmation強制','Enforce email confirmation')+'\n';
    doc43+=_chk('JWT有効期限を適切に設定 (デフォルト1時間)','Set appropriate JWT expiry (default 1h)')+'\n';
    doc43+=_chk('Refresh token rotation有効化','Enable refresh token rotation')+'\n';
    doc43+=_chk('カスタムClaimsでRBAC実装','Implement RBAC with custom claims')+'\n\n';
  }else if(auth.sot.includes('Firebase')){
    doc43+='#### Firebase Auth Configuration\n\n';
    doc43+=_chk('Firebase Auth MFA有効化','Enable Firebase Auth MFA')+'\n';
    doc43+=_chk('Email enumeration protection有効','Enable email enumeration protection')+'\n';
    doc43+=_chk('passwordPolicyOptions設定','Configure passwordPolicyOptions')+'\n';
    doc43+=_chk('reCAPTCHA統合','Integrate reCAPTCHA')+'\n\n';
  }else if(auth.sot.includes('NextAuth')||auth.sot.includes('Auth.js')){
    doc43+='#### NextAuth Configuration\n\n';
    doc43+=_chk('NEXTAUTH_SECRET強化 (32文字以上ランダム)','Strengthen NEXTAUTH_SECRET (32+ random chars)')+'\n';
    doc43+=_chk('session.maxAge適切化 (デフォルト30日→短縮検討)','Optimize session.maxAge (default 30d → consider shortening)')+'\n';
    doc43+=_chk('session.updateAge設定','Set session.updateAge')+'\n';
    doc43+=_chk('CSRFトークン検証有効','Verify CSRF token validation enabled')+'\n\n';
  }else{
    doc43+='#### Custom JWT Implementation\n\n';
    doc43+=_chk('JWT署名アルゴリズムRS256推奨 (HS256非推奨)','Use RS256 for JWT signing (avoid HS256)')+'\n';
    doc43+=_chk('Access token有効期限15分以内','Access token expiry ≤15 min')+'\n';
    doc43+=_chk('Refresh token rotation実装','Implement refresh token rotation')+'\n';
    doc43+=_chk('Token blacklist実装 (Redis推奨)','Implement token blacklist (Redis recommended)')+'\n\n';
  }

  doc43+=(G?'### セッション管理ベストプラクティス\n\n':'### Session Management Best Practices\n\n');
  doc43+=_chk('ログアウト時にサーバー側でセッション無効化','Invalidate session server-side on logout')+'\n';
  doc43+=_chk('並行セッション制限検討','Consider concurrent session limits')+'\n';
  doc43+=_chk('異常なセッション活動を監視','Monitor abnormal session activity')+'\n';
  doc43+=_chk('パスワード変更時に全セッション無効化','Invalidate all sessions on password change')+'\n\n';

  doc43+=(G?'## 📚 関連ドキュメント\n\n':'## 📚 Related Documents\n\n');
  doc43+='- [Threat Model](./44_threat_model.md)\n';
  doc43+='- [Compliance Matrix](./45_compliance_matrix.md)\n';
  doc43+='- [AI Security Playbook](./46_ai_security.md)\n';
  doc43+='- [Security Testing](./47_security_testing.md)\n';
  doc43+='- [Incident Response](./34_incident_response.md)\n';
  doc43+='- [Security (Overview)](./08_security.md)\n';

  // Org-scoped RLS (multi-tenant enhancement)
  var _isMultiTenant=/マルチ|multi|RLS|組織|org.*hier/i.test((a.org_model||'')+(a.mvp_features||''));
  if(_isMultiTenant){
    doc43+='\n## '+(G?'🔒 組織スコープ RLSポリシー (マルチテナント)':'🔒 Org-Scoped RLS Policies (Multi-tenant)')+'\n\n';
    doc43+=(G?'> マルチテナント環境での完全なテナント分離を実現するRLSポリシーテンプレート。\n\n':
               '> RLS policy templates for complete tenant isolation in multi-tenant environments.\n\n');
    doc43+='```sql\n';
    doc43+='-- '+(G?'基本: 組織メンバーのみアクセス可能':'Base: org members only') +'\n';
    doc43+='CREATE POLICY "org_isolation" ON resources\n';
    doc43+='  FOR SELECT USING (\n';
    doc43+='    org_id IN (\n';
    doc43+='      SELECT org_id FROM org_members\n';
    doc43+='      WHERE user_id = auth.uid()\n';
    doc43+='    )\n';
    doc43+='  );\n\n';
    doc43+='-- '+(G?'Admin以上のみ書込可能':'Admin or above can write')+'\n';
    doc43+='CREATE POLICY "admin_write" ON org_settings\n';
    doc43+='  FOR ALL USING (\n';
    doc43+='    org_id IN (\n';
    doc43+='      SELECT org_id FROM org_members\n';
    doc43+='      WHERE user_id = auth.uid()\n';
    doc43+='      AND role IN (\'owner\', \'admin\')\n';
    doc43+='    )\n';
    doc43+='  );\n\n';
    doc43+='-- '+(G?'Ownerのみ削除可能':'Owner only can delete')+'\n';
    doc43+='CREATE POLICY "owner_delete" ON organizations\n';
    doc43+='  FOR DELETE USING (\n';
    doc43+='    id IN (\n';
    doc43+='      SELECT org_id FROM org_members\n';
    doc43+='      WHERE user_id = auth.uid() AND role = \'owner\'\n';
    doc43+='    )\n';
    doc43+='  );\n```\n\n';
    doc43+=(G?'### クロステナントクエリ防止チェックリスト\n\n':'### Cross-tenant Query Prevention Checklist\n\n');
    doc43+=(G?'- [ ] 全テーブルに `org_id` カラムが存在するか\n':'- [ ] All tables have `org_id` column\n');
    doc43+=(G?'- [ ] 全テーブルでRLSが `ENABLED` になっているか\n':'- [ ] RLS is ENABLED on all tables\n');
    doc43+=(G?'- [ ] `service_role` キーはサーバーサイドのみで使用されているか\n':'- [ ] `service_role` key used server-side only\n');
    doc43+=(G?'- [ ] `auth.uid()` を使ったポリシーが全テーブルに設定されているか\n':'- [ ] `auth.uid()` policies set on all tables\n');
    doc43+=(G?'- [ ] org_idでのINDEX設定 (`(org_id, id)`) が完了しているか\n':'- [ ] Index on `(org_id, id)` created for performance\n');
  }

  S.files['docs/43_security_intelligence.md']=doc43;

  // ═══ DOC 44: STRIDE Threat Model ═══
  let doc44='';
  doc44+='# '+(G?'脅威モデル — STRIDE分析':'Threat Model — STRIDE Analysis')+'\n\n';
  doc44+='> '+(G?'プロジェクト: ':'Project: ')+pn+'\n';
  doc44+='> '+(G?'生成日: ':'Generated: ')+new Date().toISOString().split('T')[0]+'\n\n';

  doc44+='## '+(G?'システム概要':'System Overview')+'\n\n';
  doc44+='- **Frontend:** '+frontend+'\n';
  doc44+='- **Backend:** '+backend+'\n';
  doc44+='- **Database:** '+database+'\n';
  doc44+='- **Auth:** '+auth.sot+'\n';
  doc44+='- **Domain:** '+domain+'\n\n';

  // Trust Boundaries
  doc44+='## '+(G?'トラストバウンダリ':'Trust Boundaries')+'\n\n';
  doc44+='```mermaid\n';
  doc44+='flowchart LR\n';
  doc44+='  Client["👤 Client\\n(Browser)"] -->|HTTPS| CDN["🌐 CDN\\n(Vercel/Cloudflare)"]\n';
  doc44+='  CDN -->|TLS| API["⚙️ API\\n('+backend+')"]\n';
  doc44+='  API -->|Encrypted| DB["🗄️ Database\\n('+database+')"]\n';
  doc44+='  API -->|JWT| Auth["🔐 Auth\\n('+auth.provider+')"]\n';
  if(hasPayment){
    doc44+='  API -->|Tokenized| Payment["💳 Payment\\n(Stripe)"]\n';
  }
  doc44+='  \n';
  doc44+='  style Client fill:#e1f5ff\n';
  doc44+='  style CDN fill:#fff4e1\n';
  doc44+='  style API fill:#ffe1e1\n';
  doc44+='  style DB fill:#e1ffe1\n';
  doc44+='  style Auth fill:#f0e1ff\n';
  if(hasPayment){
    doc44+='  style Payment fill:#ffe1f0\n';
  }
  doc44+='```\n\n';

  doc44+=(G?'**境界:**\n\n':'**Boundaries:**\n\n');
  doc44+='1. **'+(G?'パブリックインターネット ↔ CDN':'Public Internet ↔ CDN')+'**\n';
  doc44+='2. **CDN ↔ API** '+(G?'(信頼境界)':'(Trust boundary)')+'\n';
  doc44+='3. **API ↔ Database** '+(G?'(内部境界)':'(Internal boundary)')+'\n\n';

  // STRIDE per Entity
  doc44+='## '+(G?'エンティティ別STRIDE脅威分析':'STRIDE Threat Analysis per Entity')+'\n\n';

  if(entities.length===0){
    doc44+=(G?'> ⚠️ data_entitiesが未定義のため、一般的な脅威のみ記載します。\n\n':'> ⚠️ No entities defined. Showing generic threats only.\n\n');
  }else{
    doc44+='| Entity | S (Spoofing) | T (Tampering) | R (Repudiation) | I (Info Disclosure) | D (DoS) | E (Elevation) |\n';
    doc44+='|--------|--------------|---------------|-----------------|---------------------|---------|---------------|\n';

    entities.forEach(ent=>{
      const cols=getEntityColumns(ent,G,entities)||[];
      const hasUser=cols.some(c=>c.col==='user_id'||c.col.includes('user_id'));
      const isPay=ent.toLowerCase().includes('payment')||ent.toLowerCase().includes('order')||ent.toLowerCase().includes('transaction');
      const isPub=ent.toLowerCase().includes('post')||ent.toLowerCase().includes('article')||ent.toLowerCase().includes('blog');
      const hasFileCol=cols.some(c=>c.col.includes('file')||c.col.includes('image')||c.col.includes('attachment'));

      let pattern=STRIDE_PATTERNS.default;
      if(isPay)pattern=STRIDE_PATTERNS.isPayment;
      else if(hasUser)pattern=STRIDE_PATTERNS.hasUserId;
      else if(isPub)pattern=STRIDE_PATTERNS.isPublic;
      else if(hasFileCol)pattern=STRIDE_PATTERNS.hasFile;

      doc44+='| '+ent+' | '+_lvl(pattern.S)+' | '+_lvl(pattern.T)+' | '+_lvl(pattern.R)+' | '+_lvl(pattern.I)+' | '+_lvl(pattern.D)+' | '+_lvl(pattern.E)+' |\n';
    });
    doc44+='\n';
  }

  // Attack Surface Analysis
  doc44+='## '+(G?'攻撃対象領域分析':'Attack Surface Analysis')+'\n\n';
  doc44+=(G?'### 外部入力ポイント\n\n':'### External Input Points\n\n');

  const inputs=[];
  if(features.some(f=>f.toLowerCase().includes('auth')||f.toLowerCase().includes('login')||f.toLowerCase().includes('signup'))){
    inputs.push(G?'ログイン/サインアップフォーム':'Login/Signup forms');
  }
  if(features.some(f=>f.toLowerCase().includes('post')||f.toLowerCase().includes('comment')||f.toLowerCase().includes('review'))){
    inputs.push(G?'コンテンツ投稿フォーム':'Content submission forms');
  }
  if(features.some(f=>f.toLowerCase().includes('search'))){
    inputs.push(G?'検索クエリ':'Search queries');
  }
  if(features.some(f=>f.toLowerCase().includes('upload')||f.toLowerCase().includes('file')||f.toLowerCase().includes('image'))){
    inputs.push(G?'ファイルアップロード':'File uploads');
  }
  if(features.some(f=>f.toLowerCase().includes('api'))){
    inputs.push('REST/GraphQL API');
  }
  if(hasPayment){
    inputs.push(G?'決済フォーム':'Payment forms');
  }

  if(inputs.length>0){
    inputs.forEach(inp=>doc44+='- '+inp+'\n');
    doc44+='\n';
  }else{
    doc44+=(G?'> 特定の入力ポイントは検出されませんでした。mvp_featuresを確認してください。\n\n':'> No specific input points detected. Review mvp_features.\n\n');
  }

  doc44+=(G?'### 高リスクフィーチャー\n\n':'### High-Risk Features\n\n');
  const highRisk=[];
  if(features.some(f=>f.toLowerCase().includes('auth')))highRisk.push(G?'認証機能 (CRITICAL)':'Authentication (CRITICAL)');
  if(hasPayment)highRisk.push(G?'決済処理 (CRITICAL)':'Payment processing (CRITICAL)');
  if(features.some(f=>f.toLowerCase().includes('upload')))highRisk.push(G?'ファイルアップロード (HIGH)':'File uploads (HIGH)');
  if(hasAI)highRisk.push(G?'AI統合 (HIGH — プロンプトインジェクション)':'AI integration (HIGH — prompt injection)');
  if(features.some(f=>f.toLowerCase().includes('admin')))highRisk.push(G?'管理機能 (HIGH)':'Admin features (HIGH)');

  if(highRisk.length>0){
    highRisk.forEach(hr=>doc44+='- '+hr+'\n');
    doc44+='\n';
  }

  // Threat-Mitigation Matrix
  doc44+='## '+(G?'脅威-対策マトリクス':'Threat-Mitigation Matrix')+'\n\n';
  doc44+='| '+(G?'脅威':'Threat')+' | '+(G?'リスク':'Risk')+' | '+(G?'対策':'Mitigation')+' | '+(G?'実装':'Implementation')+' | Status |\n';
  doc44+='|------|------|-----------|----------------|--------|\n';

  // Generic threats
  const threats=[
    {threat_ja:'SQLインジェクション',threat_en:'SQL Injection',risk:'HIGH',mit_ja:'パラメータ化クエリ',mit_en:'Parameterized queries',impl:'ORM/Supabase RLS'},
    {threat_ja:'XSS',threat_en:'XSS',risk:'HIGH',mit_ja:'入力サニタイズ + CSP',mit_en:'Input sanitization + CSP',impl:'DOMPurify + CSP headers'},
    {threat_ja:'CSRF',threat_en:'CSRF',risk:'MED',mit_ja:'CSRFトークン',mit_en:'CSRF tokens',impl:'SameSite cookies + tokens'},
    {threat_ja:'IDOR',threat_en:'IDOR',risk:'HIGH',mit_ja:'認可チェック',mit_en:'Authorization checks',impl:'RLS policies / owner checks'},
    {threat_ja:'認証バイパス',threat_en:'Auth bypass',risk:'CRITICAL',mit_ja:'サーバー側検証',mit_en:'Server-side validation',impl:'Middleware / RLS'},
  ];

  if(hasPayment){
    threats.push({threat_ja:'カード情報漏洩',threat_en:'Card data leakage',risk:'CRITICAL',mit_ja:'トークナイゼーション',mit_en:'Tokenization',impl:'Stripe Elements'});
  }
  if(hasAI){
    threats.push({threat_ja:'プロンプトインジェクション',threat_en:'Prompt injection',risk:'HIGH',mit_ja:'入力検証 + コンテキスト分離',mit_en:'Input validation + context isolation',impl:'See docs/46_ai_security.md'});
  }

  threats.forEach(t=>{
    const threat=G?t.threat_ja:t.threat_en;
    const mit=G?t.mit_ja:t.mit_en;
    doc44+='| '+threat+' | '+_lvl(t.risk)+' | '+mit+' | '+t.impl+' | ⬜ |\n';
  });
  doc44+='\n';

  doc44+=(G?'## 📚 関連ドキュメント\n\n':'## 📚 Related Documents\n\n');
  doc44+='- [Security Intelligence](./43_security_intelligence.md)\n';
  doc44+='- [Security Testing](./47_security_testing.md)\n';
  doc44+='- [Incident Response](./34_incident_response.md)\n';

  S.files['docs/44_threat_model.md']=doc44;

  // ═══ DOC 45: Compliance Matrix ═══
  let doc45='';
  doc45+='# '+(G?'コンプライアンスマトリクス':'Compliance Matrix')+'\n\n';
  doc45+='> '+(G?'プロジェクト: ':'Project: ')+pn+'\n';
  doc45+='> '+(G?'ドメイン: ':'Domain: ')+domain+'\n';
  doc45+='> '+(G?'生成日: ':'Generated: ')+new Date().toISOString().split('T')[0]+'\n\n';

  doc45+=(G?'このドキュメントは、プロジェクトのドメインに基づいて該当するコンプライアンスフレームワークのチェックリストを提供します。\n\n':'This document provides compliance framework checklists based on your project domain.\n\n');

  // Determine applicable compliance frameworks
  const applicableComp=[];
  Object.keys(COMPLIANCE_DB).forEach(key=>{
    const comp=COMPLIANCE_DB[key];
    if(comp.domains.includes(domain)){
      applicableComp.push(comp);
    }
  });

  // Always include ASVS as baseline
  if(!applicableComp.some(c=>c.name.includes('ASVS'))){
    applicableComp.push(COMPLIANCE_DB.asvs);
  }

  if(applicableComp.length===0){
    applicableComp.push(COMPLIANCE_DB.asvs);
  }

  doc45+='## '+(G?'適用フレームワーク':'Applicable Frameworks')+'\n\n';
  applicableComp.forEach(c=>doc45+='- **'+c.name+'** ('+c.domains.join(', ')+')\n');
  doc45+='\n---\n\n';

  applicableComp.forEach(comp=>{
    doc45+=_compSection(comp,G);
    doc45+='---\n\n';
  });

  doc45+=(G?'## 📚 関連ドキュメント\n\n':'## 📚 Related Documents\n\n');
  doc45+='- [Security Intelligence](./43_security_intelligence.md)\n';
  doc45+='- [Incident Response](./34_incident_response.md)\n';
  doc45+='- [QA Strategy](./28_qa_strategy.md)\n';

  S.files['docs/45_compliance_matrix.md']=doc45;

  // ═══ DOC 46: AI Security Playbook ═══
  let doc46='';
  doc46+='# '+(G?'AI時代のセキュリティプレイブック':'AI-Era Security Playbook')+'\n\n';
  doc46+='> '+(G?'AI生成コード特有のリスクと対策を包括的にカバー':'Comprehensive coverage of AI-generated code risks and mitigations')+'\n\n';

  doc46+='## '+(G?'1. Velocity Paradox — 速度のパラドックス':'1. Velocity Paradox')+'\n\n';
  doc46+=(G?
    'AI支援開発により開発速度は劇的に向上しますが、同時にセキュリティリスクも増大します。\n\n'+
    '**統計:**\n'+
    '- AI生成コードの45-62%に脆弱性が含まれる (Stanford研究)\n'+
    '- 「正しさの幻想」(Illusion of Correctness): AIが生成したコードは人間より信頼されやすい\n'+
    '- シャドーコード累積: レビューされないAI生成コードが積み重なるリスク\n\n'
    :
    'AI-assisted development dramatically increases velocity, but also security risks.\n\n'+
    '**Statistics:**\n'+
    '- 45-62% of AI-generated code contains vulnerabilities (Stanford study)\n'+
    '- Illusion of Correctness: AI code is trusted more than human code\n'+
    '- Shadow Code Accumulation: Unreviewed AI code accumulates\n\n'
  );

  doc46+='## '+(G?'2. Package Hallucination Detection — パッケージ幻覚検知':'2. Package Hallucination Detection')+'\n\n';
  doc46+=(G?'AIは存在しないパッケージを「幻覚」として提案することがあります。\n\n':'AI can hallucinate non-existent packages.\n\n');

  doc46+=(G?'### 検証ワークフロー\n\n':'### Verification Workflow\n\n');
  doc46+='```bash\n';
  doc46+='# Step 1: Verify package exists\n';
  doc46+='npm view <package-name>\n\n';
  doc46+='# Step 2: Check registry\n';
  doc46+='curl https://registry.npmjs.org/<package-name>\n\n';
  doc46+='# Step 3: Check downloads (low downloads = suspicious)\n';
  doc46+='npm view <package-name> dist.tarball\n';
  doc46+='```\n\n';

  doc46+=(G?'### CI検証ステップ\n\n':'### CI Verification Step\n\n');
  doc46+='```yaml\n';
  doc46+='# .github/workflows/ci.yml\n';
  doc46+='- name: Verify packages exist\n';
  doc46+='  run: |\n';
  doc46+='    for pkg in $(jq -r \'.dependencies | keys[]\' package.json); do\n';
  doc46+='      npm view "$pkg" > /dev/null || (echo "Package $pkg not found" && exit 1)\n';
  doc46+='    done\n';
  doc46+='```\n\n';

  doc46+=_chk('Lockfileを必ず使用 (package-lock.json / yarn.lock)','Always use lockfile (package-lock.json / yarn.lock)')+'\n';
  doc46+=_chk('SCA (Software Composition Analysis) ツール導入 (Snyk/Dependabot)','Adopt SCA tools (Snyk/Dependabot)')+'\n\n';

  doc46+='## '+(G?'3. AI生成コードレビューチェックリスト':'3. AI-Generated Code Review Checklist')+'\n\n';
  doc46+=_chk('認可ロジック(Authorization)の存在確認 — IDORチェック','Verify authorization logic exists — check for IDOR')+'\n';
  doc46+=_chk('シークレットのハードコード確認','Check for hardcoded secrets')+'\n';
  doc46+=_chk('クライアントバンドルへのシークレット漏洩','Verify secrets not in client bundle')+'\n';
  doc46+=_chk('入力バリデーションの網羅性','Verify comprehensive input validation')+'\n';
  doc46+=_chk('エラーハンドリングの適切性 (情報漏洩回避)','Proper error handling (avoid info leakage)')+'\n';
  doc46+=_chk('論理的欠陥の有無 (ビジネスロジック検証)','Check for logical flaws (business logic)')+'\n';
  doc46+=_chk('レースコンディション脆弱性','Race condition vulnerabilities')+'\n';
  doc46+=_chk('SQL/NoSQLインジェクション防止','SQL/NoSQL injection prevention')+'\n\n';

  doc46+='## '+(G?'4. 敵対的AIレビュープロンプト':'4. Adversarial AI Review Prompts')+'\n\n';
  doc46+=(G?'セキュリティ監査用プロンプトテンプレート:\n\n':'Security audit prompt templates:\n\n');

  // Entity security classification (reuse pattern from doc44 STRIDE analysis)
  const entClasses=entities.map(ent=>{
    const cols=getEntityColumns(ent,G,entities)||[];
    const hasU=cols.some(c=>c.col==='user_id'||c.col.includes('user_id'));
    const isPay=ent.toLowerCase().match(/payment|order|transaction/);
    const hasF=cols.some(c=>c.col.includes('file')||c.col.includes('image'));
    return ent+'('+(isPay?'CRITICAL':hasU?'HIGH':hasF?'MED':'STD')+')';
  }).join(', ');

  const rlsCtx=backend.includes('Supabase')
    ?(G?'Supabase RLSポリシーを全テーブルで検証':'Verify Supabase RLS policies on all tables')
    :backend.includes('Firebase')
    ?(G?'Firestore Security Rulesを全コレクションで検証':'Verify Firestore Security Rules on all collections')
    :(G?'認可ミドルウェアを全ルートで検証':'Verify authorization middleware on all routes');

  // Context-aware prompts with project-specific details
  const prompts_ja=[
    'あなたはセキュリティ監査員です。このコードの認可ロジックの不備を見つけてください。特にIDOR (Insecure Direct Object Reference) 脆弱性に注目してください。\n\n'+
    '**プロジェクトコンテキスト:**\n'+
    '- エンティティとセキュリティ分類: '+entClasses+'\n'+
    '- 認証方式: '+auth.sot+'\n'+
    '- 認可検証ポイント: '+rlsCtx+'\n\n'+
    '各エンティティのowner検証が適切か、RLS/ミドルウェアがデフォルト拒否原則に従っているかを重点的にチェックしてください。',

    'このコードにおけるすべての外部入力ポイントをリストアップし、各入力に対するバリデーション・サニタイゼーションが適切か評価してください。\n\n'+
    '**対象エンティティと入力カラム:**\n'+
    entities.slice(0,5).map(ent=>{
      const cols=getEntityColumns(ent,G,entities)||[];
      const inputCols=cols.filter(c=>!c.col.includes('_id')&&!c.col.includes('created')&&!c.col.includes('updated')).map(c=>c.col).join(', ');
      return '- '+ent+': '+inputCols;
    }).join('\n')+'\n\n'+
    'Zodスキーマによるサーバーサイド検証が全入力に適用されているか確認してください。',

    'このコードのエラーハンドリングを分析し、スタックトレースやデバッグ情報が本番環境で漏洩する可能性がないか確認してください。\n\n'+
    '**技術スタック別の注意点:**\n'+
    (backend.includes('Supabase')?'- Supabase: .error プロパティが詳細すぎないか確認\n':'')+
    (backend.includes('Firebase')?'- Firebase: Cloud Functionsのエラーがクライアントに漏洩していないか確認\n':'')+
    (frontend.includes('Next.js')?'- Next.js: Server Actionsのエラーが適切にキャッチされているか確認\n':'')+
    '\n本番環境では一般的なエラーメッセージのみを返し、詳細はログに記録してください。',

    'このコードにハードコードされたシークレット、APIキー、パスワードがないか探してください。環境変数が適切に使用されているか確認してください。\n\n'+
    '**チェックすべき環境変数:**\n'+
    (backend.includes('Supabase')?'- SUPABASE_SERVICE_ROLE_KEY (サーバーサイドのみ)\n- NEXT_PUBLIC_SUPABASE_ANON_KEY (クライアント公開OK)\n':'')+
    (backend.includes('Firebase')?'- FIREBASE_SERVICE_ACCOUNT_KEY (サーバーサイドのみ)\n- NEXT_PUBLIC_FIREBASE_CONFIG (クライアント公開OK)\n':'')+
    (hasPayment?'- STRIPE_SECRET_KEY (サーバーサイドのみ)\n- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (クライアント公開OK)\n':'')+
    '\nクライアントバンドルに機密情報が含まれていないことを `npm run build` 後に検証してください。',

    'このコードのセッション管理・トークン管理を分析し、セッション固定攻撃、トークン漏洩、不適切な有効期限設定がないか確認してください。\n\n'+
    '**認証実装の詳細:**\n'+
    '- Source of Truth: '+auth.sot+'\n'+
    '- トークンタイプ: '+(auth.tokenType||'JWT')+'\n'+
    '- 検証方式: '+(auth.tokenVerify||'署名検証')+'\n\n'+
    (auth.sot.includes('Supabase')?'Supabase Auth: JWT有効期限、refresh token rotation、MFA設定を確認\n':'')+
    (auth.sot.includes('Firebase')?'Firebase Auth: セッション有効期限、カスタムクレーム、reCAPTCHA統合を確認\n':'')+
    (auth.sot.includes('NextAuth')?'NextAuth: NEXTAUTH_SECRET強度、session.maxAge、CSRF保護を確認\n':'')
  ];

  const prompts_en=[
    'You are a security auditor. Find authorization logic flaws in this code. Focus on IDOR (Insecure Direct Object Reference) vulnerabilities.\n\n'+
    '**Project Context:**\n'+
    '- Entities and Security Classes: '+entClasses+'\n'+
    '- Auth Method: '+auth.sot+'\n'+
    '- Authorization Verification: '+rlsCtx+'\n\n'+
    'Focus on verifying owner checks for each entity and ensuring RLS/middleware follows default-deny principle.',

    'List all external input points in this code and evaluate whether validation/sanitization is appropriate for each input.\n\n'+
    '**Target Entities and Input Columns:**\n'+
    entities.slice(0,5).map(ent=>{
      const cols=getEntityColumns(ent,G,entities)||[];
      const inputCols=cols.filter(c=>!c.col.includes('_id')&&!c.col.includes('created')&&!c.col.includes('updated')).map(c=>c.col).join(', ');
      return '- '+ent+': '+inputCols;
    }).join('\n')+'\n\n'+
    'Verify that Zod schema server-side validation is applied to all inputs.',

    'Analyze error handling in this code and verify that stack traces or debug information cannot leak in production.\n\n'+
    '**Stack-Specific Notes:**\n'+
    (backend.includes('Supabase')?'- Supabase: Check if .error property is too detailed\n':'')+
    (backend.includes('Firebase')?'- Firebase: Verify Cloud Functions errors do not leak to client\n':'')+
    (frontend.includes('Next.js')?'- Next.js: Verify Server Actions errors are properly caught\n':'')+
    '\nReturn generic error messages in production and log details server-side.',

    'Search for hardcoded secrets, API keys, or passwords in this code. Verify environment variables are used appropriately.\n\n'+
    '**Environment Variables to Check:**\n'+
    (backend.includes('Supabase')?'- SUPABASE_SERVICE_ROLE_KEY (server-side only)\n- NEXT_PUBLIC_SUPABASE_ANON_KEY (client OK)\n':'')+
    (backend.includes('Firebase')?'- FIREBASE_SERVICE_ACCOUNT_KEY (server-side only)\n- NEXT_PUBLIC_FIREBASE_CONFIG (client OK)\n':'')+
    (hasPayment?'- STRIPE_SECRET_KEY (server-side only)\n- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (client OK)\n':'')+
    '\nVerify no secrets in client bundle after `npm run build`.',

    'Analyze session/token management in this code and check for session fixation, token leakage, or improper expiration settings.\n\n'+
    '**Auth Implementation Details:**\n'+
    '- Source of Truth: '+auth.sot+'\n'+
    '- Token Type: '+(auth.tokenType||'JWT')+'\n'+
    '- Verification: '+(auth.tokenVerify||'Signature verification')+'\n\n'+
    (auth.sot.includes('Supabase')?'Supabase Auth: Check JWT expiry, refresh token rotation, MFA settings\n':'')+
    (auth.sot.includes('Firebase')?'Firebase Auth: Check session expiry, custom claims, reCAPTCHA integration\n':'')+
    (auth.sot.includes('NextAuth')?'NextAuth: Check NEXTAUTH_SECRET strength, session.maxAge, CSRF protection\n':'')
  ];

  const prompts=G?prompts_ja:prompts_en;

  // Add stack-specific prompts (conditional)
  if(backend.includes('Supabase')){
    prompts.push(G?
      'Supabase RLSポリシーの網羅性を監査してください。\n\n'+
      '**監査対象テーブル:**\n'+
      entities.map(ent=>'- '+pluralize(ent).toLowerCase()).join('\n')+'\n\n'+
      '**チェックポイント:**\n'+
      '1. 全テーブルでRLS有効化 (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)\n'+
      '2. SELECT/INSERT/UPDATE/DELETE 各操作にポリシー定義\n'+
      '3. `auth.uid() = user_id` パターンの一貫適用\n'+
      '4. `service_role` キーがサーバーサイドのみで使用\n'+
      '5. `anon` キーの権限が最小限\n\n'+
      'Database settings → Row Level Security でポリシーの有無を確認し、不足があれば具体的なCREATE POLICYステートメントを提案してください。'
      :
      'Audit Supabase RLS policy coverage.\n\n'+
      '**Target Tables:**\n'+
      entities.map(ent=>'- '+pluralize(ent).toLowerCase()).join('\n')+'\n\n'+
      '**Checkpoints:**\n'+
      '1. RLS enabled on all tables (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)\n'+
      '2. Policies defined for SELECT/INSERT/UPDATE/DELETE\n'+
      '3. Consistent `auth.uid() = user_id` pattern\n'+
      '4. `service_role` key used server-side only\n'+
      '5. `anon` key permissions minimized\n\n'+
      'Check Database settings → Row Level Security and propose specific CREATE POLICY statements for any gaps.'
    );
  }

  if(backend.includes('Firebase')){
    prompts.push(G?
      'Firestore Security Rulesの網羅性を監査してください。\n\n'+
      '**監査対象コレクション:**\n'+
      entities.map(ent=>'- '+pluralize(ent).toLowerCase()).join('\n')+'\n\n'+
      '**チェックポイント:**\n'+
      '1. 全コレクションでルール定義 (デフォルト拒否)\n'+
      '2. `request.auth.uid == resource.data.userId` パターンの一貫適用\n'+
      '3. カスタムクレームによるロールベースアクセス制御\n'+
      '4. サブコレクションへのルール継承\n'+
      '5. Admin SDKの使用が最小限\n\n'+
      'firestore.rules ファイルを生成し、不足があれば具体的なルール定義を提案してください。'
      :
      'Audit Firestore Security Rules coverage.\n\n'+
      '**Target Collections:**\n'+
      entities.map(ent=>'- '+pluralize(ent).toLowerCase()).join('\n')+'\n\n'+
      '**Checkpoints:**\n'+
      '1. Rules defined for all collections (default deny)\n'+
      '2. Consistent `request.auth.uid == resource.data.userId` pattern\n'+
      '3. Role-based access control with custom claims\n'+
      '4. Rule inheritance for subcollections\n'+
      '5. Admin SDK usage minimized\n\n'+
      'Generate firestore.rules file and propose specific rule definitions for any gaps.'
    );
  }

  // Add compliance-specific prompts (conditional)
  const compFrameworks=[];
  Object.keys(COMPLIANCE_DB).forEach(key=>{
    if(COMPLIANCE_DB[key].domains.includes(domain)) compFrameworks.push(COMPLIANCE_DB[key]);
  });
  if(compFrameworks.length>0){
    const fwNames=compFrameworks.map(c=>c.name).join(', ');
    prompts.push(G?
      'コンプライアンス監査: '+fwNames+'\n\n'+
      'このプロジェクトのドメイン ('+domain+') では以下のコンプライアンスフレームワークが該当します。\n\n'+
      'docs/45_compliance_matrix.md を参照し、各フレームワークの必須要件がコードに実装されているか検証してください。\n\n'+
      '**検証方法:**\n'+
      '1. docs/45_compliance_matrix.md の要件チェックリストを確認\n'+
      '2. 各要件IDに対応する実装箇所をコードから特定\n'+
      '3. 未実装または不十分な要件をリストアップ\n'+
      '4. 各要件の実装コード例を提示\n\n'+
      '出力形式: Markdown表 (要件ID | 要件名 | 実装状況 | 不足事項 | 対策コード)'
      :
      'Compliance Audit: '+fwNames+'\n\n'+
      'The following compliance frameworks apply to this project\'s domain ('+domain+').\n\n'+
      'Reference docs/45_compliance_matrix.md and verify that each framework\'s mandatory requirements are implemented in the code.\n\n'+
      '**Verification Method:**\n'+
      '1. Review requirement checklist in docs/45_compliance_matrix.md\n'+
      '2. Identify implementation locations in code for each requirement ID\n'+
      '3. List unimplemented or insufficient requirements\n'+
      '4. Provide implementation code examples for each requirement\n\n'+
      'Output format: Markdown table (Req ID | Requirement | Status | Gaps | Fix Code)'
    );
  }

  prompts.forEach((p,i)=>{
    doc46+='### '+(G?'プロンプト':'Prompt')+' '+(i+1)+'\n\n';
    doc46+='```\n'+p+'\n```\n\n';
  });

  doc46+='## '+(G?'5. Agent Security (when ai_auto ≠ None)':'5. Agent Security (when ai_auto ≠ None)')+'\n\n';

  if(hasAI){
    doc46+=(G?'### Human-in-the-Loop (HITL) ゲートパターン\n\n':'### Human-in-the-Loop (HITL) Gate Pattern\n\n');
    doc46+=(G?'**不可逆操作の一覧:**\n\n':'**Irreversible Operations:**\n\n');
    doc46+='- '+(G?'本番デプロイ':'Production deployment')+'\n';
    doc46+='- '+(G?'データベース削除・マイグレーション':'Database deletion/migration')+'\n';
    doc46+='- '+(G?'外部API課金操作':'External API billing operations')+'\n';
    doc46+='- '+(G?'本番シークレット変更':'Production secret changes')+'\n';
    doc46+='- Git force push / branch削除\n\n';

    doc46+='```mermaid\n';
    doc46+='flowchart TD\n';
    doc46+='  A[Agent Action Request] --> B{Reversible?}\n';
    doc46+='  B -->|Yes| C[Execute]\n';
    doc46+='  B -->|No| D[HITL Gate]\n';
    doc46+='  D --> E{Human Approval?}\n';
    doc46+='  E -->|Yes| C\n';
    doc46+='  E -->|No| F[Abort]\n';
    doc46+='```\n\n';

    doc46+=(G?'### サンドボックス設定\n\n':'### Sandbox Configuration\n\n');
    doc46+=_chk('Docker/gVisor隔離環境でAgent実行','Run agents in Docker/gVisor isolation')+'\n';
    doc46+=_chk('ネットワークホワイトリスト設定','Configure network whitelist')+'\n';
    doc46+=_chk('最小権限APIキー使用','Use least-privilege API keys')+'\n';
    doc46+=_chk('ファイルシステムアクセス制限','Restrict filesystem access')+'\n\n';

    doc46+=(G?'### 間接プロンプトインジェクション防御\n\n':'### Indirect Prompt Injection Defense\n\n');
    doc46+=(G?
      '外部コンテンツ(Web、PDF、ユーザー投稿)をAIに処理させる際、悪意のある指示が埋め込まれている可能性があります。\n\n'+
      '**対策:**\n\n'
      :
      'When processing external content (Web, PDF, user submissions), malicious instructions may be embedded.\n\n'+
      '**Mitigations:**\n\n'
    );
    doc46+=_chk('外部コンテンツとシステムプロンプトを明確に分離','Clearly separate external content from system prompts')+'\n';
    doc46+=_chk('コンテンツ取得時にメタデータ検証','Validate metadata when fetching content')+'\n';
    doc46+=_chk('出力の検証・サニタイゼーション','Validate and sanitize outputs')+'\n';
    doc46+=_chk('ユーザー入力にプレフィックス付与 (例: "User input: ...")','Prefix user input (e.g., "User input: ...")')+'\n\n';
  }else{
    doc46+=(G?'> ai_auto=noneのため、このセクションはスキップされます。\n\n':'> ai_auto=none, this section is skipped.\n\n');
  }

  doc46+='## '+(G?'6. Privacy Mode & Data Protection':'6. Privacy Mode & Data Protection')+'\n\n';
  doc46+=(G?'### AI開発ツールのプライバシーモード設定\n\n':'### AI Development Tool Privacy Mode\n\n');
  doc46+='- **GitHub Copilot:** Settings → Suggestions matching public code: Block\n';
  doc46+='- **Cursor:** Settings → Privacy Mode: Enabled\n';
  doc46+='- **Cline:** Privacy settings確認\n\n';

  doc46+=_chk('コード学習データ除外設定を有効化','Enable code training data exclusion')+'\n';
  doc46+=_chk('機密リポジトリでAI機能を無効化検討','Consider disabling AI features for sensitive repos')+'\n';
  doc46+=_chk('.aiignoreファイルで機密ファイル除外','Exclude sensitive files with .aiignore')+'\n\n';

  doc46+=(G?'## 📚 関連ドキュメント\n\n':'## 📚 Related Documents\n\n');
  doc46+='- [Security Intelligence](./43_security_intelligence.md)\n';
  doc46+='- [Security Testing](./47_security_testing.md)\n';
  doc46+='- [AI Dev Runbook](./40_ai_dev_runbook.md)\n';
  if(hasAI){
    doc46+='- [Skills Catalog](../skills/catalog.md)\n';
  }

  S.files['docs/46_ai_security.md']=doc46;

  // ═══ DOC 47: Security Testing Templates ═══
  let doc47='';
  doc47+='# '+(G?'セキュリティテストテンプレート集':'Security Test Templates')+'\n\n';
  doc47+='> '+(G?'実行可能なセキュリティテストコード':'Executable security test code')+'\n\n';

  // RLS Tests (Supabase only)
  if(backend.includes('Supabase')&&entities.length>0){
    doc47+='## '+(G?'1. RLS Policy Tests (pgTAP)':'1. RLS Policy Tests (pgTAP)')+'\n\n';
    doc47+=(G?'Supabaseのpostgresデータベースで直接実行するテストです。\n\n':'Tests to run directly on Supabase postgres database.\n\n');

    entities.slice(0,3).forEach(ent=>{
      const cols=getEntityColumns(ent,G,entities)||[];
      const hasUser=cols.some(c=>c.col==='user_id'||c.col.includes('user_id'));
      if(!hasUser)return;

      const tbl=pluralize(ent).toLowerCase();
      doc47+='### '+ent+' RLS Test\n\n';
      doc47+='```sql\n';
      doc47+='BEGIN;\n';
      doc47+='SELECT plan(3);\n\n';
      doc47+='-- Setup: Insert test data as user-123\n';
      doc47+='SET LOCAL ROLE authenticated;\n';
      doc47+='SET LOCAL "request.jwt.claim.sub" TO \'user-123\';\n';
      doc47+='INSERT INTO '+tbl+' (user_id, ...) VALUES (\'user-123\', ...);\n\n';
      doc47+='-- Test 1: User sees own '+ent+'\n';
      doc47+='SELECT results_eq(\n';
      doc47+='  \'SELECT count(*)::int FROM '+tbl+' WHERE user_id = \'\'user-123\'\'\',\n';
      doc47+='  ARRAY[1],\n';
      doc47+='  \'User sees own '+ent+'\'\n';
      doc47+=');\n\n';
      doc47+='-- Test 2: User cannot see other user\'s '+ent+'\n';
      doc47+='SELECT is_empty(\n';
      doc47+='  \'SELECT * FROM '+tbl+' WHERE user_id = \'\'user-456\'\'\',\n';
      doc47+='  \'User cannot see other user\\\'s '+ent+'\'\n';
      doc47+=');\n\n';
      doc47+='-- Test 3: Anon cannot insert\n';
      doc47+='SET LOCAL ROLE anon;\n';
      doc47+='SELECT throws_ok(\n';
      doc47+='  \'INSERT INTO '+tbl+' (user_id, ...) VALUES (\'\'user-123\'\', ...)\',\n';
      doc47+='  \'Anon cannot insert '+ent+'\'\n';
      doc47+=');\n\n';
      doc47+='ROLLBACK;\n';
      doc47+='```\n\n';
    });
  }

  // Input Validation Schemas (Next.js/Zod)
  if(frontend.includes('Next.js')&&entities.length>0){
    doc47+='## '+(G?'2. Input Validation Schemas (Zod)':'2. Input Validation Schemas (Zod)')+'\n\n';

    entities.slice(0,3).forEach(ent=>{
      const cols=getEntityColumns(ent,G,entities)||[];
      doc47+='### '+ent+' Schema\n\n';
      doc47+='```typescript\n';
      doc47+='import { z } from \'zod\';\n\n';
      doc47+='export const '+ent.toLowerCase()+'Schema = z.object({\n';

      cols.slice(0,5).forEach(c=>{
        const name=c.col;
        const type=c.type||'VARCHAR';
        const constraints=c.constraint||'';

        if(name.includes('_id'))return; // Skip IDs

        let zodType='z.string()';
        if(type.includes('INT'))zodType='z.number().int()';
        else if(type.includes('BOOL'))zodType='z.boolean()';
        else if(type.includes('TEXT'))zodType='z.string()';
        else if(type.includes('VARCHAR')){
          const maxMatch=type.match(/VARCHAR\((\d+)\)/);
          if(maxMatch)zodType='z.string().max('+maxMatch[1]+')';
        }

        if(constraints.includes('NOT NULL'))zodType+='.min(1)';

        doc47+='  '+name+': '+zodType+',\n';
      });

      doc47+='});\n\n';
      doc47+='export type '+ent+' = z.infer<typeof '+ent.toLowerCase()+'Schema>;\n';
      doc47+='```\n\n';
    });
  }

  // API Security Tests
  doc47+='## '+(G?'3. API セキュリティテスト':'3. API Security Tests')+'\n\n';
  doc47+=(G?'### 認証バイパステスト\n\n':'### Auth Bypass Test\n\n');
  doc47+='```javascript\n';
  doc47+='// Using Jest + Supertest\n';
  doc47+='test(\'should reject unauthenticated requests\', async () => {\n';
  doc47+='  const res = await request(app)\n';
  doc47+='    .get(\'/api/protected\')\n';
  doc47+='    .expect(401);\n';
  doc47+='  expect(res.body.error).toMatch(/unauthorized/i);\n';
  doc47+='});\n';
  doc47+='```\n\n';

  doc47+=(G?'### IDORテスト\n\n':'### IDOR Test\n\n');
  doc47+='```javascript\n';
  doc47+='test(\'should prevent IDOR attacks\', async () => {\n';
  doc47+='  const user1Token = await getTokenForUser(\'user-1\');\n';
  doc47+='  const user2Token = await getTokenForUser(\'user-2\');\n\n';
  doc47+='  // User 2 tries to access User 1\'s resource\n';
  doc47+='  const res = await request(app)\n';
  doc47+='    .get(\'/api/posts/user-1-post-id\')\n';
  doc47+='    .set(\'Authorization\', `Bearer ${user2Token}`)\n';
  doc47+='    .expect(403);\n';
  doc47+='});\n';
  doc47+='```\n\n';

  doc47+=(G?'### Rate Limitingテスト\n\n':'### Rate Limiting Test\n\n');
  doc47+='```javascript\n';
  doc47+='test(\'should enforce rate limits\', async () => {\n';
  doc47+='  const requests = Array(101).fill(null).map(() =>\n';
  doc47+='    request(app).get(\'/api/public\')\n';
  doc47+='  );\n';
  doc47+='  const results = await Promise.all(requests);\n';
  doc47+='  const rateLimited = results.filter(r => r.status === 429);\n';
  doc47+='  expect(rateLimited.length).toBeGreaterThan(0);\n';
  doc47+='});\n';
  doc47+='```\n\n';

  // OWASP ZAP
  doc47+='## '+(G?'4. OWASP ZAP Configuration':'4. OWASP ZAP Configuration')+'\n\n';
  doc47+='```yaml\n';
  doc47+='# .github/workflows/zap-scan.yml\n';
  doc47+='name: OWASP ZAP Scan\n';
  doc47+='on: [pull_request]\n\n';
  doc47+='jobs:\n';
  doc47+='  zap_scan:\n';
  doc47+='    runs-on: ubuntu-latest\n';
  doc47+='    steps:\n';
  doc47+='      - uses: actions/checkout@v4\n';
  doc47+='      - name: ZAP Scan\n';
  doc47+='        uses: zaproxy/action-baseline@v0.7.0\n';
  doc47+='        with:\n';
  doc47+='          target: \'https://your-preview-url.vercel.app\'\n';
  doc47+='          rules_file_name: \'.zap/rules.tsv\'\n';
  doc47+='          cmd_options: \'-a\'\n';
  doc47+='```\n\n';

  // Penetration Testing Checklist
  doc47+='## '+(G?'5. ペネトレーションテストチェックリスト':'5. Penetration Testing Checklist')+'\n\n';
  doc47+=(G?'### 事前準備\n\n':'### Pre-Test Preparation\n\n');
  doc47+=_chk('テスト環境準備 (本番データ使用禁止)','Prepare test environment (no production data)')+'\n';
  doc47+=_chk('テストスコープ定義','Define test scope')+'\n';
  doc47+=_chk('関係者への通知','Notify stakeholders')+'\n\n';

  doc47+=(G?'### テスト実施項目\n\n':'### Test Execution Items\n\n');
  doc47+='#### Authentication & Session\n';
  doc47+=_chk('Brute force攻撃耐性','Brute force resistance')+'\n';
  doc47+=_chk('パスワードリセット脆弱性','Password reset vulnerabilities')+'\n';
  doc47+=_chk('セッション固定攻撃','Session fixation')+'\n';
  doc47+=_chk('Remember me機能の安全性','Remember me security')+'\n\n';

  doc47+='#### Input Validation\n';
  doc47+=_chk('SQLインジェクション','SQL injection')+'\n';
  doc47+=_chk('XSS (Reflected/Stored/DOM-based)','XSS (Reflected/Stored/DOM-based)')+'\n';
  doc47+=_chk('コマンドインジェクション','Command injection')+'\n';
  doc47+=_chk('パストラバーサル','Path traversal')+'\n\n';

  doc47+='#### API Security\n';
  doc47+=_chk('認証・認可バイパス','Auth/authz bypass')+'\n';
  doc47+=_chk('IDOR (Insecure Direct Object Reference)','IDOR')+'\n';
  doc47+=_chk('Mass Assignment','Mass Assignment')+'\n';
  doc47+=_chk('Rate Limiting','Rate Limiting')+'\n\n';

  doc47+='#### File Upload\n';
  doc47+=_chk('悪意のあるファイルアップロード','Malicious file upload')+'\n';
  doc47+=_chk('ファイル拡張子検証','File extension validation')+'\n';
  doc47+=_chk('ファイルサイズ制限','File size limits')+'\n\n';

  doc47+=(G?'## 📚 関連ドキュメント\n\n':'## 📚 Related Documents\n\n');
  doc47+='- [Security Intelligence](./43_security_intelligence.md)\n';
  doc47+='- [Threat Model](./44_threat_model.md)\n';
  doc47+='- [Test Strategy](./36_test_strategy.md)\n';
  doc47+='- [QA Strategy](./28_qa_strategy.md)\n';

  S.files['docs/47_security_testing.md']=doc47;
}
