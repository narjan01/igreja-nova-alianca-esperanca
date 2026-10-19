import { ChurchCell, AuthUser } from '../types';
import { ChurchDataService } from '../lib/churchDataService';

interface CellsManagementProps {
  onBack?: () => void;
  currentUser?: AuthUser;
}

export const CellsManagement: React.FC<CellsManagementProps> = ({ onBack, currentUser }) => {
  const [cells, setCells] = useState<ChurchCell[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    loadCells();
  }, []);

  const loadCells = async () => {
    setLoading(true);
    const data = await ChurchDataService.getCells();
    setCells(data);
    setLoading(false);
  };

  // Se o usuário logado for supervisor, restringe às suas células
  const isSupervisor = currentUser?.role === 'supervisor';
  const supervisorCells = cells.filter((c) => {
    if (!isSupervisor) return true;
    if (currentUser?.network && c.category?.toLowerCase().includes(currentUser.network.toLowerCase())) {
      return true;
    }
    if (currentUser?.supervisorName && c.supervisors?.some(s => s.name.toLowerCase().includes(currentUser.supervisorName!.toLowerCase()))) {
      return true;
    }
    return !currentUser?.network && !currentUser?.supervisorName;
  });

  // Obter categorias únicas
  const categories = ['all', ...Array.from(new Set(supervisorCells.map((c) => c.category).filter(Boolean)))];

  const filteredCells = supervisorCells.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.address && c.address.toLowerCase().includes(search.toLowerCase())) ||
      (c.leaders && c.leaders.some((l) => l.name.toLowerCase().includes(search.toLowerCase())));

    if (!matchesSearch) return false;
    if (activeCategory !== 'all' && c.category !== activeCategory) return false;

    return true;
  });

  const totalCells = cells.length;
  const totalLeaders = cells.reduce((acc, c) => acc + (c.leaders?.length || 0), 0);

  const openGoogleMaps = (c: ChurchCell) => {
    if (c.latitude && c.longitude) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${c.latitude},${c.longitude}`, '_blank');
    } else if (c.address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-amber-950/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Home className="w-3.5 h-3.5" />
            <span>Pequenos Grupos & Células</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Gestão de Células da Igreja
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Acompanhamento dos pequenos grupos espalhados por João Pessoa (Gramame e regiões), líderes, locais de reunião e contatos.
          </p>
        </div>

        <button
          onClick={loadCells}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-amber-950/40 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Células</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Total de Células</span>
            <Home className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalCells}</div>
          <p className="text-[10px] text-zinc-500">Pequenos grupos ativos</p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Líderes de Célula</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">{totalLeaders}</div>
          <p className="text-[10px] text-zinc-500">Lideranças à frente</p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Bairros Atendidos</span>
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">Gramame & JP</div>
          <p className="text-[10px] text-zinc-500">João Pessoa / PB</p>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-zinc-900/80 border border-zinc-800/80 p-3 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome da célula, líder ou rua..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat || 'all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap capitalize ${
                activeCategory === cat
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {cat === 'all' ? `Todas (${totalCells})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Células */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <p className="text-xs text-zinc-400">Carregando células cadastradas...</p>
        </div>
      ) : filteredCells.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-zinc-900/40 rounded-3xl border border-zinc-800">
          <Home className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-zinc-300">Nenhuma célula encontrada</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Verifique o termo digitado ou sincronize os dados com o Supabase.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCells.map((cell) => (
            <div
              key={cell.id}
              className="bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/40 rounded-3xl overflow-hidden flex flex-col justify-between transition group shadow-sm hover:shadow-xl hover:shadow-amber-950/20"
            >
              <div>
                {/* Header da Célula com Imagem ou Gradiente */}
                <div className="h-32 bg-zinc-800 relative overflow-hidden">
                  {cell.image ? (
                    <img
                      src={cell.image}
                      alt={cell.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-purple-900/40 to-amber-900/30 flex items-center justify-center">
                      <Home className="w-10 h-10 text-zinc-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
                  
                  {cell.category && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-zinc-900/90 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                      {cell.category}
                    </span>
                  )}
                  
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-base font-black text-white tracking-tight group-hover:text-amber-300 transition">
                      {cell.name}
                    </h3>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-5 space-y-4">
                  {/* Líderes */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                      Liderança da Célula
                    </span>
                    {cell.leaders && cell.leaders.length > 0 ? (
                      <div className="space-y-2">
                        {cell.leaders.map((leader, idx) => {
                          const waUrl = ChurchDataService.formatWhatsAppUrl(
                            leader.phone,
                            `Olá ${leader.name.split(' ')[0]}, a paz!`
                          );
                          return (
                            <div key={idx} className="flex items-center justify-between text-xs bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                              <div className="truncate pr-2">
                                <span className="font-semibold text-zinc-200 block truncate">{leader.name}</span>
                                {leader.phone && (
                                  <span className="text-[11px] text-zinc-500">{leader.phone}</span>
                                )}
                              </div>
                              {waUrl && (
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition shrink-0"
                                  title="Chamar Líder no WhatsApp"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 italic">Líder não especificado</p>
                    )}
                  </div>

                  {/* Supervisores */}
                  {cell.supervisors && cell.supervisors.length > 0 && (
                    <div className="text-xs text-zinc-400">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                        Supervisão:
                      </span>
                      <span className="text-zinc-300">
                        {cell.supervisors.map((s) => s.name).join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Dia da semana */}
                  {cell.weekdays && cell.weekdays.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 py-1.5 px-3 rounded-xl border border-amber-500/20 w-fit">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{cell.weekdays.join(', ')}</span>
                    </div>
                  )}

                  {/* Endereço */}
                  {cell.address && (
                    <div className="text-xs text-zinc-400 space-y-1">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                        Endereço
                      </span>
                      <div className="flex items-start gap-1.5 text-zinc-300">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{cell.address}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botão de Localização no Google Maps */}
              <div className="p-4 bg-zinc-950/60 border-t border-zinc-800">
                <button
                  onClick={() => openGoogleMaps(cell)}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-zinc-700 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ver Rota no Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500 ml-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
