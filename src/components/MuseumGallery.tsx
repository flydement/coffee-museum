import { useMemo, useState } from 'react'
import { COFFEE_EXHIBITS } from '../data/coffees'
import type { CoffeeExhibit, DrinkCategory } from '../types/coffee'
import { scaleRecipe } from '../utils/platform'
import { FlavorRadar } from './FlavorRadar'
import { CupEmblem } from './Icons'

interface MuseumGalleryProps {
  inspectedCoffee: CoffeeExhibit | null
  onInspect: (coffee: CoffeeExhibit | null) => void
  onStartBrew: (coffee: CoffeeExhibit, servings?: number) => void
  unlockedIds: Set<string>
}

const CATEGORIES: ('全部' | DrinkCategory)[] = [
  '全部',
  '手冲黑咖',
  '意式奶咖',
  '冰爽特调',
  '复古器具',
]

export function MuseumGallery({
  inspectedCoffee,
  onInspect,
  onStartBrew,
  unlockedIds,
}: MuseumGalleryProps) {
  const [category, setCategory] = useState<'全部' | DrinkCategory>('全部')
  const [search, setSearch] = useState('')
  const [modalServings, setModalServings] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return COFFEE_EXHIBITS.filter((c) => {
      if (category !== '全部' && c.category !== category) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.englishName.toLowerCase().includes(q) ||
        c.origin.toLowerCase().includes(q) ||
        c.flavorNotes.some((n) => n.toLowerCase().includes(q)) ||
        c.methodLabel.toLowerCase().includes(q)
      )
    })
  }, [category, search])

  const openModal = (coffee: CoffeeExhibit) => {
    setModalServings(1)
    onInspect(coffee)
  }

  return (
    <div>
      <div className="results-header" style={{ marginBottom: 22 }}>
        <div>
          <p className="eyebrow">PERMANENT COLLECTION · 永久馆藏名录</p>
          <h1 className="section-heading">世界咖啡风味展厅</h1>
          <p className="section-lead">
            从埃塞俄比亚高地花香手冲到米兰经典浓缩与亚洲新派特调，查阅每一款风味的产地档案、研磨刻度与实时换算粉水比。
          </p>
        </div>
        <span className="tag tag-sage mono">
          已点亮 {unlockedIds.size} / {COFFEE_EXHIBITS.length} 款藏品
        </span>
      </div>

      <div className="gallery-toolbar">
        <div className="pill-row">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-pill ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          id="gallery-search-input"
          type="search"
          className="search-input"
          placeholder="搜索风味、产区或器具（如 桂花 / 耶加）"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="gallery-grid">
        {filtered.map((coffee) => {
          const isUnlocked = unlockedIds.has(coffee.id)
          return (
            <article key={coffee.id} className="exhibit-card">
              <div className="exhibit-top-row">
                <span className="exhibit-no">
                  {coffee.exhibitNo} · {coffee.storyYear}
                </span>
                {isUnlocked ? (
                  <span className="tag tag-sage">已点亮</span>
                ) : (
                  <span className="tag">{coffee.recipe.difficulty}</span>
                )}
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
                  <h2 className="exhibit-title">{coffee.name}</h2>
                  <p className="exhibit-en">{coffee.englishName}</p>
                </div>
              </div>

              <p className="exhibit-subtitle">{coffee.curatorNote}</p>

              <div className="pill-row">
                <span className="tag tag-brass">{coffee.roast}</span>
                <span className="tag">{coffee.temperature}</span>
                {coffee.flavorNotes.slice(0, 2).map((note) => (
                  <span key={note} className="tag">
                    {note}
                  </span>
                ))}
              </div>

              <div className="exhibit-spec-strip">
                <span>产区：{coffee.origin.split('·')[0].trim()}</span>
                <span>粉水比：{coffee.recipe.ratioLabel}</span>
              </div>

              <div className="exhibit-actions">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => openModal(coffee)}
                >
                  展品档案 & 配方
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onStartBrew(coffee, 1)}
                >
                  进入冲煮
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="archive-empty" style={{ marginTop: 24 }}>
          <h3 className="exhibit-title">未找到匹配的咖啡馆藏</h3>
          <p className="section-lead" style={{ margin: '8px auto 18px' }}>
            试试切换分类或清空搜索关键词。
          </p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setCategory('全部')
              setSearch('')
            }}
          >
            显示全部馆藏
          </button>
        </div>
      )}

      {/* Specimen Detail & Interactive Brew Calculator Modal */}
      {inspectedCoffee && (
        <SpecimenModal
          coffee={inspectedCoffee}
          servings={modalServings}
          onChangeServings={setModalServings}
          onClose={() => onInspect(null)}
          onStartBrew={(c, s) => {
            onInspect(null)
            onStartBrew(c, s)
          }}
        />
      )}
    </div>
  )
}

