FROM node:20-alpine

WORKDIR /app

# Installe les dépendances en cache
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copie le code
COPY . .

# Sécurité : utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S luxeo -u 1001 && \
    chown -R luxeo:nodejs /app
USER luxeo

EXPOSE 3000

# Healthcheck pour Coolify
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -q -O - http://127.0.0.1:3000/health || exit 1

CMD ["node", "server.js"]
