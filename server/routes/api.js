import express from 'express';
import { punchController } from '../controllers/punchController.js';
import { loginController } from '../controllers/loginController.js';
import { employeeController } from '../controllers/employeeController.js';
import { shiftController } from '../controllers/shiftController.js';

const router = express.Router();

router.post('/punch', punchController.handlePunch);
router.post('/login', loginController.handleLogin);

// New employee management routes
router.get('/employees', employeeController.getAllEmployees);
router.post('/employees', employeeController.addEmployee);
router.put('/employees/:id', employeeController.updateEmployee);
router.delete('/employees/:id', employeeController.deleteEmployee);

// Shift routes
router.get('/shifts', shiftController.getShifts);
router.put('/shifts/:id', shiftController.updateShift);
router.delete('/shifts/:id', shiftController.deleteShift);
router.post('/shifts', shiftController.addShift);

export default router; 