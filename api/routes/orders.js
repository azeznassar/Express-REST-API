const express = require('express');
const router = express.Router();

const validateAuth = require('../auth/validateAuth');
const Orders = require('../controllers/orders');

router.get('/', validateAuth, Orders.getAll);
router.post('/', validateAuth, Orders.postOrder);
router.get('/:id', validateAuth, Orders.getOrder);
router.delete('/:id', validateAuth, Orders.deleteOrder);

module.exports = router;