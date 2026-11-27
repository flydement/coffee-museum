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
import { sanitizeImportedRecord } from '../src/utils/archive.ts'
import {
  BEAN_CAFFEINE_OPTIONS,
  BREW_CALC_PRESETS,
  calculateBrewMetrics,
} from '../src/utils/calculator.ts'
import {
  computeCuratorBadges,
  formatRecipeShareText,
  formatSeconds,
  isSoundMuted,
  scaleRecipe,
  scoreExhibitMatch,
  setSoundMuted,
} from '../src/utils/platform.ts'
import { buildMuseumHash, parseMuseumHash } from '../src/utils/router.ts'
import { searchMuseumCatalog } from '../src/utils/search.ts'

describe('Coffee Museum Catalog & Data Integrity', () => {
  it('has 52 unique exhibits (13 per category) with valid steps, moods, and editorial extras', () => {
    assert.equal(COFFEE_EXHIBITS.length, 52)
    const ids = new Set<string>()
    const nos = new Set<string>()
    const categoryCounts = new Map<string, number>()
    const validMoods = new Set<string>(MOOD_FLAVOR_OPTIONS.map((m) => m.id))

    for (const coffee of COFFEE_EXHIBITS) {
      assert.ok(!ids.has(coffee.id), `Duplicate exhibit id: ${coffee.id}`)
      assert.ok(!nos.has(coffee.exhibitNo), `Duplicate exhibitNo: ${coffee.exhibitNo}`)
      ids.add(coffee.id)
      nos.add(coffee.exhibitNo)
      categoryCounts.set(coffee.category, (categoryCounts.get(coffee.category) ?? 0) + 1)

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

    assert.equal(categoryCounts.get('手冲黑咖'), 13)
    assert.equal(categoryCounts.get('意式奶咖'), 13)
    assert.equal(categoryCounts.get('冰爽特调'), 13)
    assert.equal(categoryCounts.get('复古器具'), 13)
  })

  it('covers 14 distinct brew methods, Yunnan Wildflower Honey, v5.6 exhibits, and monsoon-malabar pour-2', () => {
    const methods = new Set(COFFEE_EXHIBITS.map((c) => c.method))
    assert.equal(methods.size, 14)

    const yunnanHoney = COFFEE_EXHIBITS.find((c) => c.id === 'yunnan-puer-wildflower-honey')
    assert.ok(yunnanHoney)
    assert.equal(yunnanHoney.exhibitNo, 'EXH-33')
    assert.equal(yunnanHoney.category, '手冲黑咖')
    assert.ok(yunnanHoney.process.includes('蜜处理'))

    const newExhibitIds = [
      'costa-rica-mozart-v60',
      'colombia-el-paraiso-lychee',
      'hawaii-kona-chemex',
      'yunnan-brown-sugar-cinnamon-latte',
      'pistachio-velvet-latte',
      'melbourne-magic-coffee',
      'bumble-honey-orange-coffee',
      'eisbock-thick-milk-dirty',
      'peach-oolong-shaken-coffee',
      'saigon-ca-phe-sua-da',
      'brazil-yellow-bourbon-moka',
      'tanzania-peaberry-clever',
    ]
    for (const id of newExhibitIds) {
      assert.ok(
        COFFEE_EXHIBITS.some((c) => c.id === id),
        `Missing expected v5.6 exhibit ${id}`
      )
    }

    const monsoon = COFFEE_EXHIBITS.find((c) => c.id === 'monsoon-malabar-flannel')
    assert.ok(monsoon)
    const pour2 = monsoon.steps.find((s) => s.id === 'pour-2')
    assert.equal(pour2?.isPouring, true)
  })

  it('matches >= 1 exhibit for every Atlas origin (16), flavor wheel family, roast stage, and process guide', () => {
    const idSet = new Set(COFFEE_EXHIBITS.map((c) => c.id))
    assert.equal(COFFEE_ORIGINS.length, 16)

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

describe('Hash Routing, Quick Search & Archive Sanitization', () => {
  it('parses and builds museum deep-link hashes reliably', () => {
    assert.deepEqual(parseMuseumHash('', COFFEE_EXHIBITS), { view: 'curator' })
    assert.deepEqual(parseMuseumHash('#gallery', COFFEE_EXHIBITS), { view: 'gallery' })
    assert.deepEqual(parseMuseumHash('#exhibit/panama-geisha', COFFEE_EXHIBITS), {
      view: 'gallery',
      exhibitId: 'panama-geisha',
    })
    assert.deepEqual(parseMuseumHash('#exhibit/non-existent-id', COFFEE_EXHIBITS), {
      view: 'gallery',
    })
    assert.deepEqual(parseMuseumHash('#studio/yirgacheffe-v60', COFFEE_EXHIBITS), {
      view: 'studio',
      brewCoffeeId: 'yirgacheffe-v60',
    })
    assert.deepEqual(parseMuseumHash('#atlas/wheel', COFFEE_EXHIBITS), {
      view: 'atlas',
      atlasSection: 'wheel',
    })
    assert.deepEqual(parseMuseumHash('#atlas/unknown-tab', COFFEE_EXHIBITS), {
      view: 'atlas',
      atlasSection: 'map',
    })
    assert.deepEqual(parseMuseumHash('#unknown-route', COFFEE_EXHIBITS), { view: 'curator' })

    assert.equal(
      buildMuseumHash({ view: 'gallery', exhibitId: 'panama-geisha' }),
      '#exhibit/panama-geisha'
    )
    assert.equal(
      buildMuseumHash({ view: 'studio', brewCoffeeId: 'yirgacheffe-v60' }),
      '#studio/yirgacheffe-v60'
    )
    assert.equal(
      buildMuseumHash({ view: 'atlas', atlasSection: 'troubleshoot' }),
      '#atlas/troubleshoot'
    )
    assert.equal(buildMuseumHash({ view: 'atlas', atlasSection: 'map' }), '#atlas')
  })

  it('searches exhibits and shortcuts accurately across Chinese, English, and exhibit numbers', () => {
    const empty = searchMuseumCatalog('', COFFEE_EXHIBITS)
    assert.equal(empty.exhibits.length, 6)
    assert.ok(empty.shortcuts.length >= 8)

    const byNo = searchMuseumCatalog('EXH-01', COFFEE_EXHIBITS)
    assert.equal(byNo.exhibits[0]?.exhibitNo, 'EXH-01')

    const byChinese = searchMuseumCatalog('艺伎', COFFEE_EXHIBITS)
    assert.ok(byChinese.exhibits.some((c) => c.id === 'panama-geisha'))

    const byEnglish = searchMuseumCatalog('Geisha', COFFEE_EXHIBITS)
    assert.ok(byEnglish.exhibits.some((c) => c.id === 'panama-geisha'))

    const byYunnanHoney = searchMuseumCatalog('云南 百花蜜', COFFEE_EXHIBITS)
    assert.equal(byYunnanHoney.exhibits[0]?.id, 'yunnan-puer-wildflower-honey')

    const byYunnanPuerHoney = searchMuseumCatalog('云南 普洱 百花蜜', COFFEE_EXHIBITS)
    assert.equal(byYunnanPuerHoney.exhibits[0]?.id, 'yunnan-puer-wildflower-honey')

    const byLightMedHoney = searchMuseumCatalog('浅中烘 蜜处理', COFFEE_EXHIBITS)
    assert.ok(byLightMedHoney.exhibits.some((c) => c.id === 'yunnan-puer-wildflower-honey'))

    assert.equal(
      searchMuseumCatalog('莫扎特', COFFEE_EXHIBITS).exhibits[0]?.id,
      'costa-rica-mozart-v60'
    )
    assert.equal(
      searchMuseumCatalog('大黄蜂', COFFEE_EXHIBITS).exhibits[0]?.id,
      'bumble-honey-orange-coffee'
    )
    assert.equal(
      searchMuseumCatalog('冰博克', COFFEE_EXHIBITS).exhibits[0]?.id,
      'eisbock-thick-milk-dirty'
    )
    assert.equal(
      searchMuseumCatalog('夏威夷 可纳', COFFEE_EXHIBITS).exhibits[0]?.id,
      'hawaii-kona-chemex'
    )
    assert.equal(
      searchMuseumCatalog('西贡 炼乳', COFFEE_EXHIBITS).exhibits[0]?.id,
      'saigon-ca-phe-sua-da'
    )
    assert.equal(
      searchMuseumCatalog('墨尔本 magic', COFFEE_EXHIBITS).exhibits[0]?.id,
      'melbourne-magic-coffee'
    )

    const byTool = searchMuseumCatalog('风味轮', COFFEE_EXHIBITS)
    assert.ok(byTool.shortcuts.some((s) => s.atlasSection === 'wheel'))

    const noMatch = searchMuseumCatalog('不存在的咖啡名称xyz', COFFEE_EXHIBITS)
    assert.equal(noMatch.exhibits.length, 0)
    assert.equal(noMatch.shortcuts.length, 0)
  })

  it('sanitizes corrupt or out-of-range imported archive records safely', () => {
    assert.equal(sanitizeImportedRecord(null, COFFEE_EXHIBITS), null)
    assert.equal(sanitizeImportedRecord({ recordId: '   ', coffeeId: 'yirgacheffe-v60' }, COFFEE_EXHIBITS), null)

    const sanitized = sanitizeImportedRecord(
      {
        recordId: 'imp-1',
        coffeeId: 'yirgacheffe-v60',
        rating: 99,
        servings: -3,
        doseGrams: -10,
        waterTempC: 999,
        brewedAt: 'not-a-date',
        tastePreset: 'invalid-preset',
        flavorProfile: {
          acidity: 140,
          sweetness: -20,
          body: Number.NaN,
          bitterness: 42.6,
          aroma: 88,
        },
      },
      COFFEE_EXHIBITS
    )

    assert.ok(sanitized)
    assert.equal(sanitized.rating, 5)
    assert.equal(sanitized.servings, 1)
    assert.equal(sanitized.doseGrams, 15)
    assert.equal(sanitized.waterTempC, 100)
    assert.equal(sanitized.tastePreset, undefined)
    assert.equal(sanitized.flavorProfile.acidity, 100)
    assert.equal(sanitized.flavorProfile.sweetness, 0)
    assert.equal(sanitized.flavorProfile.bitterness, 43)
    assert.ok(!Number.isNaN(Date.parse(sanitized.brewedAt)))
  })

  it('calculates all 8 brew categories, 3 bean caffeine factors, and valid Atlas label offsets', () => {
    assert.equal(BREW_CALC_PRESETS.length, 8)
    assert.equal(BEAN_CAFFEINE_OPTIONS.length, 3)

    for (const preset of BREW_CALC_PRESETS) {
      const out = calculateBrewMetrics(preset.id, preset.defaultDose, preset.defaultSecond, 'arabica')
      assert.ok(out.primaryMetricValue.length > 0)
      assert.ok(out.secondaryMetricValue.length > 0)
      assert.ok(out.estCaffeineMg > 0)
      assert.ok(out.dailyPct >= 0 && out.dailyPct <= 100)
    }

    // Japanese Iced Pourover splits 60% hot water + 40% ice
    const iced = calculateBrewMetrics('iced-pourover', 16, 15, 'arabica')
    assert.equal(iced.primaryMetricValue, '144ml + 96g冰')
    assert.equal(iced.secondaryMetricValue, '32 ml')

    // Milk coffee classifies cup style cleanly
    const magic = calculateBrewMetrics('milk-coffee', 18, 120, 'arabica')
    assert.ok(magic.styleBadge.includes('Magic'))
    const latte = calculateBrewMetrics('milk-coffee', 18, 200, 'arabica')
    assert.ok(latte.styleBadge.includes('拿铁'))

    // Bean species caffeine ordering: robusta-blend > arabica > decaf
    const arabica = calculateBrewMetrics('moka-phin', 16, 7.5, 'arabica')
    const robusta = calculateBrewMetrics('moka-phin', 16, 7.5, 'robusta-blend')
    const decaf = calculateBrewMetrics('moka-phin', 16, 7.5, 'decaf')
    assert.ok(robusta.estCaffeineMg > arabica.estCaffeineMg)
    assert.ok(arabica.estCaffeineMg > decaf.estCaffeineMg * 10)

    // All 16 Atlas origins have valid collision-free label placement metadata
    for (const origin of COFFEE_ORIGINS) {
      assert.equal(typeof origin.labelDx, 'number')
      assert.equal(typeof origin.labelDy, 'number')
      assert.ok(['start', 'middle', 'end'].includes(origin.labelAnchor))
    }
  })
})

