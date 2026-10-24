# DNS cutover checklist — v2foundry.com

**Audience:** John (manual ops)  
**Time budget:** &lt;30 minutes once a production deploy exists  
**Host assumption:** **Vercel** (Phase 0 stack is Next.js; swap host names if you pick another)  
**Hard rule:** This doc is instructions only. Do **not** buy domains or change DNS/registrar settings until you are ready — no agent should touch your GoDaddy account for you.

**Sources:** [PHASE-0.md](./PHASE-0.md) (one property + life2x redirect) · [README](../README.md) property plan · Project store name-availability / phase-0-plan (PR-6)

---

## Before you start (2 min)

Confirm these, then stop if any fail:

| Check | Expected |
|---|---|
| Production app is live on Vercel | A `*.vercel.app` (or custom preview) URL loads the real site, not a 404 |
| You can sign in to **GoDaddy** for `v2foundry.com` | Registrar: GoDaddy.com, LLC (owned; expires **2029-09-07**) |
| You can sign in for **life2x.xyz** | Registered; expires **2026-11-06** — renew first if cutover is after that date |
| Domain lock / 2FA | Client lock is fine; unlock only if GoDaddy blocks DNS edits, then re-lock |

**Do not cut over** while the only public surface is still GoDaddy parking and the app is not production-ready. Preview URLs are enough for family testing; cutover is for when doctrine + diagnostic should be the public face.

---

## A. Renew life2x.xyz (before 2026-11-06) — ~3 min

Retired working title; keep it only as a redirect into `.com`.

1. Open the registrar account that holds **life2x.xyz**.
2. Renew for at least **1 year** (deadline **2026-11-06**).
3. Confirm auto-renew is on **or** calendar a reminder 30 days out.
4. If you deliberately drop the name instead: skip redirect steps in §C and update README so nobody assumes the redirect exists.

---

## B. Point v2foundry.com at Vercel (replace parking) — ~10–15 min

Goal: visitors hit the Foundry app, not the GoDaddy placeholder.

### B1. Add the domain in Vercel

1. Vercel → project for this repo → **Settings → Domains**.
2. Add **`v2foundry.com`** and **`www.v2foundry.com`** (or add apex and let Vercel prompt for `www`).
3. Prefer: apex = production; `www` → redirect to apex (or the reverse — pick one canonical host and stick to it). Canonical for the brand: **`https://v2foundry.com`**.

Vercel will show the exact records it wants. Typical pattern:

| Host | Type | Value (example — use Vercel’s UI values) |
|---|---|---|
| `@` (apex) | **A** | `76.76.21.21` (Vercel anycast; confirm in UI) |
| `www` | **CNAME** | `cname.vercel-dns.com` (confirm in UI) |

Some setups use an **ALIAS/ANAME** at the apex if your DNS product supports it. GoDaddy DNS for `.com` usually uses the A-record pattern above.

### B2. Edit DNS at GoDaddy (this replaces parking)

1. GoDaddy → **My Products → DNS** for `v2foundry.com`.
2. **Remove or disable** parking / “forwarding to parked page” / Marketplace parking if active.
3. Delete conflicting **A / CNAME / forwarding** records for `@` and `www` that still point at GoDaddy hosting or parking.
4. Add the Vercel **A** (apex) and **CNAME** (`www`) from B1.
5. Leave unrelated records alone (email MX, TXT for SPF/DMARC, etc.) unless you know they are parking leftovers.
6. Save. Propagation is often minutes; worst case a few hours.

### B3. Verify in Vercel + browser

1. In Vercel Domains, wait until both hosts show **Valid** / SSL issued.
2. Incognito: `https://v2foundry.com` and `https://www.v2foundry.com` → Foundry site, not parking.
3. Check the browser padlock (certificate should be Vercel/Let’s Encrypt for your domain).
4. Optional: `dig +short v2foundry.com A` and `dig +short www.v2foundry.com CNAME` match Vercel’s targets.

If GoDaddy still serves parking: forwarding or an old A record is winning — clear forwarding and re-check records.

---

## C. Redirect life2x.xyz → v2foundry.com — ~5–10 min

Pick **one** method. Prefer the registrar that already holds `.xyz` so you are not splitting DNS brains.

### Option 1 — Registrar URL forward (fastest)

1. At the `.xyz` registrar: enable **permanent (301)** forward of `life2x.xyz` and `www.life2x.xyz` → `https://v2foundry.com`.
2. Prefer HTTPS forward if the UI offers it.
3. Test: open `http://life2x.xyz` and `https://life2x.xyz` (if cert exists) → land on `https://v2foundry.com`.

### Option 2 — Same Vercel project (cleaner long-term)

1. Vercel Domains → add **`life2x.xyz`** (+ `www` if used).
2. Set both to **redirect** to `https://v2foundry.com` (Vercel domain redirect), not a second deploy.
3. Point `.xyz` DNS at Vercel the same way as §B (A/CNAME per Vercel UI).
4. Verify 301/308 to the `.com` apex.

Either option satisfies Phase 0 (“one property”: **v2foundry.com**).

---

## D. Post-cutover hygiene — ~3 min

- [ ] README / internal notes still say: one domain = `.com`; `.xyz` = redirect only  
- [ ] Re-enable **client lock** on `v2foundry.com` if you unlocked it  
- [ ] Bookmark Vercel Domains + GoDaddy DNS for the next change  
- [ ] Do **not** point paid ads at the domain until trademark caution from the project name-availability report is acknowledged  
- [ ] Optional defensive TLDs (`.io` / `.life` / `.app`) are **separate** buys — not part of this 30‑minute cutover  

---

## Timing vs Phase 0 build

| Moment | DNS action |
|---|---|
| PR stack / preview only | **No cutover** — use Vercel preview URLs |
| Production deploy ready, family dogfood OK | Run §A–§C |
| Before **2026-11-06** | §A renew `life2x.xyz` even if cutover waits |

**Out of scope for agents:** changing John’s registrar, DNS, locks, or purchases without an explicit ask.

---

## Quick copy-paste order (day of cutover)

1. Renew `life2x.xyz` if expiry is near.  
2. Deploy / promote production on Vercel.  
3. Add `v2foundry.com` + `www` in Vercel; copy records.  
4. GoDaddy DNS: kill parking/forwarding; set A + CNAME.  
5. Wait for Vercel “Valid” + SSL.  
6. Forward or attach `life2x.xyz` → `https://v2foundry.com`.  
7. Incognito smoke test apex, `www`, and `.xyz`.

*Done when:* parking is gone, `.com` serves the app, `.xyz` redirects home, and renewal is handled — under half an hour of focused clicks.
