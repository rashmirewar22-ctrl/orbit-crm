export default function Logo({ size = 30, withText = true }) {
  return (
    <span className="logo">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="6" fill="var(--brand)" />
        <ellipse
          cx="16"
          cy="16"
          rx="14"
          ry="7"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="2"
          transform="rotate(-30 16 16)"
        />
        <circle cx="27" cy="10" r="2.6" fill="var(--accent)" />
      </svg>
      {withText && <span className="logo-text">Orbit</span>}
    </span>
  )
}
