// Cause data for the 11.11 pages, copied from the approved design canvas (Cause.dc.html).
import type { CauseKey } from './data'

export interface CauseBlock { title: string; paras: string[] }
export interface Cause {
  id: CauseKey
  slug: string
  short: string
  name: string
  partner: string
  partnerUpper: string
  place: string
  line: string
  logo: string
  still: string
  color: string
  bg: string
  blocks: CauseBlock[]
  print: string
}

export const CAUSES: Cause[] = [
  {
    "id": "rich",
    "short": "Empowerment",
    "name": "RICH IN LIFE",
    "partner": "Mission Positivity",
    "partnerUpper": "MISSION POSITIVITY",
    "place": "Paya, Colombia",
    "line": "RETHINKING WHAT WEALTH TRULY MEANS.",
    "logo": "/v2/img/logo-mission-positivity.png",
    "still": "/v2/img/still-rich.jpg",
    "color": "#D4A373",
    "bg": "radial-gradient(ellipse at 22% 30%, #f0dcc4 0%, transparent 55%), radial-gradient(ellipse at 78% 75%, #b07e52 0%, transparent 60%), #D4A373",
    "blocks": [
      {
        "title": "THE CHALLENGE",
        "paras": [
          "In the remote rural communities of Milagros, La Unión, and other campos in Paya, Colombia, material wealth is scarce. Schools often lack basic learning materials, access to healthcare is limited, and teachers work under challenging conditions to provide education for children growing up far from urban resources.",
          "Yet despite these challenges, the people living here possess something many of us have forgotten: strong communities, a close connection to nature, and a remarkable ability to make the most of what they have.",
          "The question is not only what these communities lack, but also what they can teach us about a different kind of wealth."
        ]
      },
      {
        "title": "WHAT WE DO TOGETHER",
        "paras": [
          "Together with Mission Positivity, we created the Rich in Life collection to support children, teachers, and families in the rural communities of Paya, Colombia.",
          "Every shirt helps fund educational projects, school materials, community programs, health initiatives, and opportunities that would otherwise remain out of reach. Every purchase creates direct impact where it is needed most.",
          "It is an invitation to rethink what wealth truly means. Rich in Life reminds us that fulfillment is often found in connection, purpose, and community rather than material possessions."
        ]
      },
      {
        "title": "ABOUT MISSION POSITIVITY",
        "paras": [
          "Mission Positivity is a German non-profit organization driven by a simple belief: positive change becomes possible when people come together and take action. The organization works to expand educational opportunities for children and young people, support communities facing social and economic challenges, and help create pathways toward a more self-determined and sustainable future.",
          "Since 2023, Mission Positivity has been working closely with schools, teachers, children, and families in the remote rural communities of Paya, Colombia. Through educational support, school materials, health initiatives, volunteer programs, and long-term local partnerships, the organization helps create opportunities where access to resources is limited.",
          "In 2025, the team returned to Milagros and La Unión to continue their projects and film a documentary exploring life in these remote communities. At its heart lies a simple question: What does it really mean to be rich?",
          "The Rich in Life collection was born from the answers they found."
        ]
      }
    ],
    "print": "/v2/img/og-rich.png",
    "slug": "rich-in-life"
  },
  {
    "id": "one-world",
    "short": "Ukraine",
    "name": "ONE WORLD",
    "partner": "Care in Action",
    "partnerUpper": "CARE IN ACTION",
    "place": "Lviv, Ukraine",
    "line": "HOPE FOR CHILDREN FACING THE REALITIES OF WAR.",
    "logo": "/v2/img/logo-care-in-action.png",
    "still": "/v2/img/still-one-world.jpg",
    "color": "#5DADE2",
    "bg": "radial-gradient(ellipse at 22% 30%, #bfe0f5 0%, transparent 55%), radial-gradient(ellipse at 78% 75%, #2b86c4 0%, transparent 60%), #5DADE2",
    "blocks": [
      {
        "title": "THE CHALLENGE",
        "paras": [
          "Countless children around the world grow up without parental care, facing disadvantages that can shape their entire lives. For those caught in war-torn regions, the challenges are even more severe—lacking access to basic necessities, education, and the nurturing environment every child deserves."
        ]
      },
      {
        "title": "WHAT WE DO TOGETHER",
        "paras": [
          "The ONE WORLD Collection stands for unity and compassion in the face of adversity. Every piece gives a fixed amount to Care in Action, a non-profit charity dedicated to helping disadvantaged children—especially those without parental care—to grow up and succeed in life. By providing essential care, education, and a nurturing environment, Care in Action serves as a lifeline for children facing the harsh realities of war."
        ]
      },
      {
        "title": "ABOUT CARE IN ACTION",
        "paras": [
          "Care in Action is a non-profit charity dedicated to helping disadvantaged children, but especially those without parental care, to grow up and succeed in life. By striving to provide essential care, education and a nurturing environment, Care in Action is a lifeline for those facing the harsh realities of war."
        ]
      }
    ],
    "print": "/v2/img/og-one-world.webp",
    "slug": "one-world"
  },
  {
    "id": "talk",
    "short": "Mental health",
    "name": "TALK ABOUT IT",
    "partner": "Mental Health Initiative",
    "partnerUpper": "MENTAL HEALTH INITIATIVE",
    "place": "Munich, Germany",
    "line": "BREAKING THE SILENCE ON MENTAL HEALTH.",
    "logo": "/v2/img/logo-mhi.png",
    "still": "/v2/img/still-talk.jpg",
    "color": "#FF8C42",
    "bg": "radial-gradient(ellipse at 22% 30%, #ffd2b0 0%, transparent 55%), radial-gradient(ellipse at 78% 75%, #e06a1d 0%, transparent 60%), #FF8C42",
    "blocks": [
      {
        "title": "THE CHALLENGE",
        "paras": [
          "Mental health challenges affect millions worldwide, yet stigma and silence prevent people from seeking help. Suicide remains a leading cause of death, particularly among young people, and countless individuals suffer in isolation."
        ]
      },
      {
        "title": "WHAT WE DO TOGETHER",
        "paras": [
          "The TALK ABOUT IT Collection is designed to spark conversations and save lives. Every piece gives a fixed amount to the Mental Health Initiative, an organization dedicated to promoting suicide prevention, reducing stigma, creating public awareness, and exerting political and social influence to change how society approaches mental health."
        ]
      },
      {
        "title": "ABOUT MENTAL HEALTH INITIATIVE",
        "paras": [
          "The Mental Health Initiative aims to promote suicide prevention, reduce stigma, create public awareness and exert political and social influence. Through advocacy, education, and community support, they're working to create a world where mental health is treated with the same importance as physical health."
        ]
      }
    ],
    "print": "/v2/img/og-talk.webp",
    "slug": "talk-about-it"
  },
  {
    "id": "oceans",
    "short": "Corals",
    "name": "ENDANGERED OCEANS",
    "partner": "SECORE International",
    "partnerUpper": "SECORE INTERNATIONAL",
    "place": "Curaçao, Caribbean",
    "line": "SAVING OUR OCEANS, ONE CORAL AT A TIME.",
    "logo": "/v2/img/logo-secore.png",
    "still": "/v2/img/still-oceans.jpg",
    "color": "#2f6fa8",
    "bg": "radial-gradient(ellipse at 22% 30%, #9cc4e6 0%, transparent 55%), radial-gradient(ellipse at 78% 75%, #002147 0%, transparent 60%), #2f6fa8",
    "blocks": [
      {
        "title": "THE CHALLENGE",
        "paras": [
          "Coral reefs are the lungs of our oceans, supporting marine life and protecting our coastlines. But they're disappearing at an alarming rate due to climate change, pollution, and human activity."
        ]
      },
      {
        "title": "WHAT WE DO TOGETHER",
        "paras": [
          "The ENDANGERED OCEANS Collection is more than just fashion—it's a call to action. Each piece is designed to spread awareness and fund real solutions for our oceans. Every piece gives a fixed amount to SECORE International, a global leader in coral restoration. Through pioneering research, innovative reef restoration techniques, and education, they're working to ensure a future where coral reefs thrive—not just survive."
        ]
      },
      {
        "title": "ABOUT SECORE INTERNATIONAL",
        "paras": [
          "SECORE International is on a mission to save our oceans through pioneering research, innovative reef restoration techniques, and education. They're working to ensure coral reefs thrive for generations to come."
        ]
      }
    ],
    "print": "/v2/img/og-oceans.webp",
    "slug": "endangered-oceans"
  },
  {
    "id": "cool",
    "short": "Climate",
    "name": "COOL DOWN",
    "partner": "Plant-for-the-Planet",
    "partnerUpper": "PLANT-FOR-THE-PLANET",
    "place": "Tutzing, Germany",
    "line": "FIGHTING FOR CLIMATE JUSTICE, ONE TREE AT A TIME.",
    "logo": "/v2/img/logo-pftp.png",
    "still": "/v2/img/still-cool.jpg",
    "color": "#4cc37f",
    "bg": "radial-gradient(ellipse at 22% 30%, #bfe8cd 0%, transparent 55%), radial-gradient(ellipse at 78% 75%, #1e8a4a 0%, transparent 60%), #4cc37f",
    "blocks": [
      {
        "title": "THE CHALLENGE",
        "paras": [
          "Climate change threatens our planet, and deforestation accelerates its devastating effects. Ecosystems worldwide are in crisis, with millions of trees lost each year. The urgent need for climate justice demands immediate action to restore what has been lost."
        ]
      },
      {
        "title": "WHAT WE DO TOGETHER",
        "paras": [
          "The COOL DOWN Collection represents our commitment to fighting climate change through direct action. Every piece gives a fixed amount to Plant-for-the-Planet, an initiative that supports ecosystem restoration worldwide to fight for climate justice. Every purchase helps plant trees and restore vital ecosystems, creating a tangible impact in the fight against climate change."
        ]
      },
      {
        "title": "ABOUT PLANT-FOR-THE-PLANET",
        "paras": [
          "Plant-for-the-Planet is an initiative that supports ecosystem restoration worldwide to fight for climate justice. Through global mobilization and direct action, they empower citizens to restore ecosystems and combat climate change by planting trees around the world."
        ]
      }
    ],
    "print": "/v2/img/og-cool.webp",
    "slug": "cool-down"
  },
  {
    "id": "wild",
    "short": "Elephants",
    "name": "WILD AT HEART",
    "partner": "Elephants for Africa",
    "partnerUpper": "ELEPHANTS FOR AFRICA",
    "place": "Botswana, Africa",
    "line": "TOGETHER FOR GIANTS. TOGETHER FOR HOPE.",
    "logo": "/v2/img/logo-efa.png",
    "still": "/v2/img/still-wild.jpg",
    "color": "#a8997f",
    "bg": "radial-gradient(ellipse at 22% 30%, #e3dccd 0%, transparent 55%), radial-gradient(ellipse at 78% 75%, #6D5F4D 0%, transparent 60%), #a8997f",
    "blocks": [
      {
        "title": "THE CHALLENGE",
        "paras": [
          "The African elephant is one of Earth's most extraordinary beings — intelligent, social, emotional, and deeply connected to its herd. Yet despite their importance, elephants are under constant pressure from habitat loss, human–elephant conflict, and shifting landscapes. This collaboration is built on a simple belief: when we take action out of love, we protect what's wild and keep hope alive. WILD AT HEART is more than a design — it's a reminder that protecting nature starts with choosing compassion, choosing awareness, and choosing to act."
        ]
      },
      {
        "title": "ABOUT ELEPHANTS FOR AFRICA",
        "paras": [
          "Elephants for Africa, founded by Dr. Kate Evans, is a charity dedicated to safeguarding elephants through research, education, and community partnership in Botswana. Their work focuses on researching elephant behaviour (especially male elephants who often receive less conservation attention), supporting local communities and farmers to protect their livelihoods while coexisting with migrating elephant herds, and educating the next generation through school programmes and conservation clubs. Elephants for Africa isn't just \"protecting elephants\" — they're building a world where people and wildlife can thrive side by side."
        ]
      }
    ],
    "print": "/v2/img/og-wild.webp",
    "slug": "wild-at-heart"
  }
]

const DARK: Partial<Record<CauseKey, true>> = { oceans: true }
export const causeFg = (c: Cause) => (DARK[c.id] ? '#ffffff' : '#0b0b0c')
export const TINT: Record<CauseKey, string> = { rich: '#f3e6d6', 'one-world': '#e3f0f8', talk: '#fbeadc', oceans: '#e1eaf3', cool: '#e2f2e8', wild: '#efebe3' }
export const causeTeaser = (c: Cause) => { const t = c.blocks[0].paras[0]; const i = t.indexOf('. '); return i > 0 ? t.slice(0, i + 1) : t }
// "RICH IN LIFE" -> "Rich in Life" (small words stay lower case).
export const causeTitle = (n: string) => n.toLowerCase().replace(/\b\w+/g, (w, i) => (i > 0 && ['in', 'at'].includes(w) ? w : w[0].toUpperCase() + w.slice(1)))
export const causeBySlug = (slug: string | undefined) => CAUSES.find((c) => c.slug === slug)

/** One real number per partner, shown in the "at a glance" row once the partner has given it. */
export const FACTS: Partial<Record<CauseKey, string>> = {}
/** Film link per cause; the film section stays hidden until one is set. */
export const FILMS: Partial<Record<CauseKey, string>> = {}
