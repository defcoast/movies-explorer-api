require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorsHandler = require('./middlewares/errorsHandler');
const { MONGO_URL } = require('./config');
const { limiter } = require('./middlewares/rateLimiter');
const helmet = require('helmet');
const cors = require('cors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());

// Подключаемся к серверу mongo
mongoose.connect(MONGO_URL);

app.use(bodyParser.json());
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT);
