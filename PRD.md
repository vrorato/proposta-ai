# PRD — PropostaAI

## Visão Geral do Produto

**PropostaAI** é uma plataforma SaaS onde profissionais e empresas criam propostas comerciais usando inteligência artificial. O usuário preenche informações sobre o cliente e o serviço, a IA analisa tudo e sugere valor, estrutura e tom para a proposta. O usuário revisa a sugestão, ajusta o que quiser, e a IA gera a proposta final completa e profissional.

**Público-alvo:** Freelancers, agências, consultorias e pequenas/médias empresas que enviam propostas comerciais regularmente.

**Problema que resolve:** Criar propostas profissionais consome tempo, exige habilidade de redação persuasiva e precificação estratégica. A maioria dos profissionais usa templates genéricos que não impressionam. O PropostaAI elimina esse atrito com IA.

---

## Stack Tecnológica

- **Framework Frontend:** Next.js 15 (App Router)
- **Estilização:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth (email + senha)
- **IA:** Claude API (Anthropic) via API Route do Next.js
- **Deploy:** Vercel
- **Ícones:** Lucide React

---

## Design System

### Paleta de Cores

- **Primary (Azul Escuro):** `#0F1B2D` (fundos principais, textos)
- **Secondary (Azul Profundo):** `#1A2E4A` (cards, sidebar)
- **Accent Gold:** `#C9A84C` (CTAs, destaques, badges)
- **Accent Green:** `#2ECC71` (status de sucesso, confirmações)
- **Surface:** `#F8F9FC` (fundo das áreas de conteúdo)
- **White:** `#FFFFFF`
- **Muted:** `#8896A6` (textos secundários)
- **Border:** `#E2E8F0`
- **Danger:** `#E74C3C`

### Tipografia

- **Headings:** font-family moderna e com personalidade (sugestão: "Plus Jakarta Sans" ou "Outfit")
- **Body:** fonte clean e legível (sugestão: "DM Sans" ou "Satoshi")
- **Monospace (dados/valores):** "JetBrains Mono"

### Princípios de Design

- Visual limpo, espaçoso, com bastante white space
- Cards com bordas suaves (`rounded-xl`), sombras sutis
- Microanimações em hover e transições de página
- Ícones consistentes (Lucide)
- Sidebar escura contrastando com área de conteúdo clara
- Botões primários com gradiente dourado sutil
- Tom visual que remete a confiança, sofisticação e profissionalismo

---

## Estrutura de Páginas

### 1. Landing Page (`/`)

Página pública de apresentação do produto. Não requer autenticação.

#### Hero Section
- **Headline:** "Propostas comerciais que vendem — criadas por IA em minutos"
- **Subheadline:** "Pare de perder horas montando propostas. O PropostaAI analisa seu serviço, sugere o valor ideal e gera documentos profissionais que impressionam seus clientes."
- **CTA Principal:** Botão "Criar Minha Primeira Proposta Grátis" → leva para `/cadastro`
- **CTA Secundário:** "Ver Como Funciona" → scroll suave para seção de passos
- **Visual:** Mockup/ilustração da interface do dashboard ou de uma proposta gerada, com efeito de glassmorphism ou floating elements animados
- **Background:** Gradiente escuro (do azul primário para o secundário) com padrão geométrico sutil ou grid animado

#### Seção de Benefícios
Título: "Por que o PropostaAI?"

3 a 4 cards com ícones, cada um destacando:

1. **Economia de Tempo** — "Crie propostas completas em 5 minutos, não 5 horas"
2. **IA que Sugere Valores** — "Precificação inteligente baseada no escopo, mercado e complexidade do serviço"
3. **Propostas Profissionais** — "Documentos com visual impecável que transmitem credibilidade e autoridade"
4. **Templates por Nicho** — "Modelos prontos para desenvolvimento, design, marketing, consultoria e mais"

#### Seção Como Funciona
Título: "3 passos para uma proposta perfeita"

Apresentar em 3 colunas/steps com numeração visual (01, 02, 03):

