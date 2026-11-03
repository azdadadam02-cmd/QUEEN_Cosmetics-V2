# QUEEN Cosmetics — Laravel (API) + Next.js

L-site l-9dim (PHP MVC « fait main », `index.php?action=...`) t-9sem 3la juj :

| Dossier | Rôle | Port |
|---|---|---|
| `backend-laravel/` | API REST Laravel 12 + Sanctum (tokens), base `queen_db` | http://localhost:8000 |
| `frontend-nextjs/` | Site Next.js 16 (App Router) li kaychoufo l-clients w l-personnel | http://localhost:3000 |

Next.js ma kayhder m3a la base ABADAN : kay3iyt l Laravel (`/api/...`), w Laravel howa li kayverifi kolchi (prix, stock, rôles, validation).

---

## 1. Lancer le projet (XAMPP, PHP 8.2+)

### Backend — Laravel
```bash
cd backend-laravel
composer install
php artisan key:generate
# .env : DB_DATABASE=queen_db, DB_USERNAME=root, DB_PASSWORD= (MySQL de XAMPP allumé)
php artisan migrate --seed
php artisan serve            # → http://localhost:8000
```

- **queen_db 3amra b data dyalek ?** `php artisan migrate` ma kaymsse7 walo : kaycréé ghir les tables li naqsin
  (tokens Sanctum, cache…) w kayzid ghir les colonnes li naqsin (`promotion`, `produit_id`, livraison, `statut_vu`).
- Les mots de passe l-9dam (`password_hash`) kaykhdmo direct ; kayt-rehashaw automatiquement f login.
- `--seed` kayzid 4 comptes de test (ila ma kanoch) w des produits ghir ila la table `produits` khawya.

### Frontend — Next.js
```bash
cd frontend-nextjs
npm install
npm run dev                  # → http://localhost:3000
```
L'adresse dyal l-API kayna f `frontend-nextjs/.env.local` (`NEXT_PUBLIC_API_URL=http://localhost:8000`).

### Comptes de test (mot de passe : `Queen2026`)
| Email | Rôle | Page après connexion |
|---|---|---|
| `client@queen.ma` | Client | `/` |
| `produits@queen.ma` | Responsable produits | `/gestion/produits` |
| `commandes@queen.ma` | Responsable commandes | `/gestion/commandes` |
| `admin@queen.ma` | Admin | `/admin` |

---

## 2. Structure

```
QUEEN-Cosmetics-Project/
├── backend-laravel/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/   AuthController, ProductController, CartController, OrderController,
│   │   │   │                      OrderManagementController, AdvertisementController, UserController, AdminController
│   │   │   ├── Requests/          StoreOrderRequest, ProductRequest, AdvertisementRequest, UserRequest,
│   │   │   │                      LoginRequest, RegisterRequest, CartCheckRequest   ← la validation
│   │   │   ├── Resources/         ProductResource, OrderResource, AdvertisementResource, UserResource…  ← forme du JSON
│   │   │   └── Middleware/        EnsureRole (role:admin…), SecurityHeaders
│   │   ├── Models/                User, Product, Order, OrderItem, Payment, Advertisement
│   │   └── Services/              CartService, OrderService, FinanceService, ImageUploader  ← la logique métier
│   ├── database/migrations/       tables queen_db (mêmes noms qu'avant : utilisateurs, produits, commandes…)
│   ├── database/seeders/          comptes de test + produits de démo
│   ├── public/images/             images des produits et publicités (uploads)
│   ├── routes/api.php             TOUTES les routes appelées par Next.js
│   └── .env                       connexion MySQL (queen_db)
│
└── frontend-nextjs/
    ├── public/images/logo.webp
    ├── src/app/                   les pages (App Router)
    │   ├── layout.jsx             navbar + footer communs
    │   ├── page.jsx               accueil (carrousel + produits)
    │   ├── products/page.jsx      catalogue        products/[id]/page.jsx  fiche produit
    │   ├── cart/page.jsx          panier           checkout/page.jsx       confirmation (+18, livraison)
    │   ├── login/ register/       connexion / inscription
    │   ├── notifications/         suivi des commandes du client
    │   ├── gestion/produits/      responsable produits      gestion/commandes/  responsable commandes
    │   └── admin/                 tableau de bord, produits, commandes, finances, publicités, utilisateurs
    ├── src/components/ui/         Button, Field, Modal, StatusPill, Thumb, Toaster
    ├── src/components/layout/     Navbar, Footer, ProductCard, AdsCarousel, OrdersTable, ProductsTable, RequireRole…
    ├── src/lib/                   api.js (Axios + token), serverApi.js (fetch côté serveur), auth.js, format.js
    ├── src/store/                 cartStore.js (panier persistant), authStore.js (token), toastStore.js
    ├── next.config.js             images autorisées depuis Laravel + en-têtes de sécurité
    └── package.json
```

