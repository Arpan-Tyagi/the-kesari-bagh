-- Supabase PostgreSQL Migration for The Kesari Bagh
-- Ultra-Luxury French-Colonial Countryside Estate Booking Platform
-- Architecture: 4 Keys (Max 16 Guests Estate Capacity)
-- Manesar, Gurugram, Haryana

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ROOMS TABLE
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    floor_level TEXT NOT NULL CHECK (floor_level IN ('Ground', 'First')),
    square_meters NUMERIC(6, 2) NOT NULL,
    square_footage NUMERIC(6, 2) NOT NULL,
    max_occupancy INTEGER NOT NULL DEFAULT 4,
    bed_type TEXT NOT NULL DEFAULT 'King Size',
    view_type TEXT NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    weekend_price NUMERIC(10, 2) NOT NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AMENITIES TABLE
CREATE TABLE IF NOT EXISTS public.amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'room', -- 'room', 'estate', 'bathroom', 'refreshment'
    icon_name TEXT NOT NULL DEFAULT 'Sparkles',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    min_booking_amount NUMERIC(10, 2) DEFAULT 0,
    max_discount_amount NUMERIC(10, 2),
    usage_limit INTEGER DEFAULT 100,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BOOKINGS TABLE WITH EXCLUSION CONSTRAINT
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_code TEXT NOT NULL UNIQUE,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    guests_count INTEGER NOT NULL DEFAULT 2,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    room_rate_per_night NUMERIC(10, 2) NOT NULL,
    nights_count INTEGER NOT NULL,
    addons_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_price NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled')),
    coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
    special_requests TEXT,
    whatsapp_notified BOOLEAN NOT NULL DEFAULT false,
    email_notified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_date_range CHECK (check_out > check_in),
    EXCLUDE USING gist (room_id WITH =, daterange(check_in, check_out, '[)') WITH &&) WHERE (status != 'cancelled')
);

-- BOOKING ADDONS TABLE
CREATE TABLE IF NOT EXISTS public.booking_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EVENT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.event_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('intimate_wedding', 'corporate_retreat', 'celebration', 'video_shoot', 'farm_picnic')),
    guest_count INTEGER NOT NULL,
    preferred_date DATE NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BLOGS / ESTATE DISPATCHES TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    author_name TEXT NOT NULL DEFAULT 'The Estate Concierge',
    published BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CHAT SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_identifier TEXT NOT NULL,
    guest_name TEXT,
    guest_phone TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'escalated', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('guest', 'ai', 'concierge')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROW LEVEL SECURITY CONFIGURATION
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Allow public read access on rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Allow public read access on amenities" ON public.amenities FOR SELECT USING (true);
CREATE POLICY "Allow public read access on active coupons" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access on published blogs" ON public.blogs FOR SELECT USING (published = true);

-- GUEST ACCESS POLICIES
CREATE POLICY "Allow guest insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow guest insert booking addons" ON public.booking_addons FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow guest insert inquiries" ON public.event_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow guest access to chat sessions" ON public.chat_sessions FOR ALL USING (true);
CREATE POLICY "Allow guest access to chat messages" ON public.chat_messages FOR ALL USING (true);

-- ADMIN FULL ACCESS POLICIES (EVALUATING CUSTOM CLAIMS ROLE)
CREATE POLICY "Admin full access on rooms" ON public.rooms FOR ALL USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
);
CREATE POLICY "Admin full access on amenities" ON public.amenities FOR ALL USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
);
CREATE POLICY "Admin full access on coupons" ON public.coupons FOR ALL USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
);
CREATE POLICY "Admin full access on bookings" ON public.bookings FOR ALL USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
);
CREATE POLICY "Admin full access on inquiries" ON public.event_inquiries FOR ALL USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
);
CREATE POLICY "Admin full access on blogs" ON public.blogs FOR ALL USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
);

