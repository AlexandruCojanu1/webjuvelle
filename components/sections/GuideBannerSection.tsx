'use client'

import AnimateOnScroll from '../client/AnimateOnScroll'
import Image from 'next/image'

export default function GuideBannerSection() {
  return (
    <section className="section-guide">
      <div className="guide-banner">
        <video 
          className="guide-banner-video"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/assets/images/guide-banner-poster.webp"
        >
          <source src="/assets/videos/Adsnow.webm" type="video/webm" />
          <source src="/assets/videos/Adsnow.mp4" type="video/mp4" />
        </video>
        <div className="hero-container">
          <AnimateOnScroll animation="fadeInUp" speed="normal">
            <div className="guide-content">
              <div className="d-flex flex-column gspace-2">
                <h3 className="title-heading">Your Online Identity Advisor</h3>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}

