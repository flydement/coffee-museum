import type { AppView } from '../types/coffee'
import { detectRuntimePlatform } from '../utils/platform'
import {
  ArchiveIcon,
  CompassIcon,
  GalleryIcon,
  KettleIcon,
  MuseumLogoIcon,
} from './Icons'

interface HeaderProps {
  activeView: AppView
  onNavigate: (view: AppView) => void
  archiveCount: number
  hasActiveBrew: boolean
}

const NAV_ITEMS: { id: AppView; label: string; shortLabel: string }[] = [
  { id: 'curator', label: '风味策展台', shortLabel: '选口味' },
  { id: 'gallery', label: '馆藏展厅', shortLabel: '展厅' },
  { id: 'studio', label: '冲煮工坊', shortLabel: '冲煮' },
  { id: 'archive', label: '我的馆藏', shortLabel: '馆藏' },
]

export function Header({
  activeView,
  onNavigate,
  archiveCount,
  hasActiveBrew,
}: HeaderProps) {
  const platform = detectRuntimePlatform()

  const renderIcon = (id: AppView) => {
    switch (id) {
      case 'curator':
        return <CompassIcon size={18} />
      case 'gallery':
        return <GalleryIcon size={18} />
      case 'studio':
        return <KettleIcon size={18} />
      case 'archive':
        return <ArchiveIcon size={18} />
    }
  }

  return (
    <>
      <header className="masthead">
        <div className="masthead-inner">
          <button
            id="brand-home-btn"
            type="button"
            className="brand-mark"
            onClick={() => onNavigate('curator')}
          >
            <span className="brand-emblem">
              <MuseumLogoIcon size={22} />
            </span>
            <span>
              <span className="brand-title">拾光咖啡博物馆</span>
              <span className="brand-subtitle">Atelier Café Museum</span>
            </span>
          </button>

          <nav className="desktop-nav" aria-label="主导航">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                id={`nav-desktop-${item.id}`}
                type="button"
                className={`nav-tab ${activeView === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                {renderIcon(item.id)}
                <span>{item.label}</span>
                {item.id === 'archive' && archiveCount > 0 && (
                  <span className="nav-badge-count">{archiveCount}</span>
                )}
                {item.id === 'studio' && hasActiveBrew && activeView !== 'studio' && (
                  <span className="nav-badge-count">进行中</span>
                )}
              </button>
            ))}
          </nav>

          <div className="platform-chip" title={platform.hint}>
            <span className="platform-dot" />
            <span>{platform.label}</span>
          </div>
        </div>
      </header>

      <nav className="mobile-dock" aria-label="移动端底部导航">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            id={`nav-mobile-${item.id}`}
            type="button"
            className={`mobile-dock-btn ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            {renderIcon(item.id)}
            <span>
              {item.shortLabel}
              {item.id === 'archive' && archiveCount > 0 ? ` (${archiveCount})` : ''}
            </span>
          </button>
        ))}
      </nav>
    </>
  )
}
