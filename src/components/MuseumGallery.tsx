import { type CSSProperties, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { EXHIBIT_EXTRAS } from '../data/exhibitExtras'
import { COFFEE_EXHIBITS } from '../data/coffees'
import type {
  CoffeeExhibit,
  DrinkCategory,
  TasteCustomizePreset,
  TemperatureStyle,
} from '../types/coffee'
import {
  copyTextToClipboard,
  formatRecipeShareText,
  playGentleChime,
  scaleRecipe,
  TASTE_PRESET_OPTIONS,
} from '../utils/platform'
import { buildShareUrl } from '../utils/router'
import { FlavorRadar } from './FlavorRadar'
import { BookmarkHeartIcon, CupEmblem } from './Icons'

interface MuseumGalleryProps {
  inspectedCoffee: CoffeeExhibit | null
  onInspect: (coffee: CoffeeExhibit | null) => void
  onStartBrew: (
    coffee: CoffeeExhibit,
    servings?: number,
    tastePreset?: TasteCustomizePreset
  ) => void
  unlockedIds: Set<string>
  wishlistIds: Set<string>
  onToggleWishlist: (coffeeId: string) => void
}

const CATEGORIES: ('全部' | DrinkCategory)[] = [
  '全部',
  '手冲黑咖',
  '意式奶咖',
  '冰爽特调',
  '复古器具',
]

type RoastFilter = 'all' | 'light' | 'medium' | 'dark'
type DifficultyFilter = 'all' | CoffeeExhibit['recipe']['difficulty']
type SortOption = 'default' | 'acidity' | 'sweetness' | 'body' | 'aroma'

export function MuseumGallery({
  inspectedCoffee,
  onInspect,
  onStartBrew,
  unlockedIds,
  wishlistIds,
  onToggleWishlist,
}: MuseumGalleryProps) {
  const [category, setCategory] = useState<'全部' | DrinkCategory>('全部')
  const [roastFilter, setRoastFilter] = useState<RoastFilter>('all')
  const [tempFilter, setTempFilter] = useState<'all' | TemperatureStyle>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [onlyWishlist, setOnlyWishlist] = useState(false)
  const [search, setSearch] = useState('')
  const [modalServings, setModalServings] = useState(1)
  const [modalPreset, setModalPreset] = useState<TasteCustomizePreset>('standard')

  // Dual-coffee comparison state (up to 2 IDs)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  // Close open modals on Escape key
  useEffect(() => {
    if (!inspectedCoffee && !showCompareModal) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showCompareModal) setShowCompareModal(false)
        else if (inspectedCoffee) onInspect(null)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [inspectedCoffee, onInspect, showCompareModal])

  const categoryCounts = useMemo(() => {
    const counts: Record<'全部' | DrinkCategory, number> = {
      全部: COFFEE_EXHIBITS.length,
      手冲黑咖: 0,
      意式奶咖: 0,
      冰爽特调: 0,
      复古器具: 0,
    }
    COFFEE_EXHIBITS.forEach((c) => {
      counts[c.category] += 1
    })
    return counts
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = COFFEE_EXHIBITS.filter((c) => {
      if (category !== '全部' && c.category !== category) return false
      if (onlyWishlist && !wishlistIds.has(c.id)) return false
      if (tempFilter !== 'all' && c.temperature !== tempFilter) return false
      if (difficultyFilter !== 'all' && c.recipe.difficulty !== difficultyFilter) return false
      if (roastFilter === 'light' && c.roastValue > 2) return false
      if (roastFilter === 'medium' && c.roastValue !== 3) return false
      if (roastFilter === 'dark' && c.roastValue < 4) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.englishName.toLowerCase().includes(q) ||
        c.exhibitNo.toLowerCase().includes(q) ||
        c.origin.toLowerCase().includes(q) ||
        c.process.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.roast.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.flavorNotes.some((n) => n.toLowerCase().includes(q)) ||
        c.methodLabel.toLowerCase().includes(q)
      )
    })

    if (sortBy === 'default') return list
    return [...list].sort((a, b) => b.flavorProfile[sortBy] - a.flavorProfile[sortBy])
  }, [category, difficultyFilter, onlyWishlist, roastFilter, search, sortBy, tempFilter, wishlistIds])

  const hasActiveFilter =
    category !== '全部' ||
    roastFilter !== 'all' ||
    tempFilter !== 'all' ||
    difficultyFilter !== 'all' ||
    onlyWishlist ||
    search.trim().length > 0

  const resetAllFilters = () => {
    setCategory('全部')
    setRoastFilter('all')
    setTempFilter('all')
    setDifficultyFilter('all')
    setSortBy('default')
    setOnlyWishlist(false)
    setSearch('')
  }

  const openModal = (coffee: CoffeeExhibit) => {
    setModalServings(1)
    setModalPreset('standard')
    onInspect(coffee)
  }

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
  }

  const comparePair = useMemo(
    () =>
      compareIds
        .map((id) => COFFEE_EXHIBITS.find((c) => c.id === id))
        .filter((c): c is CoffeeExhibit => Boolean(c)),
    [compareIds]
  )

  return (
    <div className="view-enter">
      <div className="results-header" style={{ marginBottom: 22 }}>
        <div>
          <p className="eyebrow">PERMANENT COLLECTION · 永久馆藏名录</p>
          <h1 className="section-heading">世界咖啡风味展厅</h1>
          <p className="section-lead">
            收录 {COFFEE_EXHIBITS.length} 款经典与创意馆藏，支持按烘焙度与想喝清单检索，或任选两款开启「双豆风味雷达对比」。
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {wishlistIds.size > 0 && (
            <button
              type="button"
              className={`filter-pill ${onlyWishlist ? 'active' : ''}`}
              onClick={() => setOnlyWishlist((w) => !w)}
            >
              ♥ 想喝清单 ({wishlistIds.size})
            </button>
          )}
          <span className="tag tag-sage mono">
            已点亮 {unlockedIds.size} / {COFFEE_EXHIBITS.length} 款藏品
          </span>
        </div>
      </div>

      <div className="gallery-toolbar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="pill-row">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat} ({categoryCounts[cat]})
              </button>
            ))}
          </div>

          <div className="pill-row">
            {[
              { id: 'all' as const, label: '全部烘焙度' },
              { id: 'light' as const, label: '浅烘 · 花果茶感' },
              { id: 'medium' as const, label: '中烘 · 甜润平衡' },
              { id: 'dark' as const, label: '中深/深烘 · 坚果黑巧' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                className={`mood-pill ${roastFilter === r.id ? 'active' : ''}`}
                style={{ padding: '4px 11px', fontSize: '0.78rem' }}
                onClick={() => setRoastFilter(r.id)}
              >
                {r.label}
              </button>
            ))}

            <span className="filter-row-divider" style={{ opacity: 0.25, alignSelf: 'center' }}>|</span>

            {[
              { id: 'all' as const, label: '全部温度' },
              { id: '热饮' as const, label: '热饮' },
              { id: '冷饮' as const, label: '冷饮' },
              { id: '冷热分层' as const, label: '冷热分层' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                className={`mood-pill ${tempFilter === t.id ? 'active' : ''}`}
                style={{ padding: '4px 11px', fontSize: '0.78rem' }}
                onClick={() => setTempFilter(t.id)}
              >
                {t.label}
              </button>
            ))}

            <span className="filter-row-divider" style={{ opacity: 0.25, alignSelf: 'center' }}>|</span>

            {[
              { id: 'all' as const, label: '全部难度' },
              { id: '新手友好' as const, label: '新手友好' },
              { id: '进阶风味' as const, label: '进阶风味' },
              { id: '专业品鉴' as const, label: '专业品鉴' },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                className={`mood-pill ${difficultyFilter === d.id ? 'active' : ''}`}
                style={{ padding: '4px 11px', fontSize: '0.78rem' }}
                onClick={() => setDifficultyFilter(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            id="gallery-sort-select"
            aria-label="展品排序方式"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            style={{
              padding: '9px 12px',
              borderRadius: 999,
              border: '1px solid var(--border-strong)',
              background: 'var(--paper-surface)',
              fontSize: '0.82rem',
            }}
          >
            <option value="default">按馆藏编号排序</option>
            <option value="aroma">花果香气由高到低</option>
            <option value="sweetness">甘甜度由高到低</option>
            <option value="acidity">明亮果酸由高到低</option>
            <option value="body">醇厚度由高到低</option>
          </select>

          <input
            id="gallery-search-input"
            type="search"
            className="search-input"
            placeholder="搜索豆名、产区或器具（如 越南 / 虹吸）"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {hasActiveFilter && (
        <div className="gallery-filter-summary">
          <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--espresso-600)' }}>
            当前匹配展示 {filtered.length} / {COFFEE_EXHIBITS.length} 款馆藏
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
            onClick={resetAllFilters}
          >
            × 清空全部筛选
          </button>
        </div>
      )}

      <div className="gallery-grid">
        {filtered.map((coffee) => {
          const isUnlocked = unlockedIds.has(coffee.id)
          const wished = wishlistIds.has(coffee.id)
          const inCompare = compareIds.includes(coffee.id)

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
                <span className="exhibit-no" style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {coffee.exhibitNo} · {coffee.storyYear}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {isUnlocked ? (
                    <span className="tag tag-sage">已点亮</span>
                  ) : (
                    <span className="tag">{coffee.recipe.difficulty}</span>
                  )}
                  <button
                    type="button"
                    className={`mood-pill ${inCompare ? 'active' : ''}`}
                    style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                    onClick={() => toggleCompare(coffee.id)}
                    title="加入双豆风味对比"
                  >
                    {inCompare ? '✓ 对比中' : '+ 对比'}
                  </button>
                  <button
                    type="button"
                    className="wishlist-icon-btn"
                    aria-label={wished ? '移出想喝清单' : '加入想喝清单'}
                    onClick={() => onToggleWishlist(coffee.id)}
                  >
                    <BookmarkHeartIcon saved={wished} size={14} />
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
                <span className="roast-dots" title={`烘焙度：${coffee.roast} (${coffee.roastValue}/5)`}>
                  烘焙
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`roast-dot ${i < coffee.roastValue ? 'filled' : ''}`}
                    />
                  ))}
                </span>
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
                  onClick={() => onStartBrew(coffee, 1, 'standard')}
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
            试试切换分类、烘焙度或清空搜索关键词。
          </p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={resetAllFilters}
          >
            重置全部筛选
          </button>
        </div>
      )}

      {/* Floating Comparison Bar */}
      {comparePair.length > 0 &&
        createPortal(
          <div className="compare-bar" role="region" aria-label="馆藏对比栏">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className="mono" style={{ fontSize: '0.76rem', color: 'var(--brass-700)', fontWeight: 600 }}>
                风味对比台 ({comparePair.length}/2)
              </span>
              {comparePair.map((c) => (
                <span key={c.id} className="tag tag-brass">
                  {c.name.split('·')[0].trim()}
                </span>
              ))}
              {comparePair.length === 1 && (
                <span style={{ fontSize: '0.8rem', color: 'var(--espresso-600)' }}>
                  再选 1 款即可叠加五维风味图对比
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setCompareIds([])}
              >
                清空
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={comparePair.length < 2}
                style={{ opacity: comparePair.length < 2 ? 0.5 : 1 }}
                onClick={() => setShowCompareModal(true)}
              >
                开启双豆对比 →
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* Specimen Detail & Interactive Brew Calculator Modal */}
      {inspectedCoffee &&
        createPortal(
          <SpecimenModal
            coffee={inspectedCoffee}
            servings={modalServings}
            tastePreset={modalPreset}
            onChangeServings={setModalServings}
            onChangeTastePreset={setModalPreset}
            onClose={() => onInspect(null)}
            onStartBrew={(c, s, preset) => {
              onInspect(null)
              onStartBrew(c, s, preset)
            }}
          />,
          document.body
        )}

      {/* Dual Exhibit Comparison Modal */}
      {showCompareModal &&
        comparePair.length === 2 &&
        createPortal(
          <CompareExhibitsModal
            first={comparePair[0]}
            second={comparePair[1]}
            onClose={() => setShowCompareModal(false)}
            onStartBrew={(c) => {
              setShowCompareModal(false)
              onStartBrew(c, 1, 'standard')
            }}
          />,
          document.body
        )}
    </div>
  )
}

