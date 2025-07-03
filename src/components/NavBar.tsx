import Link from 'next/link'
import { useRouter } from 'next/router'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/grant-finder', label: 'Grant Finder' },
  { href: '/projects', label: 'Shovel Ready Projects' },
  { href: '/data-portal', label: 'Data Portal' },
  { href: '/reports', label: 'Publications' },
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/crash-analytics', label: 'Crash Analytics' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
]

export default function NavBar() {
  const router = useRouter()

  return (
    <div className="nav-banner">
      <nav className="container">
        <ul className="nav-list">
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={`nav-link ${router.pathname === href ? 'active' : ''}`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}