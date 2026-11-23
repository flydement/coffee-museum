import type { SavedBrewRecord } from '../types/coffee'

export function downloadTastingPostcard(record: SavedBrewRecord) {
  const width = 900
  const height = 1200
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Warm parchment background
  ctx.fillStyle = '#F6F1E7'
  ctx.fillRect(0, 0, width, height)

  // Subtle paper vignette
  const grad = ctx.createRadialGradient(width / 2, height / 2, 120, width / 2, height / 2, 740)
  grad.addColorStop(0, 'rgba(255,255,255,0.28)')
  grad.addColorStop(1, 'rgba(138,104,70,0.12)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  // Double antique museum frame
  ctx.strokeStyle = '#B88446'
  ctx.lineWidth = 3
  ctx.strokeRect(36, 36, width - 72, height - 72)
  ctx.strokeStyle = 'rgba(74, 52, 40, 0.25)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(48, 48, width - 96, height - 96)

  // Header metadata
  ctx.fillStyle = '#8B6239'
  ctx.font = '600 18px "JetBrains Mono", monospace'
  ctx.fillText('ATELIER CAFÉ MUSEUM · 拾光咖啡博物馆', 84, 108)
  ctx.textAlign = 'right'
  ctx.fillText(`${record.exhibitNo} / ${record.catalogNumber}`, width - 84, 108)
  ctx.textAlign = 'left'

  // Divider line
  ctx.strokeStyle = 'rgba(184, 132, 70, 0.45)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(84, 130)
  ctx.lineTo(width - 84, 130)
  ctx.stroke()

  // Center illustration medallion
  const cx = width / 2
  const cy = 325
  ctx.fillStyle = '#EFE7D8'
  ctx.beginPath()
  ctx.arc(cx, cy, 132, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#C6975E'
  ctx.lineWidth = 2
  ctx.stroke()

  // Stylized vintage coffee cup inside medallion
  ctx.fillStyle = '#2A1D16'
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
  ctx.strokeStyle = '#2A1D16'
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.arc(cx + 66, cy - 4, 24, -Math.PI / 2, Math.PI / 2)
  ctx.stroke()

  // Saucer
  ctx.strokeStyle = '#B88446'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.moveTo(cx - 86, cy + 52)
  ctx.lineTo(cx + 86, cy + 52)
  ctx.stroke()

  // Steam curves
  ctx.strokeStyle = 'rgba(184, 132, 70, 0.7)'
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

  // Coffee Title
  ctx.textAlign = 'center'
  ctx.fillStyle = '#261A14'
  ctx.font = '700 42px "Noto Serif SC", Georgia, serif'
  ctx.fillText(record.coffeeName, cx, 522)

  ctx.fillStyle = '#7A5B47'
  ctx.font = 'italic 500 24px "Cormorant Garamond", Georgia, serif'
  ctx.fillText(record.englishName, cx, 560)

  // Flavor notes tags
  const notesText = record.flavorNotes.join('  ·  ')
  ctx.fillStyle = '#9E6833'
  ctx.font = '500 20px "Noto Sans SC", sans-serif'
  ctx.fillText(notesText, cx, 610)

  // Brew parameter box
  ctx.fillStyle = '#EFE8DA'
  ctx.beginPath()
  ctx.roundRect(84, 650, width - 168, 150, 14)
  ctx.fill()
  ctx.strokeStyle = 'rgba(139, 98, 57, 0.25)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  const stats = [
    { label: '冲煮方式', value: record.methodLabel },
    { label: '咖啡粉量', value: `${record.doseGrams} g` },
    {
      label: record.milkMl ? '水量 / 奶量' : '注水总量',
      value: record.milkMl ? `${record.waterMl} / ${record.milkMl} ml` : `${record.waterMl} ml`,
    },
    { label: '冲煮水温', value: `${record.waterTempC} °C` },
  ]
  const colW = (width - 168) / 4
  stats.forEach((s, i) => {
    const sx = 84 + colW * i + colW / 2
    ctx.fillStyle = '#7D6351'
    ctx.font = '500 16px "Noto Sans SC", sans-serif'
    ctx.fillText(s.label, sx, 706)
    ctx.fillStyle = '#261A14'
    ctx.font = '600 22px "JetBrains Mono", "Noto Sans SC", monospace'
    ctx.fillText(s.value, sx, 750)
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
    const y = 850 + idx * 36
    ctx.fillStyle = '#5E4638'
    ctx.font = '500 17px "Noto Sans SC", sans-serif'
    ctx.fillText(axis.name, 96, y)

    ctx.fillStyle = 'rgba(74, 52, 40, 0.14)'
    ctx.beginPath()
    ctx.roundRect(160, y - 13, 560, 12, 6)
    ctx.fill()

    ctx.fillStyle = '#B88446'
    ctx.beginPath()
    ctx.roundRect(160, y - 13, (560 * axis.value) / 100, 12, 6)
    ctx.fill()

    ctx.textAlign = 'right'
    ctx.fillStyle = '#4A3428'
    ctx.font = '500 16px "JetBrains Mono", monospace'
    ctx.fillText(`${axis.value}`, width - 96, y)
    ctx.textAlign = 'left'
  })

  // Tasting Note & Rating
  ctx.strokeStyle = 'rgba(184, 132, 70, 0.35)'
  ctx.beginPath()
  ctx.moveTo(84, 1036)
  ctx.lineTo(width - 84, 1036)
  ctx.stroke()

  const stars = '★'.repeat(record.rating) + '☆'.repeat(5 - record.rating)
  ctx.fillStyle = '#B88446'
  ctx.font = '24px serif'
  ctx.fillText(stars, 84, 1078)

  ctx.textAlign = 'right'
  ctx.fillStyle = '#7D6351'
  ctx.font = '500 16px "JetBrains Mono", monospace'
  ctx.fillText(new Date(record.brewedAt).toLocaleDateString('zh-CN'), width - 84, 1076)

  ctx.textAlign = 'left'
  ctx.fillStyle = '#3B281E'
  ctx.font = '500 20px "Noto Serif SC", serif'
  const note =
    record.tastingNote.trim() || '“亲手完成的一杯馆藏风味，时间与香气在此刻定格。”'
  ctx.fillText(note.slice(0, 38), 84, 1124)

  const link = document.createElement('a')
  link.download = `咖啡博物馆-${record.exhibitNo}-${record.catalogNumber}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
