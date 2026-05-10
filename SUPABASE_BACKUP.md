# Supabase Backup Setup

This is the recommended public backup channel for the GNSS stability webpage.

## 1. Create a Supabase project

Open Supabase, create a project, then copy:

- Project URL, for example `https://xxxx.supabase.co`
- anon public key

## 2. Create the table

Open SQL Editor and run the contents of:

```text
supabase_schema.sql
```

The table is `public.gnss_events`.

Anonymous users can insert rows only. Reads are private by default.

## 3. Configure the webpage

In the test webpage:

1. Backup mode: `Supabase`
2. Supabase Project URL: paste the Project URL
3. Supabase anon key: paste the anon public key
4. Click `保存备份配置`
5. Click `测试备份`

If the test succeeds, every MQTT record, phone record, mark, and session-end event will be inserted into Supabase.

The browser still keeps local data and CSV/JSON export. Failed remote uploads do not stop the test.
