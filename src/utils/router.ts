import type { AppView, AtlasSection, CoffeeExhibit } from '../types/coffee'

export interface MuseumRoute {
  view: AppView
  exhibitId?: string
  brewCoffeeId?: string
  atlasSection?: AtlasSection
}

const VALID_VIEWS = new Set<AppView>(['curator', 'gallery', 'studio', 'atlas', 'archive'])
const VALID_ATLAS_SECTIONS = new Set<AtlasSection>([
  'map',
  'wheel',
  'craft',
  'troubleshoot',
  'quiz',
])

export function parseMuseumHash(
  rawHash: string,
  exhibits: readonly CoffeeExhibit[]
): MuseumRoute {
  const cleaned = rawHash.replace(/^#\/?/, '').trim()
  if (!cleaned) return { view: 'curator' }

  const [headRaw, paramRaw] = cleaned.split('/')
  const head = decodeURIComponent(headRaw || '').toLowerCase()
  const param = paramRaw ? decodeURIComponent(paramRaw).trim() : undefined

  const hasExhibit = (id?: string) =>
    Boolean(id && exhibits.some((item) => item.id === id))

  if (head === 'exhibit') {
    return hasExhibit(param)
      ? { view: 'gallery', exhibitId: param }
      : { view: 'gallery' }
  }

  if (head === 'studio') {
    return hasExhibit(param)
      ? { view: 'studio', brewCoffeeId: param }
      : { view: 'studio' }
  }

  if (head === 'atlas') {
    if (param && VALID_ATLAS_SECTIONS.has(param as AtlasSection)) {
      return { view: 'atlas', atlasSection: param as AtlasSection }
    }
    return { view: 'atlas', atlasSection: 'map' }
  }

  if (VALID_VIEWS.has(head as AppView)) {
    return { view: head as AppView }
  }

  return { view: 'curator' }
}

export function buildMuseumHash(route: MuseumRoute): string {
  if (route.view === 'gallery' && route.exhibitId) {
    return `#exhibit/${encodeURIComponent(route.exhibitId)}`
  }
  if (route.view === 'studio' && route.brewCoffeeId) {
    return `#studio/${encodeURIComponent(route.brewCoffeeId)}`
  }
  if (route.view === 'atlas' && route.atlasSection && route.atlasSection !== 'map') {
    return `#atlas/${encodeURIComponent(route.atlasSection)}`
  }
  return `#${route.view}`
}

export function buildShareUrl(route: MuseumRoute): string {
  const hash = buildMuseumHash(route)
  if (typeof window === 'undefined') return hash
  const base = `${window.location.origin}${window.location.pathname}`
  return `${base}${hash}`
}
