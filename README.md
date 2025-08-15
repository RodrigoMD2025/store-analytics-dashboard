# 🤖 Bot Sync Watcher

Sistema completo de monitoramento e sincronização de lojas com dashboard web em tempo real, construído com React + TypeScript no frontend e Python no backend, integrado ao Supabase.

## 🚀 Funcionalidades

### **Frontend (React + TypeScript)**
- 📊 **Dashboard em tempo real** com métricas de sincronização
- 📈 **Gráficos interativos** usando Recharts
- 🎨 **Interface moderna** com shadcn/ui e Tailwind CSS
- 📱 **Responsivo** para desktop e mobile
- 🔄 **Atualização automática** dos dados

### **Backend (Python)**
- 🔍 **Webscraping automático** com Playwright
- 📊 **Coleta de dados** de lojas em tempo real
- 💾 **Armazenamento** no Supabase
- 📱 **Notificações** via Telegram
- 📈 **Geração de relatórios** em Excel
- 🧹 **Limpeza automática** do banco
- 🔍 **Análise e diagnóstico** das tabelas

### **Automação (GitHub Actions)**
- ⏰ **Monitoramento a cada 3 horas**
- 🗓️ **Limpeza mensal** do banco de dados
- 📊 **Análise semanal** das tabelas
- 🔄 **Execução automática** dos scripts

## 🏗️ Arquitetura do Projeto

```
bot-sync-watcher/
├── frontend/                 # React + TypeScript
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── hooks/          # Hooks customizados
│   │   ├── integrations/   # Integração Supabase
│   │   └── pages/          # Páginas da aplicação
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Scripts Python
│   ├── analyze_supabase.py  # Análise das tabelas
│   ├── cleanup_database.py  # Limpeza automática
│   ├── client_monitor_supabase.py # Monitoramento principal
│   ├── requirements.txt     # Dependências Python
│   └── setup_dev.bat       # Scripts de setup
├── .github/workflows/       # GitHub Actions
│   ├── analyze.yml         # Análise semanal
│   ├── scrape.yml          # Monitoramento + Limpeza
│   └── sync.yml            # Sincronização
└── README.md               # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **Recharts** para gráficos
- **React Query** para gerenciamento de estado

### **Backend**
- **Python 3.11+** para scripts
- **Playwright** para webscraping
- **Supabase** para banco de dados
- **Pandas** para manipulação de dados
- **Matplotlib** para gráficos em relatórios

### **Infraestrutura**
- **Supabase** (PostgreSQL + Auth + Real-time)
- **GitHub Actions** para automação
- **GitHub Pages** para deploy

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+
- Python 3.11+
- Git
- Conta no GitHub
- Projeto no Supabase

### **1. Clone o Repositório**
```bash
git clone https://github.com/RodrigoMD2025/bot-sync-watcher.git
cd bot-sync-watcher
```

### **2. Configurar Frontend**
```bash
cd frontend
npm install
```

### **3. Configurar Backend**
```bash
cd backend

# Setup automático (Windows)
setup_dev.bat

# Ou setup manual
python -m venv venv
venv\Scripts\activate.bat  # Windows
pip install -r requirements.txt
playwright install chromium
```

### **4. Configurar Variáveis de Ambiente**

#### **Frontend (.env)**
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

#### **Backend (.env)**
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_service_role
TELEGRAM_BOT_TOKEN=seu_token_do_bot
ADMIN_CHAT_ID=seu_chat_id
```

### **5. Configurar GitHub Secrets**
Vá para `Settings > Secrets and variables > Actions` e configure:
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `TELEGRAM_BOT_TOKEN` (opcional)
- `ADMIN_CHAT_ID` (opcional)

## 📋 Uso

### **Desenvolvimento Local**

#### **Frontend**
```bash
cd frontend
npm run dev
# Acesse: http://localhost:5173
```

#### **Backend**
```bash
cd backend
venv\Scripts\activate.bat

# Análise das tabelas
python analyze_supabase.py

# Limpeza do banco
python cleanup_database.py

# Monitoramento principal
python client_monitor_supabase.py
```

### **Produção (GitHub Actions)**

