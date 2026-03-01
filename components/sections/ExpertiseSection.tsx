'use client'

import AnimateOnScroll from '../client/AnimateOnScroll'
import Image from 'next/image'

export default function ExpertiseSection() {
  return (
    <section className="section">
      <div className="hero-container">
        <div className="d-flex flex-column flex-lg-row gspace-5">
          <div className="expertise-img-layout">
            <div className="image-container expertise-img">
              <AnimateOnScroll animation="fadeInUp" speed="normal">
                <Image
                  src="/assets/images/pexels-ionelceban-3194327.webp"
                  alt="Expertise Image"
                  width={800}
                  height={600}
                  className="img-fluid"
                  priority
                  quality={85}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                />
              </AnimateOnScroll>
              <div className="expertise-layout">
                <div className="d-flex flex-column">
                  <div className="card-expertise-wrapper">
                    <AnimateOnScroll animation="fadeInDown" speed="normal">
                      <div className="card card-expertise">
                        <h4>Simple. Fast. Automated.</h4>
                        <p>We generate fully functional websites in just a few minutes, right from your explanations, without writing a single line of code.</p>
                        <div className="d-flex align-items-center flex-row gspace-2 expertise-link">
                          <a href="/create">Try it now</a>
                          <Image
                            src="/assets/images/cursor.webp"
                            alt="arrow"
                            width={16}
                            height={16}
                            className="cursor-icon"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </AnimateOnScroll>
                  </div>
                  <div className="expertise-spacer"></div>
                </div>
                <div className="expertise-spacer"></div>
              </div>
            </div>
          </div>
          <div className="expertise-title">
            <AnimateOnScroll animation="fadeInRight" speed="normal">
              <div className="sub-heading">
                <i className="fa-regular fa-circle-dot"></i>
                <span>how it works</span>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fadeInRight" speed="normal">
              <h2 className="title-heading">
                Three simple steps to your new website
              </h2>
            </AnimateOnScroll>
            <p>
              Interact with our virtual assistant and get a website ready to launch. We handle the design, copywriting, and programming, so you can focus on your business.
            </p>
            <div className="d-flex flex-column flex-md-row gspace-2">
              <div className="expertise-list">
                <h5>The Webjuvelle Process:</h5>
                <ul className="check-list">
                  <li><a href="/create">1. Answer the AI's questions</a></li>
                  <li><a href="/create">2. We pick colors and fonts</a></li>
                  <li><a href="/create">3. We generate structure & code</a></li>
                  <li><a href="/create">4. You review the final result</a></li>
                  <li><a href="/create">5. Manage from Dashboard</a></li>
                </ul>
              </div>

              <AnimateOnScroll animation="fadeInUp">
                <div className="card card-expertise card-expertise-counter animate-box">
                  <div className="d-flex flex-row gspace-2 align-items-center">
                    <div className="d-flex flex-row align-items-center">
                      <span className="counter-wrapper">
                        <span className="counter-detail">+</span>
                      </span>
                    </div>
                    <h6>Quick Support</h6>
                  </div>
                  <p>
                    Need further changes? You can edit any section directly from the control panel effortlessly, or ask us to apply them for you.
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

