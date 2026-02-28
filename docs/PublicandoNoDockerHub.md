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
Entramos na pasta onde fica o Dockerfile do frontend e rodamos:
```bash
docker build -t melosystem/store-dashboard-frontend:v1 ./frontend
```
> O `-t` significa "tag" (nome e versão). O `./frontend` é o diretório onde está o Dockerfile.

**Para o nosso Backend:**
Lemos o Dockerfile que estava na raiz do projeto (`.`) e rodamos:
```bash
docker build -t melosystem/store-dashboard-backend:v1 .
```

---

## 3. O Envio (Push) para a Nuvem

Assim como no Git nós fazemos `git push` para enviar o código para o GitHub, no Docker nós usamos `docker push` para enviar o Container montado para o Docker Hub.

**Comandos que rodamos:**
```bash
docker push melosystem/store-dashboard-frontend:v1
```
```bash
docker push melosystem/store-dashboard-backend:v1
```

*O que ele faz:* O Docker analisa as "camadas" da sua imagem. Se alguma camada já existir no Docker Hub (como o sistema Ubuntu ou Python base), ele não envia de novo, economizando tempo e internet. Ele só envia o seu código novo enlatado.

---

## 4. O Resultado: Como consumir a imagem?

Isso é o que torna o Docker maravilhoso. Agora que a imagem está no Docker Hub, você ou qualquer pessoa que tenha permissão pode rodar esse exato projeto **em qualquer computador do mundo** sem precisar baixar o GitHub, instalar Node, NPM, Python ou PIP.

**Como subir em um servidor novo usando o Terminal:**

```bash
# Sobe o servidor web do painel (Nginx) na porta 8080 do servidor
docker run -d -p 8080:80 melosystem/store-dashboard-frontend:v1

# Sobe o bot do backend rodando em segundo plano (detached)
docker run -d melosystem/store-dashboard-backend:v1
```

*(O Docker vai olhar na máquina, ver que não tem a imagem localmente, fará o download daquela versão pesada lá do Docker Hub automaticamente, e rodará o sistema em segundos!)*
