# Graph Report - QUEEN_Cosmetics-V2  (2026-11-06)

## Corpus Check
- 0 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 693 nodes · 1448 edges · 48 communities (25 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Admin and Staff Pages
- Composer Backend Config
- Product and Ads Controllers
- Database Migrations
- API Routes and Controllers
- Top Bars Admin and Root Layout
- Form Request Validation
- Middleware and API Resources
- Order Management and Models
- Frontend Package Config
- Laravel Dashboard and Auth Controllers
- Middleware and API Resources
- Storefront Catalogue Pages
- Middleware and API Resources
- Laravel Dashboard and Auth Controllers
- Order Management and Models
- Laravel Dashboard and Auth Controllers
- Order Management and Models
- Database Schema Tables
- Top Bars Models and Tables
- Order Management and Models
- StyleCI Config
- Middleware and API Resources
- Logo Brand Elements
- Next.js Config
- Rose Perfume Image
- Promotions Flat-Lay Image
- Perfume Offer Image
- Vera Wang Product Photo
- Test Base Class
- JS Path Config
- Face Cream Image
- Makeup Promotion Image
- Lipstick Image
- Silicone Product Image
- Frontend Logo Identity
- Cart Docs Concepts

## God Nodes (most connected - your core abstractions)
1. `errorMessage()` - 35 edges
2. `react` - 30 edges
3. `Button()` - 25 edges
4. `Order` - 19 edges
5. `User` - 19 edges
6. `money()` - 19 edges
7. `next` - 19 edges
8. `toast` - 18 edges
9. `Controller` - 17 edges
10. `PageHead()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Order` --references--> `Table commandes`  [EXTRACTED]
  backend-laravel/app/Models/Order.php → Database.txt
- `Advertisement` --references--> `Table publicites`  [EXTRACTED]
  backend-laravel/app/Models/Advertisement.php → Database.txt
- `Payment` --references--> `Table paiements`  [EXTRACTED]
  backend-laravel/app/Models/Payment.php → Database.txt
- `Product` --references--> `Table produits`  [EXTRACTED]
  backend-laravel/app/Models/Product.php → Database.txt
- `PromoAnnouncement` --references--> `Table annonces_promo`  [EXTRACTED]
  backend-laravel/app/Models/PromoAnnouncement.php → Database.txt

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Tables du flux de commande** — database_commandes, database_details_commandes, database_paiements, database_produits [EXTRACTED 1.00]
- **Trusted order placement flow** — readme_cart_store, readme_cart_service, readme_order_controller, readme_store_order_request, readme_order_service, readme_server_side_price_verification [INFERRED 0.85]
- **Bearer token authentication flow** — readme_auth_controller, readme_auth_store, readme_api_client, readme_sanctum_token_auth, readme_role_middleware [INFERRED 0.85]
- **Barres du haut (avantages + promo)** — database_usps, database_annonces_promo [INFERRED 0.85]

## Communities (48 total, 23 thin omitted)

### Community 0 - "Admin and Staff Pages"
Cohesion: 0.06
Nodes (80): AdminCommandesPage(), FILTERS, FinancesPage(), AdminLayout(), AdminDashboard(), AdminProduitsPage(), EMPTY, PublicitesPage() (+72 more)

### Community 1 - "Composer Backend Config"
Cohesion: 0.04
Nodes (46): pestphp/pest-plugin, php-http/discovery, autoload, autoload-dev, psr-4, psr-4, config, allow-plugins (+38 more)

### Community 2 - "Product and Ads Controllers"
Cohesion: 0.06
Nodes (9): AdvertisementController, ProductController, AdvertisementRequest, ProductRequest, AdvertisementResource, ProductResource, Advertisement, ImageUploader (+1 more)

### Community 3 - "Database Migrations"
Cohesion: 0.08
Nodes (23): {closure#1}(), {closure#2}(), {closure#3}(), {closure#1}(), {closure#2}(), {closure#1}(), {closure#2}(), {closure#3}() (+15 more)

### Community 4 - "API Routes and Controllers"
Cohesion: 0.05
Nodes (19): robots.txt allow-all policy, QUEEN Cosmetics API Laravel README, Next.js agent rules (read node_modules/next/dist/docs), QUEEN Cosmetics Next.js README, api.js (Axios + token), AuthController, authStore.js (token storage), backend-laravel (Laravel 12 REST API) (+11 more)

### Community 5 - "Top Bars Admin and Root Layout"
Cohesion: 0.07
Nodes (28): BarresPage(), open(), save(), EMPTY_PROMO, EMPTY_USP, fmt(), pad(), StatePill() (+20 more)

### Community 6 - "Form Request Validation"
Cohesion: 0.08
Nodes (6): {closure#1}(), CartCheckRequest, LoginRequest, RegisterRequest, StoreOrderRequest, CartService

### Community 7 - "Middleware and API Resources"
Cohesion: 0.14
Nodes (6): OrderItemResource, UserResource, UspResource, {closure#1}(), {closure#2}(), {closure#4}()

### Community 8 - "Order Management and Models"
Cohesion: 0.14
Nodes (5): OrderManagementController, OrderResource, Order, {closure#1}(), OrderService

### Community 9 - "Frontend Package Config"
Cohesion: 0.10
Nodes (22): eslintConfig, dependencies, axios@^1.21.0, next@16.4.5, react@19.3.0, react-dom@19.3.0, zustand@^5.0.16, devDependencies (+14 more)

### Community 10 - "Laravel Dashboard and Auth Controllers"
Cohesion: 0.14
Nodes (3): UserController, UserRequest, User

### Community 11 - "Middleware and API Resources"
Cohesion: 0.13
Nodes (7): EnsureRole, SecurityHeaders, {closure#1}(), {closure#2}(), {closure#3}(), {closure#4}(), {closure#5}()

### Community 12 - "Storefront Catalogue Pages"
Cohesion: 0.20
Nodes (14): HomeContent(), HomePage(), HomeSkeleton(), BuyBox(), generateMetadata(), ProductDetail(), ProductPage(), Catalogue() (+6 more)

### Community 14 - "Laravel Dashboard and Auth Controllers"
Cohesion: 0.23
Nodes (4): AdminController, CartController, Controller, FinanceService

### Community 17 - "Order Management and Models"
Cohesion: 0.20
Nodes (3): OrderItem, Payment, Table paiements

### Community 18 - "Database Schema Tables"
Cohesion: 0.23
Nodes (12): Table adresses_livraison, Table avis_produits, Table commandes, Table details_commandes, Table favoris, Table images_produits, Table pack_produit, Table packs (+4 more)

### Community 19 - "Top Bars Models and Tables"
Cohesion: 0.27
Nodes (5): PromoAnnouncement, Usp, Table annonces_promo, Table parametres_header, Table usps

### Community 20 - "Order Management and Models"
Cohesion: 0.25
Nodes (3): DatabaseSeeder, Kulfi Wordmark on Mascara Packaging (vertical, stylized; uncertain reading), Mascara Product Photo (lavender and black tube with open wand on white background)

### Community 21 - "StyleCI Config"
Cohesion: 0.25
Nodes (7): css, not-name, js, php, disabled, finder, preset

### Community 24 - "Logo Brand Elements"
Cohesion: 0.50
Nodes (5): Burgundy and Rose Gold Brand Palette, Rose Gold Crown with Pink Gems Emblem, Rose Gold Lotus Ornament, QUEEN Beauty & Cosmetics Logo, QUEEN Beauty & Cosmetics Brand

### Community 25 - "Next.js Config"
Cohesion: 0.40
Nodes (3): apiIsLocal, apiUrl, nextConfig

### Community 26 - "Rose Perfume Image"
Cohesion: 0.50
Nodes (4): Floral Rose Product Styling (red roses and blossom on pink background), Fresh (brand), Fresh Rose Morning Eau de Parfum (100ml), Rose Morning Perfume Product Image

### Community 30 - "Promotions Flat-Lay Image"
Cohesion: 0.67
Nodes (3): Makeup Flat-Lay Composition (lipstick, eyeshadow palette, applicator, gold chains on grey stone), Exceptional Promotions Cosmetics Flat-Lay Image, Queen Exceptional Promotions Campaign

### Community 31 - "Perfume Offer Image"
Cohesion: 0.67
Nodes (3): Queen Perfume Offer Product Photo (Vera Wang), Queen Parfums Offer, Vera Wang Eau de Parfum Spray 100 ml

### Community 32 - "Vera Wang Product Photo"
Cohesion: 0.67
Nodes (3): Eau de Parfum Spray (3.4 FL OZ / 100 ml), Vera Wang (fragrance brand), Vera Wang Eau de Parfum 100 ml Product Photo

## Ambiguous Edges - Review These
- `Kulfi Wordmark on Mascara Packaging (vertical, stylized; uncertain reading)` → `Mascara Product Photo (lavender and black tube with open wand on white background)`  [AMBIGUOUS]
  backend-laravel/public/images/mascara-67b77147.webp · relation: references
- `OrderService` → `Order status workflow`  [AMBIGUOUS]
  README.md · relation: implements

## Knowledge Gaps
- **31 isolated node(s):** `Table publicites`, `Table reclamations`, `Kulfi Wordmark on Mascara Packaging (vertical, stylized; uncertain reading)`, `Burgundy and Rose Gold Brand Palette`, `Rose Gold Lotus Ornament` (+26 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 230 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TopBarController` connect `Middleware and API Resources` to `API Routes and Controllers`, `Middleware and API Resources`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `Table publicites`, `Table reclamations`, `Kulfi Wordmark on Mascara Packaging (vertical, stylized; uncertain reading)` to the rest of the system?**
  _31 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin and Staff Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.06270967741935483 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Admin and Staff Pages` to `Frontend Package Config`, `Storefront Catalogue Pages`, `Top Bars Admin and Root Layout`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `Composer Backend Config` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Kulfi Wordmark on Mascara Packaging (vertical, stylized; uncertain reading)` and `Mascara Product Photo (lavender and black tube with open wand on white background)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `OrderService` and `Order status workflow`?**
  _Edge tagged AMBIGUOUS (relation: implements) - confidence is low._