const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

//mongoose.connect(`mongodb+srv://asn0057:${process.env.MONGO_DB}@cluster0-aoist.mongodb.net/test?retryWrites=true`, { useNewUrlParser: true });
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, resp, next) => {
    resp.header('Access-Control-Allow-Origin', '*');
    resp.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        resp.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return resp.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, resp, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});

app.use((err, req, resp, next) => {
    resp.status(err.status || 500);
    resp.json({ message: err.message })
});







//If anyone else has this problem just replace Product.remove({ _id: id }) with Product.findByIdAndRemove(id) it worked for me