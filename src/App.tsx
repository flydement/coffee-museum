import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { FlavorCurator } from './components/FlavorCurator'
import { Header } from './components/Header'
import { COFFEE_EXHIBITS } from './data/coffees'
import type {
  AppView,
  CoffeeExhibit,
  FlavorPreference,
  MuseumTheme,
  SavedBrewRecord,
  TasteCustomizePreset,
} from './types/coffee'
import { setCafeAmbience, setSoundMuted } from './utils/platform'
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

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('curator')
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

  const [inspectedCoffee, setInspectedCoffee] = useState<CoffeeExhibit | null>(null)
  const [activeBrewCoffee, setActiveBrewCoffee] = useState<CoffeeExhibit>(COFFEE_EXHIBITS[0])
  const [activeServings, setActiveServings] = useState<number>(1)
  const [activeTastePreset, setActiveTastePreset] =
    useState<TasteCustomizePreset>('standard')
  const [hasActiveBrew, setHasActiveBrew] = useState<boolean>(false)

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

  const handleNavigate = (view: AppView) => {
    setActiveView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStartBrew = (
    coffee: CoffeeExhibit,
    servings = 1,
    tastePreset: TasteCustomizePreset = 'standard'
  ) => {
    setActiveBrewCoffee(coffee)
    setActiveServings(servings)
    setActiveTastePreset(tastePreset)
    setHasActiveBrew(true)
    handleNavigate('studio')
  }

  const handleInspectFromCurator = (coffee: CoffeeExhibit) => {
    setInspectedCoffee(coffee)
    handleNavigate('gallery')
  }

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
        onNavigate={handleNavigate}
        archiveCount={archive.length}
        hasActiveBrew={hasActiveBrew}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        ambienceOn={ambienceOn}
        onToggleAmbience={handleToggleAmbience}
        soundMuted={soundMuted}
        onToggleSoundMuted={handleToggleSoundMuted}
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

            {activeView === 'studio' && (
              <BrewStudio
                key={activeBrewCoffee.id}
                coffee={activeBrewCoffee}
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
            )}

            {activeView === 'atlas' && (
              <CoffeeAtlas
                onInspect={handleInspectFromCurator}
                onStartBrew={(c) => handleStartBrew(c, 1, 'standard')}
                bestQuizScore={bestQuizScore}
                onFinishQuiz={(score) => handleFinishQuiz(score)}
              />
            )}

            {activeView === 'archive' && (
              <TastingArchive
                records={archive}
                bestQuizScore={bestQuizScore}
                onDeleteRecord={handleDeleteRecord}
                onUpdateRecord={handleUpdateRecord}
                onImportRecords={handleImportRecords}
                onRebrew={handleStartBrew}
                onGoCurator={() => handleNavigate('curator')}
              />
            )}
          </Suspense>
        </ErrorBoundary>
      </main>

      <footer className="museum-footer">
        <div className="museum-footer-inner">
          <span>拾光咖啡博物馆 · Atelier Café Museum {APP_VERSION}</span>
          <span>一套代码跨端架构：Web / PWA · PC (Electron) · Mobile (Capacitor)</span>
        </div>
      </footer>
    </div>
  )
}
