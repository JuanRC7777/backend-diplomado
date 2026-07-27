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

## Despliegue con Docker

La imagen **no** corre migraciones ni seeders al arrancar. Antes de desplegar una versión
nueva, corre manualmente (fuera del contenedor, apuntando a la base de datos de producción):

\`\`\`bash
npm run db:migrate
npm run db:seed
\`\`\`

Luego construye y levanta el contenedor:

\`\`\`bash
docker build -t pawcare-backend .
docker run --rm -p 4000:4000 --env-file .env -e NODE_ENV=production pawcare-backend
\`\`\`

> El `-e NODE_ENV=production` es necesario aunque uses `--env-file .env`: tu `.env` local
> trae `NODE_ENV=development` (para pruebas), y `-e` siempre tiene prioridad sobre
> `--env-file`. Si se te olvida, la cookie de sesión no se marca como `secure` y viaja
> sin exigir HTTPS.

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
