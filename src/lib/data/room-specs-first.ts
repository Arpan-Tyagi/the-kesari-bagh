// First Floor Architectural Suite Specifications (Key 02 & Key 04)
import { RoomDetailSpec } from '@/types/room-details';

export const FIRST_FLOOR_SPECS: Record<string, RoomDetailSpec> = {
  'aravalli-facing-pool-view': {
    slug: 'aravalli-facing-pool-view',
    keyNumber: 'Key 02 • First Floor',
    tagline: 'Elevated Mountain Panoramas & Private Stone Terrace',
    heroSubtitle: 'The premier master suite commanding first-floor vantage points over ancient Aravalli ridges and the azure estate pool.',
    compassOrientation: 'South-East Facing • Full Daylight & Golden Hour',
    ceilingHeight: '4.1 m (13.5 ft) Exposed Timber Beam',
    flooringMaterial: 'Aged Herringbone Teak & Honed Kota Stone',
    outdoorSpaceDesc: '22 m² Elevated Private Stone Balcony with bistro setting',
    enSuiteSpecs: {
      surface: 'Honed Green Udaipur Marble & Polished Brass',
      showerType: 'Oversized Waterfall Shower & Hand Wand',
      toiletries: 'Kama Ayurveda Pure Rose & Vetiver',
      features: ['Panoramic glass window with privacy louvers', 'Hand-hammered brass basins', 'Custom heated towel rails'],
    },
    narrative: {
      intro: 'Commanding the estate’s upper floor, Key 02 offers the most dramatic panoramic vistas in Manesar. From your private stone terrace, gaze out across centuries-old Aravalli ridges that shift in color from lilac dawn to amber dusk.',
      atmosphere: 'The elevated elevation captures constant countryside breezes rustling through surrounding neem canopies, creating an atmosphere of total seclusion.',
      architecture: 'Exposed dark timber rafters celebrate colonial vernacular craft, accented by custom brass fixtures and oversized linen-draped windows that frame living landscapes.',
    },
    paletteMaterials: [
      { name: 'Aravalli Quartz', hex: '#C2B8A3', desc: 'Weathered hillside stone tones' },
      { name: 'Antique Brass', hex: '#B89B6C', desc: 'Hand-burnished fixtures & latches' },
      { name: 'Deep Cypress', hex: '#142019', desc: 'Exterior balustrades & rafters' },
      { name: 'Raw Linen', hex: '#EBE5D8', desc: 'Unbleached natural drapery fabrics' },
    ],
    amenitiesByCategory: [
      {
        category: 'Sleep & Comfort',
        items: [
          { name: 'King-Size Master Bed', detail: 'Plush pocket-spring with down topper' },
          { name: 'Private Sunset Terrace', detail: 'Bespoke wrought-iron seating for two' },
          { name: 'Blackout Linen Drapery', detail: 'Triple-pass thermal acoustic curtains' },
        ],
      },
      {
        category: 'Artisanal Refreshment',
        items: [
          { name: 'Pour-Over Coffee Rig', detail: 'Locally roasted artisanal coffee beans' },
          { name: 'Handcrafted Cocktail Kit', detail: 'Brass shaker, glassware & botanical syrups' },
          { name: 'Chilled Spring Water Decanter', detail: 'Replenished twice daily with fresh mint' },
        ],
      },
      {
        category: 'Technology & Sound',
        items: [
          { name: 'Marshall Acton II', detail: 'Rich analog stereo sound with brass knobs' },
          { name: 'Smart Climate Zoning', detail: 'Independent temperature control in room & bath' },
          { name: 'Reading Nook with USB-C', detail: 'Integrated discreet charging ports' },
        ],
      },
    ],
    floorPlanMetrics: {
      bedroomM2: 23.2,
      bathroomM2: 9.52,
      outdoorM2: 22.0,
      ceilingMeters: 4.1,
    },
    galleryImages: [
      { src: '/images/room-aravalli-terrace.jpg', alt: 'Aravalli Suite & Terrace', caption: 'Master suite interior overlooking the private mountain terrace' },
      { src: '/images/room-aravalli-terrace-view.jpg', alt: 'Private Stone Balcony & Sunset Vistas', caption: 'Balcony bistro seating framing the pool and sunset over the Aravalli range' },
      { src: '/images/room-aravalli-bathroom.jpg', alt: 'Green Marble En-Suite Sanctuary', caption: 'Bespoke marble rain shower sanctuary with handcrafted brass fittings' },
    ],
  },

  'lush-green-facing-view': {
    slug: 'lush-green-facing-view',
    keyNumber: 'Key 04 • First Floor',
    tagline: 'Canopy Height Vistas & 180° Panoramic Lawn Horizon',
    heroSubtitle: 'An elevated tree-level suite presenting uninterrupted green vistas across the 1-acre central lawn and heritage foliage.',
    compassOrientation: 'North-East Facing • Gentle Morning Amber Glow',
    ceilingHeight: '4.1 m (13.5 ft) Exposed Timber Beam',
    flooringMaterial: 'Smoked White Oak Planks & Brass Inlays',
    outdoorSpaceDesc: '16 m² Shaded Upper Loggia with woven armchairs',
    enSuiteSpecs: {
      surface: 'Travertine Marble & Matte Cypress Joinery',
      showerType: 'Concealed Dual-Head Rain Shower',
      toiletries: 'Forest Essentials Sandalwood & Turmeric',
      features: ['Louvered privacy shutters over garden views', 'Custom stone vessel sink', 'Linen laundry valet hamper'],
    },
    narrative: {
      intro: 'Nestled on the first floor at tree-canopy level, Key 04 feels like an elegant French-colonial treehouse retreat. The room commands a seamless 180-degree vista of the estate’s emerald 1-acre lawn and heritage oak canopies.',
      atmosphere: 'Awaken to the sound of wind whispering through high branches and dappled sunlight dancing across custom linen walls. A true retreat from urban density.',
      architecture: 'Smoked oak flooring with hand-inlaid brass strips guides you toward a private loggia where you can watch evening shadows lengthen across the estate.',
    },
    paletteMaterials: [
      { name: 'Forest Moss', hex: '#4A5B49', desc: 'Canopy leaves in twilight' },
      { name: 'Warm Travertine', hex: '#E7DEC8', desc: 'Italian honed bathroom marble' },
      { name: 'Polished Brass', hex: '#C5A880', desc: 'Inlaid threshold trims & lamps' },
      { name: 'Soft Alabaster', hex: '#FBF9F5', desc: 'Interior breathable lime wash' },
    ],
    amenitiesByCategory: [
      {
        category: 'Sleep & Comfort',
        items: [
          { name: 'King-Size Master Bed', detail: 'High-thread Belgian flax linen ensemble' },
          { name: 'Shaded Upper Loggia', detail: 'Private elevated overlook of central lawn' },
          { name: 'Acoustic Soundproofing', detail: 'Double-glazed French windows for absolute silence' },
        ],
      },
      {
        category: 'Artisanal Refreshment',
        items: [
          { name: 'Artisanal Tea Atelier', detail: 'Darjeeling first flush & Nilgiri frost teas' },
          { name: 'Bean-to-Cup Espresso', detail: 'Specialty Italian machine with porcelain cups' },
          { name: 'Evening Herbal Elixirs', detail: 'Turndown saffron & cardamom infusions' },
        ],
      },
      {
        category: 'Technology & Sound',
        items: [
          { name: 'Marshall Speaker System', detail: 'Custom multi-room audio pairing' },
          { name: 'Ergonomic Reading Armchair', detail: 'Handcrafted leather reading chair & footrest' },
          { name: 'High-Speed Fiber Wi-Fi', detail: 'Seamless connectivity for creative deep work' },
        ],
      },
    ],
    floorPlanMetrics: {
      bedroomM2: 19.8,
      bathroomM2: 7.79,
      outdoorM2: 16.0,
      ceilingMeters: 4.1,
    },
    galleryImages: [
      { src: '/images/room-lush-green.jpg', alt: 'Lush Green Suite Interior', caption: 'Elevated bedroom suite framing verdant treetop canopies' },
      { src: '/images/room-lush-green-loggia.jpg', alt: 'Upper Shaded Loggia Overlook', caption: 'Woven cane armchairs overlooking the 1-acre central emerald lawn' },
      { src: '/images/estate-heritage-grounds.jpg', alt: '1-Acre Central Lawn', caption: 'The expansive emerald grounds visible from your upper loggia' },
    ],
  },
};
