import { z } from 'zod';

// Helper to validate word count limit
const maxWords = (limit: number) => {
  return (val: string) => {
    if (!val) return true;
    const words = val.trim().split(/\s+/).filter(Boolean);
    return words.length <= limit;
  };
};

// Faculty Validation Schema
export const facultySchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  experience: z.preprocess(
    (val) => {
      if (typeof val === 'string' && val.trim() !== '') {
        const parsed = parseInt(val.replace(/[^0-9]/g, ''), 10);
        return isNaN(parsed) ? val : parsed;
      }
      return val;
    },
    z.number({ invalid_type_error: 'Experience must be a number' })
      .min(0, 'Experience must be at least 0')
      .max(70, 'Experience cannot exceed 70')
  ),
  description: z.string()
    .min(1, 'Description is required')
    .refine(maxWords(20), {
      message: 'Description cannot exceed 20 words',
    }),
  image_url: z.string()
    .min(1, 'Image is required')
    .url('Must be a valid URL'),
});

// Toppers Validation Schema
export const topperSchema = z.object({
  student_name: z.string()
    .min(1, 'Student name is required')
    .refine(maxWords(10), {
      message: 'Student name cannot exceed 10 words',
    }),
  percentage: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const cleaned = val.replace('%', '').trim();
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? val : parsed;
      }
      return val;
    },
    z.number({ invalid_type_error: 'Percentage must be a number' })
      .min(0, 'Percentage must be at least 0')
      .max(100, 'Percentage cannot exceed 100')
  ),
  academic_year: z.string().min(1, 'Academic year is required'),
  image_url: z.string()
    .min(1, 'Image is required')
    .url('Must be a valid URL'),
});

export type FacultyInput = z.infer<typeof facultySchema>;
export type TopperInput = z.infer<typeof topperSchema>;

