const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const i2cbus = require('i2c-bus');
const sleep = require('sleep');
const bus = i2cbus.openSync(1);
const addr = 0x40;
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
       if (lightvalue = 1) {
           bus.writeByteSync(addr, 0, 0x20);
           bus.writeByteSync(addr, 0xfe, 0x1e);
           bus.writeWordSync(addr, 0x06, 0);
           bus.writeWordSync(addr, 0x08, 1250);
           sleep.sleep(1);
           bus.writeWordSync(addr, 0x08, 836);
           sleep.sleep(1);
           bus.writeWordSync(addr, 0x08, 1664);
       }
    });
});
http.listen(8080, () => {
console.log("View at localhost:8080");
});
