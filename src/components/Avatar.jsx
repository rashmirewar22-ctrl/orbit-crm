import { initials, avatarColor } from '../utils/format'

export default function Avatar({ name, size = 38 }) {
  const color = avatarColor(name)
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`
      }}
    >
      {initials(name)}
    </span>
  )
}
