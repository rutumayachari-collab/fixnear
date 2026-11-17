import { Router, Response } from 'express';
import { db } from '../db/database';
import { AuthenticatedRequest } from '../middleware/auth';
import { BookingStatus } from '../types';

export const bookingsRouter = Router();

// 1. Create a New Booking
bookingsRouter.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      helperId,
      customerName,
      customerPhone,
      customerAddress,
      customerPincode,
      customerCoordinates,
      serviceCategory,
      problemDescription,
      preferredDate,
      preferredTime,
      estimatedPrice,
    } = req.body;

    if (!helperId || !customerName || !customerPhone || !customerAddress || !customerPincode || !problemDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: helper, name, phone, address, PIN code, and problem description.'
      });
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 10-digit Indian mobile number.'
      });
    }

    const cleanPin = customerPincode.replace(/\D/g, '');
    if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 6-digit Indian PIN code.'
      });
    }

    // Verify helper exists
    const helper = await db.helpers.findById(helperId);
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: 'Selected service helper not found in database.'
      });
    }

    const customerId = req.user ? req.user.userId : `guest-${cleanPhone}`;

    const newBooking = await db.bookings.create({
      customerId,
      customerName: customerName.trim(),
      customerPhone: cleanPhone,
      customerAddress: customerAddress.trim(),
      customerPincode: cleanPin,
      customerCoordinates,
      helperId: helper.id,
      helperName: helper.name,
      serviceCategory: serviceCategory || helper.category,
      problemDescription: problemDescription.trim(),
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: preferredTime || 'Morning (9 AM - 12 PM)',
      estimatedPrice: Number(estimatedPrice) || helper.startingPrice,
      status: 'Requested',
    });

    return res.status(201).json({
      success: true,
      message: `Booking ${newBooking.id} created successfully! Status: Requested.`,
      booking: newBooking,
    });
  } catch (err: any) {
    console.error('Create booking error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create booking.',
      error: err?.message,
    });
  }
});

// 2. Get Bookings
bookingsRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { helperId, customerPhone, status } = req.query;

    let filter = (b: any) => true;

    if (req.user) {
      if (req.user.role === 'customer') {
        filter = (b: any) => b.customerId === req.user?.userId || b.customerPhone === req.user?.phone;
      } else if (req.user.role === 'helper') {
        const helper = await db.helpers.findByUserId(req.user.userId);
        if (helper) {
          filter = (b: any) => b.helperId === helper.id;
        } else {
          filter = (b: any) => false;
        }
      }
      // If admin, no filter needed (sees all)
    } else {
      // Unauthenticated query by helperId or customerPhone
      if (helperId) {
        filter = (b: any) => b.helperId === helperId;
      } else if (customerPhone) {
        const cleanPhone = String(customerPhone).replace(/\D/g, '');
        filter = (b: any) => b.customerPhone === cleanPhone;
      }
    }

    let all = await db.bookings.find(filter);

    if (status && typeof status === 'string' && status !== 'all') {
      all = all.filter(b => b.status.toLowerCase() === status.toLowerCase());
    }

    return res.json({
      success: true,
      count: all.length,
      bookings: all,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings.',
      error: err?.message,
    });
  }
});

// 3. Get Single Booking
bookingsRouter.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const booking = await db.bookings.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    return res.json({
      success: true,
      booking,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking.',
      error: err?.message,
    });
  }
});

// 4. Update Booking Status (Accept, Reject, In Progress, Completed, Cancelled)
bookingsRouter.patch('/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const bookingId = req.params.id;
    const { status, notes, finalPrice, cancellationReason } = req.body;

    const validStatuses: BookingStatus[] = [
      'Requested',
      'Accepted',
      'Rejected',
      'In Progress',
      'Completed',
      'Cancelled'
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const booking = await db.bookings.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    // Role-based validation
    if (req.user) {
      if (req.user.role === 'helper') {
        const currentHelper = await db.helpers.findByUserId(req.user.userId);
        if (!currentHelper || currentHelper.id !== booking.helperId) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden. You can only update bookings assigned to you.'
          });
        }
      } else if (req.user.role === 'customer') {
        if (booking.customerId !== req.user.userId && booking.customerPhone !== req.user.phone) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden. You can only manage your own bookings.'
          });
        }
        if (status !== 'Cancelled') {
          return res.status(403).json({
            success: false,
            message: 'Customers can only cancel a booking.'
          });
        }
      }
    }

    // Check invalid transitions
    if (booking.status === 'Cancelled' && status !== 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled and cannot be changed.'
      });
    }

    if (booking.status === 'Completed' && status !== 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already completed.'
      });
    }

    const updatePayload: any = { status };
    if (notes !== undefined) updatePayload.workerNotes = notes;
    if (finalPrice !== undefined) updatePayload.finalPrice = Number(finalPrice);
    if (cancellationReason !== undefined) updatePayload.cancellationReason = cancellationReason;

    const updated = await db.bookings.update(bookingId, updatePayload);

    return res.json({
      success: true,
      message: `Booking ${bookingId} status updated to "${status}".`,
      booking: updated,
    });
  } catch (err: any) {
    console.error('Update booking status error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update booking status.',
      error: err?.message,
    });
  }
});
