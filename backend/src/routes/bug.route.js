const express = require('express');
const bugController = require('../controllers/bug.controller');
const upload = require('../middleware/upload.middleware');
const validator = require('../middleware/validator');
const { createBugSchema } = require('../helpers/validators');

const router = express.Router({ mergeParams: true });

router.post('/', upload.array('attachments', 5), validator(createBugSchema), bugController.createBug);
router.get('/', bugController.listBugs);
router.get('/:id', bugController.getBug);

module.exports = router;
