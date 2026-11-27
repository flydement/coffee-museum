import { useMemo, useState } from 'react'
import {
  BREW_TROUBLESHOOT_CASES,
  COFFEE_ORIGINS,
  COFFEE_TRIVIA_QUESTIONS,
  FLAVOR_WHEEL_FAMILIES,
  PROCESS_GUIDES,
  ROAST_STAGES,
  type CoffeeTriviaQuestion,
  type OriginRegion,
} from '../data/atlas'
import { COFFEE_EXHIBITS } from '../data/coffees'
import type { AtlasSection, CoffeeExhibit } from '../types/coffee'
import {
  BEAN_CAFFEINE_OPTIONS,
  BREW_CALC_PRESETS,
  calculateBrewMetrics,
  type BeanCaffeineTypeId,
  type BrewCalcStyleId,
} from '../utils/calculator'
import { playGentleChime } from '../utils/platform'
import { CupEmblem } from './Icons'

type BeltFilterId = 'all' | 'africa' | 'americas' | 'asia-pacific'

interface BeltSummary {
  id: Exclude<BeltFilterId, 'all'>
  title: string
  range: string
  flavor: string
  defaultOriginId: string
  continents: OriginRegion['continent'][]
}

const COFFEE_BELT_SUMMARIES: BeltSummary[] = [
  {
    id: 'africa',
    title: '非洲 · 东非高地',
    range: '1,650 – 2,200 m',
    flavor: '茉莉白花 · 黑醋栗与明亮果汁酸',
    defaultOriginId: 'ethiopia',
    continents: ['非洲'],
  },
  {
    id: 'americas',
    title: '美洲 · 安第斯与火山带',
    range: '1,000 – 1,950 m',
    flavor: '玫瑰蜜感 · 烤坚果与焦糖巧克力',
    defaultOriginId: 'colombia',
    continents: ['中美洲与加勒比', '南美洲'],
  },
  {
    id: 'asia-pacific',
    title: '亚太与地中海风土',
    range: '450 – 2,400 m',
    flavor: '东方野蜜茶韵 · 雪松草本与复古器具',
    defaultOriginId: 'yunnan',
    continents: ['亚洲', '太平洋与大洋洲', '欧洲与地中海'],
  },
]

interface CoffeeAtlasProps {
  onInspect: (coffee: CoffeeExhibit) => void
  onStartBrew: (coffee: CoffeeExhibit) => void
  bestQuizScore: number
  onFinishQuiz: (score: number, total: number) => void
  activeSection?: AtlasSection
  onChangeSection?: (section: AtlasSection) => void
}

function pickQuizRound(count = 5): CoffeeTriviaQuestion[] {
  const pool = [...COFFEE_TRIVIA_QUESTIONS]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}

