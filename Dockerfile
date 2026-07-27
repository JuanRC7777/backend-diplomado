# ---- Stage 1: instalar dependencias de produccion ----
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev \
  && rm -rf /root/.npm

# NOTA: esta imagen NO corre migraciones ni seeders al arrancar.
# `npm run db:migrate` y `npm run db:seed` se corren manualmente,
# fuera del contenedor, antes de desplegar una version nueva -- asi
# un fallo de migracion nunca bloquea ni tumba el arranque del
# servidor en produccion.

# ---- Stage 2: imagen final, minima ----
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=4000

RUN apk add --no-cache tini \
  && addgroup -S pawcare \
  && adduser -S pawcare -G pawcare

COPY --from=deps --chown=pawcare:pawcare /app/node_modules ./node_modules
COPY --chown=pawcare:pawcare package.json ./
COPY --chown=pawcare:pawcare src ./src

# Carpeta donde multer guarda las fotos subidas. Monta un volumen aqui
# en produccion para que las imagenes no se pierdan al recrear el contenedor.
RUN mkdir -p uploads && chown pawcare:pawcare uploads

USER pawcare

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||4000)+'/api/health',(r)=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/server.js"]
