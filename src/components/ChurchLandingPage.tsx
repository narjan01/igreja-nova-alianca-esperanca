import React, { useState, useEffect } from 'react';
import { ChurchEvent } from '../types';
import { ChurchDataService } from '../lib/churchDataService';
import { 
  Church, 
  Music, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  HeartHandshake, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Compass,
  Phone,
  Share2,
  X,
  BookOpen,
  CalendarDays,
  Tag
} from 'lucide-react';

interface ChurchLandingPageProps {
  onGoToLouvorPortal?: () => void;
  onGoToAdmin?: () => void;
}

export const ChurchLandingPage: React.FC<ChurchLandingPageProps> = ({ 
  onGoToLouvorPortal,
  onGoToAdmin 
}) => {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoadingEvents(true);
    const data = await ChurchDataService.getEvents();
    setEvents(data);
    setLoadingEvents(false);
  };

  const handlePortalLouvor = () => {
    if (onGoToLouvorPortal) {
      onGoToLouvorPortal();
    } else {
      window.location.href = 'https://louvor.novaliancaesperancajp.com.br';
    }
  };

  const handleShare = (event: ChurchEvent) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description.slice(0, 150) + '...',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${event.title}\n\n${event.description}`);
      alert('Texto copiado para a área de transferência!');
    }
  };

  // Filtrar eventos com imagem ou descrição relevante
  const filteredEvents = events.filter((ev) => {
    if (activeFilter === 'cultos') {
      return ev.title.toLowerCase().includes('culto') || ev.title.toLowerCase().includes('ensino');
    }
    if (activeFilter === 'celulas') {
      return ev.title.toLowerCase().includes('célula') || ev.title.toLowerCase().includes('celula');
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Navbar */}
      <nav className="border-b border-zinc-800/80 bg-zinc-900/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-purple-950/40 text-white">
              <Church className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white block leading-tight">
                Igreja Nova Aliança
              </span>
              <span className="text-[11px] font-semibold text-purple-400">
                Esperança — João Pessoa / PB
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#programacao"
              className="hidden md:inline-flex px-3 py-1.5 text-xs text-zinc-300 hover:text-white font-medium transition"
            >
              Programação & Blog
            </a>

            <button
              onClick={handlePortalLouvor}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Music className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Portal do Louvor</span>
              <span className="sm:hidden">Louvor</span>
            </button>

            {onGoToAdmin && (
              <button
                onClick={onGoToAdmin}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/40 cursor-pointer"
                title="Acessar Área Restrita da Liderança (Controle de Membros e Células)"
              >
                <ShieldCheck className="w-4 h-4 text-purple-200" />
                <span>Área Restrita</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-zinc-800/60 bg-gradient-to-b from-purple-950/20 via-zinc-950 to-zinc-950">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Bem-vindo à nossa família de fé</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Uma igreja acolhedora para você e toda a sua família crescerem em Deus.
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Igreja Nova Aliança Esperança em João Pessoa. Conectando corações através do louvor, comunhão, estudo da Palavra e amor ao próximo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href="#programacao"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold shadow-xl shadow-purple-950/50 flex items-center gap-2.5 transition"
            >
              <Calendar className="w-4 h-4 text-purple-200" />
              <span>Ver Programação & Notícias</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={handlePortalLouvor}
              className="px-6 py-3.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white text-sm font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Music className="w-4 h-4 text-purple-400" />
              <span>Portal do Louvor</span>
            </button>
          </div>
        </div>
      </section>

      {/* Programação dos Cultos & Blog de Eventos (Sincronizado inChurch) */}
      <section id="programacao" className="py-16 sm:py-24 border-b border-zinc-800/80 max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sincronizado com a inChurch</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
              Programação Semanal & Cultos
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Fique por dentro de todos os cultos, séries de mensagens, reuniões de células e eventos especiais da igreja. Clique para ver todo o conteúdo!
            </p>
          </div>

          {/* Filtros de Categorias */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
              }`}
            >
              Todos ({events.length})
            </button>
            <button
              onClick={() => setActiveFilter('cultos')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeFilter === 'cultos'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
              }`}
            >
              Cultos & Ensino
            </button>
            <button
              onClick={() => setActiveFilter('celulas')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeFilter === 'celulas'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
              }`}
            >
              Células
            </button>
          </div>
        </div>

        {/* Grid de Eventos / Blog Feed */}
        {loadingEvents ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-zinc-400">Carregando programação oficial...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-16 text-center bg-zinc-900/40 rounded-3xl border border-zinc-800 space-y-2">
            <Calendar className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-300">Nenhum evento encontrado no filtro selecionado</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const hasImage = Boolean(event.image || event.thumbnail);
              const previewText = event.description
                ? event.description.replace(/\n+/g, ' ').slice(0, 140) + '...'
                : 'Clique para conferir todos os detalhes e informações deste momento especial conosco.';

              return (
                <article
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-zinc-900/90 border border-zinc-800 hover:border-purple-500/40 rounded-3xl overflow-hidden flex flex-col justify-between transition group shadow-sm hover:shadow-2xl hover:shadow-purple-950/30 cursor-pointer"
                >
                  <div>
                    {/* Imagem do Evento / Banner do inChurch */}
                    <div className="h-48 bg-zinc-800 relative overflow-hidden">
                      {hasImage ? (
                        <img
                          src={event.image || event.thumbnail || ''}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-purple-950 via-zinc-900 to-indigo-950 flex items-center justify-center p-6 text-center">
                          <Church className="w-12 h-12 text-zinc-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>

                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-zinc-900/90 backdrop-blur-md text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                        Programação Oficial
                      </span>
                    </div>

                    {/* Conteúdo Textual */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <h3 className="text-lg font-black text-white tracking-tight group-hover:text-purple-300 transition line-clamp-2">
                        {event.title}
                      </h3>

                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                        {previewText}
                      </p>
                    </div>
                  </div>

                  {/* Rodapé do Card com Ação */}
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 flex items-center justify-between border-t border-zinc-800/60 mt-2">
                    <span className="text-[11px] font-bold text-purple-400 group-hover:text-purple-300 flex items-center gap-1.5 transition">
                      <span>Ler assunto completo</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                    </span>
                    <span className="text-[10px] text-zinc-500">inChurch Event</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Destaque Portal do Louvor */}
      <section className="py-14 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="rounded-3xl bg-gradient-to-r from-purple-950/70 via-indigo-950/50 to-zinc-900 border border-purple-500/30 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-purple-950/20">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
              <Music className="w-3.5 h-3.5" />
              <span>Ministério de Louvor da Igreja</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Área Exclusiva de Músicos & Equipe
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Acesso às escalas de cultos sincronizadas com Google Agenda e LouveApp, recibos de mensalidades, fundo de confraternização e chamada de ensaios.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={handlePortalLouvor}
              className="py-3.5 px-6 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-white/10 transition cursor-pointer"
            >
              <Music className="w-4 h-4 text-purple-600" />
              <span>Ir para louvor.novaliancaesperancajp.com.br</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Localização & Contato */}
      <section className="py-12 border-t border-zinc-800/80 bg-zinc-900/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Onde Estamos</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Igreja Nova Aliança — Esperança
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              João Pessoa — Paraíba, Brasil.<br/>
              R. Joaquim Monteiro de Franca, nº 457 - Gramame / Colinas do Sul.<br/>
              Um ambiente de paz, restauração e adoração para toda a sua família.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Cultos Presenciais & Online</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-purple-400" />
              Canais Oficiais
            </h4>
            <div className="space-y-3 text-xs text-zinc-400">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800/80">
                <span className="text-zinc-300 font-medium">Domínio Principal:</span>
                <span className="text-purple-400 font-mono">novaliancaesperancajp.com.br</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800/80">
                <span className="text-zinc-300 font-medium">Portal de Louvor:</span>
                <span className="text-emerald-400 font-mono">louvor.novaliancaesperancajp.com.br</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 text-center text-xs text-zinc-500">
        <p>Igreja Nova Aliança Esperança &copy; {new Date().getFullYear()} — João Pessoa / PB</p>
        <p className="text-[11px] text-zinc-600 mt-1">
          Todos os direitos reservados.
        </p>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL COMPLETO: LEITURA DO ASSUNTO / ARTIGO DO EVENTO (BLOG VIEW)        */}
      {/* ========================================================================= */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-zinc-900 border border-zinc-700/80 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Banner do Modal com botão Fechar */}
            <div className="relative h-56 sm:h-72 bg-zinc-800 shrink-0 overflow-hidden">
              {selectedEvent.image ? (
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-purple-900 via-zinc-900 to-indigo-900 flex items-center justify-center">
                  <Church className="w-16 h-16 text-zinc-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent"></div>

              {/* Botão Fechar no Canto */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition cursor-pointer"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-md text-purple-300 border border-purple-500/30 text-xs font-bold inline-block mb-2">
                  Programação Oficial
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                  {selectedEvent.title}
                </h2>
              </div>
            </div>

            {/* Corpo do Conteúdo / Assunto Completo */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-zinc-300">
              {/* Texto Completo com Quebra de Linhas Preservada */}
              <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line text-zinc-200 font-normal space-y-4">
                {selectedEvent.description || "Nenhum detalhe adicional informado para este evento."}
              </div>

              {/* Endereço / Localização da Igreja */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Localização</span>
                </div>
                <p className="text-zinc-300">
                  Igreja Nova Aliança Esperança — R. Joaquim Monteiro de Franca, nº 457, Colinas do Sul / Gramame, João Pessoa - PB.
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Rua+Joaquim+Monteiro+da+Franca+457+Gramame+Joao+Pessoa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-bold mt-1 text-xs"
                >
                  <span>Abrir no Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="p-4 sm:p-6 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => handleShare(selectedEvent)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-purple-400" />
                <span>Compartilhar</span>
              </button>

              <button
                onClick={() => setSelectedEvent(null)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-900/40 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
