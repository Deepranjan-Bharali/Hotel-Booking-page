const express= require("express");
const router = express.Router();
const app= express();
const mongoose= require ("mongoose");
const Listing= require("./models/listings.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const bodyParser = require('body-parser');

const userRouter = require("./routes/user.js");


const dburl= process.env.ATLASDB_URL;

main()
 .then(()=> {
    console.log("connected to DB");
 })
  .catch((err)=>{
    console.log(err);
  });

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", userRouter);

const store = MongoStore.create({
  mongoUrl: dburl,
});

// Index Route
app.get("/listings", async (req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});
});

//New Route
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async(req,res)=>{
  let {id}= req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", {listing});
});

// Create Route
app.post("/listings", async(req,res)=>{
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// Edit Route
app.get("/listings/:id/edit",(req,res)=>{
  // let {id}= req.params;
  // const listing = await Listing.findById(id);
  res.render("users/book.ejs");
});

// Update Route
app.put("/listings/:id", async (req,res)=>{
  let {id}= req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
});

// Delete Route
app.delete("/listings/:id", async (req,res)=>{
  let {id}= req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080")
});
