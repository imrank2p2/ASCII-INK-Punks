# ASCCI INK Punks WL system

## 1. Create the database
Create a Supabase project, open SQL Editor, and run `supabase-schema.sql`.

## 2. Add environment variables
Copy `.env.example` to `.env.local` and fill in:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Never expose the service-role key in browser code or `NEXT_PUBLIC_*` variables.

## 3. Run

```bash
npm install
npm run dev
```

## 4. Pages

- `/apply` saves WL applications to Supabase.
- `/admin` is the private review dashboard.
- Admin can search, filter, approve, reject, move back to pending, and export CSV.

## 5. Scoring
The current starter score is 10 for an X handle, 20 for a proof URL, and 20 for a valid EVM wallet. It is intentionally simple so you can add more verified task points later.
