const express = require("express");
const bookRoute = require("../routes/books.route.js");
const app = express();

app.use(express.json());

app.get("/api/status", (req, res) => {
  res.status(200).json({ message: "Everything is OK!" });
});

app.use("/api/books", bookRoute);

module.exports = app;
