// Ground Floor Architectural Suite Specifications (Key 01 & Key 03)
import { RoomDetailSpec } from '@/types/room-details';

export const GROUND_FLOOR_SPECS: Record<string, RoomDetailSpec> = {
  'garden-facing-pool-view': {
    slug: 'garden-facing-pool-view',
    keyNumber: 'Key 01 • Ground Floor',
    tagline: 'Private Lawn Walkout & Azure Pool Reflections',
    heroSubtitle: 'A tranquil ground-level sanctuary opening directly onto manicured lawns with French double doors and azure poolside vistas.',
    compassOrientation: 'East-Facing • Morning Sunrise',
    ceilingHeight: '3.8 m (12.5 ft) French Vaulted',
    flooringMaterial: 'Hand-Cast Terrazzo & Reclaimed Teakwood',
    outdoorSpaceDesc: '18 m² Private Sit-Out Lawn with cane lounging chairs',
    enSuiteSpecs: {
      surface: 'Italian Statuario Marble & Brass Fixtures',
      showerType: 'Thermostatic Ceiling Rain Shower',
      toiletries: 'Forest Essentials Ayurvedic Botanicals',
      features: ['Twin vanities with backlit mirrors', 'Water closet in acoustic frosted glass', 'Plush waffle-weave bathrobes & linen slippers'],
    },
    narrative: {
      intro: 'Key 01 captures the quiet grandeur of European country manors transposed to the Aravalli foothills. Step directly from your king-size bed through restored French louvered doors onto your private dew-kissed lawn.',
      atmosphere: 'Mornings here are accompanied by the gentle murmurs of birdsong and the shimmering reflection of sunlight dancing on the swimming pool just steps away.',
      architecture: 'Vaulted 12.5-foot ceilings give the suite an airy spatial resonance, balanced by warm natural cane headboards, hand-finished brass lamps, and tactile raw silk cushions.',
    },
    paletteMaterials: [
      { name: 'Warm Alabaster', hex: '#FBF9F5', desc: 'Lime-washed heritage lime plaster' },
      { name: 'Polished Brass', hex: '#C5A880', desc: 'Handcrafted drawer pulls & fixtures' },
      { name: 'Deep Cypress', hex: '#142019', desc: 'Lacquered woodwork & window lintels' },
      { name: 'Aravalli Stone', hex: '#D8CEBE', desc: 'Local quartzite terrace flagstones' },
    ],
    amenitiesByCategory: [
      {
        category: 'Sleep & Comfort',
        items: [
          { name: 'King-Size Master Bed', detail: '400-thread count Egyptian cotton' },
          { name: 'Hypoallergenic Pillow Menu', detail: 'Firm goose down and memory foam options' },
          { name: 'Reversible VRV Climate', detail: 'Whisper-quiet Daikin cooling & heating' },
        ],
      },
      {
        category: 'Artisanal Refreshment',
        items: [
          { name: 'Nespresso Vertuo Bar', detail: 'Single-origin reserve capsules' },
          { name: 'Aravalli Herbal Infusions', detail: 'Bespoke brass kettle & loose leaf teas' },
          { name: 'Gourmet Refreshment Cabinet', detail: 'Curated organic snacks & cold presses' },
        ],
      },
      {
        category: 'Technology & Sound',
        items: [
          { name: 'Marshall Kilburn II', detail: 'Multi-directional Bluetooth acoustic audio' },
          { name: 'Dedicated Fiber Internet', detail: '300 Mbps symmetrical high-speed Wi-Fi' },
          { name: 'Teak Bureau Workspace', detail: 'Universal power and brass desk illumination' },
        ],
      },
    ],
    floorPlanMetrics: {
      bedroomM2: 21.5,
      bathroomM2: 9.06,
      outdoorM2: 18.0,
      ceilingMeters: 3.8,
    },
    galleryImages: [
      { src: '/images/room-garden-pool.jpg', alt: 'Suite Bedroom & Pool View', caption: 'Interior view looking towards the private poolside lawn' },
      { src: '/images/room-garden-pool-bathroom.jpg', alt: 'Italian Marble En-Suite Bath', caption: 'Handcrafted stone basin and brushed brass rain shower' },
      { src: '/images/dining-openair-courtyard.jpg', alt: 'Open-Air Verandah', caption: 'Evening courtyard ambience adjacent to the pool pavilion' },
    ],
  },

  'kitchen-garden-facing-view': {
    slug: 'kitchen-garden-facing-view',
    keyNumber: 'Key 03 • Ground Floor',
    tagline: 'Botanical Harmony & Fragrant Kitchen Garden Borders',
    heroSubtitle: 'A grounded pastoral haven immersed in organic rosemary, lemongrass, and citrus orchards with French sash windows.',
    compassOrientation: 'North-West Facing • Soft Filtered Sunlight',
    ceilingHeight: '3.8 m (12.5 ft) French Vaulted',
    flooringMaterial: 'Warm Terracotta Tile & Reclaimed Teakwood',
    outdoorSpaceDesc: '15 m² Private Garden Verandah with heritage planter chairs',
    enSuiteSpecs: {
      surface: 'Olive Glazed Zellige & Aged Copper Accents',
      showerType: 'Rainforest Walk-In Shower with Skylight',
      toiletries: 'Pure Eucalyptus & Lemongrass Botanicals',
      features: ['Natural stone basin hand-carved in Rajasthan', 'Direct garden view through privacy fluting', 'Organic cotton bath sheets'],
    },
    narrative: {
      intro: 'Immersed in the living kitchen garden of the estate, Key 03 is an ode to botanical tranquility. Step directly outside to the fragrant aroma of wild mint, rosemary, and seasonal heirloom vegetables cultivated for the estate kitchen.',
      atmosphere: 'The atmosphere is deeply soothing, sheltered by ancient neem canopies that maintain a cool microclimate throughout sunlit afternoons.',
      architecture: 'Terracotta tile floors stay naturally cool underfoot, paired with gentle sage textiles and handcrafted botanical illustrations from regional naturalists.',
    },
    paletteMaterials: [
      { name: 'Sage Leaf', hex: '#8F9A82', desc: 'Inspired by kitchen garden flora' },
      { name: 'Terracotta', hex: '#BF6C48', desc: 'Kiln-fired earthenware floor tiles' },
      { name: 'Polished Brass', hex: '#C5A880', desc: 'Hardware & luminaire details' },
      { name: 'Bleached Oak', hex: '#E3DAC9', desc: 'Hand-planed wardrobe joinery' },
    ],
    amenitiesByCategory: [
      {
        category: 'Sleep & Comfort',
        items: [
          { name: 'King-Size Master Bed', detail: 'Organic botanical-dyed bed linens' },
          { name: 'Garden Sit-Out Verandah', detail: 'Shaded morning tea nook overlooking herbs' },
          { name: 'Aroma Diffuser Service', detail: 'Estate-distilled lemongrass essential oil' },
        ],
      },
      {
        category: 'Artisanal Refreshment',
        items: [
          { name: 'Estate Herbal Tea Bar', detail: 'Garden-picked chamomile and fresh mint' },
          { name: 'French Press & Grinder', detail: 'Estate blend coffee beans with local jaggery' },
          { name: 'Fresh Farm Produce Basket', detail: 'Seasonal fruit from the estate orchards' },
        ],
      },
      {
        category: 'Wellness & Mindfulness',
        items: [
          { name: 'Natural Jute Yoga Mat', detail: 'Complimentary for private lawn practice' },
          { name: 'Curated Botany Library', detail: 'Volumes on Aravalli flora and Ayurvedic herbs' },
          { name: 'Sound Therapy Speaker', detail: 'Preloaded nature soundscapes & acoustic warmth' },
        ],
      },
    ],
    floorPlanMetrics: {
      bedroomM2: 19.5,
      bathroomM2: 8.09,
      outdoorM2: 15.0,
      ceilingMeters: 3.8,
    },
    galleryImages: [
      { src: '/images/room-kitchen-garden.jpg', alt: 'Kitchen Garden Suite', caption: 'Restful bedroom sanctuary with sash windows framing organic gardens' },
      { src: '/images/room-kitchen-garden-verandah.jpg', alt: 'Botanical Garden Verandah', caption: 'Private terracotta verandah overlooking fragrance herbs and citrus trees' },
      { src: '/images/dining-farm-picnic.jpg', alt: 'Estate Garden Grounds', caption: 'The vibrant organic kitchen garden surrounding the suite perimeter' },
    ],
  },
};
