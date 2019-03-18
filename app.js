var express = require('express');
var session = require('express-session');
var engine = require('ejs-locals');
var http = require('http');
var path = require('path');
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('seminarski.db');
var bodyParser = require('body-parser');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/includes/recepti-slike')
    },
    filename: function (req, file, cb) {
        var temp = file.originalname.split('.');
        var ext = temp[temp.length - 1];

        cb(null, file.originalname);
    }
});

var upload = multer({
    storage: storage
}).array('images');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

app.engine('ejs', engine);
app.set('view engine', 'ejs');

//app.use(express.static('public'));
//app.use(express.static(path.join(__dirname, '/includes')));
app.use('/includes', express.static(__dirname + '/includes'));
app.use('/bower_components', express.static('/bower_components'));

var auth = function (req, res, next) {
    if (req.session && req.session.admin) {
        return next();
    }
    else
        return res.redirect("/");
};

var auth2 = function (req, res, next) {
    //console.log(req.session.user);
    //console.log(req.session.admin);
    if (req.session && (req.session.user || req.session.admin)) {
        return next();
    }
    else
        return res.redirect("/");
        //return res.sendStatus(401);
};


app.get("/", function (req, res) {
    //console.log(req.session.role);
    /*if (!req.session.userImage) {
        res.cookie("userRole", "");
        res.cookie("username", "");
        res.cookie("userImage", "");
    } else {
        res.cookie("userRole", req.session.role);
        res.cookie("userImage", req.session.userImage);
        res.cookie("username", req.session.firstName + " " + req.session.lastName);
    }*/
    res.render("index.ejs", {});
});

app.get('/signup', function (req, res) {
    res.render('signup.ejs');
});

app.get('/terms', function (req, res) {
    //if (req.session) {
    //    res.cookie("userRole", req.session.role);
    //    res.cookie("userImage", req.session.userImage);
    //    res.cookie("username", req.session.firstName + " " + req.session.lastName);
    //}
    res.render('terms.ejs');
});

app.get('/addnew', auth2, function (req, res) {
    //res.cookie("userRole", req.session.role);
    //res.cookie("userImage", req.session.userImage);
    //res.cookie("username", req.session.firstName + " " + req.session.lastName);
    res.render('addnew.ejs');
});

app.get('/removeRecipe', auth2, function (req, res) {
    db.run("DELETE FROM recipe WHERE id=" + req.query.id, function (err) {
        if (err)
            console.error(err);
        else {
            res.redirect("/myPage");
        }
    });
});

app.post('/addnew', urlencodedParser, function (req, res) {
    upload(req, res, function (err) {
        var preparationTime = 0, cookTime = 0, servings = 1;
        if (err)
            console.error(err);
        else {
            var image = "";
            if (req.files[0] != undefined)
                image = "/includes/recepti-slike/" + req.files[0].filename;
            //console.log(req.session.userId);
            //db.run("INSERT INTO recipe(recipeName, description, picture, instructions, approved, rating, hitRate, preparationTime, cookTime, servings, nationality, category_id, user_id) VALUES('" + req.body.recipeName + "', '" + req.body.description + "', '" + image + "', ' ', 0, 0, 0, " + req.body.preparationTime + ", " + req.body.cookTime + ", " + req.body.servings + ", '" + req.body.nationality + "', 1, " + req.session.userId + ")", function (err) {
            //    if(err)
            //        console.error(err);
            //});
            if (req.body.preparationTime == '') {
                console.log("prepTime undefined");
                preparationTime = 0;
            } else {
                preparationTime = req.body.preparationTime;
            }
            if (req.body.cookTime == '') {
                console.log("cookTime undefined");
                cookTime = 0;
            } else {
                cookTime = req.body.cookTime;
            }
            if (req.body.servings == '') {
                console.log("servings undefined");
                servings = 0;
            } else {
                servings = req.body.servings;
            }
                       
            
            db.serialize(function () {
                db.run("INSERT INTO recipe(recipeName, description, picture, instructions, approved, rating, hitRate, preparationTime, cookTime, servings, nationality, category_id, user_id) VALUES( '" + req.body.recipeName + "', '" + req.body.description + "', '" + image + "', '', 0, 0, 0, " + preparationTime + ", " + cookTime + ", " + servings + ", '" + req.body.nationality + "', 1, " + req.session.userId + ")", function (err) {
                    if (err)
                        console.error(err);
                });


                setTimeout(function () {
                    res.redirect("/myPage");
                }, 500);
            });
        }
    });
});

