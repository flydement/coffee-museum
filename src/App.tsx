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
  SavedBrewRecord,
} from './types/coffee'

const ARCHIVE_STORAGE_KEY = 'atelier_coffee_museum_archive_v1'

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

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('curator')
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
  const [hasActiveBrew, setHasActiveBrew] = useState<boolean>(false)
  const [archive, setArchive] = useState<SavedBrewRecord[]>(() => loadArchive())

  useEffect(() => {
    try {
      window.localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(archive))
    } catch {
      // Ignore storage quota errors
    }
  }, [archive])

  const unlockedIds = useMemo(
    () => new Set(archive.map((rec) => rec.coffeeId)),
    [archive]
  )

  const handleNavigate = (view: AppView) => {
    setActiveView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStartBrew = (coffee: CoffeeExhibit, servings = 1) => {
    setActiveBrewCoffee(coffee)
    setActiveServings(servings)
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

  return (
    <div className="app-shell">
      <Header
        activeView={activeView}
        onNavigate={handleNavigate}
        archiveCount={archive.length}
        hasActiveBrew={hasActiveBrew}
      />

      <main className="main-content">
        {activeView === 'curator' && (
          <FlavorCurator
            preference={preference}
            onChangePreference={setPreference}
            onSelectInspect={handleInspectFromCurator}
            onStartBrew={(c) => handleStartBrew(c, 1)}
            onOpenGallery={() => handleNavigate('gallery')}
            archiveCount={archive.length}
          />
        )}

        {activeView === 'gallery' && (
          <MuseumGallery
            inspectedCoffee={inspectedCoffee}
            onInspect={setInspectedCoffee}
            onStartBrew={handleStartBrew}
            unlockedIds={unlockedIds}
          />
        )}

        {activeView === 'studio' && (
          <BrewStudio
            key={activeBrewCoffee.id}
            coffee={activeBrewCoffee}
            servings={activeServings}
            onChangeCoffee={(c) => {
              setActiveBrewCoffee(c)
              setHasActiveBrew(true)
            }}
            onChangeServings={setActiveServings}
            onSaveToArchive={handleSaveArchive}
            onGoArchive={() => handleNavigate('archive')}
            existingCount={archive.length}
          />
        )}

        {activeView === 'archive' && (
          <TastingArchive
            records={archive}
            onDeleteRecord={handleDeleteRecord}
            onRebrew={handleStartBrew}
            onGoCurator={() => handleNavigate('curator')}
          />
        )}
      </main>

      <footer className="museum-footer">
        <div className="museum-footer-inner">
          <span>拾光咖啡博物馆 · Atelier Café Museum</span>
          <span>一套代码跨端架构：Web / PWA · PC (Electron) · Mobile (Capacitor)</span>
        </div>
      </footer>
    </div>
  )
}
