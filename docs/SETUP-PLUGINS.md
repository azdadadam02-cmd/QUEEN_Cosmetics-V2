# Setup Claude Code sur un autre PC

Les plugins/skills sont installés **par utilisateur** (dans `C:\Users\<toi>\.claude\`), pas dans le projet.
Sur un autre PC il faut les réinstaller. Seul `.mcp.json` (Context7 + Playwright) vient avec le repo.

Repo : https://github.com/azdadadam02-cmd/QUEEN_Cosmetics-V2 (branche de travail : `fix/hydration-and-toasts`, main : `main`)

## 1. Plugins (à lancer dans Claude Code)

| Plugin | Rôle | Commandes |
|---|---|---|
| superpowers (officiel) | brainstorming, plans, TDD, debug, review | `/plugin install superpowers@claude-plugins-official` |
| ponytail | mode "dev paresseux": plus petit changement, `/ponytail-audit`, `/ponytail-review` | `/plugin marketplace add DietrichGebert/ponytail` puis `/plugin install ponytail@ponytail` |
| understand-anything v2.7.3 | graphe de connaissance du code (`/understand`, `/understand-chat`, `/understand-dashboard`...) | `/plugin marketplace add https://github.com/Egonex-AI/Understand-Anything.git#v2.7.3` puis `/plugin install understand-anything@understand-anything` |
| claude-mem (désactivé chez moi) | mémoire entre sessions | `/plugin marketplace add thedotmack/claude-mem` puis `/plugin install claude-mem@thedotmack` |

Si `/plugin` ne marche pas dans PowerShell, utiliser la CLI : `claude plugin marketplace add <source>` puis `claude plugin install <plugin>@<marketplace>`.
La source du marketplace doit être **exactement** celle ci-dessus (même URL, même `#v2.7.3`).

Plugins activés dans `~/.claude/settings.json` : superpowers, ponytail, understand-anything (claude-mem = false).

## 2. Skill graphify (hors plugin)

```bash
pip install graphifyy
graphify install
```
Puis `/graphify` dans Claude Code. (Il est aussi cité dans `~/.claude/CLAUDE.md`.)

## 3. MCP (déjà dans `.mcp.json`)

- **context7** (docs des libs) : http `https://mcp.context7.com/mcp`
- **playwright** (vérification visuelle du site) : `npx -y @playwright/mcp@0.0.84`

Ils se chargent dans une **nouvelle session**, après approbation. Aucun secret dedans.

## 4. Outils à avoir

Node + npm (frontend), PHP 8.2+ / Composer / XAMPP MySQL (backend), pnpm 12 (pour understand-anything), Python (graphify).

## 5. Lancer le projet

```bash
cd backend-laravel && cp .env.example .env && composer install && php artisan key:generate && php artisan migrate --seed
php artisan serve              # http://localhost:8000
cd ../frontend-nextjs && npm install && npm run dev   # http://localhost:3000
```
`.env` et `.env.local` ne sont pas dans git : à recréer (DB `queen_db`, `SEED_PASSWORD`, `NEXT_PUBLIC_API_URL`).

## 6. D'où vient le projet / où est quoi

- Dépôt git : `origin` = repo ci-dessus. Dossier local d'origine : `C:\xampp\htdocs\QUEEN_Cosmetics-V2`.
- Backend `backend-laravel/` (API Laravel 12) · Frontend `frontend-nextjs/` (Next.js 16).
- Guide complet en arabe : `docs/QUEEN-guide-ar.pdf`.
- Mémoire Claude de ce projet (préférence : répondre en Darija, lettres latines) : `~/.claude/projects/C--xampp-htdocs-QUEEN-Cosmetics-V2/memory/` — locale à ce PC, à recréer si besoin.
- Pas encore lancé : `/understand` (coûteux en tokens). Si lancé : utiliser `.understandignore`, commencer par `backend-laravel/app`.
