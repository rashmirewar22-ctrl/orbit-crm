export function money(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(n || 0)
}

export function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const palette = ['#6366f1', '#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6', '#ef4444', '#0ea5e9']

export function avatarColor(seed) {
  let h = 0
  for (let i = 0; i < (seed || '').length; i++) h = (h + seed.charCodeAt(i) * (i + 1)) % palette.length
  return palette[h]
}

export function timeAgo(ts) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return mins + 'm ago'
  const hours = Math.floor(mins / 60)
  if (hours < 24) return hours + 'h ago'
  const days = Math.floor(hours / 24)
  if (days < 30) return days + 'd ago'
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
