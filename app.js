//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");



const homeStartingContent = "U ovom blogu ću vam pisati o najlepšim predelima Srbije koje sam posetio tokom prethodnih 5 godina. Sever Srbije, odnosno autonomna pokrajina Vojvodina, je izuzetno zanimljiv region koji nudi mnoštvo mogućnosti za pravo uživanje ako ste na putu. Zapadni deo Srbije uz Drinu ima mnoge lepe predele. Na jugu Srbije posetio sam mnoštvo manastira, kao i na istoku Srbije. Ispod se nalaze detaljniji opisi mojih putovanja za svako pojedinačno mesto.";
const aboutContent = "U ovom blogu ću vam pisati o najlepšim predelima Srbije koje sam posetio tokom prethodnih 5 godina. Sever Srbije, odnosno autonomna pokrajina Vojvodina, je izuzetno zanimljiv region koji nudi mnoštvo mogućnosti za pravo uživanje ako ste na putu. Zapadni deo Srbije uz Drinu ima mnoge lepe predele. Na jugu Srbije posetio sam mnoštvo manastira, kao i na istoku Srbije. ";
const contactContent = 'email : damjanbel@gmail.com'

const app = express();

mongoose.connect("mongodb+srv://admin-damjan:test123@cluster0.ocr6t.mongodb.net/postDB");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const postsSchema = {
  name: String,
  content: String
}

const usersSchema = {
  username: String,
  password: String
}

const Post = mongoose.model('Post', postsSchema);

const User = mongoose.model('User', usersSchema);

app.get("/klaudIspit", function(req, res){

  Post.find({}, function(err, foundPosts){
      if(!err){
        res.render("home", {
          startingContent: homeStartingContent,
          posts: foundPosts
          });
      }
  });


});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  let title = req.body.postTitle;
  let content = req.body.postBody;

  const post = new Post({
    name: title,
    content: content
  });

  post.save();

  res.redirect("/");

});

app.get("/posts/:postId", function(req, res){
  const requestedId = req.params.postId;

  Post.findOne({_id: requestedId}, function(err, foundPost){
    res.render("post", {
      title: foundPost.name,
      content: foundPost.content
    });
  });
});

app.get("/admin", function(req, res){
  res.render("login");
});

app.post("/admin", function(req, res){

  let username = req.body.username;
  let password = req.body.password;

  User.find(function(err, users){
    if(!err){
      users.forEach(function(user){
        if(user.username == username && user.password == password){
          res.redirect("/compose");
        }else{
          res.render("login");
        }
      });
    }
  });


});

app.listen(process.env.port , function() {
  console.log("Server started on port 3000");
});
