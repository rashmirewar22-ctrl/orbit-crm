import { useMemo, useState } from 'react'
import { useCrm } from '../context/CrmContext'
import { useToast } from '../context/ToastContext'
import { STAGES } from '../data/seed'
import { money } from '../utils/format'
import Icon from '../components/Icon'
import Modal from '../components/Modal'

export default function Deals() {
  const { deals, moveDeal, addDeal, removeDeal } = useCrm()
  const toast = useToast()
  const [dragId, setDragId] = useState(null)
  const [overStage, setOverStage] = useState(null)
  const [adding, setAdding] = useState(false)

  const columns = useMemo(() => {
    return STAGES.map((stage) => {
      const items = deals.filter((d) => d.stage === stage.key)
      const sum = items.reduce((a, d) => a + d.amount, 0)
      return { ...stage, items, sum }
    })
  }, [deals])

  const total = deals.reduce((a, d) => a + d.amount, 0)

  function onDrop(stageKey) {
    if (dragId) {
      const deal = deals.find((d) => d.id === dragId)
      if (deal && deal.stage !== stageKey) {
        moveDeal(dragId, stageKey)
        toast.success(`Moved to ${STAGES.find((s) => s.key === stageKey).label}`)
      }
    }
    setDragId(null)
    setOverStage(null)
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Pipeline</h1>
          <p>{deals.length} deals · {money(total)} total value. Drag a card to move it between stages.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setAdding(true)}><Icon name="plus" size={16} /> New deal</button>
        </div>
      </div>

      <div className="board">
        {columns.map((col) => (
          <div
            key={col.key}
            className={`col ${overStage === col.key ? 'drag-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setOverStage(col.key) }}
            onDragLeave={() => setOverStage((s) => (s === col.key ? null : s))}
            onDrop={() => onDrop(col.key)}
          >
            <div className="col-head">
              <span className="col-title"><span className="legend-dot" style={{ background: col.color }} /> {col.label}</span>
              <span className="col-count">{col.items.length}</span>
            </div>
            <div className="col-sum">{money(col.sum)}</div>

            {col.items.map((deal) => (
              <div
                key={deal.id}
                className={`deal ${dragId === deal.id ? 'dragging' : ''}`}
                draggable
                onDragStart={() => setDragId(deal.id)}
                onDragEnd={() => { setDragId(null); setOverStage(null) }}
              >
                <div className="deal-title">{deal.title}</div>
                <div className="deal-meta">
                  <span className="deal-amount">{money(deal.amount)}</span>
                  <button
                    className="icon-btn danger"
                    style={{ width: 28, height: 28 }}
                    onClick={() => { removeDeal(deal.id); toast.info('Deal removed') }}
                    title="Remove"
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
                <div className="deal-foot">
                  <span>{deal.contact}</span>
                  <span className="prob">
                    <span className="prob-track"><span style={{ width: `${deal.probability}%` }} /></span>
                    {deal.probability}%
                  </span>
                </div>
              </div>
            ))}

            {col.items.length === 0 && (
              <div className="muted" style={{ fontSize: 13, textAlign: 'center', padding: '18px 0' }}>Drop deals here</div>
            )}
          </div>
        ))}
      </div>

      {adding && (
        <AddDeal
          onClose={() => setAdding(false)}
          onSave={(data) => { addDeal(data); setAdding(false); toast.success('Deal added') }}
        />
      )}
    </div>
  )
}

function AddDeal({ onClose, onSave }) {
  const [form, setForm] = useState({ title: '', contact: '', amount: '', stage: 'lead', probability: 20 })
  const [err, setErr] = useState('')

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function submit() {
    if (form.title.trim().length < 2) { setErr('Give the deal a title.'); return }
    onSave({
      title: form.title.trim(),
      contact: form.contact.trim() || 'Unassigned',
      company: form.contact.trim() || '—',
      amount: Number(form.amount) || 0,
      stage: form.stage,
      probability: Number(form.probability) || 0,
      closeDate: new Date().toISOString().slice(0, 10)
    })
  }

  return (
    <Modal
      title="New deal"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Add deal</button>
        </>
      }
    >
      <div className="field">
        <label className="label">Deal title</label>
        <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Acme — Annual plan" />
        {err && <div className="field-error">{err}</div>}
      </div>
      <div className="form-row">
        <div className="field">
          <label className="label">Contact</label>
          <input className="input" value={form.contact} onChange={(e) => set('contact', e.target.value)} placeholder="Jane Cooper" />
        </div>
        <div className="field">
          <label className="label">Amount ($)</label>
          <input className="input" type="number" min="0" value={form.amount} onChange={(e) => set('amount', e.target.value)} placeholder="5000" />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label className="label">Stage</label>
          <select className="select" value={form.stage} onChange={(e) => set('stage', e.target.value)}>
            {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="label">Probability (%)</label>
          <input className="input" type="number" min="0" max="100" value={form.probability} onChange={(e) => set('probability', e.target.value)} />
        </div>
      </div>
    </Modal>
  )
}
