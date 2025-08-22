# 📊 Dashboard de Monitoramento de Lojas Online

Sistema completo de monitoramento e análise de dados estatísticos de lojas online com dashboard web em tempo real, construído com React + TypeScript no frontend e Python no backend, integrado ao Supabase.

## 🚀 Funcionalidades

### **Frontend (React + TypeScript)**
- 📊 **Dashboard em tempo real** com métricas e estatísticas de lojas
- 📈 **Gráficos interativos** e visualizações de dados usando Recharts
- 🎨 **Interface moderna** com shadcn/ui e Tailwind CSS
- 📱 **Design responsivo** para desktop e mobile
- 🔄 **Atualização automática** dos dados em tempo real

### **Backend (Python)**
- 🔍 **Coleta automática** de dados de lojas online via webscraping
- 📊 **Processamento** e análise de dados estatísticos
- 💾 **Armazenamento seguro** no Supabase
- 📱 **Notificações inteligentes** via Telegram
- 📈 **Geração de relatórios** em Excel e PDF
- 🧹 **Limpeza automática** e otimização do banco
- 🔍 **Análise e diagnóstico** avançado das tabelas

### **Automação (GitHub Actions)**
- ⏰ **Monitoramento contínuo** a cada 3 horas
- 🗓️ **Manutenção automática** mensal do banco de dados
- 📊 **Análise semanal** de performance e saúde do sistema
- 🔄 **Execução automática** de todos os processos

## 🏗️ Arquitetura do Projeto

```
store-monitoring-dashboard/
├── frontend/                 # React + TypeScript Dashboard
│   ├── src/
│   │   ├── components/      # Componentes do dashboard
│   │   ├── hooks/          # Hooks customizados
│   │   ├── integrations/   # Integração Supabase
│   │   └── pages/          # Páginas da aplicação
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Scripts Python de Monitoramento
│   ├── analyze_supabase.py  # Análise avançada das tabelas
│   ├── cleanup_database.py  # Limpeza e otimização automática
│   ├── store_monitor.py     # Monitor principal de lojas
│   ├── requirements.txt     # Dependências Python
│   └── setup_dev.bat       # Scripts de configuração
├── .github/workflows/       # Automação GitHub Actions
│   ├── analyze.yml         # Análise semanal do sistema
│   ├── monitor.yml         # Monitoramento + Manutenção
│   └── deploy.yml          # Deploy automático
└── README.md               # Documentação do projeto
```

## 🛠️ Stack Tecnológica

### **Frontend**
- **React 18** com TypeScript para type safety
- **Vite** para build otimizado e desenvolvimento rápido
- **Tailwind CSS** para estilização moderna
- **shadcn/ui** para componentes consistentes
- **Recharts** para visualizações de dados avançadas
- **React Query** para gerenciamento eficiente de estado

### **Backend**
- **Python 3.11+** para processamento de dados
- **Playwright** para coleta automatizada de dados
- **Supabase** para banco de dados em tempo real
- **Pandas** para análise e manipulação de dados
- **Matplotlib/Plotly** para geração de gráficos

### **Infraestrutura**
- **Supabase** (PostgreSQL + Autenticação + Real-time)
- **GitHub Actions** para CI/CD e automação
- **GitHub Pages** para deploy do frontend

## 🚀 Guia de Instalação

### **Pré-requisitos**
- Node.js 18+ instalado
- Python 3.11+ instalado
- Git configurado
- Conta no GitHub ativa
- Projeto configurado no Supabase

### **1. Clonar o Repositório**
```bash
git clone https://github.com/seu-usuario/store-monitoring-dashboard.git
cd store-monitoring-dashboard
```

### **2. Configurar Frontend**
```bash
cd frontend
npm install
npm run dev
```

### **3. Configurar Backend**
```bash
cd backend

# Configuração automática (Windows)
setup_dev.bat

# Configuração manual (todas as plataformas)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate.bat  # Windows
pip install -r requirements.txt
playwright install chromium
```

### **4. Variáveis de Ambiente**

#### **Frontend (.env)**
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_publica_supabase
```

#### **Backend (.env)**
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_service_role_supabase
TELEGRAM_BOT_TOKEN=token_do_seu_bot_telegram
ADMIN_CHAT_ID=id_do_chat_admin
```

### **5. GitHub Secrets**
Configure no repositório (`Settings > Secrets and variables > Actions`):
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `TELEGRAM_BOT_TOKEN` (opcional para notificações)
- `ADMIN_CHAT_ID` (opcional para alertas)

## 📋 Como Usar

### **Desenvolvimento Local**

#### **Executar Dashboard**
```bash
cd frontend
npm run dev
# Acesse: http://localhost:5173
```

#### **Executar Monitoramento**
```bash
cd backend
source venv/bin/activate

# Análise completa do sistema
python analyze_supabase.py

# Limpeza e otimização do banco
python cleanup_database.py

# Monitoramento das lojas
python store_monitor.py
```

### **Produção (Automático)**

O sistema executa automaticamente via GitHub Actions:
- **Coleta de dados:** A cada 3 horas
- **Manutenção do banco:** Primeiro dia do mês às 02:00 UTC
- **Análise do sistema:** Domingo às 06:00 UTC

