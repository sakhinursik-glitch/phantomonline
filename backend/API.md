# PHANTOM ONLINE — REST API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Server health check |

---

## Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, get JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| PUT | `/api/auth/me` | Yes | Update profile |

### POST /api/auth/register
```json
// Request
{ "name": "Иван", "email": "ivan@example.com", "password": "123456" }

// Response 201
{
  "token": "eyJhbGciOiJIUz...",
  "user": { "id": 1, "name": "Иван", "email": "ivan@example.com", "role": "user" }
}
```

### POST /api/auth/login
```json
// Request
{ "email": "ivan@example.com", "password": "123456" }

// Response 200
{
  "token": "eyJhbGciOiJIUz...",
  "user": { "id": 1, "name": "Иван", "email": "ivan@example.com", "role": "user" }
}
```

### GET /api/auth/me
```json
// Response 200
{
  "user": { "id": 1, "name": "Иван", "email": "ivan@example.com", "role": "user", "created_at": "2026-09-01" }
}
```

---

## Catalog (Public)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/catalog` | No | List products with filters |
| GET | `/api/catalog/:id` | No | Get single product |
| GET | `/api/catalog/categories` | No | List categories with counts |
| GET | `/api/catalog/brands` | No | List brands with counts |

### GET /api/catalog

**Query Parameters:**

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| search | string | `mercurial` | Full-text search |
| category | string | `boots` | Filter by category |
| brand | string | `Nike` | Filter by brand |
| league | string | `premier-league` | Filter by league |
| surface | string | `FG` | Filter by surface type |
| level | string | `ELITE` | Filter by level |
| size | string | `EU 42` | Filter by available size |
| minPrice | number | `10000` | Min price |
| maxPrice | number | `50000` | Max price |
| sort | string | `price-asc` | Sort: `featured`, `new`, `sale`, `price-asc`, `price-desc`, `popular` |
| isNew | boolean | `1` | Only new arrivals |
| bestseller | boolean | `1` | Only bestsellers |
| featured | boolean | `1` | Only featured |
| sale | boolean | `1` | Only on sale |
| collection | string | `speed` | Filter by collection |
| page | number | `1` | Page number |
| limit | number | `50` | Items per page |

```json
// Response 200
{
  "items": [
    {
      "id": "nike-merc-vapor",
      "name": "Nike Mercurial Vapor 17 Elite",
      "brand": "Nike",
      "category": "boots",
      "price": 25000,
      "sizes": ["EU 40", "EU 41", "EU 42"],
      "surface": ["FG"],
      "level": "ELITE",
      "isNew": true,
      "bestseller": true,
      "featured": true,
      "stock": 12,
      "collection": "speed"
    }
  ],
  "total": 35,
  "page": 1,
  "limit": 50
}
```

---

## Cart (Auth required)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | Yes | Get cart |
| POST | `/api/cart` | Yes | Add item |
| PUT | `/api/cart/:itemId` | Yes | Update quantity |
| DELETE | `/api/cart/:itemId` | Yes | Remove item |
| DELETE | `/api/cart` | Yes | Clear cart |

### POST /api/cart
```json
// Request
{ "productId": "nike-merc-vapor", "size": "EU 42", "qty": 1 }

// Response 201
{
  "items": [...],
  "total": 25000,
  "count": 1,
  "message": "Товар добавлен в корзину"
}
```

---

## Orders (Auth required)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | Yes | Create order |
| GET | `/api/orders` | Yes | User's order history |
| GET | `/api/orders/:id` | Yes | Get order details |

### POST /api/orders
```json
// Request
{
  "name": "Иван",
  "phone": "+7 771 259 8932",
  "city": "Алматы",
  "address": "ул. Абая 50",
  "delivery": "courier",
  "deliveryFee": 2000,
  "comment": "Позвоните за час",
  "payment": "Kaspi Gold"
}

// Response 201
{
  "order": {
    "id": "PH-001234",
    "user_id": 1,
    "name": "Иван",
    "phone": "+7 771 259 8932",
    "status": "pending",
    "subtotal": 50000,
    "total": 52000,
    "items": [...]
  },
  "message": "Заказ успешно создан"
}
```

---

## Admin (Admin role required)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| POST | `/api/admin/products` | Admin | Create product |
| PUT | `/api/admin/products/:id` | Admin | Update product |
| DELETE | `/api/admin/products/:id` | Admin | Delete product |
| GET | `/api/admin/orders` | Admin | List all orders |
| PUT | `/api/admin/orders/:id/status` | Admin | Update order status |

### POST /api/admin/products
```json
// Request
{
  "id": "nike-tiempo-legend-10",
  "name": "Nike Tiempo Legend 10 Elite",
  "brand": "Nike",
  "category": "boots",
  "price": 25000,
  "sizes": ["EU 39", "EU 40", "EU 41", "EU 42"],
  "surface": ["FG", "AG"],
  "level": "ELITE",
  "stock": 13,
  "description": "Легендарная серия для премьер-классной техники"
}
```

### PUT /api/admin/orders/:id/status
```json
// Request
{ "status": "shipped" }

// Valid statuses: pending, paid, processing, shipped, completed, cancelled
```

---

## Error Responses

All errors return:
```json
{ "error": "Описание ошибки на русском" }
```

| Code | Meaning |
|------|---------|
| 400 | Validation error / bad request |
| 401 | Unauthorized (no token or invalid) |
| 403 | Forbidden (not admin) |
| 404 | Not found |
| 409 | Conflict (duplicate) |
| 429 | Rate limit exceeded |
| 500 | Server error |

---

## Database Schema

**users** — id, name, email, password_hash, role (user|admin), created_at
**products** — id, name, description, price, old_price, discount, image, category, brand, subcategory, product_type, league, club, season, kind, sizes (JSON), surface (JSON), level, player_profile, material, weight, fit, upper, soleplate, generation, purpose, grip, featured, bestseller, is_new, sale, stock, collection
**cart_items** — id, user_id, product_id, size, qty, custom_*
**orders** — id, user_id, name, phone, city, address, delivery, delivery_fee, comment, payment, status, subtotal, total
**order_items** — id, order_id, product_id, product_name, product_brand, size, qty, price, custom_*
