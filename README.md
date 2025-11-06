# 📊 Dashboard de Análise e Monitoramento de Lojas

Sistema completo para monitoramento de lojas, coleta de dados e acionamento de rotinas via Telegram. O projeto combina um backend em Python, automação com GitHub Actions e um bot interativo hospedado na Railway.

## 🚀 Funcionalidades Principais

- 🤖 **Bot Interativo (Telegram):** Acione a coleta de dados e receba relatórios sob demanda através de um simples comando no Telegram.
-  hourly **Coleta de Dados Contínua:** O sistema roda automaticamente a cada hora para buscar novos dados e alimentar a base de dados.
- ☁️ **Deploy Moderno:** A infraestrutura do bot é containerizada com Docker e hospedada na Railway, garantindo estabilidade e escalabilidade.
- 📈 **Análise e Armazenamento:** Os dados coletados são processados e armazenados de forma segura no Supabase.
- 🔔 **Notificações Inteligentes:** Receba um balanço diário do status das lojas ou relatórios imediatos quando solicitados manualmente.

---

## 🏗️ Arquitetura e Funcionamento

O sistema opera de duas formas principais:

1.  **Execução Agendada (a cada hora):**
    *   Um workflow do **GitHub Actions** (`scrape.yml`) é executado automaticamente a cada hora.
    *   Ele roda o script `client_monitor_supabase.py`, que coleta e salva os dados no **Supabase**.
    *   Se a execução for a das 23h, um relatório consolidado é enviado para o **Telegram**.

2.  **Execução Manual (via Telegram):**
    *   Você envia o comando `/mdonline` para o seu bot no Telegram.
    *   O bot, rodando 24/7 na **Railway** (`bot.py`), recebe o comando.
    *   O bot faz uma chamada de API para o **GitHub Actions**, disparando o workflow `scrape.yml` imediatamente.
    *   O workflow executa a coleta de dados e, por se tratar de uma execução manual, envia o relatório de volta para você no Telegram assim que termina.

### Estrutura de Arquivos

```
store-analytics-dashboard/
├── frontend/                 # (Opcional) Dashboard React
├── backend/
│   ├── client_monitor_supabase.py  # Script principal de coleta e análise
│   ├── bot.py                     # Bot do Telegram (Long Polling)
│   └── requirements.txt         # Dependências Python
├── .github/workflows/
│   └── scrape.yml               # Workflow de coleta (agendada e manual)
├── Dockerfile                # Define o ambiente do bot para a Railway
└── README.md                 # Esta documentação
```

---

## 🛠️ Configuração e Deploy

### **Pré-requisitos**

- Conta no GitHub.
- Conta na [Railway](https://railway.app/).
- Conta no [Supabase](https://supabase.com/).
- Um bot criado no Telegram (via [BotFather](https://t.me/botfather)).

### **1. Variáveis de Ambiente**

Você precisará dos seguintes tokens e IDs. Guarde-os em um local seguro.

- `TELEGRAM_BOT_TOKEN`: Token do seu bot, fornecido pelo BotFather.
- `AUTHORIZED_CHAT_ID`: O ID do seu chat no Telegram. Você pode descobri-lo enviando uma mensagem para o bot `@userinfobot`.
- `GITHUB_TOKEN`: Um Personal Access Token (PAT) do GitHub. [Crie um aqui](https://github.com/settings/tokens/new) com a permissão `repo` (para acionar workflows).
- `SUPABASE_URL`: URL do seu projeto no Supabase.
- `SUPABASE_KEY`: A chave `service_role` do seu projeto no Supabase.

### **2. Configuração do GitHub**

No seu repositório no GitHub, vá em `Settings > Secrets and variables > Actions` e adicione os seguintes "Repository secrets":

- `SUPABASE_URL`
- `SUPABASE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `ADMIN_CHAT_ID` (use o mesmo valor do `AUTHORIZED_CHAT_ID`)

### **3. Deploy do Bot na Railway**

O bot precisa rodar 24/7 para receber seus comandos. A Railway é perfeita para isso.

1.  **Crie um Novo Projeto:** No painel da Railway, crie um novo projeto a partir do seu repositório do GitHub.
2.  **Adicione as Variáveis:** Vá para a aba **"Variables"** do projeto e adicione as seguintes variáveis:
    - `TELEGRAM_BOT_TOKEN`
    - `AUTHORIZED_CHAT_ID`
    - `GITHUB_TOKEN`
3.  **Configure o Deploy:** Vá para a aba **"Settings"** e, na seção **"Deploy"**, garanta que o campo **"Start Command"** esteja **vazio**. A Railway usará o `Dockerfile` automaticamente.
4.  **Faça o Deploy:** A Railway fará o deploy do seu bot. Nos logs, você deverá ver as mensagens `Bot started in long polling mode` e `Polling for new updates...`.

### **4. Apague o Webhook do Telegram**

Como estamos usando Long Polling, é **essencial** que não haja nenhum webhook configurado. Execute o comando abaixo no seu navegador (substituindo seu token) para garantir que ele seja apagado:

```
https://api.telegram.org/bot<SEU_TELEGRAM_BOT_TOKEN>/setWebhook?url=
```

---

## 📋 Como Usar

- **Monitoramento Automático:** Acontece a cada hora. Um relatório consolidado é enviado todo dia às 23h.
- **Relatório Manual:** Envie a mensagem `/mdonline` para o seu bot no Telegram a qualquer momento para receber um relatório atualizado imediatamente.