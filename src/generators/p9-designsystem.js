/* ═══ Pillar 9: Design System & Sequence Diagrams ═══ */

function genPillar9_DesignSystem(a,pn){
  const G=S.genLang==='ja';
  const fe=a.frontend||'React + Next.js';
  const be=a.backend||'Supabase';
  const auth=resolveAuth(a);
  const arch=resolveArch(a);
  const hasPay=a.payment&&!/なし|None|none/.test(a.payment);
  const entities=(a.data_entities||'').split(/[,、]/).map(s=>s.trim()).filter(Boolean);
  const screens=(a.screens||'').split(/[,、]/).map(s=>s.trim()).filter(Boolean);

  // Framework-specific CSS approach
  const isTailwind=fe.includes('Next')||fe.includes('Vite')||fe.includes('React');
  const isVuetify=fe.includes('Vue');
  const isMaterial=fe.includes('Angular');

  // Design Tokens
  const colorSection=G?'## デザイントークン':'## Design Tokens';
  const colorPalette=G?'### カラーパレット':'### Color Palette';
  const typography=G?'### タイポグラフィ':'### Typography Scale';
  const spacing=G?'### スペーシング':'### Spacing Scale';
  const breakpoints=G?'### ブレークポイント':'### Breakpoints';
  const components=G?'## コンポーネントカタログ':'## Component Catalog';
  const darkMode=G?'## ダーク/ライトモード':'## Dark/Light Mode';
  const guidelines=G?'## AI実装ガイドライン':'## AI Implementation Guidelines';

  let designDoc='# '+(G?'デザインシステム':'Design System')+'\n\n';
  designDoc+=G?'**重要**: AIエージェントは、UI実装時に必ずこのデザインシステムを参照し、一貫性を保ってください。':'**IMPORTANT**: AI agents MUST reference this design system when implementing UI to maintain consistency.\n\n';

  // Color Palette
  designDoc+=colorSection+'\n\n'+colorPalette+'\n\n';
  if(isTailwind){
    designDoc+='```css\n/* Tailwind config (tailwind.config.js) */\ntheme: {\n  extend: {\n    colors: {\n      primary: {\n        50: \'#f0f9ff\',\n        500: \'#0ea5e9\',\n        900: \'#0c4a6e\'\n      },\n      surface: {\n        light: \'#ffffff\',\n        dark: \'#1e293b\'\n      }\n    }\n  }\n}\n```\n';
  }else if(isVuetify){
    designDoc+='```js\n// Vuetify theme (vuetify.config.js)\ntheme: {\n  themes: {\n    light: {\n      primary: \'#1976D2\',\n      secondary: \'#424242\',\n      accent: \'#82B1FF\'\n    },\n    dark: {\n      primary: \'#2196F3\',\n      secondary: \'#424242\',\n      accent: \'#FF4081\'\n    }\n  }\n}\n```\n';
  }else{
    designDoc+='```css\n:root {\n  --color-primary: #0ea5e9;\n  --color-bg: #ffffff;\n  --color-surface: #f8fafc;\n  --color-text: #0f172a;\n  --color-success: #10b981;\n  --color-warning: #f59e0b;\n  --color-error: #ef4444;\n}\n[data-theme="dark"] {\n  --color-bg: #0f172a;\n  --color-surface: #1e293b;\n  --color-text: #f1f5f9;\n}\n```\n';
  }

  // Typography
  designDoc+='\n'+typography+'\n\n| '+(G?'要素':'Element')+' | '+(G?'サイズ':'Size')+' | '+(G?'ウェイト':'Weight')+' | '+(G?'行間':'Line Height')+' |\n|------|------|--------|-------------|\n';
  designDoc+='| h1 | 36px/2.25rem | 700 | 1.2 |\n| h2 | 30px/1.875rem | 600 | 1.3 |\n| h3 | 24px/1.5rem | 600 | 1.4 |\n| body | 16px/1rem | 400 | 1.5 |\n| small | 14px/0.875rem | 400 | 1.4 |\n| xs | 12px/0.75rem | 400 | 1.3 |\n\n';

  // Spacing
  designDoc+=spacing+'\n\n| '+(G?'トークン':'Token')+' | '+(G?'値':'Value')+' | '+(G?'用途':'Usage')+' |\n|------|-------|-------|\n';
  designDoc+='| xs | 4px | '+(G?'アイコン間隔':'Icon gaps')+'|\n| sm | 8px | '+(G?'コンパクト間隔':'Compact spacing')+'|\n| md | 16px | '+(G?'標準間隔':'Standard spacing')+'|\n| lg | 24px | '+(G?'セクション間':'Section gaps')+'|\n| xl | 32px | '+(G?'カード間':'Card spacing')+'|\n| 2xl | 48px | '+(G?'大セクション間':'Large sections')+'|\n\n';

  // Breakpoints
  designDoc+=breakpoints+'\n\n```css\n/* Mobile: 0-640px */\n/* Tablet: 641-1024px */\n/* Desktop: 1025-1536px */\n/* Wide: 1537px+ */\n```\n\n';

  // Component Catalog
  designDoc+=components+'\n\n';
  if(screens.length>0){
    screens.slice(0,5).forEach(scr=>{
      const comps=getScreenComponents(scr,G);
      if(comps){
        designDoc+='### '+(G?'画面：':'Screen: ')+scr+'\n';
        comps.forEach(c=>designDoc+='- '+c+'\n');
        designDoc+='\n';
      }
    });
  }
  if(isTailwind){
    designDoc+=(G?'**ライブラリ**: shadcn/ui または Headless UI を推奨\n':'**Library**: Recommend shadcn/ui or Headless UI\n')+'\n';
  }else if(isVuetify){
    designDoc+=(G?'**ライブラリ**: Vuetify 標準コンポーネント\n':'**Library**: Vuetify standard components\n')+'\n';
  }else if(isMaterial){
    designDoc+=(G?'**ライブラリ**: Angular Material\n':'**Library**: Angular Material\n')+'\n';
  }

  // Dark/Light Mode
  designDoc+=darkMode+'\n\n';
  if(isTailwind){
    designDoc+='```jsx\n// app/layout.tsx\nimport { ThemeProvider } from "next-themes"\n\nexport default function RootLayout({ children }) {\n  return (\n    <html suppressHydrationWarning>\n      <body>\n        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>\n          {children}\n        </ThemeProvider>\n      </body>\n    </html>\n  )\n}\n```\n\n'+(G?'使用例: `className="bg-white dark:bg-gray-900"`':'Usage: `className="bg-white dark:bg-gray-900"`')+'\n\n';
  }else{
    designDoc+='```js\n// Toggle theme\nfunction toggleTheme() {\n  document.documentElement.dataset.theme = \n    document.documentElement.dataset.theme === "dark" ? "light" : "dark";\n}\n```\n\n';
  }

  // AI Guidelines
  designDoc+=guidelines+'\n\n';
  designDoc+=(G?'1. **色**: 必ず定義済みトークンを使用。直接カラーコード（#000 等）を記述しない\n2. **スペーシング**: 4px グリッドに従う (xs/sm/md/lg/xl/2xl)\n3. **タイポグラフィ**: 定義されたスケールのみ使用\n4. **コンポーネント**: 推奨ライブラリから選択（独自実装は最小限）\n5. **ダークモード**: すべてのUI要素でLight/Dark対応を実装\n6. **レスポンシブ**: モバイルファースト設計（最小→最大）\n7. **アクセシビリティ**: ARIA属性、キーボードナビゲーション、コントラスト比 4.5:1 以上\n':'1. **Colors**: Always use predefined tokens. Never hardcode colors (#000)\n2. **Spacing**: Follow 4px grid (xs/sm/md/lg/xl/2xl)\n3. **Typography**: Use defined scale only\n4. **Components**: Choose from recommended library (minimize custom)\n5. **Dark Mode**: Implement Light/Dark support for all UI elements\n6. **Responsive**: Mobile-first design (min → max)\n7. **Accessibility**: ARIA attributes, keyboard navigation, contrast ratio ≥ 4.5:1\n')+'\n';

  S.files['docs/26_design_system.md']=designDoc;

  // Sequence Diagrams
  let seqDoc='# '+(G?'シーケンス図':'Sequence Diagrams')+'\n\n';
  seqDoc+=G?'**重要**: AIエージェントは、複雑なフローを実装する前にこのシーケンス図を参照してください。':'**IMPORTANT**: AI agents MUST reference these sequence diagrams before implementing complex flows.\n\n';

  // Auth Flow
  seqDoc+=(G?'## 認証フロー':'## Authentication Flow')+'\n\n```mermaid\nsequenceDiagram\n  participant U as User\n  participant C as Client\n  participant ';
  if(auth.provider==='supabase'){
    seqDoc+='S as Supabase Auth\n  U->>C: '+(G?'ログイン要求':'Login request')+'\n  C->>S: signInWithPassword(email, password)\n  S-->>C: {access_token, refresh_token}\n  C->>C: '+(G?'トークン保存':'Store tokens')+'\n  C->>S: getUser() with access_token\n  S-->>C: User object\n  C-->>U: '+(G?'ダッシュボード表示':'Show dashboard')+'\n```\n\n';
  }else if(auth.provider==='firebase'){
    seqDoc+='F as Firebase Auth\n  U->>C: '+(G?'ログイン要求':'Login request')+'\n  C->>F: signInWithEmailAndPassword()\n  F-->>C: User + ID Token\n  C->>C: '+(G?'トークン保存':'Store token')+'\n  C-->>U: '+(G?'ダッシュボード表示':'Show dashboard')+'\n```\n\n';
  }else if(auth.provider==='authjs'){
    seqDoc+='A as Auth.js\n  U->>C: '+(G?'ログイン要求':'Login request')+'\n  C->>A: signIn("credentials")\n  A->>A: '+(G?'認証情報検証':'Verify credentials')+'\n  A-->>C: Session cookie\n  C-->>U: '+(G?'ダッシュボード表示':'Show dashboard')+'\n```\n\n';
  }else{
    seqDoc+='API as Backend API\n  U->>C: '+(G?'ログイン要求':'Login request')+'\n  C->>API: POST /api/auth/login\n  API->>API: '+(G?'認証情報検証':'Verify credentials')+'\n  API-->>C: {token, user}\n  C->>C: '+(G?'トークン保存':'Store token')+'\n  C-->>U: '+(G?'ダッシュボード表示':'Show dashboard')+'\n```\n\n';
  }

  // CRUD Flow
  if(entities.length>0){
    const firstEntity=entities[0];
    seqDoc+=(G?'## CRUD操作（':'## CRUD Operation (')+firstEntity+(G?'）':')')+'\n\n```mermaid\nsequenceDiagram\n  participant U as User\n  participant C as Client\n  participant ';
    if(arch.isBaaS){
      const baasName=be.includes('Supabase')?'Supabase':be.includes('Firebase')?'Firebase':'Convex';
      seqDoc+=baasName[0]+' as '+baasName+'\n  U->>C: '+(G?'作成ボタンクリック':'Click create button')+'\n  C->>'+baasName[0]+': insert({...data})\n  '+baasName[0]+'-->>C: '+(G?'作成成功':'Created successfully')+'\n  C-->>U: '+(G?'成功通知':'Show success')+'\n  U->>C: '+(G?'一覧表示要求':'Request list')+'\n  C->>'+baasName[0]+': select().eq(...)\n  '+baasName[0]+'-->>C: '+firstEntity+' list\n  C-->>U: '+(G?'一覧表示':'Display list')+'\n```\n\n';
    }else{
      seqDoc+='API as Backend API\n  U->>C: '+(G?'作成ボタンクリック':'Click create button')+'\n  C->>API: POST /api/'+pluralize(firstEntity)+'\n  API->>API: '+(G?'バリデーション':'Validate')+'\n  API->>API: '+(G?'DB保存':'Save to DB')+'\n  API-->>C: '+(G?'作成成功':'201 Created')+'\n  C-->>U: '+(G?'成功通知':'Show success')+'\n```\n\n';
    }
  }

  // Payment Flow (if Stripe)
  if(hasPay&&(a.payment||'').includes('Stripe')){
    seqDoc+=(G?'## 決済フロー（Stripe）':'## Payment Flow (Stripe)')+'\n\n```mermaid\nsequenceDiagram\n  participant U as User\n  participant C as Client\n  participant API as Backend\n  participant S as Stripe\n  participant W as Webhook\n  U->>C: '+(G?'プラン選択':'Select plan')+'\n  C->>API: POST /api/checkout\n  API->>S: stripe.checkout.sessions.create()\n  S-->>API: session_id\n  API-->>C: {session_id}\n  C->>S: '+(G?'Checkoutページへリダイレクト':'Redirect to Checkout')+'\n  U->>S: '+(G?'カード情報入力':'Enter card info')+'\n  S->>W: webhook: checkout.session.completed\n  W->>W: '+(G?'DB更新（サブスク作成）':'Update DB (create subscription)')+'\n  W-->>S: 200 OK\n  S-->>U: '+(G?'完了ページへリダイレクト':'Redirect to success page')+'\n```\n\n';
  }

  // Error Handling
  seqDoc+=(G?'## エラーハンドリング':'## Error Handling')+'\n\n```mermaid\nsequenceDiagram\n  participant C as Client\n  participant API as Backend\n  C->>API: '+(G?'リクエスト':'Request')+'\n  API-->>C: 400/401/403/500\n  C->>C: '+(G?'エラーメッセージ抽出':'Parse error message')+'\n  C->>C: '+(G?'トースト表示':'Show toast notification')+'\n  alt '+(G?'401 認証エラー':'401 Unauthorized')+'\n    C->>C: '+(G?'ログイン画面へリダイレクト':'Redirect to login')+'\n  else '+(G?'5xx サーバーエラー':'5xx Server Error')+'\n    C->>C: '+(G?'リトライボタン表示':'Show retry button')+'\n  end\n```\n\n';

  S.files['docs/27_sequence_diagrams.md']=seqDoc;
}
