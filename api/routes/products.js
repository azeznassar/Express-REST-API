const express = require('express');
const multer = require('multer');
const router = express.Router();

const validateAuth = require('../auth/validateAuth');
const Products = require('../controllers/products');

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

router.get('/', Products.getAll);
router.post('/', validateAuth, upload.single('image'), Products.postProduct);
router.get('/:id', Products.getProduct);
router.patch('/:id', validateAuth, Products.patchProduct);
router.delete('/:id', validateAuth, Products.deleteProduct);

module.exports = router;