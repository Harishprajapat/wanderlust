const express = require("express");
const app = express();
const session = require("express-session");

app.use(session({secret: "mynameisharish"}));


app.get("/test" , (req, res)=>{
    res.send("test verify");
});

app.listen(3000, ()=>{
    console.log("server is listening to 3000");
});