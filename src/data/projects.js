// ───────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for both the Projects grid and the ProjectDetail pages.
// Add / edit a project here and it updates everywhere.
//
// 👉 STORE LINKS live in each project's `stores` array:
//    { label, type: 'play' | 'app', url }
//    `label` is optional — use it when one card links to more than one app
//    (e.g. the white-label flavors Tickets99 / EventTitans / Poultry India).
//    A button renders for every entry that has a url, so an empty array simply
//    hides the store buttons.
// ───────────────────────────────────────────────────────────────────────────

export const projects = [
  // ── PRODUCTION (Elevents Metaestate Pvt Ltd) ─────────────────────────────
  {
    id: 1,
    category: 'production',
    title: 'White-Label Event Apps',
    company: 'Elevents Metaestate Pvt Ltd',
    role: 'React Native Developer',
    description:
      'One React Native codebase shipped as multiple white-label flavors — including Tickets99, EventTitans and Poultry India — each with its own branding, configuration and store listing. Payments, NFC, Bluetooth printing, QR check-in and biometric auth.',
    tagline: '7 branded flavors from one codebase — payments, NFC, Bluetooth printing, biometric auth.',
    tags: 'MOBILE · WHITE-LABEL',
    status: 'IN PRODUCTION',
    technologies: ['React Native', 'Expo', 'TypeScript'],
    primaryColor: '#ff4800',
    accentColor: '#ffaa00',
    image: '',
    icons: ['/tickets99_icon.webp', '/eventtitans_icon.webp', '/poultry_icon.webp'],
    liveUrl: '',
    githubUrl: '',
    stores: [
      { label: 'Tickets99', type: 'play', url: 'https://play.google.com/store/apps/details?id=com.tickets99&hl=en_IN' },
      { label: 'Tickets99', type: 'app', url: 'https://apps.apple.com/in/app/tickets99/id6448113384' },
      { label: 'EventTitans', type: 'play', url: 'https://play.google.com/store/apps/details?id=com.eventtitansapp&hl=en_IN' },
      { label: 'EventTitans', type: 'app', url: 'https://apps.apple.com/us/app/eventtitans/id1479541167' },
      { label: 'Poultry India', type: 'play', url: 'https://play.google.com/store/apps/details?id=com.poultryindiaapp&hl=en_IN' },
      { label: 'Poultry India', type: 'app', url: 'https://apps.apple.com/us/app/poultry-india/id6753649923' },
    ],
    detail: {
      subtitle: 'Flavor-based white-label event platform (Android & iOS).',
      summary:
        'A single React Native codebase configured into multiple branded "flavors" — Tickets99, EventTitans and Poultry India among them — covering the full event journey: discovery, booking, payment, on-site check-in and badge printing. Each flavor ships with its own branding, config and app-store listing.',
      challenge:
        'Deliver several distinctly branded, store-ready apps without maintaining separate codebases, while supporting hardware-heavy on-site workflows (NFC badges, Bluetooth printers, QR check-in) and secure payments across both platforms.',
      solution:
        'Engineered a flavor-driven React Native + Expo architecture with TypeScript and 100+ reusable components, where branding, theming and feature flags are configuration. Integrated Razorpay/Stripe payments, NFC, Bluetooth printing, QR scanning and Face ID / Fingerprint auth, then shipped each flavor through EAS Build to Google Play and the App Store. Built a cross-platform multi-printer Bluetooth module supporting Zebra, TVS, SUNMI, Brother and DCode printers — abstracting both ESC/POS (receipts) and ZPL (labels) over Bluetooth Classic with device discovery and auto-reconnect for uninterrupted on-site badge and receipt printing.',
      impactPoints: [
        'Multiple white-label flavors (Tickets99, EventTitans, Poultry India) from one codebase',
        'Branding, theming and features driven by per-flavor configuration',
        'Payments, NFC, Bluetooth printing, QR check-in and biometric auth',
        'Multi-printer Bluetooth module: single API across Zebra, TVS, SUNMI, Brother and DCode with ESC/POS + ZPL support and auto-reconnect',
        'Each flavor published and maintained on Google Play and the App Store',
      ],
    },
  },
  {
    id: 2,
    category: 'production',
    title: 'QuickStaff',
    company: 'Elevents Metaestate Pvt Ltd',
    role: 'React Native Developer',
    description:
      'Multi-role event staffing platform with role-based dashboards for workers, agencies, organizers and managers. Facial verification, wallet, attendance tracking and push notifications on a scalable AWS backend.',
    tagline: 'Four roles, one platform — facial verification, wallet and realtime attendance.',
    tags: 'MOBILE · MULTI-ROLE',
    status: 'IN PRODUCTION',
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'FastAPI', 'AWS'],
    primaryColor: '#ff6d00',
    accentColor: '#ffb600',
    image: '',
    icon: '/quickeventstaff_icon.webp',
    liveUrl: '',
    githubUrl: '',
    stores: [
      { type: 'play', url: 'https://play.google.com/store/search?q=quict%20event%20staff&c=apps&hl=en_IN' },
      { type: 'app', url: 'https://apps.apple.com/us/app/quick-event-staff/id6768188018' },
    ],
    detail: {
      subtitle: 'Multi-role event staffing platform.',
      summary:
        'An event staffing platform that connects workers, agencies, organizers and managers through dedicated role-based experiences — from shift assignment and attendance to wallet payouts.',
      challenge:
        'Serve four very different user roles in one app while handling identity verification, real-time attendance and secure payouts at scale.',
      solution:
        'Designed role-based dashboards backed by Node.js and Python FastAPI services on AWS with a PostgreSQL data layer. Implemented facial verification, an in-app wallet, attendance tracking and push notifications.',
      impactPoints: [
        'Role-based dashboards for workers, agencies, organizers and managers',
        'Facial verification and secure in-app wallet payouts',
        'Real-time attendance tracking and push notifications',
        'Scalable AWS backend with PostgreSQL and FastAPI services',
      ],
    },
  },
  // ── ACADEMIC / FREELANCE ─────────────────────────────────────────────────
  {
    id: 4,
    category: 'academic',
    title: 'SETHU Web App',
    company: '',
    role: 'Full Stack Developer',
    description:
      'Public-facing site for the SETHU initiative with storytelling-driven UX. Engineered a high-performance web interface serving 5k+ monthly users, improving engagement by 40%.',
    tagline: 'Storytelling-driven public site serving 5k+ monthly users.',
    tags: 'WEB · STORYTELLING',
    status: 'LIVE',
    technologies: ['React', 'Node.js', 'Firebase'],
    primaryColor: '#ff4800',
    accentColor: '#ffaa00',
    image: '/sethu_web.webp',
    liveUrl: 'https://team-sethu.web.app/',
    githubUrl: 'https://github.com/shankar379/SETHU-public',
    stores: [],
    detail: {
      subtitle: 'Public-facing site for SETHU initiative with storytelling-driven UX.',
      summary:
        'A public-facing website for the SETHU initiative featuring storytelling-driven user experience, real-time data synchronization, and responsive design that serves thousands of users monthly.',
      challenge:
        "Creating an engaging public-facing website that effectively communicates the SETHU initiative's mission while maintaining high performance for 5k+ monthly users.",
      solution:
        'Developed a high-performance web interface using React and Node.js with Firebase integration. Implemented code splitting, lazy loading, and optimized state management to ensure smooth performance even under high traffic conditions.',
      impactPoints: [
        'Improved user engagement by 40% through intuitive storytelling-driven UX',
        'Reduced loading times by 60% through optimized code practices',
        'Successfully served 5k+ monthly active users with consistent performance',
      ],
    },
  },
  {
    id: 5,
    category: 'academic',
    title: 'Time Table Generator',
    company: '',
    role: 'Full Stack Developer',
    description:
      'Constraint-driven timetable engine for academic departments. Automated scheduling system handling 500+ weekly schedules with 98% accuracy, cutting generation time from 3 weeks to under 3 hours.',
    tagline: 'Constraint engine that cut timetable generation from 3 weeks to 3 hours.',
    tags: 'AUTOMATION · SCHEDULING',
    status: 'LIVE',
    technologies: ['Python', 'Django', 'SQLite3'],
    primaryColor: '#ff6d00',
    accentColor: '#ffb600',
    image: '/timetable.webp',
    liveUrl: 'https://timetable-genaretor-vs.vercel.app/',
    githubUrl: 'https://github.com/shankar379/TG_NEW',
    stores: [],
    detail: {
      subtitle: 'Constraint-driven timetable engine for academic departments.',
      summary:
        'A scheduling assistant that automates timetables across departments by respecting faculty availability, room capacity, and curriculum priorities. Modular architecture ready for API and campus-wide integrations.',
      challenge:
        'Creating timetables manually was a time-consuming process (3 weeks) prone to errors, conflicts, and resource allocation issues across multiple departments.',
      solution:
        'Built an automated scheduling system using Python and Django that intelligently resolves scheduling conflicts, allocates resources efficiently, and considers multiple constraints including room availability, faculty preferences, and course requirements.',
      impactPoints: [
        'Cuts timetable generation time from 3 weeks to under 3 hours',
        'Handles 500+ weekly schedules with 98% accuracy',
        'Saved 200+ admin hours annually through process automation',
        'Supports cross-department resource sharing with collision detection',
      ],
    },
  },
  {
    id: 6,
    category: 'academic',
    title: 'Student Communication Platform',
    company: '',
    role: 'Full Stack Developer',
    description:
      'Real-time messaging and announcement hub for universities. Scalable chat system supporting 200+ concurrent users, enhancing student collaboration efficiency by 70%.',
    tagline: 'Realtime messaging hub supporting 200+ concurrent users.',
    tags: 'WEB · REALTIME',
    status: 'LIVE',
    technologies: ['React', 'Node.js', 'Firebase'],
    primaryColor: '#ff8500',
    accentColor: '#ff5400',
    image: '/student-communication.webp',
    liveUrl: 'https://student-communication-vs.web.app/',
    githubUrl: '',
    stores: [],
    detail: {
      subtitle: 'Real-time messaging and announcement hub for universities.',
      summary:
        'Scalable real-time messaging system designed to facilitate seamless communication and collaboration among students and faculty, featuring instant messaging, group chats, and announcement capabilities.',
      challenge:
        'Students and faculty needed a reliable, scalable communication system that could handle high concurrency while providing real-time messaging, file sharing, and group collaboration features.',
      solution:
        'Architected a scalable real-time chat system using React, Node.js, and Firebase. Implemented WebSocket connections for instant message delivery, optimized backend for high concurrency, and included features like message encryption, user presence indicators, and message history.',
      impactPoints: [
        'Supports 200+ concurrent users without performance degradation',
        'Enhanced student collaboration efficiency by 70%',
        'Real-time messaging and file sharing capabilities',
        'Improved communication flow between students and faculty',
      ],
    },
  },
];

// Helpers
export const getProjectById = (id) =>
  projects.find((p) => String(p.id) === String(id));

// Group a project's store links by flavor so each app name is shown once with
// its platform icons (Play / App Store) beside it — no duplicated labels.
// Returns { groups: [{ label, items }], unlabeled: [items] }.
export const groupStores = (stores = []) => {
  const withUrl = stores.filter((s) => s.url);
  const groups = [];
  const unlabeled = [];
  for (const s of withUrl) {
    if (!s.label) {
      unlabeled.push(s);
      continue;
    }
    let g = groups.find((x) => x.label === s.label);
    if (!g) {
      g = { label: s.label, items: [] };
      groups.push(g);
    }
    g.items.push(s);
  }
  return { groups, unlabeled };
};

export const productionProjects = projects.filter((p) => p.category === 'production');
export const academicProjects = projects.filter((p) => p.category === 'academic');

export default projects;
