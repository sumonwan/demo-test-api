const _ = require('lodash'); //
const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const {User} = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({email : req.body.email});
    if (!user) return res.status(400).send('Invalid email or password.'); 

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if(!isValid) return res.status(400).send('Invalid email or password.');

    // jwtPK for sign JSONwebtoken
    const tk = user.generateAuthToken();
    res.send(tk);
});

  function validate(req) {
    const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(req, schema);
  }

  module.exports = router;