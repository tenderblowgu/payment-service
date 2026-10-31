'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
app.use('/payments', require('./routes/payments'));
app.listen(process.env.PORT || 3001, () => console.log('payment-service ready'));
module.exports = app;
