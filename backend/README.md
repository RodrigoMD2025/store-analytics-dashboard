# 🐍 Backend - Bot Sync Watcher

Sistema de backend para monitoramento e sincronização de lojas, construído em Python com integração ao Supabase.

## 🚀 Funcionalidades

### **Scripts Principais:**
- **`client_monitor_supabase.py`** - Script principal de webscraping e monitoramento
- **`analyze_supabase.py`** - Análise e diagnóstico das tabelas Supabase
- **`cleanup_database.py`** - Limpeza automática de dados antigos

### **Funcionalidades:**
- 🔍 **Webscraping** com Playwright
- 📊 **Coleta de dados** de lojas em tempo real
- 💾 **Armazenamento** no Supabase
- 📱 **Notificações** via Telegram
- 📈 **Geração de relatórios** em Excel
- 🧹 **Limpeza automática** do banco
- 🔍 **Análise e diagnóstico** das tabelas

## 🛠️ Instalação

### **Pré-requisitos:**
- Python 3.11+
- pip ou conda

### **Setup Automático (Recomendado):**

#### **Windows (PowerShell):**
```powershell
cd backend
.\setup_dev.ps1
```

#### **Windows (Command Prompt):**
```cmd
cd backend
setup_dev.bat
```

### **Setup Manual:**

#### **1. Criar Ambiente Virtual:**
```bash
cd backend
python -m venv venv
```

#### **2. Ativar Ambiente Virtual:**
```bash
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows Command Prompt
venv\Scripts\activate.bat

# Linux/Mac
source venv/bin/activate
```

#### **3. Instalar Dependências:**
```bash
pip install -r requirements.txt
```

#### **4. Instalar Playwright:**
```bash
playwright install chromium
```

## ⚙️ Configuração

### **Variáveis de Ambiente:**
Crie um arquivo `.env` na pasta `backend/`:

```env
# Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_do_supabase

# Telegram (opcional)
TELEGRAM_BOT_TOKEN=seu_token_do_bot
ADMIN_CHAT_ID=seu_chat_id
```

### **Configuração do Supabase:**
1. Crie um projeto no [Supabase](https://supabase.com)
2. Configure as tabelas necessárias (veja `schema.sql`)
3. Configure as variáveis de ambiente

## 📋 Uso dos Scripts

### **1. Monitoramento Principal:**
```bash
python client_monitor_supabase.py
```

**Funcionalidades:**
- Coleta dados de todos os clientes configurados
- Salva informações no Supabase
- Envia notificações via Telegram
- Gera relatórios em Excel

### **2. Análise das Tabelas:**
```bash
python analyze_supabase.py
```

**Funcionalidades:**
- Analisa estrutura de todas as tabelas
- Identifica problemas e inconsistências
- Gera relatório detalhado em JSON
- Sugere melhorias

### **3. Limpeza do Banco:**
```bash
python cleanup_database.py
```

**Funcionalidades:**
- Remove dados antigos (30+ dias)
- Limpa execuções, lojas e métricas antigas
- Gera relatório de limpeza
- Otimiza performance do banco

## 🔄 Workflows GitHub Actions

### **Monitoramento Automático:**
- **Frequência:** A cada 3 horas
- **Arquivo:** `.github/workflows/scrape.yml`
- **Função:** Executa o script principal de coleta

### **Limpeza Mensal:**
- **Frequência:** Primeiro dia do mês às 02:00 UTC
- **Arquivo:** `.github/workflows/scrape.yml` (job limpeza-banco)
- **Função:** Remove dados antigos automaticamente

### **Análise Semanal:**
- **Frequência:** Domingo às 06:00 UTC
- **Arquivo:** `.github/workflows/analyze.yml`
- **Função:** Analisa saúde das tabelas

## 📊 Estrutura das Tabelas

### **`clientes`:**
- `id` - ID único do cliente
- `nome` - Nome do cliente
- `email` - Email de contato
- `ativo` - Status ativo/inativo

### **`execucoes`:**
- `id` - ID da execução
- `cliente_id` - Referência ao cliente
- `status` - Status da execução
- `executado_em` - Data/hora da execução

### **`lojas_dados`:**
- `id` - ID do registro
- `cliente_nome` - Nome do cliente
- `loja_nome` - Nome da loja
- `sincronizada` - Status de sincronização
- `data_coleta` - Data da coleta

### **`metricas_periodicas`:**
- `id` - ID da métrica
- `cliente_id` - Referência ao cliente
- `periodo` - Tipo de período (diário, semanal, mensal)
- `total_lojas` - Total de lojas no período

## 🚨 Troubleshooting

### **Problemas Comuns:**

1. **Erro de conexão com Supabase:**
   - Verificar variáveis de ambiente
   - Verificar credenciais do projeto

2. **Erro no Playwright:**
   - Executar `playwright install chromium`
   - Verificar dependências do sistema

3. **Dados não sendo salvos:**
   - Verificar permissões das tabelas
   - Verificar estrutura das tabelas

### **Logs:**
- **Monitoramento:** `log_extracao.log`
- **Análise:** `analise_supabase.log`
- **Limpeza:** `limpeza_banco.log`

## 📈 Monitoramento e Alertas

### **Notificações Telegram:**
- ✅ **Sucesso:** Dados coletados e salvos
- ❌ **Erro:** Falhas na execução
- 🧹 **Limpeza:** Banco limpo automaticamente
- 🔍 **Análise:** Relatórios de diagnóstico

### **Métricas de Performance:**
- Tempo de execução por cliente
- Taxa de sucesso das coletas
- Volume de dados processados
- Status das tabelas

## 🔧 Desenvolvimento

### **Adicionar Novo Cliente:**
1. Inserir na tabela `clientes`
2. Configurar parâmetros de coleta
3. Testar script localmente
4. Verificar dados no Supabase

### **Modificar Scripts:**
1. Fazer alterações no código
2. Testar localmente
3. Commit e push para GitHub
4. Workflow executa automaticamente

---

**Para suporte técnico ou dúvidas, consulte a documentação principal do projeto ou abra uma issue no GitHub.**
