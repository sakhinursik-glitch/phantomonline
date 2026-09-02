# PHANTOM ONLINE Backend

Production-ready REST API for the Phantom Online football e-commerce store.

## Stack
- **Runtime**: Node.js >= 18
- **Framework**: Express 4
- **Database**: SQLite via better-sqlite3
- **Auth**: JWT + bcryptjs
- **Security**: Helmet, CORS, rate limiting, input validation

## Quick Start

```bash
cd backend
npm install
cp .env.example .env   # Edit .env with your settings!
npm run migrate         # Create database tables
npm run seed            # Import products from frontend catalog.js + create admin
npm start               # Start server on port 3000
```

Or all at once:
```bash
npm run setup && npm start
```

## Environment Variables (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| JWT_SECRET | Secret key for JWT signing | (required) |
| JWT_EXPIRES_IN | Token expiration | 7d |
| DB_PATH | SQLite database file path | ./data/phantom.db |
| CORS_ORIGIN | Allowed frontend origin | https://phantomonl.netlify.app |
| ADMIN_EMAIL | Default admin email | admin@phantomonline.kz |
| ADMIN_PASSWORD | Default admin password | change-me-admin-123 |
| RATE_LIMIT_MAX | Global rate limit per window | 100 |
| AUTH_RATE_LIMIT_MAX | Auth rate limit per window | 10 |

## API Endpoints

### Public
- `GET  /api/health` — Health check
- `GET  /api/catalog` — List products (search, filter, sort, paginate)
- `GET  /api/catalog/:id` — Single product
- `GET  /api/catalog/categories` — Categories with counts
- `GET  /api/catalog/brands` — Brands with counts

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login, get JWT
- `GET  /api/auth/me` — Current user profile
- `PUT  /api/auth/me` — Update profile

### Cart (requires JWT)
- `GET    /api/cart` — User's cart
- `POST   /api/cart` — Add item
- `PUT    /api/cart/:id` — Update quantity
- `DELETE /api/cart/:id` — Remove item
- `DELETE /api/cart` — Clear cart

### Orders (requires JWT)
- `POST /api/orders` — Create order
- `GET  /api/orders` — User's order history
- `GET  /api/orders/:id` — Order details

### Admin (requires admin JWT)
- `GET  /api/admin/stats` — Dashboard stats
- `POST /api/admin/products` — Create product
- `PUT  /api/admin/products/:id` — Update product
- `DELETE /api/admin/products/:id` — Delete product
- `GET  /api/admin/orders` — All orders
- `PUT  /api/admin/orders/:id/status` — Update order status

## Frontend Integration

The optional `js/api-adapter.js` script connects the existing frontend to the API:
1. Add `<script>window.PHANTOM_API_URL = 'https://your-api.com/api';</script>` before ui.js
2. Add `<script src="../js/api-adapter.js"></script>` after ui.js
3. The adapter overrides cart/checkout functions to use the API when available
4. If the API is unreachable, the frontend falls back to localStorage (original behavior)

## Deployment

### Render (recommended, free tier)
1. Push this `backend/` folder to a separate repo or as a subdirectory
2. Create a Render Web Service
3. Set build command: `npm install`
4. Set start command: `npm run migrate && npm run seed && npm start`
5. Add environment variables

### Railway, Fly.io, or any VPS
Same setup — just needs Node.js 18+.

## Reset Database
```bash
npm run reset    # Delete database file
npm run setup    # Recreate + seed
```

## License
Private — PHANTOM ONLINE
