const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const i2cbus = require('i2c-bus');
const sleep = require('sleep');
const bus = i2cbus.openSync(1);
const addr = 0x40;
bus.writeByteSync(addr, 0, 0x20);
bus.writeByteSync(addr, 0xfe, 0x1e);
app.use(express.static(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);
app.get('/', (req, res) => {
  res.render('homepage.html');
});
function runservo1() {
  bus.writeWordSync(addr, 0x06, 0);
  sleep.sleep(1);
  bus.writeWordSync(addr, 0x08, 836);
}
function runservo2() {
  bus.writeWordSync(addr,0x0A,0);
  sleep.sleep(1);
  bus.writeWordSync(addr, 0x0C, 836);
}
function runservo3() {
  bus.writeWordSync(addr,0x0E,0);
  sleep.sleep(1);
  bus.writeWordSync(addr, 0x10, 836);
}
io.on('connection',function(socket){
    socket.on('setup',function(data){
      global.data = data;
        handledata();
  });
  socket.on('buttonpress',function(){
    clearTimeout(global.timer)
    var data = global.data;
    var date = new Date();
    var day = date.getDay();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var time = hour+":"+minutes;
    for (var i in data){
      if (i == day){
        for (var j in data[i]){
          if (j == time){
            var count1 = data[i][j][0];
            var count2 = data[i][j][1];
            var count3 = data[i][j][2];
            for (var k = 0; k < count1; k++) {
              runservo1();
            }
            for (var l = 0; l < count2; l++) {
              runservo2();
            }
            for (var m = 0; m < count2; m++) {
              runservo3();
            }
          }
        }
      }
    }
  });
});
http.listen(8080, () => {
console.log("View at localhost:8080");
});

function handledata() {
  if(!global.data) return;
  var data = global.data;
  var date = new Date();
  var day = date.getDay();
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var time = hour+":"+minutes;
  for (var i in data){
    if (i == day){
      for (var j in data[i]){
        if (j == time){
          io.emit('alert',"Time to take your Pills!");
          global.timer = setTimeout(function(){
            io.emit('alert',"Second Alert!");
            // additional actions here
          }, 600000);
        }
      }
    }
  }
};

setInterval(handledata, 60000);
