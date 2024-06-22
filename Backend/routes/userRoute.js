import express from 'express';
import { createUser } from '../controllers/userControllers.js';

//router instance created
const router = express.Router();

//defines new route on router object
router.post('/new', createUser);


export default router;