1. **Preencha os Dados** — "Informe sobre seu cliente, o serviço oferecido e o escopo do projeto"
2. **A IA Analisa e Sugere** — "Nossa IA avalia tudo e sugere valor, estrutura e tom ideais para a proposta"
3. **Revise e Envie** — "Ajuste o que quiser, gere a proposta final em PDF e envie ao cliente"

Incluir uma animação ou diagrama de fluxo conectando os 3 passos.

#### Seção Social Proof (opcional para V1)
- Espaço reservado para depoimentos futuros
- Pode incluir: "Mais de X propostas geradas" (contador animado)
- Logos de "empresas que confiam" (placeholder)

#### CTA Final
- Background escuro com headline: "Pronto para transformar suas propostas?"
- Botão grande: "Começar Agora — É Grátis"
- Texto de apoio: "Sem cartão de crédito. Crie sua primeira proposta em minutos."

#### Footer
- Logo PropostaAI
- Links: Sobre, Preços, Contato, Termos de Uso, Política de Privacidade
- Copyright
- Redes sociais (ícones placeholder)

---

### 2. Página de Cadastro (`/cadastro`)

- Formulário centralizado em card elegante
- Campos: Nome completo, Email, Senha, Confirmar Senha
- Botão: "Criar Minha Conta"
- Link: "Já tem conta? Faça login"
- Após cadastro com sucesso → redireciona para `/dashboard`
- Integração com Supabase Auth (`signUp` com email e senha)
- Background: mesmo visual escuro da landing page (consistência)

### 3. Página de Login (`/login`)

- Formulário centralizado em card elegante
- Campos: Email, Senha
- Botão: "Entrar"
- Link: "Não tem conta? Cadastre-se"
- Link: "Esqueci minha senha" (pode ser implementado depois, mas o link já deve existir)
- Após login com sucesso → redireciona para `/dashboard`
- Integração com Supabase Auth (`signInWithPassword`)
- Background: mesmo visual escuro da landing page

---

### 4. Dashboard (`/dashboard`)

**Área protegida.** Requer autenticação. Se o usuário não estiver logado, redirecionar para `/login`.

#### Layout Geral

- **Sidebar fixa à esquerda** (largura ~260px, fundo azul escuro `#0F1B2D`)
- **Área de conteúdo principal** (fundo claro `#F8F9FC`)
- **Header superior** dentro da área de conteúdo (com nome do usuário, avatar, botão de logout)

#### Sidebar — Itens do Menu

Cada item com ícone Lucide + label:

1. **Dashboard** (`LayoutDashboard`) — `/dashboard`
2. **Nova Proposta** (`FilePlus`) — `/dashboard/nova-proposta`
3. **Histórico** (`History`) — `/dashboard/historico`
4. **Templates** (`LayoutTemplate`) — `/dashboard/templates`
5. **Configurações** (`Settings`) — `/dashboard/configuracoes`

- Logo do PropostaAI no topo da sidebar
- Item ativo destacado com fundo mais claro e borda lateral accent gold
- Botão "Nova Proposta" pode aparecer também como destaque especial no topo da sidebar (com ícone + e fundo dourado)

#### Área Principal — Dashboard Home

**Header da página:**
- "Bem-vindo de volta, {nome}!" como saudação
- Botão "Nova Proposta" destacado (accent gold, com ícone)

**Cards de Resumo (KPIs):**
4 cards em grid horizontal:
1. **Total de Propostas** — número total criado pelo usuário
2. **Este Mês** — propostas criadas no mês atual
3. **Finalizadas** — propostas com status "finalizada"
4. **Rascunhos** — propostas com status "rascunho"

Cada card com ícone, número grande, label e variação percentual (pode ser placeholder por enquanto).

**Tabela de Últimas Propostas:**
- Colunas: Nome do Cliente, Empresa, Valor Sugerido, Status (badge colorido), Data de Criação, Ações (visualizar/editar)
- Status badges:
  - Rascunho → cinza
  - Preview (IA gerou sugestão) → azul
  - Finalizada → verde
- Se não houver propostas: estado vazio com ilustração + texto "Nenhuma proposta ainda. Crie sua primeira!" + botão CTA

#### Páginas Internas (Estrutura Base)

