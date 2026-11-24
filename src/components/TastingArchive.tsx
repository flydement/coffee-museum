import { useEffect, useMemo, useRef, useState } from 'react'
import { COFFEE_EXHIBITS } from '../data/coffees'
import type {
  CoffeeExhibit,
  FlavorProfile,
  PostcardTheme,
  SavedBrewRecord,
  TasteCustomizePreset,
} from '../types/coffee'
import {
  downloadTastingPostcard,
  POSTCARD_THEME_OPTIONS,
  renderPostcardDataUrl,
} from '../utils/exportCard'
import { computeCuratorBadges } from '../utils/platform'
import { FlavorRadar } from './FlavorRadar'

interface TastingArchiveProps {
  records: SavedBrewRecord[]
  onDeleteRecord: (recordId: string) => void
  onImportRecords: (records: SavedBrewRecord[]) => void
  onRebrew: (
    coffee: CoffeeExhibit,
    servings: number,
    tastePreset?: TasteCustomizePreset
  ) => void
  onGoCurator: () => void
}

export function TastingArchive({
  records,
  onDeleteRecord,
  onImportRecords,
  onRebrew,
  onGoCurator,
}: TastingArchiveProps) {
  const [previewRec, setPreviewRec] = useState<SavedBrewRecord | null>(null)
  const [postcardTheme, setPostcardTheme] = useState<PostcardTheme>('parchment')
  const [backupNotice, setBackupNotice] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const badges = computeCuratorBadges(records, COFFEE_EXHIBITS)
  const uniqueCount = new Set(records.map((r) => r.coffeeId)).size
  const avgRating =
    records.length > 0
      ? (records.reduce((sum, r) => sum + r.rating, 0) / records.length).toFixed(1)
      : '—'
  const unlockedBadges = badges.filter((b) => b.unlocked).length

  useEffect(() => {
    if (!previewRec) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewRec(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [previewRec])

  const averageFlavorProfile = useMemo<FlavorProfile | null>(() => {
    if (records.length === 0) return null
    const sum = records.reduce(
      (acc, r) => ({
        acidity: acc.acidity + r.flavorProfile.acidity,
        sweetness: acc.sweetness + r.flavorProfile.sweetness,
        body: acc.body + r.flavorProfile.body,
        bitterness: acc.bitterness + r.flavorProfile.bitterness,
        aroma: acc.aroma + r.flavorProfile.aroma,
      }),
      { acidity: 0, sweetness: 0, body: 0, bitterness: 0, aroma: 0 }
    )
    const n = records.length
    return {
      acidity: Math.round(sum.acidity / n),
      sweetness: Math.round(sum.sweetness / n),
      body: Math.round(sum.body / n),
      bitterness: Math.round(sum.bitterness / n),
      aroma: Math.round(sum.aroma / n),
    }
  }, [records])

  const previewDataUrl = useMemo(() => {
    if (!previewRec) return ''
    return renderPostcardDataUrl(previewRec, postcardTheme)
  }, [postcardTheme, previewRec])

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `拾光咖啡博物馆-馆藏备份-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    setBackupNotice('已导出馆藏备份 JSON 文件')
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (item): item is SavedBrewRecord =>
              Boolean(item && typeof item.recordId === 'string' && typeof item.coffeeId === 'string')
          )
          onImportRecords(valid)
          setBackupNotice(`成功导入并合并 ${valid.length} 条馆藏记录`)
        } else {
          setBackupNotice('备份文件格式不正确')
        }
      } catch {
        setBackupNotice('无法解析该 JSON 备份文件')
      }
      e.target.value = ''
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <div className="results-header" style={{ marginBottom: 24 }}>
        <div>
          <p className="eyebrow">PERSONAL TASTING ARCHIVE · 个人馆藏陈列室</p>
          <h1 className="section-heading">我亲手冲煮的咖啡馆藏</h1>
          <p className="section-lead">
            每一次完成的冲煮都会被编入专属馆藏编号，支持切换三种复古纸张导出明信片，或跨端备份迁移你的品鉴记录。
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {records.length > 0 && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleExportJson}
            >
              导出备份 JSON
            </button>
          )}
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            导入馆藏备份
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
        </div>
      </div>

      {backupNotice && (
        <div
          style={{
            marginBottom: 18,
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--sage-100)',
            color: 'var(--sage-600)',
            fontSize: '0.84rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>✓ {backupNotice}</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setBackupNotice(null)}
          >
            关闭
          </button>
        </div>
      )}

      {/* Summary Plaques */}
      <div className="archive-stats-row">
        <div className="stat-plaque">
          <div className="stat-plaque-val">{records.length}</div>
          <div className="stat-plaque-label">累计制作杯数</div>
        </div>
        <div className="stat-plaque">
          <div className="stat-plaque-val">
            {uniqueCount} / {COFFEE_EXHIBITS.length}
          </div>
          <div className="stat-plaque-label">已点亮风味展品</div>
        </div>
        <div className="stat-plaque">
          <div className="stat-plaque-val">{avgRating}</div>
          <div className="stat-plaque-label">平均品鉴评分</div>
        </div>
        <div className="stat-plaque">
          <div className="stat-plaque-val">
            {unlockedBadges} / {badges.length}
          </div>
          <div className="stat-plaque-label">已解锁策展徽章</div>
        </div>
      </div>

      {/* Personal Flavor Portrait */}
      {averageFlavorProfile && (
        <section
          aria-label="个人风味偏好画像"
          style={{
            marginBottom: 24,
            padding: '20px 24px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--paper-surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '1 1 280px' }}>
            <p className="eyebrow" style={{ marginBottom: 4 }}>
              PERSONAL PALATE PORTRAIT · 个人风味偏好画像
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: '0 0 8px' }}>
              基于你已冲煮的 {records.length} 杯馆藏生成的风味指纹
            </h2>
            <p className="section-lead" style={{ margin: '0 0 12px' }}>
              酸度均值 {averageFlavorProfile.acidity} · 甜感均值 {averageFlavorProfile.sweetness} · 醇厚均值{' '}
              {averageFlavorProfile.body} · 苦韵均值 {averageFlavorProfile.bitterness} · 花果香均值{' '}
              {averageFlavorProfile.aroma}
            </p>
            <div className="pill-row">
              {averageFlavorProfile.sweetness >= 80 && <span className="tag tag-brass">偏爱甘甜圆润</span>}
              {averageFlavorProfile.acidity >= 65 && <span className="tag tag-brass">偏爱明亮果酸</span>}
              {averageFlavorProfile.body >= 78 && <span className="tag tag-brass">偏爱丝绒醇厚</span>}
              {averageFlavorProfile.aroma >= 85 && <span className="tag tag-sage">花果香气控</span>}
            </div>
          </div>
          <div style={{ flex: '0 0 auto', margin: '0 auto' }}>
            <FlavorRadar profile={averageFlavorProfile} size={186} />
          </div>
        </section>
      )}

      {/* Curator Badges */}
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: '0 0 12px' }}>
          博物馆策展徽章
        </h2>
        <div className="badges-row">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`badge-card ${badge.unlocked ? 'unlocked' : ''}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--brass-700)' }}>
                  {badge.unlocked ? '★ 已获得' : badge.progress}
                </span>
              </div>
              <strong style={{ fontSize: '0.94rem', fontFamily: 'var(--font-serif)' }}>
                {badge.title}
              </strong>
              <span style={{ fontSize: '0.76rem', color: 'var(--espresso-600)', lineHeight: 1.45 }}>
                {badge.subtitle}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Brews List */}
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: '0 0 14px' }}>
        馆藏冲煮记录
      </h2>

      {records.length === 0 ? (
        <div className="archive-empty">
          <p className="eyebrow">EXHIBITION VAULT EMPTY</p>
          <h3 className="exhibit-title" style={{ marginBottom: 8 }}>
            你的私人咖啡馆藏还没有第一件作品
          </h3>
          <p className="section-lead" style={{ margin: '0 auto 20px' }}>
            去风味策展台选一种你今天想喝的口味，跟着冲煮工坊完成操作，就能点亮你的第一张馆藏卡片。
          </p>
          <button
            id="archive-empty-cta"
            type="button"
            className="btn btn-primary btn-lg"
            onClick={onGoCurator}
          >
            去挑选第一杯咖啡
          </button>
        </div>
      ) : (
        <div className="archive-grid">
          {records.map((rec) => {
            const matchedCoffee = COFFEE_EXHIBITS.find((c) => c.id === rec.coffeeId)
            return (
              <article key={rec.recordId} className="exhibit-card">
                <div className="exhibit-top-row">
                  <span className="exhibit-no">
                    {rec.catalogNumber} · {rec.exhibitNo}
                  </span>
                  <span className="mono" style={{ fontSize: '0.76rem', color: 'var(--espresso-600)' }}>
                    {new Date(rec.brewedAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>

                <div>
                  <h3 className="exhibit-title">{rec.coffeeName}</h3>
                  <p className="exhibit-en">{rec.englishName}</p>
                </div>

                <div style={{ color: 'var(--brass-600)', fontSize: '1rem', letterSpacing: 2 }}>
                  {'★'.repeat(rec.rating)}
                  {'☆'.repeat(5 - rec.rating)}
                </div>

                <p className="exhibit-subtitle" style={{ fontStyle: 'italic' }}>
                  “{rec.tastingNote.trim() || '按标准馆藏参数完成冲煮，香气干净平衡。'}”
                </p>

                <div className="exhibit-spec-strip">
                  <span>{rec.methodLabel}</span>
                  <span className="mono">{rec.doseGrams}g 粉</span>
                  <span className="mono">{rec.waterMl}ml 液</span>
                  {rec.milkMl && <span className="mono">{rec.milkMl}ml 奶/辅料</span>}
                  <span className="mono">{rec.waterTempC}°C</span>
                </div>

                <div className="exhibit-actions">
                  <button
                    type="button"
                    className="btn btn-brass btn-sm"
                    onClick={() => setPreviewRec(rec)}
                  >
                    纪念明信片
                  </button>
                  {matchedCoffee && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() =>
                        onRebrew(matchedCoffee, rec.servings, rec.tastePreset)
                      }
                    >
                      复刻再冲
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ flex: 0 }}
                    onClick={() => onDeleteRecord(rec.recordId)}
                  >
                    删除
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Postcard Theme Preview Modal */}
      {previewRec && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="纪念明信片预览与导出"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewRec(null)
          }}
        >
          <div className="specimen-modal" style={{ maxWidth: 520, textAlign: 'center' }}>
            <button
              type="button"
              className="modal-close"
              aria-label="关闭预览"
              onClick={() => setPreviewRec(null)}
            >
              ×
            </button>
            <p className="eyebrow">{previewRec.catalogNumber} · 馆藏纪念明信片</p>
            <h3 className="section-heading" style={{ fontSize: '1.35rem', marginBottom: 14 }}>
              {previewRec.coffeeName}
            </h3>

            {previewDataUrl && (
              <div className="postcard-preview-frame" style={{ maxWidth: 310 }}>
                <img src={previewDataUrl} alt="馆藏明信片高清预览" />
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 8,
                flexWrap: 'wrap',
                margin: '16px 0',
              }}
            >
              {POSTCARD_THEME_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`theme-swatch-btn ${postcardTheme === t.id ? 'active' : ''}`}
                  onClick={() => setPostcardTheme(t.id)}
                >
                  <span className="swatch-dot" style={{ background: t.swatch }} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={() => downloadTastingPostcard(previewRec, postcardTheme)}
            >
              下载高清 PNG 明信片
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
