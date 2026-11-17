import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import Icon from '../components/Icon'
import { useInView } from '../hooks/useInView'
import './landing.css'

const wordmarks = ['Lumen', 'Northwind', 'Vertex', 'BrightFin', 'Cobalt', 'Harbor', 'Pinecone', 'Stellar']

const metrics = [
  { n: 42000, suffix: '+', label: 'Deals tracked', mono: 'DEALS' },
  { n: 3.1, suffix: 'x', label: 'Faster follow-ups', mono: 'SPEED', decimals: 1 },
  { n: 98, suffix: '%', label: 'Teams who stay', mono: 'RETENTION' },
  { n: 12, suffix: 'm', label: 'Median setup time', mono: 'SETUP' }
]

const steps = [
  { k: '01', title: 'Import in one paste', text: 'Drop a CSV or paste a list. Orbit maps columns and dedupes on the fly — no onboarding call.' },
  { k: '02', title: 'Work the pipeline', text: 'Drag deals across stages, log a call in a keystroke, and let every touch update the timeline.' },
  { k: '03', title: 'See what will close', text: 'Weighted pipeline, win-rate and activity recompute the second your team moves a card.' }
]

const bento = [
  { span: 'wide', icon: 'pipeline', title: 'A pipeline you can feel', text: 'Five stages, drag-and-drop, weighted forecasting. The board is the source of truth — not a spreadsheet someone forgot to update.' },
  { span: '', icon: 'bolt', title: 'Keyboard-first', text: 'Press / anywhere to jump. Muscle memory, not menus.' },
  { span: '', icon: 'shield', title: 'Local by design', text: 'Everything lives in your browser. Nothing leaves the device.' },
  { span: '', icon: 'mail', title: 'Timeline per contact', text: 'Calls, notes and emails in one scrollable history.' },
  { span: 'wide', icon: 'chart', title: 'Numbers that update themselves', text: 'Open pipeline, won revenue and win-rate stay live. Stop building the same weekly report by hand.' }
]

const faqs = [
  { q: 'Is my data actually private?', a: 'Yes — Orbit is front-end only. Contacts, deals and your account all live in your browser via localStorage. No server, no sync, nothing leaves the device.' },
  { q: 'Do I need to install anything?', a: 'No. It runs in the browser. Open the app, create a workspace, and you are working in under a minute.' },
  { q: 'Can I bring my existing contacts?', a: 'The demo ships with sample data so you can explore instantly. In a real build this is where a CSV import or API sync would slot in.' },
  { q: 'What is this built with?', a: 'React, React Router and hand-written CSS — no UI kit. Routing, theming, drag-and-drop and state are all custom.' }
]

function useCountUp(target, decimals = 0, run) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf
    const start = performance.now()
    const dur = 1400
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, target])
  const display = value >= 1000 ? Math.round(value).toLocaleString() : value.toFixed(decimals)
  return display
}

function Metric({ n, suffix, label, mono, decimals, run }) {
  const val = useCountUp(n, decimals || 0, run)
  return (
    <div className="metric">
      <span className="metric-tag">{mono}</span>
      <div className="metric-n">{val}<em>{suffix}</em></div>
      <div className="metric-label">{label}</div>
    </div>
  )
}

