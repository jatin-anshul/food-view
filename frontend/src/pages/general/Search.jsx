import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/reels.css'
import axios from 'axios'
import BottomNav from '../../components/BottomNav'
import SideNav from '../../components/SideNav'

/* ── Icons ── */
const SearchIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none"
    stroke={active ? '#fff' : 'rgba(255,255,255,0.45)'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)" width="36" height="36">
    <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.45)" />
    <polygon points="10,8 18,12 10,16" fill="white" />
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"
    strokeLinecap="round" width="22" height="22">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

/* ── Video modal ── */
const VideoModal = ({ item, onClose }) => {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { v.pause(); window.removeEventListener('keydown', onKey) }
  }, [onClose])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play().then(() => setPlaying(true)).catch(() => {}) }
    else { v.pause(); setPlaying(false) }
  }

  const src = item.video ?? item.videoUrl ?? ''
  const description = item.description ?? item.name ?? ''
  const partnerName = item.foodPartner?.name ?? ''
  const partnerId = item.foodPartner?._id ?? item.foodPartner ?? item._id

  return (
    <div className="saved-modal-backdrop" onClick={onClose}>
      <div className="saved-modal" onClick={e => e.stopPropagation()}>
        <button className="saved-modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>
        <video ref={videoRef} className="saved-modal-video" src={src}
          playsInline loop onClick={togglePlay} />
        {!playing && (
          <div className="saved-modal-play-icon" onClick={togglePlay}>
            <PlayIcon />
          </div>
        )}
        <div className="saved-modal-info">
          {partnerName && <span className="search-partner-name">{partnerName}</span>}
          <p className="saved-modal-desc">{description}</p>
          <Link className="reel-visit-btn" to={`/food-partner/${partnerId}`} onClick={onClose}>
            visit store
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ── Search Page ── */
const Search = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [activeItem, setActiveItem] = useState(null)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const doSearch = (q) => {
    if (!q.trim()) { setResults([]); setStatus('idle'); return }
    setStatus('loading')
    axios.get(`http://localhost:3000/api/food/search?q=${encodeURIComponent(q.trim())}`, { withCredentials: true })
      .then(res => { setResults(res.data?.foodItems ?? []); setStatus('done') })
      .catch(() => { setResults([]); setStatus('error') })
  }

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(val), 400)
  }

  const handleClear = () => {
    setQuery(''); setResults([]); setStatus('idle')
    inputRef.current?.focus()
  }

  return (
    <div className="app-shell">
      <SideNav />
      <div className="search-page">

        {/* search bar */}
        <div className="search-bar-wrap">
          <div className="search-bar">
            <SearchIcon active={false} />
            <input
              ref={inputRef}
              className="search-input"
              type="text"
              placeholder="Search food, dishes…"
              value={query}
              onChange={handleChange}
              aria-label="Search food"
            />
            {query && (
              <button className="search-clear-btn" onClick={handleClear} aria-label="Clear">
                <CloseIcon />
              </button>
            )}
          </div>
        </div>

        {status === 'idle' && (
          <div className="search-hint">
            <SearchIcon active={false} />
            <p>Search for your favourite dishes or food items</p>
          </div>
        )}
        {status === 'loading' && <div className="search-hint"><p>Searching…</p></div>}
        {status === 'error' && <div className="search-hint"><p>Something went wrong. Try again.</p></div>}
        {status === 'done' && results.length === 0 && (
          <div className="search-hint">
            <p>No results for "<strong>{query}</strong>"</p>
          </div>
        )}

        {status === 'done' && results.length > 0 && (
          <>
            <p className="search-results-count">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            <div className="saved-grid search-page-grid">
              {results.map((item, idx) => {
                const id = item._id ?? idx
                const src = item.video ?? item.videoUrl ?? ''
                const description = item.description ?? item.name ?? ''
                const partnerName = item.foodPartner?.name ?? ''
                if (!src) return null
                return (
                  <div className="saved-card" key={id}
                    onClick={() => setActiveItem(item)}
                    role="button" tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setActiveItem(item)}
                    aria-label={`Play ${description}`}>
                    <video src={src} muted playsInline preload="metadata" />
                    <div className="saved-card-play"><PlayIcon /></div>
                    <div className="saved-card-overlay">
                      {partnerName && <span className="search-card-partner">{partnerName}</span>}
                      <p>{description}</p>
                      <Link
                        to={`/food-partner/${item.foodPartner?._id ?? item.foodPartner ?? id}`}
                        onClick={e => e.stopPropagation()}>
                        visit store
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <BottomNav />

      {activeItem && (
        <VideoModal item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </div>
  )
}

export default Search
