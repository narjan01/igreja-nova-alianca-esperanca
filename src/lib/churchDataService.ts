import { getSupabase } from './supabase';
import { ChurchMember, ChurchCell, ChurchEvent, ChurchWord, ChurchNews } from '../types';

export const DEFAULT_WORDS: ChurchWord[] = [
  {
    id: 'palavra-1',
    title: 'A Fidelidade de Deus que se Renova a Cada Manhã',
    subtitle: 'Lamentações 3:22-23',
    preacher: 'Pr. Raimundo Nonato',
    preacherRole: 'Pastor Fundador - Nova Aliança Global',
    date: '2026-10-18',
    reference: 'Lamentações 3:22-23',
    category: 'Edificação',
    image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1200&auto=format&fit=crop',
    summary: 'As misericórdias do Senhor são a causa de não sermos consumidos. Em tempos de incerteza, a fidelidade de Deus permanece inabalável sobre nossas vidas e famílias.',
    content: `Texto Bíblico: "As misericórdias do Senhor são a causa de não sermos consumidos, porque as suas misericórdias não têm fim; renovam-se cada manhã. Grande é a tua fidelidade." — Lamentações 3:22-23

Quantas vezes somos tentados a olhar para as circunstâncias e esquecer de quem cuida de nós? O profeta Jeremias escreveu o livro de Lamentações em meio a um cenário de ruínas e dores profundas. Ainda assim, no meio do lamento, ele toma uma decisão espiritual determinante: "Disso me recordarei no meu coração; por isso, tenho esperança".

A fidelidade de Deus não depende da estabilidade do mundo exterior, mas do Seu caráter imutável. Cada manhã que nasce traz consigo um suprimento fresco de graça e misericórdia para a sua caminhada. Quando você acordar amanhã, lembre-se: Deus já preparou nova graça para você vencer.

Permaneça firme na oração, enraizado na Palavra e conectado à igreja. O mesmo Deus que sustentou o ministério ao longo desses mais de 20 anos continuará cuidando de cada detalhe da sua história.`
  },
  {
    id: 'palavra-2',
    title: 'O Princípio do Amor: Amamos Porque Ele nos Amou Primeiro',
    subtitle: '1 João 4:19',
    preacher: 'Pra. Maria de Jesus',
    preacherRole: 'Pastora Fundadora - Nova Aliança Global',
    date: '2026-10-15',
    reference: '1 João 4:19',
    category: 'Vida Cristã',
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1200&auto=format&fit=crop',
    summary: 'O amor não é apenas um sentimento, mas a própria essência de Deus e a identidade da Igreja. Tudo o que fazemos deve nascer de um coração que compreendeu o amor da Cruz.',
    content: `Texto Bíblico: "Nós o amamos porque ele nos amou primeiro." — 1 João 4:19

Desde que a Nova Aliança nasceu em 2005 em Imperatriz/MA, nosso alicerce sempre foi claro: Amar a Deus e amar pessoas. Essa não é apenas uma frase de parede, é o pulso da nossa caminhada cristã.

Quando compreendemos a magnitude do sacrifício de Jesus por nós, o egoísmo perde o poder. O amor de Deus nos constrange a cuidar daquele que está ao nosso lado, a acolher o necessitado, a perdoar com generosidade e a viver em verdadeira comunhão.

Não permita que o ritmo acelerado dos dias esfrie o seu coração. Ame sua família, sirva sua célula, envolva-se na vida da igreja. Quem é amado por Deus aprende a amar como Deus ama.`
  },
  {
    id: 'palavra-3',
    title: 'Igreja de Revelação e Poder: Vivendo os 7 Pilares',
    subtitle: 'Efésios 1:17-19',
    preacher: 'Ministério Pastoral Nova Aliança',
    preacherRole: 'Liderança Pastoral',
    date: '2026-10-12',
    reference: 'Efésios 1:17-19',
    category: 'Doutrina & Visão',
    image: 'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5b?q=80&w=1200&auto=format&fit=crop',
    summary: 'Não nos conformamos com a religiosidade estéril. Somos chamados a viver no Espírito, experimentando a Palavra viva, liberdade, santidade e autoridade em Cristo.',
    content: `Texto Bíblico: "Peço que o Deus de nosso Senhor Jesus Cristo, o glorioso Pai, lhes dê espírito de sabedoria e de revelação, no pleno conhecimento dele." — Efésios 1:17

Nossa visão ministerial não se baseia em sabedoria humana, mas na manifestação viva do poder de Deus. Entre os nossos pilares fundamentais, destacamos: Ser uma igreja da Palavra, do Poder de Deus, da Santidade, da Liberdade, de Família, de Células e de Revelação.

Uma igreja de revelação tem os olhos do coração iluminados pelo Espírito Santo. Isso traz discernimento para as decisões diárias, paz nas tempestades e ousadia para pregar as Boas Novas com sinais e maravilhas.

Que a sua vida seja um altar vivo de consagração e testemunho vivo do que Jesus fez!`
  },
  {
    id: 'palavra-4',
    title: 'Células: Pequenos para Cuidar, Grandes para Impactar',
    subtitle: 'Atos 2:46-47',
    preacher: 'Supervisão de Células',
    preacherRole: 'Coordenação de Redes',
    date: '2026-10-08',
    reference: 'Atos 2:46-47',
    category: 'Comunhão & Discipulado',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
    summary: 'A igreja primitiva crescia de casa em casa e no templo. Descubra como os pequenos grupos transformam relacionamentos e fortalecem sua caminhada de fé.',
    content: `Texto Bíblico: "Diariamente perseveravam unânimes no templo, partiam pão de casa em casa e tomavam as suas refeições com alegria e singeleza de coração, louvando a Deus e contando com a simpatia de todo o povo." — Atos 2:46-47

Nenhum cristão foi chamado para caminhar sozinho. Na multidão do domingo nos alegramos em adoração coletiva, mas é na sala da célula que nós nos conhecemos pelo nome, oramos pelas lutas uns dos outros e partilhamos a vida real.

A visão da Nova Aliança é ser uma igreja pequena o suficiente para cuidar de cada pessoa e grande o suficiente para impactar nações. Se você ainda não está inserido em uma célula em João Pessoa, venha fazer parte de uma família espiritual perto de sua casa!`
  }
];

