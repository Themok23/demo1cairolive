'use client';

import { Users, FileText, MessageSquare, Mail } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface DashboardProps {
  stats: {
    totalPeople: number;
    totalArticles: number;
    totalSubmissions: number;
    totalSubscribers: number;
  };
  recentSubmissions: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    submittedAt: Date;
  }>;
  locale: string;
}

export default function AdminDashboard({ stats, recentSubmissions, locale }: DashboardProps) {
  const statCards = [
    {
      title: 'Total People',
      value: stats.totalPeople,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
    },
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      icon: FileText,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
    },
    {
      title: 'Submissions',
      value: stats.totalSubmissions,
      icon: MessageSquare,
      color: 'text-amber-400',
      bgColor: 'bg-amber-900/20',
    },
    {
      title: 'Subscribers',
      value: stats.totalSubscribers,
      icon: Mail,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to the Cairo Live admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ title, value, icon: Icon, color, bgColor }) => (
          <div
            key={title}
            className="rounded-lg bg-[#1a1a1f] border border-[#D4A853]/10 p-6 hover:border-[#D4A853]/20 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-gray-400 font-medium text-sm">{title}</h3>
              <div className={`p-3 rounded-lg ${bgColor}`}>
                <Icon className={`${color}`} size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Submissions */}
      <div className="rounded-lg bg-[#1a1a1f] border border-[#D4A853]/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Submissions</h2>
          <Link
            href={`/${locale}/admin/submissions`}
            className="text-[#D4A853] hover:text-[#e8b967] text-sm font-medium"
          >
            View All
          </Link>
        </div>

        {recentSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D4A853]/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Name</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Email</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="border-b border-[#D4A853]/5 hover:bg-[#2a2a2f]/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="text-white font-medium">
                        {submission.firstName} {submission.lastName}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-400 text-sm">{submission.email}</p>
                    </td>
                    <td className="py-4 px-4">
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
                    <td className="py-4 px-4">
                      <p className="text-gray-400 text-sm">
                        {formatDistanceToNow(new Date(submission.submittedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No submissions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
