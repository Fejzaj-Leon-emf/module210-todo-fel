# Étape 1 : Utiliser une image de base officielle Node.js
FROM node:16-alpine

# Étape 2 : Créer et définir le répertoire de travail
WORKDIR /usr/src/app

# Étape 3 : Copier package.json et package-lock.json (si disponible)
# Ceci permet d'installer les dépendances sans copier tous les fichiers
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install --production

# Étape 5 : Copier tout le reste du code dans le conteneur
COPY . .

# Étape 6 : Exposer le port sur lequel le serveur écoute (par exemple 3000 pour Node.js)
EXPOSE 3000

# Étape 7 : Démarrer l'application (si tu utilises Node.js)
CMD ["npm", "start"]
