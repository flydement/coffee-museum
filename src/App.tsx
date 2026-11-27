import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { FlavorCurator } from './components/FlavorCurator'
import { Header } from './components/Header'
import { QuickFinder } from './components/QuickFinder'
import { COFFEE_EXHIBITS } from './data/coffees'
import type {
  AppView,
  AtlasSection,
  CoffeeExhibit,
  FlavorPreference,
  FlavorProfile,
  MuseumTheme,
  SavedBrewRecord,
  TasteCustomizePreset,
} from './types/coffee'
import { setCafeAmbience, setSoundMuted } from './utils/platform'
import { buildMuseumHash, parseMuseumHash } from './utils/router'
import { APP_VERSION } from './utils/version'

const MuseumGallery = lazy(() =>
  import('./components/MuseumGallery').then((m) => ({ default: m.MuseumGallery }))
)
const BrewStudio = lazy(() =>
  import('./components/BrewStudio').then((m) => ({ default: m.BrewStudio }))
)
const CoffeeAtlas = lazy(() =>
  import('./components/CoffeeAtlas').then((m) => ({ default: m.CoffeeAtlas }))
)
const TastingArchive = lazy(() =>
  import('./components/TastingArchive').then((m) => ({ default: m.TastingArchive }))
)

const ARCHIVE_STORAGE_KEY = 'atelier_coffee_museum_archive_v1'
const WISHLIST_STORAGE_KEY = 'atelier_coffee_museum_wishlist_v1'
const THEME_STORAGE_KEY = 'atelier_coffee_museum_theme_v1'
const QUIZ_BEST_STORAGE_KEY = 'atelier_coffee_museum_quiz_best_v1'
const MUTE_STORAGE_KEY = 'atelier_coffee_museum_muted_v1'

