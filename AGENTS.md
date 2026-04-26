<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes -- APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:d1cl-architecture-rules -->
# Clean Architecture -- Non-Negotiable

- Route handlers are MAX 20 lines. They instantiate the use case and return the result.
- All repository interfaces live in `src/domain/repositories/`. Implementations in `src/infrastructure/repositories/`.
- Every use case returns `{ success: boolean, data?: T, error?: string }`.
- GSAP is loaded client-side ONLY (`'use client'` components) -- never in server components.
- All bilingual fields use the `BilingualInput` component and the `localized()` helper.
- Test every new page in `/ar` immediately after building (RTL parity).
<!-- END:d1cl-architecture-rules -->
