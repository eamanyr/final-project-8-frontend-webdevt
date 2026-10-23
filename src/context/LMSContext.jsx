import React, { createContext, useContext, useState, useEffect } from 'react';
// CHANGED: router imports
import { useNavigate, useLocation } from 'react-router-dom';
import { TAB_PATHS, PATH_TO_TAB } from '../routes';
import {
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_MATERIALS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SCHEDULE,
  INITIAL_USER_SCHEDULES,
  INITIAL_REMINDERS,
  INITIAL_MEETINGS,
  INITIAL_COURSE_RATINGS,
  INITIAL_QUIZZES,
  INITIAL_QUIZ_SUBMISSIONS,
} from '../data/mockData';
import { getDefaultUnitLessons } from '../data/courseCurriculum';
import { api } from '../services/api';

const LMSContext = createContext(null);

export const useLMS = () => {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};

export const LMSProvider = ({ children }) => {
  // Initialize state with localStorage or defaults
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('cacheup_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((u) => u.id));
        const missing = INITIAL_USERS.filter((u) => !existingIds.has(u.id));
        const merged = parsed.map((u) => {
          const init = INITIAL_USERS.find((iu) => iu.id === u.id);
          if (init) {
            return {
              ...u,
              ...init,
              status: init.status,
              enrolledCourseIds: init.enrolledCourseIds ?? u.enrolledCourseIds ?? [],
            };
          }
          return u;
        });
        return [...merged, ...missing];
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  // CHANGED: nobody is logged in by default
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cacheup_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('cacheup_courses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((c) => c.id));
        const missing = INITIAL_COURSES.filter((c) => !existingIds.has(c.id));
        const combined = [...parsed, ...missing];
        return combined.map((c) => {
          const init = INITIAL_COURSES.find((ic) => ic.id === c.id);
          const dynamicThumb = c.thumbnail?.includes('photo-1579783902614-a3fb3927b675')
            ? 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=600&q=80'
            : c.thumbnail;
          if (init) {
            const syllabus = c.syllabus && c.syllabus.length ? c.syllabus : init.syllabus;
            const totalLessons = c.totalLessons ?? (
              syllabus ? syllabus.reduce((acc, u) => acc + (u.lessons || 0), 0) : init.totalLessons
            );
            return {
              ...c,
              thumbnail: dynamicThumb,
              totalLessons,
              syllabus,
              studentsCount: init.studentsCount,
              completedLessons: 0,
              progress: 0,
              customLessons: c.customLessons || {},
            };
          }
          return { ...c, thumbnail: dynamicThumb };
        });
      } catch {
        return INITIAL_COURSES;
      }
    }
    return INITIAL_COURSES;
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('cacheup_assignments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((a) => a.id));
        const missing = INITIAL_ASSIGNMENTS.filter((a) => !existingIds.has(a.id));
        return [...parsed, ...missing].map((a) => ({ ...a, status: a.status === 'Graded' ? 'Pending' : (a.status || 'Pending') }));
      } catch {
        return INITIAL_ASSIGNMENTS;
      }
    }
    return INITIAL_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('cacheup_submissions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((s) => s.id));
        const missing = INITIAL_SUBMISSIONS.filter((s) => !existingIds.has(s.id));
        return [...parsed, ...missing];
      } catch {
        return INITIAL_SUBMISSIONS;
      }
    }
    return INITIAL_SUBMISSIONS;
  });

  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('cacheup_materials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((m) => m.id));
        const missing = INITIAL_MATERIALS.filter((m) => !existingIds.has(m.id));
        return [...parsed, ...missing];
      } catch {
        return INITIAL_MATERIALS;
      }
    }
    return INITIAL_MATERIALS;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('cacheup_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [quizzes, setQuizzes] = useState(() => {
    const saved = localStorage.getItem('cacheup_quizzes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((q) => q.id));
        const missing = INITIAL_QUIZZES.filter((q) => !existingIds.has(q.id));
        return [...parsed, ...missing];
      } catch {
        return INITIAL_QUIZZES;
      }
    }
    return INITIAL_QUIZZES;
  });

  const [quizSubmissions, setQuizSubmissions] = useState(() => {
    const saved = localStorage.getItem('cacheup_quiz_submissions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((s) => s.id));
        const missing = INITIAL_QUIZ_SUBMISSIONS.filter((s) => !existingIds.has(s.id));
        return [...parsed, ...missing];
      } catch {
        return INITIAL_QUIZ_SUBMISSIONS;
      }
    }
    return INITIAL_QUIZ_SUBMISSIONS;
  });

  const [customLessons, setCustomLessons] = useState(() => {
    const saved = localStorage.getItem('cacheup_custom_lessons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  // Per-user schedules dictionary
  const [userSchedules, setUserSchedules] = useState(() => {
    const saved = localStorage.getItem('cacheup_user_schedules');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Administrators do not have class schedules
        parsed['usr-5'] = {
          title: 'Marcus Vance — Academic Administration (No Class Schedules)',
          items: [],
        };
        return {
          ...INITIAL_USER_SCHEDULES,
          ...parsed,
          'usr-5': {
            title: 'Marcus Vance — Academic Administration (No Class Schedules)',
            items: [],
          },
        };
      } catch {
        return INITIAL_USER_SCHEDULES;
      }
    }
    return INITIAL_USER_SCHEDULES;
  });

  useEffect(() => {
    localStorage.setItem('cacheup_user_schedules', JSON.stringify(userSchedules));
  }, [userSchedules]);

  // Active user's personalized schedule and title (admins do not have class schedules)
  const currentUserId = currentUser?.id || 'usr-1';
  const isAdmin = currentUser?.role === 'admin';
  const currentUserSchedule = isAdmin
    ? {
      title: `${currentUser?.name || 'Administrator'} — Academic Administration (No Class Schedules)`,
      items: [],
    }
    : userSchedules[currentUserId] ||
    INITIAL_USER_SCHEDULES[currentUserId] || {
      title: `${currentUser?.name || 'Student'} — Weekly Studio Schedule`,
      items: [],
    };

  const schedule = isAdmin ? [] : (currentUserSchedule.items || []);
  const scheduleTitle =
    currentUserSchedule.title ||
    `${currentUser?.name || 'Student'} — Weekly Studio Schedule`;

  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('cacheup_reminders');
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  const [courseMeetings, setCourseMeetings] = useState(() => {
    const saved = localStorage.getItem('cacheup_course_meetings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = { ...INITIAL_MEETINGS, ...parsed };
        Object.keys(merged).forEach((courseId) => {
          if (!merged[courseId].date) {
            merged[courseId].date = INITIAL_MEETINGS[courseId]?.date || '2026-10-19';
          }
        });
        return merged;
      } catch {
        return INITIAL_MEETINGS;
      }
    }
    return INITIAL_MEETINGS;
  });

  useEffect(() => {
    localStorage.setItem('cacheup_course_meetings', JSON.stringify(courseMeetings));
  }, [courseMeetings]);

  const [courseRatings, setCourseRatings] = useState(() => {
    const saved = localStorage.getItem('cacheup_course_ratings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_COURSE_RATINGS, ...parsed };
      } catch {
        return INITIAL_COURSE_RATINGS;
      }
    }
    return INITIAL_COURSE_RATINGS;
  });

  useEffect(() => {
    localStorage.setItem('cacheup_course_ratings', JSON.stringify(courseRatings));
  }, [courseRatings]);

  // Navigation and UI state
  // CHANGED: the active page now comes from the URL
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardPath = (user = currentUser) => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'teacher') return '/teacher';
    return '/dashboard';
  };

  const rawTab =
    location.pathname === '/assignments' || location.pathname === '/todo'
      ? 'assignments'
      : PATH_TO_TAB[location.pathname] ?? 'dashboard';
  const activeTab = rawTab === 'admin' || rawTab === 'teacher' ? 'dashboard' : rawTab;

  const [selectedCourseId, setSelectedCourseId] = useState('crs-1');
  const [courseActiveTab, setCourseActiveTab] = useState('syllabus');
  const [selectedLessonId, setSelectedLessonId] = useState('crs-1-u1-l1');
  // Initial viewed lessons for demo student Stella (usr-1)
  const INITIAL_STELLA_VIEWED_LESSONS = [
    'crs-1-u1-l1',
    'crs-1-u1-l2',
    'crs-1-u1-l3',
    'crs-1-u2-l1',
    'crs-1-u2-l2',
    'crs-2-u1-l1',
    'crs-2-u1-l2',
    'crs-3-u1-l1',
    'crs-3-u1-l2',
    'crs-3-u1-l3',
    'crs-3-u2-l1',
    'crs-3-u2-l2',
    'crs-3-u3-l1',
    'crs-3-u3-l2',
    'crs-4-u1-l1',
    'crs-4-u1-l2',
    'crs-4-u1-l3',
    'crs-4-u2-l1',
    'crs-5-u1-l1',
    'crs-5-u1-l2',
    'crs-5-u2-l1',
    'crs-6-u1-l1',
    'crs-6-u1-l2',
    'crs-6-u1-l3',
    'crs-6-u2-l1',
  ];

  // User-scoped viewed lessons: { [userId]: string[] }
  const [userViewedLessons, setUserViewedLessons] = useState(() => {
    const saved = localStorage.getItem('cacheup_user_viewed_lessons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    const legacy = localStorage.getItem('cacheup_viewed_lessons');
    let legacyList = null;
    if (legacy) {
      try {
        legacyList = JSON.parse(legacy);
      } catch {}
    }
    return {
      'usr-1': Array.isArray(legacyList) && legacyList.length > 0 ? legacyList : INITIAL_STELLA_VIEWED_LESSONS,
    };
  });

  // User-scoped completed courses: { [userId]: string[] }
  const [userCompletedCourses, setUserCompletedCourses] = useState(() => {
    const saved = localStorage.getItem('cacheup_user_completed_courses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      'usr-1': ['crs-3'],
    };
  });

  useEffect(() => {
    localStorage.setItem('cacheup_user_viewed_lessons', JSON.stringify(userViewedLessons));
  }, [userViewedLessons]);

  useEffect(() => {
    localStorage.setItem('cacheup_user_completed_courses', JSON.stringify(userCompletedCourses));
  }, [userCompletedCourses]);

  const viewedLessonIds = currentUser?.id ? (userViewedLessons[currentUser.id] || []) : [];

  const markLessonAsViewed = (lessonId) => {
    if (!lessonId || !currentUser?.id) return;
    setUserViewedLessons((prev) => {
      const userList = prev[currentUser.id] || [];
      if (userList.includes(lessonId)) return prev;
      return {
        ...prev,
        [currentUser.id]: [...userList, lessonId],
      };
    });
  };

  const [selectedAssignmentId, setSelectedAssignmentId] = useState('asg-1');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);
  const [assignmentOrigin, setAssignmentOrigin] = useState('todo');
  const [isScheduleEditMode, setIsScheduleEditMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Calculate course progress dynamically for any user
  const calculateCourseProgress = (
    course,
    user = currentUser,
    lessonViewsMap = userViewedLessons,
    completedMap = userCompletedCourses
  ) => {
    if (!course) return { progress: 0, completedLessons: 0, totalLessons: 0 };

    const syllabus = course.syllabus?.length
      ? course.syllabus
      : [{ unit: 'Unit 1', title: 'Core Studio Foundations', lessons: 3 }];

    const courseCustom = customLessons?.[course.id] || course.customLessons || {};
    const allLessonIds = [];
    syllabus.forEach((unitObj, unitIdx) => {
      if (
        courseCustom[unitIdx] &&
        Array.isArray(courseCustom[unitIdx]) &&
        courseCustom[unitIdx].length > 0
      ) {
        courseCustom[unitIdx].forEach((les, lIdx) => {
          allLessonIds.push(les.id || `${course.id}-u${unitIdx + 1}-l${lIdx + 1}`);
        });
      } else {
        const defaultLessons = getDefaultUnitLessons(course, unitIdx);
        defaultLessons.forEach((l) => allLessonIds.push(l.id));
      }
    });

    const totalLessons = allLessonIds.length || course.totalLessons || 1;

    if (!user) {
      return { progress: 0, completedLessons: 0, totalLessons };
    }

    const isEnrolled = user.enrolledCourseIds?.includes(course.id);
    if (!isEnrolled) {
      return { progress: 0, completedLessons: 0, totalLessons };
    }

    const userCompleted = user.id ? (completedMap[user.id] || []) : [];
    if (userCompleted.includes(course.id)) {
      return { progress: 100, completedLessons: totalLessons, totalLessons };
    }

    const userViews = user.id ? (lessonViewsMap[user.id] || []) : [];
    const completedCount = allLessonIds.filter((lid) => userViews.includes(lid)).length;

    if (completedCount === 0) {
      return { progress: 0, completedLessons: 0, totalLessons };
    }

    const progress = Math.min(100, Math.round((completedCount / totalLessons) * 100));
    return { progress, completedLessons: completedCount, totalLessons };
  };

  const getCourseProgress = (courseId, userOverride) => {
    const user = userOverride !== undefined ? userOverride : currentUser;
    const course = courses.find((c) => c.id === courseId);
    if (!course) return 0;
    const { progress } = calculateCourseProgress(course, user);
    return progress;
  };

  const coursesWithUserProgress = React.useMemo(() => {
    return courses.map((c) => {
      const { progress, completedLessons, totalLessons } = calculateCourseProgress(
        c,
        currentUser,
        userViewedLessons,
        userCompletedCourses
      );
      return {
        ...c,
        totalLessons,
        completedLessons,
        progress,
      };
    });
  }, [courses, currentUser, userViewedLessons, userCompletedCourses, customLessons]);

  const setActiveTab = (tab, userOverride) => {
    const targetUser = userOverride !== undefined ? userOverride : currentUser;
    if (tab === 'assignment-details') {
      if (
        location.pathname === '/course-details' ||
        location.pathname === '/course-lesson'
      ) {
        setAssignmentOrigin('course-details');
      } else if (location.pathname !== '/assignments/submit') {
        setAssignmentOrigin('todo');
      }
    }
    if (tab === 'dashboard') {
      navigate(getDashboardPath(targetUser));
      return;
    }
    navigate(TAB_PATHS[tab] ?? getDashboardPath(targetUser));
  };

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('cacheup_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cacheup_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cacheup_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cacheup_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('cacheup_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('cacheup_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('cacheup_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('cacheup_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('cacheup_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('cacheup_quiz_submissions', JSON.stringify(quizSubmissions));
  }, [quizSubmissions]);

  useEffect(() => {
    localStorage.setItem('cacheup_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('cacheup_custom_lessons', JSON.stringify(customLessons));
  }, [customLessons]);

  // Synchronize state with backend database on startup
  useEffect(() => {
    let isMounted = true;
    const syncDatabase = async () => {
      try {
        const isHealthy = await api.checkHealth();
        if (!isHealthy || !isMounted) return;

        const [
          resUsers,
          resCourses,
          resAssignments,
          resSubmissions,
          resQuizzes,
          resQuizSubs,
          resMaterials,
          resAnnouncements,
          resSchedules,
        ] = await Promise.allSettled([
          api.users.getAll(),
          api.courses.getAll(),
          api.assignments.getAll(),
          api.submissions.getAll(),
          api.quizzes.getAll(),
          api.quizzes.getSubmissions(),
          api.materials.getAll(),
          api.announcements.getAll(),
          api.schedules.getAll(),
        ]);

        if (isMounted) {
          if (resUsers.status === 'fulfilled' && Array.isArray(resUsers.value) && resUsers.value.length > 0) {
            setUsers(resUsers.value.map(u => ({ ...u, password: u.password || 'password123' })));
          }
          if (resCourses.status === 'fulfilled' && Array.isArray(resCourses.value) && resCourses.value.length > 0) {
            setCourses(resCourses.value);
          }
          if (resAssignments.status === 'fulfilled' && Array.isArray(resAssignments.value)) {
            setAssignments(resAssignments.value);
          }
          if (resSubmissions.status === 'fulfilled' && Array.isArray(resSubmissions.value)) {
            setSubmissions(resSubmissions.value);
          }
          if (resQuizzes.status === 'fulfilled' && Array.isArray(resQuizzes.value)) {
            setQuizzes(resQuizzes.value);
          }
          if (resQuizSubs.status === 'fulfilled' && Array.isArray(resQuizSubs.value)) {
            setQuizSubmissions(resQuizSubs.value);
          }
          if (resMaterials.status === 'fulfilled' && Array.isArray(resMaterials.value)) {
            setMaterials(resMaterials.value);
          }
          if (resAnnouncements.status === 'fulfilled' && Array.isArray(resAnnouncements.value)) {
            setAnnouncements(resAnnouncements.value);
          }
          if (resSchedules.status === 'fulfilled' && typeof resSchedules.value === 'object' && resSchedules.value !== null) {
            setUserSchedules(resSchedules.value);
          }
        }
      } catch (err) {
        console.warn('Backend sync failed, using cached/mock local state:', err);
      }
    };

    syncDatabase();
    return () => { isMounted = false; };
  }, []);

  // Toast Notification helper
  const addToast = (message, type = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Authentication actions
  const login = async (email, password) => {
    const cleanEmail = email.toLowerCase().trim();
    try {
      const res = await api.auth.login(cleanEmail, password);
      if (res && res.user) {
        const loggedUser = {
          ...res.user,
          id: res.user.id || res.user._id,
        };
        setCurrentUser(loggedUser);
        setActiveTab('dashboard', loggedUser);
        const teacherFirstName = loggedUser.name.replace(/^Prof\.\s*/i, '').trim().split(' ')[0];
        addToast(
          loggedUser.role === 'teacher'
            ? `Hello Prof. ${teacherFirstName}!`
            : `Welcome back, ${loggedUser.name}!`,
          'success'
        );
        return true;
      }
    } catch (err) {
      if (err.data && err.data.message) {
        addToast(err.data.message, err.status === 403 ? 'warning' : 'error');
        return false;
      }
    }

    // Local fallback if server unreachable
    const found = users.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (!found) {
      addToast('No user found with this email address.', 'error');
      return false;
    }
    const expectedPassword = found.password || 'password123';
    if (expectedPassword !== password) {
      addToast('Invalid password. Please check your credentials.', 'error');
      return false;
    }
    if (found.status === 'pending') {
      addToast('Registration pending admin approval. You cannot log in yet.', 'warning');
      return false;
    }
    if (found.status === 'rejected') {
      addToast('Your registration was not approved. Please contact administration.', 'error');
      return false;
    }
    setCurrentUser(found);
    setActiveTab('dashboard', found);
    const teacherFirstName = found.name.replace(/^Prof\.\s*/i, '').trim().split(' ')[0];
    addToast(
      found.role === 'teacher'
        ? `Hello Prof. ${teacherFirstName}!`
        : `Welcome back, ${found.name}!`,
      'success'
    );
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('login', null);
    addToast('You have been logged out securely.', 'info');
  };

  // Switch demo persona instantly
  const switchDemoUser = (role, targetTab = "dashboard") => {
    let target;
    if (role === 'student') {
      target = users.find((u) => u.id === 'usr-1') || users.find((u) => u.role === 'student' && u.status === 'approved');
    } else if (role === 'teacher') {
      target = users.find((u) => u.id === 'usr-3') || users.find((u) => u.role === 'teacher');
    } else if (role === 'admin') {
      target = users.find((u) => u.id === 'usr-5') || users.find((u) => u.role === 'admin');
    }
    if (target) {
      setCurrentUser(target);
      setActiveTab(targetTab, target);
      addToast(`Switched active persona to ${target.name} (${target.role.toUpperCase()})`, 'info');
    }
  };

  // Switch to specific user account by ID
  const switchUserById = (userId) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      addToast(`Switched active user to ${target.name} (${target.role.toUpperCase()})`, 'info');
    }
  };

  // Student Registration (synchronized with backend database)
  const registerStudent = async (formData) => {
    const email = formData.email.trim().toLowerCase();

    try {
      const res = await api.auth.register({
        name: formData.name.trim(),
        email,
        password: formData.password,
        department: formData.department,
        phone: formData.phone,
        bio: formData.bio,
        notes: formData.notes,
      });

      if (res && res.user) {
        const newUser = {
          ...res.user,
          id: res.user.id || res.user._id,
          password: formData.password || 'password123',
        };
        setUsers((prev) => [newUser, ...prev.filter((u) => u.id !== newUser.id && u.email?.toLowerCase() !== email)]);
        addToast('Registration submitted! An administrator will review and approve your account.', 'success');
        return newUser;
      }
    } catch (err) {
      console.warn('Backend register error:', err);
      if (err.data && err.data.message) {
        addToast(err.data.message, 'error');
        return null;
      }
      if (err.message && err.message.includes('fetch')) {
        console.warn('Backend server offline, falling back to local registration.');
      } else {
        addToast(err.message || 'Registration failed. Please check your details.', 'error');
        return null;
      }
    }

    // Offline local fallback if backend is unreachable
    if (users.some((u) => u.email.toLowerCase() === email)) {
      addToast('An account with this email already exists.', 'error');
      return null;
    }

    // Local fallback if backend is unreachable
    const newUser = {
      id: `usr-${Date.now()}`,
      name: formData.name.trim(),
      email,
      password: formData.password || 'password123',
      role: 'student',
      status: 'pending', // Awaiting Admin Approval
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(formData.name)}`,
      title: 'Prospective Student',
      bio: formData.bio || 'New student seeking enrollment at CacheUp Academy.',
      department: formData.department || 'Visual Arts & Web Engineering',
      studentId: `CU-${new Date().getFullYear()}-APP-${Math.floor(100 + Math.random() * 900)}`,
      phone: formData.phone || '+1 (555) 000-0000',
      joinedDate: 'October 2026',
      registrationNotes: formData.notes || 'Submitted online student registration form.',
      enrolledCourseIds: [],
      points: 0,
      gpa: 'N/A',
      streakDays: 1,
      studyHours: 0,
    };

    setUsers((prev) => [newUser, ...prev]);
    addToast('Registration submitted! An administrator will review and approve your account.', 'success');
    return newUser;
  };

  // Admin user approvals (persisted to backend database)
  const approveUser = (userId) => {
    api.users.updateStatus(userId, 'approved').catch((e) => console.warn(e));
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId || u._id === userId
          ? { ...u, status: 'approved', title: 'Enrolled Student' }
          : u
      )
    );
    addToast('Student registration approved! Student can now log in.', 'success');
  };

  const rejectUser = (userId, reason) => {
    api.users.updateStatus(userId, 'rejected').catch((e) => console.warn(e));
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId || u._id === userId
          ? { ...u, status: 'rejected', rejectionReason: reason || 'Application criteria incomplete' }
          : u
      )
    );
    addToast('Student registration rejected.', 'warning');
  };

  const updateUserRole = (userId, newRole) => {
    api.users.updateProfile(userId, { role: newRole }).catch((e) => console.warn(e));
    setUsers((prev) =>
      prev.map((u) => (u.id === userId || u._id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser?.id === userId || currentUser?._id === userId) {
      setCurrentUser((prev) => ({ ...prev, role: newRole }));
    }
    addToast(`User role updated to ${newRole}.`, 'success');
  };

  const deleteUser = (userId) => {
    if (currentUser?.id === userId || currentUser?._id === userId) {
      addToast('Cannot delete the currently logged in user!', 'error');
      return;
    }
    api.users.delete(userId).catch((e) => console.warn(e));
    setUsers((prev) => prev.filter((u) => u.id !== userId && u._id !== userId));
    addToast('User removed from system.', 'info');
  };

  const updateProfile = (updatedFields, message = 'Profile updated successfully!') => {
    if (!currentUser) return;
    const currentId = currentUser.id || currentUser._id;
    api.users.updateProfile(currentId, updatedFields).catch((e) => console.warn(e));
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentId || u._id === currentId ? updated : u)));
    addToast(message, 'success');
  };

  // Course actions
  const addCourse = (courseData) => {
    const newCourse = {
      id: `crs-${Date.now()}`,
      code: courseData.code || `CU-${Math.floor(100 + Math.random() * 900)}`,
      title: courseData.title,
      category: courseData.category || 'General',
      instructorId: currentUser?.id || 'usr-3',
      instructorName: currentUser?.name || 'Prof. Alicia Mayer',
      instructorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      level: courseData.level || 'Beginner level',
      duration: courseData.duration || '8 Weeks',
      totalLessons: parseInt(courseData.totalLessons) || 16,
      completedLessons: 0,
      progress: 0,
      studentsCount: 1,
      rating: 5.0,
      color: courseData.color || '#1e3f33',
      badge: 'New Course',
      thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
      description: courseData.description || 'Modern learning module on CacheUp.',
      schedule: courseData.schedule || 'Flexible Online Sessions',
      room: courseData.room || 'Virtual Lab 1',
      syllabus: courseData.syllabus || [
        { unit: 'Unit 1', title: 'Course Orientation & Fundamentals', lessons: 4 },
        { unit: 'Unit 2', title: 'Hands-on Exercises & Studio Critique', lessons: 6 },
        { unit: 'Unit 3', title: 'Capstone Project & Final Assessment', lessons: 6 }
      ]
    };
    api.courses.create(newCourse).catch((e) => console.warn(e));
    setCourses((prev) => [newCourse, ...prev]);
    addToast(`Course "${newCourse.title}" created successfully!`, 'success');
    return newCourse;
  };

  const updateCourse = (courseId, courseData) => {
    api.courses.update(courseId, courseData).catch((e) => console.warn(e));
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, ...courseData } : c))
    );
    addToast('Course details saved.', 'success');
  };

  const deleteCourse = (courseId) => {
    api.courses.delete(courseId).catch((e) => console.warn(e));
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    addToast('Course deleted.', 'info');
  };

  // Lesson Management within Course Units
  const getUnitLessonList = (courseId, unitIdx) => {
    const numUnitIdx = Number(unitIdx);
    const courseLessons = customLessons[courseId] || {};
    if (
      courseLessons[numUnitIdx] &&
      Array.isArray(courseLessons[numUnitIdx]) &&
      courseLessons[numUnitIdx].length > 0
    ) {
      return [...courseLessons[numUnitIdx]];
    }
    const course = courses.find((c) => c.id === courseId);
    return getDefaultUnitLessons(course, numUnitIdx);
  };

  const addLessonToCourseUnit = (courseId, unitIdx, lessonData) => {
    const numUnitIdx = Number(unitIdx);
    const currentList = getUnitLessonList(courseId, numUnitIdx);
    const lessonId = `${courseId}-u${numUnitIdx + 1}-l${Date.now()}`;
    const newLesson = {
      id: lessonId,
      courseId,
      unitIdx: numUnitIdx,
      title: lessonData.title,
      topicHeading: lessonData.topicHeading || lessonData.title,
      definition:
        lessonData.definition ||
        'Detailed studio instructional guide, technical fundamentals, and hands-on exercises.',
      majorFunctionsTitle:
        lessonData.majorFunctionsTitle || 'Key learning objectives for this lesson:',
      majorFunctions:
        Array.isArray(lessonData.majorFunctions) && lessonData.majorFunctions.length
          ? lessonData.majorFunctions
          : [
            'Analyze foundational principles and contemporary design theory.',
            'Apply techniques through structured hands-on studio iterations.',
            'Engage in peer critique and document comprehensive design rationale.',
          ],
      partsTitle:
        lessonData.partsTitle || 'Core Components & Technical Terminology',
      parts:
        Array.isArray(lessonData.parts) && lessonData.parts.length
          ? lessonData.parts
          : [
            {
              term: 'Theoretical Foundation',
              desc: 'Primary conceptual principle and studio background methodology.',
            },
            {
              term: 'Practical Studio Execution',
              desc: 'Step-by-step production method and portfolio deliverable.',
            },
          ],
      diagram: lessonData.diagram || {
        top: 'Visual Brief & Initial Concept',
        middle1: 'Iterative Exploration & Rapid Prototyping',
        middle2: 'Faculty Review & Structured Critique',
        bottom: 'Final Production Milestone & Unit Deliverable',
      },
      isCustom: true,
      createdAt: new Date().toISOString(),
      authorName: currentUser?.name || 'Course Instructor',
    };

    const updatedList = [...currentList, newLesson];

    setCustomLessons((prev) => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] || {}),
        [numUnitIdx]: updatedList,
      },
    }));

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const currentSyllabus = c.syllabus || [
          { unit: 'Unit 1', title: 'Course Orientation & Fundamentals', lessons: 3 },
          { unit: 'Unit 2', title: 'Hands-on Exercises & Studio Critique', lessons: 3 },
          { unit: 'Unit 3', title: 'Capstone Project & Final Assessment', lessons: 3 },
        ];
        const updatedSyllabus = currentSyllabus.map((u, idx) => {
          if (idx === numUnitIdx) {
            return { ...u, lessons: updatedList.length };
          }
          return u;
        });
        const currentCustomLessons = c.customLessons || {};
        return {
          ...c,
          syllabus: updatedSyllabus,
          totalLessons: updatedSyllabus.reduce((acc, u) => acc + (u.lessons || 0), 0),
          customLessons: {
            ...currentCustomLessons,
            [numUnitIdx]: updatedList,
          },
        };
      })
    );

    addToast(`Lesson "${newLesson.title}" added to Unit ${numUnitIdx + 1}!`, 'success');
    return newLesson;
  };

  const updateLessonInCourseUnit = (courseId, unitIdx, lessonId, updatedLessonData) => {
    const numUnitIdx = Number(unitIdx);
    const currentList = getUnitLessonList(courseId, numUnitIdx);
    const updatedList = currentList.map((les) =>
      les.id === lessonId ? { ...les, ...updatedLessonData } : les
    );

    setCustomLessons((prev) => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] || {}),
        [numUnitIdx]: updatedList,
      },
    }));

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const currentCustomLessons = c.customLessons || {};
        return {
          ...c,
          customLessons: {
            ...currentCustomLessons,
            [numUnitIdx]: updatedList,
          },
        };
      })
    );

    addToast(`Lesson "${updatedLessonData.title || 'Lesson'}" updated!`, 'success');
  };

  const reorderLessonsInCourseUnit = (courseId, unitIdx, lessonId, direction) => {
    const numUnitIdx = Number(unitIdx);
    const currentList = getUnitLessonList(courseId, numUnitIdx);
    const idx = currentList.findIndex((l) => l.id === lessonId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentList.length) return;

    const copy = [...currentList];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;

    setCustomLessons((prev) => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] || {}),
        [numUnitIdx]: copy,
      },
    }));

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const currentCustomLessons = c.customLessons || {};
        return {
          ...c,
          customLessons: {
            ...currentCustomLessons,
            [numUnitIdx]: copy,
          },
        };
      })
    );

    addToast('Lesson order updated!', 'success');
  };

  const moveLesson = (courseId, fromUnitIdx, fromIndex, toUnitIdx, toIndex) => {
    const numFromUnit = Number(fromUnitIdx);
    const numToUnit = Number(toUnitIdx);
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    if (numFromUnit === numToUnit) {
      const currentList = getUnitLessonList(courseId, numFromUnit);
      if (
        fromIndex < 0 ||
        fromIndex >= currentList.length ||
        toIndex < 0 ||
        toIndex >= currentList.length ||
        fromIndex === toIndex
      ) {
        return;
      }
      const copy = [...currentList];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);

      setCustomLessons((prev) => ({
        ...prev,
        [courseId]: {
          ...(prev[courseId] || {}),
          [numFromUnit]: copy,
        },
      }));

      setCourses((prev) =>
        prev.map((c) => {
          if (c.id !== courseId) return c;
          const currentCustomLessons = c.customLessons || {};
          return {
            ...c,
            customLessons: {
              ...currentCustomLessons,
              [numFromUnit]: copy,
            },
          };
        })
      );
      addToast(`Lesson "${moved.title}" moved to position ${toIndex + 1}!`, 'success');
      return;
    }

    // Moving between different units
    const fromList = getUnitLessonList(courseId, numFromUnit);
    const toList = getUnitLessonList(courseId, numToUnit);
    if (fromIndex < 0 || fromIndex >= fromList.length) return;

    const fromCopy = [...fromList];
    const [moved] = fromCopy.splice(fromIndex, 1);
    const toCopy = [...toList];
    const safeToIndex = Math.max(0, Math.min(toIndex, toCopy.length));
    const updatedMoved = {
      ...moved,
      unitIdx: numToUnit,
      unitLabel: `Unit ${numToUnit + 1}`,
    };
    toCopy.splice(safeToIndex, 0, updatedMoved);

    setCustomLessons((prev) => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] || {}),
        [numFromUnit]: fromCopy,
        [numToUnit]: toCopy,
      },
    }));

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const currentCustomLessons = c.customLessons || {};
        const currentSyllabus = c.syllabus || [];
        const updatedSyllabus = currentSyllabus.map((u, idx) => {
          if (idx === numFromUnit) return { ...u, lessons: fromCopy.length };
          if (idx === numToUnit) return { ...u, lessons: toCopy.length };
          return u;
        });
        return {
          ...c,
          syllabus: updatedSyllabus,
          customLessons: {
            ...currentCustomLessons,
            [numFromUnit]: fromCopy,
            [numToUnit]: toCopy,
          },
        };
      })
    );
    addToast(`Moved "${moved.title}" to Unit ${numToUnit + 1}!`, 'success');
  };

  const moveLessonToIndex = (courseId, unitIdx, fromIndex, toIndex) => {
    moveLesson(courseId, unitIdx, fromIndex, unitIdx, toIndex);
  };

  const deleteLessonFromCourseUnit = (courseId, unitIdx, lessonId) => {
    const numUnitIdx = Number(unitIdx);
    const currentList = getUnitLessonList(courseId, numUnitIdx);
    const updatedList = currentList.filter((l) => l.id !== lessonId);

    setCustomLessons((prev) => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] || {}),
        [numUnitIdx]: updatedList,
      },
    }));

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const currentSyllabus = c.syllabus || [];
        const updatedSyllabus = currentSyllabus.map((u, idx) => {
          if (idx === numUnitIdx) {
            return { ...u, lessons: updatedList.length };
          }
          return u;
        });
        const currentCustomLessons = c.customLessons || {};
        return {
          ...c,
          syllabus: updatedSyllabus,
          totalLessons: updatedSyllabus.reduce((acc, u) => acc + (u.lessons || 0), 0),
          customLessons: {
            ...currentCustomLessons,
            [numUnitIdx]: updatedList,
          },
        };
      })
    );

    addToast('Lesson removed from unit.', 'info');
  };

  const toggleEnrollCourse = (courseId) => {
    if (!currentUser) return;
    const isEnrolled = currentUser.enrolledCourseIds?.includes(courseId);
    let updatedIds;
    if (isEnrolled) {
      updatedIds = currentUser.enrolledCourseIds.filter((id) => id !== courseId);
      addToast('Unenrolled from course.', 'info');
    } else {
      updatedIds = [...(currentUser.enrolledCourseIds || []), courseId];
      // Reset any viewed lessons and completion for this course so the student starts fresh at 0% progress
      if (currentUser?.id) {
        setUserViewedLessons((prev) => {
          const userList = prev[currentUser.id] || [];
          const cleaned = userList.filter((lid) => !lid.startsWith(`${courseId}-`));
          return { ...prev, [currentUser.id]: cleaned };
        });
        setUserCompletedCourses((prev) => {
          const userList = prev[currentUser.id] || [];
          const cleaned = userList.filter((id) => id !== courseId);
          return { ...prev, [currentUser.id]: cleaned };
        });
      }
      addToast('Successfully enrolled! Welcome to the course.', 'success');
    }
    const updatedUser = { ...currentUser, enrolledCourseIds: updatedIds };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
  };

  // Assignment actions
  const addAssignment = (data) => {
    const course = courses.find((c) => c.id === data.courseId);
    const newAsg = {
      id: `asg-${Date.now()}`,
      courseId: data.courseId,
      courseName: course ? course.title : (data.courseName || 'General Course'),
      unitIdx:
        data.unitIdx !== undefined && data.unitIdx !== '' && data.unitIdx !== 'all'
          ? Number(data.unitIdx)
          : undefined,
      title: data.title,
      description: data.description || 'Complete the assigned task and submit your work.',
      dueDate: data.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      dueTime: data.dueTime || '11:59 PM',
      duration: data.duration || '2 hours',
      maxScore: parseInt(data.maxScore) || 100,
      priority: data.priority || 'Medium',
      priorityColor: data.priority === 'High' ? 'gold' : data.priority === 'Low' ? 'sage' : 'forest',
      status: 'Pending',
      publishedAt: new Date().toISOString().slice(0, 10),
      rubric: data.rubric || [{ criteria: 'Standard Execution & Quality', points: 100 }],
      submissionTypes: data.submissionTypes || ['pdf', 'link']
    };
    api.assignments.create(newAsg).catch((e) => console.warn(e));
    setAssignments((prev) => [...prev, newAsg]);
    addToast(`Assignment "${newAsg.title}" published!`, 'success');
    return newAsg;
  };

  const updateAssignment = (id, data) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const updatedCourse = data.courseId ? courses.find((c) => c.id === data.courseId) : null;
        return {
          ...a,
          ...data,
          courseName: updatedCourse ? updatedCourse.title : a.courseName,
          unitIdx:
            data.unitIdx !== undefined
              ? (data.unitIdx === '' || data.unitIdx === 'all' ? undefined : Number(data.unitIdx))
              : a.unitIdx,
          priorityColor:
            (data.priority || a.priority) === 'High'
              ? 'gold'
              : (data.priority || a.priority) === 'Low'
                ? 'sage'
                : 'forest',
        };
      })
    );
    addToast('Assignment updated successfully.', 'success');
  };

  const deleteAssignment = (id) => {
    api.assignments.delete(id).catch((e) => console.warn(e));
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    setSubmissions((prev) => prev.filter((s) => s.assignmentId !== id));
    addToast('Assignment removed.', 'info');
  };

  const reorderAssignmentInUnit = (courseId, unitIdx, assignmentId, direction) => {
    const numUnitIdx = Number(unitIdx);
    setAssignments((prev) => {
      const course = courses.find((c) => c.id === courseId);
      const sylLen = course?.syllabus?.length || 3;
      const unitAsgs = prev.filter(
        (a, idx) =>
          a.courseId === courseId &&
          (a.unitIdx !== undefined ? a.unitIdx === numUnitIdx : (idx % sylLen === numUnitIdx))
      );
      const curIdx = unitAsgs.findIndex((a) => a.id === assignmentId);
      if (curIdx === -1) return prev;
      const targetIdx = direction === 'up' ? curIdx - 1 : curIdx + 1;
      if (targetIdx < 0 || targetIdx >= unitAsgs.length) return prev;

      const itemA = unitAsgs[curIdx];
      const itemB = unitAsgs[targetIdx];
      const posA = prev.findIndex((a) => a.id === itemA.id);
      const posB = prev.findIndex((a) => a.id === itemB.id);
      if (posA === -1 || posB === -1) return prev;

      const copy = [...prev];
      copy[posA] = itemB;
      copy[posB] = itemA;
      return copy;
    });
    addToast('Assignment arrangement updated!', 'success');
  };

  const moveAssignment = (courseId, fromUnitIdx, fromIndex, toUnitIdx, toIndex) => {
    const numFromUnit = Number(fromUnitIdx);
    const numToUnit = Number(toUnitIdx);

    setAssignments((prev) => {
      const course = courses.find((c) => c.id === courseId);
      const sylLen = course?.syllabus?.length || 3;
      const fromAsgs = prev.filter(
        (a, idx) =>
          a.courseId === courseId &&
          (a.unitIdx !== undefined ? a.unitIdx === numFromUnit : (idx % sylLen === numFromUnit))
      );
      if (fromIndex < 0 || fromIndex >= fromAsgs.length) return prev;
      const movedItem = fromAsgs[fromIndex];
      const fromPos = prev.findIndex((a) => a.id === movedItem.id);
      if (fromPos === -1) return prev;

      const copy = [...prev];
      const [moved] = copy.splice(fromPos, 1);
      const updatedMoved = { ...moved, unitIdx: numToUnit };

      const toAsgs = copy.filter(
        (a, idx) =>
          a.courseId === courseId &&
          (a.unitIdx !== undefined ? a.unitIdx === numToUnit : (idx % sylLen === numToUnit))
      );
      const safeToIndex = Math.max(0, Math.min(toIndex, toAsgs.length));
      if (toAsgs.length === 0 || safeToIndex >= toAsgs.length) {
        copy.push(updatedMoved);
      } else {
        const targetItem = toAsgs[safeToIndex];
        const toPos = copy.findIndex((a) => a.id === targetItem.id);
        copy.splice(toPos, 0, updatedMoved);
      }
      return copy;
    });
    addToast('Assignment arrangement updated!', 'success');
  };

  const moveAssignmentToIndex = (courseId, unitIdx, fromIndex, toIndex) => {
    moveAssignment(courseId, unitIdx, fromIndex, unitIdx, toIndex);
  };

  // Submission & Grading actions
  const submitAssignment = (data) => {
    const assignment = assignments.find((a) => a.id === data.assignmentId);
    const newSub = {
      id: `sub-${Date.now()}`,
      assignmentId: data.assignmentId,
      assignmentTitle: assignment ? assignment.title : 'Assignment',
      courseId: assignment ? assignment.courseId : 'crs-1',
      courseName: assignment?.courseName || 'Course',
      studentId: currentUser?.id || 'usr-1',
      studentName: currentUser?.name || 'Student',
      studentAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      submissionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      submissionType: data.submissionType || (data.linkUrl ? 'link' : data.fileName ? 'file' : 'text'),
      content: data.content || '',
      linkUrl: data.linkUrl || '',
      fileName: data.fileName || (data.submissionType === 'file' ? 'Assignment_Submission.pdf' : ''),
      fileSize: data.fileSize || (data.submissionType === 'file' ? '2.8 MB' : ''),
      fileUrl: data.fileUrl || '',
      status: 'Submitted',
      score: null,
      maxScore: assignment?.maxScore || 100,
      feedback: '',
      rubricScores: null,
      gradedBy: null,
      gradedAt: null
    };

    api.submissions.submit(newSub).catch((e) => console.warn(e));
    setSubmissions((prev) => [newSub, ...prev]);
    addToast('Assignment submitted successfully! Great work.', 'success');
    return newSub;
  };

  const gradeSubmission = (subId, score, feedback, rubricScores = null) => {
    api.submissions.grade(subId, { score, feedback, rubricScores, gradedBy: currentUser?.name || 'Instructor' }).catch((e) => console.warn(e));
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === subId) {
          return {
            ...s,
            score: parseInt(score),
            feedback,
            rubricScores: rubricScores !== null ? rubricScores : s.rubricScores,
            status: 'Graded',
            gradedBy: currentUser?.name || 'Prof. Alicia Mayer',
            gradedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
          };
        }
        return s;
      })
    );
    addToast('Grade and constructive feedback recorded!', 'success');
  };

  // Multiple Choice Quiz actions
  const addQuiz = (data) => {
    const course = courses.find((c) => c.id === data.courseId);
    const questions = data.questions || [];
    const totalPoints = questions.reduce((acc, q) => acc + (Number(q.points) || 10), 0);
    const newQuiz = {
      id: `quiz-${Date.now()}`,
      courseId: data.courseId,
      courseName: course ? course.title : (data.courseName || 'Course Assessment'),
      unitIdx: data.unitIdx !== undefined && data.unitIdx !== '' ? Number(data.unitIdx) : 0,
      title: data.title || 'Multiple Choice Quiz',
      description: data.description || 'Answer the following multiple choice questions.',
      dueDate: data.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      dueTime: data.dueTime || '11:59 PM',
      duration: data.duration || (data.timeLimitMinutes ? `${data.timeLimitMinutes} minutes` : '20 minutes'),
      timeLimitMinutes: Number(data.timeLimitMinutes) || 20,
      passingScorePercent: Number(data.passingScorePercent) || 70,
      totalPoints: totalPoints || Number(data.totalPoints) || 40,
      status: 'Active',
      publishedAt: new Date().toISOString().slice(0, 10),
      questions: questions.length > 0 ? questions : [
        {
          id: `q-${Date.now()}-1`,
          prompt: 'Enter your multiple choice question here...',
          points: 10,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctOptionIndex: 0,
          explanation: 'Explanation for correct choice.'
        }
      ]
    };

    api.quizzes.create(newQuiz).catch((e) => console.warn(e));
    setQuizzes((prev) => [...prev, newQuiz]);
    addToast(`Quiz "${newQuiz.title}" created successfully!`, 'success');
    return newQuiz;
  };

  const updateQuiz = (id, data) => {
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        const course = data.courseId ? courses.find((c) => c.id === data.courseId) : null;
        const questions = data.questions !== undefined ? data.questions : q.questions;
        const totalPoints = questions.reduce((acc, item) => acc + (Number(item.points) || 10), 0);
        return {
          ...q,
          ...data,
          courseName: course ? course.title : q.courseName,
          questions,
          totalPoints: totalPoints || data.totalPoints || q.totalPoints,
          unitIdx: data.unitIdx !== undefined ? Number(data.unitIdx) : q.unitIdx
        };
      })
    );
    addToast('Quiz updated successfully.', 'success');
  };

  const deleteQuiz = (id) => {
    api.quizzes.delete(id).catch((e) => console.warn(e));
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
    setQuizSubmissions((prev) => prev.filter((s) => s.quizId !== id));
    addToast('Quiz removed.', 'info');
  };

  const submitQuiz = (data) => {
    const quiz = quizzes.find((q) => q.id === data.quizId);
    let earnedScore = 0;
    const maxScore = quiz?.totalPoints || 100;

    if (quiz && quiz.questions) {
      quiz.questions.forEach((q) => {
        const studentChoice = data.answers?.[q.id];
        if (studentChoice !== undefined && studentChoice === q.correctOptionIndex) {
          earnedScore += Number(q.points) || 10;
        }
      });
    } else {
      earnedScore = data.score || 0;
    }

    const percentage = maxScore > 0 ? Math.round((earnedScore / maxScore) * 100) : 100;
    const passed = percentage >= (quiz?.passingScorePercent || 70);

    const newSub = {
      id: `qsub-${Date.now()}`,
      quizId: data.quizId,
      quizTitle: quiz ? quiz.title : 'Quiz Assessment',
      courseId: quiz ? quiz.courseId : 'crs-1',
      courseName: quiz ? quiz.courseName : 'Course',
      studentId: currentUser?.id || 'usr-1',
      studentName: currentUser?.name || 'Student',
      studentAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      answers: data.answers || {},
      score: earnedScore,
      maxScore,
      percentage,
      passed,
      timeSpent: data.timeSpent || 'Completed'
    };

    api.quizzes.submit(newSub).catch((e) => console.warn(e));
    setQuizSubmissions((prev) => [newSub, ...prev]);
    addToast(`Quiz submitted! Your score: ${earnedScore}/${maxScore} (${percentage}%)`, passed ? 'success' : 'info');
    return newSub;
  };

  // Learning Materials actions
  const addMaterial = (data) => {
    const course = courses.find((c) => c.id === data.courseId);
    const newMat = {
      id: `mat-${Date.now()}`,
      courseId: data.courseId,
      courseTitle: course ? course.title : (data.courseTitle || 'Course Material'),
      title: data.title,
      type: data.type || 'pdf',
      size: data.size || '4.5 MB',
      uploadDate: new Date().toISOString().slice(0, 10),
      uploadedBy: currentUser?.name || 'Instructor',
      downloadUrl: data.downloadUrl || '#',
      description: data.description || 'Uploaded study resource for CacheUp students.',
      unitIdx:
        data.unitIdx !== undefined && data.unitIdx !== '' && data.unitIdx !== 'all'
          ? Number(data.unitIdx)
          : undefined,
    };
    api.materials.create(newMat).catch((e) => console.warn(e));
    setMaterials((prev) => [newMat, ...prev]);
    addToast(`Material "${newMat.title}" added to course resources!`, 'success');
    return newMat;
  };

  const deleteMaterial = (id) => {
    api.materials.delete(id).catch((e) => console.warn(e));
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    addToast('Learning material removed.', 'info');
  };

  const updateMaterial = (id, data) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        return {
          ...m,
          ...data,
          unitIdx:
            data.unitIdx !== undefined
              ? (data.unitIdx === '' || data.unitIdx === 'all' ? undefined : Number(data.unitIdx))
              : m.unitIdx,
        };
      })
    );
    addToast('Learning material updated.', 'success');
  };

  const reorderMaterialInUnit = (courseId, unitIdx, materialId, direction) => {
    const numUnitIdx = Number(unitIdx);
    setMaterials((prev) => {
      const course = courses.find((c) => c.id === courseId);
      const sylLen = course?.syllabus?.length || 3;
      const unitMats = prev.filter(
        (m, idx) =>
          m.courseId === courseId &&
          (m.unitIdx !== undefined ? m.unitIdx === numUnitIdx : (idx % sylLen === numUnitIdx))
      );
      const curIdx = unitMats.findIndex((m) => m.id === materialId);
      if (curIdx === -1) return prev;
      const targetIdx = direction === 'up' ? curIdx - 1 : curIdx + 1;
      if (targetIdx < 0 || targetIdx >= unitMats.length) return prev;

      const itemA = unitMats[curIdx];
      const itemB = unitMats[targetIdx];
      const posA = prev.findIndex((m) => m.id === itemA.id);
      const posB = prev.findIndex((m) => m.id === itemB.id);
      if (posA === -1 || posB === -1) return prev;

      const copy = [...prev];
      copy[posA] = itemB;
      copy[posB] = itemA;
      return copy;
    });
    addToast('Material arrangement updated!', 'success');
  };

  const moveMaterial = (courseId, fromUnitIdx, fromIndex, toUnitIdx, toIndex) => {
    const numFromUnit = Number(fromUnitIdx);
    const numToUnit = Number(toUnitIdx);

    setMaterials((prev) => {
      const course = courses.find((c) => c.id === courseId);
      const sylLen = course?.syllabus?.length || 3;
      const fromMats = prev.filter(
        (m, idx) =>
          m.courseId === courseId &&
          (m.unitIdx !== undefined ? m.unitIdx === numFromUnit : (idx % sylLen === numFromUnit))
      );
      if (fromIndex < 0 || fromIndex >= fromMats.length) return prev;
      const movedItem = fromMats[fromIndex];
      const fromPos = prev.findIndex((m) => m.id === movedItem.id);
      if (fromPos === -1) return prev;

      const copy = [...prev];
      const [moved] = copy.splice(fromPos, 1);
      const updatedMoved = { ...moved, unitIdx: numToUnit };

      const toMats = copy.filter(
        (m, idx) =>
          m.courseId === courseId &&
          (m.unitIdx !== undefined ? m.unitIdx === numToUnit : (idx % sylLen === numToUnit))
      );
      const safeToIndex = Math.max(0, Math.min(toIndex, toMats.length));
      if (toMats.length === 0 || safeToIndex >= toMats.length) {
        copy.push(updatedMoved);
      } else {
        const targetItem = toMats[safeToIndex];
        const toPos = copy.findIndex((m) => m.id === targetItem.id);
        copy.splice(toPos, 0, updatedMoved);
      }
      return copy;
    });
    addToast('Material arrangement updated!', 'success');
  };

  const moveMaterialToIndex = (courseId, unitIdx, fromIndex, toIndex) => {
    moveMaterial(courseId, unitIdx, fromIndex, unitIdx, toIndex);
  };

  // Announcements actions
  const addAnnouncement = (data) => {
    const course = data.courseId === 'all' ? null : courses.find((c) => c.id === data.courseId);
    const newAnc = {
      id: `anc-${Date.now()}`,
      title: data.title,
      courseId: data.courseId || 'all',
      courseName: course ? course.title : 'All Courses & Academy Wide',
      authorName: currentUser?.name || 'Administrator',
      authorRole: currentUser?.role === 'teacher' ? 'Course Instructor' : 'Academic Dean',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      date: new Date().toISOString().slice(0, 10),
      priority: data.priority || 'Normal',
      isRead: false,
      content: data.content
    };
    api.announcements.create(newAnc).catch((e) => console.warn(e));
    setAnnouncements((prev) => [newAnc, ...prev]);
    addToast('Announcement broadcasted to students and staff!', 'success');
  };

  const markAnnouncementAsRead = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
  };

  const deleteAnnouncement = (id) => {
    api.announcements.delete(id).catch((e) => console.warn(e));
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    addToast('Announcement deleted.', 'info');
  };

  const addAnnouncementReply = (announcementId, content, existingReplies = []) => {
    const newReply = {
      id: `rep-${Date.now()}`,
      authorName: currentUser?.name || 'Student',
      authorRole: currentUser?.role || 'student',
      authorAvatar:
        currentUser?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      content,
    };
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === announcementId
          ? { ...a, replies: [...(a.replies ?? existingReplies), newReply] }
          : a
      )
    );
    addToast('Comment posted to announcement!', 'success');
  };

  // Schedule actions (scoped to active user)
  const setScheduleTitle = (newTitle) => {
    setUserSchedules((prev) => ({
      ...prev,
      [currentUserId]: {
        ...(prev[currentUserId] || currentUserSchedule),
        title: newTitle,
      },
    }));
  };

  const setSchedule = (updater) => {
    setUserSchedules((prev) => {
      const currentEntry = prev[currentUserId] || currentUserSchedule;
      const currentItems = currentEntry.items || [];
      const newItems = typeof updater === 'function' ? updater(currentItems) : updater;
      return {
        ...prev,
        [currentUserId]: {
          ...currentEntry,
          items: newItems,
        },
      };
    });
  };

  const addScheduleItem = (data) => {
    const days = Array.isArray(data.days) && data.days.length > 0 ? data.days : [data.day || 'Monday'];
    const newItem = {
      id: `sch-${Date.now()}`,
      code: data.code || 'CRS-101',
      title: data.title || 'Studio Session',
      courseId: data.courseId || 'crs-1',
      course: data.course || data.title || 'General Studio',
      days,
      day: days.join(', '),
      startTime: data.startTime || '09:00',
      endTime: data.endTime || '10:30',
      time: data.time || `${data.startTime || '09:00'} - ${data.endTime || '10:30'}`,
      date: data.date || '2026-10-19',
      color: data.color || 'sage',
      instructor: data.instructor || currentUser?.name || 'Prof. Alicia Mayer',
      location: data.location || 'Studio Lab A',
    };
    setUserSchedules((prev) => {
      const currentEntry = prev[currentUserId] || currentUserSchedule;
      const currentItems = currentEntry.items || [];
      return {
        ...prev,
        [currentUserId]: {
          ...currentEntry,
          items: [...currentItems, newItem],
        },
      };
    });
    addToast(`Added "${newItem.code || newItem.title}" to your weekly schedule!`, 'success');
  };

  const updateScheduleItem = (id, data) => {
    const days = Array.isArray(data.days) && data.days.length > 0 ? data.days : [data.day || 'Monday'];
    setUserSchedules((prev) => {
      const currentEntry = prev[currentUserId] || currentUserSchedule;
      const currentItems = currentEntry.items || [];
      return {
        ...prev,
        [currentUserId]: {
          ...currentEntry,
          items: currentItems.map((item) =>
            item.id === id
              ? {
                ...item,
                ...data,
                days,
                day: days.join(', '),
                time: data.time || `${data.startTime || item.startTime} - ${data.endTime || item.endTime}`,
              }
              : item
          ),
        },
      };
    });
    addToast('Schedule session updated!', 'success');
  };

  const deleteScheduleItem = (id) => {
    setUserSchedules((prev) => {
      const currentEntry = prev[currentUserId] || currentUserSchedule;
      const currentItems = currentEntry.items || [];
      return {
        ...prev,
        [currentUserId]: {
          ...currentEntry,
          items: currentItems.filter((item) => item.id !== id),
        },
      };
    });
    addToast('Session removed from schedule.', 'info');
  };

  const saveCourseMeeting = (courseId, meetingData) => {
    setCourseMeetings((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        ...meetingData,
        courseId,
        id: prev[courseId]?.id || `meet-${courseId}-${Date.now()}`,
        updatedAt: new Date().toISOString(),
      },
    }));
    addToast('Google Meet class details saved successfully!', 'success');
  };

  const removeCourseMeeting = (courseId) => {
    setCourseMeetings((prev) => {
      const copy = { ...prev };
      delete copy[courseId];
      return copy;
    });
    addToast('Live meeting cancelled and removed.', 'info');
  };

  const rateCourse = (courseId, { rating, review, tags }) => {
    const student = currentUser || { id: 'usr-1', name: 'Stella Walton' };
    const numRating = Number(rating) || 5;
    const newRating = {
      id: `rat-${Date.now()}`,
      courseId,
      studentId: student.id,
      studentName: student.name,
      studentAvatar:
        student.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      rating: numRating,
      review: (review || '').trim(),
      tags: tags || [],
      date: new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    let updatedRatingsForCourse = [];
    setCourseRatings((prev) => {
      const existing = prev[courseId] || [];
      const filtered = existing.filter((r) => r.studentId !== student.id);
      updatedRatingsForCourse = [newRating, ...filtered];
      return {
        ...prev,
        [courseId]: updatedRatingsForCourse,
      };
    });

    // Mark course as completed for this student
    if (student.id) {
      setUserCompletedCourses((prev) => {
        const userList = prev[student.id] || [];
        if (userList.includes(courseId)) return prev;
        return { ...prev, [student.id]: [...userList, courseId] };
      });
    }

    // Recalculate average rating on course
    setCourses((prevCourses) =>
      prevCourses.map((c) => {
        if (c.id === courseId) {
          const allRatings = updatedRatingsForCourse.length
            ? updatedRatingsForCourse
            : [newRating];
          const avg = (
            allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
          ).toFixed(1);

          return {
            ...c,
            rating: parseFloat(avg),
          };
        }
        return c;
      })
    );

    // Reward student with 50 XP points
    if (student.id) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === student.id ? { ...u, points: (u.points || 0) + 50 } : u
        )
      );
      if (currentUser?.id === student.id) {
        setCurrentUser((prev) =>
          prev ? { ...prev, points: (prev.points || 0) + 50 } : prev
        );
      }
    }

    addToast(`⭐ Thank you! Your review for this course was saved (+50 XP).`, 'success');
  };

  const markCourseComplete = (courseId) => {
    if (!currentUser?.id) return;
    setUserCompletedCourses((prev) => {
      const userList = prev[currentUser.id] || [];
      if (userList.includes(courseId)) return prev;
      return { ...prev, [currentUser.id]: [...userList, courseId] };
    });

    const course = courses.find((c) => c.id === courseId);
    if (course) {
      const syllabus = course.syllabus?.length
        ? course.syllabus
        : [{ unit: 'Unit 1', title: 'Core Studio Foundations', lessons: 3 }];
      const courseCustom = customLessons?.[course.id] || course.customLessons || {};
      const allLessonIds = [];
      syllabus.forEach((unitObj, unitIdx) => {
        if (
          courseCustom[unitIdx] &&
          Array.isArray(courseCustom[unitIdx]) &&
          courseCustom[unitIdx].length > 0
        ) {
          courseCustom[unitIdx].forEach((les, lIdx) => {
            allLessonIds.push(les.id || `${course.id}-u${unitIdx + 1}-l${lIdx + 1}`);
          });
        } else {
          const defaultLessons = getDefaultUnitLessons(course, unitIdx);
          defaultLessons.forEach((l) => allLessonIds.push(l.id));
        }
      });
      setUserViewedLessons((prev) => {
        const userList = prev[currentUser.id] || [];
        const set = new Set([...userList, ...allLessonIds]);
        return { ...prev, [currentUser.id]: Array.from(set) };
      });
    }
    addToast('🎉 Congratulations! Course marked as completed. You can now rate it!', 'success');
  };

  // Reset demo data to initial defaults
  const resetDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setCourses(INITIAL_COURSES);
    setUserViewedLessons({ 'usr-1': INITIAL_STELLA_VIEWED_LESSONS });
    setUserCompletedCourses({ 'usr-1': ['crs-3'] });
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setQuizzes(INITIAL_QUIZZES);
    setQuizSubmissions(INITIAL_QUIZ_SUBMISSIONS);
    setMaterials(INITIAL_MATERIALS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setUserSchedules(INITIAL_USER_SCHEDULES);
    setReminders(INITIAL_REMINDERS);
    setCourseMeetings(INITIAL_MEETINGS);
    setCourseRatings(INITIAL_COURSE_RATINGS);
    setCustomLessons({});
    setActiveTab('dashboard');
    addToast('System reset to original fresh demo state!', 'info');
  };

  // Refresh users from database
  const refreshUsers = async () => {
    try {
      const data = await api.users.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setUsers(data.map((u) => ({ ...u, password: u.password || 'password123' })));
      }
    } catch (err) {
      console.warn('refreshUsers error:', err);
    }
  };

  // Helper counts
  const pendingApprovalsCount = users.filter((u) => u.status === 'pending').length;
  const teacherCourseIds = currentUser?.role === 'teacher'
    ? new Set(
      courses
        .filter((c) => c.instructorId === currentUser.id || currentUser.assignedCourseIds?.includes(c.id))
        .map((c) => c.id)
    )
    : null;
  const pendingGradingCount = teacherCourseIds
    ? submissions.filter((s) => s.status === 'Submitted' && teacherCourseIds.has(s.courseId)).length
    : submissions.filter((s) => s.status === 'Submitted').length;
  const unreadAnnouncementsCount = announcements.filter((a) => !a.isRead).length;

  return (
    <LMSContext.Provider
      value={{
        // Auth & User
        currentUser,
        users,
        login,
        logout,
        switchDemoUser,
        switchUserById,
        registerStudent,
        approveUser,
        rejectUser,
        updateUserRole,
        deleteUser,
        updateProfile,

        // Data
        courses: coursesWithUserProgress,
        rawCourses: courses,
        getCourseProgress,
        customLessons,
        assignments,
        submissions,
        quizzes,
        quizSubmissions,
        materials,
        announcements,
        schedule,
        scheduleTitle,
        setScheduleTitle,
        setSchedule,
        userSchedules,
        reminders,
        courseMeetings,
        saveCourseMeeting,
        removeCourseMeeting,
        courseRatings,
        rateCourse,
        markCourseComplete,

        // Course management
        addCourse,
        updateCourse,
        deleteCourse,
        toggleEnrollCourse,
        addLessonToCourseUnit,
        updateLessonInCourseUnit,
        deleteLessonFromCourseUnit,
        reorderLessonsInCourseUnit,
        moveLesson,
        moveLessonToIndex,

        // Assignment & Submission management
        addAssignment,
        updateAssignment,
        deleteAssignment,
        reorderAssignmentInUnit,
        moveAssignment,
        moveAssignmentToIndex,
        submitAssignment,
        gradeSubmission,

        // Quiz management
        addQuiz,
        updateQuiz,
        deleteQuiz,
        submitQuiz,

        // Materials, Announcements & Schedule
        addMaterial,
        updateMaterial,
        deleteMaterial,
        reorderMaterialInUnit,
        moveMaterial,
        moveMaterialToIndex,
        addAnnouncement,
        markAnnouncementAsRead,
        deleteAnnouncement,
        addAnnouncementReply,
        addScheduleItem,
        updateScheduleItem,
        deleteScheduleItem,

        // Navigation & UI
        activeTab,
        setActiveTab,
        selectedCourseId,
        setSelectedCourseId,
        selectedLessonId,
        setSelectedLessonId,
        viewedLessonIds,
        markLessonAsViewed,
        selectedAssignmentId,
        setSelectedAssignmentId,
        selectedSubmissionId,
        setSelectedSubmissionId,
        selectedAnnouncementId,
        setSelectedAnnouncementId,
        assignmentOrigin,
        setAssignmentOrigin,
        isScheduleEditMode,
        setIsScheduleEditMode,
        searchQuery,
        setSearchQuery,
        isRightPanelOpen,
        setIsRightPanelOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        helpModalOpen,
        setHelpModalOpen,

        // Feedback & stats
        toasts,
        addToast,
        removeToast,
        resetDemoData,
        pendingApprovalsCount,
        pendingGradingCount,
        unreadAnnouncementsCount,
        refreshUsers
      }}
    >
      {children}
    </LMSContext.Provider>
  );
};