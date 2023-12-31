const express = require("express");
const http = require("node:http");
const app = express();
const server = http.createServer(app);
const data = require("./data.json");
const PORT = 5000;

app.use(express.static("public"));

app.use(express.json());
app.post("/checkout",(request,response) => {
    console.log(request.body);
    response.send({status: 199});
});

server.listen(PORT,function(error) {
    if (!error) console.log("Mousier it listen to http://localhost:" + PORT);
});
