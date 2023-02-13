const mongoose = require("mongoose");

const isvalidISBN = function (isbn) {
  return /^(97[8|9]-)([0-9]{10,13}+)$/.test(isbn);
};

const isValidTitle = function (title) {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1;
};

const isValidPassword = function (password) {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(
    password
  );
};

const isvalidPincode = function (pincode) {
  return /^\d{6}$/.test(pincode);
};

const isvalidRating = function (rating) {
  return /^[1-5]$/.test(rating);
};

const isValidMobileNumber = function (number) {
  return /^[6-9]\d{9}$/.test(number); //9587412693
};

const isValidString = function (value) {
  let regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/;
  return regex.test(value); //Prince Soni
};

const isValidEmail = function (email) {
  return /^\S+@\S+\.\S+$/.test(email); //abc@gmail.com
};

const isLowerCase = function (name) {
  return /^([a-z.@\d]+)$/.test(name); //atoz
};

const isValidSpace = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isvalidRequest = function (body) {
  return Object.keys(body).length > 0; //plz enter the data in the body
};

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId); //24
};

const isValidDate = function (Date) {
  return /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(Date);
};

module.exports = {
  isvalidISBN,
  isValidTitle,
  isValidPassword,
  isvalidPincode,
  isvalidRating,
  isValidMobileNumber,
  isValidString,
  isValidEmail,
  isLowerCase,
  isValidSpace,
  isValidObjectId,
  isvalidRequest,
  isValidDate,
};
