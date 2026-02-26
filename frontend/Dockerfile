# Fase 1: Build da aplicação React
# Usamos uma imagem Node leve para compilar o código
FROM node:20-alpine AS builder

# Configurar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência primeiro (otimiza o cache do Docker)
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm install

# Copiar o resto do código do frontend
COPY . .

# Injetar variável para forçar o base do React a ser a raiz "/"
ENV VITE_BASE_PATH=/
# Fazer o build de produção (gera a pasta /app/dist)
RUN npm run build


# Fase 2: Servidor Web (Nginx)
# Usamos o Nginx Alpine por ser extremamente leve e rápido para servir arquivos estáticos
FROM nginx:alpine

# Opcional: Remover página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar os arquivos gerados no "builder" para a pasta pública do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Mudar configuração do Nginx para suportar React Router (SPA)
# Se o Nginx não achar a rota, redireciona para o index.html
RUN echo "server { \
    listen 80; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files \$uri \$uri/ /index.html; \
    } \
    }" > /etc/nginx/conf.d/default.conf

# Documentar porta
EXPOSE 80

# Iniciar o Nginx no primeiro plano
CMD ["nginx", "-g", "daemon off;"]