app.post('/alterRecipe', urlencodedParser, function (req, res) {
    upload(req, res, function (err) {
        if (err)
            console.error(err);
        else {
            var image = "";
            //console.log("kategorija: " + req.body.category);
            console.log("id: " + req.body.id);
            if (req.files[0] != undefined) {
                image = "/includes/recepti-slike/" + req.files[0].filename;
                db.run("UPDATE recipe SET recipeName='" + req.body.recipeName + "', description='" + req.body.description + "', picture='" + image + "', preparationTime=" + req.body.preparationTime + ", cookTime=" + req.body.cookTime + ", servings=" + req.body.servings + ", nationality='" + req.body.nationality + "' WHERE id=" + req.body.id, function (err) {
                    if (err)
                        console.error(err);
                });
            } else {
                db.run("UPDATE recipe SET recipeName='" + req.body.recipeName + "', description='" + req.body.description + "', preparationTime=" + req.body.preparationTime + ", cookTime=" + req.body.cookTime + ", servings=" + req.body.servings + ", nationality='" + req.body.nationality + "' WHERE id=" + req.body.id, function (err) {
                    if (err)
                        console.error(err);
                });
            }
            res.redirect('/myPage');
        }
    }); 
});

app.get('/signin', function (req, res) {
    res.render('signin.ejs');
});

app.get('/myPage', auth2, function (req, res) {
    //res.cookie("userRole", req.session.role);
    //res.cookie("userImage", req.session.userImage);
    //res.cookie("username", req.session.firstName + " " + req.session.lastName);
    res.render('myPage.ejs');
});

app.get('/admin', auth, function (req, res) {    
    //res.cookie("userRole", req.session.role);
    //res.cookie("userImage", req.session.userImage);
    //res.cookie("username", req.session.firstName + " " + req.session.lastName);
    res.render("admin.ejs");
});



app.get('/topRated', function (req, res) {

    db.all("SELECT recipe.id, recipe.rating, recipe.recipeName, recipe.description, recipe.picture, user.firstName, user.lastName, user.userImage" +
        " FROM recipe JOIN user ON recipe.user_id = user.id ORDER BY recipe.rating", function (err, rows) {
            if (err)
                console.error(err);
            else {
                res.json(rows);
            }
        });
    //res.send(JSON.stringify({ image: "/inlcudes/user-image/sone.jpg", recipeName: "Bolonjeze" }));
});

app.get('/myRecipes', auth2, function (req, res) {
    db.all("SELECT recipe.id, recipe.rating, recipe.recipeName, recipe.description, recipe.picture, user.firstName, user.lastName, user.userImage" +
        " FROM recipe JOIN user ON recipe.user_id = user.id WHERE user.id=" + req.session.userId, function (err, rows) {
            if (err)
                console.error(err);
            else {
                res.json(rows);
            }
        });
});

app.post('/signup', urlencodedParser, function (req, res) {
    db.serialize(function () {
        db.all("SELECT * FROM user WHERE username='" + req.body.username, function (err, rows) {
            if (rows != null) {
                res.send("Useracount already exists! Try with differenet email address.");
            }
        });
        db.run("INSERT INTO user(firstName, lastName, username, password, role, userImage) VALUES('" + req.body.firstName + "', '" + req.body.lastName + "', '" + req.body.username + "', '" + req.body.password + "', 'user', 'includes/user-image/monika.jpg')", function (err) {
            if (err) {
                console.log(err);
                res.send("There was an error while we were trying to create your account. Please, try again. Thank you.");
            }
        });

        res.render('signin.ejs');
    });
});

