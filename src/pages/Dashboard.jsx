import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCrm } from '../context/CrmContext'
import { useAuth } from '../context/AuthContext'
import { STAGES } from '../data/seed'
import { money, timeAgo } from '../utils/format'
import Icon from '../components/Icon'
import Avatar from '../components/Avatar'

const statusColors = {
  lead: 'var(--brand)',
  active: 'var(--success)',
  pending: 'var(--warning)',
  lost: 'var(--danger)'
}

export default function Dashboard() {
  const { contacts, deals } = useCrm()
  const { user } = useAuth()

  const stats = useMemo(() => {
    const open = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost')
    const won = deals.filter((d) => d.stage === 'won')
    const pipeline = open.reduce((sum, d) => sum + d.amount, 0)
    const revenue = won.reduce((sum, d) => sum + d.amount, 0)
    const closed = deals.filter((d) => d.stage === 'won' || d.stage === 'lost')
    const winRate = closed.length ? Math.round((won.length / closed.length) * 100) : 0
    return {
      pipeline,
      revenue,
      contacts: contacts.length,
      winRate,
      openCount: open.length
    }
  }, [deals, contacts])

  const byStage = useMemo(() => {
    const max = Math.max(1, ...STAGES.map((s) => deals.filter((d) => d.stage === s.key).reduce((a, d) => a + d.amount, 0)))
    return STAGES.map((s) => {
      const amount = deals.filter((d) => d.stage === s.key).reduce((a, d) => a + d.amount, 0)
      return { ...s, amount, pct: Math.round((amount / max) * 100) }
    })
  }, [deals])

  const byStatus = useMemo(() => {
    const groups = ['lead', 'active', 'pending', 'lost'].map((key) => ({
      key,
      count: contacts.filter((c) => c.status === key).length,
      color: statusColors[key]
    }))
    const total = groups.reduce((a, g) => a + g.count, 0) || 1
    let offset = 0
    const arcs = groups.map((g) => {
      const frac = g.count / total
      const arc = { ...g, offset, frac }
      offset += frac
      return arc
    })
    return { arcs, total }
  }, [contacts])

  const activity = useMemo(() => {
    return [...contacts]
      .sort((a, b) => b.lastTouch - a.lastTouch)
      .slice(0, 5)
      .map((c) => ({
        id: c.id,
        name: c.name,
        action: c.status === 'lost' ? 'marked as lost' : c.status === 'active' ? 'moved to active' : 'added to pipeline',
        at: c.lastTouch
      }))
  }, [contacts])

  const C = 2 * Math.PI * 54

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Good to see you, {user?.name?.split(' ')[0]}</h1>
          <p>Here's what's moving across your pipeline today.</p>
        </div>
        <div className="page-actions">
          <Link to="/app/deals" className="btn btn-ghost btn-sm">View pipeline</Link>
          <Link to="/app/contacts" className="btn btn-primary btn-sm"><Icon name="plus" size={16} /> Add contact</Link>
        </div>
      </div>

      <div className="stat-grid">
        <Kpi icon="pipeline" value={money(stats.pipeline)} label="Open pipeline" delta="+12.4%" up />
        <Kpi icon="chart" value={money(stats.revenue)} label="Won revenue" delta="+8.1%" up />
        <Kpi icon="users" value={stats.contacts} label="Total contacts" delta="+5" up />
        <Kpi icon="bolt" value={stats.winRate + '%'} label="Win rate" delta="-2.3%" />
      </div>

      <div className="grid-2">
        <div className="panel card">
          <div className="panel-head">
            <h3>Pipeline by stage</h3>
            <Link to="/app/deals">Open board →</Link>
          </div>
          <div className="bars">
            {byStage.map((s) => (
              <div key={s.key} className="bar-col">
                <div className="bar" style={{ height: `${Math.max(6, s.pct)}%`, background: `linear-gradient(180deg, ${s.color}, color-mix(in srgb, ${s.color} 55%, var(--accent)))` }} title={money(s.amount)} />
                <div className="bar-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel card">
          <div className="panel-head">
            <h3>Contacts by status</h3>
          </div>
          <div className="ring-wrap">
            <svg width="132" height="132" viewBox="0 0 132 132">
              <circle cx="66" cy="66" r="54" fill="none" stroke="var(--surface-2)" strokeWidth="16" />
              {byStatus.arcs.map((a) => (
                <circle
                  key={a.key}
                  cx="66"
                  cy="66"
                  r="54"
                  fill="none"
                  stroke={a.color}
                  strokeWidth="16"
                  strokeDasharray={`${a.frac * C} ${C}`}
                  strokeDashoffset={`${-a.offset * C}`}
                  transform="rotate(-90 66 66)"
                  strokeLinecap="butt"
                />
              ))}
              <text x="66" y="62" textAnchor="middle" fontSize="26" fontWeight="800" fill="var(--text)">{byStatus.total}</text>
              <text x="66" y="82" textAnchor="middle" fontSize="11" fill="var(--text-faint)">contacts</text>
            </svg>
            <div className="legend">
              {byStatus.arcs.map((a) => (
                <div key={a.key} className="legend-row">
                  <span className="legend-dot" style={{ background: a.color }} />
                  <span style={{ textTransform: 'capitalize' }}>{a.key}</span>
                  <span>{a.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="panel card" style={{ marginTop: 18 }}>
        <div className="panel-head">
          <h3>Recent activity</h3>
          <Link to="/app/contacts">All contacts →</Link>
        </div>
        <div className="activity">
          {activity.map((a) => (
            <div key={a.id} className="activity-row">
              <Avatar name={a.name} size={38} />
              <div style={{ flex: 1 }}>
                <div className="a-text"><b>{a.name}</b> {a.action}</div>
                <div className="a-time">{timeAgo(a.at)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Kpi({ icon, value, label, delta, up }) {
  return (
    <div className="kpi card">
      <div className="kpi-top">
        <span className="kpi-ico"><Icon name={icon} size={20} /></span>
        <span className={`kpi-delta ${up ? 'up' : 'down'}`}>{delta}</span>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
    </div>
  )
}
