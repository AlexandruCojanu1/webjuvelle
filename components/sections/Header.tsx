'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  const isPlatformPage = pathname?.startsWith('/create') || pathname?.startsWith('/dashboard')

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname?.startsWith(path)) return true
    return false
  }

  // On platform pages: hide entirely
  if (isPlatformPage) return null

  return (
    <header className="navbar-wrapper">
      <nav className="navbar navbar-expand-lg">
        <div className="navbar-container">
          <div className="logo-container">
            <Link href="/" className="navbar-brand">
              <Image
                src="/assets/images/logo1.webp"
                alt="ADSNOW - Your Online Identity Advisor Logo"
                width={150}
                height={50}
                className="site-logo img-fluid"
                priority
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
          </div>

          <button
            className="navbar-toggler nav-btn"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link
                  href="/"
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/blog"
                  className={`nav-link ${isActive('/blog') ? 'active' : ''}`}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="navbar-action-container">
            <div className="navbar-action-button"></div>
          </div>
        </div>
      </nav>
    </header>
  )
}
