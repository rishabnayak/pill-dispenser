const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const exec = require('child_process');
const twilio = require('twilio');
var accountSid = 'ACdd65586c5595dd1f65f4c316f902d5ed'; // Your Account SID from www.twilio.com/console
var authToken = 'df8980cd3531fd0e6d4b51ff54ae2eca';
var client = new twilio(accountSid, authToken);
app.use(express.static(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);
app.get('/', (req, res) => {
  res.render('homepage.html');
});
function runservo1() {
  exec.exec("python x.py");
  return;
}
function runservo2() {
  exec.exec("python y.py");
  return;
}
function runservo3() {
  exec.exec("python z.py");
  return;
}
function alert1(){
    global.alert1 = exec.spawn('python', ['buz.py']);
    return;
}
function alert2(){
    global.alert2 = exec.spawn('python', ['buz1.py']);
    return;
}
io.on('connection',function(socket){
    socket.on('setup',function(data){
      global.data = data;
        handledata();
  });
  socket.on('buttonpress',function(){
    clearTimeout(global.alerttimer)
    for (var k = 0; k < global.count1; k++) {
      setTimeout(_ => runservo1(), 1000*k);
    }
    for (var l = 0; l < global.count2; l++) {
      setTimeout(_ => runservo2(), 1000*l);
    }
    for (var m = 0; m < global.count3; m++) {
      setTimeout(_ => runservo3(), 1000*m);
    }
    client.messages.create({
    body: 'Pills Taken!',
    to: '+18573641410',  // Text this number
    from: '+16175805493' // From a valid Twilio number
    })
    if (global.alert1){
      global.alert1.kill();
    }
    if (global.alert2){
      global.alert2.kill();
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
    if (i == day){
      for (var j in data[i]){
        if (j == time){
          io.emit('alert',"Time to take your Pills!");
          alert1();
          global.count1 = data[i][j]["0"];
          global.count2 = data[i][j]["1"];
          global.count3 = data[i][j]["2"];
          global.alerttimer = setTimeout(function(){
            io.emit('alert',"Second Alert!");
            alert2();
            // additional actions here
          }, 600000);
          global.finaltimer = setTimeout(function(){
            client.messages.create({
            body: 'Pills Not Taken!',
            to: '+18573641410',  // Text this number
            from: '+16175805493' // From a valid Twilio number
            })
          }, 720000);
        }
      }
    }
  }
};

setInterval(handledata, 60000);
