import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCrm } from '../context/CrmContext'
import { useToast } from '../context/ToastContext'
import { money, timeAgo } from '../utils/format'
import Icon from '../components/Icon'
import Avatar from '../components/Avatar'
import ContactModal from '../components/ContactModal'

const filters = ['all', 'lead', 'active', 'pending', 'lost']

export default function Contacts() {
  const { contacts, addContact, updateContact, removeContact } = useCrm()
  const toast = useToast()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState({ key: 'lastTouch', dir: 'desc' })
  const [modal, setModal] = useState(null)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = contacts.filter((c) => {
      if (filter !== 'all' && c.status !== filter) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q)
      )
    })
    const { key, dir } = sort
    list = [...list].sort((a, b) => {
      let av = a[key]
      let bv = b[key]
      if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase() }
      if (av < bv) return dir === 'asc' ? -1 : 1
      if (av > bv) return dir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [contacts, query, filter, sort])

  function toggleSort(key) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
  }

  function handleSave(data) {
    if (modal?.id) {
      updateContact(modal.id, data)
      toast.success('Contact updated')
    } else {
      addContact(data)
      toast.success('Contact added')
    }
    setModal(null)
  }

  function handleDelete(e, c) {
    e.stopPropagation()
    removeContact(c.id)
    toast.info(`${c.name} removed`)
  }

  function openEdit(e, c) {
    e.stopPropagation()
    setModal(c)
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Contacts</h1>
          <p>{contacts.length} people across your pipeline.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setModal({})}>
            <Icon name="plus" size={16} /> New contact
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Icon name="search" size={17} />
          <input placeholder="Search by name, email or company…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="seg">
          {filters.map((f) => (
            <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div className="card">
        {rows.length === 0 ? (
          <div className="empty">
            <span className="empty-ico"><Icon name="users" size={26} /></span>
            <h3>No contacts found</h3>
            <p>Try a different search or add a new contact.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <Th label="Name" k="name" sort={sort} onSort={toggleSort} />
                  <Th label="Company" k="company" sort={sort} onSort={toggleSort} />
                  <Th label="Status" k="status" sort={sort} onSort={toggleSort} />
                  <Th label="Value" k="value" sort={sort} onSort={toggleSort} />
                  <Th label="Last touch" k="lastTouch" sort={sort} onSort={toggleSort} />
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} onClick={() => navigate(`/app/contacts/${c.id}`)}>
                    <td>
                      <div className="cell-user">
                        <Avatar name={c.name} size={38} />
                        <div>
                          <strong>{c.name}</strong>
                          <span>{c.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{c.company}</div>
                      <span className="muted" style={{ fontSize: 12.5 }}>{c.title}</span>
                    </td>
                    <td><span className={`badge ${c.status}`}><span className="badge-dot" />{c.status}</span></td>
                    <td style={{ fontWeight: 650 }}>{money(c.value)}</td>
                    <td className="muted">{timeAgo(c.lastTouch)}</td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" onClick={(e) => openEdit(e, c)} title="Edit"><Icon name="edit" size={17} /></button>
                        <button className="icon-btn danger" onClick={(e) => handleDelete(e, c)} title="Delete"><Icon name="trash" size={17} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <ContactModal
          initial={modal.id ? modal : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function Th({ label, k, sort, onSort }) {
  const active = sort.key === k
  return (
    <th onClick={() => onSort(k)}>
      <span className="th-in">
        {label}
        <span style={{ opacity: active ? 1 : 0.25, fontSize: 11 }}>{active && sort.dir === 'asc' ? '▲' : '▼'}</span>
      </span>
    </th>
  )
}
