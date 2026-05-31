import { getToppers } from '@/lib/api/toppers';
import ToppersManagerClient from '@/components/toppers-manager-client';

export const revalidate = 0; // Fetch fresh data on every request

export default async function AdminToppersPage() {
  // Fetch active toppers (Supabase primary, local fallback secondary)
  const result = await getToppers();

  // Safe deep copy to remove non-serializable objects and prevent RSC nesting errors
  const sanitizedToppers = JSON.parse(JSON.stringify(result.data || []));

  return (
    <div className="w-full">
      <ToppersManagerClient initialToppers={sanitizedToppers} />
    </div>
  );
}

