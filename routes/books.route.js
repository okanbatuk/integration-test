const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const httpStatus = require("http-status");
const bookData = require("../data/books.json");
let { save } = require("../helper/saveBook");

router
  .route("/")
  .get((req, res, next) => {
    res.status(200).json(bookData);
  })
  .post(
    [
      check("title", "Book title is required").not().isEmpty(),
      check("author", "Author name is required").not().isEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(httpStatus.BAD_REQUEST).json({
          errors: errors.array(),
        });

      bookData.push({
        id: Math.random(),
        title: req.body.title,
        author: req.body.author,
      });

      let isSave = save(bookData);

      return isSave
        ? res.status(httpStatus.CREATED).json()
        : res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json("Something went wrong!");
    }
  );

router
  .route("/:bookid")
  .put((req, res) => {
    let { bookid } = req.params;
    let { title, author } = req.body;
    let updatedBook = {};

    let foundBook = bookData.find((book) => book.id == bookid);

    if (!foundBook) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: true, message: "Book not found" });
    }

    let updatedBooks = bookData.map((book) => {
      if (book.id == bookid) {
        updatedBook = {
          ...book,
          title,
          author,
        };
        return updatedBook;
      }
      return book;
    });

    let isSave = save(updatedBooks);

    return isSave
      ? res.status(httpStatus.NO_CONTENT).json()
      : res
          .status(httpStatus.BAD_REQUEST)
          .json({ error: true, message: "Something went wrong" });
  })
  .delete((req, res) => {
    let isSave = false;
    let { bookid } = req.params;

    let removeBookIndex = bookData.findIndex((obj) => obj.id == bookid);

    if (removeBookIndex > -1) {
      bookData.splice(removeBookIndex, 1);
      isSave = save(bookData);
    }

    return removeBookIndex
      ? isSave
        ? res
            .status(httpStatus.OK)
            .json({ message: `The book with ID ${bookid} has been deleted!` })
        : res
            .status(httpStatus.BAD_REQUEST)
            .json({ error: true, message: "Something went wrong" })
      : res
          .status(httpStatus.NOT_FOUND)
          .json({ error: true, message: "Book not found" });
  });
module.exports = router;
