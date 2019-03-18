var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('seminarski.db');

db.serialize(function () {

    db.run("CREATE TABLE if not exists user (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, username TEXT NOT NULL, password TEXT NOT NULL, role TEXT, userImage TEXT) ", function (err) {
        if (err)
            console.error(err);
        else {               
            console.log("Successfully created table.");
            db.run("INSERT INTO user(firstName, lastName, username, password, role, userImage) VALUES('milos', 'bajic', 'milosbajic', 'milos12', 'admin', 'includes/user-image/sone.jpg')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO user(firstName, lastName, username, password, role, userImage) VALUES('josip', 'broz', 'tito', 'tito12', 'user', 'includes/user-image/tito.jpg')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO user(firstName, lastName, username, password, role, userImage) VALUES('dalaj', 'lama', 'tibetanac1', 'tibet123', 'user', 'includes/user-image/monika.jpg')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
        }
         
    });    
    db.run("CREATE TABLE if not exists category (id INTEGER PRIMARY KEY AUTOINCREMENT, categoryName TEXT) ", function (err) {
        if (err)
            console.error(err);
        else
            db.run("INSERT INTO category(categoryName) VALUES('Main Dishes')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO category(categoryName) VALUES('Lunch Recipes')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO category(categoryName) VALUES('Meat and Poultry')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO category(categoryName) VALUES('Seafood Recipes')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });

    });

    db.run("CREATE TABLE if not exists recipe (id INTEGER PRIMARY KEY AUTOINCREMENT, recipeName TEXT, description TEXT, picture TEXT, instructions TEXT, approved INTEGER, rating REAL, hitRate INTEGER, preparationTime REAL, cookTime REAL, servings REAL, nationality TEXT, category_id INTEGER, user_id INTEGER, FOREIGN KEY(category_id) REFERENCES category(id), FOREIGN KEY(user_id) REFERENCES user(id)) ", function (err) {
        if (err)
            console.error(err);
        else {
            db.run("INSERT INTO recipe(recipeName, description, picture, instructions, approved, rating, hitRate, preparationTime, cookTime, servings, nationality, category_id, user_id) VALUES('Buffalo Chicken Dip', 'This tangy, creamy dip tastes just like Buffalo chicken wings. It s best served hot with crackers and celery sticks. Everyone loves the results!', 'includes/recepti-slike/chicken_dip.jpg', 'Heat chicken and hot sauce in a skillet over medium heat, until heated through. Stir in cream cheese and ranch dressing. Cook, stirring until well blended and warm. Mix in half of the shredded cheese, and transfer the mixture to a slow cooker. Sprinkle the remaining cheese over the top, cover, and cook on Low setting until hot and bubbly. Serve with celery sticks and crackers.', 0, 3, 5, 5, 40, 20, 'Europe', 1, 1)", function (err) {
                if (err)
                    console.error("chicken dip insert upit: " + err);
            });            
            db.run("INSERT INTO recipe(recipeName, description, picture, instructions, approved, rating, hitRate, preparationTime, cookTime, servings, nationality, category_id, user_id) VALUES('Baked Spaghetti', 'A comforting baked spaghetti casserole with plenty of melted cheese is the perfect dish for potlucks, family gatherings, or a week-night dinner.', 'includes/recepti-slike/spaghetti.jpg', 'Preheat oven to 350 degrees F (175 degrees C). Lightly grease a 9x13-inch baking dish. Bring a large pot of lightly salted water to a boil. Cook spaghetti in boiling water, stirring occasionally until cooked through but firm to the bite, about 12 minutes. Drain.', 0, 3, 5, 25, 60, 8, 'Hungary', 2, 2)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });       
            db.run("INSERT INTO recipe(recipeName, description, picture, instructions, approved, rating, hitRate, preparationTime, cookTime, servings, nationality, category_id, user_id) VALUES('Bolognese Stuffed Bell Peppers', 'This Bolognese filling is spicy, meaty, and creamy. If you re in a hurry you can serve it over pasta instead of filling the peppers; just omit the rice or orzo.', 'includes/recepti-slike/punjena_paprika.jpg', 'Preheat oven to 375 degrees F (190 degrees C). Heat 1 tablespoon olive oil in a skillet over medium heat. Stir in the carrots and celery; cook and stir until the vegetables are tender, about 5 minutes...', 0, 3, 5, 30, 80, 6, 'Italia', 3, 3)", function (err) {
                if (err)
                    console.error("punjena paprika insert upit: " + err);
            });                 
        }
    });

    db.run("CREATE TABLE if not exists ingredient (id INTEGER PRIMARY KEY AUTOINCREMENT, ingredientName TEXT, description TEXT) ", function (err) {
        if (err)
            console.error(err);
        else {
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('1 (16 ounce) package spaghetti', 'kao fida za supu')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('1 pound ground beef', 'mleveno mesano')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('1 onion, chopped', 'mleveno mesano')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('1 (32 ounce) jar meatless spaghetti sauce', 'mleveno mesano')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('1/2 teaspoon seasoned salt', 'mineral')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('2 eggs', 'mineral')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('2 (10 ounce) cans chunk chicken, drained', 'mineral')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('2 (8 ounce) packages cream cheese, softened', 'mineral')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('1 cup Ranch dressing', 'mineral')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('3/4 cup pepper sauce (such as Frank's Red Hot®)', 'mineral')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('1 1/2 cups shredded Cheddar cheese', 'mineral')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('1/2 cup cooked rice', 'mineral')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('2 tablespoons olive oil, divided', 'mineral')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('1/8 cup minced carrots', 'mineral')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('1/8 cup celery', 'mineral')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('6 bell peppers (any color) stems and seeds removed, cut in half lengthwise', 'mineral')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO ingredient(ingredientName, description) VALUES('1/2 pound ground beef', 'mineral')", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
        }
    });

    db.run("CREATE TABLE if not exists recipeIngredient (recipe_id INTEGER, ingredient_id INTEGER, quantity REAL, PRIMARY KEY(recipe_id, ingredient_id), FOREIGN KEY(recipe_id) REFERENCES recipe(id), FOREIGN KEY(ingredient_id) REFERENCES ingredient(id)) ", function (err) {
        if (err)
            console.error(err);
        else {
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(2, 1, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(2, 2, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(2, 3, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(2, 4, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(2, 5, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(2, 6, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(1, 7, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(1, 8, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(1, 9, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(1, 10, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(1, 11, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(3, 12, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(3, 13, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(3, 14, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(3, 15, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(3, 16, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
            db.run("INSERT INTO recipeIngredient(recipe_id, ingredient_id, quantity) VALUES(3, 17, 1)", function (err) {
                if (err)
                    console.error("insert upit: " + err);
            });
        }
    });
    //db.run("DELETE FROM user WHERE id > 1", function (err) {
    //    if (err) {
    //        console.error("delete upit" + err);
    //    }
    //});
    
    //var stmt = db.prepare("INSERT INTO user(id, firstName, lastName, username, password, role) VALUES('','milos', 'bajic', 'milosbajic', 'milos', 'admin'");    
    //stmt.finalize();

    db.each("SELECT * FROM user", function (err, row) {
        if (err)
            console.error("select upit" + err);
        console.log(row.id + " " + row.firstName + " " + row.lastName + " " + row.username + " " + row.password + " " + row.role);
    });
});