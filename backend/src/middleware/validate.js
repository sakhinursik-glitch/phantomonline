function validate(fields) {
  return (req, res, next) => {
    for (const field of fields) {
      const value = field.getter ? field.getter(req) : req.body[field.name];
      if (field.required && (value === undefined || value === null || value === '')) {
        return res.status(400).json({ error: field.message || `Поле "${field.name}" обязательно` });
      }
      if (field.type === 'email' && value) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(value)) {
          return res.status(400).json({ error: 'Некорректный email' });
        }
      }
      if (field.type === 'phone' && value) {
        const digits = String(value).replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 15) {
          return res.status(400).json({ error: 'Некорректный номер телефона' });
        }
      }
      if (field.minLength && value && String(value).length < field.minLength) {
        return res.status(400).json({ error: `${field.name}: минимум ${field.minLength} символов` });
      }
      if (field.max && value && Number(value) > field.max) {
        return res.status(400).json({ error: `${field.name}: слишком большое значение` });
      }
    }
    next();
  };
}

module.exports = { validate };
