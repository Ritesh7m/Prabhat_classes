'use client'

import { useState, useEffect } from 'react'
import { Loader2, WifiOff } from 'lucide-react'
import { getFaculty, Faculty } from '@/lib/api/faculty'
import { fallbackFaculty } from '@/lib/api/fallback-data'

export function FacultySection() {
  const [facultyList, setFacultyList] = useState<Faculty[]>(fallbackFaculty.slice(0, 3))
  const [isLoading, setIsLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [isViewAll, setIsViewAll] = useState(false)

  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true)
      try {
        const result = await getFaculty({ limit: 3 })
        setFacultyList(result.data)
        setIsOffline(result.isOffline)
      } catch (err) {
        console.error(err)
        setIsOffline(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchInitial()
  }, [])

  const handleToggleViewAll = async () => {
    setIsLoading(true)
    try {
      if (isViewAll) {
        const result = await getFaculty({ limit: 3 })
        setFacultyList(result.data)
        setIsOffline(result.isOffline)
        setIsViewAll(false)
      } else {
        const result = await getFaculty() // fetch all
        setFacultyList(result.data)
        setIsOffline(result.isOffline)
        setIsViewAll(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="faculty" className="py-20 px-4 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">Our Team</p>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-950 mb-4 flex items-center justify-center gap-2 flex-wrap">
            <span>The Minds Shaping the Scores</span>
            {isOffline && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded normal-case tracking-normal">
                <WifiOff className="w-3 h-3" /> Offline Data
              </span>
            )}
          </h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">Experienced educators dedicated to student excellence and personalized mentorship.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            <span className="ml-3 text-zinc-550 text-sm font-medium">Loading faculty registry...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {facultyList.map((item) => (
                <div key={item._id} className="group">
                  <div className="relative overflow-hidden rounded-lg bg-zinc-100 border border-zinc-200 mb-6 aspect-square hover:border-red-600 transition-all duration-300">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-300 ${
                          item.isOwner ? 'grayscale group-hover:grayscale-0' : ''
                        }`}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 border border-dashed border-zinc-200 p-4">
                        <div className="text-5xl text-zinc-300 mb-2">
                          {item.subject && item.subject.toLowerCase().includes('math') ? '📊' : '📚'}
                        </div>
                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">{item.subject || 'Faculty Member'}</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-950">{item.name}</h3>
                  <p className="text-sm text-zinc-600">
                    {item.role}{item.subject ? ` · ${item.subject}` : ''}
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    {item.description || `Senior educator with ${item.experience} teaching experience.`}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={handleToggleViewAll}
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 text-white hover:bg-red-600 font-bold uppercase tracking-wider text-xs transition-colors duration-300"
              >
                {isViewAll ? 'Show Less' : 'View All Faculty'}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
