# PawCare — Backend

API REST del proyecto PawCare (adopción de mascotas y jornadas de vacunación), construida con **Node.js**, **Express** y **Sequelize** sobre **MySQL**.

## Tecnologías

- Node.js + Express
- Sequelize (ORM) + MySQL (`mysql2`)
- JWT (`jsonwebtoken`) + `bcryptjs` para autenticación
- `multer` para subida de imágenes
- `helmet`, `cors`, `express-rate-limit` para seguridad

## Requisitos previos

- Node.js 20 o superior
- MySQL 8 (o MariaDB compatible) corriendo localmente
- Un cliente de MySQL (línea de comandos, HeidiSQL, MySQL Workbench, etc.)

## 1. Instalación

\`\`\`bash
npm install
\`\`\`

## 2. Variables de entorno

Copia `.env.example` a `.env` y completa los valores:

\`\`\`bash
cp .env.example .env
\`\`\`

- `DB_USER`/`DB_PASSWORD`: el usuario de aplicación (creado en el paso 3), con permisos limitados.
- `DB_ADMIN_USER`/`DB_ADMIN_PASSWORD`: un usuario con permisos para crear tablas (por ejemplo `root`), usado **solo** por `sequelize-cli` para correr migraciones y seeders — nunca lo usa la app en tiempo real.
- `JWT_ACCESS_SECRET`: ejecuta uno de los siguientes comandos en tu terminal y pega el resultado como valor de esta variable:

  ```bash
  openssl rand -base64 48
  ```

  Si no tienes `openssl` disponible, genera el mismo tipo de valor con Node:

  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
  ```

### Referencia completa de variables

