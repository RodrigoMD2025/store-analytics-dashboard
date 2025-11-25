# 📊 Dashboard de Análise e Monitoramento - Music Delivery

Sistema completo para monitoramento de lojas, players Music Delivery e coleta de dados com bot interativo no Telegram. O projeto combina backend em Python, automação com GitHub Actions, bot hospedado na Railway e **dashboard web React** para visualização de dados em tempo real.

## 🚀 Funcionalidades Principais

### Backend e Automação
- 🤖 **Bot Interativo (Telegram):** Acione a coleta de dados e receba relatórios sob demanda
- ⌛ **Coleta de Dados Contínua:** Sistema roda automaticamente a cada hora
- ☁️ **Deploy Moderno:** Infraestrutura containerizada com Docker na Railway
- 📈 **Análise e Armazenamento:** Dados processados e armazenados no Supabase
- 🔔 **Notificações Inteligentes:** Balanço diário e relatórios sob demanda

### Dashboard Web (NOVO! 🎉)
- 🖥️ **Interface Moderna:** Dashboard React com TypeScript e Tailwind CSS
- 📊 **Visualização de Dados:** Gráficos interativos e tabelas dinâmicas
- 🎯 **Monitoramento de Players:** Integração completa com Music Delivery Player
- 🔍 **Detalhes do Player:** Página dedicada com informações completas de sincronização
- 🌓 **Modo Escuro/Claro:** Alternância de tema com persistência
- 📱 **Responsivo:** Interface adaptativa para desktop e mobile
- ⚡ **Navegação Intuitiva:** Click no Player ID abre detalhes completos

## 🏗️ Arquitetura e Funcionamento

### Coleta de Dados (Backend)

O sistema opera de duas formas principais:

1.  **Execução Agendada (a cada hora):**
    *   Workflow do **GitHub Actions** (`scrape.yml`) executado automaticamente
    *   Script `client_monitor_supabase.py` coleta e salva dados no **Supabase**
    *   Às 23h, relatório consolidado é enviado para o **Telegram**

2.  **Execução Manual (via Telegram):**
    *   Comando `/mdonline` enviado ao bot
    *   Bot na **Railway** (`bot.py`) dispara o workflow via API
    *   Relatório enviado imediatamente após a coleta

### Dashboard Frontend (NOVO!)

O dashboard web permite visualização e monitoramento em tempo real:

- **Página Principal (`/`)**:
  - Overview geral com métricas de lojas
  - Gráficos de sincronização
  - Tabela de lojas com status
  - **Link direto** no Player ID para detalhes

- **Detalhes do Player (`/player/:uid`)**:
  - Métricas de sincronização (Music e Sazonal)
  - Status da playlist (Sincronizada/Atrasada)
  - Total de spots ativos
  - **Lista completa** de arquivos por pasta:
    - 📁 Playlist Principal (music)
    - 📅 Pasta Sazonal
    - 📻 Pasta Spots
  - Informações do sistema (UID, CNPJ formatado, arquivos faltantes)

- **Execuções Diárias (`/daily-executions`)**:
  - Histórico de execuções
  - Logs detalhados

### Estrutura de Arquivos

```
store-analytics-dashboard/
├── frontend/                      # Dashboard React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/         # Componentes do dashboard
│   │   │   ├── players/           # Componentes de players (NOVO)
│   │   │   └── ui/                # Componentes UI (shadcn/ui)
│   │   ├── hooks/
│   │   │   ├── useDashboardData.ts
│   │   │   ├── usePlayerMonitoring.ts
│   │   │   └── usePlayerDetails.ts  # (NOVO)
│   │   ├── pages/
│   │   │   ├── Index.tsx           # Página principal
│   │   │   ├── PlayerDetails.tsx    # Detalhes do player (NOVO)
│   │   │   └── DailyExecutions.tsx
│   │   ├── integrations/supabase/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── client_monitor_supabase.py   # Script de coleta
│   ├── bot.py                      # Bot Telegram
│   └── requirements.txt
├── .github/workflows/
│   └── scrape.yml                  # Workflow de coleta
├── Dockerfile
└── README.md
```

---

## 🛠️ Stack Tecnológica

### **Backend & Automação**
- **Python 3.11+** para processamento de dados e bot
- **Playwright** para web scraping automatizado
- **Pandas** para análise e manipulação de dados
- **Docker** para containerização
- **GitHub Actions** para CI/CD e automação

### **Infraestrutura**
- **Railway** para hospedagem do bot (Long Polling)
- **Supabase** como banco de dados (PostgreSQL) e backend
- **GitHub Pages** para hospedagem do dashboard (produção)

### **Frontend (Dashboard)**
- **React 18** com **TypeScript**
- **Vite** para desenvolvimento rápido
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes de UI
- **Recharts** para gráficos e visualizações
- **React Router** para navegação
- **React Query** para gerenciamento de dados
- **date-fns** para formatação de datas

---

## ⚙️ Instalação e Configuração

### **Pré-requisitos**

