# apps/backend-django/Dockerfile
FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1 PORT=8000
RUN apt-get update && apt-get install -y --no-install-recommends \
      curl tini ca-certificates libjpeg62-turbo zlib1g \
    && rm -rf /var/lib/apt/lists/*
RUN useradd --create-home --shell /usr/sbin/nologin django
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY --chown=django:django . .
COPY --chown=django:django entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
USER django
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --retries=5 CMD curl -fsS "http://127.0.0.1:${PORT}/healthz/" || exit 1
ENTRYPOINT ["/usr/bin/tini","-g","--","/app/entrypoint.sh"]
CMD ["gunicorn","project.wsgi:application","--bind","0.0.0.0:8000","--workers","3","--timeout","60"]
