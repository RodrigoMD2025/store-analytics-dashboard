# 📊 Atualização do Dashboard - Exibição de Dados em Tempo Real

## 🎯 Objetivo
Atualizar a lógica do dashboard para exibir dados em tempo real das lojas, substituindo o armazenamento em forma de pilha pelo armazenamento de dados atuais que substituem os antigos.

## 🔧 Mudanças Realizadas

### 1. **Atualização do Hook de Dados (`useDashboardData.ts`)**
- Adicionada busca dos dados reais da tabela `lojas_dados`
- Implementada lógica para buscar apenas os dados mais recentes de cada cliente
- Adicionado novo estado para armazenar os dados das lojas
- Atualizada a interface `DashboardStats` para calcular estatísticas reais com base nos dados das lojas

### 2. **Criação do Componente de Tabela de Lojas (`LojasTable.tsx`)**
- Novo componente para exibir detalhes das lojas em formato de tabela
- Colunas incluídas:
  - Nome da loja
  - Identificador
  - Data de atualização
  - Tempo de atraso (em dias ou horas)
  - Status (Sincronizada/Atrasada)
- Formatação adequada das datas e tempos
- Exibição condicional quando não há dados

### 3. **Atualização da Página Principal (`Index.tsx`)**
- Importação do novo componente `LojasTable`
- Passagem dos dados das lojas para o componente
- Reorganização do layout para incluir a tabela de lojas
- Atualização do estado de carregamento para incluir a nova tabela

### 4. **Atualização do Componente de Gráfico (`SyncChart.tsx`)**
- Melhorias na exibição do gráfico de pizza
- Adição de labels diretamente no gráfico
- Ajustes nas cores para melhor visualização

### 5. **Atualização dos Tipos do Supabase (`types.ts`)**
- Adicionada definição da tabela `lojas_dados`
- Adicionada definição da tabela `execucoes`
- Configuradas as relações entre tabelas

## 📈 Funcionalidades Implementadas

### 1. **Substituição de Dados (não pilha)**
- Os dados são substituídos a cada execução, mantendo apenas os dados atuais
- Não há acumulação de dados históricos na exibição principal
- Os dados mais recentes substituem os antigos no banco

### 2. **Exibição Detalhada por Cliente**
- Ao selecionar um cliente na dropdown:
  - Exibe o total de lojas do cliente
  - Mostra a tabela com detalhes de cada loja:
    - Nome da loja
    - Identificador
    - Data de atualização
    - Tempo de atraso (dias ou horas)
    - Status de sincronização

### 3. **Gráfico de Pizza para Status de Sincronização**
- Visualização clara do status de sincronização
- Percentuais calculados com base nos dados reais
- Cores intuitivas (verde para sincronizadas, vermelho para atrasadas)

## 🗃️ Estrutura de Dados

### Tabela `lojas_dados`
```sql
CREATE TABLE IF NOT EXISTS lojas_dados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    execucao_id UUID REFERENCES execucoes(id) ON DELETE CASCADE,
    cliente_id INTEGER REFERENCES clientes(id),
    cliente_nome TEXT NOT NULL,
    loja_nome TEXT NOT NULL,
    identificador TEXT NOT NULL,
    atualizado_em TIMESTAMP WITH TIME ZONE,
    sincronizada BOOLEAN DEFAULT FALSE,
    tempo_atraso_horas NUMERIC(10,2) DEFAULT 0,
    tempo_atraso_dias INTEGER DEFAULT 0,
    hash_loja TEXT,
    data_coleta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Próximos Passos

1. **Testar localmente** as mudanças implementadas
2. **Validar** a exibição correta dos dados
3. **Ajustar** conforme necessário
4. **Publicar** as atualizações no GitHub

## 📝 Notas Técnicas

- A lógica de busca dos dados mais recentes pode ser otimizada conforme o volume de dados crescer
- As cores do gráfico podem ser personalizadas no arquivo de temas
- A formatação de datas segue o padrão brasileiro (dd/MM/yyyy HH:mm)
- O tempo de atraso é exibido em dias quando superior a 24 horas, e em horas quando inferior