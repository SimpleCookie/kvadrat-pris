import { useState, useLayoutEffect, useEffect, useRef } from 'react'

interface Props {
  content: string
  ariaLabel?: string
}

const BUBBLE_MAX_W = 280
const GAP = 6
const MARGIN = 8

export const Tooltip = ({ content, ariaLabel }: Props) => {
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const isOpen = hovered || pinned

  // Compute fixed position from button rect so bubble is never clipped by
  // parent overflow:hidden containers.
  useLayoutEffect(() => {
    if (!isOpen || !btnRef.current) {
      setPos(null)
      return
    }
    const btn = btnRef.current.getBoundingClientRect()
    let top = btn.bottom + GAP
    let left = btn.left + btn.width / 2 - BUBBLE_MAX_W / 2

    // Clamp horizontally
    if (left + BUBBLE_MAX_W > window.innerWidth - MARGIN)
      left = window.innerWidth - MARGIN - BUBBLE_MAX_W
    if (left < MARGIN) left = MARGIN

    // Flip above button if bubble would overflow viewport bottom
    const bh = bubbleRef.current?.offsetHeight ?? 80
    if (top + bh > window.innerHeight - MARGIN)
      top = btn.top - bh - GAP

    setPos({ top, left })
  }, [isOpen])

  // Outside pointerdown / Escape → unpin
  useEffect(() => {
    if (!pinned) return
    const onPointerDown = (e: PointerEvent) => {
      if (btnRef.current?.contains(e.target as Node)) return
      if (!bubbleRef.current?.contains(e.target as Node)) setPinned(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPinned(false) }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [pinned])

  return (
    <span className="tooltip-wrap">
      <button
        ref={btnRef}
        type="button"
        className={`tooltip-btn${pinned ? ' tooltip-btn-pinned' : ''}`}
        aria-label={ariaLabel ?? 'Mer information'}
        aria-expanded={isOpen}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={() => setPinned(p => !p)}
      >
        ?
      </button>
      {isOpen && (
        <div
          ref={bubbleRef}
          role="tooltip"
          className="tooltip-bubble"
          style={
            pos
              ? { position: 'fixed', top: pos.top, left: pos.left }
              : { position: 'fixed', visibility: 'hidden', top: 0, left: 0 }
          }
        >
          {content}
        </div>
      )}
    </span>
  )
}
