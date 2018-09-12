const express = require('express');
const router = express.Router();

const validateAuth = require('../auth/validateAuth');
const Users = require('../controllers/user');

router.post('/signup', Users.signUp);
router.post('/login', Users.logIn);
router.delete('/:id', validateAuth, Users.deleteUser);

module.exports = router;