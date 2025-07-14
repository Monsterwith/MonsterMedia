import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertThemeSettingsSchema } from '@shared/schema';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await storage.getAllUsers();
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.status(200).json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Update user (admin only)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const { isVip, isAdmin } = req.body;
    
    // Update user
    const updatedUser = await storage.updateUser(userId, {
      isVip: isVip !== undefined ? isVip : undefined,
      isAdmin: isAdmin !== undefined ? isAdmin : undefined,
    });
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Get VIP requests (admin only)
export const getVipRequests = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string || 'pending';
    
    const requests = await storage.getVipRequestsByStatus(status);
    
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching VIP requests' });
  }
};

// Update VIP request status (admin only)
export const updateVipRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestId = parseInt(id);
    
    if (isNaN(requestId)) {
      return res.status(400).json({ message: 'Invalid request ID' });
    }
    
    const { status } = req.body;
    
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const updatedRequest = await storage.updateVipRequestStatus(requestId, status);
    
    if (!updatedRequest) {
      return res.status(404).json({ message: 'VIP request not found' });
    }
    
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating VIP request' });
  }
};

// Get current theme settings
export const getThemeSettings = async (req: Request, res: Response) => {
  try {
    const theme = await storage.getActiveTheme();
    
    if (!theme) {
      return res.status(404).json({ message: 'No active theme found' });
    }
    
    res.status(200).json(theme);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching theme settings' });
  }
};

// Update theme settings (admin only)
export const updateThemeSettings = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const themeData = insertThemeSettingsSchema.parse(req.body);
    
    // Update theme settings
    const updatedTheme = await storage.updateThemeSettings(themeData);
    
    res.status(200).json(updatedTheme);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    
    res.status(500).json({ message: 'Error updating theme settings' });
  }
};
