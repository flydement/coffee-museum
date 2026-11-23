import type { FlavorProfile } from '../types/coffee'

interface FlavorRadarProps {
  profile: FlavorProfile
  size?: number
}

const AXES: { key: keyof FlavorProfile; label: string }[] = [
  { key: 'aroma', label: '花果香' },
  { key: 'acidity', label: '明亮酸' },
  { key: 'sweetness', label: '甜感' },
  { key: 'body', label: '醇厚度' },
  { key: 'bitterness', label: '苦韵' },
]

export function FlavorRadar({ profile, size = 236 }: FlavorRadarProps) {
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

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="五维风味雷达图"
      style={{ display: 'block', margin: '0 auto' }}
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
            fill={ring === 1 ? 'rgba(239, 231, 216, 0.55)' : 'none'}
            stroke="rgba(74, 52, 40, 0.16)"
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
              stroke="rgba(74, 52, 40, 0.16)"
              strokeWidth="1"
            />
            <text
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#463125"
              fontSize="11.5"
              fontWeight="600"
            >
              {axis.label}
            </text>
          </g>
        )
      })}

      <polygon
        points={polygonPoints}
        fill="rgba(174, 118, 58, 0.28)"
        stroke="#A97236"
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
            fill="#2A1D16"
            stroke="#FCF9F3"
            strokeWidth="1.5"
          />
        )
      })}
    </svg>
  )
}
