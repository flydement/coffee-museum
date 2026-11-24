import type { AppView, MuseumTheme } from '../types/coffee'
import { detectRuntimePlatform } from '../utils/platform'
import {
  AmbienceIcon,
  ArchiveIcon,
  AtlasIcon,
  CompassIcon,
  GalleryIcon,
  KettleIcon,
  MuseumLogoIcon,
  ThemeLampIcon,
} from './Icons'

interface HeaderProps {
  activeView: AppView
  onNavigate: (view: AppView) => void
  archiveCount: number
  hasActiveBrew: boolean
  theme: MuseumTheme
  onToggleTheme: () => void
  ambienceOn: boolean
  onToggleAmbience: () => void
}

const NAV_ITEMS: { id: AppView; label: string; shortLabel: string }[] = [
  { id: 'curator', label: '风味策展台', shortLabel: '选口味' },
  { id: 'gallery', label: '馆藏展厅', shortLabel: '展厅' },
  { id: 'studio', label: '冲煮工坊', shortLabel: '冲煮' },
  { id: 'atlas', label: '风味博物', shortLabel: '博物' },
  { id: 'archive', label: '我的馆藏', shortLabel: '馆藏' },
]

export function Header({
  activeView,
  onNavigate,
  archiveCount,
  hasActiveBrew,
  theme,
  onToggleTheme,
  ambienceOn,
  onToggleAmbience,
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
      case 'atlas':
        return <AtlasIcon size={18} />
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

          <div className="header-right-actions">
            <button
              id="header-ambience-btn"
              type="button"
              className={`icon-pill-btn ${ambienceOn ? 'active' : ''}`}
              onClick={onToggleAmbience}
              title="开启/关闭雨夜吃茶馆环境白噪音"
            >
              <AmbienceIcon active={ambienceOn} size={16} />
              <span className="hide-mobile-label">
                {ambienceOn ? '雨夜声景中' : '馆内声景'}
              </span>
            </button>

            <button
              id="header-theme-btn"
              type="button"
              className={`icon-pill-btn ${theme === 'kissaten' ? 'active' : ''}`}
              onClick={onToggleTheme}
              title={theme === 'kissaten' ? '切换至日间暖白展厅' : '切换至深夜吃茶馆暖暗模式'}
            >
              <ThemeLampIcon dark={theme === 'kissaten'} size={16} />
              <span className="hide-mobile-label">
                {theme === 'kissaten' ? '日间展馆' : '深夜吃茶'}
              </span>
            </button>

            <div className="platform-chip" title={platform.hint}>
              <span className="platform-dot" />
              <span>{platform.label}</span>
            </div>
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
