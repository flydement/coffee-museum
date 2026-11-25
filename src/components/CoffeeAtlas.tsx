import { useMemo, useState } from 'react'
import {
  BREW_TROUBLESHOOT_CASES,
  COFFEE_ORIGINS,
  COFFEE_TRIVIA_QUESTIONS,
  PROCESS_GUIDES,
  ROAST_STAGES,
  type CoffeeTriviaQuestion,
} from '../data/atlas'
import { COFFEE_EXHIBITS } from '../data/coffees'
import type { CoffeeExhibit } from '../types/coffee'
import { playGentleChime } from '../utils/platform'
import { CupEmblem } from './Icons'

interface CoffeeAtlasProps {
  onInspect: (coffee: CoffeeExhibit) => void
  onStartBrew: (coffee: CoffeeExhibit) => void
  bestQuizScore: number
  onFinishQuiz: (score: number, total: number) => void
}

type AtlasSection = 'map' | 'craft' | 'troubleshoot' | 'quiz'

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
}: CoffeeAtlasProps) {
  const [section, setSection] = useState<AtlasSection>('map')
  const [selectedOriginId, setSelectedOriginId] = useState<string>(COFFEE_ORIGINS[0].id)
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
            { id: 'craft' as const, label: '烘焙与处理法' },
            { id: 'troubleshoot' as const, label: '冲煮诊断室' },
            { id: 'quiz' as const, label: `趣味品鉴挑战${bestQuizScore > 0 ? ` (${bestQuizScore}/5)` : ''}` },
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
                  点击地图上的金色坐标点，探索全球 {COFFEE_ORIGINS.length} 大咖啡风土与馆藏对应豆单
                </div>
              </div>
              <span className="tag tag-brass mono">点击坐标交互</span>
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

                {/* Interactive Origin Pins */}
                {COFFEE_ORIGINS.map((origin) => {
                  const active = origin.id === selectedOrigin.id
                  return (
                    <g
                      key={origin.id}
                      transform={`translate(${origin.x}, ${origin.y})`}
                      className="atlas-pin"
                      role="button"
                      tabIndex={0}
                      aria-label={`查看产区 ${origin.name}`}
                      onClick={() => {
                        setSelectedOriginId(origin.id)
                        playGentleChime('tick')
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelectedOriginId(origin.id)
                        }
                      }}
                    >
                      {active && (
                        <circle
                          r="18"
                          fill="rgba(199, 147, 85, 0.28)"
                          className="atlas-pin-pulse"
                        />
                      )}
                      <circle
                        r={active ? 8.5 : 6.2}
                        fill={active ? 'var(--brass-600)' : 'var(--espresso-900)'}
                        stroke="var(--paper-surface)"
                        strokeWidth="2.2"
                      />
                      <text
                        y={active ? -14 : -11}
                        textAnchor="middle"
                        fontSize={active ? '11.5' : '10'}
                        fontWeight={active ? '700' : '600'}
                        fill={active ? 'var(--brass-700)' : 'var(--espresso-800)'}
                        style={{ pointerEvents: 'none' }}
                      >
                        {origin.name.split('·')[0].trim()}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Quick origin chip selector below map for touch accessibility */}
            <div className="pill-row" style={{ marginTop: 14 }}>
              {COFFEE_ORIGINS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={`mood-pill ${o.id === selectedOrigin.id ? 'active' : ''}`}
                  style={{ padding: '5px 11px', fontSize: '0.78rem' }}
                  onClick={() => setSelectedOriginId(o.id)}
                >
                  {o.name.split('·')[0].trim()}
                </button>
              ))}
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

            <div className="specimen-curator-box" style={{ margin: '0 0 16px' }}>
              {selectedOrigin.story}
            </div>

            <div className="spec-kpi-grid" style={{ margin: '0 0 16px' }}>
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

            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, marginBottom: 10 }}>
                本馆收录产区展品（{originExhibits.length} 款）
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {originExhibits.slice(0, 4).map((c) => (
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

      {/* SECTION 2: Roast Spectrum & Processing Craft Lab */}
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
