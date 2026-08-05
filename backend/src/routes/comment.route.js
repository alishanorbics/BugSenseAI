const express = require('express');
const commentController = require('../controllers/comment.controller');
const validator = require('../middleware/validator');
const { createCommentSchema } = require('../helpers/validators');

const router = express.Router({ mergeParams: true });

router.post('/', validator(createCommentSchema), commentController.createComment);
router.get('/', commentController.listComments);

module.exports = router;
