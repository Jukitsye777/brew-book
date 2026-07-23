# BrewBook Deployment

BrewBook follows the same deployment shape as `dev-utils`:

1. GitHub Actions builds a production Docker image.
2. The image is pushed to GitHub Container Registry.
3. GitHub Actions temporarily allows its runner IP through the DigitalOcean database firewall and runs Drizzle migrations.
4. GitHub Actions uploads `docker-compose.yml` to the VPS.
5. The VPS pulls the new image and restarts the container.

## Required GitHub secrets

Add these repository secrets under **Settings > Secrets and variables > Actions**:

| Secret | Purpose |
| --- | --- |
| `DO_API_TOKEN` | DigitalOcean API token used to manage the database firewall. |
| `DO_DATABASE_ID` | DigitalOcean Managed Database cluster ID. |
| `DO_DB_CERT` | DigitalOcean PostgreSQL CA certificate. |
| `MIGRATION_DATABASE_URL` | `brewadmin` connection string for `brewdb`, including `sslmode=require`. |
| `DOTENV_PRIVATE_KEY_PRODUCTION` | Private dotenvx key for the encrypted `.env.production` file. |
| `VPS_HOST` | Public hostname or IP address of the VPS. |
| `VPS_SSH_KEY` | Private SSH key for the `deploy` user. |
| `GHCR_PAT` | GitHub token with permission to pull the private container package on the VPS. |

`MIGRATION_DATABASE_URL` should use the application database user, not the DigitalOcean admin user:

```text
postgresql://brewadmin:password@host:25060/brewdb?sslmode=require
```

The workflow writes the DigitalOcean CA certificate to a temporary file and exposes it through `NODE_EXTRA_CA_CERTS` while migrations run.

## Prepare dotenvx production configuration

Create the production dotenv file locally from the example, fill in the real production values, and encrypt it:

```bash
cp .env.example .env.production
# Edit .env.production with the production database, auth, and Google values.
pnpm exec dotenvx encrypt -f .env.production
```

Commit the encrypted `.env.production` file and keep the generated private key out of Git. Add that private key as the `DOTENV_PRIVATE_KEY_PRODUCTION` GitHub Actions secret. The Docker build receives the key only as a BuildKit secret, and the running container receives it through the VPS `.env` file.

Local development uses the same pattern with `.env.local`. To add the DigitalOcean certificate without putting raw multi-line PEM into dotenv syntax:

```bash
pnpm exec dotenvx set DATABASE_CA_CERT "$(cat .secrets/do-ca.crt)" -f .env.local
pnpm exec dotenvx encrypt -f .env.local
```

## Prepare the VPS once

Install Docker Engine and the Docker Compose plugin. Create the deployment directory and make sure the `deploy` user can run Docker:

```bash
sudo mkdir -p /var/www/brew-book
sudo chown -R deploy:deploy /var/www/brew-book
sudo usermod -aG docker deploy
```

Create `/var/www/brew-book/.env` on the VPS. This file is not committed or uploaded by GitHub Actions and should contain only the dotenvx private key:

```dotenv
DOTENV_PRIVATE_KEY_PRODUCTION=your-dotenvx-private-key
```

Log in once from the VPS if the GitHub package is private:

```bash
echo "$GHCR_PAT" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

The container listens only on `127.0.0.1:3002`. Put Nginx, Caddy, or another reverse proxy in front of it and proxy the public HTTPS domain to `http://127.0.0.1:3002`.

## First deployment

Push the repository's `main` branch. The workflow is in `.github/workflows/deploy.yml` and starts automatically.

For the first deployment, check the jobs in this order:

1. **Build and Push Image** succeeds and publishes `ghcr.io/<owner>/<repo>:latest`.
2. **Run Database Migrations** temporarily adds the GitHub runner IP, applies the committed migrations, and removes the IP even if the migration fails.
3. **Deploy to VPS** uploads the Compose file, pulls the image, and restarts the container.

After the container starts:

```bash
cd /var/www/brew-book
docker compose ps
docker compose logs --tail=100 app
```

## Google OAuth production callback

Add the production callback URL to the Google OAuth client:

```text
https://brewbook.example.com/api/auth/callback/google
```

`BETTER_AUTH_URL` and `BETTER_AUTH_TRUSTED_ORIGINS` must use the same HTTPS origin. Do not use the VPS port in the public callback URL.

## Future schema changes

Create and commit a migration locally:

```bash
pnpm db:generate
```

Do not run `db:push` in production. The deployment workflow runs the committed migrations before deploying the new image.