function HeroPanel() {
  const [tab, setTab] = useState('pipeline')
  const tabs = [
    { k: 'pipeline', label: 'Pipeline' },
    { k: 'contacts', label: 'Contacts' },
    { k: 'insights', label: 'Insights' }
  ]
  return (
    <div className="panel-device">
      <div className="device-bar">
        <span className="device-dots"><i /><i /><i /></span>
        <span className="device-tabs">
          {tabs.map((t) => (
            <button key={t.k} className={tab === t.k ? 'on' : ''} onClick={() => setTab(t.k)}>{t.label}</button>
          ))}
        </span>
      </div>
      <div className="device-body">
        {tab === 'pipeline' && (
          <div className="d-pipe">
            {[
              { s: 'LEAD', items: [['Northwind', '$6,400'], ['BrightFin', '$3,200']] },
              { s: 'PROPOSAL', items: [['Vertex', '$12,800']], accent: true },
              { s: 'WON', items: [['Lumen Labs', '$18,400']], win: true }
            ].map((col) => (
              <div className="d-col" key={col.s}>
                <div className="d-col-h">{col.s}</div>
                {col.items.map(([n, v]) => (
                  <div className={`d-deal ${col.accent ? 'a' : ''} ${col.win ? 'w' : ''}`} key={n}>
                    <span>{n}</span><strong>{v}</strong>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {tab === 'contacts' && (
          <div className="d-list">
            {[
              ['Marcus Hale', 'Northwind', 'active'],
              ['Priya Nair', 'Vertex Retail', 'lead'],
              ['Diego Fuentes', 'Cobalt Studio', 'pending'],
              ['Hannah Weiss', 'BrightFin', 'active'],
              ['Omar Said', 'Harbor Health', 'lead']
            ].map(([n, c, s]) => (
              <div className="d-row" key={n}>
                <span className="d-av" style={{ background: avColor(n) }}>{n.split(' ').map((x) => x[0]).join('')}</span>
                <span className="d-name"><strong>{n}</strong><em>{c}</em></span>
                <span className={`d-badge ${s}`}>{s}</span>
              </div>
            ))}
          </div>
        )}
        {tab === 'insights' && (
          <div className="d-insights">
            <div className="d-kpis">
              <div className="d-kpi"><span>OPEN</span><strong>$61,200</strong></div>
              <div className="d-kpi"><span>WON</span><strong>$27,400</strong></div>
              <div className="d-kpi"><span>WIN RATE</span><strong>64%</strong></div>
            </div>
            <div className="d-bars">
              {[48, 70, 40, 88, 62, 95, 74].map((h, i) => (
                <span key={i} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function avColor(seed) {
  const c = ['#6366f1', '#06b6d4', '#f59e0b', '#ec4899', '#10b981']
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h + seed.charCodeAt(i)) % c.length
  return c[h]
}

export default function Landing() {
  const [open, setOpen] = useState(false)
  const [faq, setFaq] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [metricsRef, metricsIn] = useInView({ threshold: 0.4 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="ed">
      <div className="ticker">
        <div className="ticker-in">
          <span>v2.0 — pipeline automations are live</span>
          <span className="sep">/</span>
          <span>front-end only · your data never leaves the browser</span>
          <span className="sep">/</span>
          <span>free forever for solo founders</span>
          <span className="sep">/</span>
          <span>v2.0 — pipeline automations are live</span>
          <span className="sep">/</span>
          <span>front-end only · your data never leaves the browser</span>
        </div>
      </div>

      <header className={`edn ${scrolled ? 'stuck' : ''}`}>
        <div className="edn-in">
          <Link to="/" className="edn-brand"><Logo /></Link>
          <nav className={`edn-nav ${open ? 'open' : ''}`}>
            <a href="#product" onClick={() => setOpen(false)}>Product</a>
            <a href="#how" onClick={() => setOpen(false)}>How it works</a>
            <a href="#faq" onClick={() => setOpen(false)}>FAQ</a>
            <a href="#customers" onClick={() => setOpen(false)}>Customers</a>
          </nav>
          <div className="edn-act">
            <ThemeToggle />
            <Link to="/login" className="edn-login">Log in</Link>
            <Link to="/signup" className="btn-ed">Start free <span>→</span></Link>
            <button className="edn-burger" onClick={() => setOpen((v) => !v)} aria-label="Menu"><span /><span /></button>
          </div>
        </div>
      </header>

      <section className="hero-ed">
        <div className="hero-ed-grid">
          <div className="hero-ed-left">
            <div className="eyebrow"><span className="eyebrow-k">(01)</span> THE CUSTOMER OS</div>
            <h1>
              Close more.<br />
              Chase <span className="mark">less.</span>
            </h1>
            <p>
              Orbit is the calm CRM for teams that would rather sell than babysit a spreadsheet.
              Contacts, deals and follow-ups in one fast workspace — built to stay out of your way.
            </p>
            <div className="hero-ed-cta">
              <Link to="/signup" className="btn-ed lg">Start free <span>→</span></Link>
              <Link to="/login" className="btn-ed-ghost lg">Live demo</Link>
            </div>
            <div className="hero-ed-meta">
              <div><strong>No card.</strong> Free for solo founders.</div>
              <div><strong>No backend.</strong> Runs in your browser.</div>
            </div>
          </div>
          <div className="hero-ed-right">
            <HeroPanel />
            <div className="panel-note"><span className="blink" /> live demo · drag the real board inside</div>
          </div>
        </div>

        <div className="marquee">
          <div className="marquee-track">
            {[...wordmarks, ...wordmarks].map((w, i) => (
              <span key={i} className="mk">{w}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="metrics-ed" ref={metricsRef}>
        {metrics.map((m) => (
          <Metric key={m.mono} {...m} run={metricsIn} />
        ))}
      </section>

      <section id="how" className="how">
        <div className="sec-head">
          <span className="sec-k">(02) — WORKFLOW</span>
          <h2>From messy list to live pipeline in three moves.</h2>
        </div>
        <div className="steps">
          {steps.map((s) => (
            <div className="step" key={s.k}>
              <div className="step-k">{s.k}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="product" className="bento-sec">
        <div className="sec-head">
          <span className="sec-k">(03) — WHAT'S INSIDE</span>
          <h2>Everything a deal needs. Nothing it doesn't.</h2>
        </div>
        <div className="bento">
          {bento.map((b) => (
            <div key={b.title} className={`bento-cell ${b.span}`}>
              <div className="bento-ico"><Icon name={b.icon} size={20} /></div>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="customers" className="quote-ed">
        <span className="sec-k">(04) — THE RECEIPTS</span>
        <blockquote>
          “We moved our whole sales process to Orbit in an afternoon. It's the first CRM the team actually keeps open all day.”
        </blockquote>
        <div className="quote-ed-by">
          <span className="q-av">MH</span>
          <div>
            <strong>Marcus Hale</strong>
            <em>Head of Sales — Northwind</em>
          </div>
        </div>
      </section>

      <section id="faq" className="faq-ed">
        <div className="faq-ed-left">
          <span className="sec-k">(05) — FAQ</span>
          <h2>Questions, answered.</h2>
          <p>Can't find it? Everything here runs client-side, so poke around — you can't break anything that a refresh won't fix.</p>
        </div>
        <div className="faq-ed-list">
          {faqs.map((f, i) => (
            <div key={f.q} className={`faq-item ${faq === i ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => setFaq(faq === i ? -1 : i)}>
                <span>{f.q}</span>
                <span className="faq-pm">{faq === i ? '–' : '+'}</span>
              </button>
              <div className="faq-a"><p>{f.a}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-ed">
        <div className="cta-ed-in">
          <span className="sec-k">(06) — GET STARTED</span>
          <h2>Put your pipeline in orbit.</h2>
          <p>Create a workspace in minutes. Free forever for solo founders.</p>
          <Link to="/signup" className="btn-ed lg">Create your workspace <span>→</span></Link>
        </div>
      </section>

      <footer className="foot-ed">
        <div className="foot-ed-top">
          <div className="foot-ed-brand">
            <Logo />
            <p>The calm CRM for teams that close.</p>
            <div className="foot-status"><span className="blink" /> All systems in orbit</div>
          </div>
          <div className="foot-ed-cols">
            <div>
              <h4>PRODUCT</h4>
              <a href="#product">Features</a>
              <a href="#how">How it works</a>
              <Link to="/signup">Pricing</Link>
            </div>
            <div>
              <h4>COMPANY</h4>
              <a href="#customers">Customers</a>
              <a href="#faq">FAQ</a>
              <a href="#product">Changelog</a>
            </div>
            <div>
              <h4>ACCOUNT</h4>
              <Link to="/login">Log in</Link>
              <Link to="/signup">Sign up</Link>
              <Link to="/login">Demo</Link>
            </div>
          </div>
        </div>
        <div className="foot-ed-bottom">
          <span>© {new Date().getFullYear()} ORBIT CRM</span>
          <span className="mono-note">BUILT FRONT-END ONLY · REACT + CSS · NO BACKEND</span>
        </div>
      </footer>
    </div>
  )
}
