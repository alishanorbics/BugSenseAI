const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const requestLogger = require('./src/middleware/requestlog');
const errorHandler = require('./src/middleware/error');
const routes = require('./src/routes/index');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use(errorHandler);

module.exports = app;
