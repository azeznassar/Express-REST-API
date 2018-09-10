const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const Product = require('../models/product');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('The image must be .jpg or .png'), false);
    }
};

const upload = multer({ 
    storage, 
    limits: { fileSize: 1024 * 1024 * 7 },
    fileFilter,
});

router.get('/', (req, resp) => {
    Product.find()
        .select('-__v')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        image: `http://localhost:5000/${doc.image}`,
                        request: {
                            type: 'GET',
                            url: `http://localhost:5000/products/${doc._id}`
                        }
                    };
                })
            };
            if (docs.length >= 0) {
                resp.status(200).json(response);
            } else {
                resp.status(200).json({ message: 'No entries found' });
            }
        })
        .catch(error => resp.status(500).json({ error }));
});

router.post('/', upload.single('image'), (req, resp) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        image: req.file.path
    });

    product.save().then(result => {
        resp.status(201).json({
            message: 'Product added to database',
            product: {
                _id: result._id,
                name: result.name,
                price: result.price,
                image: `http://localhost:5000/${result.image}`,
                request: {
                    type: 'GET',
                    url: `http://localhost:5000/products/${result._id}`
                }
            }
        });
    })
        .catch(error => resp.status(500).json({ error }));
});

router.get('/:id', (req, resp) => {
    const id = req.params.id;
    Product.findById(id) 
        .select('-__v')
        .exec()
        .then(doc => {
            if (doc) {
                resp.status(200).json(doc);
            } else {
                resp.status(404).json({ error: 'No valid entry found for ID' });
            }
        })
        .catch(error => resp.status(500).json({ error }));
});

router.patch('/:id', (req, resp) => {
    const id = req.params.id;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    } 

    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(() => {
            resp.status(200).json({ 
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: `http://localhost:5000/products/${id}`
                }
            });
        })
        .catch(error => resp.status(500).json({ error }));
});

router.delete('/:id', (req, resp) => {
    const id = req.params.id;
    Product.deleteOne({ _id: id })
        .exec()
        .then(() => resp.status(200).json({ message: 'Product deleted' }))
        .catch(error => resp.status(500).json({ error }));
});

module.exports = router;