import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <a className="logo" href="/">Backend Reader</a>

        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`hamburger ${open ? 'open' : ''}`} />
        </button>

        <ul className={`nav-links ${open ? 'open' : ''}`}>
          <li><a href="/" onClick={() => setOpen(false)}>Explore</a></li>
          <li><a href="api/items" onClick={() => setOpen(false)}>API</a></li>
          <li><a href="/" onClick={() => setOpen(false)}>Contact</a></li>
        </ul>
      </div>
    </nav>
  )
}
