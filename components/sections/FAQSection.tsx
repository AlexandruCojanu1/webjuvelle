'use client'

import AnimateOnScroll from '../client/AnimateOnScroll'
import { FAQSchema } from '../seo/StructuredData'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: 'Do I need programming skills to use Webjuvelle?',
    answer: 'Absolutely not. Our platform converts your ideas and preferences into fully functional websites through a fluid conversation with our AI assistant.',
  },
  {
    question: 'Can I connect my own custom domain?',
    answer: 'Yes! You can easily connect any custom domain (e.g. www.my-business.com) right from the Dashboard, available on our higher tier plans.',
  },
  {
    question: 'What kind of websites can I generate?',
    answer: 'Webjuvelle is optimized to generate Landing Pages, Presentation Websites, Portfolios, Blogs, and even E-commerce Platforms. The AI adapts the structure based on the needs you communicate.',
  },
  {
    question: 'Who owns the generated website?',
    answer: 'You do! You have 100% control over the generated content. If you are on the Pro plan, you can even export the entire source code (Next.js + Tailwind CSS) to host it wherever you want.',
  },
  {
    question: 'Can I make changes after the website is created?',
    answer: 'Of course. From the Webjuvelle Dashboard, you can regenerate specific sections, adjust the color palette, or add new pages with just a few clicks.',
  },
]

export default function FAQSection() {
  return (
    <>
      <FAQSchema faqs={faqData} />
      <section className="section">
        <div className="hero-container">
          <div className="d-flex flex-column gspace-5">
            <div className="row row-cols-lg-2 row-cols-1 grid-spacer-5 m-0">
              <div className="col col-lg-8 ps-0 pe-0">
                <AnimateOnScroll animation="fadeInLeft" speed="fast">
                  <div className="d-flex flex-column gspace-2">
                    <div className="sub-heading">
                      <i className="fa-regular fa-circle-dot"></i>
                      <span>FAQ</span>
                    </div>
                    <h2 className="title-heading">Answers to your questions</h2>
                  </div>
                </AnimateOnScroll>
              </div>
              <div className="col col-lg-4 ps-0 pe-0">
                <AnimateOnScroll animation="fadeInRight" speed="normal">
                  <div className="d-flex flex-column gspace-2 justify-content-end h-100">
                    <p>
                      If you can't find the answer you're looking for, contact us directly. We reply within 24 hours.
                    </p>
                  </div>
                </AnimateOnScroll>
              </div>
            </div>

            <AnimateOnScroll animation="fadeInUp" speed="normal">
              <div className="faq-wrapper">
                <div className="accordion" id="faqAccordion">
                  {faqData.map((faq, index) => (
                    <div key={index} className="accordion-item">
                      <h3 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#faq-${index}`}
                          aria-expanded="false"
                          aria-controls={`faq-${index}`}
                        >
                          {faq.question}
                        </button>
                      </h3>
                      <div
                        id={`faq-${index}`}
                        className="accordion-collapse collapse"
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">
                          <div className="accordion-content">
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </>
  )
}

