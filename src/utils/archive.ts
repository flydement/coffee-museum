import type {
  CoffeeExhibit,
  FlavorProfile,
  SavedBrewRecord,
  TasteCustomizePreset,
} from '../types/coffee'

const VALID_TASTE_PRESETS = new Set<TasteCustomizePreset>([
  'standard',
  'sweet',
  'bright',
  'bold',
])

export function sanitizeImportedRecord(
  raw: unknown,
  exhibits: readonly CoffeeExhibit[]
): SavedBrewRecord | null {
  if (!raw || typeof raw !== 'object') return null
  const item = raw as Partial<SavedBrewRecord>
  if (typeof item.recordId !== 'string' || !item.recordId.trim()) return null
  if (typeof item.coffeeId !== 'string' || !item.coffeeId.trim()) return null

  const fallbackCoffee =
    exhibits.find((c) => c.id === item.coffeeId) ?? exhibits[0]
  if (!fallbackCoffee) return null

  const clampAxis = (v: unknown, def: number) =>
    typeof v === 'number' && Number.isFinite(v)
      ? Math.min(100, Math.max(0, Math.round(v)))
      : def

  const fp = item.flavorProfile
  const safeProfile: FlavorProfile = {
    acidity: clampAxis(fp?.acidity, fallbackCoffee.flavorProfile.acidity),
    sweetness: clampAxis(fp?.sweetness, fallbackCoffee.flavorProfile.sweetness),
    body: clampAxis(fp?.body, fallbackCoffee.flavorProfile.body),
    bitterness: clampAxis(fp?.bitterness, fallbackCoffee.flavorProfile.bitterness),
    aroma: clampAxis(fp?.aroma, fallbackCoffee.flavorProfile.aroma),
  }

  const safeRating =
    typeof item.rating === 'number' && Number.isFinite(item.rating)
      ? Math.min(5, Math.max(1, Math.round(item.rating)))
      : 5

  const safePreset =
    typeof item.tastePreset === 'string' &&
    VALID_TASTE_PRESETS.has(item.tastePreset as TasteCustomizePreset)
      ? (item.tastePreset as TasteCustomizePreset)
      : undefined

  return {
    recordId: item.recordId.trim(),
    catalogNumber:
      typeof item.catalogNumber === 'string' && item.catalogNumber.trim()
        ? item.catalogNumber.trim()
        : `#${new Date().getFullYear()}-IMP`,
    coffeeId: item.coffeeId.trim(),
    coffeeName:
      typeof item.coffeeName === 'string' && item.coffeeName.trim()
        ? item.coffeeName
        : fallbackCoffee.name,
    englishName:
      typeof item.englishName === 'string' && item.englishName.trim()
        ? item.englishName
        : fallbackCoffee.englishName,
    exhibitNo:
      typeof item.exhibitNo === 'string' && item.exhibitNo.trim()
        ? item.exhibitNo
        : fallbackCoffee.exhibitNo,
    methodLabel:
      typeof item.methodLabel === 'string' && item.methodLabel.trim()
        ? item.methodLabel
        : fallbackCoffee.methodLabel,
    servings:
      typeof item.servings === 'number' &&
      Number.isFinite(item.servings) &&
      item.servings > 0
        ? Math.min(4, Math.max(0.5, item.servings))
        : 1,
    tastePreset: safePreset,
    doseGrams:
      typeof item.doseGrams === 'number' &&
      Number.isFinite(item.doseGrams) &&
      item.doseGrams > 0
        ? item.doseGrams
        : fallbackCoffee.recipe.doseGrams,
    waterMl:
      typeof item.waterMl === 'number' &&
      Number.isFinite(item.waterMl) &&
      item.waterMl > 0
        ? item.waterMl
        : fallbackCoffee.recipe.waterMl,
    milkMl:
      typeof item.milkMl === 'number' &&
      Number.isFinite(item.milkMl) &&
      item.milkMl > 0
        ? item.milkMl
        : undefined,
    waterTempC:
      typeof item.waterTempC === 'number' && Number.isFinite(item.waterTempC)
        ? Math.min(100, Math.max(0, item.waterTempC))
        : fallbackCoffee.recipe.waterTempC,
    rating: safeRating,
    tastingNote: typeof item.tastingNote === 'string' ? item.tastingNote : '',
    brewedAt:
      typeof item.brewedAt === 'string' && !Number.isNaN(Date.parse(item.brewedAt))
        ? item.brewedAt
        : new Date().toISOString(),
    flavorNotes:
      Array.isArray(item.flavorNotes) &&
      item.flavorNotes.length > 0 &&
      item.flavorNotes.every((n) => typeof n === 'string')
        ? item.flavorNotes
        : fallbackCoffee.flavorNotes,
    flavorProfile: safeProfile,
    palette:
      item.palette &&
      typeof item.palette.liquid === 'string' &&
      typeof item.palette.crema === 'string' &&
      typeof item.palette.accent === 'string'
        ? item.palette
        : fallbackCoffee.palette,
  }
}
