import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { seedContacts, seedDeals } from '../data/seed'

const CrmContext = createContext(null)

export function CrmProvider({ children }) {
  const [contacts, setContacts] = useLocalStorage('orbit.contacts', seedContacts())
  const [deals, setDeals] = useLocalStorage('orbit.deals', seedDeals())

  function addContact(data) {
    const contact = {
      id: 'c_' + Date.now().toString(36),
      tags: [],
      notes: [],
      value: 0,
      owner: 'You',
      createdAt: Date.now(),
      lastTouch: Date.now(),
      ...data
    }
    setContacts((list) => [contact, ...list])
    return contact
  }

  function updateContact(id, patch) {
    setContacts((list) =>
      list.map((c) => (c.id === id ? { ...c, ...patch, lastTouch: Date.now() } : c))
    )
  }

  function removeContact(id) {
    setContacts((list) => list.filter((c) => c.id !== id))
  }

  function addNote(id, text) {
    const note = { id: 'n_' + Date.now().toString(36), text, at: Date.now() }
    setContacts((list) =>
      list.map((c) => (c.id === id ? { ...c, notes: [note, ...(c.notes || [])], lastTouch: Date.now() } : c))
    )
  }

  function moveDeal(id, stage) {
    setDeals((list) =>
      list.map((d) => (d.id === id ? { ...d, stage } : d))
    )
  }

  function addDeal(data) {
    const deal = {
      id: 'd_' + Date.now().toString(36),
      stage: 'lead',
      probability: 20,
      order: Date.now(),
      ...data
    }
    setDeals((list) => [...list, deal])
    return deal
  }

  function removeDeal(id) {
    setDeals((list) => list.filter((d) => d.id !== id))
  }

  const value = {
    contacts,
    deals,
    addContact,
    updateContact,
    removeContact,
    addNote,
    moveDeal,
    addDeal,
    removeDeal
  }

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>
}

export function useCrm() {
  const ctx = useContext(CrmContext)
  if (!ctx) throw new Error('useCrm must be used inside CrmProvider')
  return ctx
}
