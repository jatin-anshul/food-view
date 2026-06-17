import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/reels.css'
import axios from 'axios'
import BottomNav from '../../components/BottomNav'

/* ─────────────── SVG Icons ─────────────── */
const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? '#ff4d6d' : 'none'}
    stroke={filled ? '#ff4d6d' : '#fff'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const BookmarkIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? '#fff' : 'none'}
    stroke="#fff" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

const CommentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none"
    stroke="#fff" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" width="20" height="20">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

/* ─────────────── Comment Drawer ─────────────── */
const CommentDrawer = ({ foodId, foodPartnerId, currentUser, onClose, onCommentAdded }) => {
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    axios.get(`http://localhost:3000/api/food/${foodId}/comments`, { withCredentials: true })
      .then(res => setComments(res.data?.comments ?? []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false))

    const t = setTimeout(() => inputRef.current?.focus(), 300)
    return () => clearTimeout(t)
  }, [foodId])

  const handlePost = async () => {
    if (!text.trim() || posting) return
    setPosting(true)
    try {
      const res = await axios.post(
        'http://localhost:3000/api/food/comment',
        { foodId, text: text.trim() },
        { withCredentials: true }
      )
      const newComment = res.data?.comment
      if (newComment) {
        setComments(prev => [newComment, ...prev])
        onCommentAdded(foodId, res.data.commentCount)
      }
      setText('')
    } catch { /* no-op */ }
    finally { setPosting(false) }
  }

  const handleDelete = async (commentId) => {
    setDeletingId(commentId)
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/food/comment/${commentId}`,
        { withCredentials: true }
      )
      setComments(prev => prev.filter(c => c._id !== commentId))
      onCommentAdded(foodId, res.data.commentCount)
    } catch { /* no-op */ }
    finally { setDeletingId(null) }
  }

  const canDelete = (comment) => {
    if (!currentUser) return false
    if (currentUser.role === 'user' && comment.user?._id === currentUser._id) return true
    if (currentUser.role === 'foodPartner' && currentUser._id === foodPartnerId) return true
    return false
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePost() }
  }

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const initials = (name) =>
    name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'

  return (
    <div className="comment-backdrop" onClick={onClose}>
      <div className="comment-drawer" onClick={e => e.stopPropagation()}>
        <div className="comment-header">
          <h3>Comments {comments.length > 0 && `(${comments.length})`}</h3>
          <button className="comment-close-btn" onClick={onClose} aria-label="Close comments">
            <CloseIcon />
          </button>
        </div>

        <div className="comment-list">
          {loading && <p className="comment-loading">Loading comments…</p>}
          {!loading && comments.length === 0 && (
            <p className="comment-empty">No comments yet. Be the first!</p>
          )}
          {!loading && comments.map((c) => (
            <div className="comment-item" key={c._id}>
              <div className="comment-avatar">{initials(c.user?.fullName)}</div>
              <div className="comment-body">
                <span className="comment-username">{c.user?.fullName ?? 'User'}</span>
                <span className="comment-text">{c.text}</span>
                <span className="comment-time">{timeAgo(c.createdAt)}</span>
              </div>
              {canDelete(c) && (
                <button
                  className="comment-delete-btn"
                  onClick={() => handleDelete(c._id)}
                  disabled={deletingId === c._id}
                  aria-label="Delete comment"
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          ))}
        </div>

        {currentUser?.role === 'user' && (
          <div className="comment-input-row">
            <input
              ref={inputRef}
              className="comment-input"
              type="text"
              placeholder="Add a comment…"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKey}
              maxLength={500}
            />
            <button
              className="comment-send-btn"
              onClick={handlePost}
              disabled={!text.trim() || posting}
              aria-label="Post comment"
            >
              <SendIcon />
            </button>
          </div>
        )}

        {!currentUser && (
          <div className="comment-login-prompt">
            <Link to="/user/login">Login to comment</Link>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────── Home Page ─────────────── */
const Home = () => {
  const [videos, setVideos] = useState([])
  const [liked, setLiked] = useState({})
  const [saved, setSaved] = useState({})
  const [likeCounts, setLikeCounts] = useState({})
  const [saveCounts, setSaveCounts] = useState({})
  const [commentCounts, setCommentCounts] = useState({})
  const [openCommentVideo, setOpenCommentVideo] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    axios.get('http://localhost:3000/api/auth/me', { withCredentials: true })
      .then(res => setCurrentUser(res.data?.user ?? null))
      .catch(() => setCurrentUser(null))
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const videoEls = Array.from(containerRef.current.querySelectorAll('video'))
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.isIntersecting
          ? entry.target.play().catch(() => {})
          : entry.target.pause()
      })
    }, { threshold: 0.75 })
    videoEls.forEach(v => observer.observe(v))
    return () => observer.disconnect()
  }, [videos])

  useEffect(() => {
    const feedReq = axios.get('http://localhost:3000/api/food', { withCredentials: true })
    const interactionsReq = axios.get('http://localhost:3000/api/food/my-interactions', { withCredentials: true })
      .catch(() => ({ data: { likedFoodIds: [], savedFoodIds: [] } }))

    Promise.all([feedReq, interactionsReq])
      .then(([feedRes, interactionsRes]) => {
        const items = feedRes.data?.foodItems ?? feedRes.data ?? []
        const arr = Array.isArray(items) ? items : []
        setVideos(arr)

        const lc = {}, sc = {}, cc = {}
        arr.forEach(v => {
          const id = v._id ?? v.id
          lc[id] = v.likeCount ?? 0
          sc[id] = v.savesCount ?? 0
          cc[id] = v.commentCount ?? 0
        })
        setLikeCounts(lc)
        setSaveCounts(sc)
        setCommentCounts(cc)

        const likedIds = interactionsRes.data?.likedFoodIds ?? []
        const savedIds = interactionsRes.data?.savedFoodIds ?? []
        const likedMap = {}, savedMap = {}
        likedIds.forEach(id => { likedMap[id] = true })
        savedIds.forEach(id => { savedMap[id] = true })
        setLiked(likedMap)
        setSaved(savedMap)
      })
      .catch(() => setVideos([]))
  }, [])

  const handleLike = async (video) => {
    const id = video._id ?? video.id
    setLiked(prev => ({ ...prev, [id]: !prev[id] }))
    try {
      const res = await axios.post('http://localhost:3000/api/food/like', { foodId: id }, { withCredentials: true })
      if (res.data?.likeCount !== undefined)
        setLikeCounts(prev => ({ ...prev, [id]: res.data.likeCount }))
    } catch {
      setLiked(prev => ({ ...prev, [id]: !prev[id] }))
    }
  }

  const handleSave = async (video) => {
    const id = video._id ?? video.id
    setSaved(prev => ({ ...prev, [id]: !prev[id] }))
    try {
      const res = await axios.post('http://localhost:3000/api/food/save', { foodId: id }, { withCredentials: true })
      if (res.data?.savesCount !== undefined)
        setSaveCounts(prev => ({ ...prev, [id]: res.data.savesCount }))
    } catch {
      setSaved(prev => ({ ...prev, [id]: !prev[id] }))
    }
  }

  const handleCommentAdded = useCallback((foodId, newCount) => {
    if (newCount !== undefined)
      setCommentCounts(prev => ({ ...prev, [foodId]: newCount }))
  }, [])

  return (
    <div className="app-shell">
      <div className="reels-container" ref={containerRef}>
        {videos.length === 0 && (
          <div className="reel-empty">No food reels yet. Check back soon!</div>
        )}

        {videos.filter(Boolean).map((video, idx) => {
          const id = video._id ?? video.id ?? idx
          const src = video.video ?? video.src ?? video.videoUrl ?? video.mediaUrl ?? ''
          const description = video.description ?? video.desc ?? video.name ?? ''
          if (!src) return null

          return (
            <section className="reel-item" key={id}>
              <video
                className="reel-video"
                src={src}
                playsInline
                muted
                loop
                preload="metadata"
              />

              <div className="reel-sidebar">
                <button
                  className={`reel-action${liked[id] ? ' liked' : ''}`}
                  onClick={() => handleLike(video)}
                  aria-label="Like"
                  type="button"
                >
                  <HeartIcon filled={!!liked[id]} />
                  <span>likes : {likeCounts[id] ?? 0}</span>
                </button>

                <button
                  className={`reel-action${saved[id] ? ' saved' : ''}`}
                  onClick={() => handleSave(video)}
                  aria-label="Save"
                  type="button"
                >
                  <BookmarkIcon filled={!!saved[id]} />
                  <span>Save : {saveCounts[id] ?? 0}</span>
                </button>

                <button
                  className="reel-action"
                  onClick={() => setOpenCommentVideo(video)}
                  aria-label="Comment"
                  type="button"
                >
                  <CommentIcon />
                  <span>Comment:{commentCounts[id] ?? 0}</span>
                </button>
              </div>

              <div className="reel-overlay">
                <p className="reel-description">{description}</p>
                <Link
                  className="reel-visit-btn"
                  to={`/food-partner/${video.foodPartner ?? id}`}
                >
                  visit store
                </Link>
              </div>
            </section>
          )
        })}
      </div>

      <BottomNav />

      {openCommentVideo && (
        <CommentDrawer
          foodId={openCommentVideo._id ?? openCommentVideo.id}
          foodPartnerId={openCommentVideo.foodPartner?.toString()}
          currentUser={currentUser}
          onClose={() => setOpenCommentVideo(null)}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  )
}

export default Home
