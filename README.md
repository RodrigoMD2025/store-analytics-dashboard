# 📊 Dashboard de Análise e Monitoramento - Music Delivery

Sistema completo para monitoramento de lojas, players Music Delivery e coleta de dados com bot interativo no Telegram. O projeto combina backend em Python, automação com GitHub Actions, bot hospedado na Railway e **dashboard web React** para visualização de dados em tempo real.

## 🚀 Funcionalidades Principais

### Backend e Automação
- 🤖 **Bot Interativo (Telegram):** Acione a coleta de dados e receba relatórios sob demanda
- ⌛ **Coleta de Dados Contínua:** Sistema roda automaticamente a cada 30 minutos
- ☁️ **Deploy Moderno:** Infraestrutura containerizada com Docker na Railway
- 📈 **Análise e Armazenamento:** Dados processados e armazenados no Supabase
- 🔔 **Notificações Inteligentes:** Balanço diário e relatórios sob demanda

### Dashboard Web (NOVO! 🎉)
- 🖥️ **Interface Moderna:** Dashboard React com TypeScript e Tailwind CSS
- 📊 **Visualização de Dados:** Gráficos interativos e tabelas dinâmicas
- 🎯 **Monitoramento de Players:** Integração completa com Music Delivery Player
- 🔍 **Detalhes do Player:** Página dedicada com informações completas de sincronização
- 🌓 **Modo Escuro/Claro:** Alternância de tema com persistência (melhorado!)
- 📱 **Responsivo:** Interface adaptativa para desktop e mobile
- ⚡ **Navegação Intuitiva:** Click no Player ID abre detalhes completos
- 🔎 **Busca Inteligente:** Filtro em tempo real na tabela de clientes
- 📄 **Paginação Automática:** Ativa quando > 50 clientes para melhor performance
- 📥 **Exportação CSV:** Exporte resumos por cliente ou detalhes de lojas individuais

#### **Novas Funcionalidades da Tabela** (Nov 2024)

**Vista de Resumo por Cliente:**
- Tabela agregada quando nenhum filtro está ativo
- Mostra: Total de Lojas | Sincronizadas | Atrasadas | Taxa de Sucesso
- Ordenação automática por número de lojas
- Click na linha filtra para aquele cliente

**Busca e Filtro:**
- Campo de busca em tempo real
- Contador dinâmico de resultados
- Reset automático de paginação ao buscar

**Paginação Inteligente:**
- Ativa automaticamente quando > 50 clientes
- 20 itens por página
- Controles: Primeira | Anterior | Próxima | Última
- Indicador: "Mostrando X-Y de Z clientes"

**Exportação CSV:**
- **Resumo Geral:** Exporta tabela de clientes com estatísticas
  - Arquivo: `resumo-clientes-YYYY-MM-DD.csv`
- **Detalhes por Cliente:** Exporta lojas individuais quando filtrado
  - Arquivo: `detalhes-lojas-{cliente}-YYYY-MM-DD.csv`
- UTF-8 BOM para compatibilidade com Excel
- Dados formatados com aspas para campos complexos

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
  - **Tabela de Resumo:** Vista agregada por cliente (padrão)
    - Busca em tempo real
    - Paginação automática (>50 clientes)
    - Exportação CSV do resumo
  - **Tabela Detalhada:** Lojas individuais quando cliente selecionado
    - Exportação CSV das lojas
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
│   │   │   │   ├── ClienteSummaryTable.tsx  # Tabela de resumo (NOVO)
│   │   │   │   ├── LojasTable.tsx           # Tabela de detalhes
│   │   │   │   └── ...
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
- **Monitoramento Automático:** A cada 30 minutos
- **Relatório Manual:** `/mdonline` a qualquer momento
- **Relatório Diário:** Às 23h automaticamente

### **Dashboard Web**

#### **Navegação Principal**
1. **Acesse** o dashboard (local ou GitHub Pages)
2. **Página Principal:**
   - Visualize métricas gerais
   - **Vista Padrão:** Tabela de resumo por cliente
   - **Buscar:** Digite no campo de busca para filtrar clientes
   - **Exportar Resumo:** Clique em "Exportar CSV" para baixar estatísticas de todos os clientes
   - **Ver Detalhes:** Clique em uma linha do cliente para ver lojas individuais

#### **Vista Detalhada por Cliente**
3. **Após selecionar um cliente:**
   - Vê tabela com lojas individuais
   - Clique no **Player ID** (botão com ícone de monitor) para detalhes completos
   - **Exportar Lojas:** Clique em "Exportar CSV" para baixar detalhes das lojas deste cliente

#### **Detalhes do Player**
4. **Detalhes do Player:**
   - Métricas de sincronização
   - Status da playlist
   - Lista completa de arquivos
   - Informações do sistema

#### **Tema**
5. **Modo Escuro/Claro:**
   - Clique no ícone Lua/Sol para alternar modo claro/escuro
   - Tema salvo automaticamente

---

## 🎨 Funcionalidades do Dashboard

### **Tabela de Resumo por Cliente** (Novo!)

Quando nenhum filtro está ativo, a tabela mostra:

| Cliente | Total de Lojas | Lojas Sincronizadas | Lojas Atrasadas | Taxa de Sucesso |
|---------|----------------|---------------------|-----------------|-----------------|
| Cliente A | 40 | 35 | 5 | 88% |
| Cliente B | 10 | 10 | 0 | 100% |
| Cliente C | 4 | 2 | 2 | 50% |

**Funcionalidades:**
- ✅ Busca em tempo real por nome
- ✅ Contador de resultados
- ✅ Paginação automática (>50 clientes)
- ✅ Ordenação por total de lojas
- ✅ Click para drill-down
- ✅ Exportação CSV

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

- **`/`** - Dashboard principal (resumo ou detalhes por cliente)
- **`/player/:uid`** - Detalhes do player específico
- **`/daily-executions`** - Histórico de execuções

### **Tema Escuro/Claro**

- Detecta preferência do sistema automaticamente
- Salva preferência do usuário (localStorage)
- Funciona em todas as páginas
- **Melhorado:** Cards com melhor contraste e sombras no modo escuro

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
