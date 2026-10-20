import { getSupabase } from './supabase';
import { ChurchMember, ChurchCell, ChurchEvent, ChurchWord, ChurchNews } from '../types';

export const DEFAULT_WORDS: ChurchWord[] = [
  {
    id: 'palavra-local-1',
    title: 'Série Família, Projeto de Deus: Os Filhos são Herança',
    subtitle: 'Salmos 127:3-5',
    preacher: 'Pra. Talita',
    preacherRole: 'Pastora Local — Nova Aliança Esperança',
    date: '2026-10-21',
    reference: 'Salmos 127:3',
    category: 'Família',
    image: 'https://storage.googleapis.com/media_files_prod/uploads/inchurch/None/image-cc7db9841487bf0350bbf743aa2d42ce.jpg',
    summary: 'Os filhos não são nossa propriedade, mas herança e flechas confiadas por Deus para impactar esta geração.',
    content: `Texto Bíblico: "Herança do Senhor são os filhos; o fruto do ventre, seu galardão. Como flechas na mão do guerreiro, assim os filhos da mocidade." — Salmos 127:3-4

Ministração da Pra. Talita na Igreja Nova Aliança Esperança em João Pessoa / PB.

Quando compreendemos que os nossos filhos pertencem primeiramente a Deus, nossa forma de educar, corrigir e amar se transforma por completo. Não fomos chamados a moldá-los segundo nossas frustrações ou ambições pessoais, mas a apontá-los como flechas para o alvo divino.

Cada filho é uma semente de eternidade confiada ao nosso lar. Criar filhos no temor do Senhor exige presença de qualidade, oração contínua, sacerdócio diário e exemplo vivo dentro de casa.

Que a nossa igreja seja um refúgio de cura, alinhamento e restauração para cada família da nossa comunidade em João Pessoa!`
  },
  {
    id: 'palavra-local-2',
    title: 'Série Família, Projeto de Deus: O Segredo de um Casamento Feliz',
    subtitle: 'Efésios 5:21-33',
    preacher: 'Irmão Gilson',
    preacherRole: 'Liderança Local — Nova Aliança Esperança',
    date: '2026-10-28',
    reference: 'Efésios 5:21',
    category: 'Casais & Família',
    image: 'https://storage.googleapis.com/media_files_prod/uploads/inchurch/None/image-7775a8b840890de9addd2af5b2f348b5.jpg',
    summary: 'O alicerce de uma união abençoada está na submissão mútua no temor de Cristo, no perdão diário e no amor sacrificial.',
    content: `Texto Bíblico: "Sujeitem-se uns aos outros, no temor de Cristo." — Efésios 5:21

Ministração do Irmão Gilson na Igreja Nova Aliança Esperança em João Pessoa / PB.

Qual é o verdadeiro segredo para construir uma relação sólida, abençoada e duradoura? O casamento não foi inventado pelo homem, mas desenhado por Deus como reflexo da união entre Cristo e a Sua Igreja.

Um casamento feliz não é a ausência de divergências, mas a presença diária da graça, da paciência e da renúncia do egoísmo. Quando marido e mulher colocam Cristo no centro, as tempestades não derrubam a casa, pois ela está edificada sobre a Rocha.

Investir na sua família é investir no seu maior patrimônio terreno. Traga seu lar para a presença do Senhor e viva o melhor de Deus na sua casa!`
  },
  {
    id: 'palavra-local-3',
    title: 'Quarta de Ensino: A Palavra que Transforma Vidas',
    subtitle: '2 Timóteo 3:16-17',
    preacher: 'Pr. Lucas',
    preacherRole: 'Pastor Local — Nova Aliança Esperança',
    date: '2026-10-18',
    reference: '2 Timóteo 3:16-17',
    category: 'Ensino Bíblico',
    image: 'https://storage.googleapis.com/media_files_prod/uploads/inchurch/None/image-3a8a1502b77a862b727d51ec39b827d1.jpg',
    summary: 'A Palavra de Deus não volta vazia. Em tempos de incerteza, o ensino das Escrituras ilumina nosso caminho e nos dá firmeza espiritual.',
    content: `Texto Bíblico: "Toda a Escritura é divinamente inspirada, e proveitosa para ensinar, para redarguir, para corrigir, para instruir em justiça." — 2 Timóteo 3:16

Ministração do Pr. Lucas na tradicional Quarta de Ensino da Nova Aliança Esperança.

Não podemos viver uma fé fundamentada apenas em emoções passageiras. Precisamos de raízes profundas no solo da Palavra. Quando estudamos as Escrituras com coração dócil e mente aberta, o Espírito Santo gera maturidade, discernimento e sabedoria para todas as decisões do nosso dia a dia.

A Quarta de Ensino é um espaço sagrado da nossa comunidade local onde nos assentamos para aprender, crescer e nos armar espiritualmente para as batalhas da vida. Venha toda quarta às 19h30 alimentar sua alma!`
  },
  {
    id: 'palavra-local-4',
    title: 'Culto de Atos de Justiça: Fé Viva e Santidade Prática',
    subtitle: 'Tiago 2:14-18',
    preacher: 'Ministra Jamilly Nóbrega',
    preacherRole: 'Ministério Local — Nova Aliança Esperança',
    date: '2026-10-15',
    reference: 'Tiago 2:18',
    category: 'Vida Cristã',
    image: 'https://storage.googleapis.com/media_files_prod/uploads/inchurch/None/image-e997118c2931310f41c4b4681db9c7b6.jpg',
    summary: 'A verdadeira fé se manifesta em ações de amor, compaixão e santidade que impactam quem está ao nosso redor.',
    content: `Texto Bíblico: "Mostra-me a tua fé sem as obras, e eu te mostrarei a minha fé pelas minhas obras." — Tiago 2:18

Ministração da Ministra Jamilly Nóbrega na Nova Aliança Esperança em João Pessoa / PB.

Adorar a Deus não termina quando o culto se encerra no domingo. O verdadeiro culto continua na segunda-feira, quando estendemos a mão a quem precisa, quando exercemos integridade no trabalho, quando perdoamos quem nos ofendeu e quando vivemos uma santidade que brilha no meio da sociedade.

Atos de justiça nascem de um coração transformado pela Cruz. Somos a voz e as mãos de Jesus na capital paraibana. Que a nossa vida seja um testemunho inquestionável do poder do Evangelho!`
  }
];

