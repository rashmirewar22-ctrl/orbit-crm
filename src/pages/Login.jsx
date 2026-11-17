import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import Icon from '../components/Icon'
import './auth.css'

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }))
  }

  function validate() {
    const next = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function submit(e) {
    e.preventDefault()
    if (!validate()) return
    setBusy(true)
    window.setTimeout(() => {
      const res = login(form)
      if (res.ok) {
        toast.success('Welcome back')
        navigate('/app')
      } else {
        setBusy(false)
        setErrors({ password: res.error })
      }
    }, 450)
  }

  function useDemo() {
    setForm({ email: 'demo@orbit.io', password: 'orbit123' })
    setErrors({})
  }

  return (
    <div className="auth">
      <aside className="auth-aside">
        <div className="auth-aside-top">
          <Link to="/"><Logo /></Link>
        </div>
        <div className="auth-aside-mid">
          <h2>Close more, chase less.</h2>
          <p>Your pipeline, contacts and follow-ups — finally in one calm place.</p>
          <ul className="auth-points">
            <li><Icon name="check" size={16} /> Drag-and-drop deal pipeline</li>
            <li><Icon name="check" size={16} /> Instant search across everything</li>
            <li><Icon name="check" size={16} /> Light & dark, tuned to the pixel</li>
          </ul>
        </div>
        <div className="auth-aside-bottom">“The first CRM my team keeps open all day.”</div>
      </aside>

      <main className="auth-main">
        <div className="auth-topbar">
          <Link to="/" className="auth-back">← Back to site</Link>
          <ThemeToggle />
        </div>

        <form className="auth-form" onSubmit={submit} noValidate>
          <h1>Welcome back</h1>
          <p className="auth-lead">Log in to your Orbit workspace.</p>

          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              autoComplete="email"
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <div className="input-affix">
              <input
                id="password"
                className="input"
                type={show ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" className="affix-btn" onClick={() => setShow((s) => !s)}>
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? <span className="dots">Signing in</span> : 'Log in'}
          </button>

          <button type="button" className="demo-link" onClick={useDemo}>
            Use demo credentials
          </button>

          <p className="auth-switch">
            New to Orbit? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </main>
    </div>
  )
}
