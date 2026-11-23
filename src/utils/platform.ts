import type {
  CoffeeExhibit,
  CuratorBadge,
  FlavorPreference,
  SavedBrewRecord,
} from '../types/coffee'

declare global {
  interface Window {
    coffeeMuseumDesktop?: {
      isDesktop: boolean
      platform: string
      versions: {
        electron: string
        chrome: string
      }
    }
    Capacitor?: {
      isNativePlatform?: () => boolean
      getPlatform?: () => string
    }
  }
}

export type RuntimePlatform = 'pc' | 'mobile-app' | 'pwa' | 'web'

export function detectRuntimePlatform(): {
  kind: RuntimePlatform
  label: string
  hint: string
} {
  if (typeof window === 'undefined') {
    return { kind: 'web', label: 'Web 展馆版', hint: '支持安装为 PWA 或打包至桌面与移动端' }
  }
  if (window.coffeeMuseumDesktop?.isDesktop) {
    return {
      kind: 'pc',
      label: 'PC 桌面客户端',
      hint: '快捷键：空格键 开始/暂停计时 · ←/→ 切换步骤',
    }
  }
  if (window.Capacitor?.isNativePlatform?.()) {
    const plat = window.Capacitor.getPlatform?.() ?? 'mobile'
    return {
      kind: 'mobile-app',
      label: plat === 'ios' ? 'iOS 原生 App' : 'Android 原生 App',
      hint: '原生移动端适配已启用',
    }
  }
  const isStandalone =
    window.matchMedia?.('(display-mode: standalone)').matches ||
    Boolean((window.navigator as { standalone?: boolean }).standalone)
  if (isStandalone) {
    return {
      kind: 'pwa',
      label: 'PWA 独立应用',
      hint: '离线缓存与原生全屏体验已开启',
    }
  }
  return {
    kind: 'web',
    label: '全端 Web 版',
    hint: '自适应 PC / 平板 / 手机 · 支持快捷键与 PWA 安装',
  }
}

export function scoreExhibitMatch(
  coffee: CoffeeExhibit,
  pref: FlavorPreference
): number {
  const acidDiff = Math.abs(coffee.flavorProfile.acidity - pref.acidity)
  const sweetDiff = Math.abs(coffee.flavorProfile.sweetness - pref.sweetness)
  const bodyDiff = Math.abs(coffee.flavorProfile.body - pref.body)
  const bitterDiff = Math.abs(coffee.flavorProfile.bitterness - pref.bitterness)

  const avgDiff = (acidDiff + sweetDiff + bodyDiff + bitterDiff) / 4
  let score = Math.max(48, Math.round(100 - avgDiff * 0.72))

  if (pref.selectedMoods.length > 0) {
    const hits = pref.selectedMoods.filter((m) => coffee.moodTags.includes(m)).length
    if (hits > 0) {
      score = Math.min(99, score + hits * 8)
    } else {
      score = Math.max(45, score - 12)
    }
  }

  if (pref.style !== 'all' && coffee.category !== pref.style) {
    score = Math.max(40, score - 20)
  }
  if (pref.temperature !== 'all' && coffee.temperature !== pref.temperature) {
    score = Math.max(40, score - 14)
  }

  return score
}

export function scaleRecipe(coffee: CoffeeExhibit, servings: number) {
  const factor = Math.max(0.5, Math.min(4, servings))
  return {
    doseGrams: Math.round(coffee.recipe.doseGrams * factor * 10) / 10,
    waterMl: Math.round(coffee.recipe.waterMl * factor),
    milkMl: coffee.recipe.milkMl ? Math.round(coffee.recipe.milkMl * factor) : undefined,
    iceGrams: coffee.recipe.iceGrams ? Math.round(coffee.recipe.iceGrams * factor) : undefined,
    scaleTarget: (target?: number) =>
      typeof target === 'number' ? Math.round(target * factor) : undefined,
  }
}

export function formatSeconds(totalSec: number): string {
  const clamped = Math.max(0, Math.floor(totalSec))
  const mins = Math.floor(clamped / 60)
  const secs = clamped % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

let audioCtx: AudioContext | null = null

export function playGentleChime(type: 'step' | 'complete' = 'step') {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    if (!audioCtx) {
      audioCtx = new AudioContextClass()
    }
    if (audioCtx.state === 'suspended') {
      void audioCtx.resume()
    }

    const now = audioCtx.currentTime
    const notes = type === 'complete' ? [523.25, 659.25, 783.99, 1046.5] : [587.33, 880]

    notes.forEach((freq, idx) => {
      if (!audioCtx) return
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.14)

      gain.gain.setValueAtTime(0.0001, now + idx * 0.14)
      gain.gain.exponentialRampToValueAtTime(0.09, now + idx * 0.14 + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 0.55)

      osc.connect(gain)
      gain.connect(audioCtx.destination)

      osc.start(now + idx * 0.14)
      osc.stop(now + idx * 0.14 + 0.6)
    })
  } catch {
    // Ignore audio errors if blocked by browser autoplay policies
  }
}

export function computeCuratorBadges(
  records: SavedBrewRecord[],
  allCoffees: CoffeeExhibit[]
): CuratorBadge[] {
  const uniqueIds = new Set(records.map((r) => r.coffeeId))
  const pourOverCount = records.filter((r) => {
    const item = allCoffees.find((c) => c.id === r.coffeeId)
    return item?.category === '手冲黑咖'
  }).length
  const milkOrIcedCount = records.filter((r) => {
    const item = allCoffees.find((c) => c.id === r.coffeeId)
    return item?.category === '意式奶咖' || item?.category === '冰爽特调'
  }).length
  const noteCount = records.filter((r) => r.tastingNote.trim().length >= 4).length

  return [
    {
      id: 'first-cup',
      title: '开馆第一杯',
      subtitle: '亲手完成并收藏你的第 1 杯馆藏咖啡',
      unlocked: records.length >= 1,
      progress: `${Math.min(1, records.length)} / 1`,
    },
    {
      id: 'pour-over-poet',
      title: '手冲慢时光',
      subtitle: '完成 2 次手冲黑咖分步冲煮',
      unlocked: pourOverCount >= 2,
      progress: `${Math.min(2, pourOverCount)} / 2`,
    },
    {
      id: 'milk-alchemist',
      title: '奶咖与特调师',
      subtitle: '制作 2 杯意式奶咖或冰爽特调',
      unlocked: milkOrIcedCount >= 2,
      progress: `${Math.min(2, milkOrIcedCount)} / 2`,
    },
    {
      id: 'flavor-archivist',
      title: '风味品鉴策展人',
      subtitle: '为 3 杯咖啡写下专属风味品鉴手记',
      unlocked: noteCount >= 3,
      progress: `${Math.min(3, noteCount)} / 3`,
    },
    {
      id: 'world-collector',
      title: '风味环游收藏家',
      subtitle: '点亮 5 款不同馆藏咖啡展品',
      unlocked: uniqueIds.size >= 5,
      progress: `${Math.min(5, uniqueIds.size)} / 5`,
    },
  ]
}
