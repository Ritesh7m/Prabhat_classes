"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FloatingDock } from "@/components/ui/floating-dock"

interface NavbarProps {
  activeSection: string
  onNavigate: (section: string) => void
}

const navItems = [
  { id: "home", label: "Home" },
  { id: "programs", label: "Divisions" },
  { id: "toppers", label: "Fame" },
  { id: "faculty", label: "Faculty" },
  { id: "student-life", label: "Life" },
  { id: "contact", label: "Contact" },
]

const desktopNavItems = [
  { id: "home", label: "Home" },
  { id: "programs", label: "Academic Divisions" },
  { id: "toppers", label: "Wall of Fame" },
  { id: "faculty", label: "Our Faculty" },
  { id: "student-life", label: "Student Life" },
  { id: "contact", label: "Contact" },
]

// Inline SVG icons — no external dependencies
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)
const DivisionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const FameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)
const FacultyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)
const LifeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)
const ContactIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const iconMap: Record<string, React.ReactNode> = {
  home: <HomeIcon />,
  programs: <DivisionsIcon />,
  toppers: <FameIcon />,
  faculty: <FacultyIcon />,
  "student-life": <LifeIcon />,
  contact: <ContactIcon />,
}

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  // Build dock items — each a button that calls onNavigate
  const dockItems = navItems.map((item) => ({
    title: item.label,
    icon: iconMap[item.id],
    href: `#${item.id}`,
    active: activeSection === item.id,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault()
      onNavigate(item.id)
    },
  }))

  return (
    <>
      {/* ── TOP HEADER ────────────────────────────────────── */}
      <header className="sticky top-[37px] z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate("home")}>
              <Image 
                src="/images/prabhat_logo.png" 
                alt="Prabhat Classes" 
                width={180}
                height={48}
                priority
                className="h-10 md:h-12 w-auto object-contain py-1"
              />
            </div>

            {/* Desktop nav links - clean, minimalist rectangular text links with active underline */}
            <div className="hidden lg:flex items-center gap-6 h-full self-stretch">
              {desktopNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative flex items-center h-full text-xs font-black uppercase tracking-widest transition-colors duration-200 ${
                    activeSection === item.id
                      ? "text-red-600"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  {item.label}
                  {/* Minimalist active bottom indicator line */}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-600" />
                  )}
                </button>
              ))}
            </div>

            {/* Sharp CTA (Call Us) on desktop right to balance the logo */}
            <div className="hidden lg:flex items-center">
              <a
                href="tel:9321446648"
                className="flex items-center gap-2 text-xs font-black text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 px-5 py-3 rounded-none uppercase tracking-widest"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Call: 9321446648</span>
              </a>
            </div>

            {/* Mobile Call CTA sharp block */}
            <div className="lg:hidden">
              <a
                href="tel:9321446648"
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-none"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Call Now</span>
              </a>
            </div>

          </div>
        </nav>
      </header>

      {/* ── MOBILE BOTTOM DOCK (Instagram-style) ─────────── */}
      <FloatingDock items={dockItems} />

      {/* Spacer so content isn't hidden behind the dock on mobile */}
      <div className="h-[62px] md:hidden" aria-hidden />
    </>
  )
}
