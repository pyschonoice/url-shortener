require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require('helmet')
const path = require('path');
const cors = require('cors')
const rateLimiter = require('express-rate-limit')
const app = express();

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));
const urlController = require("./urlController");
const {
  validateCreateUrl,
  validateShortUrlParam,
} = require("./validator");


app.use(helmet());
app.use(express.json());
const createLimiter = rateLimiter({
  windowMs: 60*1000,   // 1 min
  max: 10,             // max 10 creates per IP
  message: "Too many links created, please try again later."
});

app.use(createLimiter)

app.post("/create",validateCreateUrl, urlController.urlCreate);
app.get('/:url',validateShortUrlParam, urlController.urlRedirect);
app.get('/analytics/:url',validateShortUrlParam, urlController.urlAnalytics);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Connected to DB");
  } catch (err) {
    console.log(`Errors while connecting to db ${err}`);
  }
};

const port = process.env.PORT;

const main = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Listening at port ${port}`);
    });
  } catch (err) {
    console.log(`Errors while loading the server`);
  }
};

main();
