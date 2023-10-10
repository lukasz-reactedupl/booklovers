const expresponses = require('express');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const cors = require('cors');
const app = expresponses();

app.use(cors());
app.use(bodyParser.json());

app.listen(5000, () => console.log('Example app is listening on port 5000.'));

const mongoose = require("mongoose");

const server = '127.0.0.1:27017'; 
const database = 'BookLoversDB'; 
class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(`mongodb://${server}/${database}`)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error(err);
        console.error('Database connection failed');
      });
  }
}

module.exports = new Database();

const userSchema = new mongoose.Schema({
    avatar: String,
      username: String,
      password: String,
      name: String,
      surname: String,
      genresString: String,
      about: String
  });

  const User = mongoose.model('User', userSchema);

  app.use('/signin', async (request, response) => {
    const user = await User.findOne({ 'username' : request.body.username}).exec();
    if(!user) {
      response.send({
        status: 'invalid-user'
      });
      return;
    }
    console.log(user);
    const isValid = await bcrypt.compare(request.body.password, user.password);
    const reviews = await Review.find({'username': request.body.username}).exec();
    const tops = await Top.find({'username': request.body.username}).exec();
    const quotes = await Quote.find({'username': request.body.username}).exec();
    if(user && isValid) {
      response.send({
        status: 'valid-user',
        user: user,
        reviews: reviews,
        tops: tops,
        quotes: quotes
      });
    } else if(user && !isValid) {
      response.send({
        status: 'invalid-password'
      });
    } else {
      response.send({
        status: 'invalid-user'
      });
    }
  });

  app.use("/register", async (request, response) => {
    if(await User.findOne({ 'username' : request.body.username}).exec()) {
      response.send({
        status: 'username-taken'
      });
      return;
    }
    let userObj = request.body;
    const hash = await bcrypt.hash(request.body.password, 10);
      userObj.password = hash;
    const user = new User(userObj);
    console.log(user);
    try {
      await user.save();
      response.send({status: 'registered', user: user});
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.use("/edit", async (request, response) => {
    if(await User.findOne({ 'username' : request.body.username}).exec() && request.body.username !== request.body.oldUsername) {
      response.send({
        status: 'username-taken'
      });
      return;
    }

    let newFields = {};
    const user = await User.findOne({'username':request.body.oldUsername}).exec();
    for(const [key, value] of Object.entries(request.body)) {
      if(value != user[key] && value && user[key]){
        newFields[key] = value;
      }
    }
    const hash = await bcrypt.hash(request.body.password, 10);
      newFields.password = hash;
      console.log(hash);
    let username = newFields.hasOwnProperty("username") ? newFields.username : request.body.username;
    console.log(newFields);
    console.log(request.body.username);
    console.log(username);
    const query = await User.updateOne({'username' : request.body.oldUsername}, newFields).exec();
    const editedUser = await User.findOne({'username':username}).exec();
    console.log(editedUser);
    if(editedUser) {
      response.send({
        status: 'edited-user',
        user: editedUser
      });
    } else {
      response.send({
        status: 'edit-failed'
      });
    }
  });

  const reviewSchema = new mongoose.Schema({
    username: String,
      title: String,
      author: String,
      rank: Number,
      genresString: String,
      reviewText: String
  });

  const Review = mongoose.model('Review', reviewSchema);

  app.use("/newreview", async (request, response) => {
    if(await Review.findOne({ 'title' : request.body.title, 'username': request.body.username}).exec()) {
      response.send({
        status: 'title-taken'
      });
      return;
    }
    console.log(request.body);
    const review = new Review(request.body);
    console.log(review);
    try {
      await review.save();
      response.send({status: 'review-added'});
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.use("/editreview", async (request, response) => {
    if(request.body.reviewTitle!==request.body.title && await Review.findOne({ 'title' : request.body.reviewTitle, 'username': request.body.username}).exec()) {
      response.send({
        status: 'title-taken'
      });
      return;
    }

    let newFields = {};
    const review = await Review.findOne({'title':request.body.reviewTitle, 'username': request.body.username}).exec();
    for(const [key, value] of Object.entries(request.body)) {
      if(value != review[key] && value && review[key]){
        newFields[key] = value;
      }
    }
    let title = newFields.hasOwnProperty("title") ? newFields.title : request.body.reviewTitle;
    console.log(newFields);
    console.log(review);
    const query = await Review.updateOne({'title' : request.body.reviewTitle, 'username': request.body.username}, newFields).exec();
    console.log(title + " " + request.body.username)
    const editedReview = await Review.findOne({'title': title, 'username': request.body.username}).exec();
    console.log(editedReview);
    if(editedReview) {
      response.send({
        status: 'review-edited'
      });
    } else {
      response.send({
        status: 'edit-failed'
      });
    }
  });

  app.use("/deletereview", async (request, response) => {
    const rev = await Review.findOne({ 'title' : request.body.reviewTitle, 'username': request.body.username}).exec();
    console.log(rev);
    console.log(request.body);
    if(!rev) {
      return;
    }
    console.log(request.body);
    const query = Review.deleteOne({ 'title' : request.body.reviewTitle, 'username': request.body.username}).exec();
    const oldrev = await Review.findOne({ 'title' : request.body.reviewTitle, 'username': request.body.username}).exec();
    console.log(oldrev);
    if(!oldrev) {
      response.send({status: 'review-deleted'});
    }
  });

  const topSchema = new mongoose.Schema({
    username: String,
      title: String,
      genre: String,
      books: Array
  });

  const Top = mongoose.model('Top', topSchema);

  app.use("/newtop", async (request, response) => {

    if(await Top.findOne({ 'title' : request.body.title, 'username': request.body.username}).exec()) {
      response.send({
        status: 'title-taken'
      });
      return;
    }
    //response.send({token: 'registered'});
    //console.log(request.body);
    const top = new Top(request.body);
    console.log(top);
    try {
      await top.save();
      response.send({status: 'top-added'});
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.use("/edittop", async (request, response) => {
    if(request.body.oldTitle!==request.body.title && await Top.findOne({ 'title' : request.body.title, 'username': request.body.username}).exec()) {
      response.send({
        status: 'title-taken'
      });
      return;
    }

    let newFields = {};
    const top = await Top.findOne({'title':request.body.oldTitle, 'username': request.body.username}).exec();
    for(const [key, value] of Object.entries(request.body)) {
      if(value != top[key] && value && top[key]){
        newFields[key] = value;
      }
    }
    newFields.books = request.body.books;
    let title = newFields.hasOwnProperty("title") ? newFields.title : request.body.oldTitle;
    console.log(newFields);
    //console.log(top);
    const query = await Top.updateOne({'title' : request.body.oldTitle, 'username': request.body.username}, newFields).exec();
    //console.log(title + " " + request.body.username)
    const editedTop = await Top.findOne({'title': title, 'username': request.body.username}).exec();
    //console.log(editedTop);
    if(editedTop) {
      response.send({
        status: 'top-edited'
      });
    } else {
      response.send({
        status: 'edit-failed'
      });
    }
  });

  app.use("/deletetop", async (request, response) => {
    const top = await Top.findOne({ 'title' : request.body.topTitle, 'username': request.body.username}).exec();
    if(!top) {
      response.sendStatus(404);
      return;
    }
    console.log(request.body);
    const query = Top.deleteOne({ 'title' : request.body.topTitle, 'username': request.body.username}).exec();
    const oldTop = await Top.findOne({ 'title' : request.body.topTitle, 'username': request.body.username}).exec();
    if(!oldTop) {
      response.send({status: 'top-deleted'});
    }
  });

  const quoteSchema = new mongoose.Schema({
    username: String,
      quoteText: String,
      author: String,
  });

  const Quote = mongoose.model('Quote', quoteSchema);

  app.use("/newquote", async (request, response) => {
    if(await Quote.findOne({ 'quoteText' : request.body.quoteText, 'username': request.body.username}).exec()) {
      response.send({
        status: 'quote-taken'
      });
      return;
    }
    //response.send({token: 'registered'});
    //console.log(request.body);
    const quote = new Quote(request.body);
    console.log(quote);
    try {
      await quote.save();
      response.send({status: 'quote-added'});
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.use("/editquote", async (request, response) => {
    if(request.body.quoteText!==request.body.text && await Quote.findOne({ 'quoteText' : request.body.quoteText, 'username': request.body.username}).exec()) {
      response.send({
        status: 'quote-taken'
      });
      return;
    }

    let newFields = {};
    const quote = await Quote.findOne({'quoteText':request.body.text, 'username': request.body.username}).exec();
    for(const [key, value] of Object.entries(request.body)) {
      if(value != quote[key] && value && quote[key]){
        newFields[key] = value;
      }
    }
    let text = newFields.hasOwnProperty("quoteText") ? newFields.quoteText : request.body.text;
    console.log(newFields);
    console.log(quote);
    const query = await Quote.updateOne({'quoteText' : request.body.text, 'username': request.body.username}, newFields).exec();
    
    const editedQuote = await Quote.findOne({'quoteText': text, 'username': request.body.username}).exec();
    console.log(editedQuote);
    if(editedQuote) {
      response.send({
        status: 'quote-edited'
      });
    } else {
      response.send({
        status: 'edit-failed'
      });
    }
  });

  app.use("/deletequote", async (request, response) => {
    const quote = await Quote.findOne({ 'quoteText' : request.body.quoteText, 'username': request.body.username}).exec();

    if(!quote) {
      return;
    }
    console.log(request.body);
    const query = Quote.deleteOne({ 'quoteText' : request.body.quoteText, 'username': request.body.username}).exec();
    const oldQuote = await Quote.findOne({ 'quoteText' : request.body.quoteText, 'username': request.body.username}).exec();
    if(!oldQuote) {
      response.send({status: 'quote-deleted'});
    }
  });

  app.use("/search", async (request, response) => {
    let str = request.body.request.toLowerCase();
    let regex = new RegExp(str, 'gi');
    let items = [];
    switch(true) {
      case(str.includes("top")) : {
        items = await Top.find({title: regex}).exec();
        break;
      }
      case(str.includes("review")) : {
        items = await Review.find({title: regex}).exec();
        break;
      }
      case(str.includes("quote")) : {
        let byText = await Quote.find({quoteText: regex}).exec();
        let byAuthor = await Quote.find({author: regex}).exec();
        items.push(...byText, ...byAuthor);
        break;
      }
      default : {
        let byUsername = await User.find({username: regex}).exec();
        let byName = await User.find({name: regex}).exec();
        let bySurname = await User.find({surname: regex}).exec();
        let quoteByText = await Quote.find({quoteText: regex}).exec();
        let quoteByAuthor = await Quote.find({author: regex}).exec();
        let reviewByTitle = await Review.find({title: regex}).exec();
        let reviewByAuthor = await Review.find({author: regex}).exec();
        let reviewByGenre = await Review.find({genresString: regex}).exec();
        let reviewByText = await Review.find({reviewText: regex}).exec();
        let topByTitle = await Top.find({title: regex}).exec();
        let topByAuthor = await Top.find({author: regex}).exec();
        let topByGenre = await Top.find({genresString: regex}).exec();
        items.push(...byUsername, ...byName, ...bySurname, ...quoteByText, ...quoteByAuthor, ...reviewByTitle, ...reviewByAuthor,
          ...reviewByGenre, ...reviewByText, ...topByTitle, ...topByAuthor, ...topByGenre);
        break;
      }
    }
    console.log(items);
    const setArr = new Set(items);
    if(items.length === 0) {
      response.send({status: "nothing-found"});
    } else {
      response.send({status: "successful-search", items: [...setArr]});
    }
  });