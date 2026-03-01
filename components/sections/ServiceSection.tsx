'use client'

import AnimateOnScroll from '../client/AnimateOnScroll'
import ServiceCard from '../ui/ServiceCard'
import { services } from '../data/ServiceData'

export default function ServiceSection() {
  return (
    <section className="section">
      <div className="hero-container">
        <div className="d-flex flex-column justify-content-center text-center gspace-5">
          <div className="d-flex flex-column justify-content-center text-center gspace-2">
            <AnimateOnScroll animation="fadeInDown" speed="normal">
              <div className="sub-heading align-self-center">
                <i className="fa-regular fa-circle-dot"></i>
                <span>What you can generate</span>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fadeInDown" speed="normal">
              <h2 className="title-heading heading-container heading-container-medium">
                Types of websites our assistant can create for you
              </h2>
            </AnimateOnScroll>
          </div>
          <div className="card-service-wrapper">
            <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 grid-spacer-2">
              {services.map((item) => (
                <div className="col" key={item.id}>
                  <ServiceCard
                    icon={item.icon}
                    title={item.title}
                    content={item.content}
                    speed={item.speed as 'fast' | 'normal' | 'slow'}
                    link={item.link}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="service-link-footer">
            <p>
              Whatever idea you have, Webjuvelle can make it a reality.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

