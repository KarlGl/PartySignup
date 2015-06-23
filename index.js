var express = require('express')
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var store = require('node-persist');
var storeDir = process.cwd() + '/';
var fs = require('fs');

store.initSync({
	dir: storeDir
});

var findUsers = function() {
  return store.getItem("users") || [];
}

app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /yYrnZRRaX3rMYfaTiTBTAahMgwcjrhrrdJZXXaBeyzvjhcND7Q");
});

// accept form posts.
app.use(bodyParser.urlencoded({extended: true}));

// show all uses. WOW so secure.
app.get('/yYrnZRRaX3rMYfaTiTBTAahMgwcjrhrrdJZXXaBeyzvjhcND7Q', function(req, res) {
  var users = store.getItem("users");
  res.status(200).json(users);
});

// show main page with form from a file.
app.get('/', function(req, res) {
  fs.readFile('index.html', function (err, data) {
    if (err) throw err;
    res.status(200).write(data);
    res.end();
  });
});

// Show this after signing up
app.get('/done', function(req, res) {
  res.status(200).send('Thanks, you will get an email or txt message a day or two before the event. <a href="/">Back</a>').end();
});


// validate if email or phone is taken
app.get('/validate/:field', function(request, res) {
  var field = request.params.field;
  var value = request.query[field];
  var users = findUsers();
  var taken;
  // no find in ES5... erg.
  four22 = function() {
    res.status(422).end();
  };
  if (!value)
    return res.status(200).end();
  taken = users.filter(function(user) { return user[field] == value; });
  if (taken.length > 0)
    four22();
  else
    res.status(200).end();
});

// signup endpoint
app.post('/', function(req, res) {
  // all users excluding this new one.
  var users = findUsers();

  var name = req.body.name;
  var ip = req.ip;
  var email = req.body.email;
  var phone = req.body.phone;
  var comment = req.body.comment;
  var user = {name: name, ip: ip, email: email, phone: phone, comment: comment};
  console.log("signing up", user);

  store.setItem("users", users.concat(user));
  res.redirect('/done');
  console.log("done");

});

var server = http.listen(4066, function() {
	console.log('Listening on port ' + server.address().port);
});
