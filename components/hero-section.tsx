"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  onNavigate: (section: string) => void
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const [showVideo, setShowVideo] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setShowVideo(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 bg-zinc-950">
        {showVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover transition-opacity duration-1000 opacity-100"
          >
            <source src="/videos/promotion.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full bg-zinc-950" />
        )}
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent"/>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Column */}
          <div className="space-y-6">
            {/* Rating Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>5.0 Rated Local Institute</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Give your child the best{" "}
              <span className="text-red-500">Guidance</span> for a{" "}
              <span className="text-emerald-400">Brighter</span> tomorrow.
            </h1>

            {/* Supporting Text */}
            <p className="text-lg text-zinc-300 leading-relaxed max-w-xl">
              Educational environment dedicated to cultivating academic excellence, critical thinking, and outstanding board results.
            </p>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => onNavigate("programs")}
                className="bg-red-600 text-white rounded-none px-8 py-4 h-auto text-base font-bold hover:bg-red-700 transition-all duration-300 group uppercase tracking-wide self-start"
              >
                Explore Programs
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Right Asset Frame - Director Photo */}
          <div className="relative hidden lg:block">
            <div className="relative w-80 h-96 mx-auto">
              {/* Decorative Frame */}
              <div className="absolute -inset-2 border-2 border-red-500/30 -z-10" />
              <div className="absolute -inset-4 border border-white/10 -z-20" />
              
              {/* Photo Container */}
              <div className="relative w-full h-full overflow-hidden border-4 border-white/20">
                <Image
                  src="/images/owner.png"
                  alt="Director of Prabhat Coaching Classes"
                  fill
                  sizes="320px"
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 w-64 bg-white p-4 shadow-2xl">
                <p className="text-xs uppercase tracking-widest text-red-600 font-bold mb-1">
                  Message from our Director
                </p>
                <p className="text-sm text-zinc-700 leading-snug italic">
                  &quot;Strong fundamentals today create successful futures tomorrow.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-white/50">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
