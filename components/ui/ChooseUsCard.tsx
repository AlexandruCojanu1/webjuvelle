'use client'

import AnimateOnScroll from '../client/AnimateOnScroll'
import Image from 'next/image'

interface ChooseUsCardProps {
  icon: string
  title: string
  content: string
  link: string
  speed?: 'fast' | 'normal' | 'slow'
}

export default function ChooseUsCard({ icon, title, content, link, speed = 'normal' }: ChooseUsCardProps) {
  return (
    <AnimateOnScroll animation="fadeInRight" speed={speed}>
      <div className="card card-chooseus">
        <div className="chooseus-icon-wrapper">
          <div className="chooseus-spacer above"></div>
          <div className="chooseus-icon-layout">
            <div className="chooseus-icon">
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
          <div className="chooseus-spacer below"></div>
        </div>
        <div className="chooseus-content">
          <h4 className="chooseus-title">{title}</h4>
          <p>{content}</p>
        </div>
      </div>
    </AnimateOnScroll>
  )
}

