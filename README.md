# DBMS Project using React on the frontend, express on backend and MySQL as a database

Professional Backend written by Bikash.
Original Backend Repo: https://github.com/thebikashpokhrel/Postify-dbms-backend.git

## Monitoring

The backend exposes Prometheus metrics at:

```markdown
http://localhost:5000/metrics
```

Docker Compose also starts Prometheus and Grafana:

```markdown
Prometheus: http://localhost:9090
Grafana: http://localhost:3001
Grafana login: admin / admin
```

Prometheus scrapes the backend directly and scrapes frontend Nginx metrics through `nginx/nginx-prometheus-exporter`. Grafana is provisioned with a Prometheus datasource and a `Postify Overview` dashboard.

## Run Production Images Locally

After the CI staging job passes, it publishes these images to GitHub Container Registry:

```markdown
ghcr.io/<your-github-owner>/postify-backend:latest
ghcr.io/<your-github-owner>/postify-frontend:latest
```

Create a production env file on the deployment machine:

```bash
cp .env.prod.example .env.prod
```

Edit `.env.prod` and set `GHCR_OWNER` to your GitHub username or organization. If your GHCR packages are private, log in first:

```bash
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

Pull and start the production stack:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml pull
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d
```

Production Compose uses `.env.prod` in two ways:

```markdown
--env-file .env.prod       loads values for Compose interpolation, such as GHCR_OWNER and IMAGE_TAG
env_file: .env.prod        injects runtime values into backend, db, and Grafana containers
```

GitHub Environment variables are not automatically available on your deployment server. If you deploy from
GitHub Actions, the workflow must write those values to `.env.prod` on the server before running
`docker compose --env-file .env.prod -f docker-compose.prod.yml up -d`.

Smoke test the running stack:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T db sh -c 'mariadb -u"$MARIADB_USER" -p"$MARIADB_PASSWORD" "$MARIADB_DATABASE" -e "SELECT COUNT(*) FROM posts;"'
curl -fsS http://127.0.0.1:5000/healthz
curl -fsS http://127.0.0.1:5000/api/post
curl -fsS http://127.0.0.1:3000
curl -fsS http://127.0.0.1:5000/metrics
curl -fsS http://127.0.0.1:9090/-/ready
curl -fsS http://127.0.0.1:3001/api/health
```

Open the services:

```markdown
Frontend: http://localhost:3000
Backend: http://localhost:5000
Prometheus: http://localhost:9090
Grafana: http://localhost:3001
```

The frontend container listens on port `8080` internally, and Docker publishes it on host port `3000`.
So the browser URL is `http://<server-ip>:3000`, while Compose-to-container checks use `frontend:8080`.

For GitHub Actions, environment variables added under the GitHub Environment named `env` are available to
the staging job. For production, write the same values into `.env.prod` on the deployment server. At minimum configure:

```markdown
DB_HOST=db
DB_USER=bloguser
DB_PASSWORD=<database-password>
DB_DATABASE=blog
MARIADB_ROOT_PASSWORD=<root-password>
MARIADB_DATABASE=blog
MARIADB_USER=bloguser
MARIADB_PASSWORD=<database-password>
MYSQL_ROOT_PASSWORD=<root-password>
MYSQL_DATABASE=blog
MYSQL_USER=bloguser
MYSQL_PASSWORD=<database-password>
JWT_SECRET_KEY=<long-random-secret>
```

`DB_PASSWORD`, `MARIADB_ROOT_PASSWORD`, `MARIADB_PASSWORD`, and `JWT_SECRET_KEY` are better stored as GitHub Environment secrets
instead of variables.

Stop the production stack:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml down
```

## CI/CD

GitHub Actions runs backend tests, frontend lint/build, npm audits, CodeQL, dependency review, Trivy filesystem/image scans, Docker builds, and a local staging deployment using Docker Compose. The staging job starts the app with Prometheus and Grafana, runs smoke checks, uploads Compose logs, and tears everything down.

SonarQube is optional. To enable it, add repository variable `SONAR_ENABLED=true`, repository variable `SONAR_HOST_URL`, and repository secret `SONAR_TOKEN`.


## Bakend .env config file
Also
Create a blog database in my SQL and apply triggers and procedures specified in files in the backend.

```markdown
SERVER_PORT = 3000

# Database Credentials
DB_HOST = 127.0.0.1
DB_USER = root
DB_PASSWORD = [your-password]
DB_DATABASE = blog

# Auth keys
JWT_SECRET_KEY = 5a0a7597-8ccd-4c54-9058-8abd3f16ad88
```