function loadArchive(): SavedBrewRecord[] {
  try {
    const raw = window.localStorage.getItem(ARCHIVE_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function loadWishlist(): string[] {
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function loadTheme(): MuseumTheme {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
    return raw === 'kissaten' ? 'kissaten' : 'daylight'
  } catch {
    return 'daylight'
  }
}

function loadQuizBest(): number {
  try {
    const raw = Number(window.localStorage.getItem(QUIZ_BEST_STORAGE_KEY))
    return Number.isFinite(raw) && raw > 0 ? raw : 0
  } catch {
    return 0
  }
}

function loadSoundMuted(): boolean {
  try {
    return window.localStorage.getItem(MUTE_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function resolveInitialRoute() {
  if (typeof window === 'undefined') {
    return parseMuseumHash('', COFFEE_EXHIBITS)
  }
  return parseMuseumHash(window.location.hash, COFFEE_EXHIBITS)
}

export default function App() {
  const [initialRoute] = useState(() => resolveInitialRoute())
  const isPoppingHistoryRef = useRef(false)
  const hasSyncedInitialHashRef = useRef(false)

  const [activeView, setActiveView] = useState<AppView>(initialRoute.view)
  const [atlasSection, setAtlasSection] = useState<AtlasSection>(
    initialRoute.atlasSection ?? 'map'
  )
  const [studioMounted, setStudioMounted] = useState<boolean>(
    initialRoute.view === 'studio'
  )
  const [brewSessionId, setBrewSessionId] = useState<number>(0)
  const [quickFinderOpen, setQuickFinderOpen] = useState(false)

  const [theme, setTheme] = useState<MuseumTheme>(() => loadTheme())
  const [ambienceOn, setAmbienceOn] = useState(false)
  const [soundMuted, setSoundMutedState] = useState<boolean>(() => loadSoundMuted())

  const [preference, setPreference] = useState<FlavorPreference>({
    style: 'all',
    temperature: 'all',
    acidity: 55,
    sweetness: 80,
    body: 65,
    bitterness: 40,
    selectedMoods: [],
  })

  const [inspectedCoffee, setInspectedCoffee] = useState<CoffeeExhibit | null>(() =>
    initialRoute.exhibitId
      ? COFFEE_EXHIBITS.find((c) => c.id === initialRoute.exhibitId) ?? null
      : null
  )
  const [activeBrewCoffee, setActiveBrewCoffee] = useState<CoffeeExhibit>(() =>
    initialRoute.brewCoffeeId
      ? COFFEE_EXHIBITS.find((c) => c.id === initialRoute.brewCoffeeId) ?? COFFEE_EXHIBITS[0]
      : COFFEE_EXHIBITS[0]
  )
  const [activeServings, setActiveServings] = useState<number>(1)
  const [activeTastePreset, setActiveTastePreset] =
    useState<TasteCustomizePreset>('standard')
  const [hasActiveBrew, setHasActiveBrew] = useState<boolean>(
    Boolean(initialRoute.brewCoffeeId)
  )

  const [archive, setArchive] = useState<SavedBrewRecord[]>(() => loadArchive())
  const [wishlist, setWishlist] = useState<string[]>(() => loadWishlist())
  const [bestQuizScore, setBestQuizScore] = useState<number>(() => loadQuizBest())

  useEffect(() => {
    try {
      window.localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(archive))
    } catch {
      // Ignore storage quota errors
    }
  }, [archive])

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist))
    } catch {
      // Ignore storage quota errors
    }
  }, [wishlist])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'kissaten' ? '#18110D' : '#F6F1E7')
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Ignore storage quota errors
    }
  }, [theme])

  useEffect(() => {
    setSoundMuted(soundMuted)
    try {
      window.localStorage.setItem(MUTE_STORAGE_KEY, String(soundMuted))
    } catch {
      // Ignore storage quota errors
    }
  }, [soundMuted])

  useEffect(() => {
    return () => {
      setCafeAmbience(false)
    }
  }, [])

  // Sync active museum route to browser history for deep-linking & native Android/browser Back gesture
  useEffect(() => {
    const nextHash = buildMuseumHash({
      view: activeView,
      exhibitId: activeView === 'gallery' ? inspectedCoffee?.id : undefined,
      brewCoffeeId: activeView === 'studio' ? activeBrewCoffee.id : undefined,
      atlasSection: activeView === 'atlas' ? atlasSection : undefined,
    })
    if (!hasSyncedInitialHashRef.current) {
      hasSyncedInitialHashRef.current = true
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, '', nextHash)
      }
      return
    }
    if (isPoppingHistoryRef.current) {
      isPoppingHistoryRef.current = false
      return
    }
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash)
    }
  }, [activeBrewCoffee.id, activeView, atlasSection, inspectedCoffee?.id])

  // Support browser Back/Forward, Android swipe-back, and external hash changes
  useEffect(() => {
    const syncFromLocationHash = () => {
      isPoppingHistoryRef.current = true
      const parsed = parseMuseumHash(window.location.hash, COFFEE_EXHIBITS)
      setActiveView(parsed.view)
      if (parsed.view === 'studio') {
        setStudioMounted(true)
        if (parsed.brewCoffeeId) {
          const match = COFFEE_EXHIBITS.find((c) => c.id === parsed.brewCoffeeId)
          if (match) {
            setActiveBrewCoffee(match)
            setHasActiveBrew(true)
          }
        }
      }
      if (parsed.view === 'gallery') {
        const match = parsed.exhibitId
          ? COFFEE_EXHIBITS.find((c) => c.id === parsed.exhibitId) ?? null
          : null
        setInspectedCoffee(match)
      } else {
        setInspectedCoffee(null)
      }
      if (parsed.view === 'atlas' && parsed.atlasSection) {
        setAtlasSection(parsed.atlasSection)
      }
    }
    window.addEventListener('hashchange', syncFromLocationHash)
    window.addEventListener('popstate', syncFromLocationHash)
    return () => {
      window.removeEventListener('hashchange', syncFromLocationHash)
      window.removeEventListener('popstate', syncFromLocationHash)
    }
  }, [])

  // Global Quick Finder shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setQuickFinderOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const unlockedIds = useMemo(
    () => new Set(archive.map((rec) => rec.coffeeId)),
    [archive]
  )

  const wishlistIds = useMemo(() => new Set(wishlist), [wishlist])

  const handleToggleWishlist = (coffeeId: string) => {
    setWishlist((prev) =>
      prev.includes(coffeeId) ? prev.filter((id) => id !== coffeeId) : [...prev, coffeeId]
    )
  }

  const handleToggleAmbience = () => {
    const next = !ambienceOn
    const actual = setCafeAmbience(next)
    setAmbienceOn(actual)
  }

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'daylight' ? 'kissaten' : 'daylight'))
  }

  const handleToggleSoundMuted = () => {
    setSoundMutedState((prev) => !prev)
  }

  const handleNavigate = useCallback((view: AppView, nextAtlasSection?: AtlasSection) => {
    setActiveView(view)
    if (view === 'studio') setStudioMounted(true)
    if (view === 'atlas' && nextAtlasSection) {
      setAtlasSection(nextAtlasSection)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleStartBrew = useCallback(
    (
      coffee: CoffeeExhibit,
      servings = 1,
      tastePreset: TasteCustomizePreset = 'standard'
    ) => {
      setActiveBrewCoffee(coffee)
      setActiveServings(servings)
      setActiveTastePreset(tastePreset)
      setHasActiveBrew(true)
      setStudioMounted(true)
      setBrewSessionId((id) => id + 1)
      handleNavigate('studio')
    },
    [handleNavigate]
  )

  const handleInspectFromCurator = useCallback(
    (coffee: CoffeeExhibit) => {
      setInspectedCoffee(coffee)
      handleNavigate('gallery')
    },
    [handleNavigate]
  )

  const handleApplyFlavorPortrait = useCallback(
    (profile: FlavorProfile) => {
      setPreference({
        style: 'all',
        temperature: 'all',
        acidity: profile.acidity,
        sweetness: profile.sweetness,
        body: profile.body,
        bitterness: profile.bitterness,
        selectedMoods: [],
      })
      handleNavigate('curator')
    },
    [handleNavigate]
  )

  const handleSaveArchive = (record: SavedBrewRecord) => {
    setArchive((prev) => [record, ...prev])
  }

  const handleDeleteRecord = (recordId: string) => {
    setArchive((prev) => prev.filter((r) => r.recordId !== recordId))
  }

  const handleUpdateRecord = (
    recordId: string,
    updates: { rating: number; tastingNote: string }
  ) => {
    setArchive((prev) =>
      prev.map((rec) =>
        rec.recordId === recordId
          ? { ...rec, rating: updates.rating, tastingNote: updates.tastingNote }
          : rec
      )
    )
  }

  const handleImportRecords = (incoming: SavedBrewRecord[]) => {
    const existingIds = new Set(archive.map((r) => r.recordId))
    const newOnes = incoming.filter((r) => !existingIds.has(r.recordId))
    if (newOnes.length > 0) {
      setArchive((prev) => [...newOnes, ...prev])
    }
    return {
      added: newOnes.length,
      skipped: incoming.length - newOnes.length,
    }
  }

  const handleFinishQuiz = (score: number) => {
    setBestQuizScore((prev) => {
      const next = Math.max(prev, score)
      try {
        window.localStorage.setItem(QUIZ_BEST_STORAGE_KEY, String(next))
      } catch {
        // Ignore storage errors
      }
      return next
    })
  }

  return (
    <div className="app-shell">
      <Header
        activeView={activeView}
        onNavigate={(view) => handleNavigate(view)}
        archiveCount={archive.length}
        hasActiveBrew={hasActiveBrew}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        ambienceOn={ambienceOn}
        onToggleAmbience={handleToggleAmbience}
        soundMuted={soundMuted}
        onToggleSoundMuted={handleToggleSoundMuted}
        onOpenQuickFinder={() => setQuickFinderOpen(true)}
      />

      <main className="main-content">
        <ErrorBoundary onResetHome={() => handleNavigate('curator')}>
          <Suspense
            fallback={
              <div
                style={{
                  padding: '64px 20px',
                  textAlign: 'center',
                  color: 'var(--espresso-600)',
                  fontFamily: 'var(--font-serif)',
                }}
              >
                正在布置展厅…
              </div>
            }
          >
            {activeView === 'curator' && (
              <FlavorCurator
                preference={preference}
                onChangePreference={setPreference}
                onSelectInspect={handleInspectFromCurator}
                onStartBrew={(c) => handleStartBrew(c, 1, 'standard')}
                onOpenGallery={() => handleNavigate('gallery')}
                archiveCount={archive.length}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
              />
            )}

            {activeView === 'gallery' && (
              <MuseumGallery
                inspectedCoffee={inspectedCoffee}
                onInspect={setInspectedCoffee}
                onStartBrew={handleStartBrew}
                unlockedIds={unlockedIds}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
              />
            )}

            {studioMounted && (
              <div hidden={activeView !== 'studio'}>
                <BrewStudio
                  key={`${activeBrewCoffee.id}-${brewSessionId}`}
                  coffee={activeBrewCoffee}
                  isActive={activeView === 'studio'}
                  servings={activeServings}
                  tastePreset={activeTastePreset}
                  soundMuted={soundMuted}
                  onToggleSoundMuted={handleToggleSoundMuted}
                  onChangeCoffee={(c) => {
                    setActiveBrewCoffee(c)
                    setHasActiveBrew(true)
                  }}
                  onChangeServings={setActiveServings}
                  onChangeTastePreset={setActiveTastePreset}
                  onSaveToArchive={handleSaveArchive}
                  onBrewComplete={() => setHasActiveBrew(false)}
                  onBrewRestart={() => setHasActiveBrew(true)}
                  onGoArchive={() => handleNavigate('archive')}
                  existingCount={archive.length}
                />
              </div>
            )}

            {activeView === 'atlas' && (
              <CoffeeAtlas
                onInspect={handleInspectFromCurator}
                onStartBrew={(c) => handleStartBrew(c, 1, 'standard')}
                bestQuizScore={bestQuizScore}
                onFinishQuiz={(score) => handleFinishQuiz(score)}
                activeSection={atlasSection}
                onChangeSection={setAtlasSection}
              />
            )}

            {activeView === 'archive' && (
              <TastingArchive
                records={archive}
                wishlistIds={wishlistIds}
                bestQuizScore={bestQuizScore}
                onDeleteRecord={handleDeleteRecord}
                onUpdateRecord={handleUpdateRecord}
                onImportRecords={handleImportRecords}
                onToggleWishlist={handleToggleWishlist}
                onInspectCoffee={handleInspectFromCurator}
                onApplyFlavorPortrait={handleApplyFlavorPortrait}
                onRebrew={handleStartBrew}
                onGoCurator={() => handleNavigate('curator')}
              />
            )}
          </Suspense>
        </ErrorBoundary>
      </main>

      <QuickFinder
        open={quickFinderOpen}
        onClose={() => setQuickFinderOpen(false)}
        onNavigateView={handleNavigate}
        onInspectCoffee={handleInspectFromCurator}
        onStartBrew={(c) => handleStartBrew(c, 1, 'standard')}
      />

      <footer className="museum-footer">
        <div className="museum-footer-inner">
          <span>拾光咖啡博物馆 · Atelier Café Museum {APP_VERSION}</span>
          <span>一套代码跨端架构：Web / PWA · PC (Electron) · Mobile (Capacitor)</span>
        </div>
      </footer>
    </div>
  )
}
