import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  BREW_TROUBLESHOOT_CASES,
  COFFEE_ORIGINS,
  COFFEE_TRIVIA_QUESTIONS,
  FLAVOR_WHEEL_FAMILIES,
  PROCESS_GUIDES,
  ROAST_STAGES,
} from '../src/data/atlas.ts'
import {
  COFFEE_EXHIBITS,
  CURATOR_SCENARIOS,
  MOOD_FLAVOR_OPTIONS,
} from '../src/data/coffees.ts'
import { EXHIBIT_EXTRAS, getDailyFeaturedIndex } from '../src/data/exhibitExtras.ts'
import type { SavedBrewRecord } from '../src/types/coffee.ts'
import {
  computeCuratorBadges,
  formatRecipeShareText,
  formatSeconds,
  isSoundMuted,
  scaleRecipe,
  scoreExhibitMatch,
  setSoundMuted,
} from '../src/utils/platform.ts'

describe('Coffee Museum Catalog & Data Integrity', () => {
  it('has 32 unique exhibits with valid steps, moods, and editorial extras', () => {
    assert.equal(COFFEE_EXHIBITS.length, 32)
    const ids = new Set<string>()
    const nos = new Set<string>()
    const validMoods = new Set<string>(MOOD_FLAVOR_OPTIONS.map((m) => m.id))

    for (const coffee of COFFEE_EXHIBITS) {
      assert.ok(!ids.has(coffee.id), `Duplicate exhibit id: ${coffee.id}`)
      assert.ok(!nos.has(coffee.exhibitNo), `Duplicate exhibitNo: ${coffee.exhibitNo}`)
      ids.add(coffee.id)
      nos.add(coffee.exhibitNo)

      // Every exhibit must have editorial pairing/fortune metadata
      const extra = EXHIBIT_EXTRAS[coffee.id]
      assert.ok(extra, `Missing EXHIBIT_EXTRAS entry for ${coffee.id}`)
      assert.ok(extra.pairing.length > 0)
      assert.ok(extra.tastingWindow.length > 0)
      assert.ok(extra.fortune.length > 0)

      // Every mood tag must be a recognized MOOD_FLAVOR_OPTIONS id
      for (const mood of coffee.moodTags) {
        assert.ok(validMoods.has(mood), `Invalid mood tag "${mood}" on ${coffee.id}`)
      }

      // Steps must have unique IDs and monotonically non-decreasing cumulative targetWaterMl
      assert.ok(coffee.steps.length >= 3, `${coffee.id} should have at least 3 steps`)
      const stepIds = new Set<string>()
      let prevTarget = 0
      for (const step of coffee.steps) {
        assert.ok(!stepIds.has(step.id), `Duplicate step id "${step.id}" in ${coffee.id}`)
        stepIds.add(step.id)
        if (typeof step.targetWaterMl === 'number') {
          assert.ok(
            step.targetWaterMl >= prevTarget,
            `${coffee.id} step ${step.id} targetWaterMl regressed (${prevTarget} -> ${step.targetWaterMl})`
          )
          prevTarget = step.targetWaterMl
        }
      }
    }
  })

  it('covers 14 distinct brew methods and ensures monsoon-malabar pour-2 isPouring', () => {
    const methods = new Set(COFFEE_EXHIBITS.map((c) => c.method))
    assert.equal(methods.size, 14)

    const monsoon = COFFEE_EXHIBITS.find((c) => c.id === 'monsoon-malabar-flannel')
    assert.ok(monsoon)
    const pour2 = monsoon.steps.find((s) => s.id === 'pour-2')
    assert.equal(pour2?.isPouring, true)
  })

  it('matches >= 1 exhibit for every Atlas origin, flavor wheel family, roast stage, and process guide', () => {
    const idSet = new Set(COFFEE_EXHIBITS.map((c) => c.id))

    for (const origin of COFFEE_ORIGINS) {
      const matched = COFFEE_EXHIBITS.filter((c) =>
        origin.matchKeywords.some(
          (kw) => c.origin.includes(kw) || c.storyYear.includes(kw) || c.name.includes(kw)
        )
      )
      assert.ok(matched.length >= 1, `Origin ${origin.id} matches 0 exhibits`)
    }

    for (const fam of FLAVOR_WHEEL_FAMILIES) {
      const matched = COFFEE_EXHIBITS.filter((c) => {
        const text = `${c.flavorNotes.join(' ')} ${c.moodTags.join(' ')} ${c.name}`
        return fam.matchKeywords.some((kw) => text.includes(kw))
      })
      assert.ok(matched.length >= 1, `Flavor wheel family ${fam.id} matches 0 exhibits`)
    }

    for (const stage of ROAST_STAGES) {
      const matched = COFFEE_EXHIBITS.filter((c) => c.roastValue === stage.level)
      assert.ok(matched.length >= 1, `Roast stage ${stage.level} matches 0 exhibits`)
    }

    for (const proc of PROCESS_GUIDES) {
      const matched = COFFEE_EXHIBITS.filter((c) =>
        proc.matchKeywords.some((kw) => c.process.includes(kw))
      )
      assert.ok(matched.length >= 1, `Process ${proc.id} matches 0 exhibits`)
    }

    for (const tc of BREW_TROUBLESHOOT_CASES) {
      assert.ok(
        idSet.has(tc.practiceExhibitId),
        `Troubleshooter case ${tc.id} points to invalid exhibit ${tc.practiceExhibitId}`
      )
    }

    assert.ok(COFFEE_TRIVIA_QUESTIONS.length >= 18)
    for (const q of COFFEE_TRIVIA_QUESTIONS) {
      assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length)
    }
    assert.equal(CURATOR_SCENARIOS.length, 8)
  })
})

