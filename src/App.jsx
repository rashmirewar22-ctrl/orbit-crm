import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { CrmProvider } from './context/CrmContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import ContactDetail from './pages/ContactDetail'
import Deals from './pages/Deals'
import Settings from './pages/Settings'

function Protected({ children }) {
  const { user, ready } = useAuth()
  if (!ready) return null
  if (!user) return <Navigate to="/login" replace />
  return <CrmProvider>{children}</CrmProvider>
}

function GuestOnly({ children }) {
  const { user, ready } = useAuth()
  if (!ready) return null
  if (user) return <Navigate to="/app" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />
      <Route
        path="/app"
        element={
          <Protected>
            <AppLayout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="contacts/:id" element={<ContactDetail />} />
        <Route path="deals" element={<Deals />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
