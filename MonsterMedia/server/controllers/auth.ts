import { Request, Response } from 'express';
import { storage } from '../storage';
import { loginSchema, insertUserSchema } from '@shared/schema';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const userData = insertUserSchema.parse(req.body);
    
    // Check if username already exists
    const existingUsername = await storage.getUserByUsername(userData.username);
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Check if email already exists
    const existingEmail = await storage.getUserByEmail(userData.email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // TODO: In a production app, hash the password
    // const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create user
    const user = await storage.createUser({
      ...userData,
      isVip: false,
      isAdmin: false,
    });
    
    // Set session
    req.session.userId = user.id;
    
    // Return user data (excluding password)
    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const credentials = loginSchema.parse(req.body);
    
    // Find user by username
    const user = await storage.getUserByUsername(credentials.username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // TODO: In a production app, compare hashed passwords
    // const passwordMatch = await bcrypt.compare(credentials.password, user.password);
    const passwordMatch = credentials.password === user.password;
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Set session
    req.session.userId = user.id;
    
    // Return user data (excluding password)
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    
    res.status(500).json({ message: 'Login error' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  try {
    const user = await storage.getUser(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user data (excluding password)
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

// Logout user
export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

// Submit VIP request
export const requestVip = async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const { email, reason } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const vipRequest = await storage.createVipRequest({
      userId: req.userId,
      email,
      reason: reason || '',
    });
    
    res.status(201).json({ 
      message: 'VIP request submitted successfully',
      request: vipRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting VIP request' });
  }
};
