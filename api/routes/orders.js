const express = require('express');
const router = express.Router();

router.get('/', (req, resp, next) => {
    resp.status(200).json({
        message: 'Orders were fetched'
    });
});

router.post('/', (req, resp, next) => {
    const order = {
        productId: req.body.id,
        amount: req.body.amount
    }
    resp.status(201).json({
        message: 'Order was created',
        order
    });
});

router.get('/:id', (req, resp, next) => {
    resp.status(200).json({
        message: 'Order details',
        id: req.params.id
    });
});

router.delete('/:id', (req, resp, next) => {
    resp.status(200).json({
        message: 'Order deleted',
        id: req.params.id
    });
});

module.exports = router;