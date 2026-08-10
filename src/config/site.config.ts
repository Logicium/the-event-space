import type { ThemeName, SwatchName, SiteVariant } from '@apotome/archetype-shared/themes/tokens'
import { reactive } from 'vue'

export interface PhotoSlot { src: string; alt?: string; caption?: string }

export type EventStatus = 'on-sale' | 'sold-out' | 'few-left' | 'free' | 'cancelled' | 'postponed'

export interface EventItem {
  id: string
  title: string
  /** ISO date YYYY-MM-DD. */
  date: string
  startTime?: string
  doorsTime?: string
  category?: string
  priceLabel?: string
  ticketUrl?: string
  status?: EventStatus
  lineup?: string[]
  image: string
  imageAlt?: string
  blurb: string
  description?: string
  ageRestriction?: string
  runtimeMinutes?: number
  featured?: boolean
}

export interface EventSeries {
  name: string
  blurb: string
  cadence?: string
  image?: string
}

export interface Performer {
  name: string
  role?: string
  bio?: string
  image?: string
  imageAlt?: string
  links?: Array<{ label: string; href: string }>
}

export interface VenueDetail {
  capacity?: string
  ageRestrictions?: string
  parking?: string
  accessibility?: string
  foodAndDrink?: string
  rentalUrl?: string
  rentalBlurb?: string
}

export interface MarqueePhotos {
  hero: PhotoSlot
  about: PhotoSlot
  gallery: PhotoSlot[]
}

export interface MarqueeSiteConfig {
  brand: string
  tagline: string
  blurb: string
  theme: ThemeName
  swatch: SwatchName
  variant: SiteVariant
  contact: { address: string; phone: string; email: string; mapEmbedUrl?: string }
  hours: Array<{ day: string; open: string }>
  photos: MarqueePhotos
  story: { title: string; paragraphs: string[]; facts?: Array<{ label: string; value: string }> }
  venue: VenueDetail
  events: EventItem[]
  series: EventSeries[]
  performers: Performer[]
  testimonials: Array<{ quote: string; author: string; source?: string }>
  ticketingUrl?: string
  newsletterUrl?: string
  social: Array<{ label: string; href: string }>
}

