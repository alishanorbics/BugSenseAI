const express = require('express');
const bugController = require('../controllers/bug.controller');
const commentRoutes = require('./comment.route');
const upload = require('../middleware/upload.middleware');
const validator = require('../middleware/validator');
const { createBugSchema, assignBugSchema, updateBugStatusSchema } = require('../helpers/validators');

const router = express.Router({ mergeParams: true });

router.post('/', upload.array('attachments', 5), validator(createBugSchema), bugController.createBug);
router.get('/', bugController.listBugs);
router.get('/:id', bugController.getBug);
router.patch('/:id/assign', validator(assignBugSchema), bugController.assignBug);
router.patch('/:id/status', validator(updateBugStatusSchema), bugController.updateBugStatus);
router.patch('/:id/verify', bugController.verifyBug);
router.patch('/:id/close', bugController.closeBug);
router.patch('/:id/reopen', bugController.reopenBug);
router.use('/:id/comments', commentRoutes);

module.exports = router;
