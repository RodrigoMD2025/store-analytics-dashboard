# 🚀 Bot Sync Watcher

Sistema de monitoramento e sincronização de lojas para múltiplos clientes, construído com React, TypeScript e Supabase.

## ✨ Características

- 📊 Dashboard em tempo real com métricas de sincronização
- 🔄 Monitoramento automático de status de lojas
- 👥 Gestão de múltiplos clientes
- 📈 Relatórios e analytics
- 🔐 Autenticação segura com Supabase
- 📱 Interface responsiva e moderna

## 🛠️ Tecnologias

- **Frontend:** React 18 + TypeScript + Vite
- **UI Components:** shadcn/ui + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Real-time)
- **State Management:** React Query + React Hook Form
- **Charts:** Recharts
- **Deploy:** GitHub Pages

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+ 
- npm, yarn ou bun

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone <seu-repositorio-url>
   cd bot-sync-watcher
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   bun install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp env.example .env.local
   # Edite o arquivo .env.local com suas credenciais do Supabase
   ```

4. **Execute o projeto:**
   ```bash
   npm run dev
   ```

5. **Acesse:** `http://localhost:8080`

## 🌐 Deploy no GitHub Pages

### Deploy Manual
```bash
npm run deploy
```

### Deploy Automático com GitHub Actions
1. Configure o repositório no GitHub
2. Adicione as secrets necessárias
3. O deploy será feito automaticamente a cada push na branch main

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── dashboard/      # Componentes do dashboard
│   └── ui/            # Componentes base (shadcn/ui)
├── hooks/              # Hooks customizados
├── integrations/       # Integrações externas (Supabase)
├── lib/               # Utilitários e configurações
├── pages/             # Páginas da aplicação
└── App.tsx            # Componente principal
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview da build
- `npm run deploy` - Deploy no GitHub Pages
- `npm run lint` - Linting do código

## 🗄️ Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Configure as tabelas necessárias (veja `supabase/schema.sql`)
3. Configure as variáveis de ambiente no arquivo `.env.local`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:
- Abra uma [issue](../../issues) no GitHub
- Consulte a [documentação](../../wiki)
- Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ para monitorar e sincronizar lojas de forma eficiente e confiável.**
