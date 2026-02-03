'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

interface CounterOnScrollProps {
  target: number
  suffix?: string
  duration?: number
  threshold?: number
  counterClassName?: string
  suffixClassName?: string
}

export default function CounterOnScroll({
  target,
  suffix = '',
  duration = 2000,
  threshold = 0.5,
  counterClassName = 'counter',
  suffixClassName = 'counter-detail',
}: CounterOnScrollProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold,
  })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (inView) {
      const steps = 60
      const increment = Math.max(1, Math.ceil(target / steps))
      const delay = duration / (target / increment)

      const interval = setInterval(() => {
        setCount((prev) => {
          const next = prev + increment
          return next >= target ? target : next
        })
      }, delay)

      return () => clearInterval(interval)
    }
  }, [inView, target, duration])

  return (
    <span ref={ref} className="counter-wrapper">
      <span className={counterClassName} data-target={target}>
        {Math.round(count)}
      </span>
      {suffix && <span className={suffixClassName}>{suffix}</span>}
    </span>
  )
}

