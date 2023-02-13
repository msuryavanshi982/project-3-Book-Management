const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/routes");
const multer = require("multer");

const app = express();
app.use(express.json()); //bson
app.use(multer().any());
const port = 3000;

mongoose
  .connect(
    "mongodb+srv://group67:n1plamTjStICrIRT@cluster0.e8wifql.mongodb.net/group67",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDB Running"))
  .catch((err) => console.log(err));

app.use("/", route);

app.use("/*",  (req, res) =>{
  return res.status(400).send({ status: false, msg: "You Are In Wrong Path" });
});

app.listen(port, function () {
  console.log("Express Running on " + port);
});
