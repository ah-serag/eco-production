const express = require('express');
const { getProductBySlug } = require('../../control/PreviewProCon/PreviewPro_Con');
const router = express.Router();

router.get('/:slug', getProductBySlug);

module.exports = router;