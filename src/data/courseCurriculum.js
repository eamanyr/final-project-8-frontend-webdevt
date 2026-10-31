// Rich curriculum lessons and Canvas-style lesson page topic content for each course & unit

const COURSE_UNIT_LESSONS = {
  'crs-1': {
    0: [
      {
        title: 'Introduction to Modernism & Avant-Garde Aesthetics',
        topicHeading: 'Modernist Aesthetics & Avant-Garde Foundations',
        definition:
          'Modernism in fine arts is a philosophical and aesthetic movement that broke away from classical mimetic representation in favor of abstraction, geometric form, and expressive materiality.',
        majorFunctionsTitle: 'Major principles of modernist composition:',
        majorFunctions: [
          'It simplifies complex organic subjects into foundational geometric planes (cylinders, spheres, cones).',
          'It prioritizes visual surface tension, flatness of the canvas, and intentional negative space.',
          'It uses color and brushwork autonomously to evoke psychological and emotional resonance.',
        ],
        partsTitle: 'Core Components of Cubist & Modernist Form',
        parts: [
          {
            term: 'Analytical Plane',
            desc: 'The structural breakdown of a three-dimensional subject viewed simultaneously from multiple vantage points onto a unified two-dimensional surface.',
          },
          {
            term: 'Visual Equilibrium',
            desc: 'The dynamic balance of asymmetrical weights, tonal contrasts, and directional vectors across the picture plane.',
          },
        ],
        diagram: {
          top: 'Observed Subject / Natural Form',
          middle1: 'Geometric Abstraction (Planes & Vectors)',
          middle2: 'Tonal & Chromatic Articulation',
          bottom: 'Unified Modernist Canvas Composition',
        },
      },
      {
        title: 'Geometric Simplification & Cubist Plane Analysis',
        topicHeading: 'Cubist Plane Analysis & Structural Reduction',
        definition:
          'Plane analysis is the studio methodology of deconstructing complex forms into interlocking facets to understand how light, volume, and contour interact in space.',
        majorFunctionsTitle: 'Major functions of plane reduction in studio practice:',
        majorFunctions: [
          'It eliminates distracting surface minutiae during the primary blocking-in stage.',
          'It establishes clear light-to-shadow terminators across major structural turns.',
          'It enables multi-perspective synthesis characteristic of Analytical and Synthetic Cubism.',
        ],
        partsTitle: 'Parts of the Structural Plane System',
        parts: [
          {
            term: 'Primary Axis',
            desc: 'The dominant directional spine that anchors the gesture and proportion of the simplified object.',
          },
          {
            term: 'Cross-Contour Facets',
            desc: 'Planar subdivisions that wrap across the form to communicate volume, depth, and tactile density.',
          },
        ],
        diagram: {
          top: 'Complex 3D Reference Object',
          middle1: 'Primary Axis & Bounding Silhouette',
          middle2: 'Planar Subdivision & Value Grouping',
          bottom: 'Resolved Geometric Study',
        },
      },
      {
        title: 'Surface Tactility, Impasto & Visual Weight',
        topicHeading: 'Surface Tactility & Compositional Weight',
        definition:
          'Surface tactility refers to both physical texture (impasto, collage, tooth) and simulated optical texture that governs how the viewer’s eye traverses an artwork.',
        majorFunctionsTitle: 'Major functions of texture and visual weight:',
        majorFunctions: [
          'It creates focal hierarchy by contrasting high-detail tactile zones against quiet rest areas.',
          'It modulates light reflection and shadow absorption across the physical medium.',
          'It anchors asymmetrical compositions through density and tonal contrast.',
        ],
        partsTitle: 'Elements of Tactile Articulation',
        parts: [
          {
            term: 'Focal Texture',
            desc: 'High-contrast mark-making placed at key structural intersections to command immediate viewer attention.',
          },
          {
            term: 'Passive Ground',
            desc: 'Muted, low-frequency passages that provide breathing room and amplify adjacent textural accents.',
          },
        ],
        diagram: {
          top: 'Compositional Hierarchy Plan',
          middle1: 'High-Contrast Focal Passages',
          middle2: 'Low-Frequency Atmospheric Ground',
          bottom: 'Balanced Tactile Expression',
        },
      },
    ],
    1: [
      {
        title: 'Bauhaus Color Theory & Johannes Itten’s Contrasts',
        topicHeading: 'Bauhaus Chromatic Systems',
        definition:
          'Bauhaus color theory examines the objective optical laws and subjective emotional states produced by seven fundamental color contrasts.',
        majorFunctionsTitle: 'Major functions of chromatic contrast:',
        majorFunctions: [
          'It establishes spatial depth through warm-advancing and cool-receding temperature shifts.',
          'It harmonizes multi-hue palettes using proportional luminosity ratios.',
          'It directs narrative mood before the viewer processes figurative details.',
        ],
        partsTitle: 'Core Chromatic Mechanisms',
        parts: [
          {
            term: 'Simultaneous Contrast',
            desc: 'The optical phenomenon where two adjacent colors dynamically alter each other’s perceived hue and saturation.',
          },
          {
            term: 'Chromatic Value',
            desc: 'The intrinsic lightness or darkness of a pigment independent of its hue family.',
          },
        ],
        diagram: {
          top: 'Primary & Secondary Hue Selection',
          middle1: 'Temperature & Luminosity Calibration',
          middle2: 'Proportional Area Distribution',
          bottom: 'Harmonized Bauhaus Palette',
        },
      },
      {
        title: 'Earth Pigment Harmonies & Mood Board Construction',
        topicHeading: 'Earth Pigments & Editorial Mood Boards',
        definition:
          'Earth pigment palettes combine organic ochres, umbers, forest greens, and muted sages to create grounded, timeless visual identities.',
        majorFunctionsTitle: 'Major functions of a cohesive mood board:',
        majorFunctions: [
          'It codifies dominant, secondary, and accent color percentages prior to final execution.',
          'It pairs typographic and material swatches with chromatic swatches to test real-world contrast.',
          'It communicates visual rationale clearly during studio critiques.',
        ],
        partsTitle: 'Components of a Studio Palette System',
        parts: [
          {
            term: 'Anchor Tone',
            desc: 'The foundational dark or neutral pigment (such as deep forest or charcoal) that stabilizes the composition.',
          },
          {
            term: 'Luminous Accent',
            desc: 'A high-chroma or warm metallic highlight (such as ochre gold) used sparingly for focal emphasis.',
          },
        ],
        diagram: {
          top: 'Conceptual Brief & Emotional Keywords',
          middle1: '5-Tone Earth Swatch Extraction',
          middle2: 'Contrast & Accessibility Verification',
          bottom: 'Final Studio Mood Board',
        },
      },
    ],
    2: [
      {
        title: 'Abstract Expressionism & Gestural Mark-Making',
        topicHeading: 'Gestural Mark-Making & Mixed Media',
        definition:
          'Abstract Expressionism treats the canvas as an arena for physical action, combining spontaneous calligraphy, layered washes, and mixed-media collage.',
        majorFunctionsTitle: 'Major functions of expressive mixed media:',
        majorFunctions: [
          'It captures kinetic energy and velocity directly in the weight and taper of each stroke.',
          'It builds archaeological depth through transparent glazes and subtracted layers.',
          'It synthesizes drawing, painting, and assemblage into a unified contemporary statement.',
        ],
        partsTitle: 'Parts of Mixed-Media Layering',
        parts: [
          {
            term: 'Underpainting Ground',
            desc: 'The initial toned or collaged substrate that unifies all subsequent expressive layers.',
          },
          {
            term: 'Calligraphic Over-layer',
            desc: 'Decisive, high-velocity linear marks applied last to lock the composition into focus.',
          },
        ],
        diagram: {
          top: 'Toned Substrate & Collage Ground',
          middle1: 'Atmospheric Wash & Scumbling',
          middle2: 'Gestural Linear Articulation',
          bottom: 'Exhibition-Ready Mixed Media Work',
        },
      },
      {
        title: 'Gallery Curation & Critique Methodology',
        topicHeading: 'Contemporary Gallery Critique & Curation',
        definition:
          'Studio critique is a structured analytical dialogue that evaluates how effectively formal decisions support the artist’s conceptual intent.',
        majorFunctionsTitle: 'Major stages of formal studio critique:',
        majorFunctions: [
          'Descriptive inventory of visible formal elements without premature judgment.',
          'Structural analysis of composition, value, color, and material craft.',
          'Interpretive synthesis connecting studio execution to broader art-historical context.',
        ],
        partsTitle: 'Components of Exhibition Presentation',
        parts: [
          {
            term: 'Artist Statement',
            desc: 'A concise 150-word conceptual framing that articulates the inquiry behind the body of work.',
          },
          {
            term: 'Sightline Mounting',
            desc: 'Spatial arrangement of works calibrated to eye level, lighting temperature, and wall breathing room.',
          },
        ],
        diagram: {
          top: 'Completed Studio Portfolio',
          middle1: 'Formal Critique & Revision Cycle',
          middle2: 'Curatorial Sequencing & Framing',
          bottom: 'Academy Gallery Showcase',
        },
      },
    ],
  },
  'crs-2': {
    0: [
      {
        title: 'Line of Action & 30-Second Gesture Rhythms',
        topicHeading: 'Rapid Gesture & Line of Action',
        definition:
          'The Line of Action is a single sweeping C-curve, S-curve, or straight vector that captures the primary kinetic thrust and emotional attitude of a figure.',
        majorFunctionsTitle: 'Major functions of gesture drawing:',
        majorFunctions: [
          'It prevents stiff, mannequin-like poses by prioritizing movement over anatomical detail.',
          'It establishes weight distribution, balance, and center of gravity within seconds.',
          'It links head, ribcage, and pelvis into a unified rhythmic flow.',
        ],
        partsTitle: 'Parts of the Gesture Framework',
        parts: [
          {
            term: 'Primary Thrust Line',
            desc: 'The longest unbroken axis running from the load-bearing foot through the spine to the crown or extended limb.',
          },
          {
            term: 'Contrapposto Tilt',
            desc: 'The opposing angular tilts of the shoulder girdle and pelvic block that create natural organic tension.',
          },
        ],
        diagram: {
          top: 'Live Figure Observation',
          middle1: 'Primary Line of Action (C / S Curve)',
          middle2: 'Ribcage & Pelvis Tilt Counterbalance',
          bottom: 'Dynamic Silhouette Construction',
        },
      },
      {
        title: 'Silhouette Readability & Negative Space',
        topicHeading: 'Silhouette Clarity & Positive/Negative Space',
        definition:
          'A readable silhouette communicates the action, proportion, and intent of a character immediately when filled with solid black value.',
        majorFunctionsTitle: 'Major functions of silhouette design:',
        majorFunctions: [
          'It separates key limbs from the torso so the pose reads clearly at any distance.',
          'It uses negative space cutouts between arms, legs, and props to clarify overlapping forms.',
          'It establishes visual rhythm through alternating straights against curves.',
        ],
        partsTitle: 'Core Principles of Silhouette Craft',
        parts: [
          {
            term: 'Tangent Avoidance',
            desc: 'Preventing two contour edges from merely kissing, instead forcing a clear overlap to establish depth.',
          },
          {
            term: 'Straight-to-Curve Design',
            desc: 'Pairing a taut structural straight edge on the compression/tension side with an expressive curve opposite it.',
          },
        ],
        diagram: {
          top: 'Gesture Pose Thumbnail',
          middle1: 'Negative Space Cutout Check',
          middle2: 'Straight vs. Curve Contour Refinement',
          bottom: 'Clear Production Character Silhouette',
        },
      },
    ],
    1: [
      {
        title: 'Circles, Ovals & Thoracic Volume Foreshortening',
        topicHeading: 'Volumetric Mannequinization & Foreshortening',
        definition:
          'Foreshortening is the optical compression of a form when tilted toward or away from the viewer, constructed through overlapping spheres, ellipses, and tapered cylinders.',
        majorFunctionsTitle: 'Major functions of ellipse-based construction:',
        majorFunctions: [
          'The degree of an oval’s openness immediately reveals how steeply the cross-section tilts toward the camera.',
          'Overlapping T-intersections clarify which anatomical mass sits in front in 3D space.',
          'Varying circle and oval scale creates dramatic perspective convergence.',
        ],
        partsTitle: 'Parts of the Volumetric Torso',
        parts: [
          {
            term: 'Thoracic Egg (Ribcage)',
            desc: 'An ovoid mass tilted slightly backward, housing the lungs and anchoring the scapulae and clavicles.',
          },
          {
            term: 'Pelvic Bucket',
            desc: 'A tilted cranial-caudal cylinder or box whose iliac crests provide key subcutaneous bony landmarks.',
          },
        ],
        diagram: {
          top: 'Perspective Horizon & Viewing Angle',
          middle1: 'Cross-Sectional Ellipses (Degree & Tilt)',
          middle2: 'Overlapping Cylinders & T-Intersections',
          bottom: 'Foreshortened Anatomical Figure',
        },
      },
      {
        title: 'Subcutaneous Bone Landmarks & Muscle Insertion',
        topicHeading: 'Skeletal Landmarks & Surface Anatomy',
        definition:
          'Subcutaneous landmarks are points where bone lies directly beneath the skin without intervening muscle, serving as fixed compass points on every human figure.',
        majorFunctionsTitle: 'Major functions of skeletal landmarks:',
        majorFunctions: [
          'They remain constant across all body types regardless of muscularity or adipose tissue.',
          'They mark the exact origin and insertion anchors for major surface muscle groups.',
          'They indicate plane breaks where surface lighting shifts direction.',
        ],
        partsTitle: 'Essential Anatomical Landmarks',
        parts: [
          {
            term: 'Clavicle & Acromion Process',
            desc: 'The anterior collar bone and lateral shoulder shelf where the deltoid and trapezius converge.',
          },
          {
            term: 'ASIS (Anterior Superior Iliac Spine)',
            desc: 'The two front hip points that define the tilt of the pelvis and anchor the sartorius and inguinal line.',
          },
        ],
        diagram: {
          top: 'Proportional Gesture Envelope',
          middle1: 'Subcutaneous Bony Landmark Placement',
          middle2: 'Muscle Origin-to-Insertion Wrapping',
          bottom: 'Anatomically Grounded Figure Drawing',
        },
      },
    ],
    2: [
      {
        title: 'Core Shadow, Reflected Light & Form Rendering',
        topicHeading: 'Three-Dimensional Lighting & Form Rendering',
        definition:
          'Form rendering translates two-dimensional linework into convincing three-dimensional mass by separating the light family from the shadow family.',
        majorFunctionsTitle: 'Major functions of the 5-value lighting system:',
        majorFunctions: [
          'A decisive terminator line divides direct light from form and cast shadow.',
          'The core shadow reinforces the three-dimensional turn of the form.',
          'Subtle reflected bounce light prevents shadows from looking flat or dead.',
        ],
        partsTitle: 'Parts of the Lighting Terminator System',
        parts: [
          {
            term: 'Core Shadow',
            desc: 'The darkest band along the turning edge of a form where direct light can no longer reach and reflected light is minimal.',
          },
          {
            term: 'Halftone Bridge',
            desc: 'The graduated transitional zone between center light and the terminator where surface texture is most visible.',
          },
        ],
        diagram: {
          top: 'Primary Light Source Vector',
          middle1: 'Light Family (Highlight, Center Light, Halftone)',
          middle2: 'Shadow Family (Core Shadow, Reflected Light, Cast Shadow)',
          bottom: 'Fully Rendered Volumetric Form',
        },
      },
    ],
  },
  'crs-3': {
    0: [
      {
        title: 'The Geometry of Nuqta & Al-Khatt Al-Mansub',
        topicHeading: 'Proportional Dot System (Nizam al-Nuqat)',
        definition:
          'Codified by Ibn Muqlah, the Nuqta system uses the diamond-shaped impression of the reed pen nib as the universal unit of measurement for every Arabic letterform.',
        majorFunctionsTitle: 'Major functions of Nuqta calibration:',
        majorFunctions: [
          'It establishes an exact mathematical ratio between nib width and letter height.',
          'It governs the internal counters and inter-letter spacing across an entire manuscript line.',
          'It ensures geometric harmony between the vertical Alif and the circular module.',
        ],
        partsTitle: 'Parts of the Proportional System',
        parts: [
          {
            term: 'Al-Alif (The Vertical Standard)',
            desc: 'The foundational vertical stroke measuring 5 to 7 stacked diamond dots depending on the script style.',
          },
          {
            term: 'Al-Da’irah (The Encompassing Circle)',
            desc: 'An imaginary circle whose diameter equals the height of the Alif, governing all curved bowls and loops.',
          },
        ],
        diagram: {
          top: 'Qalam Nib Width & Cut Angle',
          middle1: 'Nuqta Diamond Dot Unit',
          middle2: 'Vertical Alif & Circular Module',
          bottom: 'Harmonized Script Proportions',
        },
      },
    ],
    1: [
      {
        title: 'Naskh Script Precision & Baseline Rhythm',
        topicHeading: 'Naskh Script Structure & Flow',
        definition:
          'Naskh is a highly legible, balanced cursive script characterized by horizontal baseline stability, open counters, and crisp terminal tapers.',
        majorFunctionsTitle: 'Major functions of Naskh baseline discipline:',
        majorFunctions: [
          'It maintains effortless readability across long-form editorial and manuscript texts.',
          'It alternates thick full-nib strokes with delicate edge-of-nib hairlines (Farkah).',
          'It balances sub-baseline descender bowls with crisp vertical ascenders.',
        ],
        partsTitle: 'Core Components of Naskh Execution',
        parts: [
          {
            term: 'Satr (The Baseline)',
            desc: 'The horizontal anchor line along which medial ligatures rest with slight rhythmic undulation.',
          },
          {
            term: 'Tarwis (The Serif Hook)',
            desc: 'The subtle introductory crown placed at the apex of vertical strokes in classical scripts.',
          },
        ],
        diagram: {
          top: 'Prepared Burnished Paper (Ahar)',
          middle1: 'Baseline Ruling & Nib Angle (70°)',
          middle2: 'Ascender, Medial & Bowl Execution',
          bottom: 'Balanced Naskh Manuscript Line',
        },
      },
    ],
    2: [
      {
        title: 'Thuluth Monumental Composition & Interlocking',
        topicHeading: 'Thuluth Monumental Compositions',
        definition:
          'Thuluth ("one-third") is the majestic architectural script of Islamic art, renowned for its tall ascenders, sweeping curves, and multi-tiered stacked compositions.',
        majorFunctionsTitle: 'Major functions of Thuluth composition:',
        majorFunctions: [
          'It stacks words into circular, oval, or architectural friezes with interlocking ascenders.',
          'It fills negative spaces with vocalization marks (Tashkil) and ornamental motifs (Tazyin).',
          'It creates monumental visual presence from both afar and close inspection.',
        ],
        partsTitle: 'Parts of a Stacked Thuluth Panel',
        parts: [
          {
            term: 'Tarkib (Interlocking Stacking)',
            desc: 'The artful vertical layering of words so that reading order flows naturally from bottom-right upward.',
          },
          {
            term: 'Harakat & Tashkil',
            desc: 'Vowel and decorative strokes executed with a finer pen to unify the tonal density of the panel.',
          },
        ],
        diagram: {
          top: 'Text Selection & Reading Order Plan',
          middle1: 'Primary Thuluth Skeletal Interlock',
          middle2: 'Tashkil Vocalization & Optical Balance',
          bottom: 'Final Illuminated Calligraphy Panel',
        },
      },
    ],
  },
  'crs-4': {
    0: [
      {
        title: 'State Mechanics, Context Providers & Unidirectional Flow',
        topicHeading: 'Frontend State Architecture',
        definition:
          'Modern UI state architecture separates ephemeral local view state from shared application state, ensuring predictable unidirectional data flow across component trees.',
        majorFunctionsTitle: 'Major functions of a structured state layer:',
        majorFunctions: [
          'It provides a single source of truth for user session, entities, and optimistic mutations.',
          'It prevents prop-drilling across deeply nested layout and modal hierarchies.',
          'It synchronizes in-memory React state with persistent storage and URL routing.',
        ],
        partsTitle: 'Parts of the State System',
        parts: [
          {
            term: 'Context Provider',
            desc: 'The top-level state boundary that exposes domain selectors and mutation actions to descendant views.',
          },
          {
            term: 'Derived Selector',
            desc: 'Computed state (such as filtered To-Do counts or role permissions) calculated on the fly from normalized state.',
          },
        ],
        diagram: {
          top: 'User Interaction / Event Dispatch',
          middle1: 'Context Action & State Transition',
          middle2: 'Derived Selectors & Persistence Sync',
          bottom: 'Reactive UI Component Re-render',
        },
      },
    ],
    1: [
      {
        title: 'Caching Strategies & Stale-While-Revalidate (SWR)',
        topicHeading: 'Client-Side Caching & Optimistic UI',
        definition:
          'Stale-While-Revalidate (SWR) is a caching strategy that immediately serves cached data for instant UI responsiveness while asynchronously fetching fresh updates in the background.',
        majorFunctionsTitle: 'Major functions of client-side caching:',
        majorFunctions: [
          'It eliminates repetitive loading spinners when navigating back and forth between views.',
          'It applies optimistic UI updates immediately upon user submission before network confirmation.',
          'It deduplicates concurrent requests for identical resource keys.',
        ],
        partsTitle: 'Core Components of Cache Management',
        parts: [
          {
            term: 'Cache Key & TTL',
            desc: 'The deterministic identifier and freshness window that govern when cached entries require revalidation.',
          },
          {
            term: 'Optimistic Rollback',
            desc: 'A snapshot mechanism that restores prior state cleanly if an asynchronous mutation fails.',
          },
        ],
        diagram: {
          top: 'View Mount / Data Request',
          middle1: 'Instant Render from Warm Cache',
          middle2: 'Background Revalidation & Diff',
          bottom: 'Seamless UI Synchronization',
        },
      },
    ],
    2: [
      {
        title: 'Production Performance, Code Splitting & Edge Deployment',
        topicHeading: 'Production Bundle Optimization & Edge Delivery',
        definition:
          'Production engineering ensures sub-second First Contentful Paint (FCP) and smooth 60fps interactions through route-level code splitting, asset caching, and global edge distribution.',
        majorFunctionsTitle: 'Major functions of production optimization:',
        majorFunctions: [
          'It splits route bundles so users only download JavaScript required for the active screen.',
          'It sets immutable cache-control headers on fingerprinted static assets.',
          'It serves pre-rendered shells from the nearest geographic CDN edge node.',
        ],
        partsTitle: 'Parts of the Edge Delivery Pipeline',
        parts: [
          {
            term: 'Dynamic Import Chunking',
            desc: 'On-demand module loading that keeps the initial entry bundle lean and fast to parse.',
          },
          {
            term: 'Edge CDN Node',
            desc: 'Globally distributed point-of-presence servers that terminate TLS and serve cached assets close to the user.',
          },
        ],
        diagram: {
          top: 'Git Commit & Vite Production Build',
          middle1: 'Tree-Shaking & Asset Fingerprinting',
          middle2: 'Global Edge CDN Propagation',
          bottom: 'Low-Latency Client Experience',
        },
      },
    ],
  },
  'crs-5': {
    0: [
      {
        title: 'Curatorial Intent & The Professional Artist Statement',
        topicHeading: 'Curatorial Frameworks & Artist Intent',
        definition:
          'A professional artist statement articulates the philosophical, technical, and thematic motivations of a visual body of work, contextualizing studio discoveries for gallery curators and collectors.',
        majorFunctionsTitle: 'Core objectives of the artist statement:',
        majorFunctions: [
          'Establishes conceptual clarity without over-explaining visual metaphors.',
          'Frames technical materiality and medium choices in relation to subject matter.',
          'Provides critical vocabulary for exhibition labels, catalogs, and grant proposals.',
        ],
        partsTitle: 'Structural Pillars of Curatorial Staging',
        parts: [
          {
            term: 'Conceptual Thesis',
            desc: 'The central philosophical or emotional inquiry driving the studio collection.',
          },
          {
            term: 'Material Dialogue',
            desc: 'The intentional relationship between chosen mediums (oil, linen, graphite) and the message.',
          },
        ],
        diagram: {
          top: 'Core Conceptual Inquiry',
          middle1: 'Material & Studio Investigation',
          middle2: 'Peer Discourse & Curatorial Edit',
          bottom: 'Polished Artist Statement & Catalog',
        },
      },
      {
        title: 'Thematic Cohesion Across Multi-Medium Studio Bodies',
        topicHeading: 'Visual & Conceptual Cohesion in Portfolios',
        definition:
          'Thematic cohesion is the unifying visual rhythm, palette restraint, and conceptual resonance that binds disparate studio explorations into a singular gallery-ready portfolio.',
        majorFunctionsTitle: 'Methods for ensuring portfolio cohesion:',
        majorFunctions: [
          'Audit tonal values and chromatic palettes across all prospective pieces.',
          'Eliminate redundant or discordant studies that weaken curatorial impact.',
          'Sequence works to create an intentional narrative cadence for gallery visitors.',
        ],
        partsTitle: 'Curatorial Review Criteria',
        parts: [
          {
            term: 'Visual Thread',
            desc: 'A signature mark-making gesture or color harmony present across the entire series.',
          },
          {
            term: 'Focal Centerpiece',
            desc: 'The primary anchor artwork around which satellite studies and sketches orbit.',
          },
        ],
        diagram: {
          top: 'Expansive Studio Output',
          middle1: 'Curatorial Weeding & Value Sorting',
          middle2: 'Sequence Pacing & Spatial Rhythm',
          bottom: 'Unified 12-Piece Exhibition Body',
        },
      },
    ],
    1: [
      {
        title: 'Formal Critique Frameworks: Peer Review & Discourse',
        topicHeading: 'Critique Protocols & Objective Evaluation',
        definition:
          'Formal studio critique is an iterative peer evaluation methodology that analyzes composition, craftsmanship, and conceptual depth through structured dialogue rather than subjective taste.',
        majorFunctionsTitle: 'Standard critique protocol stages:',
        majorFunctions: [
          'Observation: Describe formal elements (line, value, shape, texture) objectively.',
          'Analysis: Deconstruct how elements guide eye movement and establish visual hierarchy.',
          'Interpretation & Synthesis: Discuss emotional resonance and propose refinements.',
        ],
        partsTitle: 'Critique Roles & Etiquette',
        parts: [
          {
            term: 'Presenter Intent',
            desc: 'Concise 2-minute overview framing specific areas requesting critical feedback.',
          },
          {
            term: 'Actionable Critique',
            desc: 'Constructive suggestions backed by formal design principles.',
          },
        ],
        diagram: {
          top: 'Studio Artwork Presentation',
          middle1: 'Objective Formal Analysis',
          middle2: 'Peer & Faculty Cross-Examination',
          bottom: 'Iterative Studio Action Plan',
        },
      },
    ],
    2: [
      {
        title: 'Gallery Staging, Lighting & Exhibition Archiving',
        topicHeading: 'Exhibition Design & Archival Documentation',
        definition:
          'Gallery staging bridges studio production and public reception through intentional wall spacing, calibrated 5000K lighting, hanging mechanics, and museum-grade digital archiving.',
        majorFunctionsTitle: 'Core exhibition staging standards:',
        majorFunctions: [
          'Maintain 58-inch eye-level centerlines across all hung pieces.',
          'Calibrate warm-neutral directional spot lighting to avoid glare on glazes.',
          'Capture high-res polarized RAW photographs for monograph publishing.',
        ],
        partsTitle: 'Archival Deliverables',
        parts: [
          {
            term: 'Exhibition Pedigree',
            desc: 'Detailed inventory log detailing dimensions, year, medium, and provenance.',
          },
          {
            term: 'Digital Monograph',
            desc: '300 DPI print-ready PDF catalog featuring artist statement and curatorial essays.',
          },
        ],
        diagram: {
          top: 'Finalized Studio Collection',
          middle1: '58-Inch Centerline Gallery Hanging',
          middle2: 'Calibrated Polarized Lighting',
          bottom: 'Permanent Digital & Print Monograph',
        },
      },
    ],
  },
  'crs-6': {
    0: [
      {
        title: 'Lines of Action & 30-Second Life Model Gestures',
        topicHeading: 'Dynamic Gesture Drawing & Rhythms',
        definition:
          'Gesture drawing captures the primary force, momentum, and expressive rhythm of the human body in rapid 30-second to 2-minute sketching intervals before committing to anatomy.',
        majorFunctionsTitle: 'Principles of dynamic gesture sketching:',
        majorFunctions: [
          'Establish a single sweeping line of action connecting the head through the supporting heel.',
          'Identify the torso twist and counter-tilt between shoulders and pelvis.',
          'Use dynamic tapering strokes to express muscle tension and gravitational weight.',
        ],
        partsTitle: 'Essential Gesture Elements',
        parts: [
          {
            term: 'Line of Action',
            desc: 'The imaginary curved axis that describes the main thrust and direction of the pose.',
          },
          {
            term: 'Opposing Angles',
            desc: 'The tilt of the shoulder girdle contrasting with the opposite angle of the hip axis.',
          },
        ],
        diagram: {
          top: 'Live Model Observed Pose',
          middle1: 'Sweeping Line of Action',
          middle2: 'Shoulder & Pelvic Counter-Tilt',
          bottom: 'Complete Dynamic Figure Gesture',
        },
      },
      {
        title: 'Contrapposto, Weight Tilts, & Center of Gravity',
        topicHeading: 'Contrapposto Mechanics & Anatomical Balance',
        definition:
          'Contrapposto is the natural asymmetrical posture where a figure shifts their weight onto one dominant leg, tilting the hips upward on the load-bearing side and relaxing the opposite limb.',
        majorFunctionsTitle: 'Mechanical checkpoints of contrapposto:',
        majorFunctions: [
          'Drop a vertical plum line from the sternum notch to the inside ankle of the standing leg.',
          'Angle the pelvis downward toward the free (bent) resting leg.',
          'Tense the latissimus and obliques on the compressed side of the torso.',
        ],
        partsTitle: 'Anatomical Balance Points',
        parts: [
          {
            term: 'Weight-Bearing Leg',
            desc: 'The locked pillar supporting 85% of bodily weight, aligning under the pelvic center.',
          },
          {
            term: 'Torso Compression Zone',
            desc: 'The creased lateral side of the waist where shoulder and hip tilts pinch together.',
          },
        ],
        diagram: {
          top: 'Sternum Notch Plumb Line',
          middle1: 'Load-Bearing Hip Elevation',
          middle2: 'Torso Pinch & Stretch Asymmetry',
          bottom: 'Effortless Grounded Contrapposto Pose',
        },
      },
    ],
    1: [
      {
        title: 'Torso Landmarks: Ribcage, Pelvis, & Spinal Twists',
        topicHeading: 'Skeletal Landmarks of the Human Torso',
        definition:
          'The torso acts as the central mechanical engine of character poses, composed of the rigid ribcage egg, the pelvic bowl, and the flexible lumbar spine connecting them.',
        majorFunctionsTitle: 'Critical skeletal landmarks to locate first:',
        majorFunctions: [
          'The 7th cervical vertebra (C7) and the suprasternal notch at the base of the neck.',
          'The anterior superior iliac spine (ASIS) points marking the front pelvic crest.',
          'The spinal furrow terminating at the sacrum triangle.',
        ],
        partsTitle: 'Torso Volumes',
        parts: [
          {
            term: 'Thoracic Box',
            desc: 'The rigid cage protecting heart and lungs, tilting independently of the hips.',
          },
          {
            term: 'Pelvic Cradle',
            desc: 'The tilted basin that anchors leg sockets and establishes standing balance.',
          },
        ],
        diagram: {
          top: 'Ribcage Egg vs. Pelvic Bowl',
          middle1: 'Lumbar Spine Flexibility Arc',
          middle2: 'Surface Landmark Alignment',
          bottom: 'Volumetric 3D Torso Block-Out',
        },
      },
    ],
    2: [
      {
        title: 'Silhouette Readability & Exaggerated Dynamic Force',
        topicHeading: 'Silhouette Readability & Digital Brush Economy',
        definition:
          'Silhouette readability ensures a character pose can be instantly recognized and understood purely as a solid black shape, maximizing clarity, attitude, and visual impact.',
        majorFunctionsTitle: 'Rules for high-clarity silhouettes:',
        majorFunctions: [
          'Separate limbs from the torso negative space so gestures do not blob together.',
          'Exaggerate straights against curves to emphasize muscular tension and bone solidity.',
          'Use confident single-pass strokes on digital stylus tablets rather than hairy chicken-scratching.',
        ],
        partsTitle: 'Contour Systems',
        parts: [
          {
            term: 'Straight vs. Curve',
            desc: 'Contrasting a tense flat contour with an opposing flexed muscular arc.',
          },
          {
            term: 'Negative Space Window',
            desc: 'Clear gaps between arms, legs, and torso that clarify the character action.',
          },
        ],
        diagram: {
          top: 'Complex Digital Underdrawing',
          middle1: 'Blackout Silhouette Readability Test',
          middle2: 'Negative Space Optimization',
          bottom: 'Finished High-Impact Character Plate',
        },
      },
    ],
  },
};

