const mongoose = require('mongoose');

const schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true 
    },
    amount: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', schema);