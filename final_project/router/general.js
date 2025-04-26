const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

//Task 6
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

//Task 10
const getBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  getBooks().then(
    (result) => res.status(200).json({ book: result }),
    (error) => res.status(error.status).json({ message: error.message })
  );
});

//Task 11
const getBookByISBM = (isbm) => {
  return new Promise((resolve, reject) => {
    const book = books[isbm];
    if (book) {
      resolve(book);
    } else {
      reject({ status: 404, message: `ISBN ${isbn} not found` });
    }
  });
};

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  getBookByISBM(req.params.isbn).then(
    (result) => res.status(200).json({ book: result }),
    (error) => res.status(error.status).json({ message: error.message })
  );
});

// Task 12
const getBookByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const booksByAuthor = [];
    for (let isbn in books) {
      if (books[isbn].author === author) {
        booksByAuthor.push(books[isbn]);
      }
    }
    if (booksByAuthor.length === 0) {
      reject({ status: 404, message: "No books found for the given author" });
    } else {
      resolve(booksByAuthor);
    }
  });
};

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  getBookByAuthor(author).then(
    (result) => res.status(200).json({ book: result }),
    (error) => res.status(error.status).json({ message: error.message })
  );
});

// Task 13
const getBookByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const booksByTitle = [];
    for (let isbn in books) {
      if (books[isbn].title === title) {
        booksByTitle.push(books[isbn]);
      }
    }
    if (booksByTitle.length === 0) {
      reject({
        status: 404,
        message: "No books found for the given title",
      });
    } else {
      resolve(booksByTitle);
    }
  });
};

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  getBookByTitle(title).then(
    (result) => res.status(200).json({ book: result }),
    (error) => res.status(error.status).json({ message: error.message })
  );
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(400).json({ message: "Book not found" });
  }
  return res.status(200).json({ review: book.reviews });
});

module.exports.general = public_users;
