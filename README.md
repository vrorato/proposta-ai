# PropostaAI 🚀 — Propostas Comerciais de Elite

**PropostaAI** é uma plataforma SaaS avançada projetada para transformar a maneira como profissionais e empresas criam propostas comerciais. Utilizando inteligência artificial de última geração, o sistema automatiza a criação de documentos persuasivos, estruturados e estrategicamente precificados.

---

## ✨ Funcionalidades Principais

- **🧠 Escopo Inteligente**: Informe os detalhes do serviço e deixe que a IA analise as variáveis críticas do projeto.
- **💰 Precificação Estratégica**: Sugestões automáticas de ticket ideal baseadas em complexidade, mercado e valor percebido.
- **📄 Geração de Alta Fidelidade**: Documentos profissionais completos gerados em minutos, prontos para impressionar clientes.
- **📊 Dashboard de Gestão**: Controle total sobre suas propostas, rascunhos e histórico de conversões.
- **🎨 Design Premium**: Interface moderna com estética dark mode, glassmorphism e micro-animações.

---

## 🛠️ Stack Tecnológica

O projeto utiliza o que há de mais moderno no ecossistema web:

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) com [shadcn/ui](https://ui.shadcn.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **Inteligência Artificial**: [OpenAI API](https://openai.com/) / [Claude SDK](https://www.anthropic.com/api)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Como Começar

### Pré-requisitos

- Node.js 20+
- Conta no Supabase (para Banco de Dados e Auth)
- Chave de API da OpenAI ou Anthropic

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/vrorato/proposta-ai.git
   cd proposta-ai
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=seu_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
   OPENAI_API_KEY=sua_chave_da_openai
   ```

4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📅 Roadmap de Desenvolvimento

### Fase 1 — MVP (Concluído ✅)
- Landing page responsiva de alto impacto.
- Sistema de autenticação via Supabase.
- Dashboard estruturado com KPIs e gestão de propostas.
- Proteção de rotas e middleware de segurança.

### Fase 2 — Engine de IA (Em progresso 🏗️)
- Wizard multi-step para criação de propostas.
- Integração profunda com modelos de linguagem (LLM).
- Preview dinâmico de sugestões da IA.

### Fase 3 — Experiência Final
- Exportação nativa para PDF com branding personalizado.
- Biblioteca de templates por nicho (Design, Dev, Marketing, etc).
- Configurações avançadas de perfil e empresa.

---

## 📄 Licença

Este projeto é privado e de uso exclusivo de seu proprietário.

---

Desenvolvido por [Vinícius Rorato](https://github.com/vrorato) ⚡
