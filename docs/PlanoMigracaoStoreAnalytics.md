# Migração para Docker: store-analytics-dashboard

## 1. Visão Geral do Projeto
O projeto **Store Analytics Dashboard** é uma excelente escolha para migrar para Docker por causa da sua arquitetura em duas partes que precisam rodar simultaneamente:
- **Backend:** Python 3.11 (aplicação de bot / processamento de dados)
- **Frontend:** React + TypeScript usando Vite (Dashboard web)
- **Banco de Dados:** Supabase (externo, não precisa de container)

Atualmente, o repositório **já possui** um `Dockerfile` para o Backend, mas falta a peça chave para unir tudo: o Frontend e o orquestrador (`docker-compose`).

---

## 2. A Arquitetura Proposta com Docker

Para rodar esse projeto na sua máquina local com "apenas um clique", usaremos a seguinte estrutura:

### A) Backend (Python)
Vamos reutilizar o `Dockerfile` que já existe na raiz do projeto. Ele já faz o básico:
1. Usa a imagem `python:3.11-slim`
2. Instala os pacotes do `requirements.txt`
3. Roda o arquivo `bot.py`

### B) Frontend (React/Vite)
Vamos criar um `Dockerfile` específico para a pasta `frontend/`. 
Como você só precisa **servir** o painel em produção localmente, usaremos o método "Multi-stage build":
1. **Fase 1 (Build):** Usa uma imagem Node.js para rodar `npm install` e `npm run build` (gera a pasta estática `/dist`).
2. **Fase 2 (Serve):** Usa uma imagem do servidor **Nginx** (muito mais leve que o Node) apenas para hospedar os arquivos HTML/JS gerados.

### C) O Maestro (Docker Compose)
Criaremos um arquivo `docker-compose.yml` na raiz do projeto. Ele será o "maestro" que comanda a subida dos dois ambientes simultaneamente:

```yaml
version: '3.8'

services:
  # O Bot em Python
  backend:
    build: 
      context: .
      dockerfile: Dockerfile
    restart: always
    # Se precisar de variáveis de ambiente, colocaremos aqui

  # O Painel de Controle
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80" # Acessa via http://localhost vazio
    restart: always
```

---

## 3. Benefícios da Migração

- **Fim do "npm install" e "pip install":** Para rodar o projeto, você (ou qualquer membro do time) só vai precisar digitar `docker-compose up -d`. O Docker baixa o Node, o Python e as bibliotecas automaticamente.
- **Portabilidade:** Esse exato arquivo `docker-compose.yml` pode ser usado para subir a aplicação numa máquina virtual barata (DigitalOcean, AWS) sem precisar configurar o Nginx na mão.
- **Isolamento:** O Node do Frontend não vai conflitar com outras versões de Node que você tenha instaladas na máquina do Mint.

---

## 4. Próximos Passos (Plano de Ação)

Se você decidir aplicar essa migração no repositório, os passos técnicos serão:

1. Fazer o `git clone` do repositório para o seu Linux Mint.
2. Criar o arquivo `frontend/Dockerfile` com o build do Nginx.
3. Criar o `docker-compose.yml` na raiz.
4. Adicionar um `.dockerignore` para evitar que a pasta `node_modules` seja enviada para o container (deixando o build muito mais rápido).
5. Modificar as variáveis de ambiente (se o bot do Python usar chaves do Telegram/Supabase, elas deverão ser passadas através do arquivo `.env` para o Compose).
6. Fazer os testes subindo tudo na sua máquina.
