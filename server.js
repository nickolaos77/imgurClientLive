const express = require('express');

const app = express();

PORT         = process.env.PORT || 3000;

app.use(express.static(__dirname+ '/public'));

app.get("/", function(req,res){
  res.sendFile("index.html", {root: __dirname + '/public/'});
})

app.get('/auth/imgur/callback', function(req, res){
    
  res.sendFile("index.html", {root: __dirname + '/public/'});

})

app.listen(PORT, function portListener (){
  console.log('Server started at port: ' + PORT)
});



