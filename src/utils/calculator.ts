export type BrewCalcStyleId =
  | 'pourover'
  | 'iced-pourover'
  | 'immersion'
  | 'aeropress'
  | 'coldbrew'
  | 'espresso'
  | 'milk-coffee'
  | 'moka-phin'

export type BeanCaffeineTypeId = 'arabica' | 'robusta-blend' | 'decaf'

export interface BrewCalcPreset {
  id: BrewCalcStyleId
  label: string
  shortLabel: string
  ratioHint: string
  minDose: number
  maxDose: number
  defaultDose: number
  minSecond: number
  maxSecond: number
  stepSecond: number
  defaultSecond: number
  secondMode: 'ratio' | 'milk-ml'
  tempGuide: string
  grindGuide: string
  mgPerGramArabica: number
}

export interface BeanCaffeineOption {
  id: BeanCaffeineTypeId
  label: string
  shortLabel: string
  multiplier: number
  note: string
}

export const BEAN_CAFFEINE_OPTIONS: BeanCaffeineOption[] = [
  {
    id: 'arabica',
    label: '100% 阿拉比卡（精品单品）',
    shortLabel: '阿拉比卡',
    multiplier: 1.0,
    note: '标准精品豆咖啡因基准（约 11mg/g 生豆）',
  },
  {
    id: 'robusta-blend',
    label: '罗布斯塔拼配（意式/越式）',
    shortLabel: '拼配含罗豆',
    multiplier: 1.45,
    note: '罗布斯塔咖啡因约为阿拉比卡 1.8–2 倍，油脂更厚、提神力更强',
  },
  {
    id: 'decaf',
    label: '低因咖啡豆（瑞士水处理 Decaf）',
    shortLabel: '低因 Decaf',
    multiplier: 0.04,
    note: '已去除约 97% 咖啡因，晚间也可安心品饮',
  },
]

export const BREW_CALC_PRESETS: BrewCalcPreset[] = [
  {
    id: 'pourover',
    label: '热手冲 V60 / Chemex',
    shortLabel: '热手冲',
    ratioHint: '1:12 – 1:18',
    minDose: 10,
    maxDose: 40,
    defaultDose: 15,
    minSecond: 12,
    maxSecond: 18,
    stepSecond: 0.5,
    defaultSecond: 15,
    secondMode: 'ratio',
    tempGuide: '90 – 94°C（浅烘偏高，深烘偏低）',
    grindGuide: '中细研磨 · 细白糖颗粒（约 650μm）',
    mgPerGramArabica: 9.2,
  },
  {
    id: 'iced-pourover',
    label: '日式急冷冰手冲',
    shortLabel: '日式冰手冲',
    ratioHint: '1:13 – 1:17（60%水+40%冰）',
    minDose: 10,
    maxDose: 36,
    defaultDose: 16,
    minSecond: 13,
    maxSecond: 17,
    stepSecond: 0.5,
    defaultSecond: 15,
    secondMode: 'ratio',
    tempGuide: '92°C 热水急滤 + 4°C 大块老冰锁香',
    grindGuide: '略细于热手冲（约 580μm）补偿萃取率',
    mgPerGramArabica: 9.0,
  },
  {
    id: 'immersion',
    label: '聪明杯 / 法压壶 / 虹吸',
    shortLabel: '浸泡 / 虹吸',
    ratioHint: '1:13 – 1:18',
    minDose: 10,
    maxDose: 40,
    defaultDose: 16,
    minSecond: 13,
    maxSecond: 18,
    stepSecond: 0.5,
    defaultSecond: 15.5,
    secondMode: 'ratio',
    tempGuide: '92 – 94°C · 全浸泡 2 分 30 秒 – 4 分钟',
    grindGuide: '中粗研磨 · 粗白糖颗粒（约 780μm）',
    mgPerGramArabica: 9.5,
  },
  {
    id: 'aeropress',
    label: '爱乐压 AeroPress',
    shortLabel: '爱乐压',
    ratioHint: '1:8 – 1:15',
    minDose: 10,
    maxDose: 26,
    defaultDose: 15,
    minSecond: 8,
    maxSecond: 15,
    stepSecond: 0.5,
    defaultSecond: 12,
    secondMode: 'ratio',
    tempGuide: '85 – 92°C · 浸泡加压 1 分 30 秒 – 2 分钟',
    grindGuide: '中细研磨（约 550μm），比手冲略细',
    mgPerGramArabica: 8.9,
  },
  {
    id: 'coldbrew',
    label: '冰滴 / 低温冷萃',
    shortLabel: '冷萃 / 冰滴',
    ratioHint: '1:6 – 1:12',
    minDose: 15,
    maxDose: 60,
    defaultDose: 25,
    minSecond: 6,
    maxSecond: 12,
    stepSecond: 0.5,
    defaultSecond: 10,
    secondMode: 'ratio',
    tempGuide: '4 – 8°C 冷藏慢萃 8 – 14 小时',
    grindGuide: '中粗研磨（约 850μm），滤后更清澈顺滑',
    mgPerGramArabica: 9.8,
  },
  {
    id: 'espresso',
    label: '意式浓缩 Espresso',
    shortLabel: '意式浓缩',
    ratioHint: '1:1.5 – 1:2.5',
    minDose: 14,
    maxDose: 22,
    defaultDose: 18,
    minSecond: 1.5,
    maxSecond: 2.5,
    stepSecond: 0.1,
    defaultSecond: 2.0,
    secondMode: 'ratio',
    tempGuide: '92 – 93°C · 9 Bar 萃取 22 – 34 秒',
    grindGuide: '意式极细研磨 · 面粉略粗（约 230μm）',
    mgPerGramArabica: 8.2,
  },
  {
    id: 'milk-coffee',
    label: '意式奶咖（拿铁 / 澳白 / Dirty）',
    shortLabel: '意式奶咖',
    ratioHint: '浓缩基底 + 100 – 260ml 鲜奶',
    minDose: 14,
    maxDose: 22,
    defaultDose: 18,
    minSecond: 100,
    maxSecond: 260,
    stepSecond: 10,
    defaultSecond: 180,
    secondMode: 'milk-ml',
    tempGuide: '双份浓缩 93°C · 蒸汽打发奶温 58 – 62°C',
    grindGuide: '意式极细（约 230μm），Dirty 可略细走精萃',
    mgPerGramArabica: 8.2,
  },
  {
    id: 'moka-phin',
    label: '摩卡壶 / 越南滴漏 / 土耳其壶',
    shortLabel: '摩卡 / 滴漏 / 铜壶',
    ratioHint: '1:5 – 1:10',
    minDose: 12,
    maxDose: 30,
    defaultDose: 16,
    minSecond: 5,
    maxSecond: 10,
    stepSecond: 0.5,
    defaultSecond: 7.5,
    secondMode: 'ratio',
    tempGuide: '92 – 96°C · 小火微压或慢滴 2 分 30 秒 – 4 分钟',
    grindGuide: '摩卡/滴漏约 360μm；土耳其铜壶需极细面粉状',
    mgPerGramArabica: 9.6,
  },
]

