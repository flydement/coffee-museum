import type { FlavorProfile } from '../types/coffee'

interface FlavorRadarProps {
  profile: FlavorProfile
  compareProfile?: FlavorProfile
  size?: number
}

const AXES: { key: keyof FlavorProfile; label: string }[] = [
  { key: 'aroma', label: '花果香' },
  { key: 'acidity', label: '明亮酸' },
  { key: 'sweetness', label: '甜感' },
  { key: 'body', label: '醇厚度' },
  { key: 'bitterness', label: '苦韵' },
]

export function FlavorRadar({
  profile,
  compareProfile,
  size = 236,
}: FlavorRadarProps) {
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.34

  const pointAt = (index: number, ratio: number) => {
    const angle = (Math.PI * 2 * index) / AXES.length - Math.PI / 2
    return {
      x: cx + Math.cos(angle) * radius * ratio,
      y: cy + Math.sin(angle) * radius * ratio,
    }
  }

  const rings = [0.25, 0.5, 0.75, 1]

  const polygonPoints = AXES.map((axis, i) => {
    const pt = pointAt(i, Math.max(0.12, profile[axis.key] / 100))
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`
  }).join(' ')

  const comparePoints = compareProfile
    ? AXES.map((axis, i) => {
        const pt = pointAt(i, Math.max(0.12, compareProfile[axis.key] / 100))
        return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`
      }).join(' ')
    : ''

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="五维风味雷达图"
      style={{ display: 'block', margin: '0 auto', color: 'var(--espresso-800)' }}
    >
      {rings.map((ring) => {
        const pts = AXES.map((_, i) => {
          const p = pointAt(i, ring)
          return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
        }).join(' ')
        return (
          <polygon
            key={ring}
            points={pts}
            fill={ring === 1 ? 'var(--paper-inset)' : 'none'}
            fillOpacity={ring === 1 ? 0.5 : 0}
            stroke="var(--border-strong)"
            strokeWidth="1"
          />
        )
      })}

      {AXES.map((axis, i) => {
        const end = pointAt(i, 1)
        const labelPt = pointAt(i, 1.24)
        return (
          <g key={axis.key}>
            <line
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="var(--border-strong)"
              strokeWidth="1"
            />
            <text
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="currentColor"
              fontSize="11.5"
              fontWeight="600"
            >
              {axis.label}
            </text>
          </g>
        )
      })}

      {compareProfile && (
        <polygon
          points={comparePoints}
          fill="rgba(79, 103, 83, 0.24)"
          stroke="#5A7A60"
          strokeWidth="2"
          strokeDasharray="4 2"
          strokeLinejoin="round"
        />
      )}

      <polygon
        points={polygonPoints}
        fill="rgba(174, 118, 58, 0.28)"
        stroke="#C28643"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {AXES.map((axis, i) => {
        const pt = pointAt(i, Math.max(0.12, profile[axis.key] / 100))
        return (
          <circle
            key={axis.key}
            cx={pt.x}
            cy={pt.y}
            r="3.8"
            fill="#C28643"
            stroke="var(--paper-surface)"
            strokeWidth="1.5"
          />
        )
      })}
    </svg>
  )
}
