# 📊 Dashboard de Análise e Monitoramento - Music Delivery

> Sistema de monitoramento e análise de dados desenvolvido para acompanhar a sincronização de lojas e Music Delivery Players, transformar dados operacionais em indicadores e facilitar a identificação de ocorrências.

## 🎯 Problema de Negócio

O acompanhamento da sincronização das lojas era dependente de consultas e verificações manuais. Com uma quantidade crescente de clientes, lojas e players, esse processo dificultava:

- identificar rapidamente lojas com problemas de sincronização;
- acompanhar quais clientes apresentavam maior quantidade de ocorrências;
- visualizar a evolução dos indicadores ao longo do tempo;
- consultar informações detalhadas de um player específico;
- gerar relatórios consolidados para acompanhamento operacional.

O principal desafio era transformar informações técnicas dos players em **dados estruturados e indicadores que pudessem apoiar o acompanhamento da operação e a tomada de decisão**.

## 💡 Solução Desenvolvida

Foi desenvolvido um sistema completo de coleta, processamento, armazenamento, análise e visualização dos dados.

```text
Music Delivery Players
        ↓
Coleta automatizada
        ↓
Python + Playwright
        ↓
Processamento e análise
        ↓
Supabase / PostgreSQL
        ↓
Dashboard React
        ↓
Indicadores e relatórios
```

A solução automatiza a coleta dos dados e disponibiliza as informações em um dashboard que permite analisar a operação por cliente, loja e player.

## 📊 Indicadores e Análises

O sistema transforma os dados coletados em indicadores como:

- total de lojas monitoradas;
- lojas sincronizadas e atrasadas;
- taxa de sincronização por cliente;
- evolução da sincronização ao longo dos dias;
- atividade dos players por horário;
- players online, em atenção ou em situação crítica;
- histórico de execuções e falhas;
- arquivos ausentes por player.

Isso permite sair de uma análise baseada apenas em consultas individuais e passar para uma **visão consolidada da operação**.

## 📈 Resultado

A solução centraliza os dados de monitoramento e reduz a necessidade de consultas manuais para acompanhar a situação dos clientes e lojas.

Entre os ganhos proporcionados pelo projeto:

- 🔎 maior visibilidade sobre a situação dos players;
- 📊 indicadores consolidados por cliente;
- ⚡ acesso mais rápido às informações operacionais;
- 📈 acompanhamento histórico da sincronização;
- 🚨 identificação de situações que necessitam de atenção;
- 📥 geração de relatórios e exportação dos dados para análise.

> **Nota:** os resultados acima descrevem ganhos observáveis do sistema. Não são apresentados percentuais de ganho de produtividade sem uma medição formal do processo antes e depois da implementação.

---

## 🚀 Funcionalidades Principais

### Backend e Automação

- 🤖 **Bot Interativo (Telegram):** acione a coleta de dados e receba relatórios sob demanda
- ⌛ **Coleta de Dados Contínua:** sistema executado automaticamente por meio do GitHub Actions
- ☁️ **Deploy:** infraestrutura containerizada com Docker, preparada para Railway ou VPS
- 📈 **Análise e Armazenamento:** dados processados e armazenados no Supabase
- 🔔 **Notificações:** balanço diário e relatórios sob demanda
- 🔐 **Segurança:** suporte ao modelo atual de Publishable API Key do Supabase

### Dashboard Web

- 🖥️ **Interface Moderna:** React + TypeScript + Tailwind CSS
- 📊 **Visualização de Dados:** gráficos interativos e tabelas dinâmicas
- 📈 **Análises Estatísticas:** atividade por hora e tendência de sincronização
- 🎯 **Monitoramento de Players:** integração com Music Delivery Player
- 🔍 **Detalhes do Player:** informações completas de sincronização
- 🌓 **Modo Escuro/Claro:** alternância de tema com persistência
- 📱 **Responsivo:** interface adaptativa para desktop e mobile
- ⚡ **Navegação:** acesso aos detalhes a partir do Player ID
- 🔎 **Busca:** filtro em tempo real na tabela de clientes
- 📄 **Paginação:** ativada automaticamente quando há mais de 50 clientes
- 📥 **Exportação CSV:** exportação de resumos e detalhes para análise
- 🏥 **Saúde do Sistema:** indicadores de status e execução
- 🎨 **Taxa de Sucesso:** classificação visual dos níveis de sincronização