export const getDefaultUnitLessons = (course, unitIdx) => {
  // Courses without bundled lesson content (i.e. ones a teacher created) start empty:
  // the teacher adds the lessons themselves.
  if (!course || !COURSE_UNIT_LESSONS[course.id]) return [];
  const syllabus = course.syllabus?.length
    ? course.syllabus
    : [{ unit: 'Unit 1', title: 'Core Studio Foundations', lessons: 3 }];
  const unitObj = syllabus[unitIdx] || {
    unit: `Unit ${unitIdx + 1}`,
    title: 'Studio Foundations',
    lessons: 3,
  };
  const courseStockLessons = COURSE_UNIT_LESSONS[course.id] || {};
  const stockLessons = courseStockLessons[unitIdx] || [];
  const targetCount = Math.max(unitObj.lessons || 2, stockLessons.length);

  const unitLessons = [];
  for (let lIdx = 0; lIdx < targetCount; lIdx++) {
    if (stockLessons[lIdx]) {
      unitLessons.push(stockLessons[lIdx]);
    } else {
      const partNumber = lIdx + 1;
      unitLessons.push({
        title: `${unitObj.title} — Part ${partNumber}: Advanced Application`,
        topicHeading: `${unitObj.title} — Studio Deep-Dive`,
        definition: `Building upon foundational theory, this lesson deepens your practical proficiency in ${unitObj.title} through structured studio methodology, creative problem solving, and critique analysis for ${course.title}.`,
        majorFunctionsTitle: `Key objectives for Lesson ${partNumber}:`,
        majorFunctions: [
          `Demonstrate advanced command of visual language and technique in ${unitObj.title}.`,
          'Engage in peer critique and reflective iteration to refine visual fidelity.',
          'Produce academy-level portfolio deliverables adhering to professional studio standards.',
        ],
        partsTitle: `Core Elements of Lesson ${partNumber}`,
        parts: [
          {
            term: 'Methodological Precision',
            desc: 'Refining complex problem areas with iterative feedback and precision craft.',
          },
          {
            term: 'Portfolio Deliverable',
            desc: 'Finalizing the submission piece with documented process work and conceptual rationale.',
          },
        ],
        diagram: {
          top: `${unitObj.unit}: Part ${partNumber} Conceptual Brief`,
          middle1: 'Structured Exploration & Rapid Iteration',
          middle2: 'Iterative Faculty & Peer Critique',
          bottom: 'Final Milestone & Unit Deliverable',
        },
      });
    }
  }

  return unitLessons.map((les, lIdx) => ({
    id: les.id || `${course.id}-u${unitIdx + 1}-l${lIdx + 1}`,
    courseId: course.id,
    unitIdx,
    unitLabel: unitObj.unit || `Unit ${unitIdx + 1}`,
    unitTitle: unitObj.title,
    lessonNumber: lIdx + 1,
    ...les,
  }));
};

