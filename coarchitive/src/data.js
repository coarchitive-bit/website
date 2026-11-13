// Central content store. All copy is original CoArchitive material; imagery is
// Unsplash placeholder photography that should be swapped for licensed assets
// before launch. Company details are taken from the letterhead.

export const COMPANY = "CoArchitive Pvt. Ltd.";

export const TAGLINE = "Planning · Architecture · Interior · Engineering";

export const HEAD_OFFICE = {
  label: "Head Office",
  lines: [
    "4-93/5, Ground Floor, Ayyappa Nilayam",
    "Shankar Nagar Colony, Gandimaisamma",
    "Medchal Malkajgiri, Telangana 500043",
  ],
};

export const CONTACT = {
  email: "coarchitive@gmail.com",
  phone: "+91 83414 84422",
  phoneHref: "tel:+918341484422",
  linkedin: "https://www.linkedin.com/company/coarchitive/home/",
};

export const NAV = [
  { to: "architecture", label: "Architecture" },
  { to: "planning", label: "Planning" },
  { to: "home", label: "Blogs", anchor: "blogs" },
  { to: "about", label: "About" },
  { to: "careers", label: "Career" },
  { to: "contact", label: "Contact" },
];

const img = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;

// Unsplash+ images sit on a different host and keep the premium_photo- prefix.
const pimg = (id, w = 1600) =>
  `https://plus.unsplash.com/premium_photo-${id}?auto=format&fit=crop&w=${w}&q=85`;

export const EXPERTISE = [
  {
    no: "01",
    slug: "architecture-design",
    title: "Architecture & Design",
    short: "Buildings and interiors that earn their place.",
    body: "Architecture, interiors, working drawings, visualization, renovation and built-environment design — carried from concept through construction documentation.",
    img: pimg("1764385676132-73517be70353"),
  },
  {
    no: "02",
    slug: "urban-planning",
    title: "Urban & Regional Planning",
    short: "Frameworks that let cities grow coherently.",
    body: "Master plans, development plans, urban design, land-use studies and strategic planning for cities, regions and special development areas.",
    img: img("1577896695705-07e630380ab6"),
  },
  {
    no: "03",
    slug: "transportation",
    title: "Transportation & Mobility",
    short: "Movement designed as a system, not a corridor.",
    body: "Transport planning, traffic engineering, surveys, transport impact assessment, simulation and multimodal mobility strategy.",
    img: img("1519501025264-65ba15a82390"),
  },
  {
    no: "04",
    slug: "environment",
    title: "Environment & Sustainability",
    short: "Designing for the climate that is arriving.",
    body: "Environmental planning, sustainability advisory, climate resilience, water systems and solid-waste management across the project lifecycle.",
    img: pimg("1678189496886-0e568e51601b"),
  },
  {
    no: "05",
    slug: "gis",
    title: "GIS & Geospatial",
    short: "Location intelligence you can actually decide with.",
    body: "GIS, mapping, spatial analytics, remote sensing, field data collection and location intelligence built into the planning process.",
    img: img("1451187580459-43490279c0fa"),
  },
  {
    no: "06",
    slug: "digital-ai",
    title: "Digital & AI Solutions",
    short: "Software that outlives the report.",
    body: "Platforms, data analytics, AI workflows, simulation, digital twins and decision-support tools built around real operational questions.",
    img: img("1551288049-bebda4e38f71"),
  },
  {
    no: "07",
    slug: "research-advisory",
    title: "Research & Advisory",
    short: "Evidence before commitment.",
    body: "Research, feasibility studies, detailed project reports, policy advisory, technical documentation and delivery strategy.",
    img: img("1507842217343-583bb7270b66"),
  },
  {
    no: "08",
    slug: "capacity-building",
    title: "Capacity Building",
    short: "Knowledge that stays with the client.",
    body: "Training, workshops, IEC campaigns, community engagement, institutional partnerships and knowledge programs.",
    img: img("1523240795612-9a054b0db644"),
  },
];

export const STATS = [
  ["08", "Core verticals"],
  ["01", "Integrated practice"],
  ["24+", "Disciplines in-house"],
  ["∞", "Possibilities"],
];

