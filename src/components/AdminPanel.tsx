import React, { useState } from 'react';
import { MembersManagement } from './MembersManagement';
import { CellsManagement } from './CellsManagement';
import { FinanceiroTab } from './FinanceiroTab';
import { ConfraTab } from './ConfraTab';
import { AgendaTab } from './AgendaTab';
import { GitHubTab } from './GitHubTab';
import { 
  Users, 
  Home, 
  Music, 
  Receipt, 
  PartyPopper, 
  CalendarDays, 
  ShieldCheck, 
  Church, 
  ArrowLeft, 
  Database,
  RefreshCw,
  LogOut,
  FolderGit2
} from 'lucide-react';

interface AdminPanelProps {
  onBackToSite: () => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToSite, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'members' | 'cells' | 'louvor-financeiro' | 'louvor-confra' | 'louvor-agenda' | 'integracoes'>('members');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
              title="Voltar para a página pública da igreja"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Site Público</span>
            </button>

            <div className="h-6 w-px bg-zinc-800 hidden sm:block"></div>

            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Painel Interno de Gestão
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  INA Esperança
                </span>
              </h1>
              <p className="text-[11px] text-zinc-400">Área Restrita da Liderança & Administração</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sessão Autenticada</span>
            </div>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Encerrar sessão administrativa"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex space-x-1 sm:space-x-2 border-t border-zinc-800/60 py-2 overflow-x-auto scrollbar-none">
            {/* Membros */}
            <button
              onClick={() => setActiveTab('members')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'members'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              Controle de Membros
            </button>

            {/* Células */}
            <button
              onClick={() => setActiveTab('cells')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'cells'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-950/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Home className="w-4 h-4" />
              Células & Grupos
            </button>

            {/* Submódulos Louvor */}
            <button
              onClick={() => setActiveTab('louvor-financeiro')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'louvor-financeiro'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Receipt className="w-4 h-4" />
              Mensalidades Louvor
            </button>

            <button
              onClick={() => setActiveTab('louvor-confra')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'louvor-confra'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-950/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <PartyPopper className="w-4 h-4" />
              Fundo Confra
            </button>

            <button
              onClick={() => setActiveTab('louvor-agenda')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'louvor-agenda'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Escalas & Chamada
            </button>

            {/* Integrações */}
            <button
              onClick={() => setActiveTab('integracoes')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'integracoes'
                  ? 'bg-zinc-700 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              Supabase & GitHub
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1">
        {activeTab === 'members' && <MembersManagement />}
        {activeTab === 'cells' && <CellsManagement />}
        {activeTab === 'louvor-financeiro' && <FinanceiroTab isAdmin={true} onOpenPix={() => {}} onOpenRelatorio={() => {}} />}
        {activeTab === 'louvor-confra' && <ConfraTab isAdmin={true} onOpenPix={() => {}} onOpenRelatorio={() => {}} />}
        {activeTab === 'louvor-agenda' && <AgendaTab isAdmin={true} onOpenRelatorio={() => {}} />}
        {activeTab === 'integracoes' && <GitHubTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-4 text-center text-xs text-zinc-500">
        <p>Igreja Nova Aliança Esperança JP — Painel Administrativo Seguro</p>
      </footer>
    </div>
  );
};