As páginas abaixo devem existir com layout funcional (sidebar + header), mas o conteúdo interno pode ser um placeholder com título da página e mensagem "Em construção — em breve!":

- `/dashboard/nova-proposta` — Página onde o usuário cria uma nova proposta (será construída depois)
- `/dashboard/historico` — Lista completa de todas as propostas
- `/dashboard/templates` — Biblioteca de templates por nicho
- `/dashboard/configuracoes` — Dados do perfil, empresa, logo, cores da marca

---

## Banco de Dados — Supabase (PostgreSQL)

### Tabela: `profiles`

Estende os dados do `auth.users` do Supabase.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` PK | Mesmo ID do auth.users (referência) |
| `full_name` | `text` | Nome completo do usuário |
| `email` | `text` | Email (espelhado do auth) |
| `company_name` | `text` NULL | Nome da empresa do usuário |
| `company_document` | `text` NULL | CNPJ ou documento |
| `company_address` | `text` NULL | Endereço completo |
| `phone` | `text` NULL | Telefone comercial |
| `website` | `text` NULL | Site da empresa |
| `company_logo_url` | `text` NULL | URL da logo da empresa (Supabase Storage) |
| `brand_primary_color` | `text` NULL | Cor primária da marca (hex) |
| `brand_secondary_color` | `text` NULL | Cor secundária da marca (hex) |
| `brand_font` | `text` NULL | Fonte preferida |
| `default_tone` | `text` NULL | Tom padrão das propostas |
| `default_currency` | `text` NULL | Moeda padrão (ex: BRL, USD) |
| `default_expiration_days` | `integer` NULL | Prazo de validade padrão (dias) |
| `default_payment_terms` | `text` NULL | Condições de pagamento padrão |
| `default_terms_conditions` | `text` NULL | Texto padrão de termos e condições |
| `digital_signature_url` | `text` NULL | Link/assinatura digital |
| `professional_description` | `text` NULL | Descrição curta da empresa/profissional |
| `main_services` | `text` NULL | Principais serviços oferecidos |
| `professional_differentials` | `text` NULL | Diferenciais da concorrência |
| `portfolio_links` | `text` NULL | Cases de sucesso ou portfólio |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data de atualização |

**RLS:** Usuário só acessa/edita seu próprio perfil.

**Trigger:** Ao criar um novo user em `auth.users`, criar automaticamente um registro em `profiles` com `id` e `email`.

### Tabela: `proposals`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` PK | ID da proposta |
| `user_id` | `uuid` FK → profiles.id | Dono da proposta |
| `status` | `text` | `draft` / `preview` / `finalized` |
| `title` | `text` NULL | Título da proposta (ex: "Proposta para Website Corporativo") |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data de atualização |
| `finalized_at` | `timestamptz` NULL | Data de finalização |

**RLS:** Usuário só acessa suas próprias propostas.

### Tabela: `proposal_clients`

Dados do cliente para quem a proposta é destinada.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` PK | ID do registro |
| `proposal_id` | `uuid` FK → proposals.id (UNIQUE) | Proposta relacionada |
| `client_name` | `text` | Nome do contato/cliente |
| `client_company` | `text` NULL | Empresa do cliente |
| `client_email` | `text` NULL | Email do cliente |
| `client_phone` | `text` NULL | Telefone do cliente |
| `client_notes` | `text` NULL | Notas adicionais sobre o cliente |

**RLS:** Herda acesso via proposal → user_id.

### Tabela: `proposal_services`

Detalhes do serviço/projeto que está sendo proposto.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` PK | ID do registro |
| `proposal_id` | `uuid` FK → proposals.id (UNIQUE) | Proposta relacionada |
| `service_description` | `text` | Descrição do serviço/projeto |
| `scope` | `text` NULL | Escopo detalhado (o que está incluído) |
| `deliverables` | `text` NULL | Entregáveis listados |
| `estimated_hours` | `integer` NULL | Horas estimadas |
| `deadline` | `text` NULL | Prazo de entrega (texto livre ou data) |
| `complexity` | `text` NULL | `low` / `medium` / `high` |
| `category` | `text` NULL | Nicho/categoria (desenvolvimento, design, marketing, consultoria, etc.) |

