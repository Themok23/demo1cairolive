'use client';

// Client-side wrapper that dynamically imports the Leaflet map.
// Leaflet touches `window`, so it must be loaded with ssr:false.
// Next.js 16 only allows ssr:false in Client Components, hence this wrapper.

import dynamic from 'next/dynamic';
import type { PlaceMapPin } from './PlacesMap';

const PlacesMap = dynamic(() => import('./PlacesMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-surface-elevated rounded-xl text-text-secondary">
      Loading map...
    </div>
  ),
});

interface PlacesMapEmbedProps {
  places: PlaceMapPin[];
  locale: string;
}

export default function PlacesMapEmbed({ places, locale }: PlacesMapEmbedProps) {
  return <PlacesMap places={places} locale={locale} />;
}