export const buildCourseUnitsWithItems = (
  course,
  courseAssignments = [],
  courseMaterials = [],
  customLessonsMap = {}
) => {
  if (!course) return [];
  const syllabus = course.syllabus?.length
    ? course.syllabus
    : [{ unit: 'Unit 1', title: 'Core Studio Foundations', lessons: 3 }];

  const courseCustomLessons =
    (customLessonsMap && customLessonsMap[course.id]) ||
    course.customLessons ||
    {};

  return syllabus.map((unitObj, unitIdx) => {
    let lessons;
    if (
      courseCustomLessons[unitIdx] &&
      Array.isArray(courseCustomLessons[unitIdx]) &&
      courseCustomLessons[unitIdx].length > 0
    ) {
      lessons = courseCustomLessons[unitIdx].map((les, lIdx) => ({
        id: les.id || `${course.id}-u${unitIdx + 1}-l${lIdx + 1}`,
        courseId: course.id,
        unitIdx,
        unitLabel: unitObj.unit || `Unit ${unitIdx + 1}`,
        unitTitle: unitObj.title,
        lessonNumber: lIdx + 1,
        ...les,
      }));
    } else {
      lessons = getDefaultUnitLessons(course, unitIdx);
    }

    // Assign materials and assignments across units
    const unitMaterials = courseMaterials.filter((m, mIdx) => {
      if (m.unitIdx !== undefined && m.unitIdx !== null) {
        return m.unitIdx === unitIdx;
      }
      return mIdx % syllabus.length === unitIdx;
    });

    const unitAssignments = courseAssignments.filter((a, aIdx) => {
      if (a.unitIdx !== undefined && a.unitIdx !== null) {
        return a.unitIdx === unitIdx;
      }
      return aIdx % syllabus.length === unitIdx;
    });

    return {
      unitIdx,
      unitLabel: unitObj.unit || `Unit ${unitIdx + 1}`,
      unitTitle: unitObj.title,
      lessons,
      materials: unitMaterials,
      assignments: unitAssignments,
    };
  });
};
