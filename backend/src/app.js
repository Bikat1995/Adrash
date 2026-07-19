const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./modules/auth/routes');
const orderRoutes = require('./modules/orders/routes');
const driverRoutes = require('./modules/drivers/routes');
const userRoutes = require('./modules/users/routes');
const { errorHandler } = require('./middleware/error');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);
app.use('/driver', driverRoutes);
app.use('/me', userRoutes);

app.use(errorHandler);

module.exports = app;
