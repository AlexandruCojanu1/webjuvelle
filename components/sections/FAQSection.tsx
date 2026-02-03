'use client'

import AnimateOnScroll from '../client/AnimateOnScroll'
import { FAQSchema } from '../seo/StructuredData'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: 'Ce servicii oferiți pentru marketing digital?',
    answer: 'Oferim servicii complete de marketing digital: strategie de brand, performance marketing, social media marketing, SEO, web design personalizat, content creation (foto & video), și automatizări digitale. Fiecare proiect este construit custom, fără template-uri, pentru performanță maximă.',
  },
  {
    question: 'Cât costă un website personalizat?',
    answer: 'Prețurile pentru website-uri personalizate încep de la 800 EUR. Fiecare proiect este evaluat individual în funcție de complexitate, funcționalități necesare și scopul afacerii. Nu vindem template-uri - construim soluții custom optimizate pentru performanță și conversie.',
  },
  {
    question: 'Cât timp durează să apară rezultatele SEO?',
    answer: 'Rezultatele SEO sunt progresive. În primele 3-6 luni veți observa îmbunătățiri în indexare și poziționare. Rezultate semnificative (top 3 pentru cuvinte cheie principale) apar de obicei în 6-12 luni, în funcție de competitivitatea nișei și calitatea conținutului.',
  },
  {
    question: 'Lucrați doar cu companii din Brașov?',
    answer: 'Nu. Deși suntem bazați în Brașov și înțelegem perfect piața locală, lucrăm cu clienți din toată România. Oferim consultanță online și meeting-uri virtuale pentru a ne adapta la nevoile fiecărui partener.',
  },
  {
    question: 'Ce face diferența între voi și alte agenții?',
    answer: 'Nu vindem servicii - alegem parteneri. Construim soluții custom (fără template-uri), oferim suport foto & video inclus, automatizări reale (indexare Google, booking, plăți online), și un parteneriat pe termen lung. Fiecare proiect primește 100% din atenția noastră.',
  },
  {
    question: 'Cum funcționează procesul de colaborare?',
    answer: 'Începem cu o discuție despre nevoile tale și obiectivele afacerii. Apoi propunem o strategie personalizată, clară și transparentă. După aprobare, construim soluția pas cu pas, cu feedback constant. Nu lucrăm cu oricine - căutăm parteneri care înțeleg că un website este o investiție, nu o cheltuială.',
  },
  {
    question: 'Oferiți suport după lansarea proiectului?',
    answer: 'Da. Oferim suport continuu pentru toate proiectele. Acest lucru include actualizări de conținut, optimizări SEO, mentenanță tehnică, și consultanță strategică. Suntem parteneri pe termen lung, nu doar furnizori de servicii.',
  },
  {
    question: 'Ce înseamnă "boutique agency"?',
    answer: 'Suntem selectivi cu clienții noștri. Nu acceptăm orice proiect - lucrăm doar cu antreprenori care înțeleg valoarea unui parteneriat strategic. Acest lucru ne permite să oferim atenție 100% fiecărui proiect și să construim soluții de calitate superioară, nu producție în masă.',
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
                    <span>Întrebări frecvente</span>
                  </div>
                  <h2 className="title-heading">Răspunsuri la întrebările tale</h2>
                </div>
              </AnimateOnScroll>
            </div>
            <div className="col col-lg-4 ps-0 pe-0">
              <AnimateOnScroll animation="fadeInRight" speed="normal">
                <div className="d-flex flex-column gspace-2 justify-content-end h-100">
                  <p>
                    Dacă nu găsești răspunsul căutat, contactează-ne direct. Răspundem în maxim 24h.
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

