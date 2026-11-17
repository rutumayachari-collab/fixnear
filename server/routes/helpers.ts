import { Router, Response } from 'express';
import { db } from '../db/database';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';

export const helpersRouter = Router();

// Haversine straight-line distance in km
function calculateDistanceKm(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
  const R = 6371; // Earth radius in km
  const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
  const dLng = (coord2.lng - coord1.lng) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * (Math.PI / 180)) * Math.cos(coord2.lat * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// 1. Search Helpers (The core feature)
helpersRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, pincode, search, sortBy, lat, lng } = req.query;

    const catQuery = typeof category === 'string' ? category.trim().toLowerCase() : 'all';
    const pinQuery = typeof pincode === 'string' ? pincode.replace(/\D/g, '') : '';
    const searchQuery = typeof search === 'string' ? search.trim().toLowerCase() : '';
    const sort = typeof sortBy === 'string' ? sortBy : 'relevance';

    let customerCoords: { lat: number; lng: number } | null = null;
    if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
      customerCoords = { lat: Number(lat), lng: Number(lng) };
    }

    // Query all active helpers from database
    const allHelpers = await db.helpers.find(h => h.isActive);

    let filtered = allHelpers.filter(h => {
      // Category match
      if (catQuery && catQuery !== 'all') {
        const matchesMain = h.category.toLowerCase() === catQuery;
        const matchesAddl = h.additionalCategories?.some(c => c.toLowerCase() === catQuery);
        if (!matchesMain && !matchesAddl) return false;
      }

      // PIN code match: helper's pincodes array includes search PIN
      if (pinQuery) {
        const hasPin = h.pincodes.some(p => p.includes(pinQuery));
        const hasArea = h.areas.some(a => a.toLowerCase().includes(pinQuery));
        if (!hasPin && !hasArea) return false;
      }

      // Text query match
      if (searchQuery) {
        const nameMatch = h.name.toLowerCase().includes(searchQuery);
        const taglineMatch = h.tagline.toLowerCase().includes(searchQuery);
        const areaMatch = h.areas.some(a => a.toLowerCase().includes(searchQuery));
        const bioMatch = h.bio.toLowerCase().includes(searchQuery);
        if (!nameMatch && !taglineMatch && !areaMatch && !bioMatch) return false;
      }

      return true;
    });

    // Attach distances if coordinates available
    let results = filtered.map(h => {
      let distanceKm: number | undefined;
      if (customerCoords && h.coordinates) {
        distanceKm = calculateDistanceKm(customerCoords, h.coordinates);
      }
      return {
        ...h,
        distanceKm,
      };
    });

    // Sort results
    results.sort((a, b) => {
      // 1. Exact PIN match priority
      if (pinQuery) {
        const aExact = a.pincodes.includes(pinQuery);
        const bExact = b.pincodes.includes(pinQuery);
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
      }

      // 2. Prioritize newly registered helper accounts (so user-registered helpers appear at position #1)
      const aIsUserRegistered = a.id.startsWith('helper-');
      const bIsUserRegistered = b.id.startsWith('helper-');
      if (aIsUserRegistered && !bIsUserRegistered) return -1;
      if (!aIsUserRegistered && bIsUserRegistered) return 1;

      if (sort === 'distance') {
        if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
          return a.distanceKm - b.distanceKm;
        }
        if (a.distanceKm !== undefined) return -1;
        if (b.distanceKm !== undefined) return 1;
      }

      if (sort === 'price-asc') return a.startingPrice - b.startingPrice;
      if (sort === 'price-desc') return b.startingPrice - a.startingPrice;
      if (sort === 'experience') return b.experienceYears - a.experienceYears;

      // Default: Rating
      return b.rating - a.rating;
    });

    return res.json({
      success: true,
      count: results.length,
      filters: {
        category: catQuery,
        pincode: pinQuery,
        search: searchQuery,
        sortBy: sort,
      },
      helpers: results,
    });
  } catch (err: any) {
    console.error('Error fetching helpers:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to search helpers.',
      error: err?.message,
    });
  }
});

// 2. Get Single Helper Details
helpersRouter.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const helper = await db.helpers.findById(req.params.id);
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found.',
      });
    }

    return res.json({
      success: true,
      helper,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve helper.',
      error: err?.message,
    });
  }
});

// 3. Update Helper Profile
helpersRouter.put('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const helperId = req.params.id;
    const existing = await db.helpers.findById(helperId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found.',
      });
    }

    // Only the helper themselves or admin can edit
    if (req.user?.role !== 'admin' && existing.userId !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You cannot edit another technician profile.',
      });
    }

    const {
      name,
      tagline,
      startingPrice,
      availability,
      areas,
      pincodes,
      bio,
      languages,
    } = req.body;

    const updated = await db.helpers.update(helperId, {
      name: name ?? existing.name,
      tagline: tagline ?? existing.tagline,
      startingPrice: startingPrice ? Number(startingPrice) : existing.startingPrice,
      availability: availability ?? existing.availability,
      areas: Array.isArray(areas) ? areas : existing.areas,
      pincodes: Array.isArray(pincodes) ? pincodes : existing.pincodes,
      bio: bio ?? existing.bio,
      languages: Array.isArray(languages) ? languages : existing.languages,
    });

    return res.json({
      success: true,
      message: 'Helper profile updated successfully.',
      helper: updated,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update helper profile.',
      error: err?.message,
    });
  }
});
