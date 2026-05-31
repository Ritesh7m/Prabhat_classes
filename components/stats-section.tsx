"use client"

import { CheckCircle, Clock, Users, BookOpen } from "lucide-react"

const stats = [
  {
    value: "100%",
    label: "Board Examination Success",
    icon: CheckCircle,
    bgColor: "bg-emerald-500",
  },
  {
    value: "10+",
    label: "Years of Educational Legacy",
    icon: Clock,
    bgColor: "bg-blue-500",
  },
  {
    value: "1:1",
    label: "Dedicated Doubt Solving",
    icon: Users,
    bgColor: "bg-red-500",
  },
  {
    value: "10+",
    label: "Board-Pattern Mock Tests",
    icon: BookOpen,
    bgColor: "bg-zinc-800",
  },
]

export function StatsSection() {
  return (
    <section className="bg-zinc-950 py-0">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} p-8 md:p-10 text-white text-center group hover:scale-[1.02] transition-transform duration-300`}
            >
              <stat.icon className="w-8 h-8 mx-auto mb-4 opacity-80" />
              <div className="text-4xl md:text-5xl font-black mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium opacity-90">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