Os workflows executam automaticamente:
- **Monitoramento:** A cada 3 horas
- **Limpeza:** Primeiro dia do mês às 02:00 UTC
- **Análise:** Domingo às 06:00 UTC

## 🔄 Workflows GitHub Actions

### **Monitor Lojas (scrape.yml)**
- **Frequência:** A cada 3 horas
- **Função:** Executa webscraping e salva no Supabase
- **Job:** `monitor-lojas`

### **Limpeza Banco (scrape.yml)**
- **Frequência:** Mensal (primeiro dia às 02:00 UTC)
- **Função:** Remove dados antigos (30+ dias)
- **Job:** `limpeza-banco`

### **Análise Supabase (analyze.yml)**
- **Frequência:** Semanal (domingo às 06:00 UTC)
- **Função:** Analisa saúde das tabelas
- **Job:** `analyze-tables`

## 📊 Estrutura do Banco de Dados

### **Tabelas Principais**
- **`clientes`** - Cadastro de clientes
- **`execucoes`** - Histórico de execuções
- **`lojas_dados`** - Dados coletados das lojas
- **`metricas_periodicas`** - Métricas agregadas

### **Relacionamentos**
```
clientes (1) ←→ (N) execucoes
execucoes (1) ←→ (N) lojas_dados
clientes (1) ←→ (N) metricas_periodicas
```

## 🚨 Troubleshooting

### **Problemas Comuns**

#### **1. Erro de Conexão Supabase**
- Verificar variáveis de ambiente
- Verificar credenciais do projeto
- Verificar permissões das tabelas

#### **2. Erro no Playwright**
```bash
cd backend
playwright install chromium
```

#### **3. Workflows não executam**
- Verificar GitHub Secrets configuradas
- Verificar permissões do repositório
- Verificar branch main

#### **4. Frontend não carrega dados**
- Verificar conexão com Supabase
- Verificar variáveis de ambiente
- Verificar console do navegador

### **Logs e Debugging**

#### **Backend**
- **Monitoramento:** `log_extracao.log`
- **Análise:** `analise_supabase.log`
- **Limpeza:** `limpeza_banco.log`

#### **GitHub Actions**
- Acesse `Actions` no GitHub
- Clique no workflow específico
- Veja logs detalhados de cada job

## 📈 Monitoramento e Alertas

### **Notificações Telegram**
- ✅ **Sucesso:** Dados coletados e salvos
- ❌ **Erro:** Falhas na execução
- 🧹 **Limpeza:** Banco limpo automaticamente
- 🔍 **Análise:** Relatórios de diagnóstico

### **Métricas de Performance**
- Tempo de execução por cliente
- Taxa de sucesso das coletas
- Volume de dados processados
- Status das tabelas

## 🔧 Desenvolvimento

### **Adicionar Novo Cliente**
1. Inserir na tabela `clientes` do Supabase
2. Configurar parâmetros de coleta
3. Testar script localmente
4. Verificar dados no dashboard

### **Modificar Scripts**
1. Fazer alterações no código
2. Testar localmente
3. Commit e push para GitHub
4. Workflow executa automaticamente

### **Adicionar Novas Funcionalidades**
1. Desenvolver no ambiente local
2. Testar com dados reais
3. Documentar mudanças
4. Deploy via GitHub Actions

## 📚 Documentação Adicional

- **Backend:** [backend/README.md](backend/README.md)
- **Frontend:** [frontend/README.md](frontend/README.md)
- **Workflows:** [.github/workflows/](.github/workflows/)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](frontend/LICENSE) para mais detalhes.

## 🆘 Suporte

- **Issues:** [GitHub Issues](https://github.com/RodrigoMD2025/bot-sync-watcher/issues)
- **Discussions:** [GitHub Discussions](https://github.com/RodrigoMD2025/bot-sync-watcher/discussions)
- **Documentação:** [Wiki do projeto](https://github.com/RodrigoMD2025/bot-sync-watcher/wiki)

---

**🚀 Bot Sync Watcher - Monitoramento inteligente de lojas em tempo real!**

**Desenvolvido com ❤️ usando React, Python e Supabase**