---

## 🔎 Como os Dados são Utilizados

O projeto não se limita à coleta de informações. Os dados passam por diferentes etapas até se transformarem em indicadores:

### 1. Coleta

Informações dos players são coletadas automaticamente por scripts Python utilizando Playwright.

### 2. Processamento

Os dados são tratados e estruturados para permitir consultas, consolidações e análises.

### 3. Armazenamento

As informações são persistidas no Supabase/PostgreSQL em tabelas específicas para monitoramento, clientes, arquivos e execuções.

### 4. Análise

Os dados são utilizados para calcular indicadores de sincronização, identificar atrasos, acompanhar tendências e analisar a atividade dos players.

### 5. Visualização

Os resultados são disponibilizados em um dashboard React para facilitar a interpretação das informações.

### 6. Acompanhamento

Relatórios podem ser consultados pelo dashboard ou recebidos por meio do Telegram.

---

## 🏗️ Arquitetura e Funcionamento

### Coleta de Dados (Backend)

O sistema opera de duas formas principais:

#### 1. Execução Agendada

- Workflow do **GitHub Actions** (`scrape.yml`) executado automaticamente;
- Script `client_monitor_supabase.py` coleta e salva dados no **Supabase**;
- relatório consolidado pode ser enviado ao **Telegram** em horário programado.

#### 2. Execução Manual via Telegram

- comando `/mdonline` enviado ao bot;
- bot hospedado na **Railway** dispara o workflow via API;
- relatório é enviado após a coleta.

### Fluxo de Dados

```text
                    ┌──────────────────────┐
                    │ Music Delivery Player│
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Python + Playwright  │
                    │ Coleta automatizada  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Processamento        │
                    │ Python + Pandas      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Supabase/PostgreSQL  │
                    │ Dados estruturados   │
                    └──────────┬───────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
       ┌──────────────────┐       ┌──────────────────┐
       │ Dashboard React  │       │ Telegram Bot     │
       │ Indicadores      │       │ Relatórios       │
       └──────────────────┘       └──────────────────┘
```

---

## 📊 Dashboard

### Página Principal (`/`)

A página principal apresenta uma visão consolidada da operação:

- overview geral das métricas;
- gráficos de sincronização;
- tabela de resumo por cliente;
- busca em tempo real;
- paginação automática;
- exportação CSV;
- acesso aos detalhes das lojas.

### Tabela de Resumo por Cliente

A tabela apresenta uma visão agregada:

| Cliente | Total de Lojas | Lojas Sincronizadas | Lojas Atrasadas | Taxa de Sucesso |
|---------|----------------|----------------------|-----------------|-----------------|
| Cliente A | 40 | 35 | 5 | 88% |
| Cliente B | 10 | 10 | 0 | 100% |
| Cliente C | 4 | 2 | 2 | 50% |

> Os valores acima são apenas exemplos de apresentação.

### Funcionalidades da Tabela

- busca em tempo real por nome;
- contador dinâmico de resultados;
- paginação automática acima de 50 clientes;
- 20 itens por página;
- ordenação por quantidade de lojas;
- drill-down para detalhes;
- exportação CSV.

### Exportação CSV

**Resumo Geral:**

```text
resumo-clientes-YYYY-MM-DD.csv
```

**Detalhes por Cliente:**

```text
detalhes-lojas-{cliente}-YYYY-MM-DD.csv
```

Os arquivos são preparados em UTF-8 BOM para facilitar a abertura no Excel.

---

## 📈 Gráficos de Análise

### Atividade por Hora

BarChart com a distribuição das atualizações das lojas ao longo do dia, considerando o intervalo de 0 a 23 horas.

