# GNSS Stability Backup Server

This optional server receives backup events from the static GNSS test webpage.

It does not replace browser `localStorage`, CSV export, or JSON export. If the server is unavailable, the webpage continues running normally.

## Run locally

```powershell
cd backend
npm install
npm start
```

Default address:

```text
http://127.0.0.1:8787/api/ingest
```

Data is stored as JSON Lines:

- `backend/data/YYYY-MM-DD.jsonl`
- `backend/data/sessions/<session-id>.jsonl`

## Optional token

```powershell
$env:GNSS_BACKUP_TOKEN="your-secret"
npm start
```

When a token is set, requests must include:

```text
x-gnss-token: your-secret
```

The current webpage UI supports a plain endpoint URL only. If you want token-protected public deployment, add a reverse proxy that injects the header, or extend the page with a token field.

## Public deployment

The GitHub Pages webpage is HTTPS. For phones to upload successfully, the backup server must also be reachable through HTTPS.

Suitable options:

- Deploy this `backend` folder to Render, Railway, Fly.io, or a VPS with HTTPS.
- Put it behind Cloudflare Tunnel with a stable domain.
- Use Nginx/Caddy with HTTPS in front of the Node server.

Then paste the HTTPS ingest URL into the webpage:

```text
https://your-domain.example/api/ingest
```
