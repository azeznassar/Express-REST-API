const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.getAll = (req, resp) => {
    Order.find()
        .select('-__v')
        .populate('product', 'name')
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
                            url: `http://localhost:5000/orders/${doc._id}`
                        }
                    };
                })
            });
        })
        .catch(error => resp.status(500).json({ error }));
};

exports.postOrder = (req, resp) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return resp.status(404).json({ message: 'Product does not exist' });
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
                message: 'Order added to database',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    amount: result.amount
                },
                request: {
                    type: 'GET',
                    url: `http://localhost:5000/orders/${result._id}`
                }
            });
        })
        .catch(error => resp.status(500).json({ error }));
};

exports.getOrder = (req, resp) => {
    Order.findById(req.params.id)
        .select('-__v')
        .populate('product', '-__v')
        .exec()
        .then(doc => {
            if (!doc) {
                return resp.status(404).json({ message: 'Order does not exist' });
            }
            resp.status(200).json(doc);
        })
        .catch(error => resp.status(500).json({ error }));
};

exports.deleteOrder = (req, resp) => {
    Order.deleteOne({ _id: req.params.id })
        .exec()
        .then(() => resp.status(200).json({ message: 'Order deleted' }))
        .catch(error => resp.status(500).json({ error }));
};