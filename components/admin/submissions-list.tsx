'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';

interface Submission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  submittedAt: Date;
}

interface SubmissionsListProps {
  submissions: Submission[];
}

export default function AdminSubmissionsList({ submissions }: SubmissionsListProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setUpdating(id);
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to approve submission');
      }
    } catch (error) {
      alert('Error updating submission');
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (id: string) => {
    setUpdating(id);
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to reject submission');
      }
    } catch (error) {
      alert('Error updating submission');
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Submissions</h1>
        <p className="text-text-secondary text-sm mt-1">Review and manage user submissions</p>
      </div>

      {submissions.length > 0 ? (
        <div className="rounded-xl bg-surface-elevated border border-gold/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/10 bg-surface">
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Name</th>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Email</th>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Submitted</th>
                  <th className="text-right py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="border-b border-gold/5 hover:bg-surface-elevated/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="text-text-primary font-medium">
                        {submission.firstName} {submission.lastName}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-text-secondary text-sm">{submission.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          submission.status === 'pending'
                            ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/30'
                            : submission.status === 'approved'
                              ? 'bg-green-900/30 text-green-400 border border-green-700/30'
                              : 'bg-red-900/30 text-red-400 border border-red-700/30'
                        }`}
                      >
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-text-secondary text-sm">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        {submission.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(submission.id)}
                              disabled={updating === submission.id}
                              className="p-2 rounded-lg hover:bg-green-900/20 transition-colors text-green-400 disabled:opacity-50"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(submission.id)}
                              disabled={updating === submission.id}
                              className="p-2 rounded-lg hover:bg-red-900/20 transition-colors text-red-400 disabled:opacity-50"
                              title="Reject"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-surface-elevated border border-gold/10 p-12 text-center">
          <p className="text-text-secondary">No submissions yet</p>
        </div>
      )}
    </div>
  );
}
