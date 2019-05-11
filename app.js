
const express = require("express");
const app = express();
//const tester = require('./tester');

app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 3000;



app.get("/", (req, res) => {
    console.log("main page >> " + __dirname);
    res.sendFile(__dirname + "/public/main.html");
    // tester(2);

});

app.listen(port, () => {
    console.log(`Server running at port ` + port);
})