const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Please enter valid Name");
  } else if (!validator.isEmail(emailId))
    throw new Error("Please enter valid Email id");
  else if (!validator.isStrongPassword(password))
    throw new Error("Please enter valid Password");
};

module.exports = {
  validateSignUpData,
};
