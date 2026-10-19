import React, { useState, useEffect } from 'react';
import { FinanceiroTab } from './components/FinanceiroTab';
import { ConfraTab } from './components/ConfraTab';
import { AgendaTab } from './components/AgendaTab';
import { GitHubTab } from './components/GitHubTab';
import { ChurchLandingPage } from './components/ChurchLandingPage';
import { AdminPanel } from './components/AdminPanel';
import { PixModal } from './components/PixModal';
import { RelatorioModal } from './components/RelatorioModal';
import { AdminModal } from './components/AdminModal';
import { PixInfo } from './types';
import { DataStore } from './lib/dataStore';
import { 
  Music, 
  Receipt, 
  PartyPopper, 
  CalendarDays, 
  Shield, 
  ShieldCheck, 
  Church,
  ArrowLeft
} from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'church' | 'admin' | 'louvor'>('church');
  const [activeTab, setActiveTab] = useState<'financeiro' | 'confra' | 'agenda' | 'github'>('financeiro');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPix, setCurrentPix] = useState<PixInfo | null>(null);
  const [relatorioModal, setRelatorioModal] = useState<{ open: boolean; title: string; conteudo: string }>({
    open: false,
    title: '',
    conteudo: '',
  });
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    // Detectar parâmetros ou subdomínio
    const hostname = window.location.hostname.toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');

    if (viewParam === 'admin') {
      setShowAdminModal(true);
    } else if (viewParam === 'louvor' || hostname.startsWith('louvor.')) {
      setViewMode('louvor');
    } else {
      setViewMode('church');
    }
  }, []);

  const handleOpenAdmin = () => {
    if (isAdmin) {
      setViewMode('admin');
    } else {
      setShowAdminModal(true);
    }
  };

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    setViewMode('admin');
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
      <>
        <ChurchLandingPage 
          onGoToLouvorPortal={() => setViewMode('louvor')}
          onGoToAdmin={handleOpenAdmin}
        />
        <AdminModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          onSuccess={handleAdminSuccess}
        />
      </>
    );
  }

  // 2. TELA RESTRITA: PAINEL ADMINISTRATIVO (MEMBROS E CÉLULAS)
  if (viewMode === 'admin') {
    return (
      <AdminPanel
        onBackToSite={() => setViewMode('church')}
        onLogout={() => {
          setIsAdmin(false);
          setViewMode('church');
        }}
      />
    );
  }

  // 3. TELA DO PORTAL DE LOUVOR (MÚSICOS E ESCALAS)
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('church')}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
              title="Voltar ao Site da Igreja"
            >
              <ArrowLeft className="w-4 h-4" />
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
              <span>Painel de Membros & Células</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <nav className="flex space-x-1 sm:space-x-2 border-t border-zinc-800/60 py-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('financeiro')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
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
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
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
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'agenda'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Agenda & Escala LouveApp
            </button>

            <button
              onClick={() => setActiveTab('github')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'github'
                  ? 'bg-zinc-700 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Shield className="w-4 h-4" />
              Integrações
            </button>
          </nav>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1">
        {activeTab === 'financeiro' && (
          <FinanceiroTab
            isAdmin={isAdmin}
            onOpenPix={(pix) => setCurrentPix(pix)}
            onOpenRelatorio={openRelatorio}
          />
        )}

        {activeTab === 'confra' && (
          <ConfraTab
            isAdmin={isAdmin}
            onOpenPix={(pix) => setCurrentPix(pix)}
            onOpenRelatorio={openRelatorio}
          />
        )}

        {activeTab === 'agenda' && (
          <AgendaTab
            isAdmin={isAdmin}
            onOpenRelatorio={openRelatorio}
          />
        )}

        {activeTab === 'github' && <GitHubTab />}
      </main>

      {/* Modais Globais */}
      <PixModal
        pix={currentPix}
        onClose={() => setCurrentPix(null)}
        onConfirmPayment={handleConfirmPix}
      />

      <RelatorioModal
        isOpen={relatorioModal.open}
        title={relatorioModal.title}
        conteudo={relatorioModal.conteudo}
        onClose={() => setRelatorioModal({ open: false, title: '', conteudo: '' })}
      />

      <AdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onSuccess={handleAdminSuccess}
      />
    </div>
  );
}