export const DEFAULT_NEWS: ChurchNews[] = [
  {
    id: 'noticia-1',
    title: 'Celebração dos 20 Anos da Nova Aliança Global',
    category: 'Institucional',
    badge: 'Destaque',
    date: '2025-07-20',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
    summary: 'Duas décadas de história, milagres, plantação de igrejas e vidas transformadas pelo Evangelho no Brasil e no exterior.',
    content: `Com profunda gratidão ao Senhor, celebramos 20 anos de fundação da Nova Aliança Global, marco histórico comemorado em julho de 2025.

Iniciada em 2005 na cidade de Imperatriz, Maranhão, sob a liderança dos pastores Raimundo Nonato e Maria de Jesus, a igreja nasceu do anseio de amar a Deus e cuidar genuinamente de pessoas.

Hoje, nossa rede de comunhão e suporte alcança igrejas em diversos estados brasileiros e frentes missionárias internacionais. Em João Pessoa/PB, a Nova Aliança Esperança celebra essa história viva, dando continuidade à missão de proclamar a Palavra, treinar líderes e manifestar o amor prático de Cristo em cada bairro da capital paraibana.`
  },
  {
    id: 'noticia-2',
    title: 'Expansão das Células nos Bairros de João Pessoa',
    category: 'Células & Redes',
    badge: 'Comunidade',
    date: '2026-10-14',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop',
    summary: 'Novas frentes de comunhão e discipulado estão sendo abertas em diversos bairros da capital paraibana. Participe!',
    content: `A expansão das nossas células em João Pessoa continua em ritmo acelerado! Com grupos atuantes em Gramame, Colinas do Sul, Valentina, Mangabeira, Bancários, Geisel, Cristo e Zona Leste/Praia, as células são o coração do discipulado e acolhimento da Nova Aliança Esperança.

Durante os encontros semanais, compartilhamos reflexões práticas da Palavra de Deus, desfrutamos de comunhão sincera e oramos uns pelos outros.

Procure seu líder de rede ou converse com nossa equipe pastoral para encontrar a célula mais próxima de você e integrar-se a esta família!`
  },
  {
    id: 'noticia-3',
    title: 'Nova Aliança Social: Ação de Amor e Assistência Comunitária',
    category: 'Social & Missões',
    badge: 'Ação Social',
    date: '2026-10-10',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
    summary: 'Igreja mobiliza membros e voluntários para arrecadação de cestas básicas e apoio a famílias em vulnerabilidade social.',
    content: `A compaixão social é um dos pilares inegociáveis do Evangelho de Cristo. O ministério Nova Aliança Esperança realizou mais uma etapa da campanha de suporte e acolhimento a famílias em situação de vulnerabilidade em nosso bairro e região metropolitana.

Foram arrecadadas e entregues dezenas de cestas de alimentos, além de momentos de oração, aconselhamento e acolhimento espiritual.

Agradecemos a cada membro, voluntário e família que tem contribuído com alegria e generosidade. Ser igreja é estender as mãos a quem precisa!`
  },
  {
    id: 'noticia-4',
    title: 'Escola de Líderes e Discipulado: Novas Turmas Abertas',
    category: 'Treinamento',
    badge: 'Capacitação',
    date: '2026-10-05',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    summary: 'Formação ministerial contínua para novos líderes de células, supervisores e servos nos ministérios da igreja.',
    content: `Estão abertas as inscrições para os novos módulos da Escola de Líderes da Nova Aliança Esperança.

O curso abrange fundamentos bíblicos, princípios de liderança servidora, dinâmica e multiplicação de células, aconselhamento e vida devocional.

Se você deseja aprofundar suas raízes na Palavra e se equipar para servir com excelência na obra do Senhor, fale com a liderança pastoral e garanta sua vaga.`
  }
];

