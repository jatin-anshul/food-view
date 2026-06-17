import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../styles/reels.css'

const fallbackVideo = {
  _id: 'fallback',
  video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  description: 'Fallback sample video while your stored videos load.',
  likeCount: 0,
  savesCount: 0,
}

const ReelFeed = ({ items = [], onLike, onSave, emptyMessage }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const videoElements = Array.from(containerRef.current.querySelectorAll('video'))

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.75,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const videoEl = entry.target
        if (entry.isIntersecting) {
          videoEl.play().catch(() => {})
        } else {
          videoEl.pause()
        }
      })
    }, options)

    videoElements.forEach(video => observer.observe(video))

    return () => observer.disconnect()
  }, [items])

  const feedItems = items.length > 0 ? items : [fallbackVideo]

  return (
    <div className="reels-container" ref={containerRef}>
      {feedItems.map((item, idx) => {
        const id = item._id ?? item.id ?? idx
        const src = item.video ?? item.videoUrl ?? item.mediaUrl ?? ''
        const description = item.description ?? item.desc ?? item.name ?? ''
        const likeCount = item.likeCount ?? 0
        const savesCount = item.savesCount ?? 0

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

            <div className="reel-overlay">
              <div className="reel-description">{description}</div>
              <div className="reel-actions">
                {onLike && (
                  <button className="reel-button" type="button" onClick={() => onLike(item)}>
                    Like {likeCount > 0 ? `(${likeCount})` : ''}
                  </button>
                )}
                {onSave && (
                  <button className="reel-button" type="button" onClick={() => onSave(item)}>
                    Save {savesCount > 0 ? `(${savesCount})` : ''}
                  </button>
                )}
                <Link className="reel-button" to={`/food-partner/${id}`} aria-label="Visit store">
                  Visit Store
                </Link>
              </div>
            </div>
          </section>
        )
      })}

      {items.length === 0 && (
        <div className="reel-empty">{emptyMessage}</div>
      )}
    </div>
  )
}

export default ReelFeed
