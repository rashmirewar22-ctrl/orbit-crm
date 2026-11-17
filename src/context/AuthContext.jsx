import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const USERS_KEY = 'orbit.users'
const SESSION_KEY = 'orbit.session'

function hash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i)
  }
  return (h >>> 0).toString(16)
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function seedDemo() {
  const users = readUsers()
  if (!users.some((u) => u.email === 'demo@orbit.io')) {
    users.push({
      id: 'u_demo',
      name: 'Ava Thompson',
      email: 'demo@orbit.io',
      password: hash('orbit123'),
      createdAt: Date.now()
    })
    writeUsers(users)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    seedDemo()
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY))
      if (session) {
        const found = readUsers().find((u) => u.id === session.id)
        if (found) setUser({ id: found.id, name: found.name, email: found.email })
      }
    } catch {
      // ignore
    }
    setReady(true)
  }, [])

  function persistSession(u) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: u.id }))
    setUser({ id: u.id, name: u.name, email: u.email })
  }

  function register({ name, email, password }) {
    const users = readUsers()
    const clean = email.trim().toLowerCase()
    if (users.some((u) => u.email === clean)) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const newUser = {
      id: 'u_' + Date.now().toString(36),
      name: name.trim(),
      email: clean,
      password: hash(password),
      createdAt: Date.now()
    }
    writeUsers([...users, newUser])
    persistSession(newUser)
    return { ok: true }
  }

  function login({ email, password }) {
    const clean = email.trim().toLowerCase()
    const found = readUsers().find((u) => u.email === clean)
    if (!found || found.password !== hash(password)) {
      return { ok: false, error: 'Invalid email or password.' }
    }
    persistSession(found)
    return { ok: true }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, ready, register, login, logout }),
    [user, ready]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
