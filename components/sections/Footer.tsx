'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/create') || pathname?.startsWith('/dashboard')) return null

  return (
    <footer className="section-footer">
      <div className="bg-footer-wrapper">
        <div className="bg-footer">
          <div className="hero-container position-relative z-2">
            <div className="d-flex flex-column gspace-2">
              <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 grid-spacer-5">
                <div className="col col-lg-5">
                  <div className="footer-logo-container">
                    <div className="logo-container-footer">
                      <Image
                        src="/assets/images/logo1.webp"
                        alt="ADSNOW Logo"
                        width={150}
                        height={50}
                        className="site-logo img-fluid"
                        loading="lazy"
                        quality={90}
                      />
                    </div>
                    <h4>Your Online Identity Advisor</h4>
                    <p>
                      We don't sell services. We choose partners. Digital experiences that remain simple for you, transparent for partners, and relevant to the public.
                    </p>
                  </div>
                </div>

                <div className="col col-lg-3">
                </div>

                <div className="col col-lg-4">
                  <div className="footer-contact-container">
                    <h5>Contact Information</h5>
                    <ul className="contact-list">
                      <li>
                        <a href="mailto:algodigitalsolutions@gmail.com">
                          algodigitalsolutions@gmail.com
                        </a>
                      </li>
                      <li>
                        <a href="tel:+40771587498">0771587498</a>
                      </li>
                      <li>Brașov, Strada Octavian Goga 7</li>
                    </ul>
                    <div className="d-flex flex-column gspace-1">
                      <h5>Social Media</h5>
                      <div className="social-container">
                        <div className="social-item-wrapper">
                          <a
                            href="https://www.facebook.com/adsnow.ro"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-item"
                            aria-label="Facebook"
                          >
                            <i className="fa-brands fa-facebook"></i>
                          </a>
                        </div>
                        <div className="social-item-wrapper">
                          <a
                            href="https://www.tiktok.com/@adsnow.ro?_r=1&_t=ZN-92KN3Zaggdj"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-item"
                            aria-label="TikTok"
                          >
                            <i className="fa-brands fa-tiktok"></i>
                          </a>
                        </div>
                        <div className="social-item-wrapper">
                          <a
                            href="https://www.instagram.com/adsnow.ro/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-item"
                            aria-label="Instagram"
                          >
                            <i className="fa-brands fa-instagram"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="footer-content-spacer"></div>
            </div>

            <div className="copyright-container">
              <span className="copyright">© 2025 Algo Digital Solutions SRL. All Rights Reserved.</span>
              <div className="d-flex flex-row gspace-2">
                <a
                  href="https://consumer-redress.ec.europa.eu/site-relocation_en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                <a
                  href="https://anpc.ro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="legal-link"
                >
                  ANPC
                </a>
              </div>
            </div>

            <div className="footer-spacer"></div>
          </div>
        </div>
      </div>
    </footer >
  )
}

