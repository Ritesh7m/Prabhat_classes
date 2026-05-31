'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Loader2,
  Image as ImageIcon,
  UserPlus,
  AlertCircle,
  GraduationCap,
  Calendar,
} from 'lucide-react';
import Image from 'next/image';
import { createTopperAction, updateTopperAction, deleteTopperAction } from '@/app/actions/toppers';
import { uploadImageAction } from '@/app/actions/upload';
import { Topper } from '@/lib/api/toppers';

interface ToppersManagerClientProps {
  initialToppers: Topper[];
}

export default function ToppersManagerClient({ initialToppers }: ToppersManagerClientProps) {
  const [toppersList, setToppersList] = useState<Topper[]>(initialToppers);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [percentage, setPercentage] = useState<string>('');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [imageUrl, setImageUrl] = useState('');
  const [rank, setRank] = useState<number>(1);
  const [attendanceRecord, setAttendanceRecord] = useState('95%');
  const [batch, setBatch] = useState('English Medium');

  // UI States
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [showFormModal, setShowFormModal] = useState(false);

  const router = useRouter();

  const years = ['2026-2027', '2024-2025'];
  const batches = ['English Medium', 'Hindi Medium'];

  const resetForm = () => {
    setStudentName('');
    setPercentage('');
    setAcademicYear('2026-2027');
    setImageUrl('');
    setRank(1);
    setAttendanceRecord('95%');
    setBatch('English Medium');
    setErrors({});
    setCurrentId(null);
    setIsEditing(false);
  };

  const handleAddClick = () => {
    resetForm();
    setShowFormModal(true);
  };

  const handleEditClick = (topper: Topper) => {
    resetForm();
    setCurrentId(topper._id);
    setStudentName(topper.name);
    setPercentage(topper.percentage.replace('%', '').trim());
    setAcademicYear(topper.year);
    setImageUrl(topper.image);
    setRank(topper.rank || 1);
    setAttendanceRecord(topper.attendanceRecord || '95%');
    setBatch(topper.batch || 'English Medium');

    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      toast.error('Unsupported file format. Only PNG, JPG, and JPEG images are allowed.');
      return;
    }

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error('File too large. Maximum size is 10 MB.');
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const res = await uploadImageAction(base64String, file.name, file.type, file.size);

        if (res.success && res.url) {
          setImageUrl(res.url);
          toast.success('Topper photo uploaded successfully!');
        } else {
          toast.error(res.message || 'Image upload failed.');
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      toast.error('Error processing file.');
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!imageUrl) {
      setErrors({ image_url: ['Student picture is required. Please upload an image first.'] });
      toast.error('Please upload student picture.');
      return;
    }

    setSaving(true);

    const payload = {
      student_name: studentName,
      percentage,
      academic_year: academicYear,
      image_url: imageUrl,
      rank,
      attendanceRecord,
      batch,
    };

    try {
      let res;
      if (isEditing && currentId) {
        res = await updateTopperAction(currentId, payload);
      } else {
        res = await createTopperAction(payload);
      }

      if (res.success) {
        toast.success(
          isEditing ? 'Topper details updated successfully!' : 'Topper registered successfully!'
        );
        setShowFormModal(false);
        resetForm();
        router.refresh();
        window.location.reload();
      } else if (res.errors) {
        setErrors(res.errors);
        toast.error('Validation failed. Please correct form entries.');
      } else {
        toast.error(res.message || 'An error occurred saving records.');
      }
    } catch (err) {
      toast.error('Network connection error.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from your toppers registry?`)) {
      return;
    }

    const toastId = toast.loading(`Removing ${name}...`);

    try {
      const res = await deleteTopperAction(id);

      if (res.success) {
        toast.success(`${name} has been removed successfully.`, { id: toastId });
        setToppersList(toppersList.filter((t) => t._id !== id));
        router.refresh();
      } else {
        toast.error(res.message || 'Failed to remove topper.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error.', { id: toastId });
    }
  };

  return (
    <div className="space-y-8 selection:bg-red-600 selection:text-white">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wider">Board Toppers</h1>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1.5">
            Add, update, or remove school board superstars
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs transition-colors rounded-none cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4 text-white" /> Register Topper
        </button>
      </div>

      {/* Grid List */}
      {toppersList.length === 0 ? (
        <div className="bg-zinc-900/30 border border-zinc-800 p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-650">
            <GraduationCap className="w-8 h-8 text-zinc-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-300">
              No Toppers Registered
            </h3>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
              Your database has zero topper profiles. Click register to enroll your first board superstar.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toppersList.map((topper) => (
            <div
              key={topper._id}
              className="bg-zinc-900 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition-all relative overflow-hidden"
            >
              <div className="absolute top-3 right-3 z-10 px-2 py-0.5 bg-red-650 text-white text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" /> {topper.year}
              </div>

              {/* Photo & Identity */}
              <div className="p-5 flex gap-4 border-b border-zinc-800">
                <div className="relative w-20 h-20 bg-zinc-950 border border-zinc-800 overflow-hidden flex-shrink-0">
                  {topper.image ? (
                    <img
                      src={topper.image}
                      alt={topper.name}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <ImageIcon className="w-6 h-6 text-zinc-500" />
                    </div>
                  )}
                </div>
                <div className="space-y-1 justify-center flex flex-col">
                  <h3 className="font-black text-sm uppercase tracking-wide leading-tight line-clamp-1">
                    {topper.name}
                  </h3>
                  <p className="text-xs text-red-500 font-bold uppercase tracking-wider">
                    Score: {topper.percentage}
                  </p>
                  <p className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">
                    Rank: #{topper.rank || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Info Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-3 bg-zinc-950/80 p-3 border border-zinc-800">
                  <div>
                    <span className="block text-[8px] text-zinc-500 font-black uppercase tracking-wider">
                      Batch Medium
                    </span>
                    <span className="block text-[10px] text-white font-bold uppercase tracking-wider mt-0.5">
                      {topper.batch || 'English'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-zinc-500 font-black uppercase tracking-wider">
                      Attendance
                    </span>
                    <span className="block text-[10px] text-white font-bold uppercase tracking-wider mt-0.5">
                      {topper.attendanceRecord || '95%'}
                    </span>
                  </div>
                </div>

                {/* Operations Buttons */}
                <div className="flex gap-3 border-t border-zinc-850 mt-5 pt-4">
                  <button
                    onClick={() => handleEditClick(topper)}
                    className="flex-1 py-2 border border-zinc-700 hover:border-white text-white font-bold uppercase tracking-wider text-[10px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer rounded-none"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Profile
                  </button>
                  <button
                    onClick={() => handleDeleteClick(topper._id, topper.name)}
                    className="py-2 px-3 border border-red-950 text-red-500 hover:bg-red-950/20 hover:border-red-800 transition-colors flex items-center justify-center cursor-pointer rounded-none"
                    aria-label={`Delete ${topper.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => !saving && setShowFormModal(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative bg-zinc-900 border border-zinc-800 max-w-xl w-full p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black uppercase tracking-wider">
                {isEditing ? 'Modify Topper Details' : 'Register New Topper'}
              </h2>
              <button
                disabled={saving}
                onClick={() => setShowFormModal(false)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Student Name */}
                <div className="space-y-1.5">
                  <label htmlFor="form-student" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Student Name (Max 10 words)
                  </label>
                  <input
                    id="form-student"
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Suhani Pandey"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-red-600 focus:outline-none transition-colors rounded-none"
                  />
                  <div className="flex justify-between items-center mt-1 text-[8px] text-zinc-550">
                    <span>Words: {studentName.trim().split(/\s+/).filter(Boolean).length} / 10</span>
                    {errors.student_name && (
                      <span className="font-medium text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5 text-red-500" /> {errors.student_name[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Percentage */}
                <div className="space-y-1.5">
                  <label htmlFor="form-pct" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Score Percentage (0-100)
                  </label>
                  <input
                    id="form-pct"
                    type="text"
                    required
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    placeholder="e.g. 94.40"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-red-600 focus:outline-none transition-colors rounded-none"
                  />
                  {errors.percentage && (
                    <p className="text-[10px] font-medium text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-red-500" /> {errors.percentage[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Academic Year */}
                <div className="space-y-1.5">
                  <label htmlFor="form-year" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Academic Year
                  </label>
                  <select
                    id="form-year"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-red-600 focus:outline-none transition-colors rounded-none cursor-pointer"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Photo Uploader */}
              <div className="space-y-2 border-t border-zinc-800 pt-4">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Student Photo Upload (PNG/JPG max 10MB)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-24 h-24 bg-zinc-950 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Student Preview"
                        className="absolute inset-0 w-full h-full object-cover object-top"
                      />
                    ) : (
                      <ImageIcon className="w-7 h-7 text-zinc-750" />
                    )}
                  </div>

                  <div className="flex-1 w-full relative">
                    <input
                      id="upload-topper-file"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleImageFileChange}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                      disabled={uploading || saving}
                    />
                    <div className="p-5 border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950 flex flex-col items-center justify-center text-center space-y-1.5 transition-colors">
                      {uploading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                          <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                            Uploading to Storage...
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-zinc-550" />
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                            Select Photo
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {errors.image_url && (
                  <p className="text-[10px] font-medium text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-red-500" /> {errors.image_url[0]}
                  </p>
                )}
              </div>

              {/* Form submit/cancel */}
              <div className="flex gap-4 border-t border-zinc-800 pt-6 mt-6">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setShowFormModal(false)}
                  className="flex-1 py-3 border border-zinc-700 hover:border-white text-white font-bold uppercase tracking-wider text-xs transition-colors rounded-none cursor-pointer disabled:opacity-30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs transition-colors rounded-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <span>Confirm Profile</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline fallback XCircle component
function XCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}
