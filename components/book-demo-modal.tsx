'use client'

import { useState } from 'react'
import { X, Loader2, CheckCircle, AlertCircle, WifiOff } from 'lucide-react'
import { createBooking } from '@/lib/api/bookings'
import { toast } from 'sonner'

interface BookDemoModalProps {
  isOpen: boolean
  onClose: () => void
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error' | 'offline'

export function BookDemoModal({ isOpen, onClose }: BookDemoModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    classInterested: 'X' as string
  })
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [message, setMessage] = useState('')

  if (!isOpen) return null

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const days = Array.from({ length: daysInMonth(currentMonth) }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayOfMonth(currentMonth) }, (_, i) => i)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    // Only allow future dates
    if (newDate >= new Date(new Date().setHours(0, 0, 0, 0))) {
      setSelectedDate(newDate)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', phone: '', email: '', classInterested: 'X' })
    setSelectedDate(null)
    setSubmitState('idle')
    setMessage('')
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.email || !selectedDate) {
      setMessage('Please fill all fields and select a date')
      setSubmitState('error')
      return
    }

    // Validate phone number
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setMessage('Please enter a valid 10-digit phone number')
      setSubmitState('error')
      return
    }

    // Validate email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      setMessage('Please enter a valid email address')
      setSubmitState('error')
      return
    }

    setSubmitState('loading')
    console.log('[BookDemoModal] Submitting booking:', { ...formData, selectedDate })

    try {
      const result = await createBooking({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        selectedDate: selectedDate,
        classInterested: formData.classInterested
      })

      if (result.error) {
        console.error('[BookDemoModal] Booking error:', result.error)
        setMessage(result.error)
        setSubmitState('error')
        toast.error('Booking failed.', { description: result.error })
      } else if (result.isOffline) {
        console.warn('[BookDemoModal] Booking saved offline')
        setMessage(result.message)
        setSubmitState('offline')
        toast('Saved offline.', { description: result.message })
        // Auto close after showing offline message
        setTimeout(() => {
          resetForm()
          onClose()
        }, 3000)
      } else {
        console.log('[BookDemoModal] Booking successful')
        setMessage(result.message)
        setSubmitState('success')
        toast.success('Demo booked!', { description: result.message })
        // Auto close after success
        setTimeout(() => {
          resetForm()
          onClose()
        }, 2000)
      }
    } catch (err) {
      console.error('[BookDemoModal] Unexpected error:', err)
      setMessage('An unexpected error occurred. Please try again.')
      setSubmitState('error')
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const today = new Date()
  const isDatePast = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date < new Date(today.setHours(0, 0, 0, 0))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4">
      <div className="flex flex-col md:flex-row w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl">
        {/* Left Panel - Dark Context */}
        <div className="w-full md:w-1/2 bg-zinc-950 text-white p-8 md:p-12 flex flex-col justify-center relative">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Claim your 10-Day Free Access Seat.</h2>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Join Prabhat Coaching Classes and experience our world-class education system. Limited seats available for each batch.
          </p>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Right Panel - Interactive Form */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-8 flex flex-col overflow-y-auto">
          <h3 className="text-lg font-bold text-zinc-950 mb-6">Book Your Free Demo</h3>

          {/* Status Messages */}
          {submitState === 'success' && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-sm text-emerald-800">{message}</p>
            </div>
          )}

          {submitState === 'error' && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{message}</p>
            </div>
          )}

          {submitState === 'offline' && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">{message}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4 mb-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={submitState === 'loading' || submitState === 'success'}
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-red-600 disabled:bg-zinc-100"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Contact Phone (10 digits)"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={submitState === 'loading' || submitState === 'success'}
              maxLength={10}
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-red-600 disabled:bg-zinc-100"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              disabled={submitState === 'loading' || submitState === 'success'}
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-red-600 disabled:bg-zinc-100"
            />
            <select
              name="classInterested"
              value={formData.classInterested}
              onChange={handleInputChange}
              disabled={submitState === 'loading' || submitState === 'success'}
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-red-600 disabled:bg-zinc-100"
            >
              <option value="IX">Class IX</option>
              <option value="X">Class X</option>
              <option value="XI Commerce">Class XI Commerce</option>
              <option value="XII Commerce">Class XII Commerce</option>
            </select>
          </div>

          {/* Calendar Picker */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-950 mb-3">Select Preferred Date</label>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="text-zinc-600 hover:text-zinc-950 px-2"
                disabled={submitState === 'loading' || submitState === 'success'}
              >
                &larr;
              </button>
              <span className="text-sm font-semibold text-zinc-950">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="text-zinc-600 hover:text-zinc-950 px-2"
                disabled={submitState === 'loading' || submitState === 'success'}
              >
                &rarr;
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-zinc-600 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {emptyDays.map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map(day => {
                const isPast = isDatePast(day)
                const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth.getMonth()
                
                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    disabled={isPast || submitState === 'loading' || submitState === 'success'}
                    className={`py-2 rounded text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white'
                        : isPast
                        ? 'text-zinc-300 cursor-not-allowed'
                        : 'text-zinc-950 hover:bg-zinc-100'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.phone || !formData.email || !selectedDate || submitState === 'loading' || submitState === 'success'}
            className="w-full py-3 bg-zinc-950 text-white font-semibold rounded-lg hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {submitState === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Booking...
              </>
            ) : submitState === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Booked!
              </>
            ) : (
              'Confirm My Free Slot'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
