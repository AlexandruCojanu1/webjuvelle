'use client'

import AnimateOnScroll from '../client/AnimateOnScroll'
import DigitalStepCard from '../ui/DigitalStepCard'
import { digitalSteps } from '../data/DigitalProcessData'

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
                        <span>Urmatorii pasi</span>
                      </div>
                      <h2 className="title-heading">Simplu si transparent</h2>
                    </div>
                  </AnimateOnScroll>
                </div>
                <div className="col">
                </div>
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

