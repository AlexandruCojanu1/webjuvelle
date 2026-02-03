'use client'

import React, { useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import 'animate.css'

interface AnimateOnScrollProps {
  children: React.ReactElement
  animation?: string
  delay?: number
  speed?: 'normal' | 'fast' | 'slow'
  threshold?: number
}

export default function AnimateOnScroll({
  children,
  animation = 'fadeInUp',
  delay = 0,
  speed = 'normal',
  threshold = 0.15,
}: AnimateOnScrollProps) {
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold,
  })

  if (!React.isValidElement(children)) {
    return <>{children}</>
  }

  const child = children as React.ReactElement<any>
  const originalRef = (child as any).ref

  // Combine refs: intersection observer + original child ref
  const combinedRef = useCallback((node: HTMLElement | null) => {
    // Set intersection observer ref
    if (typeof inViewRef === 'function') {
      inViewRef(node)
    } else if (inViewRef) {
      (inViewRef as React.MutableRefObject<HTMLElement | null>).current = node
    }

    // Preserve original ref if it exists
    if (originalRef) {
      if (typeof originalRef === 'function') {
        originalRef(node)
      } else {
        (originalRef as React.MutableRefObject<HTMLElement | null>).current = node
      }
    }
  }, [inViewRef, originalRef])

  const speedClass = {
    normal: '',
    fast: 'animate__fast',
    slow: 'animate__slow',
  }[speed]

  return React.cloneElement(child, {
    ref: combinedRef,
    className: `${(child.props as any).className || ''} animate__animated ${inView ? `animate__${animation} ${speedClass}` : ''
      }`.trim(),
    style: {
      ...((child.props as any).style || {}),
      opacity: inView ? 1 : 0,
      animationDelay: inView ? `${delay}ms` : undefined,
    },
  } as any)
}

