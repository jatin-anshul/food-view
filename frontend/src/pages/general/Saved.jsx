import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/reels.css'
import axios from 'axios'
import BottomNav from '../../components/BottomNav'

/* ── Icons ── */
const SavedEmptyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="56" height="56">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)" width="40" height="40">
    <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.45)" />
    <polygon points="10,8 18,12 10,16" fill="white" />
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"
    strokeLinecap="round" width="26" height="26">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

/* ── Fullscreen modal player ── */
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

  const src = item.video ?? item.videoUrl ?? item.mediaUrl ?? ''
  const description = item.description ?? item.desc ?? item.name ?? ''

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
          <p className="saved-modal-desc">{description}</p>
          <Link className="reel-visit-btn"
            to={`/food-partner/${item.foodPartner ?? item._id}`}
            onClick={onClose}>
            visit store
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ── Saved page ── */
const Saved = () => {
  const [savedItems, setSavedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeItem, setActiveItem] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:3000/api/food/saved', { withCredentials: true })
      .then(res => {
        const items = res.data?.savedItems ?? res.data ?? []
        setSavedItems(Array.isArray(items) ? items : [])
      })
      .catch(() => setSavedItems([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="app-shell">
      <div className="saved-page">
        <h1>Saved</h1>

        {loading && <div className="saved-empty"><p>Loading...</p></div>}

        {!loading && savedItems.length === 0 && (
          <div className="saved-empty">
            <SavedEmptyIcon />
            <p>Nothing saved yet.<br />Tap the bookmark on any reel to save it.</p>
          </div>
        )}

        {!loading && savedItems.length > 0 && (
          <div className="saved-grid">
            {savedItems.map((item, idx) => {
              const id = item._id ?? item.id ?? idx
              const src = item.video ?? item.videoUrl ?? item.mediaUrl ?? ''
              const description = item.description ?? item.desc ?? item.name ?? ''
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
                    <p>{description}</p>
                    <Link to={`/food-partner/${item.foodPartner ?? id}`}
                      onClick={e => e.stopPropagation()}>
                      visit store
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav />

      {activeItem && (
        <VideoModal item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </div>
  )
}

export default Saved
