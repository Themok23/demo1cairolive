'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Plain Leaflet (no react-leaflet) so React Strict Mode's double-invoke
// of effects in dev doesn't try to initialize the same DOM container twice.
// We always check "did we already init?" before creating a map and tear it
// down properly in the cleanup.
export default function PlacesMap({ places, locale }: PlacesMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const isAr = locale === 'ar';

  useEffect(() => {
    if (!containerRef.current) return;

    // Strict-mode guard: if a previous effect run already attached a map to
    // this container, tear it down before creating a new one.
    const containerEl = containerRef.current as any;
    if (containerEl._leaflet_id != null && mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    if (containerEl._leaflet_id != null) {
      // The container retains the leaflet id even after .remove() in some
      // edge cases. Reset so initialize() doesn't throw.
      delete containerEl._leaflet_id;
    }

    const map = L.map(containerRef.current, {
      center: [30.0444, 31.2357], // Cairo
      zoom: 11,
      scrollWheelZoom: true,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const markers: L.Marker[] = [];
    for (const p of places) {
      const icon = L.divIcon({
        className: 'd1cl-pin',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        html: `
          <div style="
            width:28px;height:28px;border-radius:50%;
            background:${p.pillarColor};
            border:3px solid white;
            box-shadow:0 4px 12px rgba(0,0,0,0.4);
          "></div>
        `,
      });
      const marker = L.marker([p.latitude, p.longitude], { icon }).addTo(map);

      const name = isAr && p.nameAr ? p.nameAr : p.nameEn;
      const tagline = isAr && p.taglineAr ? p.taglineAr : p.taglineEn;
      const linkLabel = isAr ? 'افتح الصفحة ←' : 'Open page →';

      const html = `
        <div style="min-width:200px">
          ${
            p.coverImageUrl
              ? `<img src="${escHtml(p.coverImageUrl)}" alt="${escHtml(name)}" style="width:100%;height:100px;object-fit:cover;border-radius:6px;margin-bottom:8px" />`
              : ''
          }
          <div style="font-weight:700;font-size:14px;margin-bottom:4px" lang="${locale}">${escHtml(name)}</div>
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#888;margin-bottom:6px">${escHtml(p.type)}</div>
          ${
            tagline
              ? `<p style="font-size:12px;color:#444;margin:4px 0 8px" lang="${locale}">${escHtml(tagline)}</p>`
              : ''
          }
          <a href="/${locale}/pillars/${p.pillarSlug}/${p.slug}" style="display:inline-block;font-size:12px;font-weight:600;color:#D4A853;text-decoration:none">${linkLabel}</a>
        </div>
      `;
      marker.bindPopup(html);
      markers.push(marker);
    }

    // Auto-fit to all pins.
    if (places.length === 1) {
      map.setView([places[0].latitude, places[0].longitude], 14);
    } else if (places.length > 1) {
      const bounds = L.latLngBounds(places.map((p) => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [60, 60] });
    }

    // Cleanup on unmount (or before re-running the effect in Strict Mode).
    return () => {
      markers.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
      // Reset the container so a future mount can init cleanly.
      if (containerRef.current) {
        delete (containerRef.current as any)._leaflet_id;
      }
    };
  }, [places, locale, isAr]);

  return (
    <div
      ref={containerRef}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
    />
  );
}
