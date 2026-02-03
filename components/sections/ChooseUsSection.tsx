'use client'

import AnimateOnScroll from '../client/AnimateOnScroll'
import ChooseUsCard from '../ui/ChooseUsCard'
import { whychooseus } from '../data/ChooseUsData'
import Image from 'next/image'

export default function ChooseUsSection() {
  return (
    <section className="section">
      <div className="hero-container">
        <div className="d-flex flex-column flex-lg-row gspace-5">
          <div className="chooseus-card-container">
            <div className="d-flex flex-column gspace-2">
              {whychooseus.slice(0, 3).map((item) => (
                <ChooseUsCard 
                  key={item.id}
                  icon={item.icon}
                  title={item.title}
                  content={item.content}
                  link={item.link}
                  speed={item.speed as 'fast' | 'normal' | 'slow'}
                />
              ))}
            </div>
          </div>
          <div className="chooseus-content-container">
            <div className="d-flex flex-column gspace-5">
              <AnimateOnScroll animation="fadeInDown" speed="normal">
                <div className="d-flex flex-column gspace-2">
                  <div className="sub-heading">
                    <i className="fa-regular fa-circle-dot"></i>
                    <span>Cea mai bună alegere pentru brandul tău</span>
                  </div>
                  <h2 className="title-heading"><strong>Vizibilitate. Stabilitate. Predictibilitate.</strong></h2>
                  <p className="mb-0">Execuție rapidă. La cel mai înalt standard. Un partener care îți spune și ce să nu faci, nu doar ce vrei să auzi.</p>
                </div>
              </AnimateOnScroll>
              <div className="image-container">
                <Image 
                  src="/assets/images/Gemini_Generated_Image_kzt06fkzt06fkzt0.webp" 
                  alt="Why Choose Us Image" 
                  width={600}
                  height={800}
                  className="chooseus-img"
                  loading="lazy"
                  quality={85}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
                <div className="card-chooseus-cta-layout">
                  <div className="chooseus-cta-spacer"></div>
                  <div className="d-flex flex-column align-items-end">
                    <div className="chooseus-cta-spacer"></div>
                    <div className="card-chooseus-cta-wrapper">
                      <AnimateOnScroll animation="fadeInUp" speed="normal">
                        <div className="card card-chooseus-cta">
                          <h5>Ai aflat care este identitatea business-ului tău?</h5>
                          <div className="link-wrapper">
                            <a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ38JrGsAlyvinUx2IY6KHYyI7IQ-QaifvAz9diIDscT3oKh-S-_tG2_Kgkv_CYFaGW_RxtNrH73" target="_blank" rel="noopener noreferrer">Aplică acum</a>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

