import { useEffect, useMemo, useState } from 'react'
import { BrewStudio } from './components/BrewStudio'
import { FlavorCurator } from './components/FlavorCurator'
import { Header } from './components/Header'
import { MuseumGallery } from './components/MuseumGallery'
import { TastingArchive } from './components/TastingArchive'
import { COFFEE_EXHIBITS } from './data/coffees'
import type {
  AppView,
  CoffeeExhibit,
  FlavorPreference,
  MuseumTheme,
  SavedBrewRecord,
  TasteCustomizePreset,
} from './types/coffee'
import { setCafeAmbience } from './utils/platform'

const ARCHIVE_STORAGE_KEY = 'atelier_coffee_museum_archive_v1'
const WISHLIST_STORAGE_KEY = 'atelier_coffee_museum_wishlist_v1'
const THEME_STORAGE_KEY = 'atelier_coffee_museum_theme_v1'

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

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('curator')
  const [theme, setTheme] = useState<MuseumTheme>(() => loadTheme())
  const [ambienceOn, setAmbienceOn] = useState(false)

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

  const handleImportRecords = (incoming: SavedBrewRecord[]) => {
    setArchive((prev) => {
      const existingIds = new Set(prev.map((r) => r.recordId))
      const newOnes = incoming.filter((r) => !existingIds.has(r.recordId))
      return [...newOnes, ...prev]
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
      />

      <main className="main-content">
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
            onChangeCoffee={(c) => {
              setActiveBrewCoffee(c)
              setHasActiveBrew(true)
            }}
            onChangeServings={setActiveServings}
            onChangeTastePreset={setActiveTastePreset}
            onSaveToArchive={handleSaveArchive}
            onGoArchive={() => handleNavigate('archive')}
            existingCount={archive.length}
          />
        )}

        {activeView === 'archive' && (
          <TastingArchive
            records={archive}
            onDeleteRecord={handleDeleteRecord}
            onImportRecords={handleImportRecords}
            onRebrew={handleStartBrew}
            onGoCurator={() => handleNavigate('curator')}
          />
        )}
      </main>

      <footer className="museum-footer">
        <div className="museum-footer-inner">
          <span>拾光咖啡博物馆 · Atelier Café Museum v3.0</span>
          <span>一套代码跨端架构：Web / PWA · PC (Electron) · Mobile (Capacitor)</span>
        </div>
      </footer>
    </div>
  )
}
