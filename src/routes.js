// Maps the old "activeTab" ids to URL paths.
// Existing components keep calling setActiveTab('courses') etc.
// and React Router now turns that into a real URL change.
export const TAB_PATHS = {
  welcome: '/',
  login: '/login',
  register: '/register',

  dashboard: '/dashboard',
  teacher: '/teacher',
  admin: '/admin',

  courses: '/courses',
  'course-details': '/course-details',
  'course-lesson': '/course-lesson',
  'create-course': '/courses/new',

  materials: '/materials',

  todo: '/todo',
  assignments: '/todo',
  'assignment-details': '/assignments/details',
  'create-assignment': '/assignments/new',
  'assignment-submit': '/assignments/submit',
  submissions: '/submissions',

  grades: '/grades',
  progress: '/progress',

  approvals: '/admin/approvals',
  users: '/admin/users',

  announcements: '/announcements',
  profile: '/profile',
  schedule: '/schedule',
  settings: '/settings',
};

// Reverse lookup: '/courses/new' -> 'create-course'
export const PATH_TO_TAB = Object.fromEntries(
  Object.entries(TAB_PATHS).map(([tab, path]) => [path, tab])
);