O gráfico pode ser filtrado pelo cliente selecionado.

### Tendência de Sincronização

LineChart com a evolução do percentual de sincronização nos últimos 7 dias.

Pode apresentar:

- média consolidada;
- visão por cliente quando aplicado o filtro.

### Lojas Online / Offline

Classificação baseada no tempo desde a última atualização:

- 🟢 **Online:** atualização há menos de 24h
- 🟡 **Atenção:** atualização entre 24h e 72h
- 🔴 **Crítica:** sem atualização há mais de 72h

### Saúde das Execuções

Apresenta:

- total de execuções recentes;
- distribuição por status;
- execuções com sucesso;
- execuções com erro;
- execuções sem dados.

---

## 🎯 Monitoramento do Music Delivery Player

O dashboard possui integração com os dados do Music Delivery Player para acompanhamento de:

- sincronização de Music;
- sincronização de conteúdo sazonal;
- sincronização de Spots;
- arquivos existentes;
- arquivos ausentes;
- status da playlist;
- informações do sistema;
- identificação do player;
- CNPJ formatado;
- histórico de execução.

### Detalhes do Player

Rota:

```text
/player/:uid
```

A página apresenta:

- métricas de sincronização;
- status da playlist;
- total de spots ativos;
- lista completa de arquivos;
- arquivos ausentes;
- informações do sistema;
- identificação do cliente e loja.

---

## 📅 Execuções Diárias

Rota:

```text
/daily-executions
```

Apresenta:

- histórico das execuções;
- status de cada execução;
- logs detalhados;
- acompanhamento do processo de coleta.

---

## 📁 Estrutura de Arquivos

