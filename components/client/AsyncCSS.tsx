'use client'

import { useEffect } from 'react'

interface AsyncCSSProps {
  href: string
  media?: string
}

/**
 * AsyncCSS Component - Loads CSS asynchronously to prevent render blocking
 * Uses the preload + onload pattern for maximum browser compatibility
 * 
 * Strategy:
 * 1. Load CSS as 'preload' with media='print' (prevents render blocking)
 * 2. Convert to 'stylesheet' with correct media when loaded
 * 3. Fallback timeout for browsers that don't support onload on link elements
 */
export default function AsyncCSS({ href, media = 'all' }: AsyncCSSProps) {
  useEffect(() => {
    // Check if stylesheet is already loaded
    const existingLink = document.querySelector(`link[href="${href}"]`)
    if (existingLink) {
      return
    }

    // Create link element
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = href
    // Use 'print' media to prevent render blocking, will change to actual media on load
    link.media = 'print'
    
    // Store original media value
    const targetMedia = media
    
    // Fallback timeout reference for cleanup
    let fallbackTimeout: NodeJS.Timeout | null = null
    
    // Convert to stylesheet when loaded
    link.onload = function() {
      const linkElement = this as HTMLLinkElement
      linkElement.rel = 'stylesheet'
      linkElement.media = targetMedia
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout)
        fallbackTimeout = null
      }
    }
    
    // Fallback for browsers that don't support onload on link elements
    fallbackTimeout = setTimeout(() => {
      const existingLink = document.querySelector(`link[href="${href}"]`) as HTMLLinkElement
      if (existingLink && existingLink.rel === 'preload') {
        existingLink.rel = 'stylesheet'
        existingLink.media = targetMedia
      }
      fallbackTimeout = null
    }, 100)

    // Append to head
    document.head.appendChild(link)

    // Cleanup function
    return () => {
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout)
      }
      const linkToRemove = document.querySelector(`link[href="${href}"]`)
      if (linkToRemove) {
        linkToRemove.remove()
      }
    }
  }, [href, media])

  return null
}
