import { useState, useEffect } from 'react';
import { getMarkets } from '../lib/api';
import MarketCard from '../components/MarketCard';
import { Loader2, CloudOff, TrendingUp, Clock, Flame, Sparkles, Plus, ChevronDown, ChevronUp, Hourglass, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProposeMarket from '../components/ProposeMarket';

const categories = [
  { key: 'all', label: 'Todos', emoji: '🌐' },
  { key: 'politics', label: 'Política', emoji: '🏛️' },
  { key: 'sports', label: 'Deportes', emoji: '⚽' },
  { key: 'crypto', label: 'Crypto', emoji: '₿' },
  { key: 'entertainment', label: 'Entretenimiento', emoji: '🎬' },
  { key: 'economy', label: 'Economía', emoji: '📈' },
  { key: 'technology', label: 'Tecnología', emoji: '💻' },
  { key: 'science', label: 'Ciencia', emoji: '🔬' },
  { key: 'weather', label: 'Clima', emoji: '⛈️' },
  { key: 'culture', label: 'Cultura', emoji: '🎭' },
];

const sortOptions = [
  { key: 'closing', label: 'Cierra pronto', icon: Clock },
  { key: 'popular', label: 'Popular', icon: Flame },
  { key: 'newest', label: 'Reciente', icon: Sparkles },
];

export default function Home() {
  const [markets, setMarkets] = useState([]);
  const [closedMarkets, setClosedMarkets] = useState([]);
  const [resolvedMarkets, setResolvedMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('closing');
  const [showPropose, setShowPropose] = useState(false);
  const [showClosed, setShowClosed] = useState(false);
  const [showResolved, setShowResolved] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchMarkets();
  }, [category, sort]);

  async function fetchMarkets() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      if (sort !== 'closing') params.set('sort', sort);

      // Fetch open markets
      const openData = await getMarkets(params.toString());
      setMarkets(openData);

      // Fetch closed markets (waiting resolution)
      const closedParams = new URLSearchParams();
      closedParams.set('status', 'closed');
      if (category !== 'all') closedParams.set('category', category);
      const closedData = await getMarkets(closedParams.toString());
      setClosedMarkets(closedData);

      // Fetch recently resolved (last 5)
      const resolvedParams = new URLSearchParams();
      resolvedParams.set('status', 'resolved');
      resolvedParams.set('sort', 'newest');
      const resolvedData = await getMarkets(resolvedParams.toString());
      setResolvedMarkets(resolvedData.slice(0, 5));
    } catch (e) {
      console.error('Error fetching markets:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative mb-8 -mx-4 lg:-mx-6 px-4 lg:px-6 py-8 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('/bg-hero.jpg')] bg-center bg-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e11] via-transparent to-[#0b0e11]" />
        <div className="relative z-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          <span className="gradient-text">Mercados de Predicciones</span>
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-[#848e9c] text-sm lg:text-base">
            Predecí el futuro. Ganá por tener razón.
          </p>
          {user && (
            <button
              onClick={() => setShowPropose(true)}
              className="flex items-center gap-2 bg-[#00b8d4] hover:bg-[#00d4f5] text-white text-sm font-bold px-4 py-2 rounded-lg transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Proponer mercado</span>
            </button>
          )}
        </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                category === cat.key
                  ? 'bg-[#00b8d4]/10 text-[#00b8d4] border border-[#00b8d4]/30'
                  : 'bg-[#1e2329] text-[#848e9c] hover:bg-[#2b3139] border border-transparent'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {sortOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.key}
                onClick={() => setSort(opt.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  sort === opt.key
                    ? 'bg-[#1e2329] text-[#eaecef] border border-[#2b3139]'
                    : 'text-[#5e6673] hover:text-[#848e9c]'
                }`}
              >
                <Icon className="w-3 h-3" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Open Markets Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#00b8d4]" />
        </div>
      ) : markets.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <CloudOff className="w-16 h-16 text-[#5e6673] mb-4" />
          <h3 className="text-lg font-semibold text-[#848e9c] mb-2">No hay mercados disponibles</h3>
          <p className="text-sm text-[#5e6673]">Vuelve pronto — se crean nuevos mercados todos los días</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}

      {/* Closed Markets — Waiting Resolution */}
      {closedMarkets.length > 0 && (
        <div className="mt-10">
          <button
            onClick={() => setShowClosed(!showClosed)}
            className="flex items-center gap-3 text-[#848e9c] hover:text-[#eaecef] transition-colors mb-4 w-full"
          >
            <Hourglass className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-semibold">Esperando resolución</span>
            <span className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full">{closedMarkets.length}</span>
            {showClosed ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
          </button>
          {showClosed && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 opacity-70">
              {closedMarkets.map((market) => (
                <MarketCard key={market.id} market={market} variant="closed" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recently Resolved */}
      {resolvedMarkets.length > 0 && (
        <div className="mt-10">
          <button
            onClick={() => setShowResolved(!showResolved)}
            className="flex items-center gap-3 text-[#848e9c] hover:text-[#eaecef] transition-colors mb-4 w-full"
          >
            <CheckCircle2 className="w-5 h-5 text-[#2ebd85]" />
            <span className="text-lg font-semibold">Resueltos recientemente</span>
            <span className="text-xs bg-[#2ebd85]/10 text-[#2ebd85] px-2 py-0.5 rounded-full">{resolvedMarkets.length}</span>
            {showResolved ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
          </button>
          {showResolved && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 opacity-60">
              {resolvedMarkets.map((market) => (
                <MarketCard key={market.id} market={market} variant="resolved" />
              ))}
            </div>
          )}
        </div>
      )}

      {showPropose && <ProposeMarket onClose={() => setShowPropose(false)} />}
    </div>
  );
}
