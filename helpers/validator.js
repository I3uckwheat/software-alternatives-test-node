exports.validate = fields => {
  return (req, res, next) => {
    console.log(req.file);
    const isValid = Object.entries(fields).every(([field, validateMethod]) => {
      return validator(req.body[field], validateMethod);
    });

    if (isValid) return next();
    res.send('Failed To Validate');
  };
};

function validator(item, validateMethod) {
  switch (validateMethod) {
    case 'email':
      return emailValidator(item);
    case 'exists':
      return existsValidator(item);
    default:
      return true;
  }
}

function emailValidator(email) {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

function existsValidator(item) {
  return item != null && item !== '';
}
