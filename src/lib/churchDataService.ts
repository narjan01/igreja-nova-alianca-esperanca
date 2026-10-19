import { getSupabase } from './supabase';
import { ChurchMember, ChurchCell, ChurchEvent } from '../types';

export class ChurchDataService {
  /**
   * Busca eventos/cultos do Supabase (com cache local)
   */
  static async getEvents(): Promise<ChurchEvent[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('id', { ascending: false });

        if (!error && data && data.length > 0) {
          localStorage.setItem('cached_church_events', JSON.stringify(data));
          return data as ChurchEvent[];
        }
      } catch (e) {
        console.warn('Erro ao carregar eventos do Supabase:', e);
      }
    }

    // Fallback: cache local
    const cached = localStorage.getItem('cached_church_events');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }

    return [];
  }

  /**
   * Busca membros do Supabase (com cache local)
   */
  static async getMembers(): Promise<ChurchMember[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .order('full_name', { ascending: true });

        if (!error && data && data.length > 0) {
          localStorage.setItem('cached_church_members', JSON.stringify(data));
          return data as ChurchMember[];
        }
      } catch (e) {
        console.warn('Erro ao carregar membros do Supabase:', e);
      }
    }

    // Fallback: cache local
    const cached = localStorage.getItem('cached_church_members');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }

    return [];
  }

  /**
   * Busca células do Supabase (com cache local)
   */
  static async getCells(): Promise<ChurchCell[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('cells')
          .select('*')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          localStorage.setItem('cached_church_cells', JSON.stringify(data));
          return data as ChurchCell[];
        }
      } catch (e) {
        console.warn('Erro ao carregar células do Supabase:', e);
      }
    }

    // Fallback: cache local
    const cached = localStorage.getItem('cached_church_cells');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }

    return [];
  }

  /**
   * Salva ou atualiza membros no Supabase
   */
  static async upsertMembers(members: ChurchMember[]): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from('members').upsert(members);
      if (error) {
        console.error('Erro ao fazer upsert de membros no Supabase:', error);
        return false;
      }
      localStorage.setItem('cached_church_members', JSON.stringify(members));
      return true;
    } catch (e) {
      console.error('Falha no upsert de membros:', e);
      return false;
    }
  }

  /**
   * Salva ou atualiza células no Supabase
   */
  static async upsertCells(cells: ChurchCell[]): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from('cells').upsert(cells);
      if (error) {
        console.error('Erro ao fazer upsert de células no Supabase:', error);
        return false;
      }
      localStorage.setItem('cached_church_cells', JSON.stringify(cells));
      return true;
    } catch (e) {
      console.error('Falha no upsert de células:', e);
      return false;
    }
  }

  /**
   * Formata telefone para link direto do WhatsApp
   */
  static formatWhatsAppUrl(phone: string | null | undefined, message: string = ''): string | null {
    if (!phone) return null;
    const clean = phone.replace(/\D/g, '');
    if (!clean) return null;
    const full = clean.startsWith('55') ? clean : `55${clean}`;
    const text = message ? `?text=${encodeURIComponent(message)}` : '';
    return `https://wa.me/${full}${text}`;
  }

  /**
   * Verifica se o membro faz aniversário no mês atual
   */
  static isBirthdayInCurrentMonth(birthday: string | null | undefined): boolean {
    if (!birthday) return false;
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const parts = birthday.split('-');
    if (parts.length >= 2) {
      const bMonth = parseInt(parts[1], 10);
      return bMonth === currentMonth;
    }
    return false;
  }
}
