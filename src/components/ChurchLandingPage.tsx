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
  Tag,
  ChevronDown,
  ChevronUp,
  Navigation
} from 'lucide-react';

interface ChurchLandingPageProps {
  onGoToLouvorPortal?: () => void;
  onGoToAdmin?: () => void;
}

const GOOGLE_MAPS_LOCATION_URL = "https://share.google/jDtcY6Ae8UcT0mPAC";

export const ChurchLandingPage: React.FC<ChurchLandingPageProps> = ({ 
  onGoToLouvorPortal,
  onGoToAdmin 
}) => {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);
  const [showAllEvents, setShowAllEvents] = useState(false);

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
      navigator.clipboard.writeText(`${event.title}\n\n${event.description}\n\nLocal: ${GOOGLE_MAPS_LOCATION_URL}`);
      alert('Informações do evento copiadas para a área de transferência!');
    }
  };

  // Filtrar apenas eventos atuais ou futuros
  const now = new Date();
  const currentAndFutureEvents = events.filter((ev) => {
    if (!ev.start_datetime && !ev.end_datetime) return true;
    const end = ev.end_datetime ? new Date(ev.end_datetime) : null;
    const start = ev.start_datetime ? new Date(ev.start_datetime) : null;

    if (end && !isNaN(end.getTime())) {
      // Exibir se terminou há menos de 12 horas
      return end.getTime() >= (now.getTime() - 12 * 60 * 60 * 1000);
    }
    if (start && !isNaN(start.getTime())) {
      // Exibir se começou há menos de 24 horas
      return start.getTime() >= (now.getTime() - 24 * 60 * 60 * 1000);
    }
    return true;
  }).sort((a, b) => {
    const timeA = a.start_datetime ? new Date(a.start_datetime).getTime() : 0;
    const timeB = b.start_datetime ? new Date(b.start_datetime).getTime() : 0;
    return timeA - timeB; // Do mais próximo para o mais distante
  });

  // Exibir inicialmente 3 e expandir o restante com o botão
  const visibleEvents = showAllEvents ? currentAndFutureEvents : currentAndFutureEvents.slice(0, 3);

  const formatEventDate = (datetimeStr?: string | null) => {
    if (!datetimeStr) return null;
    const d = new Date(datetimeStr);
    if (isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Top Navbar */}
      <nav className="border-b border-blue-900/40 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Oficial da Igreja */}
            <div className="w-11 h-11 rounded-2xl bg-white/5 border border-blue-500/30 p-1 flex items-center justify-center shadow-lg shadow-blue-950/50">
              <img 
                src="/logo.png" 
                alt="Logo Nova Aliança Esperança" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white block leading-tight">
                Nova Aliança Esperança
              </span>
              <span className="text-[11px] font-bold text-sky-400">
                Uma igreja para pessoas reais — João Pessoa / PB
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#programacao"
              className="hidden md:inline-flex px-3 py-1.5 text-xs text-zinc-300 hover:text-sky-300 font-semibold transition"
            >
              Programação & Cultos
            </a>

            <a
              href={GOOGLE_MAPS_LOCATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Como Chegar</span>
            </a>

            <button
              onClick={handlePortalLouvor}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-blue-900/60 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Music className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Portal do Louvor</span>
              <span className="sm:hidden">Louvor</span>
            </button>

            {onGoToAdmin && (
              <button
                onClick={onGoToAdmin}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-950/60 cursor-pointer"
                title="Acessar Área Restrita da Liderança (Controle de Membros e Células)"
              >
                <ShieldCheck className="w-4 h-4 text-sky-200" />
                <span>Área Restrita</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section com Banner Oficial Panorâmico */}
      <section className="relative overflow-hidden pt-6 sm:pt-10 pb-14 sm:pb-20 border-b border-blue-900/30 bg-gradient-to-b from-blue-950/30 via-zinc-950 to-zinc-950">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
          
          {/* Banner Oficial Panorâmico */}
          <div className="rounded-3xl overflow-hidden border border-blue-500/30 shadow-2xl shadow-blue-950/40 relative group">
            <img 
              src="/banner.png" 
              alt="Nova Aliança Esperança - Uma igreja para pessoas reais" 
              className="w-full h-auto object-cover max-h-[480px] transition duration-700 group-hover:scale-[1.01]"
            />
          </div>

          {/* Destaques e Valores da Igreja */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {[
              { icon: '❤️', label: 'AMAR A DEUS' },
              { icon: '👥', label: 'AMAR PESSOAS' },
              { icon: '📖', label: 'VIVER A PALAVRA' },
              { icon: '🔥', label: 'EXPERIMENTAR O PODER' },
              { icon: '🕊️', label: 'VIVER EM SANTIDADE' },
              { icon: '🎯', label: 'CAMINHAR EM PROPÓSITO' },
            ].map((v, i) => (
              <div 
                key={i} 
                className="bg-zinc-900/80 border border-blue-900/40 rounded-2xl p-3 text-center space-y-1 hover:border-sky-500/40 transition"
              >
                <span className="text-xl block">{v.icon}</span>
                <span className="text-[11px] font-bold text-zinc-300 block tracking-tight leading-tight">
                  {v.label}
                </span>
              </div>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#programacao"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-blue-950/60 flex items-center gap-2.5 transition"
            >
              <Calendar className="w-4 h-4 text-sky-200" />
              <span>Ver Próximos Cultos</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={GOOGLE_MAPS_LOCATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white text-xs sm:text-sm font-bold transition flex items-center gap-2"
            >
              <Navigation className="w-4 h-4 text-sky-400" />
              <span>Localização no Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </a>
          </div>
        </div>
      </section>

      {/* Programação dos Cultos & Blog de Eventos (inChurch) */}
      <section id="programacao" className="py-16 sm:py-20 border-b border-zinc-800/80 max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-sky-400 text-xs font-bold border border-blue-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Programação Oficial Atualizada</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Programação Semanal & Cultos
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Confira as celebrações, cultos de ensino e eventos que vão acontecer nos próximos dias. Clique em qualquer card para ver todo o conteúdo e informações completas.
          </p>
        </div>

        {/* Grid de Eventos / Blog Feed */}
        {loadingEvents ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-zinc-400">Carregando programação oficial da inChurch...</p>
          </div>
        ) : currentAndFutureEvents.length === 0 ? (
          <div className="py-16 text-center bg-zinc-900/40 rounded-3xl border border-zinc-800 space-y-2">
            <Calendar className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-300">Nenhum evento futuro cadastrado no momento</h3>
            <p className="text-xs text-zinc-500">Volte em breve para novas celebrações e encontros.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleEvents.map((event) => {
                const hasImage = Boolean(event.image || event.thumbnail);
                const eventFormattedDate = formatEventDate(event.start_datetime);
                const previewText = event.description
                  ? event.description.replace(/\n+/g, ' ').slice(0, 130) + '...'
                  : 'Clique para conferir todos os detalhes e informações deste momento especial conosco.';

                return (
                  <article
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/50 rounded-3xl overflow-hidden flex flex-col justify-between transition group shadow-sm hover:shadow-2xl hover:shadow-blue-950/40 cursor-pointer"
                  >
                    <div>
                      {/* Banner do Evento */}
                      <div className="h-52 bg-zinc-800 relative overflow-hidden">
                        {hasImage ? (
                          <img
                            src={event.image || event.thumbnail || ''}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-blue-950 via-zinc-900 to-sky-950 flex items-center justify-center p-6 text-center">
                            <Church className="w-12 h-12 text-zinc-700" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent"></div>

                        {/* Badge de Data ou Status */}
                        {eventFormattedDate ? (
                          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-950/90 backdrop-blur-md text-sky-300 border border-sky-500/40 text-[11px] font-bold flex items-center gap-1 shadow-md">
                            <Clock className="w-3 h-3 text-sky-400" />
                            <span className="capitalize">{eventFormattedDate}</span>
                          </span>
                        ) : (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-zinc-900/90 backdrop-blur-md text-sky-300 border border-sky-500/30 text-[10px] font-bold">
                            Próxima Celebração
                          </span>
                        )}
                      </div>

                      {/* Conteúdo */}
                      <div className="p-5 sm:p-6 space-y-2.5">
                        <h3 className="text-lg font-black text-white tracking-tight group-hover:text-sky-300 transition line-clamp-2">
                          {event.title}
                        </h3>

                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                          {previewText}
                        </p>
                      </div>
                    </div>

                    {/* Rodapé com botão Ler Mais */}
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 flex items-center justify-between border-t border-zinc-800/60 mt-2">
                      <span className="text-[11px] font-bold text-sky-400 group-hover:text-sky-300 flex items-center gap-1.5 transition">
                        <span>Ler assunto completo</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">inChurch Event</span>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Botão Expansor: Mostrar Mais / Mostrar Menos */}
            {currentAndFutureEvents.length > 3 && (
              <div className="text-center pt-2">
                <button
                  onClick={() => setShowAllEvents(!showAllEvents)}
                  className="px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-sky-300 hover:text-white border border-blue-500/30 hover:border-sky-500/60 text-xs font-bold transition flex items-center gap-2 mx-auto cursor-pointer shadow-lg shadow-blue-950/20"
                >
                  {showAllEvents ? (
                    <>
                      <span>Mostrar Menos Cultos</span>
                      <ChevronUp className="w-4 h-4 text-sky-400" />
                    </>
                  ) : (
                    <>
                      <span>Ver Mais Cultos & Eventos ({currentAndFutureEvents.length - 3} adicionais)</span>
                      <ChevronDown className="w-4 h-4 text-sky-400" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Destaque Portal do Louvor */}
      <section className="py-14 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="rounded-3xl bg-gradient-to-r from-blue-950/80 via-zinc-900 to-sky-950/50 border border-blue-500/30 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-950/30">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-sky-300 text-xs font-semibold">
              <Music className="w-3.5 h-3.5 text-sky-400" />
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
              <Music className="w-4 h-4 text-blue-700" />
              <span>Acessar Portal do Louvor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Localização & Contato Oficial */}
      <section id="localizacao" className="py-14 border-t border-zinc-800/80 bg-zinc-900/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Onde Estamos</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Igreja Evangélica Nova Aliança Esperança
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              R. Joaquim Monteiro de Franca, nº 457<br />
              Gramame / Colinas do Sul — João Pessoa, PB, 58069-000.<br/>
              Um ambiente de paz, restauração e adoração para toda a sua família.
            </p>

            <div className="pt-2">
              <a
                href={GOOGLE_MAPS_LOCATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-950/40"
              >
                <Navigation className="w-4 h-4" />
                <span>Abrir Rota no Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="bg-zinc-950 border border-blue-900/40 rounded-3xl p-6 space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-sky-400" />
              Canais Oficiais & Endereços
            </h4>
            <div className="space-y-3 text-xs text-zinc-400">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-300 font-medium">Site Oficial:</span>
                <span className="text-sky-400 font-mono">novaliancaesperancajp.com.br</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-300 font-medium">Portal do Louvor:</span>
                <span className="text-emerald-400 font-mono">louvor.novaliancaesperancajp.com.br</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-300 font-medium">Perfil no Google:</span>
                <a 
                  href={GOOGLE_MAPS_LOCATION_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Ver perfil e avaliações</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer com Logo */}
      <footer className="border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500 space-y-3">
        <div className="flex items-center justify-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain opacity-80" />
          <span className="font-bold text-zinc-300 text-sm">Igreja Nova Aliança Esperança</span>
        </div>
        <p>Uma igreja para pessoas reais &copy; {new Date().getFullYear()} — João Pessoa / PB</p>
        <p className="text-[11px] text-zinc-600">
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
            className="bg-zinc-900 border border-blue-900/60 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
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
                <div className="w-full h-full bg-gradient-to-tr from-blue-950 via-zinc-900 to-sky-950 flex items-center justify-center">
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
                <span className="px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md text-sky-300 border border-blue-500/30 text-xs font-bold inline-block mb-2">
                  Programação Oficial
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                  {selectedEvent.title}
                </h2>
              </div>
            </div>

            {/* Corpo do Conteúdo / Assunto Completo */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-zinc-300">
              {/* Data e Horário em Destaque */}
              {selectedEvent.start_datetime && (
                <div className="flex items-center gap-2 text-xs font-bold text-sky-300 bg-blue-950/60 p-3 rounded-xl border border-blue-900/50">
                  <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="capitalize">{formatEventDate(selectedEvent.start_datetime)}</span>
                </div>
              )}

              {/* Texto Completo com Quebra de Linhas Preservada */}
              <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line text-zinc-200 font-normal space-y-4">
                {selectedEvent.description || "Nenhum detalhe adicional informado para este evento."}
              </div>

              {/* Endereço / Localização da Igreja com link do Google Maps */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-blue-900/40 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-sky-400 font-bold uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Localização da Igreja</span>
                </div>
                <p className="text-zinc-300">
                  Igreja Evangélica Nova Aliança Esperança — R. Joaquim Monteiro de Franca, nº 457, Gramame / Colinas do Sul, João Pessoa - PB.
                </p>
                <a
                  href={GOOGLE_MAPS_LOCATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-bold mt-1 text-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Ver no Google Maps (Rota)</span>
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
                <Share2 className="w-4 h-4 text-sky-400" />
                <span>Compartilhar</span>
              </button>

              <button
                onClick={() => setSelectedEvent(null)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-950/50 cursor-pointer"
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
