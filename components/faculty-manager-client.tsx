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
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  UserPlus,
  AlertCircle,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import { createFacultyAction, updateFacultyAction, deleteFacultyAction } from '@/app/actions/faculty';
import { uploadImageAction } from '@/app/actions/upload';
import { Faculty } from '@/lib/api/faculty';

interface FacultyManagerClientProps {
  initialFaculty: Faculty[];
}

export default function FacultyManagerClient({ initialFaculty }: FacultyManagerClientProps) {
  const [facultyList, setFacultyList] = useState<Faculty[]>(initialFaculty);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [experience, setExperience] = useState<number>(5);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [role, setRole] = useState('Senior Faculty');
  const [subject, setSubject] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [order, setOrder] = useState<number>(0);

  // UI States
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [showFormModal, setShowFormModal] = useState(false);

  const router = useRouter();

  // Reset form helper
  const resetForm = () => {
    setName('');
    setExperience(5);
    setDescription('');
    setImageUrl('');
    setRole('Senior Faculty');
    setSubject('');
    setIsOwner(false);
    setOrder(0);
    setErrors({});
    setCurrentId(null);
    setIsEditing(false);
  };

  // Open Form for Creation
  const handleAddClick = () => {
    resetForm();
    setShowFormModal(true);
  };

  // Open Form for Editing
  const handleEditClick = (faculty: Faculty) => {
    resetForm();
    setCurrentId(faculty._id);
    setName(faculty.name);
    
    // Parse experience number safely
    const expNum = parseInt(faculty.experience.replace(/[^0-9]/g, ''), 10);
    setExperience(isNaN(expNum) ? 0 : expNum);
    
    setDescription(faculty.description || '');
    setImageUrl(faculty.image);
    setRole(faculty.role);
    setSubject(faculty.subject);
    setIsOwner(faculty.isOwner);
    setOrder(faculty.order);
    
    setIsEditing(true);
    setShowFormModal(true);
  };

  // Handle Image Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: png/jpg/jpeg only
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      toast.error('Unsupported file format. Only PNG, JPG, and JPEG images are allowed.');
      return;
    }

    // Validate size: 10MB
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error('File too large. Maximum size is 10 MB.');
      return;
    }

    setUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        const res = await uploadImageAction(base64String, file.name, file.type, file.size);
        
        if (res.success && res.url) {
          setImageUrl(res.url);
          toast.success('Profile picture uploaded successfully!');
        } else {
          toast.error(res.message || 'Image upload failed. Please try again.');
        }
        setUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      toast.error('Error processing file. Please try again.');
      setUploading(false);
    }
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!imageUrl) {
      setErrors({ image_url: ['Profile picture is required. Please upload an image first.'] });
      toast.error('Please upload a profile picture.');
      return;
    }

    setSaving(true);

    const payload = {
      name,
      experience,
      description,
      image_url: imageUrl,
      role,
      subject,
      isOwner,
      order,
    };

    try {
      let res;
      if (isEditing && currentId) {
        res = await updateFacultyAction(currentId, payload);
      } else {
        res = await createFacultyAction(payload);
      }

      if (res.success) {
        toast.success(
          isEditing
            ? 'Faculty member details updated successfully!'
            : 'New faculty member registered successfully!'
        );
        setShowFormModal(false);
        resetForm();
        
        // Refresh router data
        router.refresh();
        
        // Optimistically reload locally or let SSR handle it
        window.location.reload();
      } else if (res.errors) {
        setErrors(res.errors);
        toast.error('Validation failed. Please correct form entries.');
      } else {
        toast.error(res.message || 'An error occurred saving records.');
      }
    } catch (err) {
      toast.error('Network connection error. Server action failed.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Action
  const handleDeleteClick = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from your faculty registry?`)) {
      return;
    }

    const toastId = toast.loading(`Removing ${name}...`);

    try {
      const res = await deleteFacultyAction(id);
      
      if (res.success) {
        toast.success(`${name} has been removed successfully.`, { id: toastId });
        
        // Optimistically update list
        setFacultyList(facultyList.filter((f) => f._id !== id));
        router.refresh();
      } else {
        toast.error(res.message || 'Failed to remove faculty member.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error removing records.', { id: toastId });
    }
  };

  return (
    <div className="space-y-8 selection:bg-red-600 selection:text-white">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wider">Faculty Directory</h1>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1.5">
            Add, update, or remove active teachers and lecturers
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs transition-colors rounded-none cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4 text-white" /> Register Faculty
        </button>
      </div>

      {/* Grid List */}
      {facultyList.length === 0 ? (
        <div className="bg-zinc-900/30 border border-zinc-800 p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-650">
            <UserPlus className="w-8 h-8 text-zinc-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-300">
              No Faculty Registered
            </h3>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
              Your database has zero faculty members. Click the register button to enroll your first teacher.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultyList.map((faculty) => (
            <div
              key={faculty._id}
              className="bg-zinc-900 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition-all relative overflow-hidden"
            >
              {faculty.isOwner && (
                <div className="absolute top-3 right-3 z-10 px-2 py-0.5 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-current" /> Director
                </div>
              )}
              
              {/* Photo & Identity */}
              <div className="p-5 flex gap-4 border-b border-zinc-800">
                <div className="relative w-20 h-20 bg-zinc-950 border border-zinc-800 overflow-hidden flex-shrink-0">
                  {faculty.image ? (
                    <img
                      src={faculty.image}
                      alt={faculty.name}
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
                    {faculty.name}
                  </h3>
                  <p className="text-xs text-red-500 font-bold uppercase tracking-wider">
                    {faculty.role}
                  </p>
                  <p className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider line-clamp-1">
                    {faculty.subject ? `Subject: ${faculty.subject}` : 'General Faculty'}
                  </p>
                </div>
              </div>

              {/* Bio & experience */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 bg-zinc-950/80 px-2.5 py-1.5 border border-zinc-800 inline-block">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      Experience:
                    </span>
                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">
                      {faculty.experience}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-450 leading-relaxed line-clamp-3">
                    {faculty.description || 'No descriptive bio provided.'}
                  </p>
                </div>

                {/* Operations Buttons */}
                <div className="flex gap-3 border-t border-zinc-850 mt-5 pt-4">
                  <button
                    onClick={() => handleEditClick(faculty)}
                    className="flex-1 py-2 border border-zinc-700 hover:border-white text-white font-bold uppercase tracking-wider text-[10px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer rounded-none"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Profile
                  </button>
                  <button
                    onClick={() => handleDeleteClick(faculty._id, faculty.name)}
                    className="py-2 px-3 border border-red-950 text-red-500 hover:bg-red-950/20 hover:border-red-800 transition-colors flex items-center justify-center cursor-pointer rounded-none"
                    aria-label={`Delete ${faculty.name}`}
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
          {/* Backdrop */}
          <div
            onClick={() => !saving && setShowFormModal(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Form Card */}
          <div className="relative bg-zinc-900 border border-zinc-800 max-w-xl w-full p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black uppercase tracking-wider">
                {isEditing ? 'Modify Faculty Details' : 'Register New Faculty'}
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
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="form-name" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Teacher Name
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Prof. Kumar"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-red-600 focus:outline-none transition-colors rounded-none"
                  />
                  {errors.name && (
                    <p className="text-[10px] font-medium text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-red-500" /> {errors.name[0]}
                    </p>
                  )}
                </div>

                {/* Experience */}
                <div className="space-y-1.5">
                  <label htmlFor="form-exp" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Years of Experience (0-70)
                  </label>
                  <input
                    id="form-exp"
                    type="number"
                    required
                    min={0}
                    max={70}
                    value={experience}
                    onChange={(e) => setExperience(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-red-600 focus:outline-none transition-colors rounded-none"
                  />
                  {errors.experience && (
                    <p className="text-[10px] font-medium text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-red-500" /> {errors.experience[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="form-desc" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Teacher Bio / Description (Max 20 words)
                </label>
                <textarea
                  id="form-desc"
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize their academic qualifications, passion, and accomplishments..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-red-600 focus:outline-none transition-colors rounded-none resize-none"
                />
                <div className="flex justify-between items-center text-[9px] text-zinc-550">
                  <span>Words: {description.trim().split(/\s+/).filter(Boolean).length} / 20</span>
                  {errors.description && (
                    <span className="font-medium text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5 text-red-500" /> {errors.description[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* Photo Uploader */}
              <div className="space-y-2 border-t border-zinc-800 pt-4">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Profile Picture Upload (PNG/JPG max 10MB)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Photo preview */}
                  <div className="relative w-24 h-24 bg-zinc-950 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Profile Preview"
                        className="absolute inset-0 w-full h-full object-cover object-top"
                      />
                    ) : (
                      <ImageIcon className="w-7 h-7 text-zinc-750" />
                    )}
                  </div>

                  {/* Dropzone */}
                  <div className="flex-1 w-full relative">
                    <input
                      id="upload-file"
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
                  className="flex-1 py-3 border border-zinc-700 hover:border-white text-white font-bold uppercase tracking-wider text-xs transition-colors rounded-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs transition-colors rounded-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
