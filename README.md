# Miabe Auto — application web mobile-first

Plateforme d'annuaire géolocalisé pour garages, ateliers et magasins de pièces détachées. Cette version remplace la dépendance Supabase de l'archive initiale par **Neon PostgreSQL + PostGIS**, sessions JWT HTTP-only, Cloudinary, Leaflet et Next.js.

## Fonctionnalités présentes

- Annuaire public consultable sans compte, recherche texte, filtre garage/magasin, filtre spécialité/produit.
- Géolocalisation volontaire et recherche dans un rayon réglable (1 à 25 km), défaut 5 km autour de Lomé si aucune position n'est fournie.
- Carte Leaflet / OpenStreetMap et liste synchronisées ; marqueurs uniquement si coordonnées disponibles.
- Fiches établissement, bouton d'appel et bouton WhatsApp (utilise le numéro WhatsApp renseigné, ou le téléphone en solution de repli), itinéraire et catalogue de produits avec stock déclaré et date de mise à jour.
- Création de compte professionnel et connexion dédiée aux professionnels (`/login`), session signée et cookie HTTP-only. Les clients consultent l'annuaire sans compte ni écran de connexion.
- Soumission de fiches avec statut en attente ; tableau de bord et gestion de disponibilité des produits.
- Connexion administrateur séparée (`/admin/login`) et console admin : création, modification, publication, refus, suspension et suppression des fiches, traitement des revendications et clôture des signalements, avec journal d'audit.
- Signalement d'une fiche par un utilisateur connecté.
- Images envoyées directement à Cloudinary via signature créée côté serveur ; limite client de 5 Mo.
- Métadonnées PWA pour installation depuis un navigateur compatible ; responsive téléphone/tablette/ordinateur.
- Crédit demandé dans le footer : **Développé par FAYA Lazare**.

## Stack

- Next.js 15 / React 19 / TypeScript / Tailwind CSS
- Neon PostgreSQL Serverless et PostGIS
- Auth maison minimale : bcrypt + JWT signé `jose`, cookie HTTP-only/SameSite
- Cloudinary pour les médias
- Leaflet + tuiles OpenStreetMap
- Render pour l'hébergement Node, GitHub pour le dépôt

## Installation locale

Prérequis : Node.js 20.19+ et npm.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Renseigner les variables de `.env.local` :

- `DATABASE_URL` : chaîne de connexion Neon (SSL requis, URL pooled recommandée).
- `AUTH_SECRET` : secret aléatoire long, au moins 32 caractères.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- `NEXT_PUBLIC_APP_URL` : origine publique du site.

## Initialiser Neon

1. Créer un projet Neon et activer l'extension PostGIS si elle n'est pas déjà disponible.
2. Ouvrir le SQL Editor Neon.
3. Exécuter intégralement `db/migrations/0001_init.sql`.
4. Créer un compte depuis `/register`.
5. Promouvoir le premier administrateur manuellement dans Neon SQL Editor :

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@exemple.com';
```

Ensuite, connecte-toi sur `/admin/login` avec exactement les mêmes identifiants. L'écran `/login` est réservé aux professionnels. Les visiteurs/clients n'ont pas besoin de compte pour rechercher et contacter les garages. Ne jamais ajouter un champ de choix du rôle admin à l'inscription publique.

## Cloudinary

Créer un compte Cloudinary, récupérer les trois valeurs API et les définir dans l'environnement Render. La clé secrète n'est jamais exposée au navigateur. Les images sont stockées dans le dossier `miabe-auto`.

## Déploiement Render + GitHub

1. Pousser le dossier du projet dans un dépôt GitHub privé ou public.
2. Dans Render, créer un **Web Service** depuis le dépôt, runtime Node.
3. Build command : `npm ci && npm run build` ; Start command : `npm run start`.
4. Ajouter les variables d'environnement Neon et Cloudinary, puis définir `NEXT_PUBLIC_APP_URL` sur l'URL Render.
5. Déployer et vérifier `/`, `/register`, `/login`, `/dashboard`, `/admin` et une fiche établissement.
6. Configurer un domaine personnalisé et HTTPS si nécessaire.

Le fichier `render.yaml` fournit une configuration Blueprint de départ. Les variables marquées `sync:false` doivent être saisies dans Render.

## iOS et Android

Le site est une PWA installable : Android via « Installer l'application » dans le navigateur ; iOS via Safari > Partager > Sur l'écran d'accueil. Cette livraison n'est pas un binaire natif signé et publié dans les stores.

Pour une enveloppe native Capacitor, remplacer `VOTRE-DOMAINE-RENDER` dans `capacitor.config.ts` par le domaine HTTPS réel, puis exécuter `npx cap add android`, `npx cap add ios`, `npx cap sync`, `npx cap open android` ou `npx cap open ios`. Le WebView charge le site hébergé (les Server Actions Next.js restent côté serveur). La publication demande des comptes développeur Apple/Google, certificats, tests sur appareils et validation des stores. Un simple WebView peut être refusé par les stores s'il n'apporte pas une expérience mobile suffisamment spécifique : prévoir des fonctionnalités natives réelles avant soumission.

## Commandes de contrôle

```bash
npm run typecheck
npm run build
npm start
```

## Limites connues / travaux nécessaires avant lancement public

- La récupération de mot de passe, confirmation d'email, vérification de téléphone, CAPTCHA/rate limiting et alertes email ne sont pas intégrés.
- Les formulaires de modération sont fonctionnels, mais il faut ajouter une procédure d'exploitation pour vérifier les justificatifs de revendication et fermer les signalements.
- La gestion des horaires, avis clients, rendez-vous, paiements, notifications push et statistiques professionnelles avancées reste hors du MVP initial du cahier des charges.
- La disponibilité des pièces est une déclaration du vendeur, jamais une garantie de stock en temps réel.
- La géolocalisation dépend du consentement du navigateur ; si elle est refusée, la recherche textuelle/quartier reste disponible. Les tuiles OpenStreetMap ont des conditions d'utilisation et des limites de capacité : choisir un fournisseur de tuiles adapté à la fréquentation prévue avant montée en charge.
- La recherche par proximité est effectuée en PostGIS. Les établissements sans latitude/longitude apparaissent dans la liste sans marqueur.
- Prévoir sauvegardes Neon, surveillance des erreurs, politique de confidentialité, conditions d'utilisation et tests de sécurité avant de collecter des données réelles.

## Structure

- `app/` pages, Server Actions et API
- `components/` annuaire, carte et upload Cloudinary
- `lib/` connexion Neon, sessions et validation
- `db/migrations/` schéma Postgres/PostGIS
- `public/manifest.webmanifest` métadonnées PWA
- `render.yaml` configuration de déploiement
- `docs/` cahier des charges fourni dans l'archive
