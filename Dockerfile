# Utilise une image node officielle

FROM node:18-alpine
# Définit le répertoire de travail dans le conteneur

WORKDIR /app

# Copie le package.json et le package-lock.json dans le répertoire de travail
COPY package*.json ./
# Installe les dépendances
RUN npm ci --only=production

# Copie le reste de l'application dans le répertoire de travail
COPY . .

# Expose le port sur lequel l'application écoute
EXPOSE 3000

# Définit la commande à exécuter lorsque le conteneur démarre
CMD ["node", "app.js"]