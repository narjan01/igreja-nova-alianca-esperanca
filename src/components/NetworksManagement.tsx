import React, { useState, useEffect } from 'react';
import { ChurchCell, AuthUser } from '../types';
import { ChurchDataService } from '../lib/churchDataService';
import { 
  Users, 
  Home, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Sparkles, 
  Navigation, 
  Calendar, 
  RefreshCw,
  Mail,
  ShieldCheck,
  Search,
  Filter,
  Layers,
  UserCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface NetworksManagementProps {
  currentUser: AuthUser;
}

interface NetworkGroup {
  name: string;
  supervisors: { name: string; phone?: string | null; email?: string | null }[];
  cells: ChurchCell[];
}

export const NetworksManagement: React.FC<NetworksManagementProps> = ({ currentUser }) => {
  const [cells, setCells] = useState<ChurchCell[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');

  useEffect(() => {
    loadCells();
  }, []);

  const loadCells = async () => {
    setLoading(true);
    const data = await ChurchDataService.getCells();
    setCells(data);
    setLoading(false);
  };

  // Agrupar células por categoria / Rede
  const networkMap: Record<string, NetworkGroup> = {};

  cells.forEach((cell) => {
    const rawCategory = cell.category || 'Geral';
    // Mapeamento limpo da rede
    let netName = rawCategory;
    if (rawCategory === 'Crianças' || rawCategory.toLowerCase().includes('crian')) netName = 'Rede de Crianças';
    else if (rawCategory === 'Jovens') netName = 'Rede de Jovens';
    else if (rawCategory === 'Adolescentes') netName = 'Rede de Adolescentes';
    else if (rawCategory === 'Adultos') netName = 'Rede de Adultos';
    else if (rawCategory === 'Mulheres') netName = 'Rede de Mulheres';
    else if (rawCategory === 'Misto' || rawCategory === 'Outros') netName = 'Rede de Apoio & Ministérios';

    if (!networkMap[netName]) {
      networkMap[netName] = {
        name: netName,
        supervisors: [],
        cells: []
      };
    }

    networkMap[netName].cells.push(cell);

    // Coletar supervisores da célula
    if (cell.supervisors && cell.supervisors.length > 0) {
      cell.supervisors.forEach((sup) => {
        if (!networkMap[netName].supervisors.some((s) => s.name === sup.name)) {
          networkMap[netName].supervisors.push(sup);
        }
      });
    }
  });

  const allNetworks = Object.values(networkMap);

  // REGRA DE NÍVEL DE ACESSO:
  // Se for Supervisor, filtrar estritamente para sua própria rede!
  const isSupervisorOnly = currentUser.role === 'supervisor';
  
  const allowedNetworks = allNetworks.filter((net) => {
    if (currentUser.role === 'admin') return true; // Admin vê todas
    if (!isSupervisorOnly) return true;

    // Se tiver rede especificada no usuário (ex: 'Jovens', 'Adultos')
    if (currentUser.network) {
      return net.name.toLowerCase().includes(currentUser.network.toLowerCase());
    }

    // Se tiver nome do supervisor no usuário
    if (currentUser.supervisorName) {
      const matchSupervisor = net.supervisors.some((s) =>
        s.name.toLowerCase().includes(currentUser.supervisorName!.toLowerCase())
      );
      if (matchSupervisor) return true;
    }

    return true;
  });

  // Filtragem adicional de busca
  const displayNetworks = allowedNetworks.map((net) => {
    const matchingCells = net.cells.filter((c) => {
      const matchesSearch = 
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.address && c.address.toLowerCase().includes(search.toLowerCase())) ||
        (c.leaders && c.leaders.some((l) => l.name.toLowerCase().includes(search.toLowerCase())));
      return matchesSearch;
    });

    return {
      ...net,
      cells: matchingCells
    };
  }).filter((net) => selectedNetwork === 'all' || net.name === selectedNetwork);

  const totalAllowedCells = allowedNetworks.reduce((acc, n) => acc + n.cells.length, 0);

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Banner de Identificação do Nível de Acesso */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-zinc-900 to-sky-950/40 border border-blue-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-black text-white">Módulo 2: Controle de Redes</h2>
            {isSupervisorOnly ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Acesso Restrito: Sua Rede</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                Controle Total de Redes
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400">
            {isSupervisorOnly
              ? `Você está conectado como supervisor (${currentUser.name}) e visualiza exclusivamente a sua Rede designada.`
              : 'Gerenciamento hierárquico das redes da igreja, supervisores e células vinculadas.'}
          </p>
        </div>

        <button
          onClick={loadCells}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold border border-zinc-700 flex items-center gap-2 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Redes</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar célula, líder ou endereço na rede..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-2xl pl-10 pr-4 py-2.5 text-xs placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Seletor de Redes (visível se tiver mais de uma permitida) */}
        {allowedNetworks.length > 1 && (
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition"
          >
            <option value="all">Todas as Redes ({allowedNetworks.length})</option>
            {allowedNetworks.map((n) => (
              <option key={n.name} value={n.name}>
                {n.name} ({n.cells.length} células)
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Exibição das Redes e suas Células */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-zinc-400">Carregando redes e supervisores...</p>
        </div>
      ) : displayNetworks.length === 0 ? (
        <div className="py-16 text-center bg-zinc-900/40 rounded-3xl border border-zinc-800 space-y-2">
          <Layers className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-300">Nenhuma rede ou célula encontrada</h3>
          <p className="text-xs text-zinc-500">Tente ajustar o termo da busca.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {displayNetworks.map((network) => (
            <div 
              key={network.name}
              className="bg-zinc-900/80 border border-blue-900/30 rounded-3xl p-5 sm:p-7 space-y-6 shadow-xl"
            >
              {/* Cabeçalho da Rede */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-xl font-black text-white">
                      {network.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-sky-300 border border-blue-500/30 text-[11px] font-bold">
                      {network.cells.length} {network.cells.length === 1 ? 'Célula' : 'Células'}
                    </span>
                  </div>

                  {/* Supervisores da Rede */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 pt-0.5">
                    <span className="font-semibold text-zinc-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                      Supervisão:
                    </span>
                    {network.supervisors.length > 0 ? (
                      network.supervisors.map((s, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-medium flex items-center gap-1.5"
                        >
                          <span>{s.name}</span>
                          {s.phone && (
                            <a 
                              href={`https://wa.me/${s.phone.replace(/\D/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300"
                              title="WhatsApp"
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                          )}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-500 italic">Supervisão Geral Pastoral</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid das Células da Rede */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {network.cells.map((cell) => {
                  const hasCoordinates = cell.latitude && cell.longitude;
                  const gmapsUrl = hasCoordinates 
                    ? `https://www.google.com/maps/search/?api=1&query=${cell.latitude},${cell.longitude}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((cell.address || cell.name) + ' João Pessoa PB')}`;

                  return (
                    <div
                      key={cell.id}
                      className="bg-zinc-950 border border-zinc-800 hover:border-sky-500/40 rounded-2xl p-4 space-y-3 flex flex-col justify-between transition group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-black text-white group-hover:text-sky-300 transition">
                            {cell.name}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-sky-400">
                            Célula
                          </span>
                        </div>

                        {/* Líderes da Célula */}
                        <div className="space-y-1 text-xs">
                          <span className="text-[11px] font-semibold text-zinc-400 block">
                            Liderança:
                          </span>
                          {cell.leaders && cell.leaders.length > 0 ? (
                            cell.leaders.map((leader, i) => (
                              <div key={i} className="flex items-center justify-between text-zinc-300 bg-zinc-900/60 px-2 py-1 rounded-lg">
                                <span className="font-medium truncate">{leader.name}</span>
                                {leader.phone && (
                                  <a
                                    href={`https://wa.me/${leader.phone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 hover:underline shrink-0 flex items-center gap-1 text-[11px]"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>WhatsApp</span>
                                  </a>
                                )}
                              </div>
                            ))
                          ) : (
                            <span className="text-zinc-500 italic">Líder em transição</span>
                          )}
                        </div>

                        {/* Endereço */}
                        {cell.address && (
                          <div className="flex items-start gap-1.5 text-xs text-zinc-400 pt-1">
                            <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{cell.address}</span>
                          </div>
                        )}
                      </div>

                      {/* Rodapé da Célula com Link no Google Maps */}
                      <div className="pt-2 border-t border-zinc-900 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500 font-mono">
                          ID inChurch: {cell.id}
                        </span>

                        <a
                          href={gmapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-400 hover:text-sky-300 transition"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Abrir Rota</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
