const express = require('express');
let books = require("./booksdb.js");
let valid = require("./auth_users.js").valid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password; 
  if (username && password) {
      if (valid(username)) {
          users.push({"username":username,"password":password});
          return res.status(200).json({message:`Customer is registered successfully`});
      }
      else {
          return res.status(400).json({message:`User already registered`});
      }
  }
  else {
      return res.status(400).json({message: "Enter username and password"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const book = books;
  return res.status(200).json(books); 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here 
   const bookISBN = books[req.params.isbn] 
  res.send(bookISBN).status(200);
 });

 
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookAuthor = Object.values(books).filter(book => book.author === author);
  res.status(200).send(bookAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookTitle = Object.values(books).filter(book => book.title === title);
  res.status(200).send(bookTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn; 
  if(books[isbn]){
      res.json(books[isbn].reviews);
  }
  else{
      res.json({message:`Book`});
  } 
});

module.exports.general = public_users;
