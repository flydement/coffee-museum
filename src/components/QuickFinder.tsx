import { useEffect, useMemo, useRef, useState } from 'react'
import { COFFEE_EXHIBITS } from '../data/coffees'
import type { AppView, AtlasSection, CoffeeExhibit } from '../types/coffee'
import { playGentleChime } from '../utils/platform'
import { searchMuseumCatalog, type MuseumShortcutItem } from '../utils/search'
import { CupEmblem, SearchIcon } from './Icons'

interface QuickFinderProps {
  open: boolean
  onClose: () => void
  onNavigateView: (view: AppView, atlasSection?: AtlasSection) => void
  onInspectCoffee: (coffee: CoffeeExhibit) => void
  onStartBrew: (coffee: CoffeeExhibit) => void
}

type FlatRow =
  | { kind: 'exhibit'; coffee: CoffeeExhibit }
  | { kind: 'shortcut'; item: MuseumShortcutItem }

export function QuickFinder({
  open,
  onClose,
  onNavigateView,
  onInspectCoffee,
  onStartBrew,
}: QuickFinderProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const results = useMemo(
    () => searchMuseumCatalog(query, COFFEE_EXHIBITS, 8),
    [query]
  )

  const flatRows = useMemo<FlatRow[]>(() => {
    const exhibitRows: FlatRow[] = results.exhibits.map((coffee) => ({
      kind: 'exhibit',
      coffee,
    }))
    const shortcutRows: FlatRow[] = results.shortcuts.map((item) => ({
      kind: 'shortcut',
      item,
    }))
    return [...exhibitRows, ...shortcutRows]
  }, [results.exhibits, results.shortcuts])

  const safeActiveIndex =
    flatRows.length === 0 ? -1 : Math.min(activeIndex, flatRows.length - 1)

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => {
      inputRef.current?.focus()
    }, 20)
    return () => window.clearTimeout(timer)
  }, [open])

  const executeRow = (row: FlatRow) => {
    playGentleChime('tick')
    onClose()
    if (row.kind === 'exhibit') {
      onInspectCoffee(row.coffee)
    } else {
      onNavigateView(row.item.view, row.item.atlasSection)
    }
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (flatRows.length === 0) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((prev) => (prev + 1) % flatRows.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((prev) => (prev - 1 + flatRows.length) % flatRows.length)
      } else if (e.key === 'Enter' && safeActiveIndex >= 0) {
        const activeTag = (document.activeElement as HTMLElement | null)?.tagName
        if (activeTag === 'BUTTON') return
        e.preventDefault()
        const target = flatRows[safeActiveIndex]
        if (target) {
          playGentleChime('tick')
          onClose()
          if (target.kind === 'exhibit') {
            onInspectCoffee(target.coffee)
          } else {
            onNavigateView(target.item.view, target.item.atlasSection)
          }
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [flatRows, onClose, onInspectCoffee, onNavigateView, open, safeActiveIndex])

  if (!open) return null

  return (
    <div
      className="modal-backdrop quick-finder-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="全馆速查检索台"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="quick-finder-modal">
        <div className="quick-finder-input-row">
          <SearchIcon size={18} />
          <input
            ref={inputRef}
            id="quick-finder-input"
            type="search"
            className="quick-finder-input"
            placeholder="搜索 32 款咖啡展品、产区、风味词、器具或馆内工具（如 艺伎 / 虹吸 / 诊断）…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0)
            }}
          />
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px 9px', fontSize: '0.75rem' }}
            onClick={onClose}
          >
            ESC
          </button>
        </div>

        <div className="quick-finder-body">
          {flatRows.length === 0 ? (
            <div className="quick-finder-empty">
              未找到与「{query}」匹配的展品或功能，试试搜「耶加」「抹茶」「冷萃」或「风味轮」。
            </div>
          ) : (
            <>
              {results.exhibits.length > 0 && (
                <div className="quick-finder-section">
                  <div className="quick-finder-section-title">
                    {query.trim() ? `匹配馆藏展品（${results.exhibits.length}）` : '精选馆藏直达'}
                  </div>
                  {results.exhibits.map((coffee, idx) => {
                    const isSelected = safeActiveIndex === idx
                    return (
                      <div
                        key={coffee.id}
                        className={`quick-finder-row ${isSelected ? 'active' : ''}`}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => executeRow({ kind: 'exhibit', coffee })}
                      >
                        <div className="quick-finder-row-main">
                          <CupEmblem
                            method={coffee.method}
                            liquid={coffee.palette.liquid}
                            crema={coffee.palette.crema}
                          />
                          <div style={{ minWidth: 0 }}>
                            <div className="quick-finder-row-title">
                              <span className="mono quick-finder-no">{coffee.exhibitNo}</span>
                              <span>{coffee.name}</span>
                            </div>
                            <div className="quick-finder-row-sub">
                              {coffee.methodLabel} · {coffee.roast} · {coffee.flavorNotes.slice(0, 3).join(' / ')}
                            </div>
                          </div>
                        </div>
                        <div
                          className="quick-finder-row-actions"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 10px', fontSize: '0.76rem' }}
                            onClick={() => {
                              playGentleChime('tick')
                              onClose()
                              onInspectCoffee(coffee)
                            }}
                          >
                            档案
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 10px', fontSize: '0.76rem' }}
                            onClick={() => {
                              playGentleChime('tick')
                              onClose()
                              onStartBrew(coffee)
                            }}
                          >
                            冲煮
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {results.shortcuts.length > 0 && (
                <div className="quick-finder-section">
                  <div className="quick-finder-section-title">展厅与工具直达</div>
                  {results.shortcuts.map((item, offset) => {
                    const rowIdx = results.exhibits.length + offset
                    const isSelected = safeActiveIndex === rowIdx
                    return (
                      <div
                        key={item.id}
                        className={`quick-finder-row ${isSelected ? 'active' : ''}`}
                        onMouseEnter={() => setActiveIndex(rowIdx)}
                        onClick={() => executeRow({ kind: 'shortcut', item })}
                      >
                        <div className="quick-finder-row-main">
                          <span className="tag tag-brass mono" style={{ flexShrink: 0 }}>
                            {item.kind === 'atlas' ? '博物' : '展厅'}
                          </span>
                          <div style={{ minWidth: 0 }}>
                            <div className="quick-finder-row-title">{item.title}</div>
                            <div className="quick-finder-row-sub">{item.subtitle}</div>
                          </div>
                        </div>
                        <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--espresso-400)' }}>
                          ↵ 进入
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        <div className="quick-finder-footer mono">
          <span>↑↓ 选择</span>
          <span>↵ 打开展品档案或进入展厅</span>
          <span>⌘K / Ctrl+K 随时唤出</span>
        </div>
      </div>
    </div>
  )
}
