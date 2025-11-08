"use client";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { stores } from "@/lib/data";
import { computeSVI } from "@/lib/svi";
import Link from "next/link";

export default function Dashboard() {
  const supported = stores.slice(0,2); // pretend user supported 2
  const lessonsCompleted = 2;

  const totalCirculated = 500; // demo number
  const payouts = 18;          // demo number

  const completionPercentage = (lessonsCompleted / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#00111a] to-black text-white">
      <Navigation />
      
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-pulse absolute w-80 h-80 bg-[#00e3b3]/10 blur-3xl rounded-full top-[20%] left-[10%]" />
        <div className="animate-pulse absolute w-96 h-96 bg-yellow-400/5 blur-3xl rounded-full bottom-[20%] right-[10%]" />
      </div>

      <main className="relative z-10 pt-24 p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-[#00e3b3]">Your Financial</span>{" "}
            <span className="text-yellow-400">Dashboard</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Track your progress, manage investments, and see your impact on the Pine Bluff community
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {/* Financial Literacy Progress */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00e3b3]/20 to-[#00e3b3]/5 border border-[#00e3b3]/20 backdrop-blur-sm p-6"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#00e3b3]/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="text-sm text-[#00e3b3]/80 mb-2">Financial Literacy</div>
              <div className="text-3xl font-bold text-[#00e3b3] mb-3">{lessonsCompleted}/3</div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-[#00e3b3] to-[#00e3b3]/70 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="text-xs text-gray-300 mt-2">{Math.round(completionPercentage)}% Complete</div>
            </div>
          </motion.div>

          {/* Businesses Supported */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 border border-yellow-400/20 backdrop-blur-sm p-6"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="text-sm text-yellow-400/80 mb-2">Local Businesses</div>
              <div className="text-3xl font-bold text-yellow-400 mb-3">{supported.length}</div>
              <div className="text-xs text-gray-300">Actively Supporting</div>
              <Link href="/invest" className="inline-block mt-2 text-xs text-yellow-400 hover:text-yellow-300 transition">
                Find more →
              </Link>
            </div>
          </motion.div>

          {/* Community Impact */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="text-sm text-gray-300 mb-2">Community Impact</div>
              <div className="text-3xl font-bold text-white mb-3">${totalCirculated}</div>
              <div className="text-xs text-gray-400">Total Circulated</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Your Portfolio Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-8"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#00e3b3]/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#00e3b3]">Your Portfolio</h2>
              <Link 
                href="/invest"
                className="px-4 py-2 text-sm border border-[#00e3b3] text-[#00e3b3] rounded-lg hover:bg-[#00e3b3] hover:text-black transition"
              >
                Explore More
              </Link>
            </div>
            
            {supported.length > 0 ? (
              <div className="space-y-4">
                {supported.map((s, index) => {
                  const svi = computeSVI(s.series);
                  const v = svi[svi.length-1].toFixed(1);
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00e3b3]/30 transition"
                    >
                      <div>
                        <div className="font-semibold text-white">{s.name}</div>
                        <div className="text-sm text-gray-400">SVI: {v}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-[#00e3b3]">Active</div>
                        <div className="text-xs text-gray-400">Investment</div>
                      </div>
                    </motion.div>
                  );
                })}
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#00e3b3]/10 to-yellow-400/10 border border-[#00e3b3]/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-300">Total Returns Received</div>
                      <div className="text-2xl font-bold text-[#00e3b3]">${payouts}</div>
                    </div>
                    <div className="text-3xl">💰</div>
                  </div>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-center py-8"
              >
                <div className="text-4xl mb-4">🏪</div>
                <div className="text-gray-300 mb-4">You haven't invested in any businesses yet</div>
                <Link 
                  href="/invest"
                  className="inline-block px-6 py-3 bg-[#00e3b3] text-black font-semibold rounded-lg hover:bg-[#00e3b3]/90 transition"
                >
                  Start Investing
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00e3b3]/20 to-[#00e3b3]/5 border border-[#00e3b3]/20 backdrop-blur-sm p-6"
          >
            <Link href="/learn" className="block">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#00e3b3] mb-2">Continue Learning</h3>
                  <p className="text-gray-300 text-sm">Complete your financial education journey</p>
                </div>
                <div className="text-3xl">📚</div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 border border-yellow-400/20 backdrop-blur-sm p-6"
          >
            <Link href="/invest" className="block">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">Discover Opportunities</h3>
                  <p className="text-gray-300 text-sm">Find new businesses to support</p>
                </div>
                <div className="text-3xl">🎯</div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
