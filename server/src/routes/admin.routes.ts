import express from 'express';
import { 
  register, 
  login, 
  createProject, 
  updateProject, 
  deleteProject, 
  getAdminProjects 
} from '../controllers/admin.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin authentication and project management
 */

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register new admin
 *     description: Create a new admin account
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Admin already exists
 */
router.post('/register', register);

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Login admin
 *     description: Login with admin credentials
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/admin/projects:
 *   post:
 *     summary: Create new project
 *     description: Create a new staking project
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               goalAmount:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               stakingConditions:
 *                 type: string
 *               rewardStructure:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/projects', authenticateAdmin, createProject);

/**
 * @swagger
 * /api/admin/projects:
 *   get:
 *     summary: Get admin's projects
 *     description: Get all projects created by the authenticated admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *       401:
 *         description: Unauthorized
 */
router.get('/projects', authenticateAdmin, getAdminProjects);

/**
 * @swagger
 * /api/admin/projects/{id}:
 *   put:
 *     summary: Update project
 *     description: Update an existing project
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               goalAmount:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [active, upcoming, completed]
 *               stakingConditions:
 *                 type: string
 *               rewardStructure:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to update this project
 *       404:
 *         description: Project not found
 */
router.put('/projects/:id', authenticateAdmin, updateProject);

/**
 * @swagger
 * /api/admin/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     description: Delete an existing project
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to delete this project
 *       404:
 *         description: Project not found
 */
router.delete('/projects/:id', authenticateAdmin, deleteProject);

export default router;