function SpecimenModal({
  coffee,
  servings,
  onChangeServings,
  onClose,
  onStartBrew,
}: {
  coffee: CoffeeExhibit
  servings: number
  onChangeServings: (s: number) => void
  onClose: () => void
  onStartBrew: (coffee: CoffeeExhibit, servings: number) => void
}) {
  const scaled = scaleRecipe(coffee, servings)

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="specimen-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="specimen-modal">
        <button
          id="specimen-modal-close"
          type="button"
          className="modal-close"
          aria-label="关闭馆藏详情"
          onClick={onClose}
        >
          ×
        </button>

        <p className="eyebrow">
          {coffee.exhibitNo} · {coffee.origin} · {coffee.altitude}
        </p>
        <h2 id="specimen-modal-title" className="section-heading" style={{ marginBottom: 4 }}>
          {coffee.name}
        </h2>
        <p className="exhibit-en" style={{ fontSize: '1.02rem' }}>
          {coffee.englishName} · {coffee.process} · {coffee.roast}
        </p>

        <div className="specimen-curator-box">
          <strong>策展手记：</strong>
          {coffee.curatorNote}
        </div>

        <div className="specimen-grid">
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <strong style={{ fontSize: '0.92rem' }}>实时粉水比计算器</strong>
              <div className="serving-switcher" role="group" aria-label="选择杯数">
                {[1, 1.5, 2, 3].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`serving-btn ${servings === s ? 'active' : ''}`}
                    onClick={() => onChangeServings(s)}
                  >
                    {s} 杯
                  </button>
                ))}
              </div>
            </div>

            <div className="spec-kpi-grid">
              <div className="spec-kpi">
                <span className="spec-kpi-label">咖啡粉量</span>
                <span className="spec-kpi-value">{scaled.doseGrams} g</span>
              </div>
              <div className="spec-kpi">
                <span className="spec-kpi-label">
                  {coffee.method === 'espresso' || coffee.method === 'milk' || coffee.method === 'dirty'
                    ? '浓缩萃取液重'
                    : '目标注水量'}
                </span>
                <span className="spec-kpi-value">{scaled.waterMl} ml</span>
              </div>
              <div className="spec-kpi">
                <span className="spec-kpi-label">建议水温</span>
                <span className="spec-kpi-value">{coffee.recipe.waterTempC} °C</span>
              </div>
              <div className="spec-kpi">
                <span className="spec-kpi-label">
                  {scaled.milkMl ? coffee.recipe.milkLabel ?? '牛奶/辅料' : '总冲煮时间'}
                </span>
                <span className="spec-kpi-value">
                  {scaled.milkMl ? `${scaled.milkMl} ml` : coffee.recipe.totalTimeLabel}
                </span>
              </div>
            </div>

            <div className="spec-kpi" style={{ marginBottom: 14 }}>
              <span className="spec-kpi-label">研磨粗细刻度（1 极细 — 10 极粗）</span>
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                {coffee.recipe.grindDesc}
              </div>
              <div className="grind-scale" aria-hidden="true">
                {Array.from({ length: 10 }, (_, idx) => (
                  <span
                    key={idx}
                    className={`grind-pip ${idx + 1 === coffee.recipe.grindLevel ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, marginBottom: 8 }}>
                所需器具与物料
              </div>
              <div className="pill-row">
                {coffee.equipment.map((eq) => (
                  <span key={eq} className="tag">
                    {eq}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'var(--paper-bg)',
              borderRadius: 'var(--radius-lg)',
              padding: 18,
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--espresso-600)',
                  marginBottom: 4,
                }}
              >
                五维风味图谱
              </div>
              <FlavorRadar profile={coffee.flavorProfile} size={220} />
              <div className="pill-row" style={{ justifyContent: 'center', marginTop: 8 }}>
                {coffee.flavorNotes.map((n) => (
                  <span key={n} className="tag tag-brass">
                    {n}
                  </span>
                ))}
              </div>
            </div>

            <button
              id="modal-start-brew-btn"
              type="button"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 18 }}
              onClick={() => onStartBrew(coffee, servings)}
            >
              按此参数进入冲煮工坊（{coffee.steps.length} 步）
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
