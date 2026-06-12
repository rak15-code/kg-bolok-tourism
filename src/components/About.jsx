// ────────────────────────────────────────────────────────────────────────────
// About.jsx — "Why Visit Us" storytelling section.
// ────────────────────────────────────────────────────────────────────────────
// Redesigned per request: the old icon/emoji highlight list has been removed.
// Content now comes from the "Why Visit Us" story (location, wildlife, living
// culture, traditional food, surrounding nature) presented as elegant,
// image-based content blocks — no animal/house/feature icons.
// Images are reused from the attractions data; missing files fall back to a
// gradient via <ImageOrPlaceholder/>.
// ────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { getAttractionBySlug } from '../data/attractionsData'
import MotionHeading from './ui/MotionHeading'
import ImageOrPlaceholder from './ui/ImageOrPlaceholder'

export default function About() {
  const { t } = useLanguage()
  const ab = t.about

  // Each story block reuses a representative attraction image (graceful fallback).
  const stories = [
    { slug: 'ecomeg',                        title: ab.why1Title, desc: ab.why1Desc, big: true },
    { slug: 'elephant-conservation-centre',  title: ab.why2Title, desc: ab.why2Desc },
    { slug: 'tarian-piring',                 title: ab.why3Title, desc: ab.why3Desc },
    { slug: 'dodol',                         title: ab.why4Title, desc: ab.why4Desc },
    { slug: 'deerland',                      title: ab.why5Title, desc: ab.why5Desc },
  ].map((s) => {
    const a = getAttractionBySlug(s.slug)
    return { ...s, image: a?.image, gradient: a?.gradient || 'from-forest-500 to-ocean-600' }
  })

  return (
    <section id="about" className="relative py-20 lg:py-28 overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-14">
          <MotionHeading>
            <span className="section-badge">
              <Leaf size={14} />
              {ab.sectionBadge}
            </span>
          </MotionHeading>
          <MotionHeading delay={0.1}>
            <h2 className="section-heading">{ab.heading}</h2>
          </MotionHeading>
          <MotionHeading delay={0.15}>
            <div className="accent-divider mb-6" />
          </MotionHeading>
          <MotionHeading delay={0.2}>
            <p className="section-subheading">{ab.intro}</p>
          </MotionHeading>
        </div>

        {/* Image-based storytelling blocks */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {stories.map((s, i) => (
            <motion.article
              key={s.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className={`group relative rounded-3xl overflow-hidden card card-lift
                          ${s.big ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''}`}
            >
              <div className={s.big ? 'h-72 lg:h-full lg:min-h-[22rem]' : 'h-72'}>
                <ImageOrPlaceholder
                  src={s.image}
                  alt={s.title}
                  gradient={s.gradient}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Readability overlay — keeps text crisp over any photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className={`absolute bottom-0 inset-x-0 p-5 ${s.big ? 'sm:p-7' : ''}`}>
                <h3 className={`font-black text-white drop-shadow-lg ${s.big ? 'text-2xl mb-2' : 'text-lg mb-1.5'}`}>
                  {s.title}
                </h3>
                <p className={`text-slate-100/90 leading-relaxed drop-shadow ${s.big ? 'text-sm max-w-lg' : 'text-xs'}`}>
                  {s.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
