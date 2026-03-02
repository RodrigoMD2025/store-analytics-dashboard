# Guia Completo: Publicando Imagens no Docker Hub

Este documento é um guia de referência rápida contendo exatamente os comandos que utilizamos para empacotar o nosso projeto e enviá-lo para a nuvem pública do Docker Hub.

---

## 1. Login no Docker Hub pelo Terminal

Antes de tentar enviar (*push*) qualquer imagem, você precisa provar para o Docker Hub que você é o dono da conta.

**Comando:**
```bash
docker login
```
*O que ele faz:* Pede seu nome de usuário (ex: `melosystem`) e sua senha. Depois disso, ele guarda um token temporário no seu computador para permitir os envios.

---

## 2. Construção (Build) com Tag Correta

Para que o Docker entenda que uma imagem pertence à sua conta no Docker Hub, você **precisa** obrigatoriamente construir a imagem (*build*) colocando o seu nome de usuário antes do nome do projeto.

A estrutura é: `usuario/nome-da-imagem:versao`

**Para o nosso Frontend:**
```bash
docker build -t melosystem/store-dashboard-frontend:v2 -t melosystem/store-dashboard-frontend:latest ./frontend
```

**Para o nosso Backend:**
```bash
docker build -t melosystem/store-dashboard-backend:v2 -t melosystem/store-dashboard-backend:latest .
```

> **Dica:** O `-t` significa "tag" (nome e versão). Você pode passar **múltiplos `-t`** no mesmo comando para marcar a imagem com mais de uma versão simultaneamente!

---

## 3. Versionamento de Imagens

Usar tags de versão é fundamental para manter o controle do que está rodando em cada ambiente.

### Regras de Ouro:

| Tag | Quando usar | Exemplo |
|-----|-------------|---------|
| `:v1`, `:v2`, `:v3`... | Cada nova release do projeto | `melosystem/store-dashboard-frontend:v2` |
| `:latest` | Sempre aponta para a versão mais recente | `melosystem/store-dashboard-frontend:latest` |

### Histórico de Versões deste Projeto:

| Versão | Data | O que mudou |
|--------|------|-------------|
| `v1` | 2026-02-26 | Primeira versão funcional com Docker |
| `v2` | 2026-03-02 | Migração para Supabase Publishable API Key (segurança) |

### O que acontece ao usar a mesma tag?
Se você fizer `docker push` com uma tag que já existe (ex: `:v2`), ela **sobrescreve** a anterior automaticamente. Não precisa remover nada manualmente.

Se usar uma tag **nova** (ex: `:v3`), ela é criada ao lado das anteriores. Todas coexistem no Docker Hub.

---

## 4. O Envio (Push) para a Nuvem

Assim como no Git nós fazemos `git push` para enviar o código para o GitHub, no Docker nós usamos `docker push` para enviar o Container montado para o Docker Hub.

**Comandos para enviar todas as tags:**
```bash
# Frontend
docker push melosystem/store-dashboard-frontend:v2
docker push melosystem/store-dashboard-frontend:latest

# Backend
docker push melosystem/store-dashboard-backend:v2
docker push melosystem/store-dashboard-backend:latest
```

*O que ele faz:* O Docker analisa as "camadas" da sua imagem. Se alguma camada já existir no Docker Hub (como o sistema Ubuntu ou Python base), ele mostra `Layer already exists` e não envia de novo, economizando tempo e internet. Ele só envia o seu código novo enlatado.

---

## 5. O Resultado: Como consumir a imagem?

Isso é o que torna o Docker maravilhoso. Agora que a imagem está no Docker Hub, você ou qualquer pessoa que tenha permissão pode rodar esse exato projeto **em qualquer computador do mundo** sem precisar baixar o GitHub, instalar Node, NPM, Python ou PIP.

**Como subir em um servidor novo usando o Terminal:**

```bash
# Sobe a versão mais recente (latest) automaticamente
docker run -d -p 8080:80 melosystem/store-dashboard-frontend
docker run -d melosystem/store-dashboard-backend

# Ou especificar uma versão exata
docker run -d -p 8080:80 melosystem/store-dashboard-frontend:v2
docker run -d melosystem/store-dashboard-backend:v2
```

*(O Docker vai olhar na máquina, ver que não tem a imagem localmente, fará o download daquela versão pesada lá do Docker Hub automaticamente, e rodará o sistema em segundos!)*

---

## 6. Fluxo Completo para Futuras Atualizações

Quando você alterar o código no futuro e quiser publicar uma nova versão, siga este roteiro:

```bash
# 1. Avance a versão no build
docker build -t melosystem/store-dashboard-frontend:v3 -t melosystem/store-dashboard-frontend:latest ./frontend

# 2. Envie para o Docker Hub
docker push melosystem/store-dashboard-frontend:v3
docker push melosystem/store-dashboard-frontend:latest

# 3. No servidor de produção, atualize o container
docker stop store_dashboard_frontend
docker rm store_dashboard_frontend
docker pull melosystem/store-dashboard-frontend:latest
docker run -d -p 8080:80 --name store_dashboard_frontend melosystem/store-dashboard-frontend:latest
```

> **Resumo:** Código-fonte (receita) → **GitHub**. Imagem pronta (bolo assado) → **Docker Hub**.
