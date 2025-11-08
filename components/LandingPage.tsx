"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll overflow-x-hidden bg-gradient-to-b from-black via-[#00111a] to-black text-white scroll-smooth">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 fixed w-full top-0 backdrop-blur-md bg-black/20 z-50">
        <h1 className="text-2xl font-bold">
          <span className="text-[#00e3b3]">Golden</span>
          <span className="text-yellow-400">Finance</span>
        </h1>

        <ul className="flex gap-8 text-gray-300">
          <li className="hover:text-white cursor-pointer">
            <Link href="/learn">Learn</Link>
          </li>
          <li className="hover:text-white cursor-pointer">
            <Link href="/invest">Invest</Link>
          </li>
          <li className="hover:text-white cursor-pointer">
            <Link href="/dashboard">Dashboard</Link>
          </li>
          
        </ul>

        <div className="flex gap-4">
          <button className="px-4 py-1 border border-[#00e3b3] text-[#00e3b3] rounded-md hover:bg-[#00e3b3] hover:text-black transition">
            Log In
          </button>
          <button className="px-4 py-1 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 transition">
            Sign Up
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="snap-center relative flex flex-col justify-center items-center text-center min-h-screen px-6">
        {/* PARALLAX BACKDROP */}
        <motion.div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521791055366-0d553872125f?w=1600')] bg-cover bg-center opacity-5"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
        />

        {/* FLOATING GLOW PARTICLES */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-pulse absolute w-80 h-80 bg-[#00e3b3]/20 blur-3xl rounded-full top-[-10%] left-[20%]" />
          <div className="animate-pulse absolute w-96 h-96 bg-yellow-400/10 blur-3xl rounded-full bottom-[-10%] right-[10%]" />
        </div>

        {/* FOREGROUND CONTENT */}
        <motion.h1
          className="relative z-10 text-6xl font-extrabold mb-4 leading-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <span className="text-[#00e3b3]">Grow Local.</span><br />
          <span className="text-yellow-400">Go Global.</span>
        </motion.h1>

        <motion.p
          className="relative z-10 text-gray-300 max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: "easeOut" }}
        >
          Empower your financial journey. Invest smart, grow wealth, and secure your future with confidence.
        </motion.p>

        <motion.div
          className="relative z-10 mt-8 flex gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
        
          <Link href="/Sign Up" className="px-4 py-1 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 transition">
            Sign Up
          </Link>
        </motion.div>
      </header>

      {/* SCROLL SECTION 1 — INVEST IN YOUR COMMUNITY */}
      <section id="about" className="snap-center flex flex-col md:flex-row items-center gap-10 px-12 py-24 border-t border-gray-700 min-h-screen">
        {/* LEFT SIDE TEXT */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-[#00e3b3] mb-4">
            Invest in Your Community
          </h2>
          <p className="text-gray-300 max-w-md leading-relaxed">
            GoldenFinance connects local investors with local projects.  
            Support the growth you want to see — from small businesses to housing developments.
            When your community grows, <strong>you</strong> grow.
          </p>
          <Link href="/invest">
            <motion.button
              className="mt-8 px-6 py-2 border border-[#00e3b3] text-[#00e3b3] rounded-md hover:bg-[#00e3b3] hover:text-black transition"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </Link>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <img
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgbEHqlEa5JRfwCFhCB2IB8gogvqdie-FJQtBMKAnulEOSoN6GaRdDNSjxUaE6qET8bo3KxfNMGrfIiyLHkkxxB0RcFQ3BUHf1sd8qn_M8AkmDMKt-XbbxwGkY9a0MEo6E0qy4VEjrhMoE/s1600/DSC05781.JPG"
            alt="Community Investment"
            className="rounded-xl shadow-2xl border border-[#00e3b3]/40"
          />
        </motion.div>
      </section>

      {/* SCROLL SECTION — FIND YOUR CITY */}
      <section className="snap-center flex flex-col md:flex-row items-center gap-10 px-12 py-24 border-t border-gray-700 min-h-screen">
        {/* RIGHT SIDE MAP IMAGE */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.img
            src="https://wehco.media.clients.ellingtoncms.com/imports/adg/photos/199802748_PB1-welcome-1103_t600.jpg?4326734cdb8e39baa3579048ef63ad7b451e7676"
            alt="Pine Bluff Map"
            className="rounded-xl shadow-2xl border border-[#00e3b3]/40"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>

        {/* LEFT SIDE TEXT */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-[#00e3b3] mb-6">
            Find your City
          </h2>

          <p className="text-gray-300 max-w-md leading-relaxed">
            GoldenFinance is expanding across the U.S. 
            Discover investment opportunities and community-led projects in your area. 
            Whether you&apos;re in a major city or growing town — your financial journey starts local.
          </p>

          <Link href="/invest">
            <motion.button
              className="mt-8 px-6 py-2 border border-[#00e3b3] text-[#00e3b3] rounded-md hover:bg-[#00e3b3] hover:text-black transition"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Locations
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* SCROLL SECTION — LEARN */}
      <section className="snap-center flex flex-col md:flex-row items-center gap-16 px-12 py-32 border-t border-gray-700 min-h-screen">
        {/* LEFT TEXT */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-[#00e3b3] mb-6">
            Learn to Invest Smart
          </h2>
          <p className="text-gray-300 max-w-md leading-relaxed">
            Whether you&apos;re new to finance or leveling up, our learning hub guides
            you through investing — without the jargon. Get educated with our FBT (Financial Bot Training).
          </p>

          <Link href="/learn">
            <motion.button
              className="mt-8 px-6 py-2 border border-[#00e3b3] text-[#00e3b3] rounded-md hover:bg-[#00e3b3] hover:text-black transition"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Learning
            </motion.button>
          </Link>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <img
            src="https://www.bankrate.com/2023/10/02125200/what-is-growth-investing.jpeg?auto=webp&optimize=high&crop=16:9"
            alt="Financial Education"
            className="rounded-xl shadow-2xl border border-[#00e3b3]/40"
          />
        </motion.div>
      </section>

      <footer className="snap-end px-12 py-12 border-t border-gray-700 text-center text-gray-400">
        <h2 className="text-2xl font-bold mb-4">
          <span className="text-[#00e3b3]">Golden</span>
          <span className="text-yellow-400">Finance</span>
        </h2>

        <div className="flex justify-center gap-6 mb-6 text-gray-400">
          <Link href="#about" className="hover:text-white transition">Who We Are</Link>
          <Link href="/learn" className="hover:text-white transition">Learn</Link>
          <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
        </div>

        <div className="flex justify-center gap-6 text-xl mb-6">
          <a href="#" className="hover:text-[#00e3b3] transition">🌐</a>
          <a href="#" className="hover:text-[#00e3b3] transition">🐦</a>
          <a href="#" className="hover:text-[#00e3b3] transition">📸</a>
        </div>

        <p className="text-sm text-gray-500">© {new Date().getFullYear()} GoldenFinance. All rights reserved.</p>
        <p className="text-xs text-gray-500 mt-2">Educational tool. Not investment, legal, or tax advice.</p>
      </footer>
    </div>
  );
}