"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

const divisions = [
  {
    id: "primary",
    classes: "Classes I – IV",
    name: "Primary Division",
    description: "Foundation learning with individual attention, concept building, homework support, and academic guidance.",
  },
  {
    id: "school",
    classes: "Classes V – VIII",
    name: "School Division",
    description: "Strengthening core concepts through structured learning, regular tests, and comprehensive subject coverage.",
  },
  {
    id: "ssc",
    classes: "Classes IX – X",
    name: "SSC Division",
    description: "Board-focused preparation with rigorous practice, performance tracking, study material, and exam strategies.",
  }
]

const batchSchedules = [
  {
    id: "morning",
    title: "Morning Batch (Hindi)",
    timing: "08:00 AM – 11:00 AM",
    classes: ["8th Standard", "9th Standard", "10th Standard"],
    focus: "Hindi Subject Special Batch",
    badge: "Hindi Special Batch",
    divisions: ["school", "ssc"]
  },
  {
    id: "afternoon-1",
    title: "Afternoon Batch",
    timing: "02:00 PM – 04:00 PM",
    classes: ["5th Standard", "6th Standard", "7th Standard"],
    focus: "Middle School Academic Foundation",
    badge: "Middle School",
    divisions: ["school"]
  },
  {
    id: "afternoon-2",
    title: "Afternoon Batch",
    timing: "03:00 PM – 05:00 PM",
    classes: ["5th Standard", "6th Standard", "7th Standard"],
    focus: "Middle School Academic Foundation",
    badge: "Middle School",
    divisions: ["school"]
  },
  {
    id: "evening",
    title: "Evening Batch",
    timing: "05:00 PM – 09:00 PM",
    classes: ["8th Standard", "9th Standard", "10th Standard"],
    focus: "SSC Board Preparation",
    badge: "SSC Board Preparation",
    divisions: ["school", "ssc"]
  }
]

const academicGroups = [
  { group: "Primary", standards: "1st – 4th Standard", color: "text-red-500" },
  { group: "Middle School", standards: "5th – 8th Standard", color: "text-emerald-400" },
  { group: "SSC Section", standards: "9th – 10th Standard", color: "text-blue-400" }
]

