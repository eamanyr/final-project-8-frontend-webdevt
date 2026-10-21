import React, { useState, useRef } from 'react';
import { useLMS } from '../../context/LMSContext';
import { buildCourseUnitsWithItems } from '../../data/courseCurriculum';
import {
  ArrowLeft,
  Award,
  GripVertical,
  Users,
  FileText,
  Clock,
  Star,
  BookOpen,
  Calendar,
  CheckCircle,
  Download,
  Share2,
  Edit,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Check,
  Lock,
  Paperclip,
  Rocket,
  Circle,
  Video,
  ExternalLink,
  Copy,
  Plus,
  PlusCircle,
  UploadCloud,
  FileCode,
  Presentation,
  Image as ImageIcon,
  Trash2,
  X,
  HelpCircle,
} from 'lucide-react';
import { QuizModal } from '../quizzes/QuizModal';
import { QuizTakeModal } from '../quizzes/QuizTakeModal';

export const CourseDetails = () => {
  const {
    courses,
    customLessons,
    addLessonToCourseUnit,
    updateLessonInCourseUnit,
    deleteLessonFromCourseUnit,
    reorderLessonsInCourseUnit,
    moveLesson,
    moveLessonToIndex,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    reorderAssignmentInUnit,
    moveAssignment,
    moveAssignmentToIndex,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    reorderMaterialInUnit,
    moveMaterial,
    moveMaterialToIndex,
    selectedCourseId,
    currentUser,
    users,
    materials,
    assignments,
    submissions,
    viewedLessonIds,
    markLessonAsViewed,
    setSelectedLessonId,
    setActiveTab,
    toggleEnrollCourse,
    setSelectedAssignmentId,
    quizzes,
    quizSubmissions,
    deleteQuiz,
    addToast,
    courseMeetings,
    saveCourseMeeting,
    removeCourseMeeting,
    courseActiveTab,
    setCourseActiveTab,
  } = useLMS();

  const [activeTab, setActiveSection] = useState(courseActiveTab || 'syllabus');
  const [selectedGradeStudentId, setSelectedGradeStudentId] = useState('');

  React.useEffect(() => {
    if (courseActiveTab) {
      setActiveSection(courseActiveTab);
    }
  }, [courseActiveTab]);

  const handleTabChange = (tab) => {
    setActiveSection(tab);
    if (setCourseActiveTab) setCourseActiveTab(tab);
  };
  const [openUnits, setOpenUnits] = useState({ 0: true, 1: true, 2: true });
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Quiz Modal states
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [selectedUnitIdxForQuiz, setSelectedUnitIdxForQuiz] = useState(0);
  const [activeTakingQuiz, setActiveTakingQuiz] = useState(null);
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    meetUrl: '',
    date: '',
    time: '',
    status: 'live',
    notes: '',
  });

  // Modal states for lessons
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [selectedUnitIdxForLesson, setSelectedUnitIdxForLesson] = useState(0);
  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    topicHeading: '',
    definition: '',
    majorFunctionsText: '',
    term1: '',
    desc1: '',
    term2: '',
    desc2: '',
    diagTop: '',
    diagMid1: '',
    diagMid2: '',
    diagBottom: '',
  });

  // Modal states for assignments
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [selectedUnitIdxForAssignment, setSelectedUnitIdxForAssignment] = useState(0);
  const [assignmentFormData, setAssignmentFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '11:59 PM',
    maxScore: 100,
    priority: 'Medium',
    submissionTypes: ['pdf', 'link'],
    rubric: [
      { criteria: 'Technical Execution & Precision', points: 40 },
      { criteria: 'Concept Originality & Aesthetic Flow', points: 35 },
      { criteria: 'Documentation & Presentation', points: 25 },
    ],
  });

  // Modal states for materials
  const [isUploadMaterialModalOpen, setIsUploadMaterialModalOpen] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [selectedMaterialUnit, setSelectedMaterialUnit] = useState('all');
  const [materialFormData, setMaterialFormData] = useState({
    title: '',
    type: 'pdf',
    size: '3.8 MB',
    downloadUrl: '',
    description: '',
  });

  const isAdmin = currentUser?.role === 'admin';
  const isTeacher = currentUser?.role === 'teacher';
  const teacherCourses = isTeacher
    ? courses.filter(
        (c) => c.instructorId === currentUser?.id || currentUser?.assignedCourseIds?.includes(c.id)
      )
    : courses;

  const course =
    (isTeacher ? teacherCourses : courses).find((c) => c.id === selectedCourseId) ||
    (isTeacher ? teacherCourses[0] : courses[0]);
  if (!course) return null;

  const isInstructor =
    isTeacher &&
    (course.instructorId === currentUser?.id || currentUser?.assignedCourseIds?.includes(course.id));
  const canManageCourse = isAdmin || isInstructor;

  const isEnrolled = currentUser?.enrolledCourseIds?.includes(course.id);
  const isStudent = currentUser?.role === 'student';

  // Filter materials & assignments for this course
  const courseMaterials = materials.filter((m) => m.courseId === course.id);
  const courseAssignments = assignments.filter((a) => a.courseId === course.id);

  const unitsWithItems = buildCourseUnitsWithItems(
    course,
    courseAssignments,
    courseMaterials,
    customLessons
  );

  const allUnitsExpanded =
    unitsWithItems.length > 0 && unitsWithItems.every((u) => !!openUnits[u.unitIdx]);
  const toggleAllUnits = () => {
    const nextState = !allUnitsExpanded;
    const updated = {};
    unitsWithItems.forEach((u) => {
      updated[u.unitIdx] = nextState;
    });
    setOpenUnits(updated);
  };

  // Drag and drop state for rearranging lessons, materials, and assignments
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const isDraggingRef = useRef(false);

  const handleDragStart = (e, type, unitIdx, index, item) => {
    isDraggingRef.current = true;
    setDraggedItem({ type, unitIdx, index, id: item.id, title: item.title });
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', JSON.stringify({ type, unitIdx, index, id: item.id }));
    } catch {
      e.dataTransfer.setData('text/plain', item.id);
    }
  };

  const handleDragOver = (e, type, unitIdx, index) => {
    if (!draggedItem || draggedItem.type !== type) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (
      dragOverItem?.unitIdx !== unitIdx ||
      dragOverItem?.index !== index ||
      dragOverItem?.type !== type
    ) {
      setDragOverItem({ type, unitIdx, index });
    }
  };

  const handleDrop = (e, type, unitIdx, targetIndex) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.type !== type) return;

    const fromUnit = draggedItem.unitIdx;
    const fromIndex = draggedItem.index;

    if (type === 'lesson') {
      moveLesson(course.id, fromUnit, fromIndex, unitIdx, targetIndex);
    } else if (type === 'material') {
      moveMaterial(course.id, fromUnit, fromIndex, unitIdx, targetIndex);
    } else if (type === 'assignment') {
      moveAssignment(course.id, fromUnit, fromIndex, unitIdx, targetIndex);
    }

    setDraggedItem(null);
    setDragOverItem(null);
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 120);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 120);
  };

  // Lesson Handlers
  const handleOpenAddLessonModal = (unitIdx = 0) => {
    const targetIdx = Number(unitIdx) || 0;
    setSelectedUnitIdxForLesson(targetIdx);
    setEditingLessonId(null);
    const unitObj = course.syllabus?.[targetIdx];
    const unitTitle = unitObj?.title || `Unit ${targetIdx + 1}`;
    setLessonFormData({
      title: '',
      topicHeading: `${unitTitle} — Studio Deep-Dive`,
      definition: '',
      majorFunctionsText:
        '• Analyze core foundational principles and visual balance.\n• Execute hands-on studio assignments adhering to portfolio standards.\n• Participate in group critiques and document iteration notes.',
      term1: 'Analytical Method',
      desc1: 'Iterative design breakdown and structural analysis.',
      term2: 'Final Deliverable',
      desc2: 'Portfolio-ready studio artwork meeting industry standards.',
      diagTop: `${unitObj?.unit || 'Unit ' + (targetIdx + 1)} Brief`,
      diagMid1: 'Exploration & Rapid Iteration',
      diagMid2: 'Faculty Review & Peer Critique',
      diagBottom: 'Completed Milestone & Studio Plate',
    });
    setIsAddLessonModalOpen(true);
  };

  const handleOpenEditLessonModal = (unitIdx, lesson) => {
    setSelectedUnitIdxForLesson(Number(unitIdx) || 0);
    setEditingLessonId(lesson.id);
    setLessonFormData({
      title: lesson.title || '',
      topicHeading: lesson.topicHeading || '',
      definition: lesson.definition || '',
      majorFunctionsText: Array.isArray(lesson.majorFunctions)
        ? lesson.majorFunctions.map((f) => `• ${f}`).join('\n')
        : (lesson.majorFunctions || ''),
      term1: lesson.parts?.[0]?.term || '',
      desc1: lesson.parts?.[0]?.desc || '',
      term2: lesson.parts?.[1]?.term || '',
      desc2: lesson.parts?.[1]?.desc || '',
      diagTop: lesson.diagram?.top || '',
      diagMid1: lesson.diagram?.middle1 || '',
      diagMid2: lesson.diagram?.middle2 || '',
      diagBottom: lesson.diagram?.bottom || '',
    });
    setIsAddLessonModalOpen(true);
  };

  const handleCreateOrEditLessonSubmit = (e) => {
    e.preventDefault();
    if (!lessonFormData.title.trim()) {
      addToast('Please enter a lesson title.', 'warning');
      return;
    }

    const majorFunctions = lessonFormData.majorFunctionsText
      .split('\n')
      .map((l) => l.replace(/^[•\-\*\d\.\s]+/, '').trim())
      .filter(Boolean);

    const parts = [];
    if (lessonFormData.term1.trim() || lessonFormData.desc1.trim()) {
      parts.push({
        term: lessonFormData.term1.trim() || 'Core Principle',
        desc: lessonFormData.desc1.trim() || 'Theoretical and studio application guideline.',
      });
    }
    if (lessonFormData.term2.trim() || lessonFormData.desc2.trim()) {
      parts.push({
        term: lessonFormData.term2.trim() || 'Execution Technique',
        desc: lessonFormData.desc2.trim() || 'Hands-on practical method and portfolio deliverable.',
      });
    }

    const diagram = {
      top: lessonFormData.diagTop.trim() || 'Visual Brief & Initial Concept',
      middle1: lessonFormData.diagMid1.trim() || 'Exploration & Rapid Iteration',
      middle2: lessonFormData.diagMid2.trim() || 'Faculty Review & Peer Critique',
      bottom: lessonFormData.diagBottom.trim() || 'Completed Studio Deliverable',
    };

    const payload = {
      title: lessonFormData.title.trim(),
      topicHeading: lessonFormData.topicHeading.trim() || lessonFormData.title.trim(),
      definition:
        lessonFormData.definition.trim() ||
        `Structured studio lesson on ${lessonFormData.title.trim()} for ${course.title}. Explore techniques, theoretical models, and hands-on portfolio creation.`,
      majorFunctionsTitle: 'Key learning objectives for this lesson:',
      majorFunctions:
        majorFunctions.length > 0
          ? majorFunctions
          : [
              'Analyze core foundational principles and visual balance.',
              'Execute hands-on studio assignments adhering to portfolio standards.',
              'Participate in group critiques and document iteration notes.',
            ],
      partsTitle: 'Core Concepts & Studio Terminology',
      parts:
        parts.length > 0
          ? parts
          : [
              {
                term: 'Analytical Method',
                desc: 'Iterative design breakdown and structural analysis.',
              },
              {
                term: 'Final Deliverable',
                desc: 'Portfolio-ready studio artwork meeting industry standards.',
              },
            ],
      diagram,
    };

    if (editingLessonId) {
      updateLessonInCourseUnit(course.id, selectedUnitIdxForLesson, editingLessonId, payload);
    } else {
      addLessonToCourseUnit(course.id, selectedUnitIdxForLesson, payload);
    }

    setIsAddLessonModalOpen(false);
    setEditingLessonId(null);
    setOpenUnits((prev) => ({ ...prev, [selectedUnitIdxForLesson]: true }));
  };

  // Quiz Handlers
  const handleOpenAddQuizModal = (unitIdx = 0) => {
    setSelectedUnitIdxForQuiz(Number(unitIdx) || 0);
    setEditingQuiz(null);
    setIsQuizModalOpen(true);
  };

  const handleOpenEditQuizModal = (quiz) => {
    setSelectedUnitIdxForQuiz(quiz.unitIdx !== undefined ? Number(quiz.unitIdx) : 0);
    setEditingQuiz(quiz);
    setIsQuizModalOpen(true);
  };

  // Assignment Handlers
  const handleOpenAddAssignmentModal = (unitIdx = 0) => {
    const targetIdx = Number(unitIdx) || 0;
    setSelectedUnitIdxForAssignment(targetIdx);
    setEditingAssignmentId(null);
    const unitObj = course.syllabus?.[targetIdx];
    const unitTitle = unitObj?.title || `Unit ${targetIdx + 1}`;
    setAssignmentFormData({
      title: '',
      description: `Complete the studio assessment for ${unitTitle}. Follow the brief, apply core techniques, and upload your deliverable.`,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      dueTime: '11:59 PM',
      maxScore: 100,
      priority: 'Medium',
      submissionTypes: ['pdf', 'link'],
      rubric: [
        { criteria: 'Technical Execution & Precision', points: 40 },
        { criteria: 'Concept Originality & Aesthetic Flow', points: 35 },
        { criteria: 'Documentation & Presentation', points: 25 },
      ],
    });
    setIsAssignmentModalOpen(true);
  };

  const handleOpenEditAssignmentModal = (asg) => {
    setEditingAssignmentId(asg.id);
    setSelectedUnitIdxForAssignment(
      asg.unitIdx !== undefined ? Number(asg.unitIdx) : 0
    );
    setAssignmentFormData({
      title: asg.title || '',
      description: asg.description || '',
      dueDate: asg.dueDate || new Date().toISOString().slice(0, 10),
      dueTime: asg.dueTime || '11:59 PM',
      maxScore: asg.maxScore || 100,
      priority: asg.priority || 'Medium',
      submissionTypes: asg.submissionTypes || ['pdf', 'link'],
      rubric: asg.rubric && asg.rubric.length ? asg.rubric : [
        { criteria: 'Technical Execution & Precision', points: 40 },
        { criteria: 'Concept Originality & Aesthetic Flow', points: 35 },
        { criteria: 'Documentation & Presentation', points: 25 },
      ],
    });
    setIsAssignmentModalOpen(true);
  };

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    if (!assignmentFormData.title.trim()) {
      addToast('Please enter an assignment title.', 'warning');
      return;
    }

    const totalRubricPts = assignmentFormData.rubric.reduce((acc, r) => acc + (Number(r.points) || 0), 0);
    const finalMaxScore = totalRubricPts > 0 ? totalRubricPts : parseInt(assignmentFormData.maxScore) || 100;

    const payload = {
      courseId: course.id,
      courseName: course.title,
      unitIdx: Number(selectedUnitIdxForAssignment),
      title: assignmentFormData.title.trim(),
      description: assignmentFormData.description.trim() || 'Complete the assigned task and submit your work.',
      dueDate: assignmentFormData.dueDate,
      dueTime: assignmentFormData.dueTime || '11:59 PM',
      maxScore: finalMaxScore,
      priority: assignmentFormData.priority || 'Medium',
      submissionTypes: assignmentFormData.submissionTypes || ['pdf', 'link'],
      rubric: assignmentFormData.rubric,
    };

    if (editingAssignmentId) {
      updateAssignment(editingAssignmentId, payload);
    } else {
      addAssignment(payload);
    }

    setIsAssignmentModalOpen(false);
    setEditingAssignmentId(null);
    setOpenUnits((prev) => ({ ...prev, [selectedUnitIdxForAssignment]: true }));
  };

  // Material Handlers
  const handleOpenAddMaterialModal = (unitIdx = 'all') => {
    setSelectedMaterialUnit(unitIdx);
    setEditingMaterialId(null);
    setMaterialFormData({
      title: '',
      type: 'pdf',
      size: '3.8 MB',
      downloadUrl: '',
      description: '',
    });
    setIsUploadMaterialModalOpen(true);
  };

  const handleOpenEditMaterialModal = (mat) => {
    setEditingMaterialId(mat.id);
    setSelectedMaterialUnit(mat.unitIdx !== undefined ? mat.unitIdx : 'all');
    setMaterialFormData({
      title: mat.title || '',
      type: mat.type || 'pdf',
      size: mat.size || '3.8 MB',
      downloadUrl: mat.downloadUrl || '',
      description: mat.description || '',
    });
    setIsUploadMaterialModalOpen(true);
  };

  const handleMaterialSubmit = (e) => {
    e.preventDefault();
    if (!materialFormData.title.trim()) {
      addToast('Please enter a material title.', 'warning');
      return;
    }

    const payload = {
      courseId: course.id,
      courseTitle: course.title,
      title: materialFormData.title.trim(),
      type: materialFormData.type,
      size: materialFormData.size.trim() || '4.5 MB',
      downloadUrl: materialFormData.downloadUrl.trim() || '#',
      description:
        materialFormData.description.trim() ||
        `Study resource and lecture assets uploaded for ${course.title}.`,
      unitIdx:
        selectedMaterialUnit !== 'all' ? Number(selectedMaterialUnit) : undefined,
    };

    if (editingMaterialId) {
      updateMaterial(editingMaterialId, payload);
    } else {
      addMaterial(payload);
    }

    setIsUploadMaterialModalOpen(false);
    setEditingMaterialId(null);
    if (selectedMaterialUnit !== 'all') {
      setOpenUnits((prev) => ({ ...prev, [Number(selectedMaterialUnit)]: true }));
    }
  };

  const toggleUnitDropdown = (unitIdx) => {
    setOpenUnits((prev) => ({ ...prev, [unitIdx]: !prev[unitIdx] }));
  };

  const isAssignmentDone = (asg) => {
    if (!asg) return true;
    const submitted = (submissions || []).some(
      (s) => s.assignmentId === asg.id && s.studentId === currentUser?.id
    );
    return submitted || asg.status === 'Graded';
  };

  const isUnitCompleted = (unit) => {
    const allLessonsViewed = unit.lessons.every((l) =>
      viewedLessonIds.includes(l.id)
    );
    const allTasksDone = unit.assignments.every((a) => isAssignmentDone(a));
    return allLessonsViewed && allTasksDone;
  };

  const isUnitUnlocked = (unitIdx) => {
    if (!isStudent || unitIdx === 0) return true;
    return isUnitCompleted(unitsWithItems[unitIdx - 1]);
  };

  // Enrolled students list (minimum 3 required)
  const enrolledStudents = users.filter(
    (u) => u.role === 'student' && u.enrolledCourseIds?.includes(course.id)
  );

  // Assigned course instructor (1 teacher)
  const courseTeacher =
    users.find(
      (u) =>
        u.role === 'teacher' &&
        (u.id === course.instructorId ||
          u.assignedCourseIds?.includes(course.id) ||
          u.name.toLowerCase() === course.instructorName.toLowerCase())
    ) || {
      name: course.instructorName,
      avatar: course.instructorAvatar,
      email: 'instructor@cacheup.edu',
      title: 'Course Instructor',
      department: 'Academic Faculty',
    };

  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';
  const currentMeeting = courseMeetings?.[course.id];

  const formatMeetingDate = (dateStr) => {
    if (!dateStr) return 'Scheduled Date';
    if (dateStr.toLowerCase() === 'today') return 'Today';
    if (dateStr.toLowerCase() === 'tomorrow') return 'Tomorrow';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    } catch {}
    return dateStr;
  };

  const handleOpenMeetingModal = () => {
    const defaultDate = new Date().toISOString().split('T')[0];
    if (currentMeeting) {
      setMeetingForm({
        title: currentMeeting.title || `${course.title} — Live Class`,
        meetUrl: currentMeeting.meetUrl || '',
        date: currentMeeting.date || defaultDate,
        time: currentMeeting.time || course.schedule || '10:00 AM - 11:30 AM',
        status: currentMeeting.status || 'live',
        notes: currentMeeting.notes || '',
      });
    } else {
      setMeetingForm({
        title: `${course.title} — Live Class & Studio Discussion`,
        meetUrl: '',
        date: defaultDate,
        time: course.schedule || '10:00 AM - 11:30 AM',
        status: 'live',
        notes: 'Please join with your webcam on and prepare questions from the current unit.',
      });
    }
    setIsMeetingModalOpen(true);
  };

  const handleSaveMeeting = (e) => {
    e.preventDefault();
    let url = (meetingForm.meetUrl || '').trim();
    if (!url) {
      addToast('Please enter a Google Meet link.', 'error');
      return;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    saveCourseMeeting(course.id, {
      ...meetingForm,
      meetUrl: url,
      date: (meetingForm.date || new Date().toISOString().split('T')[0]).trim(),
      time: (meetingForm.time || course.schedule || '10:00 AM - 11:30 AM').trim(),
      instructorName: course.instructorName || currentUser?.name,
      instructorAvatar: course.instructorAvatar || currentUser?.avatar,
    });
    setIsMeetingModalOpen(false);
  };

  const handleDeleteMeeting = () => {
    if (window.confirm('Are you sure you want to cancel and remove this live Google Meet session?')) {
      removeCourseMeeting(course.id);
      setIsMeetingModalOpen(false);
    }
  };

  const handleCopyLink = (url) => {
    if (!url) return;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    addToast('Google Meet link copied to clipboard!', 'info');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleJoinMeeting = () => {
    if (!currentMeeting?.meetUrl) return;
    let url = currentMeeting.meetUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Return Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('courses')}
          className="inline-flex items-center gap-2 text-xs font-bold text-charcoal hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Directory</span>
        </button>

        {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
          <button
            onClick={() => setActiveTab('create-course')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-charcoal/20 bg-white text-xs font-bold text-charcoal hover:bg-cream transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Course Details</span>
          </button>
        )}
      </div>

      {/* Course Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <div className="h-48 sm:h-64 relative bg-gradient-to-r from-forest via-forest-light to-sage">
          <img
            src={course.thumbnail}
            alt=""
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Badges on hero */}
          <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-charcoal shadow-sm">
              {course.level}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-forest text-cream shadow-sm">
              {course.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold text-charcoal shadow-sm inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-charcoal text-charcoal" />
              <span>{course.rating}</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-charcoal backdrop-blur-xs shadow-sm inline-flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-forest" />
              <span>{course.totalLessons} Lessons</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-charcoal backdrop-blur-xs shadow-sm inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-forest" />
              <span>{enrolledStudents.length} Learners</span>
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-gold">
              {course.code}
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold font-heading text-white mt-1">
              {course.title}
            </h2>
            <p className="text-xs sm:text-sm text-cream/80 mt-1 max-w-2xl hidden sm:block">
              {course.schedule} • Room: {course.room}
            </p>
          </div>
        </div>

        {/* Hero Footer Actions */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-4">
            <img
              src={course.instructorAvatar}
              alt=""
              className="w-12 h-12 rounded-2xl object-cover border border-charcoal/10"
            />
            <div>
              <p className="text-[11px] font-bold uppercase text-charcoal-muted tracking-wider">
                Instructor
              </p>
              <h4 className="text-sm font-bold text-charcoal">
                {course.instructorName}
              </h4>
              <p className="text-xs text-charcoal-muted">
                Department of Applied Creative Arts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser?.role === 'student' && (
              <button
                onClick={() => toggleEnrollCourse(course.id)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  isEnrolled
                    ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                    : 'bg-forest text-cream hover:bg-forest-light shadow-forest/20'
                }`}
              >
                {isEnrolled ? 'Drop Course' : 'Enroll in Course'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-charcoal/10 pb-2 overflow-x-auto">
        <button
          onClick={() => handleTabChange('syllabus')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'syllabus'
              ? 'bg-forest text-cream shadow-xs'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          Syllabus & Units
        </button>
        <button
          onClick={() => handleTabChange('materials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'materials'
              ? 'bg-forest text-cream shadow-xs'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          Learning Materials ({courseMaterials.length})
        </button>
        <button
          onClick={() => setActiveSection('assignments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'assignments'
              ? 'bg-forest text-cream shadow-xs'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          Assignments ({courseAssignments.length})
        </button>
        <button
          onClick={() => handleTabChange('meet')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 ${
            activeTab === 'meet'
              ? 'bg-forest text-cream shadow-xs'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-emerald-500" />
          <span>Google Meet</span>
          {currentMeeting?.status === 'live' && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          )}
        </button>
        <button
          onClick={() => handleTabChange('students')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'students'
              ? 'bg-forest text-cream shadow-xs'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          Class List ({enrolledStudents.length})
        </button>
      </div>

      {/* Tab 1: Syllabus */}
      {activeTab === 'syllabus' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
            <h3 className="text-base font-bold font-heading text-charcoal mb-2">
              Course Description & Objectives
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold font-heading text-charcoal">
                  Curriculum Units &amp; Lessons
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Click a unit to expand its lessons and required tasks. Complete all items in a unit to unlock the next unit.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleAllUnits}
                className="text-xs font-semibold text-forest hover:text-forest-light transition-colors px-3.5 py-2 rounded-xl hover:bg-forest-50 border border-forest/20 shrink-0 self-start sm:self-auto cursor-pointer"
              >
                {allUnitsExpanded ? 'Collapse All Units' : 'Expand All Units'}
              </button>
            </div>

            <div className="space-y-3.5">
              {unitsWithItems.map((unit, idx) => {
                const isOpen = !!openUnits[idx];
                const unitUnlocked = isUnitUnlocked(idx);
                const unitDone = isUnitCompleted(unit);
                const allLessonsInUnitViewed = unit.lessons.every((l) =>
                  viewedLessonIds.includes(l.id)
                );

                return (
                  <div
                    key={unit.unitIdx}
                    className="rounded-2xl border border-charcoal/10 overflow-hidden bg-white shadow-2xs transition-all"
                  >
                    {/* CacheUp-Styled Unit Dropdown Header Bar */}
                    <button
                      type="button"
                      onClick={() => toggleUnitDropdown(idx)}
                      className={`w-full p-4 bg-cream/45 hover:bg-cream/80 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                        isOpen ? 'border-b border-charcoal/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-forest uppercase tracking-wider block">
                            {unit.unitLabel} • {unit.lessons.length} Lessons
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-charcoal font-heading break-words leading-snug">
                            {unit.unitTitle}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${
                            unitDone
                              ? 'bg-forest-50 text-forest border-forest/20'
                              : unitUnlocked
                              ? 'bg-white text-charcoal-muted border-charcoal/10'
                              : 'bg-cream text-charcoal-muted border-charcoal/10'
                          }`}
                        >
                          {unitDone
                            ? 'Completed'
                            : unitUnlocked
                            ? 'Complete All Items'
                            : 'Prerequisites Required'}
                        </span>
                        {unitDone ? (
                          <Check className="w-4 h-4 text-forest stroke-[2.5]" />
                        ) : !unitUnlocked ? (
                          <Lock className="w-4 h-4 text-charcoal-muted" />
                        ) : (
                          <Circle className="w-4 h-4 text-charcoal/25" />
                        )}
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4 text-charcoal-muted shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-charcoal-muted shrink-0" />
                        )}
                      </div>
                    </button>

                    {/* Dropdown Items (Lessons, Materials & Unit Tasks) */}
                    {isOpen && (
                      <div className="divide-y divide-charcoal/10 bg-white">
                        {/* 1. Lesson Pages */}
                        {unit.lessons.map((lesson, lIdx) => {
                          const isViewed = viewedLessonIds.includes(lesson.id);
                          const prevLessonViewed =
                            lIdx === 0 ||
                            viewedLessonIds.includes(unit.lessons[lIdx - 1].id);
                          const lessonUnlocked =
                            !isStudent || (unitUnlocked && prevLessonViewed);

                          const isBeingDragged =
                            draggedItem?.type === 'lesson' && draggedItem?.id === lesson.id;
                          const isTargetOver =
                            dragOverItem?.type === 'lesson' &&
                            dragOverItem?.unitIdx === unit.unitIdx &&
                            dragOverItem?.index === lIdx &&
                            !isBeingDragged;

                          return (
                            <div
                              key={lesson.id}
                              draggable={canManageCourse}
                              onDragStart={(e) => handleDragStart(e, 'lesson', unit.unitIdx, lIdx, lesson)}
                              onDragOver={(e) => handleDragOver(e, 'lesson', unit.unitIdx, lIdx)}
                              onDrop={(e) => handleDrop(e, 'lesson', unit.unitIdx, lIdx)}
                              onDragEnd={handleDragEnd}
                              onClick={() => {
                                if (isDraggingRef.current) return;
                                if (!lessonUnlocked) {
                                  addToast(
                                    'Please view the previous lesson/unit items first to unlock this lesson.',
                                    'info'
                                  );
                                  return;
                                }
                                markLessonAsViewed(lesson.id);
                                setSelectedLessonId(lesson.id);
                                setActiveTab('course-lesson');
                              }}
                              className={`px-5 py-3.5 flex items-center justify-between gap-4 transition-all relative ${
                                isBeingDragged
                                  ? 'opacity-40 bg-forest-50/70 border-2 border-dashed border-forest/60 scale-[0.99] rounded-xl'
                                  : isTargetOver
                                  ? 'bg-forest-50/50 ring-2 ring-forest rounded-xl shadow-xs'
                                  : lessonUnlocked
                                  ? 'hover:bg-cream/40 cursor-pointer group'
                                  : 'opacity-55 bg-cream/20 cursor-not-allowed'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {canManageCourse && (
                                  <div
                                    className="p-1 -ml-1 text-charcoal/30 hover:text-forest cursor-grab active:cursor-grabbing hover:bg-forest-50 rounded-lg transition-colors shrink-0"
                                    title="Drag to rearrange lesson"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                )}
                                <div className="w-8 h-8 rounded-xl bg-forest-50 text-forest flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs sm:text-sm font-bold text-charcoal group-hover:text-forest transition-colors break-words leading-snug">
                                    {unit.unitLabel}: {lesson.title}
                                  </h4>
                                  <p className="text-[11px] text-charcoal-muted mt-0.5">
                                    {isViewed
                                      ? 'Viewed'
                                      : lessonUnlocked
                                      ? 'View Lesson Page'
                                      : 'Must view preceding item first'}
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 flex items-center gap-2">
                                {lesson.isCustom && (
                                  <span className="px-2 py-0.5 rounded-md bg-gold/15 text-gold-dark text-[10px] font-bold border border-gold/20">
                                    Custom Lesson
                                  </span>
                                )}
                                {canManageCourse && (
                                  <div
                                    className="flex items-center gap-1 bg-cream/70 rounded-xl p-0.5 border border-charcoal/10"
                                    draggable={false}
                                    onDragStart={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditLessonModal(unit.unitIdx, lesson)}
                                      title="Edit Lesson"
                                      className="p-1 rounded-lg text-charcoal-muted hover:text-forest hover:bg-white transition-colors cursor-pointer"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`Delete lesson "${lesson.title}" from this unit?`)) {
                                          deleteLessonFromCourseUnit(course.id, unit.unitIdx, lesson.id);
                                        }
                                      }}
                                      title="Delete Lesson"
                                      className="p-1 rounded-lg text-charcoal-muted hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                                {isViewed ? (
                                  <Check className="w-4 h-4 text-forest stroke-[2.5]" />
                                ) : !lessonUnlocked ? (
                                  <Lock className="w-3.5 h-3.5 text-charcoal-muted" />
                                ) : (
                                  <Circle className="w-4 h-4 text-charcoal/25" />
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {unit.lessons.length === 0 && canManageCourse && (
                          <div
                            onDragOver={(e) => handleDragOver(e, 'lesson', unit.unitIdx, 0)}
                            onDrop={(e) => handleDrop(e, 'lesson', unit.unitIdx, 0)}
                            className={`p-4 text-center text-xs text-charcoal-muted border border-dashed rounded-xl m-3 ${
                              dragOverItem?.type === 'lesson' && dragOverItem?.unitIdx === unit.unitIdx
                                ? 'border-forest bg-forest-50/50 text-forest'
                                : 'border-charcoal/20 bg-cream/20'
                            }`}
                          >
                            Drop lesson here to place in this unit
                          </div>
                        )}

                        {/* 2. Unit Attachments / PDFs */}
                        {unit.materials.map((mat, mIdx) => {
                          const isBeingDragged =
                            draggedItem?.type === 'material' && draggedItem?.id === mat.id;
                          const isTargetOver =
                            dragOverItem?.type === 'material' &&
                            dragOverItem?.unitIdx === unit.unitIdx &&
                            dragOverItem?.index === mIdx &&
                            !isBeingDragged;

                          return (
                            <div
                              key={mat.id}
                              draggable={canManageCourse}
                              onDragStart={(e) => handleDragStart(e, 'material', unit.unitIdx, mIdx, mat)}
                              onDragOver={(e) => handleDragOver(e, 'material', unit.unitIdx, mIdx)}
                              onDrop={(e) => handleDrop(e, 'material', unit.unitIdx, mIdx)}
                              onDragEnd={handleDragEnd}
                              onClick={() => {
                                if (isDraggingRef.current) return;
                                setActiveSection('materials');
                              }}
                              className={`px-5 py-3.5 flex items-center justify-between gap-4 transition-all relative ${
                                isBeingDragged
                                  ? 'opacity-40 bg-forest-50/70 border-2 border-dashed border-forest/60 scale-[0.99] rounded-xl'
                                  : isTargetOver
                                  ? 'bg-forest-50/50 ring-2 ring-forest rounded-xl shadow-xs'
                                  : 'hover:bg-cream/40 cursor-pointer group'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {canManageCourse && (
                                  <div
                                    className="p-1 -ml-1 text-charcoal/30 hover:text-forest cursor-grab active:cursor-grabbing hover:bg-forest-50 rounded-lg transition-colors shrink-0"
                                    title="Drag to rearrange material"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                )}
                                <div className="w-8 h-8 rounded-xl bg-sage/20 text-forest flex items-center justify-center shrink-0">
                                  <Paperclip className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-xs sm:text-sm font-bold text-charcoal group-hover:text-forest transition-colors break-words leading-snug block">
                                    {mat.title}.{mat.type}
                                  </span>
                                  <span className="text-[11px] text-charcoal-muted">
                                    Study Resource • {mat.size}
                                  </span>
                                </div>
                              </div>
                              <div className="shrink-0 flex items-center gap-2">
                                {canManageCourse && (
                                  <div
                                    className="flex items-center gap-1 bg-cream/70 rounded-xl p-0.5 border border-charcoal/10"
                                    draggable={false}
                                    onDragStart={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditMaterialModal(mat)}
                                      title="Edit Material"
                                      className="p-1 rounded-lg text-charcoal-muted hover:text-forest hover:bg-white transition-colors cursor-pointer"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`Delete material "${mat.title}"?`)) {
                                          deleteMaterial(mat.id);
                                        }
                                      }}
                                      title="Delete Material"
                                      className="p-1 rounded-lg text-charcoal-muted hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                                <span className="text-[11px] font-semibold text-forest shrink-0">
                                  View
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {/* 3. Unit Assignments / Graded Tasks needed before next unit */}
                        {unit.assignments.map((asg, aIdx) => {
                          const done = isAssignmentDone(asg);
                          const taskUnlocked =
                            !isStudent ||
                            done ||
                            (unitUnlocked && allLessonsInUnitViewed);

                          const isBeingDragged =
                            draggedItem?.type === 'assignment' && draggedItem?.id === asg.id;
                          const isTargetOver =
                            dragOverItem?.type === 'assignment' &&
                            dragOverItem?.unitIdx === unit.unitIdx &&
                            dragOverItem?.index === aIdx &&
                            !isBeingDragged;

                          return (
                            <div
                              key={asg.id}
                              draggable={canManageCourse}
                              onDragStart={(e) => handleDragStart(e, 'assignment', unit.unitIdx, aIdx, asg)}
                              onDragOver={(e) => handleDragOver(e, 'assignment', unit.unitIdx, aIdx)}
                              onDrop={(e) => handleDrop(e, 'assignment', unit.unitIdx, aIdx)}
                              onDragEnd={handleDragEnd}
                              onClick={() => {
                                if (isDraggingRef.current) return;
                                if (!taskUnlocked) {
                                  addToast(
                                    'Please view all lessons in this unit before starting the unit task.',
                                    'info'
                                  );
                                  return;
                                }
                                setAssignmentOrigin('course-details');
                                setSelectedAssignmentId(asg.id);
                                setActiveTab('assignment-details');
                              }}
                              className={`px-5 py-3.5 flex items-center justify-between gap-4 transition-all relative ${
                                isBeingDragged
                                  ? 'opacity-40 bg-gold/15 border-2 border-dashed border-gold/60 scale-[0.99] rounded-xl'
                                  : isTargetOver
                                  ? 'bg-gold/15 ring-2 ring-gold rounded-xl shadow-xs'
                                  : taskUnlocked
                                  ? 'hover:bg-cream/40 cursor-pointer group'
                                  : 'opacity-55 bg-cream/20 cursor-not-allowed'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {canManageCourse && (
                                  <div
                                    className="p-1 -ml-1 text-charcoal/30 hover:text-gold-dark cursor-grab active:cursor-grabbing hover:bg-gold/15 rounded-lg transition-colors shrink-0"
                                    title="Drag to rearrange assignment"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                )}
                                <div className="w-8 h-8 rounded-xl bg-gold/20 text-gold-dark flex items-center justify-center shrink-0">
                                  <Rocket className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs sm:text-sm font-bold text-charcoal group-hover:text-forest transition-colors break-words leading-snug">
                                    Graded Task: {asg.title}
                                  </h4>
                                  <p className="text-[11px] text-charcoal-muted mt-0.5">
                                    Due {asg.dueDate} • {asg.maxScore || 100} pts
                                    {done ? ' • Submitted' : ' • Required to complete unit'}
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 flex items-center gap-2">
                                {canManageCourse && (
                                  <div
                                    className="flex items-center gap-1 bg-cream/70 rounded-xl p-0.5 border border-charcoal/10"
                                    draggable={false}
                                    onDragStart={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditAssignmentModal(asg)}
                                      title="Edit Assignment"
                                      className="p-1 rounded-lg text-charcoal-muted hover:text-gold-dark hover:bg-white transition-colors cursor-pointer"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`Delete assignment "${asg.title}"? This will also remove any related submissions.`)) {
                                          deleteAssignment(asg.id);
                                        }
                                      }}
                                      title="Delete Assignment"
                                      className="p-1 rounded-lg text-charcoal-muted hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                                {done ? (
                                  <Check className="w-4 h-4 text-forest stroke-[2.5]" />
                                ) : !taskUnlocked ? (
                                  <Lock className="w-3.5 h-3.5 text-charcoal-muted" />
                                ) : (
                                  <Circle className="w-4 h-4 text-charcoal/25" />
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* Quizzes in this Curriculum Unit */}
                        {(() => {
                          const unitQuizzes = (quizzes || []).filter(
                            (q) =>
                              q.courseId === course.id &&
                              (q.unitIdx !== undefined
                                ? Number(q.unitIdx) === Number(unit.unitIdx)
                                : 0 === Number(unit.unitIdx))
                          );

                          return unitQuizzes.map((quiz) => {
                            const myQuizSub = (quizSubmissions || []).find(
                              (s) => s.quizId === quiz.id && s.studentId === currentUser?.id
                            );
                            const quizDone = Boolean(myQuizSub);
                            const attemptsCount = (quizSubmissions || []).filter(
                              (s) => s.quizId === quiz.id
                            ).length;

                            return (
                              <div
                                key={quiz.id}
                                onClick={() => {
                                  if (canManageCourse) {
                                    handleOpenEditQuizModal(quiz);
                                  } else {
                                    setActiveTakingQuiz(quiz);
                                  }
                                }}
                                className="px-5 py-3.5 flex items-center justify-between gap-4 transition-all hover:bg-cream/40 cursor-pointer group border-t border-charcoal/5"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                                    <HelpCircle className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="text-xs sm:text-sm font-bold text-charcoal group-hover:text-forest transition-colors break-words leading-snug">
                                        Multiple Choice Quiz: {quiz.title}
                                      </h4>
                                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                                        {quiz.questions?.length || 0} Questions
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-charcoal-muted mt-0.5">
                                      Due {quiz.dueDate} • {quiz.totalPoints} pts • Limit: {quiz.duration || '20 min'} • Auto-Graded
                                      {quizDone
                                        ? ` • Score: ${myQuizSub.score}/${myQuizSub.maxScore}`
                                        : ''}
                                    </p>
                                  </div>
                                </div>

                                <div className="shrink-0 flex items-center gap-2">
                                  {canManageCourse ? (
                                    <div
                                      className="flex items-center gap-1.5"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                        Auto-Graded
                                      </span>
                                      <div className="flex items-center gap-1 bg-cream/70 rounded-xl p-0.5 border border-charcoal/10">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenEditQuizModal(quiz)}
                                          title="Edit Quiz"
                                          className="p-1 rounded-lg text-charcoal-muted hover:text-purple-700 hover:bg-white transition-colors cursor-pointer"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (confirm(`Delete quiz "${quiz.title}"?`)) {
                                              deleteQuiz(quiz.id);
                                            }
                                          }}
                                          title="Delete Quiz"
                                          className="p-1 rounded-lg text-charcoal-muted hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ) : quizDone ? (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveTakingQuiz(quiz);
                                      }}
                                      className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-200 cursor-pointer"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Score: {myQuizSub.score}/{myQuizSub.maxScore}</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveTakingQuiz(quiz);
                                      }}
                                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                                    >
                                      <HelpCircle className="w-3.5 h-3.5" />
                                      <span>Take Quiz</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          });
                        })()}

                        {/* Unit Controls for Instructor & Admin */}
                        {canManageCourse && (
                          <div className="px-5 py-3 bg-forest-50/50 border-t border-charcoal/10 flex flex-wrap items-center justify-between gap-2.5">
                            <span className="text-[11px] font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
                              <GripVertical className="w-3.5 h-3.5 opacity-60" />
                              {unit.unitLabel} Curriculum • Drag items to reorder
                            </span>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleOpenAddMaterialModal(unit.unitIdx)}
                                className="px-3 py-1.5 rounded-xl border border-forest/25 bg-white text-forest text-xs font-bold hover:bg-cream transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              >
                                <Paperclip className="w-3.5 h-3.5" />
                                <span>+ Attach Material</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenAddAssignmentModal(unit.unitIdx)}
                                className="px-3 py-1.5 rounded-xl border border-gold/40 bg-white hover:bg-amber-50/60 text-gold-dark text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              >
                                <Rocket className="w-3.5 h-3.5 text-gold-dark" />
                                <span>+ Add Assignment</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenAddQuizModal(unit.unitIdx)}
                                className="px-3 py-1.5 rounded-xl border border-purple-300 bg-white hover:bg-purple-50 text-purple-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              >
                                <HelpCircle className="w-3.5 h-3.5 text-purple-700" />
                                <span>+ Add Quiz</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenAddLessonModal(unit.unitIdx)}
                                className="px-3.5 py-1.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                              >
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>+ Add Lesson</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Materials */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-charcoal/10 pb-4">
            <div>
              <h3 className="text-base font-bold font-heading text-charcoal">
                Course Learning Materials &amp; Resources
              </h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Lecture notes, PDFs, slide decks, syllabus outlines, and workshop guides
              </p>
            </div>
            {canManageCourse && (
              <button
                type="button"
                onClick={() => handleOpenAddMaterialModal('all')}
                className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Learning Material</span>
              </button>
            )}
          </div>

          {courseMaterials.length === 0 ? (
            <div className="py-10 text-center">
              <Paperclip className="w-8 h-8 text-charcoal/25 mx-auto mb-2" />
              <p className="text-xs text-charcoal-muted font-medium">
                No materials uploaded for this course yet.
              </p>
              {canManageCourse && (
                <button
                  type="button"
                  onClick={() => handleOpenAddMaterialModal('all')}
                  className="mt-3 px-3.5 py-1.5 rounded-xl bg-forest/10 hover:bg-forest/20 text-forest text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Upload the First Resource</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {courseMaterials.map((mat) => {
                const assignedUnit =
                  mat.unitIdx !== undefined && mat.unitIdx !== null
                    ? course.syllabus?.[mat.unitIdx]?.unit || `Unit ${mat.unitIdx + 1}`
                    : 'All Units';

                return (
                  <div
                    key={mat.id}
                    className="p-4 rounded-2xl border border-charcoal/10 bg-cream/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-white border border-charcoal/10 flex items-center justify-center shrink-0 shadow-2xs">
                        {mat.type === 'pdf' ? (
                          <FileText className="w-5 h-5 text-red-600" />
                        ) : mat.type === 'slides' ? (
                          <Presentation className="w-5 h-5 text-amber-600" />
                        ) : mat.type === 'video' ? (
                          <Video className="w-5 h-5 text-blue-600" />
                        ) : mat.type === 'code' ? (
                          <FileCode className="w-5 h-5 text-forest" />
                        ) : mat.type === 'image' ? (
                          <ImageIcon className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-forest" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-charcoal break-words">
                            {mat.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md bg-forest/10 text-forest text-[10px] font-bold">
                            {assignedUnit}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-muted mt-0.5">
                          Uploaded by {mat.uploadedBy} • {mat.size} • {mat.uploadDate}
                        </p>
                        {mat.description && (
                          <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                            {mat.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {canManageCourse && (
                        <div className="flex items-center gap-1 bg-white rounded-xl p-0.5 border border-charcoal/10">
                          <button
                            type="button"
                            onClick={() => handleOpenEditMaterialModal(mat)}
                            className="p-2 rounded-xl text-charcoal-muted hover:text-forest hover:bg-cream transition-colors cursor-pointer"
                            title="Edit material"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete material "${mat.title}"?`)) {
                                deleteMaterial(mat.id);
                              }
                            }}
                            className="p-2 rounded-xl text-charcoal-muted hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete material"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          addToast(`Simulating download of ${mat.title}.${mat.type || 'pdf'}`, 'info')
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Assignments */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-charcoal/10 pb-4">
            <div>
              <h3 className="text-base font-bold font-heading text-charcoal">
                Assignments for {course.title}
              </h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Unit tasks, graded deliverables, milestones, and studio reviews
              </p>
            </div>
            {canManageCourse && (
              <button
                type="button"
                onClick={() => handleOpenAddAssignmentModal(0)}
                className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add Assignment</span>
              </button>
            )}
          </div>
          {courseAssignments.length === 0 ? (
            <p className="text-xs text-charcoal-muted py-6 text-center">
              No active assignments currently scheduled.
            </p>
          ) : (
            <div className="space-y-3">
              {courseAssignments.map((asg) => {
                const assignedUnit =
                  asg.unitIdx !== undefined && asg.unitIdx !== null
                    ? course.syllabus?.[asg.unitIdx]?.unit || `Unit ${asg.unitIdx + 1}`
                    : null;

                return (
                  <div
                    key={asg.id}
                    onClick={() => {
                      setSelectedAssignmentId(asg.id);
                      setActiveTab('assignment-details');
                    }}
                    className="p-4 rounded-2xl border border-charcoal/10 bg-cream/40 hover:border-forest/30 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-charcoal font-heading">
                          {asg.title}
                        </h4>
                        {assignedUnit && (
                          <span className="px-2 py-0.5 rounded-md bg-forest/10 text-forest text-[10px] font-bold">
                            {assignedUnit}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/20 text-gold-dark">
                          {asg.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-muted mt-1 max-w-xl">
                        {asg.description}
                      </p>
                      <p className="text-[11px] font-semibold text-forest mt-1.5 flex items-center gap-2">
                        <span>Due: {asg.dueDate} ({asg.dueTime})</span>
                        <span>•</span>
                        <span>Max Points: {asg.maxScore}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {canManageCourse && (
                        <div
                          className="flex items-center gap-1 bg-white rounded-xl p-0.5 border border-charcoal/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleOpenEditAssignmentModal(asg)}
                            className="p-2 rounded-xl text-charcoal-muted hover:text-gold-dark hover:bg-cream transition-colors cursor-pointer"
                            title="Edit assignment"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete assignment "${asg.title}"? This will also remove any related submissions.`)) {
                                deleteAssignment(asg.id);
                              }
                            }}
                            className="p-2 rounded-xl text-charcoal-muted hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete assignment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAssignmentId(asg.id);
                          setActiveTab('assignment-details');
                        }}
                        className="px-4 py-2 rounded-xl bg-charcoal text-cream text-xs font-bold hover:bg-charcoal-light transition-colors"
                      >
                        View Task
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

            {/* Tab: Course Grades (Scores from assignments & tasks + total grade) */}
      {activeTab === 'grades' && (() => {
        const effectiveStudentId = (currentUser?.role === 'teacher' || currentUser?.role === 'admin')
          ? (selectedGradeStudentId || enrolledStudents[0]?.id || currentUser?.id)
          : currentUser?.id;
        const targetStudent = users.find((u) => u.id === effectiveStudentId) || currentUser;

        const courseQuizzes = (quizzes || []).filter((q) => q.courseId === course.id);

        const getLetter = (pct) => {
          const n = Number(pct);
          if (n >= 94) return 'A';
          if (n >= 90) return 'A-';
          if (n >= 87) return 'B+';
          if (n >= 83) return 'B';
          if (n >= 80) return 'B-';
          if (n >= 75) return 'C+';
          if (n >= 70) return 'C';
          if (n >= 60) return 'D';
          return 'F';
        };

        // Assignment grade rows
        const assignmentRows = courseAssignments.map((a) => {
          const sub = submissions.find(
            (s) => s.assignmentId === a.id && s.studentId === effectiveStudentId
          );
          const isGraded = sub?.status === 'Graded';
          const isSubmitted = sub && sub.status !== 'Pending';
          const score = isGraded ? Number(sub.score) : 0;
          const max = Number(a.maxScore) || 100;
          const pct = isGraded ? Math.round((score / max) * 100) : null;
          const letter = isGraded ? getLetter(pct) : '—';

          return {
            assignment: a,
            submission: sub,
            status: isGraded ? 'Graded' : isSubmitted ? 'Submitted' : 'Not Submitted',
            isGraded,
            score,
            max,
            pct,
            letter,
            feedback: sub?.feedback || '',
            rubricScores: sub?.rubricScores || null,
          };
        });

        // Quiz grade rows
        const quizRows = courseQuizzes.map((q) => {
          const qSub = (quizSubmissions || []).find(
            (qs) => qs.quizId === q.id && qs.studentId === effectiveStudentId
          );
          const isCompleted = !!qSub;
          const score = isCompleted ? Number(qSub.score) : 0;
          const max = Number(q.totalPoints) || 40;
          const pct = isCompleted ? qSub.percentage : null;
          const letter = isCompleted ? getLetter(pct) : '—';

          return {
            quiz: q,
            submission: qSub,
            isCompleted,
            score,
            max,
            pct,
            letter,
            passed: qSub ? qSub.passed : false,
            submittedAt: qSub?.submittedAt || '',
          };
        });

        // Compute Total Course Grade
        const gradedAsgs = assignmentRows.filter((r) => r.isGraded);
        const completedQuizzes = quizRows.filter((r) => r.isCompleted);

        const earnedPoints =
          gradedAsgs.reduce((acc, r) => acc + r.score, 0) +
          completedQuizzes.reduce((acc, r) => acc + r.score, 0);

        const maxPointsEvaluated =
          gradedAsgs.reduce((acc, r) => acc + r.max, 0) +
          completedQuizzes.reduce((acc, r) => acc + r.max, 0);

        const coursePotentialMax =
          assignmentRows.reduce((acc, r) => acc + r.max, 0) +
          quizRows.reduce((acc, r) => acc + r.max, 0);

        const totalPercentage =
          maxPointsEvaluated > 0
            ? ((earnedPoints / maxPointsEvaluated) * 100).toFixed(1)
            : '100.0';

        const totalLetter = getLetter(totalPercentage);
        const completedCount = gradedAsgs.length + completedQuizzes.length;
        const totalItemsCount = assignmentRows.length + quizRows.length;

        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Overall Course Grade Summary Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-charcoal/10 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal/10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1">
                    Course Gradebook & Cumulative Evaluation
                  </span>
                  <h3 className="text-xl font-bold font-heading text-charcoal">
                    {course.code} Total Course Grade
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    Evaluated scores for <strong className="text-charcoal">{targetStudent?.name}</strong> across all assignments, tasks, and quizzes.
                  </p>
                </div>

                {/* Switch student dropdown for Teachers/Admins */}
                {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && enrolledStudents.length > 0 && (
                  <div className="flex items-center gap-2 self-start sm:self-auto bg-cream/70 p-2 rounded-2xl border border-charcoal/10">
                    <span className="text-xs font-bold text-charcoal pl-1">Learner:</span>
                    <select
                      value={effectiveStudentId}
                      onChange={(e) => setSelectedGradeStudentId(e.target.value)}
                      className="bg-white border border-charcoal/15 text-xs font-semibold rounded-xl px-3 py-1.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/20"
                    >
                      {enrolledStudents.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({st.studentId || 'ID'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* KPI Performance Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="p-4 rounded-2xl bg-forest/5 border border-forest/15 flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center font-heading text-2xl font-extrabold shadow-xs shrink-0">
                    {totalLetter}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                      Total Course Grade
                    </span>
                    <div className="text-xl font-bold text-forest font-heading">
                      {totalPercentage}%
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      {Number(totalPercentage) >= 80 ? 'In Good Academic Standing' : 'Passing Mark'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cream/60 border border-charcoal/10 flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gold/20 text-gold-dark flex items-center justify-center font-bold shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                      Total Score / Points
                    </span>
                    <div className="text-xl font-bold text-charcoal font-heading font-mono">
                      {earnedPoints} / {maxPointsEvaluated}{' '}
                      <span className="text-xs font-normal text-charcoal-muted">pts</span>
                    </div>
                    <span className="text-[10px] text-charcoal-muted">
                      Out of {coursePotentialMax} total course points
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cream/60 border border-charcoal/10 flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                      Completed Assessments
                    </span>
                    <div className="text-xl font-bold text-charcoal font-heading">
                      {completedCount} of {totalItemsCount}{' '}
                      <span className="text-xs font-normal text-charcoal-muted">tasks</span>
                    </div>
                    <span className="text-[10px] text-charcoal-muted">
                      {assignmentRows.length} Assignments • {quizRows.length} Quizzes
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignments & Studio Tasks Table */}
            <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-forest" />
                  <h4 className="text-sm font-bold font-heading text-charcoal">
                    Assignment & Studio Tasks
                  </h4>
                </div>
                <span className="text-xs font-bold text-charcoal-muted">
                  {assignmentRows.length} Tasks
                </span>
              </div>

              {assignmentRows.length === 0 ? (
                <p className="text-xs text-charcoal-muted py-6 text-center">
                  No assignments posted for this course.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-charcoal/10 text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                        <th className="pb-3 font-bold">Task Name</th>
                        <th className="pb-3 font-bold">Due Date</th>
                        <th className="pb-3 font-bold">Status</th>
                        <th className="pb-3 font-bold">Score</th>
                        <th className="pb-3 font-bold">Grade</th>
                        <th className="pb-3 font-bold">Evaluator Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {assignmentRows.map((row) => (
                        <tr key={row.assignment.id} className="hover:bg-cream/20 transition-colors">
                          <td className="py-3.5 pr-4">
                            <div className="font-bold text-charcoal">{row.assignment.title}</div>
                            <div className="text-[11px] text-charcoal-muted">
                              {row.assignment.priority} Priority • Max {row.assignment.maxScore} pts
                            </div>
                          </td>
                          <td className="py-3.5 text-charcoal-muted whitespace-nowrap">
                            {row.assignment.dueDate}
                          </td>
                          <td className="py-3.5 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                row.status === 'Graded'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : row.status === 'Submitted'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-charcoal/10 text-charcoal-muted'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3.5 font-mono font-bold text-charcoal whitespace-nowrap">
                            {row.isGraded ? `${row.score} / ${row.max} pts` : '—'}
                          </td>
                          <td className="py-3.5 whitespace-nowrap">
                            {row.isGraded ? (
                              <span className="px-2 py-0.5 rounded-md bg-forest/10 text-forest font-extrabold text-xs">
                                {row.letter} ({row.pct}%)
                              </span>
                            ) : (
                              <span className="text-charcoal-muted">—</span>
                            )}
                          </td>
                          <td className="py-3.5 max-w-xs text-charcoal-muted">
                            {row.feedback ? (
                              <div className="text-[11px] leading-snug">
                                <span className="italic text-charcoal">"{row.feedback}"</span>
                                {row.rubricScores && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {Object.entries(row.rubricScores).map(([k, v]) => (
                                      <span
                                        key={k}
                                        className="text-[9px] bg-cream px-1.5 py-0.5 rounded border border-charcoal/10"
                                      >
                                        {k}: {v} pts
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-charcoal-muted italic text-[11px]">
                                {row.isGraded ? 'No feedback recorded' : 'Awaiting critique'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quizzes & Objective Tasks Table */}
            <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-700" />
                  <h4 className="text-sm font-bold font-heading text-charcoal">
                    Quizzes & Knowledge Checks
                  </h4>
                </div>
                <span className="text-xs font-bold text-charcoal-muted">
                  {quizRows.length} Quizzes
                </span>
              </div>

              {quizRows.length === 0 ? (
                <p className="text-xs text-charcoal-muted py-6 text-center">
                  No quizzes published for this course yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-charcoal/10 text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                        <th className="pb-3 font-bold">Quiz Assessment</th>
                        <th className="pb-3 font-bold">Due Date</th>
                        <th className="pb-3 font-bold">Status</th>
                        <th className="pb-3 font-bold">Score</th>
                        <th className="pb-3 font-bold">Grade</th>
                        <th className="pb-3 font-bold">Outcome</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {quizRows.map((row) => (
                        <tr key={row.quiz.id} className="hover:bg-cream/20 transition-colors">
                          <td className="py-3.5 pr-4">
                            <div className="font-bold text-charcoal">{row.quiz.title}</div>
                            <div className="text-[11px] text-charcoal-muted">
                              {row.quiz.duration} • Pass mark: {row.quiz.passingScorePercent || 70}%
                            </div>
                          </td>
                          <td className="py-3.5 text-charcoal-muted whitespace-nowrap">
                            {row.quiz.dueDate}
                          </td>
                          <td className="py-3.5 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                row.isCompleted
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-charcoal/10 text-charcoal-muted'
                              }`}
                            >
                              {row.isCompleted ? 'Completed' : 'Not Attempted'}
                            </span>
                          </td>
                          <td className="py-3.5 font-mono font-bold text-charcoal whitespace-nowrap">
                            {row.isCompleted ? `${row.score} / ${row.max} pts` : '—'}
                          </td>
                          <td className="py-3.5 whitespace-nowrap">
                            {row.isCompleted ? (
                              <span className="px-2 py-0.5 rounded-md bg-forest/10 text-forest font-extrabold text-xs">
                                {row.letter} ({row.pct}%)
                              </span>
                            ) : (
                              <span className="text-charcoal-muted">—</span>
                            )}
                          </td>
                          <td className="py-3.5 whitespace-nowrap">
                            {row.isCompleted ? (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  row.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {row.passed ? 'Passed' : 'Needs Review'}
                              </span>
                            ) : (
                              <span className="text-charcoal-muted italic text-[11px]">Pending attempt</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      })()}

{/* Tab: Google Meet Live Classroom */}
      {activeTab === 'meet' && (
        <div className="space-y-4">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Video className="w-5 h-5" />
                </span>
                <h3 className="text-base sm:text-lg font-bold font-heading text-charcoal">
                  Google Meet Online Classroom
                </h3>
              </div>
              <p className="text-xs text-charcoal-muted mt-1.5 max-w-xl leading-relaxed">
                Join live studio lectures, real-time critiques, and digital whiteboard discussions. Instructors post active meeting links here for enrolled students.
              </p>
            </div>

            {isTeacherOrAdmin && (
              <button
                type="button"
                onClick={handleOpenMeetingModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-cream font-bold text-xs transition-all shadow-md shadow-forest/15 shrink-0 cursor-pointer"
              >
                {currentMeeting ? (
                  <>
                    <Edit className="w-4 h-4 text-gold" />
                    <span>Update Meeting Details</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Set Up Live Class</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Active Meeting Card */}
          {currentMeeting ? (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#122b22] via-forest to-charcoal border border-emerald-500/30 shadow-md p-6 sm:p-7 text-white">
              <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
              <div className="absolute right-6 top-6 opacity-10 pointer-events-none hidden sm:block">
                <Video className="w-32 h-32 text-emerald-300" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3.5 max-w-2xl">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {currentMeeting.status === 'live' ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        LIVE SESSION ACTIVE NOW
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gold/20 text-gold border border-gold/40">
                        <Clock className="w-3.5 h-3.5" />
                        UPCOMING SCHEDULED CLASS
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cream backdrop-blur-xs border border-white/10">
                      <Video className="w-3.5 h-3.5 text-emerald-400" />
                      Google Meet
                    </span>

                    {/* Date of Meeting */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{formatMeetingDate(currentMeeting.date)}</span>
                    </span>

                    {/* Time of Meeting */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cream/90 border border-white/10">
                      <Clock className="w-3.5 h-3.5 text-sage" />
                      <span>{currentMeeting.time || course.schedule || '10:00 AM - 11:30 AM'}</span>
                    </span>
                  </div>

                  {/* Topic and Host */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                      {currentMeeting.title}
                    </h3>
                    <div className="flex items-center gap-2.5 mt-2 text-xs text-cream/80">
                      <img
                        src={currentMeeting.instructorAvatar || course.instructorAvatar}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover border border-white/20"
                      />
                      <span>
                        Host:{' '}
                        <strong className="text-cream">
                          {currentMeeting.instructorName || course.instructorName}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Notes / Agenda */}
                  {currentMeeting.notes && (
                    <div className="p-3.5 rounded-2xl bg-black/25 border border-white/10 text-xs text-cream/90 leading-relaxed">
                      <span className="font-semibold text-emerald-300 mr-1.5">
                        Class Instructions &amp; Agenda:
                      </span>
                      {currentMeeting.notes}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleJoinMeeting}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-charcoal font-extrabold text-sm shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Video className="w-5 h-5 text-charcoal" />
                    <span>Join Google Meet</span>
                    <ExternalLink className="w-4 h-4 text-charcoal/70" />
                  </button>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(currentMeeting.meetUrl)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-cream text-xs font-semibold transition-colors border border-white/10 cursor-pointer"
                      title="Copy Google Meet Link"
                    >
                      <Copy className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                    </button>

                    {isTeacherOrAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={handleOpenMeetingModal}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-cream text-xs font-semibold transition-colors border border-white/10 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 text-gold" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteMeeting}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors border border-red-500/30 cursor-pointer"
                          title="Cancel & Remove Meeting"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-charcoal/10 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-cream/70 text-charcoal-muted flex items-center justify-center mx-auto border border-charcoal/10">
                <Video className="w-7 h-7 text-charcoal/40" />
              </div>
              <h4 className="text-base font-bold font-heading text-charcoal">
                No Live Class Scheduled Right Now
              </h4>
              <p className="text-xs text-charcoal-muted max-w-md mx-auto leading-relaxed">
                {isTeacherOrAdmin
                  ? 'As an instructor, you can paste a Google Meet link at any time to start a live lecture or studio critique. Students will see the "Join Google Meet" button immediately.'
                  : 'Your instructor has not scheduled an active Google Meet class for this course yet. Links will appear here before your scheduled lecture time.'}
              </p>
              {isTeacherOrAdmin && (
                <button
                  type="button"
                  onClick={handleOpenMeetingModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-cream font-bold text-xs transition-all shadow-md shadow-forest/15 cursor-pointer mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule Google Meet Class</span>
                </button>
              )}
            </div>
          )}

          {/* Quick Joining Guidelines Card */}
          <div className="bg-cream/40 rounded-3xl p-6 border border-charcoal/10 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <h5 className="font-bold text-charcoal flex items-center gap-1.5">
                <span>📹</span> Camera &amp; Microphone
              </h5>
              <p className="text-charcoal-muted leading-relaxed">
                Test your audio and video equipment prior to joining. Keep microphones muted when not speaking.
              </p>
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-charcoal flex items-center gap-1.5">
                <span>🖥️</span> Screen Sharing Ready
              </h5>
              <p className="text-charcoal-muted leading-relaxed">
                Have your active assignment files, digital canvases, or sketches open in a browser tab for critiques.
              </p>
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-charcoal flex items-center gap-1.5">
                <span>💬</span> Real-time Questions
              </h5>
              <p className="text-charcoal-muted leading-relaxed">
                Use the Google Meet in-call chat feature or the "Raise Hand" button to ask questions during lectures.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Students / Class List */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          {/* 1 Teacher: Assigned Lead Faculty */}
          <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1">
                  Faculty Leadership • 1 Teacher
                </span>
                <h3 className="text-base font-bold font-heading text-charcoal">
                  Course Instructor
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sage/20 text-forest border border-forest/20 self-start sm:self-auto">
                1 Lead Instructor
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-charcoal/10 bg-cream/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={courseTeacher.avatar || course.instructorAvatar}
                  alt={courseTeacher.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-charcoal/10 shadow-xs shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-charcoal">
                      {courseTeacher.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest text-cream">
                      Instructor
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    {courseTeacher.title || 'Course Lecturer'} • {courseTeacher.department || 'Faculty of Applied Arts'}
                  </p>
                  <p className="text-[11px] text-charcoal-muted font-mono mt-1">
                    {courseTeacher.email} {courseTeacher.phone ? `• ${courseTeacher.phone}` : ''}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-charcoal-muted pt-3 sm:pt-0 border-t sm:border-t-0 border-charcoal/10">
                <span className="font-bold text-charcoal block">Studio Schedule</span>
                <span>{course.schedule}</span>
                <span className="block text-[11px] text-forest font-semibold mt-0.5">Room: {course.room}</span>
              </div>
            </div>
          </div>

          {/* At Least 3 Students: Enrolled Cohort Roster */}
          <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1">
                  Enrolled Cohort
                </span>
                <h3 className="text-base font-bold font-heading text-charcoal">
                  Class Roster ({enrolledStudents.length} Students)
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Studio learners enrolled and active in this course (minimum 3 students required).
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-forest-50 text-forest border border-forest/20 self-start sm:self-auto">
                {enrolledStudents.length} Active Students
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {enrolledStudents.map((st) => (
                <div
                  key={st.id}
                  className="p-4 rounded-2xl border border-charcoal/10 bg-cream/40 flex items-center gap-3.5 hover:shadow-xs hover:border-forest/30 transition-all"
                >
                  <img
                    src={st.avatar}
                    alt={st.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-charcoal/10 shadow-2xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-charcoal truncate">{st.name}</h4>
                    <p className="text-[11px] text-charcoal-muted truncate">{st.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono font-bold text-forest bg-forest/10 px-1.5 py-0.5 rounded-md">
                        {st.studentId || 'STUDENT'}
                      </span>
                      {st.gpa && (
                        <span className="text-[10px] font-semibold text-charcoal-muted">
                          GPA: {st.gpa}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Teacher / Admin Google Meet Setup Modal */}
      {isMeetingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-charcoal/10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-charcoal/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-charcoal">
                    {currentMeeting ? 'Edit Google Meet Class' : 'Schedule Live Class'}
                  </h3>
                  <p className="text-xs text-charcoal-muted">
                    {course.code} • {course.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMeetingModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-cream text-charcoal-muted hover:text-charcoal flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMeeting} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Class Session Title / Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={meetingForm.title}
                  onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                  placeholder="e.g. Unit 2 Live Studio Critique & Q&A"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Google Meet Link <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={meetingForm.meetUrl}
                    onChange={(e) => setMeetingForm({ ...meetingForm, meetUrl: e.target.value })}
                    placeholder="https://meet.google.com/abc-defg-hij"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest font-mono"
                  />
                  <Video className="w-4 h-4 text-charcoal-muted absolute left-3 top-3" />
                </div>
                <p className="text-[11px] text-charcoal-muted mt-1">
                  Paste the meeting link from Google Meet or Google Calendar.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-forest" />
                    <span>Meeting Date</span> <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={meetingForm.date || ''}
                    onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-forest" />
                    <span>Meeting Time</span> <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={meetingForm.time}
                    onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                    placeholder="e.g. 10:00 AM - 11:30 AM"
                    className="w-full px-3 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Meeting Status
                  </label>
                  <select
                    value={meetingForm.status}
                    onChange={(e) => setMeetingForm({ ...meetingForm, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest bg-white font-medium"
                  >
                    <option value="live">🟢 Live Right Now</option>
                    <option value="scheduled">🕒 Upcoming Scheduled Class</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Instructions / Agenda for Students
                </label>
                <textarea
                  rows={2}
                  value={meetingForm.notes}
                  onChange={(e) => setMeetingForm({ ...meetingForm, notes: e.target.value })}
                  placeholder="e.g. Have your draft sketches ready for screen sharing. Attendance is required."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-charcoal/10 gap-2">
                {currentMeeting ? (
                  <button
                    type="button"
                    onClick={handleDeleteMeeting}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Cancel Class
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMeetingModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal hover:bg-cream transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-forest hover:bg-forest-light text-cream shadow-md shadow-forest/20 transition-all cursor-pointer"
                  >
                    Save &amp; Publish
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Lesson to Course Unit */}
      {isAddLessonModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 border border-charcoal/10 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-heading text-charcoal">
                    {editingLessonId ? 'Edit Lesson' : 'Add Lesson to Course Syllabus'}
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    {course.code}: {course.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddLessonModalOpen(false);
                  setEditingLessonId(null);
                }}
                className="p-1.5 rounded-xl hover:bg-cream text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrEditLessonSubmit} className="space-y-4">
              {/* Unit Target */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Target Curriculum Unit
                </label>
                <select
                  value={selectedUnitIdxForLesson}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    setSelectedUnitIdxForLesson(idx);
                    const unitObj = course.syllabus?.[idx];
                    const unitTitle = unitObj?.title || `Unit ${idx + 1}`;
                    setLessonFormData((prev) => ({
                      ...prev,
                      topicHeading: prev.topicHeading || `${unitTitle} — Studio Deep-Dive`,
                      diagTop: `${unitObj?.unit || 'Unit ' + (idx + 1)} Brief`,
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest bg-cream/30 font-semibold"
                >
                  {(course.syllabus || []).map((u, uIdx) => (
                    <option key={uIdx} value={uIdx}>
                      {u.unit || `Unit ${uIdx + 1}`}: {u.title} ({u.lessons || 0} Lessons)
                    </option>
                  ))}
                </select>
              </div>

              {/* Lesson Title */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Lesson Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modernist Chromatic Harmonies & Color Weight"
                  value={lessonFormData.title}
                  onChange={(e) =>
                    setLessonFormData({ ...lessonFormData, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest bg-cream/30 font-medium"
                />
              </div>

              {/* Topic Heading */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Topic Subtitle / Heading
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bauhaus Chromatic Contrast & Spectral Dynamics"
                  value={lessonFormData.topicHeading}
                  onChange={(e) =>
                    setLessonFormData({ ...lessonFormData, topicHeading: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest bg-cream/30"
                />
              </div>

              {/* Definition / Studio Brief */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Lesson Overview &amp; Definition
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain the foundational theory, conceptual premise, and studio workflow students will explore in this lesson..."
                  value={lessonFormData.definition}
                  onChange={(e) =>
                    setLessonFormData({ ...lessonFormData, definition: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest resize-none bg-cream/30 leading-relaxed"
                />
              </div>

              {/* Learning Objectives */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Key Learning Objectives (One bullet per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="• Analyze primary principles\n• Apply studio methods to practical exercises\n• Present deliverables in peer critique"
                  value={lessonFormData.majorFunctionsText}
                  onChange={(e) =>
                    setLessonFormData({
                      ...lessonFormData,
                      majorFunctionsText: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest resize-none bg-cream/30 leading-relaxed font-mono"
                />
              </div>

              {/* Core Concepts / Terms */}
              <div className="space-y-2 pt-1 border-t border-charcoal/10">
                <span className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                  Core Concepts &amp; Terminology (Optional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5 p-3 rounded-xl bg-cream/30 border border-charcoal/10">
                    <input
                      type="text"
                      placeholder="Concept 1: e.g. Analytical Plane"
                      value={lessonFormData.term1}
                      onChange={(e) =>
                        setLessonFormData({ ...lessonFormData, term1: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-charcoal/15 text-xs text-charcoal font-bold bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Description 1..."
                      value={lessonFormData.desc1}
                      onChange={(e) =>
                        setLessonFormData({ ...lessonFormData, desc1: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-charcoal/15 text-[11px] text-charcoal bg-white"
                    />
                  </div>
                  <div className="space-y-1.5 p-3 rounded-xl bg-cream/30 border border-charcoal/10">
                    <input
                      type="text"
                      placeholder="Concept 2: e.g. Visual Equilibrium"
                      value={lessonFormData.term2}
                      onChange={(e) =>
                        setLessonFormData({ ...lessonFormData, term2: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-charcoal/15 text-xs text-charcoal font-bold bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Description 2..."
                      value={lessonFormData.desc2}
                      onChange={(e) =>
                        setLessonFormData({ ...lessonFormData, desc2: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-charcoal/15 text-[11px] text-charcoal bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Studio Diagram Steps */}
              <div className="space-y-2 pt-1 border-t border-charcoal/10">
                <span className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                  Studio Workflow Diagram (Interactive Roadmap)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-charcoal-muted uppercase block mb-1">
                      Step 1: Brief / Origin
                    </span>
                    <input
                      type="text"
                      value={lessonFormData.diagTop}
                      onChange={(e) =>
                        setLessonFormData({ ...lessonFormData, diagTop: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-xl border border-charcoal/15 text-xs text-charcoal bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-charcoal-muted uppercase block mb-1">
                      Step 2: Exploration
                    </span>
                    <input
                      type="text"
                      value={lessonFormData.diagMid1}
                      onChange={(e) =>
                        setLessonFormData({ ...lessonFormData, diagMid1: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-xl border border-charcoal/15 text-xs text-charcoal bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-charcoal-muted uppercase block mb-1">
                      Step 3: Critique / Review
                    </span>
                    <input
                      type="text"
                      value={lessonFormData.diagMid2}
                      onChange={(e) =>
                        setLessonFormData({ ...lessonFormData, diagMid2: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-xl border border-charcoal/15 text-xs text-charcoal bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-charcoal-muted uppercase block mb-1">
                      Step 4: Final Deliverable
                    </span>
                    <input
                      type="text"
                      value={lessonFormData.diagBottom}
                      onChange={(e) =>
                        setLessonFormData({
                          ...lessonFormData,
                          diagBottom: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl border border-charcoal/15 text-xs text-charcoal bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-charcoal/10">
                <button
                  type="button"
                  onClick={() => setIsAddLessonModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal hover:bg-cream transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-forest hover:bg-forest-light text-cream shadow-md shadow-forest/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{editingLessonId ? 'Save Lesson Changes' : 'Publish Lesson to Unit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload / Edit Learning Material */}
      {isUploadMaterialModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-charcoal/10 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-heading text-charcoal">
                    {editingMaterialId ? 'Edit Learning Material' : 'Upload Learning Material'}
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    {course.code}: {course.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsUploadMaterialModalOpen(false);
                  setEditingMaterialId(null);
                }}
                className="p-1.5 rounded-xl hover:bg-cream text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMaterialSubmit} className="space-y-4">
              {/* Associated Unit */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Associated Unit / Scope
                </label>
                <select
                  value={selectedMaterialUnit}
                  onChange={(e) => setSelectedMaterialUnit(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest bg-cream/30 font-semibold"
                >
                  <option value="all">All Units (Course-wide Resource)</option>
                  {(course.syllabus || []).map((u, uIdx) => (
                    <option key={uIdx} value={uIdx}>
                      {u.unit || `Unit ${uIdx + 1}`}: {u.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Material Title */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Material Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Studio Manual & Color Contrast Guide"
                  value={materialFormData.title}
                  onChange={(e) =>
                    setMaterialFormData({ ...materialFormData, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest bg-cream/30 font-medium"
                />
              </div>

              {/* Type and Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Resource Type
                  </label>
                  <select
                    value={materialFormData.type}
                    onChange={(e) =>
                      setMaterialFormData({ ...materialFormData, type: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest bg-cream/30 font-semibold"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="slides">Slide Deck / Keynote</option>
                    <option value="video">Video Recording</option>
                    <option value="code">Source Code / Repo</option>
                    <option value="image">Diagram / Illustration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Simulated Size
                  </label>
                  <input
                    type="text"
                    value={materialFormData.size}
                    onChange={(e) =>
                      setMaterialFormData({ ...materialFormData, size: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest bg-cream/30 font-mono"
                  />
                </div>
              </div>

              {/* Download / Resource Link */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Download / Access URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://cacheup.edu/materials/... or # for local"
                  value={materialFormData.downloadUrl}
                  onChange={(e) =>
                    setMaterialFormData({
                      ...materialFormData,
                      downloadUrl: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest bg-cream/30"
                />
              </div>

              {/* Description / Study Guidelines */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Description / Study Guidelines
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain reading objectives, required pages, or pre-requisite exercises..."
                  value={materialFormData.description}
                  onChange={(e) =>
                    setMaterialFormData({
                      ...materialFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest resize-none bg-cream/30 leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-charcoal/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadMaterialModalOpen(false);
                    setEditingMaterialId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal hover:bg-cream transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-forest hover:bg-forest-light text-cream shadow-md shadow-forest/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{editingMaterialId ? 'Save Material Changes' : 'Confirm & Upload'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Assignment in Course Unit */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-charcoal/10 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gold/20 text-gold-dark flex items-center justify-center">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-heading text-charcoal">
                    {editingAssignmentId ? 'Edit Assignment / Graded Task' : 'Add Assignment to Course Unit'}
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    {course.code}: {course.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAssignmentModalOpen(false);
                  setEditingAssignmentId(null);
                }}
                className="p-1.5 rounded-xl hover:bg-cream text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignmentSubmit} className="space-y-4">
              {/* Target Curriculum Unit */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Target Curriculum Unit
                </label>
                <select
                  value={selectedUnitIdxForAssignment}
                  onChange={(e) => setSelectedUnitIdxForAssignment(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest bg-cream/30 font-semibold"
                >
                  {(course.syllabus || []).map((u, uIdx) => (
                    <option key={uIdx} value={uIdx}>
                      {u.unit || `Unit ${uIdx + 1}`}: {u.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignment Title */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Assignment Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Studio Milestone: Architectural Form Board"
                  value={assignmentFormData.title}
                  onChange={(e) =>
                    setAssignmentFormData({ ...assignmentFormData, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest bg-cream/30 font-medium"
                />
              </div>

              {/* Due Date & Due Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={assignmentFormData.dueDate}
                    onChange={(e) =>
                      setAssignmentFormData({ ...assignmentFormData, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest bg-cream/30 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Due Time
                  </label>
                  <input
                    type="text"
                    placeholder="11:59 PM"
                    value={assignmentFormData.dueTime}
                    onChange={(e) =>
                      setAssignmentFormData({ ...assignmentFormData, dueTime: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest bg-cream/30 font-medium"
                  />
                </div>
              </div>

              {/* Max Score & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Max Score / Points
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={assignmentFormData.maxScore}
                    onChange={(e) =>
                      setAssignmentFormData({
                        ...assignmentFormData,
                        maxScore: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest bg-cream/30 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Priority Level
                  </label>
                  <select
                    value={assignmentFormData.priority}
                    onChange={(e) =>
                      setAssignmentFormData({ ...assignmentFormData, priority: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest bg-cream/30 font-semibold"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              {/* Description / Instructions */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Instructions &amp; Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="Specify assignment requirements, rubrics, file formats, and submission expectations..."
                  value={assignmentFormData.description}
                  onChange={(e) =>
                    setAssignmentFormData({
                      ...assignmentFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest resize-none bg-cream/30 leading-relaxed"
                />
              </div>

              {/* Rubric Criteria Builder & Modifier */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                      Evaluation Rubric &amp; Criteria Breakdown
                    </label>
                    <p className="text-[10px] text-charcoal-muted">
                      Add, adjust, or remove criteria. Points update automatically.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAssignmentFormData((prev) => {
                        const updated = [
                          ...(prev.rubric || []),
                          { criteria: 'New Evaluation Criterion', points: 10 },
                        ];
                        const sum = updated.reduce((acc, r) => acc + (Number(r.points) || 0), 0);
                        return { ...prev, rubric: updated, maxScore: sum };
                      });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:text-gold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Criterion</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(assignmentFormData.rubric || []).map((r, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-xl bg-cream/40 border border-charcoal/10"
                    >
                      <input
                        type="text"
                        value={r.criteria}
                        onChange={(e) => {
                          const updated = [...assignmentFormData.rubric];
                          updated[idx] = { ...updated[idx], criteria: e.target.value };
                          setAssignmentFormData({ ...assignmentFormData, rubric: updated });
                        }}
                        placeholder="Criterion description"
                        className="flex-1 bg-white border border-charcoal/15 rounded-lg px-2.5 py-1.5 text-xs text-charcoal focus:outline-hidden focus:border-forest font-medium"
                      />
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={r.points}
                        onChange={(e) => {
                          const updated = [...assignmentFormData.rubric];
                          updated[idx] = {
                            ...updated[idx],
                            points: Math.max(0, parseInt(e.target.value) || 0),
                          };
                          const sum = updated.reduce(
                            (acc, item) => acc + (Number(item.points) || 0),
                            0
                          );
                          setAssignmentFormData({
                            ...assignmentFormData,
                            rubric: updated,
                            maxScore: sum,
                          });
                        }}
                        className="w-16 bg-white border border-charcoal/15 rounded-lg px-2 py-1.5 text-xs text-charcoal text-center font-bold font-mono focus:outline-hidden focus:border-forest"
                      />
                      <span className="text-[11px] text-charcoal-muted">Pts</span>
                      {(assignmentFormData.rubric || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = assignmentFormData.rubric.filter((_, i) => i !== idx);
                            const sum = updated.reduce(
                              (acc, item) => acc + (Number(item.points) || 0),
                              0
                            );
                            setAssignmentFormData({
                              ...assignmentFormData,
                              rubric: updated,
                              maxScore: sum > 0 ? sum : assignmentFormData.maxScore,
                            });
                          }}
                          className="p-1 text-charcoal-muted hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-2 text-right">
                  <span className="text-xs font-bold text-forest font-mono">
                    Total Rubric Points:{' '}
                    {(assignmentFormData.rubric || []).reduce(
                      (acc, r) => acc + (Number(r.points) || 0),
                      0
                    )}{' '}
                    pts
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-charcoal/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsAssignmentModalOpen(false);
                    setEditingAssignmentId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal hover:bg-cream transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-forest hover:bg-forest-light text-cream shadow-md shadow-forest/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Rocket className="w-4 h-4 text-gold" />
                  <span>{editingAssignmentId ? 'Save Assignment Changes' : 'Add to Unit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quiz Creator & Editor for Teachers */}
      {isQuizModalOpen && (
        <QuizModal
          course={course}
          editingQuiz={editingQuiz}
          initialUnitIdx={selectedUnitIdxForQuiz}
          onClose={() => {
            setIsQuizModalOpen(false);
            setEditingQuiz(null);
          }}
        />
      )}

      {/* Modal: Student Take Quiz & Instant Grade Review */}
      {activeTakingQuiz && (
        <QuizTakeModal
          quiz={activeTakingQuiz}
          existingSubmission={(quizSubmissions || []).find(
            (s) => s.quizId === activeTakingQuiz.id && s.studentId === currentUser?.id
          )}
          onClose={() => setActiveTakingQuiz(null)}
        />
      )}
    </div>
  );
};
