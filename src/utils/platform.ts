import type {
  CoffeeExhibit,
  CuratorBadge,
  FlavorPreference,
  SavedBrewRecord,
  TasteCustomizePreset,
} from '../types/coffee'

export { playGentleChime, setCafeAmbience } from './audio'

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

export const TASTE_PRESET_OPTIONS: {
  id: TasteCustomizePreset
  label: string
  shortHint: string
}[] = [
  { id: 'standard', label: '馆藏标准', shortHint: '策展师黄金平衡参数' },
  { id: 'sweet', label: '更甜润柔和', shortHint: '柔化酸苦 · 突出焦糖与果甜' },
  { id: 'bright', label: '更清爽花果', shortHint: '拉高水粉比 · 口感清透如茶' },
  { id: 'bold', label: '更浓郁醇厚', shortHint: '增加粉量 · 油脂与甜感更饱满' },
]

export function scaleRecipe(
  coffee: CoffeeExhibit,
  servings: number,
  tastePreset: TasteCustomizePreset = 'standard'
) {
  const factor = Math.max(0.5, Math.min(4, servings))

  let doseMultiplier = 1
  let waterMultiplier = 1
  let tempDelta = 0
  let coachNote = '按馆藏标准参数冲煮，平衡展现产区本味。'

  const isCold = coffee.recipe.waterTempC <= 15
  const isDark = coffee.roastValue >= 4

  if (tastePreset === 'sweet') {
    doseMultiplier = 1.04
    waterMultiplier = 0.97
    if (!isCold) {
      tempDelta = isDark ? -2 : 1
    }
    coachNote = isDark
      ? '已将水温微降 2°C 并略收尾段水量，抑制深烘苦涩、放大焦糖回甘。'
      : '已微提 1°C 水温并略增粉量，充分打开浅中烘果胶甜感、柔化尖酸。'
  } else if (tastePreset === 'bright') {
    doseMultiplier = 0.96
    waterMultiplier = 1.06
    if (!isCold) {
      tempDelta = -1
    }
    coachNote = '已适度拉大水粉比并微降 1°C 水温，让茶感与上扬花果香更清澈透亮。'
  } else if (tastePreset === 'bold') {
    doseMultiplier = 1.12
    waterMultiplier = 0.96
    coachNote = '已增加约 12% 咖啡粉量，带来更绵密的油脂醇厚度与浓郁挂杯感。'
  }

  const waterTempC = isCold
    ? coffee.recipe.waterTempC
    : Math.min(96, Math.max(82, coffee.recipe.waterTempC + tempDelta))

  return {
    doseGrams: Math.round(coffee.recipe.doseGrams * factor * doseMultiplier * 10) / 10,
    waterMl: Math.round(coffee.recipe.waterMl * factor * waterMultiplier),
    milkMl: coffee.recipe.milkMl ? Math.round(coffee.recipe.milkMl * factor) : undefined,
    iceGrams: coffee.recipe.iceGrams ? Math.round(coffee.recipe.iceGrams * factor) : undefined,
    waterTempC,
    coachNote,
    scaleTarget: (target?: number) =>
      typeof target === 'number'
        ? Math.round(target * factor * (target > coffee.recipe.waterMl ? 1 : waterMultiplier))
        : undefined,
  }
}

export function formatSeconds(totalSec: number): string {
  const clamped = Math.max(0, Math.floor(totalSec))
  const mins = Math.floor(clamped / 60)
  const secs = clamped % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
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
  const retroCount = records.filter((r) => {
    const item = allCoffees.find((c) => c.id === r.coffeeId)
    return item?.category === '复古器具'
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
      id: 'retro-craftsman',
      title: '复古器具匠人',
      subtitle: '体验虹吸壶、土耳其壶、法压壶、爱乐压或摩卡壶',
      unlocked: retroCount >= 2,
      progress: `${Math.min(2, retroCount)} / 2`,
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
      subtitle: '点亮 6 款不同馆藏咖啡展品',
      unlocked: uniqueIds.size >= 6,
      progress: `${Math.min(6, uniqueIds.size)} / 6`,
    },
    {
      id: 'master-curator',
      title: '博物馆荣誉馆长',
      subtitle: '点亮 10 款不同世界馆藏风味展品',
      unlocked: uniqueIds.size >= 10,
      progress: `${Math.min(10, uniqueIds.size)} / 10`,
    },
  ]
}