## 🔄 Automação GitHub Actions

### **Monitor de Lojas (monitor.yml)**
- **Frequência:** A cada 3 horas, 24/7
- **Função:** Coleta dados de todas as lojas configuradas
- **Saída:** Dados atualizados no dashboard em tempo real

### **Manutenção do Sistema (monitor.yml)**
- **Frequência:** Mensal (primeiro dia às 02:00 UTC)
- **Função:** Limpeza de dados antigos e otimização
- **Saída:** Sistema otimizado e performático

### **Análise de Performance (analyze.yml)**
- **Frequência:** Semanal (domingo às 06:00 UTC)
- **Função:** Relatórios de saúde e performance do sistema
- **Saída:** Insights sobre o funcionamento do monitoramento

## 📊 Estrutura de Dados

### **Tabelas do Sistema**
- **`lojas`** - Cadastro e configurações das lojas monitoradas
- **`execucoes`** - Histórico de coletas e monitoramentos
- **`dados_estatisticos`** - Dados coletados e métricas das lojas
- **`relatorios`** - Relatórios e análises geradas

### **Relacionamentos**
```
lojas (1) ←→ (N) execucoes
execucoes (1) ←→ (N) dados_estatisticos
lojas (1) ←→ (N) relatorios
```

## 🎯 Principais Funcionalidades do Dashboard

### **Visão Geral**
- Métricas em tempo real de todas as lojas
- Indicadores de performance e status
- Gráficos de tendências e comparativos

### **Análise Detalhada**
- Drill-down por loja específica
- Histórico de dados e evolução
- Alertas e notificações inteligentes

### **Relatórios**
- Exportação de dados em Excel/PDF
- Relatórios personalizáveis
- Agendamento automático de relatórios

## 🚨 Solução de Problemas

### **Problemas Frequentes**

#### **Dashboard não carrega dados**
1. Verificar conexão com Supabase
2. Validar variáveis de ambiente
3. Checar console do browser para erros

#### **Coleta de dados falhando**
1. Verificar logs em `backend/logs/`
2. Testar conexão com sites das lojas
3. Validar credenciais do Supabase

#### **GitHub Actions não executando**
1. Verificar GitHub Secrets configurados
2. Checar permissões do repositório
3. Validar sintaxe dos arquivos .yml

### **Logs e Monitoramento**

#### **Arquivos de Log**
- **Monitoramento:** `logs/store_monitoring.log`
- **Sistema:** `logs/system_analysis.log`
- **Manutenção:** `logs/database_cleanup.log`

#### **GitHub Actions**
Acesse a aba `Actions` no GitHub para visualizar:
- Status das execuções
- Logs detalhados
- Histórico de performance

## 📈 Recursos de Monitoramento

### **Alertas Inteligentes**
- ✅ **Sucesso:** Coleta realizada com sucesso
- ⚠️ **Atenção:** Anomalias detectadas nos dados
- ❌ **Erro:** Falhas na coleta ou processamento
- 🔧 **Manutenção:** Sistema em manutenção automática

### **Métricas de Performance**
- Tempo de resposta das lojas
- Taxa de sucesso das coletas
- Volume de dados processados
- Disponibilidade do sistema

## 🔧 Personalização e Extensão

### **Adicionar Nova Loja**
1. Inserir configurações na tabela `lojas`
2. Definir parâmetros de coleta
3. Testar coleta localmente
4. Verificar dados no dashboard

### **Customizar Dashboard**
1. Modificar componentes em `frontend/src/components/`
2. Adicionar novas visualizações
3. Integrar com APIs externas
4. Deploy automático via GitHub Actions

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📬 Contato
Vamos nos conectar? Sou sempre aberto a discussões sobre automação, qualidade de software e modernização de sistemas!
</p>
<p align="left">
  <a href="mailto:rodrigo.melo@example.com" title="Gmail">
    <img src="https://img.shields.io/badge/-Gmail-FF0000?style=flat-square&labelColor=FF0000&logo=gmail&logoColor=white"/>
  </a>
  <a href="https://www.linkedin.com/in/rodrigo-melo-dos-santos-0262a033/" title="LinkedIn">
    <img src="https://img.shields.io/badge/-Linkedin-0e76a8?style=flat-square&logo=Linkedin&logoColor=white"/>
  </a>
  <a href="#" title="WhatsApp">
    <img src="https://img.shields.io/badge/-WhatsApp-25D366?style=flat-square&labelColor=25D366&logo=whatsapp&logoColor=white"/>
  </a>
</p>

---
<div align="center">
  <p>⭐ Se este projeto te ajudou, considere dar uma estrela!</p>
  <p>🐛 Encontrou um bug? <a href="https://github.com/seu-usuario/store-monitoring-dashboard/issues">Reporte aqui</a></p>
</div>

---

**📊 Dashboard de Monitoramento de Lojas Online**  
**Monitoramento inteligente, análise avançada e insights em tempo real**

**Desenvolvido com ❤️ usando React, TypeScript, Python e Supabase**
