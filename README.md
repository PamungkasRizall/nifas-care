This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication Setup

Login uses Google OAuth via Auth.js, backed by PostgreSQL through Prisma.

1. Copy `.env.example` to `.env` (already present) and fill in:
   - `DATABASE_URL` — a PostgreSQL connection string.
   - `AUTH_SECRET` — generate with `npx auth secret`.
   - `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — from [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (OAuth Client ID, type "Web application"). Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI for local dev.
2. Apply the database schema:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Start the dev server and sign in at `/login`.

New users are created automatically on first Google sign-in with the default role `MOTHER`. Other roles (`ADMIN`, `DOCTOR`, `MIDWIFE`, `NUTRITIONIST`, `RESEARCHER`) must currently be assigned directly in the database — an admin UI for role management is a future phase, per `.agents/Identity_Access_Management.md`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
