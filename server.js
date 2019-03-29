'use strict';

require('dotenv').config();

//Application Dependencies

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

//Application Setup
const app = express();
const PORT = process.env.PORT

//Application Middleware

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

//Set the view engine for server-side templating
app.set('view engine', 'ejs');

//API Routes

//Renders the Search form

app.get('/', getOneBook);

//creates a new search to the Google Books API

app.post('/searches/show', createSearch);

app.get('/searches/newSearch', newSearch);

app.get('/bookShelf', addBook);


//Catch-all

app.get('*', (request, response)=> response.status(404).send('Get the HELL out of here NOW!'));

//turn on the server

app.listen(PORT, ()=> console.log(`Listening on PORT: ${PORT}`));

//Helper Functions

//render pages.index

function newSearch(request, response){
  response.render('./pages/searches/newSearch');
}

//searching google books, rendering searches

function createSearch(request, response){
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if (request.body.findBooks[1] === 'title'){url += `+intitle:${request.body.findBooks[0]}`;}

  if(request.body.findBooks[1] === 'author'){url += `+inauthor:${request.body.findBooks[0]}`;}
  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => {
      let book = new Book(bookResult.volumeInfo)
      let sql = `INSERT INTO books (title, img, author, description, bookShelf, ISBN10, ISBN13) VALUES($1, $2, $3, $4, $5, $6, $7);`;
      let newBooks = Object.values(book);
      client.query(sql, newBooks);
      return book
    }))

    .then(books => response.render('pages/searches/show', { books: books}));
}

function addBook(request, response) {
  let { title, img, author, description, bookShelf, ISBN10, ISBN13, contact} = request.body;
  let SQL = 'INSERT INTO task(title, img, author, description, bookShelf, ISBN10, ISBN13, conact) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);';
  let values = [title, img, author, description, bookShelf, ISBN10, ISBN13, contact];

  return client.query(SQL, values)
    .then 
}



// //book constructor

const regex = /^(http:\/\/)/i;

function Book(bookResult) {
  this.title = bookResult.title || 'No Title Available';
  this.img = bookResult.imageLinks ? bookResult.imageLinks.thumbnail.replace(regex, 'https://') : 'https://i.imgur.com/J5LVHEL.jpg';
  this.authors = bookResult.authors || 'There is no one who takes credit for this work.';
  this.description = bookResult.description ? bookResult.description : 'No one felt the need to describe this. How sad.';
  this.bookShelf = 'This does not currently have a shelf. Would you like to organize it?';
  this.isbn10 = bookResult.industryIdentifiers[0] ? bookResult.industryIdentifiers[0].identifier :'This book was published after 2007. Has anything good happened after 2007, really?' ;
  this.isbn13 = bookResult.industryIdentifiers[1]? bookResult.industryIdentifiers[1].identifier : 'This book was published before 2007 and no one has wanted to republish it after.';
}
//__________________________________
//Database Setup
//__________________________________

const client = new pg.Client(process.env.DATABASE_URL);
client.connect()
client.on('error', err => console.error(err));


// //run out to get the books and bring them back from the data base

// // function fetchBook(request, result) {
// //   let SQL = `SELECT * from books;`;

// //   return client.query(SQL)
// //     .then(results => {
// //       console.log(results);
// //      result.render('index', {results: results.rows})
// //     })
// //     .catch(handleError);
// // }



// //API Routes
// //Render the  search form
// app.get('/', (req, res) => {
//   res.render('./pages/index');
// });

// //Helper Functions:



function getOneBook(request, response) {
  let SQL = 'SELECT * FROM books;';

  return client.query(SQL)
    .then(result => {
      return response.render('pages/index', {books: result.rows});
    })
    .catch(err => handleError(err, response))
}

// // function handleError(error, response){
// //   response.render('pages/show', {error: 'Thats an error.'})
// //   if
// // }

function handleError(error, result){
  console.error(error);
  if (result) result.status(500).send('Thats an error. So very sorry, something went WRONG.');
}


// // //Note that ejs file is not required
// // function newSearch(request, results) {
// //   results.render('pages/index');
// // }