```text
store-analytics-dashboard/
├── frontend/                         # Dashboard React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── ClienteSummaryTable.tsx
│   │   │   │   ├── LojasTable.tsx
│   │   │   │   └── ...
│   │   │   ├── players/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   │   ├── useDashboardData.ts
│   │   │   ├── usePlayerMonitoring.ts
│   │   │   ├── usePlayerDetails.ts
│   │   │   └── useAuth.tsx
│   │   ├── pages/
│   │   │   ├── Index.tsx
│   │   │   ├── PlayerDetails.tsx
│   │   │   ├── DailyExecutions.tsx
│   │   │   └── Login.tsx
│   │   ├── components/auth/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── integrations/supabase/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── client_monitor_supabase.py    # Script de coleta
│   ├── bot.py                        # Bot Telegram
│   └── requirements.txt
│
├── .github/workflows/
│   ├── scrape.yml                    # Coleta automatizada
│   └── deploy.yml                    # Deploy do frontend
│
├── docs/                             # Documentação complementar
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🛠️ Stack Tecnológica

### Backend e Dados

- **Python 3.11+** — coleta, processamento e automação
- **Playwright** — automação e coleta de dados
- **Pandas** — tratamento, transformação e análise de dados
- **Supabase** — armazenamento e backend
- **PostgreSQL** — banco de dados

### Automação e Infraestrutura

- **GitHub Actions** — execução automatizada dos processos
- **Docker** — containerização
- **Railway** — hospedagem do bot
- **GitHub Pages** — hospedagem do dashboard

### Frontend

- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **shadcn/ui**
- **Recharts**
- **React Router**
- **React Query**
- **date-fns**

### Comunicação

- **Telegram Bot API** — acionamento e envio de relatórios

---

## 🔐 Segurança

O projeto utiliza variáveis de ambiente para evitar exposição de credenciais no código-fonte.

Exemplo:

```env
SUPABASE_URL=sua_url
SUPABASE_KEY=sua_chave
TELEGRAM_BOT_TOKEN=seu_token
ADMIN_CHAT_ID=seu_chat_id
```

### Autenticação do Dashboard

O dashboard utiliza autenticação por e-mail e senha através do Supabase Auth.

Sem uma sessão autenticada, o usuário é redirecionado para:

```text
/#/login
```

A autenticação utiliza:

```text
supabase.auth.signInWithPassword()
```

As rotas protegidas utilizam o componente:

```text
ProtectedRoute
```

O logout é realizado por:

```text
supabase.auth.signOut()
```

> O acesso ao dashboard deve ser combinado com políticas adequadas de Row Level Security (RLS) no Supabase.

---

## 🗄️ Estrutura do Banco de Dados

O sistema utiliza tabelas para organizar diferentes conjuntos de informações:

- **`lojas_dados`** — informações das lojas cadastradas
- **`monitoring_status`** — status de sincronização dos players
- **`music_files`** — arquivos de música por pasta
- **`clientes`** — informações dos clientes
- **`execucoes`** — histórico das execuções
- **`logs_execucao`** — logs detalhados do processamento

Essa separação permite organizar os dados coletados e utilizá-los posteriormente para consultas, indicadores e análises.

---

## ⚙️ Instalação e Configuração

### Pré-requisitos

- Conta no GitHub
- Conta na Railway
- Conta no Supabase
- Bot do Telegram criado via BotFather
- Node.js 18+
- Python 3.11+
- Docker e Docker Compose, caso utilize a execução containerizada

---

## 1. Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Configure as variáveis necessárias.

### Backend

```env
TELEGRAM_BOT_TOKEN=seu_token
AUTHORIZED_CHAT_ID=seu_chat_id
GITHUB_TOKEN=seu_token
SUPABASE_URL=sua_url
SUPABASE_KEY=sua_chave
```

### Frontend

Na pasta `frontend/`, pode ser utilizado:

```env
VITE_SUPABASE_URL=sua_url
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_sua_chave
```

> Nunca publique tokens, senhas ou chaves privadas no repositório.

---

## 2. Autenticação de Usuários

No Supabase:

1. Acesse **Authentication > Users**.
2. Selecione **Add user**.
3. Crie o usuário autorizado.
4. Configure as políticas de acesso das tabelas.

Antes de utilizar em produção, verifique a migration:

```text
supabase/migrations/20250804000000_require_auth_for_reads.sql
```

A intenção é impedir leituras públicas e exigir autenticação para acesso aos dados do dashboard.

---

## 3. GitHub Secrets

No repositório:

```text
Settings
→ Secrets and variables
→ Actions
```

Configure:

```text
SUPABASE_URL
SUPABASE_KEY
TELEGRAM_BOT_TOKEN
ADMIN_CHAT_ID
```

---

## 4. Deploy do Bot na Railway

1. Crie um projeto a partir do repositório GitHub.
2. Configure as variáveis de ambiente.
3. Utilize o Dockerfile do projeto.
4. Execute o deploy.
5. Verifique os logs da aplicação.

---

## 5. Configuração do Telegram

O bot permite acionar uma coleta manual por meio do comando:

```text
/mdonline
```

Também pode enviar relatórios automaticamente conforme a configuração do workflow.

---

## 🐳 Execução Local com Docker

A maneira mais prática de executar o projeto localmente é utilizando Docker Compose.

Na raiz do projeto:

```bash
docker compose up -d --build
```

Após o build, o dashboard estará disponível em:

```text
http://localhost:8080
```

Para interromper:

```bash
docker compose down
```

---

## 🐍 Execução Manual sem Docker

### Backend

```bash
cd backend

python -m venv venv
source venv/bin/activate
```

No Windows:

```bash
venv\Scripts\activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Execute:

```bash
python bot.py
```

### Frontend

```bash
cd frontend
npm install
```

Desenvolvimento:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

---

## 🌐 Deploy do Dashboard no GitHub Pages

O Vite utiliza a configuração de `base` correspondente ao nome do repositório:

```typescript
export default defineConfig({
  base: '/store-analytics-dashboard/',
});
```

O workflow de deploy realiza o processo automaticamente.

### Deploy

```bash
git add .
git commit -m "chore: deploy dashboard"
git push origin main
```

No GitHub:

```text
Settings
→ Pages
→ Source: GitHub Actions
```

O workflow:

