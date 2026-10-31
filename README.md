# BlueFarm Market & Account Deletion Portal

Official web portal and account deletion service for the BlueFarm aquaculture marketplace.

## Project Overview

- **Framework**: TanStack Start / React 19 / TypeScript / Vite
- **Styling**: Tailwind CSS
- **Backend / Authentication**: Supabase
- **Primary Routes**:
  - `/` — BlueFarm Portal Home
  - `/account-deletion` — Official Account Deletion Request Portal (Google Play compliance)
  - `/privacy` — Official BlueFarm Privacy Policy
  - `/track` — Deletion Request Tracking & Verification
  - `/contact` — Support and inquiries

## Security & Architecture Guidelines

1. **Client-Side Security**:
   - Only public / anon keys are used client-side subject to strict PostgreSQL Row Level Security (RLS).
   - **Never** place the Supabase `service_role` secret key in client code, environment bundles, or public repository files.
   - Deletion requests require verified ownership via Supabase OTP (`shouldCreateUser: false`) or reviewer password verification before records are created.
   - All response messages use anti-enumeration protections to avoid revealing whether an entered email or phone number is registered.

2. **Privileged Deletion Execution**:
   - Backend account deletion and legal record anonymization are executed server-side via privileged database functions or secure edge functions (`process_account_deletion`).
   - Historical financial transaction records are retained in compliance with applicable statutory and tax obligations, while personal identification records are scrubbed.

## Environment Variables

For local development or deployment, configure environment variables:

```env
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-publishable-key>
```

## Local Development

```sh
npm install
npm run dev
```

To run lint checks:

```sh
npm run lint
```

To run automated test suite:

```sh
npm test
```

To build production bundle:

```sh
npm run build
```
