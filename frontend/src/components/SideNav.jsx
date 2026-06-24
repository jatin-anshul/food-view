import { Link, useLocation } from 'react-router-dom'
import '../styles/reels.css'

const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none"
    stroke={active ? '#fff' : 'rgba(255,255,255,0.45)'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <polyline points="9 21 9 12 15 12 15 21" />
  </svg>
)

const SearchIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none"
    stroke={active ? '#fff' : 'rgba(255,255,255,0.45)'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const SavedIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? '#fff' : 'none'}
    stroke={active ? '#fff' : 'rgba(255,255,255,0.45)'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

const SideNav = () => {
  const { pathname } = useLocation()
  return (
    <nav className="side-nav" aria-label="Main navigation">
      <div className="side-nav-logo">FoodView</div>
      <Link to="/" className={pathname === '/' ? 'active' : ''}>
        <HomeIcon active={pathname === '/'} />
        Home
      </Link>
      <Link to="/search" className={pathname === '/search' ? 'active' : ''}>
        <SearchIcon active={pathname === '/search'} />
        Search
      </Link>
      <Link to="/saved" className={pathname === '/saved' ? 'active' : ''}>
        <SavedIcon active={pathname === '/saved'} />
        Saved
      </Link>
    </nav>
  )
}

export default SideNav
