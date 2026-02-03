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
                <span>Soluțiile noastre</span>
              </div>
              <h2 className="title-heading heading-container heading-container-short">
                Opțiunile tale
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
                      <h3 className="title-heading">Alege experiența brandului tău.</h3>
                      <div className="link-wrapper">
                        <a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ38JrGsAlyvinUx2IY6KHYyI7IQ-QaifvAz9diIDscT3oKh-S-_tG2_Kgkv_CYFaGW_RxtNrH73" target="_blank" rel="noopener noreferrer">Te așteptăm la o cafea</a>
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
                    <h4>Social Media Management</h4>
                    <p>Lasă audiența să îți cunoască brandul mai bine.</p>
                    <div className="d-flex flex-row gspace-1 align-items-center h-100">
                      <p>de la</p>
                      <h3>450 EUR</h3>
                      <p>/luna</p>
                    </div>
                    <ul className="check-list">
                      <li><a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ38JrGsAlyvinUx2IY6KHYyI7IQ-QaifvAz9diIDscT3oKh-S-_tG2_Kgkv_CYFaGW_RxtNrH73" target="_blank" rel="noopener noreferrer">Branding ( banner, PFP, bio, 4 postari)</a></li>
                      <li><a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ38JrGsAlyvinUx2IY6KHYyI7IQ-QaifvAz9diIDscT3oKh-S-_tG2_Kgkv_CYFaGW_RxtNrH73" target="_blank" rel="noopener noreferrer">Content planning & posting (copywriting)</a></li>
                      <li><a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ38JrGsAlyvinUx2IY6KHYyI7IQ-QaifvAz9diIDscT3oKh-S-_tG2_Kgkv_CYFaGW_RxtNrH73" target="_blank" rel="noopener noreferrer">Creștere organică (prezența zilnică)</a></li>
                    </ul>
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
            <div className="col">
              <AnimateOnScroll animation="fadeInUp" speed="slow">
                <div className="card card-pricing pricing-highlight">
                  <div className="spacer" />
                  <h4>Website Development</h4>
                  <p>Design; Performanță; on-site SEO</p>
                  <div className="d-flex flex-row gspace-1 align-items-center">
                    <p>de la</p>
                    <h3>800 EUR</h3>
                  </div>

                  <div className="core-benefits">
                    <div className="benefit">
                      <i className="fa-solid fa-brain"></i>
                      <a href="#">UI/UX unic</a>
                    </div>
                    <div className="benefit">
                      <i className="fa-brands fa-accessible-icon"></i>
                      <a href="#">personalizat în cod (nu Wordpress)</a>
                    </div>
                    <div className="benefit">
                      <i className="fa-solid fa-bug"></i>
                      <a href="#">hosting performant (server propriu)</a>
                    </div>
                  </div>

                  <ul className="check-list">
                    <li><a href="#">Landing-Page; Multi-Page; E-commerce</a></li>
                    <li><a href="#">Integrări sisteme de plată (Stripe)</a></li>
                    <li><a href="#">Sistem de rezervări & programări</a></li>
                    <li><a href="#">Integrare Dashboard, Admin-Page</a></li>
                    <li><a href="#">SEO automatizat (pentru Blog)</a></li>
                    <li><a href="#">Elemente de design avansate</a></li>
                  </ul>
                </div>
              </AnimateOnScroll>
            </div>
            <div className="col">
              <div className="pricing-container">
                <AnimateOnScroll animation="fadeInRight" speed="normal">
                  <div className="card pricing-highlight-box">
                    <div className="d-flex flex-column gspace-2 w-100">
                      <h5>Brandul tău, o experiență memorabilă!</h5>
                      <div className="d-flex flex-column gspace-2">
                        <div className="pricing-highlights">
                          <a href="#">Branding consistent</a>
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
                          <a href="#">Imagine unică</a>
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
                          <a href="#">Conturul afacerii tale</a>
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
                    <h4>Content Creation</h4>
                    <p>Imaginea statică sau dinamică a brandului tău</p>
                    <div className="d-flex flex-row gspace-1 align-items-center h-100">
                      <p>de la</p>
                      <h3>950 EUR</h3>
                    </div>
                    <ul className="check-list">
                      <li><a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ38JrGsAlyvinUx2IY6KHYyI7IQ-QaifvAz9diIDscT3oKh-S-_tG2_Kgkv_CYFaGW_RxtNrH73" target="_blank" rel="noopener noreferrer">o sesiune foto & video</a></li>
                      <li><a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ38JrGsAlyvinUx2IY6KHYyI7IQ-QaifvAz9diIDscT3oKh-S-_tG2_Kgkv_CYFaGW_RxtNrH73" target="_blank" rel="noopener noreferrer">3 videoclipuri (15-60 sec)</a></li>
                      <li><a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ38JrGsAlyvinUx2IY6KHYyI7IQ-QaifvAz9diIDscT3oKh-S-_tG2_Kgkv_CYFaGW_RxtNrH73" target="_blank" rel="noopener noreferrer">30 fotografii (personalizate)</a></li>
                    </ul>
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

