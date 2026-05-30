"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { ArrowRight, Loader2, WifiOff, X } from "lucide-react"
import { getToppers, Topper } from "@/lib/api/toppers"
import { fallbackToppers, fallbackToppers2024 } from "@/lib/api/fallback-data"

// ─── Data helpers ────────────────────────────────────────────────────────────

const transformTopper = (topper: (typeof fallbackToppers)[0] | Topper) => ({
  name: topper.name.toUpperCase(),
  percentage: topper.percentage,
  image: topper.image || "/images/placeholder.png",
  rank: topper.rank,
  _id: topper._id,
})

const mediaArchive = [
  {
    image: "/images/topper-mayur.png",
    type: "PRINT MEDIA",
    year: "2023",
    title: "ANNUAL EXCELLENCE CAMPAIGN",
    description:
      "Historical scan of our primary admission drive flyer, highlighting top performers across standards I to X.",
  },
  {
    image: "/images/topper-suhani.png",
    type: "PAMPHLET",
    year: "2022",
    title: "COMMUNITY OUTREACH PROGRAM",
    description:
      "Documented outreach material focusing on scholarship opportunities and recognizing local talent in Ghatkopar.",
  },
]

// ─── Expanded modal ───────────────────────────────────────────────────────────

function TopperModal({
  topper,
  raw,
  onClose,
}: {
  topper: ReturnType<typeof transformTopper>
  raw: any
  onClose: () => void
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-zinc-800" />
        </button>

        {/* Hero image strip */}
        <div className="relative h-48 bg-zinc-100">
          <Image
            src={topper.image}
            alt={topper.name}
            fill
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6">
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-0.5">
              Rank #{topper.rank}
            </p>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              {topper.name}
            </h3>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="bg-emerald-600 px-5 py-3 rounded-xl">
              <p className="text-xs text-emerald-100 uppercase tracking-widest mb-0.5">Score</p>
              <p className="text-3xl font-black text-white">{topper.percentage}</p>
            </div>
            <div className="bg-zinc-950 px-5 py-3 rounded-xl">
              <p className="text-xs text-zinc-400 uppercase tracking-widest mb-0.5">Rank</p>
              <p className="text-3xl font-black text-white">#{topper.rank}</p>
            </div>
            {raw?.batch && (
              <div className="bg-zinc-100 px-5 py-3 rounded-xl">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">Batch</p>
                <p className="text-sm font-bold text-zinc-950">{raw.batch}</p>
              </div>
            )}
            {raw?.attendanceRecord && (
              <div className="bg-zinc-100 px-5 py-3 rounded-xl">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">Attendance</p>
                <p className="text-sm font-bold text-zinc-950">{raw.attendanceRecord}</p>
              </div>
            )}
          </div>

          <p className="text-zinc-600 text-sm leading-relaxed">
            <span className="font-bold text-zinc-950">A true champion of academic excellence.</span>{" "}
            Through unwavering dedication and consistent effort, this student has set a benchmark for
            peers at Prabhat Coaching Classes — inspiring an entire generation of learners.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Individual topper card ───────────────────────────────────────────────────

function TopperCard({
  topper,
  raw,
  onClick,
}: {
  topper: ReturnType<typeof transformTopper>
  raw: any
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex-shrink-0 w-52 md:w-64 rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer text-left"
      aria-label={`View ${topper.name}`}
    >
      {/* Photo */}
      <div className="relative h-48 md:h-56 bg-zinc-100">
        <Image
          src={topper.image}
          alt={topper.name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-zinc-950/10 to-transparent" />

        {/* Rank badge */}
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wide">
          #{topper.rank}
        </div>

        {/* Percentage badge */}
        <div className="absolute top-3 right-3 bg-emerald-600 text-white text-sm font-black px-2.5 py-1 rounded-full">
          {topper.percentage}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-0.5">
          School Superstar
        </p>
        <h4 className="font-black text-zinc-950 text-sm uppercase tracking-wide leading-tight">
          {topper.name}
        </h4>
        {raw?.batch && (
          <p className="text-xs text-zinc-400 mt-1">{raw.batch}</p>
        )}
        <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1 group-hover:text-red-600 transition-colors">
          View profile <ArrowRight className="w-3 h-3" />
        </p>
      </div>
    </button>
  )
}

// ─── CTA card ────────────────────────────────────────────────────────────────

function CtaCard() {
  return (
    <div className="flex-shrink-0 w-52 md:w-64 rounded-2xl overflow-hidden bg-red-600 flex flex-col justify-between p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div>
        <p className="text-xs font-bold text-red-200 uppercase tracking-widest mb-2">
          Enrollment Open • 2026-27
        </p>
        <h3 className="text-xl font-black text-white uppercase leading-tight mb-3">
          Be The Next Superstar
        </h3>
        <p className="text-red-100 text-xs leading-relaxed">
          Seats are limited — secure yours for the upcoming academic year.
        </p>
      </div>
      <button className="mt-6 flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wide bg-white/20 hover:bg-white/30 transition-colors px-4 py-2.5 rounded-lg">
        Enroll Now <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// ─── Infinite auto-scroll carousel ───────────────────────────────────────────

function AutoScrollCarousel({
  children,
}: {
  children: React.ReactNode
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const pausedRef = useRef(false)
  const SPEED = 0.6 // px per frame

  const tick = useCallback(() => {
    const track = trackRef.current
    if (!track || pausedRef.current) {
      rafRef.current = requestAnimationFrame(tick)
      return
    }

    posRef.current += SPEED
    const halfWidth = track.scrollWidth / 2
    if (posRef.current >= halfWidth) {
      posRef.current = 0
    }
    track.style.transform = `translateX(-${posRef.current}px)`
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [tick])

  const pause = () => { pausedRef.current = true }
  const resume = () => { pausedRef.current = false }

  return (
    <div
      className="relative overflow-hidden w-full select-none"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onFocus={pause}
      onBlur={resume}
    >
      {/* Left fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-zinc-50 to-transparent" />
      {/* Right fade */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-zinc-50 to-transparent" />

      {/* Track — doubled for seamless loop */}
      <div
        ref={trackRef}
        className="flex gap-4 py-4 will-change-transform"
        style={{ width: "max-content" }}
      >
        {children}
        {/* Duplicate for seamless loop */}
        {children}
      </div>
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function ToppersSection() {
  const [activeTab, setActiveTab] = useState<"toppers" | "media">("toppers")
  const [selectedYear, setSelectedYear] = useState("2025-2026")
  const [toppers, setToppers] = useState(fallbackToppers.map(transformTopper))
  const [rawToppers, setRawToppers] = useState<any[]>(fallbackToppers)
  const [isLoading, setIsLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [selectedTopper, setSelectedTopper] = useState<{
    topper: ReturnType<typeof transformTopper>
    raw: any
  } | null>(null)

  const years = ["2025-2026", "2024-2025", "All-Time Records"]

  // Pick local fallback based on selected year
  const getLocalFallback = (year: string) => {
    if (year === "2024-2025") return fallbackToppers2024
    return fallbackToppers
  }

  useEffect(() => {
    const fetchToppers = async () => {
      setIsLoading(true)
      try {
        const result = await getToppers({ year: selectedYear, limit: 8 })
        if (result.data && result.data.length > 0) {
          setToppers(result.data.map(transformTopper))
          setRawToppers(result.data as any[])
          setIsOffline(result.isOffline)
        } else {
          const localFallback = getLocalFallback(selectedYear)
          setToppers(localFallback.map(transformTopper))
          setRawToppers(localFallback)
          setIsOffline(true)
        }
      } catch {
        const localFallback = getLocalFallback(selectedYear)
        setToppers(localFallback.map(transformTopper))
        setRawToppers(localFallback)
        setIsOffline(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchToppers()
  }, [selectedYear])

  return (
    <section id="toppers" className="py-20 md:py-28 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">Wall of Fame</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 mb-6 uppercase">
            Our Results Speak<br />Louder Than Words.
          </h2>
          <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
            A testament to rigorous academic excellence and unwavering student dedication. Discover
            the bright minds defining the future of PRABHAT COACHING CLASSES.
          </p>
        </div>

        {/* Controls row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-zinc-950 uppercase">Wall of Fame</span>
            {isOffline && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                <WifiOff className="w-3 h-3" /> Offline Data
              </span>
            )}
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-zinc-300 bg-white text-xs font-semibold text-zinc-600 uppercase tracking-wider cursor-pointer hover:border-zinc-500 transition-colors"
          >
            {years.map((y) => (
              <option key={y} value={y}>Academic Year {y}</option>
            ))}
          </select>
        </div>

        {/* Tab buttons */}
        <div className="flex gap-2 mb-8">
          {(["toppers", "media"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-bold uppercase tracking-wide transition-all duration-200 ${
                activeTab === tab
                  ? "bg-zinc-950 text-white"
                  : "bg-white text-zinc-600 border border-zinc-300 hover:border-zinc-400"
              }`}
            >
              {tab === "toppers" ? "Board Toppers" : "Media Archive"}
            </button>
          ))}
        </div>
      </div>

      {/* ── BOARD TOPPERS: infinite auto-scroll ─────────────────────────────── */}
      {activeTab === "toppers" && (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
              <span className="ml-3 text-zinc-500">Loading toppers...</span>
            </div>
          ) : (
            <div className="px-4">
              <AutoScrollCarousel>
                {toppers.map((topper, i) => (
                  <TopperCard
                    key={topper._id + "-" + i}
                    topper={topper}
                    raw={rawToppers[i]}
                    onClick={() => setSelectedTopper({ topper, raw: rawToppers[i] })}
                  />
                ))}
                <CtaCard />
              </AutoScrollCarousel>

              <p className="text-center text-xs text-zinc-400 mt-4 uppercase tracking-widest">
                Hover or tap a card to pause · Click to expand
              </p>
            </div>
          )}
        </>
      )}

      {/* ── MEDIA ARCHIVE ───────────────────────────────────────────────────── */}
      {activeTab === "media" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-zinc-950 uppercase tracking-wide">
              Media & Announcements Archive
            </h3>
            <span className="text-sm text-zinc-500 uppercase tracking-widest">Historical Records</span>
          </div>

          {mediaArchive.map((item, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? "md:[direction:rtl]" : ""
              }`}
            >
              <div
                className={`aspect-[4/3] relative bg-zinc-100 overflow-hidden border border-zinc-200 ${
                  index % 2 === 1 ? "[direction:ltr]" : ""
                }`}
              >
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className={`space-y-4 ${index % 2 === 1 ? "[direction:ltr]" : ""}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-widest">{item.type}</span>
                  <span className="text-xs text-zinc-400">-</span>
                  <span className="text-xs text-zinc-500">{item.year}</span>
                </div>
                <h4 className="text-2xl font-black text-zinc-950 uppercase tracking-wide">{item.title}</h4>
                <p className="text-zinc-600 leading-relaxed">{item.description}</p>
                <button className="text-sm font-bold text-zinc-950 uppercase tracking-wide hover:text-red-600 transition-colors inline-flex items-center gap-2">
                  View Full Resolution <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODAL ───────────────────────────────────────────────────────────── */}
      {selectedTopper && (
        <TopperModal
          topper={selectedTopper.topper}
          raw={selectedTopper.raw}
          onClose={() => setSelectedTopper(null)}
        />
      )}
    </section>
  )
}
