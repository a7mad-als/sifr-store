---
name: Sifr Supabase access
description: The store's Supabase authentication and write-access security tradeoff.
---
The current integration uses the Supabase publishable key and a Row Level Security policy that permits limited anonymous inserts only; public reads, updates, and deletes are not granted. Do not mistake a publishable key kept on the server for a secret. Before production, consider moving writes to a server-only Supabase secret stored in Replit Secrets and removing anonymous insert access.

**Why:** The user supplied only a publishable key, which is designed for public use, so the integration avoids granting public read access while enabling the requested test writes.

**How to apply:** Preserve the insert-only policy unless the user explicitly changes the access model; never place a Supabase secret in client code, chat, or source control.
