'use strict';

require('dotenv').config();

const express = require('express');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT;

//Middleware
app.use(express.urlencoded({ extended : true}));
app.use(express.static('public'));

//Set the view engine for server-side templating
app.set('view engine', 'ejs');

//API Routes
//Render the  search form
app.get('/', newSearch);

//creates a new search to Google Books API
app.post('/searches', createSearch);

//Catch-all
app.get('*', (request, response) => response.status(404).send('Get the HELL out of here NOW!'));

app.listen(PORT, () => console.log(`listening on PORT: ${PORT}`));

//Helper

client.on('error', err => console.error(err))

function handleError(err, result){
  console.error(err);
  if (res) res.status(500).send('So very sorry, something went WRONG.');
}

//Note that ejs file is not required
function newSearch(request, response) {
  response.render('pages/index');
}

//No API key required
//console.log request.body and request.body.search
function createSearch(request, response) {
  let url = `https:///www.googleapis.com/books/v1/volumes?q=in${request.body.search[1]}:${request.body.search[0]}`;

  console.log(request.body);

  if (request.body.search[1] === 'title') {url += `+intitle:${request.body.search[0]}`;}
  if (request.body.search[1] === 'author') {url += `+inauthor:${request.body.seach[0]}`;}
  console.log(url);

  superagent.get(url)
    .then(results => {
      if (results.body.totalItems === 0) { handleError({status:404}, response);
      }else{
        let bookArray = results.body.items.map((bookData) => {

          let book = new Book(bookData.volumeInfo);
          return book;
        });
      }
    })
    .then(results => response.render('pages/searches/show', { searchResults: results }));
    .catch(err => (handleError(err, response));
  }

//book constructor

let pathToBook = response.body.items.volumeInfo

function Book(bookArray) {

  this.title = pathToBook.title || 'No Title Available';
  this.img = pathToBook.imageLinks.thumbnail || 'https://i.imgur.com/J5LVHEL.jpg';
  this.description = pathToBook.description || 'No one felt the need to describe this. How sad.';
  this.authors = pathToBook.authors || 'There is no one who takes credit for this work.';
  this.isbn10 = pathToBook.industryIdentifiers[0].identifiers || 'This book was published before 2007 and no one has wanted to republish it after.This book was published after 2007!';
  this.isbn13 = pathToBook.industryIdentifiers[1].identifiers || 'This book was published after 2007. Has anything good happened after 2007, really?';
}
