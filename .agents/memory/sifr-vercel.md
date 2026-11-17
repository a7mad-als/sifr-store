---
name: Sifr Vercel deployment
description: Hosting boundary and environment requirements when deploying the store outside Replit.
---
Vercel is a separate runtime from Replit. Replit-provisioned AI integration credentials are not automatically available there; configure a Vercel-side `OPENAI_API_KEY` before expecting the assistant to answer. A successful GitHub push alone does not prove a Vercel project or deployment exists.

**Why:** The store uses a Replit-managed AI integration in its current hosting environment, while the user intends to host it on Vercel.

**How to apply:** Verify the Vercel project and deployment status directly, and confirm required environment variables are configured before saying the site is live.