```text
.github/workflows/deploy.yml
```

será responsável pelo deploy.

---

## 📋 Como Usar

### Bot Telegram

O bot pode ser utilizado para:

- iniciar uma coleta manual;
- consultar informações;
- receber relatórios;
- acompanhar o resultado das execuções.

Comando principal:

```text
/mdonline
```

### Dashboard

1. Acesse o dashboard.
2. Faça login.
3. Consulte as métricas gerais.
4. Utilize os filtros por cliente.
5. Analise a taxa de sincronização.
6. Consulte lojas individualmente.
7. Acesse os detalhes de cada player.
8. Exporte os dados quando necessário.

---

## 🔍 Exemplo de Fluxo de Análise

Um possível fluxo de utilização do dashboard:

```text
Cliente apresenta ocorrência
        ↓
Consulta do dashboard
        ↓
Identificação das lojas afetadas
        ↓
Análise da taxa de sincronização
        ↓
Drill-down para o Player
        ↓
Verificação dos arquivos/status
        ↓
Consulta do histórico de execução
        ↓
Identificação de possível causa
        ↓
Acompanhamento da sincronização
```

Esse fluxo demonstra a utilização dos dados para **investigação e acompanhamento operacional**, e não apenas para visualização.

---

## 📊 Perspectiva de Dados

Este projeto foi desenvolvido considerando um fluxo de trabalho de dados:

```text
Dados
  ↓
Coleta
  ↓
Processamento
  ↓
Transformação
  ↓
Regra de negócio
  ↓
Armazenamento
  ↓
Indicadores
  ↓
Visualização
  ↓
Análise
```

A aplicação combina automação, tratamento de dados e visualização para transformar informações operacionais em indicadores utilizáveis.

---

## 🔧 Manutenção

### Atualizar Backend

```bash
cd backend
pip install --upgrade -r requirements.txt
```

### Atualizar Frontend

```bash
cd frontend
npm update
```

### Verificar Logs

- **Railway:** logs do bot;
- **GitHub Actions:** logs dos workflows;
- **Supabase:** consultas e dados armazenados;
- **Dashboard:** indicadores de execução e status.

---

## ⚠️ Limitações e Considerações

- O GitHub Pages hospeda apenas o frontend estático.
- O backend deve permanecer hospedado em um ambiente compatível.
- O funcionamento depende da disponibilidade dos serviços externos utilizados.
- As classificações de status dependem das regras configuradas para os indicadores.
- As políticas RLS do Supabase devem ser revisadas antes de um uso em produção.
- Os valores e limites dos indicadores devem ser ajustados conforme as regras reais da operação.

---

## 🔮 Possíveis Evoluções

Algumas evoluções possíveis para o projeto:

- criação de indicadores adicionais;
- análises históricas mais longas;
- alertas automáticos para situações críticas;
- análise de tendências;
- integração com outras fontes de dados;
- criação de métricas de SLA;
- identificação automática de padrões de ocorrência;
- evolução do pipeline para uma arquitetura de dados mais robusta.

---

## 🧠 Competências Demonstradas

Este projeto demonstra conhecimentos aplicados em:

- 📊 Análise e visualização de dados
- 🐍 Python
- 🐼 Pandas
- 🗄️ PostgreSQL / Supabase
- 🔎 Tratamento e consulta de dados
- 🤖 Automação de processos
- 🌐 Web scraping
- 📈 Construção de indicadores
- 🔄 Pipelines de dados
- ⚙️ GitHub Actions
- 🐳 Docker
- ⚛️ React / TypeScript
- 🔐 Autenticação e controle de acesso
- 📱 Integração com APIs
- 📋 Geração de relatórios

---

## 📄 Licença

Este projeto é privado e destinado ao uso interno.

---

## ❤️ Sobre o Projeto

Desenvolvido com foco em **automação, dados e resolução de problemas operacionais**, utilizando tecnologias de software para transformar informações de monitoramento em indicadores e ferramentas de acompanhamento.

**Desenvolvido com ❤️ para Music Delivery.**
