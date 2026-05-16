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
