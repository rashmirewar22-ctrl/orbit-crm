import { useTheme } from '../context/ThemeContext'
import Icon from './Icon'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
    </button>
  )
}
