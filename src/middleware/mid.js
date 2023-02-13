const jwt = require("jsonwebtoken");
const booksModel = require("../models/booksModel");
const v = require("../validators/validation");

//_Authentication_

let authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token)
      return res
        .status(400)
        .send({ status: false, message: "token must be present" });

    jwt.verify(token, "book-management", (err, user) => {
      if (err) {
        return res.status(401).send("invalid token");
      }

      req.userLoggedIn = user;
      next();
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//_Authorization_
let authorisation = async function (req, res, next) {
  try {
    req.BookId = req.params.bookId;
    let bodyUserId = req.body.userId;

    //_Authorization For Create book(post)_
    if (!req.BookId) {
      if (!bodyUserId)
        return res
          .status(400)
          .send({ status: false, message: "UserId is mandatory" });
      if (!v.isValidObjectId(bodyUserId))
        return res
          .status(400)
          .send({ status: false, message: "valid userId is mandatory" });

      if (req.userLoggedIn.userId != bodyUserId)
        return res
          .status(201)
          .send({ status: false, message: "Failed Authorisation" });
    }

    //_Authorization For Book Get/put/delete_

    if (req.BookId) {
      if (!v.isValidObjectId(req.BookId))
        return res
          .status(400)
          .send({ status: false, message: "bookId is not valid" });

      req.book = await booksModel.findOne({ _id: req.BookId });

      if (!req.book)
        return res
          .status(404)
          .send({ status: false, message: "BookId not exist" });

      let userId = req.book.userId;

      if (req.userLoggedIn.userId != userId)
        return res
          .status(403)
          .send({ status: false, message: "User is unauthorised" });
    }

    next();
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { authentication, authorisation };
