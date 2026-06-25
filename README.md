# Aetherworkz

Company website for **Aetherworkz** — a software company in active development.

## Stack

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Node.js + Express
- **Design:** Black & white aesthetic, responsive layout

## Getting started

```bash
npm install
npm run dev    # development with auto-reload
npm start      # production
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy for your team

This app has two parts:

| Part | What it needs |
| --- | --- |
| **Pages, CSS, services & projects** | Static hosting (GitHub Pages, Render, etc.) |
| **Contact form** | Node.js server (Render Web Service, Railway) |

### GitHub Pages (static — services/projects work, contact form does not)

1. On GitHub: **Settings → Pages → Build and deployment**
2. Source: **Deploy from a branch**
3. Branch: `main`, folder: **`/public`**
4. Your site will be at `https://YOUR_USERNAME.github.io/aetherworkz/`

Services and projects load from `/data/*.json` and work on Pages. The contact form needs a Node host (see below).

### Render (full app — everything works)

1. Push to GitHub
2. [render.com](https://render.com) → **New → Web Service** (not Static Site)
3. Connect `gin7324/aetherworkz`
4. **Build command:** `npm install`
5. **Start command:** `npm start`
6. Share the `*.onrender.com` URL with your team

A `render.yaml` file is included for blueprint deploys.

### Railway

Same as Render — connect the GitHub repo and deploy as a Node service.

### Quick local preview for your team

```bash
npx localtunnel --port 3000
```

## API endpoints

| Method | Path            | Description              |
| ------ | --------------- | ------------------------ |
| GET    | `/api/health`   | Server health check      |
| GET    | `/api/services` | List of services         |
| GET    | `/api/projects` | Current projects         |
| POST   | `/api/contact`  | Submit contact form      |

Contact submissions are appended to `server/data/contact-submissions.csv` by default. The file is CSV-formatted so it opens directly in Excel, and it is ignored by Git because it contains private customer details.

To save submissions somewhere else, set:

```bash
CONTACT_SUBMISSIONS_FILE=/absolute/path/to/contact-submissions.csv
```

On hosted environments, point `CONTACT_SUBMISSIONS_FILE` at persistent storage so the sheet survives restarts and redeploys.

On Render, files are written on Render's server, not your local computer. To download the private CSV from the deployed site, set a long random `CONTACT_EXPORT_TOKEN` environment variable in Render, then visit:

```text
https://YOUR-RENDER-APP.onrender.com/api/contact/submissions.csv?token=YOUR_CONTACT_EXPORT_TOKEN
```

For long-term storage on Render, attach a persistent disk and set `CONTACT_SUBMISSIONS_FILE` to a path inside that disk, such as `/var/data/contact-submissions.csv`.

### Contact form payload

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hello!"
}
```

## Project structure

```
aetherworkz/
├── public/          # Static frontend (HTML, CSS, JS)
├── server/          # Express backend
│   ├── index.js
│   └── routes/
└── package.json
```
