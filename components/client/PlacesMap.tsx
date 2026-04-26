'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

export interface PlaceMapPin {
  id: string;
  slug: string;
  pillarSlug: string;
  pillarColor: string;
  type: string;
  nameEn: string;
  nameAr: string | null;
  taglineEn: string | null;
  taglineAr: string | null;
  coverImageUrl: string | null;
  latitude: number;
  longitude: number;
}

interface PlacesMapProps {
  places: PlaceMapPin[];
  locale: string;
}

/** Build a colored circle SVG icon for each pillar. Avoids the broken default
 *  Leaflet icon URLs that webpack/Next.js have trouble bundling. */
function buildIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: 'd1cl-pin',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `
      <div style="
        width:28px;height:28px;border-radius:50%;
        background:${color};
        border:3px solid white;
        box-shadow:0 4px 12px rgba(0,0,0,0.4);
      "></div>
    `,
  });
}

/** Re-fits the map to show all pins whenever they change. */
function FitToPins({ places }: { places: PlaceMapPin[] }) {
  const map = useMap();
  useEffect(() => {
    if (places.length === 0) return;
    if (places.length === 1) {
      map.setView([places[0].latitude, places[0].longitude], 14);
      return;
    }
    const bounds = L.latLngBounds(places.map((p) => [p.latitude, p.longitude]));
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [places, map]);
  return null;
}

export default function PlacesMap({ places, locale }: PlacesMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // avoid SSR mismatch — Leaflet needs window
  const isAr = locale === 'ar';

  return (
    <MapContainer
      center={[30.0444, 31.2357] as [number, number]} // Cairo center
      zoom={11}
      scrollWheelZoom
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitToPins places={places} />
      {places.map((p) => {
        const name = isAr && p.nameAr ? p.nameAr : p.nameEn;
        const tagline = isAr && p.taglineAr ? p.taglineAr : p.taglineEn;
        return (
          <Marker
            key={p.id}
            position={[p.latitude, p.longitude]}
            icon={buildIcon(p.pillarColor)}
          >
            <Popup>
              <div style={{ minWidth: 200 }}>
                {p.coverImageUrl && (
                  <img
                    src={p.coverImageUrl}
                    alt={name}
                    style={{
                      width: '100%',
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 6,
                      marginBottom: 8,
                    }}
                  />
                )}
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }} lang={locale}>
                  {name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#888',
                    marginBottom: 6,
                  }}
                >
                  {p.type}
                </div>
                {tagline && (
                  <p
                    style={{ fontSize: 12, color: '#444', margin: '4px 0 8px' }}
                    lang={locale}
                  >
                    {tagline}
                  </p>
                )}
                <Link
                  href={`/${locale}/pillars/${p.pillarSlug}/${p.slug}` as any}
                  style={{
                    display: 'inline-block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#D4A853',
                    textDecoration: 'none',
                  }}
                >
                  {isAr ? 'افتح الصفحة ←' : 'Open page →'}
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
