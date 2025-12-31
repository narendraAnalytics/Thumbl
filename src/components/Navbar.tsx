"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Home, Sparkles, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const navigationLinks = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    iconColor: "text-cyan-500"
  },
  {
    href: "/features",
    label: "Features",
    icon: Sparkles,
    iconColor: "text-purple-500"
  },
  {
    href: "/pricing",
    label: "Pricing",
    icon: DollarSign,
    iconColor: "text-green-500"
  },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleScroll = () => {
      // Debounce scroll events
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setIsScrolled(window.scrollY > 50)
      }, 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timeoutId)
    }
  }, [])

  // Close mobile menu when route changes or screen resizes
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <nav
      className="sticky top-0 z-50 w-full transition-all duration-300"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/iocnnavbar.png"
            alt="Thumbl logo"
            width={32}
            height={32}
            priority
            className="h-8 w-8"
          />
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
            Thumbl
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navigationLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative flex items-center justify-center transition-all duration-200 hover:scale-105"
              >
                <Icon className={cn(
                  "absolute h-5 w-5 opacity-0 scale-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100",
                  link.iconColor
                )} />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-sm font-medium text-transparent opacity-100 transition-all duration-200 group-hover:opacity-0 group-hover:scale-95">
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <Button asChild className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:brightness-110">
            <Link href="#get-started">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-3 px-4 py-4">
            {navigationLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative flex items-center justify-center transition-all duration-200 hover:scale-105"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className={cn(
                    "absolute h-5 w-5 opacity-0 scale-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100",
                    link.iconColor
                  )} />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-sm font-medium text-transparent opacity-100 transition-all duration-200 group-hover:opacity-0 group-hover:scale-95">
                    {link.label}
                  </span>
                </Link>
              )
            })}
            <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:brightness-110">
              <Link href="#get-started" onClick={() => setIsMobileMenuOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
