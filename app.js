//testing line
var express = require("express"),
  app = express(),
  methodOverride = require('method-override'),
  bodyParser = require("body-parser");

var morgan = require('morgan');
app.use(morgan('tiny'));

//this line lets use bring in html from other files
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

var books = [];
var count = 1;
var foundBook;

//this line follows RESTful routing
app.get('/', function(req,res){
  res.redirect('/books');
});

//renders the index page
app.get('/books', function(req,res){ 
  res.render('index', {books:books});
});

//render the form for a new book 
app.get('/books/new', function(req,res){
  res.render('new',{books:books});
});

app.post('/books', function(req,res){ //if you want to see what was input to the form, console.log here
  var newBook = req.body.book; //make a new book object from the book object that i made on the serverside from the form request. express and body parser make this object on the server. 
  newBook.id = count;
  books.push(newBook);
  count++;
  res.redirect('/books');
});
//if you had "/books/new" you would want to put this more specific route before this route.
//express will find the first route and use that logic 
app.get('/books/:id', function(req,res){
  books.forEach(function(book){ //find specific book in array
    if(book.id === Number(req.params.id)){
      foundBook = book;
    }
  });
    if(!foundBook){
      //res.render("404"); //if you try to access an id that doesn't exist, show the 404 page
    }
  res.render('show', {book:foundBook}); //show page with one book will be displayed
});

app.get('/books/:id/edit', function(req,res){
  books.forEach(function(book){
    if(book.id === Number(req.params.id)){
      foundBook = book;
    }
  });
    if(!foundBook){
      //res.render("404");
    }
  res.render('edit', {book:foundBook});
});
//the above function is exactly the same as the one prior. except it shows a different page. 

//this is update in RESTful routes
app.put('/books/:id', function(req,res){
  books.forEach(function(book){
    if(book.id === Number(req.params.id)){
      book.title = req.body.book.title;
      book.author = req.body.book.author;
      book.year = req.body.book.year;
    }
  });
    if(!foundBook){
      //res.render("404");
    }
  res.redirect('/books');
});

//delete is just another form located within the index. this form only has one items, a delete button with a type of "submit", it will trigger the function below
app.delete('/books/:id', function(req,res){
  books.forEach(function(book){
    if(book.id === Number(req.params.id)){
      books.splice(books.indexOf(book),1);
    }
  });
  res.redirect('/books');
});

//this handles if user tried to go anywhere else that is not defined 
//this is the catch-all
// app.get('*', function(req,res){
//   res.render('404');
// });

app.listen(3000, function(){
  "Server is listening on port 3000";
});