**RLS:** Herda acesso via proposal → user_id.

### Tabela: `proposal_ai_suggestions`

O que a IA sugeriu para a proposta (valor, estrutura, tom).

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` PK | ID do registro |
| `proposal_id` | `uuid` FK → proposals.id (UNIQUE) | Proposta relacionada |
| `suggested_value` | `numeric` NULL | Valor sugerido pela IA (R$) |
| `suggested_value_min` | `numeric` NULL | Faixa mínima sugerida |
| `suggested_value_max` | `numeric` NULL | Faixa máxima sugerida |
| `suggested_structure` | `jsonb` NULL | Estrutura sugerida (seções da proposta em JSON) |
| `suggested_tone` | `text` NULL | Tom sugerido: `formal` / `friendly` / `persuasive` / `technical` |
| `reasoning` | `text` NULL | Justificativa da IA para as sugestões |
| `user_approved` | `boolean` DEFAULT false | Se o usuário aprovou a sugestão |
| `user_adjusted_value` | `numeric` NULL | Valor final definido pelo usuário (se diferente) |
| `user_adjusted_tone` | `text` NULL | Tom final escolhido (se diferente) |
| `created_at` | `timestamptz` | Data da sugestão |

**RLS:** Herda acesso via proposal → user_id.

### Tabela: `proposal_finals`

A proposta final gerada pela IA após aprovação das sugestões.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` PK | ID do registro |
| `proposal_id` | `uuid` FK → proposals.id (UNIQUE) | Proposta relacionada |
| `final_content` | `text` | Conteúdo completo da proposta (Markdown ou HTML) |
| `final_value` | `numeric` | Valor final da proposta |
| `pdf_url` | `text` NULL | URL do PDF gerado (Supabase Storage) |
| `version` | `integer` DEFAULT 1 | Versão (caso o usuário regere) |
| `created_at` | `timestamptz` | Data da geração |

**RLS:** Herda acesso via proposal → user_id.

### Tabela: `templates`

