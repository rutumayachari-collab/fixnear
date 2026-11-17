import { Router, Response } from 'express';
import { db } from '../db/database';
import { AuthenticatedRequest } from '../middleware/auth';

export const adminRouter = Router();

// 1. Dashboard Stats
adminRouter.get('/stats', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const allHelpers = await db.helpers.find();
    const allUsers = await db.users.find();
    const allBookings = await db.bookings.find();

    const totalHelpers = allHelpers.length;
    const activeHelpers = allHelpers.filter(h => h.isActive).length;
    const totalCustomers = allUsers.filter(u => u.role === 'customer').length;

    const totalBookings = allBookings.length;
    const newRequests = allBookings.filter(b => b.status === 'Requested').length;
    const activeJobs = allBookings.filter(b => b.status === 'Accepted' || b.status === 'In Progress').length;
    const completedJobs = allBookings.filter(b => b.status === 'Completed').length;
    const cancelledJobs = allBookings.filter(b => b.status === 'Cancelled').length;

    const totalEstimatedRevenue = allBookings
      .filter(b => b.status === 'Completed')
      .reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice || 0), 0);

    const recentActivity = allBookings.slice(0, 10);

    return res.json({
      success: true,
      stats: {
        totalHelpers,
        activeHelpers,
        totalCustomers,
        totalBookings,
        newRequests,
        activeJobs,
        completedJobs,
        cancelledJobs,
        totalEstimatedRevenue,
      },
      recentActivity,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate admin stats.',
      error: err?.message,
    });
  }
});

// 2. All Helpers List
adminRouter.get('/helpers', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const helpers = await db.helpers.find();
    return res.json({
      success: true,
      count: helpers.length,
      helpers,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch helpers.',
      error: err?.message,
    });
  }
});

// 3. All Customers List
adminRouter.get('/customers', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customers = await db.users.find(u => u.role === 'customer');
    // Sanitize password hashes
    const sanitized = customers.map(({ passwordHash, ...rest }) => rest);
    return res.json({
      success: true,
      count: sanitized.length,
      customers: sanitized,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch customers.',
      error: err?.message,
    });
  }
});

// 4. Toggle Helper Active / Inactive
adminRouter.patch('/helpers/:id/toggle', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const helper = await db.helpers.findById(req.params.id);
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Helper profile not found.',
      });
    }

    const updated = await db.helpers.update(helper.id, {
      isActive: !helper.isActive,
    });

    return res.json({
      success: true,
      message: `Helper "${helper.name}" is now ${updated?.isActive ? 'Active' : 'Deactivated'}.`,
      helper: updated,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle helper status.',
      error: err?.message,
    });
  }
});

// 5. Reset Demo Data
adminRouter.post('/reset', async (req: AuthenticatedRequest, res: Response) => {
  try {
    db.resetToDefaults();
    return res.json({
      success: true,
      message: 'Demonstration database reset to clean seed defaults.',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to reset demo data.',
      error: err?.message,
    });
  }
});
