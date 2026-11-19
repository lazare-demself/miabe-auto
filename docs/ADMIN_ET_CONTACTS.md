# Accès administrateur et contact des professionnels

- Professionnels : création de compte sur `/register`, connexion sur `/login`.
- Administrateur : connexion séparée sur `/admin/login`. Un compte professionnel ne peut pas utiliser cette page.
- Premier administrateur : créer le compte avec `/register`, puis dans Neon SQL Editor exécuter `UPDATE users SET role = 'admin' WHERE email = 'votre-email@exemple.com';`. Seul l'email choisi est promu.
- Administration : créer et publier une fiche, modifier les coordonnées, publier/refuser/suspendre/remettre en attente, supprimer une fiche, attribuer une fiche revendiquée et traiter les signalements.
- Clients : aucune connexion client n'est demandée pour consulter l'annuaire.
- Contact : chaque fiche affiche un bouton d'appel. Le bouton WhatsApp utilise le numéro WhatsApp s'il est renseigné, sinon reprend le numéro de téléphone. Pour éviter les erreurs, enregistrer les numéros au format international, par exemple `+228XXXXXXXX`.
