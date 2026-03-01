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
                  <h3 className="title-heading">Launch your new website now</h3>
                  <p>
                    You don't need technical skills. Just a great idea.
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll animation="fadeInRight" speed="normal">
                <a
                  href="/create"
                  className="btn btn-accent newsletter-btn"
                >
                  <span className="btn-title">
                    <span>Începe Gratuit</span>
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