- Conta no GitHub
- Conta na [Railway](https://railway.app/)
- Conta no [Supabase](https://supabase.com/)
- Bot do Telegram (via [BotFather](https://t.me/botfather))
- Node.js 18+ e Python 3.11+ instalados localmente

### **1. Variáveis de Ambiente**

#### Backend & Bot
- `TELEGRAM_BOT_TOKEN`: Token do bot (BotFather)
- `AUTHORIZED_CHAT_ID`: ID do chat no Telegram
- `GITHUB_TOKEN`: Personal Access Token com permissão `repo`
- `SUPABASE_URL`: URL do projeto Supabase
- `SUPABASE_KEY`: Chave `service_role` do Supabase

#### Frontend (Dashboard)
Crie `.env.local` na pasta `frontend/`:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_publica_anon_supabase
```

### **2. Estrutura do Banco de Dados (Supabase)**

O sistema utiliza as seguintes tabelas:

- **`lojas_dados`**: Informações das lojas cadastradas
- **`monitoring_status`**: Status de sincronização dos players
- **`music_files`**: Arquivos de música por pasta (music, sazonal, spots)
- **`clientes`**: Dados dos clientes
- **`execucoes`**: Histórico de execuções
- **`logs_execucao`**: Logs detalhados

### **3. Configuração do GitHub Secrets**

No repositório GitHub, vá em `Settings > Secrets and variables > Actions`:

- `SUPABASE_URL`
- `SUPABASE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `ADMIN_CHAT_ID`

### **4. Deploy do Bot na Railway**

1. Crie projeto a partir do repositório GitHub
2. Adicione variáveis na aba **"Variables"**
3. Deixe **"Start Command"** vazio (usa Dockerfile)
4. Deploy automático

### **5. Configuração do Telegram**

Remova webhooks existentes:
```
https://api.telegram.org/bot<SEU_TOKEN>/setWebhook?url=
```

---

## 🚀 Execução Local

### **Backend**

```bash
cd backend

# Ambiente virtual
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows

# Dependências
pip install -r requirements.txt

# Execute o bot
python bot.py
```

### **Frontend**

```bash
cd frontend

# Dependências
npm install

# Desenvolvimento
npm run dev

# Produção (build)
npm run build

# Preview da build
npm run preview
```

Acesse: `http://localhost:8080`

---

## 🌐 Deploy do Dashboard (GitHub Pages)

### **Configuração do Vite**

O `vite.config.ts` já está configurado para GitHub Pages:

```typescript
export default defineConfig({
  base: '/store-analytics-dashboard/',  // Nome do seu repositório
  // ...
});
```

### **Deploy Automático**

1. **Commit e Push:**
   ```bash
   git add .
   git commit -m "chore: deploy dashboard to GitHub Pages"
   git push origin main
   ```

2. **Configurar GitHub Pages:**
   - Vá em `Settings > Pages`
   - Source: `GitHub Actions`
   - O workflow `.github/workflows/deploy.yml` fará o deploy automaticamente

3. **Acesse:**
   ```
   https://[SEU-USUARIO].github.io/store-analytics-dashboard/
   ```

### **Build Manual**

```bash
cd frontend
npm run build
# Arquivos gerados em: frontend/dist/
```

---

## 📋 Como Usar

### **Bot Telegram**
- **Monitoramento Automático:** A cada hora
- **Relatório Manual:** `/mdonline` a qualquer momento
- **Relatório Diário:** Às 23h automaticamente

### **Dashboard Web**
1. **Acesse** o dashboard (local ou GitHub Pages)
2. **Página Principal:**
   - Visualize métricas gerais
   - Veja tabela de lojas
   - Clique no **Player ID** (botão com ícone de monitor)
3. **Detalhes do Player:**
   - Métricas de sincronização
   - Status da playlist
   - Lista completa de arquivos
   - Informações do sistema
4. **Tema:**
   - Clique no ícone Lua/Sol para alternar modo claro/escuro

---

## 🎨 Funcionalidades do Dashboard

### **Integração Music Delivery Player**

O dashboard se integra completamente com o Music Delivery Player:

- ✅ Monitoramento em tempo real de sincronização
- ✅ Status Music, Sazonal e Spots
- ✅ Lista completa de arquivos (sem limite)
- ✅ CNPJ formatado (XX.XXX.XXX/YYYY-ZZ)
- ✅ Arquivos faltantes com texto (N Faixa/Faixas)
- ✅ Status consistente (Sincronizada/Atrasada)
- ✅ Navegação por UUID completo

### **Navegação**

- **`/`** - Dashboard principal
- **`/player/:uid`** - Detalhes do player específico
- **`/daily-executions`** - Histórico de execuções

### **Tema Escuro/Claro**

- Detecta preferência do sistema automaticamente
- Salva preferência do usuário (localStorage)
- Funciona em todas as páginas

---

## 🔧 Manutenção

### **Atualizar Dependências**

```bash
# Backend
cd backend
pip install --upgrade -r requirements.txt

# Frontend
cd frontend
npm update
```

### **Verificar Logs**

- **Railway:** Logs do bot em tempo real
- **GitHub Actions:** Logs de execução dos workflows
- **Supabase:** Queries e dados no painel

---

## 📝 Notas Importantes

1. **Credenciais Supabase:** As chaves estão hardcoded no `frontend/src/integrations/supabase/client.ts` (apenas chave pública ANON)
2. **RLS (Row Level Security):** Configure políticas adequadas no Supabase para segurança
3. **Limitações GitHub Pages:** Deploy estático, sem backend
4. **Dados em Tempo Real:** Dashboard busca dados diretamente do Supabase

---

## 📄 Licença

Este projeto é privado e de uso interno.

---

**Desenvolvido com ❤️ para Music Delivery**
