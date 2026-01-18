# Sura Rentals

Sura Rentals is a modern peer-to-peer car rental platform built with Next.js and Supabase. It supports verified listings, secure booking requests, and multi-step onboarding with OTP verification.

## Features

- Multi-step authentication (details → human check → email/phone OTP)
- Listing workflow with image + RC document uploads
- Booking requests with approval states
- Dashboard with sidebar navigation and verification uploads
- Admin review panel for documents and cars
- Supabase-ready SQL schema with RLS policies

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + Framer Motion
- Supabase (PostgreSQL, Auth, Storage)

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

The required Supabase schema (tables, policies, triggers) is available at:

```
./supabase/schema.sql
```

Apply it in the Supabase SQL editor before using the app.
