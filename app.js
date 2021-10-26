require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorsHandler = require('./middlewares/errorsHandler');

const { PORT = 3000 } = process.env;

const app = express();

// Подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(bodyParser.json());

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(errorLogger);

app.use(auth);
app.use(router);

app.use(errorsHandler);

app.listen(PORT);
