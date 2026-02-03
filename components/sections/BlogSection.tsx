import AnimateOnScroll from '../client/AnimateOnScroll'
import Link from 'next/link'
import Image from 'next/image'
import { getLatestPosts } from '@/lib/blog'
import BlogCard from '@/components/ui/BlogCard'

// Server Component - fetches data at build time
export default function BlogSection() {
  const latestPosts = getLatestPosts(3)

  return (
    <section className="section">
      <div className="hero-container">
        <div className="d-flex flex-column gspace-5">
          <div className="row row-cols-lg-2 row-cols-1 grid-spacer-5 m-0">
            <div className="col col-lg-8 ps-0 pe-0">
              <AnimateOnScroll animation="fadeInLeft" speed="fast">
                <div className="d-flex flex-column gspace-2">
                  <div className="sub-heading">
                    <i className="fa-regular fa-circle-dot"></i>
                    <span>Perspectiva noastră</span>
                  </div>
                  <h2 className="title-heading">Marketing 101</h2>
                </div>
              </AnimateOnScroll>
            </div>
            <div className="col col-lg-4 ps-0 pe-0">
              <AnimateOnScroll animation="fadeInRight" speed="normal">
                <div className="d-flex flex-column gspace-2 justify-content-end h-100">
                  <p>
                    Nu reinventăm roata ci doar alegem traiectoria.
                  </p>
                  <div className="link-wrapper">
                    <Link href="/blog">Vezi Toate Articolele</Link>
                    <Image 
                      src="/assets/images/cursor.webp" 
                      alt="arrow" 
                      width={16}
                      height={16}
                      className="cursor-icon"
                      loading="lazy"
                    />
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>

          <div className="row row-cols-md-2 row-cols-1 grid-spacer-3">
            {latestPosts.length === 0 ? (
              <p className="text-center w-100">Articolele de blog vor fi adăugate în curând...</p>
            ) : (
              latestPosts.map((post) => (
                <div key={post.id} className="col">
                  <BlogCard post={post} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

