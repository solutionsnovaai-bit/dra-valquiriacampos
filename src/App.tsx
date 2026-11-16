import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight, ArrowUpRight, ChevronRight,
  Flower2, Heart, Instagram, Menu, MessageCircle, Sparkles, X,
} from 'lucide-react'
import { SITE, MENSAGENS } from './config/site'
import { ResultsCarousel, type ResultCard } from './components/ResultsCarousel'
import { BrandIntro } from './components/BrandIntro'

const assets = {
  heroDesktop: '/valquiria/retrato-capa.webp',
  heroMobile: '/valquiria/retrato-capa-mobile.webp',
  monogram: '/valquiria/monograma.svg',
  horizontalLogo: '/valquiria/assinatura.svg',
  portrait: '/valquiria/retrato-perfil.webp',
}

const EASE = [0.22, 1, .36, 1] as const

const nav = [
  { label: 'Início', href: '#inicio' },
  { label: 'Procedimentos', href: '#cuidados' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Sobre', href: '#sobre' },
] as const

function wa(message: string = MENSAGENS.padrao) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`
}

function Reveal({ children, className = '', delay = 0 }: {children: ReactNode;className?: string;delay?: number}) {
  const reduce = useReducedMotion()
  return <motion.div className={className}
    initial={reduce ? false : { opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .17 }}
    transition={{ duration: .78, delay, ease: EASE }}>
    {children}
  </motion.div>
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scroll, setScroll] = useState(false)
  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY > 24)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])
  return <header className={`mp-header ${scroll ? 'scrolled' : ''}`}>
    <div className="mp-container mp-header-inner">
      <a href="#inicio" className="mp-brand" aria-label="Dra. Valquíria Campos, voltar ao início" onClick={() => setOpen(false)}>
        <img src={assets.horizontalLogo} width="392" height="96" alt="" />
        <span className="mp-brand-flight-target" aria-hidden="true" />
      </a>
      <nav className="mp-desktop-nav" aria-label="Navegação principal">
        {nav.map(x => <a key={x.href} href={x.href}>{x.label}</a>)}
      </nav>
      <a href={wa()} target="_blank" rel="noopener noreferrer" className="mp-header-cta">Agendar avaliação <ArrowUpRight size={17} /></a>
      <button type="button" className="mp-menu-button" aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open} aria-controls="mp-menu" onClick={() => setOpen(v => !v)}>
        {open ? <X size={25} /> : <Menu size={25} />}
      </button>
    </div>
    <AnimatePresence>
      {open && <motion.nav className="mp-mobile-nav" id="mp-menu" aria-label="Menu móvel"
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
        transition={{ duration: .23 }}>
        {nav.map(x => <a key={x.href} href={x.href} onClick={() => setOpen(false)}>{x.label}<ChevronRight size={16}/></a>)}
        <a className="mp-menu-cta" href={wa()} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
          Agendar avaliação <ArrowUpRight size={17}/>
        </a>
      </motion.nav>}
    </AnimatePresence>
  </header>
}

function Hero() {
  return <section className="mp-hero" id="inicio" aria-labelledby="mp-hero-title">
    <div className="mp-hero-copy">
      <span className="mp-eyebrow"><span className="mp-eyebrow-line" /> Estética facial e corporal</span>
      <h1 id="mp-hero-title">Realce a beleza <em>que é sua.</em></h1>
      <p>Dra. Valquíria Campos. Procedimentos faciais, labiais e corporais com atendimento planejado a partir da sua avaliação.</p>
      <div className="mp-hero-actions">
        <a href={wa()} target="_blank" rel="noopener noreferrer" className="mp-button mp-button-dark">Agendar minha avaliação <ArrowUpRight size={18}/></a>
        <a href="#cuidados" className="mp-text-link">Ver procedimentos <ArrowRight size={17}/></a>
      </div>
    </div>
    <picture className="mp-hero-image">
      <source media="(max-width: 900px)" srcSet={assets.heroMobile}/>
      <img src={assets.heroDesktop} width="960" height="1200" alt="Retrato editorial da Dra. Valquíria Campos" fetchPriority="high" />
    </picture>
  </section>
}

const values = [
  { title: 'Escuta na avaliação', icon: Flower2, text: 'Um momento para conversar sobre o que você deseja cuidar e esclarecer dúvidas.' },
  { title: 'Naturalidade', icon: Sparkles, text: 'Um plano pensado para respeitar os seus traços e preferências.' },
  { title: 'Orientação individual', icon: Heart, text: 'Conheça as opções e converse sobre o que cada procedimento envolve.' },
]

type CatalogService = {
  id: string
  title: string
  category: string
  description: string
  photo?: { alt: string }
}

const services: CatalogService[] = [
  {
    id: 'lavieen', title: 'Laser Lavieen', category: 'Tecnologia para a pele',
    description: 'Na avaliação, converse sobre o uso do laser e sobre os cuidados antes e depois da sessão.',
    photo: { alt: 'Detalhe da ponteira de laser durante atendimento, publicado no perfil da profissional' },
  },
  {
    id: 'hipro', title: 'Ultrassom microfocado HiPRO', category: 'Estética facial',
    description: 'Conheça a tecnologia e converse sobre as áreas que podem ser avaliadas.',
    photo: { alt: 'Equipamento HiPRO na divulgação da profissional' },
  },
  {
    id: 'preenchimento', title: 'Preenchimento labial', category: 'Cuidados labiais',
    description: 'A avaliação considera formato, proporção e o que você busca para os lábios.',
    photo: { alt: 'Detalhe de lábios recortado de uma publicação sobre preenchimento labial' },
  },
  {
    id: 'microagulhamento', title: 'Microagulhamento', category: 'Cuidados com a pele',
    description: 'Converse sobre a indicação para sua pele e os cuidados orientados para o procedimento.',
    photo: { alt: 'Detalhe de uma publicação sobre microagulhamento no perfil profissional' },
  },
  {
    id: 'toxina', title: 'Toxina botulínica', category: 'Estética facial',
    description: 'Converse na avaliação sobre suas prioridades e as possibilidades de cuidado para linhas de expressão.',
    photo: { alt: 'Luvas e mãos da profissional durante um atendimento, em recorte da publicação' },
  },
  {
    id: 'criolipolise', title: 'Criolipólise', category: 'Estética corporal',
    description: 'Saiba como é feita a avaliação para cuidados estéticos corporais.',
  },
]

const resultCards: ResultCard[] = services.flatMap(({ id, title, description, photo }) =>
  photo ? [{
    title, description, image: `/valquiria/${id}.webp`, alt: photo.alt,
    source: 'Perfil profissional',
  }] : [],
)

function Philosophy() {
  return <section className="mp-philosophy mp-section" id="filosofia">
    <div className="mp-container">
      <Reveal className="mp-section-heading mp-center">
        <span className="mp-kicker"><Flower2 size={18}/> O que nos move</span>
        <h2>Seu cuidado começa <em>na conversa.</em></h2>
        
      </Reveal>
      <div className="mp-values-grid">
        {values.map((v, i) => <Reveal className="mp-value-card" key={v.title} delay={i * .08}>
          <span className="mp-value-icon"><v.icon size={28} strokeWidth={1.25}/></span>
          <h3>{v.title}</h3><p>{v.text}</p>
        </Reveal>)}
      </div>
    </div>
  </section>
}

function Services() {
  return <section className="mp-services mp-section" id="cuidados" aria-labelledby="mp-services-title">
    <div className="mp-container">
      <div className="mp-services-heading">
        <Reveal className="mp-section-heading">
          <span className="mp-kicker">Tratamentos e procedimentos</span>
          <h2 id="mp-services-title">Cuidados para a pele, <em>rosto e corpo.</em></h2>
        </Reveal>
        <Reveal>
          <p>Conheça os procedimentos apresentados pela Dra. Valquíria Campos e leve suas dúvidas para a avaliação.</p>
        </Reveal>
      </div>
      <div className="mp-services-grid mp-catalog-grid">
        {services.map((item, index) =>
          <Reveal className="mp-service-card mp-catalog-card" key={item.id} delay={(index % 2) * .06}>
            <div className="mp-catalog-details">
              <div className="mp-catalog-topline"><span>{item.category}</span></div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <a href={wa(MENSAGENS.servico(item.title))}
                target="_blank" rel="noopener noreferrer" aria-label={`Consultar sobre ${item.title} no WhatsApp`}>
                Saiba mais <ArrowUpRight size={16} />
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  </section>
}

function About() {
  return <section className="mp-about mp-section" id="sobre">
    <div className="mp-container mp-about-grid">
      <Reveal className="mp-about-image">
        <img src={assets.portrait} width="370" height="480" loading="lazy" decoding="async" alt="Dra. Valquíria Campos em foto do perfil profissional" />
      </Reveal>
      <Reveal className="mp-about-copy">
        <span className="mp-kicker">Sobre a profissional</span>
        <h2>Dra. Valquíria <em>Campos.</em></h2>
        <p>Valquíria Campos apresenta em seu perfil profissional tratamentos faciais, labiais e corporais, além de tecnologias para cuidados com a pele.</p>
        <p>Na avaliação, você pode explicar suas prioridades, tirar dúvidas sobre os procedimentos e alinhar os próximos passos.</p>
        <a href={`https://www.instagram.com/${SITE.instagram}/`} className="mp-button mp-button-outline" target="_blank" rel="noopener noreferrer">
          Conhecer o Instagram <Instagram size={17}/>
        </a>
      </Reveal>
    </div>
  </section>
}

