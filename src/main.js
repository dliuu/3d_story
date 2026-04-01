import './styles/main.css'
import { Experience } from './Experience.js'

const canvas = document.querySelector('#webgl')
canvas?.setAttribute('tabindex', '0')

const experience = new Experience(canvas)

canvas?.addEventListener('pointerdown', () => canvas.focus(), { once: true })

const audioToggle = document.getElementById('audio-toggle')
if (audioToggle) {
  audioToggle.addEventListener('click', async () => {
    await experience.audioController.toggle()
    audioToggle.classList.toggle('playing', experience.audioController.isPlaying)
    audioToggle.setAttribute(
      'aria-label',
      experience.audioController.isPlaying ? 'Pause music' : 'Play music'
    )
  })
}

const arrowPrev = document.getElementById('arrow-prev')
const arrowNext = document.getElementById('arrow-next')
const goRelative = (delta) => {
  const current = experience.floorTracker.activeFloorIndex ?? 0
  const max = 4
  const next = Math.min(max, Math.max(0, current + delta))
  if (next === current) return
  const target = max > 0 ? next / max : 0
  experience.scroll.goTo(target)
}

arrowPrev?.addEventListener('click', () => goRelative(-1))
arrowNext?.addEventListener('click', () => goRelative(1))

document.querySelector('.inv-rsvp-btn')?.addEventListener('click', (e) => {
  e.preventDefault()
  const el = e.currentTarget
  const url = el?.dataset?.rsvpUrl
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
    return
  }
  window.location.href =
    'mailto:hello@example.com?subject=Wedding%20RSVP%20%E2%80%94%20Owen%20%26%20Yilin'
})

if (import.meta.env.DEV) {
  window.experience = experience
}