// People — name and designation only. Qualifications and work experience
// from the brief are deliberately not shown.
//
// `photo` is a local file in public/team/. Drop the real portrait there and it
// appears automatically; until then the placeholder below shows through (both
// are stacked as CSS background layers, so a missing file simply falls back).
// See public/team/README.txt.
const portrait = (slug, fallbackId) => ({
  photo: `/team/${slug}.jpg`,
  fallback: img(fallbackId, 900),
});

const DIRECTOR_ROLE = "Director";
const MEMBER_ROLE = "Expert Member";

// quals and bio come from the client content brief (2.3). A person without a
// bio shows qualifications only; fill `bio` in when the text arrives.
export const DIRECTORS = [
  {
    name: "Aneesha Jayaram",
    role: DIRECTOR_ROLE,
    quals: ["M.Tech — Urban Planning", "B.Tech — Civil Engineering"],
    ...portrait("aneesha-jayaram", "1573496359142-b8d87734a5a2"),
  },
  {
    name: "Shreedha Lanjewar",
    role: DIRECTOR_ROLE,
    quals: ["PhD (pursuing)", "M.Plan — Environmental Planning", "B.Arch — Architecture"],
    bio: [
      "Shreedha Lanjewar is an Architect and Environmental Planner with an interdisciplinary approach to architecture, and urban planning. With experience spanning architectural practice, regional planning, infrastructure, GIS-based analysis, and research, she brings together design thinking and spatial planning to address complex urban and environmental challenges.",
      "Her work focuses on creating context-responsive solutions that connect people, places, infrastructure, and the environment. As a researcher and practitioner, she is particularly interested in sustainable development, decarbonisation, climate-responsive planning, and the integration of environmental considerations into spatial development.",
    ],
    ...portrait("shreedha-lanjewar", "1580489944761-15a19d654956"),
  },
  {
    name: "Nakka Sunny",
    role: DIRECTOR_ROLE,
    quals: ["M.Plan — Environmental Planning", "B.Tech — Civil Engineering"],
    bio: [
      "Nakka Sunny is an Environmental Planner and Civil Engineer with an interdisciplinary approach to urban development, environmental management, and sustainable infrastructure. His professional experience spans environmental planning, climate-responsive urban development, GIS and spatial analysis, infrastructure assessment, capacity building, stakeholder engagement, and project implementation.",
      "As a practitioner and project professional, he has led planning and coordination activities for large-scale capacity-building and IEC initiatives across Urban Local Bodies in Andhra Pradesh, working with municipal officials, NGOs, associations, and other stakeholders. His areas of interest include climate-resilient urban planning, environmental sustainability, geospatial planning, disaster resilience, urban climate adaptation, and sustainable waste management.",
      "With a combination of technical expertise, research experience, and project leadership, he aims to contribute to planning and development initiatives that are environmentally responsive, socially inclusive, and capable of creating long-term urban resilience.",
    ],
    ...portrait("nakka-sunny", "1560250097-0b93528c311a"),
  },
];

export const TEAM = [
  { name: "Raksha Mundhada", role: MEMBER_ROLE, ...portrait("raksha-mundhada", "1519085360753-af0119f7cbe7") },
  { name: "Ajay Sarath", role: MEMBER_ROLE, ...portrait("ajay-sarath", "1507003211169-0a1dd7228f2d") },
];

export const OFFICES = [
  {
    city: "Medchal Malkajgiri",
    region: "Head Office · Telangana",
    detail:
      "4-93/5, Ground Floor, Ayyappa Nilayam, Shankar Nagar Colony, Gandimaisamma, Medchal Malkajgiri, Telangana 500043",
    email: CONTACT.email,
  },
  {
    city: "Project Offices",
    region: "Site-based",
    detail: "Established close to the work, for the duration of the engagement.",
    email: CONTACT.email,
  },
];

export const ROLES = [
  { title: "Urban Planner", team: "Urban & Regional Planning", type: "Full-time", loc: "India" },
  { title: "Architect — Project Delivery", team: "Architecture & Design", type: "Full-time", loc: "India" },
  { title: "Transport Modeller", team: "Transportation & Mobility", type: "Full-time", loc: "India" },
  { title: "GIS Analyst", team: "GIS & Geospatial", type: "Full-time", loc: "India" },
  { title: "Full-Stack Engineer", team: "Digital & AI Solutions", type: "Full-time", loc: "Hybrid" },
  { title: "Research Associate", team: "Research & Advisory", type: "Contract", loc: "India" },
];

