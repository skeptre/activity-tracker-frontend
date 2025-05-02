# API Specification

## Base URL
- **Development:**
  - Uses `EXPO_PUBLIC_API_URL` from `.env` if set.
  - Otherwise:
    - iOS: `http://localhost:3333/api`
    - Android: `http://10.0.2.2:3333/api`
    - Default: `http://localhost:3333/api`
- **Production:**
  - `https://your-production-api.com/api` (update to your real production URL)

**.env Example:**
```
EXPO_PUBLIC_API_URL=http://localhost:3333/api
```

---

## Endpoints

| Endpoint                  | Method | Purpose                | Notes                        |
|---------------------------|--------|------------------------|------------------------------|
| /users                    | POST   | Register user          |                              |
| /auth/login               | POST   | Login                  |                              |
| /auth/logout              | POST   | Logout                 |                              |
| /activities               | GET    | List activities        |                              |
| /activities               | POST   | Create activity        | Planned, not yet implemented |
| /activities/:id           | PUT    | Update activity        | Planned, not yet implemented |
| /activities/:id           | DELETE | Delete activity        | Planned, not yet implemented |
| /activities/:id/start     | POST   | Start activity         | Planned, not yet implemented |
| /activities/:id/stop      | POST   | Stop activity          | Planned, not yet implemented |
| /api/activity/workouts    | HEAD   | Check workouts         | Planned, not yet implemented |
| /health                   | GET    | Health check           |                              |
| /version                  | GET    | Version check          |                              |

---

## Headers
- `Content-Type: application/json` (default)
- `X-Authorization: <token>` (for authenticated requests)

---

## Notes
- Auth endpoints expect and return JSON.
- Activities and workouts endpoints are partially mocked/planned in the frontend.
- Health/version endpoints are used for connectivity checks.

---

**Update this file as your backend evolves!** 