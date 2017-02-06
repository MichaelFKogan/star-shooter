
// Dependencies
// =============================================================
var express = require('express');
var path = require('path');


// Sets up the Express app
// =============================================================
var app = express();
var PORT = 7000;



// Routes
// =============================================================
//GET
// ===========================================================


//Need to remove this to take advantage of the routes in the routes.js file. 
app.use(express.static(path.join(__dirname, '')));

    //Handles a user's first visit to the page
    app.get("/", function(req, res){
        res.sendFile(path.resolve("./index.html"));
    });

//LISTEN
// ===========================================================
// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log('app listening on PORT ' + PORT);
});




