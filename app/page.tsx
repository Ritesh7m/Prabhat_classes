"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { AnnouncementBar } from "@/components/announcement-bar"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { ProgramsSection } from "@/components/programs-section"
import { BatchesTimetable } from "@/components/explore-batches-tree"
import { InfrastructureSection } from "@/components/infrastructure-section"
import { ToppersSection } from "@/components/toppers-section"
import { FacultySection } from "@/components/faculty-section"
import { StudentLifeSection } from "@/components/student-life-section"
import { PoliciesSection } from "@/components/policies-section"
import { FooterSection } from "@/components/footer-section"
import { BookDemoModal } from "@/components/book-demo-modal"

export default function Home() {
  const [activeSection, setActiveSection] = useState("home")
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false)

  const handleNavigate = (section: string) => {
    setActiveSection(section)
    if (section === "batches") {
      const element = document.getElementById("batches")
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      const element = document.getElementById(section)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      } else if (section === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else if (section === "contact") {
        const footer = document.getElementById("contact")
        if (footer) {
          footer.scrollIntoView({ behavior: "smooth" })
        }
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "programs", "batches", "toppers", "faculty", "student-life", "policies", "contact"]
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }

      if (window.scrollY < 100) {
        setActiveSection("home")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar 
        activeSection={activeSection} 
        onNavigate={handleNavigate}
        onBookDemo={() => setIsBookDemoOpen(true)}
      />
      <BookDemoModal 
        isOpen={isBookDemoOpen} 
        onClose={() => setIsBookDemoOpen(false)} 
      />
      
      <div id="home">
        <HeroSection onNavigate={() => setIsBookDemoOpen(true)} />
      </div>
      <StatsSection />
      <ProgramsSection />
      
      <div id="batches" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white border-y border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">02 / Batch Structure</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 mb-4 uppercase">
              Explore Batches
            </h2>
            <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
              Understand our comprehensive batch structure and features designed for your academic success.
            </p>
          </div>
          <BatchesTimetable />
        </div>
      </div>
      
      <InfrastructureSection />
      <ToppersSection />
      <FacultySection />
      <StudentLifeSection />
      <PoliciesSection />
      <FooterSection />

      {/* Sticky Left WhatsApp Button */}
      <a
        href="https://wa.me/918286080756"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed left-5 bottom-20 md:bottom-8 z-40 flex items-center justify-center w-14 h-14 bg-zinc-900/30 hover:bg-zinc-900/50 border border-zinc-200/20 text-white rounded-full shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 group"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <svg 
          className="w-7 h-7 text-white transition-colors duration-300 group-hover:text-green-400" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {/* Glow effect on hover */}
        <span className="absolute inset-0 rounded-full bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
      </a>
    </main>
  )
}
