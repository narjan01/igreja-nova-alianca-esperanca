import React, { useState, useEffect } from 'react';
import { ChurchEvent } from '../types';
import { ChurchDataService } from '../lib/churchDataService';
import { 
  Calendar, 
  Search, 
  RefreshCw, 
  Sparkles, 
  ExternalLink, 
  BookOpen, 
  MapPin, 
  X,
  Share2
} from 'lucide-react';

export const EventsManagement: React.FC = () => {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const data = await ChurchDataService.getEvents();
    setEvents(data);
    setLoading(false);
  };

  const filteredEvents = events.filter((ev) => 
    ev.title.toLowerCase().includes(search.toLowerCase()) ||
    ev.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-purple-950/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            <Calendar className="w-3.5 h-3.5" />
            <span>inChurch Scheduling & Event Feed</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Programação, Cultos & Eventos
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Sincronizado diretamente com a plataforma inChurch. Esses eventos alimentam a seção tipo Blog do site oficial.
          </p>
        </div>

        <button
          onClick={loadEvents}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/40 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Eventos</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-1">
          <span className="text-xs text-zinc-400 font-semibold">Total de Eventos</span>
          <div className="text-2xl font-black text-white">{events.length}</div>
          <p className="text-[10px] text-zinc-500">Cadastrados na inChurch</p>
        </div>
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-1">
          <span className="text-xs text-zinc-400 font-semibold">Com Banners / Imagem</span>
          <div className="text-2xl font-black text-purple-400">
            {events.filter((e) => e.image || e.thumbnail).length}
          </div>
          <p className="text-[10px] text-zinc-500">Prontos para exibição no blog</p>
        </div>
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-1 col-span-2 sm:col-span-1">
          <span className="text-xs text-zinc-400 font-semibold">Status de Publicação</span>
          <div className="text-2xl font-black text-emerald-400">100% Ativo</div>
          <p className="text-[10px] text-zinc-500">Exibição no site oficial</p>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 p-3 rounded-2xl">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar evento por título ou palavras-chave na descrição..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Grid de Eventos */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <p className="text-xs text-zinc-400">Carregando eventos do Supabase...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="py-16 text-center bg-zinc-900/40 rounded-3xl border border-zinc-800 space-y-2">
          <Calendar className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-300">Nenhum evento encontrado</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
              className="bg-zinc-900/90 border border-zinc-800 hover:border-purple-500/40 rounded-3xl overflow-hidden flex flex-col justify-between transition group shadow-sm hover:shadow-xl hover:shadow-purple-950/20 cursor-pointer"
            >
              <div>
                <div className="h-40 bg-zinc-800 relative overflow-hidden">
                  {ev.image ? (
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-purple-950 to-zinc-900 flex items-center justify-center">
                      <Calendar className="w-10 h-10 text-zinc-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-zinc-900/90 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                    ID #{ev.id}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition line-clamp-2">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {ev.description || "Sem descrição informada."}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-between text-xs text-purple-400 font-semibold">
                <span>Visualizar Assunto</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalhes do Evento */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-zinc-900 border border-zinc-700/80 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 bg-zinc-800 shrink-0">
              {selectedEvent.image ? (
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-zinc-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-xl font-black text-white">{selectedEvent.title}</h2>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-zinc-300">
              <div className="text-sm leading-relaxed whitespace-pre-line text-zinc-200">
                {selectedEvent.description}
              </div>
            </div>

            <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition"
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
