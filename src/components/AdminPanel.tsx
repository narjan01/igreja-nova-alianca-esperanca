import React, { useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../types';
import { AuthService } from '../lib/authService';
import { MembersManagement } from './MembersManagement';
import { CellsManagement } from './CellsManagement';
import { NetworksManagement } from './NetworksManagement';
import { EventsManagement } from './EventsManagement';
import { FinanceiroTab } from './FinanceiroTab';
import { ConfraTab } from './ConfraTab';
import { AgendaTab } from './AgendaTab';
import { GitHubTab } from './GitHubTab';
import { 
  Users, 
  Home, 
  Calendar,
  Music, 
  Receipt, 
  PartyPopper, 
  CalendarDays, 
  ShieldCheck, 
  Church, 
  ArrowLeft, 
  LogOut,
  FolderGit2,
  Layers,
  Lock,
  User,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface AdminPanelProps {
  currentUser: AuthUser;
  onBackToSite: () => void;
  onLogout: () => void;
  onSwitchUser?: (user: AuthUser) => void;
}

type MainModule = 'igreja' | 'redes' | 'celulas' | 'louvor' | 'integracoes';

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  currentUser, 
  onBackToSite, 
  onLogout,
  onSwitchUser 
}) => {
  // Verificações de Permissão por Módulo
  const canAccessIgreja = AuthService.hasAccess(currentUser, 'igreja');
  const canAccessRedes = AuthService.hasAccess(currentUser, 'redes');
  const canAccessCelulas = AuthService.hasAccess(currentUser, 'celulas');
  const canAccessLouvor = AuthService.hasAccess(currentUser, 'louvor');
  const canAccessIntegracoes = currentUser.role === 'admin';

  // Determinar o módulo inicial baseado nas permissões do usuário
  const getInitialModule = (): MainModule => {
    if (canAccessIgreja) return 'igreja';
    if (canAccessRedes) return 'redes';
    if (canAccessCelulas) return 'celulas';
    if (canAccessLouvor) return 'louvor';
    return 'igreja';
  };

  const [activeModule, setActiveModule] = useState<MainModule>(getInitialModule);
  
  // Sub-abas dentro dos módulos
  const [subTabIgreja, setSubTabIgreja] = useState<'members' | 'events'>('members');
  const [subTabLouvor, setSubTabLouvor] = useState<'financeiro' | 'confra' | 'agenda'>('financeiro');

  // Garantir que o usuário não permaneça em um módulo não permitido caso mude de perfil
  useEffect(() => {
    if (activeModule === 'igreja' && !canAccessIgreja) setActiveModule(getInitialModule());
    if (activeModule === 'redes' && !canAccessRedes) setActiveModule(getInitialModule());
    if (activeModule === 'celulas' && !canAccessCelulas) setActiveModule(getInitialModule());
    if (activeModule === 'louvor' && !canAccessLouvor) setActiveModule(getInitialModule());
    if (activeModule === 'integracoes' && !canAccessIntegracoes) setActiveModule(getInitialModule());
  }, [currentUser]);

  const roleBadgeColors: Record<UserRole, string> = {
    admin: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    pastor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    supervisor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    leader: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    louvor: 'bg-pink-500/20 text-pink-300 border-pink-500/40'
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Top Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Voltar para a página pública da igreja"
            >
              <ArrowLeft className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Site Público</span>
            </button>

            <div className="h-6 w-px bg-zinc-800 hidden sm:block"></div>

            <div>
              <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
                Painel Interno de Gestão
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-sky-300 border border-blue-500/30">
                  INA Esperança
                </span>
              </h1>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Controle por Nível de Acesso da Liderança
              </p>
            </div>
          </div>

          {/* Usuário Conectado e Logout */}
          <div className="flex items-center gap-2.5">
            
            {/* Badge do Usuário Logado */}
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${roleBadgeColors[currentUser.role]}`}>
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <div className="text-left">
                <span className="block leading-tight">{currentUser.name}</span>
                <span className="text-[9px] opacity-80 uppercase block font-mono">
                  {AuthService.getRoleLabel(currentUser.role)}
                </span>
              </div>
            </div>

            {/* Botão Sair */}
            <button
              onClick={onLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Encerrar sessão no painel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BARRA PRINCIPAL DE MÓDULOS (CONTROLADA POR NÍVEL DE ACESSO)              */}
        {/* ========================================================================= */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex space-x-1 sm:space-x-2 border-t border-zinc-800/80 py-2 overflow-x-auto scrollbar-none">
            
            {/* MÓDULO 1: CONTROLE DA IGREJA (Admin & Pastores) */}
            {canAccessIgreja && (
              <button
                onClick={() => setActiveModule('igreja')}
                className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeModule === 'igreja'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-950/60'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <Church className="w-4 h-4" />
                <span>Módulo 1: Controle da Igreja</span>
              </button>
            )}

            {/* MÓDULO 2: CONTROLE DE REDES (Admin & Supervisores) */}
            {canAccessRedes && (
              <button
                onClick={() => setActiveModule('redes')}
                className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeModule === 'redes'
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-950/60'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Módulo 2: Controle de Redes</span>
              </button>
            )}

            {/* MÓDULO 3: CONTROLE DE CÉLULAS (Admin, Pastores & Supervisores) */}
            {canAccessCelulas && (
              <button
                onClick={() => setActiveModule('celulas')}
                className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeModule === 'celulas'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Módulo 3: Controle de Células</span>
              </button>
            )}

            {/* MÓDULO 4: MINISTÉRIO DE LOUVOR (Louvor, ou Pastores/Supervisores com acesso) */}
            {canAccessLouvor && (
              <button
                onClick={() => setActiveModule('louvor')}
                className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeModule === 'louvor'
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-950/60'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>Módulo 4: Ministério de Louvor</span>
              </button>
            )}

            {/* INTEGRAÇÕES TÉCNICAS (Exclusivo Administrador Geral) */}
            {canAccessIntegracoes && (
              <button
                onClick={() => setActiveModule('integracoes')}
                className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeModule === 'integracoes'
                    ? 'bg-zinc-700 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Supabase & GitHub</span>
              </button>
            )}

          </nav>
        </div>

        {/* Sub-bar para módulos que possuem múltiplas visões */}
        {activeModule === 'igreja' && (
          <div className="bg-zinc-950/70 border-t border-zinc-800/50 py-1.5 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Visões da Igreja:
              </span>
              <button
                onClick={() => setSubTabIgreja('members')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  subTabIgreja === 'members'
                    ? 'bg-blue-600/30 text-sky-300 border border-blue-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Membros da Igreja</span>
              </button>
              <button
                onClick={() => setSubTabIgreja('events')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  subTabIgreja === 'events'
                    ? 'bg-blue-600/30 text-sky-300 border border-blue-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Cultos & Eventos (inChurch)</span>
              </button>
            </div>
          </div>
        )}

        {activeModule === 'louvor' && (
          <div className="bg-zinc-950/70 border-t border-zinc-800/50 py-1.5 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                Área de Músicos:
              </span>
              <button
                onClick={() => setSubTabLouvor('financeiro')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  subTabLouvor === 'financeiro'
                    ? 'bg-pink-600/30 text-pink-300 border border-pink-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Mensalidades Louvor</span>
              </button>
              <button
                onClick={() => setSubTabLouvor('confra')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  subTabLouvor === 'confra'
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <PartyPopper className="w-3.5 h-3.5" />
                <span>Fundo Confra</span>
              </button>
              <button
                onClick={() => setSubTabLouvor('agenda')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  subTabLouvor === 'agenda'
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Escalas & Chamada</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Conteúdo Principal do Módulo Ativo */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1">
        
        {/* MÓDULO 1: CONTROLE DA IGREJA */}
        {activeModule === 'igreja' && canAccessIgreja && (
          <div>
            {subTabIgreja === 'members' && <MembersManagement />}
            {subTabIgreja === 'events' && <EventsManagement />}
          </div>
        )}

        {/* MÓDULO 2: CONTROLE DE REDES (Filtrado para Supervisors ou Geral para Admin) */}
        {activeModule === 'redes' && canAccessRedes && (
          <NetworksManagement currentUser={currentUser} />
        )}

        {/* MÓDULO 3: CONTROLE DE CÉLULAS */}
        {activeModule === 'celulas' && canAccessCelulas && (
          <CellsManagement currentUser={currentUser} />
        )}

        {/* MÓDULO 4: MINISTÉRIO DE LOUVOR */}
        {activeModule === 'louvor' && canAccessLouvor && (
          <div>
            {subTabLouvor === 'financeiro' && (
              <FinanceiroTab isAdmin={currentUser.role === 'admin' || currentUser.role === 'pastor'} onOpenPix={() => {}} onOpenRelatorio={() => {}} />
            )}
            {subTabLouvor === 'confra' && (
              <ConfraTab isAdmin={currentUser.role === 'admin' || currentUser.role === 'pastor'} onOpenPix={() => {}} onOpenRelatorio={() => {}} />
            )}
            {subTabLouvor === 'agenda' && (
              <AgendaTab isAdmin={currentUser.role === 'admin' || currentUser.role === 'pastor'} onOpenRelatorio={() => {}} />
            )}
          </div>
        )}

        {/* INTEGRAÇÕES TÉCNICAS */}
        {activeModule === 'integracoes' && canAccessIntegracoes && (
          <GitHubTab />
        )}
      </main>

      {/* Rodapé Seguro */}
      <footer className="border-t border-zinc-800/80 py-4 text-center text-xs text-zinc-500">
        <p>Igreja Nova Aliança Esperança — Sistema de Gestão Interna por Níveis de Acesso</p>
      </footer>

    </div>
  );
};