export class ChurchDataService {
  /**
   * Busca palavras/mensagens pastorais
   */
  static async getWords(): Promise<ChurchWord[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('church_words')
          .select('*')
          .order('date', { ascending: false });

        if (!error && data && data.length > 0) {
          localStorage.setItem('cached_church_words', JSON.stringify(data));
          return data as ChurchWord[];
        }
      } catch (e) {
        console.warn('Erro ao carregar palavras do Supabase:', e);
      }
    }

    const cached = localStorage.getItem('cached_church_words');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }

    localStorage.setItem('cached_church_words', JSON.stringify(DEFAULT_WORDS));
    return DEFAULT_WORDS;
  }

  /**
   * Busca notícias e comunicados
   */
  static async getNews(): Promise<ChurchNews[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('church_news')
          .select('*')
          .order('date', { ascending: false });

        if (!error && data && data.length > 0) {
          localStorage.setItem('cached_church_news', JSON.stringify(data));
          return data as ChurchNews[];
        }
      } catch (e) {
        console.warn('Erro ao carregar notícias do Supabase:', e);
      }
    }

    const cached = localStorage.getItem('cached_church_news');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }

    localStorage.setItem('cached_church_news', JSON.stringify(DEFAULT_NEWS));
    return DEFAULT_NEWS;
  }

  /**
   * Salva ou atualiza palavras
   */
  static async upsertWords(words: ChurchWord[]): Promise<boolean> {
    localStorage.setItem('cached_church_words', JSON.stringify(words));
    const supabase = getSupabase();
    if (!supabase) return true;
    try {
      await supabase.from('church_words').upsert(words);
    } catch {}
    return true;
  }

  /**
   * Salva ou atualiza notícias
   */
  static async upsertNews(news: ChurchNews[]): Promise<boolean> {
    localStorage.setItem('cached_church_news', JSON.stringify(news));
    const supabase = getSupabase();
    if (!supabase) return true;
    try {
      await supabase.from('church_news').upsert(news);
    } catch {}
    return true;
  }

  /**
   * Busca eventos/cultos do Supabase (com cache local)
   */
  static async getEvents(): Promise<ChurchEvent[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('id', { ascending: false });

        if (!error && data && data.length > 0) {
          localStorage.setItem('cached_church_events', JSON.stringify(data));
          return data as ChurchEvent[];
        }
      } catch (e) {
        console.warn('Erro ao carregar eventos do Supabase:', e);
      }
    }

    // Fallback: cache local
    const cached = localStorage.getItem('cached_church_events');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }

    return [];
  }

  /**
   * Busca membros do Supabase (com cache local)
   */
  static async getMembers(): Promise<ChurchMember[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .order('full_name', { ascending: true });

        if (!error && data && data.length > 0) {
          localStorage.setItem('cached_church_members', JSON.stringify(data));
          return data as ChurchMember[];
        }
      } catch (e) {
        console.warn('Erro ao carregar membros do Supabase:', e);
      }
    }

    // Fallback: cache local
    const cached = localStorage.getItem('cached_church_members');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }

    return [];
  }

  /**
   * Busca células do Supabase (com cache local)
   */
  static async getCells(): Promise<ChurchCell[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('cells')
          .select('*')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          localStorage.setItem('cached_church_cells', JSON.stringify(data));
          return data as ChurchCell[];
        }
      } catch (e) {
        console.warn('Erro ao carregar células do Supabase:', e);
      }
    }

    // Fallback: cache local
    const cached = localStorage.getItem('cached_church_cells');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }

    return [];
  }

  /**
   * Salva ou atualiza membros no Supabase
   */
  static async upsertMembers(members: ChurchMember[]): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from('members').upsert(members);
      if (error) {
        console.error('Erro ao fazer upsert de membros no Supabase:', error);
        return false;
      }
      localStorage.setItem('cached_church_members', JSON.stringify(members));
      return true;
    } catch (e) {
      console.error('Falha no upsert de membros:', e);
      return false;
    }
  }

  /**
   * Salva ou atualiza células no Supabase
   */
  static async upsertCells(cells: ChurchCell[]): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from('cells').upsert(cells);
      if (error) {
        console.error('Erro ao fazer upsert de células no Supabase:', error);
        return false;
      }
      localStorage.setItem('cached_church_cells', JSON.stringify(cells));
      return true;
    } catch (e) {
      console.error('Falha no upsert de células:', e);
      return false;
    }
  }

  /**
   * Formata telefone para link direto do WhatsApp
   */
  static formatWhatsAppUrl(phone: string | null | undefined, message: string = ''): string | null {
    if (!phone) return null;
    const clean = phone.replace(/\D/g, '');
    if (!clean) return null;
    const full = clean.startsWith('55') ? clean : `55${clean}`;
    const text = message ? `?text=${encodeURIComponent(message)}` : '';
    return `https://wa.me/${full}${text}`;
  }

  /**
   * Verifica se o membro faz aniversário no mês atual
   */
  static isBirthdayInCurrentMonth(birthday: string | null | undefined): boolean {
    if (!birthday) return false;
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const parts = birthday.split('-');
    if (parts.length >= 2) {
      const bMonth = parseInt(parts[1], 10);
      return bMonth === currentMonth;
    }
    return false;
  }
}
