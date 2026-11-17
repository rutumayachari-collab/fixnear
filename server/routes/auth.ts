import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database';
import { CONFIG } from '../config';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuthJWTPayload } from '../types';

export const authRouter = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: CONFIG.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function generateToken(payload: AuthJWTPayload): string {
  return jwt.sign(payload, CONFIG.JWT_SECRET, { expiresIn: '7d' });
}

// 1. Customer Registration
authRouter.post('/register-customer', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      fullName, 
      phone, 
      email, 
      password, 
      confirmPassword, 
      pincode, 
      address, 
      language 
    } = req.body;

    if (!fullName || !phone || !password || !pincode || !address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill all required fields: name, mobile, PIN code, address, and password.' 
      });
    }

    // Validate 10-digit Indian phone
    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.'
      });
    }

    // Validate 6-digit Indian PIN code
    const cleanPin = pincode.replace(/\D/g, '');
    if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid 6-digit Indian postal PIN code.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    // Check if phone already registered
    const existingUser = await db.users.findOne(u => u.phone === cleanPhone);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this mobile number already exists. Please log in.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await db.users.create({
      name: fullName.trim(),
      phone: cleanPhone,
      email: email ? email.trim() : undefined,
      passwordHash,
      role: 'customer',
      pincode: cleanPin,
      address: address.trim(),
      language: language || 'Hindi',
    });

    const tokenPayload: AuthJWTPayload = {
      userId: newUser.id,
      role: 'customer',
      name: newUser.name,
      phone: newUser.phone,
    };

    const token = generateToken(tokenPayload);
    res.cookie('fixnear_token', token, COOKIE_OPTIONS);

    return res.status(201).json({
      success: true,
      message: 'Customer registration successful!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,
        pincode: newUser.pincode,
        address: newUser.address,
        language: newUser.language,
      }
    });
  } catch (err: any) {
    console.error('Customer registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete customer registration. Please try again.',
      error: err?.message,
    });
  }
});

// 2. Helper Registration
authRouter.post('/register-helper', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      fullName,
      businessName,
      phone,
      email,
      password,
      confirmPassword,
      category,
      additionalCategories,
      pincode,
      additionalPincodes,
      area,
      city,
      description,
      experienceYears,
      startingPrice,
      availability,
      languages,
      coordinates,
    } = req.body;

    if (!fullName || !phone || !password || !pincode || !category || !area) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields: name, mobile, service category, PIN code, and area.'
      });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid 10-digit Indian mobile number.'
      });
    }

    const cleanPin = pincode.replace(/\D/g, '');
    if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid 6-digit Indian PIN code.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    const existingUser = await db.users.findOne(u => u.phone === cleanPhone);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this mobile number already exists. Please log in.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user account with role 'helper'
    const newUser = await db.users.create({
      name: fullName.trim(),
      phone: cleanPhone,
      email: email ? email.trim() : undefined,
      passwordHash,
      role: 'helper',
      pincode: cleanPin,
      address: area.trim(),
      language: languages?.[0] || 'Hindi',
    });

    // Parse pincodes
    const extraPins = Array.isArray(additionalPincodes) 
      ? additionalPincodes 
      : typeof additionalPincodes === 'string'
      ? additionalPincodes.split(',').map((p: string) => p.trim()).filter((p: string) => /^[1-9][0-9]{5}$/.test(p))
      : [];

    const allPincodes = Array.from(new Set([cleanPin, ...extraPins]));

    const displayName = businessName && businessName.trim()
      ? businessName.trim()
      : `${fullName.trim()} ${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')} Service`;

    // Create helper profile
    const newHelper = await db.helpers.create({
      userId: newUser.id,
      name: displayName,
      tagline: description?.trim() || `Reliable ${category.replace('-', ' ')} specialist serving ${area.trim()} and nearby areas.`,
      category,
      additionalCategories: Array.isArray(additionalCategories) ? additionalCategories : [],
      phone: cleanPhone,
      email: email ? email.trim() : undefined,
      city: city?.trim() || 'Pune',
      areas: [area.trim()],
      pincodes: allPincodes,
      coordinates: coordinates || { lat: 18.5204, lng: 73.8567 },
      startingPrice: Number(startingPrice) || 199,
      rating: 5.0,
      reviewCount: 1,
      experienceYears: Number(experienceYears) || 3,
      availability: availability || 'Available Today',
      isActive: true,
      badge: '✨ Verified Helper',
      bio: description?.trim() || `Experienced in home ${category.replace('-', ' ')}. Prompt service, transparent rates, and high quality workmanship.`,
      languages: languages && languages.length > 0 ? languages : ['Hindi', 'Marathi', 'English'],
    });

    const tokenPayload: AuthJWTPayload = {
      userId: newUser.id,
      role: 'helper',
      name: newUser.name,
      phone: newUser.phone,
      helperId: newHelper.id,
    };

    const token = generateToken(tokenPayload);
    res.cookie('fixnear_token', token, COOKIE_OPTIONS);

    return res.status(201).json({
      success: true,
      message: 'Helper profile registered successfully and active in database!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
        helperId: newHelper.id,
      },
      helper: newHelper,
    });
  } catch (err: any) {
    console.error('Helper registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete helper registration. Please try again.',
      error: err?.message,
    });
  }
});

// 3. Login
authRouter.post('/login', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { identifier, phone, email, password } = req.body;
    const searchIdentifier = (identifier || phone || email || '').trim();

    if (!searchIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide mobile/email and your password.'
      });
    }

    const cleanPhone = searchIdentifier.replace(/\D/g, '');

    // Search user by phone or email
    const user = await db.users.findOne(u => 
      (cleanPhone && u.phone === cleanPhone) || 
      (u.email && u.email.toLowerCase() === searchIdentifier.toLowerCase())
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No account found with this mobile or email.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.'
      });
    }

    let helperProfile = null;
    if (user.role === 'helper') {
      helperProfile = await db.helpers.findByUserId(user.id);
    }

    const tokenPayload: AuthJWTPayload = {
      userId: user.id,
      role: user.role,
      name: user.name,
      phone: user.phone,
      helperId: helperProfile ? helperProfile.id : undefined,
    };

    const token = generateToken(tokenPayload);
    res.cookie('fixnear_token', token, COOKIE_OPTIONS);

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        pincode: user.pincode,
        address: user.address,
        helperId: helperProfile?.id,
      },
      helper: helperProfile,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Login failed due to an internal error.',
      error: err?.message,
    });
  }
});

// 4. Logout
authRouter.post('/logout', (req: AuthenticatedRequest, res: Response) => {
  res.clearCookie('fixnear_token');
  return res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

// 5. Current User (Session Check)
authRouter.get('/me', async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.json({
      success: true,
      authenticated: false,
      user: null,
      helper: null,
    });
  }

  const user = await db.users.findById(req.user.userId);
  if (!user) {
    res.clearCookie('fixnear_token');
    return res.json({
      success: true,
      authenticated: false,
      user: null,
      helper: null,
    });
  }

  let helper = null;
  if (user.role === 'helper') {
    helper = await db.helpers.findByUserId(user.id);
  }

  return res.json({
    success: true,
    authenticated: true,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      pincode: user.pincode,
      address: user.address,
      helperId: helper?.id,
    },
    helper,
  });
});