---

## 3. Ancien MVC → nouveau système

| Avant (PHP MVC) | Daba |
|---|---|
| `index.php?action=accueil` | `GET /` (Next.js) ← `GET /api/products`, `/api/advertisements` |
| `?action=panier`, `panier_ajouter`, `panier_modifier` | `/cart` — le panier f Zustand (`cartStore.js`), Laravel kayverifih b `POST /api/cart/check` |
| `?action=confirmation`, `commande_valider` | `/checkout` → `POST /api/orders` (`StoreOrderRequest`) |
| `?action=notifications` | `/notifications` → `GET /api/notifications` (+ `/count` pour le badge) |
| `?action=login_post`, `register_post`, `logout` | `/login`, `/register` → `POST /api/auth/login|register|logout` (token Sanctum) |
| `?action=produits_liste`, `produit_ajouter`, `produit_modifier` | `/gestion/produits` → `GET|POST /api/manage/products[/{id}]` |
| `?action=commandes_gestion`, `commande_statut` | `/gestion/commandes` → `GET /api/manage/orders`, `PATCH /api/manage/orders/{id}/status` |
| `?action=admin_dashboard`, `admin_finances` | `/admin`, `/admin/finances` → `GET /api/admin/dashboard|finances` |
| `?action=admin_publicites…` | `/admin/publicites` → `POST|DELETE /api/admin/advertisements[/{id}]` |
| `?action=admin_utilisateurs…` | `/admin/utilisateurs` → `GET|POST|PUT|DELETE /api/admin/users[/{id}]` |
| `$_SESSION['user']` | token Sanctum (`Authorization: Bearer …`), expiration 8 h |
| `app/models/*.php` (PDO) | `app/Models/*` (Eloquent) + `app/Services/*` |
| `$routes` + `require_role()` | `routes/api.php` + middleware `role:` (rôle relu en base à chaque requête) |

Les règles métier kaynin kamlin : transitions `En attente → Acceptée/Refusée`, `Acceptée → Livrée/Annulée`,
refus/annulation = stock remis en rayon, livraison = paiement `Paye`, promo = la plus forte entre le produit
et la pub liée, prix réduit howa li kaydkhol f la commande.

---

## 4. Sécurité (équivalent de l'ancien `security.php`)

| Avant | Daba |
|---|---|
| Liste blanche d'actions, 404 / 405 | Routes Laravel explicites (inconnue → 404 JSON, mauvais verbe → 405) |
| Rôle par route + journal | Middleware `role:` + `storage/logs/security-*.log` |
| 5 échecs login / 15 min (email+IP), 30 par IP | Pareil (`RateLimiter` dans `AuthController`), message identique |
| 10 inscriptions / h par IP | `throttle:register` |
| CSRF + Origin | Pas de cookie de session → pas de CSRF possible ; CORS limité à `FRONTEND_URL` |
| Requêtes préparées | Eloquent / Query Builder (toujours préparé) |
| Upload : finfo + getimagesize, nom aléatoire | Règles `mimetypes`, `max:3072`, `dimensions` + nom aléatoire dans `public/images` |
| Panier 30 / 20, 5 commandes en attente, 10 / h | Pareil (`CartService`, `StoreOrderRequest`, `OrderController`) |
| Prix jamais fait confiance au navigateur | Pareil : `OrderService` relit prix + promo + stock en base, dans une transaction verrouillée |
| En-têtes nosniff, X-Frame-Options… | `SecurityHeaders` (Laravel) + `headers()` dans `next.config.js` |

⚠ Le token est stocké dans le navigateur (localStorage). C'est simple et suffisant pour le projet ;
pour un vrai site en production, on peut passer à Sanctum « SPA » (cookie HttpOnly).

---

## 5. À savoir
- Bilingue FR/AR : l-ancien site kan fih `ar.php` ; had la version mazal ghir b l-français (à ajouter avec `next-intl` si besoin).
- Prod : `npm run build && npm start` (Next.js) ; `APP_DEBUG=false` w `FRONTEND_URL=https://ton-domaine` f `.env` (Laravel).
