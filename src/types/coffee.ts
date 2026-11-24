export type BrewMethod =
  | 'v60'
  | 'espresso'
  | 'milk'
  | 'dirty'
  | 'coldbrew'
  | 'moka'
  | 'iced'
  | 'frenchpress'
  | 'aeropress'

export type DrinkCategory = '手冲黑咖' | '意式奶咖' | '冰爽特调' | '复古器具'

export type RoastLevel = '极浅烘' | '浅烘' | '中浅烘' | '中烘' | '中深烘' | '深烘'

export type TemperatureStyle = '热饮' | '冷饮' | '冷热分层'

export type StepPhase =
  | 'prep'
  | 'bloom'
  | 'pour'
  | 'extract'
  | 'milk'
  | 'assemble'
  | 'finish'

export type TasteCustomizePreset = 'standard' | 'sweet' | 'bright' | 'bold'

export type PostcardTheme = 'parchment' | 'espresso' | 'botanical'

export type MuseumTheme = 'daylight' | 'kissaten'

export interface FlavorProfile {
  acidity: number // 0-100 酸度
  sweetness: number // 0-100 甜感
  body: number // 0-100 醇厚度
  bitterness: number // 0-100 苦韵
  aroma: number // 0-100 花果香气
}

export interface BrewStep {
  id: string
  title: string
  phase: StepPhase
  durationSec: number // 0 means manual preparation without countdown
  targetWaterMl?: number // Cumulative liquid weight target for 1x serving
  instruction: string
  baristaTip: string
  visualLevel: number // 0-100 liquid fill level in vessel
  isPouring?: boolean
  isBlooming?: boolean
  hasMilk?: boolean
  hasIce?: boolean
  hasSteam?: boolean
}

export interface CoffeeExhibit {
  id: string
  exhibitNo: string
  name: string
  englishName: string
  subtitle: string
  category: DrinkCategory
  method: BrewMethod
  methodLabel: string
  temperature: TemperatureStyle
  roast: RoastLevel
  roastValue: number // 1-5
  origin: string
  altitude: string
  process: string
  curatorNote: string
  storyYear: string
  flavorProfile: FlavorProfile
  flavorNotes: string[]
  moodTags: string[]
  palette: {
    liquid: string
    crema: string
    accent: string
  }
  recipe: {
    doseGrams: number
    waterMl: number
    milkMl?: number
    milkLabel?: string
    iceGrams?: number
    waterTempC: number
    grindLevel: number // 1 (finest) - 10 (coarsest)
    grindDesc: string
    ratioLabel: string
    totalTimeLabel: string
    difficulty: '新手友好' | '进阶风味' | '专业品鉴'
  }
  equipment: string[]
  steps: BrewStep[]
}

export interface FlavorPreference {
  style: 'all' | DrinkCategory
  temperature: 'all' | TemperatureStyle
  acidity: number
  sweetness: number
  body: number
  bitterness: number
  selectedMoods: string[]
}

export interface SavedBrewRecord {
  recordId: string
  catalogNumber: string
  coffeeId: string
  coffeeName: string
  englishName: string
  exhibitNo: string
  methodLabel: string
  servings: number
  tastePreset?: TasteCustomizePreset
  doseGrams: number
  waterMl: number
  milkMl?: number
  waterTempC: number
  rating: number
  tastingNote: string
  brewedAt: string
  flavorNotes: string[]
  flavorProfile: FlavorProfile
  palette: CoffeeExhibit['palette']
}

export type AppView = 'curator' | 'gallery' | 'studio' | 'archive'

export interface CuratorBadge {
  id: string
  title: string
  subtitle: string
  unlocked: boolean
  progress: string
}
