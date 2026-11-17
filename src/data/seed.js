export const STAGES = [
  { key: 'lead', label: 'Lead', color: 'var(--brand)' },
  { key: 'contacted', label: 'Contacted', color: 'var(--accent)' },
  { key: 'proposal', label: 'Proposal', color: 'var(--warning)' },
  { key: 'won', label: 'Won', color: 'var(--success)' },
  { key: 'lost', label: 'Lost', color: 'var(--danger)' }
]

export const STATUS = ['lead', 'active', 'pending', 'lost']

const companies = [
  'Lumen Labs', 'Northwind', 'Vertex Retail', 'BrightFin', 'Cobalt Studio',
  'Harbor Health', 'Pinecone Co', 'Stellar Foods', 'Quanta Soft', 'Riverstone'
]

const names = [
  'Marcus Hale', 'Priya Nair', 'Diego Fuentes', 'Hannah Weiss', 'Omar Said',
  'Lena Petrova', 'Noah Kim', 'Sofia Rossi', 'Ethan Brooks', 'Mei Chen',
  'Jonas Keller', 'Amara Okafor'
]

function pick(arr, i) {
  return arr[i % arr.length]
}

export function seedContacts() {
  const now = Date.now()
  const statuses = ['lead', 'active', 'pending', 'active', 'lost', 'lead', 'active', 'pending', 'active', 'lead', 'active', 'pending']
  const owners = ['You', 'Ava Thompson', 'Team']
  return names.map((name, i) => {
    const first = name.split(' ')[0].toLowerCase()
    const comp = pick(companies, i)
    return {
      id: 'c_' + (i + 1),
      name,
      email: `${first}@${comp.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      phone: '+1 (415) 555-0' + (100 + i),
      company: comp,
      title: pick(['Head of Ops', 'Founder', 'Product Lead', 'CTO', 'Buyer', 'Marketing Dir.'], i),
      status: statuses[i],
      value: (i + 2) * 1850,
      owner: pick(owners, i),
      tags: i % 2 === 0 ? ['warm', 'enterprise'] : ['inbound'],
      notes: [],
      createdAt: now - (i + 1) * 86400000 * 2,
      lastTouch: now - i * 86400000
    }
  })
}

export function seedDeals() {
  const stages = ['lead', 'contacted', 'proposal', 'contacted', 'won', 'lead', 'proposal', 'lost', 'won', 'contacted']
  return names.slice(0, 10).map((name, i) => ({
    id: 'd_' + (i + 1),
    title: pick(companies, i) + ' — ' + pick(['Annual plan', 'Pilot', 'Expansion', 'Renewal', 'Onboarding'], i),
    contact: name,
    company: pick(companies, i),
    amount: (i + 1) * 3200,
    stage: stages[i],
    probability: [20, 45, 65, 50, 100, 15, 70, 0, 100, 40][i],
    closeDate: new Date(Date.now() + (i - 3) * 86400000 * 5).toISOString().slice(0, 10),
    order: i
  }))
}
