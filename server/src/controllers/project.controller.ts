import { Request, Response } from 'express';
import Project, { IProject } from '../schema/project.schema';
import Stake from '../schema/stake.schema';

// Get all projects with filtering options
export const getProjects = async (req: Request, res: Response) => {
  try {
    const { status, tag, sort, limit = 10, page = 1 } = req.query;
    
    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (tag) filter.tags = { $in: [tag] };
    
    // Determine sort order
    let sortOption: any = { createdAt: -1 }; // Default: newest first
    if (sort === 'goal') sortOption = { goalAmount: -1 };
    if (sort === 'progress') sortOption = { currentAmount: -1 };
    if (sort === 'deadline') sortOption = { deadline: 1 };
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const projects = await Project.find(filter)
      .sort(sortOption)
      .limit(Number(limit))
      .skip(skip);
      
    const total = await Project.countDocuments(filter);
    
    return res.status(200).json({
      projects,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get single project by ID
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Get stakes for this project
    const totalStakers = await Stake.countDocuments({ 
      projectId: project._id,
      status: { $in: ['processed', 'claimed'] }
    });
    
    return res.status(200).json({
      project,
      totalStakers,
      progress: project.goalAmount > 0 ? (project.currentAmount / project.goalAmount) * 100 : 0,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Create a stake for a project
export const createStake = async (req: Request, res: Response) => {
  try {
    const { projectId, amount, address, intent } = req.body;
    
    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify project is active
    if (project.status !== 'active') {
      return res.status(400).json({ message: `Cannot stake on ${project.status} project` });
    }
    
    // Create stake record
    const stake = new Stake({
      projectId,
      amount,
      address,
      intent,
      status: 'pending'
    });
    
    await stake.save();
    
    return res.status(201).json({
      message: 'Stake intent created successfully',
      stake
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get stakes by user address
export const getStakesByAddress = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    const stakes = await Stake.find({ address })
      .populate('projectId', 'title status')
      .sort({ createdAt: -1 });
      
    return res.status(200).json({ stakes });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