//Login endpoint
app.post('/signin', urlencodedParser, function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.send('login failed');
    } else {
        db.all("SELECT * FROM user WHERE username='" + req.body.username + "' AND password='" + req.body.password + "'", function (err, rows) {
            if (err)
                console.error(err);
            else if (rows[0] != null) {
                res.cookie("userRole", rows[0].role);
                res.cookie("userImage", rows[0].userImage);
                res.cookie("username", rows[0].firstName + " " + rows[0].lastName);
                req.session.userFirstName = rows[0].firstName;
                req.session.userLastName = rows[0].lastName;
                req.session.userImage = rows[0].userImage;
                req.session.userId = rows[0].id;
                req.session.role = rows[0].role;
                //console.log(req.session.role);
                if (rows[0].role == "admin") {
                    req.session.admin = true;
                }
                else if (rows[0].role == "user") {
                    req.session.user = true;
                }
                res.redirect("/");
            } else
                res.redirect("/");
        });
    }
});

//Login endpoint
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.cookie("userRole", "");
    res.cookie("username", "");
    res.cookie("userImage", "");    
    res.redirect("/");     
});

//Get content endpoint
app.get('/content', auth, function (req, res) {
    res.send("You can only see this after you've logged in.");
    res.sendFile(__dirname + "/views/" + "content.html");
});

app.post('/deleteUser', urlencodedParser, function (req, res) {
    console.log("recived id: "+req.body.ID);
    db.run("DELETE FROM user WHERE id ="+req.body.ID, function (err) {
        if (err)
            console.log(err);        
    });
});

app.post('/changeRole', urlencodedParser, function (req, res) {
    db.run("UPDATE user SET role='" + req.body.role + "' WHERE id=" + req.body.ID, function (err) {
        if (err)
            console.error(err);
        else {
            db.each("SELECT * FROM user", function (err, rows) {
                console.log(rows.id + " " + rows.role);                
            });
        }
    });
});

app.get('/recipeAll', auth, function (req, res) {
    db.all("SELECT * FROM recipe INNER JOIN user ON recipe.user_id = user.id", function (err, rows) {
        var result = JSON.stringify(rows);
        res.json(rows);
    });
});


var sqlite = io.of("/dbUsersData").on('connection', function (socket) {    
    db.all("SELECT * FROM user", function (err, rows) {
        console.log(socket.request._query['foo']);   //preuzimanje podataka poslatih u trenutku ostvarivanja konekcije
        rezultat = JSON.stringify(rows);
        sqlite.emit('dbDataReady', rezultat);
    });

    db.each("SELECT * FROM user", function (err, rows) {
        console.log(rows.id + " " + rows.firstName);
        //sqlite.emit('dbDataReady', rezultat);
    });

    socket.on('disconnect', function () {
        console.log('Sqlite3 user disconnected');
    });
});

app.get("/recipe", function (req, res) {    
    var firstName, lastName, preparationTime, cookTime, servings, cuisine, category, raitings;
    var id, recipeName, description, ingredients, recipePicture, userPicture;
    db.serialize(function () {
        db.all("SELECT i.ingredientName" +
            " FROM recipe r" +
            " JOIN recipeIngredient ri ON r.id = ri.recipe_id" +
            " JOIN ingredient i ON ri.ingredient_id = i.id" +
            " WHERE r.id =" + req.query.id, function (err, rows) {
                if (err)
                    console.error(err);
                else {
                    ingredients = rows;
                    console.log(ingredients.length);
                }
            });
        
          

        db.all("SELECT r.id, c.categoryName, r.description, r.picture, r.instructions, r.approved, r.rating, r.hitRate, r.preparationTime, r.cookTime, r.servings, r.nationality, r.category_id, r.user_id, " +
               "u.firstName, u.lastName, u.userImage, r.recipeName"+
              " FROM recipe AS r" +
              " JOIN user AS u ON r.user_id = u.id"+
              " JOIN category AS c ON r.category_id = c.id" +
              " WHERE r.id = " + req.query.id, function (err, rows) {
                  if (err)
                      console.error(err);
                  else {
                      if (rows[0] != null) {
                          id = rows[0].id;
                          userPicture = rows[0].userImage;
                          recipePicture = rows[0].picture;
                          description = rows[0].description;
                          recipeName = rows[0].recipeName;1
                          firstName = rows[0].firstName;
                          lastName = rows[0].lastName;
                          preparationTime = rows[0].preparationTime;
                          cookTime = rows[0].cookTime;
                          servings = rows[0].servings;
                          cuisine = rows[0].nationality;
                          category = rows[0].categoryName;
                          ratings = rows[0].rating;                                                    
                      }
                      else
                          console.log("nema rezultata upita");
                  }
            });   

        setTimeout(function () {
            //if (ingredients != null) {
            //    for (var i = 0; i < ingredients.length; i++) {
            //        console.log("ingredient" + i + " : " + ingredients[i].ingredientName);
            //    }
            //}
            //res.cookie("userRole", req.session.role);
            //res.cookie("userImage", req.session.userImage);
            //res.cookie("username", req.session.firstName + " " + req.session.lastName);
            res.render('single.ejs', {      
                id: id,
                ingredients: ingredients,
                userPicture: userPicture,
                recipePicture: recipePicture,
                description: description,
                recipeName: recipeName,
                firstName: firstName,
                lastName: lastName,
                preparationTime: preparationTime,
                cookTime: cookTime,
                servings: servings,
                cuisine: cuisine,
                category: category,
                ratings: ratings
            });
            console.log(recipeName + " " + description);
        }, 500);
    });
    //res.redirect('/');
    
});


