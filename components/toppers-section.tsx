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

// ─── Expanded modal ───────────────────────────────────────────────────────────

function ImageLightboxModal({
  image,
  alt,
  onClose,
}: {
  image: string
  alt: string
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
        className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[110] w-10 h-10 flex items-center justify-center rounded-none bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
        aria-label="Close"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Image Container */}
      <div className="relative z-10 w-full max-w-3xl aspect-[3/4] md:aspect-auto md:max-h-[85vh] md:w-auto flex items-center justify-center">
        <img
          src={image}
          alt={alt}
          className="max-w-full max-h-[85vh] object-contain shadow-2xl border-4 border-white/10"
        />
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
        <img
          src={topper.image}
          alt={topper.name}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-zinc-950/10 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-0.5">
          School Superstar
        </p>
        <h4 className="font-black text-zinc-950 text-sm uppercase tracking-wide leading-tight">
          {topper.name} - {topper.percentage}
        </h4>
        <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1 group-hover:text-red-600 transition-colors">
          View full image <ArrowRight className="w-3 h-3" />
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
      <button
        onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
        className="mt-6 flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wide bg-white/20 hover:bg-white/30 transition-colors px-4 py-2.5 rounded-lg"
      >
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
  const [selectedYear, setSelectedYear] = useState("2026-2027")
  const [toppers, setToppers] = useState(fallbackToppers.map(transformTopper))
  const [rawToppers, setRawToppers] = useState<any[]>(fallbackToppers)
  const [isLoading, setIsLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [isViewAll, setIsViewAll] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null)

  const years = ["2026-2027", "2024-2025", "All-Time Records"]

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
        setIsViewAll(false) // Reset viewAll toggle on year change
      }
    }
    fetchToppers()
  }, [selectedYear])

  const handleToggleViewAll = async () => {
    setIsLoading(true)
    try {
      if (isViewAll) {
        const result = await getToppers({ year: selectedYear, limit: 8 })
        if (result.data) {
          setToppers(result.data.map(transformTopper))
          setRawToppers(result.data)
          setIsOffline(result.isOffline)
        }
        setIsViewAll(false)
      } else {
        const result = await getToppers({ year: selectedYear }) // fetches all
        if (result.data) {
          setToppers(result.data.map(transformTopper))
          setRawToppers(result.data)
          setIsOffline(result.isOffline)
        }
        setIsViewAll(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="toppers" className="py-20 md:py-28 bg-zinc-50 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">Wall of Fame</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 mb-6 uppercase">
            Our Results Speak<br />Louder Than Words.
          </h2>
          <p className="text-lg text-zinc-650 max-w-3xl mx-auto">
            A testament to academic excellence and unwavering student dedication. Discover
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

      </div>

      {/* ── BOARD TOPPERS ─────────────────────────────── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          <span className="ml-3 text-zinc-555 text-sm font-medium">Loading toppers...</span>
        </div>
      ) : (
        <div className="px-4">
          {isViewAll ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto py-4">
              {toppers.map((topper, i) => (
                <div key={topper._id + "-" + i} className="flex justify-center">
                  <TopperCard
                    topper={topper}
                    raw={rawToppers[i]}
                    onClick={() => setSelectedImage({ url: topper.image, name: topper.name })}
                  />
                </div>
              ))}
              <div className="flex justify-center">
                <CtaCard />
              </div>
            </div>
          ) : (
            <>
              <AutoScrollCarousel>
                {toppers.map((topper, i) => (
                  <TopperCard
                    key={topper._id + "-" + i}
                    topper={topper}
                    raw={rawToppers[i]}
                    onClick={() => setSelectedImage({ url: topper.image, name: topper.name })}
                  />
                ))}
                <CtaCard />
              </AutoScrollCarousel>

              <p className="text-center text-xs text-zinc-400 mt-4 uppercase tracking-widest">
                Hover or tap a card to pause · Click to view full image
              </p>
            </>
          )}

          <div className="mt-12 text-center">
            <button
              onClick={handleToggleViewAll}
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 text-white hover:bg-red-600 font-bold uppercase tracking-wider text-xs transition-colors duration-300"
            >
              {isViewAll ? "Show Less" : "View All Students"}
            </button>
          </div>
        </div>
      )}

      {/* ── LIGHTBOX MODAL ─────────────────────────────────────────────────── */}
      {selectedImage && (
        <ImageLightboxModal
          image={selectedImage.url}
          alt={selectedImage.name}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </section>
  )
}

