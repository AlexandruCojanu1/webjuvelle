'use client'

import AnimateOnScroll from '../client/AnimateOnScroll'
import Image from 'next/image'

interface ServiceCardProps {
  icon: string
  title: string
  content: string
  link: string
  speed?: 'fast' | 'normal' | 'slow'
}

export default function ServiceCard({ icon, title, content, link, speed = 'normal' }: ServiceCardProps) {
  return (
    <AnimateOnScroll animation="fadeInLeft" speed={speed}>
      <div className="card card-service">
        <div className="d-flex flex-row gspace-2 gspace-md-3 align-items-center">
          <div>
            <div className="service-icon-wrapper">
              <div className="service-icon">
                <Image 
                  src={icon} 
                  alt={`${title} Icon`} 
                  width={64}
                  height={64}
                  className="img-fluid"
                  loading="lazy"
                  quality={85}
                />
              </div>
            </div>
          </div>
          <div className="service-title">
            <h4>{title}</h4>
          </div>
        </div>
        <p>{content}</p>
      </div>
    </AnimateOnScroll>
  )
}

