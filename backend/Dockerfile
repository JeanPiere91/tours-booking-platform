FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production \
    PORT=5000

# Install only production deps. Use npm ci for reproducible builds.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy the application source after deps to maximise layer cache hits.
COPY src ./src

# Drop privileges — the base image ships a built-in "node" user.
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/health > /dev/null || exit 1

CMD ["node", "src/server.js"]