export function ProgramsSection() {
  const [selectedDivision, setSelectedDivision] = useState<"primary" | "school" | "ssc">("school")

  // Filter batch schedules dynamically based on active division selection
  const filteredBatches = batchSchedules.filter(batch => 
    batch.divisions.includes(selectedDivision)
  )

  return (
    <section id="programs" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white border-y border-zinc-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">01 / Academic Offerings</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 mb-4 uppercase">
            Choose Your Academic Division
          </h2>
          <p className="text-lg text-zinc-600 max-w-3xl mx-auto leading-relaxed">
            Personalized learning paths, structured batch schedules, regular assessments, and focused mentorship designed to maximize academic performance.
          </p>
          <p className="text-xs text-red-600 uppercase tracking-widest font-black mt-4 animate-pulse">
            👆 Click a division card below to view its timetables
          </p>
        </div>

        {/* 3 Academic Division Cards as Interactive Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {divisions.map((div) => {
            const isActive = selectedDivision === div.id
            return (
              <div 
                key={div.id} 
                onClick={() => setSelectedDivision(div.id as any)}
                className={`p-8 border rounded-none flex flex-col justify-between transition-all duration-300 cursor-pointer select-none ${
                  isActive 
                    ? "bg-zinc-950 text-white border-zinc-950 shadow-2xl scale-[1.01]" 
                    : "bg-zinc-50 border-zinc-200 text-zinc-950 hover:border-zinc-400 hover:bg-zinc-50/50"
                }`}
              >
                <div>
                  <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-6 rounded-none transition-colors ${
                    isActive ? "bg-red-600 text-white" : "bg-red-50 text-red-600"
                  }`}>
                    {div.classes}
                  </span>
                  <h3 className={`text-2xl font-black mb-4 uppercase tracking-wide transition-colors ${
                    isActive ? "text-white" : "text-zinc-950"
                  }`}>
                    {div.name}
                  </h3>
                  <p className={`text-sm leading-relaxed mb-6 transition-colors ${
                    isActive ? "text-zinc-300" : "text-zinc-600"
                  }`}>
                    {div.description}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest mt-6 self-start">
                  <span>{isActive ? "Viewing Timetables" : "Select Division"}</span>
                  <ArrowRight className={`w-3.5 h-3.5 transform transition-transform ${isActive ? "translate-x-1.5 text-red-500" : "text-zinc-400"}`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Batch Schedules Subheading */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-100 pb-6">
          <div>
            <h3 className="text-2xl font-black text-zinc-950 uppercase tracking-wide mb-2">
              Batch Schedules & Timetables
            </h3>
            <p className="text-sm text-zinc-500">
              Structured batch timings for selected division.
            </p>
          </div>
          <span className="text-xs font-black text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1.5 self-start md:self-auto">
            Active: {divisions.find(d => d.id === selectedDivision)?.name}
          </span>
        </div>

        {/* Dynamic Batch Schedule Display */}
        <div className="space-y-6 mb-20">
          {selectedDivision === "primary" ? (
            /* Primary Division Custom Welcoming Details */
            <div className="p-8 bg-zinc-50 border border-zinc-200 rounded-none flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-zinc-400 transition-colors animate-fade-in">
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="text-xl font-black text-zinc-950 uppercase tracking-wide">Custom Primary Batch</h4>
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest rounded-none">
                    Homework Support & Basic Math
                  </span>
                </div>
                
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Focus: <span className="text-zinc-800 font-extrabold">Highly Personalized Concept Building</span>
                </p>

                <p className="text-sm text-zinc-600 leading-relaxed max-w-3xl">
                  For our Primary Division (Classes I – IV), we specialize in highly engaging, small-group concept building, handwriting practice, basic reading, and homework support. Timings are custom-tailored to accommodate your child's primary school routines. Please contact the centre for flexible time slots.
                </p>
                
                <div className="flex flex-wrap gap-2 pt-1">
                  {["1st Standard", "2nd Standard", "3rd Standard", "4th Standard"].map((cls, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1.5 bg-white border border-zinc-200 text-[10px] font-black text-zinc-950 uppercase tracking-widest rounded-none"
                    >
                      {cls}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-red-600 text-white px-8 py-5 text-sm md:text-base font-black tracking-widest uppercase rounded-none text-center self-stretch flex items-center justify-center min-w-[240px]">
                Flexible Timings
              </div>
            </div>
          ) : (
            /* School & SSC Batch Cards */
            filteredBatches.map((batch, index) => (
              <div 
                key={batch.id} 
                className="p-8 bg-zinc-50 border border-zinc-200 rounded-none flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-zinc-400 hover:bg-zinc-50/50 transition-all duration-300"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-xl font-black text-zinc-950 uppercase tracking-wide">{batch.title}</h4>
                    <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest rounded-none">
                      {batch.badge}
                    </span>
                  </div>
                  
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    Focus: <span className="text-zinc-800 font-extrabold">{batch.focus}</span>
                  </p>
                  
                  {/* Classes Badges (Standards as small badges/chips) */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {batch.classes.map((cls, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 bg-white border border-zinc-200 text-[10px] font-black text-zinc-950 uppercase tracking-widest rounded-none"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timing (Prominently on the right side) */}
                <div className="bg-red-600 text-white px-8 py-5 text-sm md:text-base font-black tracking-widest uppercase rounded-none text-center self-stretch flex items-center justify-center min-w-[240px]">
                  {batch.timing}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Academic Groups Offered bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-8 bg-zinc-950 text-white rounded-none">
            <h3 className="text-lg font-black mb-6 uppercase tracking-wider">
              Academic Groups Offered
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {academicGroups.map((group, index) => (
                <div key={index} className="p-5 bg-zinc-900 border border-zinc-800 rounded-none">
                  <p className={`text-xs font-black uppercase tracking-widest mb-1.5 ${group.color}`}>
                    {group.group}
                  </p>
                  <p className="font-extrabold text-sm text-white uppercase tracking-wide">
                    {group.standards}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Contact / Join CTA Card */}
          <div className="p-8 bg-red-600 text-white flex flex-col justify-between rounded-none">
            <div>
              <h3 className="text-xl font-black uppercase tracking-wide mb-3">Enrolling Now</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                Contact us to secure a seat for your child or to request a direct consultation session at our centre.
              </p>
            </div>
            <a 
              href="tel:9321446648" 
              className="mt-6 bg-white hover:bg-zinc-50 text-red-600 font-black text-xs uppercase tracking-widest py-3.5 px-6 rounded-none transition-all duration-200 flex items-center justify-center gap-2 group self-start"
            >
              <span>Call: 9321446648</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