function HowItWorks() {
  const steps = [
    { n:'01', h:'Conte o que você procura', p:'Entre em contato pelo WhatsApp e compartilhe suas dúvidas ou expectativas.' },
    { n:'02', h:'Agende sua avaliação', p:'Converse com a equipe sobre o melhor momento para seu atendimento.' },
    { n:'03', h:'Cuide de você', p:'Receba uma orientação individualizada sobre as possibilidades adequadas para você.' },
  ]
  return <section className="mp-process mp-section" id="atendimento">
    <div className="mp-container">
      <Reveal className="mp-section-heading mp-center"><span className="mp-kicker">Simples e acolhedor</span><h2>O primeiro passo é <em>se escolher.</em></h2></Reveal>
      <div className="mp-process-steps">
        {steps.map((s,i)=><Reveal className="mp-step" key={s.n} delay={i*.1}>
          <span>{s.n}</span><h3>{s.h}</h3><p>{s.p}</p>
        </Reveal>)}
      </div>
      <Reveal className="mp-process-action"><a href={wa()} target="_blank" rel="noopener noreferrer" className="mp-button mp-button-dark">Agendar pelo WhatsApp <ArrowUpRight size={17}/></a></Reveal>
    </div>
  </section>
}

function FinalCta() {
  return <section className="mp-final-cta" id="agendar">
    <div className="mp-container">
      <Reveal>
        <Flower2 className="mp-final-icon" size={38} strokeWidth={1.15}/>
        <span>O cuidado começa com uma escolha</span>
        <h2>Que tal dedicar um <em>momento a você?</em></h2>
        <p>Converse pelo WhatsApp para combinar o horário e confirmar o endereço do atendimento.</p>
        <a href={wa()} target="_blank" rel="noopener noreferrer" className="mp-button mp-button-light">Agendar minha avaliação <ArrowUpRight size={18}/></a>
      </Reveal>
    </div>
  </section>
}