export const DEFAULT_NEWS: ChurchNews[] = [
  {
    id: 'noticia-local-1',
    title: 'Vigília Revival: Noite de Avivamento e Clamor na Nova Aliança Esperança',
    category: 'Avivamento',
    badge: 'Destaque Local',
    date: '2026-11-07',
    image: 'https://storage.googleapis.com/media_files_prod/uploads/inchurch/None/image-1a245a88e872daf34b1c00ea91361e2f.jpg',
    summary: 'Sábado, 07 de Novembro, das 22h às 05h no templo em Colinas do Sul / Gramame. Clamor contínuo pelo mover do Espírito Santo.',
    content: `Baseada no chamado de Efésios 5:14 — "Desperta, tu que dormes, levanta-te dentre os mortos, e Cristo te iluminará!" —, a Igreja Nova Aliança Esperança realizará a grande Vigília Revival no próximo dia 07 de novembro de 2026.

Será uma noite histórica de adoração ininterrupta, oração de intercessão, ministração da Palavra e clamor por um avivamento que alcance os quatro cantos de João Pessoa e da Paraíba.

O encontro iniciará às 22h do sábado e seguirá até às 05h da manhã do domingo em nosso templo central (Rua Joaquim Monteiro da Franca, nº 457, Colinas do Sul). Convoque sua célula, convide sua família e venha com o coração aberto para viver o sobrenatural!`
  },
  {
    id: 'noticia-local-2',
    title: '🎈 Culto Kids Especial: Alegria e Ensino Bíblico para os Pequenos',
    category: 'Ministério Infantil',
    badge: 'Kids & Família',
    date: '2026-10-31',
    image: 'https://storage.googleapis.com/media_files_prod/uploads/inchurch/None/image-a86377319ca3768c6eec12f3b116d621.jpg',
    summary: 'Tarde com louvor infantil, teatro, dinâmicas e brincadeiras no sábado, 31 de Outubro, às 15h em nosso templo.',
    content: `A equipe do ministério infantil da Nova Aliança Esperança preparou uma programação imperdível para as crianças da nossa igreja e de toda a vizinhança.

No sábado, 31 de outubro, das 15h às 18h, teremos o Culto Kids! Será uma tarde cheia de louvores alegres, histórias bíblicas interativas, oficinas, gincanas e um lanche especial.

Acreditamos que discipular os pequenos desde a infância é construir alicerces firmes para toda a vida. Traga seus filhos, sobrinhos e netos!`
  },
  {
    id: 'noticia-local-3',
    title: 'Aliança Jovem João Pessoa: Conexão, Louvor e Palavra aos Sábados às 19h',
    category: 'Juventude',
    badge: 'Aliança Jovem',
    date: '2026-10-17',
    image: 'https://storage.googleapis.com/media_files_prod/uploads/inchurch/None/image-783405f27e2f3afe7be531236f16d75b.jpg',
    summary: 'Os jovens e adolescentes da igreja se reúnem semanalmente com adoração fervorosa, temas atuais e celulões nos bairros.',
    content: `O movimento da juventude na Nova Aliança Esperança segue crescendo a cada semana! Todos os sábados, às 19h, o templo é tomado por jovens e adolescentes sedentos por Deus.

Os cultos da Aliança Jovem contam com louvor vibrante, pregações contextualizadas sobre desafios da juventude cristã, pureza, propósito de vida e chamado profissional, além de momentos de comunhão e oração mútua.

Se você busca um lugar para se conectar com amigos de fé e crescer espiritualmente em João Pessoa, venha fazer parte da Aliança Jovem neste sábado!`
  },
  {
    id: 'noticia-local-4',
    title: 'Células nos Lares: Comunhão de Casa em Casa nos Bairros de JP',
    category: 'Células & Redes',
    badge: 'Comunidade Local',
    date: '2026-10-14',
    image: 'https://storage.googleapis.com/media_files_prod/uploads/inchurch/None/image-76f5c72487bb310686c8229bb6e263b0.jpeg',
    summary: 'Célula Frutificar e demais pequenos grupos da igreja abrem suas casas toda semana para oração, estudo bíblico e cuidado mútuo.',
    content: `A vida da Igreja Nova Aliança Esperança acontece de casa em casa! Nossas células estão espalhadas pelos bairros da capital paraibana — incluindo Gramame, Colinas do Sul, Valentina, Bancários e Mangabeira.

Nas reuniões semanais das células, como a Célula Frutificar, os membros e visitantes experimentam acolhimento verdadeiro, compartilham a Palavra de forma prática e oram pelas necessidades uns dos outros em um clima fraterno e descontraído.

Procure a liderança pastoral ou fale com um supervisor de rede para saber qual célula se reúne mais perto de você e comece a participar!`
  }
];

