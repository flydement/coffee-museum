import type { BrewMethod } from '../types/coffee'

interface IconProps {
  size?: number
  className?: string
}

export function MuseumLogoIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 9H16V14C16 17.038 13.538 19.5 10.5 19.5C7.462 19.5 5 17.038 5 14V9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M16 10.5H18.2C19.47 10.5 20.5 11.53 20.5 12.8C20.5 14.07 19.47 15.1 18.2 15.1H16"
        stroke="#C79355"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M4 21H17" stroke="#C79355" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M8.5 6.5C8.5 5.2 9.7 4.7 9.5 3.4M12 6.5C12 5.2 13.2 4.7 13 3.4"
        stroke="#C79355"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function CompassIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M15.4 8.6L13.5 13.5L8.6 15.4L10.5 10.5L15.4 8.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function GalleryIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9L12 4L21 9H3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M6 9V18M10 9V18M14 9V18M18 9V18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M3 19.5H21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function KettleIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 10H16L17.5 18.5H5.5L7 10Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M8.5 7.5H14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16.5 11.5H18.8C19.8 11.5 20.5 12.3 20.5 13.3V15C20.5 16 19.8 16.8 18.8 16.8H17.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.5 15.5C4.5 14.5 3.6 12.2 2.8 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function ArchiveIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 9.5H16M8 13.5H13.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="15.5" cy="14.5" r="1.5" fill="currentColor" />
    </svg>
  )
}

export function SoundIcon({ muted, size = 18 }: { muted: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 10V14H9L14 18V6L9 10H5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      {muted ? (
        <path d="M17.5 9.5L21 13M21 9.5L17.5 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      ) : (
        <path
          d="M17 9.2C18.2 10.6 18.2 13.4 17 14.8M19.5 7C21.6 9.6 21.6 14.4 19.5 17"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

export function CupEmblem({
  method,
  liquid,
  crema,
}: {
  method: BrewMethod
  liquid: string
  crema: string
}) {
  if (method === 'v60') {
    return (
      <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M10 9H30L23 20H17L10 9Z" stroke="#3E2A20" strokeWidth="1.8" fill="#FCF9F3" />
        <path d="M13 13H27L22.5 19.5H17.5L13 13Z" fill={liquid} opacity="0.85" />
        <path d="M14 21H26L29 32C29 33.7 27.7 35 26 35H14C12.3 35 11 33.7 11 32L14 21Z" stroke="#3E2A20" strokeWidth="1.8" fill="#FCF9F3" />
        <path d="M12.5 28H27.5L28.4 32C28.4 33.2 27.3 34 26 34H14C12.7 34 11.6 33.2 11.6 32L12.5 28Z" fill={liquid} />
        <line x1="20" y1="20" x2="20" y2="28" stroke={crema} strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  if (method === 'dirty' || method === 'coldbrew' || method === 'iced') {
    return (
      <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M12 8H28L26.2 33C26.1 34.2 25.1 35 24 35H16C14.9 35 13.9 34.2 13.8 33L12 8Z" stroke="#3E2A20" strokeWidth="1.8" fill="#FCF9F3" />
        <path d="M13.5 21H26.5L25.6 33C25.5 33.7 24.9 34.2 24.1 34.2H15.9C15.1 34.2 14.5 33.7 14.4 33L13.5 21Z" fill={crema} />
        <path d="M12.8 14H27.2L26.5 22.5H13.5L12.8 14Z" fill={liquid} opacity="0.92" />
        <rect x="16" y="16" width="5" height="5" rx="1" transform="rotate(12 16 16)" fill="#FFFFFF" fillOpacity="0.45" />
      </svg>
    )
  }

  if (method === 'moka') {
    return (
      <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M13 10H27L24.5 21H15.5L13 10Z" fill="#EFE7D8" stroke="#3E2A20" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M15.5 21H24.5L27.5 34H12.5L15.5 21Z" fill={crema} fillOpacity="0.45" stroke="#3E2A20" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M16 10L20 6L24 10" stroke="#3E2A20" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M26.5 12H30C31 12 31.5 13 31.2 14.5L29.5 19" stroke="#3E2A20" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M8 14H27V22C27 27.523 22.523 32 17 32C11.477 32 8 27.523 8 22V14Z" fill={liquid} stroke="#3E2A20" strokeWidth="1.8" />
      <ellipse cx="17.5" cy="14.5" rx="9" ry="2.8" fill={crema} stroke="#3E2A20" strokeWidth="1.3" />
      <path d="M27 16.5H30.2C32.2 16.5 33.5 18 33.5 20C33.5 22 32.2 23.5 30.2 23.5H27" stroke="#3E2A20" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 34.5H29" stroke="#B88446" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
