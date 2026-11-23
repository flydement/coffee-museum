import { COFFEE_EXHIBITS } from '../data/coffees'
import type { CoffeeExhibit, SavedBrewRecord } from '../types/coffee'
import { downloadTastingPostcard } from '../utils/exportCard'
import { computeCuratorBadges } from '../utils/platform'

interface TastingArchiveProps {
  records: SavedBrewRecord[]
  onDeleteRecord: (recordId: string) => void
  onRebrew: (coffee: CoffeeExhibit, servings: number) => void
  onGoCurator: () => void
}

export function TastingArchive({
  records,
  onDeleteRecord,
  onRebrew,
  onGoCurator,
}: TastingArchiveProps) {
  const badges = computeCuratorBadges(records, COFFEE_EXHIBITS)
  const uniqueCount = new Set(records.map((r) => r.coffeeId)).size
  const avgRating =
    records.length > 0
      ? (records.reduce((sum, r) => sum + r.rating, 0) / records.length).toFixed(1)
      : '—'
  const unlockedBadges = badges.filter((b) => b.unlocked).length

  return (
    <div>
      <div className="results-header" style={{ marginBottom: 24 }}>
        <div>
          <p className="eyebrow">PERSONAL TASTING ARCHIVE · 个人馆藏陈列室</p>
          <h1 className="section-heading">我亲手冲煮的咖啡馆藏</h1>
          <p className="section-lead">
            每一次完成的冲煮都会被编入专属馆藏编号，随时导出复古明信片或一键复刻当时的粉水参数。
          </p>
        </div>
      </div>

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
                    onClick={() => downloadTastingPostcard(rec)}
                  >
                    导出明信片
                  </button>
                  {matchedCoffee && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => onRebrew(matchedCoffee, rec.servings)}
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
    </div>
  )
}
