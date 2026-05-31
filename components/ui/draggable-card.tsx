"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface DraggableCardContainerProps {
  children: React.ReactNode
  className?: string
}

export function DraggableCardContainer({
  children,
  className,
}: DraggableCardContainerProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  )
}

interface DraggableCardBodyProps {
  children: React.ReactNode
  className?: string
}

export function DraggableCardBody({
  children,
  className,
}: DraggableCardBodyProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    const touch = e.touches[0]
    setStartPos({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      })
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      if (e.cancelable) {
        e.preventDefault()
      }
      const touch = e.touches[0]
      setPosition({
        x: touch.clientX - startPos.x,
        y: touch.clientY - startPos.y,
      })
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleEnd)
      window.addEventListener("touchmove", handleTouchMove, { passive: false })
      window.addEventListener("touchend", handleEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleEnd)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleEnd)
    }
  }, [isDragging, startPos])

  return (
    <div
      ref={cardRef}
      className={cn(
        "cursor-grab active:cursor-grabbing select-none transition-shadow duration-200",
        isDragging && "shadow-2xl z-50",
        className
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {children}
    </div>
  )
}