function Footer() {
  return <footer className="mp-footer">
    <div className="mp-container mp-footer-grid">
      <div className="mp-footer-brand">
        <img src={assets.monogram} alt="Monograma VC" width="96" height="96" loading="lazy" />
        <strong>DRA. VALQUÍRIA CAMPOS</strong><small>ESTÉTICA FACIAL E CORPORAL</small>
        
      </div>
      <div className="mp-footer-col"><h3>Explore</h3>{nav.map(x=><a key={x.href} href={x.href}>{x.label}</a>)}</div>
      <div className="mp-footer-col"><h3>Contato</h3>
        <a href={wa()} target="_blank" rel="noopener noreferrer"><MessageCircle size={16}/> {SITE.whatsappExibicao}</a>
        <a href={`https://www.instagram.com/${SITE.instagram}/`} target="_blank" rel="noopener noreferrer"><Instagram size={16}/> @{SITE.instagram}</a>
      </div>
    </div>
    <div className="mp-container mp-footer-bottom"><span>© {new Date().getFullYear()} Dra. Valquíria Campos. Todos os direitos reservados.</span></div>
  </footer>
}

export default function App() {
  const [loading, setLoading] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const finishLoading = useCallback(() => setLoading(false), [])
  useEffect(() => {
    if (!loading) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [loading])
  return <>
    <BrandIntro active={loading} onFinished={finishLoading}
      heroDesktop={assets.heroDesktop} heroMobile={assets.heroMobile}/>
    <div inert={loading}>
    <Header/>
    <main>
      <Hero/><Philosophy/><Services/><ResultsCarousel cards={resultCards} evaluationUrl={wa()}/><About/><HowItWorks/><FinalCta/>
    </main>
    <Footer/>
    <a href={wa()} target="_blank" rel="noopener noreferrer" className="mp-fab" aria-label="Agendar avaliação pelo WhatsApp"><MessageCircle size={24}/><span className="mp-fab-pulse"/></a>
    </div>
  </>
}
