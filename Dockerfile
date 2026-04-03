FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY server/ ./server/
RUN npm install -g tsx
EXPOSE 3001
CMD ["tsx", "server/cursor-server.ts"]