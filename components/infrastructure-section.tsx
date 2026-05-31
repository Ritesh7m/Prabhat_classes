"use client"

import { HelpCircle, ClipboardCheck, Users } from "lucide-react"

const features = [
  {
    icon: HelpCircle,
    title: "Daily Doubt Cells",
    description: "Focused hours outside normal lecture shifts for personal interaction to clear complex topic problems.",
    color: "bg-emerald-500",
  },
  {
    icon: ClipboardCheck,
    title: "Board-Pattern Mock Tests",
    description: "Rigorous diagnostic evaluations mimicking real board schedules to eliminate exam stress.",
    color: "bg-red-500",
  },
  {
    icon: Users,
    title: "Routine Parent-Teacher Meets",
    description: "Constant, transparent analytics updates regarding scores and attendance dispatched to parents.",
    color: "bg-amber-500",
  },
]

export function InfrastructureSection() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-zinc-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
            Infrastructure
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 mt-4 mb-6">
            Engineered For<br />Academic Excellence
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Our infrastructure and support systems are designed to maximize your learning potential and ensure board exam success.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white border border-zinc-200 hover:border-zinc-400 transition-all duration-300 overflow-hidden hover:shadow-lg"
            >
              {/* Color Bar */}
              <div className={`h-1 ${feature.color}`} />
              
              <div className="p-6">
                <div className={`w-14 h-14 ${feature.color} flex items-center justify-center mb-5`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-black text-zinc-950 mb-3 uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
