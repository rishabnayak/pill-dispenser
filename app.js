const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.static(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);
app.get('/', (req, res) => {
  res.render('homepage.html');
});
app.get('/patients',(req,res) =>{
  res.render('patients.html');
});
io.on('connection',function(socket){
    var motorvalue = 0;
    socket.on('motor', function(data){
       lightvalue = data;
       if (lightvalue) {
           console.log(lightvalue)
       }
    });
});
http.listen(8080, () => {
console.log("View at localhost:8080");
});
