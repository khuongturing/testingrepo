import { Router } from 'express';
import DepartmentController from '../../controllers/departments.controllers';
let UtilityHelper = require('../../lib/utilityHelper')

const router = Router();

router.get('/departments',UtilityHelper.validateToken, DepartmentController.getAllDepartments);
router.get('/departments/:department_id',UtilityHelper.validateToken, DepartmentController.getSingleDepartment);


export default router;
