var serialport = require('serialport')
var w = require('./');

var changes = w();
var open = false;

changes.on('data',function(data){


  console.log(data.device.pnpId);
  return;

  if(data.event == "plug" && !open){
    open = true;
    serialConnect(data.device.comName,function(err,con){
      if(err) throw err;
      console.log('connected! to ');
      con.on('data',function(data){
        console.log(data+'')
      });
    })
  }
});

function serialConnect(com,cb){
  var serialPort = new serialport.SerialPort(com, {
    baudrate: 115200
  });
  serialPort.on('open',function(err){
    if(err) return cb(err);
    cb(false,serialPort);
  });
}



