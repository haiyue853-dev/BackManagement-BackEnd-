# Backend

## Setup
1. Copy `.env.example` to `.env`
2. Install dependencies with `npm install`
3. Make sure MySQL is running and the configured database exists
4. Start the backend with `npm run dev`

## Environment Variables
- `PORT`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `LOG_LEVEL`

## Test
Run:

```bash
node --test backend/tests/env.test.js backend/tests/account.test.js backend/tests/permission.test.js backend/tests/home.test.js
```

## Auth
- Login returns a JWT token
- Protected APIs expect `Authorization: Bearer <token>`
- Token expiration is controlled by `JWT_EXPIRES_IN`
