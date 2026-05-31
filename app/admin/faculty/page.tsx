import { getFaculty } from '@/lib/api/faculty';
import FacultyManagerClient from '@/components/faculty-manager-client';

export const revalidate = 0; // Fetch fresh data on every request

export default async function AdminFacultyPage() {
  // Fetch active faculty (Supabase primary, local fallback secondary)
  const result = await getFaculty();
  
  // Safe deep copy to remove non-serializable objects and prevent RSC nesting errors
  const sanitizedFaculty = JSON.parse(JSON.stringify(result.data || []));

  return (
    <div className="w-full">
      <FacultyManagerClient initialFaculty={sanitizedFaculty} />
    </div>
  );
}

