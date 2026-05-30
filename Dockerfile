FROM node:22-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código
COPY . .

# Build do Vite
RUN npm run build

# Expor porta
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV WHATSAPP_NUMBER=5561993629392
ENV INFINITEPAY_HANDLE=capitalqueen

# Comando para iniciar
CMD ["node", "server.js"]
