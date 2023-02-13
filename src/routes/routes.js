const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController");
const mid = require("../middleware/mid");
const aws = require("aws-sdk");

router.post("/register", userController.createUser); //create user

router.post("/login", userController.login); //login user

router.post(
  "/books",
  mid.authentication,
  mid.authorisation,
  bookController.createBook
); //create book

router.get("/books", mid.authentication, bookController.getBook); //get books by query

router.get("/books/:bookId", mid.authentication, bookController.getBookById); //get books by params

router.put(
  "/books/:bookId",
  mid.authentication,
  mid.authorisation,
  bookController.updateBook
); //update books

router.delete(
  "/books/:bookId",
  mid.authentication,
  mid.authorisation,
  bookController.deleteBook
); //delete book by id

router.post("/books/:bookId/review", reviewController.createReview); //create review

router.put("/books/:bookId/review/:reviewId", reviewController.updatereview); //update review

router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview); //delete review

//-AWS S3 Configration & Connection->>>

aws.config.update({
  accessKeyId: "AKIAY7BBJRBX3GXF4DJ4", //AKIAY3L35MCRZNIRGT6N
  secretAccessKey: "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", // 9f+YFBVcSjZWM6DG9R4TUN8k8TGe4X+lXmO4jPiU
  region: "ap-south-1",
});
let uploadFile = async (file) => {
  return new Promise(function (resolve, reject) {
    // this function will upload file to aws and return the link
    let s3 = new aws.S3({ apiVersion: "2006-03-01" }); // we will be using the s3 service of aws

    var uploadParams = {
      // ACL: "public-read",
      Bucket: "my-new-bucket-of-aws", //HERE   classroom-training-bucket
      Key: "book-management/" + file.originalname, //HERE
      Body: file.buffer,
    };
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        return reject({ error: err });
      }
      console.log(data);
      console.log("file uploaded succesfully");
      return resolve(data.Location);
    });
    // let data= await s3.upload( uploadParams)
    // if( data) return data.Location
    // else return "there is an error"
  });
};

router.post("/write-file-aws", async function (req, res) {
  try {
    let files = req.files;
    if (files && files.length > 0) {
      //upload to s3 and get the uploaded link
      // res.send the link back to frontend/postman
      let uploadedFileURL = await uploadFile(files[0]);
      res
        .status(201)
        .send({ msg: "file uploaded succesfully", data: uploadedFileURL });
    } else {
      res.status(400).send({ msg: "No file found" });
    }
  } catch (err) {
    res.status(500).send({ msg: err });
  }
});

module.exports = router;
