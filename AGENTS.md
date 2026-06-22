# AGENTS.md

## Project Overview

Build an AI-powered lead generation and qualification system for **Wolo Roofing**, a roofing company in Indianapolis, IN owned by David Woloszyn. The system captures inbound leads from a landing page, instantly engages them via AI-driven SMS conversation to qualify the lead, and books a free inspection appointment via Cal.com if qualified. David is notified with a structured summary after each booking.

This is a real client project with a live deadline (storm damage event currently happening in Indianapolis — system needs to be functional ASAP, target: start of next week).

**Business model context:** The developer (me) is compensated via 5% commission on closed roof jobs ($12k–$85k per job) that originate from this lead system, not a flat fee. So lead quality, speed-to-lead, and conversion matter enormously — this isn't a toy project.

---

## Tech Stack

- **Frontend/Backend:** SvelteKit (existing site already built and live, includes home page + contact form)
- **Hosting:** Migrating from Netlify to **Railway** (need persistent backend server, not static CDN, to support webhooks and real-time SMS triggers)
- **Database:** **Postgres** (via Railway addon or Neon.tech) — NOT SQLite (Railway filesystem is ephemeral; SQLite would also choke on concurrent writes during lead spikes)
- **SMS:** **Twilio** — sends/receives opt-in SMS messages via API for lead qualification and follow-up
- **AI conversation engine:** **Claude API** (Anthropic) — powers the qualification conversation as a persona ("Sarah" from Wolo Roofing), not disclosed as AI
- **Scheduling:** **Cal.com** — booking link sent to qualified leads for free inspection appointments
- **Bot protection:** Cloudflare Turnstile + honeypot field + IP rate limiting on form submission endpoint

---

## Core Flow

```
Ad (Facebook/Google) or organic search
  → Landing page (/landing) — name + phone ONLY, minimal friction
  → SvelteKit form submission → Railway-hosted backend endpoint
  → Bot checks (Turnstile, honeypot, rate limit)
  → Insert lead into Postgres (leads table)
  → Trigger Twilio: AI sends first SMS within 60 seconds
  → Claude-powered conversation qualifies the lead:
      1. Confirm storm/roof damage
      2. Type of damage (roof / gutters / siding)
      3. Confirm they're the homeowner
      4. Confirm homeowners insurance (and provider)
      5. Offer free inspection — send Cal.com link
  → All messages logged to Postgres (messages table) for persistent
    conversation memory, keyed by phone number
  → On booking: Cal.com webhook (or AI-generated structured summary)
    → David gets a text/notification summarizing:
      NAME, ADDRESS, DAMAGE TYPE, INSURANCE PROVIDER, APPOINTMENT TIME, NOTES
```

There is a **second, separate form** — the existing homepage contact form. This is lower-intent / different audience (people who prefer email over text). It should continue to just notify David by email (existing Netlify Forms behavior, to be reimplemented on Railway) and insert into Postgres for record-keeping, but does NOT trigger the AI SMS sequence.

---

## Database Schema (Postgres)

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  address TEXT,
  source TEXT, -- 'landing_page' or 'contact_form'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_phone TEXT REFERENCES leads(phone),
  role TEXT, -- 'assistant' or 'user'
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_phone TEXT REFERENCES leads(phone),
  cal_booking_id TEXT,
  status TEXT, -- 'scheduled', 'completed', 'cancelled'
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Claude AI System Prompt (qualification agent)

Persona: "Sarah" — friendly assistant for Wolo Roofing. Never discloses she's AI. Warm, short, conversational tone — not robotic.

Qualification order:
1. Confirm storm damage
2. Type of damage (roof/gutters/siding)
3. Confirm they are the homeowner
4. Confirm they have insurance (and which provider)
5. Book appointment via Cal.com link

Rules:
- If hesitant, reassure that inspection is completely free
- If not the homeowner, politely end conversation
- If no insurance, still book — David can work with that
- After conversation, output a structured summary block:
  ```
  NAME:
  ADDRESS:
  DAMAGE TYPE:
  INSURANCE PROVIDER:
  APPOINTMENT TIME:
  NOTES:
  ```
- Backend parses this summary and forwards it to David via text/notification

---

## Priority Order (build sequence)

1. **Critical path (this weekend):**
   - Migrate site from Netlify → Railway
   - Set up Railway Postgres
   - Build `/landing` page (name + phone form only)
   - Build `/api/lead` endpoint: bot checks → insert to Postgres → trigger Twilio
   - Wire Twilio webhook → Claude API → conversation loop → Postgres message log
   - Cal.com link handoff on qualified lead
   - David notification on booking (summary format above)
2. **Important, can trail slightly:**
   - Facebook/Google ad campaigns targeting Indianapolis storm/hail/wind damage (traffic source — without this, the whole system has no input)
   - Reimplement existing contact form on Railway (email to David + Postgres insert)
3. **Already done:**
   - Google My Business listing (pending David's verification)
   - Cal.com account created

---

## Things Explicitly Out of Scope / Decided Against

- **GoHighLevel** — not needed for a single client; custom build gives more control and is the developer's own IP
- **Google Voice** — can't integrate reliably with APIs/automation; Twilio will handle programmatic SMS instead
- **SQLite** — ephemeral storage on Railway + no concurrent write support; Postgres chosen instead, also leaves room for pgvector use later (lead scoring, conversation embeddings)
- **AI agent autonomously managing David's calendar without confirmation** — at this stage, appointments should still be visible/confirmable by David, not fully autonomous

---

## Open Questions / Things to Verify Before/During Build

- Confirm Twilio number setup and SMS compliance requirements before launch
- Confirm with David: single business phone number for both AI qualification texts and his personal follow-up, or separate numbers
- Define and document the commission verification process with David (signed contract copy or screenshot on close, payment within X days of signed contract/insurance check clearing) — this is a business process issue, not something to solve in code
