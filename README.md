# IntelliFutsal

Open-source web platform for physiological profiling and AI-assisted
training prescription of amateur futsal squads. Coaches record field-test
results (jumps, 30 m sprint, 1000 m run, anthropometry), the platform
clusters players into five physical-condition profiles, and an assistive
AI layer proposes training plans that **always remain pending until a
coach reviews and approves them** — the model assists the decision, it
does not make it.

Companion repository of the manuscript submitted to *IEEE Latin America
Transactions*. The analysis that reproduces every analytical result of
the paper lives in [`analysis/`](analysis/).

## Architecture

Three containerized services plus the database, orchestrated with Docker
Compose on a private bridge network:

| Service | Stack | Container port | Host port |
|---|---|---|---|
| `react-frontend` | React + Vite, served by NGINX (reverse-proxies `/api/` to the Node backend) | 80 | **5173** |
| `nodejs-backend` | Node.js + Express + TypeORM (hexagonal architecture), REST API under `/api/v1` | 9042 | 9042 |
| `flask-backend` | Flask + scikit-learn (clustering/classification models, OpenAI integration) | 9041 | — (internal only) |
| `postgres` | PostgreSQL 14 | 5432 | 5433 |

The trained models and scalers are bundled in
`intellifutsal_ai_back/static/models/`, and the database is initialized
automatically on first start from `intellifutsal_back/init-scripts/`.

## Deployment with Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with the Compose plugin
  (Docker Desktop on macOS/Windows, `docker-ce` + `docker-compose-plugin`
  on Linux).
- An OpenAI API key (only needed for the natural-language analysis
  features; clustering and classification run locally).

### 1. Clone and configure

```bash
git clone https://github.com/IntelliFutsal-App/intellifutsal_app.git
cd intellifutsal_app
cp .env.example .env
```

Edit `.env` and set your own values — at minimum:

| Variable | Purpose |
|---|---|
| `DB_PROD_PASSWORD`, `DB_DEV_PASSWORD` | PostgreSQL passwords |
| `JWT_SECRET`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Token signing secrets — generate each with `openssl rand -hex 64` |
| `OPENAI_API_KEY` | Key for the AI narrative analysis |
| `SMTP_*` / `SENDGRID_*` | Outgoing e-mail (account activation); optional for local evaluation |

Keep the defaults for `VITE_API_URL=/api/v1` and
`AI_API_URL=http://flask-backend:9041/api` — they wire the services
together inside the Compose network.

> `.env` holds real credentials and is git-ignored. Never commit it.

### 2. Build and start

```bash
docker compose up --build -d
```

The first build takes a few minutes. Then check that the four containers
are healthy:

```bash
docker compose ps
```

### 3. Use the platform

Open **http://localhost:5173** in a browser and register a coach
account. The Node API is also reachable directly at
`http://localhost:9042/api/v1` (Swagger documentation included).

### Useful commands

```bash
docker compose logs -f nodejs-backend   # follow API logs
docker compose restart react-frontend   # restart one service
docker compose down                     # stop everything (data persists)
docker compose down -v                  # stop AND delete the database volume
```

After changing frontend/backend code or `.env`, rebuild the affected
service, e.g. `docker compose up --build -d react-frontend`. If the
browser shows a stale version after a rebuild, force-reload with
Ctrl+Shift+R (Cmd+Shift+R on macOS).

## Reproducing the paper's analysis

```bash
cd analysis
pip install pandas numpy scikit-learn scipy matplotlib
python3 clustering_real_squad.py
```

See [`analysis/README.md`](analysis/README.md) for details on the
anonymized dataset and the metrics reported.

## License

[MIT](LICENSE).
