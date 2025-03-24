import express from 'express';
import { punchController } from '../controllers/punchController.js';
import { loginController } from '../controllers/loginController.js';

const router = express.Router();

router.post('/punch', punchController.handlePunch);
router.post('/login', loginController.handleLogin);

export default router; 