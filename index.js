const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const routes = require('./routes');
const path = require("path");

 

app.use(bodyParser.urlencoded({ extended: true }));
const cookies=require("cookie-parser");
const session=require("express-session");
var flash = require('connect-flash');
app.use(session({ 
    secret:'geeksforgeeks', 
    saveUninitialized: true, 
    resave: true
}));



app.use(flash());
app.use(cookies());
app.set('views', __dirname + '/views');
app.use(express.static(__dirname+'/public'));
app.set("view engine", "ejs");
app.get("/main",routes);
app.get("/", routes);
app.post("/",routes);
app.get("/delete/:id",routes);
app.get("/edit/:id",routes);
app.get("/login", routes);
app.post("/login",routes);
app.get("/register", routes);
app.post("/register",routes);
app.post("/update", routes);
app.get("/logout",routes);
app.listen(port, () => {
    console.log(port);
})
