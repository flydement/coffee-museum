import type { PostcardTheme, SavedBrewRecord } from '../types/coffee'

export const POSTCARD_THEME_OPTIONS: {
  id: PostcardTheme
  label: string
  swatch: string
}[] = [
  { id: 'parchment', label: '经典羊皮暖白', swatch: '#F6F1E7' },
  { id: 'espresso', label: '深烘黑金典藏', swatch: '#1F1611' },
  { id: 'botanical', label: '植物志鼠尾草', swatch: '#EAEFE7' },
  { id: 'aizome', label: '京都蓝染和纸', swatch: '#192434' },
]

const PRESET_LABEL_MAP: Record<string, string> = {
  standard: '馆藏标准',
  sweet: '更甜润柔和',
  bright: '更清爽花果',
  bold: '更浓郁醇厚',
}

function getThemeColors(theme: PostcardTheme) {
  if (theme === 'espresso') {
    return {
      bg: '#1D140F',
      vignetteInner: 'rgba(218, 162, 94, 0.08)',
      vignetteOuter: 'rgba(0, 0, 0, 0.36)',
      frameOuter: '#C89554',
      frameInner: 'rgba(216, 178, 126, 0.28)',
      meta: '#D6A15E',
      medallionBg: '#2A1D16',
      medallionBorder: '#C89554',
      cupBody: '#F4ECE0',
      title: '#F7EFE2',
      subtitle: '#C7B29B',
      notes: '#E0AB66',
      boxBg: '#281C15',
      boxBorder: 'rgba(200, 149, 84, 0.32)',
      statLabel: '#B59D86',
      statVal: '#FAF2E6',
      barLabel: '#D9C6B2',
      barTrack: 'rgba(247, 239, 226, 0.14)',
      barFill: '#D49B54',
      quote: '#EFE3D1',
      seal: '#C96A56',
    }
  }
  if (theme === 'botanical') {
    return {
      bg: '#ECEFE8',
      vignetteInner: 'rgba(255, 255, 255, 0.35)',
      vignetteOuter: 'rgba(79, 103, 83, 0.12)',
      frameOuter: '#546E58',
      frameInner: 'rgba(54, 74, 58, 0.24)',
      meta: '#49634D',
      medallionBg: '#DFE6DC',
      medallionBorder: '#6B856E',
      cupBody: '#28221E',
      title: '#1E261F',
      subtitle: '#546556',
      notes: '#8C5E32',
      boxBg: '#E1E7DD',
      boxBorder: 'rgba(79, 103, 83, 0.26)',
      statLabel: '#5A6B5C',
      statVal: '#1E261F',
      barLabel: '#364538',
      barTrack: 'rgba(54, 69, 56, 0.14)',
      barFill: '#56735A',
      quote: '#29352B',
      seal: '#9F4234',
    }
  }
  if (theme === 'aizome') {
    return {
      bg: '#192434',
      vignetteInner: 'rgba(217, 178, 119, 0.08)',
      vignetteOuter: 'rgba(9, 14, 22, 0.42)',
      frameOuter: '#D9B277',
      frameInner: 'rgba(217, 178, 119, 0.28)',
      meta: '#E0BE89',
      medallionBg: '#223146',
      medallionBorder: '#D9B277',
      cupBody: '#F1EAE0',
      title: '#F6F1E9',
      subtitle: '#AFC0D4',
      notes: '#E2BD84',
      boxBg: '#202E42',
      boxBorder: 'rgba(217, 178, 119, 0.3)',
      statLabel: '#9FB3CA',
      statVal: '#F8F3EC',
      barLabel: '#CBD7E6',
      barTrack: 'rgba(246, 241, 233, 0.14)',
      barFill: '#D9B277',
      quote: '#E6EDF5',
      seal: '#D6715C',
    }
  }
  return {
    bg: '#F6F1E7',
    vignetteInner: 'rgba(255, 255, 255, 0.28)',
    vignetteOuter: 'rgba(138, 104, 70, 0.12)',
    frameOuter: '#B88446',
    frameInner: 'rgba(74, 52, 40, 0.25)',
    meta: '#8B6239',
    medallionBg: '#EFE7D8',
    medallionBorder: '#C6975E',
    cupBody: '#2A1D16',
    title: '#261A14',
    subtitle: '#7A5B47',
    notes: '#9E6833',
    boxBg: '#EFE8DA',
    boxBorder: 'rgba(139, 98, 57, 0.25)',
    statLabel: '#7D6351',
    statVal: '#261A14',
    barLabel: '#5E4638',
    barTrack: 'rgba(74, 52, 40, 0.14)',
    barFill: '#B88446',
    quote: '#3B281E',
    seal: '#9F4234',
  }
}

