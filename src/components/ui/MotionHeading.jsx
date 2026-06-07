import { motion } from 'framer-motion'

/**
 * MotionHeading — wraps any content and animates it into view as it enters the viewport.
 *
 * Props:
 *   direction  — 'up' | 'down' | 'left' | 'right'  (which direction content slides IN from)
 *   distance   — pixels to travel during entrance (default 50)
 *   delay      — stagger delay in seconds
 *   once       — if true the animation only plays once (default false = replays on re-enter)
 *   className  — forwarded to the wrapper div
 */
export default function MotionHeading({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 50,
  once = false,
}) {
  const initial = {
    opacity: 0,
    y: direction === 'up'   ? distance  : direction === 'down' ? -distance : 0,
    x: direction === 'left' ? distance  : direction === 'right' ? -distance : 0,
  }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once, amount: 0.25 }}
    >
      {children}
    </motion.div>
  )
}
