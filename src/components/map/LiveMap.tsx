'use client';

import { useEffect, useRef, useState } from 'react';
import type { LivreurPosition } from '@/services/firebase/realtime';

interface LiveMapProps {
  positions: LivreurPosition[];
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  height?: string;
  selectedLivreurId?: string;
  onLivreurClick?: (livreurId: string) => void;
}

// Status colors
const STATUS_COLORS: Record<string, string> = {
  en_route: '#3b82f6',
  livraison: '#f97316',
  pause: '#6b7280',
  termine: '#22c55e',
};

export default function LiveMap({
  positions,
  centerLat = 45.75,
  centerLng = 4.85,
  zoom = 12,
  height = '400px',
  selectedLivreurId,
  onLivreurClick,
}: LiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<string, any>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any;

    const initMap = async () => {
      const maplibregl = (await import('maplibre-gl')).default;

      // Import CSS dynamically
      const existingLink = document.head.querySelector('link[data-maplibre]');
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css';
        link.setAttribute('data-maplibre', 'true');
        document.head.appendChild(link);
      }

      map = new maplibregl.Map({
        container: mapContainerRef.current!,
        style: 'https://demotiles.maplibre.org/style.json',
        center: [centerLng, centerLat],
        zoom,
      });

      map.on('load', () => {
        mapRef.current = map;
        setMapLoaded(true);
      });
    };

    initMap().catch(console.error);

    return () => {
      if (map) {
        map.remove();
        mapRef.current = null;
      }
    };
    // centerLat, centerLng, zoom intentionally omitted — only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers when positions change
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const initMarkers = async () => {
      const maplibregl = (await import('maplibre-gl')).default;
      const map = mapRef.current;

      // Remove old markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current.clear();

      // Add new markers
      positions.forEach((pos) => {
        if (!pos.lat || !pos.lng) return;

        const color = STATUS_COLORS[pos.status] ?? '#6b7280';
        const isSelected = pos.id === selectedLivreurId;

        // Custom marker element
        const el = document.createElement('div');
        el.style.cssText = `
          width: ${isSelected ? '44px' : '36px'};
          height: ${isSelected ? '44px' : '36px'};
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          font-weight: bold;
          transition: all 0.3s;
        `;
        el.textContent = pos.nom?.charAt(0)?.toUpperCase() ?? '?';

        if (onLivreurClick) {
          el.addEventListener('click', () => onLivreurClick(pos.id));
        }

        // Tooltip popup
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong>${pos.nom}</strong><br/>
            <span style="color: ${color}">&#9679; ${pos.status.replace('_', ' ')}</span><br/>
            ${pos.currentDelivery ? `<small>Livraison: ${pos.currentDelivery}</small>` : ''}
          </div>
        `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([pos.lng, pos.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.set(pos.id, marker);
      });

      // Auto-fit bounds if multiple positions
      if (positions.length > 1) {
        const validPositions = positions.filter(p => p.lat && p.lng);
        if (validPositions.length > 0) {
          const first = validPositions[0];
          const bounds = validPositions.reduce(
            (b, p) => b.extend([p.lng, p.lat] as [number, number]),
            new maplibregl.LngLatBounds(
              [first.lng, first.lat] as [number, number],
              [first.lng, first.lat] as [number, number]
            )
          );
          map.fitBounds(bounds, { padding: 80, maxZoom: 14 });
        }
      }
    };

    initMarkers().catch(console.error);
  }, [positions, mapLoaded, selectedLivreurId, onLivreurClick]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200">
      <div ref={mapContainerRef} style={{ width: '100%', height }} />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm">Chargement de la carte...</p>
          </div>
        </div>
      )}
    </div>
  );
}
