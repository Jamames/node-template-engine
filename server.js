import express from "express"
import { engine } from "express-handlebars"
import db from "./services/db.js"

import bodyParser from 'body-parser'
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));

/*
  Det här gör att alla filer i mappen public skickas till webbläsaren om den ber om det.
  Om webbläsaren frågar efter t.ex. 
  /style.css 
  så kommer Express skicka 
  /public/style.css
*/
app.use(express.static("public"))

// Sätter upp handlebars som template engine.
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./views") //Talar om att alla mallar/templates/vyer ligger i mappen views.

app.get("/", (req, res) => {
  res.render("home") //Säger att vyn home ska användas och resultatet skickas som svar.
})

app.get("/users", async (req, res) => {
  const posts = await db.getUsers() // Hämtar alla users ur databasen

  //Säger att vyn users ska användas och man sickar med
  //ett objekt som har en egenskap, "users", som är en array med alla users.
  //Det objektet kan användas av mallen/templaten/vyn.
  res.render("guestbook", { posts })
})

app.get("guestbook", async (req, res) => {
  const name = req.query.name
  const comment = await db.getPostsByUserId(name)
  res.render("guestbook", { name, comment })
})

app.post("/add-post", async (req, res) => {
  //res.render("guestbook", { name, comment })
  console.log(req.body)

  // Gör INSERT i DB här
  db.insertIntoGuestbook(req.body.name, req.body.email, req.body.comment)

  res.send("ok")
  
})



const port = 3000
app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})

