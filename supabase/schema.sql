-- =========================================================================
-- ESQUEMA DO SUPABASE: IGREJA NOVA ALIANÇA ESPERANÇA (INA ESPERANÇA JP)
-- Integração de Membros e Células via inChurch API
-- =========================================================================

-- 1. TABELA DE MEMBROS E VISITANTES (inChurch People)
CREATE TABLE IF NOT EXISTS public.members (
    id BIGINT PRIMARY KEY,                             -- ID oficial da inChurch (ex: 5531926)
    full_name TEXT NOT NULL,                           -- Nome completo
    photo TEXT,                                        -- URL da foto de perfil
    status TEXT DEFAULT 'approved',                    -- Status de aprovação (approved, pending, etc.)
    church_profile TEXT,                               -- Perfil (member, visitor, etc.)
    is_pastor BOOLEAN DEFAULT false,
    is_leader BOOLEAN DEFAULT false,
    gender TEXT,                                       -- male, female
    birthday DATE,                                     -- Data de nascimento
    cpf TEXT,
    rg TEXT,
    baptized BOOLEAN DEFAULT false,                    -- É batizado?
    baptism_date DATE,
    marital_status TEXT,                               -- single, married, etc.
    marriage_date DATE,
    email TEXT,
    phone TEXT,
    mobile_phone TEXT,                                 -- Celular principal
    has_whatsapp BOOLEAN DEFAULT false,
    membership_number TEXT,                            -- Número da membresia
    occupation TEXT,                                   -- Profissão
    membership_type TEXT,                              -- reconciliation, transfer, baptism, etc.
    location JSONB DEFAULT '{}'::jsonb,                -- Endereço, bairro, CEP, cidade
    roles JSONB DEFAULT '[]'::jsonb,                   -- Cargos e ministérios
    is_active BOOLEAN DEFAULT true,
    raw_data JSONB,                                    -- Dados brutos completos da inChurch
    synced_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para busca rápida de membros
CREATE INDEX IF NOT EXISTS idx_members_name ON public.members (full_name);
CREATE INDEX IF NOT EXISTS idx_members_mobile ON public.members (mobile_phone);
CREATE INDEX IF NOT EXISTS idx_members_church_profile ON public.members (church_profile);
CREATE INDEX IF NOT EXISTS idx_members_is_active ON public.members (is_active);

-- 2. TABELA DE CÉLULAS (inChurch Cells)
CREATE TABLE IF NOT EXISTS public.cells (
    id BIGINT PRIMARY KEY,                             -- ID oficial da célula na inChurch (ex: 57119)
    name TEXT NOT NULL,                                -- Nome da Célula (ex: Célula Ágape)
    image TEXT,                                        -- Foto da Célula
    category TEXT,                                     -- Adultos, Crianças, Jovens, etc.
    leaders JSONB DEFAULT '[]'::jsonb,                 -- Lista de Líderes com contatos
    supervisors JSONB DEFAULT '[]'::jsonb,             -- Lista de Supervisores
    auxiliaries JSONB DEFAULT '[]'::jsonb,             -- Auxiliares
    weekdays JSONB DEFAULT '[]'::jsonb,                -- Dias da semana (ex: ["Sexta-feira"])
    frequency INTEGER DEFAULT 0,                       -- Frequência média
    location JSONB DEFAULT '{}'::jsonb,                -- Detalhes de localização
    address TEXT,                                      -- Endereço formatado (Rua, Número, Bairro, CEP)
    latitude NUMERIC,
    longitude NUMERIC,
    raw_data JSONB,
    synced_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para células
CREATE INDEX IF NOT EXISTS idx_cells_name ON public.cells (name);
CREATE INDEX IF NOT EXISTS idx_cells_category ON public.cells (category);

-- 3. TABELA DE VÍNCULO MEMBRO <-> CÉLULA (Cell Memberships)
CREATE TABLE IF NOT EXISTS public.cell_members (
    id BIGSERIAL PRIMARY KEY,
    cell_id BIGINT REFERENCES public.cells(id) ON DELETE CASCADE,
    member_id BIGINT REFERENCES public.members(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',                        -- leader, supervisor, member, trainee
    joined_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(cell_id, member_id)
);

-- 4. TABELA DE STATUS DE SINCRONIZAÇÃO
CREATE TABLE IF NOT EXISTS public.sync_status (
    resource TEXT PRIMARY KEY,                         -- 'members', 'cells', etc.
    last_sync TIMESTAMPTZ DEFAULT now(),
    total_records INTEGER DEFAULT 0,
    status TEXT DEFAULT 'success',
    message TEXT
);

-- HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cell_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_status ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACESSO (Permitir leitura e escrita para chaves autorizadas)
DROP POLICY IF EXISTS "Permitir leitura publica de membros" ON public.members;
CREATE POLICY "Permitir leitura publica de membros" ON public.members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir manipulacao de membros" ON public.members;
CREATE POLICY "Permitir manipulacao de membros" ON public.members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura publica de celulas" ON public.cells;
CREATE POLICY "Permitir leitura publica de celulas" ON public.cells FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir manipulacao de celulas" ON public.cells;
CREATE POLICY "Permitir manipulacao de celulas" ON public.cells FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura de cell_members" ON public.cell_members;
CREATE POLICY "Permitir leitura de cell_members" ON public.cell_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir manipulacao de cell_members" ON public.cell_members;
CREATE POLICY "Permitir manipulacao de cell_members" ON public.cell_members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura e escrita de sync_status" ON public.sync_status;
CREATE POLICY "Permitir leitura e escrita de sync_status" ON public.sync_status FOR ALL USING (true) WITH CHECK (true);
