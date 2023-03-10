const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: 'inshal1',
    password: 'Test@123'
  }
];

const isValid = (username)=>{   
  let sameUserName = users.filter((user)=>{
    return user.username = username;
   })
   if(sameUserName.length > 0){
    return true;
   }
   else{
    return false;
   }
}

const authenticatedUser = (username,password)=>{
   //returns boolean
  const user = users.find(u => u.username == username && u.password == password);
  return user ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);
  if(!username || !password){
    res.status(404).json({message:"User Not Found!!!"});
  }

  if(authenticatedUser(username, password)){
    let accessToken=jwt.sign({ data: password },'access',{expiresIn:60*60});

    req.session.authorization={
      accessToken,username
    }
    return res.status(200).json({message:"User logged in"})
  }
  else{
    return res.status(404).json({message:"Invalid username and password!!!"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username=req.body.username;
  const password=req.body.password;

  if(!username || !password){
    return res.status(404).json({message:"User Not Found!!!"});
  }
 
  if(authenticatedUser(username,password)){
    let isbn = req.params.isbn;
    let book = books[isbn];
    if(book){
      let review=req.body.reviews;
      if(review){
        book["reviews"]=review;
      }
      books[isbn]=book;
      res.send(`Books with isbn ${isbn} updated its review`);
    }
    else{
      res.status(404).json({message:`Books with the isbn ${isbn} Not found!!!`});
    }
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn",(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;

  if(!username || !password){
    return res.status(404).json({message:"User Not Found!!!"});
  }

  if(authenticatedUser(username,password)){
    let isbn=req.params.isbn;
    
    if(isbn){
      delete books["reviews"];
    }
    res.send(`Book with the isbn ${isbn} has been deleted.`);
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
