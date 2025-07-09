import Link from 'next/link'
import { useRouter } from 'next/router'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/grant-finder', label: 'Grant Finder' },
  { href: '/shovel-ready', label: 'Shovel-Ready' },
  { href: '/data-portal', label: 'Data Portal' },
  { href: '/crash-analytics', label: 'Crash Data' },
  { href: '/quiet-zones', label: 'Train Quiet Zones' },
  { href: '/reports', label: 'Reports & Documents' },
  { href: '/newsletter', label: 'Newsletter' }
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