-- SEED DATA: THE 4 AUTHENTIC KEYS OF THE KESARI BAGH
INSERT INTO public.rooms (
    slug, name, description, short_description, floor_level, 
    square_meters, square_footage, max_occupancy, bed_type, view_type, 
    base_price, weekend_price, images
) VALUES
(
    'garden-facing-pool-view',
    'Luxury Garden Facing Pool View Room',
    'Located gracefully on the ground floor with a private sit-out lawn overlooking our azure swimming pool. Features high French doors that welcome morning dew, polished teakwood furnishings, and direct lawn stroll access.',
    'Ground floor sanctuary with private sit-out lawn opening to the pool.',
    'Ground',
    30.56,
    328.90,
    4,
    'King Size Master Bed',
    'Private Garden & Azure Pool',
    15000.00,
    18000.00,
    '["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80", "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80"]'::jsonb
),
(
    'aravalli-facing-pool-view',
    'Luxury Aravalli Facing Pool View Room',
    'Commanding the first floor, this premier suite boasts an expansive private stone terrace framing the majestic Aravalli mountain range and reflective swimming pool. Crafted with soaring ceiling lines and brass detailing.',
    'First floor elevated master suite with private Aravalli view terrace.',
    'First',
    32.72,
    352.20,
    4,
    'King Size Master Bed',
    'Aravalli Mountain Range & Pool',
    18000.00,
    22000.00,
    '["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=80", "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1600&q=80"]'::jsonb
),
(
    'kitchen-garden-facing-view',
    'Luxury Kitchen Garden Facing View Room',
    'A peaceful ground floor haven opening directly onto our 1-acre manicured lawns and organic kitchen gardens. Awaken to fragrant herbs, neem boughs, and gentle countryside birdsong with French sash windows.',
    'Ground floor botanical retreat directly adjoining organic kitchen flora.',
    'Ground',
    27.59,
    297.00,
    4,
    'King Size Master Bed',
    'Organic Kitchen Garden & Flora',
    14000.00,
    17000.00,
    '["https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=80", "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=80"]'::jsonb
),
(
    'lush-green-facing-view',
    'Luxury Lush Green Facing View Room',
    'Perched on the first floor, offering sweeping 180-degree panoramic vistas over ancient neem groves and manicured countryside lawns. Finished with curated art pieces, warm brass accents, and serene private sit-outs.',
    'First floor panoramic retreat with sweeping canopy views over countryside lawns.',
    'First',
    27.59,
    297.00,
    4,
    'King Size Master Bed',
    'Panoramic Estate Canopies & Greenery',
    16000.00,
    19500.00,
    '["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=80", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80"]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- SEED DATA: PROMOTIONAL COUPONS
INSERT INTO public.coupons (
    code, discount_type, discount_value, valid_from, valid_until, min_booking_amount, usage_limit, is_active
) VALUES
('BAGH15', 'percentage', 15.00, NOW() - INTERVAL '10 days', NOW() + INTERVAL '120 days', 14000.00, 50, true),
('MONSOON20', 'percentage', 20.00, NOW() - INTERVAL '5 days', NOW() + INTERVAL '90 days', 25000.00, 30, true),
('ESTATE5000', 'fixed', 5000.00, NOW() - INTERVAL '5 days', NOW() + INTERVAL '180 days', 30000.00, 25, true)
ON CONFLICT (code) DO NOTHING;

-- SEED DATA: EDITORIAL BLOG DISPATCHES
INSERT INTO public.blogs (
    slug, title, excerpt, content, cover_image, author_name, published
) VALUES
(
    'french-colonial-charm-in-manesar',
    'The Architectural Symphony of French Colonial Heritage at The Kesari Bagh',
    'Discover how symmetry, brass hairlines, and French crystal chandeliers meet the ancient whispers of the Aravalli range in Manesar.',
    '# The Architectural Symphony of French Colonial Heritage

Tucked gently within the folds of Manesar''s Aravalli foothills lies **The Kesari Bagh**, an intimate countryside sanctuary spread across 1.25 manicured acres.

Unlike conventional hospitality properties, The Kesari Bagh holds only **four keys**, guaranteeing unparalleled privacy for an estate capacity of no more than 16 distinguished guests.

### French Elegance Meets Countryside Solitude
Each suite is an intentional study in restraint:
- High French windows welcoming the morning mist
- Polished teak woodwork accented with brushed brass hairlines
- Private stone terraces overlooking our manicured lawns and the Aravalli horizon

Whether dining under the 12-seater crystal chandelier or watching the twilight descend over the pool, here time slows to an exquisite cadence.',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80',
    'The Estate Concierge',
    true
),
(
    'encounter-with-elly-marwari-heritage',
    'Elly: The Majestic Marwari Bloodline of The Kesari Bagh',
    'Standing 6ft 7in with distinctive inward-curling ears, meet Elly—our resident Marwari bloodline mare and estate symbol.',
    '# Elly: The Spirit of the Aravallis

At The Kesari Bagh, mornings are punctuated by the rhythmic hoofbeats of **Elly**, our magnificent 6ft 7in black Marwari mare. 

Distinguished by the lyrical inward-curving lyre-shaped ears that define pure Marwari lineage, Elly represents centuries of royal equestrian heritage. Guests are invited to participate in sunrise grooming sessions, serene paddock walks, and equestrian portraiture against the backdrop of ancient neem trees.',
    'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1600&q=80',
    'The Equestrian Master',
    true
)
ON CONFLICT (slug) DO NOTHING;
