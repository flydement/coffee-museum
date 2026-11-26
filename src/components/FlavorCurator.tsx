import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { EXHIBIT_EXTRAS, getDailyFeaturedIndex } from '../data/atlas'
import {
  COFFEE_EXHIBITS,
  CURATOR_SCENARIOS,
  MOOD_FLAVOR_OPTIONS,
} from '../data/coffees'
import type {
  CoffeeExhibit,
  DrinkCategory,
  FlavorPreference,
  TemperatureStyle,
} from '../types/coffee'
import { playGentleChime, scoreExhibitMatch } from '../utils/platform'
import { BookmarkHeartIcon, CupEmblem } from './Icons'

interface FlavorCuratorProps {
  preference: FlavorPreference
  onChangePreference: (next: FlavorPreference) => void
  onSelectInspect: (coffee: CoffeeExhibit) => void
  onStartBrew: (coffee: CoffeeExhibit) => void
  onOpenGallery: () => void
  archiveCount: number
  wishlistIds: Set<string>
  onToggleWishlist: (coffeeId: string) => void
}

const STYLE_OPTIONS: { value: 'all' | DrinkCategory; label: string }[] = [
  { value: 'all', label: '全部风味' },
  { value: '手冲黑咖', label: '手冲黑咖' },
  { value: '意式奶咖', label: '意式奶咖' },
  { value: '冰爽特调', label: '冰爽特调' },
  { value: '复古器具', label: '复古器具' },
]

const TEMP_OPTIONS: { value: 'all' | TemperatureStyle; label: string }[] = [
  { value: 'all', label: '冷热皆可' },
  { value: '热饮', label: '热饮暖香' },
  { value: '冷饮', label: '冰爽冷饮' },
  { value: '冷热分层', label: '冷热分层' },
]

const HERO_EXHIBITION_SLIDES = [
  {
    id: 'pour-over',
    src: './images/coffee-museum-hero.jpg',
    caption: '常设展 · 01 — 萃取器具与风味地图',
    badge: 'V60 · LATTE',
    alt: '拾光咖啡博物馆常设展 01：手冲铜壶、玻璃滤杯、拉花陶瓷杯与咖啡果枝',
  },
  {
    id: 'espresso-moka',
    src: './images/exhibition-espresso-moka.jpg',
    caption: '常设展 · 02 — 意式浓缩与复古摩卡馆',
    badge: '9 BAR · MOKA',
    alt: '拾光咖啡博物馆常设展 02：八角复古摩卡壶、双流意式浓缩手柄与咖啡樱桃枝',
  },
  {
    id: 'coldbrew-iced',
    src: './images/exhibition-coldbrew-iced.jpg',
    caption: '常设展 · 03 — 京都冰滴与柑橘特调馆',
    badge: 'COLD DRIP · CITRUS',
    alt: '拾光咖啡博物馆常设展 03：京都慢萃冰滴塔、球冰冷萃与鲜橙迷迭香特调',
  },
  {
    id: 'syphon-kissaten',
    src: './images/exhibition-syphon-kissaten.jpg',
    caption: '常设展 · 04 — 昭和吃茶与虹吸真空剧场',
    badge: 'SIPHON · KISSATEN',
    alt: '拾光咖啡博物馆常设展 04：玻璃虹吸真空壶、酒精灯、昭和吃茶馆木质吧台与香料咖啡枝',
  },
  {
    id: 'turkish-atlas',
    src: './images/exhibition-turkish-atlas.jpg',
    caption: '常设展 · 05 — 千年铜壶与世界咖啡种植带',
    badge: 'CEZVE · HERITAGE',
    alt: '拾光咖啡博物馆常设展 05：手工锻打土耳其铜壶、复古手摇磨豆机、绿豆蔻与世界咖啡地图',
  },
] as const

const HERO_SLIDE_INTERVAL_MS = 4500