// ---------------------------------------------------------------------------
// Home page storytelling content.
// PLACEHOLDER: client names, figures, testimonials and FAQ answers below are
// dummy content written to show the layout. Replace them with verified
// material before launch — none of these organisations or quotes are real.
// ---------------------------------------------------------------------------

export const HOME = {
  heroWords: ["system", "region", "network", "city"],

  problem:
    // *word* is set in the italic accent face
    "Most places are planned in *pieces.* Roads by one team, land by another, data by a third — and the gaps between them are where good projects quietly *fail.*",

  // tiles that scatter, then settle into one plan as the section scrolls
  fragments: [
    { label: "Architecture", x: -260, y: -170, r: -14 },
    { label: "Planning", x: 220, y: -210, r: 10 },
    { label: "Mobility", x: -300, y: 120, r: 8 },
    { label: "Environment", x: 280, y: 150, r: -9 },
    { label: "Geospatial", x: -90, y: 260, r: 16 },
    { label: "Digital & AI", x: 130, y: -300, r: -6 },
  ],

  steps: [
    {
      no: "01",
      title: "Understand the place",
      body: "Field surveys, stakeholder sessions and spatial data are gathered into one shared evidence base before anything is drawn.",
      img: img("1451187580459-43490279c0fa", 1400),
    },
    {
      no: "02",
      title: "Integrate the disciplines",
      body: "Planners, architects, engineers and analysts work from the same model, so trade-offs surface early instead of on site.",
      img: img("1497366754035-f200968a6e72", 1400),
    },
    {
      no: "03",
      title: "Design the system",
      body: "Land use, movement, water and buildings are designed together, then tested against scenarios for the next twenty years.",
      img: img("1477959858617-67f85cf4f1df", 1400),
    },
    {
      no: "04",
      title: "Deliver and keep it running",
      body: "Phased delivery plans, working drawings and live digital tools that the client’s own team keeps using after handover.",
      img: img("1519501025264-65ba15a82390", 1400),
    },
  ],

  faq: [
    [
      "What kinds of clients do you work with?",
      "Public authorities, municipal bodies, developers, infrastructure operators and institutions — anyone responsible for a place that has to work for decades.",
    ],
    [
      "Do we have to engage every discipline?",
      "No. Many projects start with one service, such as a GIS study or a building design. We bring in other disciplines only where they change the outcome.",
    ],
    [
      "How does a project usually start?",
      "With a short scoping conversation, then a paid discovery phase that sets the evidence base, scope and delivery plan before full commitment.",
    ],
    [
      "Can you build software for our team?",
      "Yes. Our digital team builds decision-support tools, dashboards and digital twins on top of the same data used in the planning work.",
    ],
    [
      "Where do you work?",
      "Our head office is in Telangana. We set up project offices close to the work for the duration of an engagement.",
    ],
  ],
};

// Who the practice works with (About page). Client types come from the About
// copy; the one-line descriptions are PLACEHOLDER wording.
export const SECTORS = [
  { title: "Government & public authorities", meta: "Master plans · policy · infrastructure", img: img("1477959858617-67f85cf4f1df", 900) },
  { title: "Private organisations", meta: "Buildings · campuses · feasibility", img: img("1497366754035-f200968a6e72", 900) },
  { title: "Academic institutions", meta: "Research · campus planning · training", img: img("1523240795612-9a054b0db644", 900) },
  { title: "Development partners", meta: "Programmes · capacity building · evaluation", img: img("1441974231531-c6227db76b6e", 900) },
];

// PLACEHOLDER: a typical hiring process, to be confirmed by the practice.
// The three ways in, per the client brief: jobs, internships, freelancing.
export const WORK_WITH_US = [
  ["Job opportunities", "Full-time roles across architecture, planning, engineering and GIS — see the openings below."],
  ["Internships", "Hands-on placements for architecture, planning and engineering students, working on live projects."],
  ["Freelancing", "Independent designers, visualisers and specialists who collaborate with us project by project."],
];

export const HIRING = [
  ["Apply", "Send a CV and two or three pieces of work you are proud of."],
  ["Conversation", "A relaxed call with a director about your work and interests."],
  ["Studio visit", "Meet the team and talk through a real project with us."],
  ["Offer", "A clear offer, usually within a week of the visit."],
];

// Head office location, for the map panel on the Offices page.
export const HQ = { lat: "17.63° N", lng: "78.48° E", tz: "Asia/Kolkata", tzLabel: "IST" };

