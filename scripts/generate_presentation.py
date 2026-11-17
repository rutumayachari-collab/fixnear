import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path="FixNear_Presentation.pptx"):
    prs = Presentation()
    # 16:9 Widescreen: 13.333 x 7.5 inches
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # blank layout

    # Color Palette: FixNear SaaS Branding
    NAVY = RGBColor(11, 31, 58)      # #0B1F3A - Primary Deep Navy
    SLATE = RGBColor(30, 41, 59)     # #1E293B - Secondary Dark
    EMERALD = RGBColor(16, 185, 129) # #10B981 - Accent Green (Verified / Calling)
    GOLD = RGBColor(245, 158, 11)    # #F59E0B - Highlight Amber
    LIGHT_BG = RGBColor(248, 248, 245) # #F8F8F5 - Off-White
    WHITE = RGBColor(255, 255, 255)
    MUTED = RGBColor(100, 116, 139)   # #64748B - Gray
    CARD_BORDER = RGBColor(226, 232, 240)

    def add_header(slide, title_text, category_tag="FIXNEAR — INNOVATION PROJECT"):
        # Top banner tag
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.5), Inches(0.35))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        tf_tag.margin_left = tf_tag.margin_top = tf_tag.margin_right = tf_tag.margin_bottom = 0
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = category_tag.upper()
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = EMERALD

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.5), Inches(0.7))
        tf = title_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(26)
        p.font.bold = True
        p.font.color.rgb = NAVY

    def add_card(slide, left, top, width, height, bg_color=WHITE, border_color=CARD_BORDER):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.5)
        return shape

    # ==========================================
    # SLIDE 1: Title Slide (Dark Navy Background)
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = NAVY
    bg1.line.fill.background()

    # Title card content
    tbox = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(11), Inches(4.5))
    tf1 = tbox.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "ACADEMIC INNOVATION & FULL-STACK PRODUCT"
    p0.font.size = Pt(14)
    p0.font.bold = True
    p0.font.color.rgb = EMERALD
    p0.space_after = Pt(14)

    p1 = tf1.add_paragraph()
    p1.text = "FixNear: Local Repair & Service Finder"
    p1.font.size = Pt(40)
    p1.font.bold = True
    p1.font.color.rgb = WHITE
    p1.space_after = Pt(14)

    p2 = tf1.add_paragraph()
    p2.text = "A Hyperlocal, 0% Commission Home Services Marketplace for Indian Households"
    p2.font.size = Pt(20)
    p2.font.color.rgb = RGBColor(203, 213, 225)
    p2.space_after = Pt(36)

    p3 = tf1.add_paragraph()
    p3.text = "Key Highlights: OpenStreetMap + Leaflet • Haversine Proximity • 6-Digit PIN Ranking • RFC 3966 Calling • 0% Commission"
    p3.font.size = Pt(13)
    p3.font.color.rgb = GOLD

    s1.notes_slide.notes_text_frame.text = (
        "Speaking Script:\n"
        "Good morning respected professor and evaluators. Today we present our Innovation project: FixNear — Local Repair & Service Finder. "
        "FixNear is a production-grade full-stack web application designed to solve the everyday challenges Indian households face when finding trusted, "
        "affordable, and nearby home repair technicians with zero platform commission."
    )

    # ==========================================
    # SLIDE 2: Problem Statement
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "The Real-Life Problem: Urban Home Repairs in India", "PROBLEM STATEMENT & MOTIVATION")

    # Card 1: Consumer Challenges
    add_card(s2, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2))
    b1 = s2.shapes.add_textbox(Inches(1.1), Inches(1.9), Inches(5.0), Inches(4.6))
    tf = b1.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🏠 Challenges for Indian Households"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = NAVY
    p.space_after = Pt(14)

    bullets1 = [
        ("Arbitrary & Hidden Pricing", "No upfront price benchmarks; customers are often overcharged upon arrival."),
        ("Expensive Aggregators", "Platforms charge heavy booking overheads & force bundled expensive packages."),
        ("Long Waiting Times", "Technicians dispatched from 15–20 km away across congested Indian traffic."),
        ("Telemarketing Spam", "Directories like Justdial sell numbers to telemarketers instead of direct booking.")
    ]
    for title, desc in bullets1:
        p = tf.add_paragraph()
        p.text = f"• {title}: "
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = SLATE
        run = p.add_run()
        run.text = desc
        run.font.bold = False
        run.font.size = Pt(12)
        p.space_after = Pt(10)

    # Card 2: Worker Challenges
    add_card(s2, Inches(6.8), Inches(1.6), Inches(5.6), Inches(5.2))
    b2 = s2.shapes.add_textbox(Inches(7.1), Inches(1.9), Inches(5.0), Inches(4.6))
    tf2 = b2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "🔧 Challenges for Local Informal Helpers"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = NAVY
    p.space_after = Pt(14)

    bullets2 = [
        ("Extractive Platform Fees", "Commercial apps deduct 20% to 30% commission from technician visit earnings."),
        ("Delayed Payouts", "Technicians wait days or weeks for platform account reconciliations and disbursements."),
        ("Complex English Apps", "Overly complicated digital workflows alienate non-English fluent informal workers."),
        ("Lost Direct Client Ties", "Aggregators hide customer contacts, preventing repeat neighborhood relationships.")
    ]
    for title, desc in bullets2:
        p = tf2.add_paragraph()
        p.text = f"• {title}: "
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = SLATE
        run = p.add_run()
        run.text = desc
        run.font.bold = False
        run.font.size = Pt(12)
        p.space_after = Pt(10)

    s2.notes_slide.notes_text_frame.text = (
        "Speaking Script:\n"
        "In Indian cities, getting a leaking pipe or short-circuited switch repaired is stressful. Aggregators take up to 30% from workers "
        "and overcharge customers, while traditional directories flood users with spam. FixNear directly addresses these fundamental pain points."
    )

    # ==========================================
    # SLIDE 3: The Solution — FixNear
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "The FixNear Solution: 5 Core Innovation Pillars", "PRODUCT VALUE PROPOSITION")

    cards3 = [
        ("0% Platform Commission", "Workers keep 100% of visit charges. FixNear serves as an open discovery network.", Inches(0.8), Inches(1.6)),
        ("Dual-Mode Proximity Engine", "Combines Haversine GPS distance (km) with instant Indian 6-digit PIN-code filtering.", Inches(6.8), Inches(1.6)),
        ("India-First Experience", "Prices in ₹ (INR), strict 10-digit mobile check (/^[6-9]\\d{9}$/), and 'Namaste! 🙏' Worker UI.", Inches(0.8), Inches(4.3)),
        ("Zero Paid API Dependencies", "Powered by OpenStreetMap, Leaflet & HTML5 Geolocation — zero ongoing Google Maps API bills.", Inches(6.8), Inches(4.3)),
    ]
    for title, desc, left, top in cards3:
        add_card(s3, left, top, Inches(5.6), Inches(2.4))
        tb = s3.shapes.add_textbox(left + Inches(0.3), top + Inches(0.3), Inches(5.0), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = NAVY
        p.space_after = Pt(6)
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(13)
        p2.font.color.rgb = SLATE

    s3.notes_slide.notes_text_frame.text = (
        "Speaking Script:\n"
        "FixNear provides five core innovations: 0% platform commission, dual-mode proximity via GPS and PIN codes, "
        "India-first localization in Rupees, zero paid API dependencies using OpenStreetMap, and direct phone-dialer calling."
    )

    # ==========================================
    # SLIDE 4: Competitive Analysis Table
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "Competitive Matrix: Why FixNear Outperforms Aggregators", "MARKET ANALYSIS")

    # Table: 6 rows, 4 columns
    rows, cols = 6, 4
    left, top, width, height = Inches(0.8), Inches(1.6), Inches(11.7), Inches(5.2)
    tbl_shape = s4.shapes.add_table(rows, cols, left, top, width, height)
    tbl = tbl_shape.table

    tbl.columns[0].width = Inches(2.7)
    tbl.columns[1].width = Inches(3.0)
    tbl.columns[2].width = Inches(3.0)
    tbl.columns[3].width = Inches(3.0)

    headers = ["Feature / Metric", "Commercial Apps (Urban Co)", "Business Directories (Justdial)", "FixNear (Our Innovation)"]
    for col_idx, h_text in enumerate(headers):
        cell = tbl.cell(0, col_idx)
        cell.text = h_text
        cell.fill.solid()
        cell.fill.fore_color.rgb = NAVY
        p = cell.text_frame.paragraphs[0]
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER

    data = [
        ["Commission Fee", "20% to 30% deducted", "High lead-generation fees", "0% Commission (100% to Worker)"],
        ["Pricing Model", "Bundled premium packages", "No pricing clarity", "Transparent starting rate in ₹"],
        ["Location Engine", "Paid Google Maps APIs", "Coarse city-level text", "OpenStreetMap + 6-digit PIN ranking"],
        ["Worker Interface", "Heavy English corporate app", "Manual SMS lead spam", "Simple 'Namaste!' mobile portal"],
        ["Calling Integration", "Cloud PBX / Call masking", "Uncontrolled telemarketing", "RFC 3966 Native OS Dialer (Free)"]
    ]

    for row_idx, row_data in enumerate(data, start=1):
        for col_idx, val in enumerate(row_data):
            cell = tbl.cell(row_idx, col_idx)
            cell.text = val
            cell.fill.solid()
            if col_idx == 3:
                cell.fill.fore_color.rgb = RGBColor(236, 253, 245) # Light emerald
            else:
                cell.fill.fore_color.rgb = RGBColor(248, 250, 252) if row_idx % 2 == 0 else WHITE
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(12)
            if col_idx == 0:
                p.font.bold = True
                p.font.color.rgb = NAVY
            elif col_idx == 3:
                p.font.bold = True
                p.font.color.rgb = RGBColor(4, 120, 87) # Dark emerald
            else:
                p.font.color.rgb = SLATE

    s4.notes_slide.notes_text_frame.text = (
        "Speaking Script:\n"
        "Here is our competitive comparison. Unlike corporate aggregators taking 20-30% cuts, FixNear charges 0% commission. "
        "And unlike Justdial which spams users with marketing calls, FixNear enables direct one-touch booking and native dialer calling."
    )

    # ==========================================
    # SLIDE 5: Full-Stack Architecture
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "System Architecture: Unified Single-Origin Design", "FULL-STACK ENGINEERING")

    col_w = Inches(3.6)
    c1 = add_card(s5, Inches(0.8), Inches(1.6), col_w, Inches(5.2))
    c2 = add_card(s5, Inches(4.8), Inches(1.6), col_w, Inches(5.2))
    c3 = add_card(s5, Inches(8.8), Inches(1.6), col_w, Inches(5.2))

    tiers = [
        ("Client Tier (Frontend)", Inches(0.8), [
            "React 19 + TypeScript: Reactive state & zero runtime type bugs",
            "Vite 8: Rollup bundling producing minified assets in dist/",
            "React Router v7: Smooth client routing without full page reload",
            "Tailwind CSS v4: Mobile-responsive Navy & Off-White SaaS theme",
            "Leaflet 1.9 + OSM: Free map markers & interactive popups",
            "React Error Boundary: Traps runtime crashes with friendly recovery"
        ]),
        ("Server Tier (Backend)", Inches(4.8), [
            "Node.js v24 + Express 5: High-concurrency event-driven API",
            "Unified Single Origin: Express hosts both /dist and /api/* on 5001",
            "Haversine & PIN Engine: Mathematical proximity ranking",
            "Bcrypt.js: Salting & hashing passwords (10 rounds)",
            "JWT & HTTP-Only Cookies: Protected worker & admin sessions",
            "SPA Fallback Middleware: Serves index.html on deep refreshes"
        ]),
        ("Data & Telephony Tier", Inches(8.8), [
            "Dual Persistence Engine: JSON atomic file storage + Mongo adapter",
            "Real-time Sync: State synchronized across concurrent sessions",
            "Indian Schema Validation: 10-digit mobile & 6-digit PIN regex",
            "RFC 3966 Telephony: Native tel: URI scheme triggers device dialer",
            "Cloudflare Edge Tunnel: Secure HTTPS public origin with zero open router ports"
        ])
    ]

    for title, left, items in tiers:
        tb = s5.shapes.add_textbox(left + Inches(0.3), Inches(1.9), col_w - Inches(0.6), Inches(4.6))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = NAVY
        p.space_after = Pt(14)

        for item in items:
            p = tf.add_paragraph()
            parts = item.split(": ")
            p.text = f"• {parts[0]}: "
            p.font.bold = True
            p.font.size = Pt(11)
            p.font.color.rgb = SLATE
            if len(parts) > 1:
                run = p.add_run()
                run.text = parts[1]
                run.font.bold = False
            p.space_after = Pt(8)

    s5.notes_slide.notes_text_frame.text = (
        "Speaking Script:\n"
        "FixNear employs a robust 3-tier architecture. A major engineering highlight is our Unified Single-Origin deployment: "
        "Express 5 serves both the compiled React frontend and the REST API from port 5001. This completely eliminates CORS issues, "
        "cross-domain cookie errors, and multiple domain maintenance."
    )

    # ==========================================
    # SLIDE 6: Haversine Formula & Discovery Algorithm
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Proximity Engine: Haversine Algorithm & PIN Ranking", "CORE ALGORITHMS & MATHEMATICS")

    # Left box: Haversine Math
    add_card(s6, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2))
    tb_l = s6.shapes.add_textbox(Inches(1.1), Inches(1.9), Inches(5.0), Inches(4.6))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True
    p = tf_l.paragraphs[0]
    p.text = "📐 Haversine Great-Circle Formula"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = NAVY
    p.space_after = Pt(10)

    math_text = [
        ("Curvature of the Earth", "Flat Euclidean distance sqrt(dx^2 + dy^2) is inaccurate on Earth. Haversine calculates true spherical distance."),
        ("Delta Latitude & Longitude", "Δlat = (lat2 - lat1) * π / 180\nΔlon = (lon2 - lon1) * π / 180"),
        ("Angular Distance Formulation", "a = sin²(Δlat/2) + cos(lat1)·cos(lat2)·sin²(Δlon/2)\nc = 2 · atan2(√a, √(1-a))"),
        ("Surface Distance", "d = R · c  (where R = 6,371 km Earth radius)"),
        ("Result in FixNear", "Accurately calculates distance in km (e.g., Kothrud to Deccan = 3.7 km) with zero paid API calls.")
    ]
    for title, desc in math_text:
        p = tf_l.add_paragraph()
        p.text = f"• {title}: "
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = SLATE
        run = p.add_run()
        run.text = desc
        run.font.bold = False
        p.space_after = Pt(8)

    # Right box: 3-Tier Ranking
    add_card(s6, Inches(6.8), Inches(1.6), Inches(5.6), Inches(5.2))
    tb_r = s6.shapes.add_textbox(Inches(7.1), Inches(1.9), Inches(5.0), Inches(4.6))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True
    p = tf_r.paragraphs[0]
    p.text = "🎯 3-Tier Intelligent Helper Ranking"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = NAVY
    p.space_after = Pt(10)

    ranking_steps = [
        ("Tier 1: Exact PIN-Code Match", "Helpers who serve the user's specific 6-digit PIN code (e.g. 411038) are prioritized immediately."),
        ("Tier 2: Evaluator Registration Priority", "Newly registered technicians (ID: helper-xxx) are boosted to Position #1 so evaluators instantly see their created profile."),
        ("Tier 3: GPS Distance & Rating", "Providers are sorted by ascending kilometer distance and descending 5-star customer rating."),
        ("Privacy & Indoor Resilience", "If customer location is turned off or blocked, PIN-code matching ensures 100% search availability.")
    ]
    for title, desc in ranking_steps:
        p = tf_r.add_paragraph()
        p.text = f"• {title}: "
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = SLATE
        run = p.add_run()
        run.text = desc
        run.font.bold = False
        p.space_after = Pt(10)

    s6.notes_slide.notes_text_frame.text = (
        "Speaking Script:\n"
        "How does FixNear find the closest technician? Our backend computes the great-circle surface distance using the Haversine formula. "
        "Additionally, our 3-tier ranking prioritizes exact Indian 6-digit postal PIN matches. When a new helper registers during an evaluation, "
        "our algorithm automatically boosts them to Position #1 with a 'Verified Helper' badge."
    )

    # ==========================================
    # SLIDE 7: Native Calling Architecture (RFC 3966)
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "Telephony Integration: RFC 3966 Native OS Dialing", "INNOVATIVE COMMUNICATION PROTOCOL")

    cards7 = [
        ("The Standard: RFC 3966", "FixNear uses standard 'tel:' URI syntax (e.g. href='tel:+919822012345'). When clicked, browser emits an OS-level telephony protocol event.", Inches(0.8), Inches(1.6)),
        ("Android: ACTION_DIAL Intent", "Android OS creates an Intent(Intent.ACTION_DIAL, uri). Launches default phone dialer with 10-digit number pre-populated without root permissions.", Inches(6.8), Inches(1.6)),
        ("iOS: URL Scheme Handshake", "WebKit delegates the tel scheme to MobilePhone.app. Displays a native confirmation prompt to prevent accidental touch dial.", Inches(0.8), Inches(4.3)),
        ("Zero Recurring Costs", "Zero reliance on expensive cloud VoIP servers (Twilio/Exotel). Uses existing Indian unlimited cellular calling (Jio/Airtel/Vi).", Inches(6.8), Inches(4.3)),
    ]
    for title, desc, left, top in cards7:
        add_card(s7, left, top, Inches(5.6), Inches(2.4))
        tb = s7.shapes.add_textbox(left + Inches(0.3), top + Inches(0.3), Inches(5.0), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = NAVY
        p.space_after = Pt(6)
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(13)
        p2.font.color.rgb = SLATE

    s7.notes_slide.notes_text_frame.text = (
        "Speaking Script:\n"
        "Rather than paying for expensive cloud call masking, FixNear leverages the RFC 3966 telephony standard. Tapping 'Call' triggers an OS-level "
        "implicit intent on Android or URL scheme on iOS, handing the number directly to the phone's native dialer. It is 100% free, works over VoLTE "
        "even in weak data zones, and gives technicians full confidence."
    )

    # ==========================================
    # SLIDE 8: 3 Integrated Stakeholder Experiences
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Complete User Journeys: 3 Seamless Stakeholder Portals", "APPLICATION WORKFLOWS")

    journeys = [
        ("1. Customer Journey (/services)", Inches(0.8), [
            "Category & PIN Selection: Filter by Plumbing, Electrical, etc.",
            "Map Discovery: Visual Leaflet markers & starting rates in ₹",
            "Instant Booking: Describe problem & pick appointment slot",
            "Live Status Tracking: Real-time update from Requested to Completed"
        ]),
        ("2. Helper Portal (/worker)", Inches(4.8), [
            "Quick Registration: Set trade, hourly rate & PIN codes",
            "Job Feed: Real-time cards showing problem & address",
            "One-Touch Calling: Direct RFC 3966 call button to customer",
            "Lifecycle Actions: 'Accept Job' -> 'Mark Completed'"
        ]),
        ("3. Admin Console (/admin)", Inches(8.8), [
            "Platform Metrics: Real-time count of total & active bookings",
            "Helper Directory: View all registered technicians & verification",
            "Dynamic Revenue: Live calculation of completed service volume",
            "Service Management: Oversee categories & neighborhood zones"
        ])
    ]

    for title, left, steps in journeys:
        add_card(s8, left, Inches(1.6), col_w, Inches(5.2))
        tb = s8.shapes.add_textbox(left + Inches(0.3), Inches(1.9), col_w - Inches(0.6), Inches(4.6))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = NAVY
        p.space_after = Pt(14)

        for step in steps:
            p = tf.add_paragraph()
            parts = step.split(": ")
            p.text = f"• {parts[0]}: "
            p.font.bold = True
            p.font.size = Pt(12)
            p.font.color.rgb = SLATE
            if len(parts) > 1:
                run = p.add_run()
                run.text = parts[1]
                run.font.bold = False
            p.space_after = Pt(10)

    s8.notes_slide.notes_text_frame.text = (
        "Speaking Script:\n"
        "FixNear connects three key stakeholders: Customers who need urgent repairs at transparent prices, "
        "Technicians who receive direct job leads without commission cuts, and Administrators who monitor neighborhood metrics."
    )

    # ==========================================
    # SLIDE 9: Testing & Quality Assurance
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "Quality Assurance: Rigorous Automated Verification", "TESTING & RELIABILITY")

    add_card(s9, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), bg_color=RGBColor(240, 253, 244), border_color=EMERALD)
    tb_t1 = s9.shapes.add_textbox(Inches(1.1), Inches(1.9), Inches(5.0), Inches(4.6))
    tf1 = tb_t1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "✅ 97 Frontend Tests Passed (100%)"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = RGBColor(4, 120, 87)
    p.space_after = Pt(14)

    test_items1 = [
        ("Indian Currency (INR)", "Validated formatINR(199) -> ₹199 and ₹12,000 formatting."),
        ("Haversine Accuracy", "Kothrud to Deccan calculated at exactly 3.7 km."),
        ("10-Digit Mobile Regex", "Rejects invalid prefixes; accepts valid 6-9 starting digits."),
        ("6-Digit PIN Validation", "Validated against real Pune postal PIN patterns (411038)."),
        ("Smart Problem Matcher", "Translates user symptoms like 'leaking tap' to Plumbing.")
    ]
    for t_name, t_desc in test_items1:
        p = tf1.add_paragraph()
        p.text = f"✔ {t_name}: "
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = SLATE
        run = p.add_run()
        run.text = t_desc
        run.font.bold = False
        p.space_after = Pt(8)

    add_card(s9, Inches(6.8), Inches(1.6), Inches(5.6), Inches(5.2), bg_color=RGBColor(240, 253, 244), border_color=EMERALD)
    tb_t2 = s9.shapes.add_textbox(Inches(7.1), Inches(1.9), Inches(5.0), Inches(4.6))
    tf2 = tb_t2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "✅ 14 Backend API Tests Passed (100%)"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = RGBColor(4, 120, 87)
    p.space_after = Pt(14)

    test_items2 = [
        ("REST Health Check", "GET /api/health returned 200 OK with server uptime."),
        ("Helper Registration", "POST /api/auth/register-helper persists verified technician."),
        ("Position #1 PIN Discovery", "GET /api/helpers prioritizes newly registered helper on PIN 411038."),
        ("Booking State Lifecycle", "Requested -> Accepted -> Completed verified across endpoints."),
        ("Admin KPI Aggregation", "Dynamic revenue calculation validated against real bookings.")
    ]
    for t_name, t_desc in test_items2:
        p = tf2.add_paragraph()
        p.text = f"✔ {t_name}: "
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = SLATE
        run = p.add_run()
        run.text = t_desc
        run.font.bold = False
        p.space_after = Pt(8)

    s9.notes_slide.notes_text_frame.text = (
        "Speaking Script:\n"
        "Engineering excellence requires automated verification. Our project features 97 frontend unit and integration tests, "
        "and 14 backend end-to-end API tests—all running with 100% pass rates. Zero compile errors and zero runtime failures."
    )

    # ==========================================
    # SLIDE 10: Conclusion & Live Demonstration
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    bg10 = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg10.fill.solid()
    bg10.fill.fore_color.rgb = NAVY
    bg10.line.fill.background()

    tb_c = s10.shapes.add_textbox(Inches(1.0), Inches(1.0), Inches(11.3), Inches(5.5))
    tfc = tb_c.text_frame
    tfc.word_wrap = True

    p0 = tfc.paragraphs[0]
    p0.text = "CONCLUSION & LIVE DEMONSTRATION"
    p0.font.size = Pt(14)
    p0.font.bold = True
    p0.font.color.rgb = EMERALD
    p0.space_after = Pt(14)

    p1 = tfc.add_paragraph()
    p1.text = "Transforming Hyperlocal Home Maintenance"
    p1.font.size = Pt(32)
    p1.font.bold = True
    p1.font.color.rgb = WHITE
    p1.space_after = Pt(24)

    summary_bullets = [
        "Zero-Commission Social Impact: Empowers informal blue-collar workers with 100% of their earnings.",
        "Engineering Innovation: Eliminates paid APIs using OpenStreetMap, Leaflet & RFC 3966 OS calling.",
        "Production Reliability: Unified single-origin deployment with automated error boundary protection.",
        "Live Demonstration Sequence: Register Helper (411038) ➔ Instant Position #1 Discovery ➔ Book Service ➔ Worker Accept & Complete ➔ Admin KPI update."
    ]
    for b in summary_bullets:
        p = tfc.add_paragraph()
        parts = b.split(": ")
        p.text = f"✔ {parts[0]}: "
        p.font.bold = True
        p.font.size = Pt(14)
        p.font.color.rgb = GOLD
        if len(parts) > 1:
            run = p.add_run()
            run.text = parts[1]
            run.font.bold = False
            run.font.color.rgb = RGBColor(226, 232, 240)
        p.space_after = Pt(12)

    p_url = tfc.add_paragraph()
    p_url.text = "🌐 Live Unified Public Domain: https://senate-trip-rec-franchise.trycloudflare.com"
    p_url.font.size = Pt(14)
    p_url.font.bold = True
    p_url.font.color.rgb = EMERALD

    s10.notes_slide.notes_text_frame.text = (
        "Speaking Script:\n"
        "In conclusion, FixNear is a completed, production-ready full-stack application addressing real socio-economic friction in India. "
        "We are now ready to demonstrate the live application across our unified domain. Thank you!"
    )

    prs.save(output_path)
    print(f"Presentation saved successfully to {output_path}")

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "FixNear_Presentation.pptx"
    create_deck(out)
