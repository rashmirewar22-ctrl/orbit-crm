import { useState } from 'react'
import Modal from './Modal'
import { STATUS } from '../data/seed'

const blank = { name: '', email: '', phone: '', company: '', title: '', status: 'lead', value: 0 }

export default function ContactModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial ? { ...blank, ...initial } : blank)
  const [errors, setErrors] = useState({})

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }))
  }

  function submit() {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Valid email required.'
    setErrors(next)
    if (Object.keys(next).length) return
    onSave({ ...form, value: Number(form.value) || 0 })
  }

  return (
    <Modal
      title={initial ? 'Edit contact' : 'New contact'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>{initial ? 'Save changes' : 'Add contact'}</button>
        </>
      }
    >
      <div className="field">
        <label className="label">Full name</label>
        <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Jane Cooper" />
        {errors.name && <div className="field-error">{errors.name}</div>}
      </div>
      <div className="form-row">
        <div className="field">
          <label className="label">Email</label>
          <input className="input" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="jane@acme.com" />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>
        <div className="field">
          <label className="label">Phone</label>
          <input className="input" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label className="label">Company</label>
          <input className="input" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Acme Inc." />
        </div>
        <div className="field">
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Head of Ops" />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label className="label">Status</label>
          <select className="select" value={form.status} onChange={(e) => set('status', e.target.value)}>
            {STATUS.map((s) => (
              <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="label">Deal value ($)</label>
          <input className="input" type="number" min="0" value={form.value} onChange={(e) => set('value', e.target.value)} />
        </div>
      </div>
    </Modal>
  )
}