export const VALUES = [
  ["Integrated by default", "Teams are formed around the problem, not around a department chart."],
  ["Evidence over assertion", "Positions are backed by data we collected or can trace."],
  ["Built to be used", "Deliverables are made for the people who have to operate them."],
  ["Long horizon", "We plan for the decade after the ribbon, not the week before it."],
];

// ---------- Architecture & Planning service pages (from the client content brief) ----------

export const ARCH_SERVICES = [
  { title: "Residential Plan", body: "Homes planned around the way a family actually lives — light, air, privacy and room to grow.", img: img("1600585154340-be6161a56a0c", 900) },
  { title: "Commercial Plan", body: "Offices, retail and mixed-use buildings laid out for efficient operation and a clear public face.", img: img("1486406146926-c627a92ad1ab", 900) },
  { title: "Services Plan", body: "Plumbing, electrical and drainage layouts coordinated with the architecture from the start.", img: img("1504307651254-35680f356dfd", 900) },
  { title: "Vastu Consultancy", body: "Vastu principles integrated into planning without compromising function or design.", img: img("1558036117-15d82a90b9b1", 900) },
  { title: "Interior Design", body: "Interiors that carry the building's idea inside — materials, furniture, lighting and detail.", img: img("1790020391176-f433c9713085", 900) },
  { title: "Sanction Drawing", body: "Drawings prepared to local bye-laws for smooth building-permission approval.", img: img("1712697236422-cf48f06547f1", 900) },
  { title: "3D Modelling", body: "Accurate digital models to test massing, space and construction before building.", img: img("1600566753190-17f0baa2a6c3", 900) },
  { title: "3D Elevation", body: "Facade studies that settle proportion, material and character early.", img: img("1545324418-cc1a3fa10c00", 900) },
  { title: "3D Rendering", body: "Photo-real views that let clients see the finished space before it exists.", img: img("1600596542815-ffad4c1539a9", 900) },
  { title: "Turnkey Projects", body: "Design through construction, delivered in collaboration with our partner construction firm.", img: img("1541888946425-d81bb19240f5", 900) },
];

// ---------- Architecture page (client brief 3) ----------
// DRAFT copy: the brief gives the topics; wording to be confirmed by the client.

export const ARCH_PHILOSOPHY = [
  "For us, architecture is not only about how a building looks — it is about how it lives. How light moves through a room across the day, how air flows without a fan, how a home stays cool in May and holds warmth in December.",
  "We design from climate and context first. Orientation, shade, ventilation and local materials shape the plan before anything else, so comfort is built into the structure rather than added with machines.",
  "What we bring is a return to ideas that have always worked in Indian buildings — courtyards, jalis, filler slabs, green roofs — combined with present-day engineering, 3D design and careful detailing. The result is architecture that is sustainable by design, not by add-on.",
];

export const ARCH_IDEAS = [
  ["Filler slabs", "Clay pots or tiles replace concrete in the non-structural part of the roof slab — using up to a third less concrete and steel, cutting cost, and keeping the rooms below cooler."],
  ["Courtyard planning", "An open core at the heart of the plan draws daylight and cross-ventilation deep into the house and gives the family a private outdoor room."],
  ["Terrace gardening", "Planted roofs grow food and greenery, absorb rainwater and insulate the floor below from the summer sun."],
  ["Vertical gardening", "Green walls and planters on facades and balconies soften the building, filter dust and cool the air around it."],
  ["Landscape design", "Gardens, paving, trees and water planned together with the building, so outdoor space is designed rather than left over."],
  ["Jali designs", "Perforated screens in brick, stone or concrete filter harsh sun, keep privacy and let the breeze pass through — with a play of light and shadow no glass can give."],
];

// SAMPLE entries: replace with the client's real projects (title, location,
// status "Completed" | "Ongoing", description, photo). `location` is optional.
export const RESIDENTIAL_PROJECTS = [
  {
    title: "Independent House",
    location: "",
    status: "Completed",
    body: "A family home planned around a central courtyard, with jali screens on the west face and a terrace garden.",
    img: img("1600585154340-be6161a56a0c", 1200),
  },
  {
    title: "Contemporary Villa",
    location: "",
    status: "Ongoing",
    body: "A two-storey villa with deep shaded verandahs, filler-slab roofs and landscaped open spaces.",
    img: img("1600596542815-ffad4c1539a9", 1200),
  },
  {
    title: "Duplex Residence",
    location: "",
    status: "Ongoing",
    body: "A compact duplex that uses a double-height living space and cross-ventilation to stay cool without air-conditioning.",
    img: img("1600566753190-17f0baa2a6c3", 1200),
  },
];

