import type { BrewStep, CoffeeExhibit } from '../types/coffee'

interface BrewAnimationProps {
  coffee: CoffeeExhibit
  step: BrewStep
  isRunning: boolean
  stepProgress: number // 0..1 within current step
}

function SteamCurls({ show, y = 62 }: { show?: boolean; y?: number }) {
  if (!show) return null
  return (
    <g opacity="0.7">
      <path
        className="svg-steam"
        d={`M136 ${y} C132 ${y - 16}, 144 ${y - 24}, 139 ${y - 38}`}
        stroke="#C28C4D"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        className="svg-steam-2"
        d={`M160 ${y + 4} C156 ${y - 14}, 168 ${y - 24}, 163 ${y - 40}`}
        stroke="#AE763A"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        className="svg-steam-3"
        d={`M184 ${y} C180 ${y - 14}, 190 ${y - 22}, 186 ${y - 35}`}
        stroke="#C28C4D"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  )
}

export function BrewAnimation({
  coffee,
  step,
  isRunning,
  stepProgress,
}: BrewAnimationProps) {
  const activePour = Boolean(step.isPouring && (isRunning || stepProgress > 0))
  const fillPercent = Math.min(98, Math.max(6, step.visualLevel))
  const { liquid, crema, accent } = coffee.palette

  // 1. V60 Pour-over glass server + dripper + gooseneck spout
  if (coffee.method === 'v60') {
    const serverLiquidHeight = Math.round((fillPercent / 100) * 72)
    const serverLiquidY = 236 - serverLiquidHeight

    return (
      <svg viewBox="0 0 320 270" width="100%" style={{ maxWidth: 340 }} aria-label="手冲实时动态演示">
        <defs>
          <clipPath id="v60-server-clip">
            <path d="M114 156 H206 L222 224 C224 233 216 240 206 240 H114 C104 240 96 233 98 224 Z" />
          </clipPath>
        </defs>

        {/* Wooden coaster */}
        <rect x="78" y="242" width="164" height="12" rx="6" fill="#C9A87D" stroke="#6E4E34" strokeWidth="1.5" />

        {/* Gooseneck kettle spout on top right */}
        <g transform={activePour ? 'translate(-6, 4) rotate(-6 240 50)' : 'translate(0, 0)'} style={{ transition: 'transform 0.5s ease' }}>
          <path
            d="M276 58 C242 58, 224 34, 198 44 C184 49, 174 60, 166 64"
            stroke="#9E5E32"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M276 58 C242 58, 224 34, 198 44 C184 49, 174 60, 166 64"
            stroke="#D9A36B"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="282" cy="64" rx="20" ry="26" fill="#B56E3B" stroke="#5A341C" strokeWidth="2" />
        </g>

        {/* Animated pouring water stream */}
        {activePour && (
          <path
            className="svg-pour-stream"
            d="M164 66 Q160 92 160 118"
            stroke="#D6E6EE"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Glass Server */}
        <path
          d="M114 156 H206 L222 224 C224 233 216 240 206 240 H114 C104 240 96 233 98 224 Z"
          fill="rgba(255,255,255,0.68)"
          stroke="#463125"
          strokeWidth="2.4"
        />
        <path
          d="M210 174 H228 C236 174 242 181 242 190 V206 C242 215 235 221 225 221 H218"
          stroke="#6E4E34"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rising amber coffee inside server */}
        <g clipPath="url(#v60-server-clip)">
          <rect
            x="92"
            y={serverLiquidY}
            width="136"
            height={serverLiquidHeight + 12}
            fill={liquid}
            style={{ transition: 'y 0.6s ease, height 0.6s ease' }}
          />
          <ellipse
            cx="160"
            cy={serverLiquidY}
            rx="56"
            ry="6"
            fill={crema}
            opacity="0.75"
            style={{ transition: 'cy 0.6s ease' }}
          />
        </g>

        {/* Dripping coffee drop */}
        {(activePour || step.phase === 'bloom' || step.phase === 'finish') && (
          <circle className="svg-drip" cx="160" cy="156" r="3.6" fill={liquid} />
        )}

        {/* Brass dripper collar */}
        <rect x="116" y="148" width="88" height="8" rx="4" fill="#C28C4D" stroke="#463125" strokeWidth="1.6" />

        {/* V60 Glass Cone & Filter Paper */}
        <polygon points="104,88 216,88 175,148 145,148" fill="#F8EFE0" stroke="#463125" strokeWidth="2.2" />
        {/* Coffee bed inside dripper */}
        <polygon points="122,115 198,115 174,147 146,147" fill="#5A331E" />

        {/* Bloom CO2 bubbles */}
        {step.isBlooming && (
          <g>
            <circle className="svg-bloom-bubble" cx="148" cy="113" r="6" fill={crema} />
            <circle className="svg-bloom-bubble" cx="161" cy="110" r="8" fill={crema} />
            <circle className="svg-bloom-bubble" cx="174" cy="113" r="5.5" fill={crema} />
          </g>
        )}

        <SteamCurls show={step.hasSteam} y={78} />
      </svg>
    )
  }

  // 2. Espresso machine grouphead & golden crema demitasse
  if (coffee.method === 'espresso') {
    const cupHeight = Math.round((fillPercent / 100) * 58)
    const cupY = 224 - cupHeight
    return (
      <svg viewBox="0 0 320 270" width="100%" style={{ maxWidth: 340 }} aria-label="意式浓缩实时萃取演示">
        <defs>
          <clipPath id="esp-cup-clip">
            <path d="M114 156 H206 V196 C206 218 186 232 160 232 C134 232 114 218 114 196 Z" />
          </clipPath>
        </defs>

        {/* Espresso machine grouphead */}
        <rect x="92" y="24" width="136" height="36" rx="8" fill="#3E2A20" stroke="#221610" strokeWidth="2" />
        <rect x="116" y="60" width="88" height="22" rx="4" fill="#B5844A" stroke="#221610" strokeWidth="2" />
        {/* Portafilter handle */}
        <rect x="202" y="66" width="76" height="11" rx="5.5" fill="#2A1D16" />
        {/* Dual spouts */}
        <path d="M144 82 V96 M176 82 V96" stroke="#7A5B47" strokeWidth="6" strokeLinecap="round" />

        {/* Tiger-stripe extraction stream */}
        {activePour && (
          <g>
            <line className="svg-pour-stream" x1="144" y1="98" x2="148" y2="180" stroke={crema} strokeWidth="4.5" strokeLinecap="round" />
            <line className="svg-pour-stream" x1="176" y1="98" x2="172" y2="180" stroke={liquid} strokeWidth="4.5" strokeLinecap="round" />
          </g>
        )}

        {/* Saucer */}
        <ellipse cx="160" cy="238" rx="74" ry="10" fill="#EFE7D8" stroke="#B88446" strokeWidth="2.4" />

        {/* Ceramic Demitasse Cup */}
        <path
          d="M114 156 H206 V196 C206 218 186 232 160 232 C134 232 114 218 114 196 Z"
          fill="#FCF9F3"
          stroke="#2E1F17"
          strokeWidth="2.6"
        />
        <path
          d="M206 168 H222 C233 168 240 176 240 186 C240 197 233 205 222 205 H204"
          stroke="#2E1F17"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        <g clipPath="url(#esp-cup-clip)">
          <rect
            x="110"
            y={cupY}
            width="100"
            height={cupHeight + 16}
            fill={liquid}
            style={{ transition: 'y 0.6s ease, height 0.6s ease' }}
          />
          <rect
            x="110"
            y={cupY}
            width="100"
            height="13"
            fill={crema}
            style={{ transition: 'y 0.6s ease' }}
          />
        </g>

        <SteamCurls show={step.hasSteam} y={145} />
      </svg>
    )
  }

  // 3. Milk Coffee (Flat White / Latte) with pouring pitcher & latte tulip art
  if (coffee.method === 'milk') {
    const milkHeight = Math.round((fillPercent / 100) * 86)
    const milkY = 230 - milkHeight
    return (
      <svg viewBox="0 0 320 270" width="100%" style={{ maxWidth: 340 }} aria-label="意式奶咖融合拉花演示">
        <defs>
          <clipPath id="latte-cup-clip">
            <path d="M96 138 H224 V184 C224 216 196 234 160 234 C124 234 96 216 96 184 Z" />
          </clipPath>
        </defs>

        {/* Stainless milk pitcher tilting when pouring milk */}
        {step.hasMilk && (
          <g
            transform={
              activePour
                ? 'translate(-18, 12) rotate(-28 240 66)'
                : 'translate(0, 0) rotate(-6 240 66)'
            }
            style={{ transition: 'transform 0.55s ease' }}
          >
            <path
              d="M214 42 H268 L260 98 H222 Z"
              fill="#E5DED2"
              stroke="#463125"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path d="M214 42 L198 52 L218 58" fill="#E5DED2" stroke="#463125" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M266 52 H280 C285 52 287 58 286 66 L282 82 H263" stroke="#463125" strokeWidth="2.2" fill="none" />
          </g>
        )}

        {/* Milk or espresso pour stream */}
        {activePour && (
          <line
            className="svg-pour-stream"
            x1={step.hasMilk ? 176 : 160}
            y1="82"
            x2="160"
            y2="162"
            stroke={step.hasMilk ? '#FFFDF8' : liquid}
            strokeWidth={step.hasMilk ? '7' : '4.5'}
            strokeLinecap="round"
          />
        )}

        {/* Saucer */}
        <ellipse cx="160" cy="240" rx="86" ry="11" fill="#EFE7D8" stroke="#B88446" strokeWidth="2.4" />

        {/* Wide Ceramic Latte Bowl */}
        <path
          d="M96 138 H224 V184 C224 216 196 234 160 234 C124 234 96 216 96 184 Z"
          fill="#FCF9F3"
          stroke="#2E1F17"
          strokeWidth="2.6"
        />
        <path
          d="M224 156 H242 C254 156 262 166 262 178 C262 190 254 200 242 200 H221"
          stroke="#2E1F17"
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />

        <g clipPath="url(#latte-cup-clip)">
          <rect
            x="92"
            y={milkY}
            width="136"
            height={milkHeight + 14}
            fill={step.hasMilk ? liquid : '#4B2817'}
            style={{ transition: 'y 0.6s ease, height 0.6s ease, fill 0.5s ease' }}
          />
          {step.hasMilk && (
            <rect
              x="92"
              y={milkY}
              width="136"
              height="20"
              fill={crema}
              style={{ transition: 'y 0.6s ease' }}
            />
          )}
        </g>

        {/* Top foam surface with emerging latte tulip heart when nearly full */}
        {fillPercent >= 85 && (
          <g>
            <ellipse cx="160" cy="146" rx="58" ry="11" fill={accent} opacity="0.88" />
            <path
              d="M160 153 C148 148, 144 140, 152 139 C156 138.5, 158.5 141, 160 143 C161.5 141, 164 138.5, 168 139 C176 140, 172 148, 160 153 Z"
              fill="#FFFDF9"
            />
          </g>
        )}

        <SteamCurls show={step.hasSteam} y={128} />
      </svg>
    )
  }

  // 4. Layered Dirty / Cold Brew / Sicilian Iced glass
  if (coffee.method === 'dirty' || coffee.method === 'coldbrew' || coffee.method === 'iced') {
    const totalH = Math.round((fillPercent / 100) * 144)
    const topY = 232 - totalH
    const isDirty = coffee.method === 'dirty'
    const isLemon = coffee.method === 'iced'

    return (
      <svg viewBox="0 0 320 270" width="100%" style={{ maxWidth: 340 }} aria-label="冰饮与分层咖啡实时演示">
        <defs>
          <clipPath id="glass-clip">
            <path d="M108 76 H212 L200 228 C199 235 193 240 186 240 H134 C127 240 121 235 120 228 Z" />
          </clipPath>
        </defs>

        {/* Coaster */}
        <rect x="86" y="242" width="148" height="10" rx="5" fill="#D5BE9A" stroke="#7A5B47" strokeWidth="1.4" />

        {/* Pouring stream from top */}
        {activePour && (
          <line
            className="svg-pour-stream"
            x1="160"
            y1="26"
            x2="160"
            y2={Math.max(90, topY + 12)}
            stroke={isDirty || step.phase === 'extract' ? liquid : '#B8D4DC'}
            strokeWidth="5.5"
            strokeLinecap="round"
          />
        )}

        {/* Glass Body */}
        <path
          d="M108 76 H212 L200 228 C199 235 193 240 186 240 H134 C127 240 121 235 120 228 Z"
          fill="rgba(255, 255, 255, 0.6)"
          stroke="#463125"
          strokeWidth="2.4"
        />

        <g clipPath="url(#glass-clip)">
          {/* Base liquid (oat milk / lemon soda / cold brew) */}
          <rect
            x="102"
            y={topY}
            width="116"
            height={totalH + 14}
            fill={isDirty ? crema : isLemon ? '#F2D985' : liquid}
            style={{ transition: 'y 0.6s ease, height 0.6s ease' }}
          />

          {/* Layered coffee cascade for Dirty or Sicilian */}
          {(isDirty || isLemon) && fillPercent > 75 && (
            <path
              d={`M102 ${topY} H218 V${topY + 46} Q188 ${topY + 62} 160 ${topY + 50} T102 ${topY + 54} Z`}
              fill={liquid}
              opacity="0.92"
              style={{ transition: 'all 0.6s ease' }}
            />
          )}

          {/* Ice cubes */}
          {step.hasIce && !isDirty && (
            <g opacity="0.72">
              <rect x="128" y="138" width="26" height="26" rx="5" transform="rotate(-10 141 151)" fill="#FFFFFF" stroke="#B6CAD2" strokeWidth="1.5" />
              <rect x="160" y="156" width="28" height="28" rx="5" transform="rotate(14 174 170)" fill="#FFFFFF" stroke="#B6CAD2" strokeWidth="1.5" />
              <rect x="136" y="182" width="24" height="24" rx="5" transform="rotate(8 148 194)" fill="#FFFFFF" stroke="#B6CAD2" strokeWidth="1.5" />
            </g>
          )}

          {/* Lemon slice accent for Sicilian */}
          {isLemon && (
            <g transform="translate(186, 118) rotate(20)">
              <circle cx="0" cy="0" r="18" fill="#E8BE3C" stroke="#FFF4C2" strokeWidth="3" />
              <line x1="-14" y1="0" x2="14" y2="0" stroke="#FFF4C2" strokeWidth="1.5" />
              <line x1="0" y1="-14" x2="0" y2="14" stroke="#FFF4C2" strokeWidth="1.5" />
            </g>
          )}

          {/* Golden osmanthus petals for Dirty finish */}
          {isDirty && fillPercent >= 90 && (
            <g fill="#E6B24C">
              <circle cx="144" cy={topY + 8} r="3" />
              <circle cx="158" cy={topY + 6} r="3.4" />
              <circle cx="171" cy={topY + 9} r="2.8" />
              <circle cx="152" cy={topY + 12} r="2.5" />
            </g>
          )}
        </g>

        {/* Glass highlight line */}
        <line x1="120" y1="90" x2="128" y2="220" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
      </svg>
    )
  }

  // 5. Classic Octagonal Moka Pot
  const upperFill = Math.round((fillPercent / 100) * 66)
  return (
    <svg viewBox="0 0 320 270" width="100%" style={{ maxWidth: 340 }} aria-label="摩卡壶萃取实时演示">
      {/* Flame / warmth glow at bottom */}
      {(step.phase === 'bloom' || step.phase === 'extract') && (
        <ellipse cx="160" cy="244" rx="56" ry="9" fill="#D97836" opacity="0.45" />
      )}

      {/* Lower boiler chamber */}
      <polygon
        points="126,158 194,158 214,236 106,236"
        fill="#D7CFC2"
        stroke="#3E2A20"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <line x1="160" y1="158" x2="160" y2="236" stroke="#B7AEA0" strokeWidth="2" />

      {/* Center brass valve */}
      <circle cx="186" cy="186" r="5" fill="#C28C4D" stroke="#3E2A20" strokeWidth="1.4" />

      {/* Upper chamber */}
      <polygon
        points="108,82 212,82 194,158 126,158"
        fill="#EFE8DC"
        stroke="#3E2A20"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* Coffee level visible through cutaway window */}
      <rect
        x="128"
        y={154 - upperFill}
        width="64"
        height={upperFill}
        rx="4"
        fill={liquid}
        opacity="0.9"
        style={{ transition: 'y 0.6s ease, height 0.6s ease' }}
      />

      {/* Center chimney column */}
      <rect x="155" y="102" width="10" height="54" rx="3" fill="#B7AEA0" stroke="#3E2A20" strokeWidth="1.5" />
      {activePour && (
        <g>
          <path className="svg-pour-stream" d="M155 104 Q142 106 140 124" stroke={crema} strokeWidth="3.2" fill="none" />
          <path className="svg-pour-stream" d="M165 104 Q178 106 180 124" stroke={crema} strokeWidth="3.2" fill="none" />
        </g>
      )}

      {/* Lid & Knob */}
      <path d="M108 82 L160 58 L212 82 Z" fill="#D7CFC2" stroke="#3E2A20" strokeWidth="2.4" strokeLinejoin="round" />
      <rect x="153" y="45" width="14" height="13" rx="4" fill="#2A1D16" />

      {/* Side Handle */}
      <path
        d="M210 92 H234 C244 92 248 100 245 112 L232 152 H202"
        stroke="#2A1D16"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <SteamCurls show={step.hasSteam} y={56} />
    </svg>
  )
}
