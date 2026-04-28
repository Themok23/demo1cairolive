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
  const active = subscribers.filter((s) => s.isActive).length;
  const inactive = subscribers.length - active;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Subscribers</h1>
        <p className="text-text-secondary text-sm mt-1">Manage email subscribers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-surface-elevated border border-gold/10 p-5">
          <p className="text-text-secondary text-xs uppercase tracking-wide font-medium mb-2">Total</p>
          <p className="text-3xl font-bold text-text-primary">{subscribers.length}</p>
        </div>
        <div className="rounded-xl bg-surface-elevated border border-gold/10 p-5">
          <p className="text-text-secondary text-xs uppercase tracking-wide font-medium mb-2">Active</p>
          <p className="text-3xl font-bold text-green-400">{active}</p>
        </div>
        <div className="rounded-xl bg-surface-elevated border border-gold/10 p-5">
          <p className="text-text-secondary text-xs uppercase tracking-wide font-medium mb-2">Inactive</p>
          <p className="text-3xl font-bold text-red-400">{inactive}</p>
        </div>
      </div>

      {subscribers.length > 0 ? (
        <div className="rounded-xl bg-surface-elevated border border-gold/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/10 bg-surface">
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Email</th>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Name</th>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium text-xs uppercase tracking-wide">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr
                    key={subscriber.id}
                    className="border-b border-gold/5 hover:bg-surface-elevated/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="text-text-primary font-medium">{subscriber.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-text-secondary text-sm">
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
                      <p className="text-text-secondary text-sm">
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
        <div className="rounded-xl bg-surface-elevated border border-gold/10 p-12 text-center">
          <p className="text-text-secondary">No subscribers yet</p>
        </div>
      )}
    </div>
  );
}
