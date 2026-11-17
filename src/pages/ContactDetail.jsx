import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCrm } from '../context/CrmContext'
import { useToast } from '../context/ToastContext'
import { money, formatDate, timeAgo } from '../utils/format'
import Icon from '../components/Icon'
import Avatar from '../components/Avatar'
import ContactModal from '../components/ContactModal'

export default function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { contacts, updateContact, removeContact, addNote } = useCrm()
  const toast = useToast()
  const [note, setNote] = useState('')
  const [editing, setEditing] = useState(false)

  const contact = contacts.find((c) => c.id === id)

  if (!contact) {
    return (
      <div className="empty">
        <span className="empty-ico"><Icon name="users" size={26} /></span>
        <h3>Contact not found</h3>
        <Link to="/app/contacts" className="btn btn-soft btn-sm" style={{ marginTop: 14 }}>Back to contacts</Link>
      </div>
    )
  }

  function submitNote(e) {
    e.preventDefault()
    if (!note.trim()) return
    addNote(contact.id, note.trim())
    setNote('')
    toast.success('Note added')
  }

  function handleDelete() {
    removeContact(contact.id)
    toast.info(`${contact.name} removed`)
    navigate('/app/contacts')
  }

  return (
    <div>
      <Link to="/app/contacts" className="back-link"><Icon name="arrowRight" size={15} style={{ transform: 'rotate(180deg)' }} /> Contacts</Link>

      <div className="page-head">
        <div className="profile-head">
          <Avatar name={contact.name} size={62} />
          <div>
            <h2>{contact.name}</h2>
            <div className="sub">{contact.title} · {contact.company}</div>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}><Icon name="edit" size={16} /> Edit</button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}><Icon name="trash" size={16} /> Delete</button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="panel card">
          <div className="panel-head"><h3>Activity & notes</h3></div>
          <form className="note-form" onSubmit={submitNote}>
            <input className="input" placeholder="Log a call, email or note…" value={note} onChange={(e) => setNote(e.target.value)} />
            <button className="btn btn-primary" type="submit"><Icon name="plus" size={16} /> Add</button>
          </form>
          {(!contact.notes || contact.notes.length === 0) ? (
            <p className="muted" style={{ fontSize: 14, padding: '8px 0' }}>No notes yet. Add your first interaction above.</p>
          ) : (
            contact.notes.map((n) => (
              <div key={n.id} className="note">
                <p>{n.text}</p>
                <div className="note-time">{timeAgo(n.at)}</div>
              </div>
            ))
          )}
        </div>

        <div>
          <div className="panel card" style={{ marginBottom: 18 }}>
            <div className="panel-head"><h3>Details</h3></div>
            <div className="info-list">
              <div className="info-row"><Icon name="mail" size={17} className="info-ico" /><span className="info-k">Email</span><span>{contact.email}</span></div>
              <div className="info-row"><Icon name="phone" size={17} className="info-ico" /><span className="info-k">Phone</span><span>{contact.phone || '—'}</span></div>
              <div className="info-row"><Icon name="building" size={17} className="info-ico" /><span className="info-k">Company</span><span>{contact.company}</span></div>
              <div className="info-row"><Icon name="chart" size={17} className="info-ico" /><span className="info-k">Value</span><span style={{ fontWeight: 650 }}>{money(contact.value)}</span></div>
              <div className="info-row"><Icon name="users" size={17} className="info-ico" /><span className="info-k">Owner</span><span>{contact.owner}</span></div>
            </div>
          </div>

          <div className="panel card">
            <div className="panel-head"><h3>Status & tags</h3></div>
            <div style={{ marginBottom: 16 }}>
              <span className={`badge ${contact.status}`}><span className="badge-dot" />{contact.status}</span>
            </div>
            <div className="chip-row">
              {(contact.tags && contact.tags.length) ? contact.tags.map((t) => <span key={t} className="tag">#{t}</span>) : <span className="muted" style={{ fontSize: 13 }}>No tags</span>}
            </div>
            <hr className="divider" style={{ margin: '16px 0' }} />
            <div className="muted" style={{ fontSize: 13 }}>Added {formatDate(contact.createdAt)}</div>
          </div>
        </div>
      </div>

      {editing && (
        <ContactModal
          initial={contact}
          onClose={() => setEditing(false)}
          onSave={(data) => { updateContact(contact.id, data); setEditing(false); toast.success('Contact updated') }}
        />
      )}
    </div>
  )
}
