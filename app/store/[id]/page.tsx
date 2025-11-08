"use client";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Navigation from "@/components/Navigation";
import SVIChart from "@/components/SVIChart";
import SalesInvestmentChart from "@/components/SalesInvestmentChart";
import { InsightBubble } from "@/components/InsightBubble";
import { computeSVI } from "@/lib/svi";

type SeriesPoint = { date: string; sales: number; marginPct: number; invTurn: number; refundPct: number };
type StoreDoc = { name: string; sector: string; goal: number; fundedPct: number };

const getSectorIcon = (sector: string) => {
  const sectorMap: Record<string, string> = {
    "Restaurant": "🍽️",
    "Retail": "🛍️",
    "Tech": "💻",
    "Service": "🔧",
    "Health": "🏥",
    "Education": "📚",
    "default": "🏪"
  };
  return sectorMap[sector] || sectorMap.default;
};

const getSectorColors = (sector: string) => {
  const colorMap: Record<string, {bg: string, border: string, text: string, accent: string}> = {
    "Restaurant": {
      bg: "from-orange-500/20 to-orange-400/5",
      border: "border-orange-400/20",
      text: "text-orange-400",
      accent: "from-orange-500 to-orange-400"
    },
    "Retail": {
      bg: "from-purple-500/20 to-purple-400/5",
      border: "border-purple-400/20", 
      text: "text-purple-400",
      accent: "from-purple-500 to-purple-400"
    },
    "Tech": {
      bg: "from-blue-500/20 to-blue-400/5",
      border: "border-blue-400/20",
      text: "text-blue-400", 
      accent: "from-blue-500 to-blue-400"
    },
    "default": {
      bg: "from-[#00e3b3]/20 to-[#00e3b3]/5",
      border: "border-[#00e3b3]/20",
      text: "text-[#00e3b3]",
      accent: "from-[#00e3b3] to-[#00e3b3]/70"
    }
  };
  return colorMap[sector] || colorMap.default;
};

export default function StoreDetail({ params }:{ params: Promise<{ id:string }> }) {
  const { id } = use(params);
  const [store, setStore] = useState<StoreDoc | null>(null);
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  const [investmentAmount, setInvestmentAmount] = useState(50);

  useEffect(() => {
    (async () => {
      const ref = doc(db, "stores", id);
      const snap = await getDoc(ref);
      if (snap.exists()) setStore(snap.data() as StoreDoc);
    })();
    const q = query(collection(db, "stores", id, "series"), orderBy("date"));
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map(d => d.data() as SeriesPoint);
      setSeries(rows);
    });
    return () => unsub();
  }, [id]);

  if (!store) return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#00111a] to-black text-white">
      <Navigation />
      <main className="pt-24 p-6 flex items-center justify-center min-h-screen">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#00e3b3]/20 border-t-[#00e3b3] rounded-full"
        />
      </main>
    </div>
  );

  if (series.length === 0) return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#00111a] to-black text-white">
      <Navigation />
      <main className="pt-24 p-6 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-gray-300 mb-4">No data available yet</h2>
        <p className="text-gray-400 mb-8">This business is still setting up their performance metrics.</p>
        <Link 
          href="/invest"
          className="px-6 py-3 bg-[#00e3b3] text-black font-semibold rounded-lg hover:bg-[#00e3b3]/90 transition"
        >
          Back to Investments
        </Link>
      </main>
    </div>
  );

  const colors = getSectorColors(store.sector);
  const svi = computeSVI(series);
  const sviData = series.map((p, i) => ({ date: p.date, svi: Number(svi[i].toFixed(1)) }));
  const investedCum = series.map((_, i) => 1000 + i * 10); // demo line
  const salesInvestData = series.map((p, i) => ({ date: p.date, sales: p.sales, investedCum: investedCum[i] }));
  
  const currentSVI = svi[svi.length - 1]?.toFixed(1) || "0.0";
  const latestSales = series[series.length - 1]?.sales || 0;
  const latestMargin = series[series.length - 1]?.marginPct || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#00111a] to-black text-white">
      <Navigation />
      
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-pulse absolute w-80 h-80 bg-[#00e3b3]/10 blur-3xl rounded-full top-[10%] right-[20%]" />
        <div className="animate-pulse absolute w-96 h-96 bg-yellow-400/5 blur-3xl rounded-full bottom-[20%] left-[15%]" />
      </div>

      <main className="relative z-10 pt-24 p-6 space-y-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            href="/invest"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00e3b3] transition group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Investments
          </Link>
        </motion.div>

        {/* Business Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br ${colors.bg} border ${colors.border} backdrop-blur-sm`}
        >
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.accent} opacity-20 rounded-full blur-2xl`} />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="text-6xl">
                {getSectorIcon(store.sector)}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{store.name}</h1>
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${colors.accent} text-white`}>
                  {store.sector}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">Current SVI Score</div>
                <div className={`text-3xl font-bold ${colors.text}`}>{currentSVI}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#00e3b3]/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="text-sm text-gray-400 mb-1">Latest Sales</div>
              <div className="text-2xl font-bold text-[#00e3b3]">${latestSales.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="text-sm text-gray-400 mb-1">Profit Margin</div>
              <div className="text-2xl font-bold text-yellow-400">{latestMargin.toFixed(1)}%</div>
            </div>
          </div>
        </motion.div>

        {/* Investment Panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-[#00e3b3] mb-6">Performance Analytics</h3>
              <SVIChart data={sviData} />
            </div>
            
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-6">Sales vs Investment</h3>
              <SalesInvestmentChart data={salesInvestData} />
            </div>
          </div>

          {/* Investment Interface */}
          <div className="space-y-6">
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} backdrop-blur-sm p-6`}>
              <div className={`absolute top-0 left-0 w-24 h-24 bg-gradient-to-br ${colors.accent} opacity-20 rounded-full blur-2xl`} />
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-6">Invest Now</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Investment Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#00e3b3] transition"
                        min="10"
                        step="10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {[25, 50, 100, 250].map(amount => (
                      <button
                        key={amount}
                        onClick={() => setInvestmentAmount(amount)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                          investmentAmount === amount
                            ? `bg-gradient-to-r ${colors.accent} text-white`
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => alert(`Thanks! Demo investment of $${investmentAmount} recorded. (Requires login for real.)`)}
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r ${colors.accent} hover:shadow-lg transition-all`}
                  >
                    Invest ${investmentAmount}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <h3 className="text-lg font-bold text-white mb-4">💡 AI Insights</h3>
              <InsightBubble storeId={id} />
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center py-8"
        >
          <p className="text-xs text-gray-500 max-w-2xl mx-auto">
            Educational tool. Not financial, legal, or tax advice. SVI blends sales growth, margin, inventory efficiency, and refund rate. 
            Past performance does not guarantee future results.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
