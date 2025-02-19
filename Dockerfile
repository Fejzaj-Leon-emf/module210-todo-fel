# Utiliser une image Node.js officielle comme image de base
FROM node:16

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /usr/src/app

# Copier package.json et package-lock.json (si disponible)
COPY package*.json ./

# Nettoyer le cache npm et installer les dépendances
RUN npm cache clean --force && npm install --verbose

# Copier le reste des fichiers de l'application dans le conteneur
COPY . .

# Exposer le port utilisé par l'application
EXPOSE 8080

# Démarrer l'application
CMD [ "npm", "start" ]
