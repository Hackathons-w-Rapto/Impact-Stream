import express from 'express';
import { getProjects, getProjectById, createStake, getStakesByAddress } from '../controllers/project.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management and stake operations
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     description: Retrieve a list of all projects with optional filtering
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, upcoming, completed]
 *         description: Filter by project status
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by project tag
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [goal, progress, deadline]
 *         description: Sort projects by field
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of projects per page
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get('/', getProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     description: Retrieve project details by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 *       404:
 *         description: Project not found
 */
router.get('/:id', getProjectById);

/**
 * @swagger
 * /api/projects/stake:
 *   post:
 *     summary: Create a new stake
 *     description: Submit a stake intent for a project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *               amount:
 *                 type: number
 *               address:
 *                 type: string
 *               intent:
 *                 type: string
 *     responses:
 *       201:
 *         description: Stake created successfully
 *       400:
 *         description: Invalid stake data or project status
 *       404:
 *         description: Project not found
 */
router.post('/stake', createStake);

/**
 * @swagger
 * /api/projects/stakes/{address}:
 *   get:
 *     summary: Get stakes by address
 *     description: Get all stakes created by a specific address
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: User wallet address
 *     responses:
 *       200:
 *         description: List of stakes
 */
router.get('/stakes/:address', getStakesByAddress);

export default router;