export const siteConfig: MarqueeSiteConfig = reactive(({
  brand: 'Cinder Hall',
  tagline: 'A room for whatever is next.',
  blurb:
    'A working arts hall in southern Colorado — gallery openings, live music, comedy, festivals, and the kind of nights you tell your friends about.',
  theme: 'atlas',
  swatch: 'signal-dark',
  variant: 'essentials',
  contact: {
    address: '418 Main St, Trinidad, CO 81082',
    phone: '(719) 555-0142',
    email: 'hello@cinderhall.org',
    mapEmbedUrl: 'https://www.google.com/maps?q=Trinidad,CO&output=embed',
  },
  hours: [
    { day: 'Gallery', open: 'Wed–Sat 12–6pm' },
    { day: 'Event nights', open: 'Doors 1 hour before' },
    { day: 'Sun–Tue', open: 'Closed (private events only)' },
  ],
  ticketingUrl: 'https://example.com/tickets',
  newsletterUrl: '',
  photos: {
    hero: { src: '/photos/hero-marquee.jpg', alt: 'Cinder Hall front entrance at dusk, marquee lit' },
    about: { src: '/photos/about-house.jpg', alt: 'Wide interior of the hall set for a concert' },
    gallery: [
      { src: '/photos/show-01.jpg', alt: 'Folk trio mid-set' },
      { src: '/photos/show-02.jpg', alt: 'Audience lining up under the marquee' },
      { src: '/photos/show-03.jpg', alt: 'Crowd at a festival afternoon set' },
      { src: '/photos/show-04.jpg', alt: 'Family afternoon in the gallery' },
      { src: '/photos/show-05.jpg', alt: 'Painter at work during a gallery opening' },
      { src: '/photos/show-06.jpg', alt: 'String quartet rehearsing in the hall' },
    ],
  },
  story: {
    title: 'A room that keeps changing.',
    paragraphs: [
      'Cinder Hall lives in a 1924 brick storefront on Main Street. It has been a hardware store, a dance studio, and (briefly, in the 70s) a roller rink.',
      'Today it is a flexible event hall — gallery one week, concert the next, a three-day festival in the summer, a Sunday craft fair in the fall. We work with local artists, touring acts, and community organizers to keep the calendar interesting and the door price honest.',
    ],
    facts: [
      { label: 'Capacity', value: '240' },
      { label: 'Disciplines', value: 'Music · Art · Comedy · Film' },
      { label: 'Events / year', value: '120+' },
      { label: 'Year built', value: '1924' },
    ],
  },
  venue: {
    capacity: '240 standing · 180 seated',
    ageRestrictions: 'All ages unless noted on the event.',
    parking: 'Free street parking on Main and Commercial. Public lot on 3rd, two blocks west.',
    accessibility: 'Step-free entry at the Main St door. Companion seating available. Assistive listening on request.',
    foodAndDrink: 'Beer, wine, and local soda at the lobby bar from doors through intermission.',
    rentalUrl: 'mailto:rentals@cinderhall.org',
    rentalBlurb: 'Available for weddings, film shoots, pop-ups, and private events on dark nights.',
  },
  events: [
    {
      id: 'rosalind-quartet',
      title: 'The Rosalind Quartet',
      date: '2026-06-07',
      startTime: '20:00',
      doorsTime: '19:00',
      category: 'Concert',
      priceLabel: '$25 / $20 students',
      ticketUrl: 'https://example.com/tickets/rosalind',
      status: 'few-left',
      lineup: ['The Rosalind Quartet', 'Opener: Juno Castaño'],
      image: '/photos/event-rosalind.jpg',
      imageAlt: 'String quartet portrait',
      blurb: 'Chamber strings with a Patti Smith covers encore set.',
      description:
        'Trinidad’s own string quartet returns from their spring tour with a program of Shostakovich, Caroline Shaw, and — by audience demand — an encore set of Patti Smith covers.',
      ageRestriction: 'All ages',
      runtimeMinutes: 95,
      featured: true,
    },
    {
      id: 'midnight-mariachi',
      title: 'Midnight Mariachi',
      date: '2026-06-14',
      startTime: '21:00',
      doorsTime: '20:00',
      category: 'Concert',
      priceLabel: '$18',
      ticketUrl: 'https://example.com/tickets/midnight-mariachi',
      status: 'on-sale',
      image: '/photos/event-mariachi.jpg',
      imageAlt: 'Mariachi band on stage in low light',
      blurb: 'A late-set mariachi revue from Albuquerque’s rising street ensemble.',
      ageRestriction: '21+ after 11pm',
      runtimeMinutes: 110,
    },
    {
      id: 'opening-rivera',
      title: 'Gallery Opening: Lucía Rivera — “Cinder Country”',
      date: '2026-07-03',
      startTime: '18:00',
      category: 'Exhibition',
      priceLabel: 'Free',
      status: 'free',
      image: '/photos/event-rivera.jpg',
      imageAlt: 'Landscape painting against red sky',
      blurb: 'First-Friday opening reception with the artist. Show runs through August.',
      description:
        'Lucía Rivera’s new series of large-format pastels captures the burn-and-bloom landscape of southern Colorado. Wine and conversation in the lobby gallery from 6pm.',
      ageRestriction: 'All ages',
    },
    {
      id: 'open-mic',
      title: 'Open Mic Monday',
      date: '2026-07-06',
      startTime: '19:00',
      doorsTime: '18:30',
      category: 'Comedy & Spoken Word',
      priceLabel: 'Free · sign-up at 6:30',
      status: 'free',
      image: '/photos/event-openmic.jpg',
      imageAlt: 'Microphone on the empty stage',
      blurb: 'Five minutes, one mic. Music, comedy, poetry — all welcome.',
    },
    {
      id: 'high-plains-fest',
      title: 'High Plains Folk Festival',
      date: '2026-08-15',
      startTime: '12:00',
      category: 'Festival',
      priceLabel: 'Day pass $35 · weekend $65',
      ticketUrl: 'https://example.com/tickets/highplains',
      status: 'on-sale',
      lineup: ['Saturday: Juno Castaño', 'The Field Recordings', 'Mariposa', 'Sunday: open stage from 11am'],
      image: '/photos/event-festival.jpg',
      imageAlt: 'Sun-drenched festival crowd in front of a small stage',
      blurb: 'Two days, three stages, twenty acts — our annual folk + roots gathering.',
      description:
        'High Plains is a two-day, all-ages festival celebrating southern Colorado’s folk, country, and Tejano traditions. Indoor and outdoor stages, food vendors on the side lot, kids free under 12.',
      ageRestriction: 'All ages',
      featured: true,
    },
    {
      id: 'gala-2026',
      title: '12th Annual Cinder Gala',
      date: '2026-09-19',
      startTime: '18:30',
      category: 'Benefit',
      priceLabel: '$95 · table sponsorships from $1,200',
      ticketUrl: 'https://example.com/tickets/gala',
      status: 'on-sale',
      image: '/photos/event-gala.jpg',
      imageAlt: 'Patrons in the lobby for the annual gala',
      blurb: 'Cocktails, dinner in the hall, and a one-night-only revue. Proceeds keep our community nights free.',
      ageRestriction: '21+',
    },
  ],
  series: [
    {
      name: 'First-Friday Gallery Walk',
      blurb: 'Every first Friday: new lobby show, free admission, artists present.',
      cadence: 'First Friday · monthly',
      image: '/photos/series-firstfri.jpg',
    },
    {
      name: 'Open Mic Monday',
      blurb: 'Five-minute slots, all disciplines welcome. Sign-up opens at 6:30pm.',
      cadence: 'Mondays · weekly',
      image: '/photos/series-openmic.jpg',
    },
    {
      name: 'Saturday Matinee',
      blurb: 'Family-friendly afternoons — film, puppetry, kids music.',
      cadence: '2nd + 4th Sat · monthly',
      image: '/photos/series-matinee.jpg',
    },
  ],
  performers: [
    {
      name: 'The Rosalind Quartet',
      role: 'Resident chamber ensemble',
      bio: 'Trinidad-based string quartet performing classical and contemporary works since 2018.',
      image: '/photos/performer-rosalind.jpg',
      links: [{ label: 'Site', href: 'https://example.com/rosalind' }],
    },
    {
      name: 'Juno Castaño',
      role: 'Songwriter in residence',
      bio: 'Bilingual songwriter and guitarist. New album out this fall on Mountain South Records.',
      image: '/photos/performer-juno.jpg',
      links: [{ label: 'Instagram', href: 'https://instagram.com' }],
    },
    {
      name: 'Lucía Rivera',
      role: 'Featured visual artist · 2026',
      bio: 'Painter and printmaker working in large-format pastels. Cinder Country opens July 3.',
      image: '/photos/performer-rivera.jpg',
    },
  ],
  testimonials: [
    { quote: 'The best small room I’ve played all year. Sound is real, the staff is real, the crowd is right there with you.', author: 'Bart H.', source: 'Touring artist' },
    { quote: 'Friday opening nights are the highlight of our month. Cinder feels like the town living room.', author: 'Andrea V.', source: 'Patron since 2016' },
    { quote: 'They made our festival weekend so much easier than the last venue. Real partners.', author: 'M. Ortega', source: 'High Plains organizer' },
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'Spotify', href: 'https://spotify.com' },
  ],
}))
