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

The fastest way to share a live link with your team is **Render** (free tier, works with this Express app).

### Option 1: Render (recommended)

1. Push the project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial aetherworkz website"
   git remote add origin https://github.com/YOUR_USER/aetherworkz.git
   git push -u origin main
   ```
2. Go to [render.com](https://render.com) and sign up (free).
3. Click **New → Web Service** and connect your GitHub repo.
4. Render auto-detects Node — set:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
5. Deploy. You'll get a URL like `https://aetherworkz.onrender.com` to share with your team.

A `render.yaml` file is included for blueprint-style deploys.

### Option 2: Railway

Same flow — connect GitHub at [railway.app](https://railway.app), deploy the repo, share the generated URL.

### Option 3: Quick preview (no deploy)

Share your local site instantly with a tunnel:

```bash
npx localtunnel --port 3000
```

You'll get a temporary public URL (good for a quick demo, not permanent).

## API endpoints

| Method | Path            | Description              |
| ------ | --------------- | ------------------------ |
| GET    | `/api/health`   | Server health check      |
| GET    | `/api/services` | List of services         |
| GET    | `/api/projects` | Current projects         |
| POST   | `/api/contact`  | Submit contact form      |

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
