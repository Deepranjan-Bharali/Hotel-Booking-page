const express= require("express");
const router = express.Router();
const User = require("../routes/user.js");

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});

router.get("/signup", async(req,res)=>{
    let{username,email,password,} =req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.flash("success","Welcome to Wanderlust");
    res.redirect("/listings");
});

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
})

module.exports = router;