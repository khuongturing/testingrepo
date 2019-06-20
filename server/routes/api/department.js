import express from 'express';
import DepartmentController from '../../controllers/departmentController';
import departmentCaching from '../../middlewares/caching/departmentCaching';

const router = express.Router();
router.get('/departments', departmentCaching.allDepartmentsCaching, DepartmentController.viewAllDepartments);
router.get('/departments/:department_id', DepartmentController.viewSingleDepartment);

export default router;
