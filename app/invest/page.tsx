"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { cleanFirestoreString } from "@/lib/utils";

type StoreDoc = {
  id: string;
  name: string;
  sector: string;
  goal: number;
  fundedPct: number;
};

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

export default function Invest() {
  const [stores, setStores] = useState<StoreDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const q = query(collection(db, "stores"), orderBy("name"));
      const snap = await getDocs(q);

      const data = snap.docs.map((d) => {
        const doc = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          name: cleanFirestoreString(doc.name as string),
          sector: cleanFirestoreString(doc.sector as string),
          goal: doc.goal as number,
          fundedPct: doc.fundedPct as number,
          lastUpdated: doc.lastUpdated,
        };
      });

      setStores(data);
      setLoading(false);
    })();
  }, []);

  const uniqueSectors = [...new Set(stores.map(s => s.sector))];
  const filteredStores = filter === "all" ? stores : stores.filter(s => s.sector === filter);

  if (loading) return (
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#00111a] to-black text-white">
      <Navigation />
      
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-pulse absolute w-80 h-80 bg-[#00e3b3]/10 blur-3xl rounded-full top-[20%] left-[15%]" />
        <div className="animate-pulse absolute w-96 h-96 bg-yellow-400/5 blur-3xl rounded-full bottom-[30%] right-[20%]" />
      </div>

      <main className="relative z-10 pt-24 p-6 space-y-12 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-[#00e3b3]">Invest in</span>{" "}
            <span className="text-yellow-400">Local Businesses</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Invest in Pine Bluff businesses and earn returns as they grow. Your investment, your profit.
          </p>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center gap-12 text-sm"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00e3b3]">{stores.length}</div>
              <div className="text-gray-400">Active Opportunities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{uniqueSectors.length}</div>
              <div className="text-gray-400">Sectors Available</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center"
        >
          <div className="flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === "all"
                  ? "bg-[#00e3b3] text-black shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              All Sectors
            </button>
            {uniqueSectors.map(sector => (
              <button
                key={sector}
                onClick={() => setFilter(sector)}
                className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === sector
                    ? "bg-[#00e3b3] text-black shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {getSectorIcon(sector)} {sector}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Business Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredStores.map((store, index) => {
            const colors = getSectorColors(store.sector);
            
            return (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <Link
                  href={`/store/${store.id}`}
                  className={`
                    block relative overflow-hidden rounded-2xl p-6 h-[280px] 
                    bg-gradient-to-br ${colors.bg} 
                    border ${colors.border} backdrop-blur-sm
                    hover:shadow-xl hover:shadow-${colors.text}/10 transition-all duration-300
                  `}
                >
                  {/* Background Glow */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colors.accent} opacity-20 rounded-full blur-2xl`} />
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-5xl group-hover:scale-110 transition-transform duration-200">
                        {getSectorIcon(store.sector)}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${colors.accent} text-white`}>
                        {store.sector}
                      </div>
                    </div>

                    {/* Business Name */}
                    <h3 className={`text-2xl font-bold ${colors.text} mb-4 group-hover:text-white transition-colors`}>
                      {store.name}
                    </h3>

                    {/* Description */}
                    <div className="text-gray-300 mb-8 flex-grow">
                      <p className="text-sm">
                        Invest in this local {store.sector.toLowerCase()} business and earn returns as it grows.
                      </p>
                    </div>

                    {/* CTA */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        w-full py-3 px-6 rounded-xl font-semibold text-sm text-center transition-all
                        bg-gradient-to-r ${colors.accent} text-white 
                        group-hover:shadow-lg group-hover:shadow-${colors.text}/25
                      `}
                    >
                      View Details & Invest
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredStores.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">No businesses found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filter or check back later for new opportunities.</p>
            <button
              onClick={() => setFilter("all")}
              className="px-6 py-3 bg-[#00e3b3] text-black font-semibold rounded-lg hover:bg-[#00e3b3]/90 transition"
            >
              Show All Businesses
            </button>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center py-12"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-8 max-w-2xl mx-auto">
            <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                Ready to Make an Impact?
              </h3>
              <p className="text-gray-300 mb-6">
                Start with our Financial Training Bot to learn the basics, then come back to invest with confidence.
              </p>
              <div className="flex gap-4 justify-center">
                <Link 
                  href="/learn"
                  className="px-6 py-3 border border-[#00e3b3] text-[#00e3b3] rounded-lg hover:bg-[#00e3b3] hover:text-black transition"
                >
                  Learn First
                </Link>
                <Link 
                  href="/dashboard"
                  className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition"
                >
                  View Dashboard
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
