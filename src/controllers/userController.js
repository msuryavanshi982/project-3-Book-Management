const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const v = require("../validators/validation");

//_Create User_//

const createUser = async function (req, res) {
  try {
    let requestBody = req.body;
    let { title, name, phone, email, password, address } = requestBody;

    if (!v.isvalidRequest(requestBody))
      return res
        .status(400)
        .send({ status: false, message: "user data is required in body" });

    if (Object.keys(requestBody).length > 6)
      return res
        .status(400)
        .send({ status: false, message: "extra keys are not allowed" });

    if (!v.isValidSpace(title))
      return res
        .status(400)
        .send({ status: false, message: "title is mandatory" });
    if (!v.isValidTitle(title))
      return res
        .status(400)
        .send({
          status: false,
          message: "title should be either Miss., Mrs. or Mr.",
        });

    if (!v.isValidSpace(name))
      return res
        .status(400)
        .send({ status: false, message: "name is mandatory" });
    if (!v.isValidString(name))
      return res
        .status(400)
        .send({ status: false, message: "Name should be in alphabet" });

    if (!v.isValidSpace(phone))
      return res
        .status(400)
        .send({ status: false, message: "phone is mandatory" });
    if (!v.isValidMobileNumber(phone))
      return res
        .status(400)
        .send({
          status: false,
          message: "Enter a valid 10 digit phone number",
        });

    if (!v.isValidSpace(email))
      return res
        .status(400)
        .send({ status: false, message: "email is mandatory" });
    if (!v.isLowerCase(email))
      return res
        .status(400)
        .send({ status: false, message: "enter email in lower case" });
    if (!v.isValidEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "enter email in valid format" });

    //-checks the duplicacy value from db--email,phone->>>
    const isUnique = await userModel.find({
      $or: [{ email: email }, { phone: phone }],
    });
    if (isUnique.length >= 1) {
      if (isUnique.length == 1) {
        if (isUnique[0].phone == phone) {
          return res
            .status(400)
            .send({ status: false, message: "phone already exist" });
        }
        if (isUnique[0].email == email) {
          return res
            .status(400)
            .send({ status: false, message: "Email already exist" });
        }
      } else {
        return res
          .status(400)
          .send({ status: false, message: "phone and email already exist" });
      }
    }

    if (!v.isValidSpace(password))
      return res
        .status(400)
        .send({ status: false, message: "password is mandatory" });
    if (!v.isValidPassword(password))
      return res
        .status(400)
        .send({
          status: false,
          message:
            "Enter valid password and password length should be minimum 8-15 characters",
        });

    if (!v.isValidSpace(address))
      return res
        .status(400)
        .send({ status: false, message: "address is mandatory" });
    if (!(typeof address === "object"))
      return res
        .status(400)
        .send({ status: false, message: "address should be in object" });

    let { street, city, pincode } = address;

    if (!v.isValidSpace(street))
      return res
        .status(400)
        .send({ status: false, message: "street is mandatory" });
    if (!v.isValidSpace(city))
      return res
        .status(400)
        .send({ status: false, message: "city is mandatory" });

    if (!v.isValidSpace(pincode))
      return res
        .status(400)
        .send({ status: false, message: "pincode is mandatory" });
    if (!v.isvalidPincode(pincode))
      return res
        .status(400)
        .send({
          status: false,
          message: "valid pincode is mandatory of 6 digit",
        });

    let userData = await userModel.create(requestBody);
    return res
      .status(201)
      .send({ status: true, message: "Success", data: userData });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

//-Login User-//

const login = async function (req, res) {
  try {
    let requestBody = req.body;
    if (!requestBody)
      return res
        .status(400)
        .send({ status: false, message: "user data is required in body" });
    let { email, password } = requestBody;
    if (Object.keys(requestBody).length > 2)
      return res
        .status(400)
        .send({ status: false, message: "extra keys are not allowed" });

    if (!v.isValidSpace(email))
      return res
        .status(400)
        .send({ status: false, message: "email is mandatory" });
    if (!v.isLowerCase(email))
      return res
        .status(400)
        .send({ status: false, message: "enter email in lower case" });
    if (!v.isValidEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "enter email in valid format" });

    if (!v.isValidSpace(password))
      return res
        .status(400)
        .send({ status: false, message: "password is mandatory" });
    if (!v.isValidPassword(password))
      return res
        .status(400)
        .send({ status: false, message: "Enter valid password" });

    let userData = await userModel.findOne({
      email: email,
      password: password,
    });
    if (!userData)
      return res
        .status(404)
        .send({ status: false, message: "user or password is incorrect" });

    //token creation
    let token = jwt.sign(
      {
        userId: userData._id.toString(),
        iat: Math.floor(Date.now() / 1000),
      },
      "book-management",
      { expiresIn: "200m" }
    );

    res.setHeader("x-api-key", token);
    return res
      .status(201)
      .send({ status: true, message: "Success", data: token });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { createUser, login };
