import express from 'express';
import * as companyController from '../controllers/companyController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validateCreateCompany, validateUpdateCompany, validateId, validatePagination } from '../middlewares/validate.js';

const router = express.Router();

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     description: Retrieve a paginated list of all companies. Requires company.view permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, domain, email, GST number, or PAN number
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     companies:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Company'
 *                     pagination:
 *                       type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing company.view permission
 */
router.get('/', authenticate, authorize('company.view'), validatePagination, companyController.getAllCompanies);

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Companies]
 *     description: Retrieve a specific company by ID. Requires company.view permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     company:
 *                       $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing company.view permission
 */
router.get('/:id', authenticate, authorize('company.view'), validateId, companyController.getCompanyById);

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Create new company
 *     tags: [Companies]
 *     description: Create a new company. Requires company.create permission.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - domain
 *             properties:
 *               name:
 *                 type: string
 *                 example: Acme Corporation
 *               domain:
 *                 type: string
 *                 example: acmecorp.com
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               website:
 *                 type: string
 *                 format: url
 *               gstNumber:
 *                 type: string
 *                 example: 27AABCU9603R1ZX
 *               panNumber:
 *                 type: string
 *                 example: ABCDE1234F
 *               registrationNumber:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *               fax:
 *                 type: string
 *               industry:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing company.create permission
 *       409:
 *         description: Company with domain/GST/PAN already exists
 */
router.post('/', authenticate, authorize('company.create'), validateCreateCompany, companyController.createCompany);

/**
 * @swagger
 * /api/companies/{id}:
 *   patch:
 *     summary: Update company
 *     tags: [Companies]
 *     description: Update company information. Requires company.edit permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               domain:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               website:
 *                 type: string
 *                 format: url
 *               gstNumber:
 *                 type: string
 *               panNumber:
 *                 type: string
 *               registrationNumber:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *               fax:
 *                 type: string
 *               industry:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing company.edit permission
 *       409:
 *         description: Company with domain/GST/PAN already exists
 */
router.patch('/:id', authenticate, authorize('company.edit'), validateId, validateUpdateCompany, companyController.updateCompany);

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Delete company
 *     tags: [Companies]
 *     description: Delete a company. Requires company.delete permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing company.delete permission
 */
router.delete('/:id', authenticate, authorize('company.delete'), validateId, companyController.deleteCompany);

export default router;

