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
function runservo1() {
  bus.writeByteSync(addr, 0, 0x20);
  bus.writeByteSync(addr, 0xfe, 0x1e);
  sleep.sleep(1);
  bus.writeWordSync(addr, 0x06, 0);
  sleep.sleep(1);
  bus.writeWordSync(addr, 0x08, 1250);
}
function runservo2() {
  bus.writeByteSync(addr, 0, 0x20);
  bus.writeByteSync(addr, 0xfe, 0x1e);
  sleep.sleep(1);
  bus.writeWordSync(addr,0x0A,0);
  sleep.sleep(1);
  bus.writeWordSync(addr, 0x0C, 1250);
}
function runservo3() {
  bus.writeByteSync(addr, 0, 0x20);
  bus.writeByteSync(addr, 0xfe, 0x1e);
  sleep.sleep(1);
  bus.writeWordSync(addr,0x0E,0);
  sleep.sleep(1);
  bus.writeWordSync(addr, 0x10, 1250);
}
io.on('connection',function(socket){
    socket.on('setup',function(data){
      global.data = data;
        handledata();
  });
  socket.on('buttonpress',function(){
    clearTimeout(global.timer)
    console.log("ButtonPress Received");
            for (var k = 0; k < global.count1; k++) {
              runservo1();
            }
            for (var l = 0; l < global.count2; l++) {
              runservo2();
            }
            for (var m = 0; m < global.count3; m++) {
              runservo3();
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
  var time = (hour<=9?"0"+hour:hour)+":"+(minutes<=9?"0"+minutes:minutes);
  for (var i in data){
    console.log(`checking i=${i}, day=${day}`)
    if (i == day){
      for (var j in data[i]){
        console.log(`checking j=${j}, time=${time}`)
        if (j == time){
          io.emit('alert',"Time to take your Pills!");
          global.count1 = data[i][j][0];
          global.count2 = data[i][j][1];
          global.count3 = data[i][j][2];
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