export function CoffeeAtlas({
  onInspect,
  onStartBrew,
  bestQuizScore,
  onFinishQuiz,
  activeSection,
  onChangeSection,
}: CoffeeAtlasProps) {
  const [internalSection, setInternalSection] = useState<AtlasSection>('map')
  const section = activeSection ?? internalSection
  const setSection = (next: AtlasSection) => {
    setInternalSection(next)
    onChangeSection?.(next)
  }
  const [selectedOriginId, setSelectedOriginId] = useState<string>(COFFEE_ORIGINS[0].id)
  const [beltFilter, setBeltFilter] = useState<BeltFilterId>('all')
  const [dossierExpanded, setDossierExpanded] = useState<boolean>(false)
  const [selectedWheelId, setSelectedWheelId] = useState<string>(FLAVOR_WHEEL_FAMILIES[0].id)
  const [wheelExpanded, setWheelExpanded] = useState<boolean>(false)
  const [calcStyle, setCalcStyle] = useState<BrewCalcStyleId>('pourover')
  const [calcDose, setCalcDose] = useState<number>(15)
  const [calcSecond, setCalcSecond] = useState<number>(15)
  const [calcBeanType, setCalcBeanType] = useState<BeanCaffeineTypeId>('arabica')
  const [selectedRoast, setSelectedRoast] = useState<number>(2)
  const [selectedProcessId, setSelectedProcessId] = useState<string>(PROCESS_GUIDES[0].id)
  const [selectedCaseId, setSelectedCaseId] = useState<string>(BREW_TROUBLESHOOT_CASES[0].id)

  // Quiz state
  const [roundQuestions, setRoundQuestions] = useState<CoffeeTriviaQuestion[]>(() =>
    pickQuizRound(5)
  )
  const [qIndex, setQIndex] = useState(0)
  const [pickedOption, setPickedOption] = useState<number | null>(null)
  const [roundScore, setRoundScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)

  const selectedOrigin = useMemo(
    () => COFFEE_ORIGINS.find((o) => o.id === selectedOriginId) ?? COFFEE_ORIGINS[0],
    [selectedOriginId]
  )

  const selectOrigin = (originId: string) => {
    setSelectedOriginId(originId)
    setDossierExpanded(false)
    playGentleChime('tick')
  }

  const matchesBelt = (origin: OriginRegion, filter: BeltFilterId): boolean => {
    if (filter === 'all') return true
    const belt = COFFEE_BELT_SUMMARIES.find((b) => b.id === filter)
    return belt ? belt.continents.includes(origin.continent) : true
  }

  const filteredOrigins = useMemo(
    () => COFFEE_ORIGINS.filter((o) => matchesBelt(o, beltFilter)),
    [beltFilter]
  )

  // Render active pin last so highlighted dot & label always stay cleanly on top in SVG order
  const orderedMapOrigins = useMemo(() => {
    const rest = COFFEE_ORIGINS.filter((o) => o.id !== selectedOrigin.id)
    return [...rest, selectedOrigin]
  }, [selectedOrigin])

  const altitudePercent = useMemo(() => {
    if (!selectedOrigin.altitudeMidM) return null
    const clamped = Math.min(Math.max(selectedOrigin.altitudeMidM, 450), 2400)
    return Math.round(((clamped - 450) / (2400 - 450)) * 100)
  }, [selectedOrigin.altitudeMidM])

  const originExhibits = useMemo(() => {
    return COFFEE_EXHIBITS.filter((c) =>
      selectedOrigin.matchKeywords.some(
        (kw) => c.origin.includes(kw) || c.storyYear.includes(kw) || c.name.includes(kw)
      )
    )
  }, [selectedOrigin])

  const activeRoastStage = useMemo(
    () => ROAST_STAGES.find((r) => r.level === selectedRoast) ?? ROAST_STAGES[1],
    [selectedRoast]
  )

  const roastExhibits = useMemo(
    () => COFFEE_EXHIBITS.filter((c) => c.roastValue === selectedRoast),
    [selectedRoast]
  )

  const activeProcess = useMemo(
    () => PROCESS_GUIDES.find((p) => p.id === selectedProcessId) ?? PROCESS_GUIDES[0],
    [selectedProcessId]
  )

  const activeTroubleshoot = useMemo(
    () =>
      BREW_TROUBLESHOOT_CASES.find((item) => item.id === selectedCaseId) ??
      BREW_TROUBLESHOOT_CASES[0],
    [selectedCaseId]
  )

  const practiceExhibit = useMemo(
    () => COFFEE_EXHIBITS.find((c) => c.id === activeTroubleshoot.practiceExhibitId),
    [activeTroubleshoot]
  )

  const activeWheelFamily = useMemo(
    () => FLAVOR_WHEEL_FAMILIES.find((f) => f.id === selectedWheelId) ?? FLAVOR_WHEEL_FAMILIES[0],
    [selectedWheelId]
  )

  const wheelExhibits = useMemo(() => {
    return COFFEE_EXHIBITS.filter((c) => {
      const text = `${c.flavorNotes.join(' ')} ${c.moodTags.join(' ')} ${c.name}`
      return activeWheelFamily.matchKeywords.some((kw) => text.includes(kw))
    })
  }, [activeWheelFamily])

  const calcResult = useMemo(
    () => calculateBrewMetrics(calcStyle, calcDose, calcSecond, calcBeanType),
    [calcBeanType, calcDose, calcSecond, calcStyle]
  )

  const processExhibits = useMemo(
    () =>
      COFFEE_EXHIBITS.filter((c) =>
        activeProcess.matchKeywords.some((kw) => c.process.includes(kw))
      ),
    [activeProcess]
  )

  const currentQ = roundQuestions[qIndex]

  const handleChooseOption = (idx: number) => {
    if (pickedOption !== null) return
    setPickedOption(idx)
    if (idx === currentQ.correctIndex) {
      setRoundScore((s) => s + 1)
      playGentleChime('step')
    } else {
      playGentleChime('tick')
    }
  }

  const handleNextQuestion = () => {
    if (qIndex + 1 >= roundQuestions.length) {
      setQuizFinished(true)
      onFinishQuiz(roundScore, roundQuestions.length)
      playGentleChime('complete')
    } else {
      setQIndex((i) => i + 1)
      setPickedOption(null)
    }
  }

  const handleRestartQuiz = () => {
    setRoundQuestions(pickQuizRound(5))
    setQIndex(0)
    setPickedOption(null)
    setRoundScore(0)
    setQuizFinished(false)
  }

  const getRankLabel = (score: number, total: number) => {
    if (score === total) return '荣誉首席馆长 · 满分通关'
    if (score >= total - 1) return '资深咖啡杯测师'
    if (score >= Math.ceil(total / 2)) return '风味探索学者'
    return '初入展馆见习生'
  }

  return (
    <div className="view-enter">
      <div className="results-header" style={{ marginBottom: 22 }}>
        <div>
          <p className="eyebrow">WORLD COFFEE ATLAS & CURATOR LAB · 咖啡博物图鉴</p>
          <h1 className="section-heading">风土产区、烘焙工艺与趣味问答</h1>
          <p className="section-lead">
            沿着南北回归线之间的“世界咖啡种植带”环游产区，探索烘焙与处理法的风味密码，或挑战馆长快问快答解锁专属徽章。
          </p>
        </div>

        <div className="serving-switcher" role="tablist" aria-label="博物展厅分区">
          {[
            { id: 'map' as const, label: '世界风味地图' },
            { id: 'wheel' as const, label: '风味轮与计算' },
            { id: 'craft' as const, label: '烘焙与处理法' },
            { id: 'troubleshoot' as const, label: '冲煮诊断室' },
            { id: 'quiz' as const, label: `趣味挑战${bestQuizScore > 0 ? ` (${bestQuizScore}/5)` : ''}` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={section === tab.id}
              className={`serving-btn ${section === tab.id ? 'active' : ''}`}
              onClick={() => setSection(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: Interactive World Coffee Belt Map */}
      {section === 'map' && (
        <section className="atlas-map-layout" aria-label="世界咖啡带交互地图">
          <div className="atlas-map-card">
            <div className="atlas-map-header">
              <div>
                <span className="eyebrow" style={{ margin: 0 }}>
                  THE BEAN BELT · 23.5°N — 23.5°S
                </span>
                <div style={{ fontSize: '0.84rem', color: 'var(--espresso-600)', marginTop: 2 }}>
                  点击地图坐标或下方风土带，探索全球 {COFFEE_ORIGINS.length} 大产区与 {COFFEE_EXHIBITS.length} 款馆藏豆单
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                  onClick={() => {
                    const others = COFFEE_ORIGINS.filter((o) => o.id !== selectedOrigin.id)
                    const next = others[Math.floor(Math.random() * others.length)]
                    if (next) {
                      setBeltFilter('all')
                      selectOrigin(next.id)
                    }
                  }}
                >
                  随机环游产区
                </button>
              </div>
            </div>

            <div className="atlas-svg-wrap">
              <svg
                viewBox="0 0 900 420"
                width="100%"
                role="img"
                aria-label="世界咖啡种植带复古地图"
                className="atlas-svg"
              >
                <defs>
                  <linearGradient id="beanBeltGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(199, 147, 85, 0.04)" />
                    <stop offset="50%" stopColor="rgba(199, 147, 85, 0.22)" />
                    <stop offset="100%" stopColor="rgba(199, 147, 85, 0.04)" />
                  </linearGradient>
                </defs>

                {/* Vintage Graticule Grid */}
                {[120, 210, 300].map((y) => (
                  <line
                    key={y}
                    x1="20"
                    y1={y}
                    x2="880"
                    y2={y}
                    stroke="var(--border-subtle)"
                    strokeDasharray={y === 210 ? 'none' : '5 5'}
                    strokeWidth={y === 210 ? 1.2 : 1}
                  />
                ))}
                {[150, 300, 450, 600, 750].map((x) => (
                  <line
                    key={x}
                    x1={x}
                    y1="20"
                    x2={x}
                    y2="400"
                    stroke="var(--border-subtle)"
                    strokeWidth="0.8"
                    opacity="0.6"
                  />
                ))}

                {/* Coffee Belt Highlight Band (23.5N to 23.5S) */}
                <rect x="20" y="146" width="860" height="140" fill="url(#beanBeltGrad)" />
                <line x1="20" y1="146" x2="880" y2="146" stroke="var(--brass-500)" strokeDasharray="4 4" opacity="0.65" />
                <line x1="20" y1="286" x2="880" y2="286" stroke="var(--brass-500)" strokeDasharray="4 4" opacity="0.65" />

                <text x="28" y="140" fontSize="10" fill="var(--brass-700)" fontFamily="var(--font-mono)">
                  23.5°N 北回归线
                </text>
                <text x="28" y="205" fontSize="10" fill="var(--espresso-400)" fontFamily="var(--font-mono)">
                  0° 赤道 EQUATOR
                </text>
                <text x="28" y="300" fontSize="10" fill="var(--brass-700)" fontFamily="var(--font-mono)">
                  23.5°S 南回归线
                </text>

                {/* Stylized Vintage Continents */}
                <g fill="var(--paper-warm)" stroke="var(--border-strong)" strokeWidth="1.2" opacity="0.92">
                  {/* North & Central America */}
                  <path d="M96 64 L224 58 L268 102 L240 144 L212 162 L238 196 L252 206 L236 212 L202 184 L162 152 L114 128 Z" />
                  {/* Caribbean islands */}
                  <ellipse cx="264" cy="176" rx="14" ry="6" />
                  {/* South America */}
                  <path d="M258 214 L306 214 L356 248 L352 296 L316 346 L286 382 L270 370 L264 314 L250 256 Z" />
                  {/* Europe */}
                  <path d="M414 68 L516 58 L544 96 L526 128 L480 134 L436 126 L410 102 Z" />
                  {/* Africa */}
                  <path d="M420 146 L504 142 L548 182 L552 222 L528 278 L496 326 L466 320 L452 252 L416 206 Z" />
                  {/* Asia */}
                  <path d="M532 62 L738 56 L798 106 L776 156 L724 176 L690 202 L654 198 L616 176 L562 172 L538 134 Z" />
                  {/* Indonesia / Maritime SE Asia */}
                  <path d="M674 226 L712 238 L748 242 L742 252 L696 248 L672 236 Z" />
                  {/* Australia */}
                  <path d="M718 282 L796 278 L818 322 L788 354 L732 344 L710 314 Z" />
                </g>

                {/* Interactive Origin Pins (Collision-free directional labels + delicate leader lines) */}
                {orderedMapOrigins.map((origin) => {
                  const active = origin.id === selectedOrigin.id
                  const inBelt = matchesBelt(origin, beltFilter)
                  const dist = Math.hypot(origin.labelDx, origin.labelDy)
                  const showLeader = dist > 17
                  const shortName = origin.name.split('·')[0].trim()
                  return (
                    <g
                      key={origin.id}
                      transform={`translate(${origin.x}, ${origin.y})`}
                      className="atlas-pin"
                      role="button"
                      tabIndex={0}
                      opacity={active || inBelt ? 1 : 0.34}
                      aria-label={`查看产区 ${origin.name}`}
                      onClick={() => selectOrigin(origin.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          selectOrigin(origin.id)
                        }
                      }}
                    >
                      <circle r="16" fill="transparent" />
                      {showLeader && (
                        <line
                          x1="0"
                          y1="0"
                          x2={origin.labelDx * 0.78}
                          y2={origin.labelDy * 0.78}
                          stroke={active ? 'var(--brass-600)' : 'var(--border-strong)'}
                          strokeWidth={active ? '1.3' : '0.9'}
                          strokeDasharray={active ? 'none' : '2 2'}
                          style={{ pointerEvents: 'none' }}
                        />
                      )}
                      {active && (
                        <circle
                          r="17"
                          fill="rgba(199, 147, 85, 0.28)"
                          className="atlas-pin-pulse"
                        />
                      )}
                      <circle
                        r={active ? 8 : 5.6}
                        fill={active ? 'var(--brass-600)' : 'var(--espresso-900)'}
                        stroke="var(--paper-surface)"
                        strokeWidth="2.1"
                      />
                      <text
                        x={origin.labelDx}
                        y={origin.labelDy}
                        textAnchor={origin.labelAnchor}
                        dominantBaseline="middle"
                        fontSize={active ? '11.8' : '10.4'}
                        fontWeight={active ? '700' : '600'}
                        fill={active ? 'var(--brass-700)' : 'var(--espresso-900)'}
                        stroke="var(--paper-surface)"
                        strokeWidth="3.6"
                        strokeLinejoin="round"
                        paintOrder="stroke"
                        style={{ pointerEvents: 'none' }}
                      >
                        {shortName}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Region Belt Filter & Quick Origin Selector */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginBottom: 10,
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--espresso-600)' }}>
                  产区快捷直达（{filteredOrigins.length} / {COFFEE_ORIGINS.length}）
                </span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[
                    { id: 'all' as const, label: '全部产区' },
                    { id: 'africa' as const, label: '非洲' },
                    { id: 'americas' as const, label: '美洲' },
                    { id: 'asia-pacific' as const, label: '亚太与欧洲' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`filter-pill ${beltFilter === tab.id ? 'active' : ''}`}
                      style={{ padding: '3px 10px', fontSize: '0.74rem' }}
                      onClick={() => {
                        setBeltFilter(tab.id)
                        if (tab.id !== 'all' && !matchesBelt(selectedOrigin, tab.id)) {
                          const targetBelt = COFFEE_BELT_SUMMARIES.find((b) => b.id === tab.id)
                          if (targetBelt) selectOrigin(targetBelt.defaultOriginId)
                        }
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pill-row">
                {filteredOrigins.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`mood-pill ${o.id === selectedOrigin.id ? 'active' : ''}`}
                    style={{ padding: '5px 11px', fontSize: '0.78rem' }}
                    onClick={() => selectOrigin(o.id)}
                  >
                    {o.name.split('·')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Three Major Coffee Belt Guides (Symmetrical Enrichment) */}
            <div className="atlas-belt-grid" aria-label="全球三大咖啡风土带概览">
              {COFFEE_BELT_SUMMARIES.map((belt) => {
                const isBeltActive =
                  beltFilter === belt.id ||
                  (beltFilter === 'all' && belt.continents.includes(selectedOrigin.continent))
                return (
                  <button
                    key={belt.id}
                    type="button"
                    className={`atlas-belt-card ${isBeltActive ? 'active' : ''}`}
                    onClick={() => {
                      setBeltFilter(beltFilter === belt.id ? 'all' : belt.id)
                      if (!belt.continents.includes(selectedOrigin.continent)) {
                        selectOrigin(belt.defaultOriginId)
                      }
                    }}
                  >
                    <div className="atlas-belt-title">
                      <span>{belt.title}</span>
                    </div>
                    <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--brass-700)' }}>
                      {belt.range}
                    </span>
                    <span className="atlas-belt-desc">{belt.flavor}</span>
                  </button>
                )
              })}
            </div>

            {/* Selected Origin Altitude Ruler & Microclimate Archival Strip */}
            <div className="atlas-climate-strip">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--espresso-600)', fontWeight: 600 }}>
                    当前产区微气候签名 · {selectedOrigin.name.split('·')[0].trim()}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--espresso-950)', fontWeight: 600, marginTop: 2 }}>
                    {selectedOrigin.climate}
                  </div>
                </div>
                <span className="tag tag-brass mono" style={{ fontSize: '0.74rem' }}>
                  {selectedOrigin.altitude}
                </span>
              </div>

              {altitudePercent !== null ? (
                <div>
                  <div className="atlas-altitude-track" aria-hidden="true">
                    <span
                      className="atlas-altitude-marker"
                      style={{ left: `${altitudePercent}%` }}
                    />
                  </div>
                  <div
                    className="mono"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.68rem',
                      color: 'var(--espresso-500)',
                      marginTop: 6,
                    }}
                  >
                    <span>450m 海岛火山</span>
                    <span>1,350m 经典中海拔</span>
                    <span>2,400m 云雾极高海拔</span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.76rem', color: 'var(--espresso-600)' }}>
                  人文器具摇篮产区：以意式蒸汽萃取、摩卡壶微压、维也纳雪顶与奥斯曼铜壶闻名世界。
                </div>
              )}
            </div>
          </div>

          {/* Origin Detail Dossier Panel */}
          <aside className="atlas-dossier-card">
            <p className="eyebrow" style={{ marginBottom: 4 }}>
              {selectedOrigin.continent} · ORIGIN DOSSIER
            </p>
            <h2 className="section-heading" style={{ fontSize: '1.45rem', marginBottom: 2 }}>
              {selectedOrigin.name}
            </h2>
            <p className="exhibit-en" style={{ marginBottom: 14 }}>
              {selectedOrigin.englishName}
            </p>

            <div className="specimen-curator-box" style={{ margin: '0 0 14px' }}>
              {selectedOrigin.story}
            </div>

            <div className="spec-kpi-grid" style={{ margin: '0 0 14px' }}>
              <div className="spec-kpi">
                <span className="spec-kpi-label">代表海拔</span>
                <span className="spec-kpi-value" style={{ fontSize: '0.94rem' }}>
                  {selectedOrigin.altitude}
                </span>
              </div>
              <div className="spec-kpi">
                <span className="spec-kpi-label">标志品种</span>
                <span className="spec-kpi-value" style={{ fontSize: '0.9rem' }}>
                  {selectedOrigin.varieties}
                </span>
              </div>
            </div>

            <div className="spec-kpi" style={{ marginBottom: 16 }}>
              <span className="spec-kpi-label">风土风味签名</span>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--brass-700)' }}>
                {selectedOrigin.signatureFlavor}
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                  本馆收录产区展品（共 {originExhibits.length} 款
                  {originExhibits.length > 4 && !dossierExpanded ? '，展示前 4 款' : ''}）
                </span>
                {originExhibits.length > 4 && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '3px 9px', fontSize: '0.74rem' }}
                    onClick={() => setDossierExpanded((v) => !v)}
                  >
                    {dossierExpanded ? '收起 ↑' : `展开全部 ${originExhibits.length} 款 ↓`}
                  </button>
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9,
                  maxHeight: dossierExpanded ? 380 : 'none',
                  overflowY: dossierExpanded ? 'auto' : 'visible',
                  paddingRight: dossierExpanded ? 4 : 0,
                }}
              >
                {(dossierExpanded ? originExhibits : originExhibits.slice(0, 4)).map((c) => (
                  <div key={c.id} className="atlas-mini-exhibit">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <CupEmblem
                        method={c.method}
                        liquid={c.palette.liquid}
                        crema={c.palette.crema}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontWeight: 700,
                            fontSize: '0.92rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {c.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--espresso-600)' }}>
                          {c.roast} · {c.methodLabel}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                        onClick={() => onInspect(c)}
                      >
                        档案
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                        onClick={() => onStartBrew(c)}
                      >
                        冲煮
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      )}

      {/* SECTION 2: Interactive Coffee Flavor Wheel & Universal Brew Calculator */}
      {section === 'wheel' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <section className="atlas-craft-card" aria-label="交互式精品咖啡风味轮">
            <p className="eyebrow">SCA INSPIRED FLAVOR WHEEL · 交互式咖啡风味轮</p>
            <h2 className="section-heading" style={{ fontSize: '1.42rem', marginBottom: 6 }}>
              转动风味罗盘，按香气家族发现对应馆藏
            </h2>
            <p className="section-lead" style={{ marginBottom: 20 }}>
              点击风味轮上任意扇区，探索该香气家族的代表词条，并从全馆 {COFFEE_EXHIBITS.length} 款豆单中精准筛出吻合展品。
            </p>

            <div className="wheel-explorer-grid">
              <div className="wheel-svg-box">
                <svg
                  viewBox="0 0 320 320"
                  width="100%"
                  style={{ maxWidth: 320 }}
                  role="img"
                  aria-label="六大咖啡风味家族交互风味轮"
                >
                  {FLAVOR_WHEEL_FAMILIES.map((fam, idx) => {
                    const count = FLAVOR_WHEEL_FAMILIES.length
                    const startDeg = (idx * 360) / count - 90
                    const endDeg = ((idx + 1) * 360) / count - 90
                    const midDeg = (startDeg + endDeg) / 2
                    const toRad = (d: number) => (d * Math.PI) / 180
                    const active = fam.id === activeWheelFamily.id
                    const rOuter = active ? 142 : 132
                    const rInner = 54
                    const cx = 160
                    const cy = 160

                    const x1 = cx + rOuter * Math.cos(toRad(startDeg))
                    const y1 = cy + rOuter * Math.sin(toRad(startDeg))
                    const x2 = cx + rOuter * Math.cos(toRad(endDeg))
                    const y2 = cy + rOuter * Math.sin(toRad(endDeg))
                    const x3 = cx + rInner * Math.cos(toRad(endDeg))
                    const y3 = cy + rInner * Math.sin(toRad(endDeg))
                    const x4 = cx + rInner * Math.cos(toRad(startDeg))
                    const y4 = cy + rInner * Math.sin(toRad(startDeg))

                    const d = [
                      `M ${x1.toFixed(1)} ${y1.toFixed(1)}`,
                      `A ${rOuter} ${rOuter} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`,
                      `L ${x3.toFixed(1)} ${y3.toFixed(1)}`,
                      `A ${rInner} ${rInner} 0 0 0 ${x4.toFixed(1)} ${y4.toFixed(1)}`,
                      'Z',
                    ].join(' ')

                    const labelR = 96
                    const lx = cx + labelR * Math.cos(toRad(midDeg))
                    const ly = cy + labelR * Math.sin(toRad(midDeg))

                    return (
                      <g
                        key={fam.id}
                        className="wheel-slice"
                        role="button"
                        tabIndex={0}
                        aria-label={`选择风味家族：${fam.name}`}
                        onClick={() => {
                          setSelectedWheelId(fam.id)
                          setWheelExpanded(false)
                          playGentleChime('tick')
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setSelectedWheelId(fam.id)
                            setWheelExpanded(false)
                          }
                        }}
                      >
                        <path
                          d={d}
                          fill={fam.color}
                          fillOpacity={active ? 0.96 : 0.72}
                          stroke="var(--paper-surface)"
                          strokeWidth={active ? 3.5 : 2}
                          style={{ transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
                        />
                        <text
                          x={lx}
                          y={ly}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#FCF9F3"
                          fontSize={active ? '12.5' : '11.5'}
                          fontWeight="700"
                          style={{ pointerEvents: 'none' }}
                        >
                          {fam.name}
                        </text>
                      </g>
                    )
                  })}
                  <circle cx="160" cy="160" r="50" fill="var(--paper-surface)" stroke="var(--border-brass)" strokeWidth="2" />
                  <text x="160" y="154" textAnchor="middle" fontSize="11" fill="var(--brass-700)" fontWeight="700">
                    FLAVOR
                  </text>
                  <text x="160" y="170" textAnchor="middle" fontSize="12" fill="var(--espresso-950)" fontWeight="700">
                    风味罗盘
                  </text>
                </svg>
              </div>

              <div className="wheel-detail-col">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: activeWheelFamily.color,
                      display: 'inline-block',
                    }}
                  />
                  <span className="eyebrow" style={{ margin: 0 }}>
                    {activeWheelFamily.englishName}
                  </span>
                </div>
                <h3 className="exhibit-title" style={{ fontSize: '1.35rem', marginBottom: 6 }}>
                  {activeWheelFamily.name}家族
                </h3>
                <p style={{ margin: '0 0 12px', fontSize: '0.92rem', color: 'var(--espresso-800)' }}>
                  {activeWheelFamily.description}
                </p>

                <div className="pill-row" style={{ marginBottom: 16 }}>
                  {activeWheelFamily.subNotes.map((sub) => (
                    <span
                      key={sub}
                      className="tag"
                      style={{
                        background: activeWheelFamily.lightColor,
                        borderColor: activeWheelFamily.color,
                        color: 'var(--espresso-950)',
                      }}
                    >
                      {sub}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    marginBottom: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    全馆吻合展品（共 {wheelExhibits.length} 款
                    {wheelExhibits.length > 5 && !wheelExpanded ? '，展示前 5 款' : ''}）：
                  </span>
                  {wheelExhibits.length > 5 && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.76rem' }}
                      onClick={() => setWheelExpanded((v) => !v)}
                    >
                      {wheelExpanded ? '收起列表 ↑' : `展开全部 ${wheelExhibits.length} 款 ↓`}
                    </button>
                  )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    maxHeight: wheelExpanded ? 420 : 'none',
                    overflowY: wheelExpanded ? 'auto' : 'visible',
                    paddingRight: wheelExpanded ? 4 : 0,
                  }}
                >
                  {(wheelExpanded ? wheelExhibits : wheelExhibits.slice(0, 5)).map((c) => (
                    <div key={c.id} className="atlas-mini-exhibit">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <CupEmblem
                          method={c.method}
                          liquid={c.palette.liquid}
                          crema={c.palette.crema}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{c.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--espresso-600)' }}>
                            {c.flavorNotes.slice(0, 3).join(' · ')}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                          onClick={() => onInspect(c)}
                        >
                          档案
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                          onClick={() => onStartBrew(c)}
                        >
                          冲煮
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Universal Golden Ratio & Caffeine Estimator (8 Categories + 3 Bean Types) */}
          <section className="atlas-craft-card" aria-label="万能粉水比与咖啡因计算器">
            <div className="atlas-map-header" style={{ marginBottom: 14 }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: 4 }}>
                  BREW RATIO & CAFFEINE CALCULATOR · 万能粉水与咖啡因估算
                </p>
                <h2 className="section-heading" style={{ fontSize: '1.4rem', marginBottom: 0 }}>
                  手头有一包任意咖啡豆？8 大冲煮品类一键换算黄金比例与咖啡因
                </h2>
              </div>
              <span className="tag tag-brass mono">{calcResult.styleBadge}</span>
            </div>

            <div className="calc-preset-grid" role="group" aria-label="选择冲煮品类">
              {BREW_CALC_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`calc-preset-btn ${calcStyle === preset.id ? 'active' : ''}`}
                  onClick={() => {
                    setCalcStyle(preset.id)
                    setCalcDose(preset.defaultDose)
                    setCalcSecond(preset.defaultSecond)
                    playGentleChime('tick')
                  }}
                >
                  <span className="calc-preset-name">{preset.shortLabel}</span>
                  <span className="calc-preset-hint">{preset.ratioHint}</span>
                </button>
              ))}
            </div>

            {/* Bean Species Caffeine Calibration */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--espresso-600)' }}>
                豆种咖啡因校准：
              </span>
              {BEAN_CAFFEINE_OPTIONS.map((bean) => (
                <button
                  key={bean.id}
                  type="button"
                  className={`filter-pill ${calcBeanType === bean.id ? 'active' : ''}`}
                  style={{ padding: '4px 11px', fontSize: '0.76rem' }}
                  onClick={() => {
                    setCalcBeanType(bean.id)
                    playGentleChime('tick')
                  }}
                >
                  {bean.label}
                </button>
              ))}
            </div>

            <div className="roast-detail-box">
              <div>
                <div className="slider-item">
                  <div className="slider-meta">
                    <span className="slider-name">咖啡豆粉量（{calcResult.preset.label}）</span>
                    <span className="slider-val">{calcResult.clampedDose} g</span>
                  </div>
                  <input
                    type="range"
                    min={calcResult.preset.minDose}
                    max={calcResult.preset.maxDose}
                    step={1}
                    value={calcResult.clampedDose}
                    className="museum-range"
                    style={{
                      background: `linear-gradient(to right, var(--brass-600) ${
                        ((calcResult.clampedDose - calcResult.preset.minDose) /
                          (calcResult.preset.maxDose - calcResult.preset.minDose)) *
                        100
                      }%, var(--paper-warm) ${
                        ((calcResult.clampedDose - calcResult.preset.minDose) /
                          (calcResult.preset.maxDose - calcResult.preset.minDose)) *
                        100
                      }%)`,
                    }}
                    onChange={(e) => setCalcDose(Number(e.target.value))}
                  />
                </div>

                <div className="slider-item" style={{ marginBottom: 14 }}>
                  <div className="slider-meta">
                    <span className="slider-name">
                      {calcResult.preset.secondMode === 'milk-ml'
                        ? '加入鲜奶 / 燕麦奶量'
                        : calcStyle === 'espresso'
                          ? `粉液比例 · ${calcResult.styleBadge}`
                          : '粉水比例'}
                    </span>
                    <span className="slider-val">
                      {calcResult.preset.secondMode === 'milk-ml'
                        ? `${calcResult.clampedSecond} ml`
                        : `1 : ${
                            calcResult.preset.stepSecond < 1
                              ? calcResult.clampedSecond.toFixed(1)
                              : calcResult.clampedSecond
                          }`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={calcResult.preset.minSecond}
                    max={calcResult.preset.maxSecond}
                    step={calcResult.preset.stepSecond}
                    value={calcResult.clampedSecond}
                    className="museum-range"
                    style={{
                      background: `linear-gradient(to right, var(--brass-600) ${
                        ((calcResult.clampedSecond - calcResult.preset.minSecond) /
                          (calcResult.preset.maxSecond - calcResult.preset.minSecond)) *
                        100
                      }%, var(--paper-warm) ${
                        ((calcResult.clampedSecond - calcResult.preset.minSecond) /
                          (calcResult.preset.maxSecond - calcResult.preset.minSecond)) *
                        100
                      }%)`,
                    }}
                    onChange={(e) => setCalcSecond(Number(e.target.value))}
                  />
                </div>

                <div className="barista-tip-box" style={{ margin: 0, fontSize: '0.82rem' }}>
                  <div>
                    <strong>建议水温 / 节奏：</strong>
                    {calcResult.preset.tempGuide}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <strong>建议研磨度：</strong>
                    {calcResult.preset.grindGuide}
                  </div>
                </div>
              </div>

              <div className="spec-kpi-grid" style={{ margin: 0 }}>
                <div className="spec-kpi">
                  <span className="spec-kpi-label">{calcResult.primaryMetricLabel}</span>
                  <span className="spec-kpi-value">{calcResult.primaryMetricValue}</span>
                </div>
                <div className="spec-kpi">
                  <span className="spec-kpi-label">{calcResult.secondaryMetricLabel}</span>
                  <span className="spec-kpi-value" style={{ fontSize: '0.96rem' }}>
                    {calcResult.secondaryMetricValue}
                  </span>
                </div>
                <div className="spec-kpi">
                  <span className="spec-kpi-label">
                    预估咖啡因（{calcResult.beanOption.shortLabel}）
                  </span>
                  <span className="spec-kpi-value">≈ {calcResult.estCaffeineMg} mg</span>
                </div>
                <div className="spec-kpi">
                  <span className="spec-kpi-label">占成人日建议上限 (400mg)</span>
                  <span className="spec-kpi-value">{calcResult.dailyPct}%</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* SECTION 3: Roast Spectrum & Processing Craft Lab */}
      {section === 'craft' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          {/* Interactive Roast Timeline */}
          <section className="atlas-craft-card" aria-label="烘焙曲线演变图解">
            <p className="eyebrow">ROAST SPECTRUM LAB · 烘焙度与风味演化</p>
            <h2 className="section-heading" style={{ fontSize: '1.4rem' }}>
              从浅烘花果到深烘黑巧：点击豆色探索温度魔法
            </h2>

            <div className="roast-spectrum-bar">
              {ROAST_STAGES.map((stage) => (
                <button
                  key={stage.level}
                  type="button"
                  className={`roast-node-btn ${selectedRoast === stage.level ? 'active' : ''}`}
                  onClick={() => setSelectedRoast(stage.level)}
                >
                  <span
                    className="roast-bean-swatch"
                    style={{ background: stage.beanColor }}
                  />
                  <span style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                    {stage.name.split('·')[0].trim()}
                  </span>
                  <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--espresso-600)' }}>
                    {stage.tempRange}
                  </span>
                </button>
              ))}
            </div>

            <div className="roast-detail-box">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span className="tag tag-brass mono">{activeRoastStage.tempRange}</span>
                  <span className="tag">{activeRoastStage.milestone}</span>
                </div>
                <h3 className="exhibit-title" style={{ marginBottom: 6 }}>
                  {activeRoastStage.name}
                </h3>
                <p style={{ margin: '0 0 10px', fontSize: '0.92rem', color: 'var(--espresso-800)' }}>
                  {activeRoastStage.flavorSummary}
                </p>
                <div className="barista-tip-box" style={{ margin: 0 }}>
                  <strong>冲煮秘诀：</strong>
                  {activeRoastStage.brewTip}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 10 }}>
                  该烘焙度代表馆藏（{roastExhibits.length} 款）：
                </div>
                <div className="pill-row">
                  {roastExhibits.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className="filter-pill"
                      onClick={() => onInspect(c)}
                    >
                      {c.exhibitNo} · {c.name.split('·')[0].trim()} →
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Processing Methods Explorer */}
          <section className="atlas-craft-card" aria-label="生豆处理法实验室">
            <p className="eyebrow">PROCESSING METHODS · 生豆处理法密码</p>
            <h2 className="section-heading" style={{ fontSize: '1.4rem', marginBottom: 16 }}>
              同样的咖啡樱桃，为何会喝出截然不同的风味？
            </h2>

            <div className="pill-row" style={{ marginBottom: 18 }}>
              {PROCESS_GUIDES.map((proc) => (
                <button
                  key={proc.id}
                  type="button"
                  className={`filter-pill ${selectedProcessId === proc.id ? 'active' : ''}`}
                  onClick={() => setSelectedProcessId(proc.id)}
                >
                  {proc.name}
                </button>
              ))}
            </div>

            <div className="roast-detail-box">
              <div>
                <h3 className="exhibit-title">{activeProcess.name}</h3>
                <p className="exhibit-en" style={{ marginBottom: 10 }}>
                  {activeProcess.englishName} · {activeProcess.tagline}
                </p>
                <p style={{ margin: '0 0 16px', fontSize: '0.92rem', lineHeight: 1.7 }}>
                  {activeProcess.description}
                </p>
                <div className="flavor-mini-bars">
                  {[
                    { label: '干净度', val: activeProcess.clarity },
                    { label: '甜感', val: activeProcess.sweetness },
                    { label: '醇厚度', val: activeProcess.body },
                  ].map((item) => (
                    <div key={item.label} className="mini-bar-item">
                      <div className="mini-bar-label">
                        <span>{item.label}</span>
                        <span className="mono">{item.val}</span>
                      </div>
                      <div className="mini-bar-track">
                        <div className="mini-bar-fill" style={{ width: `${item.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 10 }}>
                  采用该工艺的馆藏咖啡（{processExhibits.length} 款）：
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {processExhibits.slice(0, 4).map((c) => (
                    <div key={c.id} className="atlas-mini-exhibit">
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{c.name}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--espresso-600)' }}>
                          {c.process}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ padding: '5px 12px', fontSize: '0.76rem' }}
                        onClick={() => onStartBrew(c)}
                      >
                        去冲煮
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* SECTION 3: Interactive Barista Troubleshooter */}
      {section === 'troubleshoot' && (
        <section className="atlas-craft-card" aria-label="咖啡师冲煮翻车诊断室">
          <p className="eyebrow">BARISTA TROUBLESHOOTER · 冲煮味道诊断与调参指南</p>
          <h2 className="section-heading" style={{ fontSize: '1.42rem', marginBottom: 8 }}>
            刚冲出的咖啡不够理想？点选口感症状获取纠偏方案
          </h2>
          <p className="section-lead" style={{ marginBottom: 18 }}>
            每次只微调一个变量（研磨度、水温或粉水比），很快就能稳定复刻咖啡馆级甜润出品。
          </p>

          <div className="troubleshoot-symptom-grid">
            {BREW_TROUBLESHOOT_CASES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`scenario-card ${activeTroubleshoot.id === item.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCaseId(item.id)
                  playGentleChime('tick')
                }}
              >
                <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--brass-700)' }}>
                  {item.englishTag.split('·')[0].trim()}
                </span>
                <span className="scenario-card-title">{item.symptom}</span>
              </button>
            ))}
          </div>

          <div className="roast-detail-box" style={{ marginTop: 18 }}>
            <div>
              <span className="tag tag-brass mono" style={{ marginBottom: 10 }}>
                {activeTroubleshoot.englishTag}
              </span>
              <h3 className="exhibit-title" style={{ fontSize: '1.25rem', marginBottom: 8 }}>
                {activeTroubleshoot.symptom}
              </h3>
              <p style={{ margin: '0 0 10px', fontSize: '0.94rem', color: 'var(--espresso-900)' }}>
                <strong>杯测诊断：</strong>
                {activeTroubleshoot.diagnosis}
              </p>
              <div className="specimen-curator-box" style={{ margin: '10px 0 16px' }}>
                <strong>常见诱因：</strong>
                {activeTroubleshoot.rootCause}
              </div>

              {practiceExhibit && (
                <div className="atlas-mini-exhibit">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <CupEmblem
                      method={practiceExhibit.method}
                      liquid={practiceExhibit.palette.liquid}
                      crema={practiceExhibit.palette.crema}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--brass-700)', fontWeight: 600 }}>
                        推荐标准练手豆单
                      </div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '0.92rem' }}>
                        {practiceExhibit.name}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onStartBrew(practiceExhibit)}
                  >
                    进入调参实操 →
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--espresso-800)' }}>
                ✦ 咖啡师三步纠偏调参：
              </div>
              {activeTroubleshoot.fixes.map((fix, idx) => (
                <div key={fix.lever} className="troubleshoot-fix-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="tag tag-sage mono">0{idx + 1}</span>
                    <strong style={{ fontSize: '0.92rem' }}>{fix.lever}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--espresso-600)', lineHeight: 1.6 }}>
                    {fix.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: Playful Sommelier Trivia Quiz */}
      {section === 'quiz' && (
        <section className="quiz-stage-card" aria-label="咖啡品鉴师趣味问答">
          {!quizFinished ? (
            <>
              <div className="exhibit-top-row" style={{ marginBottom: 16 }}>
                <span className="tag tag-brass mono">
                  QUESTION {qIndex + 1} / {roundQuestions.length} · {currentQ.category}
                </span>
                <span className="mono" style={{ fontSize: '0.82rem', color: 'var(--espresso-600)' }}>
                  本轮得分：{roundScore} · 历史最高：{bestQuizScore}/5
                </span>
              </div>

              <div className="step-progress-rail" style={{ marginBottom: 22 }}>
                {roundQuestions.map((q, idx) => (
                  <span
                    key={q.id}
                    className={`step-rail-seg ${
                      idx < qIndex ? 'done' : idx === qIndex ? 'current' : ''
                    }`}
                  />
                ))}
              </div>

              <h2 className="section-heading" style={{ fontSize: '1.42rem', marginBottom: 20 }}>
                {currentQ.question}
              </h2>

              <div className="quiz-options-grid">
                {currentQ.options.map((opt, idx) => {
                  const isAnswered = pickedOption !== null
                  const isCorrect = idx === currentQ.correctIndex
                  const isPicked = idx === pickedOption
                  let stateClass = ''
                  if (isAnswered) {
                    if (isCorrect) stateClass = 'correct'
                    else if (isPicked) stateClass = 'wrong'
                  }
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={isAnswered}
                      className={`quiz-option-btn ${stateClass}`}
                      onClick={() => handleChooseOption(idx)}
                    >
                      <span className="quiz-option-letter mono">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  )
                })}
              </div>

              {pickedOption !== null && (
                <div className="quiz-explanation-box">
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>
                    {pickedOption === currentQ.correctIndex
                      ? '✦ 回答正确！咖啡馆长为你点赞'
                      : '☕ 差一点点，来看看咖啡师解析：'}
                  </div>
                  <p style={{ margin: '0 0 14px', fontSize: '0.9rem', lineHeight: 1.65 }}>
                    {currentQ.explanation}
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextQuestion}
                  >
                    {qIndex + 1 >= roundQuestions.length ? '查看本轮评级结果 →' : '下一题 →'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '18px 8px' }}>
              <p className="eyebrow">SOMMELIER CHALLENGE COMPLETE · 挑战结果</p>
              <div className="quiz-score-ring">
                <span className="mono" style={{ fontSize: '2.2rem', fontWeight: 700 }}>
                  {roundScore} / {roundQuestions.length}
                </span>
              </div>
              <h2 className="section-heading" style={{ marginTop: 14 }}>
                {getRankLabel(roundScore, roundQuestions.length)}
              </h2>
              <p className="section-lead" style={{ margin: '0 auto 22px' }}>
                {roundScore >= 4
                  ? '太棒了！你已解锁个人馆藏中的「咖啡博物学者」荣誉徽章。'
                  : '再来一局不同题库，答对 4 题及以上即可点亮「咖啡博物学者」专属徽章！'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={handleRestartQuiz}
                >
                  随机抽 5 题再来一局
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-lg"
                  onClick={() => setSection('map')}
                >
                  返回世界咖啡地图
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
