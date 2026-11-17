import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import Avatar from '../components/Avatar'

export default function Settings() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const toast = useToast()
  const navigate = useNavigate()
  const [prefs, setPrefs] = useState({ emails: true, digest: false, compact: false })

  function toggle(key) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }))
    toast.info('Preference saved')
  }

  function resetData() {
    localStorage.removeItem('orbit.contacts')
    localStorage.removeItem('orbit.deals')
    toast.success('Demo data restored')
    window.setTimeout(() => window.location.reload(), 600)
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p>Manage your profile, appearance and workspace data.</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="panel card">
          <div className="panel-head"><h3>Profile</h3></div>
          <div className="profile-head" style={{ marginBottom: 0 }}>
            <Avatar name={user?.name} size={58} />
            <div>
              <h2 style={{ fontSize: 19 }}>{user?.name}</h2>
              <div className="sub">{user?.email}</div>
            </div>
          </div>
        </div>

        <div className="panel card">
          <div className="panel-head"><h3>Appearance</h3></div>
          <div className="setting-row">
            <div>
              <div className="s-title">Theme</div>
              <div className="s-desc">Choose how Orbit looks on this device.</div>
            </div>
            <div className="seg">
              <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}>Light</button>
              <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}>Dark</button>
            </div>
          </div>
          <div className="setting-row">
            <div>
              <div className="s-title">Compact rows</div>
              <div className="s-desc">Tighten spacing in tables and lists.</div>
            </div>
            <button className={`switch ${prefs.compact ? 'on' : ''}`} onClick={() => toggle('compact')} aria-label="Toggle compact" />
          </div>
        </div>

        <div className="panel card">
          <div className="panel-head"><h3>Notifications</h3></div>
          <div className="setting-row">
            <div>
              <div className="s-title">Deal email alerts</div>
              <div className="s-desc">Get notified when a deal changes stage.</div>
            </div>
            <button className={`switch ${prefs.emails ? 'on' : ''}`} onClick={() => toggle('emails')} aria-label="Toggle emails" />
          </div>
          <div className="setting-row">
            <div>
              <div className="s-title">Weekly digest</div>
              <div className="s-desc">A Monday summary of your pipeline.</div>
            </div>
            <button className={`switch ${prefs.digest ? 'on' : ''}`} onClick={() => toggle('digest')} aria-label="Toggle digest" />
          </div>
        </div>

        <div className="panel card">
          <div className="panel-head"><h3>Workspace</h3></div>
          <div className="setting-row">
            <div>
              <div className="s-title">Reset demo data</div>
              <div className="s-desc">Restore the sample contacts and deals.</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={resetData}>Reset</button>
          </div>
          <div className="setting-row">
            <div>
              <div className="s-title">Sign out</div>
              <div className="s-desc">End your session on this device.</div>
            </div>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>Sign out</button>
          </div>
        </div>
      </div>
    </div>
  )
}
