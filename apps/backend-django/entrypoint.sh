#!/usr/bin/env sh
set -e
if [ "${RUN_MIGRATIONS}" = "true" ]; then
  echo "[entrypoint] Running Django migrations..."
  python manage.py migrate --noinput
fi
if [ "${COLLECTSTATIC}" = "true" ]; then
  echo "[entrypoint] Collecting static files..."
  python manage.py collectstatic --noinput
fi
exec "$@"