| Variable | Obligatoria | Valor por defecto | Descripción |
|---|---|---|---|
| `NODE_ENV` | No | `development` | En `production` activa la cookie `secure` (solo se envía por HTTPS). |
| `PORT` | No | `4000` | Puerto donde escucha la API. |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Origen permitido por CORS. Debe coincidir con la URL donde corre el frontend, o las peticiones desde el navegador serán rechazadas. |
| `DB_HOST` | Sí | `127.0.0.1` | Host del servidor MySQL. |
| `DB_PORT` | No | `3306` | Puerto de MySQL. |
| `DB_NAME` | Sí | `pawcare` | Nombre de la base de datos (debe coincidir con la creada en el paso 3). |
| `DB_USER` | Sí | — | Usuario de aplicación, con permisos limitados (paso 3). |
| `DB_PASSWORD` | Sí | — | Contraseña de `DB_USER`. |
| `DB_SSL` | No | `false` | Ponlo en `true` si tu MySQL requiere SSL (por ejemplo, en la nube). |
| `DB_ADMIN_USER` | Solo para migraciones | `root` | Usuario con permisos para crear/alterar tablas, usado por `sequelize-cli`. |
| `DB_ADMIN_PASSWORD` | Solo para migraciones | — | Contraseña de `DB_ADMIN_USER`. |
| `JWT_ACCESS_SECRET` | Sí | — | Secreto para firmar los tokens de acceso (ver arriba cómo generarlo). |
| `JWT_ACCESS_EXPIRES` | No | `15m` | Tiempo de vida del access token (formato de [`ms`](https://www.npmjs.com/package/ms), ej. `15m`, `1h`). |
| `JWT_REFRESH_EXPIRES_DAYS` | No | `7` | Días de vida del refresh token (cookie HttpOnly). |
| `BCRYPT_SALT_ROUNDS` | No | `12` | Costo del hash de contraseñas (más alto = más lento y más seguro). |

> "Obligatoria" = sin este valor la API no arranca (`server.js` valida `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `JWT_ACCESS_SECRET` al iniciar y termina el proceso si falta alguno).

## 3. Crear la base de datos y el usuario

Conéctate a MySQL como administrador (`mysql -u root -p`) y corre:

\`\`\`sql
CREATE DATABASE IF NOT EXISTS pawcare
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'pawcare_app'@'localhost' IDENTIFIED BY 'TU_CONTRASENA_AQUI';

GRANT SELECT, INSERT, UPDATE, DELETE ON pawcare.* TO 'pawcare_app'@'localhost';

FLUSH PRIVILEGES;
\`\`\`

> El usuario `pawcare_app` solo tiene permisos de lectura/escritura de datos (no puede crear ni modificar tablas), por eso las migraciones se corren con el usuario admin (`DB_ADMIN_USER`).

## 4. Migraciones y seeders

Con `.env` ya configurado:

\`\`\`bash
npm run db:migrate   # crea las 7 tablas
npm run db:seed      # siembra el catálogo de vacunas y un usuario administrador
\`\`\`

El seeder crea un usuario admin de prueba: `admin@pawcare.co` / `admin123` (cámbiala en un
entorno real). Con ese usuario se accede al panel `/admin` del frontend.

## 5. Levantar el servidor

\`\`\`bash
npm run dev
\`\`\`

La API queda disponible en `http://localhost:4000/api`. Puedes probar que todo esté bien con:

\`\`\`bash
curl http://localhost:4000/api/health
\`\`\`

## Despliegue con Docker (recomendado para un PC nuevo)

Esta sección es una receta completa, probada de punta a punta: MySQL + backend en
contenedores, sin depender de tener MySQL instalado en el sistema. Solo necesitas
[Docker Desktop](https://www.docker.com/products/docker-desktop/) y Node.js (para correr
las migraciones con `sequelize-cli`).

### 1. Red de Docker

Para que los contenedores se vean entre sí por nombre:

\`\`\`bash
docker network create pawcare-net
\`\`\`

### 2. Levantar MySQL

\`\`\`bash
docker run -d --name pawcare-mysql --network pawcare-net \
  -e MYSQL_ROOT_PASSWORD=TU_PASSWORD_ROOT \
  -e MYSQL_DATABASE=pawcare \
  -p 3306:3306 \
  mysql:8
\`\`\`

Espera a que esté listo (los primeros segundos MySQL se reinicia solo, es normal):

\`\`\`bash
docker exec pawcare-mysql mysqladmin ping -uroot -pTU_PASSWORD_ROOT --silent
\`\`\`

Crea el usuario de aplicación (permisos limitados, sin poder crear/alterar tablas):

\`\`\`bash
docker exec -i pawcare-mysql mysql -uroot -pTU_PASSWORD_ROOT <<'EOF'
CREATE USER IF NOT EXISTS 'pawcare_app'@'%' IDENTIFIED BY 'TU_PASSWORD_APP';
GRANT SELECT, INSERT, UPDATE, DELETE ON pawcare.* TO 'pawcare_app'@'%';
FLUSH PRIVILEGES;
EOF
\`\`\`

### 3. Migraciones y seeders

Copia `.env.example` a `.env` (ver la sección de variables más arriba) con
`DB_HOST=127.0.0.1` (el puerto 3306 ya está publicado al host) y las contraseñas que
usaste arriba. Luego, con Node.js instalado:

\`\`\`bash
npm install
npm run db:migrate
npm run db:seed
\`\`\`

> La imagen de producción del backend **no** trae `sequelize-cli` (es una dependencia de
> desarrollo, no se instala con `npm ci --omit=dev`), por eso las migraciones se corren
> desde el host, no desde el contenedor de la app.

### 4. Construir y levantar el backend

\`\`\`bash
docker build -t pawcare-backend .
docker run -d --name pawcare-backend --network pawcare-net \
  -p 4000:4000 \
  -e NODE_ENV=production \
  -e CORS_ORIGIN=http://localhost:8080 \
  -e DB_HOST=pawcare-mysql \
  -e DB_NAME=pawcare \
  -e DB_USER=pawcare_app \
  -e DB_PASSWORD=TU_PASSWORD_APP \
  -e JWT_ACCESS_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64'))") \
  pawcare-backend
\`\`\`

Nota: `DB_HOST` aquí es el **nombre del contenedor** de MySQL (`pawcare-mysql`), no
`127.0.0.1` — los dos contenedores se hablan por la red `pawcare-net`, no por el puerto
publicado al host. `CORS_ORIGIN` debe ser la URL exacta donde corre el frontend.

Verifica que arrancó bien:

\`\`\`bash
curl http://localhost:4000/api/health
docker logs pawcare-backend
\`\`\`

### 5. Persistencia de las fotos subidas

Sin un volumen, las fotos subidas con `multer` se pierden si se recrea el contenedor.
Para producción real, monta un volumen en `/app/uploads`:

\`\`\`bash
docker run -d --name pawcare-backend --network pawcare-net \
  -p 4000:4000 \
  -v pawcare-uploads:/app/uploads \
  # ...el resto de las variables de arriba
  pawcare-backend
\`\`\`

### Actualizar una versión ya desplegada

La imagen no corre migraciones ni seeders al arrancar (a propósito, para que un fallo de
migración nunca tumbe el arranque del servidor). Antes de reemplazar el contenedor con una
imagen nueva, corre manualmente contra la base de datos de producción:

\`\`\`bash
npm run db:migrate
\`\`\`

Luego reconstruye la imagen y reemplaza el contenedor (`docker stop`/`docker rm` seguido del
`docker run` del paso 4).

### Solución de problemas comunes

- **"Failed to fetch" / error de CORS en la consola del navegador**: `CORS_ORIGIN` del
  backend no coincide *exactamente* con la URL desde la que abres el frontend (incluyendo
  el puerto). No puede ser `*` porque el frontend manda `credentials: "include"`.
- **Login funciona pero se cierra la sesión al recargar**: revisa que el frontend y el
  backend no estén en dominios/puertos que el navegador bloquee por third-party cookies, y
  que `CORS_ORIGIN` sea correcto.
- **Subir una foto falla con error 500**: confirma que la carpeta `uploads/` existe (en
  Docker se crea sola en el build; en local, créala a mano si hace falta).
- **Si usas el cliente `mysql` de línea de comandos para revisar datos y ves tildes/ñ
  rotas** (ej. `Bogot�` en vez de `Bogotá`): es el propio cliente `mysql`, no el backend —
  por defecto usa `latin1` para mostrar resultados. Conéctate con
  `mysql --default-character-set=utf8mb4 ...` para ver los datos reales.

## Estructura del proyecto

\`\`\`
src/
  config/       # conexión a Sequelize y config de sequelize-cli
  controllers/  # lógica de cada endpoint
  database/     # migraciones y seeders
  middleware/   # auth, autorización, subida de archivos, manejo de errores
  models/       # modelos Sequelize y sus relaciones
  routes/       # definición de endpoints REST
  utils/        # helpers (JWT, hash, errores)
  validators/   # validación de datos de entrada
  server.js     # punto de entrada
\`\`\`

## Recursos principales de la API

- `/api/auth` — registro, login, refresh, logout
- `/api/animales` — CRUD de animales en adopción
- `/api/jornadas` — CRUD de jornadas de vacunación
- `/api/vacunas` — catálogo de vacunas (lectura pública; crear/eliminar solo admin)
- `/api/usuarios` — listar y activar/desactivar cuentas (solo admin)
- `/api/solicitudes` — solicitudes de adopción: crear es público, listar es solo admin
