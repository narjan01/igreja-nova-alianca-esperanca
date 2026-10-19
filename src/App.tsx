import React, { useState, useEffect } from 'react';
import { FinanceiroTab } from './components/FinanceiroTab';
import { ConfraTab } from './components/ConfraTab';
import { AgendaTab } from './components/AgendaTab';
import { GitHubTab } from './components/GitHubTab';
import { ChurchLandingPage } from './components/ChurchLandingPage';
import { AdminPanel } from './components/AdminPanel';
import { LoginPage } from './components/LoginPage';
import { PixModal } from './components/PixModal';
import { RelatorioModal } from './components/RelatorioModal';
import { PixInfo, AuthUser } from './types';
import { AuthService } from './lib/authService';
import { DataStore } from './lib/dataStore';
import { 
  Music, 
  Receipt, 
  PartyPopper, 
  CalendarDays, 
  Shield, 
  ShieldCheck, 
  Church,
  ArrowLeft,
  LogOut
} from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'church' | 'login' | 'admin' | 'louvor'>('church');
  const [activeTab, setActiveTab] = useState<'financeiro' | 'confra' | 'agenda' | 'github'>('financeiro');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => AuthService.getCurrentUser());
  const [currentPix, setCurrentPix] = useState<PixInfo | null>(null);
  const [relatorioModal, setRelatorioModal] = useState<{ open: boolean; title: string; conteudo: string }>({
    open: false,
    title: '',
    conteudo: '',
  });

  useEffect(() => {
    // Detectar parâmetros ou subdomínio
    const hostname = window.location.hostname.toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');

    if (viewParam === 'admin' || viewParam === 'login') {
      if (currentUser) {
        setViewMode('admin');
      } else {
        setViewMode('login');
      }
    } else if (viewParam === 'louvor' || hostname.startsWith('louvor.')) {
      setViewMode('louvor');
    } else {
      setViewMode('church');
    }
  }, []);

  const handleOpenAdmin = () => {
    if (currentUser) {
      setViewMode('admin');
    } else {
      setViewMode('login');
    }
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setViewMode('admin');
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setViewMode('church');
  };

  const handleConfirmPix = (pix: PixInfo) => {
    if (pix.tipo === 'mensal' && pix.membro_id && pix.mes) {
      const mesNum = typeof pix.mes === 'number' ? pix.mes : pix.mes[0];
      DataStore.setStatusMensalidade(pix.membro_id, mesNum, 'Pago');
    } else if (pix.tipo === 'confra' && pix.membro_id) {
      DataStore.updateConfraStatus(pix.membro_id, 'set', 'Pago');
    }
  };

  const openRelatorio = (title: string, conteudo: string) => {
    setRelatorioModal({ open: true, title, conteudo });
  };

  // 1. TELA PRINCIPAL: SITE PÚBLICO DA IGREJA
  if (viewMode === 'church') {
    return (
      <ChurchLandingPage 
        onGoToAdmin={handleOpenAdmin}
      />
    );
  }

  // 2. PÁGINA DE LOGIN COM USUÁRIO E SENHA
  if (viewMode === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToSite={() => setViewMode('church')}
      />
    );
  }

  // 3. TELA RESTRITA: PAINEL ADMINISTRATIVO COM OS 4 MÓDULOS E CONTROLE DE ACESSO
  if (viewMode === 'admin' && currentUser) {
    return (
      <AdminPanel
        currentUser={currentUser}
        onBackToSite={() => setViewMode('church')}
        onLogout={handleLogout}
        onSwitchUser={(user) => setCurrentUser(user)}
      />
    );
  }

  // Se por algum motivo estiver em admin sem usuário, redirecionar para login
  if (viewMode === 'admin' && !currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToSite={() => setViewMode('church')}
      />
    );
  }

  // 4. MÓDULO 4: MINISTÉRIO DE LOUVOR (Músicos, Escalas e Mensalidades)
  const isLouvorAdmin = currentUser ? (currentUser.role === 'admin' || currentUser.role === 'pastor') : false;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('church')}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Voltar ao Site da Igreja"
            >
              <ArrowLeft className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Site da Igreja</span>
            </button>

            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-950/50 text-white">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Portal Louvor
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  INA Esperança
                </span>
              </h1>
              <p className="text-[11px] text-zinc-400">Controle Financeiro, PIX & Escalas</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdmin}
              className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Painel de Gestão</span>
            </button>

            {currentUser && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs font-bold transition cursor-pointer"
                title="Sair"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <nav className="flex space-x-1 sm:space-x-2 border-t border-zinc-800/60 py-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('financeiro')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'financeiro'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Receipt className="w-4 h-4" />
              Recibo Financeiro
            </button>

            <button
              onClick={() => setActiveTab('confra')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'confra'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-950/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <PartyPopper className="w-4 h-4" />
              Fundo Confra
            </button>

            <button
              onClick={() => setActiveTab('agenda')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'agenda'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Agenda & Escala LouveApp
            </button>

            {isLouvorAdmin && (
              <button
                onClick={() => setActiveTab('github')}
                className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'github'
                    ? 'bg-zinc-700 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <Shield className="w-4 h-4" />
                Integrações
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1">
        {activeTab === 'financeiro' && (
          <FinanceiroTab
            isAdmin={isLouvorAdmin}
            onOpenPix={(pix) => setCurrentPix(pix)}
            onOpenRelatorio={openRelatorio}
          />
        )}

        {activeTab === 'confra' && (
          <ConfraTab
            isAdmin={isLouvorAdmin}
            onOpenPix={(pix) => setCurrentPix(pix)}
            onOpenRelatorio={openRelatorio}
          />
        )}

        {activeTab === 'agenda' && (
          <AgendaTab
            isAdmin={isLouvorAdmin}
            onOpenRelatorio={openRelatorio}
          />
        )}

        {activeTab === 'github' && isLouvorAdmin && <GitHubTab />}
      </main>

      {/* Modais Globais */}
      <PixModal
        pix={currentPix}
        onClose={() => setCurrentPix(null)}
        onConfirmSuccess={handleConfirmPix}
        isAdmin={isLouvorAdmin}
      />

      <RelatorioModal
        isOpen={relatorioModal.open}
        title={relatorioModal.title}
        conteudo={relatorioModal.conteudo}
        onClose={() => setRelatorioModal({ open: false, title: '', conteudo: '' })}
      />
    </div>
  );
}
