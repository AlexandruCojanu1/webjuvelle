import AnimateOnScroll from '@/components/client/AnimateOnScroll'
import DarkVeil from '@/components/client/DarkVeil'
import Image from 'next/image'

// Server Component - Content is rendered on server for SEO
export default function Banner() {
  return (
    <section className="section-banner">
      <div className="banner-video-container keep-dark relative overflow-hidden">
        <div className="banner-background-wrapper">
          <DarkVeil />
        </div>
        <div className="hero-container position-relative">
          <div className="d-flex flex-column gspace-2">
            <AnimateOnScroll animation="fadeInLeft" speed="normal">
              <h1 className="title-heading-banner">
                Generate a Website with AI in seconds
              </h1>
            </AnimateOnScroll>
            <div className="banner-heading">
              <AnimateOnScroll animation="fadeInUp" speed="normal">
                <div className="banner-video-content order-lg-1 order-2">
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll animation="fadeInRight" speed="normal">
                <div className="banner-content order-lg-2 order-1">
                  <p>
                    Answer a few questions and launch your online business. Our AI assistant handles the design, content, and structure.
                  </p>
                  <div className="d-flex flex-md-row flex-column justify-content-center justify-content-lg-start align-self-center align-self-lg-start gspace-3">
                    <a
                      href="/create"
                      className="btn btn-accent"
                    >
                      <div className="btn-title">
                        <span>Get Started</span>
                      </div>
                      <div className="icon-circle">
                        <Image
                          src="/assets/images/cursor.webp"
                          alt="Click icon"
                          width={20}
                          height={20}
                          className="cursor-icon"
                          priority
                        />
                      </div>
                    </a>
                    <div className="banner-reviewer">
                      <div className="d-flex flex-row align-items-center">
                      </div>
                      <div className="detail">
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

