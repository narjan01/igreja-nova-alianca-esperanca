export type StatusPagamento = 'Pendente' | 'Pago' | 'Isento';
export type StatusFrequencia = 'Pendente' | 'Presente' | 'Falta';
export type CategoriaEvento = 'Reunião Geral' | 'Reunião' | 'Ensaio' | 'Comunhão' | 'Culto' | 'Confraternização' | 'Escala LouveApp';

export interface Membro {
  id: string;
  nome: string;
  funcao: string;
  ativo?: boolean;
  telefone?: string;
  statusMes?: StatusPagamento;
}

export interface Mensalidade {
  id: string;
  membro_id: string;
  mes: number;
  ano: number;
  status: StatusPagamento;
  valor: number;
  data_pagamento?: string;
}

export interface Transacao {
  id: string;
  tipo: 'DESPESA' | 'OFERTA';
  descricao: string;
  valor: number;
  mes: number;
  ano: number;
  created_at?: string;
}

export interface EventoAgenda {
  id: string;
  titulo: string;
  data: string; // YYYY-MM-DD
  dataFormatada: string; // DD/MM/YYYY
  mes: number;
  dia: number;
  categoria: CategoriaEvento;
  escalados?: string; // Nomes separados por vírgula
  gcal?: string;
  isApi?: boolean;
}

export interface ItemFrequencia {
  membro_id: string;
  nome: string;
  funcao?: string;
  status: StatusFrequencia;
  modificado?: boolean;
}

export interface ParticipanteConfra {
  id: string;
  nome: string;
  convidadoPor?: string;
  parentesco?: string;
  set: StatusPagamento;
  out: StatusPagamento;
  nov: StatusPagamento;
}

export interface PixInfo {
  payment_id: string;
  qr_code: string;
  qr_code_base64: string;
  valor: number;
  nome: string;
  descricao: string;
  mes?: number | number[];
  tipo: 'mensal' | 'confra';
  membro_id?: string;
}

export interface ChurchMemberRole {
  role: {
    id: number;
    name: string;
  };
  start_date?: string | null;
  is_active: boolean;
}

export interface ChurchMemberLocation {
  postal_code?: string | null;
  street_address?: string | null;
  street_number?: string | null;
  city?: string | null;
  state?: string | null;
  neighborhood?: string | null;
  address_complement?: string | null;
  country?: string | null;
}

export interface ChurchMember {
  id: number | string;
  full_name: string;
  photo?: string | null;
  status?: string | null;
  church_profile?: 'member' | 'visitor' | 'leader' | string | null;
  is_pastor?: boolean;
  is_leader?: boolean;
  gender?: 'male' | 'female' | string | null;
  birthday?: string | null;
  cpf?: string | null;
  rg?: string | null;
  baptized?: boolean | null;
  baptism_date?: string | null;
  marital_status?: string | null;
  marriage_date?: string | null;
  email?: string | null;
  phone?: string | null;
  mobile_phone?: string | null;
  has_whatsapp?: boolean;
  membership_number?: string | number | null;
  occupation?: string | null;
  membership_type?: string | null;
  location?: ChurchMemberLocation | null;
  roles?: ChurchMemberRole[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  synced_at?: string;
}

export interface CellLeader {
  name: string;
  phone?: string | null;
  email?: string | null;
}

export interface ChurchCell {
  id: number | string;
  name: string;
  image?: string | null;
  category?: string | null;
  leaders?: CellLeader[];
  supervisors?: CellLeader[];
  auxiliaries?: CellLeader[];
  weekdays?: string[];
  frequency?: number;
  location?: {
    country?: string;
    state?: string;
    city?: string;
    zip_code?: string;
    address?: string;
    address_number?: string;
    address_complement?: string | null;
    neighborhood?: string;
    latitude?: number;
    longitude?: number;
  };
  address?: string;
  latitude?: number;
  longitude?: number;
  synced_at?: string;
}

export interface ChurchEvent {
  id: number | string;
  title: string;
  image?: string | null;
  thumbnail?: string | null;
  description: string;
  start_datetime?: string | null;
  end_datetime?: string | null;
  location?: {
    address?: string | null;
    city?: string | null;
    state?: string | null;
    neighborhood?: string | null;
    name?: string | null;
  } | null;
  category?: string | null;
  public_url?: string | null;
  show_on_site?: boolean;
  highlighted?: boolean;
  synced_at?: string;
}

export type UserRole = 'admin' | 'pastor' | 'supervisor' | 'leader' | 'louvor';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  network?: string; // Ex: 'Jovens', 'Adultos', 'Adolescentes', 'Mulheres', etc.
  supervisorName?: string;
  isLouvorMember?: boolean; // Usuário também pode pertencer ao louvor
  photo?: string;
}


export interface ChurchWord {
  id: string;
  title: string;
  subtitle?: string;
  preacher: string;
  preacherRole?: string;
  date: string;
  reference?: string;
  image?: string;
  category: string;
  summary: string;
  content: string;
  audioUrl?: string;
  videoUrl?: string;
}

export interface ChurchNews {
  id: string;
  title: string;
  date: string;
  category: string;
  badge?: string;
  image?: string;
  summary: string;
  content: string;
  author?: string;
  featured?: boolean;
}
