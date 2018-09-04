const express = require('express');
const Product = require('../models/product');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/', (req, resp, next) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                resp.status(200).json(docs);
            } else {
                resp.status(200).json({
                    message: 'No entries found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            resp.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, resp, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save().then(result => {
        console.log(result);
        resp.status(201).json({
            message: 'handling POST requests to /products',
            product: result
        });
    })
    .catch(err => {
        console.log(err);
        resp.status(500).json({
            error: err
        });
    });
});

router.get('/:id', (req, resp, next) => {
    const id = req.params.id;
    Product.findById(id) 
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                resp.status(200).json(doc);
            } else {
                resp.status(404).json({ error: 'No valid entry found for ID' });
            }
        })
        .catch(err => {
            resp.status(500).json({
                error: err
            });
        });
});

router.patch('/:id', (req, resp, next) => {
    const id = req.params.id;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    } 

    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            resp.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            resp.status(500).json({
                error: err
            });
        });
});

router.delete('/:id', (req, resp, next) => {
    const id = req.params.id;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            resp.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            resp.status(500).json({
                error: err
            });
        });
});

module.exports = router;