Templates de proposta salvos por nicho para reutilização.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` PK | ID do template |
| `user_id` | `uuid` FK → profiles.id NULL | NULL = template global do sistema |
| `name` | `text` | Nome do template |
| `category` | `text` | Nicho/categoria (desenvolvimento, design, marketing, etc.) |
| `description` | `text` NULL | Descrição do template |
| `structure` | `jsonb` | Estrutura de seções do template |
| `default_tone` | `text` NULL | Tom padrão do template |
| `is_system` | `boolean` DEFAULT false | Se é template do sistema (não editável) |
| `created_at` | `timestamptz` | Data de criação |

**RLS:** Templates do sistema visíveis a todos. Templates do usuário visíveis apenas ao dono.

---

## Row Level Security (RLS) — Políticas

### profiles
- `SELECT`: `auth.uid() = id`
- `UPDATE`: `auth.uid() = id`
- `INSERT`: via trigger automático apenas

### proposals
- `SELECT`: `auth.uid() = user_id`
- `INSERT`: `auth.uid() = user_id`
- `UPDATE`: `auth.uid() = user_id`
- `DELETE`: `auth.uid() = user_id`

### proposal_clients, proposal_services, proposal_ai_suggestions, proposal_finals
- Todas as operações: verificar que o `proposal_id` pertence ao `auth.uid()` via JOIN com `proposals`

### templates
- `SELECT`: `is_system = true OR user_id = auth.uid()`
- `INSERT`: `auth.uid() = user_id`
- `UPDATE`: `auth.uid() = user_id AND is_system = false`
- `DELETE`: `auth.uid() = user_id AND is_system = false`

---

## Trigger de Criação de Perfil

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## Autenticação — Fluxo

### Cadastro
1. Usuário preenche: nome, email, senha
2. Frontend chama `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`
3. Trigger cria registro em `profiles`
4. Redireciona para `/dashboard`

### Login
1. Usuário preenche: email, senha
2. Frontend chama `supabase.auth.signInWithPassword({ email, password })`
3. Sucesso → redireciona para `/dashboard`
4. Erro → exibe mensagem

### Proteção de Rotas
- Todas as rotas `/dashboard/*` verificam sessão ativa
- Se não autenticado → redireciona para `/login`
- Usar middleware do Next.js ou verificação client-side com `supabase.auth.getSession()`

### Logout
- Botão no header do dashboard
- Chama `supabase.auth.signOut()`
- Redireciona para `/`

---

## Fluxo de Criação de Proposta (Visão Geral)

> Este fluxo será implementado em fases futuras, mas o banco de dados e a arquitetura já suportam tudo.

### Passo 1 — Preencher Dados
O usuário preenche um formulário com:
- Dados do cliente (nome, empresa, email)
- Descrição do serviço
- Escopo e entregáveis
- Prazo estimado
- Complexidade
- Categoria/nicho

Salva como `proposal` com status `draft`, cria registros em `proposal_clients` e `proposal_services`.

### Passo 2 — IA Analisa e Sugere
- Frontend envia os dados para API Route do Next.js
- API Route chama Claude API com prompt estruturado contendo todas as informações
- Claude retorna: valor sugerido (faixa), estrutura de seções recomendada, tom ideal, justificativa
- Salva em `proposal_ai_suggestions`
- Atualiza status para `preview`
- Usuário visualiza as sugestões e pode ajustar valor e tom

### Passo 3 — Gerar Proposta Final
- Usuário aprova (com ou sem ajustes)
- Frontend envia dados aprovados + ajustes para API Route
- Claude gera o texto completo da proposta em formato profissional
- Salva em `proposal_finals`
- Atualiza status para `finalized`
- Usuário pode visualizar, editar texto manualmente, e exportar como PDF

---

## Estrutura de Pastas do Projeto

```
propostaai/
├── app/
│   ├── layout.tsx                    # Layout raiz (fontes, metadata)
│   ├── page.tsx                      # Landing Page
│   ├── login/
│   │   └── page.tsx                  # Página de Login
│   ├── cadastro/
│   │   └── page.tsx                  # Página de Cadastro
│   └── dashboard/
│       ├── layout.tsx                # Layout do Dashboard (sidebar + header)
│       ├── page.tsx                  # Dashboard Home
│       ├── nova-proposta/
│       │   └── page.tsx              # Nova Proposta (placeholder)
│       ├── historico/
│       │   └── page.tsx              # Histórico (placeholder)
│       ├── templates/
│       │   └── page.tsx              # Templates (placeholder)
│       └── configuracoes/
│           └── page.tsx              # Configurações (placeholder)
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── landing/                      # Componentes da landing page
│   │   ├── Hero.tsx
│   │   ├── Benefits.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── FinalCTA.tsx
│   │   └── Footer.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   └── dashboard/
│       ├── Sidebar.tsx
│       ├── DashboardHeader.tsx
│       ├── StatsCards.tsx
│       └── ProposalsTable.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Supabase browser client
│   │   ├── server.ts                 # Supabase server client
│   │   └── middleware.ts             # Auth middleware
│   └── utils.ts                      # Utilitários gerais
├── types/
│   └── database.ts                   # Tipos TypeScript do banco
├── middleware.ts                      # Next.js middleware (proteção de rotas)
└── .env.local                        # Variáveis de ambiente
```

---

## Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Prioridade de Implementação

### Fase 1 — MVP (Esta Entrega)
1. ✅ Landing page completa e responsiva
2. ✅ Sistema de cadastro e login com Supabase Auth
3. ✅ Banco de dados com todas as tabelas, RLS e trigger
4. ✅ Dashboard com layout (sidebar + header + KPIs + tabela)
5. ✅ Páginas internas placeholder
6. ✅ Proteção de rotas autenticadas

### Fase 2 — Criação de Propostas
7. Formulário de nova proposta (multi-step)
8. Integração com Claude API para sugestões
9. Tela de preview das sugestões da IA
10. Geração da proposta final

### Fase 3 — Experiência Completa
11. Exportação para PDF
12. Biblioteca de templates por nicho
13. Configurações do perfil (logo, cores da marca)
14. Histórico com filtros e busca

### Fase 4 — Crescimento
15. Planos pagos (Stripe)
16. Templates premium
17. Análise de performance das propostas
18. Compartilhamento de proposta via link público