export const VASTU = {
  intro: [
    "Vastu Shastra is a traditional Indian system of planning that aligns a building with direction, sunlight and the natural elements. Many of its principles match what good climate-responsive design already asks for — morning light in the kitchen, a cool and heavy south-west, an open and light north-east.",
    "We integrate Vastu into the plan from the first sketch, so the home is Vastu-compliant without giving up function, light, ventilation or design quality. We also review existing plans and suggest practical corrections.",
  ],
  points: [
    ["Orientation & entrance", "Placing the main entrance and plot orientation for the best light, access and energy of the site."],
    ["Room placement", "Kitchen, bedrooms, pooja room, toilets and staircases positioned by direction and use."],
    ["Light & ventilation", "Openings, courtyards and heights planned so the home stays bright and well aired."],
    ["Plan review", "Vastu assessment of existing or proposed plans, with practical design corrections."],
  ],
};

export const INTERIOR = {
  intro:
    "Interiors that carry the idea of the building inside — spaces planned around how you live, with materials, furniture, lighting and detail chosen together. From a single room to a complete home or workplace, we take interiors from concept and 3D views to execution.",
  points: [
    ["Space planning", "Furniture layouts and storage that make every square foot work."],
    ["Materials & finishes", "Natural, durable and locally sourced materials chosen for climate and budget."],
    ["Lighting design", "Daylight first, then layered artificial light for mood and task."],
    ["Custom furniture", "Joinery, wardrobes, kitchens and fixtures designed to fit."],
  ],
  gallery: [
    img("1790020391176-f433c9713085", 1200),
    img("1586023492125-27b2c045efd7", 900),
    img("1600607687939-ce8a6c25118c", 900),
    img("1618221195710-dd6b41faaea6", 1200),
  ],
};

export const PLANNING_SERVICES = [
  { title: "Area Development Plan", body: "Detailed plans that guide growth, land use and infrastructure for a defined area.", img: img("1594383274581-86711b1c4265", 900) },
  { title: "Master Plan", body: "Long-term spatial frameworks for cities and towns.", img: img("1477959858617-67f85cf4f1df", 900) },
  { title: "Local Area Plan", body: "Neighbourhood-scale plans that turn city policy into streets, plots and public space.", img: img("1542744173-8e7e53415bb0", 900) },
  { title: "Regional Plan", body: "Strategies that coordinate settlements, economy and environment across a region.", img: img("1532601224476-15c79f2f7a51", 900) },
  { title: "Comprehensive Development Plan", body: "Integrated plans linking land use, infrastructure, services and investment.", img: img("1444723121867-7a241cacace9", 900) },
];

export const GIS_SERVICES = [
  { title: "GIS Mapping", body: "Base maps, land-use and asset mapping built on reliable spatial data.", img: img("1569336415962-a4bd9f69cd83", 900) },
  { title: "Spatial Mapping & Analysis", body: "Suitability, accessibility and change analysis to support planning decisions.", img: img("1524661135-423995f22d0b", 900) },
  { title: "Remote Sensing & Land-Use Mapping", body: "Satellite imagery turned into land-use, land-cover and change maps.", img: img("1451187580459-43490279c0fa", 900) },
];

export const TRANSPORT_SERVICES = [
  { title: "Intersection Design", body: "Safer, more efficient junctions for vehicles, pedestrians and cyclists.", img: img("1519501025264-65ba15a82390", 900) },
  { title: "Traffic Volume Count Analysis", body: "Surveys and analysis that establish how a network is used today.", img: img("1449824913935-59a10b8d2000", 900) },
  { title: "Comprehensive Mobility Plan", body: "City-wide strategies for public transport, walking, cycling and roads.", img: img("1494515843206-f3117d3f51b7", 900) },
  { title: "Parking Study", body: "Demand, supply and management plans for on- and off-street parking.", img: img("1506521781263-d8422e82f27a", 900) },
];

