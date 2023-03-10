const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password; 
  if (username && password) {
      if (isValid(username)) {
          users.push({"username":username,"password":password});
          return res.status(200).json({message:`Customer is registered successfully`});
      }
      else {
          return res.status(400).json({message:`User ${username} already registered`});
      }
  }
  else {
      return res.status(404).json({message: "Must provide username and password"});
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
   console.log(bookISBN);
  res.send(bookISBN).status(200);
 });

 function listBooks() {
  return new Promise((resolve, reject) => {
    resolve(books)
  } );
}
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  for(let i=1;i<=10;i++){
    if (books[i].author === author) {
       res.send(books[i]);
  }}
 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  for(let i=1; i<=10; i++){
    if (books[i].title === title) {
      return res.send(books[i]).status(200);
  }}
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
