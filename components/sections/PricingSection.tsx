'use client'

import AnimateOnScroll from '../client/AnimateOnScroll'
import Image from 'next/image'

export default function PricingSection() {
  return (
    <section className="section">
      <div className="hero-container">
        <div className="d-flex flex-column justify-content-center text-center gspace-5">
          <AnimateOnScroll animation="fadeInUp" speed="normal">
            <div className="d-flex flex-column gspace-2">
              <div className="sub-heading align-self-center">
                <i className="fa-regular fa-circle-dot"></i>
                <span>Flexible Plans</span>
              </div>
              <h2 className="title-heading heading-container heading-container-medium">
                Choose the right plan for you
              </h2>
            </div>
          </AnimateOnScroll>
          <div className="row row-cols-lg-3 row-cols-1 grid-spacer-2">
            <div className="col">
              <div className="pricing-container">
                <AnimateOnScroll animation="fadeInLeft" speed="normal">
                  <div className="card card-pricing-title">
                    <div className="spacer" />
                    <div className="content">
                      <h3 className="title-heading">Launch your business online now.</h3>
                      <div className="link-wrapper">
                        <a href="/create">Start for free</a>
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
                  </div>
                </AnimateOnScroll>

                <AnimateOnScroll animation="fadeInUp" speed="normal">
                  <div className="card card-pricing">
                    <div className="card-pricing-header">
                      <h4>Free / Hobby</h4>
                      <p>Ideal for discovering Webjuvelle capabilities.</p>
                    </div>
                    <div className="card-pricing-price">
                      <h2>
                        <span>$</span>0<span>/mo</span>
                      </h2>
                    </div>
                    <ul className="check-list">
                      <li className="d-flex align-items-center flex-row gspace-3">
                        <div className="icon">
                          <i className="fa-solid fa-check"></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-0">Generate 1 Project</p>
                        </div>
                      </li>
                      <li className="d-flex align-items-center flex-row gspace-3">
                        <div className="icon">
                          <i className="fa-solid fa-check"></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-0">Webjuvelle Subdomain</p>
                        </div>
                      </li>
                      <li className="d-flex align-items-center flex-row gspace-3">
                        <div className="icon">
                          <i className="fa-solid fa-check"></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-0">Webjuvelle Watermark</p>
                        </div>
                      </li>
                    </ul>
                    <a href="/create" className="btn btn-outline-primary w-100">
                      Get Started Free
                    </a>
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
            <div className="col">
              <AnimateOnScroll animation="fadeInUp" speed="slow">
                <div className="card card-pricing pricing-highlight">
                  <div className="card-pricing-header">
                    <h4>Business Plan</h4>
                    <p>Complete professional online presence.</p>
                  </div>
                  <div className="card-pricing-price">
                    <h2>
                      <span>$</span>19<span>/mo</span>
                    </h2>
                  </div>

                  <div className="core-benefits">
                    <div className="benefit">
                      <i className="fa-solid fa-brain"></i>
                      <a href="/create">Free Custom Domain (First Year)</a>
                    </div>
                    <div className="benefit">
                      <i className="fa-brands fa-accessible-icon"></i>
                      <a href="/create">Analytics & Stripe Integration</a>
                    </div>
                    <div className="benefit">
                      <i className="fa-solid fa-bug"></i>
                      <a href="/create">No Webjuvelle Watermark</a>
                    </div>
                  </div>

                  <ul className="check-list">
                    <li><a href="/create">Up to 15 AI-Generated Pages</a></li>
                    <li><a href="/create">Functional Contact Forms</a></li>
                    <li><a href="/create">E-Commerce/Blog Creation & Management</a></li>
                    <li><a href="/create">Priority Support & Unlimited Regeneration</a></li>
                  </ul>
                  <a href="/create" className="btn btn-primary w-100">
                    Get Started
                  </a>
                </div>
              </AnimateOnScroll>
            </div>
            <div className="col">
              <div className="pricing-container">
                <AnimateOnScroll animation="fadeInRight" speed="normal">
                  <div className="card pricing-highlight-box">
                    <div className="d-flex flex-column gspace-2 w-100">
                      <h5>READY TO LAUNCH IN MINUTES!</h5>
                      <div className="d-flex flex-column gspace-2">
                        <div className="pricing-highlights">
                          <a href="/create">Instant Generation</a>
                          <Image
                            src="/assets/images/cursor.webp"
                            alt="arrow"
                            width={16}
                            height={16}
                            className="cursor-icon"
                            loading="lazy"
                          />
                        </div>
                        <div className="pricing-highlights">
                          <a href="/create">SEO Optimized</a>
                          <Image
                            src="/assets/images/cursor.webp"
                            alt="arrow"
                            width={16}
                            height={16}
                            className="cursor-icon"
                            loading="lazy"
                          />
                        </div>
                        <div className="pricing-highlights">
                          <a href="/create">Advanced Dashboard</a>
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
                    </div>
                    <div className="spacer" />
                  </div>
                </AnimateOnScroll>

                <AnimateOnScroll animation="fadeInUp" speed="normal">
                  <div className="card card-pricing">
                    <div className="card-pricing-header">
                      <h4>Pro Plan (Agencies)</h4>
                      <p>Full control over your source code.</p>
                    </div>
                    <div className="card-pricing-price">
                      <h2>
                        <span>$</span>49<span>/mo</span>
                      </h2>
                    </div>
                    <ul className="check-list">
                      <li className="d-flex align-items-center flex-row gspace-3">
                        <div className="icon">
                          <i className="fa-solid fa-check"></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-0">Unlimited Projects</p>
                        </div>
                      </li>
                      <li className="d-flex align-items-center flex-row gspace-3">
                        <div className="icon">
                          <i className="fa-solid fa-check"></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-0">Full Source Code Export</p>
                        </div>
                      </li>
                      <li className="d-flex align-items-center flex-row gspace-3">
                        <div className="icon">
                          <i className="fa-solid fa-check"></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-0">No Watermark</p>
                        </div>
                      </li>
                    </ul>
                    <a href="/create" className="btn btn-primary w-100">
                      Choose Pro
                    </a>
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

