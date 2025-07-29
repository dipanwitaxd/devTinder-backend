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

const validateProfileData = (req) => {
  const data = req.body;
  const ALLOWED_FEILDS_UPDATE = [
    "firstName",
    "lastName",
    "skills",
    "about",
    "photoUrl",
    "gender",
    "age",
  ];
  const isUpdateAllowed = Object.keys(data).every((item) =>
    ALLOWED_FEILDS_UPDATE.includes(item)
  );
  return isUpdateAllowed;
};

const validatePreviousPassword = async (req) => {};

module.exports = {
  validateSignUpData,
  validateProfileData,
};
