import { Router } from 'express';
import userRoutes from '@api/users/user.route';
import pageAreaRoutes from '@api/pageAreas/pageAreas.route';
import brandRoutes from '@api/brand/brand.route';
import groupRoutes from '@api/groups/group.route';
import companyRoutes from '@api/company/company.route';
import permissionRoutes from '@api/permissions/permission.route';

const router = Router();

router.use('/users', userRoutes);
router.use('/page-areas', pageAreaRoutes);
router.use('/groups', groupRoutes);
router.use('/brands', brandRoutes);
router.use('/company', companyRoutes);
router.use('/permissions', permissionRoutes);

export default router;
