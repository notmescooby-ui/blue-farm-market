<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Architecture decisions

- **External Supabase project.** The site talks to BlueFarm's existing Supabase
  project (`https://ttipwqpiwqwejvxtzqqn.supabase.co`), not Lovable Cloud. The
  publishable key is hardcoded in `src/lib/supabase/client.ts` (it is public by
  design); the service-role key must never be added to this repo or any client
  code.
- **No service-role key is configured.** Privileged deletion work (auth user
  deletion) runs via `public.admin_process_account_deletion(...)` executed by an
  operator with service_role access in the Supabase SQL editor. Never import an
  admin client client-side.
- **Deletion request gating.** `account_deletion_requests` is inserted by the
  verified, signed-in user only (RLS `auth.uid() = user_id`); verification is a
  Supabase OTP sign-in (`signInWithOtp` + `verifyOtp`, `shouldCreateUser: false`)
  performed in the browser. Every "code sent" outcome is masked with
  `OTP_SENT_MESSAGE` so the site never reveals whether an account exists.
- **Existing schema is unknown ground.** `profiles` and `user_profiles` are
  keyed by `id` (no `user_id` column was found); never assume columns of
  `orders`, `ponds`, `listings`, `messages`, `alerts`, `relay_events` without
  verifying them first. Database changes ship as reviewed SQL under
  `supabase/migrations/` for the operator to run manually.
