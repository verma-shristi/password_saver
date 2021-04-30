const express = require("express");
const routes = express.Router();
const register = require('./model');
const paswrd = require('./model1');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const regidata = register.find({});
const passdata = paswrd.find({});
var Recaptcha = require('express-recaptcha').RecaptchaV3;
var recaptcha = new Recaptcha('6LeuzU0aAAAAAJ7GxqVx7RT9TS6jnhEmsZ6tJcnV', '6LeuzU0aAAAAAMDCreesAF90vYoSgzjP4evndIvs',{callback:'cb'});


// middleware for logout
const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyuser = jwt.verify(token, "heythisissecretkeywhichis32characterslongkey");
        const user = await register.findOne({ _id: verifyuser._id });
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.render("login", { message: "Login first" })
        console.log(error);
    }
}
// main page
routes.get("/main", (req, res) => {
    res.render("main", { message: "" })
})
//  showing all data
routes.get("/", auth, async (req, res) => {
    passdata.exec((err, data) => {
        if (err) {
            res.send("error while fething data")
            console.log(err);
        }
        res.render("index", { records: data, message: "", mess: req.flash('mess'), 'user': req.user });
    })

});
// inserting new data
routes.post("/", (req, res) => {
    const passwrddata = new paswrd({
        email: req.body.email,
        domain: req.body.domain,
        password: req.body.password
    });
    passwrddata.save((err, data) => {
        if (err) {
            res.render("index", { records: data, message: "Error while saving your data", mess: "" })
            console.log(err)
        }
        passdata.exec((err, data) => {
            if (err) {
                res.render("index", { records: data, message: "Error while saving your data", mess: "" })
                console.log(err)
            }
            res.render("index", { records: data, message: "Data Saved Successfully", mess: "" })
        })
    })
});
// deleting a data
routes.get('/delete/:id', (req, res) => {
    id = req.params.id;
    const dele = paswrd.findByIdAndDelete({ _id: id });
    dele.exec((err) => {
        if (err) {
            req.flash("mess", "error in deleting data")
            res.redirect("/")
            console.log(err);
        }

        req.flash("mess", "deleted successfully");
        res.redirect("/")
    })
});
// show updation form
routes.get("/edit/:id", (req, res) => {
    id = req.params.id;
    const update = paswrd.findById({ _id: id });
    update.exec((err, data) => {
        if (err) {
            res.redirect("/update")
            console.log(err);
        }
        res.render("update", { records: data, message: "" });
    })
});
// update user data
routes.post("/update", (req, res) => {
    id = req.body._id;
    const updte = paswrd.findByIdAndUpdate(id, {
        email: req.body.email,
        domain: req.body.domain,
        password: req.body.password
    });
    updte.exec((err, data) => {
        if (err) {
            req.flash("mess", "error in updating data")
            console.log();
        }
        req.flash("mess", "data updated successfully data")
        res.redirect("/")
    })

});
// login route
routes.get("/login", recaptcha.middleware.render,(req, res) => {
    res.render("login", { message: "" ,captcha:res.captcha});
});
// login a user
routes.post("/login",recaptcha.middleware.verify, async (req, res) => {
   if(!req.recaptcha.error){
    try {
        email = req.body.email;
        password = req.body.password;
        const userdata = await register.findOne({ email: email });
        const isMatch = bcrypt.compare(password, userdata.password);
        const token = await userdata.generateAuthToken();

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 3000000),
            httpOnly: true
        });
        if (isMatch) {
            res.redirect("/")
        } else {
            res.render("login", { message: "Invalid login details" });
            console.log(err)
        }
    } catch (error) {
        res.render("login", { message: "Invalid login details" });
        console.log("error occured" + error)
    }
}
    else{
        console.log("error while verifying captcha")
    }

});
// register route
routes.get("/register", (req, res) => {
    res.render("register");
});
// registering a user
routes.post("/register", async (req, res) => {
    var registerData = new register({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    email = req.body.email;
    const token = await registerData.generateAuthToken();
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + 3000000),
        httpOnly: true
    });
    // const data = await registerData.findOne({email:email});
    // if(!data)
    registerData.save((err) => {
        if (err) {
            res.send("error while registering,please try again");
            console.log(err);
        }
        else
            res.render("login", { message: "" });
    });
    // else{
    //     console.log("email is already registered!login to continue");
    // }
   

});
// logout route
routes.get("/logout", async (req, res) => {
    try {
        res.clearCookie("jwt");
        console.log("logout successfully");
        // await req.user.save();
        res.render("login", { message: "logged out Successfully" });
    } catch (error) {
        req.flash("mess", "error in logging out")
        res.redirect("/")
        console.log(error)
    }

})
module.exports = routes;