export function renderPostcardDataUrl(
  record: SavedBrewRecord,
  theme: PostcardTheme = 'parchment'
): string {
  const width = 900
  const height = 1200
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const colors = getThemeColors(theme)
  const isColdDrink = record.waterTempC <= 15

  // Background
  ctx.fillStyle = colors.bg
  ctx.fillRect(0, 0, width, height)

  // Subtle vignette
  const grad = ctx.createRadialGradient(width / 2, height / 2, 120, width / 2, height / 2, 740)
  grad.addColorStop(0, colors.vignetteInner)
  grad.addColorStop(1, colors.vignetteOuter)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  // Double antique museum frame
  ctx.strokeStyle = colors.frameOuter
  ctx.lineWidth = 3
  ctx.strokeRect(36, 36, width - 72, height - 72)
  ctx.strokeStyle = colors.frameInner
  ctx.lineWidth = 1.5
  ctx.strokeRect(48, 48, width - 96, height - 96)

  // Corner museum ornaments
  const corners = [
    [60, 60],
    [width - 60, 60],
    [60, height - 60],
    [width - 60, height - 60],
  ]
  ctx.fillStyle = colors.frameOuter
  corners.forEach(([x, y]) => {
    ctx.beginPath()
    ctx.arc(x, y, 3.5, 0, Math.PI * 2)
    ctx.fill()
  })

  // Header metadata
  ctx.fillStyle = colors.meta
  ctx.font = '600 18px "JetBrains Mono", monospace'
  ctx.fillText('ATELIER CAFÉ MUSEUM · 拾光咖啡博物馆', 84, 108)
  ctx.textAlign = 'right'
  ctx.fillText(`${record.exhibitNo} / ${record.catalogNumber}`, width - 84, 108)
  ctx.textAlign = 'left'

  // Divider line
  ctx.strokeStyle = colors.frameInner
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(84, 130)
  ctx.lineTo(width - 84, 130)
  ctx.stroke()

  // Center illustration medallion
  const cx = width / 2
  const cy = 320
  ctx.fillStyle = colors.medallionBg
  ctx.beginPath()
  ctx.arc(cx, cy, 130, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = colors.medallionBorder
  ctx.lineWidth = 2
  ctx.stroke()

  if (isColdDrink) {
    // Stylized chilled glass with floating ice cubes for cold brews & iced specials
    ctx.fillStyle = colors.cupBody
    ctx.beginPath()
    ctx.roundRect(cx - 52, cy - 64, 104, 126, [8, 8, 22, 22])
    ctx.fill()

    ctx.fillStyle = record.palette.liquid
    ctx.beginPath()
    ctx.roundRect(cx - 44, cy - 42, 88, 96, [4, 4, 16, 16])
    ctx.fill()

    ctx.fillStyle = record.palette.crema
    ctx.beginPath()
    ctx.ellipse(cx, cy - 42, 44, 10, 0, 0, Math.PI * 2)
    ctx.fill()

    // Floating ice cubes
    ctx.save()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.36)'
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.62)'
    ctx.lineWidth = 1.5
    ;[
      { x: cx - 22, y: cy - 26, r: 0.18 },
      { x: cx + 10, y: cy - 16, r: -0.22 },
      { x: cx - 6, y: cy + 8, r: 0.1 },
    ].forEach((cube) => {
      ctx.save()
      ctx.translate(cube.x, cube.y)
      ctx.rotate(cube.r)
      ctx.beginPath()
      ctx.roundRect(-12, -12, 24, 24, 4)
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    })
    ctx.restore()

    // Coaster & chilled shimmer stars
    ctx.strokeStyle = colors.frameOuter
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(cx - 72, cy + 72)
    ctx.lineTo(cx + 72, cy + 72)
    ctx.stroke()

    ctx.fillStyle = colors.frameOuter
    ;[
      [cx - 74, cy - 46],
      [cx + 76, cy - 28],
      [cx + 68, cy - 62],
    ].forEach(([sx, sy]) => {
      ctx.beginPath()
      ctx.arc(sx, sy, 3.2, 0, Math.PI * 2)
      ctx.fill()
    })
  } else {
    // Stylized vintage hot coffee cup inside medallion
    ctx.fillStyle = colors.cupBody
    ctx.beginPath()
    ctx.roundRect(cx - 64, cy - 36, 128, 76, [8, 8, 52, 52])
    ctx.fill()

    ctx.fillStyle = record.palette.liquid
    ctx.beginPath()
    ctx.roundRect(cx - 56, cy - 28, 112, 62, [4, 4, 44, 44])
    ctx.fill()

    ctx.fillStyle = record.palette.crema
    ctx.beginPath()
    ctx.ellipse(cx, cy - 28, 56, 12, 0, 0, Math.PI * 2)
    ctx.fill()

    // Cup handle
    ctx.strokeStyle = colors.cupBody
    ctx.lineWidth = 10
    ctx.beginPath()
    ctx.arc(cx + 66, cy - 4, 24, -Math.PI / 2, Math.PI / 2)
    ctx.stroke()

    // Saucer
    ctx.strokeStyle = colors.frameOuter
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(cx - 86, cy + 52)
    ctx.lineTo(cx + 86, cy + 52)
    ctx.stroke()

    // Steam curves
    ctx.strokeStyle = colors.frameOuter
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ;[-24, 0, 24].forEach((offset) => {
      ctx.beginPath()
      ctx.moveTo(cx + offset, cy - 56)
      ctx.bezierCurveTo(
        cx + offset - 8,
        cy - 76,
        cx + offset + 10,
        cy - 88,
        cx + offset,
        cy - 104
      )
      ctx.stroke()
    })
  }

  // Coffee Title with automatic fit to avoid overflowing antique frame
  ctx.textAlign = 'center'
  ctx.fillStyle = colors.title
  let titleFontSize = 40
  ctx.font = `700 ${titleFontSize}px "Noto Serif SC", Georgia, serif`
  while (ctx.measureText(record.coffeeName).width > width - 176 && titleFontSize > 26) {
    titleFontSize -= 2
    ctx.font = `700 ${titleFontSize}px "Noto Serif SC", Georgia, serif`
  }
  ctx.fillText(record.coffeeName, cx, 518)

  ctx.fillStyle = colors.subtitle
  ctx.font = 'italic 500 23px "Cormorant Garamond", Georgia, serif'
  const presetName = record.tastePreset ? PRESET_LABEL_MAP[record.tastePreset] : null
  const subtitleLine = presetName
    ? `${record.englishName}  ·  ${presetName}`
    : record.englishName
  ctx.fillText(subtitleLine, cx, 556)

  // Flavor notes tags
  const notesText = record.flavorNotes.join('  ·  ')
  ctx.fillStyle = colors.notes
  ctx.font = '500 20px "Noto Sans SC", sans-serif'
  ctx.fillText(notesText, cx, 606)

  // Brew parameter box
  ctx.fillStyle = colors.boxBg
  ctx.beginPath()
  ctx.roundRect(84, 646, width - 168, 148, 14)
  ctx.fill()
  ctx.strokeStyle = colors.boxBorder
  ctx.lineWidth = 1.5
  ctx.stroke()

  const stats = [
    { label: '冲煮方式', value: record.methodLabel },
    { label: '咖啡粉量', value: `${record.doseGrams} g` },
    {
      label: record.milkMl ? '液量 / 奶量' : '目标液量',
      value: record.milkMl ? `${record.waterMl} / ${record.milkMl} ml` : `${record.waterMl} ml`,
    },
    { label: '冲煮水温', value: `${record.waterTempC} °C` },
  ]
  const colW = (width - 168) / 4
  stats.forEach((s, i) => {
    const sx = 84 + colW * i + colW / 2
    ctx.fillStyle = colors.statLabel
    ctx.font = '500 15px "Noto Sans SC", sans-serif'
    ctx.fillText(s.label, sx, 702)
    ctx.fillStyle = colors.statVal
    ctx.font = '600 21px "JetBrains Mono", "Noto Sans SC", monospace'
    ctx.fillText(s.value, sx, 746)
  })

  // Flavor bars
  const axes = [
    { name: '酸度', value: record.flavorProfile.acidity },
    { name: '甜感', value: record.flavorProfile.sweetness },
    { name: '醇厚', value: record.flavorProfile.body },
    { name: '苦韵', value: record.flavorProfile.bitterness },
    { name: '香气', value: record.flavorProfile.aroma },
  ]
  ctx.textAlign = 'left'
  axes.forEach((axis, idx) => {
    const y = 846 + idx * 36
    ctx.fillStyle = colors.barLabel
    ctx.font = '500 17px "Noto Sans SC", sans-serif'
    ctx.fillText(axis.name, 96, y)

    ctx.fillStyle = colors.barTrack
    ctx.beginPath()
    ctx.roundRect(160, y - 13, 560, 12, 6)
    ctx.fill()

    ctx.fillStyle = colors.barFill
    ctx.beginPath()
    ctx.roundRect(160, y - 13, (560 * axis.value) / 100, 12, 6)
    ctx.fill()

    ctx.textAlign = 'right'
    ctx.fillStyle = colors.barLabel
    ctx.font = '500 16px "JetBrains Mono", monospace'
    ctx.fillText(`${axis.value}`, width - 96, y)
    ctx.textAlign = 'left'
  })

  // Tasting Note & Rating
  ctx.strokeStyle = colors.frameInner
  ctx.beginPath()
  ctx.moveTo(84, 1034)
  ctx.lineTo(width - 84, 1034)
  ctx.stroke()

  const stars = '★'.repeat(record.rating) + '☆'.repeat(5 - record.rating)
  ctx.fillStyle = colors.barFill
  ctx.font = '24px serif'
  ctx.fillText(stars, 84, 1076)

  ctx.textAlign = 'right'
  ctx.fillStyle = colors.statLabel
  ctx.font = '500 16px "JetBrains Mono", monospace'
  ctx.fillText(new Date(record.brewedAt).toLocaleDateString('zh-CN'), width - 166, 1074)

  // Vintage museum curator ink stamp seal
  ctx.save()
  ctx.translate(width - 114, 1096)
  ctx.rotate(-0.08)
  ctx.strokeStyle = colors.seal
  ctx.lineWidth = 2.2
  ctx.beginPath()
  ctx.roundRect(-30, -30, 60, 60, 8)
  ctx.stroke()
  ctx.lineWidth = 1
  ctx.strokeRect(-24, -24, 48, 48)
  ctx.fillStyle = colors.seal
  ctx.textAlign = 'center'
  ctx.font = '700 17px "Noto Serif SC", serif'
  ctx.fillText('拾光', 0, -5)
  ctx.fillText('鉴赏', 0, 17)
  ctx.restore()

  ctx.textAlign = 'left'
  ctx.fillStyle = colors.quote
  ctx.font = '500 20px "Noto Serif SC", serif'
  const note =
    record.tastingNote.trim() || '“亲手完成的一杯馆藏风味，时间与香气在此刻定格。”'
  const maxLineWidth = width - 252
  const lines: string[] = []
  let currentLine = ''
  for (const ch of note) {
    const test = currentLine + ch
    if (ctx.measureText(test).width > maxLineWidth && currentLine) {
      lines.push(currentLine)
      currentLine = ch
      if (lines.length === 2) break
    } else {
      currentLine = test
    }
  }
  if (lines.length < 2 && currentLine) {
    lines.push(currentLine)
  }
  lines.slice(0, 2).forEach((line, idx) => {
    const displayLine =
      idx === 1 && note.length > lines[0].length + line.length
        ? `${line.slice(0, Math.max(0, line.length - 1))}…`
        : line
    ctx.fillText(displayLine, 84, 1114 + idx * 28)
  })

  return canvas.toDataURL('image/png')
}

export function downloadTastingPostcard(
  record: SavedBrewRecord,
  theme: PostcardTheme = 'parchment'
) {
  const dataUrl = renderPostcardDataUrl(record, theme)
  if (!dataUrl) return
  const link = document.createElement('a')
  link.download = `咖啡博物馆-${record.exhibitNo}-${record.catalogNumber}-${theme}.png`
  link.href = dataUrl
  link.click()
}
