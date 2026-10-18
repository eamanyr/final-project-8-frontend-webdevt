import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_MATERIALS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SCHEDULE,
  INITIAL_REMINDERS,
} from '../data/mockData';

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
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cacheup_current_user');
    if (saved) return JSON.parse(saved);
    // default to student Stella Walton
    return INITIAL_USERS[0];
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('cacheup_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('cacheup_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('cacheup_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('cacheup_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('cacheup_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('cacheup_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('cacheup_reminders');
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  // Navigation and UI state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState('crs-1');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('asg-1');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

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
  const login = (email, password) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (!found) {
      addToast('No user found with this email address.', 'error');
      return false;
    }
    if (found.password !== password) {
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
    setActiveTab('dashboard');
    addToast(`Welcome back, ${found.name}!`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('login');
    addToast('You have been logged out securely.', 'info');
  };

  // Switch demo persona instantly
  const switchDemoUser = (role) => {
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
      setActiveTab('dashboard');
      addToast(`Switched active persona to ${target.name} (${target.role.toUpperCase()})`, 'info');
    }
  };

  // Student Registration
  const registerStudent = (formData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: formData.name,
      email: formData.email,
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

  // Admin user approvals
  const approveUser = (userId) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'approved', title: 'Enrolled Student' } : u))
    );
    addToast('Student registration approved! Student can now log in.', 'success');
  };

  const rejectUser = (userId, reason) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'rejected', rejectionReason: reason || 'Application criteria incomplete' } : u))
    );
    addToast('Student registration rejected.', 'warning');
  };

  const updateUserRole = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => ({ ...prev, role: newRole }));
    }
    addToast('User role updated successfully.', 'success');
  };

  const deleteUser = (userId) => {
    if (currentUser?.id === userId) {
      addToast('Cannot delete the currently logged in user!', 'error');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    addToast('User removed from system.', 'info');
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    addToast('Profile updated successfully!', 'success');
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
    setCourses((prev) => [newCourse, ...prev]);
    addToast(`Course "${newCourse.title}" created successfully!`, 'success');
    return newCourse;
  };

  const updateCourse = (courseId, courseData) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, ...courseData } : c))
    );
    addToast('Course details saved.', 'success');
  };

  const deleteCourse = (courseId) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    addToast('Course deleted.', 'info');
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
      courseName: course ? course.title : 'General Course',
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      dueTime: data.dueTime || '11:59 PM',
      duration: data.duration || '2 hours',
      maxScore: parseInt(data.maxScore) || 100,
      priority: data.priority || 'Medium',
      priorityColor: data.priority === 'High' ? 'gold' : data.priority === 'Low' ? 'sage' : 'forest',
      status: 'Pending',
      rubric: data.rubric || [{ criteria: 'Standard Execution & Quality', points: 100 }],
      submissionTypes: data.submissionTypes || ['pdf', 'link']
    };
    setAssignments((prev) => [newAsg, ...prev]);
    addToast(`Assignment "${newAsg.title}" published!`, 'success');
    return newAsg;
  };

  const updateAssignment = (id, data) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
    addToast('Assignment updated.', 'success');
  };

  const deleteAssignment = (id) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    addToast('Assignment removed.', 'info');
  };

  // Submission & Grading actions
  const submitAssignment = (data) => {
    const assignment = assignments.find((a) => a.id === data.assignmentId);
    const newSub = {
      id: `sub-${Date.now()}`,
      assignmentId: data.assignmentId,
      assignmentTitle: assignment ? assignment.title : 'Assignment',
      courseId: assignment ? assignment.courseId : 'crs-1',
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar,
      submissionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      content: data.content || '',
      linkUrl: data.linkUrl || '',
      fileName: data.fileName || 'Assignment_Submission.pdf',
      fileSize: data.fileSize || '2.8 MB',
      status: 'Submitted',
      score: null,
      maxScore: assignment?.maxScore || 100,
      feedback: '',
      gradedBy: null,
      gradedAt: null
    };

    setSubmissions((prev) => [newSub, ...prev]);
    addToast('Assignment submitted successfully! Great work.', 'success');
    return newSub;
  };

  const gradeSubmission = (subId, score, feedback) => {
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === subId) {
          return {
            ...s,
            score: parseInt(score),
            feedback,
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

  // Learning Materials actions
  const addMaterial = (data) => {
    const course = courses.find((c) => c.id === data.courseId);
    const newMat = {
      id: `mat-${Date.now()}`,
      courseId: data.courseId,
      courseTitle: course ? course.title : 'Course Material',
      title: data.title,
      type: data.type || 'pdf',
      size: data.size || '4.5 MB',
      uploadDate: new Date().toISOString().slice(0, 10),
      uploadedBy: currentUser?.name || 'Instructor',
      downloadUrl: data.downloadUrl || '#',
      description: data.description || 'Uploaded study resource for CacheUp students.'
    };
    setMaterials((prev) => [newMat, ...prev]);
    addToast(`Material "${newMat.title}" added to course resources!`, 'success');
  };

  const deleteMaterial = (id) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    addToast('Learning material removed.', 'info');
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
    setAnnouncements((prev) => [newAnc, ...prev]);
    addToast('Announcement broadcasted to students and staff!', 'success');
  };

  const markAnnouncementAsRead = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    addToast('Announcement deleted.', 'info');
  };

  // Reset demo data to initial defaults
  const resetDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setCourses(INITIAL_COURSES);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setMaterials(INITIAL_MATERIALS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setSchedule(INITIAL_SCHEDULE);
    setReminders(INITIAL_REMINDERS);
    setActiveTab('dashboard');
    addToast('System reset to original fresh demo state!', 'info');
  };

  // Helper counts
  const pendingApprovalsCount = users.filter((u) => u.status === 'pending').length;
  const pendingGradingCount = submissions.filter((s) => s.status === 'Submitted').length;
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
        registerStudent,
        approveUser,
        rejectUser,
        updateUserRole,
        deleteUser,
        updateProfile,

        // Data
        courses,
        assignments,
        submissions,
        materials,
        announcements,
        schedule,
        reminders,

        // Course management
        addCourse,
        updateCourse,
        deleteCourse,
        toggleEnrollCourse,

        // Assignment & Submission management
        addAssignment,
        updateAssignment,
        deleteAssignment,
        submitAssignment,
        gradeSubmission,

        // Materials & Announcements
        addMaterial,
        deleteMaterial,
        addAnnouncement,
        markAnnouncementAsRead,
        deleteAnnouncement,

        // Navigation & UI
        activeTab,
        setActiveTab,
        selectedCourseId,
        setSelectedCourseId,
        selectedAssignmentId,
        setSelectedAssignmentId,
        selectedSubmissionId,
        setSelectedSubmissionId,
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
        unreadAnnouncementsCount
      }}
    >
      {children}
    </LMSContext.Provider>
  );
};
