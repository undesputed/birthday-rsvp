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

Get the first three from [EmailJS Dashboard](https://dashboard.emailjs.com/) after creating an account, connecting an email service (e.g. Gmail), and creating a template. Use the variables `{{guestName}}`, `{{attending}}`, `{{numberOfGuests}}`, `{{additionalGuests}}`, `{{dietaryRestrictions}}`, `{{to_email}}`, and `{{from_name}}` in your template.

A ready-made HTML template (design matches this site) is in `docs/emailjs-rsvp-template.html`.

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
      route.ts    # GET/POST/DELETE RSVPs (file-based storage)
components/
  hero-section.tsx
  event-details.tsx
  photo-gallery.tsx
  rsvp-form.tsx
  navigation-bar.tsx
  ui/             # shadcn components
lib/
  rsvp-store.ts   # RSVP type + legacy in-memory (admin/form use API)
  emailjs.ts      # EmailJS send helper
  utils.ts
data/
  rsvps.json      # Created at runtime; RSVPs persisted here (gitignored)
public/
  logo.png        # Favicon / branding
  *.jpg           # Gallery images
docs/
  emailjs-rsvp-template.html   # EmailJS template (copy into dashboard)
```

## Notes

- **RSVP data** is stored in `data/rsvps.json` on the server so it persists across refreshes and is shared across all devices. The file is created automatically when the first RSVP is submitted. On serverless hosts (e.g. Vercel) the filesystem may be read-only; for production there you’d switch to a database (e.g. Vercel KV, Supabase).
- **Gallery images** live in `public/`. Replace the JPGs there to change the gallery; the component uses all images in that folder except placeholders (see `components/photo-gallery.tsx`).
- **Admin** at `/admin` has no authentication. Restrict access (e.g. via hosting or middleware) if the site is public.
