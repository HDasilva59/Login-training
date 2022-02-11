import express from "express";
import cookie from "cookie";
import nunjucks from "nunjucks";
import { users } from "./data";

const app = express();
app.use(express.static("public"));

app.set("view engine", "njk");
nunjucks.configure("mordor", {
  autoescape: true,
  express: app,
});

const formParser = express.urlencoded({ extended: true });

app.get("/", (request, response) => {
  response.render("home-page");
});

app.post("/logtest", formParser, (request, response) => {
  for (let i = 0; i < users.length; i++) {
    if (request.body.username === users[i].ID && request.body.password === users[i].PSWD) {
      const randomcookie = Math.random() * (9999999999 - 1) + 1;
      users[i].cookie = randomcookie.toString();
      response.set(
        "Set-Cookie",
        cookie.serialize("LogInCookie", randomcookie.toString(), {
          maxAge: 3600,
        }),
      );
      response.render("Menu");
    } else {
      response.send("You failed my dude");
    }
  }
});

app.get("/Menu", (request, response) => {
  const cookies = cookie.parse(request.get("cookie") || "");
  for (let i = 0; i < users.length; i++) {
    if (cookies.LogInCookie === users[i].cookie) {
      response.render("Menu");
    } else {
      response.send("Your cookie timed out");
    }
  }
});

app.get("/disconnect", (request, response) => {
  response.set(
    "Set-Cookie",
    cookie.serialize("LogInCookie", "", {
      maxAge: 22,
    }),
  );
  response.render("home-page");
});

app.get("/register", (request, response) => {
  response.render("register");
});

app.post("/register-confirm", formParser, (request, response) => {
  if (request.body.username && request.body.password) {
    for (let i = 0; i < users.length; i++) {
      if (request.body.username === users[i].ID) {
        response.send("this username is already taken 3 best game ever btw");
      }
    }
    response.send("Well, actually we can't push in the database ");
  } else {
    response.send("You have to enter a username and a password");
  }
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
