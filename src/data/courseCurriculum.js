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
};

export const buildCourseUnitsWithItems = (
  course,
  courseAssignments = [],
  courseMaterials = []
) => {
  if (!course) return [];
  const syllabus = course.syllabus?.length
    ? course.syllabus
    : [{ unit: 'Unit 1', title: 'Core Studio Foundations', lessons: 3 }];

  const courseLessonsMap = COURSE_UNIT_LESSONS[course.id] || {};

  return syllabus.map((unitObj, unitIdx) => {
    const predefinedLessons = courseLessonsMap[unitIdx] || [
      {
        title: `${unitObj.title} — Part 1: Core Concepts`,
        topicHeading: unitObj.title,
        definition: `${unitObj.title} introduces the foundational studio methodologies, theoretical frameworks, and practical workflows for ${course.title}.`,
        majorFunctionsTitle: `Key learning objectives of ${unitObj.unit}:`,
        majorFunctions: [
          'Understand the historical and contemporary principles underlying this studio unit.',
          'Apply structured analytical techniques to practical exercises and critiques.',
          'Prepare portfolio-grade deliverables aligned with academy rubrics.',
        ],
        partsTitle: `Core Components of ${unitObj.title}`,
        parts: [
          {
            term: 'Conceptual Foundation',
            desc: 'The theoretical principles and visual vocabulary that guide studio decision-making.',
          },
          {
            term: 'Applied Studio Craft',
            desc: 'Hands-on execution techniques refined through iterative sketching and feedback.',
          },
        ],
        diagram: {
          top: `${unitObj.unit}: Theoretical Briefing`,
          middle1: 'Guided Studio Exploration',
          middle2: 'Critique & Iterative Refinement',
          bottom: 'Mastery & Unit Deliverable',
        },
      },
      {
        title: `${unitObj.title} — Part 2: Applied Studio Practice`,
        topicHeading: `Applied Practice: ${unitObj.title}`,
        definition: `This lesson translates the core theory of ${unitObj.title} into step-by-step studio execution and critique readiness.`,
        majorFunctionsTitle: 'Major stages of applied execution:',
        majorFunctions: [
          'Develop thumbnail explorations to test multiple compositional solutions.',
          'Refine structural proportions, tonal contrast, and material finish.',
          'Document process work for peer and instructor review.',
        ],
        partsTitle: 'Parts of the Studio Workflow',
        parts: [
          {
            term: 'Exploratory Studies',
            desc: 'Rapid preliminary iterations created to test form, value, and structure before committing.',
          },
          {
            term: 'Final Resolution',
            desc: 'Polished execution meeting all technical and conceptual criteria of the unit rubric.',
          },
        ],
        diagram: {
          top: 'Preliminary Thumbnail Studies',
          middle1: 'Structural & Tonal Blocking',
          middle2: 'Detail Articulation & Polish',
          bottom: 'Completed Unit Study',
        },
      },
    ];

    const lessons = predefinedLessons.map((les, lIdx) => ({
      id: `${course.id}-u${unitIdx + 1}-l${lIdx + 1}`,
      courseId: course.id,
      unitIdx,
      unitLabel: unitObj.unit || `Unit ${unitIdx + 1}`,
      unitTitle: unitObj.title,
      lessonNumber: lIdx + 1,
      ...les,
    }));

    // Assign materials and assignments across units
    const unitMaterials = courseMaterials.filter(
      (_, mIdx) => mIdx % syllabus.length === unitIdx
    );
    const unitAssignments = courseAssignments.filter(
      (_, aIdx) => aIdx % syllabus.length === unitIdx
    );

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
