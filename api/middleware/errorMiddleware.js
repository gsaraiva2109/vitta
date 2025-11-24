import logger from '../config/logger.js';
import AppError from '../utils/AppError.js';

const handleSequelizeValidationError = (err) => {
  const errors = err.errors.map(e => ({ message: e.message, field: e.path }));
  const message = 'Erro de validação';
  return new AppError(message, 400, errors);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    details: err.details,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      details: err.details,
    });
  // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    logger.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Algo deu muito errado!',
    });
  }
};

export default function errorMiddleware(err, req, res, _next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  if (error.name === 'SequelizeValidationError') {
    error = handleSequelizeValidationError(error);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
}
