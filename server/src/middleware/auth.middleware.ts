import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define interface for JWT payload
interface JwtPayload {
  id: string;
  username: string;
  email: string;
}

// Extend Express Request interface to include admin property
declare global {
  namespace Express {
    interface Request {
      admin?: JwtPayload;
    }
  }
}

// Authenticate admin middleware
export const authenticateAdmin = (
  req: Request,
  res: Response, 
  next: NextFunction
) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'default_secret_change_in_production'
    ) as JwtPayload;

    // Add admin data to request
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Create JWT token
export const createToken = (payload: JwtPayload): string => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'default_secret_change_in_production',
    { expiresIn: '24h' }
  );
};