// The four service groups, as cards on Home (client brief 2.5).
export const SERVICE_GROUPS = [
  { no: "01", title: "Architectural Services", short: "Homes, commercial buildings, interiors, Vastu, sanction drawings and 3D visualisation.", to: "architecture", img: img("1600585154340-be6161a56a0c") },
  { no: "02", title: "Planning Services", short: "Area development, master, local area, regional and comprehensive development plans.", to: "planning", img: img("1477959858617-67f85cf4f1df") },
  { no: "03", title: "GIS & Spatial Mapping", short: "GIS mapping, spatial analysis and remote sensing for evidence-based planning.", to: "planning", img: img("1569336415962-a4bd9f69cd83") },
  { no: "04", title: "Transportation Services", short: "Intersection design, traffic counts, parking studies and comprehensive mobility plans.", to: "planning", img: img("1519501025264-65ba15a82390") },
];

export const SOFTWARE = [
  ["PTV VISSIM", "Microscopic traffic simulation for junctions and corridors."],
  ["PTV VISUM", "Network-wide transport demand modelling."],
  ["SUMO", "Open-source simulation of urban mobility."],
  ["AIMSUN", "Integrated traffic modelling from region to street."],
];

// About Us (client brief 2.1) — shown on Home and About. Line breaks are the
// client's own, so each stanza is kept as a list of lines.
export const ABOUT_STORY = {
  stanzas: [
    ["We came together with a shared purpose —", "to bring cities, systems, people, and ideas closer together."],
    [
      "A purpose to create not merely for today,",
      "but with thought for tomorrow.",
      "To serve the environment, respect the places we inhabit,",
      "and take meaningful steps towards a more sustainable future.",
    ],
    [
      "We may carry different visions,",
      "but we dream of a common possibility —",
      "a world where design responds to people,",
      "where cities coexist with nature,",
      "and where every space has a purpose beyond itself.",
    ],
    [
      "Bringing together diverse skills, perspectives, and expertise,",
      "we believe that the strength of creation lies in collaboration.",
    ],
  ],
  motto: "Different minds. Different visions. One shared purpose.",
  closing: "Together, we created CoArchitive.",
};

/* ===========================================================================
   Home page, 2026 redesign.
   The five practices, the sample projects, the mark, the notes and the
   counters that run under them.
   =========================================================================== */

export const WHY = {
  eyebrow: "Why CoArchitive",
  head: ["Most places are planned in pieces.", "We plan them as one."],
  body: "Roads by one team, land by another, buildings by a third. The gaps between them are where projects fail. We bring architects, planners, engineers and environmental specialists to the same table from day one.",
  caption: "Growth without a plan",
  img: img("1444723121867-7a241cacace9", 1600),
};

// The five practices, as tabs. `note` prints small beside a service.
export const PRACTICES = [
  {
    key: "architecture",
    tab: "Architecture",
    title: "Architecture",
    to: "architecture",
    body: "Homes, workplaces and public buildings designed from climate and context first. We bring back ideas that have always worked in Indian buildings — courtyards, jalis and filler slabs — and pair them with present-day engineering and 3D design.",
    img: img("1600585154340-be6161a56a0c", 1200),
    services: [
      "Residential Plan",
      "Commercial Plan",
      "Services Plan",
      "Vastu Consultancy",
      "Interior Design",
      "Sanction Drawing",
      "3D Modelling",
      "3D Elevation",
      "3D Rendering",
      { name: "Turnkey Projects", note: "with our partner construction firm" },
    ],
  },
  {
    key: "planning",
    tab: "Planning",
    title: "Planning",
    to: "planning",
    body: "Spatial frameworks that decide how a place grows — land use, density, movement, services and public space, planned together rather than one after another.",
    img: img("1477959858617-67f85cf4f1df", 1200),
    services: [
      "Master Plan",
      "Area Development Plan",
      "Local Area Plan",
      "Regional Plan",
      "Comprehensive Development Plan",
      "Comprehensive Mobility Plan",
      "Intersection Design",
      "Traffic Volume Count Analysis",
      "Parking Study",
      "Urban Design",
    ],
  },
  {
    key: "environment",
    tab: "Environmental Services",
    title: "Environmental services",
    to: "expertise",
    body: "Environmental planning for the climate that is arriving: resilience, water, waste and decarbonisation, assessed early enough to change the plan rather than apologise for it.",
    img: pimg("1678189496886-0e568e51601b", 1200),
    services: [
      "Environmental Planning",
      "Climate Resilience Strategy",
      "Water & Stormwater Systems",
      "Solid Waste Management",
      "Environmental Assessment",
      "Decarbonisation Advisory",
      "Green & Blue Infrastructure",
      "Air Quality Studies",
    ],
  },
  {
    key: "research",
    tab: "Research, Policy & Advisory",
    title: "Research, policy & advisory",
    to: "expertise",
    body: "Evidence before commitment. Feasibility studies, detailed project reports and policy advisory, built on data we collected ourselves or can trace to its source.",
    img: img("1507842217343-583bb7270b66", 1200),
    services: [
      "Feasibility Studies",
      "Detailed Project Reports",
      "Policy Advisory",
      "Technical Documentation",
      "GIS Mapping",
      "Spatial Mapping & Analysis",
      "Remote Sensing & Land Use",
      "Location Intelligence",
    ],
  },
  {
    key: "programme",
    tab: "Programme & Project Management",
    title: "Programme & project management",
    to: "expertise",
    body: "Getting it built and keeping it running. Delivery strategy, coordination across agencies, capacity building and the communication work that decides whether a programme lands.",
    img: img("1523240795612-9a054b0db644", 1200),
    services: [
      "Delivery Strategy",
      "Programme Coordination",
      "Capacity Building",
      "IEC Campaigns",
      "Community Engagement",
      "Monitoring & Evaluation",
      "Institutional Partnerships",
      "Training & Workshops",
    ],
  },
];