app.get('/alterRecipe', auth2, function (req, res) {
    var firstName, lastName, preparationTime, cookTime, servings, cuisine, category, raitings;
    var id, recipeName, description, ingredients, categories, recipePicture, userPicture;
    db.serialize(function () {
        db.all("SELECT i.ingredientName" +
            " FROM recipe r" +
            " JOIN recipeIngredient ri ON r.id = ri.recipe_id" +
            " JOIN ingredient i ON ri.ingredient_id = i.id" +
            " WHERE r.id =" + req.query.id, function (err, rows) {
                if (err)
                    console.error(err);
                else {
                    ingredients = rows;
                    console.log(ingredients.length);
                }
            });

        db.all("SELECT * FROM category", function (err, rows) {
            if (err) {
                console.error(err);
            } else {
                categories = rows;
                console.log(categories);
            }
        });

        db.all("SELECT r.id, c.categoryName, r.description, r.picture, r.instructions, r.approved, r.rating, r.hitRate, r.preparationTime, r.cookTime, r.servings, r.nationality, r.category_id, r.user_id, " +
            "u.firstName, u.lastName, u.userImage, r.recipeName" +
            " FROM recipe AS r" +
            " JOIN user AS u ON r.user_id = u.id" +
            " JOIN category AS c ON r.category_id = c.id" +
            " WHERE r.id = " + req.query.id, function (err, rows) {
                if (err)
                    console.error(err);
                else {
                    if (rows[0] != null) {
                        id = rows[0].id;
                        userPicture = rows[0].userImage;
                        recipePicture = rows[0].picture;
                        description = rows[0].description;
                        recipeName = rows[0].recipeName; 1
                        firstName = rows[0].firstName;
                        lastName = rows[0].lastName;
                        preparationTime = rows[0].preparationTime;
                        cookTime = rows[0].cookTime;
                        servings = rows[0].servings;
                        cuisine = rows[0].nationality;
                        category = rows[0].categoryName;
                        ratings = rows[0].rating;
                        console.log("JOIN " + rows[0].id + " " + rows[0].recipeName + "user: " + rows[0].firstName + "category name: " + rows[0].categoryName);
                    }
                    else
                        console.log("nema rezultata upita");
                }
            });

        setTimeout(function () {
            if (ingredients != null) {
                for (var i = 0; i < ingredients.length; i++) {
                    console.log("ingredient" + i + " : " + ingredients[i].ingredientName);
                }
            }            
            res.render('alter.ejs', {
                id: id,
                categories: categories,
                ingredients: ingredients,
                userPicture: userPicture,
                recipePicture: recipePicture,
                description: description,
                recipeName: recipeName,
                firstName: firstName,
                lastName: lastName,
                preparationTime: preparationTime,
                cookTime: cookTime,
                servings: servings,
                cuisine: cuisine,
                category: category,
                ratings: ratings
            });
            console.log(recipeName + " " + description);
        }, 500);
    });
    //res.redirect('/');

});

var webServer = server.listen(8081, function () {

    var host = webServer.address().address
    var port = webServer.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})