function CompareExhibitsModal({
  first,
  second,
  onClose,
  onStartBrew,
}: {
  first: CoffeeExhibit
  second: CoffeeExhibit
  onClose: () => void
  onStartBrew: (coffee: CoffeeExhibit) => void
}) {
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="双豆风味对比"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="specimen-modal">
        <button type="button" className="modal-close" aria-label="关闭对比" onClick={onClose}>
          ×
        </button>

        <p className="eyebrow">CURATORIAL COMPARISON · 双展品风味与参数对照</p>
        <h2 className="section-heading" style={{ fontSize: '1.45rem', marginBottom: 14 }}>
          {first.name} <span style={{ color: 'var(--brass-600)' }}>vs</span> {second.name}
        </h2>

        <div className="specimen-grid" style={{ alignItems: 'center' }}>
          <div style={{ minWidth: 0 }}>
            <div className="compare-table-wrap">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>对比维度</th>
                    <th style={{ color: 'var(--brass-700)', fontWeight: 700 }}>
                      ● {first.name.split('·')[0].trim()}
                    </th>
                    <th style={{ color: 'var(--sage-600)', fontWeight: 700 }}>
                      ◆ {second.name.split('·')[0].trim()}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>产区与处理</th>
                    <td>{first.origin.split('·')[0]} · {first.process}</td>
                    <td>{second.origin.split('·')[0]} · {second.process}</td>
                  </tr>
                  <tr>
                    <th>烘焙与温度</th>
                    <td>{first.roast} · {first.temperature}</td>
                    <td>{second.roast} · {second.temperature}</td>
                  </tr>
                  <tr>
                    <th>器具与水温</th>
                    <td>{first.methodLabel} · {first.recipe.waterTempC}°C</td>
                    <td>{second.methodLabel} · {second.recipe.waterTempC}°C</td>
                  </tr>
                  <tr>
                    <th>标准粉水比</th>
                    <td className="mono">{first.recipe.ratioLabel}</td>
                    <td className="mono">{second.recipe.ratioLabel}</td>
                  </tr>
                  <tr>
                    <th>研磨粗细</th>
                    <td>刻度 {first.recipe.grindLevel}/10</td>
                    <td>刻度 {second.recipe.grindLevel}/10</td>
                  </tr>
                  <tr>
                    <th>核心风味调</th>
                    <td>{first.flavorNotes.slice(0, 3).join(' / ')}</td>
                    <td>{second.flavorNotes.slice(0, 3).join(' / ')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
                onClick={() => onStartBrew(first)}
              >
                冲煮 {first.name.split('·')[0].trim()}
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ flex: 1 }}
                onClick={() => onStartBrew(second)}
              >
                冲煮 {second.name.split('·')[0].trim()}
              </button>
            </div>
          </div>

          <div
            style={{
              background: 'var(--paper-bg)',
              borderRadius: 'var(--radius-lg)',
              padding: 18,
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 6 }}>
              五维风味重叠对照图
            </div>
            <FlavorRadar
              profile={first.flavorProfile}
              compareProfile={second.flavorProfile}
              size={236}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 16,
                fontSize: '0.78rem',
                marginTop: 8,
              }}
            >
              <span style={{ color: 'var(--brass-700)', fontWeight: 600 }}>
                ━━ {first.name.split('·')[0].trim()}
              </span>
              <span style={{ color: 'var(--sage-600)', fontWeight: 600 }}>
                ┅┅ {second.name.split('·')[0].trim()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SpecimenModal({
  coffee,
  servings,
  tastePreset,
  onChangeServings,
  onChangeTastePreset,
  onClose,
  onStartBrew,
}: {
  coffee: CoffeeExhibit
  servings: number
  tastePreset: TasteCustomizePreset
  onChangeServings: (s: number) => void
  onChangeTastePreset: (p: TasteCustomizePreset) => void
  onClose: () => void
  onStartBrew: (
    coffee: CoffeeExhibit,
    servings: number,
    tastePreset: TasteCustomizePreset
  ) => void
}) {
  const [copiedRecipe, setCopiedRecipe] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const scaled = scaleRecipe(coffee, servings, tastePreset)
  const extra = EXHIBIT_EXTRAS[coffee.id]

  const handleCopyRecipe = async () => {
    const ok = await copyTextToClipboard(formatRecipeShareText(coffee, servings, tastePreset))
    if (ok) {
      playGentleChime('tick')
      setCopiedRecipe(true)
      window.setTimeout(() => setCopiedRecipe(false), 2200)
    }
  }

  const handleCopyExhibitLink = async () => {
    const ok = await copyTextToClipboard(
      buildShareUrl({ view: 'gallery', exhibitId: coffee.id })
    )
    if (ok) {
      playGentleChime('tick')
      setCopiedLink(true)
      window.setTimeout(() => setCopiedLink(false), 2200)
    }
  }

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
          {extra && (
            <div className="specimen-extra-meta">
              <span>🍰 推荐甜点搭档：{extra.pairing}</span>
              <span>🌡 最佳赏味期：{extra.tastingWindow}</span>
            </div>
          )}
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

            {/* Taste Customizer inside Specimen Modal */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--espresso-600)', marginBottom: 6 }}>
                按你偏好的入口微调配方：
              </div>
              <div className="pill-row">
                {TASTE_PRESET_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`mood-pill ${tastePreset === opt.id ? 'active' : ''}`}
                    style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                    onClick={() => onChangeTastePreset(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {tastePreset !== 'standard' && (
                <div style={{ fontSize: '0.76rem', color: 'var(--brass-700)', marginTop: 6 }}>
                  ✦ {scaled.coachNote}
                </div>
              )}
            </div>

            <div className="spec-kpi-grid">
              <div className="spec-kpi">
                <span className="spec-kpi-label">咖啡粉量</span>
                <span className="spec-kpi-value">{scaled.doseGrams} g</span>
              </div>
              <div className="spec-kpi">
                <span className="spec-kpi-label">
                  {coffee.method === 'espresso' || coffee.method === 'milk' || coffee.method === 'dirty'
                    ? '浓缩/基底液重'
                    : '目标注水量'}
                </span>
                <span className="spec-kpi-value">{scaled.waterMl} ml</span>
              </div>
              <div className="spec-kpi">
                <span className="spec-kpi-label">建议水温</span>
                <span className="spec-kpi-value">{scaled.waterTempC} °C</span>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
              <button
                id="modal-start-brew-btn"
                type="button"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                onClick={() => onStartBrew(coffee, servings, tastePreset)}
              >
                按此参数进入冲煮工坊（{coffee.steps.length} 步）
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1 }}
                  onClick={handleCopyRecipe}
                >
                  {copiedRecipe ? '✓ 已复制配方' : '复制文字配方'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1 }}
                  onClick={handleCopyExhibitLink}
                >
                  {copiedLink ? '✓ 已复制直达链接' : '分享展品链接'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
