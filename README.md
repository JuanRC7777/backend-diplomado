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
- `JWT_ACCESS_SECRET`: genera uno con `openssl rand -base64 48`.

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
npm run db:seed      # siembra el catálogo de vacunas
\`\`\`

## 5. Levantar el servidor

\`\`\`bash
npm run dev
\`\`\`

La API queda disponible en `http://localhost:4000/api`. Puedes probar que todo esté bien con:

\`\`\`bash
curl http://localhost:4000/api/health
\`\`\`

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
- `/api/vacunas` — catálogo de vacunas (solo lectura)
