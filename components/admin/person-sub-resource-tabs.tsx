'use client';

import { useState } from 'react';
import PersonForm from './person-form';
import PersonEducationTab from './person-education-tab';
import PersonWorkplacesTab from './person-workplaces-tab';
import PersonAchievementsTab from './person-achievements-tab';
import PersonServicesTab from './person-services-tab';
import PersonProductsTab from './person-products-tab';

type Tab = 'basic' | 'education' | 'workplaces' | 'achievements' | 'services' | 'products';

const TABS: { id: Tab; label: string }[] = [
  { id: 'basic',        label: 'Basic Info' },
  { id: 'education',    label: 'Education' },
  { id: 'workplaces',   label: 'Workplaces' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'services',     label: 'Services' },
  { id: 'products',     label: 'Products' },
];

interface Props {
  personId: string;
  initialData: Parameters<typeof PersonForm>[0]['initialData'];
}

export default function PersonSubResourceTabs({ personId, initialData }: Props) {
  const [active, setActive] = useState<Tab>('basic');

  return (
    <div className="space-y-6">
      <div className="flex gap-1 border-b border-gold/10 overflow-x-auto">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              active === id
                ? 'border-gold text-gold'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {active === 'basic'        && <PersonForm initialData={initialData} />}
      {active === 'education'    && <PersonEducationTab personId={personId} />}
      {active === 'workplaces'   && <PersonWorkplacesTab personId={personId} />}
      {active === 'achievements' && <PersonAchievementsTab personId={personId} />}
      {active === 'services'     && <PersonServicesTab personId={personId} />}
      {active === 'products'     && <PersonProductsTab personId={personId} />}
    </div>
  );
}
