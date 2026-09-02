function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${err.message}`, err.stack);
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Некорректный JSON в запросе' });
  }
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: status === 500 ? 'Внутренняя ошибка сервера' : err.message,
  });
}

module.exports = { errorHandler };