export class ChurchDataService {
  /**
   * Busca palavras/mensagens pastorais locais da igreja
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
          localStorage.setItem('cached_church_words_v2', JSON.stringify(data));
          return data as ChurchWord[];
        }
      } catch (e) {
        console.warn('Erro ao carregar palavras do Supabase:', e);
      }
    }

    const cached = localStorage.getItem('cached_church_words_v2');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }

    localStorage.setItem('cached_church_words_v2', JSON.stringify(DEFAULT_WORDS));
    return DEFAULT_WORDS;
  }

  /**
   * Busca notícias e comunicados locais da igreja
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
          localStorage.setItem('cached_church_news_v2', JSON.stringify(data));
          return data as ChurchNews[];
        }
      } catch (e) {
        console.warn('Erro ao carregar notícias do Supabase:', e);
      }
    }

    const cached = localStorage.getItem('cached_church_news_v2');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }

    localStorage.setItem('cached_church_news_v2', JSON.stringify(DEFAULT_NEWS));
    return DEFAULT_NEWS;
  }

  /**
   * Salva ou atualiza palavras
   */
  static async upsertWords(words: ChurchWord[]): Promise<boolean> {
    localStorage.setItem('cached_church_words_v2', JSON.stringify(words));
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
    localStorage.setItem('cached_church_news_v2', JSON.stringify(news));
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
