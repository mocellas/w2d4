const express = require("express")
const bodyParser = require("body-parser")
const morgan = require('morgan')

const app = express()
const PORT = process.env.PORT || 8080; // default port 8080

// parse application/x-www-form-urlencoded form data into req.body
app.use(bodyParser.urlencoded({ extended: false }))

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(morgan('dev'));

const data = {
  users: [
    { username: 'monica', password: 'testing' },
    { username: 'khurram', password: 'testing2' }
  ]
}

function randomUsers(len)
{
  var text = " ";

  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < len; i++ )
    text += charset.charAt(Math.floor(Math.random() * charset.length));

  return text;
}

console.log(randomUsers(6));

const users = {
  "userRandomID": { id: "userRandomID", email: "user@example.com", password: "purple-monkey-dinosaur"},
  "user2RandomID": { id: "user2RandomID", email: "user2@example.com", password: "dishwasher-funk"}
}

function attemptLogin(username, password) {
  for (user of data.users) {
    if (user.username === username && user.password === password) {
      return user;
    }
  }
}

// Show the treasure if they are logged in, otherwise redirect to LOGIN page.
app.get("/", (req, res) => {
  const currentUsername = req.cookies['username'];
  if (currentUsername) {
    res.render('treasure', { currentUser: currentUsername });
  } else {
    res.redirect("login");
  }
});

app.get("/login", (req, res) => {
  res.render("login")
})

app.post("/login", (req, res) => {
  //const username = req.body.username;
  //const password = req.body.password;
  bcrypt.compareSync("req.body.username", hashed_password); // returns true
  bcrypt.compareSync("req.body.password", hashed_password); // returns false

  const user = attemptLogin(username, password);

  if (user) {
    // success
    res.cookie('username', user.username); // Set-Cookie: lang=en
    res.redirect('/');
  } else {
    // failed attempt
    res.render('login', { errorFeedback: 'Failed to find a user.' });
  }
  console.log(`You attempted to log in with ${username}. User: ${user && user.username}`);
})

app.get("/signup", (req, res) => {
  res.render("signup")
})

app.post("/signup", (req, res) => {
  const bcrypt = require('bcrypt');
  const password = "req.body.password"; // you will probably this from req.params
  const hashed_password = bcrypt.hashSync(password, 10);
  const username = req.body.username;
  //const password = req.body.password;
  data.users.push({username: username, password: password});
  res.cookie('username', username);
  res.redirect('/');
})

app.get("/logout", (req, res) => {
  res.redirect("/login")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//FROM OLD SERVER

let urlDatabase = {

  "b2xVn2": {"userID": "temp", "URL": "http://www.lighthouselabs.com"},
  "9sm5xK": {"userID": "temp", "URL": "http://www.google.com"}
};

function stringGen(len)
{
  var text = " ";

  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < len; i++ )
    text += charset.charAt(Math.floor(Math.random() * charset.length));

  return text;
}
console.log(stringGen(6));

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  console.log(req.cookies.username);
  if (req.cookies.username){
    res.render("urls_new");
  }else{
    res.redirect("/login")
  }
});


//W2D3
app.get("/urls/:id", (req, res) => {
  let longUrl = urlDatabase[req.params.id]
  let templateVars = { shortURL: req.params.id, urls: urlDatabase, longUrl: longUrl};
  console.log(longUrl)
  console.log(req.params.id)
  //res.send("Ok");
  res.render("urls_show", templateVars);
});

//W2D3
//const bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({extended: true}));
app.post("/urls", (req, res) => {
  var randomURL = stringGen(6);
  // urlDatabase[randomURL] = req.body.longURL;
  urlDatabase[randomURL] = { "userID": req.cookies.username,
  "URL": req.body.longURL};
  // console.log(req.body.longURL);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

//W2D3 - delete route
app.post("/urls/:id/delete", (req, res) => {
  var deleteID = req.params.id;
  if (req.cookies.username){
    if(req.cookies.username === urlDatabase[deleteID].userID) {
      delete urlDatabase[deleteID];
      res.redirect('/urls')
    } else {
      res.redirect('/urls/' + deleteID);
    }
  } else {
    res.redirect("/login")
  }
});

//W2D3 - update route
app.post("/urls/:id/update", (req, res) => {
  var updateID = req.params.id;
  if (req.cookies.username){
    res.render("urls_new");
  }else{
    res.redirect("/login")
  }
  res.redirect('urls_show');
});

app.get("/u/:shortURL", (req, res) => {
  console.log('urlDatabase', urlDatabase)
  let longURL = urlDatabase[req.params.shortURL].URL //replace it by [req.params.id]
  console.log('LONGURL', longURL);
  res.redirect(longURL);
});


