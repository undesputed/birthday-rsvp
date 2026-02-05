# Birthday Invite Website

A single-page birthday invitation site with RSVP form, event details, photo gallery, and email notifications. Built with Next.js, React, and Tailwind CSS.

## Features

- **Landing page** – Hero, event details (location, time, what to bring, map), and photo gallery
- **RSVP form** – Guest name, attending (yes/no/maybe), additional guests, dietary restrictions
- **Email notifications** – RSVP submissions sent to you via [EmailJS](https://www.emailjs.com/) (no backend required)
- **Admin dashboard** – View and manage RSVPs at `/admin` (persisted; shared across tabs and refreshes)

## Tech Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **Tailwind CSS**, **shadcn/ui** (Radix)
- **EmailJS** – client-side email for RSVP notifications
- **Supabase** – RSVP storage when deployed (e.g. Vercel); optional locally (uses a JSON file)
- **pnpm** – package manager

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Install and run

```bash
# Install dependencies
pnpm install

# Copy environment variables and fill in your values
cp .env.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The admin dashboard is at [http://localhost:3000/admin](http://localhost:3000/admin).

### Build for production

```bash
pnpm build
pnpm start
```

## Environment Variables

Create `.env.local` from `.env.example` and set:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS account public key |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS email service ID |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS template ID for RSVP emails |
| `NEXT_PUBLIC_EMAILJS_TO_EMAIL` | Where to receive RSVPs (comma-separated for multiple) |
| `NEXT_PUBLIC_EMAILJS_FROM_NAME` | Sender name shown on notification emails |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (required for Vercel; optional for local) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (Project Settings → API) |

Get the first three from [EmailJS Dashboard](https://dashboard.emailjs.com/) after creating an account, connecting an email service (e.g. Gmail), and creating a template. Use the variables `{{guestName}}`, `{{attending}}`, `{{numberOfGuests}}`, `{{additionalGuests}}`, `{{dietaryRestrictions}}`, `{{to_email}}`, and `{{from_name}}` in your template.

A ready-made HTML template (design matches this site) is in `docs/emailjs-rsvp-template.html`.

### Supabase (for Vercel / serverless)

On Vercel the app cannot write to the filesystem, so RSVP storage uses **Supabase** when configured:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, open **SQL Editor** and run the script in `docs/supabase-rsvps-table.sql` to create the `rsvps` table.
3. In **Project Settings → API**, copy the **Project URL** and **service_role** key (keep the key secret).
4. In Vercel (or `.env.local`), set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

If these are not set, the API falls back to file storage (`data/rsvps.json`), which works locally but **fails on Vercel** (500 when saving RSVP).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Build for production |
| `pnpm start` | Run production build |
| `pnpm lint` | Run ESLint |

## Project Structure

```
app/
  layout.tsx      # Root layout, metadata, favicon
  page.tsx        # Home (hero, details, gallery, RSVP)
  admin/
    page.tsx      # RSVP dashboard
  api/
    rsvp/
      route.ts    # GET/POST/DELETE RSVPs (Supabase on Vercel, file locally)
components/
  hero-section.tsx
  event-details.tsx
  photo-gallery.tsx
  rsvp-form.tsx
  navigation-bar.tsx
  ui/             # shadcn components
lib/
  rsvp-store.ts   # RSVP type (admin/form use API)
  emailjs.ts      # EmailJS send helper
  supabase-server.ts  # Supabase admin client for API routes
  utils.ts
data/
  rsvps.json      # Used only when Supabase is not set (local; gitignored)
public/
  logo.png        # Favicon / branding
  *.jpg           # Gallery images
docs/
  emailjs-rsvp-template.html   # EmailJS template (copy into dashboard)
  supabase-rsvps-table.sql     # Run in Supabase SQL Editor to create rsvps table
```

## Notes

- **RSVP storage**: With Supabase env vars set (required on Vercel), RSVPs are stored in Supabase. Without them (e.g. local only), the API uses `data/rsvps.json`, which does not work on Vercel.
- **Gallery images** live in `public/`. Replace the JPGs there to change the gallery; the component uses all images in that folder except placeholders (see `components/photo-gallery.tsx`).
- **Admin** at `/admin` has no authentication. Restrict access (e.g. via hosting or middleware) if the site is public.
