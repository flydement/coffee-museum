import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { COFFEE_EXHIBITS } from '../data/coffees'
import type {
  CoffeeExhibit,
  PostcardTheme,
  SavedBrewRecord,
  TasteCustomizePreset,
} from '../types/coffee'
import {
  downloadTastingPostcard,
  POSTCARD_THEME_OPTIONS,
  renderPostcardDataUrl,
} from '../utils/exportCard'
import {
  copyTextToClipboard,
  formatRecipeShareText,
  formatSeconds,
  playGentleChime,
  scaleRecipe,
  speakBrewPrompt,
  stopBrewSpeech,
  TASTE_PRESET_OPTIONS,
} from '../utils/platform'
import { BrewAnimation } from './BrewAnimation'
import { FlavorRadar } from './FlavorRadar'
import { SoundIcon } from './Icons'

interface BrewStudioProps {
  coffee: CoffeeExhibit
  servings: number
  tastePreset: TasteCustomizePreset
  onChangeCoffee: (coffee: CoffeeExhibit) => void
  onChangeServings: (servings: number) => void
  onChangeTastePreset: (preset: TasteCustomizePreset) => void
  onSaveToArchive: (record: SavedBrewRecord) => void
  onGoArchive: () => void
  existingCount: number
}

export function BrewStudio({
  coffee,
  servings,
  tastePreset,
  onChangeCoffee,
  onChangeServings,
  onChangeTastePreset,
  onSaveToArchive,
  onGoArchive,
  existingCount,
}: BrewStudioProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [remainingSec, setRemainingSec] = useState(coffee.steps[0]?.durationSec ?? 0)
  const [isRunning, setIsRunning] = useState(false)
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [muted, setMuted] = useState(false)
  const [voiceGuide, setVoiceGuide] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [prepChecks, setPrepChecks] = useState<string[]>([])
  const [copiedRecipe, setCopiedRecipe] = useState(false)

  // Completion tasting ceremony state
  const [rating, setRating] = useState(5)
  const [tastingNote, setTastingNote] = useState('')
  const [completedAt, setCompletedAt] = useState(() => new Date().toISOString())
  const [savedRecord, setSavedRecord] = useState<SavedBrewRecord | null>(null)
  const [postcardTheme, setPostcardTheme] = useState<PostcardTheme>('parchment')

  const currentStep = coffee.steps[stepIndex] ?? coffee.steps[0]
  const prevStep = stepIndex > 0 ? coffee.steps[stepIndex - 1] : undefined
  const scaled = scaleRecipe(coffee, servings, tastePreset)

  const goToStep = useCallback(
    (nextIndex: number, autoStart = false) => {
      if (nextIndex < 0) return
      if (nextIndex >= coffee.steps.length) {
        setIsRunning(false)
        setCompletedAt(new Date().toISOString())
        setIsComplete(true)
        if (!muted) playGentleChime('complete')
        return
      }
      const nextStepObj = coffee.steps[nextIndex]
      setIsComplete(false)
      setStepIndex(nextIndex)
      setRemainingSec(nextStepObj.durationSec)
      setIsRunning(Boolean(autoStart && nextStepObj.durationSec > 0))
    },
    [coffee.steps, muted]
  )

  const remainingRef = useRef(remainingSec)
  useEffect(() => {
    remainingRef.current = remainingSec
  }, [remainingSec])

  // Drift-free 1s interval (no remainingSec in deps; all state updates happen inside async timer callback)
  useEffect(() => {
    if (!isRunning || isComplete) return
    const timer = window.setInterval(() => {
      const current = remainingRef.current
      if (current <= 1) {
        remainingRef.current = 0
        if (autoAdvance) {
          const nextIdx = stepIndex + 1
          if (nextIdx >= coffee.steps.length) {
            setRemainingSec(0)
            setIsRunning(false)
            setCompletedAt(new Date().toISOString())
            setIsComplete(true)
            if (!muted) playGentleChime('complete')
          } else {
            const nextStepObj = coffee.steps[nextIdx]
            remainingRef.current = nextStepObj.durationSec
            if (!muted) playGentleChime('step')
            setStepIndex(nextIdx)
            setRemainingSec(nextStepObj.durationSec)
            setIsRunning(nextStepObj.durationSec > 0)
          }
        } else {
          setRemainingSec(0)
          setIsRunning(false)
          if (!muted) playGentleChime('step')
        }
      } else {
        const nextVal = current - 1
        remainingRef.current = nextVal
        setRemainingSec(nextVal)
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [autoAdvance, coffee.steps, isComplete, isRunning, muted, stepIndex])

  // Keep mobile/tablet screen awake during active countdown
  useEffect(() => {
    if (!isRunning || isComplete) return
    let sentinel: { release: () => Promise<void> } | null = null
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void> }> }
    }
    nav.wakeLock
      ?.request('screen')
      .then((lock) => {
        sentinel = lock
      })
      .catch(() => {
        // Ignore if unsupported by browser
      })

    return () => {
      sentinel?.release().catch(() => {})
    }
  }, [isComplete, isRunning])

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
        goToStep(stepIndex + 1, false)
      } else if (e.key === 'ArrowLeft' && stepIndex > 0) {
        e.preventDefault()
        goToStep(stepIndex - 1, false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [currentStep.durationSec, goToStep, isComplete, stepIndex])

  const stepDuration = currentStep.durationSec
  const stepProgress =
    stepDuration > 0
      ? Math.min(1, Math.max(0, (stepDuration - remainingSec) / stepDuration))
      : 1

  const ringRadius = 40
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringOffset = ringCircumference * (1 - stepProgress)

  const currentTargetMl = scaled.scaleTarget(currentStep.targetWaterMl)
  const prevTargetMl = scaled.scaleTarget(prevStep?.targetWaterMl) ?? 0

  // Speak step guidance aloud when hands-free voice guide is enabled
  useEffect(() => {
    if (!voiceGuide) {
      stopBrewSpeech()
      return
    }
    if (isComplete) {
      speakBrewPrompt(`恭喜，你的${coffee.name}已冲煮完成，请趁热细品它的风味层次。`)
      return
    }
    const targetPhrase = currentTargetMl ? `，目标累计液量 ${currentTargetMl} 毫升` : ''
    const durPhrase = currentStep.durationSec > 0 ? `，计时 ${currentStep.durationSec} 秒` : ''
    speakBrewPrompt(`第 ${stepIndex + 1} 步，${currentStep.title}${targetPhrase}${durPhrase}。`)
  }, [coffee.name, currentStep.durationSec, currentStep.title, currentTargetMl, isComplete, stepIndex, voiceGuide])

  useEffect(() => {
    return () => {
      stopBrewSpeech()
    }
  }, [])

  // Smooth real-time virtual scale readout during pouring steps
  const liveScaleMl =
    currentTargetMl && currentStep.isPouring && stepDuration > 0
      ? Math.round((prevTargetMl + (currentTargetMl - prevTargetMl) * stepProgress) * 10) / 10
      : currentTargetMl

  const pourRateMlPerSec =
    currentTargetMl &&
    currentStep.isPouring &&
    stepDuration > 0 &&
    currentTargetMl > prevTargetMl
      ? ((currentTargetMl - prevTargetMl) / stepDuration).toFixed(1)
      : null

  const togglePrepCheck = (item: string) => {
    if (!muted) playGentleChime('tick')
    setPrepChecks((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    )
  }

  const totalRemainingSec = useMemo(() => {
    const upcoming = coffee.steps
      .slice(stepIndex + 1)
      .reduce((sum, s) => sum + s.durationSec, 0)
    return remainingSec + upcoming
  }, [coffee.steps, remainingSec, stepIndex])

  const totalTimedSec = useMemo(
    () => Math.max(1, coffee.steps.reduce((sum, s) => sum + s.durationSec, 0)),
    [coffee.steps]
  )

  const handleCopyStudioRecipe = async () => {
    const ok = await copyTextToClipboard(formatRecipeShareText(coffee, servings, tastePreset))
    if (ok) {
      if (!muted) playGentleChime('tick')
      setCopiedRecipe(true)
      window.setTimeout(() => setCopiedRecipe(false), 2200)
    }
  }

  const currentYear = useMemo(() => new Date(completedAt).getFullYear(), [completedAt])

  const handleSaveArchive = () => {
    const record: SavedBrewRecord = {
      recordId: `${coffee.id}-${Date.now()}`,
      catalogNumber: `#${currentYear}-${String(existingCount + 1).padStart(3, '0')}`,
      coffeeId: coffee.id,
      coffeeName: coffee.name,
      englishName: coffee.englishName,
      exhibitNo: coffee.exhibitNo,
      methodLabel: coffee.methodLabel,
      servings,
      tastePreset,
      doseGrams: scaled.doseGrams,
      waterMl: scaled.waterMl,
      milkMl: scaled.milkMl,
      waterTempC: scaled.waterTempC,
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

  const previewRecord = useMemo<SavedBrewRecord>(() => {
    if (savedRecord) return savedRecord
    return {
      recordId: 'preview',
      catalogNumber: `#${currentYear}-${String(existingCount + 1).padStart(3, '0')}`,
      coffeeId: coffee.id,
      coffeeName: coffee.name,
      englishName: coffee.englishName,
      exhibitNo: coffee.exhibitNo,
      methodLabel: coffee.methodLabel,
      servings,
      tastePreset,
      doseGrams: scaled.doseGrams,
      waterMl: scaled.waterMl,
      milkMl: scaled.milkMl,
      waterTempC: scaled.waterTempC,
      rating,
      tastingNote,
      brewedAt: completedAt,
      flavorNotes: coffee.flavorNotes,
      flavorProfile: coffee.flavorProfile,
      palette: coffee.palette,
    }
  }, [
    coffee,
    completedAt,
    currentYear,
    existingCount,
    rating,
    savedRecord,
    scaled.doseGrams,
    scaled.milkMl,
    scaled.waterMl,
    scaled.waterTempC,
    servings,
    tastePreset,
    tastingNote,
  ])

  const postcardPreviewUrl = useMemo(() => {
    if (!isComplete) return ''
    return renderPostcardDataUrl(previewRecord, postcardTheme)
  }, [isComplete, postcardTheme, previewRecord])

  return (
    <div className="view-enter">
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
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
            id="studio-autoadvance-btn"
            type="button"
            className={`icon-pill-btn ${autoAdvance ? 'active' : ''}`}
            onClick={() => setAutoAdvance((a) => !a)}
            title="开启后倒计时归零将自动切换到下一步并继续计时，解放持壶双手"
          >
            <span>{autoAdvance ? '✓ 自动连贯跳步' : '手动切步'}</span>
          </button>

          <button
            id="studio-voice-btn"
            type="button"
            className={`icon-pill-btn ${voiceGuide ? 'active' : ''}`}
            onClick={() => setVoiceGuide((v) => !v)}
            title="开启中文语音播报每一步骤与目标水量，彻底解放持壶双手"
          >
            <span>{voiceGuide ? '🎙 语音导引中' : '🎙 语音播报'}</span>
          </button>

          <button
            id="studio-mute-btn"
            type="button"
            className="icon-pill-btn"
            onClick={() => setMuted((m) => !m)}
            title={muted ? '开启提示音' : '静音提示音'}
          >
            <SoundIcon muted={muted} size={16} />
            <span>{muted ? '已静音' : '提示音'}</span>
          </button>

          <button
            id="studio-copy-recipe-btn"
            type="button"
            className={`icon-pill-btn ${copiedRecipe ? 'active' : ''}`}
            onClick={handleCopyStudioRecipe}
            title="将当前杯数与口味档的完整参数复制为文字配方"
          >
            <span>{copiedRecipe ? '✓ 已复制配方' : '复制配方'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Taste Customizer Strip (before completion) */}
      {!isComplete && (
        <section className="taste-customizer-panel" aria-label="口味定制微调">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>
              口味微调向导 · 按你喜欢的风味动态调整粉量与水温
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--brass-700)' }}>
              {scaled.coachNote}
            </span>
          </div>
          <div className="taste-preset-grid">
            {TASTE_PRESET_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`taste-preset-btn ${tastePreset === opt.id ? 'active' : ''}`}
                onClick={() => onChangeTastePreset(opt.id)}
              >
                <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{opt.label}</div>
                <div style={{ fontSize: '0.73rem', color: 'var(--espresso-600)' }}>
                  {opt.shortHint}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Completion Ceremony View */}
      {isComplete ? (
        <section className="ceremony-card ceremony-celebrate" aria-label="冲煮完成出杯仪式">
          <div className="ceremony-confetti" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p className="eyebrow">MUSEUM POSTCARD PREVIEW · 实时纪念卡预览</p>
            {postcardPreviewUrl ? (
              <div className="postcard-preview-frame">
                <img
                  src={postcardPreviewUrl}
                  alt={`${coffee.name} 馆藏品鉴明信片预览`}
                />
              </div>
            ) : (
              <FlavorRadar profile={coffee.flavorProfile} size={210} />
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 8,
                flexWrap: 'wrap',
                marginTop: 14,
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
          </div>

          <div>
            <span className="tag tag-brass mono" style={{ marginBottom: 10 }}>
              {savedRecord
                ? `馆藏编号 ${savedRecord.catalogNumber}`
                : `${coffee.exhibitNo} · 新鲜出杯`}
            </span>
            <h2 className="section-heading">
              恭喜！你的「{coffee.name}」已制作完成
            </h2>
            <p className="section-lead" style={{ marginBottom: 18 }}>
              本次采用 {scaled.doseGrams}g 咖啡粉、{scaled.waterMl}ml 萃取液
              {scaled.milkMl ? ` 与 ${scaled.milkMl}ml ${coffee.recipe.milkLabel ?? '牛奶'}` : ''}
              ，在 {scaled.waterTempC}°C 水温下完成萃取。趁最佳赏味期细品它的风味层次：
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
                  为这一杯打分（左侧明信片会实时同步你的星级与手记）
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
                    onClick={() => downloadTastingPostcard(previewRecord, postcardTheme)}
                  >
                    直接导出 PNG 明信片
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => goToStep(0, false)}
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
                  可在左侧切换三种纸张主题并导出高清纪念明信片，或前往馆藏陈列室查看已解锁徽章。
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    id="export-postcard-btn"
                    type="button"
                    className="btn btn-primary"
                    onClick={() => downloadTastingPostcard(savedRecord, postcardTheme)}
                  >
                    下载当前主题明信片
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
                    onClick={() => goToStep(0, false)}
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
                prevVisualLevel={prevStep?.visualLevel}
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

            <div className="scale-readout-bar" aria-label="实时电子秤与水温参数">
              <div>
                <span className="scale-cell-label">咖啡粉量</span>
                <span className="scale-cell-val">{scaled.doseGrams} g</span>
              </div>
              <div>
                <span className="scale-cell-label">
                  {liveScaleMl && isRunning && currentStep.isPouring
                    ? '实时跟随秤重'
                    : currentTargetMl
                      ? '本步目标累计'
                      : '目标总液量'}
                </span>
                <span className="scale-cell-val">
                  {liveScaleMl ? `${liveScaleMl} ml` : `${scaled.waterMl} ml`}
                </span>
              </div>
              <div>
                <span className="scale-cell-label">
                  {pourRateMlPerSec ? '建议注水流速' : '建议水温'}
                </span>
                <span className="scale-cell-val">
                  {pourRateMlPerSec
                    ? `${pourRateMlPerSec} ml/s`
                    : `${scaled.waterTempC} °C`}
                </span>
              </div>
            </div>

            <div className="brew-timeline-box" aria-label="萃取节奏总览时间轴">
              <div className="brew-timeline-head">
                <span>全程萃取时间轴</span>
                <span className="mono">
                  总计时 {formatSeconds(totalTimedSec)} · 剩余 {formatSeconds(totalRemainingSec)}
                </span>
              </div>
              <div className="brew-timeline-bar">
                {coffee.steps.map((s, idx) => {
                  const weight = s.durationSec > 0 ? Math.max(14, (s.durationSec / totalTimedSec) * 100) : 14
                  const stepTarget = scaled.scaleTarget(s.targetWaterMl)
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`brew-timeline-seg ${
                        idx < stepIndex ? 'done' : idx === stepIndex ? 'active' : ''
                      }`}
                      style={{ flexGrow: weight }}
                      title={`${s.title} (${s.durationSec > 0 ? `${s.durationSec}s` : '准备'}${
                        stepTarget ? ` · 目标 ${stepTarget}ml` : ''
                      })`}
                      onClick={() => goToStep(idx, false)}
                    >
                      <span className="mono">{s.durationSec > 0 ? `${s.durationSec}s` : '备'}</span>
                      {stepTarget ? <small className="mono">{stepTarget}ml</small> : null}
                    </button>
                  )
                })}
              </div>
            </div>

            <div
              style={{
                marginTop: 12,
                fontSize: '0.78rem',
                color: 'var(--espresso-400)',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <span>
                水温：{scaled.waterTempC}°C · 粉水比 {coffee.recipe.ratioLabel}
              </span>
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
                  onClick={() => goToStep(idx, false)}
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
                  <svg
                    width="96"
                    height="96"
                    viewBox="0 0 96 96"
                    style={{ transform: 'rotate(-90deg)' }}
                  >
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
                        ? pourRateMlPerSec
                          ? `正在实时导引注水（保持约 ${pourRateMlPerSec} ml/s 稳定水流）…`
                          : '正在稳定计时中，保持呼吸与节奏…'
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
              <div className="timer-panel" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>准备阶段 · 备料确认清单</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--espresso-600)' }}>
                    可逐项勾选确认准备就绪，随后点击下方“下一步操作”进入实时计时：
                  </div>
                </div>
                <div className="prep-checklist">
                  {[
                    { id: 'dose', label: `称取 ${scaled.doseGrams}g 粉` },
                    { id: 'preheat', label: '温热杯具与器具' },
                    {
                      id: 'water',
                      label:
                        scaled.waterTempC <= 15
                          ? '备好冰水/冰块'
                          : `水温备至 ${scaled.waterTempC}°C`,
                    },
                  ].map((item) => {
                    const checked = prepChecks.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`prep-check-btn ${checked ? 'checked' : ''}`}
                        onClick={() => togglePrepCheck(item.id)}
                      >
                        <span>{checked ? '✓' : '○'}</span>
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
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
                  onClick={() => goToStep(idx, false)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      className="mono"
                      style={{ fontSize: '0.78rem', color: 'var(--brass-700)' }}
                    >
                      {idx < stepIndex ? '✓' : String(idx + 1).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: idx === stepIndex ? 600 : 400,
                      }}
                    >
                      {s.title}
                    </span>
                  </span>
                  <span
                    className="mono"
                    style={{ fontSize: '0.78rem', color: 'var(--espresso-600)' }}
                  >
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
                onClick={() => goToStep(stepIndex - 1, false)}
              >
                ← 上一步
              </button>

              <button
                id="studio-next-step-btn"
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() =>
                  goToStep(
                    stepIndex + 1,
                    stepIndex === 0 && autoAdvance
                  )
                }
              >
                {stepIndex === coffee.steps.length - 1
                  ? '完成冲煮 · 迎接出杯 →'
                  : stepIndex === 0 && autoAdvance
                    ? '开始冲煮并启动计时 →'
                    : '下一步操作 →'}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