export interface BrewCalcOutput {
  preset: BrewCalcPreset
  beanOption: BeanCaffeineOption
  clampedDose: number
  clampedSecond: number
  primaryMetricLabel: string
  primaryMetricValue: string
  secondaryMetricLabel: string
  secondaryMetricValue: string
  styleBadge: string
  estCaffeineMg: number
  dailyPct: number
}

export function calculateBrewMetrics(
  styleId: BrewCalcStyleId,
  doseGrams: number,
  secondValue: number,
  beanType: BeanCaffeineTypeId = 'arabica'
): BrewCalcOutput {
  const preset = BREW_CALC_PRESETS.find((p) => p.id === styleId) ?? BREW_CALC_PRESETS[0]
  const beanOption =
    BEAN_CAFFEINE_OPTIONS.find((b) => b.id === beanType) ?? BEAN_CAFFEINE_OPTIONS[0]

  const clampedDose = Math.min(Math.max(Math.round(doseGrams), preset.minDose), preset.maxDose)
  const rawSecond = Math.min(Math.max(secondValue, preset.minSecond), preset.maxSecond)
  const clampedSecond =
    preset.stepSecond < 1 ? Math.round(rawSecond * 10) / 10 : Math.round(rawSecond * 2) / 2

  const estCaffeineMg = Math.max(
    1,
    Math.round(clampedDose * preset.mgPerGramArabica * beanOption.multiplier)
  )
  const dailyPct = Math.min(100, Math.round((estCaffeineMg / 400) * 100))

  if (styleId === 'espresso') {
    const yieldGrams = Math.round(clampedDose * clampedSecond)
    const shotLabel =
      clampedSecond <= 1.7
        ? '精萃 Ristretto'
        : clampedSecond >= 2.3
          ? '长萃 Lungo'
          : '标准 Espresso'
    const timeWindow =
      clampedSecond <= 1.7
        ? '22 – 26 秒'
        : clampedSecond >= 2.3
          ? '28 – 34 秒'
          : '25 – 30 秒'
    return {
      preset,
      beanOption,
      clampedDose,
      clampedSecond,
      primaryMetricLabel: '目标浓缩液重',
      primaryMetricValue: `${yieldGrams} g`,
      secondaryMetricLabel: '建议萃取窗口',
      secondaryMetricValue: timeWindow,
      styleBadge: shotLabel,
      estCaffeineMg,
      dailyPct,
    }
  }

  if (styleId === 'milk-coffee') {
    const espressoGrams = Math.round(clampedDose * 2)
    const milkMl = Math.round(clampedSecond)
    const totalCupMl = espressoGrams + milkMl
    const cupStyle =
      milkMl <= 130
        ? '短笛 / Magic 浓奶咖'
        : milkMl <= 165
          ? '澳白 Flat White / Dirty'
          : milkMl <= 220
            ? '经典拿铁 / 丝绒卡布'
            : '大杯柔和拿铁'
    return {
      preset,
      beanOption,
      clampedDose,
      clampedSecond: milkMl,
      primaryMetricLabel: `双份浓缩 + 鲜奶（总杯 ≈${totalCupMl}ml）`,
      primaryMetricValue: `${espressoGrams}g + ${milkMl}ml`,
      secondaryMetricLabel: '对应经典杯型',
      secondaryMetricValue: cupStyle,
      styleBadge: cupStyle,
      estCaffeineMg,
      dailyPct,
    }
  }

  if (styleId === 'iced-pourover') {
    const totalLiquid = Math.round(clampedDose * clampedSecond)
    const hotWaterMl = Math.round(totalLiquid * 0.6)
    const iceGrams = totalLiquid - hotWaterMl
    const bloomWater = Math.round(clampedDose * 2)
    return {
      preset,
      beanOption,
      clampedDose,
      clampedSecond,
      primaryMetricLabel: `热水 60% + 冰块 40%（总液 ${totalLiquid}ml）`,
      primaryMetricValue: `${hotWaterMl}ml + ${iceGrams}g冰`,
      secondaryMetricLabel: '建议闷蒸注水',
      secondaryMetricValue: `${bloomWater} ml`,
      styleBadge: '6:4 急冷锁香配比',
      estCaffeineMg,
      dailyPct,
    }
  }

  const totalWater = Math.round(clampedDose * clampedSecond)
  const netYield = Math.max(0, Math.round(totalWater - clampedDose * (styleId === 'moka-phin' ? 1.5 : 2)))

  if (styleId === 'pourover') {
    const bloomWater = Math.round(clampedDose * 2.2)
    const strength =
      clampedSecond <= 13.5 ? '醇厚浓郁' : clampedSecond >= 16.5 ? '清透茶感' : '黄金平衡'
    return {
      preset,
      beanOption,
      clampedDose,
      clampedSecond,
      primaryMetricLabel: '建议总注水量',
      primaryMetricValue: `${totalWater} ml`,
      secondaryMetricLabel: `建议闷蒸水（净出杯 ≈${netYield}ml）`,
      secondaryMetricValue: `${bloomWater} ml`,
      styleBadge: strength,
      estCaffeineMg,
      dailyPct,
    }
  }

  if (styleId === 'coldbrew') {
    const drinkHint =
      clampedSecond <= 8 ? '浓缩冷萃（饮用建议 1:1 兑水/奶）' : '即饮清爽冷萃（加冰直饮）'
    return {
      preset,
      beanOption,
      clampedDose,
      clampedSecond,
      primaryMetricLabel: '建议总冰水量',
      primaryMetricValue: `${totalWater} ml`,
      secondaryMetricLabel: '过滤后预估净出液',
      secondaryMetricValue: `${netYield} ml`,
      styleBadge: drinkHint,
      estCaffeineMg,
      dailyPct,
    }
  }

  if (styleId === 'moka-phin') {
    const modeNote =
      clampedSecond <= 6.5 ? '浓稠基底（宜配炼乳 / 冰奶）' : '复古纯饮醇香（摩卡壶 / 铜壶）'
    return {
      preset,
      beanOption,
      clampedDose,
      clampedSecond,
      primaryMetricLabel: '建议下壶 / 壶内总水量',
      primaryMetricValue: `${totalWater} ml`,
      secondaryMetricLabel: '预估浓郁出液量',
      secondaryMetricValue: `${netYield} ml`,
      styleBadge: modeNote,
      estCaffeineMg,
      dailyPct,
    }
  }

  // immersion or aeropress
  const styleBadge =
    styleId === 'aeropress'
      ? clampedSecond <= 10
        ? '爱乐压浓缩基底（宜兑奶/冰美式）'
        : '爱乐压圆润纯饮'
      : clampedSecond <= 14.5
        ? '饱满醇厚浸泡'
        : '干净圆润浸泡'

  return {
    preset,
    beanOption,
    clampedDose,
    clampedSecond,
    primaryMetricLabel: '建议总注水量',
    primaryMetricValue: `${totalWater} ml`,
    secondaryMetricLabel: '预估净出杯量',
    secondaryMetricValue: `${netYield} ml`,
    styleBadge,
    estCaffeineMg,
    dailyPct,
  }
}
