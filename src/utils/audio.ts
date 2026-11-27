// Zero-dependency procedural Web Audio engine for Café Ambience & Brewing Cues

let sharedCtx: AudioContext | null = null
let globalSoundMuted = false
let ambienceNodes: {
  source: AudioBufferSourceNode
  gain: GainNode
  crackleTimer: number
} | null = null

export function setSoundMuted(muted: boolean) {
  globalSoundMuted = muted
}

export function isSoundMuted(): boolean {
  return globalSoundMuted
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return null
  if (!sharedCtx) {
    sharedCtx = new AudioCtx()
  }
  if (sharedCtx.state === 'suspended') {
    void sharedCtx.resume()
  }
  return sharedCtx
}

export function playGentleChime(
  type: 'step' | 'complete' | 'tick' | 'countdown' = 'step'
) {
  if (globalSoundMuted) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    if (type === 'tick' || type === 'countdown') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type === 'countdown' ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(type === 'countdown' ? 987.77 : 720, now)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(type === 'countdown' ? 0.042 : 0.028, now + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (type === 'countdown' ? 0.13 : 0.08))
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + (type === 'countdown' ? 0.14 : 0.09))
      return
    }

    const notes =
      type === 'complete' ? [523.25, 659.25, 783.99, 1046.5] : [587.33, 880]

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.14)

      gain.gain.setValueAtTime(0.0001, now + idx * 0.14)
      gain.gain.exponentialRampToValueAtTime(0.085, now + idx * 0.14 + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 0.56)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + idx * 0.14)
      osc.stop(now + idx * 0.14 + 0.62)
    })
  } catch {
    // Ignore autoplay blocks
  }
}

/**
 * Toggle synthesized "Rainy Kissaten & Warm Vinyl" ambient café soundscape.
 * Uses pure Web Audio brown/pink filtered noise + soft vinyl warmth — 0 KB network cost.
 */
export function setCafeAmbience(enabled: boolean): boolean {
  try {
    if (!enabled) {
      if (ambienceNodes) {
        const { source, gain, crackleTimer } = ambienceNodes
        window.clearInterval(crackleTimer)
        const ctx = sharedCtx
        if (ctx) {
          gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.25)
          window.setTimeout(() => {
            try {
              source.stop()
              source.disconnect()
            } catch {
              // ignore
            }
          }, 400)
        }
        ambienceNodes = null
      }
      return false
    }

    if (ambienceNodes) return true
    const ctx = getAudioContext()
    if (!ctx) return false

    // Generate 4-second looping warm brown noise buffer (gentle rain outside window)
    const bufferSize = ctx.sampleRate * 4
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      data[i] = (lastOut + 0.022 * white) / 1.022
      lastOut = data[i]
      data[i] *= 2.4
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 680

    const highpass = ctx.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = 110

    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime)
    masterGain.gain.linearRampToValueAtTime(0.055, ctx.currentTime + 0.8)

    source.connect(highpass)
    highpass.connect(lowpass)
    lowpass.connect(masterGain)
    masterGain.connect(ctx.destination)
    source.start()

    // Subtle occasional vinyl/hearth warmth pop
    const crackleTimer = window.setInterval(() => {
      if (!sharedCtx || sharedCtx.state !== 'running') return
      if (Math.random() > 0.55) return
      const now = sharedCtx.currentTime
      const osc = sharedCtx.createOscillator()
      const g = sharedCtx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1400 + Math.random() * 1200, now)
      g.gain.setValueAtTime(0.004, now)
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.025)
      osc.connect(g)
      g.connect(sharedCtx.destination)
      osc.start(now)
      osc.stop(now + 0.03)
    }, 650)

    ambienceNodes = { source, gain: masterGain, crackleTimer }
    return true
  } catch {
    return false
  }
}

/**
 * Optional hands-free Mandarin voice announcer using native Web Speech API.
 * Gracefully no-ops when unsupported by the runtime.
 */
export function speakBrewPrompt(text: string) {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'zh-CN'
    utter.rate = 1.02
    utter.pitch = 1.0
    utter.volume = 0.88
    window.speechSynthesis.speak(utter)
  } catch {
    // Ignore speech synthesis errors
  }
}

export function stopBrewSpeech() {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  } catch {
    // Ignore
  }
}