export function FlavorCurator({
  preference,
  onChangePreference,
  onSelectInspect,
  onStartBrew,
  onOpenGallery,
  archiveCount,
  wishlistIds,
  onToggleWishlist,
}: FlavorCuratorProps) {
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null)
  const [blindBoxOpen, setBlindBoxOpen] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnCoffee, setDrawnCoffee] = useState<CoffeeExhibit>(COFFEE_EXHIBITS[0])
  const drawTimerRef = useRef<number | null>(null)

  // Seamless infinite hero artwork carousel state
  const [slideTrackIdx, setSlideTrackIdx] = useState(0)
  const [slideAnimate, setSlideAnimate] = useState(true)
  const [carouselPaused, setCarouselPaused] = useState(false)
  const touchStartXRef = useRef<number | null>(null)

  const slideCount = HERO_EXHIBITION_SLIDES.length
  const activeSlideIdx = slideTrackIdx % slideCount
  const activeSlide = HERO_EXHIBITION_SLIDES[activeSlideIdx]
  const carouselTrackSlides = useMemo(
    () => [...HERO_EXHIBITION_SLIDES, HERO_EXHIBITION_SLIDES[0]],
    []
  )

  useEffect(() => {
    if (carouselPaused) return
    const timer = window.setInterval(() => {
      setSlideAnimate(true)
      setSlideTrackIdx((prev) => (prev >= slideCount ? 1 : prev + 1))
    }, HERO_SLIDE_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [carouselPaused, slideCount])

  const handleSlideTransitionEnd = () => {
    if (slideTrackIdx === slideCount) {
      setSlideAnimate(false)
      setSlideTrackIdx(0)
    }
  }

  const handleStepSlide = (delta: 1 | -1) => {
    if (slideTrackIdx >= slideCount) return
    setSlideAnimate(true)
    setSlideTrackIdx((prev) => {
      const normalized = prev % slideCount
      if (delta === 1) return normalized + 1
      return normalized === 0 ? slideCount - 1 : normalized - 1
    })
  }

  const handleJumpSlide = (targetIndex: number) => {
    setSlideAnimate(true)
    setSlideTrackIdx(targetIndex)
  }

  const dailyCoffee = useMemo(
    () => COFFEE_EXHIBITS[getDailyFeaturedIndex(COFFEE_EXHIBITS.length)],
    []
  )

  useEffect(() => {
    return () => {
      if (drawTimerRef.current) window.clearTimeout(drawTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!blindBoxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBlindBoxOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [blindBoxOpen])

  const rankedExhibits = useMemo(() => {
    return COFFEE_EXHIBITS.map((coffee) => ({
      coffee,
      match: scoreExhibitMatch(coffee, preference),
    })).sort((a, b) => b.match - a.match)
  }, [preference])

  const updatePrefManual = (next: FlavorPreference) => {
    setActiveScenarioId(null)
    onChangePreference(next)
  }

  const toggleMood = (moodId: string) => {
    const exists = preference.selectedMoods.includes(moodId)
    const nextMoods = exists
      ? preference.selectedMoods.filter((m) => m !== moodId)
      : [...preference.selectedMoods, moodId]
    updatePrefManual({ ...preference, selectedMoods: nextMoods })
  }

  const handleReset = () => {
    setActiveScenarioId(null)
    onChangePreference({
      style: 'all',
      temperature: 'all',
      acidity: 55,
      sweetness: 80,
      body: 65,
      bitterness: 40,
      selectedMoods: [],
    })
  }

  const handleApplyScenario = (scenarioId: string, pref: FlavorPreference) => {
    setActiveScenarioId(scenarioId)
    onChangePreference(pref)
    playGentleChime('tick')
  }

  const startBlindBoxDraw = () => {
    if (drawTimerRef.current) window.clearTimeout(drawTimerRef.current)
    setBlindBoxOpen(true)
    setIsDrawing(true)

    const target =
      COFFEE_EXHIBITS[Math.floor(Math.random() * COFFEE_EXHIBITS.length)]
    const totalTicks = 9
    let step = 0

    const spin = () => {
      step += 1
      if (step >= totalTicks) {
        setDrawnCoffee(target)
        setIsDrawing(false)
        playGentleChime('step')
        return
      }
      const preview =
        COFFEE_EXHIBITS[Math.floor(Math.random() * COFFEE_EXHIBITS.length)]
      setDrawnCoffee(preview)
      playGentleChime('tick')
      drawTimerRef.current = window.setTimeout(spin, 65 + step * 18)
    }

    spin()
  }

  const topMatch = rankedExhibits[0]
  const drawnExtra = EXHIBIT_EXTRAS[drawnCoffee.id]

  return (
    <div className="view-enter">
      {/* Editorial Museum Hero */}
      <section className="hero-exhibition" aria-label="咖啡博物馆导览">
        <div className="hero-copy">
          <p className="eyebrow">CURATED COFFEE EXHIBITION · 风味策展与冲煮工坊</p>
          <h1 className="hero-title">选一种心仪风味，亲手冲出你的馆藏咖啡</h1>
          <p className="hero-desc">
            在这里，每一杯咖啡都是一件可被复现的风味藏品。通过下方情境点单或风味调音台挑选酸度、甜感、醇厚与香调，系统会为你匹配专属豆单、动态定制冲煮参数，并一步步陪伴计时直至出杯。
          </p>
          <div className="hero-actions">
            <button
              id="hero-start-top-btn"
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => topMatch && onStartBrew(topMatch.coffee)}
            >
              立即冲煮最佳匹配 · {topMatch?.coffee.name.split('·')[0].trim()}
            </button>
            <button
              id="hero-surprise-btn"
              type="button"
              className="btn btn-outline btn-lg"
              onClick={startBlindBoxDraw}
            >
              ✦ 今日风味抽签盲盒
            </button>
            <button
              id="hero-gallery-btn"
              type="button"
              className="btn btn-ghost"
              onClick={onOpenGallery}
            >
              浏览全部 {COFFEE_EXHIBITS.length} 款馆藏 →
            </button>
          </div>
          <div className="daily-featured-strip">
            <span className="tag tag-brass mono">今日馆长精选</span>
            <span className="daily-featured-name">
              {dailyCoffee.exhibitNo} · {dailyCoffee.name}
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ padding: '4px 10px', fontSize: '0.78rem', marginLeft: 'auto' }}
              onClick={() => onSelectInspect(dailyCoffee)}
            >
              查看今日展签 →
            </button>
          </div>
          <div className="hero-metrics">
            <div>
              <div className="hero-metric-val">{COFFEE_EXHIBITS.length}</div>
              <div className="hero-metric-label">世界代表性馆藏风味</div>
            </div>
            <div>
              <div className="hero-metric-val">
                {new Set(COFFEE_EXHIBITS.map((c) => c.method)).size}
              </div>
              <div className="hero-metric-label">动态器具实时萃取引导</div>
            </div>
            <div>
              <div className="hero-metric-val">{archiveCount}</div>
              <div className="hero-metric-label">你已亲手收藏的咖啡</div>
            </div>
          </div>
        </div>

        <div
          className="hero-artwork-frame"
          onMouseEnter={() => setCarouselPaused(true)}
          onMouseLeave={() => setCarouselPaused(false)}
          onFocus={() => setCarouselPaused(true)}
          onBlur={() => setCarouselPaused(false)}
          onTouchStart={(e) => {
            touchStartXRef.current = e.touches[0]?.clientX ?? null
            setCarouselPaused(true)
          }}
          onTouchEnd={(e) => {
            const startX = touchStartXRef.current
            const endX = e.changedTouches[0]?.clientX ?? null
            if (startX !== null && endX !== null) {
              const diff = startX - endX
              if (Math.abs(diff) > 36) {
                handleStepSlide(diff > 0 ? 1 : -1)
              }
            }
            touchStartXRef.current = null
            setCarouselPaused(false)
          }}
          aria-roledescription="carousel"
          aria-label="拾光咖啡博物馆常设展轮播插画"
        >
          <div className="hero-carousel-viewport">
            <div
              className="hero-carousel-track"
              style={{
                transform: `translate3d(-${slideTrackIdx * 100}%, 0, 0)`,
                transition: slideAnimate
                  ? 'transform 0.72s cubic-bezier(0.22, 1, 0.36, 1)'
                  : 'none',
              }}
              onTransitionEnd={handleSlideTransitionEnd}
            >
              {carouselTrackSlides.map((slide, idx) => (
                <div key={`${slide.id}-${idx}`} className="hero-carousel-slide">
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    draggable={false}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="hero-carousel-arrow prev"
              aria-label="上一张常设展插画"
              onClick={() => handleStepSlide(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="hero-carousel-arrow next"
              aria-label="下一张常设展插画"
              onClick={() => handleStepSlide(1)}
            >
              ›
            </button>

            <span className="hero-carousel-counter mono" aria-hidden="true">
              {String(activeSlideIdx + 1).padStart(2, '0')} /{' '}
              {String(slideCount).padStart(2, '0')}
            </span>
          </div>

          <div className="hero-artwork-caption">
            <span key={activeSlide.id} className="hero-caption-title">
              {activeSlide.caption}
            </span>
            <div className="hero-carousel-controls">
              <div className="hero-carousel-dots" role="tablist" aria-label="切换常设展插画">
                {HERO_EXHIBITION_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={activeSlideIdx === idx}
                    aria-label={slide.caption}
                    className={`hero-dot-btn ${activeSlideIdx === idx ? 'active' : ''} ${
                      carouselPaused ? 'paused' : ''
                    }`}
                    onClick={() => handleJumpSlide(idx)}
                  />
                ))}
              </div>
              <span className="mono hero-caption-badge">{activeSlide.badge}</span>
            </div>
          </div>
        </div>
      </section>

      {/* One-Tap Mood Scenarios */}
      <section aria-label="情境风味速选" style={{ marginBottom: 8 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 10,
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <span className="eyebrow" style={{ margin: 0 }}>
            CURATOR SCENARIOS · 按此刻心情一键调味
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--espresso-600)' }}>
            点击任一生活情境，自动拨动下方风味滑块
          </span>
        </div>
        <div className="scenario-strip">
          {CURATOR_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              type="button"
              className={`scenario-card ${activeScenarioId === sc.id ? 'active' : ''}`}
              onClick={() => handleApplyScenario(sc.id, sc.preference)}
            >
              <span className="scenario-card-title">{sc.title}</span>
              <span className="scenario-card-sub">{sc.subtitle}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Flavor Curator Interactive Workspace */}
      <section className="curator-layout" aria-label="风味调音台与匹配结果">
        <aside className="tuner-panel">
          <div className="tuner-header">
            <div>
              <p className="eyebrow" style={{ marginBottom: 4 }}>
                FLAVOR TUNER
              </p>
              <h2 className="tuner-title">调出你想喝的口味</h2>
            </div>
            <button
              id="tuner-reset-btn"
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleReset}
            >
              重置
            </button>
          </div>

          <div className="tuner-group">
            <div className="tuner-label">
              <span>饮品类型</span>
            </div>
            <div className="pill-row">
              {STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`filter-pill ${preference.style === opt.value ? 'active' : ''}`}
                  onClick={() => updatePrefManual({ ...preference, style: opt.value })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="tuner-group">
            <div className="tuner-label">
              <span>温度质感</span>
            </div>
            <div className="pill-row">
              {TEMP_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`filter-pill ${preference.temperature === opt.value ? 'active' : ''}`}
                  onClick={() =>
                    updatePrefManual({ ...preference, temperature: opt.value })
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="tuner-group">
            <div className="tuner-label">
              <span>风味维度微调</span>
              <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--espresso-400)' }}>
                0 – 100
              </span>
            </div>

            {[
              {
                key: 'acidity' as const,
                label: '明亮果酸',
                low: '柔和低酸',
                high: '清新果酸',
              },
              {
                key: 'sweetness' as const,
                label: '甘甜顺滑',
                low: '干爽利落',
                high: '饱满甜感',
              },
              {
                key: 'body' as const,
                label: '口感醇厚',
                low: '清澈茶感',
                high: '丝绒厚重',
              },
              {
                key: 'bitterness' as const,
                label: '烘焙苦韵',
                low: '几乎无苦',
                high: '深烘黑巧',
              },
            ].map((axis) => (
              <div key={axis.key} className="slider-item">
                <div className="slider-meta">
                  <span className="slider-name">{axis.label}</span>
                  <span className="slider-val">
                    {preference[axis.key]} ·{' '}
                    {preference[axis.key] < 38
                      ? axis.low
                      : preference[axis.key] > 65
                        ? axis.high
                        : '均衡适中'}
                  </span>
                </div>
                <input
                  id={`slider-${axis.key}`}
                  type="range"
                  min={0}
                  max={100}
                  value={preference[axis.key]}
                  className="museum-range"
                  style={{
                    background: `linear-gradient(to right, var(--brass-600) ${preference[axis.key]}%, var(--paper-warm) ${preference[axis.key]}%)`,
                  }}
                  onChange={(e) =>
                    updatePrefManual({
                      ...preference,
                      [axis.key]: Number(e.target.value),
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div className="tuner-group" style={{ marginBottom: 0 }}>
            <div className="tuner-label">
              <span>偏爱的香气联想（可多选）</span>
            </div>
            <div className="pill-row">
              {MOOD_FLAVOR_OPTIONS.map((mood) => {
                const active = preference.selectedMoods.includes(mood.id)
                return (
                  <button
                    key={mood.id}
                    type="button"
                    className={`mood-pill ${active ? 'active' : ''}`}
                    title={mood.desc}
                    onClick={() => toggleMood(mood.id)}
                  >
                    {mood.label}
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        <div>
          <div className="results-header">
            <div>
              <p className="eyebrow">CURATED MATCHES · 实时风味策展</p>
              <h2 className="section-heading" style={{ marginBottom: 4 }}>
                为你挑选的馆藏风味
              </h2>
              <p className="section-lead">
                按当前口味偏好实时排序，点击任一展品查看参数配方或直接进入分步冲煮。
              </p>
            </div>
            <span className="tag tag-brass mono">
              最高契合度 {topMatch?.match ?? 90}%
            </span>
          </div>

          <div className="exhibit-grid">
            {rankedExhibits.slice(0, 6).map(({ coffee, match }) => {
              const wished = wishlistIds.has(coffee.id)
              return (
                <article
                  key={coffee.id}
                  className="exhibit-card"
                  style={
                    {
                      '--card-accent': coffee.palette.accent,
                      '--card-liquid': coffee.palette.liquid,
                    } as CSSProperties
                  }
                >
                  <div className="exhibit-top-row">
                    <span className="exhibit-no">
                      {coffee.exhibitNo} · {coffee.category}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`match-badge ${match >= 85 ? 'high' : ''}`}>
                        {match}% 契合
                      </span>
                      <button
                        type="button"
                        className="wishlist-icon-btn"
                        aria-label={wished ? '移出想喝清单' : '加入想喝清单'}
                        title={wished ? '已加入想喝清单' : '加入想喝清单'}
                        onClick={() => onToggleWishlist(coffee.id)}
                      >
                        <BookmarkHeartIcon saved={wished} size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="exhibit-headline-wrap">
                    <div className="cup-medallion">
                      <CupEmblem
                        method={coffee.method}
                        liquid={coffee.palette.liquid}
                        crema={coffee.palette.crema}
                      />
                    </div>
                    <div>
                      <h3 className="exhibit-title">{coffee.name}</h3>
                      <p className="exhibit-en">{coffee.englishName}</p>
                    </div>
                  </div>

                  <p className="exhibit-subtitle">{coffee.subtitle}</p>

                  <div className="pill-row">
                    {coffee.flavorNotes.slice(0, 3).map((note) => (
                      <span key={note} className="tag">
                        {note}
                      </span>
                    ))}
                    <span className="tag tag-brass">{coffee.roast}</span>
                  </div>

                  <div className="flavor-mini-bars">
                    {[
                      { label: '酸度', val: coffee.flavorProfile.acidity },
                      { label: '甜感', val: coffee.flavorProfile.sweetness },
                      { label: '醇厚', val: coffee.flavorProfile.body },
                    ].map((item) => (
                      <div key={item.label} className="mini-bar-item">
                        <div className="mini-bar-label">
                          <span>{item.label}</span>
                          <span className="mono">{item.val}</span>
                        </div>
                        <div className="mini-bar-track">
                          <div
                            className="mini-bar-fill"
                            style={{ width: `${item.val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="exhibit-spec-strip">
                    <span>器具：{coffee.methodLabel}</span>
                    <span>水温：{coffee.recipe.waterTempC}°C</span>
                    <span>耗时：{coffee.recipe.totalTimeLabel}</span>
                  </div>

                  <div className="exhibit-actions">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => onSelectInspect(coffee)}
                    >
                      馆藏参数
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onStartBrew(coffee)}
                    >
                      开始制作
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Playful Blind-Box Fortune Drawer Modal */}
      {blindBoxOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="今日风味盲盒抽签"
          onClick={(e) => {
            if (e.target === e.currentTarget) setBlindBoxOpen(false)
          }}
        >
          <div className="specimen-modal blindbox-modal">
            <button
              type="button"
              className="modal-close"
              aria-label="关闭抽签"
              onClick={() => setBlindBoxOpen(false)}
            >
              ×
            </button>

            <p className="eyebrow">CURATOR BLIND BOX · 今日风味灵感签</p>
            <h2 className="section-heading" style={{ fontSize: '1.45rem', marginBottom: 14 }}>
              {isDrawing ? '正在为你摇动馆藏豆签…' : '为你抽中今日灵感馆藏'}
            </h2>

            <div className={`blindbox-card ${isDrawing ? 'shuffling' : 'revealed'}`}>
              <div className="blindbox-medallion">
                <CupEmblem
                  method={drawnCoffee.method}
                  liquid={drawnCoffee.palette.liquid}
                  crema={drawnCoffee.palette.crema}
                />
              </div>
              <span className="tag tag-brass mono" style={{ marginBottom: 8 }}>
                {drawnCoffee.exhibitNo} · {drawnCoffee.category} · {drawnCoffee.roast}
              </span>
              <h3 className="exhibit-title" style={{ fontSize: '1.35rem' }}>
                {drawnCoffee.name}
              </h3>
              <p className="exhibit-en" style={{ marginBottom: 12 }}>
                {drawnCoffee.englishName}
              </p>

              {!isDrawing && drawnExtra && (
                <blockquote className="blindbox-fortune">
                  “{drawnExtra.fortune}”
                </blockquote>
              )}

              <div className="pill-row" style={{ justifyContent: 'center', marginBottom: 12 }}>
                {drawnCoffee.flavorNotes.map((note) => (
                  <span key={note} className="tag">
                    {note}
                  </span>
                ))}
              </div>

              {!isDrawing && drawnExtra && (
                <div style={{ fontSize: '0.8rem', color: 'var(--espresso-600)' }}>
                  推荐搭档：{drawnExtra.pairing}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 18 }}>
              <button
                type="button"
                className="btn btn-outline"
                disabled={isDrawing}
                onClick={startBlindBoxDraw}
              >
                ↻ 再抽一签
              </button>
              <button
                type="button"
                className="btn btn-outline"
                disabled={isDrawing}
                onClick={() => {
                  setBlindBoxOpen(false)
                  onSelectInspect(drawnCoffee)
                }}
              >
                查看完整配方
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={isDrawing}
                onClick={() => {
                  setBlindBoxOpen(false)
                  onStartBrew(drawnCoffee)
                }}
              >
                立即冲煮这杯 →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
