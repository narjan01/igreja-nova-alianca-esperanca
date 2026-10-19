import { AuthUser, UserRole } from '../types';
import { getSupabase } from './supabase';

const STORAGE_KEY = 'ina_auth_user_session';

async function computeSha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message.trim());
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Hashes criptográficos de contingência offline
const OFFLINE_ROLE_HASHES: Record<string, { hash: string; user: AuthUser }> = {
  admin: {
    hash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
    user: {
      id: 'usr_admin',
      username: 'admin',
      name: 'Administrador Geral',
      email: 'admin@novaliancaesperancajp.com.br',
      role: 'admin',
      isLouvorMember: true
    }
  },
  pastor: {
    hash: 'a3d0f04c643b44b25dfc558b387ba13697ebba3e18a4a27546ef27d0c3eb1dfd',
    user: {
      id: 'usr_pastor',
      username: 'pastor',
      name: 'Pastor Ministerial',
      email: 'pastor@novaliancaesperancajp.com.br',
      role: 'pastor',
      isLouvorMember: true
    }
  },
  'supervisor.jovens': {
    hash: '57562089408bcf15ab54cb72cf7c865181dc225c572a159f8a329d479155b111',
    user: {
      id: 'usr_sup_jovens',
      username: 'supervisor.jovens',
      name: 'Gilson Nóbrega (Sup. Jovens/Adolescentes)',
      email: 'gilson.nobrega006@gmail.com',
      role: 'supervisor',
      network: 'Jovens',
      supervisorName: 'Gilson Antonio de Araújo Nóbrega',
      isLouvorMember: false
    }
  },
  'supervisor.adultos': {
    hash: '57562089408bcf15ab54cb72cf7c865181dc225c572a159f8a329d479155b111',
    user: {
      id: 'usr_sup_adultos',
      username: 'supervisor.adultos',
      name: 'Aurenir & Glefeston (Sup. Adultos)',
      email: 'aureniraraujo28@gmail.com',
      role: 'supervisor',
      network: 'Adultos',
      supervisorName: 'Aurenir',
      isLouvorMember: false
    }
  },
  louvor: {
    hash: 'a575a7fc4d6e90141b7dd6158e87adbf61b96a84c688cff846e49e29a9a0f5d5',
    user: {
      id: 'usr_louvor',
      username: 'louvor',
      name: 'Ministério de Louvor',
      email: 'louvor@novaliancaesperancajp.com.br',
      role: 'louvor',
      isLouvorMember: true
    }
  }
};

export class AuthService {
  static async login(identifier: string, pass: string): Promise<{ success: boolean; user?: AuthUser; message?: string }> {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: 'Informe o usuário e a senha.' };
    }

    try {
      const inputHash = await computeSha256(cleanPass);

      // 1. Tentar autenticação via Supabase
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('app_users')
          .select('*')
          .or(`username.ilike.${cleanId},email.ilike.${cleanId}`)
          .limit(1);

        if (!error && data && data.length > 0) {
          const dbUser = data[0];
          if (dbUser.password_hash === inputHash) {
            const authUser: AuthUser = {
              id: dbUser.id,
              username: dbUser.username,
              name: dbUser.name,
              email: dbUser.email,
              role: dbUser.role as UserRole,
              network: dbUser.network,
              supervisorName: dbUser.supervisor_name,
              isLouvorMember: dbUser.is_louvor_member
            };
            this.setCurrentUser(authUser);
            return { success: true, user: authUser };
          }
        }
      }

      // 2. Fallback de contingência por hash
      const fallback = OFFLINE_ROLE_HASHES[cleanId];
      if (fallback && fallback.hash === inputHash) {
        this.setCurrentUser(fallback.user);
        return { success: true, user: fallback.user };
      }

      return { success: false, message: 'Usuário ou senha incorretos.' };
    } catch (err) {
      console.error('Erro na autenticação:', err);
      return { success: false, message: 'Falha ao autenticar. Tente novamente.' };
    }
  }

  static getCurrentUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as AuthUser;
      }
    } catch {
      // Ignora falhas de parse
    }
    return null;
  }

  static setCurrentUser(user: AuthUser): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Erro ao salvar sessão local:', e);
    }
  }

  static logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignora
    }
  }

  static hasAccess(user: AuthUser | null, module: 'igreja' | 'redes' | 'celulas' | 'louvor'): boolean {
    if (!user) return false;
    if (user.role === 'admin') return true;

    switch (module) {
      case 'igreja':
        return user.role === 'pastor';
      case 'redes':
        return user.role === 'supervisor';
      case 'celulas':
        return user.role === 'pastor' || user.role === 'supervisor' || user.role === 'leader';
      case 'louvor':
        return user.role === 'louvor' || Boolean(user.isLouvorMember);
      default:
        return false;
    }
  }

  static getRoleLabel(role: UserRole): string {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'pastor':
        return 'Pastor';
      case 'supervisor':
        return 'Supervisor de Rede';
      case 'leader':
        return 'Líder de Célula';
      case 'louvor':
        return 'Ministério de Louvor';
      default:
        return role;
    }
  }
}
