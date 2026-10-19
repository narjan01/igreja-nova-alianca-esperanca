import React, { useState, useEffect } from 'react';
import { ChurchEvent } from '../types';
import { ChurchDataService } from '../lib/churchDataService';
import { 
  Church, 
  Calendar, 
  MapPin, 
  Clock, 
  HeartHandshake, 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  Share2, 
  X, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Navigation, 
  Youtube, 
  Instagram, 
  Menu,
  Heart,
  Flag,
  Telescope,
  Sprout,
  Zap,
  Shield,
  Feather,
  Eye,
  Layers,
  Globe,
  Cake,
  Users,
  Compass,
  Info
} from 'lucide-react';

interface ChurchLandingPageProps {
  onGoToAdmin?: () => void;
}

const GOOGLE_MAPS_LOCATION_URL = "https://share.google/jDtcY6Ae8UcT0mPAC";
const YOUTUBE_URL = "https://www.youtube.com/@NVAEsperançaJPPB";
const INSTAGRAM_URL = "https://www.instagram.com/novaaliancaesperancajp/";

export const ChurchLandingPage: React.FC<ChurchLandingPageProps> = ({ 
  onGoToAdmin 
}) => {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMatrizModal, setShowMatrizModal] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoadingEvents(true);
    const data = await ChurchDataService.getEvents();
    setEvents(data);
    setLoadingEvents(false);
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
      return end.getTime() >= (now.getTime() - 12 * 60 * 60 * 1000);
    }
    if (start && !isNaN(start.getTime())) {
      return start.getTime() >= (now.getTime() - 24 * 60 * 60 * 1000);
    }
    return true;
  }).sort((a, b) => {
    const timeA = a.start_datetime ? new Date(a.start_datetime).getTime() : 0;
    const timeB = b.start_datetime ? new Date(b.start_datetime).getTime() : 0;
    return timeA - timeB;
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
      <nav className="border-b border-blue-900/40 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Logo Oficial da Igreja (Fundo Transparente) */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
              <img 
                src="/logo.png" 
                alt="Logo Nova Aliança Esperança" 
                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(29,78,216,0.5)]" 
              />
            </div>
            <div>
              <span className="text-sm sm:text-lg font-black tracking-tight text-white block leading-tight">
                Nova Aliança Esperança
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-sky-400 block leading-tight">
                João Pessoa / PB
              </span>
            </div>
          </div>

          {/* Links Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="#sobre"
              className="text-xs text-zinc-300 hover:text-sky-300 font-semibold transition"
            >
              Sobre Nós
            </a>

            <a
              href="#missao-visao"
              className="text-xs text-zinc-300 hover:text-sky-300 font-semibold transition"
            >
              Missão & Visão
            </a>

            <a
              href="#pilares"
              className="text-xs text-zinc-300 hover:text-sky-300 font-semibold transition"
            >
              Os 7 Pilares
            </a>

            <a
              href="#programacao"
              className="text-xs text-zinc-300 hover:text-sky-300 font-semibold transition"
            >
              Cultos & Eventos
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-pink-400 border border-zinc-800 transition"
              title="Instagram @novaaliancaesperancajp"
            >
              <Instagram className="w-4 h-4" />
            </a>

            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-red-400 border border-zinc-800 transition"
              title="Canal do YouTube @NVAEsperançaJPPB"
            >
              <Youtube className="w-4 h-4" />
            </a>

            <a
              href={GOOGLE_MAPS_LOCATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Como Chegar</span>
            </a>

            {onGoToAdmin && (
              <button
                onClick={onGoToAdmin}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-blue-950/60 cursor-pointer"
                title="Acessar Área Restrita da Liderança"
              >
                <ShieldCheck className="w-4 h-4 text-sky-200" />
                <span>Área Restrita</span>
              </button>
            )}
          </div>

          {/* Botão Mobile Hambúrguer */}
          <div className="flex lg:hidden items-center gap-2">
            {onGoToAdmin && (
              <button
                onClick={onGoToAdmin}
                className="p-2 rounded-xl bg-blue-950 border border-blue-500/40 text-sky-200 cursor-pointer"
                title="Área Restrita"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
              aria-label="Menu de Navegação"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Expandido */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-800/80 bg-zinc-950/98 px-4 py-4 space-y-2.5 animate-in slide-in-from-top-2 duration-150">
            <a
              href="#sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-zinc-900/80 text-zinc-200 text-sm font-semibold"
            >
              <Church className="w-4 h-4 text-sky-400" />
              <span>Sobre Nós</span>
            </a>

            <a
              href="#missao-visao"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-zinc-900/80 text-zinc-200 text-sm font-semibold"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Missão, Visão e Propósito</span>
            </a>

            <a
              href="#pilares"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-zinc-900/80 text-zinc-200 text-sm font-semibold"
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Os 7 Pilares</span>
            </a>

            <a
              href="#programacao"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-zinc-900/80 text-zinc-200 text-sm font-semibold"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Programação & Cultos</span>
            </a>

            <a
              href={GOOGLE_MAPS_LOCATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-zinc-900/80 text-zinc-200 text-sm font-semibold"
            >
              <Navigation className="w-4 h-4 text-sky-400" />
              <span>Como Chegar (Google Maps)</span>
            </a>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 border border-pink-900/30 text-pink-300 text-xs font-bold"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>

              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 border border-red-900/30 text-red-300 text-xs font-bold"
              >
                <Youtube className="w-4 h-4" />
                <span>YouTube</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section com Banner Oficial Panorâmico */}
      <section className="relative overflow-hidden pt-4 sm:pt-8 pb-10 sm:pb-14 border-b border-blue-900/30 bg-gradient-to-b from-blue-950/30 via-zinc-950 to-zinc-950">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          
          {/* Banner Oficial Panorâmico */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-blue-500/30 shadow-2xl shadow-blue-950/40 relative group">
            <img 
              src="/banner.png" 
              alt="Nova Aliança Esperança" 
              className="w-full h-auto object-cover max-h-[460px] transition duration-700 group-hover:scale-[1.01]"
            />
          </div>

          {/* Botões de Ação Principais */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <a
              href="#programacao"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-blue-950/60 flex items-center justify-center gap-2.5 transition"
            >
              <Calendar className="w-4 h-4 text-sky-200" />
              <span>Ver Próximos Cultos</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={GOOGLE_MAPS_LOCATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4 text-sky-400" />
              <span>Localização no Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </a>

            <a
              href="#sobre"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-blue-900/60 text-sky-300 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2"
            >
              <Church className="w-4 h-4 text-sky-400" />
              <span>Conhecer Nossa História</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SEÇÃO: SOBRE NÓS (UMA HISTÓRIA DE FÉ, CUIDADO E MISSÃO)                   */}
      {/* ========================================================================= */}
      <section id="sobre" className="py-14 sm:py-20 border-b border-zinc-800/80 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Texto Principal */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-sky-400 text-xs font-bold border border-blue-500/20">
                <Church className="w-3.5 h-3.5" />
                <span>Sobre a Nova Aliança</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Uma história construída pela fé, pelo cuidado e pela missão
              </h2>

              <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed">
                <p>
                  A <strong className="text-white">Nova Aliança Global</strong> nasceu em 2005, em Imperatriz, Maranhão, por meio do chamado ministerial dos pastores <strong className="text-sky-300">Raimundo Nonato e Maria de Jesus</strong>.
                </p>

                <p>
                  Desde o início, nossa identidade tem sido fundamentada em amar a Deus e amar pessoas. Esse propósito nos levou a crescer, formar novas lideranças, plantar igrejas e desenvolver projetos que alcançam pessoas no Brasil e em outras nações.
                </p>

                <p>
                  Mais do que uma igreja local, a Nova Aliança Global é uma estrutura de comunhão, direção e suporte para as igrejas e frentes ministeriais que integram a família Nova Aliança.
                </p>

                <p>
                  Buscamos viver pela Palavra, pelo poder de Deus, pela santidade, pela liberdade e pela revelação. Nossa visão é ser uma igreja pequena o suficiente para cuidar de cada pessoa e grande o suficiente para impactar nações.
                </p>

                <p className="font-semibold text-zinc-200">
                  O ministério completou <span className="text-sky-400">20 anos em julho de 2025</span>, reafirmando seu compromisso com evangelização, discipulado, missões e compaixão social.
                </p>

                <p className="text-xs text-zinc-500 italic pt-1">
                  Fonte institucional e registro da celebração dos 20 anos do ministério.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowMatrizModal(true)}
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-950/50 transition cursor-pointer"
                >
                  <Info className="w-4 h-4 text-sky-200" />
                  <span>Ver Detalhes da Sede Matriz</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card Lateral com os Pontos Principais da Sede Matriz */}
            <div className="lg:col-span-5 bg-gradient-to-b from-blue-950/40 via-zinc-900 to-zinc-900 border border-blue-900/50 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-sky-400 flex items-center justify-center font-bold">
                    <Church className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">Sede Matriz Global</h3>
                    <p className="text-[11px] text-zinc-400">Origem & Fundamentos</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-full border border-sky-500/30">
                  20 Anos
                </span>
              </div>

              {/* Lista dos 4 Pilares da Matriz */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/60 border border-blue-700/50 flex items-center justify-center text-sky-300 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Fundação</span>
                    <span className="text-xs text-zinc-400">2005, em Imperatriz – MA</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/60 border border-blue-700/50 flex items-center justify-center text-sky-300 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Fundadores</span>
                    <span className="text-xs text-zinc-400">Pr. Raimundo Nonato e Pra. Maria de Jesus</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/60 border border-blue-700/50 flex items-center justify-center text-sky-300 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Alcance</span>
                    <span className="text-xs text-zinc-400">Igrejas e frentes ministeriais no Brasil e em outras nações</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/60 border border-blue-700/50 flex items-center justify-center text-sky-300 shrink-0">
                    <Cake className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">20 anos de ministério</span>
                    <span className="text-xs text-zinc-400">Celebrados em julho de 2025</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowMatrizModal(true)}
                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-sky-300 text-xs font-bold border border-zinc-700 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Abrir Informações Completas</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SEÇÃO: MISSÃO, VISÃO E PROPÓSITO                                         */}
      {/* ========================================================================= */}
      <section id="missao-visao" className="py-16 sm:py-20 border-b border-zinc-800/80 max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-sky-400 text-xs font-bold border border-blue-500/20">
            <Compass className="w-3.5 h-3.5" />
            <span>MISSÃO, VISÃO E PROPÓSITO</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            O que nos move e para onde caminhamos
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            As frases abaixo foram organizadas editorialmente a partir dos conteúdos oficiais encontrados.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Missão */}
          <div className="bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/50 rounded-3xl p-6 sm:p-7 space-y-3.5 transition group shadow-sm hover:shadow-xl hover:shadow-blue-950/30 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition duration-300">
                <Flag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">
                Missão
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Glorificar Jesus, manifestar o Reino de Deus por meio de obras de compaixão e proclamar o Evangelho até os confins da terra.
              </p>
            </div>
            <div className="pt-2 border-t border-zinc-800/60 text-[11px] font-bold text-sky-400">
              Proclamar & Glorificar
            </div>
          </div>

          {/* Visão */}
          <div className="bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/50 rounded-3xl p-6 sm:p-7 space-y-3.5 transition group shadow-sm hover:shadow-xl hover:shadow-blue-950/30 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition duration-300">
                <Telescope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">
                Visão
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Ser uma igreja pequena para cuidar de cada pessoa e grande para impactar nações.
              </p>
            </div>
            <div className="pt-2 border-t border-zinc-800/60 text-[11px] font-bold text-sky-400">
              Cuidar & Impactar
            </div>
          </div>

          {/* Identidade */}
          <div className="bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/50 rounded-3xl p-6 sm:p-7 space-y-3.5 transition group shadow-sm hover:shadow-xl hover:shadow-blue-950/30 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 transition duration-300">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">
                Identidade
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Amar a Deus e amar pessoas.
              </p>
            </div>
            <div className="pt-2 border-t border-zinc-800/60 text-[11px] font-bold text-sky-400">
              Amor Incondicional
            </div>
          </div>

          {/* Propósito */}
          <div className="bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/50 rounded-3xl p-6 sm:p-7 space-y-3.5 transition group shadow-sm hover:shadow-xl hover:shadow-blue-950/30 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition duration-300">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">
                Propósito
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Formar discípulos de Jesus, desenvolver líderes, plantar igrejas e promover transformação espiritual e social nas comunidades e nações alcançadas pelo ministério.
              </p>
            </div>
            <div className="pt-2 border-t border-zinc-800/60 text-[11px] font-bold text-sky-400">
              Transformação & Liderança
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SEÇÃO: OS SETE PILARES DA NOVA ALIANÇA                                   */}
      {/* ========================================================================= */}
      <section id="pilares" className="py-16 sm:py-20 border-b border-zinc-800/80 bg-zinc-950 max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-sky-400 text-xs font-bold border border-blue-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>OS SETE PILARES DA NOVA ALIANÇA</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            O que sustenta nossa fé e nossas decisões
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Nossa identidade é sustentada por sete pilares que direcionam nossa fé, nossas decisões e nossa forma de servir a Deus e às pessoas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Pilar 1 */}
          <div className="bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/50 rounded-3xl p-5 sm:p-6 space-y-3 transition shadow-sm hover:shadow-xl hover:shadow-blue-950/20">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sky-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Lugar de amar a Deus
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Buscamos desenvolver uma vida de intimidade, adoração, obediência e entrega ao Senhor.
            </p>
          </div>

          {/* Pilar 2 */}
          <div className="bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/50 rounded-3xl p-5 sm:p-6 space-y-3 transition shadow-sm hover:shadow-xl hover:shadow-blue-950/20">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sky-400">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Lugar de amar pessoas
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Acreditamos no cuidado, no acolhimento, no serviço e na valorização de cada pessoa.
            </p>
          </div>

          {/* Pilar 3 */}
          <div className="bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/50 rounded-3xl p-5 sm:p-6 space-y-3 transition shadow-sm hover:shadow-xl hover:shadow-blue-950/20">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Ser uma igreja da Palavra
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              A Bíblia é o fundamento da nossa fé, do nosso ensino e da nossa prática cristã.
            </p>
          </div>

          {/* Pilar 4 */}
          <div className="bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/50 rounded-3xl p-5 sm:p-6 space-y-3 transition shadow-sm hover:shadow-xl hover:shadow-blue-950/20">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sky-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Ser uma igreja do poder
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cremos na atuação do Espírito Santo, em cura, libertação, milagres e transformação de vidas.
            </p>
          </div>

          {/* Pilar 5 */}
          <div className="bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/50 rounded-3xl p-5 sm:p-6 space-y-3 transition shadow-sm hover:shadow-xl hover:shadow-blue-950/20">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Ser uma igreja de santidade
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Buscamos uma vida separada para Deus, marcada pela integridade e pela obediência.
            </p>
          </div>

          {/* Pilar 6 */}
          <div className="bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/50 rounded-3xl p-5 sm:p-6 space-y-3 transition shadow-sm hover:shadow-xl hover:shadow-blue-950/20">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sky-400">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Ser uma igreja de liberdade
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Vivemos a liberdade do Espírito, sem legalismo, valorizando uma adoração sincera e verdadeira.
            </p>
          </div>

          {/* Pilar 7 */}
          <div className="bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/50 rounded-3xl p-5 sm:p-6 space-y-3 transition shadow-sm hover:shadow-xl hover:shadow-blue-950/20 md:col-span-2 lg:col-span-2">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sky-400">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Ser uma igreja de revelação
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Buscamos conhecer e obedecer à vontade de Deus por meio da Palavra e da direção do Espírito Santo.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SEÇÃO: PROGRAMAÇÃO DOS CULTOS & BLOG DE EVENTOS (INCHURCH)               */}
      {/* ========================================================================= */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
                      <div className="h-48 sm:h-52 bg-zinc-800 relative overflow-hidden">
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
                      <div className="p-4 sm:p-6 space-y-2.5">
                        <h3 className="text-base sm:text-lg font-black text-white tracking-tight group-hover:text-sky-300 transition line-clamp-2">
                          {event.title}
                        </h3>

                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                          {previewText}
                        </p>
                      </div>
                    </div>

                    {/* Rodapé com botão Ler Mais */}
                    <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0 flex items-center justify-between border-t border-zinc-800/60 mt-2">
                      <span className="text-[11px] font-bold text-sky-400 group-hover:text-sky-300 flex items-center gap-1.5 transition">
                        <span>Ler assunto completo</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">inChurch</span>
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

      {/* ========================================================================= */}
      {/* SEÇÃO: LOCALIZAÇÃO & CONTATO OFICIAL                                     */}
      {/* ========================================================================= */}
      <section id="localizacao" className="py-14 sm:py-20 border-t border-zinc-800/80 bg-zinc-900/40">
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
              Um ambiente de acolhimento, restauração e adoração para toda a sua família.
            </p>

            <div className="pt-2">
              <a
                href={GOOGLE_MAPS_LOCATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-blue-950/40"
              >
                <Navigation className="w-4 h-4" />
                <span>Abrir Rota no Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Cartão de Canais Oficiais */}
          <div className="bg-zinc-950 border border-blue-900/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-sky-400" />
              Canais Oficiais
            </h4>
            
            <div className="space-y-2.5 text-xs">
              
              {/* Site Oficial */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-300 font-medium">Site Oficial:</span>
                <span className="text-sky-400 font-mono font-semibold">novaliancaesperancajp.com.br</span>
              </div>

              {/* Canal do YouTube */}
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-red-500/50 transition group"
              >
                <div className="flex items-center gap-2 text-zinc-300">
                  <Youtube className="w-4 h-4 text-red-500" />
                  <span className="font-medium">Canal do YouTube:</span>
                </div>
                <div className="flex items-center gap-1 text-red-400 group-hover:text-red-300 font-semibold font-mono text-[11px]">
                  <span>@NVAEsperançaJPPB</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-pink-500/50 transition group"
              >
                <div className="flex items-center gap-2 text-zinc-300">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span className="font-medium">Instagram:</span>
                </div>
                <div className="flex items-center gap-1 text-pink-400 group-hover:text-pink-300 font-semibold font-mono text-[11px]">
                  <span>@novaaliancaesperancajp</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              {/* Perfil no Google */}
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

      {/* Footer com Logo sem fundo branco e Redes Sociais */}
      <footer className="border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500 space-y-4 px-4">
        <div className="flex items-center justify-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain filter drop-shadow-md" />
          <span className="font-black text-zinc-200 text-sm tracking-tight">Igreja Nova Aliança Esperança</span>
        </div>

        <div className="flex items-center justify-center gap-4 text-zinc-400">
          <a 
            href={INSTAGRAM_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-pink-400 transition flex items-center gap-1 font-semibold"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </a>
          <span className="text-zinc-700">•</span>
          <a 
            href={YOUTUBE_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-red-400 transition flex items-center gap-1 font-semibold"
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube</span>
          </a>
          <span className="text-zinc-700">•</span>
          <a 
            href={GOOGLE_MAPS_LOCATION_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-sky-400 transition flex items-center gap-1 font-semibold"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Google Maps</span>
          </a>
        </div>

        <p>&copy; {new Date().getFullYear()} Igreja Nova Aliança Esperança — João Pessoa / PB</p>
        <p className="text-[11px] text-zinc-600">
          R. Joaquim Monteiro de Franca, 457 - Gramame / Colinas do Sul
        </p>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL: INFORMAÇÕES DA SEDE MATRIZ (NOVA ALIANÇA GLOBAL)                   */}
      {/* ========================================================================= */}
      {showMatrizModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowMatrizModal(false)}
        >
          <div 
            className="bg-zinc-900 border border-blue-900/60 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-sky-400 flex items-center justify-center">
                  <Church className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">Sede Matriz Global</h3>
                  <p className="text-xs text-sky-400 font-semibold">Nova Aliança Global — Imperatriz / MA</p>
                </div>
              </div>
              <button 
                onClick={() => setShowMatrizModal(false)}
                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quadro com os 4 Pilares da Matriz (Visual idêntico à imagem de referência) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-950/30 border border-blue-900/50 space-y-4">
              
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-900/80 border border-blue-700/60 flex items-center justify-center text-sky-300 shrink-0 shadow-md">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-black text-white block">Fundação</span>
                  <span className="text-xs sm:text-sm text-zinc-300">2005, em Imperatriz – MA</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-900/80 border border-blue-700/60 flex items-center justify-center text-sky-300 shrink-0 shadow-md">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-black text-white block">Fundadores</span>
                  <span className="text-xs sm:text-sm text-zinc-300">Pr. Raimundo Nonato e Pra. Maria de Jesus</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-900/80 border border-blue-700/60 flex items-center justify-center text-sky-300 shrink-0 shadow-md">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-black text-white block">Alcance</span>
                  <span className="text-xs sm:text-sm text-zinc-300">Igrejas e frentes ministeriais no Brasil e em outras nações</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-900/80 border border-blue-700/60 flex items-center justify-center text-sky-300 shrink-0 shadow-md">
                  <Cake className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-black text-white block">20 anos de ministério</span>
                  <span className="text-xs sm:text-sm text-zinc-300">Celebrados em julho de 2025</span>
                </div>
              </div>

            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              A Nova Aliança Esperança em João Pessoa / PB é fruto dessa visão de expansão do Reino, plantação de igrejas e comunhão com a família Nova Aliança Global.
            </p>

            <button
              onClick={() => setShowMatrizModal(false)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-950/60 cursor-pointer"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL COMPLETO: LEITURA DO ASSUNTO / ARTIGO DO EVENTO (BLOG VIEW)        */}
      {/* ========================================================================= */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-zinc-900 border border-blue-900/60 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Banner do Modal com botão Fechar */}
            <div className="relative h-48 sm:h-72 bg-zinc-800 shrink-0 overflow-hidden">
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
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition cursor-pointer"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 backdrop-blur-md text-sky-300 border border-blue-500/30 text-[11px] font-bold inline-block mb-1 sm:mb-2">
                  Programação Oficial
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow-md line-clamp-2">
                  {selectedEvent.title}
                </h2>
              </div>
            </div>

            {/* Corpo do Conteúdo / Assunto Completo */}
            <div className="p-4 sm:p-8 overflow-y-auto space-y-5 sm:space-y-6 flex-1 text-zinc-300">
              {/* Data e Horário em Destaque */}
              {selectedEvent.start_datetime && (
                <div className="flex items-center gap-2 text-xs font-bold text-sky-300 bg-blue-950/60 p-3 rounded-xl border border-blue-900/50">
                  <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="capitalize">{formatEventDate(selectedEvent.start_datetime)}</span>
                </div>
              )}

              {/* Texto Completo com Quebra de Linhas Preservada */}
              <div className="text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-line text-zinc-200 font-normal space-y-4">
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
            <div className="p-3 sm:p-6 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between gap-3 shrink-0">
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
