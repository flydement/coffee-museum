import { useCallback, useEffect, useState } from 'react'
import { COFFEE_EXHIBITS } from '../data/coffees'
import type { CoffeeExhibit, SavedBrewRecord } from '../types/coffee'
import { downloadTastingPostcard } from '../utils/exportCard'
import { formatSeconds, playGentleChime, scaleRecipe } from '../utils/platform'
import { BrewAnimation } from './BrewAnimation'
import { FlavorRadar } from './FlavorRadar'
import { SoundIcon } from './Icons'

interface BrewStudioProps {
  coffee: CoffeeExhibit
  servings: number
  onChangeCoffee: (coffee: CoffeeExhibit) => void
  onChangeServings: (servings: number) => void
  onSaveToArchive: (record: SavedBrewRecord) => void
  onGoArchive: () => void
  existingCount: number
}

export function BrewStudio({
  coffee,
  servings,
  onChangeCoffee,
  onChangeServings,
  onSaveToArchive,
  onGoArchive,
  existingCount,
}: BrewStudioProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [remainingSec, setRemainingSec] = useState(coffee.steps[0]?.durationSec ?? 0)
  const [isRunning, setIsRunning] = useState(false)
  const [muted, setMuted] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Completion tasting ceremony state
  const [rating, setRating] = useState(5)
  const [tastingNote, setTastingNote] = useState('')
  const [savedRecord, setSavedRecord] = useState<SavedBrewRecord | null>(null)

  const currentStep = coffee.steps[stepIndex] ?? coffee.steps[0]
  const scaled = scaleRecipe(coffee, servings)

  const goToStep = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0) return
      if (nextIndex >= coffee.steps.length) {
        setIsRunning(false)
        setIsComplete(true)
        if (!muted) playGentleChime('complete')
        return
      }
      setIsComplete(false)
      setStepIndex(nextIndex)
      setRemainingSec(coffee.steps[nextIndex].durationSec)
      setIsRunning(false)
    },
    [coffee.steps, muted]
  )

  // Countdown timer loop
  useEffect(() => {
    if (!isRunning || isComplete || remainingSec <= 0) return
    const timer = window.setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          setIsRunning(false)
          if (!muted) playGentleChime('step')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isRunning, remainingSec, isComplete, muted])

  // Keyboard shortcuts for PC/Web ergonomics
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (isComplete) return

      if (e.code === 'Space' && currentStep.durationSec > 0) {
        e.preventDefault()
        setIsRunning((r) => !r)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToStep(stepIndex + 1)
      } else if (e.key === 'ArrowLeft' && stepIndex > 0) {
        e.preventDefault()
        goToStep(stepIndex - 1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [currentStep.durationSec, goToStep, isComplete, stepIndex])

  const stepDuration = currentStep.durationSec
  const stepProgress =
    stepDuration > 0 ? Math.min(1, Math.max(0, (stepDuration - remainingSec) / stepDuration)) : 1

  const ringRadius = 40
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringOffset = ringCircumference * (1 - stepProgress)

  const currentTargetMl = scaled.scaleTarget(currentStep.targetWaterMl)

  const handleSaveArchive = () => {
    const record: SavedBrewRecord = {
      recordId: `${coffee.id}-${Date.now()}`,
      catalogNumber: `#2026-${String(existingCount + 1).padStart(3, '0')}`,
      coffeeId: coffee.id,
      coffeeName: coffee.name,
      englishName: coffee.englishName,
      exhibitNo: coffee.exhibitNo,
      methodLabel: coffee.methodLabel,
      servings,
      doseGrams: scaled.doseGrams,
      waterMl: scaled.waterMl,
      milkMl: scaled.milkMl,
      waterTempC: coffee.recipe.waterTempC,
      rating,
      tastingNote,
      brewedAt: new Date().toISOString(),
      flavorNotes: coffee.flavorNotes,
      flavorProfile: coffee.flavorProfile,
      palette: coffee.palette,
    }
    onSaveToArchive(record)
    setSavedRecord(record)
  }

  return (
    <div>
      {/* Studio Top Bar */}
      <div className="studio-topbar">
        <div>
          <p className="eyebrow" style={{ marginBottom: 4 }}>
            INTERACTIVE BREWING STUDIO · 沉浸式冲煮工坊
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h1 className="section-heading" style={{ margin: 0, fontSize: '1.65rem' }}>
              {coffee.name}
            </h1>
            <select
              id="studio-coffee-select"
              aria-label="切换冲煮咖啡"
              value={coffee.id}
              onChange={(e) => {
                const found = COFFEE_EXHIBITS.find((c) => c.id === e.target.value)
                if (found) onChangeCoffee(found)
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 999,
                border: '1px solid var(--border-strong)',
                background: 'var(--paper-surface)',
                fontSize: '0.84rem',
              }}
            >
              {COFFEE_EXHIBITS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.exhibitNo} · {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="serving-switcher" role="group" aria-label="调整杯数">
            {[1, 1.5, 2].map((s) => (
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

          <button
            id="studio-mute-btn"
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setMuted((m) => !m)}
            title={muted ? '开启提示音' : '静音提示音'}
          >
            <SoundIcon muted={muted} size={16} />
            <span>{muted ? '已静音' : '计时提示音'}</span>
          </button>
        </div>
      </div>

      {/* Completion Ceremony View */}
      {isComplete ? (
        <section className="ceremony-card" aria-label="冲煮完成出杯仪式">
          <div style={{ textAlign: 'center' }}>
            <p className="eyebrow">BREW COMPLETE · 出杯仪式</p>
            <div className="stage-visual-box" style={{ marginBottom: 16 }}>
              <BrewAnimation
                coffee={coffee}
                step={coffee.steps[coffee.steps.length - 1]}
                isRunning={false}
                stepProgress={1}
              />
            </div>
            <FlavorRadar profile={coffee.flavorProfile} size={200} />
          </div>

          <div>
            <span className="tag tag-brass mono" style={{ marginBottom: 10 }}>
              {savedRecord ? `馆藏编号 ${savedRecord.catalogNumber}` : `${coffee.exhibitNo} · 新鲜出杯`}
            </span>
            <h2 className="section-heading">
              恭喜！你的「{coffee.name}」已制作完成
            </h2>
            <p className="section-lead" style={{ marginBottom: 18 }}>
              本次采用 {scaled.doseGrams}g 咖啡粉、{scaled.waterMl}ml 萃取液
              {scaled.milkMl ? ` 与 ${scaled.milkMl}ml ${coffee.recipe.milkLabel ?? '牛奶'}` : ''}
              ，在 {coffee.recipe.waterTempC}°C 水温下完成萃取。趁热（或趁冰）细品它的风味层次：
            </p>

            <div className="pill-row" style={{ marginBottom: 20 }}>
              {coffee.flavorNotes.map((note) => (
                <span key={note} className="tag tag-brass">
                  {note}
                </span>
              ))}
            </div>

            {!savedRecord ? (
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                  为这一杯打分（记录进你的博物馆档案）
                </div>
                <div className="star-row" role="radiogroup" aria-label="风味评分">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= rating ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                      aria-label={`${star} 星`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  id="tasting-note-input"
                  className="tasting-textarea"
                  placeholder="写一句今天的品鉴手记，例如：前段茉莉花香很明显，放凉一点后白桃甜感太惊艳了…"
                  value={tastingNote}
                  onChange={(e) => setTastingNote(e.target.value)}
                />

                <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
                  <button
                    id="save-archive-btn"
                    type="button"
                    className="btn btn-brass btn-lg"
                    onClick={handleSaveArchive}
                  >
                    收入我的咖啡馆藏
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => goToStep(0)}
                  >
                    重新冲煮一杯
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: 18,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--sage-100)',
                  border: '1px solid rgba(79, 103, 83, 0.25)',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--sage-600)', marginBottom: 6 }}>
                  ✓ 已永久收入「我的馆藏」 · 编号 {savedRecord.catalogNumber}
                </div>
                <p style={{ margin: '0 0 14px', fontSize: '0.88rem', color: 'var(--espresso-800)' }}>
                  你可以导出这张高清复古咖啡博物馆纪念明信片保存分享，或前往馆藏陈列室查看已解锁徽章。
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    id="export-postcard-btn"
                    type="button"
                    className="btn btn-primary"
                    onClick={() => downloadTastingPostcard(savedRecord)}
                  >
                    导出 PNG 纪念明信片
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={onGoArchive}
                  >
                    前往我的馆藏
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => goToStep(0)}
                  >
                    再冲一杯
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        /* Active Step-by-Step Studio Workspace */
        <section className="studio-grid" aria-label="分步冲煮引导">
          {/* Left Visual Stage */}
          <div className="stage-card">
            <div className="stage-visual-box">
              <div className="stage-live-badges">
                <span className="tag tag-brass">{coffee.methodLabel}</span>
                <span className="tag mono">
                  步骤 {stepIndex + 1} / {coffee.steps.length}
                </span>
              </div>

              <BrewAnimation
                coffee={coffee}
                step={currentStep}
                isRunning={isRunning}
                stepProgress={stepProgress}
              />

              <div
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--espresso-600)',
                  marginTop: 6,
                }}
              >
                研磨建议：{coffee.recipe.grindDesc}
              </div>
            </div>

            <div className="scale-readout-bar" aria-label="电子秤与水温参数">
              <div>
                <span className="scale-cell-label">咖啡粉量</span>
                <span className="scale-cell-val">{scaled.doseGrams} g</span>
              </div>
              <div>
                <span className="scale-cell-label">
                  {currentTargetMl ? '本步目标累计' : '目标总液量'}
                </span>
                <span className="scale-cell-val">
                  {currentTargetMl ? `${currentTargetMl} ml` : `${scaled.waterMl} ml`}
                </span>
              </div>
              <div>
                <span className="scale-cell-label">建议水温</span>
                <span className="scale-cell-val">{coffee.recipe.waterTempC} °C</span>
              </div>
            </div>

            <div
              style={{
                marginTop: 14,
                fontSize: '0.78rem',
                color: 'var(--espresso-400)',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <span>粉水比：{coffee.recipe.ratioLabel}</span>
              <span>PC 快捷键：空格计时 · ←/→ 切步</span>
            </div>
          </div>

          {/* Right Coach Instructions & Real-time Timer */}
          <div className="coach-card">
            <div className="step-progress-rail" aria-label="步骤进度条">
              {coffee.steps.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  title={s.title}
                  className={`step-rail-seg ${
                    idx < stepIndex ? 'done' : idx === stepIndex ? 'current' : ''
                  }`}
                  onClick={() => goToStep(idx)}
                />
              ))}
            </div>

            <div className="active-step-header">
              <div>
                <div className="step-index-tag">
                  STEP {String(stepIndex + 1).padStart(2, '0')} OF{' '}
                  {String(coffee.steps.length).padStart(2, '0')}
                </div>
                <h2 className="step-title">{currentStep.title}</h2>
              </div>
              {currentTargetMl ? (
                <span className="tag tag-brass mono">目标 {currentTargetMl} ml</span>
              ) : (
                <span className="tag">准备阶段</span>
              )}
            </div>

            <p className="step-instruction">{currentStep.instruction}</p>

            {/* Interactive Step Timer */}
            {currentStep.durationSec > 0 ? (
              <div className="timer-panel">
                <div className="timer-ring-wrap">
                  <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                      cx="48"
                      cy="48"
                      r={ringRadius}
                      fill="none"
                      stroke="var(--paper-warm)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r={ringRadius}
                      fill="none"
                      stroke={remainingSec === 0 ? 'var(--sage-600)' : 'var(--brass-600)'}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                      style={{ transition: 'stroke-dashoffset 0.35s linear' }}
                    />
                  </svg>
                  <span className="timer-ring-text">{formatSeconds(remainingSec)}</span>
                </div>

                <div className="timer-controls">
                  <div style={{ fontSize: '0.84rem', color: 'var(--espresso-600)' }}>
                    {remainingSec === 0
                      ? '✓ 本步骤建议计时已完成，可以进入下一步'
                      : isRunning
                        ? '正在稳定计时中，保持呼吸与水流节奏…'
                        : `建议本步耗时 ${currentStep.durationSec} 秒，准备好即可开始计时`}
                  </div>
                  <div className="timer-btn-row">
                    <button
                      id="studio-timer-toggle-btn"
                      type="button"
                      className={`btn btn-sm ${isRunning ? 'btn-brass' : 'btn-primary'}`}
                      onClick={() => {
                        if (remainingSec === 0) {
                          setRemainingSec(currentStep.durationSec)
                          setIsRunning(true)
                        } else {
                          setIsRunning((r) => !r)
                        }
                      }}
                    >
                      {isRunning ? '暂停计时' : remainingSec === 0 ? '重新计时' : '开始计时'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setIsRunning(false)
                        setRemainingSec(currentStep.durationSec)
                      }}
                    >
                      重置
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setRemainingSec((s) => s + 10)}
                    >
                      +10 秒
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="timer-panel" style={{ justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>准备阶段 · 无需倒计时</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--espresso-600)' }}>
                    按上方说明备好 {scaled.doseGrams}g 咖啡粉与器具后，点击下方“下一步”正式开始萃取。
                  </div>
                </div>
              </div>
            )}

            <div className="barista-tip-box">
              <strong>咖啡师防翻车秘诀：</strong>
              {currentStep.baristaTip}
            </div>

            {/* Step Outline */}
            <div className="steps-outline-list" aria-label="全部步骤总览">
              {coffee.steps.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  className={`step-outline-item ${
                    idx === stepIndex ? 'current' : idx < stepIndex ? 'done' : ''
                  }`}
                  onClick={() => goToStep(idx)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--brass-700)' }}>
                      {idx < stepIndex ? '✓' : String(idx + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: idx === stepIndex ? 600 : 400 }}>
                      {s.title}
                    </span>
                  </span>
                  <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--espresso-600)' }}>
                    {s.durationSec > 0 ? `${s.durationSec}s` : '准备'}
                  </span>
                </button>
              ))}
            </div>

            <div className="studio-nav-footer">
              <button
                id="studio-prev-step-btn"
                type="button"
                className="btn btn-outline"
                disabled={stepIndex === 0}
                style={{ opacity: stepIndex === 0 ? 0.45 : 1 }}
                onClick={() => goToStep(stepIndex - 1)}
              >
                ← 上一步
              </button>

              <button
                id="studio-next-step-btn"
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => goToStep(stepIndex + 1)}
              >
                {stepIndex === coffee.steps.length - 1
                  ? '完成冲煮 · 迎接出杯 →'
                  : '下一步操作 →'}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
