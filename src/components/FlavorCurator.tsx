import { useMemo, useState } from 'react'
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
import { scoreExhibitMatch } from '../utils/platform'
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
  }

  const handleSurprise = () => {
    const randomCoffee =
      COFFEE_EXHIBITS[Math.floor(Math.random() * COFFEE_EXHIBITS.length)]
    onStartBrew(randomCoffee)
  }

  const topMatch = rankedExhibits[0]

  return (
    <div>
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
              onClick={handleSurprise}
            >
              今日盲盒风味
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
          <div className="hero-metrics">
            <div>
              <div className="hero-metric-val">{COFFEE_EXHIBITS.length}</div>
              <div className="hero-metric-label">世界代表性馆藏风味</div>
            </div>
            <div>
              <div className="hero-metric-val">8</div>
              <div className="hero-metric-label">动态器具实时萃取引导</div>
            </div>
            <div>
              <div className="hero-metric-val">{archiveCount}</div>
              <div className="hero-metric-label">你已亲手收藏的咖啡</div>
            </div>
          </div>
        </div>

        <div className="hero-artwork-frame">
          <img
            src="./images/coffee-museum-hero.jpg"
            alt="拾光咖啡博物馆复古手绘主视觉：手冲铜壶、玻璃滤杯、拉花陶瓷杯与咖啡果枝"
          />
          <div className="hero-artwork-caption">
            <span>常设展 · 01 — 萃取器具与风味地图</span>
            <span className="mono">WEB · PC · APP</span>
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
                <article key={coffee.id} className="exhibit-card">
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
    </div>
  )
}
