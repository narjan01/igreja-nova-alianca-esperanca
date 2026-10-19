# ⛪ Igreja Nova Aliança Esperança — João Pessoa / PB
> **Site Institucional Oficial & Painel Restrito de Gestão de Membros e Células**  
> Integrado à **inChurch Public API** e banco de dados **Supabase (PostgreSQL)**, com submódulo de gestão do **Portal do Louvor**.

---

## 🌟 Visão Geral do Projeto

Este projeto é o sistema web principal da **Igreja Nova Aliança Esperança** em João Pessoa / PB (bairro de Gramame). O portal possui duas grandes áreas:

1. **🌐 Área Pública (Site Institucional)**:
   * Apresentação da igreja, valores e recepção a visitantes.
   * Programação semanal dos cultos (Domingo Manhã, Domingo Noite e Quarta-feira).
   * Localização geográfica, canais oficiais e link para o Portal de Louvor.
   * Acesso seguro à Área Restrita da Liderança.

2. **🔒 Área Restrita (Painel Administrativo da Liderança)**:
   * **Controle de Membros**: Sincronizado com a base inChurch (270 membros cadastrados), com busca rápida, fotos, aniversariantes do mês, status de batismo e botão 1-clique para conversar no WhatsApp.
   * **Controle de Células**: Visualização dos 16 pequenos grupos/células ativas em João Pessoa, líderes, supervisores, endereços e rota no Google Maps.
   * **Submódulo Portal do Louvor**: Recibos de mensalidades, fundo de confraternização, escalas de ministração sincronizadas com o LouveApp e chamadas de ensaio.

---

## 🚀 Tecnologias

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Banco de Dados**: Supabase (PostgreSQL com Row Level Security)
- **Integrações de API**:
  - **inChurch API**: Gestão de Membros (`/v1/people/`) e Células (`/v1/cell/`)
  - **Supabase**: Armazenamento relacional e cache de alta performance
  - **LouveApp API**: Sincronização de escalas de louvor
  - **Mercado Pago API**: Arrecadações e PIX dinâmico
  - **Google Maps**: Rota direta para os endereços das células

---

## 📁 Estrutura de Pastas

```text
├── src/
│   ├── components/
│   │   ├── ChurchLandingPage.tsx    # Site institucional público da igreja
│   │   ├── AdminPanel.tsx           # Painel unificado da Área Restrita
│   │   ├── MembersManagement.tsx    # Controle e filtros dos 270 membros inChurch
│   │   ├── CellsManagement.tsx      # Gestão das 16 células com líderes e mapa
│   │   ├── FinanceiroTab.tsx        # Controle de mensalidades do Louvor
│   │   ├── ConfraTab.tsx            # Fundo de confraternização
│   │   ├── AgendaTab.tsx            # Escalas LouveApp e presenças
│   │   ├── GitHubTab.tsx            # Conexão e teste Supabase/GitHub
│   │   └── AdminModal.tsx           # Modal de autenticação da liderança
│   ├── lib/
│   │   ├── supabase.ts              # Cliente Supabase configurado
│   │   ├── churchDataService.ts     # Serviços de Membros e Células
│   │   ├── dataStore.ts             # Persistência do Louvor
│   │   └── services.ts              # Utilitários PIX e formatações
│   ├── types/                       # Tipagens TypeScript (ChurchMember, ChurchCell, etc.)
│   ├── App.tsx                      # Roteador principal
│   └── main.tsx
├── supabase/
│   └── schema.sql                   # Script SQL com tabelas de membros, células e RLS
├── scripts/
│   └── sync_inchurch.py             # Script de sincronização automática inChurch -> Supabase
├── .env.example                     # Modelo de variáveis de ambiente
└── package.json
```

---

## ⚡ Como Rodar Localmente

1. **Clone o repositório:**
```bash
git clone https://github.com/narjan01/igreja-nova-alianca-esperanca.git
cd igreja-nova-alianca-esperanca
```

2. **Instale as dependências:**
```bash
npm install --legacy-peer-deps
```

3. **Crie seu arquivo `.env`:**
```env
VITE_SUPABASE_URL=https://yzfklvqyveugjlbissmq.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_TQjjlByEUZFuFkJ5NqLP9Q_ND6u4VOz
INCHURCH_API_KEY=36e07f73-f366-498f-81a9-6c237e29d42d
INCHURCH_API_SECRET=eyD00jqlxxMH5pk7l8UvdDsZSiMi2o8YA0jDCGMoTXg63JP1hjKnNmMFzpI673yB
```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```
Acesse no navegador: `http://localhost:3000`

---

## 🗄️ Configuração do Banco de Dados no Supabase

1. Acesse o seu painel do Supabase: [https://supabase.com/dashboard/project/yzfklvqyveugjlbissmq](https://supabase.com/dashboard/project/yzfklvqyveugjlbissmq)
2. Vá em **SQL Editor** no menu lateral.
3. Abra o arquivo [`supabase/schema.sql`](./supabase/schema.sql), copie todo o conteúdo e clique em **Run**.
4. As tabelas `members`, `cells`, `cell_members` e `sync_status` serão criadas com índices e políticas de segurança (RLS).

---

## 🔄 Sincronização inChurch -> Supabase

Para sincronizar todos os 270 membros e 16 células diretamente para o banco do Supabase, execute o script:

```bash
python scripts/sync_inchurch.py
```

---

## 🔐 Senha Padrão de Acesso à Área Restrita

* Senha master da liderança: `admin123`
*(Permite acesso completo ao Painel de Membros, Células e Módulo Financeiro)*.
