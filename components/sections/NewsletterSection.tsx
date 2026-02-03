'use client'

import AnimateOnScroll from '../client/AnimateOnScroll'
import Image from 'next/image'

export default function NewsletterSection() {
  return (
    <section className="section">
      <div className="hero-container">
        <div className="newsletter-wrapper">
          <div className="newsletter-layout">
            <div className="spacer"></div>
            <div className="d-flex flex-column gspace-5 position-relative z-2">
              <AnimateOnScroll animation="fadeInLeft" speed="normal">
                <div className="d-flex flex-column gspace-2">
                  <h3 className="title-heading">Experiența brandului tău începe acum</h3>
                  <p>
                    Nu vindem servicii. Alegem parteneri. Tu ce alegi?
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll animation="fadeInRight" speed="normal">
                <a 
                  href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ38JrGsAlyvinUx2IY6KHYyI7IQ-QaifvAz9diIDscT3oKh-S-_tG2_Kgkv_CYFaGW_RxtNrH73" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-accent newsletter-btn"
                >
                  <span className="btn-title">
                    <span>Aplică acum</span>
                  </span>
                  <span className="icon-circle">
                    <Image 
                      src="/assets/images/cursor.webp" 
                      alt="arrow" 
                      width={16}
                      height={16}
                      className="cursor-icon"
                      loading="lazy"
                    />
                  </span>
                </a>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

