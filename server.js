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
let pathToBook = request.body.items.volumeInfo
function book(info) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';

  this.title = info.title || 'No Title Available';

}

//Note that ejs file is not required
function newSearch(request, response) {
  response.render('pages/index');
}

//No API key required
//console.log request.body and request.body.search
function createSearch(request, response) {
  let url = 'https:///www.googleapis.com/books/v1/volumes?q=';

  console.log(request.body);

  if (request.body.search[1] === 'title') {url += `+intitle:${request.body.search[0]}`;}
  if (request.body.search[1] === 'author') {url += `+inauthor:${request.body.seach[0]}`;}

  console.log(url);

  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.volumeInfo.map(bookResult => new Book(bookResult.volumeInfo)))
    function book((info) => {
      
    }
    ])
    .then(results => response.render('pages/searches/show', {searchResults: results}));
}
