import { Request, Response } from 'express';
import Admin, { IAdmin } from '../schema/admin.schema';
import Project from '../schema/project.schema';
import { createToken } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

// Register new admin
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return res.status(400).json({ 
        message: 'Admin already exists with that username or email' 
      });
    }
    
    // Create new admin
    const admin = new Admin({
      username,
      email,
      password,
    });
    
    await admin.save();
    
    // Generate token - use a safer approach to get ID
    const adminId = admin._id instanceof mongoose.Types.ObjectId 
      ? admin._id.toString() 
      : String(admin._id);
      
    const token = createToken({
      id: adminId,
      username: admin.username as string,
      email: admin.email as string
    });
    
    return res.status(201).json({
      message: 'Admin registered successfully',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Login admin
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token - use a safer approach to get ID
    const adminId = admin._id instanceof mongoose.Types.ObjectId 
      ? admin._id.toString() 
      : String(admin._id);
      
    const token = createToken({
      id: adminId,
      username: admin.username as string,
      email: admin.email as string
    });
    
    return res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Create new project
export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, goalAmount, deadline, stakingConditions, rewardStructure, tags } = req.body;
    
    if (!req.admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Create project
    const project = new Project({
      title,
      description,
      goalAmount,
      deadline: new Date(deadline),
      stakingConditions,
      rewardStructure,
      tags,
      createdBy: req.admin.id,
      status: new Date(deadline) > new Date() ? 'upcoming' : 'active'
    });
    
    await project.save();
    
    return res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Update project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (!req.admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Find project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if admin is the creator
    if (project.createdBy !== req.admin.id) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    // Update project
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== 'createdBy') {
        (project as any)[key] = updates[key];
      }
    });
    
    await project.save();
    
    return res.status(200).json({
      message: 'Project updated successfully',
      project
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!req.admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Find project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if admin is the creator
    if (project.createdBy !== req.admin.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    
    await project.deleteOne();
    
    return res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get admin's projects
export const getAdminProjects = async (req: Request, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const projects = await Project.find({ createdBy: req.admin.id })
                                 .sort({ createdAt: -1 });
    
    return res.status(200).json({ projects });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
