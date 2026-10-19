import React, { useState, useEffect } from 'react';
import { ChurchMember } from '../types';
import { ChurchDataService } from '../lib/churchDataService';
import { 
  Users, 
  Search, 
  Cake, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Droplet, 
  ExternalLink, 
  RefreshCw, 
  Filter, 
  UserCheck, 
  UserX,
  Mail,
  ChevronRight,
  Sparkles,
  Download
} from 'lucide-react';

interface MembersManagementProps {
  onBack?: () => void;
}

export const MembersManagement: React.FC<MembersManagementProps> = ({ onBack }) => {
  const [members, setMembers] = useState<ChurchMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'members' | 'leaders' | 'birthdays' | 'baptized'>('all');
  const [selectedMember, setSelectedMember] = useState<ChurchMember | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    const data = await ChurchDataService.getMembers();
    setMembers(data);
    setLoading(false);
  };

  const currentMonthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());

  // Filtros aplicados
  const filteredMembers = members.filter((m) => {
    // Busca por texto
    const matchesSearch = 
      m.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (m.mobile_phone && m.mobile_phone.includes(search)) ||
      (m.location?.neighborhood && m.location.neighborhood.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'leaders') return m.is_leader || m.is_pastor;
    if (activeFilter === 'members') return m.church_profile === 'member';
    if (activeFilter === 'birthdays') return ChurchDataService.isBirthdayInCurrentMonth(m.birthday);
    if (activeFilter === 'baptized') return m.baptized;

    return true;
  });

  // Métricas
  const totalCount = members.length;
  const leadersCount = members.filter((m) => m.is_leader || m.is_pastor).length;
  const birthdaysMonthCount = members.filter((m) => ChurchDataService.isBirthdayInCurrentMonth(m.birthday)).length;
  const baptizedCount = members.filter((m) => m.baptized).length;

  const handleExportCSV = () => {
    const headers = ['ID', 'Nome Completo', 'Perfil', 'Líder', 'Telefone', 'WhatsApp', 'Aniversário', 'Batizado', 'Bairro'];
    const rows = filteredMembers.map((m) => [
      m.id,
      `"${m.full_name}"`,
      m.church_profile || 'Outro',
      m.is_leader ? 'Sim' : 'Não',
      m.mobile_phone || m.phone || '',
      m.has_whatsapp ? 'Sim' : 'Não',
      m.birthday || '',
      m.baptized ? 'Sim' : 'Não',
      `"${m.location?.neighborhood || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `membros_ina_esperanca_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/60 via-zinc-900 to-zinc-900 border border-purple-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-purple-950/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            <Users className="w-3.5 h-3.5" />
            <span>Módulo de Gestão de Pessoas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Controle de Membros & Liderança
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Base sincronizada via inChurch API e Supabase com contatos, fotos, perfis e aniversários.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold transition flex items-center gap-2 border border-zinc-700"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={loadMembers}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/40 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar Dados</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Total Cadastrado</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalCount}</div>
          <p className="text-[10px] text-zinc-500">Membros & Visitantes</p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Líderes & Pastores</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{leadersCount}</div>
          <p className="text-[10px] text-zinc-500">Equipe de liderança ativa</p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Aniversariantes</span>
            <Cake className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-black text-pink-400">{birthdaysMonthCount}</div>
          <p className="text-[10px] text-zinc-500 capitalize">Neste mês ({currentMonthName})</p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Batizados</span>
            <Droplet className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">{baptizedCount}</div>
          <p className="text-[10px] text-zinc-500">Com registro de batismo</p>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-zinc-900/80 border border-zinc-800/80 p-3 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, telefone ou bairro (ex: Gramame)..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-purple-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Todos ({totalCount})
          </button>
          <button
            onClick={() => setActiveFilter('members')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              activeFilter === 'members'
                ? 'bg-purple-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Membros
          </button>
          <button
            onClick={() => setActiveFilter('leaders')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              activeFilter === 'leaders'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Líderes ({leadersCount})
          </button>
          <button
            onClick={() => setActiveFilter('birthdays')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              activeFilter === 'birthdays'
                ? 'bg-pink-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            🎂 Aniversariantes ({birthdaysMonthCount})
          </button>
        </div>
      </div>

      {/* Grid de Membros */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <p className="text-xs text-zinc-400">Carregando membros da base de dados...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-zinc-900/40 rounded-3xl border border-zinc-800">
          <UserX className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-zinc-300">Nenhum membro encontrado</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {search ? 'Tente buscar com outros termos.' : 'Execute a sincronização para importar os membros.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const isBirthday = ChurchDataService.isBirthdayInCurrentMonth(member.birthday);
            const whatsappUrl = ChurchDataService.formatWhatsAppUrl(
              member.mobile_phone || member.phone,
              `Olá ${member.full_name.split(' ')[0]}, a paz do Senhor!`
            );

            return (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="bg-zinc-900/90 border border-zinc-800 hover:border-purple-500/40 rounded-3xl p-5 space-y-4 transition cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-lg hover:shadow-purple-950/20"
              >
                <div className="flex items-start gap-3.5">
                  {/* Foto de Perfil */}
                  <div className="relative shrink-0">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.full_name}
                        className="w-13 h-13 rounded-2xl object-cover border border-zinc-700 group-hover:border-purple-500 transition"
                      />
                    ) : (
                      <div className="w-13 h-13 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-black text-sm group-hover:border-purple-500 group-hover:text-purple-300 transition">
                        {member.full_name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    {member.is_leader && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center font-bold text-[10px] shadow" title="Líder">
                        ★
                      </span>
                    )}
                  </div>

                  {/* Informações Básicas */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition">
                        {member.full_name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {member.church_profile === 'member' ? (
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                          Membro
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-medium border border-zinc-700">
                          {member.church_profile || 'Visitante'}
                        </span>
                      )}

                      {isBirthday && (
                        <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/30 flex items-center gap-1">
                          🎂 Aniversário
                        </span>
                      )}

                      {member.baptized && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-medium border border-blue-500/20">
                          Batizado
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detalhes de Contato e Localização */}
                <div className="space-y-1.5 text-xs text-zinc-400 border-t border-zinc-800/80 pt-3">
                  {(member.mobile_phone || member.phone) && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="truncate">{member.mobile_phone || member.phone}</span>
                      </div>
                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[11px] font-bold border border-emerald-500/30 transition flex items-center gap-1"
                          title="Conversar no WhatsApp"
                        >
                          <span>WhatsApp</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  {member.location?.neighborhood && (
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{member.location.neighborhood}, João Pessoa</span>
                    </div>
                  )}

                  {member.birthday && (
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Cake className="w-3.5 h-3.5 shrink-0" />
                      <span>{member.birthday.split('-').reverse().join('/')}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Detalhes do Membro */}
      {selectedMember && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              {selectedMember.photo ? (
                <img
                  src={selectedMember.photo}
                  alt={selectedMember.full_name}
                  className="w-16 h-16 rounded-2xl object-cover border border-purple-500/40"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-black text-lg">
                  {selectedMember.full_name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-black text-white">{selectedMember.full_name}</h3>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                    {selectedMember.church_profile === 'member' ? 'Membro da Igreja' : 'Visitante'}
                  </span>
                  {selectedMember.is_leader && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                      Líder
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80">
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">ID inChurch</span>
                <span className="font-mono text-zinc-300">{selectedMember.id}</span>
              </div>
              {selectedMember.birthday && (
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-500">Data de Nascimento</span>
                  <span className="text-zinc-300">{selectedMember.birthday.split('-').reverse().join('/')}</span>
                </div>
              )}
              {selectedMember.mobile_phone && (
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-500">WhatsApp / Celular</span>
                  <span className="text-emerald-400 font-bold">{selectedMember.mobile_phone}</span>
                </div>
              )}
              {selectedMember.email && (
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-500">E-mail</span>
                  <span className="text-zinc-300">{selectedMember.email}</span>
                </div>
              )}
              {selectedMember.marital_status && (
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-500">Estado Civil</span>
                  <span className="text-zinc-300 capitalize">{selectedMember.marital_status}</span>
                </div>
              )}
              {selectedMember.occupation && (
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-500">Profissão</span>
                  <span className="text-zinc-300">{selectedMember.occupation}</span>
                </div>
              )}
              {selectedMember.location?.street_address && (
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-500">Endereço</span>
                  <span className="text-zinc-300 text-right max-w-xs">
                    {selectedMember.location.street_address}, {selectedMember.location.street_number || 'S/N'}
                    {selectedMember.location.neighborhood && ` - ${selectedMember.location.neighborhood}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Batizado nas Águas</span>
                <span className={selectedMember.baptized ? 'text-blue-400 font-bold' : 'text-zinc-500'}>
                  {selectedMember.baptized ? 'Sim' : 'Não informado'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              {ChurchDataService.formatWhatsAppUrl(selectedMember.mobile_phone || selectedMember.phone) && (
                <a
                  href={ChurchDataService.formatWhatsAppUrl(selectedMember.mobile_phone || selectedMember.phone)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Chamar no WhatsApp</span>
                </a>
              )}
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition"
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
