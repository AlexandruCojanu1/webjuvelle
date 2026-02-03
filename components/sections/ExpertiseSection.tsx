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
                        <h4>Simplu. Transparent. Relevant.</h4>
                        <p>Construim experiențe digitale care rămân simple pentru tine, transparente pentru parteneri și relevante pentru public.</p>
                        <div className="d-flex align-items-center flex-row gspace-2 expertise-link">
                          <a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ38JrGsAlyvinUx2IY6KHYyI7IQ-QaifvAz9diIDscT3oKh-S-_tG2_Kgkv_CYFaGW_RxtNrH73" target="_blank" rel="noopener noreferrer">Programează o întâlnire</a>
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
                <span>identitatea noastră</span>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fadeInRight" speed="normal">
              <h2 className="title-heading">
                Construim și consolidăm identități digitale
              </h2>
            </AnimateOnScroll>
            <p>
              Suntem consultantul și creatorul tău de imagine în online. Identificăm punctele forte și vulnerabilitățile business-ului tău. Elaborăm strategii gândite să îți atingă potențialul.
            </p>
            <div className="d-flex flex-column flex-md-row gspace-2">
              <div className="expertise-list">
                <h5>Ce iubim să facem:</h5>
                <ul className="check-list">
                  <li><a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ38JrGsAlyvinUx2IY6KHYyI7IQ-QaifvAz9diIDscT3oKh-S-_tG2_Kgkv_CYFaGW_RxtNrH73" target="_blank" rel="noopener noreferrer">identitate vizuală</a></li>
                  <li><a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ38JrGsAlyvinUx2IY6KHYyI7IQ-QaifvAz9diIDscT3oKh-S-_tG2_Kgkv_CYFaGW_RxtNrH73" target="_blank" rel="noopener noreferrer">website design (UI/UX)</a></li>
                  <li><a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ38JrGsAlyvinUx2IY6KHYyI7IQ-QaifvAz9diIDscT3oKh-S-_tG2_Kgkv_CYFaGW_RxtNrH73" target="_blank" rel="noopener noreferrer">website development</a></li>
                  <li><a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ38JrGsAlyvinUx2IY6KHYyI7IQ-QaifvAz9diIDscT3oKh-S-_tG2_Kgkv_CYFaGW_RxtNrH73" target="_blank" rel="noopener noreferrer">SEO (on-site & off-site)</a></li>
                  <li><a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ38JrGsAlyvinUx2IY6KHYyI7IQ-QaifvAz9diIDscT3oKh-S-_tG2_Kgkv_CYFaGW_RxtNrH73" target="_blank" rel="noopener noreferrer">content creation</a></li>
                  <li><a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ38JrGsAlyvinUx2IY6KHYyI7IQ-QaifvAz9diIDscT3oKh-S-_tG2_Kgkv_CYFaGW_RxtNrH73" target="_blank" rel="noopener noreferrer">strategie ADS</a></li>
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
                    <h6>Cine suntem noi</h6>
                  </div>
                  <p>
                    Suntem brașoveni, dedicați construirii identităților digitale memorabile pentru branduri care vor să fie văzute pentru exact ceea ce sunt.
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

