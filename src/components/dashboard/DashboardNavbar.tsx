"use client"

import Link from "next/link"
import { Home } from "lucide-react"

export function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <Home className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="text-sm font-medium">Home</span>
        </Link>
      </div>
    </header>
  )
}
