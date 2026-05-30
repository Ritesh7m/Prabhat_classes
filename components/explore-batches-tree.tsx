'use client'

import React, { useState } from 'react'
import { Clock, BookOpen, Sunrise, Sun, Sunset, Info, ChevronDown } from 'lucide-react'

// Dummy weekly schedule data to be replaced with original data later
const generateDummySchedule = (baseTime: string) => [
  { day: 'Monday', subject: 'Mathematics', faculty: 'Rahul Sir', time: baseTime },
  { day: 'Tuesday', subject: 'Science', faculty: 'Priya Mam', time: baseTime },
  { day: 'Wednesday', subject: 'English', faculty: 'Amit Sir', time: baseTime },
  { day: 'Thursday', subject: 'Social Studies', faculty: 'Neha Mam', time: baseTime },
  { day: 'Friday', subject: 'Hindi / Marathi', faculty: 'Sanjay Sir', time: baseTime },
  { day: 'Saturday', subject: 'Weekly Mock Test', faculty: 'Admin', time: baseTime },
]

type ScheduleSlot = {
  day: string
  subject: string
  faculty: string
  time: string
}

type TimetableItem = {
  id: string
  batch: string
  time: string
  grades: string
  notes: string
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  accentColor: string
  accentBg: string
  accentBorder: string
  dotColor: string
  schedule: ScheduleSlot[]
}

const timetableData: TimetableItem[] = [
  {
    id: 'morning',
    batch: 'Morning Batch',
    time: '8:00 AM – 11:00 AM',
    grades: '8th, 9th, 10th',
    notes: 'Includes Hindi language instruction',
    Icon: Sunrise,
    accentColor: 'text-amber-600',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-200',
    dotColor: 'bg-amber-400',
    schedule: generateDummySchedule('8:15 AM - 10:45 AM')
  },
  {
    id: 'afternoon',
    batch: 'Afternoon Batch',
    time: '2:00 PM – 5:00 PM',
    grades: '5th, 6th, 7th',
    notes: 'Standard curriculum sessions',
    Icon: Sun,
    accentColor: 'text-orange-600',
    accentBg: 'bg-orange-50',
    accentBorder: 'border-orange-200',
    dotColor: 'bg-orange-400',
    schedule: generateDummySchedule('2:15 PM - 4:45 PM')
  },
  {
    id: 'evening',
    batch: 'Evening Batch',
    time: '5:00 PM – 8:00 PM',
    grades: '8th, 9th, 10th',
    notes: 'Standard curriculum sessions',
    Icon: Sunset,
    accentColor: 'text-red-600',
    accentBg: 'bg-red-50',
    accentBorder: 'border-red-200',
    dotColor: 'bg-red-500',
    schedule: generateDummySchedule('5:15 PM - 7:45 PM')
  }
]

export function BatchesTimetable() {
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null)

  const toggleBatch = (id: string) => {
    setExpandedBatch(expandedBatch === id ? null : id)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Helper message */}
      <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 mb-8 w-fit mx-auto px-4 py-2 rounded-full border border-zinc-200 bg-zinc-50">
        <Info className="w-3.5 h-3.5 text-red-500" />
        <span>Click on any batch to view the detailed weekly schedule</span>
      </div>

      {/* Main Timetable Container */}
      <div className="w-full flex flex-col gap-4">
        {timetableData.map((session) => {
          const isExpanded = expandedBatch === session.id;

          return (
            <div
              key={session.id}
              className={`flex flex-col border-2 transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? `${session.accentBorder} bg-white shadow-lg`
                  : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md'
              }`}
            >
              {/* Clickable Header Row */}
              <div
                onClick={() => toggleBatch(session.id)}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 cursor-pointer group select-none"
              >
                {/* Batch Name & Icon */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className={`p-3 ${session.accentBg} ${session.accentBorder} border transition-transform duration-300 group-hover:scale-110`}>
                    <session.Icon className={`w-6 h-6 ${session.accentColor}`} />
                  </div>
                  <div>
                    <h3 className="text-zinc-950 font-black text-lg uppercase tracking-wide">
                      {session.batch}
                    </h3>
                    <div className={`flex items-center gap-1.5 text-sm mt-0.5 ${session.accentColor}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-semibold">{session.time}</span>
                    </div>
                  </div>
                </div>

                {/* Grades, Notes Info & Toggle Icon */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 flex-1 md:justify-end">
                  <div className="flex items-center gap-2 px-4 py-2 border border-zinc-200 bg-zinc-50">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span className="text-zinc-700 text-sm font-semibold">
                      Grades: <span className="text-zinc-950">{session.grades}</span>
                    </span>
                  </div>

                  <div className="text-sm text-zinc-500 md:w-[180px] md:text-right hidden sm:block">
                    {session.notes}
                  </div>

                  <div className={`p-2 border transition-all duration-300 ${
                    isExpanded
                      ? `bg-zinc-950 border-zinc-950 text-white`
                      : 'bg-white border-zinc-200 text-zinc-400 group-hover:bg-zinc-950 group-hover:border-zinc-950 group-hover:text-white'
                  }`}>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Expandable Weekly Schedule Table */}
              {isExpanded && (
                <div className={`border-t-2 ${session.accentBorder} animate-in slide-in-from-top-2 fade-in duration-200`}>
                  {/* Accent header strip */}
                  <div className={`${session.accentBg} px-6 py-3 flex items-center gap-2`}>
                    <div className={`w-2 h-2 rounded-full ${session.dotColor}`} />
                    <span className={`text-xs font-bold uppercase tracking-widest ${session.accentColor}`}>
                      Weekly Schedule — {session.batch}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-zinc-950 text-white uppercase text-xs tracking-wider">
                        <tr>
                          <th className="px-6 py-3 font-bold">Day</th>
                          <th className="px-6 py-3 font-bold">Subject & Class</th>
                          <th className="px-6 py-3 font-bold">Faculty</th>
                          <th className="px-6 py-3 font-bold">Timing</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {session.schedule.map((slot, index) => (
                          <tr key={index} className="hover:bg-zinc-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-zinc-950 text-sm uppercase tracking-wide">{slot.day}</td>
                            <td className="px-6 py-4 text-zinc-700 font-medium">{slot.subject}</td>
                            <td className="px-6 py-4 text-zinc-600">{slot.faculty}</td>
                            <td className={`px-6 py-4 font-semibold ${session.accentColor}`}>{slot.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}