describe('Brewing & Matching Algorithms', () => {
  it('scales recipes accurately for servings and taste presets', () => {
    const yirga = COFFEE_EXHIBITS.find((c) => c.id === 'yirgacheffe-v60')!
    const dark = COFFEE_EXHIBITS.find((c) => c.id === 'mandheling-nel')!
    const cold = COFFEE_EXHIBITS.find((c) => c.id === 'kyoto-cold-brew')!

    const std2x = scaleRecipe(yirga, 2, 'standard')
    assert.equal(std2x.doseGrams, 30)
    assert.equal(std2x.waterMl, 450)
    assert.equal(std2x.waterTempC, 92)

    const sweetLight = scaleRecipe(yirga, 1, 'sweet')
    assert.equal(sweetLight.waterTempC, 93)
    assert.ok(sweetLight.doseGrams > yirga.recipe.doseGrams)

    const sweetDark = scaleRecipe(dark, 1, 'sweet')
    assert.equal(sweetDark.waterTempC, 83)

    const boldCold = scaleRecipe(cold, 1, 'bold')
    assert.equal(boldCold.waterTempC, 4)
    assert.ok(boldCold.doseGrams > cold.recipe.doseGrams)
  })

  it('ranks matching coffee higher for aligned flavor preferences', () => {
    const yirga = COFFEE_EXHIBITS.find((c) => c.id === 'yirgacheffe-v60')!
    const mandheling = COFFEE_EXHIBITS.find((c) => c.id === 'mandheling-nel')!
    const floralPref = CURATOR_SCENARIOS[0].preference

    const yirgaScore = scoreExhibitMatch(yirga, floralPref)
    const mandScore = scoreExhibitMatch(mandheling, floralPref)
    assert.ok(yirgaScore > mandScore, `Expected yirga (${yirgaScore}) > mandheling (${mandScore})`)
  })

  it('computes all 8 curator badges accurately', () => {
    const makeRec = (coffeeId: string, idx: number): SavedBrewRecord => {
      const c = COFFEE_EXHIBITS.find((x) => x.id === coffeeId)!
      return {
        recordId: `rec-${idx}`,
        catalogNumber: `#2026-00${idx}`,
        coffeeId: c.id,
        coffeeName: c.name,
        englishName: c.englishName,
        exhibitNo: c.exhibitNo,
        methodLabel: c.methodLabel,
        servings: 1,
        doseGrams: c.recipe.doseGrams,
        waterMl: c.recipe.waterMl,
        waterTempC: c.recipe.waterTempC,
        rating: 5,
        tastingNote: '风味层次分明且甜感干净',
        brewedAt: '2026-11-26T08:00:00.000Z',
        flavorNotes: c.flavorNotes,
        flavorProfile: c.flavorProfile,
        palette: c.palette,
      }
    }

    const sampleRecords = [
      'yirgacheffe-v60',
      'panama-geisha',
      'velvet-flat-white',
      'osmanthus-oat-dirty',
      'italian-moka-pot',
      'costa-rica-french-press',
    ].map(makeRec)

    const badges = computeCuratorBadges(sampleRecords, COFFEE_EXHIBITS, 5)
    assert.equal(badges.length, 8)
    assert.equal(badges.find((b) => b.id === 'first-cup')?.unlocked, true)
    assert.equal(badges.find((b) => b.id === 'pour-over-poet')?.unlocked, true)
    assert.equal(badges.find((b) => b.id === 'milk-alchemist')?.unlocked, true)
    assert.equal(badges.find((b) => b.id === 'retro-craftsman')?.unlocked, true)
    assert.equal(badges.find((b) => b.id === 'flavor-archivist')?.unlocked, true)
    assert.equal(badges.find((b) => b.id === 'world-collector')?.unlocked, true)
    assert.equal(badges.find((b) => b.id === 'master-curator')?.unlocked, false)
    assert.equal(badges.find((b) => b.id === 'sommelier-scholar')?.unlocked, true)
  })

  it('formats shareable recipe text and time strings cleanly', () => {
    const yirga = COFFEE_EXHIBITS[0]
    const text = formatRecipeShareText(yirga, 1.5, 'bright')
    assert.ok(text.includes(yirga.name))
    assert.ok(text.includes('1.5 杯'))
    assert.ok(text.includes('更清爽花果'))
    assert.equal(formatSeconds(125), '02:05')
    assert.equal(formatSeconds(-5), '00:00')

    const dailyIdx = getDailyFeaturedIndex(COFFEE_EXHIBITS.length)
    assert.ok(dailyIdx >= 0 && dailyIdx < COFFEE_EXHIBITS.length)
  })

  it('toggles global sound mute state consistently', () => {
    assert.equal(isSoundMuted(), false)
    setSoundMuted(true)
    assert.equal(isSoundMuted(), true)
    setSoundMuted(false)
    assert.equal(isSoundMuted(), false)
  })
})
