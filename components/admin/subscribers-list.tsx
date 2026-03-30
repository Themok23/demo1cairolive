'use client';

interface Subscriber {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  subscribedAt: Date;
}

interface SubscribersListProps {
  subscribers: Subscriber[];
}

export default function AdminSubscribersList({ subscribers }: SubscribersListProps) {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Subscribers</h1>
        <p className="text-gray-400">Manage email subscribers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg bg-[#1a1a1f] border border-[#D4A853]/10 p-6">
          <p className="text-gray-400 text-sm mb-2">Total Subscribers</p>
          <p className="text-3xl font-bold text-white">{subscribers.length}</p>
        </div>
        <div className="rounded-lg bg-[#1a1a1f] border border-[#D4A853]/10 p-6">
          <p className="text-gray-400 text-sm mb-2">Active</p>
          <p className="text-3xl font-bold text-green-400">
            {subscribers.filter((s) => s.isActive).length}
          </p>
        </div>
        <div className="rounded-lg bg-[#1a1a1f] border border-[#D4A853]/10 p-6">
          <p className="text-gray-400 text-sm mb-2">Inactive</p>
          <p className="text-3xl font-bold text-red-400">
            {subscribers.filter((s) => !s.isActive).length}
          </p>
        </div>
      </div>

      {/* Table */}
      {subscribers.length > 0 ? (
        <div className="rounded-lg bg-[#1a1a1f] border border-[#D4A853]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D4A853]/10 bg-[#0a0a0f]">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Email</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Name</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">
                    Subscribed
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr
                    key={subscriber.id}
                    className="border-b border-[#D4A853]/5 hover:bg-[#2a2a2f]/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="text-white font-medium">{subscriber.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-400 text-sm">
                        {subscriber.firstName || subscriber.lastName
                          ? `${subscriber.firstName || ''} ${subscriber.lastName || ''}`.trim()
                          : '-'}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          subscriber.isActive
                            ? 'bg-green-900/30 text-green-400 border border-green-700/30'
                            : 'bg-red-900/30 text-red-400 border border-red-700/30'
                        }`}
                      >
                        {subscriber.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-400 text-sm">
                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-[#1a1a1f] border border-[#D4A853]/10 p-12 text-center">
          <p className="text-gray-400">No subscribers yet</p>
        </div>
      )}
    </div>
  );
}
