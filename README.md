# Laravel + React (Vite) — Gestion d'emploi du temps

Projet monorepo combinant un backend Laravel (API) et un frontend React (Vite) pour gérer les groupes, modules, professeurs, salles et sessions de cours.


## Aperçu
- **Backend**: Laravel (API REST) dans `backend/`
- **Frontend**: React + TypeScript + Vite dans `src/` (app) et fichiers de config à la racine
- **Base de données**: SQLite par défaut (fichier `backend/database/database.sqlite`)


## Prérequis
- PHP 8.2+ et Composer
- Node.js 18+ et npm
- Git
- (Optionnel) XAMPP / Apache si vous servez Laravel via Apache. Sinon, `php artisan serve` suffit.


## Installation rapide
1) Cloner le dépôt

```bash
git clone <URL_DU_DEPOT> laravelReact
cd laravelReact
```

2) Installer les dépendances

- Backend (Laravel):
```bash
cd backend
composer install
```

- Frontend (React):
```bash
cd ..
npm install
```

3) Configuration des variables d'environnement (backend)

```bash
cd backend
cp .env.example .env
php artisan key:generate
```

Pour SQLite (par défaut), assurez-vous que le fichier `database/database.sqlite` existe. Sinon créez-le:
```bash
type NUL > database\database.sqlite  # Windows PowerShell
# ou
touch database/database.sqlite        # macOS/Linux
```

Vérifiez dans `backend/.env`:
```
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

4) Migrer et peupler la base
```bash
php artisan migrate --force
php artisan db:seed
```

5) Lancer les serveurs de dev
- Backend (Laravel):
```bash
php artisan serve
# Sert l'API sur http://127.0.0.1:8000
```

- Frontend (Vite):
```bash
cd ..
npm run dev
# Sert l'UI sur http://127.0.0.1:5173
```

Par défaut, le frontend consomme l'API sur `http://127.0.0.1:8000` (vérifiez `src/services/api.ts`).


## Publication sur GitHub (Windows PowerShell)
1) Initialiser Git (à la racine du projet)
```powershell
cd C:\xampp\htdocs\laravelReact
git init
git add .
git commit -m "Initial commit: Laravel + React timetable app"
```

2) Créer un dépôt vide sur GitHub (via l'UI GitHub) puis relier le remote
```powershell
# Remplacez par votre URL distante
$remote = "https://github.com/<votre-compte>/<nom-du-depot>.git"
git branch -M main
git remote add origin $remote
git push -u origin main
```

Alternative (si vous avez l'outil `gh`):
```powershell
gh repo create <nom-du-depot> --source . --private --push
```


## Scripts utiles
- Frontend
  - `npm run dev` — démarre Vite en mode dev
  - `npm run build` — build de production du frontend
  - `npm run preview` — prévisualisation du build

- Backend (dans `backend/`)
  - `php artisan serve` — sert l'API localement
  - `php artisan migrate` / `php artisan db:seed` — gestion BDD


## Structure du projet (extrait)
```
laravelReact/
  backend/
    app/                # Code Laravel (Models, Controllers, ...)
    database/           # Migrations, seeders, SQLite
    routes/             # routes api.php / web.php
    public/             # index.php Laravel
  src/                  # Code React + TypeScript (pages, composants, services)
  index.html            # Entrée Vite
  package.json          # Scripts front
  vite.config.ts        # Config Vite
```


## Configuration
- API base URL: vérifiez `src/services/api.ts` si vous changez l'hôte/port Laravel
- Authentification: regardez `backend/config/auth.php` et `backend/app/Models/User.php`
- Données de démonstration: seeders situés dans `backend/database/seeders`


## Déploiement (aperçu)
- Backend: déployer Laravel (Apache/Nginx + PHP-FPM) et exécuter `composer install`, `php artisan migrate --force`.
- Frontend: exécuter `npm run build` puis publier les fichiers de `dist/` derrière un CDN/serveur statique.
- Configurer la variable d'environnement front (si nécessaire) pour l'URL de l'API.


## Licence
Indiquez ici la licence souhaitée (MIT, etc.).


