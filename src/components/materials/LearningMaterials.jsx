import React, { useState } from 'react';
import { MAX_UPLOAD_BYTES, readFileAsDataUrl, formatFileSize, detectMaterialType, downloadFile } from '../../utils/files';
import { useLMS } from '../../context/LMSContext';
import {
  FolderOpen,
  PlusCircle,
  Download,
  Trash2,
  Edit,
  Search,
  FileText,
  FileCode,
  Video,
  Image as ImageIcon,
  Presentation,
  ExternalLink,
  CheckCircle,
  Check,
  Lock,
  X
} from 'lucide-react';

export const LearningMaterials = () => {
  const {
    materials,
    courses,
    currentUser,
    viewedMaterialIds,
    markMaterialAsViewed,
    isUnitUnlocked,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    addToast,
  } = useLMS();

  const isTeacher = currentUser?.role === 'teacher';
  const teacherCourses = isTeacher
    ? courses.filter(
        (c) =>
          c.instructorId === currentUser?.id ||
          (currentUser?._id && c.instructorId === currentUser?._id) ||
          currentUser?.assignedCourseIds?.includes(c.id) ||
          (c._id && currentUser?.assignedCourseIds?.includes(c._id)) ||
          (c.instructorName &&
            currentUser?.name &&
            c.instructorName.trim().toLowerCase() === currentUser.name.trim().toLowerCase())
      )
    : courses;
  const availableCourses = isTeacher && teacherCourses.length > 0 ? teacherCourses : courses;

  const [courseFilter, setCourseFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [editingMaterialId, setEditingMaterialId] = useState(null);

  const emptyMaterial = { courseId: '', unitIdx: 'all', title: '', description: '', file: null };
  const [newMaterial, setNewMaterial] = useState(emptyMaterial);

  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  const filteredMaterials = materials.filter((m) => {
    if (isTeacher && !availableCourses.some((c) => c.id === m.courseId)) {
      return false;
    }
    if (courseFilter !== 'all' && m.courseId !== courseFilter) return false;
    if (typeFilter !== 'all' && m.type !== typeFilter) return false;
    if (
      search &&
      !m.title.toLowerCase().includes(search.toLowerCase()) &&
      !(m.courseTitle || m.courseName || '').toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'slides':
        return <Presentation className="w-5 h-5 text-amber-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-600" />;
      case 'code':
        return <FileCode className="w-5 h-5 text-forest" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-emerald-600" />;
      default:
        return <FileText className="w-5 h-5 text-forest" />;
    }
  };

  const handleMaterialFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      addToast('That file is too large. Please upload a file of 7 MB or less.', 'warning');
      return;
    }
    try {
      const url = await readFileAsDataUrl(file);
      setNewMaterial((prev) => ({
        ...prev,
        file: { name: file.name, size: formatFileSize(file.size), type: detectMaterialType(file), url },
      }));
    } catch {
      addToast('Could not read that file. Please try again.', 'error');
    }
  };

  const handleCreateOrUpdateMaterial = (e) => {
    e.preventDefault();
    if (!newMaterial.title.trim()) return;
    if (!newMaterial.file) {
      addToast('Please upload a PDF, video or image file.', 'warning');
      return;
    }
    const courseObj = courses.find((c) => c.id === newMaterial.courseId);
    const { file, ...rest } = newMaterial;
    const payload = {
      ...rest,
      type: file.type,
      size: file.size,
      fileName: file.name,
      downloadUrl: file.url,
      title: newMaterial.title.trim(),
      courseTitle: courseObj?.title || 'Studio Course',
      unitIdx: newMaterial.unitIdx !== 'all' ? Number(newMaterial.unitIdx) : undefined,
    };
    if (editingMaterialId) {
      updateMaterial(editingMaterialId, payload);
    } else {
      addMaterial(payload);
    }
    setShowUploadModal(false);
    setEditingMaterialId(null);
    setNewMaterial(emptyMaterial);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1">
            Resource Library
          </span>
          <h2 className="text-2xl font-bold text-charcoal font-heading">
            Learning Materials & Lecture Notes
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Access slides, reference manuals, source code, and video masterclasses
          </p>
        </div>

        {isTeacherOrAdmin && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload New Material</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search material titles or topics..."
            className="w-full bg-white border border-charcoal/15 rounded-xl pl-10 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>

        {/* Course & Type Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="bg-white border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none"
          >
            <option value="all">{isTeacher ? 'All My Assigned Courses' : 'All Courses'}</option>
            {availableCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none"
          >
            <option value="all">All File Types</option>
            <option value="pdf">PDF Documents</option>
            <option value="slides">Slide Decks</option>
            <option value="video">Videos</option>
            <option value="image">Illustrations / Images</option>
            <option value="code">Code Repositories</option>
          </select>
        </div>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaterials.map((mat) => {
          const isStudent = currentUser?.role === 'student';
          const isEnrolled = !currentUser || !isStudent || (currentUser.enrolledCourseIds || []).includes(mat.courseId);
          const targetCourse = courses.find((c) => c.id === mat.courseId);

          const courseMats = materials.filter((m) => m.courseId === mat.courseId);
          const mIdx = courseMats.findIndex((m) => m.id === mat.id);
          const matUnitIdx =
            mat.unitIdx !== undefined && mat.unitIdx !== null && mat.unitIdx !== 'all'
              ? Number(mat.unitIdx)
              : (mIdx >= 0 ? mIdx % (targetCourse?.syllabus?.length || 1) : 0);

          const unitUnlocked = !isStudent || !isEnrolled ? false : (isUnitUnlocked ? isUnitUnlocked(targetCourse, matUnitIdx, currentUser) : true);
          const isAccessible = !isStudent || (isEnrolled && unitUnlocked);
          const isViewed = (viewedMaterialIds || []).includes(mat.id);

          return (
            <div
              key={mat.id}
              className={`bg-white rounded-3xl p-5 border border-charcoal/10 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow ${
                !isAccessible && isStudent ? 'opacity-70' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-2xl border border-charcoal/10 flex items-center justify-center shrink-0 ${
                      isAccessible ? 'bg-cream text-forest' : 'bg-charcoal/5 text-charcoal-muted'
                    }`}>
                      {getTypeIcon(mat.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-forest">
                          {mat.courseTitle}
                        </span>
                        {isStudent && !isEnrolled && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Enroll Required
                          </span>
                        )}
                        {isStudent && isEnrolled && !unitUnlocked && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Locked (Prereq Required)
                          </span>
                        )}
                        {isStudent && isAccessible && isViewed && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Viewed
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-charcoal font-heading mt-0.5 line-clamp-1">
                        {mat.title}
                      </h4>
                      <p className="text-[11px] text-charcoal-muted mt-1 leading-snug line-clamp-2">
                        {mat.description}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cream border border-charcoal/10 text-charcoal uppercase tracking-wider">
                    {mat.type}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-3 border-t border-charcoal/10 flex items-center justify-between text-xs">
                <span className="text-charcoal-muted text-[11px]">
                  {mat.size} • Uploaded {mat.uploadDate}
                </span>

                <div className="flex items-center gap-2">
                  {isTeacherOrAdmin && (
                    <>
                      <button
                        onClick={() => {
                          setEditingMaterialId(mat.id);
                          setNewMaterial({
                            courseId: mat.courseId || '',
                            unitIdx: mat.unitIdx !== undefined ? mat.unitIdx : 'all',
                            title: mat.title || '',
                            description: mat.description || '',
                            file:
                              mat.downloadUrl && mat.downloadUrl !== '#'
                                ? { name: mat.fileName || mat.title, size: mat.size, type: mat.type, url: mat.downloadUrl }
                                : null,
                          });
                          setShowUploadModal(true);
                        }}
                        className="p-1.5 text-charcoal-muted hover:text-forest rounded-lg transition-colors cursor-pointer"
                        title="Edit Resource"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${mat.title}?`)) deleteMaterial(mat.id);
                        }}
                        className="p-1.5 text-charcoal-muted hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {isStudent && !isAccessible ? (
                    <button
                      onClick={() => {
                        if (!isEnrolled) {
                          addToast('Please enroll in this course first to access its learning materials.', 'warning');
                        } else {
                          addToast('This material is locked. Complete previous unit prerequisites to unlock.', 'warning');
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-charcoal/10 text-charcoal-muted text-xs font-bold flex items-center gap-1.5 cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (isStudent && markMaterialAsViewed) {
                          markMaterialAsViewed(mat.id);
                        }
                        if (downloadFile(mat.downloadUrl, mat.fileName || mat.title)) {
                          addToast(`Downloaded "${mat.title}"`, 'success');
                        } else {
                          addToast('No file has been uploaded for this material yet.', 'warning');
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isViewed ? 'Download Again' : 'Download'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Material Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-charcoal/15 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-charcoal/10">
              <h3 className="text-base font-bold font-heading text-charcoal">
                {editingMaterialId ? 'Edit Learning Resource' : 'Upload New Learning Material'}
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setEditingMaterialId(null);
                }}
                className="p-1 rounded-full text-charcoal-muted hover:text-charcoal cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Target Course
                </label>
                <select
                  required
                  value={newMaterial.courseId}
                  onChange={(e) => setNewMaterial({ ...newMaterial, courseId: e.target.value, unitIdx: 'all' })}
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 font-semibold"
                >
                  <option value="" disabled>Select a course</option>
                  {availableCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Target Course Unit (Optional)
                </label>
                <select
                  value={newMaterial.unitIdx}
                  onChange={(e) => setNewMaterial({ ...newMaterial, unitIdx: e.target.value })}
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                >
                  <option value="all">All Units (Course-wide Resource)</option>
                  {(availableCourses.find((c) => c.id === newMaterial.courseId)?.syllabus || []).map(
                    (u, uIdx) => (
                      <option key={uIdx} value={uIdx}>
                        {u.unit || `Unit ${uIdx + 1}`}: {u.title}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Material Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4: Kinetic Typography & Grid Rhythms"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  File (PDF, video or image) <span className="text-red-500">*</span>
                </label>
                <label className="border-2 border-dashed border-charcoal/20 hover:border-forest/50 rounded-2xl p-5 text-center bg-cream/20 hover:bg-cream/40 transition-all cursor-pointer block">
                  <input
                    type="file"
                    accept=".pdf,application/pdf,video/*,image/*"
                    onChange={handleMaterialFileChange}
                    className="hidden"
                  />
                  <p className="text-xs font-bold text-charcoal">Click to choose a file to upload</p>
                  <p className="text-[11px] text-charcoal-muted mt-1">PDF, video or image, up to 7 MB</p>
                </label>
                {newMaterial.file && (
                  <div className="mt-2.5 flex items-center justify-between p-3 rounded-xl bg-forest/5 border border-forest/20">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-charcoal truncate">{newMaterial.file.name}</p>
                      <p className="text-[10px] text-charcoal-muted">{newMaterial.file.size}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewMaterial((prev) => ({ ...prev, file: null }))}
                      className="p-1 text-charcoal-muted hover:text-red-600 cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Description / Study Guidelines
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain reading objectives, required page sections, or prerequisites..."
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setEditingMaterialId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal-muted hover:text-charcoal cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 cursor-pointer"
                >
                  {editingMaterialId ? 'Save Resource Changes' : 'Confirm & Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
