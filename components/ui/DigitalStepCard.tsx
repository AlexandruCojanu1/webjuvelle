'use client'

import AnimateOnScroll from '../client/AnimateOnScroll'

interface DigitalStepCardProps {
  icon: string
  step: string
  title: string
  content: string
  isFirst: boolean
}

export default function DigitalStepCard({ icon, step, title, content, isFirst }: DigitalStepCardProps) {
  return (
    <AnimateOnScroll animation="fadeInUp" speed="normal">
      <div className="digital-process-card">
        {!isFirst && <div className="step-spacer"></div>}
        <div className="digital-process-step">
          <div className="d-flex justify-content-between">
            <div>
              <img src={icon} alt={`${title} Icon`} className="process-icon" />
            </div>
            <span>{step}</span>
          </div>
          <div className="d-flex flex-column gspace-2">
            <h5>{title}</h5>
            <p>{content}</p>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  )
}

