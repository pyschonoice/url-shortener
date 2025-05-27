require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require('helmet')
const path = require('path');
const cors = require('cors')
const rateLimiter = require('express-rate-limit')
const app = express();

const FRONTEND_ORIGINS = [
  process.env.CORS_ORIGIN,   
  process.env.URL,           
  'http://localhost:3000'    ]

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g. mobile apps, curl)
      if (!origin) return callback(null, true);
      if (FRONTEND_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

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
app.post("/api/create",createLimiter,validateCreateUrl, urlController.urlCreate);
app.get('/api/:url',validateShortUrlParam, urlController.urlRedirect);
app.get('/api/analytics/:url',validateShortUrlParam, urlController.urlAnalytics);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Connected to DB");
  } catch (err) {
    console.log(`Errors while connecting to db ${err}`);
  }
};

// const port = process.env.PORT || 4000;

// const main = async () => {
//   try {
//     await connectDB();
//     app.listen(port, () => {
//       console.log(`Listening at port ${port}`);
//     });
//   } catch (err) {
//     console.log(`Errors while loading the server`);
//   }
// };

// main();

connectDB();

// export for Vercel serverless function
module.exports = app;