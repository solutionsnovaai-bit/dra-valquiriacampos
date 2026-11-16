import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const revealEase = [.22, 1, .36, 1] as const
const exitEase = [.76, 0, .24, 1] as const
const replayKey = 'vc-intro-assinatura'
const endOfDrawing = 1.66
const exitDuration = .68

const strokes = [
  {
    "d": "M49 9 A39 39 0 0 0 10 48",
    "delay": 0.05,
    "duration": 0.56
  },
  {
    "d": "M10 48 A39 39 0 0 0 49 87 A39 39 0 0 0 88 48 A39 39 0 0 0 49 9",
    "delay": 0.33,
    "duration": 0.78
  },
  {
    "d": "M23 32 H30 L44 63 L59 32 H66",
    "delay": 0.24,
    "duration": 0.69
  },
  {
    "d": "M72 39 C67 33 60 34 55 38 C48 43 48 55 54 60 C59 65 67 65 74 57",
    "delay": 0.65,
    "duration": 0.64
  }
] as const

function hasSeenIntro() {
  try { return sessionStorage.getItem(replayKey) === '1' }
  catch { return false }
}

function rememberIntro() {
  try { sessionStorage.setItem(replayKey, '1') }
  catch { /* Session storage can be unavailable in private browsing. */ }
}

type Flight = { x: number; y: number; scale: number }

export function BrandIntro({ active, onFinished, heroDesktop, heroMobile }: {
  active: boolean
  onFinished: () => void
  heroDesktop: string
  heroMobile: string
}) {
  const reduced = useReducedMotion()
  const mark = useRef<SVGSVGElement>(null)
  const [tempo] = useState(() => hasSeenIntro() ? .68 : 1)
  const [flight, setFlight] = useState<Flight | null>(null)
  const opening = flight !== null

  useEffect(() => {
    if (!active) return
    if (reduced) {
      onFinished()
      return
    }

    let disposed = false
    const timers: number[] = []
    const wait = (ms: number) => new Promise<void>(resolve => {
      timers.push(window.setTimeout(resolve, ms))
    })

    function skip(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        rememberIntro()
        onFinished()
      }
    }
    window.addEventListener('keydown', skip)

    async function start() {
      const hero = new Image()
      hero.src = window.matchMedia('(max-width: 900px)').matches ? heroMobile : heroDesktop
      await Promise.all([
        wait(endOfDrawing * tempo * 1000),
        Promise.race([hero.decode().catch(() => undefined), wait(2250)]),
      ])
      if (disposed) return

      const art = mark.current?.getBoundingClientRect()
      const destination = document.querySelector('.mp-brand-flight-target')?.getBoundingClientRect()
      if (art && art.width > 0 && destination && destination.width > 0) {
        setFlight({
          x: destination.left + destination.width / 2 - (art.left + art.width / 2),
          y: destination.top + destination.height / 2 - (art.top + art.height / 2),
          scale: destination.width / (art.width),
        })
      } else {
        setFlight({ x: 0, y: -18, scale: .96 })
      }
      await wait(exitDuration * 1000)
      if (disposed) return
      rememberIntro()
      onFinished()
    }

    void start()
    return () => {
      disposed = true
      window.removeEventListener('keydown', skip)
      timers.forEach(clearTimeout)
    }
  }, [active, heroDesktop, heroMobile, onFinished, reduced, tempo])

  return <AnimatePresence>
    {active && !reduced && <motion.div className="mp-intro" role="dialog" aria-modal="true" aria-label="Abertura"
      initial={false} exit={{ opacity: 0 }} transition={{ duration: .2 }}>
      <motion.div className="mp-intro-veil" aria-hidden="true"
        initial={false} animate={{ y: opening ? '-105%' : '0%' }}
        transition={{ duration: .65, delay: .08, ease: exitEase }} />
      <motion.div className="mp-intro-paper" aria-hidden="true"
        initial={false} animate={{ y: opening ? '-105%' : '0%' }}
        transition={{ duration: .62, delay: .04, ease: exitEase }} />
      <div className="mp-intro-content" aria-hidden="true">
        <motion.div className="mp-intro-flight" initial={false}
          animate={flight ? { ...flight, opacity: [1, 1, 0] } : { x: 0, y: 0, scale: 1, opacity: 1 }}
          transition={{ duration: .64, ease: exitEase, opacity: { duration: .65, times: [0, .8, 1] } }}>
          <svg ref={mark} className="mp-intro-logo" viewBox="0 0 96 96" focusable="false">
            {strokes.map(({ d, delay, duration }) => <motion.path key={d} d={d}
              fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { delay: delay * tempo, duration: duration * tempo, ease: 'easeInOut' },
                opacity: { delay: delay * tempo, duration: .08 },
              }} />)}
          </svg>
        </motion.div>
        <motion.div className="vc-intro-name"
          initial={{ opacity: 0, y: 10 }}
          animate={opening ? { opacity: 0, y: -8 } : { opacity: 1, y: 0 }}
          transition={{ duration: opening ? .2 : .49 * tempo, delay: opening ? 0 : .86 * tempo, ease: revealEase }}>
          Dra. Valquíria Campos
        </motion.div>
      </div>
      {!opening && <button type="button" className="mp-intro-skip" autoFocus onClick={() => {
        rememberIntro()
        onFinished()
      }}>Pular abertura</button>}
    </motion.div>}
  </AnimatePresence>
}
