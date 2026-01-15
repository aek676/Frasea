# Frasea

**Frasea** es una aplicación web (Next.js) que permite traducir texto, guardar un historial de traducciones y obtener frases de ejemplo mediante scraping (microservicio Rust). Está pensada para desarrolladores y usuarios que necesitan guardar y gestionar traducciones rápidas con contexto.

---

## ⚡ Características principales

- Traducción de texto usando `@vitalets/google-translate-api`.
- Historial de traducciones por usuario (guardado en MongoDB).
- Guardar/editar/eliminar traducciones desde la UI.
- Scraper de frases de ejemplo (servicio `scrap-dictionary` en Rust) para obtener ejemplos de uso.
- Autenticación básica con JWT y cookies HTTP-only.

---

## 🧰 Pila tecnológica

- Frontend / Backend: **Next.js 16** (App Router) + React 19
- Base de datos: **MongoDB** (imagen `mongo:6.0` en docker-compose)
- Autenticación: **JWT** (cookie `auth_token`)
- Scraper: **Rust** (Axum + reqwest + scraper)
- Contenedores: **Docker** + **Docker Compose**
- Lenguajes: **TypeScript** (frontend) y **Rust** (scraper)

---

## 🚀 Arranque rápido (recomendado: Docker)

1. Construir y levantar todo con Docker Compose:

```bash
docker compose up --build
```

2. Accede a:

- App Next.js: http://localhost:3000
- Mongo Express: http://localhost:8081
- Servicio scrap-dictionary: http://localhost:3030

> Nota: Docker Compose ya monta `my-app/.env.local` y usa en el servicio `MONGODB_URI` con credenciales de ejemplo definidas en `docker-compose.yml`.

> El `Dockerfile` del frontend utiliza **Bun** (`oven/bun`) para construir y ejecutar la aplicación (ver `my-app/Dockerfile`).

---

Scripts principales (desde `my-app`):

- `bun run dev` — desarrollo
- `bun run build` — construir para producción
- `bun run start` — iniciar producción
- `bun run lint` — linting

---

## 🔐 Variables de entorno

Variables requeridas por el servidor (ver `my-app/.env.example`):

- `MONGODB_URI` — URI para conectar con MongoDB (ejemplo: `mongodb://root:example@mongo:27017/Frasea?authSource=admin`)
- `JWT_SECRET` — Secreto para firmar tokens JWT
- `JWT_EXPIRES_IN` — Tiempo de expiración del JWT en segundos (e.g. `3600`)
- `SCRAP_DICTIONARY_URL` — URL del servicio scrap-dictionary (por defecto `http://localhost:3030`)

---

## 📡 API (endpoints más relevantes)

- POST `/api/translate`

  - Descripción: Traduce texto.
  - Payload: `{ text: string, from: string, to: string }`
  - Respuesta: `{ originalText, from, to, translatedText }`

- GET `/api/languages`

  - Descripción: Devuelve lista de idiomas (scrapeada de la doc de Google Translate).
  - Respuesta: `{ languages: [{ name, code }, ...] }`

- Servicio Rust `scrap-dictionary`:
  - GET `/translate/:source/:target/:word` — Devuelve traducciones y ejemplos (200 / 404 / 502 según resultado).
  - GET `/health` — Health check del servicio.

---

## 🗂️ Archivos y carpetas clave

- `my-app/` — Aplicación Next.js (frontend y API)
- `my-app/.env.example` — Ejemplo de variables de entorno
- `my-app/Dockerfile` — Dockerfile del frontend
- `scrap-dictionary/` — Microservicio Rust (scraper)
- `mongo-init/init-db.js` — Script que inicializa la BD con un usuario y datos de ejemplo
- `docker-compose.yml` — Orquestación de servicios para desarrollo

---
