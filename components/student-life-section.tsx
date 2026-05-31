'use client'

import Image from 'next/image'
import { Pause, Play } from 'lucide-react'
import { useState, useRef } from 'react'
import { DraggableCardBody, DraggableCardContainer } from '@/components/ui/draggable-card'

export function StudentLifeSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Draggable gallery items — all 5 photos spread across the canvas
  const galleryItems = [
    {
      id: 1,
      title: 'Class Celebrations',
      image: '/images/WhatsApp Image 2026-05-25 at 2.18.11 AM.jpeg',
      className: 'absolute top-6 left-[5%] rotate-[-7deg]',
      color: 'from-red-500 to-red-600',
    },
    {
      id: 2,
      title: 'Cultural Events',
      image: '/images/WhatsApp Image 2026-05-25 at 2.18.11 AM (1).jpeg',
      className: 'absolute top-4 left-[28%] rotate-[6deg]',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      id: 3,
      title: 'Group Activities',
      image: '/images/WhatsApp Image 2026-05-25 at 2.18.11 AM.jpeg',
      className: 'absolute top-10 left-[51%] rotate-[-4deg]',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 4,
      title: 'Student Moments',
      image: '/images/WhatsApp Image 2026-05-31 at 4.43.18 PM.jpeg',
      className: 'absolute top-[200px] left-[15%] rotate-[5deg]',
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 5,
      title: 'Fun Activities',
      image: '/images/WhatsApp Image 2026-05-31 at 4.43.19 PM.jpeg',
      className: 'absolute top-[210px] left-[62%] rotate-[-6deg]',
      color: 'from-sky-500 to-sky-600',
    },
  ]

  return (
    <section id="student-life" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">05 / Student Experience</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 mb-4 uppercase">
            Fun Life of Students
          </h2>
          <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
            Beyond academics: celebrate the vibrant culture, festivals, achievements, and memorable moments that define the Prabhat experience.
          </p>
        </div>

        {/* Info Card + Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Info Card */}
          <div className="bg-zinc-50 border border-zinc-200 p-8 rounded-xl">
            <h3 className="text-lg font-black text-zinc-950 mb-6 uppercase">Student Life Highlights</h3>
            <div className="space-y-4 text-sm text-zinc-600">
              <div>
                <p className="font-semibold text-zinc-950 mb-1">Engagement</p>
                <p>Active participation in extracurricular activities ensures holistic development.</p>
              </div>
              <div>
                <p className="font-semibold text-zinc-950 mb-1">Community</p>
                <p>Strong bonds between students and faculty create a supportive learning environment.</p>
              </div>
              <div>
                <p className="font-semibold text-zinc-950 mb-1">Growth</p>
                <p>Personal and academic growth through mentorship and collaborative learning.</p>
              </div>
            </div>
          </div>

          {/* Video Player - 2 cols */}
          <div className="lg:col-span-2">
            <div className="relative w-full aspect-video bg-zinc-950 rounded-xl overflow-hidden group">
              <video
                ref={videoRef}
                src="/videos/prabhat_classes.mp4"
                className="w-full h-full object-cover"
                loop
              />
              
              {/* Play Button Overlay */}
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause student life video highlights" : "Play student life video highlights"}
                className="absolute inset-0 flex items-center justify-center bg-zinc-950/30 group-hover:bg-zinc-950/50 transition-colors duration-300 z-10"
              >
                <div className={`w-16 h-16 rounded-full bg-red-600 flex items-center justify-center transition-transform duration-300 ${
                  isPlaying ? 'scale-90 opacity-75' : 'scale-100 group-hover:scale-110'
                }`}>
                  {isPlaying ? (
                    <Pause className="w-7 h-7 text-white ml-0.5" />
                  ) : (
                    <Play className="w-7 h-7 text-white ml-1" />
                  )}
                </div>
              </button>

              {/* Playback Bar */}
              <div className="absolute bottom-4 left-4 right-4 h-1 bg-zinc-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Draggable Activity Gallery */}
        <div className="mb-16">
          <h3 className="text-2xl font-black text-zinc-950 mb-4 uppercase">Activity Gallery</h3>
          <p className="text-zinc-500 text-sm mb-8">Drag the cards around to explore our student activities</p>
          
          <DraggableCardContainer className="relative min-h-[500px] w-full bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-2xl border-2 border-dashed border-zinc-200 overflow-hidden">
            {/* Center Text */}
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-xl md:text-2xl font-black text-zinc-300 max-w-xs pointer-events-none z-0">
              Drag cards to explore student life moments
            </p>
            
            {/* Draggable Cards */}
            {galleryItems.map((item) => (
              <DraggableCardBody key={item.id} className={item.className}>
                <div className="relative w-36 h-44 md:w-44 md:h-52 shadow-xl overflow-hidden cursor-grab active:cursor-grabbing rounded-none border border-zinc-200/30">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill
                    sizes="(max-width: 768px) 144px, 176px"
                    className="object-cover select-none pointer-events-none"
                  />
                </div>
              </DraggableCardBody>
            ))}
          </DraggableCardContainer>
        </div>

        {/* Fun Facts */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-black text-red-600 mb-2">200+</p>
              <p className="text-sm text-zinc-600 uppercase tracking-wide">Active Students</p>
            </div>
            <div className="text-center border-l border-r border-zinc-200">
              <p className="text-4xl font-black text-emerald-600 mb-2">20+</p>
              <p className="text-sm text-zinc-600 uppercase tracking-wide">Teaching Staff</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-blue-600 mb-2">100%</p>
              <p className="text-sm text-zinc-600 uppercase tracking-wide">Engagement Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
