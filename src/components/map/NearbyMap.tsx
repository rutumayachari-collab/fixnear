import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ServiceProvider, Coordinates } from '../../types';
import { formatINR, formatDistance } from '../../utils/formatters';
import { DEFAULT_PUNE_COORDS } from '../../utils/geo';
import { MapPin, Navigation, Eye, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface NearbyMapProps {
  providers: ServiceProvider[];
  customerCoords: Coordinates | null;
  onSelectProvider: (provider: ServiceProvider) => void;
  onBookProvider: (provider: ServiceProvider) => void;
  selectedProviderId?: string | null;
  heightClass?: string;
}

export const NearbyMap: React.FC<NearbyMapProps> = ({
  providers,
  customerCoords,
  onSelectProvider,
  onBookProvider,
  selectedProviderId,
  heightClass = 'h-[400px] sm:h-[480px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const [tileError, setTileError] = useState(false);
  const [mapInitError, setMapInitError] = useState(false);

  // Initialize Map safely
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up any lingering Leaflet metadata on the container to prevent
    // "Error: Map container is already initialized" during back-button navigation
    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch {
        // ignore
      }
      mapInstanceRef.current = null;
    }

    try {
      const initialCenter = customerCoords || DEFAULT_PUNE_COORDS;

      const map = L.map(mapContainerRef.current, {
        center: [initialCenter.lat, initialCenter.lng],
        zoom: customerCoords ? 13 : 12,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors • FixNear Pune Demo',
      });

      tileLayer.on('tileerror', () => {
        setTileError(true);
      });

      tileLayer.addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      setMapInitError(false);
    } catch (err) {
      console.warn('[NearbyMap] Map initialization handled gracefully:', err);
      setMapInitError(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {
          // ignore
        }
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }
    };
  }, []); // run once on mount

  // Update Markers whenever providers or customerCoords change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    try {
      markersGroup.clearLayers();
      const bounds: L.LatLngTuple[] = [];

    // 1. Customer Marker (if location available)
    if (customerCoords) {
      const customerIcon = L.divIcon({
        className: 'custom-customer-marker',
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: #3B82F6; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 22px; height: 22px; border-radius: 9999px; background-color: #2563EB; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">
              📍
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const customerMarker = L.marker([customerCoords.lat, customerCoords.lng], {
        icon: customerIcon,
        zIndexOffset: 1000,
      }).bindPopup(`
        <div style="text-align: center; padding: 4px;">
          <div style="font-weight: 700; color: #0B1F3A; font-size: 12px; margin-bottom: 2px;">Your Detected Location</div>
          <div style="font-size: 11px; color: #667085;">Lat: ${customerCoords.lat.toFixed(4)}, Lng: ${customerCoords.lng.toFixed(4)}</div>
          <div style="margin-top: 4px; font-size: 10px; color: #15803D; font-weight: 600;">Browser Geolocation Active</div>
        </div>
      `);

      markersGroup.addLayer(customerMarker);
      bounds.push([customerCoords.lat, customerCoords.lng]);
    }

    // 2. Provider Markers
    providers.forEach((provider) => {
      const isSelected = provider.id === selectedProviderId;
      const coords = provider.coordinates || DEFAULT_PUNE_COORDS;

      // Category icon visual
      let iconEmoji = '🔧';
      if (provider.category === 'electrical') iconEmoji = '⚡';
      if (provider.category === 'ac-repair') iconEmoji = '❄️';
      if (provider.category === 'appliance-repair') iconEmoji = '🔌';
      if (provider.category === 'carpentry') iconEmoji = '🔨';
      if (provider.category === 'home-cleaning') iconEmoji = '✨';

      const providerIcon = L.divIcon({
        className: 'custom-provider-marker',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'}; transition: transform 0.2s;">
            <div style="background-color: ${isSelected ? '#3B82F6' : '#0B1F3A'}; color: white; border: 2px solid white; border-radius: 9999px; padding: 4px 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.25); display: flex; align-items: center; gap: 4px;">
              <span style="font-size: 11px;">${iconEmoji}</span>
              <span style="font-size: 10px; font-weight: 700;">₹${provider.startingPrice}</span>
            </div>
            <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid ${isSelected ? '#3B82F6' : '#0B1F3A'};"></div>
          </div>
        `,
        iconSize: [60, 36],
        iconAnchor: [30, 36],
        popupAnchor: [0, -36],
      });

      const popupContent = document.createElement('div');
      popupContent.style.minWidth = '180px';
      popupContent.innerHTML = `
        <div style="padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <span style="font-weight: 700; color: #0B1F3A; font-size: 13px;">${provider.name}</span>
          </div>
          <div style="font-size: 11px; color: #667085; text-transform: capitalize; margin-bottom: 4px;">
            ${provider.category.replace('-', ' ')} • Pune
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #F3F4F6; padding-top: 4px; margin-bottom: 8px;">
            <span style="font-size: 11px; color: #667085;">Starting Price:</span>
            <span style="font-weight: 700; color: #15803D; font-size: 12px;">₹${provider.startingPrice}</span>
          </div>
          ${provider.distanceKm !== undefined ? `
            <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; padding: 3px 6px; font-size: 10px; color: #1E40AF; font-weight: 600; margin-bottom: 8px;">
              📍 ~${provider.distanceKm.toFixed(1)} km away (straight-line)
            </div>
          ` : ''}
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
            <button id="view-details-${provider.id}" style="background: #F3F4F6; color: #172033; font-size: 11px; font-weight: 600; padding: 4px 6px; border-radius: 6px; border: none; cursor: pointer;">
              Details
            </button>
            <button id="book-now-${provider.id}" style="background: #0B1F3A; color: white; font-size: 11px; font-weight: 600; padding: 4px 6px; border-radius: 6px; border: none; cursor: pointer;">
              Book
            </button>
          </div>
        </div>
      `;

      // Attach button clicks after popup opens
      const marker = L.marker([coords.lat, coords.lng], { icon: providerIcon })
        .bindPopup(popupContent);

      marker.on('popupopen', () => {
        const detailsBtn = document.getElementById(`view-details-${provider.id}`);
        const bookBtn = document.getElementById(`book-now-${provider.id}`);

        if (detailsBtn) {
          detailsBtn.onclick = (e) => {
            e.stopPropagation();
            onSelectProvider(provider);
          };
        }
        if (bookBtn) {
          bookBtn.onclick = (e) => {
            e.stopPropagation();
            onBookProvider(provider);
          };
        }
      });

      markersGroup.addLayer(marker);
      bounds.push([coords.lat, coords.lng]);
    });

    // Fit map bounds smoothly
    if (bounds.length > 0) {
      if (bounds.length === 1) {
        map.setView(bounds[0], 14);
      } else {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }
    } catch (err) {
      console.warn('[NearbyMap] Marker update handled gracefully:', err);
    }
  }, [providers, customerCoords, selectedProviderId, onSelectProvider, onBookProvider]);

  const handleResetCenter = () => {
    if (!mapInstanceRef.current) return;
    const center = customerCoords || DEFAULT_PUNE_COORDS;
    mapInstanceRef.current.setView([center.lat, center.lng], 13);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-10`} />

      {/* Fallback if Leaflet encounters canvas issue */}
      {mapInitError && (
        <div className="absolute inset-0 z-30 bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-2">
            <MapPin size={24} />
          </div>
          <p className="font-bold text-sm text-[#0B1F3A]">Map preview temporarily offline</p>
          <p className="text-xs text-[#667085] max-w-sm mt-1">
            All technician profiles, ratings, starting charges, and booking services are fully available in the list below.
          </p>
        </div>
      )}

      {/* Map Control Buttons */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleResetCenter}
          className="p-2 bg-white text-[#0B1F3A] hover:bg-gray-100 rounded-lg shadow-md border border-gray-200 transition-colors"
          title="Recenter Map"
        >
          <Navigation size={16} />
        </button>
      </div>

      {/* Map Legend & Transparency Overlay */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-gray-200 shadow-md text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-white shadow-xs"></span>
            <span className="font-semibold text-gray-700">Your Location</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#0B1F3A] border border-white shadow-xs flex items-center justify-center text-[8px] text-white">₹</span>
            <span className="font-semibold text-gray-700">Technician (Starting Rate)</span>
          </div>
          <span className="text-[10px] text-gray-500 hidden md:inline">
            • Pune Metropolitan Area (Demo Coordinates)
          </span>
        </div>
      </div>

      {/* Tile loading error notification */}
      {tileError && (
        <div className="absolute top-3 left-3 z-20 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
          <AlertTriangle size={14} className="text-amber-600 shrink-0" />
          <span>Notice: Network map tile delayed; marker pins remain interactive.</span>
        </div>
      )}
    </div>
  );
};
