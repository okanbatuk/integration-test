const fs = require("fs");
const path = require("path");

let save = async (bookData) => {
  try {
    let filePath = path.join(__dirname, "../data/books.json");
    fs.writeFileSync(filePath, JSON.stringify(bookData));
    return Promise.resolve(true);
  } catch (error) {
    console.log(error);
    return Promise.reject(false);
  }
};

module.exports = { save };
