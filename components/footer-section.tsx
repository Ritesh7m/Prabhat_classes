"use client"

import { useState } from "react"
import Image from "next/image"
import { Send, CheckCircle, AlertCircle, Loader2, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { submitContact } from "@/lib/api/contacts"
import { toast } from "sonner"

type SubmitState = "idle" | "loading" | "success" | "error" | "offline"

const footerNav = [
  { label: "Home", href: "#home" },
  { label: "Programs", href: "#programs" },
  { label: "Wall of Fame", href: "#toppers" },
  { label: "Our Faculty", href: "#faculty" },
  { label: "Student Life", href: "#student-life" },
  { label: "Policies & Disclaimer", href: "#policies" },
]

export function FooterSection() {
  const [formData, setFormData] = useState({
    studentName: "",
    parentContact: "",
    email: "",
    classSelect: "",
  })
  const [submitState, setSubmitState] = useState<SubmitState>("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.studentName || !formData.parentContact || !formData.classSelect) {
      setMessage("Please fill all required fields")
      setSubmitState("error")
      toast.error('Missing fields.', { description: 'Please fill all required fields.' })
      return
    }
    if (!/^[0-9]{10}$/.test(formData.parentContact)) {
      setMessage("Please enter a valid 10-digit phone number")
      setSubmitState("error")
      toast.error('Invalid phone number.', { description: 'Please enter a valid 10-digit phone number.' })
      return
    }

    setSubmitState("loading")

    try {
      const msg = `Hello Prabhat Classes, I would like to inquire about admissions.

Here are the details:
• Student Name: ${formData.studentName.trim()}
• Class: ${formData.classSelect}
• Parent Contact: ${formData.parentContact}
${formData.email ? `• Email: ${formData.email.trim()}` : ""}`

      const encodedMsg = encodeURIComponent(msg)
      const whatsappUrl = `https://wa.me/919321446648?text=${encodedMsg}`

      window.open(whatsappUrl, "_blank", "noopener,noreferrer")

      setSubmitState("success")
      setMessage("WhatsApp opened! Please send the prefilled message in chat to complete your inquiry.")
      toast.success('WhatsApp opened!', { description: 'Please send the pre-filled message to complete your inquiry.' })

      setTimeout(() => {
        setFormData({ studentName: "", parentContact: "", email: "", classSelect: "" })
        setSubmitState("idle")
        setMessage("")
      }, 5000)
    } catch {
      setMessage("An unexpected error occurred. Please try again.")
      setSubmitState("error")
      toast.error('Unexpected error.', { description: 'An unexpected error occurred. Please try again.' })
    }
  }

  return (
    <footer id="contact" className="bg-zinc-950 text-white">

      {/* ── BIG MAP ─────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-80 md:h-[480px] overflow-hidden border-b border-zinc-800">
        <iframe
          src="https://maps.google.com/maps?q=Prabhat%20Coaching%20Classes,%20Jamer%20Ahmed%20Chawl,%20N.S.S%20Road,%20Opp.%20Swami%20Samarth%20Mandir,%20Asalpha,%20Ghatkopar%20West,%20Mumbai%20%E2%80%93%20400084&t=&z=17&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "grayscale(20%) contrast(1.05)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Prabhat Coaching Classes Location"
        />
        {/* Address overlay pill */}
        <div className="absolute bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-sm bg-zinc-950/95 backdrop-blur-sm border border-zinc-700 rounded-xl p-4 flex gap-3 items-start shadow-xl">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-0.5">Prabhat Coaching Classes</p>
            <p className="text-sm text-zinc-300 leading-snug">
              Jamer Ahmed Chawl, N.S.S Road,<br />
              Opp. Swami Samarth Mandir, Asalpha,<br />
              <span className="font-semibold text-white">Ghatkopar (W), Mumbai – 400 084</span>
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Prabhat+Coaching+Classes,+Jamer+Ahmed+Chawl,+N.S.S+Road,+Opp.+Swami+Samarth+Mandir,+Asalpha,+Ghatkopar+West,+Mumbai+-+400084"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-red-400 hover:text-red-300 transition-colors mt-2 inline-flex items-center gap-1 font-semibold"
            >
              Open in Google Maps
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── CONTACT STRIP ───────────────────────────────────────────────────── */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            {/* Phone 1 */}
            <a
              href="tel:9321446648"
              className="group flex items-center gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-600 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center flex-shrink-0 group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-200">
                <svg className="w-5 h-5 text-red-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">Call Us</p>
                <p className="text-lg font-black text-white font-mono tracking-wide">9321446648</p>
              </div>
            </a>

            {/* Phone 2 */}
            <a
              href="tel:8286080756"
              className="group flex items-center gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-600 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center flex-shrink-0 group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-200">
                <svg className="w-5 h-5 text-red-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">Call Us</p>
                <p className="text-lg font-black text-white font-mono tracking-wide">8286080756</p>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:prabhatcoachingclasses@gmail.com"
              className="group flex items-center gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-600 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center flex-shrink-0 group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-200">
                <svg className="w-5 h-5 text-red-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">Email Us</p>
                <p className="text-sm font-bold text-white truncate">prabhatclasses@gmail.com</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* ── CONTACT FORM + SOCIAL ────────────────────────────────────────────── */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: Brand + Social + Quick info */}
            <div>
              <div className="flex items-center mb-4">
                <Image 
                  src="/images/prabhat_logo.png" 
                  alt="Prabhat Classes Logo" 
                  width={180}
                  height={64}
                  className="h-16 w-auto object-contain brightness-105"
                />
              </div>
              <p className="text-zinc-400 text-sm mb-8 max-w-sm leading-relaxed">
                The launchpad for School Toppers in Ghatkopar West, Mumbai. Personalized coaching for Class V–X with a 100% board exam success track record.
              </p>

              {/* Social links */}
              <div className="mb-8">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Follow Us</p>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/prabhat_classes9321?igsh=cjZ5cmdkempoYmRv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 hover:border-transparent transition-all duration-300"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/Prabhatclasses1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/919321446648"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-green-600 hover:border-green-600 transition-all duration-300"
                    aria-label="WhatsApp"
                  >
                    <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick nav */}
              <div className="mb-8">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Quick Links</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {footerNav.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors hover:translate-x-1 inline-block transform duration-150"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Phone number below Quick Links */}
              <div className="border-t border-zinc-800/80 pt-6">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Direct Contact</p>
                <p className="text-sm text-zinc-300 flex flex-col gap-1 font-mono">
                  <span>Call: <a href="tel:8286080756" className="hover:text-white transition-colors font-bold">8286080756</a></span>
                  <span>Call: <a href="tel:9321446648" className="hover:text-white transition-colors font-bold">9321446648</a></span>
                </p>
              </div>
            </div>

            {/* Right: Admission form */}
            <div>
              <div className="mb-6">
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Admissions Open</p>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                  Secure Your Seat<br />For The Next Batch
                </h3>
                <p className="text-zinc-400 text-sm mt-2">
                  Fill the form and we'll call you within 24 hours.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                {submitState === "success" ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <CheckCircle className="w-14 h-14 text-emerald-500 mb-4" />
                    <h4 className="text-xl font-bold mb-2">Request Submitted!</h4>
                    <p className="text-zinc-400 text-sm">{message || "We'll contact you within 24 hours."}</p>
                  </div>
                ) : submitState === "offline" ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <WifiOff className="w-14 h-14 text-amber-500 mb-4" />
                    <h4 className="text-xl font-bold mb-2">Request Received!</h4>
                    <p className="text-zinc-400 text-sm">{message}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {submitState === "error" && (
                      <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-400">{message}</p>
                      </div>
                    )}
                    <div>
                      <label htmlFor="studentName" className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">Student Name *</label>
                      <Input
                        id="studentName"
                        type="text"
                        required
                        placeholder="Enter student's full name"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg h-11 focus:border-red-500"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        disabled={submitState === "loading"}
                      />
                    </div>
                    <div>
                      <label htmlFor="parentContact" className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">Parent Contact *</label>
                      <Input
                        id="parentContact"
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg h-11 focus:border-red-500"
                        value={formData.parentContact}
                        onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
                        disabled={submitState === "loading"}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">Email (Optional)</label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email address"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg h-11 focus:border-red-500"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={submitState === "loading"}
                      />
                    </div>
                    <div>
                      <label htmlFor="classSelect" className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">Select Class *</label>
                      <select
                        id="classSelect"
                        required
                        className="w-full h-11 bg-zinc-800 border border-zinc-700 text-white px-3 rounded-lg focus:outline-none focus:border-red-500 disabled:opacity-50"
                        value={formData.classSelect}
                        onChange={(e) => setFormData({ ...formData, classSelect: e.target.value })}
                        disabled={submitState === "loading"}
                      >
                        <option value="">Choose a class</option>
                        <optgroup label="Primary Division (Classes I – IV)" className="bg-zinc-900 text-zinc-300 font-bold">
                          <option value="Class I">Class I</option>
                          <option value="Class II">Class II</option>
                          <option value="Class III">Class III</option>
                          <option value="Class IV">Class IV</option>
                        </optgroup>
                        <optgroup label="School Division (Classes V – VIII)" className="bg-zinc-900 text-zinc-300 font-bold">
                          <option value="Class V">Class V</option>
                          <option value="Class VI">Class VI</option>
                          <option value="Class VII">Class VII</option>
                          <option value="Class VIII">Class VIII</option>
                        </optgroup>
                        <optgroup label="SSC Division (Classes IX – X)" className="bg-zinc-900 text-zinc-300 font-bold">
                          <option value="Class IX">Class IX</option>
                          <option value="Class X">Class X (SSC Board)</option>
                        </optgroup>
                      </select>
                    </div>
                    <Button
                      type="submit"
                      disabled={submitState === "loading"}
                      className="w-full bg-red-600 text-white rounded-lg py-3 h-auto font-bold uppercase tracking-wider hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {submitState === "loading" ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
                      ) : (
                        <><Send className="w-4 h-4 mr-2" />Request Callback</>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800/50 mt-8">
        <p className="text-xs text-zinc-600 text-center sm:text-left">
          © {new Date().getFullYear()} Prabhat Coaching Classes. All rights reserved.
        </p>
        <p className="text-xs text-zinc-500 text-center flex flex-wrap justify-center gap-x-3 gap-y-1">
          <span>Call: <a href="tel:8286080756" className="hover:text-white text-zinc-400 font-bold transition-colors">8286080756</a></span>
          <span className="text-zinc-700">|</span>
          <span><a href="tel:9321446648" className="hover:text-white text-zinc-400 font-bold transition-colors">9321446648</a></span>
        </p>
        <p className="text-xs text-zinc-600 text-center sm:text-right flex flex-col sm:items-end gap-1">
          <span>Ghatkopar (W), Mumbai – 400 084</span>
          <a href="/login" className="text-[9px] text-zinc-700 hover:text-red-500 transition-colors uppercase font-bold tracking-widest mt-0.5">
            Are you admin?
          </a>
        </p>
      </div>

    </footer>
  )
}
