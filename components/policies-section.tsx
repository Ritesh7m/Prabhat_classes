"use client"

import { useState } from "react"
import { ChevronDown, ShieldCheck } from "lucide-react"

interface PolicyItem {
  id: string
  title: string
  content?: string
  bullets?: string[]
}

const studentPolicies: PolicyItem[] = [
  {
    id: "01",
    title: "Attendance Policy",
    content: "Regular attendance is essential for academic progress. Students are expected to attend all scheduled lectures and inform the institute in advance whenever possible if they are unable to attend."
  },
  {
    id: "02",
    title: "Fees & Payment Policy",
    bullets: [
      "Fees once paid are non-refundable and non-transferable.",
      "Installment facilities, if offered, must be followed as per the agreed schedule.",
      "Admission is confirmed only after successful fee payment."
    ]
  },
  {
    id: "03",
    title: "Academic Responsibility",
    content: "Prabhat Classes provides quality teaching, study material, regular tests, and academic guidance. However, a student's performance also depends on attendance, effort, practice, and participation."
  },
  {
    id: "04",
    title: "Test & Evaluation Policy",
    content: "Regular assessments may be conducted to monitor student progress. Parents may be informed about academic performance whenever necessary."
  },
  {
    id: "05",
    title: "Discipline & Conduct",
    content: "Students are expected to maintain respectful behavior towards teachers, staff members, and fellow students. Any form of misconduct, disruption, or inappropriate behavior may result in disciplinary action."
  },
  {
    id: "06",
    title: "Study Material Policy",
    content: "All study materials provided by the institute are intended solely for enrolled students and may not be copied, reproduced, or distributed without permission."
  },
  {
    id: "07",
    title: "Parent Communication",
    content: "Parents are encouraged to stay in touch regarding their child's academic performance, attendance, and overall development."
  },
  {
    id: "08",
    title: "Safety & Security",
    content: "The institute strives to provide a safe and supportive learning environment. Students are expected to follow classroom rules and institute guidelines at all times."
  }
]

export function PoliciesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="policies" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column - Header & Disclaimer */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-4 rounded-none border border-red-100">
                <ShieldCheck className="w-4 h-4" />
                <span>02 / Guidelines</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 uppercase leading-none mt-2 mb-6">
                Student & Parent Policy
              </h2>
              <p className="text-zinc-600 leading-relaxed text-sm md:text-base">
                Maintaining a highly disciplined, premium educational atmosphere requires absolute commitment from both students and parents. Please review our structural guidelines below.
              </p>
            </div>

            {/* Website Disclaimer Accent Card */}
            <div className="border-l-4 border-red-600 bg-white p-6 rounded-none shadow-sm border border-zinc-200 border-l-0 relative overflow-hidden">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-950 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 inline-block"></span>
                Website Disclaimer
              </h3>
              <div className="space-y-3 text-xs text-zinc-600 leading-relaxed">
                <p>
                  The information provided on this website is intended for general informational purposes only. Batch schedules, fees, academic programs, and admission details may change from time to time. Parents and students are advised to contact the institute directly for the latest information.
                </p>
                <p>
                  Prabhat Classes does not guarantee specific examination results, as academic success depends on individual student effort, attendance, and performance.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Premium Accordion */}
          <div className="lg:col-span-7">
            <div className="divide-y divide-zinc-200 border-t border-b border-zinc-200">
              {studentPolicies.map((policy, index) => {
                const isOpen = openIndex === index
                return (
                  <div key={policy.id} className="group transition-all duration-300">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-4 md:gap-6">
                        <span className={`text-xs md:text-sm font-mono font-bold transition-colors ${
                          isOpen ? "text-red-600" : "text-zinc-400 group-hover:text-zinc-600"
                        }`}>
                          {policy.id}
                        </span>
                        <span className={`font-black text-base md:text-lg uppercase tracking-wide transition-colors ${
                          isOpen ? "text-red-600" : "text-zinc-900 group-hover:text-red-600"
                        }`}>
                          {policy.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 transition-all duration-300 ${
                          isOpen ? "rotate-180 text-red-600" : "text-zinc-400 group-hover:text-zinc-600"
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-[300px] pb-6" : "max-h-0"
                      }`}
                    >
                      <div className="pl-8 md:pl-10">
                        {policy.bullets ? (
                          <ul className="list-none space-y-3">
                            {policy.bullets.map((bullet, idx) => (
                              <li key={idx} className="text-sm text-zinc-600 leading-relaxed flex items-start gap-2.5">
                                <span className="text-red-500 font-extrabold mt-0.5 select-none">•</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-zinc-600 leading-relaxed">
                            {policy.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
