const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, resp, next) => {
    Order.find()
        .select('-__v')
        .exec()
        .then(docs => {
            resp.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        amount: doc.amount,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:5000/orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            resp.status(500).json({
                error: err
            });    
        });
});

router.post("/", (req, resp, next) => {
    Product.findById(req.body.id)
        .then(product => {
        if (!product) {
            return resp.status(404).json({
            message: "Product does not exist"
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            amount: req.body.amount,
            product: req.body.productId
        });
        return order.save();
        })
        .then(result => {
        resp.status(201).json({
            message: "Order added to database",
            createdOrder: {
            _id: result._id,
            product: result.product,
            amount: result.amount
            },
            request: {
            type: "GET",
            url: "http://localhost:5000/orders/" + result._id
            }
        });
        })
        .catch(err => {
        resp.status(500).json({
            error: err
        });
        });
    });

router.get('/:id', (req, resp, next) => {
    Order.findById(req.params.id)
        .exec()
        .then(doc => {
        if (!doc) {
            return resp.status(404).json({
            message: 'Order does not exist'
            });
        }
        resp.status(200).json(doc);
        })
        .catch(err => {
            resp.status(500).json({
                error: err
            });
        });
});

router.delete('/:id', (req, resp, next) => {
    Order.remove({ _id: req.params.id })
        .exec()
        .then(result => {
            resp.status(200).json({
                message: 'Order deleted'
            });
        })
        .catch(err => {
            error: err
        });
});

module.exports = router;