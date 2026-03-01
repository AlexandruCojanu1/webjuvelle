'use client'

import AnimateOnScroll from '../client/AnimateOnScroll'
import DigitalStepCard from '../ui/DigitalStepCard'
import { digitalSteps } from '../data/DigitalProcessData'
import Image from 'next/image'

export default function DigitalProcessSection() {
  return (
    <section className="section-wrapper-digital-process">
      <div className="digital-process-layout">
        <div className="section digital-process-banner">
          <div className="hero-container">
            <div className="digital-process-content">
              <div className="row row-cols-lg-2 row-cols-1 grid-spacer-5">
                <div className="col">
                  <AnimateOnScroll animation="fadeInDown" speed="normal">
                    <div className="d-flex flex-column gspace-2">
                      <div className="sub-heading">
                        <i className="fa-regular fa-circle-dot"></i>
                        <span>Next Steps</span>
                      </div>
                      <h2 className="title-heading">Simple and transparent</h2>
                    </div>
                  </AnimateOnScroll>
                </div>
                <AnimateOnScroll animation="fadeInDown" speed="slow">
                  <div className="d-flex justify-content-lg-end pt-4 pt-lg-0">
                    <a href="/create" className="btn btn-primary">
                      Get Started
                      <Image
                        src="/assets/images/cursor-dark.webp"
                        alt="arrow"
                        width={16}
                        height={16}
                        className="cursor-icon"
                        loading="lazy"
                      />
                    </a>
                  </div>
                </AnimateOnScroll>
              </div>

              <div className="digital-process-steps-wrapper">
                <div className="digital-process-steps">
                  <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1">
                    {digitalSteps.map((item, index) => (
                      <DigitalStepCard
                        key={index}
                        icon={item.icon}
                        step={item.step}
                        title={item.title}
                        content={item.content}
                        isFirst={index === 0}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="spacer"></div>
      </div>
    </section>
  )
}

