"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const isDarkPage = pathname === "/dashboard" || pathname === "/learn" || pathname === "/invest" || pathname.startsWith("/store/");

  if (isDarkPage) {
    return (
      <nav className="flex justify-between items-center px-8 py-4 fixed w-full top-0 backdrop-blur-md bg-black/20 z-50 border-b border-gray-700/50">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-[#00e3b3]">Golden</span>
          <span className="text-yellow-400">Finance</span>
        </Link>

        <ul className="flex gap-8 text-gray-300">
          <li>
            <Link href="/learn" className={`hover:text-white transition ${pathname === "/learn" ? "text-[#00e3b3]" : ""}`}>Learn</Link>
          </li>
          <li>
            <Link href="/invest" className={`hover:text-white transition ${pathname === "/invest" ? "text-[#00e3b3]" : ""}`}>Invest</Link>
          </li>
          <li>
            <Link href="/dashboard" className={`hover:text-white transition ${pathname === "/dashboard" ? "text-[#00e3b3]" : ""}`}>Dashboard</Link>
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
    );
  }

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm border-b">
      <Link href="/" className="text-2xl font-bold">
        <span className="text-[#00e3b3]">Golden</span>
        <span className="text-yellow-400">Finance</span>
      </Link>

      <ul className="flex gap-8 text-gray-600">
        <li>
          <Link href="/learn" className="hover:text-gray-900 transition">Learn</Link>
        </li>
        <li>
          <Link href="/invest" className="hover:text-gray-900 transition">Invest</Link>
        </li>
        <li>
          <Link href="/dashboard" className="hover:text-gray-900 transition">Dashboard</Link>
        </li>
      </ul>

      <div className="flex gap-4">
        <button className="px-4 py-1 border border-[#00e3b3] text-[#00e3b3] rounded-md hover:bg-[#00e3b3] hover:text-white transition">
          Log In
        </button>
        <button className="px-4 py-1 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 transition">
          Sign Up
        </button>
      </div>
    </nav>
  );
}