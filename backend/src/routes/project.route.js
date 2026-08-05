const express = require('express');
const projectController = require('../controllers/project.controller');
const bugRoutes = require('./bug.route');
const { AuthVerifier } = require('../middleware/auth.middleware');
const validator = require('../middleware/validator');
const { createProjectSchema, updateProjectSchema, addMemberSchema } = require('../helpers/validators');

const router = express.Router();

router.use(AuthVerifier);

router.post('/', validator(createProjectSchema), projectController.createProject);
router.get('/', projectController.listProjects);
router.get('/:id', projectController.getProject);
router.patch('/:id', validator(updateProjectSchema), projectController.updateProject);
router.get('/:id/members', projectController.listMembers);
router.post('/:id/members', validator(addMemberSchema), projectController.addMember);
router.delete('/:id/members/:member_id', projectController.removeMember);

router.use('/:project_id/bugs', bugRoutes);

module.exports = router;
