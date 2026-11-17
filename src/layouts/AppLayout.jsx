import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Logo from '../components/Logo'
import Icon from '../components/Icon'
import ThemeToggle from '../components/ThemeToggle'
import Avatar from '../components/Avatar'
import '../pages/app.css'

const nav = [
  { to: '/app', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/app/contacts', label: 'Contacts', icon: 'users' },
  { to: '/app/deals', label: 'Pipeline', icon: 'pipeline' },
  { to: '/app/settings', label: 'Settings', icon: 'settings' }
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)

  function handleLogout() {
    logout()
    toast.info('Signed out')
    navigate('/')
  }

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-top">
          <Logo />
        </div>
        <nav className="side-nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="side-card">
          <strong>Free plan</strong>
          <p>You're on the demo workspace. Everything lives in your browser.</p>
          <div className="side-card-bar"><span /></div>
        </div>
      </aside>

      {open && <div className="scrim" onClick={() => setOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <button className="hamburger" onClick={() => setOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
          <div className="top-search">
            <Icon name="search" size={17} />
            <input placeholder="Search contacts, deals…" />
            <kbd>⌘K</kbd>
          </div>
          <div className="top-actions">
            <ThemeToggle />
            <div className="user-menu">
              <button className="user-btn" onClick={() => setMenu((m) => !m)}>
                <Avatar name={user?.name} size={34} />
                <span className="user-name">{user?.name?.split(' ')[0]}</span>
              </button>
              {menu && (
                <>
                  <div className="menu-scrim" onClick={() => setMenu(false)} />
                  <div className="dropdown">
                    <div className="dropdown-head">
                      <Avatar name={user?.name} size={38} />
                      <div>
                        <strong>{user?.name}</strong>
                        <span>{user?.email}</span>
                      </div>
                    </div>
                    <hr className="divider" />
                    <button className="dropdown-item" onClick={() => { setMenu(false); navigate('/app/settings') }}>
                      <Icon name="settings" size={17} /> Settings
                    </button>
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <Icon name="logout" size={17} /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
