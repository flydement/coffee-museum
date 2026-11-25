import type { BrewStep, CoffeeExhibit } from '../types/coffee'

interface BrewAnimationProps {
  coffee: CoffeeExhibit
  step: BrewStep
  prevVisualLevel?: number
  isRunning: boolean
  stepProgress: number // 0..1 within current step
}

function SteamCurls({ show, y = 62 }: { show?: boolean; y?: number }) {
  if (!show) return null
  return (
    <g opacity="0.72">
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
  prevVisualLevel,
  isRunning,
  stepProgress,
}: BrewAnimationProps) {
  const activePour = Boolean(step.isPouring && (isRunning || stepProgress > 0))
  const startFill = typeof prevVisualLevel === 'number' ? prevVisualLevel : step.visualLevel
  const interpolated =
    step.durationSec > 0
      ? startFill + (step.visualLevel - startFill) * stepProgress
      : step.visualLevel
  const fillPercent = Math.min(98, Math.max(6, interpolated))
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

        <rect x="78" y="242" width="164" height="12" rx="6" fill="#C9A87D" stroke="#6E4E34" strokeWidth="1.5" />

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

        <g clipPath="url(#v60-server-clip)">
          <rect
            x="92"
            y={serverLiquidY}
            width="136"
            height={serverLiquidHeight + 12}
            fill={liquid}
            style={{ transition: 'y 0.4s linear, height 0.4s linear' }}
          />
          <ellipse
            cx="160"
            cy={serverLiquidY}
            rx="56"
            ry="6"
            fill={crema}
            opacity="0.75"
            style={{ transition: 'cy 0.4s linear' }}
          />
          {step.hasIce && (
            <g opacity="0.76">
              <rect x="118" y="204" width="24" height="24" rx="4" transform="rotate(-10 130 216)" fill="#FFFFFF" stroke="#B6CAD2" strokeWidth="1.5" />
              <rect x="149" y="208" width="26" height="26" rx="4" transform="rotate(12 162 221)" fill="#FFFFFF" stroke="#B6CAD2" strokeWidth="1.5" />
              <rect x="178" y="202" width="22" height="22" rx="4" transform="rotate(-8 189 213)" fill="#FFFFFF" stroke="#B6CAD2" strokeWidth="1.5" />
            </g>
          )}
        </g>

        {(activePour || step.phase === 'bloom' || step.phase === 'finish') && (
          <circle className="svg-drip" cx="160" cy="156" r="3.6" fill={liquid} />
        )}

        <rect x="116" y="148" width="88" height="8" rx="4" fill="#C28C4D" stroke="#463125" strokeWidth="1.6" />
        <polygon points="104,88 216,88 175,148 145,148" fill="#F8EFE0" stroke="#463125" strokeWidth="2.2" />
        <polygon points="122,115 198,115 174,147 146,147" fill="#5A331E" />

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

  // 1b. Chemex Hourglass Glass Brewer (MoMA Design Classic with Wood Collar & Leather Tie)
  if (coffee.method === 'chemex') {
    const lowerFillH = Math.round((fillPercent / 100) * 76)
    const lowerFillY = 238 - lowerFillH

    return (
      <svg viewBox="0 0 320 270" width="100%" style={{ maxWidth: 340 }} aria-label="Chemex 沙漏手冲实时动态演示">
        <defs>
          <clipPath id="chemex-lower-clip">
            <path d="M138 148 H182 L218 228 C221 235 215 240 207 240 H113 C105 240 99 235 102 228 Z" />
          </clipPath>
        </defs>

        <rect x="78" y="242" width="164" height="10" rx="5" fill="#C9A87D" stroke="#6E4E34" strokeWidth="1.5" />

        {/* Gooseneck kettle spout */}
        <g transform={activePour ? 'translate(-6, 4) rotate(-6 240 44)' : 'translate(0, 0)'} style={{ transition: 'transform 0.5s ease' }}>
          <path d="M276 52 C242 52, 224 28, 198 38 C184 43, 174 54, 166 58" stroke="#9E5E32" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M276 52 C242 52, 224 28, 198 38 C184 43, 174 54, 166 58" stroke="#D9A36B" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="282" cy="58" rx="19" ry="24" fill="#B56E3B" stroke="#5A341C" strokeWidth="2" />
        </g>

        {activePour && (
          <path className="svg-pour-stream" d="M164 60 Q160 82 160 106" stroke="#D6E6EE" strokeWidth="4" strokeLinecap="round" fill="none" />
        )}

        {/* Thick Square Chemex Paper Filter protruding top */}
        <polygon points="104,78 216,78 176,144 144,144" fill="#FAF4E8" stroke="#8A6D53" strokeWidth="1.8" />
        <polygon points="122,106 198,106 176,143 144,143" fill="#5E351F" />
        {step.isBlooming && (
          <g>
            <circle className="svg-bloom-bubble" cx="148" cy="104" r="5.5" fill={crema} />
            <circle className="svg-bloom-bubble" cx="161" cy="100" r="7.5" fill={crema} />
            <circle className="svg-bloom-bubble" cx="174" cy="104" r="5" fill={crema} />
          </g>
        )}

        {/* Hourglass Borosilicate Carafe */}
        <path
          d="M112 88 H208 L182 148 L218 228 C221 235 215 240 207 240 H113 C105 240 99 235 102 228 L138 148 Z"
          fill="rgba(255,255,255,0.58)"
          stroke="#463125"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* Brewed coffee inside lower flask */}
        <g clipPath="url(#chemex-lower-clip)">
          <rect
            x="96"
            y={lowerFillY}
            width="128"
            height={lowerFillH + 10}
            fill={liquid}
            style={{ transition: 'y 0.4s linear, height 0.4s linear' }}
          />
          <ellipse cx="160" cy={lowerFillY} rx="52" ry="5.5" fill={crema} opacity="0.72" style={{ transition: 'cy 0.4s linear' }} />
        </g>

        {(activePour || step.phase === 'bloom' || step.phase === 'finish') && (
          <circle className="svg-drip" cx="160" cy="154" r="3.6" fill={liquid} />
        )}

        {/* Iconic Polished Wood Collar & Rawhide Leather Tie + Wooden Bead */}
        <path d="M132 134 H188 L184 166 H136 Z" fill="#AE733D" stroke="#463125" strokeWidth="2" strokeLinejoin="round" />
        <line x1="134" y1="150" x2="186" y2="150" stroke="#5A331C" strokeWidth="3.5" />
        <circle cx="160" cy="150" r="6" fill="#E3B376" stroke="#463125" strokeWidth="1.6" />

        <SteamCurls show={step.hasSteam} y={70} />
      </svg>
    )
  }

  // 2. French Press (glass beaker + stainless frame + pressing mesh plunger)
  if (coffee.method === 'frenchpress') {
    const liquidH = Math.round((fillPercent / 100) * 116)
    const liquidY = 232 - liquidH
    const isPlunging = step.phase === 'extract' || step.phase === 'finish'
    const plungerY = isPlunging ? 116 + Math.round(stepProgress * 56) : 108

    return (
      <svg viewBox="0 0 320 270" width="100%" style={{ maxWidth: 340 }} aria-label="法压壶全浸泡动态演示">
        <defs>
          <clipPath id="fp-beaker-clip">
            <rect x="112" y="96" width="96" height="138" rx="8" />
          </clipPath>
        </defs>

        <rect x="86" y="240" width="148" height="10" rx="5" fill="#C9A87D" stroke="#6E4E34" strokeWidth="1.5" />

        {activePour && step.phase === 'pour' && (
          <line
            className="svg-pour-stream"
            x1="160"
            y1="30"
            x2="160"
            y2={Math.max(106, liquidY)}
            stroke="#D6E6EE"
            strokeWidth="6"
            strokeLinecap="round"
          />
        )}

        {/* Glass Beaker */}
        <rect
          x="112"
          y="96"
          width="96"
          height="138"
          rx="8"
          fill="rgba(255,255,255,0.68)"
          stroke="#3E2A20"
          strokeWidth="2.4"
        />

        {/* Handle */}
        <path
          d="M208 114 H228 C236 114 242 120 242 128 V196 C242 204 236 210 228 210 H208"
          stroke="#2E1F17"
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Liquid & immersed grounds */}
        <g clipPath="url(#fp-beaker-clip)">
          <rect
            x="108"
            y={liquidY}
            width="104"
            height={liquidH + 10}
            fill={liquid}
            style={{ transition: 'y 0.45s linear, height 0.45s linear' }}
          />
          {fillPercent > 30 && (
            <rect
              x="108"
              y={liquidY}
              width="104"
              height="12"
              fill={crema}
              opacity={step.phase === 'extract' ? 0.35 : 0.8}
              style={{ transition: 'y 0.45s linear, opacity 0.4s ease' }}
            />
          )}
          {/* Settled coffee grounds at bottom */}
          <rect x="110" y="216" width="100" height="20" fill="#3B1E10" opacity="0.85" />
        </g>

        {/* Stainless base & band */}
        <rect x="108" y="224" width="104" height="14" rx="4" fill="#C8BEB0" stroke="#3E2A20" strokeWidth="1.8" />
        <rect x="108" y="132" width="104" height="7" fill="#C8BEB0" stroke="#3E2A20" strokeWidth="1.5" />

        {/* Lid & Animated Plunger */}
        {step.phase !== 'pour' && (
          <g>
            <path d="M106 96 Q160 84 214 96 Z" fill="#D5CCC0" stroke="#3E2A20" strokeWidth="2.2" />
            <line
              x1="160"
              y1={plungerY - 58}
              x2="160"
              y2={plungerY}
              stroke="#5A4A3F"
              strokeWidth="3.2"
              style={{ transition: 'all 0.35s linear' }}
            />
            <circle
              cx="160"
              cy={plungerY - 62}
              r="7.5"
              fill="#B88446"
              stroke="#3E2A20"
              strokeWidth="1.8"
              style={{ transition: 'cy 0.35s linear' }}
            />
            {/* Stainless mesh filter plate */}
            <rect
              x="115"
              y={plungerY}
              width="90"
              height="6"
              rx="3"
              fill="#B88446"
              stroke="#3E2A20"
              strokeWidth="1.5"
              style={{ transition: 'y 0.35s linear' }}
            />
          </g>
        )}

        <SteamCurls show={step.hasSteam} y={76} />
      </svg>
    )
  }

  // 3. AeroPress Flash Brew over Ice Server
  if (coffee.method === 'aeropress') {
    const serverH = step.phase === 'extract' ? Math.round(18 + stepProgress * 56) : step.phase === 'finish' ? 74 : 18
    const serverY = 238 - serverH
    const plungerOffset = step.phase === 'extract' ? Math.round(stepProgress * 36) : 0

    return (
      <svg viewBox="0 0 320 270" width="100%" style={{ maxWidth: 340 }} aria-label="爱乐压气压急冷动态演示">
        <defs>
          <clipPath id="ap-server-clip">
            <path d="M112 162 H208 L220 228 C221 235 215 240 206 240 H114 C105 240 99 235 100 228 Z" />
          </clipPath>
        </defs>

        <rect x="82" y="242" width="156" height="10" rx="5" fill="#C9A87D" stroke="#6E4E34" strokeWidth="1.5" />

        {/* Lower Ice Carafe */}
        <path
          d="M112 162 H208 L220 228 C221 235 215 240 206 240 H114 C105 240 99 235 100 228 Z"
          fill="rgba(255,255,255,0.66)"
          stroke="#3E2A20"
          strokeWidth="2.4"
        />
        <path
          d="M210 176 H226 C234 176 240 183 240 192 V208 C240 216 234 222 225 222 H217"
          stroke="#463125"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />

        <g clipPath="url(#ap-server-clip)">
          <rect
            x="96"
            y={serverY}
            width="128"
            height={serverH + 10}
            fill={liquid}
            style={{ transition: 'y 0.35s linear, height 0.35s linear' }}
          />
          {/* Crystal ice cubes inside server */}
          <g opacity="0.78">
            <rect x="122" y="204" width="24" height="24" rx="4" transform="rotate(-12 134 216)" fill="#FFFFFF" stroke="#B6CAD2" strokeWidth="1.5" />
            <rect x="152" y="208" width="26" height="26" rx="4" transform="rotate(10 165 221)" fill="#FFFFFF" stroke="#B6CAD2" strokeWidth="1.5" />
            <rect x="178" y="202" width="22" height="22" rx="4" transform="rotate(-6 189 213)" fill="#FFFFFF" stroke="#B6CAD2" strokeWidth="1.5" />
          </g>
        </g>

        {/* Pressurized micro-filter shower streams */}
        {step.phase === 'extract' && activePour && (
          <g>
            <line className="svg-pour-stream" x1="146" y1="162" x2="146" y2="212" stroke={liquid} strokeWidth="2.6" />
            <line className="svg-pour-stream" x1="160" y1="162" x2="160" y2="216" stroke={crema} strokeWidth="3" />
            <line className="svg-pour-stream" x1="174" y1="162" x2="174" y2="212" stroke={liquid} strokeWidth="2.6" />
          </g>
        )}

        {/* AeroPress Hexagonal Skirt & Black Filter Cap */}
        <rect x="104" y="152" width="112" height="7" rx="3.5" fill="#2A1D16" />
        <rect x="130" y="156" width="60" height="8" rx="3" fill="#221610" />

        {/* AeroPress Outer Translucent Chamber */}
        <rect
          x="128"
          y="86"
          width="64"
          height="66"
          rx="3"
          fill="rgba(232, 224, 211, 0.82)"
          stroke="#3E2A20"
          strokeWidth="2.2"
        />
        {/* Coffee slurry inside chamber */}
        {step.phase !== 'prep' && (
          <rect
            x="131"
            y={98 + plungerOffset}
            width="58"
            height={Math.max(10, 52 - plungerOffset)}
            fill={liquid}
            opacity="0.88"
            style={{ transition: 'all 0.35s linear' }}
          />
        )}

        {/* AeroPress Inner Plunger */}
        {step.phase !== 'prep' && (
          <g transform={`translate(0, ${plungerOffset})`} style={{ transition: 'transform 0.35s linear' }}>
            <rect x="122" y="34" width="76" height="8" rx="4" fill="#5A4638" stroke="#2E1F17" strokeWidth="1.8" />
            <rect x="134" y="42" width="52" height="50" fill="#D8CFC1" stroke="#3E2A20" strokeWidth="1.8" />
            {/* Rubber seal */}
            <rect x="131" y="90" width="58" height="9" rx="3" fill="#221610" />
          </g>
        )}
      </svg>
    )
  }

  // 4. Espresso machine grouphead & golden crema demitasse
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

        <rect x="92" y="24" width="136" height="36" rx="8" fill="#3E2A20" stroke="#221610" strokeWidth="2" />
        <rect x="116" y="60" width="88" height="22" rx="4" fill="#B5844A" stroke="#221610" strokeWidth="2" />
        <rect x="202" y="66" width="76" height="11" rx="5.5" fill="#2A1D16" />
        <path d="M144 82 V96 M176 82 V96" stroke="#7A5B47" strokeWidth="6" strokeLinecap="round" />

        {activePour && (
          <g>
            <line className="svg-pour-stream" x1="144" y1="98" x2="148" y2="180" stroke={crema} strokeWidth="4.5" strokeLinecap="round" />
            <line className="svg-pour-stream" x1="176" y1="98" x2="172" y2="180" stroke={liquid} strokeWidth="4.5" strokeLinecap="round" />
          </g>
        )}

        <ellipse cx="160" cy="238" rx="74" ry="10" fill="#EFE7D8" stroke="#B88446" strokeWidth="2.4" />

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
            style={{ transition: 'y 0.4s linear, height 0.4s linear' }}
          />
          <rect
            x="110"
            y={cupY}
            width="100"
            height="13"
            fill={crema}
            style={{ transition: 'y 0.4s linear' }}
          />
        </g>

        <SteamCurls show={step.hasSteam} y={145} />
      </svg>
    )
  }

  // 5. Milk Coffee (Flat White / Latte) with pouring pitcher & latte tulip art
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

        <ellipse cx="160" cy="240" rx="86" ry="11" fill="#EFE7D8" stroke="#B88446" strokeWidth="2.4" />

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
            style={{ transition: 'y 0.4s linear, height 0.4s linear, fill 0.5s ease' }}
          />
          {step.hasMilk && (
            <rect
              x="92"
              y={milkY}
              width="136"
              height="20"
              fill={crema}
              style={{ transition: 'y 0.4s linear' }}
            />
          )}
        </g>

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

  // 6. Layered Dirty / Coconut Cloud / Einspänner / Affogato / Cold Brew / Sicilian Iced glass
  if (coffee.method === 'dirty' || coffee.method === 'coldbrew' || coffee.method === 'iced') {
    const totalH = Math.round((fillPercent / 100) * 144)
    const topY = 232 - totalH
    const isDirty = coffee.method === 'dirty'
    const isLemon = coffee.method === 'iced'
    const isOrange = coffee.id === 'orange-c-cold-americano'
    const isFrappe = coffee.id === 'greek-iced-frappe'
    const isCreamTop = coffee.id === 'viennese-einspanner' || coffee.id === 'irish-velvet-coffee'
    const isAffogato = coffee.id === 'florence-affogato'

    return (
      <svg viewBox="0 0 320 270" width="100%" style={{ maxWidth: 340 }} aria-label="冰饮与分层咖啡实时演示">
        <defs>
          <clipPath id="glass-clip">
            <path d="M108 76 H212 L200 228 C199 235 193 240 186 240 H134 C127 240 121 235 120 228 Z" />
          </clipPath>
        </defs>

        <rect x="86" y="242" width="148" height="10" rx="5" fill="#D5BE9A" stroke="#7A5B47" strokeWidth="1.4" />

        {activePour && (
          <line
            className="svg-pour-stream"
            x1="160"
            y1="26"
            x2="160"
            y2={Math.max(90, isAffogato ? 148 : topY + 12)}
            stroke={isCreamTop && step.phase === 'assemble' ? crema : isDirty || step.phase === 'extract' ? liquid : '#B8D4DC'}
            strokeWidth="5.5"
            strokeLinecap="round"
          />
        )}

        <path
          d="M108 76 H212 L200 228 C199 235 193 240 186 240 H134 C127 240 121 235 120 228 Z"
          fill="rgba(255, 255, 255, 0.6)"
          stroke="#463125"
          strokeWidth="2.4"
        />

        <g clipPath="url(#glass-clip)">
          {isAffogato ? (
            <>
              {/* Espresso pool rising around the vanilla gelato */}
              {fillPercent > 52 && (
                <rect
                  x="102"
                  y={Math.min(220, topY + 26)}
                  width="116"
                  height={Math.max(24, totalH)}
                  fill={liquid}
                  style={{ transition: 'y 0.4s linear, height 0.4s linear' }}
                />
              )}
              {/* Vanilla Gelato Scoop */}
              <circle cx="160" cy="182" r="38" fill="#FFF7E4" stroke="#E5D4B3" strokeWidth="2" />
              <circle cx="144" cy="172" r="2.2" fill="#9C7A4D" opacity="0.55" />
              <circle cx="168" cy="166" r="1.8" fill="#9C7A4D" opacity="0.55" />
              <circle cx="172" cy="188" r="2" fill="#9C7A4D" opacity="0.5" />
              {/* Espresso glaze cascading over the scoop */}
              {fillPercent > 65 && (
                <path
                  d="M126 168 Q144 142 160 144 Q178 144 194 170 Q180 182 170 174 Q158 190 146 176 Q135 184 126 168 Z"
                  fill={liquid}
                  opacity="0.88"
                />
              )}
            </>
          ) : (
            <>
              <rect
                x="102"
                y={topY}
                width="116"
                height={totalH + 14}
                fill={
                  isCreamTop || isFrappe
                    ? liquid
                    : isDirty
                      ? crema
                      : isOrange
                        ? '#F4A642'
                        : isLemon
                          ? '#F2D985'
                          : liquid
                }
                style={{ transition: 'y 0.4s linear, height 0.4s linear' }}
              />

              {/* Layered cascade */}
              {(isCreamTop || isFrappe) && fillPercent > 50 ? (
                <path
                  d={`M102 ${topY} H218 V${topY + (isFrappe ? 48 : 38)} Q188 ${topY + (isFrappe ? 56 : 46)} 160 ${topY + (isFrappe ? 50 : 40)} T102 ${topY + (isFrappe ? 52 : 42)} Z`}
                  fill={crema}
                  style={{ transition: 'all 0.5s ease' }}
                />
              ) : (
                (isDirty || isLemon) &&
                fillPercent > 75 && (
                  <path
                    d={`M102 ${topY} H218 V${topY + 46} Q188 ${topY + 62} 160 ${topY + 50} T102 ${topY + 54} Z`}
                    fill={liquid}
                    opacity="0.92"
                    style={{ transition: 'all 0.5s ease' }}
                  />
                )
              )}

              {step.hasIce && (
                <g opacity="0.72">
                  <rect x="128" y="138" width="26" height="26" rx="5" transform="rotate(-10 141 151)" fill="#FFFFFF" stroke="#B6CAD2" strokeWidth="1.5" />
                  <rect x="160" y="156" width="28" height="28" rx="5" transform="rotate(14 174 170)" fill="#FFFFFF" stroke="#B6CAD2" strokeWidth="1.5" />
                  <rect x="136" y="182" width="24" height="24" rx="5" transform="rotate(8 148 194)" fill="#FFFFFF" stroke="#B6CAD2" strokeWidth="1.5" />
                </g>
              )}

              {isLemon && !isFrappe && (
                <g transform="translate(186, 118) rotate(20)">
                  <circle
                    cx="0"
                    cy="0"
                    r="18"
                    fill={isOrange ? '#E87B22' : '#E8BE3C'}
                    stroke={isOrange ? '#FFE2B8' : '#FFF4C2'}
                    strokeWidth="3"
                  />
                  <line x1="-14" y1="0" x2="14" y2="0" stroke={isOrange ? '#FFE2B8' : '#FFF4C2'} strokeWidth="1.5" />
                  <line x1="0" y1="-14" x2="0" y2="14" stroke={isOrange ? '#FFE2B8' : '#FFF4C2'} strokeWidth="1.5" />
                </g>
              )}

              {isDirty && fillPercent >= 90 && (
                <g fill={isCreamTop ? '#7D4E32' : '#E6B24C'}>
                  <circle cx="144" cy={topY + 8} r="2.8" />
                  <circle cx="158" cy={topY + 6} r="3.2" />
                  <circle cx="171" cy={topY + 9} r="2.6" />
                  <circle cx="152" cy={topY + 12} r="2.2" />
                </g>
              )}
            </>
          )}
        </g>

        <line x1="120" y1="90" x2="128" y2="220" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
        <SteamCurls show={step.hasSteam} y={70} />
      </svg>
    )
  }

  // 7. Vacuum Siphon (Syphon) Glass Brewer
  if (coffee.method === 'syphon') {
    const isRising = step.phase === 'bloom'
    const isSteeping = step.phase === 'pour'
    const isDrawdown = step.phase === 'extract' || step.phase === 'finish'

    const upperFillH = isRising
      ? Math.round(14 + stepProgress * 44)
      : isSteeping
        ? 58
        : isDrawdown
          ? Math.max(6, Math.round(58 * (1 - stepProgress)))
          : 0
    const lowerFillH = isRising
      ? Math.max(12, Math.round(48 * (1 - stepProgress * 0.72)))
      : isSteeping
        ? 14
        : isDrawdown
          ? Math.round(14 + stepProgress * 44)
          : 44

    const isHeating = isRising || isSteeping

    return (
      <svg viewBox="0 0 320 270" width="100%" style={{ maxWidth: 340 }} aria-label="虹吸壶真空萃取实时演示">
        <defs>
          <clipPath id="syphon-upper-clip">
            <rect x="122" y="42" width="76" height="72" rx="16" />
          </clipPath>
          <clipPath id="syphon-lower-clip">
            <circle cx="160" cy="182" r="40" />
          </clipPath>
        </defs>

        {/* Brass Stand & Alcohol Burner */}
        <path d="M98 242 H222 M204 242 V132 H186" stroke="#8E5C29" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="136" y="230" width="48" height="12" rx="5" fill="#B88446" stroke="#3E2A20" strokeWidth="1.6" />
        {isHeating && (
          <g>
            <path d="M160 212 C152 222, 154 230, 160 230 C166 230, 168 222, 160 212 Z" fill="#E68A3E" opacity="0.9" />
            <path d="M160 218 C156 224, 157 229, 160 229 C163 229, 164 224, 160 218 Z" fill="#FCE29C" />
          </g>
        )}

        {/* Lower Glass Bulb */}
        <circle cx="160" cy="182" r="40" fill="rgba(255,255,255,0.68)" stroke="#3E2A20" strokeWidth="2.3" />
        <g clipPath="url(#syphon-lower-clip)">
          <rect
            x="116"
            y={222 - lowerFillH}
            width="88"
            height={lowerFillH + 8}
            fill={isDrawdown ? liquid : '#D8E6EC'}
            opacity={isDrawdown ? 0.94 : 0.78}
            style={{ transition: 'y 0.4s linear, height 0.4s linear, fill 0.5s ease' }}
          />
          {isDrawdown && (
            <ellipse cx="160" cy={222 - lowerFillH} rx="38" ry="5" fill={crema} opacity="0.78" />
          )}
        </g>

        {/* Rubber Collar & Glass Siphon Tube */}
        <rect x="148" y="132" width="24" height="14" rx="4" fill="#2A1D16" />
        <rect x="156" y="112" width="8" height="94" fill="rgba(255,255,255,0.55)" stroke="#3E2A20" strokeWidth="1.6" />
        {(isRising || isDrawdown) && activePour && (
          <line
            className="svg-pour-stream"
            x1="160"
            y1="114"
            x2="160"
            y2="202"
            stroke={isDrawdown ? liquid : '#B8D4DC'}
            strokeWidth="4.2"
          />
        )}

        {/* Upper Glass Chamber */}
        <rect x="122" y="42" width="76" height="72" rx="16" fill="rgba(255,255,255,0.7)" stroke="#3E2A20" strokeWidth="2.3" />
        <g clipPath="url(#syphon-upper-clip)">
          {upperFillH > 0 && (
            <>
              <rect
                x="118"
                y={114 - upperFillH}
                width="84"
                height={upperFillH + 6}
                fill={liquid}
                style={{ transition: 'y 0.4s linear, height 0.4s linear' }}
              />
              <rect
                x="118"
                y={114 - upperFillH}
                width="84"
                height="9"
                fill={crema}
                opacity="0.85"
                style={{ transition: 'y 0.4s linear' }}
              />
            </>
          )}
          {step.isBlooming && (
            <g>
              <circle className="svg-bloom-bubble" cx="146" cy={114 - upperFillH + 14} r="4.5" fill={crema} />
              <circle className="svg-bloom-bubble" cx="162" cy={114 - upperFillH + 18} r="5.5" fill={crema} />
              <circle className="svg-bloom-bubble" cx="174" cy={114 - upperFillH + 13} r="4" fill={crema} />
            </g>
          )}
        </g>

        {/* Cloth Filter Disk */}
        <ellipse cx="160" cy="112" rx="14" ry="3.5" fill="#F2E7D3" stroke="#6E4E34" strokeWidth="1.4" />
        <SteamCurls show={step.hasSteam} y={38} />
      </svg>
    )
  }

  // 8. Turkish Copper Cezve / Ibrik over Warm Flame
  if (coffee.method === 'turkish') {
    const foamRise =
      step.phase === 'bloom'
        ? Math.round(stepProgress * 18)
        : step.phase === 'extract'
          ? 20
          : step.phase === 'finish'
            ? 10
            : 4
    const isHeating = step.phase === 'bloom' || step.phase === 'extract'

    return (
      <svg viewBox="0 0 320 270" width="100%" style={{ maxWidth: 340 }} aria-label="土耳其铜壶煮制实时演示">
        {/* Warm Brass Burner / Sand Bed */}
        <ellipse cx="148" cy="236" rx="74" ry="12" fill="#D2B086" stroke="#7A5B47" strokeWidth="1.6" />
        {isHeating && (
          <g>
            <ellipse cx="148" cy="230" rx="44" ry="7" fill="#E37C35" opacity="0.52" />
            <path d="M132 232 Q138 218 144 232 M148 232 Q154 214 160 232 M162 232 Q166 220 170 232" stroke="#F6C86E" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Long Brass & Walnut Handle */}
        <path
          d="M192 146 L278 96"
          stroke="#463125"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M192 146 L236 120"
          stroke="#C28848"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Hammered Copper Cezve Body */}
        <path
          d="M108 124 H188 L206 218 C207 224 201 230 194 230 H102 C95 230 89 224 90 218 Z"
          fill="#C57D3E"
          stroke="#3E2A20"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Copper Highlight & Decorative Band */}
        <path d="M118 134 L106 218" stroke="#E8B27A" strokeWidth="5" strokeLinecap="round" opacity="0.45" />
        <path d="M102 164 H194" stroke="#8C4E22" strokeWidth="2.2" opacity="0.7" />
        <path d="M98 172 H198" stroke="#E5B076" strokeWidth="1.4" opacity="0.7" />

        {/* Rising Dark Coffee & Cardamom Foam Crown */}
        <ellipse
          cx="148"
          cy={124 - foamRise * 0.4}
          rx="40"
          ry={10 + foamRise * 0.35}
          fill={liquid}
          stroke="#3E2A20"
          strokeWidth="1.8"
          style={{ transition: 'all 0.4s ease' }}
        />
        <ellipse
          cx="148"
          cy={122 - foamRise * 0.5}
          rx="36"
          ry={8 + foamRise * 0.3}
          fill={crema}
          opacity="0.92"
          style={{ transition: 'all 0.4s ease' }}
        />
        {step.isBlooming && (
          <g>
            <circle className="svg-bloom-bubble" cx="132" cy={118 - foamRise * 0.5} r="5" fill="#E8B77C" />
            <circle className="svg-bloom-bubble" cx="150" cy={114 - foamRise * 0.5} r="6.5" fill="#F2CA93" />
            <circle className="svg-bloom-bubble" cx="166" cy={118 - foamRise * 0.5} r="4.5" fill="#E8B77C" />
          </g>
        )}

        <SteamCurls show={step.hasSteam} y={92} />
      </svg>
    )
  }

  // 9. Vietnamese Phin Metal Drip Filter & Golden Whipped Egg-Cream Glass
  if (coffee.method === 'phin') {
    const isFinished = step.phase === 'finish'
    const isWhipping = step.phase === 'milk'
    const showPhinOnCup = !isFinished
    const coffeeH = Math.round((Math.min(fillPercent, 65) / 100) * 102)
    const coffeeY = 232 - coffeeH
    const showEggFoam = isFinished || isWhipping

    return (
      <svg viewBox="0 0 320 270" width="100%" style={{ maxWidth: 340 }} aria-label="越南滴漏壶与河内蛋咖啡实时演示">
        <defs>
          <clipPath id="phin-cup-clip">
            <path d="M112 138 H208 L198 228 C197 234 191 238 184 238 H136 C129 238 123 234 122 228 Z" />
          </clipPath>
        </defs>

        {/* Warm Water Bath Saucer (Hanoi Classic) */}
        <ellipse cx="160" cy="242" rx="76" ry="10" fill="#EFE7D8" stroke="#B88446" strokeWidth="2" />
        <ellipse cx="160" cy="240" rx="58" ry="6" fill="#D6E6EE" opacity="0.6" />

        {/* Lower Heatproof Glass Cup */}
        <path
          d="M112 138 H208 L198 228 C197 234 191 238 184 238 H136 C129 238 123 234 122 228 Z"
          fill="rgba(255,255,255,0.68)"
          stroke="#3E2A20"
          strokeWidth="2.4"
        />

        <g clipPath="url(#phin-cup-clip)">
          {/* Rich Vietnamese Dark Drip Coffee */}
          <rect
            x="108"
            y={coffeeY}
            width="104"
            height={coffeeH + 12}
            fill={liquid}
            style={{ transition: 'y 0.4s linear, height 0.4s linear' }}
          />
          {/* Lush Golden Whipped Egg-Yolk Cream Topping */}
          {showEggFoam && (
            <path
              d={`M108 ${coffeeY - (isFinished ? 40 : 20)} H212 V${coffeeY + 6} Q184 ${coffeeY + 14} 160 ${coffeeY + 8} T108 ${coffeeY + 10} Z`}
              fill={crema}
              style={{ transition: 'all 0.5s ease' }}
            />
          )}
          {/* Cocoa dust garnish on finish */}
          {isFinished && (
            <g fill="#5C3118" opacity="0.72">
              <circle cx="142" cy={coffeeY - 28} r="2.2" />
              <circle cx="156" cy={coffeeY - 32} r="2.5" />
              <circle cx="170" cy={coffeeY - 27} r="2.1" />
              <circle cx="162" cy={coffeeY - 22} r="1.9" />
              <circle cx="149" cy={coffeeY - 21} r="1.8" />
            </g>
          )}
        </g>

        {/* Slow Rich Drip Drop from Phin Filter */}
        {showPhinOnCup && (activePour || step.phase === 'bloom' || step.phase === 'extract') && (
          <circle className="svg-drip" cx="160" cy="140" r="3.8" fill={liquid} />
        )}

        {/* Stainless Steel Vietnamese Phin Filter Sitting on Rim */}
        {showPhinOnCup && (
          <g>
            {/* Base Flange Plate */}
            <rect x="102" y="131" width="116" height="7" rx="3.5" fill="#C9C0B3" stroke="#3E2A20" strokeWidth="1.8" />
            {/* Phin Chamber */}
            <path
              d="M124 72 H196 L190 131 H130 Z"
              fill="#DFD8CC"
              stroke="#3E2A20"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            {/* Metallic sheen highlight */}
            <line x1="136" y1="80" x2="140" y2="124" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
            {/* Side little wire handle */}
            <path d="M194 86 H208 C214 86 216 92 215 99 L212 114 H192" stroke="#3E2A20" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            {/* Lid on top */}
            <rect x="120" y="65" width="80" height="7" rx="3.5" fill="#C9C0B3" stroke="#3E2A20" strokeWidth="1.8" />
            <rect x="152" y="57" width="16" height="8" rx="3" fill="#463125" />
          </g>
        )}

        <SteamCurls show={step.hasSteam} y={showPhinOnCup ? 54 : 112} />
      </svg>
    )
  }

  // 7. Classic Octagonal Moka Pot
  const upperFill = Math.round((fillPercent / 100) * 66)
  return (
    <svg viewBox="0 0 320 270" width="100%" style={{ maxWidth: 340 }} aria-label="摩卡壶萃取实时演示">
      {(step.phase === 'bloom' || step.phase === 'extract') && (
        <ellipse cx="160" cy="244" rx="56" ry="9" fill="#D97836" opacity="0.45" />
      )}

      <polygon
        points="126,158 194,158 214,236 106,236"
        fill="#D7CFC2"
        stroke="#3E2A20"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <line x1="160" y1="158" x2="160" y2="236" stroke="#B7AEA0" strokeWidth="2" />

      <circle cx="186" cy="186" r="5" fill="#C28C4D" stroke="#3E2A20" strokeWidth="1.4" />

      <polygon
        points="108,82 212,82 194,158 126,158"
        fill="#EFE8DC"
        stroke="#3E2A20"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      <rect
        x="128"
        y={154 - upperFill}
        width="64"
        height={upperFill}
        rx="4"
        fill={liquid}
        opacity="0.9"
        style={{ transition: 'y 0.4s linear, height 0.4s linear' }}
      />

      <rect x="155" y="102" width="10" height="54" rx="3" fill="#B7AEA0" stroke="#3E2A20" strokeWidth="1.5" />
      {activePour && (
        <g>
          <path className="svg-pour-stream" d="M155 104 Q142 106 140 124" stroke={crema} strokeWidth="3.2" fill="none" />
          <path className="svg-pour-stream" d="M165 104 Q178 106 180 124" stroke={crema} strokeWidth="3.2" fill="none" />
        </g>
      )}

      <path d="M108 82 L160 58 L212 82 Z" fill="#D7CFC2" stroke="#3E2A20" strokeWidth="2.4" strokeLinejoin="round" />
      <rect x="153" y="45" width="14" height="13" rx="4" fill="#2A1D16" />

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
