/* ═══ LEARNING RESOURCES DB ═══ */
/* Each entry: { n: display name, u: URL }
   Add new entries when new tech choices are added to questions.
   Keys should match the lookup keys used in showRoadmapUI(). */
const RESOURCES={
  /* Web Fundamentals */
  html:{n:'MDN Web Docs',u:'https://developer.mozilla.org/ja/docs/Web'},
  tailwind:{n:'Tailwind Docs',u:'https://tailwindcss.com/docs'},
  js:{n:'javascript.info',u:'https://ja.javascript.info/'},
  /* Frontend Frameworks */
  react:{n:'React Docs',u:'https://react.dev/learn'},
  nextjs:{n:'Next.js Docs',u:'https://nextjs.org/docs'},
  vue:{n:'Vue.js Guide',u:'https://ja.vuejs.org/guide/introduction'},
  svelte:{n:'Svelte Tutorial',u:'https://svelte.dev/tutorial'},
  astro:{n:'Astro Docs',u:'https://docs.astro.build'},
  angular:{n:'Angular Docs',u:'https://angular.dev/overview'},
  remix:{n:'Remix Docs',u:'https://remix.run/docs/en/main'},
  /* UI Libraries */
  shadcn:{n:'shadcn/ui',u:'https://ui.shadcn.com/docs'},
  /* State & Data */
  zustand:{n:'Zustand',u:'https://zustand-demo.pmnd.rs/'},
  rquery:{n:'TanStack Query',u:'https://tanstack.com/query/latest'},
  /* Testing */
  vitest:{n:'Vitest',u:'https://vitest.dev/guide/'},
  /* Backend Runtimes */
  node:{n:'Node.js Docs',u:'https://nodejs.org/docs/latest/api/'},
  express:{n:'Express.js',u:'https://expressjs.com/'},
  fastify:{n:'Fastify',u:'https://fastify.dev/docs/latest/'},
  nestjs:{n:'NestJS',u:'https://docs.nestjs.com/'},
  fastapi:{n:'FastAPI',u:'https://fastapi.tiangolo.com/'},
  django:{n:'Django',u:'https://docs.djangoproject.com/'},
  spring:{n:'Spring Boot',u:'https://spring.io/guides'},
  go:{n:'Go Gin',u:'https://gin-gonic.com/docs/'},
  hono:{n:'Hono',u:'https://hono.dev/docs/'},
  /* ORM */
  prisma:{n:'Prisma Docs',u:'https://www.prisma.io/docs'},
  drizzle:{n:'Drizzle ORM',u:'https://orm.drizzle.team/docs/overview'},
  typeorm:{n:'TypeORM',u:'https://typeorm.io/'},
  sqlalchemy:{n:'SQLAlchemy',u:'https://docs.sqlalchemy.org/'},
  kysely:{n:'Kysely',u:'https://kysely.dev/docs/intro'},
  /* BaaS / DB */
  firebase:{n:'Firebase Docs',u:'https://firebase.google.com/docs'},
  supabase:{n:'Supabase Docs',u:'https://supabase.com/docs'},
  postgres:{n:'PostgreSQL Docs',u:'https://www.postgresql.org/docs/'},
  mongo:{n:'MongoDB Manual',u:'https://www.mongodb.com/docs/manual/'},
  mysql:{n:'MySQL Docs',u:'https://dev.mysql.com/doc/'},
  redis:{n:'Redis Docs',u:'https://redis.io/docs/'},
  neon:{n:'Neon Docs',u:'https://neon.tech/docs'},
  /* Auth */
  nextauth:{n:'Auth.js',u:'https://authjs.dev/'},
  clerk:{n:'Clerk Docs',u:'https://clerk.com/docs'},
  /* Mobile */
  expo:{n:'Expo Docs',u:'https://docs.expo.dev/'},
  flutter:{n:'Flutter Docs',u:'https://docs.flutter.dev/'},
  rn:{n:'React Native',u:'https://reactnative.dev/docs/getting-started'},
  /* DevOps */
  docker:{n:'Docker Docs',u:'https://docs.docker.com/'},
  ghactions:{n:'GitHub Actions',u:'https://docs.github.com/actions'},
  /* Deploy */
  vercel:{n:'Vercel Docs',u:'https://vercel.com/docs'},
  cloudflare:{n:'CF Pages',u:'https://developers.cloudflare.com/pages/'},
  railway:{n:'Railway Docs',u:'https://docs.railway.com/'},
  /* AI Dev */
  cursor:{n:'Cursor Docs',u:'https://docs.cursor.com/'},
  claudecode:{n:'Claude Code',u:'https://docs.anthropic.com/en/docs/claude-code'},
  mcp:{n:'MCP Spec',u:'https://modelcontextprotocol.io/'},
  copilot:{n:'GitHub Copilot',u:'https://docs.github.com/copilot'},
  windsurf:{n:'Windsurf Docs',u:'https://docs.windsurf.com/'},
  antigravity:{n:'Google Antigravity',u:'https://antigravity.google/'},
  openrouter:{n:'OpenRouter Docs',u:'https://openrouter.ai/docs'},
  augment:{n:'Augment Code',u:'https://www.augmentcode.com/'},
  aider:{n:'Aider Docs',u:'https://aider.chat/docs/'},
  jules:{n:'Jules (Google)',u:'https://jules.google/'},
  amazonq:{n:'Amazon Q Developer',u:'https://aws.amazon.com/q/developer/'},
  geminiassist:{n:'Gemini Code Assist',u:'https://cloud.google.com/gemini/docs/codeassist/overview'},
  junie:{n:'JetBrains Junie',u:'https://www.jetbrains.com/junie/'},
  tabnine:{n:'Tabnine',u:'https://www.tabnine.com/'},
  /* Payments */
  stripe:{n:'Stripe Docs',u:'https://docs.stripe.com/'},
  paddle:{n:'Paddle Docs',u:'https://developer.paddle.com/'},
  /* Dev Methods */
  tdd:{n:'TDD Guide',u:'https://martinfowler.com/bliki/TestDrivenDevelopment.html'},
  bdd:{n:'BDD Intro',u:'https://cucumber.io/docs/bdd/'},
  ddd:{n:'DDD Reference',u:'https://www.domainlanguage.com/ddd/reference/'},
  sdd:{n:'SDD Overview',u:'https://en.wikipedia.org/wiki/Specification-driven_development'},
  fdd:{n:'FDD Guide',u:'https://en.wikipedia.org/wiki/Feature-driven_development'},
};
