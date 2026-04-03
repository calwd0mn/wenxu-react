This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, configure the API base URL for local development:

```bash
cp .env.local.example .env.local
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

This project uses port `8001` in this workspace:

```bash
npm run dev
```

Open [http://localhost:8001](http://localhost:8001) with your browser to see the result.

LAN testing:

1. Keep the Nest API running on port `3003`
2. Run this Next app with `npm run dev`
3. Find your computer LAN IP, for example `192.168.1.23`
4. Open `http://192.168.1.23:8001/question/<questionId>` on another device in the same network

If another device still cannot access it, check:

- Windows firewall allows inbound access to ports `8001` and `3003`
- The phone/computer is on the same LAN
- `SERVER_API_BASE_URL` still points to your local Nest API, usually `http://127.0.0.1:3003`

Environment variables:

- `SERVER_API_BASE_URL`: Server-side fetch base URL for Next routes and pages
- `NEXT_PUBLIC_API_BASE_URL`: Public API base URL fallback

Local example:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3003
SERVER_API_BASE_URL=http://127.0.0.1:3003
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
