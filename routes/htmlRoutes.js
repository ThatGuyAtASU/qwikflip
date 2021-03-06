var db = require("../models");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {

  // app.get("/members/category/:category", isAuthenticated, function (req, res) {
  //   if (req.user) {
  //     db.Item.findAll({ include: [db.User], where: req.params }).then(function (data) {
  //       res.render("members", {
  //         items: data
  //       });
  //     });
  //   }
  // })
  // Load index page
  app.get("/", function (req, res) {

    if (req.user) {
      res.redirect("/members");
    } else {
      db.Item.findAll({ include: [db.User], order: [["id", "DESC"]] }).then(function (data) {
        res.render("index", {
          items: data
        });
      });
    }

  });

  app.get("/message/:id", function (req, res) {
    if (req.user) {
      db.Item.findOne({ include: [db.User], where: req.params }).then(function (data) {
        var emailData = {
          subject: data.name,
          fromEmail: req.user.email,
          toEmail: data.User.email
        }

        res.render("message", emailData);

      }).catch(err => res.json(err));

    } else {
      res.redirect("/login");
    }


  });

  app.get("/signup", function (req, res) {
    res.render("register");

  });

  app.get("/login", function (req, res) {
    // res.sendfile("public/html/login.html");
    if (req.user) {
      res.redirect("/members");
    }
    res.render("login");
  });

  app.get("/items/update/:id", function (req, res) {
    db.Item.findOne({ include: [db.User], where: req.params }).then(function (data) {
      if (req.user.id === data.dataValues.UserId) {
        res.render("updateItem", data.dataValues);
      } else {
        res.redirect("/");
      }


    }).catch();
  })

  // Load singleitem page and pass in an item by id
  app.get("/items/:id", function (req, res) {
    db.Item.findOne({ include: [db.User], where: { id: req.params.id } }).then(function (data) {
      res.render("singleItem", data.dataValues);
      console.log(data.dataValues);
    });
  });

  app.get("/logout", function (req, res) {
    // req.logout();
    res.redirect("/");
  })


  app.get("/members", isAuthenticated, function (req, res) {
    if (req.user) {
      db.Item.findAll({ include: [db.User], order: [["id", "DESC"]] }).then(function (data) {
        res.render("members", {
          items: data
        });
      });


    } else {
      res.redirect("/login");
    }
  })
  


  app.get("/members/account", function (req, res) {

    if (req.user) {
      db.User.findOne({ where: { id: req.user.id } }).then(function (result) {

        db.Item.findAll({ include: [db.User], where: { UserId: req.user.id } }).then(function (data) {
          console.log("DATA:  " + data);
          console.log("RESULT:  " + result);
          res.render("account", {
            items: data,
            user: result
          })
        });

      }).catch(err => res.json(err))

    } else {
      res.redirect("/login");
    }



  });



  app.get("/category/:category", function (req, res) {
    if(req.user){
      console.log("if")
      db.Item.findAll({ include: [db.User], where: req.params }).then(function (data) {
        res.render("members", {
          items: data
        })
    });
  }else{
    console.log("else")
      db.Item.findAll({ include: [db.User], where: req.params }).then(function (data) {
      res.render("index", {
        items: data
      });
    });
    }
    
  });

    app.get("/newitem", function (req, res) {
      if (req.user) {
        res.render("postItem", { UserId: req.user.id });

      } else {
        res.redirect("/login");
      }

    })



    // Render 404 page for any unmatched routes
    app.get("*", function (req, res) {
      res.render("404");
    });




  };
