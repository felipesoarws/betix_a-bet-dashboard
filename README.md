# 🎲 Betix - Dashboard de Gerenciamento de Apostas

Bem-vindo ao **Betix**, uma aplicação web moderna e intuitiva projetada para ajudar apostadores a registrar, gerenciar e analisar suas apostas esportivas de forma eficiente.  
Com uma interface elegante e ferramentas visuais, o Betix transforma o acompanhamento de apostas em uma experiência organizada e poderosa.

---

## ✨ Funcionalidades Principais

O Betix oferece um conjunto completo de ferramentas para o gerenciamento de apostas:

- 🔐 **Autenticação Segura**: Sistema completo de login e criação de contas para proteger os dados do usuário.  
- 📊 **Dashboard Centralizado**: Uma visão geral dos resultados, incluindo lucro total, ROI, taxa de acerto e outras métricas importantes, com filtros por mês e ano.  
- ➕ **Registro Rápido de Apostas**: Formulário intuitivo para adicionar novas apostas, especificando evento, mercado, valor, odd, unidade e categoria.  
- 📈 **Gráfico de Evolução**: Visualize seu lucro diário em um gráfico de barras interativo.  
- 📜 **Histórico Detalhado**: Tabela completa com todas as apostas, com filtros por evento, categoria e resultado.  
- ✏️ **Edição e Exclusão**: Edite ou exclua apostas a qualquer momento.  
- 📱 **Design Responsivo**: Totalmente acessível em desktop, tablet ou smartphone.  
- 🙈 **Modo de Privacidade**: Oculte valores financeiros com um único clique para maior privacidade.  

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- Framework: [Next.js](https://nextjs.org/) (com App Router e Turbopack)  
- Linguagem: **TypeScript**  
- Estilização: [Tailwind CSS](https://tailwindcss.com/)  
- Componentes UI: [shadcn/ui](https://ui.shadcn.com/)  
- Animações: [Framer Motion](https://www.framer.com/motion/)  
- Formulários: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)  
- Gráficos: [Recharts](https://recharts.org/)  
- Notificações: [Sonner](https://sonner.emilkowal.ski/)  

### **Backend & Banco de Dados**
- Autenticação: **Better Auth**  
- Banco de Dados: **PostgreSQL**  
- ORM: [Drizzle ORM](https://orm.drizzle.team/)  
- API: **Next.js API Routes (Server Actions)**  

---

## 🚀 Como Rodar o Projeto Localmente

### ✅ Pré-requisitos
- [Node.js](https://nodejs.org/) (versão **20+**)  
- [pnpm](https://pnpm.io/) (ou npm/yarn)  
- Uma instância do **PostgreSQL** em execução  

### 📌 Passo a Passo

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/betting-dashboard.git
   cd betting-dashboard