// SAMPLE cards: stock photography and placeholder descriptions, to be replaced
// with the practice's own projects, photographs and locations.
export const SAMPLE_PROJECTS = [
  {
    title: "Courtyard House",
    kind: "Residential",
    size: "G+1",
    status: "Completed",
    body: "A family home planned around a central courtyard, with a jali on the west face and a terrace garden.",
    img: img("1600210492486-724fe5c67fb0", 1100),
  },
  {
    title: "Verandah Villa",
    kind: "Residential",
    size: "G+2",
    status: "Completed",
    body: "Deep shaded verandahs, filler-slab roofs and landscaped open space around the house.",
    img: img("1513584684374-8bab748fbf90", 1100),
  },
  {
    title: "Daylight Duplex",
    kind: "Residential",
    size: "Duplex",
    status: "Ongoing",
    body: "A compact duplex with a double-height core that pulls light and air through both floors.",
    img: img("1541888946425-d81bb19240f5", 1100),
  },
];

export const HOME_STATS = [
  ["5", "Practices", "Architecture, planning, environment, research and project management."],
  ["3", "Directors", "An architect-planner and two engineer-planners."],
  ["9", "Modelling tools", "From ArcGIS and QGIS to Vissim, SUMO and ENVI-met."],
  ["1", "Shared purpose", "Different minds and different visions, working as one team."],
];

// What the mark means, as told in the brand note.
export const MARK = [
  ["[ ]", "Collaboration", "The brackets stand for inclusion: working across disciplines, with clients, communities and partners."],
  ["O", "People at the centre", "Every plan, space and structure is made for and around human life."],
  ["9 e p", "One bracket, three disciplines", "As it is, the right bracket reads as 9 for architecture. Mirrored vertically it becomes an e for engineering, and mirrored horizontally a p for planning."],
];

// PLACEHOLDER: planned posts. Replace with real articles when they are written.
export const NOTES = [
  ["Architecture", "Why filler slabs still make sense for Indian homes", "Less concrete, less steel, cooler rooms. A simple idea that deserves a second look."],
  ["Mobility", "What a Comprehensive Mobility Plan actually covers", "From traffic counts to transit corridors, and how simulation shapes the final plan."],
  ["Environment", "Measuring how well a town handles its waste", "The indicators we use to assess a municipal solid waste system, and what to fix first."],
];

export const CAREER_WAYS = [
  ["Jobs", "Full-time roles as projects grow. Send your CV and portfolio and we will reach out when a role fits."],
  ["Internships", "For students of architecture, planning and civil or environmental engineering."],
  ["Freelancing", "For specialists in 3D visualisation, GIS, transport modelling and drafting."],
];

export const HELP_WITH = [
  "Architecture",
  "Planning",
  "Environmental services",
  "Research & advisory",
  "Programme management",
  "Something else",
];
