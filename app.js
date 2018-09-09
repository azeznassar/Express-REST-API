const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

const app = express();
const port = process.env.PORT || 5000;
const dbURL = `mongodb+srv://asn0057:${process.env.MONGO_DB}@cluster0-aoist.mongodb.net/test?retryWrites=true?`;
/* eslint-disable no-console */
app.listen(port, () => console.log(`Server running on port ${port}`));
mongoose.connect(dbURL);
mongoose.Promise = global.Promise;

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
    const err = new Error('No such API end point');
    err.status = 404;
    next(err);
});

app.use((err, req, resp) => {
    resp.status(err.status || 500);
    resp.json({ message: err.message });
});