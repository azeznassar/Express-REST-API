const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const saltRounds = 10;
const authFailedMsg = 'Incorrect email address or password';

exports.signUp = (req, resp) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return resp.status(422).json({
                    message: 'User with this email address already exists'
                });
            } else {
                bcrypt.hash(req.body.password, saltRounds, function(error, hash) {
                    if(error) {
                        return resp.status(500).json({ error });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                resp.status(201).json({
                                    message: 'User created and added to database'
                                });
                                // eslint-disable-next-line no-console
                                console.log(result);
                            })
                            .catch(error => resp.status(500).json({ error }));
                    }
                });
            }
        });
};

exports.logIn = (req, resp) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length < 1) {
                return resp.status(401).json({
                    message: authFailedMsg
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (error, res) => {
                if (error) {
                    return resp.status(401).json({
                        message: authFailedMsg
                    });                    
                }
                if (res) {
                    const token = jwt.sign({
                        email: user[0].email,
                        id: user[0]._id
                    }, process.env.JWT, {
                        expiresIn: '2h'
                    });

                    return resp.status(200).json({
                        message: 'User authentication successful',
                        token
                    });
                }
                resp.status(401).json({
                    message: authFailedMsg
                });  
            });
        })
        .catch(error => resp.status(500).json({ error }));
};

exports.deleteUser = (req, resp) => {
    User.remove({ _id: req.params.id })
        .exec()
        .then(() => {
            resp.status(200).json({
                message: 'User deleted from database'
            });
        })
        .catch(error => resp.status(500).json({ error }));
};