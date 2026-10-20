import React, { useState, useEffect } from 'react';
import { ChurchEvent, ChurchWord, ChurchNews } from '../types';
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
  ChevronLeft,
  ChevronRight, 
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
  Info,
  Sparkles,
  Newspaper,
  Quote
} from 'lucide-react';

interface ChurchLandingPageProps {
  onGoToAdmin?: () => void;
}

const GOOGLE_MAPS_LOCATION_URL = "https://share.google/jDtcY6Ae8UcT0mPAC";
const YOUTUBE_URL = "https://www.youtube.com/@NVAEsperançaJPPB";
const INSTAGRAM_URL = "https://www.instagram.com/novaaliancaesperancajp/";

type TabType = 'inicio' | 'sobre' | 'missao' | 'pilares';

export const ChurchLandingPage: React.FC<ChurchLandingPageProps> = ({ 
  onGoToAdmin 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMatrizModal, setShowMatrizModal] = useState(false);

  // Estado das Palavras & Ministrações
  const [words, setWords] = useState<ChurchWord[]>([]);
  const [loadingWords, setLoadingWords] = useState(true);
  const [selectedWord, setSelectedWord] = useState<ChurchWord | null>(null);
  const [currentWordSlide, setCurrentWordSlide] = useState(0);
  const [isWordsPaused, setIsWordsPaused] = useState(false);

  // Estado das Notícias Habilitadas
  const [news, setNews] = useState<ChurchNews[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [selectedNews, setSelectedNews] = useState<ChurchNews | null>(null);
  const [currentNewsSlide, setCurrentNewsSlide] = useState(0);
  const [isNewsPaused, setIsNewsPaused] = useState(false);

  // Estado do Carrossel Deslizante Grande Automático de Eventos (16:9)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    loadEvents();
    loadWords();
    loadNews();
  }, []);

  const loadEvents = async () => {
    setLoadingEvents(true);
    const data = await ChurchDataService.getEvents();
    setEvents(data);
    setLoadingEvents(false);
  };

  const loadWords = async () => {
    setLoadingWords(true);
    const data = await ChurchDataService.getWords();
    setWords(data);
    setLoadingWords(false);
  };

  const loadNews = async () => {
    setLoadingNews(true);
    const data = await ChurchDataService.getNews();
    setNews(data);
    setLoadingNews(false);
  };

  const handleShareWord = (word: ChurchWord) => {
    const text = `Palavra: ${word.title} - ${word.preacher}\n"${word.summary}"\n\nIgreja Nova Aliança Esperança`;
    if (navigator.share) {
      navigator.share({
        title: word.title,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Mensagem copiada para a área de transferência!');
    }
  };

  const handleShareNews = (item: ChurchNews) => {
    const text = `Notícia: ${item.title}\n${item.summary}\n\nIgreja Nova Aliança Esperança`;
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Notícia copiada para a área de transferência!');
    }
  };

  const formatNewsDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
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

  // Ajustar o slide caso o número de eventos mude
  useEffect(() => {
    if (currentSlide >= currentAndFutureEvents.length && currentAndFutureEvents.length > 0) {
      setCurrentSlide(0);
    }
  }, [currentAndFutureEvents.length]);

  // Transição automática de 1 por 1 a cada 5 segundos
  useEffect(() => {
    if (currentAndFutureEvents.length <= 1 || isPaused || activeTab !== 'inicio') return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % currentAndFutureEvents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentAndFutureEvents.length, isPaused, activeTab]);

  // Autoplay para Palavras (6 segundos)
  useEffect(() => {
    if (words.length <= 1 || isWordsPaused || activeTab !== 'inicio') return;
    const interval = setInterval(() => {
      setCurrentWordSlide((prev) => (prev + 1) % words.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [words.length, isWordsPaused, activeTab]);

  const handlePrevWordSlide = () => {
    setCurrentWordSlide((prev) => (prev - 1 + words.length) % words.length);
  };

  const handleNextWordSlide = () => {
    setCurrentWordSlide((prev) => (prev + 1) % words.length);
  };

  // Autoplay para Notícias (6 segundos)
  useEffect(() => {
    if (news.length <= 1 || isNewsPaused || activeTab !== 'inicio') return;
    const interval = setInterval(() => {
      setCurrentNewsSlide((prev) => (prev + 1) % news.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [news.length, isNewsPaused, activeTab]);

  const handlePrevNewsSlide = () => {
    setCurrentNewsSlide((prev) => (prev - 1 + news.length) % news.length);
  };

  const handleNextNewsSlide = () => {
    setCurrentNewsSlide((prev) => (prev + 1) % news.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + currentAndFutureEvents.length) % currentAndFutureEvents.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % currentAndFutureEvents.length);
  };

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

  const currentWord = words[currentWordSlide] || null;
  const currentNewsItem = news[currentNewsSlide] || null;
  const currentEvent = currentAndFutureEvents[currentSlide] || null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Top Navbar */}
      <nav className="border-b border-blue-900/40 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Logo Oficial da Igreja (Fundo Transparente) */}
          <div 
            onClick={() => setActiveTab('inicio')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
              <img 
                src="/logo.png" 
                alt="Logo Nova Aliança Esperança" 
                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(29,78,216,0.5)] group-hover:scale-105 transition duration-300" 
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

          {/* Abas Principais de Navegação (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('inicio')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'inicio'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/50'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <span>Início</span>
            </button>

            <button
              onClick={() => setActiveTab('sobre')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sobre'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/50'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <span>Sobre Nós</span>
            </button>

            <button
              onClick={() => setActiveTab('missao')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'missao'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/50'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <span>Missão & Visão</span>
            </button>

            <button
              onClick={() => setActiveTab('pilares')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pilares'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/50'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <span>Os 7 Pilares</span>
            </button>
          </div>

          {/* Ações e Redes Sociais */}
          <div className="hidden lg:flex items-center gap-3">
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
          <div className="lg:hidden border-t border-zinc-800/80 bg-zinc-950/98 px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
            <button
              onClick={() => {
                setActiveTab('inicio');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'inicio' ? 'bg-blue-600 text-white' : 'bg-zinc-900/80 text-zinc-200'
              }`}
            >
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>Início & Programação</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('sobre');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'sobre' ? 'bg-blue-600 text-white' : 'bg-zinc-900/80 text-zinc-200'
              }`}
            >
              <Church className="w-4 h-4 text-sky-400" />
              <span>Sobre Nós (História)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('missao');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'missao' ? 'bg-blue-600 text-white' : 'bg-zinc-900/80 text-zinc-200'
              }`}
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Missão, Visão e Propósito</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('pilares');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'pilares' ? 'bg-blue-600 text-white' : 'bg-zinc-900/80 text-zinc-200'
              }`}
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Os 7 Pilares</span>
            </button>

            <a
              href={GOOGLE_MAPS_LOCATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-zinc-900/80 text-zinc-200 text-sm font-semibold"
            >
              <Navigation className="w-4 h-4 text-sky-400" />
              <span>Como Chegar (Google Maps)</span>
            </a>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-pink-900/30 text-pink-300 text-xs font-bold"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>

              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-red-900/30 text-red-300 text-xs font-bold"
              >
                <Youtube className="w-4 h-4" />
                <span>YouTube</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ========================================================================= */}
      {/* SELEÇÃO DE ABAS RÁPIDA (SUB-BAR DESKTOP & MOBILE)                         */}
      {/* ========================================================================= */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm sticky top-[61px] z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('inicio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inicio'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950/60'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Página Principal & Cultos</span>
          </button>

          <button
            onClick={() => setActiveTab('sobre')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sobre'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950/60'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Church className="w-3.5 h-3.5" />
            <span>Sobre Nós</span>
          </button>

          <button
            onClick={() => setActiveTab('missao')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'missao'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950/60'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Missão & Visão</span>
          </button>

          <button
            onClick={() => setActiveTab('pilares')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pilares'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950/60'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Os 7 Pilares</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: INÍCIO (BANNER PANORÂMICO + PROGRAMAÇÃO DESLIZANTE + ONDE ESTAMOS) */}
      {/* ========================================================================= */}
      {activeTab === 'inicio' && (
        <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-300 pb-16">
          
          {/* Banner Oficial Panorâmico (Sem botões redundantes) */}
          <section className="pt-4 sm:pt-6 max-w-6xl mx-auto px-4 sm:px-6">
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-blue-500/30 shadow-2xl shadow-blue-950/40 relative group">
              <img 
                src="/banner.png" 
                alt="Nova Aliança Esperança" 
                className="w-full h-auto object-cover max-h-[460px] transition duration-700 group-hover:scale-[1.01]"
              />
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SLIDE 1: PALAVRAS, MINISTRAÇÕES & REFLEXÕES PASTORAIS                    */}
          {/* ========================================================================= */}
          <section 
            id="palavras" 
            className="max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-4 sm:space-y-6"
            onMouseEnter={() => setIsWordsPaused(true)}
            onMouseLeave={() => setIsWordsPaused(false)}
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-zinc-800/80">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Edificação & Mensagens Pastorais</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Palavras & Ministrações
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Reflexões bíblicas, sermões e mensagens de fé para abençoar a sua semana.
                </p>
              </div>

              {/* Controles de Navegação */}
              {words.length > 1 && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handlePrevWordSlide}
                    className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-amber-500/50 transition cursor-pointer shadow-sm"
                    title="Palavra Anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextWordSlide}
                    className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-amber-500/50 transition cursor-pointer shadow-sm"
                    title="Próxima Palavra"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {loadingWords ? (
              <div className="py-20 text-center space-y-3 bg-zinc-900/40 rounded-3xl border border-zinc-800">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-zinc-400">Carregando mensagens pastorais...</p>
              </div>
            ) : currentWord ? (
              <div className="space-y-4">
                <div
                  onClick={() => setSelectedWord(currentWord)}
                  className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-500/30 bg-zinc-950 group shadow-2xl hover:border-amber-400/60 transition duration-500 cursor-pointer w-full aspect-[16/9] flex flex-col justify-end"
                >
                  <div className="absolute inset-0 bg-zinc-950 overflow-hidden">
                    {currentWord.image ? (
                      <img
                        key={currentWord.id}
                        src={currentWord.image}
                        alt={currentWord.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700 animate-in fade-in"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-amber-950/40 via-zinc-900 to-zinc-950 flex items-center justify-center">
                        <BookOpen className="w-20 h-20 text-zinc-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/75 to-transparent"></div>
                  </div>

                  {/* Badges Topo */}
                  <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 flex items-center justify-between z-10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-950/90 backdrop-blur-md text-amber-300 border border-amber-500/40 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-lg">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{currentWord.preacher}</span>
                      </span>

                      {currentWord.reference && (
                        <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-zinc-200 border border-white/10 text-xs font-medium">
                          {currentWord.reference}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/60 backdrop-blur-md text-zinc-300 text-[10px] sm:text-xs font-mono font-bold border border-white/10">
                        {currentWordSlide + 1} de {words.length}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo Rodapé */}
                  <div className="relative z-10 p-4 sm:p-7 md:p-8 space-y-1.5 sm:space-y-3 max-w-4xl">
                    <div className="text-[11px] sm:text-xs font-semibold text-amber-400/90 uppercase tracking-wider flex items-center gap-2">
                      <span>{currentWord.category}</span>
                      {currentWord.reference && <span className="sm:hidden">• {currentWord.reference}</span>}
                    </div>

                    <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight line-clamp-1 sm:line-clamp-2 drop-shadow-md group-hover:text-amber-300 transition duration-300">
                      {currentWord.title}
                    </h3>

                    <p className="hidden sm:line-clamp-2 text-xs sm:text-sm text-zinc-200 leading-relaxed drop-shadow max-w-3xl">
                      {currentWord.summary}
                    </p>

                    <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWord(currentWord);
                        }}
                        className="px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white text-[11px] sm:text-xs md:text-sm font-bold shadow-xl shadow-amber-950/60 flex items-center gap-1.5 sm:gap-2 transition cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Ler Mensagem Completa</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareWord(currentWord);
                        }}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
                      >
                        <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                        <span>Compartilhar</span>
                      </button>
                    </div>
                  </div>
                </div>

                {words.length > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-2">
                    {words.map((w, idx) => (
                      <button
                        key={w.id || idx}
                        onClick={() => setCurrentWordSlide(idx)}
                        className={`transition-all duration-300 cursor-pointer ${
                          idx === currentWordSlide
                            ? 'w-8 h-2.5 rounded-full bg-amber-400 shadow-md shadow-amber-400/50'
                            : 'w-2.5 h-2.5 rounded-full bg-zinc-700 hover:bg-zinc-500'
                        }`}
                        title={`Ver palavra ${idx + 1}: ${w.title}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </section>

          {/* ========================================================================= */}
          {/* SLIDE 2: NOTÍCIAS HABILITADAS & COMUNICADOS DA IGREJA                     */}
          {/* ========================================================================= */}
          <section 
            id="noticias" 
            className="max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-4 sm:space-y-6"
            onMouseEnter={() => setIsNewsPaused(true)}
            onMouseLeave={() => setIsNewsPaused(false)}
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-zinc-800/80">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  <Newspaper className="w-3.5 h-3.5" />
                  <span>Notícias Habilitadas & Comunidade</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Notícias da Igreja
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Fique informado sobre os projetos sociais, novidades das células e comunicados oficiais.
                </p>
              </div>

              {/* Controles de Navegação */}
              {news.length > 1 && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handlePrevNewsSlide}
                    className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-emerald-500/50 transition cursor-pointer shadow-sm"
                    title="Notícia Anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextNewsSlide}
                    className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-emerald-500/50 transition cursor-pointer shadow-sm"
                    title="Próxima Notícia"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {loadingNews ? (
              <div className="py-20 text-center space-y-3 bg-zinc-900/40 rounded-3xl border border-zinc-800">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-zinc-400">Carregando notícias da comunidade...</p>
              </div>
            ) : currentNewsItem ? (
              <div className="space-y-4">
                <div
                  onClick={() => setSelectedNews(currentNewsItem)}
                  className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-500/30 bg-zinc-950 group shadow-2xl hover:border-emerald-400/60 transition duration-500 cursor-pointer w-full aspect-[16/9] flex flex-col justify-end"
                >
                  <div className="absolute inset-0 bg-zinc-950 overflow-hidden">
                    {currentNewsItem.image ? (
                      <img
                        key={currentNewsItem.id}
                        src={currentNewsItem.image}
                        alt={currentNewsItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700 animate-in fade-in"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-emerald-950/40 via-zinc-900 to-zinc-950 flex items-center justify-center">
                        <Newspaper className="w-20 h-20 text-zinc-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/75 to-transparent"></div>
                  </div>

                  {/* Badges Topo */}
                  <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 flex items-center justify-between z-10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-950/90 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-lg">
                        <Newspaper className="w-3 h-3 text-emerald-400" />
                        <span>{currentNewsItem.badge || currentNewsItem.category}</span>
                      </span>

                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-zinc-300 border border-white/10 text-xs font-medium">
                        {formatNewsDate(currentNewsItem.date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/60 backdrop-blur-md text-zinc-300 text-[10px] sm:text-xs font-mono font-bold border border-white/10">
                        {currentNewsSlide + 1} de {news.length}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo Rodapé */}
                  <div className="relative z-10 p-4 sm:p-7 md:p-8 space-y-1.5 sm:space-y-3 max-w-4xl">
                    <div className="text-[11px] sm:text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      {currentNewsItem.category}
                    </div>

                    <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight line-clamp-1 sm:line-clamp-2 drop-shadow-md group-hover:text-emerald-300 transition duration-300">
                      {currentNewsItem.title}
                    </h3>

                    <p className="hidden sm:line-clamp-2 text-xs sm:text-sm text-zinc-200 leading-relaxed drop-shadow max-w-3xl">
                      {currentNewsItem.summary}
                    </p>

                    <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNews(currentNewsItem);
                        }}
                        className="px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] sm:text-xs md:text-sm font-bold shadow-xl shadow-emerald-950/60 flex items-center gap-1.5 sm:gap-2 transition cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Ler Notícia Completa</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareNews(currentNewsItem);
                        }}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
                      >
                        <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                        <span>Compartilhar</span>
                      </button>
                    </div>
                  </div>
                </div>

                {news.length > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-2">
                    {news.map((n, idx) => (
                      <button
                        key={n.id || idx}
                        onClick={() => setCurrentNewsSlide(idx)}
                        className={`transition-all duration-300 cursor-pointer ${
                          idx === currentNewsSlide
                            ? 'w-8 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50'
                            : 'w-2.5 h-2.5 rounded-full bg-zinc-700 hover:bg-zinc-500'
                        }`}
                        title={`Ver notícia ${idx + 1}: ${n.title}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </section>

          {/* ========================================================================= */}
          {/* SLIDE 3: PROGRAMAÇÃO SEMANAL & CULTOS (PROPORÇÃO 16:9 WIDESCREEN)         */}
          {/* ========================================================================= */}
          <section 
            id="programacao" 
            className="max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-4 sm:space-y-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-zinc-800/80">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/10 text-sky-400 text-xs font-bold border border-blue-500/20">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Programação Oficial inChurch</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Programação Semanal & Cultos
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Transição automática a cada 5 segundos. Exibição panorâmica 16:9 para visualizar a arte inteira.
                </p>
              </div>

              {/* Controles de Navegação Rápida (Setas Prev / Next) */}
              {currentAndFutureEvents.length > 1 && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handlePrevSlide}
                    className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-sky-500/50 transition cursor-pointer shadow-sm"
                    title="Evento Anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-sky-500/50 transition cursor-pointer shadow-sm"
                    title="Próximo Evento"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Slide Grande de 1 Evento em Formato 16:9 */}
            {loadingEvents ? (
              <div className="py-24 text-center space-y-3 bg-zinc-900/40 rounded-3xl border border-zinc-800">
                <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-zinc-400">Carregando programação oficial da inChurch...</p>
              </div>
            ) : currentAndFutureEvents.length === 0 ? (
              <div className="py-16 text-center bg-zinc-900/40 rounded-3xl border border-zinc-800 space-y-2">
                <Calendar className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="text-sm font-bold text-zinc-300">Nenhum evento futuro cadastrado no momento</h3>
                <p className="text-xs text-zinc-500">Volte em breve para novas celebrações e encontros.</p>
              </div>
            ) : currentEvent ? (
              <div className="space-y-4">
                
                {/* Card Cinematográfico 16:9 (proporção widescreen sem corte 4:4) */}
                <div
                  onClick={() => setSelectedEvent(currentEvent)}
                  className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-blue-900/60 bg-zinc-950 group shadow-2xl hover:border-sky-500/60 transition duration-500 cursor-pointer w-full aspect-[16/9] flex flex-col justify-end"
                >
                  {/* Imagem de Fundo Grande em 16:9 */}
                  <div className="absolute inset-0 bg-zinc-950 overflow-hidden">
                    {currentEvent.image || currentEvent.thumbnail ? (
                      <img
                        key={currentEvent.id}
                        src={currentEvent.image || currentEvent.thumbnail || ''}
                        alt={currentEvent.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700 animate-in fade-in"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-blue-950 via-zinc-900 to-sky-950 flex items-center justify-center">
                        <Church className="w-20 h-20 text-zinc-700" />
                      </div>
                    )}
                    {/* Gradiente suave apenas na base para visualização límpida da arte */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/65 to-transparent"></div>
                  </div>

                  {/* Badges do Topo (Data, Contador) */}
                  <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      {currentEvent.start_datetime ? (
                        <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-blue-950/90 backdrop-blur-md text-sky-300 border border-sky-500/50 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-lg">
                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400" />
                          <span className="capitalize">{formatEventDate(currentEvent.start_datetime)}</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-blue-950/90 backdrop-blur-md text-sky-300 border border-sky-500/40 text-[11px] sm:text-xs font-bold">
                          Próximo Culto
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/60 backdrop-blur-md text-zinc-300 text-[10px] sm:text-xs font-mono font-bold border border-white/10">
                        {currentSlide + 1} de {currentAndFutureEvents.length}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo do Slide no Rodapé */}
                  <div className="relative z-10 p-4 sm:p-7 md:p-8 space-y-1.5 sm:space-y-3 max-w-4xl">
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight line-clamp-1 sm:line-clamp-2 drop-shadow-md group-hover:text-sky-300 transition duration-300">
                      {currentEvent.title}
                    </h3>

                    <p className="hidden sm:line-clamp-2 text-xs sm:text-sm text-zinc-200 leading-relaxed drop-shadow max-w-3xl">
                      {currentEvent.description
                        ? currentEvent.description.replace(/\n+/g, ' ')
                        : 'Clique para conferir todos os detalhes e informações deste momento especial conosco.'}
                    </p>

                    <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(currentEvent);
                        }}
                        className="px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white text-[11px] sm:text-xs md:text-sm font-bold shadow-xl shadow-blue-950/60 flex items-center gap-1.5 sm:gap-2 transition cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Ler Assunto Completo</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(currentEvent);
                        }}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
                      >
                        <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
                        <span>Compartilhar</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bolinhas Seletivas (Dots) com Todos os Eventos Futuros */}
                {currentAndFutureEvents.length > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-2">
                    {currentAndFutureEvents.map((ev, idx) => {
                      const isActive = idx === currentSlide;
                      return (
                        <button
                          key={ev.id || idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`transition-all duration-300 cursor-pointer ${
                            isActive
                              ? 'w-8 h-2.5 rounded-full bg-sky-400 shadow-md shadow-sky-400/50'
                              : 'w-2.5 h-2.5 rounded-full bg-zinc-700 hover:bg-zinc-500'
                          }`}
                          title={`Ver evento ${idx + 1}: ${ev.title}`}
                          aria-label={`Ir para evento ${idx + 1}`}
                        />
                      );
                    })}
                  </div>
                )}

              </div>
            ) : null}
          </section>

          {/* SEÇÃO: ONDE ESTAMOS & CANAIS OFICIAIS */}
          <section id="localizacao" className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
            <div className="bg-zinc-900/60 border border-blue-900/40 rounded-3xl p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-xl">
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Onde Estamos</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Igreja Nova Aliança Esperança
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
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-3.5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-sky-400" />
                  Canais Oficiais
                </h4>
                
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-850">
                    <span className="text-zinc-300 font-medium">Site Oficial:</span>
                    <span className="text-sky-400 font-mono font-semibold">novaliancaesperancajp.com.br</span>
                  </div>

                  <a
                    href={YOUTUBE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 hover:border-red-500/50 transition group"
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

                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 hover:border-pink-500/50 transition group"
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

                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-850">
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

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: SOBRE NÓS (UMA HISTÓRIA DE FÉ, CUIDADO E MISSÃO)                   */}
      {/* ========================================================================= */}
      {activeTab === 'sobre' && (
        <section className="py-10 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 space-y-10 animate-in fade-in duration-300">
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
                  O ministério completou <span className="text-sky-400 font-bold">20 anos em julho de 2025</span>, reafirmando seu compromisso com evangelização, discipulado, missões e compaixão social.
                </p>

                <p className="text-xs text-zinc-500 italic pt-1">
                  Fonte institucional e registro da celebração dos 20 anos do ministério.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowMatrizModal(true)}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-950/50 transition cursor-pointer"
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
                className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-sky-300 text-xs font-bold border border-zinc-700 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Abrir Informações Completas</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: MISSÃO, VISÃO E PROPÓSITO                                         */}
      {/* ========================================================================= */}
      {activeTab === 'missao' && (
        <section className="py-10 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-10 animate-in fade-in duration-300">
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
      )}

      {/* ========================================================================= */}
      {/* ABA 4: OS SETE PILARES DA NOVA ALIANÇA                                   */}
      {/* ========================================================================= */}
      {activeTab === 'pilares' && (
        <section className="py-10 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-10 animate-in fade-in duration-300">
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
      )}

      {/* Footer com Logo sem fundo branco e Redes Sociais */}
      <footer className="border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500 space-y-4 px-4 mt-auto">
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

            {/* Quadro com os 4 Pilares da Matriz */}
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
                  Programação Oficial inChurch
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
                  <ExternalLink className="w-3.5 h-3.5" />
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
      {/* ========================================================================= */}
      {/* MODAL COMPLETO: LEITURA DA PALAVRA / DEVOCIONAL / MINISTRAÇÃO PASTORAL    */}
      {/* ========================================================================= */}
      {selectedWord && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setSelectedWord(null)}
        >
          <div 
            className="bg-zinc-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header com Imagem */}
            <div className="relative h-44 sm:h-64 bg-zinc-800 shrink-0 overflow-hidden">
              {selectedWord.image ? (
                <img
                  src={selectedWord.image}
                  alt={selectedWord.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-amber-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-amber-500/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent"></div>

              {/* Botão Fechar */}
              <button
                onClick={() => setSelectedWord(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition cursor-pointer"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[11px] font-bold inline-block mb-1 sm:mb-2">
                  {selectedWord.category}
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow-md line-clamp-2">
                  {selectedWord.title}
                </h2>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-4 sm:p-8 overflow-y-auto space-y-5 flex-1 text-zinc-300">
              {/* Informações do Pregador & Data */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-black text-sm">
                    {selectedWord.preacher.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">{selectedWord.preacher}</span>
                    <span className="text-[11px] text-zinc-400">{selectedWord.preacherRole || 'Ministério Pastoral'}</span>
                  </div>
                </div>

                {selectedWord.reference && (
                  <span className="px-3 py-1 rounded-xl bg-black/40 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                    {selectedWord.reference}
                  </span>
                )}
              </div>

              {/* Texto do Sermão */}
              <div className="text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-line text-zinc-200 font-normal space-y-4">
                {selectedWord.content}
              </div>
            </div>

            {/* Rodapé */}
            <div className="p-3 sm:p-6 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => handleShareWord(selectedWord)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Compartilhar</span>
              </button>

              <button
                onClick={() => setSelectedWord(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-lg shadow-amber-950/50 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL COMPLETO: LEITURA DA NOTÍCIA / COMUNICADO OFICIAL                  */}
      {/* ========================================================================= */}
      {selectedNews && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setSelectedNews(null)}
        >
          <div 
            className="bg-zinc-900 border border-emerald-500/40 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header com Imagem */}
            <div className="relative h-44 sm:h-64 bg-zinc-800 shrink-0 overflow-hidden">
              {selectedNews.image ? (
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-emerald-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
                  <Newspaper className="w-16 h-16 text-emerald-500/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent"></div>

              {/* Botão Fechar */}
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition cursor-pointer"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-[11px] font-bold inline-block mb-1 sm:mb-2">
                  {selectedNews.category}
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow-md line-clamp-2">
                  {selectedNews.title}
                </h2>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-4 sm:p-8 overflow-y-auto space-y-5 flex-1 text-zinc-300">
              {/* Data & Categoria */}
              <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
                <span className="font-bold text-emerald-400">{selectedNews.badge || selectedNews.category}</span>
                <span>Publicado em {formatNewsDate(selectedNews.date)}</span>
              </div>

              {/* Texto da Notícia */}
              <div className="text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-line text-zinc-200 font-normal space-y-4">
                {selectedNews.content}
              </div>
            </div>

            {/* Rodapé */}
            <div className="p-3 sm:p-6 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => handleShareNews(selectedNews)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>Compartilhar</span>
              </button>

              <button
                onClick={() => setSelectedNews(null)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/50 cursor-pointer"
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
