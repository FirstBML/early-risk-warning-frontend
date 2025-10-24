"use client"

import { useState, useEffect } from "react"
import { getRelativeTime } from "@/lib/utils-defi"

export function useRelativeTime(timestamp: string | Date) {
  const [relativeTime, setRelativeTime] = useState(getRelativeTime(timestamp))

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(timestamp))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [timestamp])

  return relativeTime
}
