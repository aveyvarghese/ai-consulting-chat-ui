# ai-consulting-chat-ui

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_D3kKZVENhInKycvfn1FmmF15jTcg)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Environment variables

Lead enquiry submission uses Resend for email and can also append successful submissions to Google Sheets.

```bash
RESEND_API_KEY=
RESEND_FROM_EMAIL=
OPENAI_API_KEY=
GOOGLE_SHEETS_CLIENT_EMAIL=
GOOGLE_SHEETS_PRIVATE_KEY=
GOOGLE_SHEETS_SPREADSHEET_ID=
```

For Google Sheets CRM logging, create a Google Cloud service account, share the target spreadsheet with `GOOGLE_SHEETS_CLIENT_EMAIL`, and store the private key with escaped newlines (for example `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n`). Rows are appended in this order: submittedAt, visitorType, leadScore, name, company, businessVertical, serviceNeeded, phone / WhatsApp, email, website, instagram, uploadedFileName, conversationSummary.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/aveyvarghese/ai-consulting-chat-ui" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
