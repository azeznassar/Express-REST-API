const express = require('express');
const router = express.Router();

router.get('/', (req, resp, next) => {
    resp.status(200).json({
        message: 'handling GET requests to /products'
    });
});

router.post('/', (req, resp, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    resp.status(201).json({
        message: 'handling POST requests to /products',
        product
    });
});

router.get('/:id', (req, resp, next) => {
    const id = req.params.id;
    if (id === "testing") {
        resp.status(200).json({
            message: 'you discovered the ID',
            id: id
        });
    } else {
        resp.status(200).json({
            message: 'you passed an ID'
        });      
    }
});

router.patch('/:id', (req, resp, next) => {
    resp.status(200).json({
        message: 'Updated product'
    });
});

router.delete('/:id', (req, resp, next) => {
    resp.status(200).json({
        message: 'Deleted product'
    })
});

module.exports = router;