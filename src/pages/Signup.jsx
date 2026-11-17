import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import Icon from '../components/Icon'
import './auth.css'

function strength(pw) {
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(score, 4)
}

const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong']

export default function Signup() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', agree: false })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }))
  }

  function validate() {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Please tell us your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.password.length < 6) next.password = 'Use at least 6 characters.'
    if (!form.agree) next.agree = 'Please accept the terms to continue.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function submit(e) {
    e.preventDefault()
    if (!validate()) return
    setBusy(true)
    window.setTimeout(() => {
      const res = register(form)
      if (res.ok) {
        toast.success('Workspace created')
        navigate('/app')
      } else {
        setBusy(false)
        setErrors({ email: res.error })
      }
    }, 500)
  }

  const s = strength(form.password)

  return (
    <div className="auth">
      <aside className="auth-aside">
        <div className="auth-aside-top">
          <Link to="/"><Logo /></Link>
        </div>
        <div className="auth-aside-mid">
          <h2>Start in minutes.</h2>
          <p>Spin up a workspace, import your first contacts, and watch your pipeline take shape.</p>
          <ul className="auth-points">
            <li><Icon name="check" size={16} /> Free forever for solo founders</li>
            <li><Icon name="check" size={16} /> No credit card required</li>
            <li><Icon name="check" size={16} /> Your data stays on your device</li>
          </ul>
        </div>
        <div className="auth-aside-bottom">Join 42,000+ deals already tracked in Orbit.</div>
      </aside>

      <main className="auth-main">
        <div className="auth-topbar">
          <Link to="/" className="auth-back">← Back to site</Link>
          <ThemeToggle />
        </div>

        <form className="auth-form" onSubmit={submit} noValidate>
          <h1>Create your workspace</h1>
          <p className="auth-lead">Free forever. No card needed.</p>

          <div className="field">
            <label className="label" htmlFor="name">Full name</label>
            <input
              id="name"
              className="input"
              placeholder="Ava Thompson"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              autoComplete="name"
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="field">
            <label className="label" htmlFor="email">Work email</label>
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
            <input
              id="password"
              className="input"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              autoComplete="new-password"
            />
            {form.password && (
              <div className="meter">
                <div className="meter-track">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className={i < s ? `on s${s}` : ''} />
                  ))}
                </div>
                <span className="meter-label">{labels[s]}</span>
              </div>
            )}
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <label className="check">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => set('agree', e.target.checked)}
            />
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </label>
          {errors.agree && <div className="field-error">{errors.agree}</div>}

          <button className="btn btn-primary btn-block" type="submit" disabled={busy} style={{ marginTop: 18 }}>
            {busy ? <span className="dots">Creating workspace</span> : 'Create workspace'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </main>
    </div>
  )
}
